export type objectFitArgs =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";

export type background = {
  selected: number;
  images: backgroundImage[];
  open: boolean;
  mode: objectFitArgs;
  visible: boolean;
  transparency: number;
};

export type backgroundImage = {
  id: string;
  url: string;
  crop?: {
    original: string;
    range: cropRange;
  };
};

export type cropRange = {
  [key in cropKey]: number;
};

export type cropKey = "_pos1X" | "_pos2X" | "_pos1Y" | "_pos2Y";
