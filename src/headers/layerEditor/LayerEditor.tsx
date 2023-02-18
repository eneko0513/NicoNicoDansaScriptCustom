import React, { ChangeEvent, useCallback } from "react";
import Styles from "./LayerEditor.module.scss";
import { Button } from "@/components/button/Button";
import { typeGuard } from "@/libraries/typeGuard";
import { ColorPicker } from "@/headers/layerSelector/ColorPicker/ColorPicker";
import { useAtom } from "jotai";
import { layerAtom } from "@/atoms";

/**
 * layerの一括編集
 * @constructor
 */
const LayerEditor = () => {
  const [layerData, setLayerData] = useAtom(layerAtom);

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
        setLayerData(
          layerData.map((value) => {
            if (value.selected && value.posList.includes(target)) {
              value.pos = target;
            }
            return value;
          })
        );
      },
      [layerData]
    ),
    changeFont = useCallback(
      (target: string) => {
        if (!typeGuard.trace.commentFont(target)) return;
        setLayerData(
          layerData.map((value) => {
            if (value.selected) {
              value.font = target;
            }
            return value;
          })
        );
      },
      [layerData]
    ),
    changeColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setLayerData(
          layerData.map((value) => {
            if (value.selected) {
              value.color = e.target.value;
            }
            return value;
          })
        );
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
            <ColorPicker
              color={color}
              onChange={changeColor}
              disabled={color === "" || color === "-"}
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
export { LayerEditor };
