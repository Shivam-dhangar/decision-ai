'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { saveContactLead } from '@/lib/storage/preferencesStorage';
import { ShieldCheck, Mail, Building2, User, Send, CheckCircle2, Sparkles } from 'lucide-react';

export function ContactModal() {
  const { isContactModalOpen, closeContactModal, loginDemo } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [useCase, setUseCase] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast('Please enter your name and email address.', { type: 'warning' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      saveContactLead({
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim() || 'Independent Evaluator',
        role: role.trim() || 'Product Lead / Manager',
        useCase: useCase.trim() || 'Evaluating DecisionLens for team multi-criteria decisions',
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast('Access request submitted! You can now explore with demo credentials.', { type: 'success' });
    }, 500);
  };

  const handleInstantDemoAccess = () => {
    loginDemo(name.trim() || 'Executive Evaluator', email.trim() || 'demo@decisionlens.ai');
    setIsSubmitted(false);
    closeContactModal();
    window.location.href = '/dashboard';
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setOrganization('');
    setRole('');
    setUseCase('');
    closeContactModal();
  };

  return (
    <Modal
      isOpen={isContactModalOpen}
      onClose={handleResetAndClose}
      maxWidth="md"
      title={isSubmitted ? 'Access Request Received' : 'Contact Sales & Request Enterprise Access'}
      description={
        isSubmitted
          ? 'Thank you for reaching out. We curate production signups to guarantee privacy and white-glove onboarding.'
          : 'Signups are curated by our founders to ensure enterprise privacy standards. Request access or use demo credentials.'
      }
    >
      {isSubmitted ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Request Sent to Zahir & DecisionLens Team
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              We have received your details for <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. While your account is being provisioned, you can immediately explore all features using our full-access Demo Session!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 text-xs text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-700 dark:text-brand-300">
              <Sparkles className="w-3.5 h-3.5" /> Instant Demo Access Active
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Click below to jump directly into the Decision Workspace with full sensitivity and matrix capabilities.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={handleInstantDemoAccess}
              className="w-full sm:w-auto"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Enter Workspace as Demo User
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleResetAndClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Full Name *"
              placeholder="e.g. Zahir Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Work Email Address *"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Organization / Company"
              placeholder="e.g. Acme Ventures"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            <Input
              label="Role / Title"
              placeholder="e.g. Head of Strategy"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <Textarea
            label="What types of decisions will your team structure?"
            rows={3}
            placeholder="e.g. Evaluating tech stack migration, hiring trade-offs, capital allocation..."
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          />

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              All evaluations run locally on client devices. We never expose your organization&apos;s models or data to third-party databases.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" type="button" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit Access Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
