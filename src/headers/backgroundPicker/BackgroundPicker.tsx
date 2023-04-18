import React, { useCallback, useState, ChangeEvent } from "react";
import { Popup } from "@/components/popup/Popup";
import { BackgroundImageDisplay } from "@/headers/backgroundPicker/BackgroundImageDisplay";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { objectFitArgs } from "@/@types/background";
import { Tips } from "@/components/tips/Tips";
import Styles from "./BackgroundPicker.module.scss";
import { useAtom } from "jotai";
import { backgroundAtom } from "@/atoms";
import { uuid } from "@/libraries/uuidUtil";
import { ImageCrop } from "@/headers/backgroundPicker/imageCrop/ImageCrop";
import styled from "styled-components";

const createImage = (url: string) => {
  return {
    id: uuid(),
    url,
  };
};

type ColorDisplayProps = {
  color: string;
};

const ColorDisplay = styled.label.attrs<ColorDisplayProps>((p) => ({
  style: {
    background: p.color,
  },
}))<ColorDisplayProps>``;

/**
 * 背景の追加、選択、描画モード選択
 * @constructor
 */
const BackgroundPicker = () => {
  const [background, setBackground] = useAtom(backgroundAtom);
  const [urlInputActive, setUrlInputActive] = useState<boolean>(false),
    [urlInputValue, setUrlInputValue] = useState<string>(""),
    [colorInputActive, setColorInputActive] = useState<boolean>(false),
    [colorInputValue, setColorInputValue] = useState<string>("#000000"),
    [colorInputTextValue, setColorInputTextValue] = useState<string>("#000000"),
    [imageCrop, setImageCrop] = useState<number>(-1);
  const addColorBg = () => {
    setColorInputActive(false);
    const color = colorInputValue,
      canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = 1920;
    canvas.height = 1080;
    context.fillStyle = color;
    context.fillRect(0, 0, 1920, 1080);
    canvas.toBlob((blob) => {
      if (!blob) return;
      background.images.push(createImage(URL.createObjectURL(blob)));
      setBackground({ ...background });
    });
  };
  const loadFromFile = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = () => {
        if (!input.files || !input.files[0]) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === "string") {
            background.images.push(createImage(e.target.result));
            setBackground({ ...background });
          }
        };
        reader.readAsDataURL(input.files[0]);
      };
      input.click();
    },
    loadFromURL = () => {
      if (
        urlInputValue.match(/^https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+$/)
      ) {
        background.images.push(createImage(urlInputValue));
        setBackground({ ...background });
        setUrlInputValue("");
        setUrlInputActive(false);
      }
    };

  const drawModeOnChange = useCallback(
    (value: string) => {
      background.mode = value as objectFitArgs;
      setBackground({ ...background });
    },
    [background]
  );

  const onColorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColorInputValue(e.target.value);
    setColorInputTextValue(e.target.value);
  };

  const onColorTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(
      e.target.value,
      e.target.value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
    );
    setColorInputTextValue(e.target.value);
    if (e.target.value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
      setColorInputValue(e.target.value);
    }
  };

  return (
    <>
      <Popup
        title={"背景"}
        close={() => setBackground({ ...background, open: false })}
      >
        <BackgroundImageDisplay setImageCrop={setImageCrop} />
        <div>
          <Button click={loadFromFile} text={"画像をパソコンから読み込む"} />
          <Button
            click={() => setUrlInputActive(true)}
            text={"画像をURLから読み込む"}
          />
          <Button
            click={() => setColorInputActive(true)}
            text={"単色背景を追加"}
          />
        </div>
        <div>
          表示モード：
          <Dropdown
            change={drawModeOnChange}
            value={[
              { text: "contain", value: "contain" },
              { text: "cover", value: "cover" },
              { text: "fill", value: "fill" },
              { text: "none", value: "none" },
              { text: "scale-down", value: "scale-down" },
            ]}
            selected={background.mode}
          />
          <Tips>
            <table className={Styles.tips}>
              <thead>
                <tr>
                  <th>モード名</th>
                  <th>効果</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>contain</td>
                  <td>
                    画像全体がちょうど収まるように縦横比を維持したまま表示します
                  </td>
                </tr>
                <tr>
                  <td>cover</td>
                  <td>
                    画像が動画全体をちょうど覆い隠すように縦横比を維持したまま表示します
                  </td>
                </tr>
                <tr>
                  <td>fill</td>
                  <td>画像を動画と同じサイズに引き伸ばして表示します</td>
                </tr>
                <tr>
                  <td>none</td>
                  <td>元画像のサイズのまま表示します</td>
                </tr>
                <tr>
                  <td>scale-down</td>
                  <td>
                    元画像が動画より小さければそのまま、そうでなければcontainと同様に縮小して表示します
                  </td>
                </tr>
              </tbody>
            </table>
          </Tips>
        </div>
      </Popup>
      {urlInputActive && (
        <Popup
          title={"URLを入力"}
          close={() => {
            setUrlInputActive(false);
          }}
        >
          <input
            className={Styles.urlInput}
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            pattern={"^https?://[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+$"}
          />
          <Button click={loadFromURL} text={"追加"} />
        </Popup>
      )}
      {colorInputActive && (
        <Popup
          title={"単色背景を追加"}
          close={() => {
            setColorInputActive(false);
          }}
        >
          <div className={Styles.colorInputs}>
            <ColorDisplay
              color={colorInputValue}
              className={Styles.colorInputLabel}
            >
              <input
                className={Styles.colorInput}
                value={colorInputValue}
                onChange={onColorInputChange}
                type={"color"}
              />
            </ColorDisplay>
            <input
              className={Styles.textInput}
              value={colorInputTextValue}
              onChange={onColorTextInputChange}
              pattern={"^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"}
              type={"text"}
            />
          </div>
          <Button click={addColorBg} text={"追加"} />
        </Popup>
      )}
      {imageCrop >= 0 && (
        <Popup title={"切り抜き"} close={() => setImageCrop(-1)}>
          <ImageCrop imageId={imageCrop} close={() => setImageCrop(-1)} />
        </Popup>
      )}
    </>
  );
};
export { BackgroundPicker };
