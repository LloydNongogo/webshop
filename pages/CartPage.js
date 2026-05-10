const { expect } = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('#Email');
        this.passwordInput = page.locator('#Password');
        this.loginBtn = page.locator('.login-button');
        this.computerMenu = page.locator('.top-menu >> text=Computers');
        this.desktopSubMenu = page.locator('.sub-menu >> text=Desktops');
        this.cheapComputerLink = page.locator('text=Build your own cheap computer');
        this.addToCartBtn = page.locator('#add-to-cart-button-72');
        this.cartLink = page.locator('#topcartlink');
        this.termOfService = page.locator('#termsofservice');
        this.checkoutBtn = page.locator('#checkout');
        this.continueBilling = page.locator('#billing-buttons-container .new-address-next-step-button');
        this.continueShipping = page.locator('#shipping-buttons-container .new-address-next-step-button');
        this.continueShippingMethod = page.locator('.shipping-method-next-step-button');
        this.codOption = page.locator('text=Cash On Delivery (COD)');
        this.continuePaymentMethod = page.locator('.payment-method-next-step-button');
        this.continuePaymentInfo = page.locator('.payment-info-next-step-button');
        this.confirmBtn = page.locator('.confirm-order-next-step-button');
        this.orderNumberText = page.locator('.section.order-completed .title + ul li:first-child');
    }

    async navigate() {
        await this.page.goto('https://demowebshop.tricentis.com/login');
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
        await expect(this.page.locator('.header-links .account').first()).toContainText(email);
    }

    async selectDesktop() {
        await this.page.locator('.top-menu a[href="/computers"]').first().click();
        await this.page.locator('a[href="/desktops"]').first().click();
    }
}
module.exports = { CartPage };