import React, { useContext } from "react";
import { context } from "@/components/Context";
import ReactDOM from "react-dom";
import Memo from "@/memo/Memo";

/**
 * メモブロック(プレイヤー内)
 * @constructor
 */
const MemoPortal = (): JSX.Element => {
  const { MemoElement } = useContext(context);
  if (!MemoElement) return <></>;
  return ReactDOM.createPortal(<Memo />, MemoElement);
};
export default MemoPortal;
