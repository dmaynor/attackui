"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { summarizeReconnaissanceResults, type SummarizeReconnaissanceResultsInput } from '@/ai/flows/reconnaissance-agent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/common/PageHeader';
import { TerminalOutput } from '@/components/common/TerminalOutput';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ScanLine, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from '@/components/ui/card';

const exampleNmapOutput = `
# Nmap 7.92 scan initiated Mon Jul 22 10:00:00 2024 as: nmap -A -T4 target.example.com
Nmap scan report for target.example.com (192.168.1.101)
Host is up (0.0020s latency).
Not shown: 996 closed tcp ports (reset)
PORT    STATE SERVICE  VERSION
21/tcp  open  ftp      vsftpd 3.0.3
22/tcp  open  ssh      OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
443/tcp open  ssl/http Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
| ssl-cert: Subject: commonName=target.example.com
| Issuer: commonName=target.example.com
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-01-01T00:00:00
|_Not valid after:  2025-01-01T00:00:00
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

# Nmap done at Mon Jul 22 10:00:30 2024 -- 1 IP address (1 host up) scanned in 30.00 seconds
`;

export default function ReconnaissancePage() {
  const [scanResultsInput, setScanResultsInput] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSummary('');

    if (!scanResultsInput.trim()) {
      setError("Scan results cannot be empty.");
      setIsLoading(false);
      toast({
        title: "Input Error",
        description: "Please provide Nmap scan results.",
        variant: "destructive",
      });
      return;
    }

    try {
      const input: SummarizeReconnaissanceResultsInput = { scanResults: scanResultsInput };
      const result = await summarizeReconnaissanceResults(input);
      setSummary(result.summary);
      toast({
        title: "Reconnaissance Complete",
        description: "Summary generated successfully.",
        className: "bg-primary text-primary-foreground border-primary",
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMsg);
      toast({
        title: "Error Summarizing",
        description: `Failed to summarize results: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExample = () => {
    setScanResultsInput(exampleNmapOutput.trim());
    toast({
      title: "Example Loaded",
      description: "Example Nmap output has been loaded into the textarea.",
    });
  };
  
  // Client-side effect to show initial toast for guidance.
  useEffect(() => {
    toast({
      title: "Reconnaissance Agent",
      description: "Paste Nmap output or use the example to get started.",
    });
  }, [toast]);


  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Reconnaissance Agent"
        description="Input Nmap scan results to get an AI-generated summary of open ports, services, and potential attack vectors."
        icon={ScanLine}
      />

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="scanResults" className="block text-sm font-medium text-foreground">
                  Nmap Scan Results
                </Label>
                <Button type="button" variant="link" size="sm" onClick={handleUseExample} className="text-primary p-0 h-auto">
                  Use Example Output
                </Button>
              </div>
              <Textarea
                id="scanResults"
                value={scanResultsInput}
                onChange={(e) => setScanResultsInput(e.target.value)}
                placeholder="Paste Nmap text output here... (e.g., from 'nmap -A -T4 <target>')"
                rows={12}
                className="font-mono bg-input border-border focus:ring-primary text-sm"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Provide raw text output from Nmap. The more detailed the scan (e.g., using -A for OS/version detection), the better the summary.
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <ScanLine className="mr-2 h-5 w-5" />}
              Summarize Results
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6 animate-shake">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Processing Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && !summary && (
         <TerminalOutput 
            title="Processing Scan Data..." 
            content="AI is analyzing the Nmap results. Please wait..." 
            className="mt-6"
            contentClassName="text-primary animate-pulse"
          />
      )}

      {summary && !isLoading && (
        <TerminalOutput title="Reconnaissance Summary" content={summary} className="mt-6" />
      )}
    </div>
  );
}
