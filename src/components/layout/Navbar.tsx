'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Compass,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Settings,
  Mail,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, openContactModal } = useAuth();

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'Product', href: isHome ? '#preview' : '/#preview' },
    { label: 'How It Works', href: isHome ? '#how-it-works' : '/#how-it-works' },
    { label: 'Use Cases', href: isHome ? '#use-cases' : '/#use-cases' },
    { label: 'Team', href: isHome ? '#team' : '/#team' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors print:hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-slate-100 group tracking-tight shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none tracking-tight">
              DecisionLens <span className="text-brand-600 dark:text-brand-400">AI</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-tight">
              Decision Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5',
              pathname.startsWith('/dashboard') || pathname.startsWith('/decision')
                ? 'text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/40 font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Workspace</span>
          </Link>
          <button
            type="button"
            onClick={openContactModal}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-brand-500" />
            <span>Contact Us</span>
          </button>
        </nav>

        {/* Right CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ThemeToggle />

          {user?.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/decision/new">
                <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                  New Decision
                </Button>
              </Link>
              <Link
                href="/settings"
                title="Settings"
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openContactModal}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-2 py-1"
              >
                Contact Sales
              </button>
              <Link href="/sign-in">
                <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Demo Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30 rounded-lg flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Workspace Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openContactModal();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-brand-500" />
                Contact Us / Request Access
              </button>
              {user?.isLoggedIn && (
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings & Data
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {user?.isLoggedIn ? (
                <>
                  <Link href="/decision/new" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full" leftIcon={<PlusCircle className="w-4 h-4" />}>
                      Create Decision
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-rose-600"
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />}>
                    Sign In with Demo Credentials
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
