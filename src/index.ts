import * as execa from "execa";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as util from "util";

const bundleId = require("@marionebl/bundle-id"); // tslint:disable-line
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

  const id = await getBundleId(app);

  if (!id) {
    return {};
  }

  const configPath = resolveConfig(id);

  if (!fs.existsSync(configPath)) {
    return {};
  }

  return bplistParser.parseBuffer(await sander.readFile(configPath));
}

function sync(input: string): IMacosAppConfig {
  const app = assert(input) ? input : "";
  const id = getBundleIdSync(app);

  if (!id) {
    return {};
  }

  const configPath = resolveConfig(id);

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

  try {
    return await bundleId(app);
  } catch {
    return '';
  }
}

function getBundleIdSync(app: string): string {
  if (isBundleId(app)) {
    return app;
  }
  
  try {
    return bundleId.sync(app);
  } catch {
    return '';
  }
}

function isBundleId(app: string): boolean {
  return app.split(".").filter(Boolean).length === 3;
}

function resolveConfig(id: string): string {
  return path.join(os.homedir(), "Library", "Preferences", `${id}.plist`);
}
