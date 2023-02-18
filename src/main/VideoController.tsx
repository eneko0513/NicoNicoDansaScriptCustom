import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Styles from "./VideoController.module.scss";
import { Spoiler } from "@/components/spoiler/Spoiler";
import { str2time, time2str } from "@/libraries/timeUtil";

const buttons: number[] = [0.01, 0.03, 0.1, 0.3, 1, 3];

/**
 * 動画コントローラー
 * buttonsにある秒数(のそれぞれ+-)のボタンが生成される
 * @constructor
 */
const VideoController = (): JSX.Element => {
  const [value, setValue] = useState<string>("0"),
    [isValueChanged, setValueChanged] = useState<boolean>(false),
    [isSeeking, setIsSeeking] = useState<boolean>(false),
    timeInputElement = useRef<HTMLInputElement>(null);

  const updateTime = (time: number, relative = true) => {
    setIsSeeking(true);
    const commentOnOffButton = document.getElementsByClassName(
      "CommentOnOffButton"
    )[0] as HTMLButtonElement;
    if (relative) time += window.__videoplayer.currentTime();
    if (time < 0) time = 0;
    if (time > window.__videoplayer.duration())
      time = window.__videoplayer.duration();
    window.__videoplayer.currentTime(Math.floor(time * 100) / 100 + 0.001);
    if (
      document.getElementsByClassName("CommentOnOffButton-iconHide").length > 0
    ) {
      commentOnOffButton.click();
    }
    commentOnOffButton.click();
    setIsSeeking(false);
  };
  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValueChanged(true);
      setValue(e.target.value);
    },
    [value]
  );
  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      setValueChanged(true);
      const time = str2time(value);
      if (e.key === "Enter" && time !== undefined) {
        (e.target as HTMLInputElement).blur();
      }
    },
    [value]
  );
  const onInputBlur = useCallback(() => {
    if (isValueChanged) {
      const time = str2time(value);
      if (time !== undefined) {
        void updateTime(time, !!value.match(/^[+-]/));
      }
    }
    requestAnimationFrame(updateCurrentTime);
  }, [value]);
  const updateCurrentTime = () => {
    if (document.activeElement === timeInputElement.current) {
      setValueChanged(false);
      return;
    }
    setValue(time2str(window.__videoplayer.currentTime()));
    requestAnimationFrame(updateCurrentTime);
  };
  useEffect(() => updateCurrentTime(), []);

  return (
    <Spoiler text={"Time"}>
      <input
        type={"text"}
        className={Styles.input}
        value={value}
        onBlur={onInputBlur}
        onKeyDown={onInputKeyDown}
        onChange={onInputChange}
        disabled={isSeeking}
        ref={timeInputElement}
      />
      <div className={Styles.table}>
        {buttons.map((data, key) => {
          return (
            <div className={Styles.column} key={key}>
              <button
                className={Styles.row}
                onClick={() => void updateTime(data)}
              >
                +{data.toFixed(2)}
              </button>
              <button
                className={Styles.row}
                onClick={() => void updateTime(data * -1)}
              >
                -{data.toFixed(2)}
              </button>
            </div>
          );
        })}
      </div>
    </Spoiler>
  );
};
export { VideoController };
