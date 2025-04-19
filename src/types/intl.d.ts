
interface Segmenter {
  segment(input: string): { segment: string }[];
}

declare namespace Intl {
  var Segmenter: {
    prototype: Segmenter;
    new(locale: string, options?: { granularity: "grapheme" | "word" | "sentence" }): Segmenter;
  };
}
