import { expect, test } from '@playwright/test';

test('lists seeded recipes and adds a new one', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('recipe')).toHaveCount(3);
  await expect(page.getByTestId('count')).toHaveText('3 recetas');

  await page.getByPlaceholder('Nombre').fill('Flan');
  await page.getByPlaceholder('Ingredientes (separados por coma)').fill('huevo, leche, azúcar');
  await page.getByRole('button', { name: 'Agregar' }).click();

  await expect(page.getByTestId('recipe')).toHaveCount(4);
  await expect(page.getByTestId('count')).toHaveText('4 recetas');
  await expect(page.getByTestId('recipe').last()).toContainText('Flan');
});

test('has a pot emoji favicon', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', /🍲/);
});

test('shows the empty state when there are no recipes', async ({ page }) => {
  await page.route('**/api/recipes', (route) => route.fulfill({ json: [] }));
  await page.goto('/');
  await expect(page.getByTestId('count')).toHaveText('No hay recetas');
  await expect(page.getByTestId('recipe')).toHaveCount(0);
});

test('opens a recipe detail and goes back to the list', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Guiso de lentejas' }).click();

  await expect(page).toHaveURL(/#\/receta\/2$/);
  await expect(page.getByRole('heading', { name: 'Guiso de lentejas' })).toBeVisible();
  await expect(page.getByTestId('detail-ingredient')).toHaveCount(4);

  await page.getByRole('link', { name: 'Volver' }).click();
  await expect(page.getByRole('link', { name: 'Tortilla de papas' })).toBeVisible();
  await expect(page.getByTestId('detail')).toBeHidden();
});

test('GET /api/recipes/:id returns 404 for an unknown recipe', async ({ request }) => {
  expect((await request.get('/api/recipes/1')).status()).toBe(200);
  expect((await request.get('/api/recipes/999')).status()).toBe(404);
});
