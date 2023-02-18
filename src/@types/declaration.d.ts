declare module "*.css";
declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
interface Window {
  __videoplayer: nvPlayerApi;
}

interface Event {
  isComposing: boolean;
}
