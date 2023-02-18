import React from "react";
import ReactDOM from "react-dom";
import { LayerContainer } from "@/layer/LayerContainer";
import { useAtom } from "jotai";
import { elementAtom } from "@/atoms";

/**
 * レイヤーブロック(プレイヤー内)
 * @constructor
 */
const LayerPortal = (): JSX.Element => {
  const [elements] = useAtom(elementAtom);
  if (!elements) return <></>;
  return ReactDOM.createPortal(<LayerContainer />, elements.LayerElement);
};
export { LayerPortal };
