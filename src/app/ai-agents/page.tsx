
"use client";

import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, User, ScanLine, ShieldAlert, Bomb, KeyRound, Flag, Brain, Send, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TerminalOutput } from '@/components/common/TerminalOutput';

// Import AI Flow Functions
import { summarizeReconnaissanceResults, type SummarizeReconnaissanceResultsInput, type SummarizeReconnaissanceResultsOutput } from '@/ai/flows/reconnaissance-agent';
import { prioritizeVulnerabilities, type PrioritizeVulnerabilitiesInput, type PrioritizeVulnerabilitiesOutput } from '@/ai/flows/vulnerability-assessment-agent';
import { validateFlagFormat, type ValidateFlagFormatInput, type ValidateFlagFormatOutput } from '@/ai/flows/flag-recognition-agent';
import { recommendEffectiveTechniques, type RecommendEffectiveTechniquesInput, type RecommendEffectiveTechniquesOutput } from '@/ai/flows/learning-agent';

type AgentId = 'reconAgent' | 'vulnAssessAgent' | 'exploitAgent' | 'privEscAgent' | 'flagRecAgent' | 'learningAgent';

interface Agent {
  id: AgentId;
  name: string;
  mentionTag: string;
  description: string;
  avatarIcon: React.ElementType;
  colorClass: string;
  inputHint?: string; // Hint for expected input format
  aiHandler?: (task: string) => Promise<React.ReactNode>; // Function to call the actual AI
}

interface ChatMessage {
  id: string;
  sender: 'user' | AgentId | 'system';
  text: string | React.ReactNode;
  timestamp: Date;
  agentName?: string;
  isTyping?: boolean;
}

export default function AIAgentsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentProcessing, setIsAgentProcessing] = useState<AgentId | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const AVAILABLE_AGENTS: Agent[] = [
    { 
      id: 'reconAgent', name: 'Recon Agent', mentionTag: '@recon', description: 'Performs Nmap scans and summarizes results.', avatarIcon: ScanLine, colorClass: 'text-sky-400',
      inputHint: '<Nmap scan output>',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Nmap scan output is required for @recon agent.");
        const result: SummarizeReconnaissanceResultsOutput = await summarizeReconnaissanceResults({ scanResults: task });
        return <TerminalOutput title="Reconnaissance Summary" content={result.summary} className="mt-0 shadow-none border-none" />;
      }
    },
    { 
      id: 'vulnAssessAgent', name: 'Vuln Assess Agent', mentionTag: '@vuln', description: 'Identifies and prioritizes vulnerabilities.', avatarIcon: ShieldAlert, colorClass: 'text-orange-400',
      inputHint: '<Vulnerability list/data>',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Vulnerability data is required for @vuln agent.");
        const result: PrioritizeVulnerabilitiesOutput = await prioritizeVulnerabilities({ vulnerabilityData: task });
        return (
          <div>
            <p className="font-semibold mb-1">Vulnerability Prioritization Report:</p>
            {result.prioritizedVulnerabilities.length > 0 ? (
              <ul className="list-disc pl-5 text-xs space-y-1">
                {result.prioritizedVulnerabilities.map((v, i) => (
                  <li key={i}>
                    <strong>{v.vulnerability}</strong> (Score: {v.riskScore.toFixed(1)}) - {v.explanation}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No vulnerabilities prioritized or data was insufficient.</p>
            )}
          </div>
        );
      }
    },
    { 
      id: 'exploitAgent', name: 'Exploit Agent', mentionTag: '@exploit', description: 'Attempts to exploit vulnerabilities (Simulated).', avatarIcon: Bomb, colorClass: 'text-red-400',
      inputHint: '<Target vulnerability details>',
      aiHandler: async (task) => {
         return (
            <div>
              <p>Task received for Exploit Agent: <span className="font-semibold">"{task}"</span></p>
              <p className="text-xs mt-1 text-muted-foreground">
                (AI Functionality Not Implemented) The Exploit Agent's AI capabilities are under development. 
                For simulated exploits, please visit the <NextLink href="/exploitation" className="underline text-primary hover:text-primary/80">Exploitation page</NextLink>.
              </p>
            </div>
          );
      }
    },
    { 
      id: 'privEscAgent', name: 'PrivEsc Agent', mentionTag: '@privesc', description: 'Attempts privilege escalation (Simulated).', avatarIcon: KeyRound, colorClass: 'text-yellow-400',
      inputHint: '<System information/context>',
      aiHandler: async (task) => {
        return (
            <div>
              <p>Task received for PrivEsc Agent: <span className="font-semibold">"{task}"</span></p>
              <p className="text-xs mt-1 text-muted-foreground">
                (AI Functionality Not Implemented) The PrivEsc Agent's AI capabilities are under development. 
                For simulated privilege escalation, please visit the <NextLink href="/privilege-escalation" className="underline text-primary hover:text-primary/80">Privilege Escalation page</NextLink>.
              </p>
            </div>
          );
      }
    },
    { 
      id: 'flagRecAgent', name: 'Flag Rec Agent', mentionTag: '@flag', description: 'Recognizes and validates CTF flags.', avatarIcon: Flag, colorClass: 'text-purple-400',
      inputHint: '<Potential flag string>',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("A potential flag string is required for @flag agent.");
        const result: ValidateFlagFormatOutput = await validateFlagFormat({ potentialFlag: task });
        return (
          <div>
            <p>Flag: <span className="font-mono">{task}</span></p>
            <p>Is Valid Format: {result.isValidFlagFormat ? 'Yes' : 'No'}</p>
            <p>Confidence: {(result.confidenceScore * 100).toFixed(0)}%</p>
          </div>
        );
      }
    },
    { 
      id: 'learningAgent', name: 'Learning Agent', mentionTag: '@learn', description: 'Provides insights from past CTF challenges.', avatarIcon: Brain, colorClass: 'text-teal-400',
      inputHint: '<vulnerability_type> <challenge_logs (optional)>',
      aiHandler: async (task) => {
        const taskParts = task.trim().split(/\s+/);
        if (taskParts.length === 0 || !taskParts[0]) {
          throw new Error("Vulnerability type is required for @learn agent. Usage: @learn <vulnerability_type> [challenge_logs]");
        }
        const vulnerabilityType = taskParts[0];
        const challengeLogs = taskParts.slice(1).join(' ');
        
        const input: RecommendEffectiveTechniquesInput = { vulnerabilityType, challengeLogs: challengeLogs || "" };
        const result: RecommendEffectiveTechniquesOutput = await recommendEffectiveTechniques(input);
        return (
          <div className="text-xs">
            <p className="font-semibold mb-1">Recommendations for {vulnerabilityType}:</p>
            <p className="font-semibold mt-2">Techniques:</p>
            <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.recommendedTechniques}</pre>
            <p className="font-semibold mt-2">Rationale:</p>
            <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.rationale}</pre>
          </div>
        );
      }
    },
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  
  useEffect(() => {
    setMessages([
      {
        id: 'system-welcome',
        sender: 'system',
        text: (
          <div>
            <p>Welcome to the AI Agents Hub! Task agents using their @mention tag and providing the required input.</p>
            <Card className="mt-3">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Available Agents:</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1">
                {AVAILABLE_AGENTS.map(agent => (
                  <div key={agent.id} className="flex items-start gap-1">
                    <agent.avatarIcon className={cn("h-3 w-3 mt-0.5 shrink-0", agent.colorClass)} /> 
                    <div>
                      <span className="font-semibold">{agent.mentionTag}</span>
                      <span className="text-muted-foreground ml-1 truncate text-xs">{agent.description}</span>
                      {agent.inputHint && <p className="text-xs text-primary/70">Hint: {agent.mentionTag} {agent.inputHint}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ),
        timestamp: new Date(),
      }
    ]);
    inputRef.current?.focus();
  }, []);


  const handleSendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmedInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const mentionMatch = trimmedInput.match(/^(@[a-zA-Z0-9_]+)\s*(.*)/);
    if (mentionMatch) {
      const mentionTag = mentionMatch[1];
      const task = mentionMatch[2] || "";
      const agent = AVAILABLE_AGENTS.find(a => a.mentionTag === mentionTag);

      if (agent) {
        setIsAgentProcessing(agent.id);
        const agentWorkingMessageId = `agent-working-${Date.now()}`;
        const agentWorkingMessage: ChatMessage = {
          id: agentWorkingMessageId,
          sender: agent.id,
          agentName: agent.name,
          text: `Understood! Working on task for ${agent.name}...`,
          timestamp: new Date(),
          isTyping: true,
        };
        setMessages(prev => [...prev, agentWorkingMessage]);

        try {
          if (agent.aiHandler) {
            const aiResponse = await agent.aiHandler(task);
            setMessages(prev => prev.map(msg => 
              msg.id === agentWorkingMessageId ? {...msg, isTyping: false, text: "Processing complete. Here's the result:" } : msg
            ));
            const agentResponseMessage: ChatMessage = {
              id: `agent-response-${Date.now()}`,
              sender: agent.id,
              agentName: agent.name,
              text: aiResponse,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, agentResponseMessage]);
          } else {
             // Fallback for agents without AI handlers (simulated)
            setMessages(prev => prev.map(msg => 
              msg.id === agentWorkingMessageId ? {...msg, isTyping: false, text: `Simulating task for ${agent.name}...`} : msg
            ));
            setTimeout(() => {
              const agentResponseMessage: ChatMessage = {
                id: `agent-response-${Date.now()}`,
                sender: agent.id,
                agentName: agent.name,
                text: (
                  <div>
                    <p>Task completed for: <span className="font-semibold">"{task || 'general request'}"</span></p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      (Simulated Response) This agent's AI is not fully wired here yet. 
                      You can typically find more detailed options on the <NextLink href={`/${agent.id.replace('Agent','').toLowerCase()}`} className="underline text-primary hover:text-primary/80">{agent.name} page</NextLink>.
                    </p>
                  </div>
                ),
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, agentResponseMessage]);
            }, 1500);
          }
        } catch (e: any) {
          const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during AI processing.";
          toast({
            title: `Error with ${agent.name}`,
            description: errorMessage,
            variant: "destructive",
          });
          setMessages(prev => prev.map(msg => 
            msg.id === agentWorkingMessageId ? {...msg, isTyping: false, text: `Error processing task.` } : msg
          ));
          const errorResponseMessage: ChatMessage = {
            id: `agent-error-response-${Date.now()}`,
            sender: agent.id,
            agentName: agent.name,
            text: (
              <div className="text-destructive">
                <AlertTriangle className="inline h-4 w-4 mr-1" /> 
                <strong>Error:</strong> {errorMessage}
                {agent.inputHint && <p className="text-xs mt-1">Please check the input format: {agent.mentionTag} {agent.inputHint}</p>}
              </div>
            ),
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorResponseMessage]);
        } finally {
          setIsAgentProcessing(null);
           setMessages(prev => prev.map(msg => 
            msg.id === agentWorkingMessageId && msg.isTyping ? {...msg, isTyping: false } : msg // Ensure typing indicator is removed
          ));
        }

      } else {
        const systemMessage: ChatMessage = {
          id: `system-error-${Date.now()}`,
          sender: 'system',
          text: `Agent with mention tag "${mentionTag}" not found.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    } else {
      // Handle messages not targeting an agent (e.g. general chat, not implemented here)
      const systemMessage: ChatMessage = {
        id: `system-info-${Date.now()}`,
        sender: 'system',
        text: "To task an agent, start your message with their @mention tag (e.g., @recon).",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  const getAgentAvatar = (sender: AgentId | 'user' | 'system') => {
    if (sender === 'user') {
      return <User className="h-full w-full" />;
    }
    if (sender === 'system') {
      return <Bot className="h-full w-full text-primary" />;
    }
    const agent = AVAILABLE_AGENTS.find(a => a.id === sender);
    if (agent) {
      // Wrap icon in a div to control size if needed, or ensure icon itself takes full space
      return <div className={cn("h-full w-full flex items-center justify-center", agent.colorClass)}><agent.avatarIcon className="h-5 w-5" /></div>;
    }
    return <div className="h-full w-full flex items-center justify-center"><Bot className="h-5 w-5" /></div>;
  };
  
  const getSenderName = (sender: AgentId | 'user' | 'system', agentName?: string) => {
    if (sender === 'user') return 'You';
    if (sender === 'system') return 'System';
    return agentName || AVAILABLE_AGENTS.find(a => a.id === sender)?.name || 'Agent';
  };


  return (
    <div className="animate-fadeIn flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="AI Agents Hub"
        description="Interact with your AI cybersecurity agents in this chat."
        icon={Bot}
      />

      <Card className="flex-grow flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">Agent Chat Room</CardTitle>
          <CardDescription>Mention an agent (e.g., @recon) to task them. Check agent list for input hints.</CardDescription>
        </CardHeader>
        
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3",
                  msg.sender === 'user' ? 'justify-end' : ''
                )}
              >
                {msg.sender !== 'user' && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn(AVAILABLE_AGENTS.find(a => a.id === msg.sender)?.colorClass, 'bg-opacity-20 p-0')}>
                      {getAgentAvatar(msg.sender as AgentId)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                    "max-w-[70%] p-3 rounded-lg shadow", 
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none',
                    msg.sender === 'system' && 'bg-muted text-muted-foreground w-full max-w-full'
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-xs font-semibold",
                      msg.sender !== 'user' && AVAILABLE_AGENTS.find(a => a.id === msg.sender)?.colorClass
                    )}>
                      {getSenderName(msg.sender, msg.agentName)}
                    </span>
                    <span className="text-xs text-muted-foreground/70 ml-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.isTyping ? (
                    <div className="flex items-center gap-1 text-sm">
                      <LoadingSpinner size={14} className="mr-1" />
                      <span>Working...</span>
                    </div>
                  ) : (
                    <div className="text-sm prose prose-sm prose-invert max-w-none break-words">{msg.text}</div>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 shrink-0">
                     <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message or task (e.g., @recon <Nmap output>)..."
              className="flex-grow bg-input focus:ring-primary"
              disabled={!!isAgentProcessing}
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!inputValue.trim() || !!isAgentProcessing}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
           <div className="text-xs text-muted-foreground mt-2">
            {isAgentProcessing ? 
              `${AVAILABLE_AGENTS.find(a => a.id === isAgentProcessing)?.name} is currently processing a task.` :
              `Mention an agent. Example: @flag flag{example_flag}` }
          </div>
        </div>
      </Card>
    </div>
  );
}

