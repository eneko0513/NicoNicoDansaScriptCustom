import React, { useContext, useState } from "react";
import Styles from "./Backup.module.scss";
import localStorage from "@/libraries/localStorage";
import typeGuard from "@/libraries/typeGuard";
import Popup from "@/components/popup/Popup";
import { autoSave } from "@/@types/types";
import Button from "@/components/button/Button";
import { layerContext } from "@/components/LayerContext";

type propType = {
  close: () => void;
};
/**
 * スポイラー
 * text: ブロックのタイトル
 * message: タイトルの右に表示されるテキスト
 * @param props
 * @constructor
 */
const Backup: React.FC<propType> = (props) => {
  const [saveData, setSaveData] = useState<autoSave[]>(() => {
      const data: unknown = JSON.parse(localStorage.get("autoSave"));
      if (!typeGuard.localStorage.isAutoSave(data)) return [];
      return data;
    }),
    { setLayerData } = useContext(layerContext);
  const load = (key: string) => {
      const value = saveData[Number(key)];
      if (
        !value ||
        !setLayerData ||
        !confirm("現在作業中のデータが消えてしまいますがよろしいですか？")
      )
        return;
      setLayerData([]);
      setTimeout(() => setLayerData(value.data), 1);
      props.close();
    },
    remove = (key: string) => {
      saveData.splice(Number(key), 1);
      setSaveData([...saveData]);
      localStorage.set("autoSave", saveData);
    };
  return (
    <Popup title={"自動保存"} close={props.close}>
      <div className={Styles.wrapper}>
        {saveData.length == 0 ? (
          <p>バックアップがありません。</p>
        ) : (
          Object.keys(saveData)
            .reverse()
            .map((key) => {
              const value = saveData[Number(key)];
              if (!value) return <span key={key}></span>;
              return (
                <div className={Styles.block} key={key}>
                  <h3>
                    {new Date(value.timestamp).toLocaleString()}のバックアップ
                  </h3>
                  <p>レイヤー数：{value.data.length}</p>
                  <div>
                    <Button click={() => load(key)} text={"復元"} />
                    <Button click={() => remove(key)} text={"削除"} />
                  </div>
                </div>
              );
            })
        )}
      </div>
    </Popup>
  );
};
export default Backup;
