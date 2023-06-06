const { JSDOM } = require("jsdom");

async function crawlPage(baseUrl, currentUrl, pages) {
  const baseUrlObj = new URL(baseUrl);
  const currentUrlObj = new URL(currentUrl);
  // const pagesUrlObj = new URL(pages);
  if (baseUrlObj.hostname !== currentUrlObj.hostname) {
    return pages;
  }
  const normalizedCurrentUrl = normalizeUrl(currentUrl);
  if (pages[normalizedCurrentUrl] > 0) {
    pages[normalizedCurrentUrl]++;
    return pages;
  }
  pages[normalizedCurrentUrl] = 1;

  console.log(`actively crawling ${currentUrl}`);

  try {
    const resp = await fetch(currentUrl);

    if (resp.status > 399) {
      console.log(
        `error in fetch with status code: ${resp.status} on page: ${currentUrl}`
      );
      return pages;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content type ${contentType} on page: ${currentUrl}`
      );
      return pages;
    }
    const htmlBody = await resp.text();

    const nextUrls = getUrlsFromHTML(htmlBody, baseUrl);

    for (const _nextUrl of nextUrls) {
      pages = await crawlPage(baseUrl, _nextUrl, pages);
    }
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page ${currentUrl}`);
  }
  return pages;
}

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
        console.log(`invalid url rel search: ${err.message}`);
      }
    } else {
      // absolute
      try {
        const urlObj = new URL(`${_link.href}`);
        URLs.push(urlObj.href);
      } catch (err) {
        console.log(`invalid url abs search: ${err.message}`);
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
  crawlPage,
};
