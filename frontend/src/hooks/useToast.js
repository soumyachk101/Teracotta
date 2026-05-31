import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'success', duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message) => addToast({ message, type: 'success' }), [addToast]);
  const error = useCallback((message) => addToast({ message, type: 'error' }), [addToast]);
  const info = useCallback((message) => addToast({ message, type: 'info' }), [addToast]);

  return { toasts, addToast, removeToast, success, error, info };
}
