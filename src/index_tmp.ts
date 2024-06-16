/**
 * 読み込みコード
 * window.__videoplayerにアクセスするため、scriptタグで読み込ませる
 */
window.onload = () => {
  setTimeout(() => {
    const script = document.createElement("script");
    script.src = (
      typeof chrome !== "undefined" ? chrome : browser
    ).runtime.getURL("main_tmp.js");
    document.body.append(script);
  }, 1000);
};
