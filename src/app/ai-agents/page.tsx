
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
import { Bot, User, Send, AlertTriangle, Sparkles, Briefcase, Code, ClipboardCheck, Network, Cpu, DraftingCompass, SearchCheck, Gamepad2, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TerminalOutput } from '@/components/common/TerminalOutput';

// Import AI Flow Functions
import { provideStrategicAdvice, type StrategicAdviceInput, type StrategicAdviceOutput } from '@/ai/flows/technical-director-agent';
import { handleProgrammingTask, type ProgrammingTaskInput, type ProgrammingTaskOutput } from '@/ai/flows/programmer-agent';
import { handleQATask, type QATaskInput, type QATaskOutput } from '@/ai/flows/qa-engineer-agent';
import { handleNetworkTask, type NetworkTaskInput, type NetworkTaskOutput } from '@/ai/flows/network-engineer-agent';
import { handleHardwareTask, type HardwareTaskInput, type HardwareTaskOutput } from '@/ai/flows/hardware-engineer-agent';
import { handleArchitectureTask, type ArchitectureTaskInput, type ArchitectureTaskOutput } from '@/ai/flows/architect-agent';
import { handleCritiqueTask, type CritiqueTaskInput, type CritiqueTaskOutput } from '@/ai/flows/critic-agent';
import { handleGameMasterTask, type GameMasterTaskInput, type GameMasterTaskOutput } from '@/ai/flows/game-master-agent';
import { handleEducationTask, type EducationTaskInput, type EducationTaskOutput } from '@/ai/flows/education-sme-agent';
import { answerGeneralQuestion, type GeneralQuestionInput, type GeneralQuestionOutput } from '@/ai/flows/general-question-agent';

// Original CTF agent imports (can be phased out or integrated if needed)
// import { summarizeReconnaissanceResults, type SummarizeReconnaissanceResultsInput, type SummarizeReconnaissanceResultsOutput } from '@/ai/flows/reconnaissance-agent';
// import { prioritizeVulnerabilities, type PrioritizeVulnerabilitiesInput, type PrioritizeVulnerabilitiesOutput } from '@/ai/flows/vulnerability-assessment-agent';
// import { validateFlagFormat, type ValidateFlagFormatInput, type ValidateFlagFormatOutput } from '@/ai/flows/flag-recognition-agent';
// import { recommendEffectiveTechniques, type RecommendEffectiveTechniquesInput, type RecommendEffectiveTechniquesOutput } from '@/ai/flows/learning-agent';


type AgentId = 
  | 'technicalDirector' 
  | 'programmer' 
  | 'qaEngineer' 
  | 'networkEngineer' 
  | 'hardwareEngineer' 
  | 'architect' 
  | 'critic' 
  | 'gameMaster' 
  | 'educationSME' 
  | 'assistant';

interface Agent {
  id: AgentId;
  name: string;
  mentionTag: string; 
  description: string;
  avatarIcon: React.ElementType;
  colorClass: string;
  inputHint?: string; 
  aiHandler?: (task: string) => Promise<React.ReactNode>;
}

interface ChatMessage {
  id: string;
  sender: 'user' | AgentId | 'system';
  text: string | React.ReactNode;
  timestamp: Date;
  agentName?: string;
  isTyping?: boolean;
}

const GENERAL_ASSISTANT_ID: AgentId = 'assistant';

export default function AIAgentsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentProcessing, setIsAgentProcessing] = useState<AgentId | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const AVAILABLE_AGENTS: Agent[] = [
    { 
      id: 'technicalDirector', name: 'Technical Director', mentionTag: '@director', 
      description: 'Mission command, task decomposition, delegates.', 
      avatarIcon: Briefcase, colorClass: 'text-indigo-400',
      inputHint: '<High-level objective or query>',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("A query is required for the @director agent.");
        const result: StrategicAdviceOutput = await provideStrategicAdvice({ query: task });
        return <div className="whitespace-pre-wrap">{result.advice}</div>;
      }
    },
    { 
      id: 'programmer', name: 'Programmer', mentionTag: '@programmer', 
      description: 'Full-stack software development, writes & debugs code.', 
      avatarIcon: Code, colorClass: 'text-sky-400',
      inputHint: '<Code task, e.g., "write python script to...">',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Task description is required for @programmer agent.");
        const result: ProgrammingTaskOutput = await handleProgrammingTask({ taskDescription: task });
        return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Programmer Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.response}</pre>
            </div>
        );
      }
    },
     { 
      id: 'qaEngineer', name: 'QA Engineer', mentionTag: '@qa', 
      description: 'Testing, validation, and verification.', 
      avatarIcon: ClipboardCheck, colorClass: 'text-lime-400',
      inputHint: '<QA task, e.g., "generate test cases for login">',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Task description is required for @qa agent.");
        const result: QATaskOutput = await handleQATask({ taskDescription: task });
         return (
            <div className="text-xs">
                <p className="font-semibold mb-1">QA Engineer Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.response}</pre>
            </div>
        );
      }
    },
    { 
      id: 'networkEngineer', name: 'Network Engineer', mentionTag: '@network', 
      description: 'Infrastructure, security, communications.', 
      avatarIcon: Network, colorClass: 'text-teal-400',
      inputHint: '<Network task, e.g., "design secure topology for X">',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Task description is required for @network agent.");
        const result: NetworkTaskOutput = await handleNetworkTask({ taskDescription: task });
        return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Network Engineer Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.response}</pre>
            </div>
        );
      }
    },
    { 
      id: 'hardwareEngineer', name: 'Hardware Engineer', mentionTag: '@hardware', 
      description: 'FPGA, SDR, low-level systems support.', 
      avatarIcon: Cpu, colorClass: 'text-orange-400',
      inputHint: '<Hardware query, e.g., "explain FPGA design flow">',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Task description is required for @hardware agent.");
        const result: HardwareTaskOutput = await handleHardwareTask({ taskDescription: task });
        return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Hardware Engineer Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.response}</pre>
            </div>
        );
      }
    },
    { 
      id: 'architect', name: 'Architect', mentionTag: '@architect', 
      description: 'System design and integration.', 
      avatarIcon: DraftingCompass, colorClass: 'text-purple-400',
      inputHint: '<Architecture task, e.g., "design modular app architecture">',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Task description is required for @architect agent.");
        const result: ArchitectureTaskOutput = await handleArchitectureTask({ taskDescription: task });
        return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Architect Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.response}</pre>
            </div>
        );
      }
    },
    { 
      id: 'critic', name: 'Critic', mentionTag: '@critic', 
      description: 'Code and logic auditor.', 
      avatarIcon: SearchCheck, colorClass: 'text-yellow-400',
      inputHint: '<"Item to review" then, optionally, "Focus: specific aspect">',
      aiHandler: async (task) => {
        const [itemToReview, ...focusParts] = task.split(/Focus:/i);
        if (!itemToReview.trim()) throw new Error("Item to review is required for @critic agent.");
        const reviewFocus = focusParts.join('Focus:').trim() || undefined;
        const result: CritiqueTaskOutput = await handleCritiqueTask({ itemToReview: itemToReview.trim(), reviewFocus });
        return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Critic Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.critique}</pre>
            </div>
        );
      }
    },
    { 
      id: 'gameMaster', name: 'Game-master', mentionTag: '@gamemaster', 
      description: 'Red teamer, scenario planner, CTF creator.', 
      avatarIcon: Gamepad2, colorClass: 'text-red-400',
      inputHint: '<Scenario/challenge design task>',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("Task description is required for @gamemaster agent.");
        const result: GameMasterTaskOutput = await handleGameMasterTask({ taskDescription: task });
        return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Game-master Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.response}</pre>
            </div>
        );
      }
    },
    { 
      id: 'educationSME', name: 'Education SME', mentionTag: '@education', 
      description: 'Instructional design & educational optimization.', 
      avatarIcon: GraduationCap, colorClass: 'text-pink-400',
      inputHint: '<Context to enhance> Learning Goal: <goal> Audience: <audience (optional)>',
      aiHandler: async (task) => {
        const parts = task.split(/Learning Goal:|Audience:/i);
        if (parts.length < 2 || !parts[0].trim() || !parts[1].trim()) {
          throw new Error("Context and Learning Goal are required for @education agent. Format: <Context> Learning Goal: <Goal> [Audience: <Audience>]");
        }
        const context = parts[0].trim();
        const learningGoal = parts[1].trim();
        const targetAudience = parts[2] ? parts[2].trim() : undefined;

        const result: EducationTaskOutput = await handleEducationTask({ context, learningGoal, targetAudience });
         return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Education SME Status: <span className="font-normal">{result.status}</span></p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.suggestions}</pre>
            </div>
        );
      }
    },
    {
      id: GENERAL_ASSISTANT_ID, name: 'Assistant', mentionTag: '@assistant', description: 'Answers general questions.', avatarIcon: Sparkles, colorClass: 'text-green-400',
      inputHint: '<Your general question>',
      aiHandler: async (question) => {
        if (!question.trim()) throw new Error("Question cannot be empty.");
        const result: GeneralQuestionOutput = await answerGeneralQuestion({ question });
        return result.answer;
      }
    }
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
            <p>Welcome to the AI Agents Hub! Ask a general question, or task an agent using their @mention tag.</p>
            <Card className="mt-3">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Taskable Agents:</CardTitle>
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
    let targetAgent: Agent | undefined;
    let task: string;

    if (mentionMatch) {
      const mentionTag = mentionMatch[1];
      task = mentionMatch[2] || "";
      targetAgent = AVAILABLE_AGENTS.find(a => a.mentionTag === mentionTag);
      if (!targetAgent) {
         const systemMessage: ChatMessage = {
          id: `system-error-${Date.now()}`,
          sender: 'system',
          text: `Agent with mention tag "${mentionTag}" not found.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemMessage]);
        return;
      }
    } else {
      // If no @mention, send to general assistant
      targetAgent = AVAILABLE_AGENTS.find(a => a.id === GENERAL_ASSISTANT_ID);
      task = trimmedInput; 
    }

    if (targetAgent) {
      setIsAgentProcessing(targetAgent.id);
      const agentP = targetAgent; 
      const agentWorkingMessageId = `agent-working-${Date.now()}`;
      const agentWorkingMessage: ChatMessage = {
        id: agentWorkingMessageId,
        sender: agentP.id,
        agentName: agentP.name,
        text: `Understood! ${agentP.name} is working on: "${task.substring(0,50)}${task.length > 50 ? '...' : ''}"`,
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages(prev => [...prev, agentWorkingMessage]);

      try {
        if (agentP.aiHandler) {
          const aiResponse = await agentP.aiHandler(task);
          setMessages(prev => prev.map(msg => 
            msg.id === agentWorkingMessageId ? {...msg, isTyping: false, text: "Processing complete. Here's the result:" } : msg
          ));
          const agentResponseMessage: ChatMessage = {
            id: `agent-response-${Date.now()}`,
            sender: agentP.id,
            agentName: agentP.name,
            text: aiResponse,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, agentResponseMessage]);
        } else {
          setMessages(prev => prev.map(msg => 
            msg.id === agentWorkingMessageId ? {...msg, isTyping: false, text: `${agentP.name} acknowledged the task. (Full AI functionality for this agent is conceptual or under development).`} : msg
          ));
        }
      } catch (e: any) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during AI processing.";
        toast({
          title: `Error with ${agentP.name}`,
          description: errorMessage,
          variant: "destructive",
        });
        setMessages(prev => prev.map(msg => 
          msg.id === agentWorkingMessageId ? {...msg, isTyping: false, text: `Error processing task.` } : msg
        ));
        const errorResponseMessage: ChatMessage = {
          id: `agent-error-response-${Date.now()}`,
          sender: agentP.id,
          agentName: agentP.name,
          text: (
            <div className="text-destructive">
              <AlertTriangle className="inline h-4 w-4 mr-1" /> 
              <strong>Error:</strong> {errorMessage}
              {agentP.inputHint && agentP.mentionTag && <p className="text-xs mt-1">Please check the input format: {agentP.mentionTag} {agentP.inputHint}</p>}
            </div>
          ),
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponseMessage]);
      } finally {
        setIsAgentProcessing(null);
         setMessages(prev => prev.map(msg => 
          msg.id === agentWorkingMessageId && msg.isTyping ? {...msg, isTyping: false } : msg 
        ));
      }
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
        description="Interact with your specialized AI agent team or ask general questions."
        icon={Bot}
      />

      <Card className="flex-grow flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">Agent Chat Room</CardTitle>
          <CardDescription>Ask a question or mention an agent (e.g., @programmer) to task them.</CardDescription>
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
                    <AvatarFallback className={cn(AVAILABLE_AGENTS.find(a => a.id === msg.sender)?.colorClass || (msg.sender === GENERAL_ASSISTANT_ID ? 'text-green-400' : ''), 'bg-opacity-20 p-0')}>
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
                      msg.sender !== 'user' && (AVAILABLE_AGENTS.find(a => a.id === msg.sender)?.colorClass || (msg.sender === GENERAL_ASSISTANT_ID ? 'text-green-400' : ''))
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
                     <div className="text-sm prose prose-sm prose-invert max-w-none break-words">
                      {typeof msg.text === 'string' ? 
                        <div dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />') }}/> : 
                        msg.text
                      }
                    </div>
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
              placeholder="Ask the Assistant, or task an agent e.g. @programmer <your task>..."
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
              `${AVAILABLE_AGENTS.find(a => a.id === isAgentProcessing)?.name || 'Assistant'} is currently processing.` :
              `The AI team is ready. Use @mention for specific agents or ask the Assistant.` }
          </div>
        </div>
      </Card>
    </div>
  );
}

