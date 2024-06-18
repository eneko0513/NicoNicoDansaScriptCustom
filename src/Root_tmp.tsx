import { useSetAtom } from "jotai";
import type { FC } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

import { elementAtom } from "@/atoms";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Main } from "@/components/Main";
//import { MemoPortal } from "@/components/MemoPortal";
import { injectFetchTmp } from "@/fetch";
import { inject } from "@/libraries/cssInjector";
import { getElementsTmp } from "@/libraries/getElements";
//import { Storage } from "@/libraries/localStorage";
import { sleep } from "@/libraries/sleep";

/**
 * Reactのルート要素
 * @constructor
 */
const Root: FC = () => {
  const setElements = useSetAtom(elementAtom);
  useEffect(() => {
    const init = async () => setElements(await getElementsTmp());
    void init();
  }, []);
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

/**
 * 初期化関数
 * ニコ動の各要素が生えたら、だんすくの初期化をする
 */
const init = async () => {
  let mainElement,
    mainContainer,
    mainContainerPlayer,
    mainContainerComment,
    //CommentRenderer,
    videoSymbolContainerCanvas,
    videoContainer,
    //mainContainerPlayerPanel,
    videoPlayer: HTMLVideoElement | undefined,
    count = 0;
  while (count < 300) {
    mainElement = document.getElementsByTagName("main")[0] as HTMLDivElement;
    mainContainer = mainElement?.children[0] as HTMLDivElement;
    mainContainerPlayer = mainContainer?.children[0] as HTMLDivElement;
    mainContainerComment = mainContainer?.children[1] as HTMLDivElement;
    //mainContainerPlayerPanel = mainContainer?.getElementsByClassName(
    //  "MainContainer-playerPanel",
    //)[0] as HTMLDivElement;
    //if (mainContainer?.getElementsByClassName("CommentRenderer").length > 0)
    //CommentRenderer = mainContainer?.getElementsByClassName(
    //  "CommentRenderer",
    //)[0] as HTMLDivElement;
    videoSymbolContainerCanvas = mainContainerPlayer?.querySelector(
      "div[data-name=comment]",
    ) as HTMLDivElement;
    videoContainer = mainContainerPlayer?.querySelector(
      "div[data-name=stage]",
    ) as HTMLDivElement;
    videoPlayer = mainContainerPlayer?.querySelector(
      "video[data-name=video-content]",
    ) as HTMLVideoElement;
    count++;
    if (
      mainElement === undefined ||
      mainContainer === undefined ||
      mainContainerPlayer === undefined ||
      mainContainerComment === undefined ||
      //mainContainerPlayerPanel === undefined ||
      //CommentRenderer === undefined ||
      videoSymbolContainerCanvas === undefined ||
      videoContainer === undefined ||
      videoPlayer === undefined ||
      videoPlayer.parentElement === null
    ) {
      await sleep(100);
    } else {
      break;
    }
  }
  if (
    mainElement === undefined ||
    mainContainer === undefined ||
    mainContainerPlayer === undefined ||
    mainContainerComment === undefined ||
    //mainContainerPlayerPanel === undefined ||
    //CommentRenderer === undefined ||
    videoSymbolContainerCanvas === undefined ||
    videoContainer === undefined ||
    videoPlayer === undefined ||
    videoPlayer.parentElement === null
  ) {
    throw new Error("fail to get required element");
  }
  videoContainer.addEventListener(
    "scroll",
    (e) => {
      (e.target as HTMLDivElement).scroll(0, 0);
    },
    { passive: false },
  );
  // z-index
  Array.from(mainContainerPlayer.children).forEach((t: Element, i: number) => {
    if (i !== 0) {
      const el = t as HTMLDivElement;
      el.style.pointerEvents = "none";
    }
  });
  // for tmp make nvapi
  window.__videoplayer = {
    autoplay: () => videoPlayer.autoplay,
    buffered: () => videoPlayer.buffered,
    canPlayType: () => videoPlayer.canPlayType(""),
    clear: () => {},
    crossOrigin: (crossOrigin) => {
      if (crossOrigin) {
        videoPlayer.crossOrigin = crossOrigin;
      }
      return videoPlayer.crossOrigin as crossOriginType;
    },
    currentSrc: () => videoPlayer.currentSrc,
    currentTime: (currentTime) => {
      if (currentTime) {
        videoPlayer.currentTime = currentTime;
      }
      return videoPlayer.currentTime;
    },
    defaultPlaybackRate: () => videoPlayer.defaultPlaybackRate,
    duration: () => videoPlayer.duration,
    element: () => videoPlayer,
    enableCurrentTimeSmoothing: false,
    ended: () => videoPlayer.ended,
    load: () => videoPlayer.load(),
    mirror: () => false,
    muted: (isMuted) => {
      if (isMuted !== undefined) {
        videoPlayer.muted = isMuted;
      }
      return videoPlayer.muted;
    },
    originalCurrentTime: () => videoPlayer.currentTime,
    pause: () => videoPlayer.pause(),
    paused: () => videoPlayer.paused,
    play: () => videoPlayer.play(),
    playbackRate: (rate) => {
      if (rate) {
        videoPlayer.playbackRate = rate;
      }
      return videoPlayer.playbackRate;
    },
    playbackStalled: () => false,
    seeking: () => videoPlayer.seeking,
    src: () => videoPlayer.src,
    volume: (volume) => {
      if (volume) {
        videoPlayer.volume = volume;
      }
      return videoPlayer.volume;
    },
  };
  // 184 fetch
  injectFetchTmp();
  const postBtnElement = mainContainerComment.getElementsByTagName("button")[0];
  //if (postBtnElement) {
  //  postBtnElement.style.backgroundColor =
  //    Storage.get("options_disable184") === "true" ? "#ff8300" : "#007cff";
  //}
  //replace comment input to textarea
  const commentInput = mainContainerComment.getElementsByClassName(
    'before:content_"コメント"',
  )[0] as HTMLInputElement;
  if (commentInput?.parentElement && postBtnElement) {
    const commentTextarea = document.createElement("textarea");
    commentTextarea.placeholder = "コメント";
    commentTextarea.className = commentInput.className;
    commentTextarea.style.height = "100%";
    commentTextarea.style.padding = "8px 16px";
    commentTextarea.style.borderBottom = "2px solid #dadada";
    commentTextarea.style.borderTop = "2px solid #dadada";
    commentTextarea.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        postBtnElement.click();
      }
    };
    commentInput.style.display = "none";
    commentInput.after(commentTextarea);
    const originalPostBtnClick = postBtnElement.onclick;
    postBtnElement.onclick = (ev) => {
      commentInput.value = commentTextarea.value.replace(/\n/g, "ᜀ");
      originalPostBtnClick?.call(postBtnElement, ev);
      commentTextarea.value = "";
    };
    Array.from(document.getElementsByTagName("textarea")).forEach((t) => {
      t.addEventListener("keydown", (e) => {
        e.stopPropagation();
      });
    });
  }
  // init
  const HeaderElement = document.createElement("div");
  mainContainerPlayer.before(HeaderElement);
  const MainElement = document.createElement("div");
  mainContainerPlayer.after(MainElement);
  const FooterElement = document.createElement("div");
  mainContainerComment.after(FooterElement);
  const BackgroundImageElement = document.createElement("div");
  /*CommentRenderer.insertBefore(
    BackgroundImageElement,
    CommentRenderer.firstChild
  );*/
  videoPlayer.parentElement.appendChild(BackgroundImageElement);
  const LayerElement = document.createElement("div");
  videoSymbolContainerCanvas.after(LayerElement);
  //const MemoElement = document.createElement("div");
  //mainContainerPlayerPanel.prepend(MemoElement);
  HeaderElement.id = "dansk:HeaderElement";
  MainElement.id = "dansk:MainElement";
  BackgroundImageElement.id = "dansk:BackgroundImageElement";
  FooterElement.id = "dansk:FooterElement";
  LayerElement.id = "dansk:LayerElement";
  //MemoElement.id = "dansk:MemoElement";
  LayerElement.onclick = (e) => e.stopImmediatePropagation();
  LayerElement.oncontextmenu = (e) => e.stopImmediatePropagation();
  const ReactRootElement = document.createElement("div");
  document.body.append(ReactRootElement);
  const ReactRoot = createRoot(ReactRootElement);
  ReactRoot.render(<Root />);
  inject();
};
void init();
