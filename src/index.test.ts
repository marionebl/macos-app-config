const macosAppConfig = require("."); // tslint:disable-line
const config = require(".").default; // tslint:disable-line

const os = require("os"); // tslint:disable-line
const bplist = require("bplist-parser"); // tslint:disable-line
const execa = require("execa"); // tslint:disable-line

const TEST_DATA = { foo: "bar" };

beforeAll(() => {
  jest.mock("execa");
  jest.mock("bplist-parser");

  bplist.parseBuffer = jest.fn(() => TEST_DATA);
  execa.sync = jest.fn((_, args) => {
    if (args.indexOf("Finder") > -1) {
      return { stdout: '"CFBundleIdentifier"="com.apple.finder"' };
    }
    return { stdout: "" };
  });
});

afterAll(() => {
  jest.resetAllMocks();
});

it("default exists", () => {
  expect(typeof config).toBe("function");
  expect(typeof macosAppConfig.default).toBe("function");
});

it("throws for undefined", async () => {
  expect(config()).rejects.toEqual(
    jasmine.objectContaining({
      message: jasmine.stringMatching(/missing required parameter/)
    })
  );
});

it("throws for null", async () => {
  expect(config(null)).rejects.toEqual(
    jasmine.objectContaining({
      message: jasmine.stringMatching(/must be of type string/)
    })
  );
});

it("works with bundle ids", async () => {
  if (os.platform() !== "darwin") {
    const actual = await config("com.apple.finder");
    expect(actual).toEqual({});
    return;
  }

  const execa = require("execa"); // tslint:disable-line
  await config("com.apple.finder");
  expect(execa).not.toHaveBeenCalledWith(
    "lsappinfo",
    jasmine.arrayContaining(["Finder"])
  );
});

it.skip("works with app names", async () => {
  await config("Finder");
  expect(execa).toHaveBeenCalledWith(
    "lsappinfo",
    jasmine.arrayContaining(["Finder"])
  );
});

it("returns empty object for non-existing app", async () => {
  if (os.platform() !== "darwin") {
    const actual = await config("Nonexisting"); // tslint:disable-line
    expect(actual).toEqual({});
    return;
  }

  const actual = await config("Nonexisting");
  expect(actual).toEqual({});
});

it("returns expected config for app name", async () => {
  if (os.platform() !== "darwin") {
    const actual = await config("Finder"); // tslint:disable-line
    expect(actual).toEqual({});
    return;
  }

  const actual = await config("Finder");
  expect(actual).toEqual(TEST_DATA);
});

it("returns expected config for app name", async () => {
  if (os.platform() !== "darwin") {
    const actual = await config("Finder"); // tslint:disable-line
    expect(actual).toEqual({});
    return;
  }

  const actual = await config("com.apple.finder");
  expect(actual).toEqual(TEST_DATA);
});

it("sync exists", () => {
  expect(typeof macosAppConfig.sync).toBe("function");
});

it("sync throws for undefined", () => {
  expect(() => macosAppConfig.sync()).toThrow(/missing required parameter/);
});

it("sync throws for null", () => {
  expect(() => macosAppConfig.sync(null)).toThrow(/must be of type string/);
});

it("sync works with bundle ids", () => {
  if (os.platform() !== "darwin") {
    const actual = macosAppConfig.sync("com.apple.finder");
    expect(actual).toEqual({});
    return;
  }

  config("com.apple.finder");
  expect(execa.sync).not.toHaveBeenCalledWith(
    "lsappinfo",
    jasmine.arrayContaining(["Finder"])
  );
});

it.skip("sync works with app names", () => {
  if (os.platform() !== "darwin") {
    const actual = macosAppConfig.sync("Finder");
    expect(actual).toEqual({});
    return;
  }

  config("Finder");
  expect(execa.sync).toHaveBeenCalledWith(
    "lsappinfo",
    jasmine.arrayContaining(["Finder"])
  );
});

it("sync returns empty object for non-existing app", () => {
  if (os.platform() !== "darwin") {
    const actual = macosAppConfig.sync("Nonexisting"); // tslint:disable-line
    expect(actual).toEqual({});
    return;
  }

  const actual = macosAppConfig.sync("Nonexisting");
  expect(actual).toEqual({});
});

it("sync returns expected config for app name", async () => {
  if (os.platform() !== "darwin") {
    const actual = macosAppConfig.sync("Finder"); // tslint:disable-line
    expect(actual).toEqual({});
    return;
  }

  const actual = macosAppConfig.sync("Finder");
  expect(actual).toEqual(TEST_DATA);
});

it("sync returns expected config for app name", async () => {
  if (os.platform() !== "darwin") {
    const actual = macosAppConfig.sync("com.apple.finder"); // tslint:disable-line
    expect(actual).toEqual({});
    return;
  }

  const actual = macosAppConfig.sync("com.apple.finder");
  expect(actual).toEqual(TEST_DATA);
});
