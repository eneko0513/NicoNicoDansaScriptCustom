import localStorage from "@/libraries/localStorage";

window.addEventListener("load", () => {
  let _diffX = 0;
  let _diffY = 0;
  let _cloneName = "";
  let _target: HTMLLIElement;
  const ddBoxList = Array.from(
    document.getElementsByClassName(
      "command-order-li"
    ) as HTMLCollectionOf<HTMLLIElement>
  );
  const saveBtn = document.getElementById("saveBtn") as HTMLInputElement;
  const headMes = document.getElementById(
    "headMessage"
  ) as HTMLParagraphElement;
  const util = {
    index(el: HTMLLIElement): number {
      const parent = el.parentElement as HTMLUListElement;
      const siblings = parent.children as HTMLCollectionOf<HTMLLIElement>;
      const siblingsArr = Array.from(siblings);
      const idx = siblingsArr.indexOf(el);

      return idx;
    },
    insertClone(target: HTMLLIElement, insertIdx: number): string {
      const cloneName = `ddItemClone_${Math.trunc(Math.random() * 10000)}`;
      const clone = target.cloneNode(true) as HTMLLinkElement;
      const parent = target.parentElement as HTMLUListElement;
      const siblings = parent.children as HTMLCollectionOf<HTMLLIElement>;

      clone.classList.add("hidden");
      clone.classList.add(cloneName);
      const childbef = siblings[insertIdx] as unknown as HTMLLinkElement;
      childbef.insertAdjacentElement("afterend", clone);

      return cloneName;
    },
    swap(target: HTMLLIElement) {
      const selfIdx = util.index(target);
      const cloneIdx = selfIdx + 1;
      const parent = target.parentElement as HTMLUListElement;
      const siblings = parent.querySelectorAll(
        `:scope > *:not(.onGrab):not(.${_cloneName})`
      );

      for (let thatIdx = 0, len = siblings.length; thatIdx < len; thatIdx++) {
        const targetW = target.offsetWidth;
        const targetH = target.offsetHeight;
        const targetRect = target.getBoundingClientRect();
        const targetRectX = targetRect.left;
        const targetRectY = targetRect.top;
        const that = siblings[thatIdx] as HTMLLIElement;
        const thatW = that.offsetWidth;
        const thatH = that.offsetHeight;
        const thatRect = that.getBoundingClientRect();
        const thatRectX = thatRect.left;
        const thatRectY = thatRect.top;
        const thatRectXHalf = thatRectX + thatW / 2;
        const hitX =
          targetRectX <= thatRectXHalf &&
          targetRectX + targetW >= thatRectXHalf;
        const hitY =
          thatRectY <= targetRectY + targetH &&
          thatRectY + thatH >= targetRectY;
        const isHit = hitX && hitY;

        if (isHit) {
          const siblingsAll =
            parent.children as HTMLCollectionOf<HTMLLIElement>;
          const clone = siblingsAll[cloneIdx] as unknown as HTMLLinkElement;

          parent.insertBefore(
            clone,
            selfIdx > thatIdx ? that : that.nextSibling
          );
          parent.insertBefore(target, clone);

          break;
        }
      }
    },
  };
  const ev = {
    down(e: MouseEvent) {
      const target = e.target as HTMLLIElement;
      const pageX = e.pageX;
      const pageY = e.pageY;
      const targetW = target.offsetWidth;
      const targetRect = target.getBoundingClientRect();
      const targetRectX = targetRect.left;
      const targetRectY = targetRect.top;

      _target = target;
      _diffX = pageX - targetRectX;
      _diffY = pageY - targetRectY;
      _cloneName = util.insertClone(target, util.index(target));
      target.style.width = `${targetW}px`;
      target.classList.add("onGrab");

      this.move(e);

      // ここをアロー関数にするとイベントリスナーをremoveできないので取り敢えずの処置
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window.addEventListener("mousemove", ev.move);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window.addEventListener("mouseup", ev.up);
    },
    move(e: MouseEvent) {
      const target = _target;
      const pageX = e.pageX;
      const pageY = e.pageY;
      const targetPosL = pageX - _diffX;
      const targetPosT = pageY - _diffY;

      target.style.left = `${targetPosL}px`;
      target.style.top = `${targetPosT}px`;
      util.swap(target);
    },
    up() {
      const target = _target;
      const cloneSelector = `.${_cloneName}`;
      const clone = document.querySelector(cloneSelector) as HTMLLIElement;

      _cloneName = "";
      clone.remove();
      target.removeAttribute("style");
      target.classList.remove("onGrab");
      target.classList.remove("onDrag");

      // ここをアロー関数にするとイベントリスナーをremoveできないので取り敢えずの処置
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window.removeEventListener("mousemove", ev.move);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window.removeEventListener("mouseup", ev.up);
    },
  };

  ddBoxList.forEach((el) => {
    el.addEventListener("mousedown", (e) => ev.down(e));
  });

  const saveOption = (): void => {
    const commList = Array.from(
      document.getElementsByClassName(
        "command-order-li"
      ) as HTMLCollectionOf<HTMLLIElement>
    );
    const commandOrder: (string | null)[] = [];
    commList.forEach((v) => commandOrder.push(v.getAttribute("value")));
    localStorage.set("options_commandOrder", commandOrder.join("|"));
    const caInputElm = document.getElementById(
      "additional-command-ca"
    ) as HTMLInputElement;
    localStorage.set("options_useCA", String(caInputElm.checked));
    const patInputElm = document.getElementById(
      "additional-command-pat"
    ) as HTMLInputElement;
    localStorage.set("options_usePat", String(patInputElm.checked));
    const orgInputElm = document.getElementById(
      "additional-command-original"
    ) as HTMLInputElement;
    localStorage.set("options_useOriginal", String(orgInputElm.checked));
    const orgTextInputElm = document.getElementById(
      "additional-command-original-text"
    ) as HTMLInputElement;
    if (orgTextInputElm.value == "" && orgInputElm.checked)
      throw new Error("独自テキストが空です");
    localStorage.set("options_useOriginal_text", orgTextInputElm.value);
    const mainSpanInputElm = document.getElementById(
      "main-comment-span-ms"
    ) as HTMLInputElement;
    localStorage.set("options_timespan_main", mainSpanInputElm.value);
    const ownerSpanInputElm = document.getElementById(
      "owner-comment-span-ms"
    ) as HTMLInputElement;
    localStorage.set("options_timespan_owner", ownerSpanInputElm.value);
    const tmtagElm = document.getElementById(
      "tmtag-use-10ms-base"
    ) as HTMLInputElement;
    localStorage.set("options_useMs", String(tmtagElm.checked));
    const rep01Elm = document.getElementById(
      "rep-color-010101"
    ) as HTMLInputElement;
    localStorage.set("options_lineMode", String(rep01Elm.checked));
  };

  const commJap = (value: string): string => {
    switch (value) {
      case "size":
        return "サイズ";
      case "position":
        return "位置";
      case "color":
        return "色";
      case "font":
        return "フォント";
      case "ender":
        return "ender";
      case "full":
        return "full";
      case "ca":
        return "ca";
      case "patissier":
        return "patissier";
      case "original":
        return "独自テキスト";
      default:
        return value;
    }
  };

  const loadOption = (): void => {
    const dd = document.getElementById("command-order-ui") as HTMLUListElement;
    dd.innerHTML = "";
    (
      localStorage.get("options_commandOrder") ??
      "ca|patissier|size|position|color|font|ender|full|original"
    )
      .split("|")
      .forEach((c) => {
        const n = document.createElement("li");
        n.setAttribute("value", c);
        n.classList.add("command-order-li");
        n.innerText = commJap(c);
        n.addEventListener("mousedown", (e) => ev.down(e));
        dd.appendChild(n);
      });
    const caInputElm = document.getElementById(
      "additional-command-ca"
    ) as HTMLInputElement;
    caInputElm.checked =
      (localStorage.get("options_useCA") ?? "true") == "true";
    const patInputElm = document.getElementById(
      "additional-command-pat"
    ) as HTMLInputElement;
    patInputElm.checked =
      (localStorage.get("options_usePat") ?? "false") == "true";
    const orgInputElm = document.getElementById(
      "additional-command-original"
    ) as HTMLInputElement;
    orgInputElm.checked =
      (localStorage.get("options_useOriginal") ?? "false") == "true";
    const orgTextInputElm = document.getElementById(
      "additional-command-original-text"
    ) as HTMLInputElement;
    orgTextInputElm.value = String(
      localStorage.get("options_useOriginal_text") ?? ""
    );
    const mainSpanInputElm = document.getElementById(
      "main-comment-span-ms"
    ) as HTMLInputElement;
    mainSpanInputElm.value = String(
      localStorage.get("options_timespan_main") ?? 6000
    );
    const ownerSpanInputElm = document.getElementById(
      "owner-comment-span-ms"
    ) as HTMLInputElement;
    ownerSpanInputElm.value = String(
      localStorage.get("options_timespan_owner") ?? 1000
    );
    const tmtagElm = document.getElementById(
      "tmtag-use-10ms-base"
    ) as HTMLInputElement;
    tmtagElm.checked = (localStorage.get("options_useMs") ?? "false") == "true";
    const rep01Elm = document.getElementById(
      "rep-color-010101"
    ) as HTMLInputElement;
    rep01Elm.checked =
      (localStorage.get("options_lineMode") ?? "false") == "true";
  };

  saveBtn.onclick = () => {
    //更新時にembedで受信して更新したい
    window.postMessage({
      type: "updateOption",
    });
    try {
      saveOption();
      headMes.innerText = "保存しました";
    } catch (error) {
      headMes.innerHTML =
        "<span style='color:red;'>" + String(error) + "</span>";
    }
  };

  loadOption();
});
