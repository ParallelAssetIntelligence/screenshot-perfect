import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import type { PhaseMetadata } from '@/types/inspection';

export function usePhases() {
  const [phases, setPhases] = useState<PhaseMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchPhases = async () => {
      try {
        const data = await db.phases.getAll();
        if (mounted) setPhases(data);
      } catch (err) {
        console.error('Error fetching phases:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPhases();
    return () => { mounted = false; };
  }, []);

  return { phases, loading };
}
