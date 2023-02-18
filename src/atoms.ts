import { atom } from "jotai";
import { layer } from "@/@types/layer";
import { background } from "@/@types/background";
import { element } from "@/@types/element";

export const layerAtom = atom<layer[]>([]);
export const backgroundAtom = atom<background>({
  selected: -1,
  images: [],
  open: false,
  mode: "fill",
  visible: true,
  transparency: 100,
});
export const optionAtom = atom<option>({
  grid: false,
  replace: false,
  preview: "disable",
});
export const elementAtom = atom<element | undefined>(undefined);
export const exportLayerAtom = atom<string[]>([]);
