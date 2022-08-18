import { ReactNode } from "react";

type ownerComment = {
  time: string;
  command: string;
  comment: string;
};
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
type layerSizeData = {
  font: number;
  line: number;
  lineCount: number;
  count?: number;
  height?: number;
  margin?: number;
};
type layerLine = {
  font: number;
  line: number;
  height?: number;
  lineCount: number;
  content: string[];
};
type layerTemplate = {
  commands: string[];
  pos: commentPos;
  posList: commentPos[];
  text: string;
  value: string;
  id: string;
  areaWidth: number;
  width: number;
  height: number;
  critical: boolean;
  top: { ue: number; naka: number; shita: number };
  left: number;
  scale: { x: number; y: number };
  size: layerSizeData[];
};
type layer = layerTemplate & {
  type: string;
  font: commentFont;
  visible: boolean;
  selected: boolean;
  color: string;
  content: layerLine[];
  overwrite?: boolean;
};

type autoSave = {
  timestamp: number;
  data: layer[];
};

type optionDataType = {
  bgActive: number;
  bgImages: string[];
  bgEditing: boolean;
  bgMode: objectFitArgs;
  bgVisible: boolean;
  grid: boolean;
  replace: boolean;
};

type localStorageKeys =
  | "options_autoSave_span"
  | "options_autoSave_max"
  | "options_commandOrder"
  | "options_useCA"
  | "options_usePat"
  | "options_useOriginal"
  | "options_useOriginal_text"
  | "options_timespan_main"
  | "options_timespan_owner"
  | "options_useMs"
  | "options_lineMode"
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

type objectFitArgs = "contain" | "cover" | "fill" | "none" | "scale-down";
type crossOriginType = "anonymous" | "use-credentials";
type nvPlayerApi = {
  autoplay: () => boolean;
  buffered: () => TimeRanges;
  canPlayType: () => string;
  clear: () => undefined;
  crossOrigin: (crossOrigin?: crossOriginType) => crossOriginType;
  currentSrc: () => string;
  currentTime: (currentTime?: number) => number;
  defaultPlaybackRate: () => number;
  duration: () => number;
  element: () => HTMLVideoElement;
  enableCurrentTimeSmoothing: boolean;
  ended: () => boolean;
  load: () => unknown;
  mirror: (isMirror: boolean) => boolean | unknown;
  muted: (isMuted?: boolean) => boolean | unknown;
  originalCurrentTime: () => number;
  pause: () => unknown;
  paused: () => boolean;
  play: () => unknown;
  playbackRate: (rate?: number) => number;
  playbackStalled: () => boolean;
  seeking: () => boolean;
  src: () => string;
  volume: (volume?: number) => number;
};
declare global {
  interface Window {
    __videoplayer: nvPlayerApi;
  }
  interface Event {
    isComposing: boolean;
  }
}
