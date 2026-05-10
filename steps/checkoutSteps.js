const { Given, When, Then, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium, expect } = require("@playwright/test");
const { CartPage } = require("../pages/CartPage");

setDefaultTimeout(30000);

let browser, context, page, cartPage;

Before(async () => {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  cartPage = new CartPage(page);
});

Given("I am on the Demo Webshop login page", async () => {
  await cartPage.navigate();
});

When("I login with valid credentials", async () => {
  await cartPage.login("nongogol1993@gmail.com", "1502Lloyd!");
});

When('I navigate to "Computers" and select "Desktops"', async () => {
  await cartPage.selectDesktop();
});

When('I select "Build your own cheap computer"', async () => {
  await page
    .locator('.product-grid a[href="/build-your-cheap-own-computer"]')
    .first()
    .click();
});

When("I add the item to the cart", async () => {
  await cartPage.addToCartBtn.click();
  // Wait for the green notification bar to disappear or just navigate to cart
  await page.waitForTimeout(1000);
  await cartPage.cartLink.click();
});

When("I accept terms and checkout", async () => {
  await cartPage.termOfService.check();
  await cartPage.checkoutBtn.click();
});

When("I complete billing and shipping details", async () => {
  const country = page.locator("#BillingNewAddress_CountryId");
  if ((await country.count()) > 0 && (await country.isVisible())) {
    await country.selectOption("71");

    await page.locator("#BillingNewAddress_City").fill("Johannesburg");
    await page.locator("#BillingNewAddress_Address1").fill("123 Main Street");
    await page.locator("#BillingNewAddress_ZipPostalCode").fill("2000");
    await page.locator("#BillingNewAddress_PhoneNumber").fill("0712345678");
  }

  await cartPage.continueBilling.click();
  await page.waitForTimeout(800);

  const billingErrors = page.locator("#billing-new-address-form .field-validation-error");
  if (await billingErrors.first().isVisible()) {
    await country.selectOption("71");
    await page.locator("#BillingNewAddress_City").fill("Johannesburg");
    await page.locator("#BillingNewAddress_Address1").fill("123 Main Street");
    await page.locator("#BillingNewAddress_ZipPostalCode").fill("2000");
    await page.locator("#BillingNewAddress_PhoneNumber").fill("0712345678");
    await cartPage.continueBilling.click();
  }

  if (await cartPage.continueShipping.isVisible()) {
    await cartPage.continueShipping.click();
  }

  if (await cartPage.continueShippingMethod.isVisible()) {
    await cartPage.continueShippingMethod.click();
  }
});

When('I select "Cash on Delivery" as payment method', async () => {
  const continueShippingMethod = page.locator(".shipping-method-next-step-button").first();
  if (await continueShippingMethod.isVisible()) {
    await continueShippingMethod.click();
  }

  const codRadio = page.locator("input[name='paymentmethod']").first();
  if ((await codRadio.count()) > 0 && (await codRadio.isVisible())) {
    await codRadio.check();
  }

  const continuePaymentMethod = page.locator(".payment-method-next-step-button").first();
  if (await continuePaymentMethod.isVisible()) {
    await continuePaymentMethod.click();
  }

  const continuePaymentInfo = page.locator(".payment-info-next-step-button").first();
  if (await continuePaymentInfo.isVisible()) {
    await continuePaymentInfo.click();
  }
});

When("I confirm the order", async () => {
  for (let i = 0; i < 8; i += 1) {
    const confirmButton = page.locator(".confirm-order-next-step-button:visible").first();
    if ((await confirmButton.count()) > 0) {
      await confirmButton.click();
      return;
    }

    const visibleContinue = page.locator("input.button-1[value='Continue']:visible").first();
    if ((await visibleContinue.count()) > 0) {
      await visibleContinue.click({ force: true, timeout: 2000 });
      await page.waitForTimeout(700);
      continue;
    }

    await page.waitForTimeout(700);
  }

  throw new Error(`Could not reach visible confirm button. Current URL: ${page.url()}`);
});

Then(
  "I should see a successful order message and capture the order number",
  async () => {
    await expect(
      page.locator("text=Your order has been successfully processed!"),
    ).toBeVisible();
    const orderDetails = await cartPage.orderNumberText.innerText();

    console.log("-----------------------------------");
    console.log(`SUCCESS: ${orderDetails}`);
    console.log("-----------------------------------");
  },
);

After(async () => {
  await browser.close();
});
