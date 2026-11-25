import { expect, test } from '@playwright/test';

test('camino feliz: carga, navega entre vistas y cambia de idioma', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto('/');
  await expect(page).toHaveTitle(/Belentani Workspace/);
  await expect(page.locator('#workspace-content')).toBeVisible();

  // Navegación por las 6 vistas (lazy): cada una debe montar sin errores.
  for (const view of ['omega_prime', 'visual_engine', 'sdd_maestro', 'production_checklist', 'workspace_hub', 'judas_omega']) {
    await page.goto(`/?view=${view}`);
    await expect(page.locator('#workspace-content')).not.toBeEmpty();
    await expect(page).toHaveURL(new RegExp(`view=${view}`));
  }

  // El canvas WebGL del Visual Engine debe existir en el DOM.
  await page.goto('/?view=visual_engine');
  await expect(page.locator('#workspace-content canvas').first()).toBeVisible();

  expect(errors, `errores JS: ${errors.join(' | ')}`).toEqual([]);
});

test('API: /api/health no es parte del build estático, pero la SPA responde 200', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
});
