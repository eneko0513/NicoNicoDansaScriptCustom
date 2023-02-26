import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Layer } from "@/layer/layer/Layer";
import Styles from "./LayerContainer.module.scss";
import { objectFitArgs } from "@/@types/background";
import ReactDOM from "react-dom";
import { Preview } from "@/layer/Preview/Preview";
import { useAtom } from "jotai";
import { backgroundAtom, elementAtom, layerAtom, optionAtom } from "@/atoms";

const LayerScale = styled.div<{ scaleX: number; scaleY: number }>`
  transform: scale(${(props) => props.scaleX}, ${(props) => props.scaleY});
  position: absolute;
  top: 0;
  left: 0;
`;

const BackgroundImage = styled.img<{ mode: objectFitArgs; opacity: number }>`
  object-fit: ${(props) => props.mode};
  opacity: ${(props) => props.opacity};
`;

function beforeUnload(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = true;
}

/**
 * レイヤー全体を管理
 * @constructor
 */
const LayerContainer = (): JSX.Element => {
  const [layerData] = useAtom(layerAtom);
  const [background] = useAtom(backgroundAtom);
  const [optionData] = useAtom(optionAtom);
  const [elements] = useAtom(elementAtom);
  useEffect(() => {
    const classList =
        elements?.videoSymbolContainerCanvas.parentElement?.classList,
      cssClass = Styles.VideoSymbolContainer || "_";
    if (!classList || process.env.NODE_ENV === "development") return;
    if (layerData && layerData.length > 0) {
      window.onbeforeunload = beforeUnload;
      classList.toggle(cssClass, true);
    } else {
      window.onbeforeunload = null;
      classList.toggle(cssClass, false);
    }
  }, [layerData]);
  const observerCallback = () => {
    if (
      !targetNode.current ||
      !targetNode.current.parentElement ||
      !targetNode.current.parentElement.parentElement
    )
      return;
    const target = targetNode.current.parentElement.parentElement;
    setScale({ x: target.clientWidth / 640, y: target.clientHeight / 360 });
  };
  const [observer] = useState<MutationObserver>(
      new MutationObserver(observerCallback)
    ),
    [scale, setScale] = useState<{ x: number; y: number }>({ x: 1, y: 1 }),
    targetNode = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !targetNode.current ||
      !targetNode.current.parentElement ||
      !targetNode.current.parentElement.parentElement
    )
      return;
    observer.observe(targetNode.current.parentElement.parentElement, {
      attributes: true,
      childList: false,
      subtree: false,
    });
  }, [targetNode]);
  useEffect(() => observerCallback(), [document.body.classList]);
  return (
    <>
      {background.selected > -1 && background.visible && elements
        ? ReactDOM.createPortal(
            <BackgroundImage
              className={`${Styles.backgroundImage}`}
              src={background.images[background.selected]?.url}
              alt={"backgroundImage"}
              mode={background.mode}
              opacity={background.transparency / 100}
            />,
            elements?.BackgroundImageElement
          )
        : ""}
      {optionData.preview !== "disable" && <Preview />}
      <LayerScale
        ref={targetNode}
        scaleX={scale.x}
        scaleY={scale.y}
        className={`${Styles.scaleWrapper} ${
          optionData.preview === "previewOnly" && Styles.hide
        }`}
      >
        {layerData?.map((data) => {
          return <Layer key={data.layerId} data={data} />;
        })}
      </LayerScale>
    </>
  );
};
export { LayerContainer };
