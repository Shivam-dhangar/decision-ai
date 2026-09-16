'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  getDecisions,
  resetDemoDecision,
  clearAllDecisions,
  exportAllDecisionsJSON,
  importDecisionsJSON,
} from '@/lib/storage/decisionStorage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  Settings,
  HardDrive,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
  User,
  LogOut,
  Mail,
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout, openContactModal } = useAuth();
  const { toast } = useToast();

  const [decisionCount, setDecisionCount] = useState(0);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  useEffect(() => {
    const list = getDecisions();
    setDecisionCount(list.length);
  }, []);

  const handleExportAll = () => {
    try {
      const jsonStr = exportAllDecisionsJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DecisionLens_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('All decision models exported as JSON backup', { type: 'success' });
    } catch (e) {
      toast('Failed to export data', { type: 'error' });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDecisionsJSON(content);
      if (res.success) {
        toast(`Successfully imported ${res.count} decision models!`, { type: 'success' });
        setDecisionCount(getDecisions().length);
      } else {
        toast(`Import failed: ${res.error}`, { type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDemo = () => {
    resetDemoDecision();
    setDecisionCount(getDecisions().length);
    toast('Seeded demo decision restored', { type: 'success' });
  };

  const handleClearAll = () => {
    clearAllDecisions();
    setDecisionCount(0);
    setClearModalOpen(false);
    toast('All local decision data has been cleared', { type: 'info' });
  };

  return (
    <AuthGuard>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Preferences & Storage
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Settings & Local Data
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage visual appearance, demo session, and client-side decision storage.
          </p>
        </div>

        <div className="space-y-6">
          {/* User Account / Session Box */}
          <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'ZK'}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {user?.name || 'Demo Analyst'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {user?.email || 'demo@decisionlens.ai'} &bull; {user?.role || 'Enterprise Demo Session'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openContactModal}
                leftIcon={<Mail className="w-3.5 h-3.5" />}
              >
                Contact Sales
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Visual Theme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose light, dark, or automatic system preference synchronization.
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Local Storage Section */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Browser Local Storage Management
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You currently have <span className="font-bold text-slate-800 dark:text-slate-200">{decisionCount} decision models</span> stored in this browser.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Export */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Export JSON Backup
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Save all decisions and matrices into a portable JSON file.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleExportAll}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Export All Data
                </Button>
              </div>

              {/* Import */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Import JSON File
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restore or merge previously exported decision files.
                  </p>
                </div>
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full pointer-events-none"
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                  >
                    Choose JSON File
                  </Button>
                </label>
              </div>
            </div>

            {/* Reset Demo & Clear Data */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="subtle"
                size="sm"
                onClick={handleResetDemo}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Restore Demo Laptop Decision
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setClearModalOpen(true)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Clear All Decisions
              </Button>
            </div>
          </div>
        </div>

        {/* Clear All Confirmation Modal */}
        <Modal
          isOpen={clearModalOpen}
          onClose={() => setClearModalOpen(false)}
          title="Clear All Decision Models"
          description="Warning: This action will permanently erase all decisions from your browser."
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete all <span className="font-bold">{decisionCount} decisions</span>? You will not be able to recover them unless you have an exported JSON backup.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setClearModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleClearAll}>
                Yes, Clear All Data
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
