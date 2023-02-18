import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { Spoiler } from "@/components/spoiler/Spoiler";
import Styles from "./OutputBox.module.scss";
import { Button } from "@/components/button/Button";
import { sleep } from "@/libraries/sleep";
import { Storage } from "@/libraries/localStorage";
import { CommentsDetail } from "@/footers/commentsDetail/CommentsDetail";
import { useAtom } from "jotai";
import { elementAtom, exportLayerAtom } from "@/atoms";

/**
 * 入出力用のテキストエリア
 * @constructor
 */
const OutputBox = (): JSX.Element => {
  const [elements] = useAtom(elementAtom),
    [exportLayer, setExportLayer] = useAtom(exportLayerAtom),
    [textareaValue, setTextareaValue] = useState<string[]>([]),
    [isReverse, setIsReverse] = useState<boolean>(false),
    [isPosting, setIsPosting] = useState<boolean>(false),
    [isShowDetails, setIsShowDetails] = useState<boolean>(false),
    [spoilerMessage, setSpoilerMessage] = useState<string>(""),
    postAllCancel = useRef<boolean>(false);
  useEffect(() => {
    if (!elements || exportLayer.length === 0) return;
    setTextareaValue([...textareaValue, ...exportLayer]);
    setExportLayer([]);
  }, [exportLayer, textareaValue]);
  const getCommandAndComment = (
    stringArr: string[],
    isReverse: boolean
  ): { command: string; comment: string } | undefined => {
    if (!window.__videoplayer.paused()) window.__videoplayer.pause();
    const targetLine = stringArr[isReverse ? stringArr.length - 1 : 0]
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
    let command = "";
    const match = targetLine?.match(/^(?:\[([^\]]+)])?(.*)/);
    if (!match || !match[2]) return;
    let comment = match[2];
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
    const seekCommand = command.match(/tm(?:(\d+):)?(\d+)(?:\.(\d+))?/);
    if (seekCommand) {
      if (!seekCommand[1] && !seekCommand[3]) {
        window.__videoplayer.currentTime(
          window.__videoplayer.currentTime() +
            Number(seekCommand[2]) /
              (Storage.get("options_useMs") === "true" ? 1000 : 100)
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
    comment = comment.replace(/<BR>/gi, "\n");
    return { command, comment };
  };
  const setLine = (command: string, comment: string): boolean => {
    if (!elements) return false;
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
    if (command != "") {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      if (!nativeInputValueSetter) return false;
      nativeInputValueSetter.call(elements.commentCommandInput, command);
      elements.commentCommandInput.dispatchEvent(
        new Event("change", { bubbles: true })
      );
      elements.commentCommandInput.dispatchEvent(
        new Event("input", { bubbles: true })
      );
    }
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    if (!nativeTextAreaValueSetter) return false;
    nativeTextAreaValueSetter.call(elements.commentInputTextarea, comment);
    elements.commentInputTextarea.dispatchEvent(
      new Event("input", { bubbles: true })
    );
    return true;
  };
  const onSetLineClick = useCallback(() => {
      if (!elements || textareaValue.length === 0) return;
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
        if (!elements) return;
        postAllCancel.current = false;
        const isOwnerMode = !!location.href.match(
            /^https:\/\/www\.nicovideo\.jp\/watch\/[^/]+\/edit\/owner_comment/
          ),
          length = textareaValue.length;
        const timeSpan = Number(
          Storage.get(
            isOwnerMode ? "options_timespan_owner" : "options_timespan_main"
          )
        );
        setIsPosting(true);
        setSpoilerMessage("待機中");
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
          await sleep(timeSpan);
          setSpoilerMessage(
            `セット中(進行度: ${i + 1}/${length} 文字数: ${
              content.comment.length
            })`
          );
          if (setLine(content.command, content.comment)) {
            if (isReverse) {
              textareaValue.pop();
            } else {
              textareaValue.shift();
            }
            await sleep(200);
            elements.commentInputTextarea.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
              })
            );
            setTextareaValue([...textareaValue]);
            setSpoilerMessage(
              `投下しました(進行度: ${i + 1}/${length} 文字数: ${
                content.comment.length
              })`
            );
          } else {
            setSpoilerMessage(
              `セットに失敗しました(進行度: ${i + 1}/${length} 文字数: ${
                content.comment.length
              })`
            );
          }
        }
        setIsPosting(false);
      };
      void postAll();
    }, [textareaValue, elements]),
    onPostAllCancel = useCallback(() => (postAllCancel.current = true), []),
    toggleIsReverse = useCallback(() => {
      setIsReverse(!isReverse);
    }, [isReverse]),
    toggleCommentsDetail = useCallback(() => {
      setIsShowDetails(!isShowDetails);
    }, [isShowDetails]);
  if (exportLayer === undefined) return <></>;
  return (
    <>
      <Spoiler text={"Box"} message={spoilerMessage}>
        <div className={Styles.table}>
          <div className={Styles.row}>
            <textarea
              className={Styles.textarea}
              value={textareaValue.join("\n")}
              disabled={isPosting}
              wrap="off"
              spellCheck={false}
              onChange={(e) => {
                const data = e.target.value.split(/\r\n|\r|\n/);
                setTextareaValue(e.target.value === "" ? [] : data);
              }}
            ></textarea>
          </div>
          <div className={Styles.row}>
            <div className={Styles.block}>
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
                <Button
                  disabled={isPosting}
                  text="全行投下"
                  click={onPostAll}
                />
              )}
              <Button
                disabled={isPosting}
                text="クリア"
                click={() => setTextareaValue([])}
              />
            </div>
            <div className={Styles.block}>
              <Button
                disabled={isPosting}
                text="逆から"
                click={toggleIsReverse}
                active={isReverse}
              />
            </div>
            <div className={Styles.block}>
              <Button
                disabled={isPosting}
                text="コメント詳細"
                click={toggleCommentsDetail}
              />
            </div>
            <div className={Styles.right}>
              <p className={Styles.rowMessage}>行数: {textareaValue.length}</p>
            </div>
          </div>
        </div>
      </Spoiler>
      {isShowDetails && (
        <CommentsDetail
          close={toggleCommentsDetail}
          textareaValue={textareaValue}
          isReverse={isReverse}
        />
      )}
    </>
  );
};
export { OutputBox };
