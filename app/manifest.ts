import type { MetadataRoute } from "next";

// PWA マニフェスト。Safari の「ホーム画面に追加」で standalone（アドレスバー無し）
// 起動を可能にする。iPad ではアイコンは apple-icon.tsx 由来の apple-touch-icon が
// 使われ、display も実質的にメタタグ（appleWebApp）側で制御される。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Office Coffee Compass",
    short_name: "Coffee Compass",
    description: "ローカルAIがその場で診断する、オフィス向けコーヒー体験デモ。",
    start_url: "/",
    display: "standalone",
    orientation: "landscape",
    background_color: "#f6efe3",
    theme_color: "#2b1a0f",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
