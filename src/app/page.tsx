import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Zap, ShieldCheck, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Dashboard"
        description="Welcome to your AI-Powered Automated CTF Solver."
        icon={Home}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span>Get Started</span>
            </CardTitle>
            <CardDescription>Quick actions to begin your CTF challenge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Select a tool from the sidebar or use these quick links:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/reconnaissance">Start Recon</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/vulnerability-assessment">Assess Vulnerabilities</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span>Security Toolkit</span>
            </CardTitle>
            <CardDescription>Core functionalities at your fingertips.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Reconnaissance:</strong> Identify open ports and services.</li>
              <li><strong>Vulnerability Assessment:</strong> Find exploitable weaknesses.</li>
              <li><strong>Flag Recognition:</strong> Automatically detect flag formats.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span>Learning & Tips</span>
            </CardTitle>
            <CardDescription>Improve your skills and strategy.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Utilize the Learning Center for past challenge insights.</li>
              <li>Always verify AI-suggested exploits in a safe environment.</li>
              <li>Keep your Nmap and exploit databases updated.</li>
            </ul>
             <Button asChild variant="link" className="text-primary p-0 mt-2 h-auto">
                <Link href="/learning">Go to Learning Center</Link>
              </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No recent activity. Your automated actions and findings will appear here.
          </p>
          {/* Placeholder for future activity log */}
          <div className="mt-4 h-24 flex items-center justify-center border border-dashed border-border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">Activity Log Area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
