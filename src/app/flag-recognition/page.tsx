"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { validateFlagFormat, type ValidateFlagFormatInput, type ValidateFlagFormatOutput } from '@/ai/flows/flag-recognition-agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Changed from Textarea for single line input
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Flag, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

const exampleFlags = [
  "flag{th1s_is_4_s4mpl3_fl4g}",
  "CTF{an0th3r_ExAmPl3_F0Rm4T}",
  "FLAG:SIMPLE_TEXT_FLAG_123",
  "NotAFlagString",
];

export default function FlagRecognitionPage() {
  const [potentialFlagInput, setPotentialFlagInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidateFlagFormatOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    if (!potentialFlagInput.trim()) {
      setError("Potential flag input cannot be empty.");
      setIsLoading(false);
      toast({
        title: "Input Error",
        description: "Please enter a potential flag string.",
        variant: "destructive",
      });
      return;
    }

    try {
      const input: ValidateFlagFormatInput = { potentialFlag: potentialFlagInput };
      const result = await validateFlagFormat(input);
      setValidationResult(result);
      toast({
        title: "Validation Complete",
        description: `Flag format ${result.isValidFlagFormat ? 'seems valid' : 'seems invalid'}.`,
        className: result.isValidFlagFormat ? "bg-primary text-primary-foreground border-primary" : "border-yellow-500",
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMsg);
      toast({
        title: "Error Validating",
        description: `Failed to validate flag: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExample = () => {
    const randomFlag = exampleFlags[Math.floor(Math.random() * exampleFlags.length)];
    setPotentialFlagInput(randomFlag);
     toast({
      title: "Example Loaded",
      description: `Example flag "${randomFlag}" loaded.`,
    });
  };
  
  useEffect(() => {
    toast({
      title: "Flag Recognition Agent",
      description: "Enter a string to check if it matches common CTF flag formats.",
    });
  }, [toast]);

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Flag Recognition Agent"
        description="Input a potential flag string. The AI will analyze its format and provide a confidence score on whether it's a valid CTF flag."
        icon={Flag}
      />

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="potentialFlag" className="block text-sm font-medium text-foreground">
                  Potential Flag String
                </Label>
                <Button type="button" variant="link" size="sm" onClick={handleUseExample} className="text-primary p-0 h-auto">
                  Use Example
                </Button>
              </div>
              <Input
                id="potentialFlag"
                type="text"
                value={potentialFlagInput}
                onChange={(e) => setPotentialFlagInput(e.target.value)}
                placeholder="e.g., flag{...}, CTF{...}, FLAG:..."
                className="font-mono bg-input border-border focus:ring-primary text-sm"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Enter any string you suspect might be a flag.
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Flag className="mr-2 h-5 w-5" />}
              Validate Flag Format
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
      
      {isLoading && !validationResult && (
         <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary animate-pulse">
                <Flag className="h-6 w-6" />
                Validating...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">AI is analyzing the string. Please wait.</p>
            </CardContent>
         </Card>
      )}

      {validationResult && !isLoading && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValidFlagFormat ? 
                <CheckCircle2 className="h-6 w-6 text-green-500" /> : 
                <XCircle className="h-6 w-6 text-red-500" />
              }
              Validation Result
            </CardTitle>
            <CardDescription>Analysis of the provided string: <span className="font-mono text-primary">{potentialFlagInput}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Is Valid Flag Format?</Label>
              <p className={`text-lg font-semibold ${validationResult.isValidFlagFormat ? 'text-green-400' : 'text-red-400'}`}>
                {validationResult.isValidFlagFormat ? 'Likely a Valid Format' : 'Likely Not a Valid Format'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Confidence Score</Label>
              <Progress value={validationResult.confidenceScore * 100} className="w-full h-3 mt-1" />
              <p className="text-lg font-semibold text-primary mt-1">
                {(validationResult.confidenceScore * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">
                This score indicates the AI's confidence that the string matches a typical CTF flag pattern.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
