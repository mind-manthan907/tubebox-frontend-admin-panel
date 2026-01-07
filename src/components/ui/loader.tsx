import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
    className?: string;
    size?: number | string;
}

export const Loader = ({ className, size = 24 }: LoaderProps) => {
    return (
        <Loader2
            className={cn('animate-spin text-primary', className)}
            size={size}
        />
    );
};

export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <Loader size={48} />
        </div>
    );
};
