import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Spoiler from "@/components/spoiler/Spoiler";
import Styles from "./Trace.module.scss";
import Button from "@/components/button/Button";
import Dropdown from "@/components/dropdown/Dropdown";
import Templates from "@/headers/Trace.templates";
import { context } from "@/components/Context";
import { layer, optionDataType } from "@/@types/types";
import LayerSelector from "@/components/layerSelector/LayerSelector";
import layerUtil from "@/libraries/layerUtil";
import typeGuard from "@/libraries/typeGuard";
import LayerPortal from "@/components/LayerPortal";
import LayerContext from "@/components/LayerContext";
import BackgroundPicker from "@/components/backgroundPicker/BackgroundPicker";
import LayerEditor from "@/components/layerEditor/LayerEditor";
import Options_ from "@/options/Options";
import Popup from "@/components/popup/Popup";
import localStorage from "@/libraries/localStorage";
import Backup from "@/components/backup/Backup";

/**
 * Traceブロック
 * @constructor
 */
const Trace = () => {
  const [tabMode, setTabMode] = useState<boolean>(false),
    [layerDropdownValue, setLayerDropdownValue] = useState<string>(
      "big_ue_ender_full_gothic_W17_L9"
    ),
    [layerData, setLayerData] = useState<layer[]>([]),
    [optionData, setOptionData] = useState<optionDataType>({
      bgActive: -1,
      bgImages: [],
      bgEditing: false,
      bgMode: "fill",
      bgVisible: true,
      grid: false,
      replace: false,
    }),
    [optionEditing, setOptionEditing] = useState<boolean>(false),
    [autoSaveWindow, setAutoSaveWindow] = useState<boolean>(false),
    { exportLayer, setExportLayer } = useContext(context);
  const layerDataRef = useRef(layerData),
    autoSaveInterval = useRef<number>(-1);
  useEffect(() => {
    layerDataRef.current = layerData;
  }, [layerData]);
  useEffect(() => {
    const span = Number(localStorage.get("options_autoSave_span"));
    if (span <= 0) return;
    autoSaveInterval.current = window.setInterval(() => {
      const data: unknown = JSON.parse(localStorage.get("autoSave"));
      if (!typeGuard.localStorage.isAutoSave(data)) return;
      data.push({ data: layerDataRef.current, timestamp: Date.now() });
      if (data.length > Number(localStorage.get("options_autoSave_max"))) {
        data.shift();
      }
      localStorage.set("autoSave", data);
    }, span * 60 * 1000);
    return () => {
      window.clearInterval(autoSaveInterval.current);
      autoSaveInterval.current = -1;
    };
  }, [setTabMode]);
  if (exportLayer === undefined || setExportLayer === undefined) return <></>;
  const exportHandler = useCallback(
      (value: string) => {
        const layerString: string[] = [],
          isMonospaced = !!value.match(/Monospaced/),
          isOwner = !!value.match(/Owner/),
          isSelectedOnly = !!value.match(/Selected/);
        const targetData: layer[] = [];
        for (const layer of layerData) {
          if (isSelectedOnly && !layer.selected) continue;
          targetData.push(layer);
        }
        const strings = layerUtil.toString(
          targetData,
          isMonospaced,
          tabMode,
          isOwner
        );
        if (!strings) return;
        for (const string of strings) {
          for (const line of string.content) {
            if (string.command) {
              layerString.push(string.command + line);
              string.command = "";
            } else {
              layerString.push(line);
            }
          }
        }
        setExportLayer([...exportLayer, ...layerString]);
      },
      [exportLayer, layerData]
    ),
    toggleTabMode = useCallback(() => setTabMode(!tabMode), [tabMode]),
    toggleReplaceMode = useCallback(
      () => setOptionData({ ...optionData, replace: !optionData.replace }),
      [optionData]
    ),
    toggleGridMode = useCallback(
      () => setOptionData({ ...optionData, grid: !optionData.grid }),
      [optionData]
    ),
    layerDropdownOnChange = useCallback(
      (value: string) => setLayerDropdownValue(value),
      []
    ),
    openBackgroundMenu = useCallback(
      () => setOptionData({ ...optionData, bgEditing: true }),
      [optionData]
    ),
    toggleBackgroundVisible = useCallback(
      () => setOptionData({ ...optionData, bgVisible: !optionData.bgVisible }),
      [optionData]
    ),
    toggleOptionEditing = useCallback(
      () => setOptionEditing(!optionEditing),
      [optionEditing]
    ),
    addLayer = useCallback(() => {
      const id = layerUtil.getIdByValue(layerDropdownValue);
      const template = Templates[id];
      if (!typeGuard.trace.template(template)) return;
      const _layerData = layerData.map((value) => {
        value.selected = false;
        return value;
      });
      setLayerData([
        ..._layerData,
        {
          ...template,
          type: id,
          font: "gothic",
          visible: true,
          content: layerUtil.generateLineFromTemplate(template),
          selected: true,
          color: "#000000",
        },
      ]);
    }, [layerData, layerDropdownValue]),
    toggleVisible = useCallback(
      (value: string) => {
        const tmpLayer = layerData.map((layer) => {
          layer.visible = value === "visible";
          return layer;
        });
        setLayerData([...tmpLayer]);
      },
      [layerData]
    ),
    saveToFile = useCallback(() => {
      const json = JSON.stringify(layerData);
      const blob = new Blob([json], { type: "application/json" });
      const fileName = window.prompt("ファイル名を入力してください", "");
      if (fileName === "" || fileName === null) {
        alert("キャンセルされました");
        return;
      }
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileName}.dansk.json`;
      link.click();
    }, [layerData]),
    loadFromAutoSave = useCallback(() => {
      setAutoSaveWindow(true);
    }, []),
    loadFromFile = useCallback(() => {
      if (!confirm("現在作業中のデータが消えてしまいますがよろしいですか？"))
        return;
      const reader = new FileReader();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".dansk.json,*";
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target?.files && target.files[0]) {
          reader.readAsText(target.files[0]);
        }
      };
      reader.onload = function (e) {
        if (typeof e.target?.result !== "string") return;
        const data: unknown = JSON.parse(e.target.result);
        if (!typeGuard.layer.isLayers(data)) return;
        setLayerData(
          data.map((layer) => {
            layer.overwrite = true;
            return layer;
          })
        );
      };
      input.click();
    }, []);
  return (
    <LayerContext
      value={{ layerData, setLayerData, optionData, setOptionData }}
    >
      <Spoiler text={"Trace"}>
        <div className={Styles.table}>
          <div className={Styles.row}>
            <div className={Styles.block}>
              <Button click={exportHandler} text={"全出力"} value={"all"} />
              <Button
                click={exportHandler}
                text={"等幅全出力"}
                value={"MonospacedAll"}
              />
              <Button
                click={exportHandler}
                text={"投コメ全出力"}
                value={"OwnerAll"}
              />
              <Button
                click={exportHandler}
                text={"投コメ等幅全出力"}
                value={"OwnerMonospacedAll"}
              />
              <Button
                click={exportHandler}
                text={"選択出力"}
                value={"SelectedAll"}
              />
              <Button
                click={exportHandler}
                text={"等幅選択出力"}
                value={"SelectedMonospacedAll"}
              />
              <Button
                click={exportHandler}
                text={"投コメ選択出力"}
                value={"SelectedOwnerAll"}
              />
            </div>
            <div className={Styles.block}>
              <Button
                click={toggleTabMode}
                text={"TabM"}
                value={"convertSpaceToTab"}
                active={tabMode}
              />
              <Button
                click={toggleReplaceMode}
                text={"置換M"}
                value={"convertColorToBlack"}
                active={optionData.replace}
              />
            </div>
            <div className={Styles.block}>
              <Button
                click={toggleOptionEditing}
                text={"設定"}
                active={optionEditing}
              />
            </div>
          </div>
          <div className={Styles.row}>
            <div className={Styles.block}>
              <Dropdown
                change={layerDropdownOnChange}
                selected={layerDropdownValue}
                value={Object.values(Templates)}
              />
              <Button click={addLayer} text={"追加"} value={"add"} />
            </div>
            <div className={Styles.block}>
              <Button
                click={toggleVisible}
                text={"一括表示"}
                value={"visible"}
              />
              <Button
                click={toggleVisible}
                text={"一括非表示"}
                value={"invisible"}
              />
            </div>
            <div className={Styles.block}>
              <Button
                click={toggleGridMode}
                text={"グリッド"}
                value={""}
                active={optionData.grid}
              />
            </div>
            <div className={Styles.block}>
              <Button click={openBackgroundMenu} text={"背景設定"} value={""} />
              {optionData?.bgActive > -1 && (
                <Button
                  click={toggleBackgroundVisible}
                  text={optionData.bgVisible ? "画像非表示" : "画像表示"}
                  value={""}
                ></Button>
              )}
            </div>
          </div>
          <div className={`${Styles.row} ${Styles.layer}`}>
            <div className={Styles.block}>
              <LayerSelector />
            </div>
            <div className={Styles.block}>
              <LayerEditor />
            </div>
            <div className={Styles.block}>
              <div className={Styles.row}>
                <Button click={saveToFile} text={"ファイルに保存"} />
              </div>
              <div className={Styles.row}>
                <Button click={loadFromFile} text={"ファイルから読込"} />
              </div>
              <div className={Styles.row}>
                <Button
                  click={loadFromAutoSave}
                  text={"バックアップから読込"}
                />
              </div>
            </div>
          </div>
        </div>
        <LayerPortal />
      </Spoiler>
      {optionData.bgEditing && <BackgroundPicker />}
      {optionEditing && (
        <Popup title={"設定"} close={toggleOptionEditing}>
          <Options_ />
        </Popup>
      )}
      {autoSaveWindow && <Backup close={() => setAutoSaveWindow(false)} />}
    </LayerContext>
  );
};
export default Trace;
