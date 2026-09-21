import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`Home opens Basic through visible product links at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const section of ['.navbar', '#home', '#companion', '#models']) {
      await page.goto('/');
      const link = page.locator(section).getByRole('link', { name: section === '#models' ? 'EXPLORE BASIC' : /VIEW ROBO BASIC/ });
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(/\/products\/basic$/);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('ROBO BASIC');
    }
    await page.locator('.pdp-breadcrumb').getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('.site-ready')).toBeVisible();
    await expect(page.locator('.navbar').getByRole('link', { name: /VIEW ROBO BASIC/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.screenshot({ path: `test-results/home-product-entry-${width}.png` });
  });
}
