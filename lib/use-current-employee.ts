"use client";

import { useSyncExternalStore } from "react";
import { getCurrentEmployeeId, subscribeEmployeeId } from "./employee-session";

// localStorage 上の現在の社員 ID を外部ストアとして購読する。
// effect 内での setState を避けつつ、SSR / ハイドレーションも安全に扱う
// （サーバ・初回ハイドレーションは null、その後クライアント値へ）。
export function useCurrentEmployeeId(): string | null {
  return useSyncExternalStore(
    subscribeEmployeeId,
    getCurrentEmployeeId,
    () => null,
  );
}
