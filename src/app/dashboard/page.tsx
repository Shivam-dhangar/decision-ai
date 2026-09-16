'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Decision } from '@/types/decision';
import {
  getDecisions,
  deleteDecision,
  resetDemoDecision,
  subscribeToStorageUpdates,
} from '@/lib/storage/decisionStorage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import {
  DashboardSearchFilter,
  SortOption,
} from '@/components/dashboard/DashboardSearchFilter';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  PlusCircle,
  Sparkles,
  Layers,
  Compass,
  RotateCcw,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');

  // Load decisions from LocalStorage
  const loadData = () => {
    const data = getDecisions();
    setDecisions(data);
    setIsLoaded(true);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStorageUpdates(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = (id: string) => {
    const success = deleteDecision(id);
    if (success) {
      toast('Decision deleted locally', { type: 'info' });
      loadData();
    }
  };

  const handleSeedDemo = () => {
    resetDemoDecision();
    toast('Demo decision restored to workspace', { type: 'success' });
    loadData();
  };

  // Filter & Sort Logic
  const filteredDecisions = decisions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.goal && d.goal.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || d.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'ALL' || d.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Apply Sorting
  filteredDecisions.sort((a, b) => {
    if (selectedSort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (selectedSort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (selectedSort === 'highest_score') {
      return (b.results?.winnerScore || 0) - (a.results?.winnerScore || 0);
    }
    if (selectedSort === 'lowest_score') {
      return (a.results?.winnerScore || 0) - (b.results?.winnerScore || 0);
    }
    return 0;
  });

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AuthGuard>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {getGreeting()}, {user?.name || 'Analyst'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Your Decision Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage your structured multi-criteria models, rankings, and sensitivity analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleSeedDemo}
              leftIcon={<Sparkles className="w-4 h-4 text-brand-500" />}
            >
              Reset Demo
            </Button>

            <Link href="/decision/new">
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                + New Decision
              </Button>
            </Link>
          </div>
        </div>

        {/* Analytics Stats Strip */}
        <DashboardStats decisions={decisions} />

        {/* Search & Filter Toolbar */}
        <DashboardSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />

        {/* Decision Cards Grid or Empty State */}
        {isLoaded && filteredDecisions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : isLoaded && decisions.length === 0 ? (
          <EmptyState
            icon={<Compass className="w-7 h-7" />}
            title="Your decision workspace is empty"
            description="Create your first decision model or load the interactive developer laptop demo to explore sensitivity analysis."
            primaryAction={{
              label: 'Create First Decision',
              onClick: () => (window.location.href = '/decision/new'),
              icon: <PlusCircle className="w-4 h-4" />,
            }}
            secondaryAction={{
              label: 'Try Demo Decision',
              onClick: handleSeedDemo,
            }}
          />
        ) : isLoaded && filteredDecisions.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 max-w-md mx-auto space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No decisions match your search or filter criteria.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
