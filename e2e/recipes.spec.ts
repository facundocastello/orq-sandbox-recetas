import { expect, test } from '@playwright/test';

test('lists seeded recipes and adds a new one', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('recipe')).toHaveCount(3);

  await page.getByPlaceholder('Nombre').fill('Flan');
  await page.getByPlaceholder('Ingredientes (separados por coma)').fill('huevo, leche, azúcar');
  await page.getByRole('button', { name: 'Agregar' }).click();

  await expect(page.getByTestId('recipe')).toHaveCount(4);
  await expect(page.getByTestId('recipe').last()).toContainText('Flan');
});

test('has a pot emoji favicon', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', /🍲/);
});
