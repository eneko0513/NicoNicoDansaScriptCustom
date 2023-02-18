import { commentFont, commentPos } from "@/@types/types";

export type layerTemplate = {
  /** 適用するコマンド */
  commands: string[];
  /** 初期位置 */
  pos: commentPos;
  /** テンプレが対応している位置 */
  posList: commentPos[];
  /** テンプレート名 */
  text: string;
  /** 旧だんすくの識別名 */
  value: string;
  /** 配列のキー */
  id: string;
  /** textareaの横幅(px) */
  areaWidth: number;
  /** 横幅 */
  width: number;
  /** 行数 */
  height: number;
  /** 臨海幅 or DRの場合にtrue */
  critical: boolean;
  /** DRの画面外幅(片側)・DRでない場合は指定不要 */
  drWidth?: number;
  /** 各テンプレごとのtop位置(px) */
  top: { ue: number; naka: number; shita: number };
  /** left位置(px) */
  left: number;
  /** x/yそれぞれのtransform scaleの値 */
  scale: { x: number; y: number };
  /** {
  font: font-size(px)
  line: line-height(px)
  lineCount: 行数
  height: height(px)
  count: 何回繰り返すか
} */
  size: layerCommentTemplate[];
};

export type layerCommentTemplate = {
  font: number;
  line: number;
  lineCount: number;
  count?: number;
  height?: number;
  margin?: number;
};

export type layer = layerTemplate & {
  type: string;
  font: commentFont;
  visible: boolean;
  selected: boolean;
  color: string;
  content: layerComment[];
  overwrite?: boolean;
  layerId: string;
};
export type layerComment = {
  font: number;
  line: number;
  height?: number;
  lineCount: number;
  content: string[];
};

export type layerLineWidth = {
  width: number;
  leftSpaceWidth: number;
  index: number;
};
export type layerCommentWidth = layerLineWidth[];
export type layerWidth = layerCommentWidth[];
