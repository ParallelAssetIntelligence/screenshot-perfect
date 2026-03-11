import { useState } from 'react';
import { useFields } from '@/hooks/useFields';
import { useFormState } from '@/hooks/useFormState';
import { usePhases } from '@/hooks/usePhases';
import { evaluateCondition } from '@/lib/inspection-utils';
import { FormFieldRenderer } from '@/components/FormFieldRenderer';
import { InspectionNavigation } from '@/components/InspectionNavigation';
import type { PhaseCode } from '@/types/inspection';
import { Loader2 } from 'lucide-react';

interface InspectionFormProps {
  userId: string;
  inspectionName: string;
  onBack: () => void;
}

export function InspectionForm({ userId, inspectionName, onBack }: InspectionFormProps) {
  const [currentPhase, setCurrentPhase] = useState<PhaseCode>('P1');
  const [currentIndex, setCurrentIndex] = useState(0);

  const { phases } = usePhases();
  const { fields, loading: fieldsLoading } = useFields(currentPhase);
  const { store, inclusion, setValue, setFieldInclusion, toggleArrayValue } = useFormState(userId, inspectionName);

  const visibleFields = fields.filter(field =>
    evaluateCondition(field.show_if, currentPhase, store)
  );
  const currentField = visibleFields[currentIndex];

  const handleNext = () => {
    if (currentIndex < visibleFields.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const handleFirst = () => setCurrentIndex(0);
  const handleLast = () => setCurrentIndex(visibleFields.length - 1);
  const handleJump = (index: number) => {
    if (index >= 0 && index < visibleFields.length) setCurrentIndex(index);
  };
  const handleSwitchPhase = (phase: PhaseCode) => {
    setCurrentPhase(phase);
    setCurrentIndex(0);
  };

  return (
    <div className="flex h-screen bg-background">
      <InspectionNavigation
        phases={phases}
        currentPhase={currentPhase}
        currentIndex={currentIndex}
        totalFields={visibleFields.length}
        onSwitchPhase={handleSwitchPhase}
        onJump={handleJump}
        onFirst={handleFirst}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onLast={handleLast}
        onBack={onBack}
      />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-foreground">{inspectionName}</h1>
            <p className="text-sm text-muted-foreground">
              Phase {currentPhase} · {visibleFields.length} visible fields
            </p>
          </div>

          {fieldsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !currentField ? (
            <div className="text-center py-20 text-muted-foreground">
              No visible fields in this phase
            </div>
          ) : (
            <FormFieldRenderer
              key={currentField.id}
              field={currentField}
              value={store[currentPhase][currentField.appsheet_column]}
              included={inclusion[currentPhase][currentField.appsheet_column] ?? true}
              onValueChange={(value) => setValue(currentPhase, currentField.appsheet_column, value)}
              onInclusionChange={(inc) => setFieldInclusion(currentPhase, currentField.appsheet_column, inc)}
              onToggleArrayValue={(val) => toggleArrayValue(currentPhase, currentField.appsheet_column, val)}
              userId={userId}
              inspectionName={inspectionName}
            />
          )}
        </div>
      </main>
    </div>
  );
}
