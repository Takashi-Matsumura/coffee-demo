import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { EmployeeContextBar } from "./_components/EmployeeContextBar";
import { FullscreenToggle } from "./_components/FullscreenToggle";
import "./globals.css";

const sans = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const serif = Noto_Serif_JP({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Office Coffee Compass｜AIが選ぶ、あなたとチームの一杯",
  description:
    "ローカルAIがその場で診断する、オフィス向けコーヒー体験デモ。",
  // iOS の「ホーム画面に追加」で standalone（アドレスバー無しの全画面）起動を有効化。
  // mobile-web-app-capable / apple-mobile-web-app-* メタタグを出力する。
  appleWebApp: {
    capable: true,
    title: "Coffee Compass",
    statusBarStyle: "default",
  },
};

// viewport-fit=cover にすると env(safe-area-inset-*) が有効になり、
// iOS PWA でホームインジケータ領域を避けた余白計算ができる。
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-espresso">
        <EmployeeContextBar />
        {children}
        <FullscreenToggle />
      </body>
    </html>
  );
}
