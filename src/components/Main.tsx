import { VideoController } from "@/main/VideoController";
import React from "react";
import ReactDOM from "react-dom";
import { useAtom } from "jotai";
import { elementAtom } from "@/atoms";

/**
 * メインブロック(プレイヤー内)
 * @constructor
 */
const Main = (): JSX.Element => {
  const [elements] = useAtom(elementAtom);
  if (!elements) return <></>;
  return ReactDOM.createPortal(
    <>
      <VideoController />
    </>,
    elements.MainElement
  );
};
export { Main };
