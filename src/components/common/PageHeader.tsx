import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-8 w-8 text-primary shrink-0" />}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
    </div>
  );
}
