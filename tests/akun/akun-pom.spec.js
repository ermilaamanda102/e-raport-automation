
const { test, expect } = require('@playwright/test');
const { AkunPage } = require('../../pages/AkunPage');

const BASE_URL = 'http://localhost/e-raport/public';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const TARGET_USERNAME = 'G002';



test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'password';

    await page.goto(`${BASE_URL}/login`, {
        waitUntil: 'commit',
        timeout: 60000
    });

    await page.locator('input[name="username"]').fill(username);
    await page.locator('#pw').fill(password);

    await Promise.all([
        page.waitForURL(
            url => url.pathname.endsWith('/admin/dashboard'),
            {
                waitUntil: 'commit',
                timeout: 60000
            }
        ),
        page.locator('button[type="submit"]').click()
    ]);

    console.log('Login Admin berhasil:', username);
});



// AT-AKUN-001
test('AT-AKUN-001 - Memastikan halaman Kelola Akun tampil', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();
    await akun.verifikasiHalaman();

    console.log('Halaman Kelola Akun berhasil ditampilkan');
});

// AT-AKUN-002
test('AT-AKUN-002 - Memastikan header tabel akun tampil', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();
    await akun.verifikasiHeader();

    console.log('Seluruh header tabel akun berhasil ditampilkan');
});

// AT-AKUN-003
test('AT-AKUN-003 - Memastikan data akun pengguna tampil', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();

    const jumlah = await akun.jumlahAkun();

    expect(jumlah).toBeGreaterThan(0);

    await akun.verifikasiAkun(ADMIN_USERNAME);

    console.log('Jumlah akun pengguna:', jumlah);
    console.log('Data akun admin berhasil ditemukan');
});

// AT-AKUN-004
test('AT-AKUN-004 - Memastikan tombol Tambah Akun tersedia', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();

    await expect(akun.tombolTambah).toBeVisible();
    await expect(akun.tombolTambah).toHaveAttribute('href', /register/);

    console.log('Tombol Tambah Akun berhasil ditampilkan');
});

// AT-AKUN-005
test('AT-AKUN-005 - Memastikan tombol Reset Password tersedia', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();
    await akun.verifikasiAkun(TARGET_USERNAME);
    await akun.verifikasiTombolReset(TARGET_USERNAME);

    console.log('Tombol Reset Password berhasil ditemukan');
});

// AT-AKUN-006
test('AT-AKUN-006 - Memastikan reset password akun berhasil', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();
    await akun.verifikasiAkun(TARGET_USERNAME);

    await akun.resetPassword(TARGET_USERNAME);

    await expect(page).toHaveURL(/admin\/akun/);
    await expect(akun.pesanSukses).toContainText(
        'Password berhasil direset'
    );

    console.log('Password akun berhasil direset');
});

// AT-AKUN-007
test('AT-AKUN-007 - Memastikan admin tidak dapat menghapus akunnya sendiri', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();
    await akun.verifikasiAkun(ADMIN_USERNAME);
    await akun.verifikasiTidakAdaTombolHapus(ADMIN_USERNAME);

    console.log('Validasi akun sendiri tidak dapat dihapus berhasil');
});

// AT-AKUN-008
test('AT-AKUN-008 - Memastikan pembatalan hapus akun berfungsi', async ({ page }) => {
    const akun = new AkunPage(page);

    await akun.bukaHalaman();
    await akun.verifikasiAkun(TARGET_USERNAME);
    await akun.verifikasiTombolHapus(TARGET_USERNAME);

    await akun.batalkanHapus(TARGET_USERNAME);

    await akun.verifikasiAkun(TARGET_USERNAME);
    await expect(page).toHaveURL(/admin\/akun/);

    console.log('Pembatalan hapus akun berhasil');
});
