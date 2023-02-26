const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value"
)?.set;
const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype,
  "value"
)?.set;

const updateReactHTMLInput = (
  targetElement: HTMLInputElement,
  content: string
) => {
  if (!nativeInputValueSetter) return;
  nativeInputValueSetter.call(targetElement, content);
  targetElement.dispatchEvent(new Event("change", { bubbles: true }));
  targetElement.dispatchEvent(new Event("input", { bubbles: true }));
};
const updateReactHTMLTextArea = (
  targetElement: HTMLTextAreaElement,
  content: string
) => {
  if (!nativeTextAreaValueSetter) return;
  nativeTextAreaValueSetter.call(targetElement, content);
  targetElement.dispatchEvent(new Event("change", { bubbles: true }));
  targetElement.dispatchEvent(new Event("input", { bubbles: true }));
};

export { updateReactHTMLInput, updateReactHTMLTextArea };
