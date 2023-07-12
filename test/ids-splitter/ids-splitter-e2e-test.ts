import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Splitter e2e Tests', () => {
  const url = 'http://localhost:4444/ids-splitter/example.html';
  const urlSandbox = 'http://localhost:4444/ids-splitter/sandbox.html';
  const stringToNumber = (val: any) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const v = val?.toString() * 1;
    return !Number.isNaN(v) ? v : 0;
  };

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Splitter Component');
    await expect(page.evaluate('document.querySelector("ids-theme-switcher").getAttribute("mode")'))
      .resolves.toMatch('light');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['aria-required-attr']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-splitter id="test">
        <ids-splitter-pane id="p1"></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it.skip('should use arrow keys to move', async () => {
    await page.goto(urlSandbox, { waitUntil: ['networkidle2', 'load'] });
    const testKeys = async () => {
      let widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      let widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toEqual(stringToNumber(widthP2));
      await page.waitForTimeout(200);
      await page.evaluate('document.querySelector("#splitter-minmax").click()');
      await page.keyboard.press('Space');
      await page.keyboard.press('ArrowDown');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toBeLessThanOrEqual(stringToNumber(widthP2));
      await page.keyboard.press('ArrowUp');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toEqual(stringToNumber(widthP2));
      await page.keyboard.press('ArrowLeft');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toBeLessThanOrEqual(stringToNumber(widthP2));
      await page.keyboard.press('ArrowRight');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toEqual(stringToNumber(widthP2));
    };
    await testKeys();
    await page.evaluate('document.querySelector("#splitter-minmax").setAttribute("align", "end")');
    await testKeys();
  });

  it.skip('should use arrow keys to move RTL', async () => {
    await page.goto(urlSandbox, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('#splitter-minmax', { visible: true });
    await page.evaluate('document.querySelector("ids-container").setAttribute("language", "ar")');
    const testKeys = async () => {
      let widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      let widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toEqual(stringToNumber(widthP2));
      await page.waitForTimeout(200);
      await page.evaluate('document.querySelector("#splitter-minmax").click()');
      await page.keyboard.press('Space');
      await page.keyboard.press('ArrowDown');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toBeLessThanOrEqual(stringToNumber(widthP2));
      await page.keyboard.press('ArrowUp');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toEqual(stringToNumber(widthP2));
      await page.keyboard.press('ArrowLeft');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toBeLessThanOrEqual(stringToNumber(widthP2));
      await page.keyboard.press('ArrowRight');
      widthP1 = await page.evaluate('document.querySelector("#minmax-p1").style.width');
      widthP2 = await page.evaluate('document.querySelector("#minmax-p2").style.width');
      expect(stringToNumber(widthP1)).toEqual(stringToNumber(widthP2));
    };
    await testKeys();
    await page.evaluate('document.querySelector("#splitter-minmax").setAttribute("align", "end")');
    await testKeys();
  });

  it.skip('should use drag to move', async () => {
    await page.goto(urlSandbox, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('#splitter-basic', { visible: true });
    let splitBar = await page.evaluateHandle('document.querySelector("#splitter-basic").shadowRoot.querySelector("#split-1")');
    let startRects = await splitBar.boundingBox();
    const outBound = 999999;
    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(outBound, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-outBound, 0);
    await page.mouse.up();

    await page.evaluate('document.querySelector("#splitter-basic").setAttribute("align", "end")');
    splitBar = await page.evaluateHandle('document.querySelector("#splitter-basic").shadowRoot.querySelector("#split-1")');
    startRects = await splitBar.boundingBox();
    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(outBound, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-outBound, 0);
    await page.mouse.up();
  });

  it.skip('should use drag to move RTL', async () => {
    await page.goto(urlSandbox, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('#splitter-minmax', { visible: true });
    await page.evaluate('document.querySelector("ids-container").setAttribute("language", "ar")');
    await page.waitForTimeout(200);
    let splitBar = await page.evaluateHandle('document.querySelector("#splitter-basic").shadowRoot.querySelector("#split-1")');
    let startRects = await splitBar.boundingBox();
    const outBound = 999999;
    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-outBound, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(outBound, 0);
    await page.mouse.up();

    await page.evaluate('document.querySelector("#splitter-basic").setAttribute("align", "end")');
    splitBar = await page.evaluateHandle('document.querySelector("#splitter-basic").shadowRoot.querySelector("#split-1")');
    startRects = await splitBar.boundingBox();
    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-50, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(-outBound, 0);
    await page.mouse.up();

    await page.mouse.down();
    await page.mouse.move(outBound, 0);
    await page.mouse.up();
  });
});
