'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, options?: { type?: ToastType; description?: string; duration?: number }) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, options?: { type?: ToastType; description?: string; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        id,
        message,
        type: options?.type || 'info',
        description: options?.description,
        duration: options?.duration || 4000,
      };

      setToasts((prev) => [...prev.slice(-3), newToast]); // max 4 toasts

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((msg: string, desc?: string) => addToast(msg, { type: 'success', description: desc }), [addToast]);
  const error = useCallback((msg: string, desc?: string) => addToast(msg, { type: 'error', description: desc }), [addToast]);
  const info = useCallback((msg: string, desc?: string) => addToast(msg, { type: 'info', description: desc }), [addToast]);
  const warning = useCallback((msg: string, desc?: string) => addToast(msg, { type: 'warning', description: desc }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning, removeToast }}>
      {children}
      {/* Toast Render Portal */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-colors',
                t.type === 'success' && 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100',
                t.type === 'error' && 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100',
                t.type === 'warning' && 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100',
                t.type === 'info' && 'bg-slate-900/95 dark:bg-slate-900/95 border-slate-700 text-slate-100'
              )}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{t.message}</p>
                {t.description && (
                  <p className="text-xs opacity-90 mt-1 leading-normal font-normal">{t.description}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-current opacity-60 hover:opacity-100 p-0.5 rounded transition-opacity"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
