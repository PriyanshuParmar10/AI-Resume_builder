import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-react';

// ─── Toast Context ────────────────────────────────────────────────
const ToastContext = createContext(null);

let toastIdCounter = 0;

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ─── Single Toast Component ──────────────────────────────────────
const Toast = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const iconMap = {
    success: <CheckCircle2 className="size-5" />,
    error: <XCircle className="size-5" />,
    warning: <AlertTriangle className="size-5" />,
    info: <Info className="size-5" />,
    loading: <Loader2 className="size-5 animate-spin" />,
  };

  const styleMap = {
    success: {
      bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      border: '#6ee7b7',
      icon: '#059669',
      text: '#065f46',
      progressBar: 'linear-gradient(90deg, #34d399, #059669)',
    },
    error: {
      bg: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
      border: '#fca5a5',
      icon: '#dc2626',
      text: '#991b1b',
      progressBar: 'linear-gradient(90deg, #f87171, #dc2626)',
    },
    warning: {
      bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '#fcd34d',
      icon: '#d97706',
      text: '#92400e',
      progressBar: 'linear-gradient(90deg, #fbbf24, #d97706)',
    },
    info: {
      bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      border: '#93c5fd',
      icon: '#2563eb',
      text: '#1e40af',
      progressBar: 'linear-gradient(90deg, #60a5fa, #2563eb)',
    },
    loading: {
      bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      border: '#c4b5fd',
      icon: '#7c3aed',
      text: '#5b21b6',
      progressBar: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
    },
  };

  const styles = styleMap[toast.type] || styleMap.info;

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (toast.type === 'loading' || toast.duration === Infinity) return;

    const duration = toast.duration || 4000;
    const interval = 30;
    const decrement = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    const dismissTimer = setTimeout(handleDismiss, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.type, toast.duration, handleDismiss]);

  return (
    <div
      className={`toast-notification ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        background: styles.bg,
        borderLeft: `4px solid ${styles.border}`,
        boxShadow: `0 10px 40px -10px ${styles.border}80, 0 4px 12px rgba(0,0,0,0.08)`,
      }}
    >
      <div className="toast-content">
        <div className="toast-icon" style={{ color: styles.icon }}>
          {iconMap[toast.type]}
        </div>
        <div className="toast-text">
          {toast.title && (
            <p className="toast-title" style={{ color: styles.text }}>
              {toast.title}
            </p>
          )}
          <p className="toast-message" style={{ color: styles.text + 'cc' }}>
            {toast.message}
          </p>
        </div>
        {toast.type !== 'loading' && (
          <button
            onClick={handleDismiss}
            className="toast-close"
            style={{ color: styles.text + '80' }}
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {toast.type !== 'loading' && toast.duration !== Infinity && (
        <div className="toast-progress-track">
          <div
            className="toast-progress-bar"
            style={{
              width: `${progress}%`,
              background: styles.progressBar,
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Confirm Dialog Component ────────────────────────────────────
const ConfirmDialog = ({ dialog, onResolve }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleResolve = (result) => {
    setIsExiting(true);
    setTimeout(() => onResolve(result), 250);
  };

  return (
    <div className={`confirm-overlay ${isExiting ? 'confirm-overlay-exit' : ''}`}>
      <div className={`confirm-dialog ${isExiting ? 'confirm-dialog-exit' : ''}`}>
        <div className="confirm-icon-wrapper">
          <AlertTriangle className="size-6 text-amber-500" />
        </div>
        <h3 className="confirm-title">{dialog.title || 'Are you sure?'}</h3>
        <p className="confirm-message">{dialog.message}</p>
        <div className="confirm-actions">
          <button
            onClick={() => handleResolve(false)}
            className="confirm-btn confirm-btn-cancel"
          >
            {dialog.cancelText || 'Cancel'}
          </button>
          <button
            onClick={() => handleResolve(true)}
            className="confirm-btn confirm-btn-confirm"
          >
            {dialog.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Toast Provider ──────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [confirmResolver, setConfirmResolver] = useState(null);

  const addToast = useCallback((type, message, options = {}) => {
    const id = ++toastIdCounter;
    const newToast = {
      id,
      type,
      message,
      title: options.title,
      duration: options.duration,
    };

    setToasts((prev) => [...prev.slice(-4), newToast]); // max 5 toasts
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateToast = useCallback((id, type, message, options = {}) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, type, message, title: options.title, duration: options.duration || 4000 }
          : t
      )
    );
  }, []);

  const toast = useCallback(
    {
      success: (msg, opts) => addToast('success', msg, opts),
      error: (msg, opts) => addToast('error', msg, { duration: 5000, ...opts }),
      warning: (msg, opts) => addToast('warning', msg, opts),
      info: (msg, opts) => addToast('info', msg, opts),
      loading: (msg, opts) => addToast('loading', msg, { duration: Infinity, ...opts }),
      promise: async (promiseOrFn, msgs = {}) => {
        const id = addToast('loading', msgs.loading || 'Processing...', { duration: Infinity });
        try {
          const result = typeof promiseOrFn === 'function' ? await promiseOrFn() : await promiseOrFn;
          updateToast(id, 'success', msgs.success || 'Done!');
          return result;
        } catch (error) {
          updateToast(id, 'error', msgs.error || error?.message || 'Something went wrong');
          throw error;
        }
      },
      dismiss: (id) => removeToast(id),
      update: updateToast,
    },
    [addToast, removeToast, updateToast]
  );

  const confirm = useCallback(
    (message, options = {}) => {
      return new Promise((resolve) => {
        setConfirmDialog({ message, ...options });
        setConfirmResolver(() => resolve);
      });
    },
    []
  );

  const handleConfirmResolve = (result) => {
    if (confirmResolver) confirmResolver(result);
    setConfirmDialog(null);
    setConfirmResolver(null);
  };

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toast Container */}
      <div className="toast-container" role="alert" aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog dialog={confirmDialog} onResolve={handleConfirmResolve} />
      )}
    </ToastContext.Provider>
  );
};

export default useToast;
