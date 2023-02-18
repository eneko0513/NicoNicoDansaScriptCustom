import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import json from "../package.json" assert {type: 'json'};
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const firefoxManifest = fs.readFileSync(path.join(__dirname,"../dist/manifest.firefox.json"), 'utf8');
fs.writeFileSync(path.join(__dirname,"../dist/manifest.firefox.json"),firefoxManifest.replace(/@version/g,json.version));
const manifest = fs.readFileSync(path.join(__dirname,"../dist/manifest.json"), 'utf8');
fs.writeFileSync(path.join(__dirname,"../dist/manifest.json"),manifest.replace(/@version/g,json.version));

