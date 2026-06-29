import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iPad などを LAN / VPN 経由（localhost 以外のオリジン）で dev サーバーに
  // 接続する場合、Next.js 16 は既定で /_next/ アセットへのクロスオリジン要求を
  // ブロックする。これを許可しないとクライアント JS が読めず、ハイドレーション
  // が完了せず onClick 等が一切動かない（<a> のネイティブ遷移だけ生き残る）。
  // 接続元の IP（VPN アドレス等）を列挙する。変わったら追記すること。
  allowedDevOrigins: ["100.71.3.13", "192.0.0.2"],
};

export default nextConfig;
