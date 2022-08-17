import React, { ChangeEvent, useState } from "react";
import Styles from "./Dropdown.module.scss";

type dropdownProps = {
  change: (arg0: string) => void;
  value: { text: string; value: string }[];
  selected: string;
};

/**
 * 新規作成レイヤーのテンプレ選択用
 * change: onChangeイベントハンドラ
 * value: {
 *   text: 表示用文字列
 *   value: イベントハンドラに渡される値
 * }
 * selected: 選択済み要素
 * @param props
 * @constructor
 */
const Dropdown = (props: dropdownProps) => {
  const [value, setValue] = useState<string>(props.selected);
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    props.change(e.target.value);
  };
  return (
    <select value={value} onChange={onSelectChange} className={Styles.select}>
      {props.value.map((item) => {
        return (
          <option key={`Dropdown${item.value}`} value={item.value}>
            {item.text}
          </option>
        );
      })}
    </select>
  );
};
export default Dropdown;
