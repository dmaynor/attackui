
"use client";

import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, User, ScanLine, ShieldAlert, Bomb, KeyRound, Flag, Brain, Send, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

type AgentId = 'reconAgent' | 'vulnAssessAgent' | 'exploitAgent' | 'privEscAgent' | 'flagRecAgent' | 'learningAgent';

interface Agent {
  id: AgentId;
  name: string;
  mentionTag: string;
  description: string;
  avatarIcon: React.ElementType;
  colorClass: string; // For styling agent messages
}

const AVAILABLE_AGENTS: Agent[] = [
  { id: 'reconAgent', name: 'Recon Agent', mentionTag: '@recon', description: 'Performs Nmap scans and summarizes results.', avatarIcon: ScanLine, colorClass: 'text-sky-400' },
  { id: 'vulnAssessAgent', name: 'Vuln Assess Agent', mentionTag: '@vuln', description: 'Identifies and prioritizes vulnerabilities.', avatarIcon: ShieldAlert, colorClass: 'text-orange-400' },
  { id: 'exploitAgent', name: 'Exploit Agent', mentionTag: '@exploit', description: 'Attempts to exploit vulnerabilities (Simulated).', avatarIcon: Bomb, colorClass: 'text-red-400' },
  { id: 'privEscAgent', name: 'PrivEsc Agent', mentionTag: '@privesc', description: 'Attempts privilege escalation (Simulated).', avatarIcon: KeyRound, colorClass: 'text-yellow-400' },
  { id: 'flagRecAgent', name: 'Flag Rec Agent', mentionTag: '@flag', description: 'Recognizes and validates CTF flags.', avatarIcon: Flag, colorClass: 'text-purple-400' },
  { id: 'learningAgent', name: 'Learning Agent', mentionTag: '@learn', description: 'Provides insights from past CTF challenges.', avatarIcon: Brain, colorClass: 'text-teal-400' },
];

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

  useEffect(() => {
    // Scroll to bottom when messages change
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
            <p>Welcome to the AI Agents Hub! You can task agents using their @mention tag.</p>
            <p className="text-xs mt-1">Example: <code className="bg-muted p-1 rounded-sm">@recon scan target.com</code></p>
            <Card className="mt-3">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Available Agents:</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-xs grid grid-cols-2 gap-1">
                {AVAILABLE_AGENTS.map(agent => (
                  <div key={agent.id} className="flex items-center gap-1">
                    <agent.avatarIcon className={cn("h-3 w-3", agent.colorClass)} /> 
                    <span className="font-semibold">{agent.mentionTag}</span>: 
                    <span className="text-muted-foreground truncate">{agent.description}</span>
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
      const task = mentionMatch[2] || "Received task.";
      const agent = AVAILABLE_AGENTS.find(a => a.mentionTag === mentionTag);

      if (agent) {
        setIsAgentProcessing(agent.id);
        const agentWorkingMessageId = `agent-working-${Date.now()}`;
        const agentWorkingMessage: ChatMessage = {
          id: agentWorkingMessageId,
          sender: agent.id,
          agentName: agent.name,
          text: `Understood! Working on: "${task}"`,
          timestamp: new Date(),
          isTyping: true,
        };
        setMessages(prev => [...prev, agentWorkingMessage]);

        // Simulate agent processing
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === agentWorkingMessageId ? {...msg, isTyping: false} : msg
          ));

          const agentResponseMessage: ChatMessage = {
            id: `agent-response-${Date.now()}`,
            sender: agent.id,
            agentName: agent.name,
            text: (
              <div>
                <p>Task completed for: <span className="font-semibold">"{task}"</span></p>
                <p className="text-xs mt-1 text-muted-foreground">
                  (Simulated Response) For real results, please use the dedicated page for the {agent.name}.
                  You can typically find more detailed options and actual outputs on the <Link href={`/${agent.id.replace('Agent','').toLowerCase()}`} className="underline text-primary hover:text-primary/80">{agent.name} page</Link>.
                </p>
              </div>
            ),
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, agentResponseMessage]);
          setIsAgentProcessing(null);
        }, 2000 + Math.random() * 2000);
      } else {
        const systemMessage: ChatMessage = {
          id: `system-error-${Date.now()}`,
          sender: 'system',
          text: `Agent with mention tag "${mentionTag}" not found.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    }
  };

  const getAgentAvatar = (sender: AgentId | 'user' | 'system', agentName?: string) => {
    if (sender === 'user') {
      return <User className="h-6 w-6" />;
    }
    if (sender === 'system') {
      return <Bot className="h-6 w-6 text-primary" />;
    }
    const agent = AVAILABLE_AGENTS.find(a => a.id === sender);
    if (agent) {
      return <agent.avatarIcon className={cn("h-6 w-6", agent.colorClass)} />;
    }
    return <Bot className="h-6 w-6" />;
  };
  
  const getSenderName = (sender: AgentId | 'user' | 'system', agentName?: string) => {
    if (sender === 'user') return 'You';
    if (sender === 'system') return 'System';
    return agentName || AVAILABLE_AGENTS.find(a => a.id === sender)?.name || 'Agent';
  };


  return (
    <div className="animate-fadeIn flex flex-col h-[calc(100vh-8rem)]"> {/* Adjust height as needed */}
      <PageHeader
        title="AI Agents Hub"
        description="Interact with your AI cybersecurity agents in this chat."
        icon={Bot}
      />

      <Card className="flex-grow flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">Agent Chat Room</CardTitle>
          <CardDescription>Mention an agent (e.g., @recon) to task them.</CardDescription>
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
                    <AvatarFallback className={cn(AVAILABLE_AGENTS.find(a => a.id === msg.sender)?.colorClass, 'bg-opacity-20')}>
                      {getAgentAvatar(msg.sender, msg.agentName)}
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
             {isAgentProcessing && messages.every(m => m.sender !== isAgentProcessing || !m.isTyping) && (
              // This logic might be redundant if typing is handled per message
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={cn(AVAILABLE_AGENTS.find(a => a.id === isAgentProcessing)?.colorClass, 'bg-opacity-20')}>
                    {getAgentAvatar(isAgentProcessing as AgentId)}
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] p-3 rounded-lg shadow bg-card text-card-foreground rounded-bl-none">
                  <div className="flex items-center gap-1 text-sm">
                     <LoadingSpinner size={14} className="mr-1" />
                     <span>{AVAILABLE_AGENTS.find(a => a.id === isAgentProcessing)?.name} is processing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message or task (e.g., @recon scan target.com)..."
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
              `Mention an agent: ${AVAILABLE_AGENTS.map(a => a.mentionTag).join(', ')}`}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper Link component to avoid full page reloads if possible (though for external-like links to other app pages, standard Link is fine)
import NextLink from 'next/link';
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}
const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  return (
    <NextLink href={href} passHref>
      <a {...props}>{children}</a>
    </NextLink>
  );
};
