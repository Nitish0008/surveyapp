import { useContext } from 'react';
import { CensusContext } from '../store/censusContextValue';

export function useCensus() {
  const ctx = useContext(CensusContext);
  if (!ctx) {
    throw new Error('useCensus must be used within CensusProvider');
  }
  return ctx;
}
