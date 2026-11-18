
class LoginPage {

    constructor(page) {
        this.page = page;

        // Locator halaman Login
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('#pw');
        this.loginButton = page.locator('.btn-login');
    }

    // Membuka halaman Login
    async open() {
        await this.page.goto('http://localhost/e-raport/public/login');
    }

    // Melakukan Login
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

}

module.exports = { LoginPage };
