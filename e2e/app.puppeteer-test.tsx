// @ts-ignore due to isolatedModules flag - no import so this needed
// describe("Google", () => {
//   beforeAll(async () => {
//     await page.goto("https://google.com", { waitUntil: "domcontentloaded" });
//   });

//   it('sanity check, test Google server by checking "google" text on page', async () => {
//     await expect(page).toMatch("google");
//   });
// });

/**
 * Should start without running server
 * Internet should be launched
 * yarn test:e2e
 */
// @ts-ignore due to isolatedModules flag - no import so this needed
describe("Main Page", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  }, 10000);

  it('should include "inc" text on page', async () => {
    await expect(page).toMatch("inc");
  }, 10000);

  it("should include href with correct link", async () => {
    const hrefsArray = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]"), (a) =>
        a.getAttribute("href")
      )
    );
    expect(hrefsArray[5]).toMatch("https://github.com");
  }, 10000);

  it("should include the React svg correct image", async () => {
    const images = await page.$$eval("img", (anchors) =>
      [].map.call(anchors, (img) => img["src"])
    );
    expect(images[0]).toMatch(SERVER_URL + "/assets/img/logo.svg");
  }, 10000); //JEST_TIMEOUT
});

describe("Users For Test", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3000/users-test", {
      waitUntil: "domcontentloaded",
    });
  }, 10000);

  it("should include 'Users Test Page' on the page", async () => {
    await expect(page).toMatch("Users Test Page");
  }, 10000);
});
