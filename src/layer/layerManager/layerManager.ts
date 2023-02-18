import { layer } from "@/@types/layer";
import Styles from "./layerManager.module.scss";
import { replaceCharList } from "@/layer/layerManager/layerManager.replaceCharList";
import { caretUtil } from "@/libraries/caretUtil";
import { typeGuard } from "@/libraries/typeGuard";

const ua = window.navigator.userAgent,
  isChromium = !!ua.match(/Chrome/),
  isFirefox = !!ua.match(/Firefox/);
/**
 * レイヤーとイベントハンドラの管理
 * @deprecated
 * @param data {layer}
 * @param onChange
 * @param targetElement
 * @param replaceMode
 */
const layerManager = (
  data: layer,
  onChange: (layer: layer) => void,
  targetElement: HTMLDivElement,
  replaceMode: boolean
) => {
  targetElement.setAttribute("layerId", data.layerId);
  targetElement.id = `dansk:layer:${data.layerId}`;
  /**
   * 変更の際に勝手に生えたdivを消したり消えたdivを生やしたり
   * 変更があった際はコールバック(onChange)を呼ぶ
   */
  const update = (e?: Event): void => {
    if (e?.isComposing === true) return;
    for (const element of Array.from(targetElement.children)) {
      if (element.children.length === 0) continue;
      if (element.children[0]?.tagName === "BR" && isChromium) {
        element.children[0].remove();
      }
      for (const child of Array.from(element.childNodes)) {
        if (!child.nodeName.match(/#text|BR|SPAN/)) {
          child.remove();
        }
      }
    }
    const caretPos = caretUtil.get(targetElement),
      focusedNode = caretUtil.getFocusedNode(),
      focusedPos = focusedNode ? caretUtil.get(focusedNode) : -1,
      focusedLines = focusedNode?.textContent?.split(/\r?\n/g);
    const strings = getInnerText(targetElement, data.height);
    adjustChildren(targetElement, data.height);
    const groupElements = Array.from(
      targetElement.children
    ) as HTMLDivElement[];
    let isChanged = false,
      index = 0;
    data.content.forEach((group) => {
      group.content.forEach((item, itemIndex) => {
        const itemElement = groupElements[index];
        if (!itemElement) return;
        itemElement.id = `dansk:layer${data.layerId}Line${index}`;
        itemElement.classList.add(
          Styles.danskLayerItem || "_",
          "dansk:layerLineItem"
        );
        itemElement.setAttribute("lineIndex", `${index}`);
        itemElement.style.lineHeight = `${group.line}px`;
        itemElement.style.height = `${group.line}px`;
        itemElement.style.fontSize = `${group.font}px`;
        itemElement.style.whiteSpace = "pre";

        if (group.lineCount - 1 === itemIndex && group.height) {
          itemElement.style.marginBottom = `${
            group.height - group.line * group.lineCount
          }px`;
        } else {
          itemElement.style.margin = "0";
        }
        if (itemElement.innerHTML === "") {
          itemElement.innerHTML = "<br>";
        }
        if (
          itemElement.innerText !== `${strings[index]}${isFirefox ? "\n" : ""}`
        ) {
          itemElement.innerText = `${strings[index]}${isFirefox ? "\n" : ""}`;
        }
        if (strings[index]?.match(/[\u00A0\u0020]/)) {
          itemElement.style.background = "rgba(255,0,0,0.3)";
        } else {
          if (item !== strings[index]) {
            if (data.overwrite) {
              itemElement.innerText = `${group.content[itemIndex]}${
                isFirefox ? "\n" : ""
              }`;
            } else {
              group.content[itemIndex] = strings[index] as string;
            }
            isChanged = true;
          }
          itemElement.style.background = "none";
        }

        index++;
      });
    });
    if (data.overwrite) {
      onChange(data);
    } else if (isChanged) {
      onChange(data);
      if (caretPos && focusedLines) {
        let focusedText = undefined;
        let focusedCaretPos = undefined;
        if (focusedPos && focusedLines.length > 1) {
          let offset = 0;
          for (let i = 0; i < focusedLines.length; i++) {
            const value = focusedLines[i];
            if (!value) continue;
            if (offset + value.length < focusedPos) {
              offset += value.length;
            } else {
              focusedCaretPos = focusedPos - offset;
              focusedText = focusedLines[i];
              break;
            }
          }
        } else {
          focusedText = focusedLines[0];
          focusedCaretPos = focusedPos;
        }
        let offset = 0;
        for (const element of Array.from(
          targetElement.children
        ) as HTMLDivElement[]) {
          const length = element.innerText.length + (isFirefox ? -1 : 0);
          if (offset + length < caretPos) {
            offset += length;
          } else if (
            element.innerText === `${focusedText}${isFirefox ? "\n" : ""}` &&
            caretPos - offset === focusedCaretPos
          ) {
            caretUtil.set(element, caretPos - offset);
            break;
          } else {
            offset += length;
          }
        }
      }
    }
    if (window.getSelection()?.anchorNode === targetElement) {
      (targetElement.firstElementChild as HTMLDivElement).focus();
      document.getSelection()?.collapse(targetElement.firstElementChild, 0);
    }
    return;
  };
  //引用元: https://zenn.dev/takky94/articles/36656269da7c33
  targetElement.onpaste = (e: ClipboardEvent) => {
    if (!e.clipboardData) return;
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    console.log(selection, caretUtil.getFocusedElement());
    selection.deleteFromDocument();
    const isEOL = caretUtil.isEOL(targetElement);
    const _pos = caretUtil.get(targetElement);
    console.log(
      isEOL,
      _pos,
      document.activeElement,
      caretUtil.getFocusedElement(),
      caretUtil.getFocusedNode()
    );
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.getRangeAt(0).collapse();
    e.preventDefault();
    update();
  };
  update();
  targetElement.oninput = update;
  targetElement.onblur = update;
  targetElement.oncopy = (e) => {
    const copied = window.getSelection()?.toString() || "";
    e.clipboardData?.setData("text/plain", copied);
    e.preventDefault();
  };
  targetElement.onkeydown = (e) => {
    const char = replaceCharList[e.key];
    if (
      !replaceMode ||
      e.isComposing ||
      !char ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey
    )
      return;
    let focusedElement = caretUtil.getFocusedElement();
    if (focusedElement?.contentEditable === "true") {
      adjustChildren(targetElement, data.height);
      focusedElement = targetElement.firstElementChild as HTMLElement;
      focusedElement.focus();
    }
    if (!typeGuard.dom.isDivElement(focusedElement)) return;
    const caretPos = caretUtil.get(focusedElement);
    if (caretPos === undefined) return;
    e.preventDefault();
    focusedElement.innerText = `${focusedElement.innerText.slice(
      0,
      caretPos
    )}${char}${focusedElement.innerText.slice(caretPos)}`;
    caretUtil.set(focusedElement, caretPos + 1);
  };
};

/**
 * content editable用に行単位でdivを生やす
 * 多かったら減らす
 * @param targetElement {HTMLDivElement} 親要素
 * @param length {number} 子要素の数
 */
const adjustChildren = (targetElement: HTMLDivElement, length: number) => {
  for (const element of Array.from(targetElement.childNodes)) {
    if (element.nodeName !== "DIV") {
      element.remove();
    }
  }
  while (targetElement.children.length < length) {
    targetElement.appendChild(document.createElement("div"));
  }
  let isFocusLost = false;
  while (targetElement.children.length > length) {
    if (
      targetElement.lastElementChild &&
      caretUtil.getFocusedElement()?.isEqualNode(targetElement.lastElementChild)
    ) {
      isFocusLost = true;
    }
    targetElement.lastElementChild?.remove();
  }
  if (isFocusLost && targetElement.lastElementChild) {
    caretUtil.set(
      targetElement.lastElementChild as HTMLDivElement,
      (targetElement.lastElementChild as HTMLDivElement).innerText.length - 1
    );
  }
};

/**
 * Element.innerTextのラッパー的なもの
 * 行数の調整もする
 * @param targetElement {HTMLDivElement} 親要素
 * @param length {number} 子要素の数
 */
const getInnerText = (
  targetElement: HTMLDivElement,
  length: number
): string[] => {
  const strings: string[] = [];
  if (targetElement.childNodes[isFirefox ? 0 : 1]?.nodeName === "#text") {
    strings.push(
      ...targetElement.innerText.replace(/\n$/, "").split(/\r\n|\r|\n/)
    );
  } else {
    for (const itemElement of Array.from(
      targetElement.children
    ) as HTMLDivElement[]) {
      strings.push(
        ...itemElement.innerText.replace(/\n$/, "").split(/\r\n|\r|\n/)
      );
    }
  }
  while (strings.length < length) {
    strings.push("");
  }
  if (strings.length > length) {
    strings[length - 1] = strings.slice(length - 1).join("");
    strings.splice(length);
  }
  return strings;
};

export { layerManager };
