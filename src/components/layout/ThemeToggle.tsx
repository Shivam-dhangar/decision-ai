'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
        className
      )}
      role="group"
      aria-label="Theme selector"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'p-1.5 rounded-lg transition-colors flex items-center justify-center text-xs font-medium',
          theme === 'light'
            ? 'bg-white text-brand-600 shadow-xs dark:bg-slate-700 dark:text-brand-300'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        )}
        title="Light theme"
        aria-label="Light theme"
        aria-pressed={theme === 'light'}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'p-1.5 rounded-lg transition-colors flex items-center justify-center text-xs font-medium',
          theme === 'dark'
            ? 'bg-white text-brand-600 shadow-xs dark:bg-slate-700 dark:text-brand-300'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        )}
        title="Dark theme"
        aria-label="Dark theme"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        className={cn(
          'p-1.5 rounded-lg transition-colors flex items-center justify-center text-xs font-medium',
          theme === 'system'
            ? 'bg-white text-brand-600 shadow-xs dark:bg-slate-700 dark:text-brand-300'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        )}
        title="Follow system preference"
        aria-label="System theme"
        aria-pressed={theme === 'system'}
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
}
