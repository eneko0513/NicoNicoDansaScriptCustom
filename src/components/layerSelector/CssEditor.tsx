import React, { ChangeEvent, useState } from "react";
import Popup from "@/components/popup/Popup";
import Styles from "./CssEditor.module.scss";
import { layer } from "@/@types/types";
import Layer from "@/components/layer/Layer";

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

    if (key === "top_ue") {
      data.top.ue = value;
    } else if (key === "top_naka") {
      data.top.naka = value;
    } else if (key === "top_shita") {
      data.top.shita = value;
    } else if (key === "left") {
      data.left = value;
    } else if (key === "areaWidth") {
      data.areaWidth = value;
    } else if (key === "width") {
      data.width = value;
    } else if (key === "scale_x") {
      data.scale.x = value;
    } else if (key === "scale_y") {
      data.scale.y = value;
    } else {
      const match = key.match(/^comment_(font|line|height)_(\d+)$/);
      if (!match) return;
      const target = data.content[Number(match[2])];
      if (!target) return;
      if (match[1] === "font") {
        target.font = value;
      } else if (match[1] === "line") {
        target.line = value;
      } else if (match[1] === "height") {
        target.height = value;
      }
    }
    setData({ ...data });
  };
  return (
    <Popup close={() => props.close(data)} title={"CSS編集"}>
      <div className={Styles.row}>
        <div className={Styles.preview}>
          <div className={Styles.layerWrapper}>
            <Layer data={data} key={0} id={0} />
          </div>
        </div>
        <div className={Styles.tableWrapper}>
          <table className={Styles.table}>
            <thead>
              <tr>
                <th colSpan={2}>名前</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
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
                <th colSpan={2}>areaWidth</th>
                <td>
                  <input
                    type="number"
                    value={data.areaWidth}
                    onChange={(e) => update("areaWidth", e)}
                  />
                </td>
              </tr>
              <tr>
                <th colSpan={2}>width</th>
                <td>
                  <input
                    type="number"
                    value={data.width}
                    onChange={(e) => update("width", e)}
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
            </tbody>
          </table>
          {data.content.map((value, index) => {
            return (
              <table className={Styles.table} key={`comment${index}`}>
                <thead>
                  <tr>
                    <th colSpan={2}>名前</th>
                    <th>値</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th rowSpan={3}>コメント{index + 1}</th>
                    <th>fontSize</th>
                    <td>
                      <input
                        type="number"
                        value={value.font}
                        onChange={(e) => update(`comment_font_${index}`, e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>lineHeight</th>
                    <td>
                      <input
                        type="number"
                        value={value.line}
                        onChange={(e) => update(`comment_line_${index}`, e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>height</th>
                    <td>
                      <input
                        type="number"
                        value={value.height || value.line * value.lineCount}
                        onChange={(e) => update(`comment_height_${index}`, e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })}
        </div>
      </div>
    </Popup>
  );
};
export default CssEditor;
