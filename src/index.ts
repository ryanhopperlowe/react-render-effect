import * as React from "react";

type Tuple<T extends unknown[] = unknown[] | []> = [T[0], ...T];

type CompareFn<T extends Tuple> = (a: T, b: T) => boolean;

export function useRenderEffect<T extends Tuple>(
  effect: (prev: T | null) => void | (() => void),
  deps: T,
  compare: CompareFn<T> = shallowCompareArray
) {
  const [prev, setPrev] = React.useState<T | null>(null);
  const [cleanup, setCleanup] = React.useState<(() => void) | null>(null);

  if (!prev || !compare(deps, prev)) {
    cleanup?.();
    const newCleanup = effect(prev) ?? null;
    setCleanup(() => newCleanup);
    setPrev(deps);
  }
}

function shallowCompareArray<T extends Tuple>(a: T, b: T) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
