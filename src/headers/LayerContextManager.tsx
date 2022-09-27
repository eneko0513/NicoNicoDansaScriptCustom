import LayerContext from "@/components/LayerContext";
import React, { useState } from "react";
import { layer, optionDataType } from "@/@types/types";
//import caretUtil from "@/libraries/caretUtil";

type propsType = {
  children: React.ReactNode;
};
const layerContextManager = (props: propsType) => {
  const [layerData, setLayerData] = useState<layer[]>([]),
    /*[layerHistory, setLayerHistory] = useState<history[]>([]),
    [layerUndoHistory, setLayerUndoHistory] = useState<history[]>([]),*/
    [optionData, setOptionData] = useState<optionDataType>({
      bgActive: -1,
      bgImages: [],
      bgEditing: false,
      bgMode: "fill",
      bgVisible: true,
      bgTransparency: 100,
      grid: false,
      replace: false,
    });
  /*  document.onkeydown = (ev) => {
      if (
        ((ev.metaKey || ev.ctrlKey) && ev.code === "KeyY") ||
        ((ev.metaKey || ev.ctrlKey) && ev.shiftKey && ev.code === "KeyZ")
      ) {
        redo();
      } else if ((ev.metaKey || ev.ctrlKey) && ev.code === "KeyZ") {
        undo();
      }
    };
    const undo = () => {
      const value = layerHistory.splice(0, 1);
      if (!value[0]) return;
      setLayerHistory([...layerHistory]);
      layerUndoHistory.unshift(value[0]);
      if (layerUndoHistory.length > 50) {
        layerUndoHistory.splice(50);
      }
      setLayerUndoHistory([...layerUndoHistory]);
      update(value[0]);
    };
    const redo = () => {
      const value = layerUndoHistory.splice(0, 1);
      if (!value[0]) return;
      setLayerUndoHistory([...layerUndoHistory]);
      layerHistory.unshift(value[0]);
      if (layerHistory.length > 50) {
        layerHistory.splice(50);
      }
      setLayerHistory([...layerHistory]);
      update(value[0]);
    };
    const update = (value: history) => {
      setLayerData(
        value.layerData.map((value) => {
          value.overwrite = true;
          return value;
        })
      );
      setTimeout(() => {
        if (!value.caretPos) return;
        const target = document.getElementById(
          `dansk:layer${value.caretPos.layerId}Line${value.caretPos.line}`
        );
        if (!target) return;
        target.focus();
        caretUtil.set(target, value.caretPos.pos);
      }, 1);
    };
    const updateLayerData = useCallback(
      (data: layer[]) => {
        const isLayerEqual = (a: layer[], b: layer[]): boolean => {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            const layer_a = a[i],
              layer_b = b[i];
            if (!(layer_a && layer_b && isEqual(layer_a, layer_b))) {
              return false;
            }
          }
          return true;
        };
        const isEqual = (
          a: { [key: string]: unknown },
          b: { [key: string]: unknown }
        ): boolean => {
          const keys = Object.keys(a);
          for (const key of keys) {
            const value_a = a[key],
              value_b = b[key];
            if (typeof value_a !== typeof value_b) return false;
            if (typeof value_a === "object" && typeof value_b === "object") {
              if (
                !isEqual(
                  value_a as { [key: string]: unknown },
                  value_b as { [key: string]: unknown }
                )
              )
                return false;
            } else if (value_a !== value_b) {
              return false;
            }
          }
          return true;
        };
        if (data[0]?.overwrite) {
          setTimeout(() => {
            setLayerData(
              (data = data.map((value) => {
                value.overwrite = false;
                return value;
              }))
            );
          });
          return;
        } else if (!isLayerEqual(layerHistory[0]?.layerData || [], data)) {
          const historyItem: history = {
            layerData: JSON.parse(JSON.stringify(data)) as layer[],
          };
          const focusedElement = caretUtil.getFocusedElement();
          if (
            focusedElement &&
            focusedElement.parentElement &&
            focusedElement.classList.contains("dansk:layerLineItem")
          ) {
            historyItem.caretPos = {
              layerId: focusedElement.parentElement.getAttribute("layerId") || "",
              line: Number(focusedElement.getAttribute("lineIndex")),
              pos: caretUtil.get(focusedElement) || 0,
            };
          }
          layerHistory.unshift(historyItem);
          if (layerHistory.length > 50) {
            layerHistory.splice(50);
          }
          setLayerHistory([...layerHistory]);
          setLayerUndoHistory([]);
        }
        setLayerData(data);
      },
      [layerData, layerHistory]
    );*/
  return (
    <LayerContext
      value={{
        layerData,
        setLayerData,
        optionData,
        setOptionData,
      }}
    >
      {props.children}
    </LayerContext>
  );
};
export default layerContextManager;
