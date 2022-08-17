import React, { ChangeEvent, useState } from "react";
import Popup from "@/components/popup/Popup";
import Styles from "./CssEditor.module.scss";
import { layer } from "@/@types/types";

type EditorProps = {
  close: (data: layer) => void;
  data?: layer;
};

/**
 * 背景の追加、選択、描画モード選択
 * @constructor
 */
const CssEditor = (props: EditorProps) => {
  if (!props.data) return <></>;
  const [data, setData] = useState(props.data);
  const update = (key: string, event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    switch (key) {
      case "top_ue":
        data.top.ue = value;
        break;
      case "top_naka":
        data.top.naka = value;
        break;
      case "top_shita":
        data.top.shita = value;
        break;
      case "left":
        data.left = value;
        break;
      case "scale_x":
        data.scale.x = value;
        break;
      case "scale_y":
        data.scale.y = value;
        break;
    }
    setData({ ...data });
  };
  return (
    <Popup close={() => props.close(data)} title={"CSS編集"}>
      <table className={Styles.table}>
        <tr>
          <th colSpan={2}>名前</th>
          <th>値</th>
        </tr>
        <tr>
          <th rowSpan={3}>top</th>
          <th>ue</th>
          <td>
            <input
              type="number"
              value={data.top.ue}
              onChange={(e) => update("top_ue", e)}
            />
          </td>
        </tr>
        <tr>
          <th>naka</th>
          <td>
            <input
              type="number"
              value={data.top.naka}
              onChange={(e) => update("top_naka", e)}
            />
          </td>
        </tr>
        <tr>
          <th>shita</th>
          <td>
            <input
              type="number"
              value={data.top.shita}
              onChange={(e) => update("top_shita", e)}
            />
          </td>
        </tr>
        <tr>
          <th colSpan={2}>left</th>
          <td>
            <input
              type="number"
              value={data.left}
              onChange={(e) => update("left", e)}
            />
          </td>
        </tr>
        <tr>
          <th rowSpan={2}>scale</th>
          <th>x</th>
          <td>
            <input
              type="number"
              value={data.scale.x}
              onChange={(e) => update("scale_x", e)}
            />
          </td>
        </tr>
        <tr>
          <th>y</th>
          <td>
            <input
              type="number"
              value={data.scale.y}
              onChange={(e) => update("scale_y", e)}
            />
          </td>
        </tr>
      </table>
    </Popup>
  );
};
export default CssEditor;
