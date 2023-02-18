export type objectFitArgs =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";

export type background = {
  selected: number;
  images: string[];
  open: boolean;
  mode: objectFitArgs;
  visible: boolean;
  transparency: number;
};
