import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReplicantOptions } from "../../../../types/browser";

export function useOnlyReplicantValue<T>(
  name: string,
  namespace?: string
): T | undefined;
export function useOnlyReplicantValue<T>(
  name: string,
  namespace: string | undefined,
  opts: ReplicantOptions<T>
): T;
export function useOnlyReplicantValue<T>(
  name: string,
  namespace?: string,
  opts?: ReplicantOptions<T>
) {
  const replicant = useMemo(
    () =>
      typeof namespace === "string"
        ? nodecg.Replicant(name, namespace, opts)
        : nodecg.Replicant(name, opts),
    [name, namespace, opts]
  );
  const [val, setVal] = useState(opts?.defaultValue);
  useEffect(() => {
    const listener = (newVal: T) => {
      setVal(newVal);
    };
    replicant.on("change", listener);
    return () => {
      replicant.removeListener("change", listener);
    };
  }, [replicant]);
  return val;
}

export function useReplicantValue<T>(
  name: string,
  namespace?: string
): [T | undefined, (val: T | ((curr: T) => T)) => any];
export function useReplicantValue<T>(
  name: string,
  namespace: string | undefined,
  opts: ReplicantOptions<T>
): [T, (val: T | ((curr: T) => T)) => any];
export function useReplicantValue<T>(
  name: string,
  namespace?: string,
  opts?: ReplicantOptions<T>
) {
  const replicant = useMemo(
    () =>
      typeof namespace === "string"
        ? nodecg.Replicant(name, namespace, opts)
        : nodecg.Replicant(name, opts),
    [name, namespace, opts]
  );
  const [val, setVal] = useState(opts?.defaultValue);
  useEffect(() => {
    const listener = (newVal: T) => {
      setVal(newVal);
    };
    replicant.on("change", listener);
    return () => {
      replicant.removeListener("change", listener);
    };
  }, [replicant]);
  const setter = useCallback(
    (newValue: T | ((curr: T) => T)) => {
      if (typeof newValue === "function") {
        replicant.value = (newValue as (curr: T) => T)(replicant.value);
      } else {
        replicant.value = newValue;
      }
    },
    [replicant]
  );
  return [val, setter] as const;
}
