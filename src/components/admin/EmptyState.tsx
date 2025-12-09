import type { LucideIcon } from 'lucide-react';
import Button from '../Button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Icon size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
