import { layer, layerTemplate } from "@/@types/layer";
import { ReactNode } from "react";

/** 投稿者コメント */
type ownerComment = {
  /** 時間: mm:ss.ss */
  time: string;
  /** コマンド(スペース区切り) */
  command: string;
  /** コメントデータ */
  comment: string;
};

type convertFormat = "domo" | "tokome" | "dansk";
type contextTypeNullable = {
  videoElement?: HTMLVideoElement;
  commentCommandInput?: HTMLInputElement;
  commentInputTextarea?: HTMLTextAreaElement;
  videoSymbolContainerCanvas?: HTMLCanvasElement;
  HeaderElement?: HTMLDivElement;
  MainElement?: HTMLDivElement;
  BackgroundImageElement?: HTMLDivElement;
  FooterElement?: HTMLDivElement;
  LayerElement?: HTMLDivElement;
  MemoElement?: HTMLDivElement;
  exportLayer?: string[];
  setExportLayer?: (layerString: string[]) => void;
};
type contextType = {
  videoElement: HTMLVideoElement;
  commentCommandInput: HTMLInputElement;
  commentInputTextarea: HTMLTextAreaElement;
  HeaderElement: HTMLDivElement;
  MainElement: HTMLDivElement;
  BackgroundImageElement: HTMLDivElement;
  FooterElement: HTMLDivElement;
  LayerElement: HTMLDivElement;
  MemoElement: HTMLDivElement;
  exportLayer: layer[];
  setExportLayer: (layer: layer[]) => void;
};
type contextProps = {
  children: ReactNode;
  value?: contextTypeNullable;
};

type commentPos = "ue" | "naka" | "shita";
type commentFont = "mincho" | "gothic";

type command = {
  text: string;
  value: string;
  group: string;
};
type commandList = command[][][];

type MonoChar = {
  width: number;
  isSpace: boolean;
};
type ProChar = {
  width: {
    mincho: number;
    gothic: number;
  };
  isSpace: boolean;
};
type CharList = {
  [key: string]: MonoChar | ProChar;
  default: MonoChar | ProChar;
};

type layerTemplates = {
  [key: string]: layerTemplate;
};

type autoSave = {
  timestamp: number;
  data: layer[];
};

type localStorageKeys =
  | "options_autoSave_span"
  | "options_autoSave_max"
  | "options_commandOrder"
  | "options_useCA"
  | "options_usePat"
  | "options_useOriginal"
  | "options_useOriginal_text"
  | "options_exportLayerName"
  | "options_timespan_main"
  | "options_timespan_owner"
  | "options_useMs"
  | "options_lineMode"
  | "options_exportHiddenLayer"
  | "options_showSelectedLayerOnTop"
  | "options_addDatetimeToFilename"
  | "display_trace"
  | "display_memo"
  | "display_time"
  | "display_main"
  | "display_box"
  | "autoSave"
  | "memo"
  | "ppConvertBefore"
  | "ppConvertBeforeType"
  | "ppConvertAfter"
  | "ppConvertAfterType";
type localStorageItem = {
  defaultValue: string;
};
type localStorageOptionItem = localStorageItem & {
  description: string;
  dangerous: boolean;
  type: "string" | "boolean" | "number";
  required?: localStorageKeys;
};
type localStorageDefaultValues = {
  [key in localStorageKeys]: localStorageItem | localStorageOptionItem;
};
