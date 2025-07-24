import React, { createContext, useContext } from 'react';
import { useSystemParameters, SystemParameters } from '@/hooks/useSystemParameters';

interface SystemParametersContextValue {
  parameters: SystemParameters | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SystemParametersContext = createContext<SystemParametersContextValue | undefined>(undefined);

export function SystemParametersProvider({ children }: { children: React.ReactNode }) {
  const { parameters, loading, error, refetch } = useSystemParameters();

  return (
    <SystemParametersContext.Provider value={{ parameters, loading, error, refetch }}>
      {children}
    </SystemParametersContext.Provider>
  );
}

export function useSystemParametersContext() {
  const context = useContext(SystemParametersContext);
  if (context === undefined) {
    throw new Error('useSystemParametersContext must be used within a SystemParametersProvider');
  }
  return context;
}