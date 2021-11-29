describe('Ids Tooltip e2e Tests', () => {
  const url = 'http://localhost:4444/ids-tooltip';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Tooltip Component');
  });

  it('should open on focus', async () => {
    await page.$eval('#tooltip-example', (e) => e.setAttribute('visible', 'true'));
    const element = await page.waitForSelector('#tooltip-example[visible]');
    const value = await element.evaluate((el) => el.textContent);
    await expect(value).toEqual('Additional Information');
    const isVisible = await page.evaluate('document.querySelector("#tooltip-example[visible]").getAttribute("visible")');
    await expect(isVisible).toEqual('true');
  });

  it('shows on mouseenter and then hides on mouseleave', async () => {
    await page.hover('#button-1');
    await page.waitForSelector('#tooltip-example', { visible: true });
    await page.hover('ids-text');
    await page.waitForSelector('#tooltip-example', { visible: false });
    const isVisible = await page.evaluate('document.querySelector("#tooltip-example").getAttribute("visible")');
    await expect(isVisible).toEqual(null);
  });

  it('shows on mouseenter and then hides on click', async () => {
    await page.hover('#button-1');
    await page.waitForSelector('#tooltip-example', { visible: true });
    await page.click('#button-1');
    await page.waitForSelector('#tooltip-example', { visible: false });
    const isVisible = await page.evaluate('document.querySelector("#tooltip-example").getAttribute("visible")');
    await expect(isVisible).toEqual(null);
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });
});
