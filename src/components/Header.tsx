import React, { useContext } from "react";
import { context } from "@/components/Context";
import ReactDOM from "react-dom";
import Trace from "@/headers/Trace";
import LayerContextManager from "@/headers/LayerContextManager";

/**
 * ヘッダーブロック(プレイヤー上)
 * @constructor
 */
const Header = (): JSX.Element => {
  const { HeaderElement } = useContext(context);
  if (!HeaderElement) return <></>;
  return ReactDOM.createPortal(
    <>
      <LayerContextManager>
        <Trace />
      </LayerContextManager>
    </>,
    HeaderElement
  );
};
export default Header;
