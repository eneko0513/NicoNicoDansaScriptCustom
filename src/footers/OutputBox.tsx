import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { context } from "@/components/Context";
import React from "react";
import Spoiler from "@/components/spoiler/Spoiler";
import Styles from "./OutputBox.module.scss";
import Button from "@/components/button/Button";
import sleep from "@/libraries/sleep";
import localStorage from "@/libraries/localStorage";

/**
 * 入出力用のテキストエリア
 * @constructor
 */
const OutputBox = (): JSX.Element => {
  const {
      exportLayer,
      setExportLayer,
      commentInputTextarea,
      commentCommandInput,
    } = useContext(context),
    [textareaValue, setTextareaValue] = useState<string[]>([]),
    [isReverse, setIsReverse] = useState<boolean>(false),
    [isPosting, setIsPosting] = useState<boolean>(false),
    [spoilerMessage, setSpoilerMessage] = useState<string>(""),
    postAllCancel = useRef<boolean>(false);
  useEffect(() => {
    if (
      exportLayer === undefined ||
      setExportLayer === undefined ||
      exportLayer.length === 0
    )
      return;
    setTextareaValue([...textareaValue, ...exportLayer]);
    setExportLayer([]);
  }, [exportLayer]);
  const getCommandAndComment = (
    stringArr: string[],
    isReverse: boolean
  ): { command: string; comment: string } | undefined => {
    if (!window.__videoplayer.paused()) window.__videoplayer.pause();
    const targetLine = stringArr[isReverse ? stringArr.length - 1 : 0];
    let command = "";
    const match = targetLine?.match(/^(?:\[([^\]]+)])?(.*)/);
    if (!match || !match[2]) return;
    const comment = match[2];
    if (match[1]) {
      command = match[1];
    } else if (isReverse) {
      for (let i = stringArr.length - 1; i >= 0; i--) {
        const match = stringArr[i]?.match(/^\[([^\]]+)]/);
        if (match && match[1]) {
          command = match[1];
          break;
        }
      }
    }
    const seekCommand = command.match(/\[tm(?:(\d+):)?(\d+)(?:\.(\d+))?]/);
    if (seekCommand) {
      if (!seekCommand[1] && !seekCommand[3]) {
        window.__videoplayer.currentTime(
          window.__videoplayer.currentTime() +
            Number(seekCommand[2]) /
              (localStorage.get("options_useMs") === "true" ? 1000 : 100)
        );
      } else {
        let currentTime = 0;
        if (seekCommand[1]) currentTime += Number(seekCommand[1]) * 60;
        if (seekCommand[2]) currentTime += Number(seekCommand[2]);
        if (seekCommand[3])
          currentTime +=
            Number(seekCommand[3]) / Math.pow(10, seekCommand[3].length);
        window.__videoplayer.currentTime(currentTime);
      }
      stringArr[isReverse ? stringArr.length - 1 : 0] = comment;
      return getCommandAndComment(stringArr, isReverse);
    }
    return { command, comment };
  };
  const setLine = (command: string, comment: string): boolean => {
    if (!commentCommandInput || !commentInputTextarea) return false;
    comment = comment
      .replace(/\[A0]/gi, "\u00A0")
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
      .replace(/\[TB]/gi, "\u0009")
      .replace(/\[TAB]/gi, "\u0009")
      .replace(/<BR>/gi, "\n");
    /*
     * Reactの管理するelement.valueは正常に動作しないので↓を参考にする
     * https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
     */
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    if (!nativeInputValueSetter) return false;
    nativeInputValueSetter.call(commentCommandInput, command);
    commentCommandInput.dispatchEvent(new Event("change", { bubbles: true }));
    commentCommandInput.dispatchEvent(new Event("input", { bubbles: true }));
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    if (!nativeTextAreaValueSetter) return false;
    nativeTextAreaValueSetter.call(commentInputTextarea, comment);
    commentInputTextarea.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  };
  const onSetLineClick = useCallback(() => {
      if (
        !commentCommandInput ||
        !commentInputTextarea ||
        textareaValue.length === 0
      )
        return;
      const content = getCommandAndComment(textareaValue, isReverse);
      if (!content) return;
      if (setLine(content.command, content.comment)) {
        if (isReverse) {
          textareaValue.pop();
        } else {
          textareaValue.shift();
        }
        setTextareaValue([...textareaValue]);
      }
    }, [textareaValue, isReverse]),
    onPostAll = useCallback(() => {
      const postAll = async () => {
        if (!commentInputTextarea) return;
        postAllCancel.current = false;
        const isOwnerMode = !!location.href.match(
            /^https:\/\/www\.nicovideo\.jp\/watch\/[^/]+\/edit\/owner_comment/
          ),
          length = textareaValue.length;
        setIsPosting(true);
        setSpoilerMessage("待機中");
        await sleep(isOwnerMode ? 1000 : 6000);
        for (let i = 0; i < length; i++) {
          if (postAllCancel.current) {
            setIsPosting(false);
            postAllCancel.current = false;
            setSpoilerMessage("キャンセルされました");
            return;
          }
          const content = getCommandAndComment(textareaValue, isReverse);
          if (!content) {
            setIsPosting(false);
            setSpoilerMessage("コメントデータのパースに失敗しました");
            return;
          }
          const timeSpan = Number(
            localStorage.get(
              isOwnerMode ? "options_timespan_owner" : "options_timespan_main"
            )
          );
          setSpoilerMessage(`セット中(${i + 1}/${length})`);
          if (setLine(content.command, content.comment)) {
            if (isReverse) {
              textareaValue.pop();
            } else {
              textareaValue.shift();
            }
            await sleep(timeSpan);
            commentInputTextarea.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
              })
            );
            setTextareaValue([...textareaValue]);
            setSpoilerMessage(`投下しました(${i + 1}/${length})`);
          } else {
            setSpoilerMessage(`セットに失敗しました(${i + 1}/${length})`);
          }
          await sleep(timeSpan);
        }
        setIsPosting(false);
      };
      void postAll();
    }, [textareaValue, commentInputTextarea]),
    onPostAllCancel = useCallback(() => (postAllCancel.current = true), []),
    toggleIsReverse = useCallback(() => {
      setIsReverse(!isReverse);
    }, [isReverse]);
  if (exportLayer === undefined) return <></>;
  return (
    <Spoiler text={"Box"} message={spoilerMessage}>
      <div className={Styles.table}>
        <div className={Styles.row}>
          <textarea
            className={Styles.textarea}
            value={textareaValue.join("\n")}
            disabled={isPosting}
            onChange={(e) =>
              setTextareaValue(e.target.value.split(/\r\n|\r|\n/))
            }
          ></textarea>
        </div>
        <div className={Styles.row}>
          <Button
            disabled={isPosting}
            text="逆から"
            click={toggleIsReverse}
            active={isReverse}
          />
          <Button
            disabled={isPosting}
            text="1行セット"
            click={onSetLineClick}
          />
          {isPosting ? (
            <Button
              disabled={!isPosting}
              text="キャンセル"
              click={onPostAllCancel}
            />
          ) : (
            <Button disabled={isPosting} text="全行投下" click={onPostAll} />
          )}
        </div>
      </div>
    </Spoiler>
  );
};
export default OutputBox;
