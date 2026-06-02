import { loadDefaultJapaneseParser } from "budoux";
import { Fragment } from "react";

// 日本語をフレーズ単位で折り返すためのヘルパー。
// BudouX で意味のまとまりに分割し、その境界にだけ改行候補(<wbr>)を入れる。
// 親側は break-keep（word-break: keep-all）で通常の文字単位の折り返しを止めるため、
// 「コーヒー」が「コー／ヒー」のように語の途中で割れることがなくなる。
const parser = loadDefaultJapaneseParser();

export function JaBalance({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const segments = parser.parse(children);
  return (
    <span className={`break-keep ${className ?? ""}`}>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {seg}
        </Fragment>
      ))}
    </span>
  );
}
