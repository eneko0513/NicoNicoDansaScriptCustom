import React from "react";
import Styles from "./Button.module.scss";
import styled from "styled-components";

type buttonProps = {
  click: (arg0: string) => void;
  text: string;
  type?: "string" | "color";
  value?: string;
  active?: boolean;
  disabled?: boolean;
};

type colorButtonProps = {
  color: string;
};

const ColorButton = styled.input.attrs((props: colorButtonProps) => ({
  style: {
    backgroundColor: props.color,
  },
}))``;

/**
 * 色とかコマンド用のボタン
 * click: onClickイベントハンドラ
 * text: ボタンの表示テキスト
 * type: stringかcolor
 * value: クリックされた時にイベントハンドラに渡される値
 * active: 有効だということを示す
 * disabled: 無効だと言うことを示す・イベントハンドラ無効化
 * @param props
 * @constructor
 */
const Button = (props: buttonProps) => {
  if (props.type === "color") {
    return (
      <ColorButton
        type={"button"}
        className={`${Styles.colorButton} ${props.active ? Styles.active : ""}`}
        color={props.text}
        onClick={() => props.click(props.value || "")}
        disabled={props.disabled || false}
        value={" "}
      />
    );
  }
  return (
    <input
      type={"button"}
      className={`${Styles.button} ${props.active ? Styles.active : ""}`}
      onClick={() => props.click(props.value || "")}
      disabled={props.disabled || false}
      value={props.text}
    />
  );
};
export { Button };
