import React, { ChangeEvent, useState } from "react";
import Styles from "./Slider.module.scss";

type sliderProps = {
  change: (arg0: number) => void;
  value: number;
  active?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
};

/**
 * スライダー
 * click: onClickイベントハンドラ
 * text: ボタンの表示テキスト
 * type: stringかcolor
 * value: クリックされた時にイベントハンドラに渡される値
 * active: 有効だということを示す
 * disabled: 無効だと言うことを示す・イベントハンドラ無効化
 * @param props
 * @constructor
 */
const Button = (props: sliderProps) => {
  const [value, setValue] = useState<number>(props.value);
  const onSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
    props.change(Number(e.target.value));
  };
  return (
    <input
      type={"range"}
      className={`${Styles.slider} ${props.active ? Styles.active : ""}`}
      onChange={onSliderChange}
      disabled={props.disabled || false}
      value={value}
      min={props.min}
      max={props.max}
    />
  );
};
export default Button;
