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

  const handleSwitchPhase = (phase: PhaseCode) => {
    setCurrentPhase(phase);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <InspectionNavigation
        phases={phases}
        currentPhase={currentPhase}
        currentIndex={0}
        totalFields={visibleFields.length}
        onSwitchPhase={handleSwitchPhase}
        onJump={() => {}}
        onFirst={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        onLast={() => {}}
        onBack={onBack}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900">{inspectionName}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentPhase} · {visibleFields.length} visible fields
            </p>
          </div>

          {fieldsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#00A5E6]" />
            </div>
          ) : visibleFields.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No visible fields in this section
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
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
