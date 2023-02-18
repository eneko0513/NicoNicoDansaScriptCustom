import React, { ReactNode } from "react";
import Styles from "./Tips.module.scss";

type TipsProps = {
  children: ReactNode;
};

/**
 * Tips
 * ホバー時にchildrenを表示する
 * @param props
 * @constructor
 */
const Tips = (props: TipsProps) => {
  return (
    <div className={Styles.container}>
      <span className={Styles.icon}>?</span>
      <div className={Styles.tips}>{props.children}</div>
    </div>
  );
};
export { Tips };
