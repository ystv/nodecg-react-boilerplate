import { useCallback, useEffect, useMemo, useState } from "react";
import type { Replicant, ReplicantOptions } from "../../../../types/browser";

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
  }, [name, namespace, opts]);
  return val;
}

export function useReplicantValue<T>(
  name: string,
  namespace?: string
): [T | undefined, (val: T) => any];
export function useReplicantValue<T>(
  name: string,
  namespace: string | undefined,
  opts: ReplicantOptions<T>
): [T, (val: T) => any];
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
  }, [name, namespace, opts]);
  const setter = useCallback(
    (newValue: T) => {
      replicant.value = newValue;
    },
    [name, namespace, opts]
  );
  return [val, setter] as const;
}
