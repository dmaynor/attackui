
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Construction } from 'lucide-react';

export default function AIAgentsPage() {
  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="AI Agents Hub"
        description="Manage and interact with your suite of AI-powered cybersecurity agents."
        icon={Bot}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-primary" />
            <span>Feature Under Development</span>
          </CardTitle>
          <CardDescription>
            This hub will provide a central interface for managing and interacting with various AI agents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Future capabilities may include:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1 text-muted-foreground">
            <li>A unified chat interface to command and query AI agents.</li>
            <li>Configuration options for individual agent behaviors.</li>
            <li>Monitoring of ongoing AI tasks and their results.</li>
            <li>A directory of available AI agents and their specialties.</li>
          </ul>
          <div className="mt-6 p-4 border border-dashed border-border rounded-md bg-muted/30">
            <h3 className="font-semibold text-foreground">Stay Tuned!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We are actively developing this area to enhance your interaction with the AI capabilities of the CTF Solver.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
