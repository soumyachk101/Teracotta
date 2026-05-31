import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Drawer({ isOpen, onClose, title, children, side = 'right' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sideClasses = {
    right: 'right-0 top-0 h-full w-full max-w-md translate-x-0',
    left: 'left-0 top-0 h-full w-full max-w-md translate-x-0',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60]"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={cn(
        'absolute bg-white shadow-2xl flex flex-col',
        sideClasses[side]
      )}>
        <div className="flex items-center justify-between p-4 border-b border-cream-200">
          <h2 className="font-display text-lg font-semibold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
