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
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-700 hover:bg-gray-100 w-full justify-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="px-4 py-3 bg-black">
        <h3 className="text-sm font-semibold text-white">
          Report Sections
        </h3>
      </div>

      <ScrollArea className="flex-1 bg-white">
        <div className="py-2">
          {phases.map((phase) => (
            <button
              key={phase.code}
              onClick={() => onSwitchPhase(phase.code)}
              className={`w-full text-left px-4 py-2.5 transition-colors ${
                currentPhase === phase.code
                  ? 'bg-[#00A5E6] text-white'
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="font-normal text-sm">{phase.name}</div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="text-center text-sm font-medium text-gray-700">
          {totalFields} {totalFields === 1 ? 'field' : 'fields'} in this section
        </div>
      </div>
    </aside>
  );
}
