import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description,
  actionLabel,
  actionTo,
  onAction,
  className,
}) {
  return (
    <div className={cn('text-center py-20', className)}>
      {icon && (
        <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>
      )}
      <h2 className="text-2xl font-display font-semibold text-stone-900 mb-3">{title}</h2>
      {description && (
        <p className="text-stone-600 mb-8 max-w-md mx-auto">{description}</p>
      )}
      {actionLabel && (actionTo ? (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      ) : null)}
    </div>
  );
}
