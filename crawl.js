const { JSDOM } = require("jsdom");

function getUrlsFromHTML(htmlBody, baseUrl) {
  const URLs = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const _link of linkElements) {
    if (_link.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObj = new URL(`${baseUrl}${_link.href}`);
        URLs.push(urlObj.href);
      } catch (err) {
        console.log(`invalid url rel search: ${err.m3ssage}`);
      }
    } else {
      // absolute
      try {
        const urlObj = new URL(`${_link.href}`);
        URLs.push(urlObj.href);
      } catch (err) {
        console.log(`invalid url abs search: ${err.m3ssage}`);
      }
    }
  }
  return URLs;
}

function normalizeUrl(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}
module.exports = {
  normalizeUrl,
  getUrlsFromHTML,
};
