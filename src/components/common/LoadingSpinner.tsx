import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ size = 24, className, fullPage = false }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
        <Loader2 style={{ width: size * 2, height: size * 2 }} className={cn('animate-spin text-primary', className)} />
      </div>
    );
  }
  return <Loader2 style={{ width: size, height: size }} className={cn('animate-spin text-primary', className)} />;
}
