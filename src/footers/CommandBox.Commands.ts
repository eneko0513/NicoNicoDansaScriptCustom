import { commandList } from "@/@types/types";

/**
 * Mainブロックのコマンドの並びを指定
 * 列 -> 行 -> グループの順で配列に入れる
 *
 * text: ボタンに表示される文字列
 * value: 適用されるコマンド dansk:で始まるものはだんすく側で処理する
 * group: 重複できないコマンドごとのグループ
 */
const Commands: commandList = [
  [
    [
      {
        text: "Del",
        value: "dansk:deleteCommand",
        group: "command",
      },
    ],
    [
      {
        text: "#FFFFFF",
        value: "white",
        group: "color",
      },
      {
        text: "#FF0000",
        value: "red",
        group: "color",
      },
      {
        text: "#FF8080",
        value: "pink",
        group: "color",
      },
      {
        text: "#FFC000",
        value: "orange",
        group: "color",
      },
      {
        text: "#FFFF00",
        value: "yellow",
        group: "color",
      },
      {
        text: "#00FF00",
        value: "green",
        group: "color",
      },
      {
        text: "#00FFFF",
        value: "cyan",
        group: "color",
      },
      {
        text: "#0000FF",
        value: "blue",
        group: "color",
      },
      {
        text: "#C000FF",
        value: "purple",
        group: "color",
      },
      {
        text: "#000000",
        value: "black",
        group: "color",
      },
    ],
    [
      {
        text: "#CCCC99",
        value: "white2",
        group: "color",
      },
      {
        text: "#CC0033",
        value: "red2",
        group: "color",
      },
      {
        text: "#FF33CC",
        value: "pink2",
        group: "color",
      },
      {
        text: "#FF6600",
        value: "orange2",
        group: "color",
      },
      {
        text: "#999900",
        value: "yellow2",
        group: "color",
      },
      {
        text: "#00CC66",
        value: "green2",
        group: "color",
      },
      {
        text: "#00CCCC",
        value: "cyan2",
        group: "color",
      },
      {
        text: "#3399FF",
        value: "blue2",
        group: "color",
      },
      {
        text: "#6633CC",
        value: "purple2",
        group: "color",
      },
      {
        text: "#666666",
        value: "black2",
        group: "color",
      },
    ],
  ],
  [
    [
      {
        text: "B",
        value: "big",
        group: "size",
      },
      {
        text: "M",
        value: "medium",
        group: "size",
      },
      {
        text: "S",
        value: "small",
        group: "size",
      },
    ],
    [
      {
        text: "U",
        value: "ue",
        group: "pos",
      },
      {
        text: "N",
        value: "naka",
        group: "pos",
      },
      {
        text: "S",
        value: "shita",
        group: "pos",
      },
    ],
    [
      {
        text: "D",
        value: "defont",
        group: "font",
      },
      {
        text: "G",
        value: "gothic",
        group: "font",
      },
      {
        text: "M",
        value: "mincho",
        group: "font",
      },
    ],
    [
      {
        text: "end",
        value: "ender",
        group: "ender",
      },
    ],
    [
      {
        text: "full",
        value: "full",
        group: "full",
      },
    ],
    [
      {
        text: "pts",
        value: "patissier",
        group: "patissier",
      },
    ],
    [
      {
        text: "184",
        value: "184",
        group: "184",
      },
    ],
    [
      {
        text: "Inv",
        value: "invisible",
        group: "invisible",
      },
    ],
    [
      {
        text: "Cdel",
        value: "dansk:deleteComment",
        group: "command",
      },
    ],
  ],
];
export { Commands };
