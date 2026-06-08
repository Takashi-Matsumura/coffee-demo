"use client";

import { useSyncExternalStore } from "react";
import type { PersonalAnswers } from "./types";

// 個人診断の回答は ResultCard が sessionStorage に書き、注文ページが読む。
// 読み取り側を外部ストアとして購読し、effect 内 setState を避ける。
const KEY = "occ_last_personal_answers";

// useSyncExternalStore の getSnapshot は参照が安定している必要があるため、
// 生文字列が変わらない限りパース済みオブジェクトをキャッシュして返す。
let cachedRaw: string | null = null;
let cachedValue: PersonalAnswers | null = null;
let initialized = false;

function read(): PersonalAnswers | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (!initialized || raw !== cachedRaw) {
    initialized = true;
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as PersonalAnswers) : null;
    } catch {
      cachedValue = null;
    }
  }
  return cachedValue;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

export function useStoredPersonalAnswers(): PersonalAnswers | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
