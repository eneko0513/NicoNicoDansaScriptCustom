import styled from "styled-components";
import React, { ChangeEvent, useContext, useRef } from "react";
import { layer } from "@/@types/types";
import Styles from "./Layer.module.scss";
import { layerContext } from "@/components/LayerContext";
//import layerManager from "@/libraries/layerManager";
import grids from "@/assets/grids";
import replaceCharList from "@/libraries/layerManager.replaceCharList";

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
type LayerItemProps = { _height: number | undefined };
const LayerItem = styled.div<LayerItemProps>`
  height: ${(props) => (props._height ? `${props._height}px` : "unset")};
`;
type LayerInputProps = {
  _height: number | undefined;
  _lineHeight: number;
  _fontSize: number;
};
const LayerInput = styled.textarea<LayerInputProps>`
  height: ${(props) => (props._height ? `${props._height}px` : "unset")};
  line-height: ${(props) => props._lineHeight}px;
  font-size: ${(props) => props._fontSize}px;
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
    for (let i = 0; i < layerData.length; i++) {
      if (layerData[i]?.layerId === layer.layerId) layerData[i] = layer;
    }
    currentLayer.current = layer;
    setLayerData([...layerData]);
  };
  /*useEffect(() => {
    if (!layerElement.current || !optionData) return;
    if (!(props.data.layerId === currentLayer.current?.layerId)) {
      props.data.overwrite = true;
    }
    currentLayer.current = props.data;
    layerManager(
      props.data,
      onchange,
      layerElement.current,
      optionData.replace
    );
  }, [layerElement, layerData, props.data, optionData?.replace]);*/
  const updateData = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const line = props.data.content[index];
    const char = replaceCharList[(e.nativeEvent as InputEvent).data || ""];
    if (char && optionData?.replace) {
      const t = e.target as HTMLTextAreaElement;
      const i = t.selectionStart;
      t.value = t.value.slice(0, i - 1) + char + t.value.slice(i);
      t.setSelectionRange(i, i);
    }
    const value = e.target.value.split("\n");
    if (!line) return;
    if (
      value.length > line.lineCount ||
      value.reduce(
        (pv, val) => pv + Number(!!val.match(/[\u00A0\u0020]|\u3033\u3035/g)),
        0
      ) > 0
    ) {
      e.target.style.background = "rgba(255,0,0,0.3)";
    } else {
      e.target.style.background = "none";
    }
    line.content = value;
    onchange(props.data);
  };

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
        ref={layerElement}
        spellCheck={"false"}
      >
        {props.data.content.map((value, index) => {
          return (
            <LayerInput
              _height={value.height || value.line * value.lineCount}
              _lineHeight={value.line}
              _fontSize={value.font}
              key={`layer${props.id}-group${index}`}
              className={Styles.textarea}
              value={value.content.join("\n")}
              onChange={(e) => updateData(e, index)}
              spellCheck={false}
              wrap={"off"}
              onScroll={(e) => (e.target as HTMLTextAreaElement).scroll(0, 0)}
            />
          );
        })}
      </LayerBox>
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
              <LayerItem
                _height={value.height || value.line * value.lineCount}
                key={`layerOutline${props.id}-group${index}`}
              >
                {[...(Array(value.lineCount) as undefined[])].map(
                  (_, index_) => {
                    return (
                      <LayerItem
                        _height={value.line}
                        key={`layerOutline${props.id}-group${index}-line${index_}`}
                      />
                    );
                  }
                )}
              </LayerItem>
            );
          })}
        </LayerBox>
      )}
    </>
  );
};
export default Layer;
