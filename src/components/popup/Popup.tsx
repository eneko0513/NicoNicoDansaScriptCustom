import React, { ReactNode } from "react";
import Styles from "./Popup.module.scss";
import { icons } from "@/assets/icons";

type PopupProps = {
  children: ReactNode;
  title: string;
  close: () => void;
};

/**
 * 画面上にポップアップを表示する用
 * title: ポップアップ上部に表示するタイトル
 * close: 閉じる用イベントハンドラ
 * @param props
 * @constructor
 */
const Popup = (props: PopupProps) => {
  return (
    <div className={Styles.background} onClick={props.close}>
      <div className={Styles.wrapper} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>
          <span className={Styles.title}>{props.title}</span>
          <span className={Styles.close} onClick={props.close}>
            {icons.delete}
          </span>
        </div>
        <div className={Styles.container}>{props.children}</div>
      </div>
    </div>
  );
};
export { Popup };
