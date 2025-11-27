"use client";

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { WorkflowStage } from '@/lib/types/ojs';

const stages: { key: WorkflowStage; label: string }[] = [
  { key: 'submission', label: 'Submission' },
  { key: 'review', label: 'Review' },
  { key: 'copyediting', label: 'Copyediting' },
  { key: 'production', label: 'Production' },
  { key: 'published', label: 'Published' },
];

interface WorkflowStagesProps {
  currentStage: WorkflowStage;
  onStageClick?: (stage: WorkflowStage) => void;
}

export function WorkflowStages({ currentStage, onStageClick }: WorkflowStagesProps) {
  const currentIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = onStageClick && index <= currentIndex;

          return (
            <div key={stage.key} className="flex flex-1 items-center">
              {/* Stage Circle */}
              <div className="relative flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStageClick(stage.key)}
                  disabled={!isClickable}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    isCompleted && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-background text-primary',
                    !isCompleted && !isCurrent && 'border-muted bg-background text-muted-foreground',
                    isClickable && 'cursor-pointer hover:scale-110'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </button>
                <span
                  className={cn(
                    'absolute top-12 whitespace-nowrap text-xs font-medium',
                    isCurrent && 'text-foreground',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-all',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
