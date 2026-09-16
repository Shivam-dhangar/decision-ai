import React from 'react';
import { SourceType } from '@/types/decision';
import { getSourceBadgeInfo } from '@/lib/utils/formatters';
import { Sparkles, User, Edit3, HelpCircle, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SourceBadgeProps {
  source: SourceType | string;
  size?: 'xs' | 'sm';
  className?: string;
  showIcon?: boolean;
}

export function SourceBadge({
  source,
  size = 'xs',
  className,
  showIcon = true,
}: SourceBadgeProps) {
  const info = getSourceBadgeInfo(source);

  const getIcon = () => {
    switch (source) {
      case 'AI_SUGGESTED':
        return <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />;
      case 'USER_PROVIDED':
        return <User className="w-3 h-3 text-slate-500 shrink-0" />;
      case 'USER_EDITED':
        return <Edit3 className="w-3 h-3 text-amber-500 shrink-0" />;
      case 'USER_ASSUMPTION':
        return <HelpCircle className="w-3 h-3 text-purple-500 shrink-0" />;
      case 'CALCULATED':
        return <Calculator className="w-3 h-3 text-emerald-500 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-mono tracking-tight font-medium uppercase transition-colors',
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
        info.bgClass,
        info.textClass,
        className
      )}
      title={`Information source: ${info.label}`}
    >
      {showIcon && getIcon()}
      <span>{info.label}</span>
    </span>
  );
}
