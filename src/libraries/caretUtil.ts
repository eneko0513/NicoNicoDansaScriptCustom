import typeGuard from "@/libraries/typeGuard";

const caretUtil = {
  /**
   * フォーカスされているNodeを返す
   */
  getFocusedNode: (): Node | undefined => {
    if ((document.getSelection()?.rangeCount || 0) === 0) return;
    return document.getSelection()?.getRangeAt(0).endContainer;
  },
  /**
   * フォーカスされてる要素を返す
   */
  getFocusedElement: (): HTMLElement | null | undefined => {
    if ((document.getSelection()?.rangeCount || 0) === 0) return;
    const focusedNode = document.getSelection()?.getRangeAt(0).endContainer;
    return typeGuard.dom.isDivElement(focusedNode)
      ? focusedNode
      : focusedNode?.parentElement;
  },
  /**
   * カーソル位置を返す
   * @param targetElement
   */
  get: (targetElement: Node): number | undefined => {
    if (document.getSelection()?.rangeCount === 0) return undefined;
    const originalRange = document.getSelection()?.getRangeAt(0);
    if (!originalRange) return;
    const range = originalRange.cloneRange();
    range.selectNodeContents(targetElement);
    range.setEnd(originalRange.endContainer, originalRange.endOffset);
    return range.toString().replace(/\r?\n/g, "").length;
  },
  isEOL: (targetElement: Node): boolean | undefined => {
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return undefined;
    const pos1 = caretUtil.get(targetElement);
    selection.modify("move", "forward", "character");
    const pos2 = caretUtil.get(targetElement);
    selection.modify("move", "backward", "character");
    return pos1 == pos2;
  },
  /**
   * カーソル位置を設定する
   * @param targetElement
   * @param offset
   */
  set: (targetElement: HTMLElement, offset: number) => {
    let length = 0,
      index = 0,
      targetNode = targetElement.childNodes[index];
    while ((targetNode?.textContent?.length || 0) + length < offset) {
      length += targetNode?.textContent?.length || 0;
      index++;
      if (targetElement.childNodes.length <= index)
        throw new Error("failed to get target node");
      targetNode = targetElement.childNodes[index];
    }
    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection || !targetNode) return;
    range.setStart(targetNode, offset - length);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  },
};
export default caretUtil;
