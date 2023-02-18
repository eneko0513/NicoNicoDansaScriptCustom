import { CommandBox } from "@/footers/CommandBox";
import React from "react";
import ReactDOM from "react-dom";
import { OutputBox } from "@/footers/OutputBox";
import { useAtom } from "jotai";
import { elementAtom } from "@/atoms";

/**
 * フッターブロック(プレイヤー下)
 * @constructor
 */
const Footer = (): JSX.Element => {
  const [elements] = useAtom(elementAtom);
  if (!elements) return <></>;
  return ReactDOM.createPortal(
    <>
      <CommandBox />
      <OutputBox />
    </>,
    elements.FooterElement
  );
};
export { Footer };
