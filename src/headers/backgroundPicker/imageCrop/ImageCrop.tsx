import React, { useState } from "react";
import { useAtom } from "jotai";
import { backgroundAtom } from "@/atoms";
import Styles from "./ImageCrop.module.scss";
import { Crop } from "@/headers/backgroundPicker/imageCrop/Crop";
import { cropRange } from "@/@types/background";
import { Button } from "@/components/button/Button";

type props = {
  imageId: number;
  close: () => void;
};

const getActualRange = (range: cropRange) => {
  return {
    x: Math.round(range._pos1X * 2560),
    y: Math.round(range._pos1Y * 1440),
    width: Math.round((range._pos2X - range._pos1X) * 2560),
    height: Math.round((range._pos2Y - range._pos1Y) * 1440),
  };
};

const ImageCrop = ({ imageId, close }: props) => {
  const [background, setBackground] = useAtom(backgroundAtom);
  const image = background.images[imageId];
  const [range, setRange] = useState<cropRange>(
    image?.crop?.range || {
      _pos1X: 0.125,
      _pos1Y: 0.125,
      _pos2X: 0.875,
      _pos2Y: 0.875,
    }
  );
  const updateCropRange = (range: cropRange) => {
    setRange(range);
  };
  const reset = () => {
    setRange({ _pos1X: 0.125, _pos1Y: 0.125, _pos2X: 0.875, _pos2Y: 0.875 });
  };

  if (!image) {
    return <></>;
  }

  const save = () => {
    const img = document.createElement("img");
    img.src = image.crop?.original || image.url;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const baseCanvas = document.createElement("canvas");
      baseCanvas.width = 2560;
      baseCanvas.height = 1440;
      const baseContext = baseCanvas.getContext("2d")!;
      if (!baseContext) return;
      const scale = Math.min(1920 / img.naturalWidth, 1080 / img.naturalHeight);
      const imgWidth = img.naturalWidth * scale,
        imgHeight = img.naturalHeight * scale,
        offsetX = (1920 - imgWidth) / 2,
        offsetY = (1080 - imgHeight) / 2;
      baseCanvas.style.background = "red";
      baseContext.drawImage(
        img,
        320 + offsetX,
        180 + offsetY,
        imgWidth,
        imgHeight
      );
      const targetCanvas = document.createElement("canvas");
      const { width, height, x, y } = getActualRange(range);
      targetCanvas.width = width;
      targetCanvas.height = height;
      const targetContext = targetCanvas.getContext("2d");
      if (!targetContext) return;
      targetContext.drawImage(baseCanvas, -x, -y);
      targetCanvas.toBlob((blob) => {
        if (!blob) return;
        image.crop = {
          original: image.crop?.original || image.url,
          range: range,
        };
        image.url = URL.createObjectURL(blob);
        setBackground({ ...background });
        close();
      });
    };
  };
  return (
    <div className={Styles.wrapper}>
      <div>
        <Button click={reset} text={"リセット"} />
        <Button click={save} text={"保存"} />
      </div>
      <div className={Styles.container}>
        <Crop update={updateCropRange} range={range} />
        <div className={Styles.imageWrapper}>
          <img
            src={image.crop?.original || image.url}
            alt=""
            className={Styles.image}
          />
        </div>
      </div>
    </div>
  );
};

export { ImageCrop };
