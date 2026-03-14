import { useState } from 'react';
import type { PhaseCode, PhaseMetadata } from '@/types/inspection';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Menu } from 'lucide-react';
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

function NavContent({
  phases,
  currentPhase,
  totalFields,
  onSwitchPhase,
  onBack,
  onClose,
}: {
  phases: PhaseMetadata[];
  currentPhase: PhaseCode;
  totalFields: number;
  onSwitchPhase: (phase: PhaseCode) => void;
  onBack: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { onBack(); onClose?.(); }}
          className="text-foreground hover:bg-muted w-full justify-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="px-4 py-3 bg-foreground">
        <h3 className="text-sm font-semibold text-background">
          Report Sections
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {phases.map((phase) => (
            <button
              key={phase.code}
              onClick={() => { onSwitchPhase(phase.code); onClose?.(); }}
              className={`w-full text-left px-4 py-2.5 transition-colors text-sm ${
                currentPhase === phase.code
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              {phase.name}
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3 sm:p-4">
        <div className="text-center text-xs sm:text-sm font-medium text-muted-foreground">
          {totalFields} {totalFields === 1 ? 'field' : 'fields'} in this section
        </div>
      </div>
    </div>
  );
}

export function InspectionNavigation(props: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: hamburger trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border px-3 py-2 flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <NavContent {...props} onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium text-foreground truncate">
          {props.phases.find(p => p.code === props.currentPhase)?.name || props.currentPhase}
        </span>
      </div>

      {/* Desktop: fixed sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-card border-r border-border flex-col shrink-0">
        <NavContent {...props} />
      </aside>
    </>
  );
}
