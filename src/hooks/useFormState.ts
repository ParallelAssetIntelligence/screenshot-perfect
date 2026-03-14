import { useEffect, useState, useCallback, useRef } from 'react';
import { db } from '@/lib/supabase';
import { debounce, createEmptyStore } from '@/lib/inspection-utils';
import { getFieldsFromSchema } from '@/data/schemaAdapter';
import type { PhaseCode } from '@/types/inspection';

// Helper to convert field column name to label
function getFieldLabel(column: string): string {
  const fields = getFieldsFromSchema();
  const field = fields.find(f => f.appsheet_column === column);
  return field?.report_label || column;
}

// Convert internal store to label-value JSON format
function storeToFormData(store: Record<PhaseCode, Record<string, any>>): any {
  const formData: any = {};

  Object.entries(store).forEach(([phase, fields]) => {
    Object.entries(fields).forEach(([column, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const label = getFieldLabel(column);
        if (!formData[phase]) {
          formData[phase] = {};
        }
        formData[phase][label] = { label, value };
      }
    });
  });

  return formData;
}

// Convert label-value JSON format to internal store
function formDataToStore(formData: any): Record<PhaseCode, Record<string, any>> {
  const store = createEmptyStore();
  const fields = getFieldsFromSchema();

  if (!formData) return store;

  Object.entries(formData).forEach(([phase, phaseData]: [string, any]) => {
    if (phaseData && typeof phaseData === 'object') {
      Object.values(phaseData).forEach((item: any) => {
        if (item && item.label && item.value !== undefined) {
          // Find field by label
          const field = fields.find(f => f.report_label === item.label);
          if (field) {
            store[phase as PhaseCode][field.appsheet_column] = item.value;
          }
        }
      });
    }
  });

  return store;
}

export function useFormState(
  userId: string | undefined,
  inspectionName: string | undefined
) {
  const [store, setStore] = useState<Record<PhaseCode, Record<string, any>>>(createEmptyStore);
  const [inclusion, setInclusion] = useState<Record<PhaseCode, Record<string, boolean>>>(createEmptyStore);
  const [loading, setLoading] = useState(true);
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const storeRef = useRef(store);

  // Keep ref in sync
  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  // Load inspection data
  useEffect(() => {
    if (!userId || !inspectionName) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadInspection = async () => {
      try {
        let inspection = await db.inspections.getByUserAndName(userId, inspectionName);

        // Create inspection if it doesn't exist
        if (!inspection) {
          inspection = await db.inspections.create({
            user_id: userId,
            name: inspectionName,
            current_phase: 'P1',
            current_field_index: 0,
            status: 'in_progress',
            form_data: {}
          });
        }

        if (mounted) {
          setInspectionId(inspection.id);

          // Load form data
          if (inspection.form_data) {
            const loadedStore = formDataToStore(inspection.form_data);
            setStore(loadedStore);
          }
        }
      } catch (err) {
        console.error('Error loading inspection:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadInspection();
    return () => { mounted = false; };
  }, [userId, inspectionName]);

  // Auto-save debounced
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async () => {
      if (!userId || !inspectionName) return;
      try {
        const formData = storeToFormData(storeRef.current);
        await db.inspections.updateFormData(userId, inspectionName, formData);
      } catch (err) {
        console.error('Autosave error:', err);
      }
    }, 1000),
    [userId, inspectionName]
  );

  const setValue = (phase: PhaseCode, column: string, value: any) => {
    setStore(prev => ({
      ...prev,
      [phase]: { ...prev[phase], [column]: value },
    }));
    debouncedSave();
  };

  const setFieldInclusion = (phase: PhaseCode, column: string, included: boolean) => {
    setInclusion(prev => ({
      ...prev,
      [phase]: { ...prev[phase], [column]: included },
    }));
  };

  const toggleArrayValue = (phase: PhaseCode, column: string, value: string) => {
    const currentValue = store[phase][column] || [];
    const newValue = Array.isArray(currentValue) ? [...currentValue] : [];
    const index = newValue.indexOf(value);
    if (index === -1) {
      newValue.push(value);
    } else {
      newValue.splice(index, 1);
    }
    setValue(phase, column, newValue);
  };

  return { store, inclusion, loading, setValue, setFieldInclusion, toggleArrayValue };
}
