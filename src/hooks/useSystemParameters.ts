import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemParameters {
  t_bills_rate: number;
  safe_tier_multiplier: number;
  target_tier_distribution: {
    safe: number;
    conservative: number;
    balanced: number;
    hero: number;
  };
  performance_fee_allocation: {
    bonus_pool: number;
    buyback_pool: number;
    protocol_revenue: number;
    insurance_reserve: number;
  };
  tier_breakpoints: {
    safe: [number, number];
    conservative: [number, number];
    balanced: [number, number];
    hero: [number, number];
  };
  tier_formulas: {
    safe: string;
    conservative: string;
    balanced: string;
    hero: string;
  };
}

export function useSystemParameters() {
  const [parameters, setParameters] = useState<SystemParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get from Edge Function for better performance
      const { data, error: functionError } = await supabase.functions.invoke('get-system-parameters');
      
      if (functionError) {
        console.warn('Edge function failed, falling back to direct query:', functionError);
        
        // Fallback to direct database query
        const { data: dbData, error: dbError } = await supabase
          .from('system_parameters')
          .select('*');

        if (dbError) throw dbError;

        // Transform array to object
        const parametersObject = dbData.reduce((acc, param) => {
          acc[param.key] = param.value;
          return acc;
        }, {} as Record<string, any>);

        setParameters(parametersObject as SystemParameters);
      } else {
        setParameters(data.parameters as SystemParameters);
      }
    } catch (err) {
      console.error('Error fetching system parameters:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch parameters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();

    // Set up real-time subscription for parameter changes
    const subscription = supabase
      .channel('system-parameters-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_parameters'
      }, () => {
        console.log('System parameters changed, refetching...');
        fetchParameters();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    parameters,
    loading,
    error,
    refetch: fetchParameters
  };
}