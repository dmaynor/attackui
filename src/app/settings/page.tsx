import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Palette, BellDot, KeySquare } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Settings"
        description="Configure your application preferences and integrations."
        icon={Settings}
      />
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground">Theme</h4>
              <p className="text-sm text-muted-foreground">Currently, the application uses a dark, terminal-style theme by default.</p>
              <Button variant="outline" className="mt-2" disabled>Toggle Theme (Coming Soon)</Button>
            </div>
             <div>
              <h4 className="font-medium text-foreground">Font Size</h4>
              <p className="text-sm text-muted-foreground">Adjust font size for readability.</p>
              <Button variant="outline" className="mt-2" disabled>Adjust Font (Coming Soon)</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeySquare className="h-6 w-6 text-primary" />
              API Keys & Integrations
            </CardTitle>
            <CardDescription>
              Manage API keys for integrated services (e.g., exploit databases, notification services).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will allow you to configure API keys for various third-party services
              to enhance the capabilities of the CTF Solver.
            </p>
            <Button variant="outline" className="mt-3" disabled>Manage API Keys (Coming Soon)</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellDot className="h-6 w-6 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control how and when you receive notifications from the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure alerts for completed scans, found flags, or critical vulnerabilities.
            </p>
             <Button variant="outline" className="mt-3" disabled>Configure Notifications (Coming Soon)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
