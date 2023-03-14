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

  it("should include the React svg correct image", async () => {
    const images = await page.$$eval("img", (anchors) =>
      [].map.call(anchors, (img) => img["src"])
    );
    expect(images[0]).toMatch(SERVER_URL + "/src/assets/img/logo.svg");
  }, 10000); //JEST_TIMEOUT

  it('should include "Simple React Element" text on page', async () => {
    const el = await page.waitForSelector(".simple-element");
    await expect(page).toMatch("Simple React Element");
  }, 10000);
});

/* https://ru.hexlet.io/courses/frontend-testing-browser/lessons/e2e-testing/theory_unit */
