import * as execa from "execa";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as util from "util";

const bplistParser = require("bplist-parser"); // tslint:disable-line
const sander = require("@marionebl/sander"); // tslint:disable-line

export interface IMacosAppConfig {
  [key: string]: any;
}

export default macosAppConfig;
export { sync };

async function macosAppConfig(input: string): Promise<IMacosAppConfig> {
  const app = assert(input) ? input : "";

  if (os.platform() !== "darwin") {
    return {};
  }

  const bundleId = await getBundleId(app);

  if (!bundleId) {
    return {};
  }

  const configPath = resolveConfig(bundleId);

  if (!fs.existsSync(configPath)) {
    return {};
  }

  return bplistParser.parseBuffer(await sander.readFile(configPath));
}

function sync(input: string): IMacosAppConfig {
  const app = assert(input) ? input : "";
  const bundleId = getBundleIdSync(app);

  if (!bundleId) {
    return {};
  }

  const configPath = resolveConfig(bundleId);

  if (!fs.existsSync(configPath)) {
    return {};
  }

  return bplistParser.parseBuffer(fs.readFileSync(configPath));
}

function assert(app: any): app is string {
  if (typeof app === "undefined") {
    throw new TypeError("macos-app-config: missing required parameter app");
  }

  if (typeof app !== "string") {
    throw new TypeError(
      `macos-app-config: app must be of type string, received "${app}" of type "${typeof app}"`
    );
  }

  return true;
}

async function getBundleId(app: string): Promise<string> {
  if (isBundleId(app)) {
    return app;
  }
  const { stdout } = await execa("lsappinfo", [
    "info",
    "-only",
    "bundleid",
    app
  ]);
  const id = stdout.split("=")[1];

  if (typeof id !== "string") {
    return "";
  }

  return id.substr(1, id.length - 2);
}

function getBundleIdSync(app: string): string {
  if (isBundleId(app)) {
    return app;
  }

  const { stdout } = execa.sync("lsappinfo", [
    "info",
    "-only",
    "bundleid",
    app
  ]);
  const id = stdout.split("=")[1];

  if (typeof id !== "string") {
    return "";
  }

  return id.substr(1, id.length - 2);
}

function isBundleId(app: string): boolean {
  return app.split(".").filter(Boolean).length === 3;
}

function resolveConfig(id: string): string {
  return path.join(os.homedir(), "Library", "Preferences", `${id}.plist`);
}
