import React, {
  MouseEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import Styles from "./Crop.module.scss";
import { cropKey, cropRange } from "@/@types/background";

type props = {
  update: (range: cropRange) => void;
  range: cropRange;
};

type moveTarget = cropKey | "move";

const CropDisplay = styled.div.attrs<cropRange>((p) => ({
  style: {
    left: `${Math.min(p._pos1X, p._pos2X) * 100}%`,
    top: `${Math.min(p._pos1Y, p._pos2Y) * 100}%`,
    width: `${Math.abs(p._pos1X - p._pos2X) * 100}%`,
    height: `${Math.abs(p._pos1Y - p._pos2Y) * 100}%`,
  },
}))``;

const getPosition = (
  e: MouseEvent<HTMLElement>,
  wrapper: RefObject<HTMLDivElement>
) => {
  const x =
      (e.clientX - (wrapper.current?.getBoundingClientRect().left || 0)) /
      (wrapper.current?.clientWidth || 1),
    y =
      (e.clientY - (wrapper.current?.getBoundingClientRect().top || 0)) /
      (wrapper.current?.clientHeight || 1);
  return { x, y };
};

const getMovement = (
  e: MouseEvent<HTMLElement>,
  wrapper: RefObject<HTMLDivElement>
) => {
  const x = e.movementX / (wrapper.current?.clientWidth || 1),
    y = e.movementY / (wrapper.current?.clientHeight || 1);
  return { x, y };
};

const getMoveTarget = (id: string): moveTarget[] => {
  if (id === Styles.top) {
    return ["_pos1Y"];
  }
  if (id === Styles.upperRight) {
    return ["_pos1Y", "_pos2X"];
  }
  if (id === Styles.right) {
    return ["_pos2X"];
  }
  if (id === Styles.bottomRight) {
    return ["_pos2X", "_pos2Y"];
  }
  if (id === Styles.bottom) {
    return ["_pos2Y"];
  }
  if (id === Styles.bottomLeft) {
    return ["_pos1X", "_pos2Y"];
  }
  if (id === Styles.left) {
    return ["_pos1X"];
  }
  if (id === Styles.upperLeft) {
    return ["_pos1X", "_pos1Y"];
  }
  return ["move"];
};

const handles = [
  "top",
  "upperRight",
  "right",
  "bottomRight",
  "bottom",
  "bottomLeft",
  "left",
  "upperLeft",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
];

const Crop = ({ update, range }: props) => {
  const [cropRange, setCropRange] = useState<cropRange>(range);
  const [moveTarget, setMoveTarget] = useState<(moveTarget | "init")[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCropRange(range);
  }, [range]);

  const isMouseDown = moveTarget.length > 0;

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const { x, y } = getPosition(e, wrapperRef);
    const targetElement = e.target as HTMLDivElement;
    if (
      targetElement.id === Styles.wrapper ||
      targetElement.id === Styles.display
    ) {
      setCropRange({ _pos1X: x, _pos1Y: y, _pos2X: x, _pos2Y: y });
      setMoveTarget(["_pos2X", "_pos2Y", "init"]);
    } else {
      e.stopPropagation();
      setMoveTarget(getMoveTarget(targetElement.id));
    }
  };
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown) return;
    if (moveTarget.includes("move")) {
      const { x, y } = getMovement(e, wrapperRef);
      setCropRange({
        _pos1X: cropRange._pos1X + x,
        _pos2X: cropRange._pos2X + x,
        _pos1Y: cropRange._pos1Y + y,
        _pos2Y: cropRange._pos2Y + y,
      });
      return;
    }
    const { x, y } = getPosition(e, wrapperRef);
    (["_pos1X", "_pos1Y", "_pos2X", "_pos2Y"] as cropKey[]).forEach((key) => {
      if (moveTarget.includes(key)) {
        cropRange[key] = key.includes("X") ? x : y;
      }
    });
    setCropRange({ ...cropRange });
  };

  const onMouseUp = (_: MouseEvent<HTMLDivElement>) => {
    const range = {
      _pos1X: Math.min(cropRange._pos1X, cropRange._pos2X),
      _pos2X: Math.max(cropRange._pos1X, cropRange._pos2X),
      _pos1Y: Math.min(cropRange._pos1Y, cropRange._pos2Y),
      _pos2Y: Math.max(cropRange._pos1Y, cropRange._pos2Y),
    };
    setCropRange(range);
    update(range);
    setMoveTarget([]);
  };

  return (
    <div
      className={Styles.wrapper}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      ref={wrapperRef}
      id={Styles.wrapper}
    >
      {cropRange && (
        <CropDisplay
          {...cropRange}
          id={Styles.display}
          className={`${Styles.display} ${
            !moveTarget.includes("init") && Styles.cursor
          }`}
        >
          {handles.map((key) => (
            <div
              key={key}
              className={Styles[key]}
              id={Styles[key]}
              onMouseDown={onMouseDown}
            />
          ))}
        </CropDisplay>
      )}
    </div>
  );
};
export { Crop };
