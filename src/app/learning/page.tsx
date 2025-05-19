"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { recommendEffectiveTechniques, type RecommendEffectiveTechniquesInput, type RecommendEffectiveTechniquesOutput } from '@/ai/flows/learning-agent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/common/PageHeader';
import { TerminalOutput } from '@/components/common/TerminalOutput';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Brain, AlertTriangle, Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const exampleChallengeLogs = `
Challenge: WebLogon
Type: SQL Injection
Log:
- Attempted ' OR 1=1 -- ; Result: Failure (WAF Block)
- Attempted admin' OR '1'='1; Result: Success, bypassed login. Found flag{sqli_master_101}
- Tools used: SQLMap with --tamper=space2comment.

Challenge: FileShare
Type: Directory Traversal
Log:
- Tried /../../../../etc/passwd; Result: Success. Leaked passwd file.
- Tried /../../boot.ini; Result: Failure (Windows system, path incorrect)
- Note: Application running on Linux. Standard LFI payloads effective.

Challenge: APIFun
Type: Broken Object Level Authorization (BOLA)
Log:
- Accessed /api/v1/users/123 (own ID); Result: Success
- Accessed /api/v1/users/1 (admin ID); Result: Success, retrieved admin data.
- Key: Simply changing user ID in request URL. No complex tools needed.
`;

const exampleVulnerabilityType = "SQL Injection";


export default function LearningPage() {
  const [challengeLogsInput, setChallengeLogsInput] = useState('');
  const [vulnerabilityTypeInput, setVulnerabilityTypeInput] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendEffectiveTechniquesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    if (!vulnerabilityTypeInput.trim()) {
      setError("Vulnerability type cannot be empty.");
      setIsLoading(false);
      toast({
        title: "Input Error",
        description: "Please specify the vulnerability type.",
        variant: "destructive",
      });
      return;
    }
    // Challenge logs can be empty, AI will provide general advice

    try {
      const input: RecommendEffectiveTechniquesInput = { 
        challengeLogs: challengeLogsInput, 
        vulnerabilityType: vulnerabilityTypeInput 
      };
      const result = await recommendEffectiveTechniques(input);
      setRecommendations(result);
      toast({
        title: "Recommendations Ready",
        description: "AI has generated techniques and rationale.",
        className: "bg-primary text-primary-foreground border-primary",
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMsg);
      toast({
        title: "Error Generating Advice",
        description: `Failed to get recommendations: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExample = () => {
    setChallengeLogsInput(exampleChallengeLogs.trim());
    setVulnerabilityTypeInput(exampleVulnerabilityType);
     toast({
      title: "Example Loaded",
      description: "Example logs and vulnerability type have been loaded.",
    });
  };

  useEffect(() => {
    toast({
      title: "Learning Agent",
      description: "Get AI-driven advice based on past CTF logs and vulnerability types.",
    });
  }, [toast]);

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Learning Center Agent"
        description="Analyze logs from previous CTF challenges and specify a vulnerability type. The AI will recommend effective techniques and tools."
        icon={Brain}
      />

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="vulnerabilityType" className="block text-sm font-medium text-foreground">
                  Vulnerability Type <span className="text-destructive">*</span>
                </Label>
                <Button type="button" variant="link" size="sm" onClick={handleUseExample} className="text-primary p-0 h-auto">
                  Use Example Data
                </Button>
              </div>
              <Input
                id="vulnerabilityType"
                value={vulnerabilityTypeInput}
                onChange={(e) => setVulnerabilityTypeInput(e.target.value)}
                placeholder="e.g., SQL Injection, XSS, Directory Traversal"
                className="bg-input border-border focus:ring-primary text-sm"
                disabled={isLoading}
                required
              />
               <p className="mt-2 text-xs text-muted-foreground">
                Specify the type of vulnerability you are targeting.
              </p>
            </div>

            <div>
              <Label htmlFor="challengeLogs" className="block text-sm font-medium text-foreground mb-1">
                Previous CTF Challenge Logs (Optional)
              </Label>
              <Textarea
                id="challengeLogs"
                value={challengeLogsInput}
                onChange={(e) => setChallengeLogsInput(e.target.value)}
                placeholder="Paste logs from previous challenges, including attempted techniques and outcomes. If empty, general advice will be provided."
                rows={10}
                className="font-mono bg-input border-border focus:ring-primary text-sm"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                The more detailed the logs, the more specific the AI's recommendations.
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Lightbulb className="mr-2 h-5 w-5" />}
              Get Recommendations
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

      {isLoading && !recommendations && (
         <TerminalOutput 
            title="Generating Insights..." 
            content="AI is analyzing data and crafting recommendations. Please wait..."
            className="mt-6"
            contentClassName="text-primary animate-pulse"
          />
      )}

      {recommendations && !isLoading && (
        <div className="mt-8 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-6 w-6" />
                Recommended Techniques & Tools
              </CardTitle>
              <CardDescription>
                For vulnerability type: <span className="font-semibold text-foreground">{vulnerabilityTypeInput}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap p-4 bg-muted/50 rounded-md text-sm font-mono text-foreground leading-relaxed">
                {recommendations.recommendedTechniques}
              </pre>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Brain className="h-6 w-6" />
                Rationale
              </CardTitle>
              <CardDescription>
                Explanation of why these techniques are effective.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <pre className="whitespace-pre-wrap p-4 bg-muted/50 rounded-md text-sm font-mono text-foreground leading-relaxed">
                {recommendations.rationale}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
