import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Bot, Users, Lightbulb, Briefcase, Code, DraftingCompass, SearchCheck } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Welcome to the AI Agent Hub"
        description="Your central command for interacting with a diverse team of specialized AI agents. Delegate tasks, get insights, and manage your AI workforce."
        icon={Home}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span>AI Agent Chat</span>
            </CardTitle>
            <CardDescription>Directly interact with your team of AI agents. Assign tasks, ask questions, and get real-time responses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              The AI Agents Hub is your primary interface for collaboration.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/ai-agents">Go to Agent Chat</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Meet Your Agent Team</span>
            </CardTitle>
            <CardDescription>An overview of your specialized AI agents and their core capabilities.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 mt-1 text-primary shrink-0"/> 
                <div><strong>Technical Director:</strong> Orchestrates tasks and guides strategy.</div>
              </li>
              <li className="flex items-start gap-2">
                <Code className="h-4 w-4 mt-1 text-primary shrink-0"/>
                <div><strong>Programmer:</strong> Develops, debugs, and optimizes code.</div>
              </li>
              <li className="flex items-start gap-2">
                <DraftingCompass className="h-4 w-4 mt-1 text-primary shrink-0"/>
                <div><strong>Architect:</strong> Designs system structures and integrations.</div>
              </li>
               <li className="flex items-start gap-2">
                <SearchCheck className="h-4 w-4 mt-1 text-primary shrink-0"/>
                <div><strong>Critic:</strong> Reviews outputs for quality and correctness.</div>
              </li>
            </ul>
             <Button asChild variant="link" className="text-primary p-0 mt-3 h-auto">
                <Link href="/ai-agents">Interact with Full Team</Link>
              </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <span>Agent-Driven Insights</span>
            </CardTitle>
            <CardDescription>Leverage agent reports, learning summaries, and strategic advice.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Agents like the Education SME can enhance learning from tasks, while the Critic provides feedback for refinement. The Technical Director offers strategic guidance.
            </p>
             <Button asChild variant="outline" className="w-full mt-3 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/ai-agents">Consult Specialist Agents</Link>
              </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Agent actions and key findings will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 h-24 flex items-center justify-center border border-dashed border-border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
