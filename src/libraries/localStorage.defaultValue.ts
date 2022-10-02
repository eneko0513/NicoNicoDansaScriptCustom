import { localStorageDefaultValues } from "@/@types/types";

const defaultValue: localStorageDefaultValues = {
  options_autoSave_span: {
    defaultValue: "5",
    description: "自動保存の間隔(分) / 0で無効 / 反映には再読み込みが必要",
    dangerous: false,
    type: "number",
  },
  options_autoSave_max: {
    defaultValue: "10",
    description: "自動保存の最大数",
    dangerous: false,
    type: "number",
  },
  options_commandOrder: {
    defaultValue:
      "layerName|ca|patissier|size|position|color|font|ender|full|original",
    description: "コマンドの並び替え",
    dangerous: false,
    type: "string",
  },
  options_useCA: {
    defaultValue: "true",
    description: "CAコマンドを追加",
    dangerous: false,
    type: "boolean",
  },
  options_usePat: {
    defaultValue: "true",
    description: "patissierコマンドを追加",
    dangerous: false,
    type: "boolean",
  },
  options_useOriginal: {
    defaultValue: "false",
    description: "独自コマンドを追加",
    dangerous: false,
    type: "boolean",
  },
  options_useOriginal_text: {
    defaultValue: "",
    description: "追加する独自コマンドを入力",
    dangerous: false,
    type: "string",
    required: "options_useOriginal",
  },
  options_exportLayerName: {
    defaultValue: "false",
    description: "レイヤー名をコマンドに追加",
    dangerous: false,
    type: "boolean",
  },
  options_timespan_owner: {
    defaultValue: "1000",
    description: "投稿者コメントで投下時の間隔(ms)",
    dangerous: true,
    type: "number",
  },
  options_timespan_main: {
    defaultValue: "6000",
    description: "視聴者コメントで投下時の間隔(ms)",
    dangerous: true,
    type: "number",
  },
  options_useMs: {
    defaultValue: "true",
    description: "tmコマンドをミリ秒として解釈",
    dangerous: false,
    type: "boolean",
  },
  options_lineMode: {
    defaultValue: "false",
    description: "#000000を#010101に置換",
    dangerous: false,
    type: "boolean",
  },
  display_trace: {
    defaultValue: "true",
  },
  display_memo: {
    defaultValue: "true",
  },
  display_time: {
    defaultValue: "true",
  },
  display_main: {
    defaultValue: "true",
  },
  display_box: {
    defaultValue: "true",
  },
  autoSave: {
    defaultValue: "[]",
  },
  memo: {
    defaultValue: "",
  },
  ppConvertBefore: {
    defaultValue: "",
  },
  ppConvertBeforeType: {
    defaultValue: "",
  },
  ppConvertAfter: {
    defaultValue: "",
  },
  ppConvertAfterType: {
    defaultValue: "",
  },
};
export default defaultValue;
