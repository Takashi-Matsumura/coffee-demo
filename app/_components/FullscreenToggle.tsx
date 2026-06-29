"use client";

import { useSyncExternalStore } from "react";

// iPadOS / Chrome は WebKit ベースのため webkit プレフィックス付き API も拾う。
// iPadOS 16.4+ で Fullscreen API が使えるようになっており、それ未満や非対応端末
// （iPhone など）ではボタンを出さない。
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function getFullscreenElement(): Element | null {
  const doc = document as FullscreenDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function isSupported(): boolean {
  const el = document.documentElement as FullscreenElement;
  return Boolean(el.requestFullscreen || el.webkitRequestFullscreen);
}

// フルスクリーン状態と対応可否をまとめて useSyncExternalStore で購読する。
// ブラウザ状態の読み取りをフックに集約し、SSR とのハイドレーション不整合を避ける。
function subscribe(callback: () => void) {
  document.addEventListener("fullscreenchange", callback);
  document.addEventListener("webkitfullscreenchange", callback);
  return () => {
    document.removeEventListener("fullscreenchange", callback);
    document.removeEventListener("webkitfullscreenchange", callback);
  };
}

// snapshot を安定した文字列にして、値が変わらない限り同一参照を返す。
function getSnapshot(): "off" | "on" | "unsupported" {
  if (!isSupported()) return "unsupported";
  return getFullscreenElement() ? "on" : "off";
}

// サーバー初期描画とハイドレーション初回は常に unsupported（= 非表示）に揃える。
function getServerSnapshot(): "off" | "on" | "unsupported" {
  return "unsupported";
}

export function FullscreenToggle() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (state === "unsupported") return null;

  const isFullscreen = state === "on";

  async function toggle() {
    try {
      if (getFullscreenElement()) {
        const doc = document as FullscreenDocument;
        await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
      } else {
        const el = document.documentElement as FullscreenElement;
        await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.());
      }
    } catch {
      // ユーザー操作以外の発火など失敗時は無視（次のタップで再試行可能）。
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFullscreen ? "フルスクリーンを終了" : "フルスクリーン表示"}
      title={isFullscreen ? "フルスクリーンを終了" : "フルスクリーン表示"}
      className="fixed bottom-4 right-4 z-50 flex size-11 items-center justify-center rounded-full border border-coffee/20 bg-cream-soft/90 text-espresso shadow-lg backdrop-blur transition hover:bg-cream active:scale-95"
    >
      <span aria-hidden className="text-lg leading-none">
        {isFullscreen ? "⤧" : "⛶"}
      </span>
    </button>
  );
}
