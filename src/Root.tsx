import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Context from "@/components/Context";
import Footer from "@/components/Footer";
import getElements from "@/libraries/getElements";
import Header from "@/components/Header";
import Main from "@/components/Main";
import sleep from "@/libraries/sleep";
import MemoPortal from "@/components/MemoPortal";
import inject from "@/libraries/cssInjector";

/**
 * Reactのルート要素
 * @constructor
 */
const Root = (): JSX.Element => {
  const [data, setData] = useState({}),
    [exportLayer, setExportLayer] = useState<string[]>([]);
  useEffect(() => {
    const init = async () => setData({ ...(await getElements()) });
    void init();
  }, []);
  return (
    <Context value={{ ...data, exportLayer, setExportLayer }}>
      <Header />
      <Main />
      <MemoPortal />
      <Footer />
    </Context>
  );
};

/**
 * 初期化関数
 * ニコ動の各要素が生えたら、だんすくの初期化をする
 */
const init = async () => {
  let mainContainer,
    mainContainerPlayer,
    CommentRenderer,
    videoSymbolContainerCanvas: HTMLCanvasElement | undefined,
    videoContainer,
    mainContainerPlayerPanel,
    count = 0;
  while (count < 30) {
    mainContainer = document.getElementsByClassName(
      "MainContainer"
    )[0] as HTMLDivElement;
    mainContainerPlayer = mainContainer?.getElementsByClassName(
      "MainContainer-player"
    )[0] as HTMLDivElement;
    mainContainerPlayerPanel = mainContainer?.getElementsByClassName(
      "MainContainer-playerPanel"
    )[0] as HTMLDivElement;
    if (mainContainer?.getElementsByClassName("CommentRenderer").length > 0)
      CommentRenderer = mainContainer?.getElementsByClassName(
        "CommentRenderer"
      )[0] as HTMLDivElement;
    videoSymbolContainerCanvas = document.getElementsByClassName(
      "VideoSymbolContainer-canvas"
    )[0] as HTMLCanvasElement;
    videoContainer = document.getElementsByClassName(
      "InView VideoContainer"
    )[0] as HTMLDivElement;
    count++;
    if (
      mainContainer === undefined ||
      mainContainerPlayer === undefined ||
      mainContainerPlayerPanel === undefined ||
      CommentRenderer === undefined ||
      videoSymbolContainerCanvas === undefined ||
      videoContainer === undefined
    ) {
      await sleep(100);
    } else {
      break;
    }
  }
  if (
    mainContainer === undefined ||
    mainContainerPlayer === undefined ||
    mainContainerPlayerPanel === undefined ||
    CommentRenderer === undefined ||
    videoSymbolContainerCanvas === undefined ||
    videoContainer === undefined
  ) {
    throw new Error("fail to get required element");
  }
  videoContainer.addEventListener(
    "scroll",
    (e) => {
      (e.target as HTMLDivElement).scroll(0, 0);
    },
    { passive: false }
  );
  const HeaderElement = document.createElement("div");
  mainContainer.before(HeaderElement);
  const MainElement = document.createElement("div");
  mainContainerPlayer.appendChild(MainElement);
  const FooterElement = document.createElement("div");
  mainContainer.after(FooterElement);
  const BackgroundImageElement = document.createElement("div");
  CommentRenderer.insertBefore(
    BackgroundImageElement,
    CommentRenderer.firstChild
  );
  const LayerElement = document.createElement("div");
  videoSymbolContainerCanvas.after(LayerElement);
  const MemoElement = document.createElement("div");
  mainContainerPlayerPanel.prepend(MemoElement);
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
