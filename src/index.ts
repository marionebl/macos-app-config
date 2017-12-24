import * as execa from "execa";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as util from "util";

const bplistParser = require("bplist-parser"); // tslint:disable-line
const readFile = util.promisify(fs.readFile);

export interface IMacosAppConfig {
  [key: string]: any;
}

export default macosAppConfig;
export {sync}; 

async function macosAppConfig(input: string): Promise<IMacosAppConfig> {
  const app = assert(input) ? input : '';
  const bundleId = await getBundleId(app);
  const configPath = path.join(os.homedir(), 'Library', 'Preferences', `${bundleId}.plist`);

  if (!fs.existsSync(configPath)) {
    return {};
  }

  const buffer = await readFile(configPath);
  return bplistParser.parseBuffer(buffer);
}

function sync(input: string): IMacosAppConfig {
  const app = assert(input) ? input : '';
  const bundleId = getBundleIdSync(app);
  const configPath = path.join(os.homedir(), 'Library', 'Preferences', `${bundleId}.plist`);

  if (!fs.existsSync(configPath)) {
    return {};
  }

  const buffer = fs.readFileSync(configPath);
  return bplistParser.parseBuffer(buffer);
}

function assert(app: any): app is string {
  if (typeof app === 'undefined') {
    throw new TypeError('macos-app-config: missing required parameter app');
  }

  if (typeof app !== 'string') {
    throw new TypeError(`macos-app-config: app must be of type string, received "${app}" of type "${typeof app}"`);
  }

  return true;
}

async function getBundleId(app: string): Promise<string> {
  if (isBundleId(app)) {
    return app;
  }
  const {stdout} = await execa('lsappinfo', ['info', '-only', 'bundleid', app]);
  return stdout.split('=')[1].substring(1, -1);
}

async function getBundleSync(app: string): Promise<string> {
  if (isBundleId(app)) {
    return app;
  }
  const {stdout} = execa.sync('lsappinfo', ['info', '-only', 'bundleid', app]);
  return stdout.split('=')[1].substring(1, -1);
}

function getBundleIdSync(app: string): string {
  if (isBundleId(app)) {
    return app;
  }
}

function isBundleId(app: string): boolean {
  return app.split('.').filter(Boolean).length === 3;
}