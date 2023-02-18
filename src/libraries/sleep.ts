/**
 * そのまま
 * @param time {number} ms
 */
const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
export { sleep };
