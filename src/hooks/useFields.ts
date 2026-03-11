import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import type { PhaseCode, UADField } from '@/types/inspection';

export function useFields(phase: PhaseCode) {
  const [fields, setFields] = useState<UADField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFields = async () => {
      try {
        setLoading(true);
        const data = await db.fields.getByPhase(phase);
        if (mounted) {
          setFields(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFields();
    return () => { mounted = false; };
  }, [phase]);

  return { fields, loading, error };
}
