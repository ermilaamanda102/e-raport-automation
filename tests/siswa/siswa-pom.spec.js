
const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { SiswaPage } = require('../../pages/SiswaPage');

function generateNIS() {
    return String(Date.now()).slice(-8);
}

test.beforeEach(async ({ page }) => {

    const loginPage = new LoginPage(page);

    const adminPassword = process.env.ADMIN_PASSWORD;

    expect(adminPassword).toBeTruthy();

    await loginPage.open();

    await loginPage.login('admin', adminPassword);

    await expect(page).toHaveURL(
        /\/admin\/dashboard\/?$/
    );

});

test('POM-001 - Admin dapat membuka halaman Data Siswa', async ({ page }) => {

    const siswaPage = new SiswaPage(page);

    await siswaPage.open();

    await expect(siswaPage.table).toBeVisible();

});

test('POM-002 - Admin dapat menambahkan siswa', async ({ page }) => {

    const siswaPage = new SiswaPage(page);

    const nis = generateNIS();

    await siswaPage.openTambah();

    await siswaPage.isiForm({
        nis: nis,
        nama: 'Testing POM QA',
        kelas: 'X RPL 1',
        jenisKelamin: 'L'
    });

    await siswaPage.simpan();

    await expect(page).toHaveURL(
        /\/admin\/siswa\/?$/
    );

    const siswa = siswaPage.cariBaris(nis);

    await expect(siswa).toContainText('Testing POM QA');

    console.log('POM berhasil menambahkan siswa:', nis);

});
