export type Ad = {
  id: string;
  title: string;
  caption?: string;
  src: string;
  sponsor?: string;
  poster?: string;
};

// 広告動画は /public/ads/ に mp4 を置き、下の配列に登録すると、
// トップ画面のヒーロー内プレイヤーで順番にローテーション再生されます。
// （未登録/読み込み失敗時はプレースホルダ表示にフォールバックします）
export const ads: Ad[] = [
  // {
  //   id: "compass-deep",
  //   title: "新作ブレンド「Compass Deep」",
  //   caption: "深煎り × フローラルアロマ",
  //   sponsor: "Coffee Compass Roastery",
  //   src: "/ads/compass-deep.mp4",
  //   poster: "/ads/compass-deep.jpg",
  // },
];
