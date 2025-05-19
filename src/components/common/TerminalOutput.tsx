import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TerminalOutputProps {
  title?: string;
  content: string | React.ReactNode;
  maxHeight?: string;
  className?: string;
  contentClassName?: string;
}

export function TerminalOutput({ title = "Output", content, maxHeight = "400px", className, contentClassName }: TerminalOutputProps) {
  return (
    <Card className={cn("mt-6 bg-card shadow-lg border-border/70", className)}>
      {title && (
        <CardHeader className="py-4 px-6 border-b border-border/70">
          <CardTitle className="font-mono text-lg text-primary">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <ScrollArea style={{ maxHeight }} className="rounded-b-md">
          <pre className={cn("whitespace-pre-wrap p-6 text-sm font-mono text-card-foreground leading-relaxed", contentClassName)}>
            {content}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
