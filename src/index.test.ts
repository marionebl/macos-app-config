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
  const expected = os.platform() === "darwin"  
    ? TEST_DATA
    : {};

  const actual = await config("com.apple.finder");
  expect(actual).toEqual(expected);
});

it("works with app names", async () => {
  const expected = os.platform() === "darwin"  
    ? TEST_DATA
    : {};

  const actual = await config("Finder");
  expect(actual).toEqual(expected);
});

it("returns empty object for non-existing app", async () => {
  const actual = await config("Nonexisting");
  expect(actual).toEqual({});
});

it("returns expected config for app name", async () => {
  const expected = os.platform() === "darwin"  
    ? TEST_DATA
    : {};

  const actual = await config("Finder");
  expect(actual).toEqual(expected);
});

it("returns expected config for app name", async () => {
  const expected = os.platform() === "darwin"  
    ? TEST_DATA
    : {};

  const actual = await config("com.apple.finder");
  expect(actual).toEqual(expected);
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
  const expected = os.platform() === "darwin"  
    ? TEST_DATA
    : {};

  const actual = macosAppConfig.sync("com.apple.finder");
  expect(actual).toEqual(expected);
});

it("sync works with app names", () => {
  const expected = os.platform() === "darwin"  
    ? TEST_DATA
    : {};

  const actual = macosAppConfig.sync("Finder");
  expect(actual).toEqual(expected);
});

it("sync returns empty object for non-existing app", () => {
  const actual = macosAppConfig.sync("Nonexisting");
  expect(actual).toEqual({});
});

it("sync returns expected config for app name", async () => {
  const expected = os.platform() === "darwin"
    ? TEST_DATA
    : {};

  const actual = macosAppConfig.sync("Finder");
  expect(actual).toEqual(expected);
});

it("sync returns expected config for app name", async () => {
  const expected = os.platform() === "darwin"
    ? TEST_DATA
    : {};

  const actual = macosAppConfig.sync("com.apple.finder");
  expect(actual).toEqual(expected);
});
