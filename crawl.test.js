const { normalizeUrl } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeUrl strip protocols", () => {
  const input = "https://blog.boot.dev/path";
  const output = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(output).toEqual(expected);
});

test("normalizeUrl strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const output = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(output).toEqual(expected);
});

test("normalizeUrl caps", () => {
  const input = "https://BLOG.boot.dev/path";
  const output = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(output).toEqual(expected);
});

test("normalizeUrl strip http", () => {
  const input = "http://blog.boot.dev/path";
  const output = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(output).toEqual(expected);
});
