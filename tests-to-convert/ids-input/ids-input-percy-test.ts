import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Input Percy Tests', () => {
  const url = 'http://localhost:4444/ids-input/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-input-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-input/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-input-standalone-css', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-input-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-input-new-contrast');
  });

  it('should not have visual regressions in sizes', async () => {
    const urlSizes = 'http://localhost:4444/ids-input/test-sizes.html';

    await page.goto(urlSizes, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-input-sizes');
  });
});