const macosAppConfig = require('.');
const config = require('.').default;

const execa = require('execa');

beforeAll(() => {
  jest.mock('execa');
  execa.sync = jest.fn();
})

afterAll(() => {
  jest.resetAllMocks();
});

it("default exists", () => {
  expect(typeof config).toBe("function");
  expect(typeof macosAppConfig.default).toBe("function");
});

it("throws for undefined", async () => {
  expect(config()).rejects.toEqual(jasmine.objectContaining({
    message: jasmine.stringMatching(/missing required parameter/)
  }))
});

it("throws for null", async () => {
  expect(config(null)).rejects.toEqual(jasmine.objectContaining({
    message: jasmine.stringMatching(/must be of type string/)
  }))
});

it("works with bundle ids", async () => {
  const execa = require('execa');
  await config('com.apple.finder');
  expect(execa).not.toHaveBeenCalledWith('lsappinfo', jasmine.arrayContaining(['Finder']));
});

it.skip("works with app names", async () => {
  await config('Finder');
  expect(execa).toHaveBeenCalledWith('lsappinfo', jasmine.arrayContaining(['Finder']));
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
  config('com.apple.finder');
  expect(execa.sync).not.toHaveBeenCalledWith('lsappinfo', jasmine.arrayContaining(['Finder']));
});

it.skip("sync works with app names", () => {
  config('Finder');
  expect(execa.sync).toHaveBeenCalledWith('lsappinfo', jasmine.arrayContaining(['Finder']));
});
