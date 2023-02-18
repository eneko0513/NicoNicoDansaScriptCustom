import React, { useState } from "react";
import Styles from "./Spoiler.module.scss";
import { SpoilerButton } from "@/components/spoiler/SpoilerButton";
import { Storage } from "@/libraries/localStorage";
import { typeGuard } from "@/libraries/typeGuard";

type propType = {
  text: string;
  message?: string;
  children: React.ReactNode;
};
/**
 * スポイラー
 * text: ブロックのタイトル
 * message: タイトルの右に表示されるテキスト
 * @param props
 * @constructor
 */
const Spoiler: React.FC<propType> = (props) => {
  const localStorageKey = "display_" + props.text.toLowerCase();
  if (!typeGuard.localStorage.isKey(localStorageKey)) return <></>;
  const [spoilerOpen, setSpoilerOpen] = useState<boolean>(
    Storage.get(localStorageKey) == "true"
  );
  const changeSpoilerVisibility = (visibility: boolean) => {
    setSpoilerOpen(visibility);
    Storage.set(localStorageKey, visibility ? "true" : "false");
  };
  return (
    <div className={Styles.wrapper}>
      <SpoilerButton
        open={spoilerOpen}
        text={props.text}
        message={props.message}
        click={() => changeSpoilerVisibility(!spoilerOpen)}
      />
      {spoilerOpen ? <div>{props.children}</div> : ""}
    </div>
  );
};
export { Spoiler };
