import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`report controls and export at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
    await page.screenshot({ path: `.taste-skill/screens/report-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: '7 dias', exact: true }).click();
    await page.getByRole('button', { name: /Valor/ }).click();
    await expect(page.getByRole('columnheader', { name: /Valor/ })).toHaveAttribute('aria-sort', 'descending');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /^Exportar/ }).click();
    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await page.screenshot({ path: `.taste-skill/screens/filtered-report-${width}.png`, fullPage: true });
  });
}
