declare module "*.css";
declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
interface Window {
  __videoplayer: NvPlayerApi;
  __reactRouterDataRouter: ReactRouter;
}

interface Event {
  isComposing: boolean;
}

type crossOriginType = "anonymous" | "use-credentials";

type NvPlayerApi = {
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
  mirror: (isMirror: boolean) => boolean;
  muted: (isMuted?: boolean) => boolean;
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

type PlayerOperation = {
  bufferedTime: { get: () => number };
  commentVisibility: {
    isVisible: boolean;
    set: (isVisible: boolean) => void;
  };
  currentTime: {
    get: () => number;
    set: (time: number) => void;
  };
  duration: number;
  loop: {
    isLoop: boolean;
    toggle: () => void;
    set: (isLoop: boolean) => void;
  };
  mute: {
    isMuted: boolean;
    toggle: () => void;
    set: (isMuted: boolean) => void;
  };
  playback: {
    isPlaying: boolean;
    toggle: () => void;
    play: () => void;
    pause: () => void;
  };
  seek: {
    backward: () => void;
    backwardSeconds: number;
    forward: () => void;
    forwardSeconds: number;
    isForbidden: boolean;
    isSeeking: boolean;
    set: (time: number) => void;
    toHead: () => void;
  };
  volume: {
    get: () => number;
    set: (volume: number) => void;
    down: () => void;
    up: () => void;
  };
};

interface ReactRouter {
  subscribe: (callback: (state: RouterState) => void) => () => void;
  state: RouterState;
}

interface RouterState {
  historyAction: "PUSH" | "POP" | "REPLACE";
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: null;
    key: string;
  };
}

type ReactFiber = {
  child?: ReactFiber;
  memoizedProps?: { [key: string]: unknown };
};
