import { CharList } from "@/@types/types";

/**
 * 横幅情報を格納するObject
 * minchoとgothicの幅が同じならMonoChar型、
 * 異なるならProChar型を使用する
 * ここにどちらかの型で指定すれば反映される
 *
 * キーは正規表現or対象文字
 * 同じ幅の文字が他にない場合はキーを文字にすることで処理時間を短縮できる
 */
const CharList: CharList = {
  "\u2003": {
    width: 12,
    isSpace: true,
  },
  "\u2002": {
    width: 6,
    isSpace: true,
  },
  "\u2004": {
    width: 4,
    isSpace: true,
  },
  "\u2005": {
    width: 3,
    isSpace: true,
  },
  "\u2006": {
    width: 2,
    isSpace: true,
  },
  "\u200A": {
    width: 1,
    isSpace: true,
  },
  "[\u005F\u00AF\u2012\u2013\u203e\u2216\uFFE8\uff66-\uff9f]": {
    width: 6,
    isSpace: false,
  },
  "[\u2580\u2590\u2591\u2592]": {
    width: 8.5,
    isSpace: false,
  },
  "\u2043": {
    width: 3.692307,
    isSpace: false,
  },
  "\u01C0": {
    width: 3.111111,
    isSpace: false,
  },
  "\u002F": {
    width: 5.647058,
    isSpace: false,
  },
  "[\u2596-\u259f]": {
    width: 11.25,
    isSpace: false,
  },
  "[\u002d\u2011]": {
    width: {
      gothic: 5.25,
      mincho: 10.1,
    },
    isSpace: false,
  },
  "\u23af": {
    width: 6.28125,
    isSpace: false,
  },
  "[\u23ba-\u23bd]": {
    width: 6.046875,
    isSpace: false,
  },
  "[\u2574\u2576\u2578\u257a]": {
    width: 7.6875,
    isSpace: false,
  },
  "\u2796": {
    width: 16.5,
    isSpace: false,
  },
  "\u29ff": {
    width: 8.953125,
    isSpace: false,
  },
  "\u2e0f": {
    width: 0,
    isSpace: false,
  },
  "\ua7f7": {
    width: 9.28125,
    isSpace: false,
  },
  "\ufe58": {
    width: {
      gothic: 6,
      mincho: 5.9,
    },
    isSpace: false,
  },
  "[\u141f\u1420]": {
    width: 4.03125,
    isSpace: false,
  },
  "[\u17f6\u17f8]": {
    width: 3.234375,
    isSpace: false,
  },
  "\u2044": {
    width: 0.9375,
    isSpace: false,
  },
  "[\u29f5-\u29f7]": {
    width: 6.140625,
    isSpace: false,
  },
  "[\u29f8\u29f9]": {
    width: 9.65625,
    isSpace: false,
  },
  "\u2afd": {
    width: 8.0625,
    isSpace: false,
  },
  "\u028e": {
    width: 11.6195122,
    isSpace: false,
  },
  "[\u0028\u0029]": {
    width: 4.363636364,
    isSpace: false,
  },
  "\u263b": {
    width: 12.63157895,
    isSpace: false,
  },
  "\u2688": {
    width: 10.10526316,
    isSpace: false,
  },
  "[\u2b2c\u2b2d]": {
    width: 9.818181818,
    isSpace: false,
  },
  "[\u002c\u002e]": {
    width: 3.096774194,
    isSpace: false,
  },
  "[\u2575\u2577\u2579\u257b]": {
    width: 8,
    isSpace: false,
  },
  "\u0021": {
    width: 3.84,
    isSpace: false,
  },
  "\u007c": {
    width: 4.666666667,
    isSpace: false,
  },
  "\u006c": {
    width: 3.219512195,
    isSpace: false,
  },
  "\u0069": {
    width: 3.454545455,
    isSpace: false,
  },
  "[\u00b2\u00b3\u00b9\u2070\u2074-\u2089]": {
    width: 4.444444444,
    isSpace: false,
  },
  "[\u207a-\u207c\u208a-\u208c]": {
    width: 3.333333333,
    isSpace: false,
  },
  "[\u207d-\u207f\u208d\u208e]": {
    width: 2.666666667,
    isSpace: false,
  },
  "\u2071": {
    width: 2,
    isSpace: false,
  },
  "[\u2800-\u28ff]": {
    width: 9.033750000000001,
    isSpace: false,
  },
  default: {
    width: 12,
    isSpace: false,
  },
};
export { CharList };
