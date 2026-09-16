'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import {
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  KeyRound,
  Send,
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { loginWithCredentials, loginDemo, loginGuest, openContactModal } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('demo@decisionlens.ai');
  const [password, setPassword] = useState('demo123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast('Please enter an email address', { type: 'warning' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithCredentials(email, password);
      toast('Signed in successfully with demo credentials', { type: 'success' });
      router.push('/dashboard');
    }, 400);
  };

  const handleOneClickDemo = () => {
    loginDemo();
    toast('Logged in as Executive Demo User', { type: 'success' });
    router.push('/dashboard');
  };

  const handleFillDemo = () => {
    setEmail('demo@decisionlens.ai');
    setPassword('demo123');
    toast('Demo credentials auto-filled', { type: 'info' });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/30 mb-2">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Sign In to DecisionLens AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log in with demo credentials to access all decision modeling tools.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 text-xs space-y-2.5">
          <div className="flex items-center justify-between font-mono font-bold text-brand-900 dark:text-brand-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Demo Access Credentials:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-brand-200/60 dark:border-brand-800/40">
              <span className="text-slate-400 block text-[10px]">EMAIL</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold truncate block">
                demo@decisionlens.ai
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-brand-200/60 dark:border-brand-800/40">
              <span className="text-slate-400 block text-[10px]">PASSWORD</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold block">demo123</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="demo@decisionlens.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftAddon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              placeholder="demo123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftAddon={<KeyRound className="w-4 h-4" />}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            Sign In with Credentials
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-xs font-mono uppercase text-slate-400 tracking-wider shrink-0">
            Instant Access
          </span>
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        </div>

        {/* Quick Demo Login CTAs */}
        <div className="space-y-2.5">
          <Button
            type="button"
            variant="subtle"
            size="md"
            className="w-full"
            onClick={handleOneClickDemo}
            leftIcon={<Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
          >
            One-Click Demo Login
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => {
              loginGuest();
              router.push('/dashboard');
            }}
            leftIcon={<UserCheck className="w-4 h-4" />}
          >
            Continue as Guest
          </Button>
        </div>

        {/* Request Access / Contact Us instead of open fake signups */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-2 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            Need an enterprise deployment or organization account?
          </p>
          <button
            type="button"
            onClick={openContactModal}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Us &bull; Request Access</span>
          </button>
        </div>
      </div>
    </div>
  );
}
