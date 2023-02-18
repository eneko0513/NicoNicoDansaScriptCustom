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
