import React, { ChangeEvent, useCallback, useContext } from "react";
import Styles from "./LayerEditor.module.scss";
import { layerContext } from "@/components/LayerContext";
import Button from "@/components/button/Button";
import styled from "styled-components";
import typeGuard from "@/libraries/typeGuard";

type colorProps = {
  bgColor: string;
};
const ColorDisplay = styled.label<colorProps>`
  background-color: ${(props) => props.bgColor};
`;

/**
 * layerの一括編集
 * @constructor
 */
const LayerEditor = () => {
  const { layerData, setLayerData } = useContext(layerContext);
  if (!layerData || !setLayerData) return <></>;

  const color = layerData.reduce(
    (pv, layer) =>
      layer.selected
        ? pv === ""
          ? layer.color
          : pv === layer.color
          ? pv
          : "-"
        : pv,
    ""
  );
  const changePos = useCallback(
      (target: string) => {
        if (!typeGuard.trace.commentPos(target)) return;
        setLayerData([
          ...layerData.map((value) => {
            if (value.selected && value.posList.includes(target)) {
              value.pos = target;
            }
            return value;
          }),
        ]);
      },
      [layerData]
    ),
    changeFont = useCallback(
      (target: string) => {
        if (!typeGuard.trace.commentFont(target)) return;
        setLayerData([
          ...layerData.map((value) => {
            if (value.selected) {
              value.font = target;
            }
            return value;
          }),
        ]);
      },
      [layerData]
    ),
    changeColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setLayerData([
          ...layerData.map((value) => {
            if (value.selected) {
              value.color = e.target.value;
            }
            return value;
          }),
        ]);
      },
      [layerData]
    ),
    move = useCallback(
      (target: string) => {
        if (!target.match(/up|down/)) return;
        if (target === "up") {
          layerData.forEach((value, i) => {
            const lastValue = layerData[i - 1];
            if (value?.selected === true && lastValue)
              layerData.splice(i - 1, 2, value, lastValue);
          });
        } else {
          layerData.reverse().forEach((value, i) => {
            const lastValue = layerData[i - 1];
            if (value?.selected === true && lastValue)
              layerData.splice(i - 1, 2, value, lastValue);
          });
          layerData.reverse();
        }
        setLayerData([...layerData]);
      },
      [layerData]
    );
  return (
    <div className={Styles.table}>
      <div className={Styles.row}>
        <div className={Styles.block}>
          <Button click={changePos} text={"ue"} value={"ue"} />
          <Button click={changePos} text={"naka"} value={"naka"} />
          <Button click={changePos} text={"shita"} value={"shita"} />
        </div>
        <div className={Styles.block}>
          <Button click={changeFont} text={"mincho"} value={"mincho"} />
          <Button click={changeFont} text={"gothic"} value={"gothic"} />
        </div>
        <div className={Styles.block}>
          <div className={Styles.colorInputWrapper}>
            <ColorDisplay
              bgColor={color}
              className={`${Styles.colorInputLabel} ${
                (color === "" || color === "-") && Styles.invalid
              }`}
              htmlFor={Styles.colorInput}
            />
            <input
              type={"color"}
              value={color === "" || color === "-" ? "#ffffff" : color}
              id={Styles.colorInput}
              className={Styles.colorInput}
              onChange={changeColor}
            />
          </div>
        </div>
      </div>
      <div className={Styles.row}>
        <div className={Styles.block}>
          <Button click={move} text={"上へ"} value={"up"} />
          <Button click={move} text={"下へ"} value={"down"} />
        </div>
      </div>
    </div>
  );
};
export default LayerEditor;
