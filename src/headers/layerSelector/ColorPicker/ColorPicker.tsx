import Styles from "./ColorPicker.module.scss";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

type props = {
  color: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

type colorProps = {
  bgColor: string;
};

const ColorDisplay = styled.label<colorProps>`
  background-color: ${(props) => props.bgColor};
`;

type pos = {
  x: number;
  y: number;
};
const HoverItem = styled.div<pos>`
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
`;

const convert6digitHexColorCode = (color: string) => {
  if (color.length === 4) {
    const match = color.match(/#([0-9a-f])([0-9a-f])([0-9a-f])/i);
    if (!match) {
      return "#000000";
    }
    return `#${match[1]?.repeat(2)}${match[2]?.repeat(2)}${match[3]?.repeat(
      2
    )}`;
  } else if (color.length === 7) {
    return color;
  }
  return "#000000";
};

const ColorPicker = ({ color, disabled, onChange }: props) => {
  const colorDisplayRef = useRef<HTMLLabelElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; height: number }>({
    x: 0,
    y: 0,
    height: 0,
  });
  const [colorInputText, setColorInputText] = useState(color);
  const [colorInput, setColorInput] = useState(color);

  useEffect(() => {
    setColorInputText(color);
    setColorInput(color);
  }, [color]);

  const onClick = () => {
    if (!colorDisplayRef.current) return;
    setPos(colorDisplayRef.current.getBoundingClientRect());
  };

  const update = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorInputText(value);
    if (value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
      onChange(e);
      setColorInput(value);
    }
  };

  useEffect(() => {
    if (!colorDisplayRef.current) return;
    setPos(colorDisplayRef.current.getBoundingClientRect());
  }, []);

  return (
    <div className={`${Styles.wrapper} ${disabled && Styles.disabled}`}>
      <ColorDisplay
        className={`handle ${Styles.colorLabel}`}
        bgColor={color}
        ref={colorDisplayRef}
        onMouseEnter={onClick}
      >
        {!disabled && colorInput && (
          <input
            className={Styles.colorInput}
            type="color"
            onChange={(e) => onChange(e)}
            disabled={disabled}
            value={convert6digitHexColorCode(colorInput)}
          />
        )}
      </ColorDisplay>
      <HoverItem x={pos.x} y={pos.y + pos.height} className={Styles.hoverItem}>
        <input
          type="text"
          value={colorInputText}
          onChange={update}
          className={Styles.input}
          pattern={"^#([0-9a-fA-Z]{3}|[0-9a-fA-Z]{6})$"}
          required
          placeholder={"#FFFFFF"}
        />
      </HoverItem>
    </div>
  );
};
export { ColorPicker };
