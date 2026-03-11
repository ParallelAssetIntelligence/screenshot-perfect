import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/supabase';
import { debounce, createEmptyStore } from '@/lib/inspection-utils';
import type { PhaseCode } from '@/types/inspection';

export function useFormState(
  userId: string | undefined,
  inspectionName: string | undefined
) {
  const [store, setStore] = useState<Record<PhaseCode, Record<string, any>>>(createEmptyStore);
  const [inclusion, setInclusion] = useState<Record<PhaseCode, Record<string, boolean>>>(createEmptyStore);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !inspectionName) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadResponses = async () => {
      try {
        const responses = await db.responses.getByInspection(userId, inspectionName);

        if (mounted) {
          const newStore = createEmptyStore();
          const newInclusion = createEmptyStore();

          responses.forEach(resp => {
            newStore[resp.phase][resp.field_appsheet_column] = resp.field_value;
            newInclusion[resp.phase][resp.field_appsheet_column] = resp.field_included;
          });

          setStore(newStore);
          setInclusion(newInclusion);
        }
      } catch (err) {
        console.error('Error loading responses:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadResponses();
    return () => { mounted = false; };
  }, [userId, inspectionName]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (
      phase: PhaseCode,
      column: string,
      value: any,
      included: boolean
    ) => {
      if (!userId || !inspectionName) return;
      try {
        await db.responses.upsert({
          user_id: userId,
          inspection_name: inspectionName,
          phase,
          field_appsheet_column: column,
          field_value: value,
          field_included: included,
        });
      } catch (err) {
        console.error('Autosave error:', err);
      }
    }, 500),
    [userId, inspectionName]
  );

  const setValue = (phase: PhaseCode, column: string, value: any) => {
    setStore(prev => ({
      ...prev,
      [phase]: { ...prev[phase], [column]: value },
    }));
    const included = inclusion[phase][column] ?? true;
    debouncedSave(phase, column, value, included);
  };

  const setFieldInclusion = (phase: PhaseCode, column: string, included: boolean) => {
    setInclusion(prev => ({
      ...prev,
      [phase]: { ...prev[phase], [column]: included },
    }));
    const value = store[phase][column];
    debouncedSave(phase, column, value, included);
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
