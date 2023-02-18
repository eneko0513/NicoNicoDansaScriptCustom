import { typeGuard } from "@/libraries/typeGuard";
import { convertFormat } from "@/@types/types";

/**
 * inputFormat型のinputをoutputFormat型に変換して返す
 * @param inputFormat
 * @param outputFormat
 * @param input
 */
const convertText = (
  inputFormat: convertFormat,
  outputFormat: convertFormat,
  input: string
) => {
  if (inputFormat == outputFormat) return input;
  let dansk = "";
  switch (inputFormat) {
    case "domo":
      dansk = convertDomoToDansk(input);
      break;
    case "tokome":
      dansk = convertTokomeToDansk(input);
      break;
    case "dansk":
      dansk = input;
  }
  switch (outputFormat) {
    case "dansk":
      return dansk;
    case "domo":
      return convertDanskToDomo(dansk);
    case "tokome":
      return convertDanskToTokome(dansk);
  }
  return "";
};
const convertDomoToDansk = (input: string): string => {
  input = input
    .replace(/\r\n|\r/g, "\n")
    .replace(/\n/g, "\n<br>")
    .replace(/\t/g, "[tb]");
  const lines: string[] = input.split("\n"),
    result: string[] = [];
  let commandCount = 0;
  for (let line of lines) {
    if (line === undefined) continue;
    if (commandCount == -1) {
      line = line.replace("<br>", "");
    }
    commandCount = (
      line.match(
        /ue|shita|gothic|mincho|big|small|defont|medium|ender|full|ca|pattisier/
      ) || []
    ).length;
    if (commandCount >= 2) {
      result.push(`\n[${line.replace("<br>", "")}]`);
      commandCount = -1;
    } else result.push(line);
  }
  return result.join("").slice(1);
};

/**
 * Dansk -> Domo
 * @param input {string} dansk
 * @return {string} domo
 */
const convertDanskToDomo = (input: string): string => {
  input = input
    .replace(/\[tb]/g, "\t")
    .replace(/\[03]/g, "　")
    .replace(/\[0A]/g, "");
  const lines: string[] = input.split("\n"),
    result: string[] = [];
  let lastCommand = "";
  for (const line of lines) {
    let content = "",
      command = "";
    if (line === undefined || line === "") continue;
    const match = line.match(/(?:\[(.*)])?(.*)/);
    if (match === null || match[1] === undefined) {
      command = lastCommand;
      content = line;
    } else {
      if (match[1] === undefined || match[2] === undefined) continue;
      content = match[2];
      if (match[1].match(/^03|tb|0A$/)) {
        command = line;
      } else {
        lastCommand = match[1];
      }
    }
    result.push(`${command}\n${content.replace(/<br>/g, "\n")}`);
  }
  return result.join("\n");
};

/**
 * Tokome -> Dansk
 * @param input{string} tokome
 * @return {string} dansk
 */
const convertTokomeToDansk = (input: string): string => {
  const data = JSON.parse(input) as unknown;
  if (!typeGuard.owner.comments(data)) return "";
  const result: string[] = [];
  for (const line of data) {
    result.push(
      `[${line.command}]${line.comment}`
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "[tb]")
    );
  }
  return result.join("\n");
};

/**
 * timestamp -> date
 * @param time{number} time
 * @return {string} date
 */
const covertTimeIntToString = (time: number): string => {
  const a = ("0" + Math.floor(time / 6000).toString()).slice(-2);
  const b = ("0" + Math.floor((time % 6000) / 100).toString()).slice(-2);
  const d = ("0" + Math.floor((time % 6000) % 100).toString()).slice(-2);
  return a + ":" + b + "." + d;
};

/**
 * Dansk -> Tokome
 * @param input {string} dansk
 * @return {string} tokome
 */
const convertDanskToTokome = (input: string): string => {
  input = input
    .replace(/\[tb]/g, "\t")
    .replace(/\[03]/g, "　")
    .replace(/\[0A]/, "");
  const lines = input.split("\n"),
    result = [];
  let lastCommand = "";
  let baseTimeMs = 0;
  for (let line of lines) {
    const match = line.match(/\[(.*)]/);
    if (match !== null && match[0] !== undefined && match[1] !== undefined) {
      const tmMatch = match[1].match(/tm(\d+)/);
      if (tmMatch !== null && tmMatch[1] !== undefined) {
        baseTimeMs += parseInt(tmMatch[1]);
        line = line.replace(match[0], "");
      }
    }
    const comment = {
      time: covertTimeIntToString(baseTimeMs / 10),
      command: "",
      comment: "",
    };
    if (line == "") continue;
    line = line.replace(/<br>/g, "\n");
    if (match === null || match[0] === undefined || match[1] === undefined) {
      comment.command = lastCommand;
      comment.comment = line;
    } else {
      if (match[1].match(/^03|tb|0A$/)) {
        comment.comment = line;
      } else {
        comment.comment = line.slice(match[0].length);
        lastCommand = match[1];
      }
      comment.command = lastCommand;
    }
    result.push(comment);
  }
  return JSON.stringify(result, null, 2);
};

export { convertText };
