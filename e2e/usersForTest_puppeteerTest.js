/**
 * @link https://medium.com/react-courses/deliver-quality-software-reduce-qa-load-integrate-end-to-end-e2e-testing-on-cra-react-a20486a39ac2
 * @link https://devdocs.io/puppeteer/ примеры
 */

const puppeteer = require("puppeteer");

const SERVER_URL = "http://localhost:3000";

const test = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto(SERVER_URL, { waitUntil: "domcontentloaded" });

    const urlLink = await page.$('a[href*="/users-test"]');
    if (!urlLink) {
      throw new Error('err: No urlLink "/users-test" found on the page');
    }

    await urlLink.click();

    const loadingTitle = await page.$("#users-loading");
    if (!loadingTitle) {
      throw new Error('err: No "loadingTitle" found on the page');
    }

    await page.waitForSelector("#users-list");
    const usersItems = await page.$$("#user-delete");
    const usersCount = usersItems.length;

    if (!usersCount) {
      throw new Error('err: No "#users-list" found on the page');
    }

    await usersItems[0].click();

    const usersItemsAfterDelete = await page.$$("#user-delete");

    if (usersCount - usersItemsAfterDelete.length !== 1) {
      throw new Error("the element delletting was not nappend");
    }
    console.log(usersCount, usersItemsAfterDelete.length);
    // const toggleBtn = await page.$("#toggle");
    // if (toggleBtn) {
    //   await toggleBtn.click();
    // } else {
    //   console.log('err: No "toggleBtn" found on page');
    // }

    // const helloTitle = await page.$("#hello");
    // if (helloTitle) {
    //   const helloTitleText = await (
    //     await helloTitle.getProperty("textContent")
    //   ).jsonValue();

    //   if (helloTitleText !== "HELLO WORLD") {
    //     console.log('err: Title is not "hello", expected:', helloTitleText);
    //   }
    // } else {
    //   console.log('err: No "helloTitle" found on page');
    // }

    // await toggleBtn.click();
    // if (await page.$("#hello")) {
    //   console.log('err: "helloTitle" is on the page');
    // }

    console.log("tests ok!");
    /* wait 2 secs and shut down! */
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await browser.close();
  } catch (error) {
    if (error.message.includes("ERR_CONNECTION_REFUSED")) {
      console.log("Make sure you have React running: $ yarn start");
    }

    console.log("Error message", error.message);
  }
};

test();
