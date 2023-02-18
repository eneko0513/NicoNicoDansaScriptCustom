import React from "react";
import ReactDOM from "react-dom";
import { Trace } from "@/headers/Trace";
import { useAtom } from "jotai";
import { elementAtom } from "@/atoms";

/**
 * ヘッダーブロック(プレイヤー上)
 * @constructor
 */
const Header = (): JSX.Element => {
  const [elements] = useAtom(elementAtom);
  if (!elements) return <></>;
  return ReactDOM.createPortal(
    <>
      <Trace />
    </>,
    elements.HeaderElement
  );
};
export { Header };
