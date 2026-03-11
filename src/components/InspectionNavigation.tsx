import type { PhaseCode, PhaseMetadata } from '@/types/inspection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavigationProps {
  phases: PhaseMetadata[];
  currentPhase: PhaseCode;
  currentIndex: number;
  totalFields: number;
  onSwitchPhase: (phase: PhaseCode) => void;
  onJump: (index: number) => void;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  onBack: () => void;
}

export function InspectionNavigation({
  phases,
  currentPhase,
  currentIndex,
  totalFields,
  onSwitchPhase,
  onFirst,
  onPrevious,
  onNext,
  onLast,
  onBack,
}: NavigationProps) {
  return (
    <aside className="w-72 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="p-4 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
          Phases
        </h3>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {phases.map((phase) => (
            <button
              key={phase.code}
              onClick={() => onSwitchPhase(phase.code)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                currentPhase === phase.code
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent text-sidebar-foreground/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{phase.icon}</span>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{phase.name}</div>
                  <div className="text-xs opacity-70 truncate">{phase.subtitle}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="text-center text-sm font-medium">
          Field {currentIndex + 1} of {totalFields}
        </div>
        <div className="w-full bg-sidebar-accent rounded-full h-1.5">
          <div
            className="bg-sidebar-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${totalFields > 0 ? ((currentIndex + 1) / totalFields) * 100 : 0}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onFirst}
            disabled={currentIndex === 0}
            className="text-sidebar-foreground hover:bg-sidebar-accent h-9"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="text-sidebar-foreground hover:bg-sidebar-accent h-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={currentIndex >= totalFields - 1}
            className="text-sidebar-foreground hover:bg-sidebar-accent h-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLast}
            disabled={currentIndex >= totalFields - 1}
            className="text-sidebar-foreground hover:bg-sidebar-accent h-9"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
