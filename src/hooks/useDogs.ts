import { useCallback, useEffect, useState } from 'react';
import { supabase, type Dog } from '@/lib/supabase';

export function useDogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('dogs')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError("Impossible de charger le catalogue. Vérifiez la connexion à la base de données.");
    } else {
      setDogs(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { dogs, loading, error, reload: load };
}
