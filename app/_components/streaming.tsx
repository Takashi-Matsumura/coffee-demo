"use client";

import { useEffect, useRef, useState } from "react";

export type StreamStatus = "streaming" | "done" | "error";

/**
 * 指定 URL に POST し、text/plain のストリーミング応答を逐次 state に流し込む。
 * 診断結果カードと管理画面インサイトで共有する。
 *
 * reloadKey を変更すると state をリセットして再取得する（再生成ボタン用途）。
 * 同じ reloadKey に対しては一度しか fetch しないため、React StrictMode の
 * 二重 effect 実行でも本番同様に 1 回だけ取得する。
 */
export function useStreamingText(
  url: string,
  body: unknown,
  reloadKey: number = 0,
): { text: string; status: StreamStatus } {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<StreamStatus>("streaming");
  const startedKeyRef = useRef<number | null>(null);
  const bodyRef = useRef(body);
  bodyRef.current = body;

  useEffect(() => {
    if (startedKeyRef.current === reloadKey) return;
    startedKeyRef.current = reloadKey;
    setText("");
    setStatus("streaming");

    (async () => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyRef.current),
        });
        if (!res.ok || !res.body) {
          setStatus("error");
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          setText((prev) => prev + decoder.decode(value, { stream: true }));
        }
        setStatus("done");
      } catch {
        setStatus("error");
      }
    })();
  }, [url, reloadKey]);

  return { text, status };
}

/**
 * `【見出し】本文…` 形式のストリーム本文を、見出しと本文の span に分割描画する。
 * 見出しの class は呼び出し側で渡す（カードと管理画面で字間・余白が異なるため）。
 */
export function renderStreamSections(text: string, headingClassName: string) {
  if (!text) return null;
  const parts = text.split(/(【[^】]+】)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (/^【[^】]+】$/.test(p)) {
      return (
        <span key={i} className={headingClassName}>
          {p}
        </span>
      );
    }
    return (
      <span key={i} className="block">
        {p.replace(/^\s+/, "")}
      </span>
    );
  });
}
