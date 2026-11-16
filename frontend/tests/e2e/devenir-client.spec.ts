import { expect, test } from '@playwright/test';

test('localizes customer and account types, and conditionally shows products', async ({ page }) => {
  const localizedOptions = {
    fr: {
      customerLabel: 'Type de clientèle',
      customer: ['Sélectionnez une catégorie', 'Jeune', 'Particulier', 'Entreprise'],
      accountLabel: 'Type de compte',
      account: ['Sélectionnez un type de compte', 'Épargne', 'Dépôt'],
    },
    en: {
      customerLabel: 'Customer category',
      customer: ['Select a customer category', 'Youth', 'Individual', 'Business'],
      accountLabel: 'Account type',
      account: ['Select an account type', 'Savings', 'Deposit'],
    },
    ar: {
      customerLabel: 'فئة العميل',
      customer: ['اختر فئة العميل', 'الشباب', 'الأفراد', 'المؤسسات'],
      accountLabel: 'نوع الحساب',
      account: ['اختر نوع الحساب', 'ادخار', 'وديعة'],
    },
  };

  for (const [language, options] of Object.entries(localizedOptions)) {
    await page.goto(`/${language}/devenir-client`);
    await expect(page.locator('select[name="customerType"] option')).toHaveText(options.customer);
    await expect(page.locator('select[name="accountType"] option')).toHaveText(options.account);
  }

  await page.goto('/fr/devenir-client');
  const customerType = page.locator('select[name="customerType"]');
  await customerType.selectOption('young');

  const productType = page.locator('select[name="productType"]');
  await expect(productType).toBeVisible();
  await expect(productType).toHaveAttribute('required', '');
  await expect(productType.locator('option')).toHaveText([
    'Sélectionnez un produit',
    'Sesame',
    'El Amen',
    'Technologique',
  ]);

  await customerType.selectOption('individual');
  await expect(productType).toBeVisible();

  await customerType.selectOption('business');
  await expect(productType).toHaveCount(0);
});