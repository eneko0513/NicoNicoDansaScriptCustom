import React from "react";
import ReactDOM from "react-dom";
import { Memo } from "@/memo/Memo";
import { useAtom } from "jotai";
import { elementAtom } from "@/atoms";

/**
 * メモブロック(プレイヤー内)
 * @constructor
 */
const MemoPortal = (): JSX.Element => {
  const [elements] = useAtom(elementAtom);
  if (!elements) return <></>;
  return ReactDOM.createPortal(<Memo />, elements.MemoElement);
};
export { MemoPortal };
