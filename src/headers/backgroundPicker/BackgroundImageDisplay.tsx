import React from "react";
import Styles from "./BackgroundImageDisplay.module.scss";
import { icons } from "@/assets/icons";
import { useAtom } from "jotai";
import { backgroundAtom } from "@/atoms";

/**
 * 背景の選択画面
 * 有効無効の切り替えとか画像の削除とかも
 * @constructor
 */
const BackgroundImageDisplay = () => {
  const [background, setBackground] = useAtom(backgroundAtom);
  const deleteImage = (key: number) => {
    background.images.splice(key, 1);
    if (background.selected >= background.images.length) {
      background.selected = -1;
    }
    setBackground({ ...background });
  };
  const changeActiveImage = (key: number) => {
    if (background.selected === key) {
      background.selected = -1;
    } else {
      background.selected = key;
      background.visible = true;
    }
    setBackground({ ...background });
  };
  return (
    <div className={Styles.container}>
      {background.images.map((blob, key) => {
        return (
          <div
            key={`backgroundImageDisplay${key}`}
            className={`${Styles.item} ${
              key === background.selected ? Styles.active : ""
            }`}
          >
            <img
              className={Styles.image}
              src={blob}
              alt={""}
              onClick={() => changeActiveImage(key)}
            />
            <span className={Styles.delete} onClick={() => deleteImage(key)}>
              {icons.delete}
            </span>
          </div>
        );
      })}
    </div>
  );
};
export { BackgroundImageDisplay };
