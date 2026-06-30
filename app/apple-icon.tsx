import { ImageResponse } from "next/og";

// iOS の「ホーム画面に追加」で使われる apple-touch-icon を生成する（180x180）。
// コーヒーテーマ（espresso→coffee グラデ＋crema のアクセント）の頭文字アイコン。
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6b3a1d 0%, #2b1a0f 100%)",
          color: "#f6efe3",
          fontSize: 104,
          fontFamily: "serif",
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 132,
            height: 132,
            borderRadius: "50%",
            border: "5px solid #d8a878",
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size },
  );
}
