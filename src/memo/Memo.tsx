import React, { ChangeEvent, useState } from "react";
import Spoiler from "@/components/spoiler/Spoiler";
import localStorage from "@/libraries/localStorage";
import Styles from "./Memo.module.scss";

/**
 * メモブロック(プレイヤー内)
 * @constructor
 */
const Memo = (): JSX.Element => {
  const [value, setValue] = useState<string>(localStorage.get("memo"));
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    onBlur = () => {
      localStorage.set("memo", value);
    };
  return (
    <Spoiler text={"Memo"}>
      <textarea
        cols={30}
        rows={5}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        className={Styles.textarea}
      ></textarea>
    </Spoiler>
  );
};
export default Memo;
