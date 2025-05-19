
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bot, User, Send, AlertTriangle, Users, Briefcase, Code, ClipboardCheck, Network, Cpu, DraftingCompass, SearchCheck, Gamepad2, GraduationCap, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TerminalOutput } from '@/components/common/TerminalOutput'; // Keep if complex outputs are needed

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
import { handleCommunicationsTask, type CommunicationsTaskInput, type CommunicationsTaskOutput } from '@/ai/flows/communications-agent';

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
  | 'communicationsAgent';

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
  sender: 'user' | AgentId;
  text: string | React.ReactNode;
  timestamp: Date;
  agentName?: string;
  isTyping?: boolean;
}

const TECHNICAL_DIRECTOR_ID: AgentId = 'technicalDirector';

export default function AIAgentsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentProcessing, setIsAgentProcessing] = useState<AgentId | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Agent[]>([]);

  const AVAILABLE_AGENTS: Agent[] = [
    { 
      id: 'technicalDirector', name: 'Technical Director', mentionTag: '@director', 
      description: 'Mission command, task decomposition, delegates. Handles general queries.', 
      avatarIcon: Users, colorClass: 'text-indigo-400',
      inputHint: '<High-level objective, strategy question, or general query>',
      aiHandler: async (task) => {
        if (!task.trim()) throw new Error("A query is required for the Technical Director.");
        const result: StrategicAdviceOutput = await provideStrategicAdvice({ query: task });
        return <div className="whitespace-pre-wrap">{result.advice}</div>;
      }
    },
    { 
      id: 'programmer', name: 'Programmer', mentionTag: '@programmer', 
      description: 'Full-stack software development, writes & debugs code.', 
      avatarIcon: Code, colorClass: 'text-sky-400',
      inputHint: '<Code task, e.g., "write python script to parse logs">',
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
      inputHint: '<QA task, e.g., "generate test cases for login API">',
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
      inputHint: '<Network task, e.g., "suggest hardening for a web server">',
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
      description: 'FPGA, SDR, low-level systems support (conceptual).', 
      avatarIcon: Cpu, colorClass: 'text-orange-400',
      inputHint: '<Hardware query, e.g., "discuss RTL for a simple ALU">',
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
      inputHint: '<Architecture task, e.g., "design integration for two systems">',
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
      description: 'Code, logic, and design auditor.', 
      avatarIcon: SearchCheck, colorClass: 'text-yellow-400',
      inputHint: '<Item to review> Focus: <optional: aspect to focus on>',
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
      description: 'Designs scenarios (Cyberarena) & CTF challenges (Artifact Forge).', 
      avatarIcon: Gamepad2, colorClass: 'text-red-400',
      inputHint: '<Scenario/challenge design task, e.g., "design hard pwn challenge for Artifact Forge">',
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
      id: 'communicationsAgent', name: 'Communications Agent', mentionTag: '@comms', 
      description: 'Generates news scripts & coordinates video updates (e.g., via Synthesia).', 
      avatarIcon: Megaphone, colorClass: 'text-cyan-400',
      inputHint: 'Topic: <news topic> [AvatarID: <id>] [Title: <video_title>]',
      aiHandler: async (task) => {
        // Basic parsing for topic, avatarId, and title
        // Example: Topic: New Feature Launch AvatarID: anna_123 Title: Exciting News!
        const topicMatch = task.match(/Topic:\s*(.*?)(?=\s*AvatarID:|\s*Title:|$)/i);
        const avatarIdMatch = task.match(/AvatarID:\s*([\w-]+)/i);
        const titleMatch = task.match(/Title:\s*(.*?)(?=\s*AvatarID:|$)/i);

        const topic = topicMatch ? topicMatch[1].trim() : task.trim(); // Fallback to full task as topic
        const avatarId = avatarIdMatch ? avatarIdMatch[1].trim() : undefined;
        const title = titleMatch ? titleMatch[1].trim() : undefined;
        
        if (!topic) throw new Error("Topic is required for @comms agent. Format: Topic: <your topic> [AvatarID: <id>] [Title: <video_title>]");
        
        const result: CommunicationsTaskOutput = await handleCommunicationsTask({ topic, avatarId, title });
        return (
            <div className="text-xs">
                <p className="font-semibold mb-1">Script Generated:</p>
                <pre className="whitespace-pre-wrap p-2 bg-muted/50 rounded-sm font-mono text-xs my-1">{result.generatedScript}</pre>
                <p className="font-semibold mt-2 mb-1">Video Creation (Mocked):</p>
                <p>Status: <span className="font-normal">{result.videoCreationStatus}</span></p>
                {result.videoId && <p>Video ID: <span className="font-normal">{result.videoId}</span></p>}
                {result.toolResponseDetails && <p>Details: <span className="font-normal">{result.toolResponseDetails}</span></p>}
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
    const director = AVAILABLE_AGENTS.find(a => a.id === TECHNICAL_DIRECTOR_ID);
    setMessages([
      {
        id: 'director-welcome',
        sender: TECHNICAL_DIRECTOR_ID,
        agentName: director?.name || 'Technical Director',
        text: (
          <div>
            <p>Welcome to the AI Agents Hub! I am the Technical Director. Ask me general questions, or task a specific agent using their @mention tag.</p>
            <Card className="mt-3">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Taskable Agents:</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1">
                {AVAILABLE_AGENTS.filter(a => a.id !== TECHNICAL_DIRECTOR_ID).map(agent => ( 
                  <div key={agent.id} className="flex items-start gap-1 py-1">
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setShowSuggestions(false);


    const mentionMatch = trimmedInput.match(/^(@[a-zA-Z0-9_]+)\s*(.*)/);
    let targetAgent: Agent | undefined;
    let task: string;

    if (mentionMatch) {
      const mentionTag = mentionMatch[1];
      task = mentionMatch[2] || "";
      targetAgent = AVAILABLE_AGENTS.find(a => a.mentionTag === mentionTag);
      if (!targetAgent) {
        const director = AVAILABLE_AGENTS.find(a => a.id === TECHNICAL_DIRECTOR_ID);
        const systemMessage: ChatMessage = {
          id: `director-error-${Date.now()}`,
          sender: TECHNICAL_DIRECTOR_ID,
          agentName: director?.name || "Technical Director",
          text: `Agent with mention tag "${mentionTag}" not found. I can help you find the right agent or you can list available agents.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemMessage]);
        return;
      }
    } else {
      targetAgent = AVAILABLE_AGENTS.find(a => a.id === TECHNICAL_DIRECTOR_ID);
      task = trimmedInput; 
      if (!targetAgent) { 
        console.error("Technical Director agent not found in AVAILABLE_AGENTS");
         const errorMsg: ChatMessage = {
            id: `system-error-no-director-${Date.now()}`,
            sender: 'technicalDirector', 
            agentName: 'System Monitor',
            text: `Critical error: Technical Director agent definition is missing. Cannot process general queries.`,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }
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
          msg.id === agentWorkingMessageId ? {...msg, isTyping: false, text: `Error processing task for "${task.substring(0,50)}${task.length > 50 ? '...' : ''}".` } : msg
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
          msg.id === agentWorkingMessageId && msg.isTyping ? {...msg, isTyping: false } : msg // Ensure typing is cleared
        ));
      }
    }
  };

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    setInputValue(value);

    let shouldShow = false;
    let suggestions: Agent[] = [];

    if (cursorPosition !== null) {
        const textBeforeCursor = value.substring(0, cursorPosition);
        const lastAtSymbolIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtSymbolIndex !== -1) {
            const potentialMentionQuery = textBeforeCursor.substring(lastAtSymbolIndex + 1);
            
            if (!potentialMentionQuery.includes(' ')) { // Only suggest if no space after query
                suggestions = AVAILABLE_AGENTS.filter(agent =>
                    agent.mentionTag.toLowerCase().startsWith(`@${potentialMentionQuery.toLowerCase()}`) ||
                    (potentialMentionQuery.length > 0 && agent.name.toLowerCase().includes(potentialMentionQuery.toLowerCase()))
                ).filter(agent => agent.id !== TECHNICAL_DIRECTOR_ID); // Exclude director from @ suggestions
                if (suggestions.length > 0) {
                    shouldShow = true;
                }
            }
        }
    }
    setFilteredSuggestions(suggestions);
    setShowSuggestions(shouldShow);
  };

  const handleSuggestionClick = (agentMention: string) => {
    const currentVal = inputValue;
    const cursorPosition = inputRef.current?.selectionStart;

    if (cursorPosition !== null && cursorPosition !== undefined) {
        const textBeforeCursor = currentVal.substring(0, cursorPosition);
        const lastAtSymbolIndex = textBeforeCursor.lastIndexOf('@');
        
        if (lastAtSymbolIndex !== -1) {
            const textBeforeAt = currentVal.substring(0, lastAtSymbolIndex);
            const currentMentionPart = textBeforeCursor.substring(lastAtSymbolIndex);
            const restOfInputAfterCurrentMention = currentVal.substring(lastAtSymbolIndex + currentMentionPart.length);

            setInputValue(`${textBeforeAt}${agentMention} ${restOfInputAfterCurrentMention.trimStart()}`);
            
            setTimeout(() => {
                inputRef.current?.focus();
                const newCursorPosition = (textBeforeAt + agentMention + " ").length;
                inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
            }, 0);
        } else { 
             setInputValue(`${agentMention} `);
             setTimeout(() => inputRef.current?.focus(), 0);
        }
    } else { 
         setInputValue(prev => {
            const lastAt = prev.lastIndexOf('@');
            if (lastAt !== -1) return prev.substring(0, lastAt) + agentMention + " ";
            return agentMention + " ";
        });
        setTimeout(() => inputRef.current?.focus(), 0);
    }
    setShowSuggestions(false);
  };

  const getAgentAvatar = (sender: AgentId | 'user') => {
    if (sender === 'user') {
      return <User className="h-full w-full" />;
    }
    const agent = AVAILABLE_AGENTS.find(a => a.id === sender);
    if (agent) {
      return <div className={cn("h-full w-full flex items-center justify-center", agent.colorClass)}><agent.avatarIcon className="h-5 w-5" /></div>;
    }
    const director = AVAILABLE_AGENTS.find(a => a.id === TECHNICAL_DIRECTOR_ID);
    if (director) { // Fallback for system/director if ID somehow mismatches
        return <div className={cn("h-full w-full flex items-center justify-center", director.colorClass)}><director.avatarIcon className="h-5 w-5" /></div>; 
    }
    return <Bot className="h-5 w-5" />; // Generic bot icon
  };
  
  const getSenderName = (sender: AgentId | 'user', agentName?: string) => {
    if (sender === 'user') return 'You';
    return agentName || AVAILABLE_AGENTS.find(a => a.id === sender)?.name || 'Agent';
  };


  return (
    <div className="animate-fadeIn flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="AI Agents Hub"
        description="Interact with your specialized AI agent team. Ask the Technical Director general questions, or task specific agents."
        icon={Bot}
      />

      <Card className="flex-grow flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">Agent Chat Room</CardTitle>
          <CardDescription>Ask the Technical Director, or use @mention (e.g., @programmer) to task an agent.</CardDescription>
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
                    msg.sender === TECHNICAL_DIRECTOR_ID && msg.id.startsWith('director-welcome') && 'bg-muted text-muted-foreground w-full max-w-full'
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
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
            <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
              <PopoverTrigger asChild>
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputValueChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} 
                  placeholder={isAgentProcessing ? "Waiting for agent..." : `Ask ${AVAILABLE_AGENTS.find(a=>a.id === TECHNICAL_DIRECTOR_ID)?.mentionTag || '@director'}, or use @mention...`}
                  className="flex-grow bg-input focus:ring-primary"
                  disabled={!!isAgentProcessing}
                  autoComplete="off"
                />
              </PopoverTrigger>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <PopoverContent
                  className="w-[calc(100vw-2rem-48px-0.5rem)] sm:w-[350px] p-1" 
                  onOpenAutoFocus={(e) => e.preventDefault()} 
                  align="start"
                  side="top" 
                  sideOffset={5}
                >
                  <ScrollArea className="max-h-[200px]">
                    <div className="text-xs text-muted-foreground p-2">Suggestions:</div>
                    {filteredSuggestions.map((agent) => (
                      <Button
                        key={agent.id}
                        variant="ghost"
                        className="w-full justify-start h-auto py-2 px-3 text-sm"
                        onClick={() => handleSuggestionClick(agent.mentionTag)}
                        onMouseDown={(e) => e.preventDefault()} 
                      >
                        <agent.avatarIcon className={cn("h-4 w-4 mr-2 shrink-0", agent.colorClass)} />
                        <span className="font-semibold">{agent.mentionTag}</span>
                        <span className="text-muted-foreground ml-1 truncate text-xs">- {agent.name}</span>
                      </Button>
                    ))}
                  </ScrollArea>
                </PopoverContent>
              )}
            </Popover>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!inputValue.trim() || !!isAgentProcessing}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
           <div className="text-xs text-muted-foreground mt-2">
            {isAgentProcessing ? 
              `${AVAILABLE_AGENTS.find(a => a.id === isAgentProcessing)?.name || 'Agent'} is currently processing.` :
              `The Technical Director (${AVAILABLE_AGENTS.find(a=>a.id === TECHNICAL_DIRECTOR_ID)?.mentionTag || '@director'}) handles general queries. Use @mention for other agents.` }
          </div>
        </div>
      </Card>
    </div>
  );
}
