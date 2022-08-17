import styled from "styled-components";
import React, { useContext, useEffect, useRef } from "react";
import { layer } from "@/@types/types";
import Styles from "./Layer.module.scss";
import { layerContext } from "@/components/LayerContext";
import layerManager from "@/libraries/layerManager";
import layerUtil from "@/libraries/layerUtil";
import grids from "@/assets/grids";

type LayerProps = {
  id: number;
  data: layer;
};
type LayerBoxProps = {
  top: number;
  left: number;
  textColor: string;
  _width: number;
  _scale: { x: number; y: number };
};
const LayerBox = styled.div<LayerBoxProps>`
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  color: ${(props) => props.textColor};
  width: ${(props) => props._width}px;
  transform: scale(${(p) => p._scale.x}, ${(p) => p._scale.y});
`;
type LayerGroupProps = { height: number | undefined };
const LayerGroup = styled.div<LayerGroupProps>`
  height: ${(props) => (props.height ? `${props.height}px` : "unset")};
`;

/**
 * レイヤー
 * id: layerDataのインデックス
 * data: レイヤーデータ
 * @param props
 * @constructor
 */
const Layer = (props: LayerProps): JSX.Element => {
  const { layerData, setLayerData, optionData } = useContext(layerContext),
    layerElement = useRef<HTMLDivElement>(null),
    currentLayer = useRef<layer>();
  const onchange = (layer: layer) => {
    if (!layerData || !setLayerData) return;
    layerData[props.id] = layer;
    currentLayer.current = layer;
    setLayerData([...layerData]);
  };
  useEffect(() => {
    if (
      !layerElement.current ||
      (currentLayer.current !== undefined &&
        layerUtil.isEqual(currentLayer.current, props.data)) ||
      !optionData
    )
      return;
    layerManager(
      props.data,
      onchange,
      layerElement.current,
      optionData.replace
    );
  }, [layerElement, layerData, props.data, optionData?.replace]);
  return (
    <>
      {optionData?.grid &&
        props.data.selected &&
        props.data.visible &&
        grids[props.data.value] && (
          <img src={grids[props.data.value]} alt={""} />
        )}
      <LayerBox
        className={`${Styles.layer} ${Styles[props.data.font]} ${
          props.data.selected ? Styles.active : ""
        } ${props.data.visible ? "" : Styles.invisible} ${
          optionData?.grid && grids[props.data.value] ? Styles.grid : ""
        }`}
        top={props.data.top[props.data.pos]}
        left={props.data.left}
        textColor={props.data.color}
        _width={props.data.areaWidth}
        _scale={props.data.scale}
        contentEditable={props.data.selected ? "true" : "false"}
        ref={layerElement}
        spellCheck={"false"}
      />
      {props.data.selected && props.data.visible && (
        <LayerBox
          className={Styles.outline}
          top={props.data.top[props.data.pos]}
          left={props.data.left}
          textColor={props.data.color}
          _width={props.data.areaWidth}
          _scale={props.data.scale}
        >
          {props.data.content.map((value, index) => {
            return (
              <LayerGroup
                height={value.height || value.line * value.lineCount}
                key={`layer${props.id}-group${index}`}
              />
            );
          })}
        </LayerBox>
      )}
    </>
  );
};
export default Layer;
