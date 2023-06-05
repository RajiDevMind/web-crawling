const { normalizeUrl, getUrlsFromHTML } = require("./crawl.js");
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

test("getUrlsFromHTML absolute", () => {
  const inputHTMLbody = `
  <html>
          <body>
                <a href="https://blog.boot.dev/path/">
                Boot.dev Blog
                </a>
          </body>
  </html>
  `;
  const inputBaseUrl = "https://blog.boot.dev/path/";
  const output = getUrlsFromHTML(inputHTMLbody, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path/"];
  expect(output).toEqual(expected);
});

test("getUrlsFromHTML relative", () => {
  const inputHTMLbody = `
  <html>
          <body>
                <a href="/path/">
                Boot.dev Blog
                </a>
          </body>
  </html>
  `;
  const inputBaseUrl = "https://blog.boot.dev";
  const output = getUrlsFromHTML(inputHTMLbody, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path/"];
  expect(output).toEqual(expected);
});

test("getUrlsFromHTML bothRel$Abs", () => {
  const inputHTMLbody = `
  <html>
          <body>
                <a href="https://blog.boot.dev/path1/">
                Boot.dev Blog Path One
                </a>
                <a href="/path2/">
                Boot.dev Blog Sec PAth
                </a>
          </body>
  </html>
  `;
  const inputBaseUrl = "https://blog.boot.dev";
  const output = getUrlsFromHTML(inputHTMLbody, inputBaseUrl);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(output).toEqual(expected);
});

test("getUrlsFromHTML invalid", () => {
  const inputHTMLbody = `
  <html>
          <body>
                <a href="Invalid">
                Invalid Url!!!
                </a>
          </body>
  </html>
  `;
  const inputBaseUrl = "https://blog.boot.dev";
  const output = getUrlsFromHTML(inputHTMLbody, inputBaseUrl);
  const expected = [];
  expect(output).toEqual(expected);
});
