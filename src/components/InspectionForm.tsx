import { useState } from 'react';
import { useFields } from '@/hooks/useFields';
import { useFormState } from '@/hooks/useFormState';
import { usePhases } from '@/hooks/usePhases';
import { evaluateCondition } from '@/lib/inspection-utils';
import { FormFieldRenderer } from '@/components/FormFieldRenderer';
import { InspectionNavigation } from '@/components/InspectionNavigation';
import { UADGuidance } from '@/components/UADGuidance';
import type { PhaseCode } from '@/types/inspection';
import { Loader2 } from 'lucide-react';

interface InspectionFormProps {
  userId: string;
  inspectionName: string;
  onBack: () => void;
}

export function InspectionForm({ userId, inspectionName, onBack }: InspectionFormProps) {
  const [currentPhase, setCurrentPhase] = useState<PhaseCode>('P1');

  const { phases } = usePhases();
  const { fields, loading: fieldsLoading } = useFields(currentPhase);
  const { store, inclusion, setValue, setFieldInclusion, toggleArrayValue } = useFormState(userId, inspectionName);

  const visibleFields = fields.filter(field =>
    evaluateCondition(field.show_if, currentPhase, store)
  );

  return (
    <div className="flex h-screen bg-background">
      <InspectionNavigation
        phases={phases}
        currentPhase={currentPhase}
        currentIndex={0}
        totalFields={visibleFields.length}
        onSwitchPhase={setCurrentPhase}
        onJump={() => {}}
        onFirst={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        onLast={() => {}}
        onBack={onBack}
      />

      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="mb-4">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">{inspectionName}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {currentPhase} · {visibleFields.length} visible fields
            </p>
          </div>

          {fieldsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : visibleFields.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No visible fields in this section
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {visibleFields.map((field, index) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={store[currentPhase][field.appsheet_column]}
                  included={inclusion[currentPhase][field.appsheet_column] ?? true}
                  onValueChange={(value) => setValue(currentPhase, field.appsheet_column, value)}
                  onInclusionChange={(inc) => setFieldInclusion(currentPhase, field.appsheet_column, inc)}
                  onToggleArrayValue={(val) => toggleArrayValue(currentPhase, field.appsheet_column, val)}
                  userId={userId}
                  inspectionName={inspectionName}
                  isLast={index === visibleFields.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <UADGuidance currentPhase={currentPhase} />
    </div>
  );
}
