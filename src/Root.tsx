import { useSetAtom } from "jotai";
import type { FC } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

import { elementAtom } from "@/atoms";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Main } from "@/components/Main";
import { MemoPortal } from "@/components/MemoPortal";
import { injectFetch } from "@/fetch";
import { inject } from "@/libraries/cssInjector";
import { getElements } from "@/libraries/getElements";
//import { Storage } from "@/libraries/localStorage";
import { sleep } from "@/libraries/sleep";

/**
 * Reactのルート要素
 * @constructor
 */
const Root: FC = () => {
  const setElements = useSetAtom(elementAtom);
  useEffect(() => {
    const init = async () => setElements(await getElements());
    void init();
  }, []);
  return (
    <>
      <Header />
      <Main />
      <MemoPortal />
      <Footer />
    </>
  );
};

/**
 * 初期化関数
 * ニコ動の各要素が生えたら、だんすくの初期化をする
 */
const init = async () => {
  let mainContainer,
    commentViewerContainer,
    videoContentContainer,
    videoCommentContiner,
    videoElement: HTMLVideoElement | undefined,
    count = 0;
  while (count < 300) {
    mainContainer = document.querySelectorAll(
      "div.grid-area_\\[player\\]",
    )[0] as HTMLDivElement;
    commentViewerContainer = document.querySelectorAll(
      "div.grid-area_\\[sidebar\\] > div > div",
    )[0] as HTMLDivElement;
    videoContentContainer = document.querySelectorAll(
      "div[data-name=content]",
    )[0] as HTMLDivElement;
    videoCommentContiner = document.querySelectorAll(
      "div[data-name=comment]",
    )[0] as HTMLDivElement;
    videoElement = document.querySelectorAll(
      "div[data-name=content] > video",
    )[0] as HTMLVideoElement;
    count++;
    if (
      mainContainer === undefined ||
      commentViewerContainer === undefined ||
      videoContentContainer === undefined ||
      videoCommentContiner === undefined ||
      videoElement === undefined
    ) {
      await sleep(100);
    } else {
      break;
    }
  }
  if (
    mainContainer === undefined ||
    commentViewerContainer === undefined ||
    videoContentContainer === undefined ||
    videoCommentContiner === undefined ||
    videoElement === undefined
  ) {
    throw new Error("fail to get required element");
  }
  const styleElement = document.createElement("style");
  document.head.appendChild(styleElement);
  styleElement.textContent = `
  div.grid-area_\\[player\\] > div.pos_relative > div > div > div > div.d_flex {
    z-index: 12;
  }
  #dansk\\:FooterElement {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  `;
  const timeBeforeButton = document.querySelectorAll(
    "div[role=group] > div > button.cursor_pointer",
  )[0] as HTMLButtonElement;
  // for tmp make nvapi
  window.__videoplayer = {
    autoplay: () => videoElement.autoplay,
    buffered: () => videoElement.buffered,
    canPlayType: () => videoElement.canPlayType(""),
    clear: () => {},
    crossOrigin: (crossOrigin) => {
      if (crossOrigin) {
        videoElement.crossOrigin = crossOrigin;
      }
      return videoElement.crossOrigin as crossOriginType;
    },
    currentSrc: () => videoElement.currentSrc,
    currentTime: (currentTime) => {
      if (currentTime) {
        if (currentTime < videoElement.currentTime) {
          timeBeforeButton.click();
        }
        videoElement.currentTime = currentTime;
      }
      return videoElement.currentTime;
    },
    defaultPlaybackRate: () => videoElement.defaultPlaybackRate,
    duration: () => videoElement.duration,
    element: () => videoElement,
    enableCurrentTimeSmoothing: false,
    ended: () => videoElement.ended,
    load: () => videoElement.load(),
    mirror: () => false,
    muted: (isMuted) => {
      if (isMuted !== undefined) {
        videoElement.muted = isMuted;
      }
      return videoElement.muted;
    },
    originalCurrentTime: () => videoElement.currentTime,
    pause: () => videoElement.pause(),
    paused: () => videoElement.paused,
    play: () => videoElement.play(),
    playbackRate: (rate) => {
      if (rate) {
        videoElement.playbackRate = rate;
      }
      return videoElement.playbackRate;
    },
    playbackStalled: () => false,
    seeking: () => videoElement.seeking,
    src: () => videoElement.src,
    volume: (volume) => {
      if (volume) {
        videoElement.volume = volume;
      }
      return videoElement.volume;
    },
  };
  injectFetch();
  /*
  const postBtnElement = document.querySelector(
    ".CommentPostButton",
  ) as HTMLButtonElement;
  if (postBtnElement) {
    postBtnElement.style.backgroundColor =
      Storage.get("options_disable184") === "true" ? "#ff8300" : "#007cff";
  }
  */
  if (mainContainer.parentElement !== null) {
    mainContainer.parentElement.style.gridTemplateAreas = `
      "d_header sidebar"
      "player sidebar"
      "d_footer sidebar"
      "meta sidebar"
      "bottom sidebar"
      ". sidebar"
    `;
  }
  const videoContainer = document.querySelectorAll(
    "div[data-name=stage]",
  )[0] as HTMLDivElement;
  videoContainer.addEventListener(
    "scroll",
    (e) => {
      (e.target as HTMLDivElement).scroll(0, 0);
    },
    { passive: false },
  );
  const videoController_1 = mainContainer.querySelectorAll(
    "div[tabindex='0']>div>div.p_base",
  )[0] as HTMLDivElement;
  if (videoController_1) {
    videoController_1.style.position = "relative";
    videoController_1.style.zIndex = "11";
  }
  const HeaderElement = document.createElement("div");
  mainContainer.before(HeaderElement);
  const FooterElement = document.createElement("div");
  mainContainer.after(FooterElement);
  const BackgroundImageElement = document.createElement("div");
  videoContentContainer.appendChild(BackgroundImageElement);
  const LayerElement = document.createElement("div");
  videoCommentContiner.appendChild(LayerElement);
  const MemoElement = document.createElement("div");
  commentViewerContainer.before(MemoElement);
  const MainElement = document.createElement("div");
  commentViewerContainer.before(MainElement);
  HeaderElement.id = "dansk:HeaderElement";
  MainElement.id = "dansk:MainElement";
  BackgroundImageElement.id = "dansk:BackgroundImageElement";
  FooterElement.id = "dansk:FooterElement";
  LayerElement.id = "dansk:LayerElement";
  MemoElement.id = "dansk:MemoElement";
  LayerElement.onclick = (e) => e.stopImmediatePropagation();
  LayerElement.oncontextmenu = (e) => e.stopImmediatePropagation();
  const ReactRootElement = document.createElement("div");
  document.body.append(ReactRootElement);
  const ReactRoot = createRoot(ReactRootElement);
  ReactRoot.render(<Root />);
  inject();
};
void init();
