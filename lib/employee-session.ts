const KEY = "occ_employee_id";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getCurrentEmployeeId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setCurrentEmployeeId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, id);
    emit();
  } catch {
    // ignore
  }
}

export function clearCurrentEmployeeId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    emit();
  } catch {
    // ignore
  }
}

// useSyncExternalStore 用の購読関数。同一タブの set/clear と、別タブからの
// storage イベントの両方で再読み込みを通知する。
export function subscribeEmployeeId(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}
