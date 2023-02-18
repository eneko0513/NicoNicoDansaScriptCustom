import React, { useMemo } from "react";
import { Popup } from "@/components/popup/Popup";
import Styles from "./CommentsDetail.module.scss";
import { time2str } from "@/libraries/timeUtil";
import { Storage } from "@/libraries/localStorage";

type propType = {
  textareaValue: string[];
  isReverse: boolean;
  close: () => void;
};

const CommentsDetail: React.FC<propType> = (props) => {
  const commentDetails = useMemo(() => {
    let timeMSec = 0;
    timeMSec = window.__videoplayer.currentTime();
    return props.textareaValue.map((text) => {
      const targetLine = text
        ?.replace(/\[A0]/gi, "\u00A0")
        .replace(/\[SP]/gi, "\u3000")
        .replace(/\[00]/gi, "\u2000")
        .replace(/\[01]/gi, "\u2001")
        .replace(/\[02]/gi, "\u2002")
        .replace(/\[03]/gi, "\u2003")
        .replace(/\[04]/gi, "\u2004")
        .replace(/\[05]/gi, "\u2005")
        .replace(/\[06]/gi, "\u2006")
        .replace(/\[0A]/gi, "\u200A")
        .replace(/\[0B]/gi, "\u200B")
        .replace(/\[TA?B]/gi, "\u0009");
      let comment = targetLine;
      let command = "";
      for (;;) {
        const match = comment?.match(/^(?:\[([^\]]+)])?(.*)/);
        if (!match || !match[2]) break;
        comment = match[2];
        if (match[1]) {
          const seekCommand = match[1].match(/tm(?:(\d+):)?(\d+)(?:\.(\d+))?/);
          if (seekCommand) {
            if (!seekCommand[1] && !seekCommand[3]) {
              timeMSec +=
                Number(seekCommand[2]) /
                (Storage.get("options_useMs") === "true" ? 1000 : 100);
            } else {
              let currentTime = 0;
              if (seekCommand[1]) currentTime += Number(seekCommand[1]) * 60;
              if (seekCommand[2]) currentTime += Number(seekCommand[2]);
              if (seekCommand[3])
                currentTime +=
                  Number(seekCommand[3]) / Math.pow(10, seekCommand[3].length);
              timeMSec = currentTime;
            }
            if (timeMSec < 0) timeMSec = 0;
            if (timeMSec > window.__videoplayer.duration())
              timeMSec = window.__videoplayer.duration();
          } else {
            command = match[1];
          }
        } else {
          break;
        }
      }
      comment = comment.replace(/<BR>/gi, "\n");
      const row = comment.split("\n").length;
      const length = comment.length;
      const time = time2str(timeMSec);
      return { row, length, time, command };
    });
  }, [props.textareaValue]);
  return (
    <Popup
      title={props.isReverse ? "コメント詳細(逆モード)" : "コメント詳細"}
      close={props.close}
    >
      <div className={Styles.wrapper}>
        {props.textareaValue.length == 0 ? (
          <p>コメントがありません。</p>
        ) : (
          <table className={Styles.table}>
            <thead>
              <tr>
                <th>コメ番</th>
                <th>時間</th>
                <th>行数</th>
                <th>文字数</th>
                <th>コマンド</th>
              </tr>
            </thead>
            <tbody>
              {props.isReverse
                ? commentDetails
                    .map((detail, i) => {
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>{detail.time}</td>
                          <td>{detail.row}</td>
                          <td>{detail.length}</td>
                          <td className={Styles.commandTd}>{detail.command}</td>
                        </tr>
                      );
                    })
                    .reverse()
                : commentDetails.map((detail, i) => {
                    return (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{detail.time}</td>
                        <td>{detail.row}</td>
                        <td>{detail.length}</td>
                        <td className={Styles.commandTd}>{detail.command}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        )}
      </div>
    </Popup>
  );
};

export { CommentsDetail };
