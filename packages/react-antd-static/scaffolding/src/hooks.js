import { useRef, useMemo } from 'react';
import equals from 'fast-deep-equal';

export function useDeepDependencies(dependencies) {
  const memo = useRef([]);

  if (!equals(memo.current, dependencies)) {
    memo.current = dependencies;
  }

  return memo.current;
}

export function useDeepMemo(callback, dependencies) {
  const memoizedDependencies = useDeepDependencies(dependencies);
  return useMemo(callback, memoizedDependencies);
}
