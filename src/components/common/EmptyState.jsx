import { FileX } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ icon: Icon = FileX, title = 'No data found', description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={48} className="text-[#686868] mb-4" />
      <h3 className="text-lg font-semibold text-[#A1A1A1] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#686868] mb-4 max-w-sm">{description}</p>}
      {actionLabel && onAction && <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
