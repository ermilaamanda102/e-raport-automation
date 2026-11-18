
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080';

// ==========================================
// AT-LOGIN-001
// Memastikan form login tampil
// ==========================================

test('AT-LOGIN-001 - Memastikan form login tampil', async ({ page }) => {

    await page.goto(`${BASE_URL}/login`);

    await expect(
        page.locator('input[name="username"]')
    ).toBeVisible();

    await expect(
        page.locator('#pw')
    ).toBeVisible();

    await expect(
        page.locator('.btn-login')
    ).toBeVisible();

    await expect(
        page.locator('.btn-login')
    ).toHaveText('Masuk');

});

// ==========================================
// AT-LOGIN-002
// Memastikan username dan password dapat diisi
// ==========================================

test('AT-LOGIN-002 - Memastikan username dan password dapat diisi', async ({ page }) => {

    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[name="username"]').fill('admin');

    await page.locator('#pw').fill('Password123');

    await expect(
        page.locator('input[name="username"]')
    ).toHaveValue('admin');

    await expect(
        page.locator('#pw')
    ).toHaveValue('Password123');

});

// ==========================================
// AT-LOGIN-003
// Login menggunakan akun Admin valid
// ==========================================

test('AT-LOGIN-003 - Login menggunakan akun Admin valid', async ({ page }) => {

    // Mengambil password dari environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Memastikan password tersedia
    expect(adminPassword, 'ADMIN_PASSWORD belum diatur').toBeTruthy();

    // Membuka halaman login
    await page.goto(`${BASE_URL}/login`);

    // Mengisi username
    await page.locator('input[name="username"]').fill('admin');

    // Mengisi password
    await page.locator('#pw').fill(adminPassword);

    // Klik tombol Masuk
    await page.locator('.btn-login').click();

    // Memastikan masuk Dashboard Admin
    await expect(page).toHaveURL(/\/admin\/dashboard\/?$/);
    
});


test('AT-LOGIN-004 - Login menggunakan password salah', async ({ page }) => {

    await page.goto(`${BASE_URL}/login`);

    // Mengisi username yang benar
    await page.locator('input[name="username"]').fill('admin');

    // Mengisi password yang salah
    await page.locator('#pw').fill('PasswordSalah123');

    // Klik tombol Masuk
    await page.locator('.btn-login').click();

    // Memastikan pengguna tidak masuk Dashboard Admin
    await expect(page).not.toHaveURL(/\/admin\/dashboard\/?$/);

});


test('AT-LOGIN-005 - Login dengan username kosong', async ({ page }) => {

    // Membuka halaman login
    await page.goto(`${BASE_URL}/login`);

    // Username sengaja dikosongkan
    await page.locator('input[name="username"]').fill('');

    // Mengisi password
    await page.locator('#pw').fill('Password123');

    // Klik tombol Masuk
    await page.locator('.btn-login').click();

    // Memastikan browser menolak form
    await expect(
        page.locator('input[name="username"]')
    ).toBeFocused();

});


test('AT-LOGIN-006 - Login dengan password kosong', async ({ page }) => {

    // Membuka halaman login
    await page.goto(`${BASE_URL}/login`);

    // Mengisi username
    await page.locator('input[name="username"]').fill('admin');

    // Password sengaja dikosongkan
    await page.locator('#pw').fill('');

    // Klik tombol Masuk
    await page.locator('.btn-login').click();

    // Memastikan browser menolak form
    await expect(
        page.locator('#pw')
    ).toBeFocused();

});


test('AT-ROLE-001 - Admin diarahkan ke Dashboard Admin', async ({ page }) => {

    const adminPassword = process.env.ADMIN_PASSWORD;

    expect(adminPassword).toBeTruthy();

    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[name="username"]').fill('admin');

    await page.locator('#pw').fill(adminPassword);

    await page.locator('.btn-login').click();

    // Memastikan Admin masuk ke dashboard yang benar
    await expect(page).toHaveURL(/\/admin\/dashboard\/?$/);

});


test('AT-ROLE-002 - Guru diarahkan ke Dashboard Guru', async ({ page }) => {

    const guruPassword = process.env.GURU_PASSWORD;

    expect(guruPassword, 'GURU_PASSWORD belum diatur').toBeTruthy();

    // Membuka halaman login
    await page.goto(`${BASE_URL}/login`);

    // Mengisi username Guru
    await page.locator('input[name="username"]').fill('G002');

    // Mengisi password Guru
    await page.locator('#pw').fill(guruPassword);

    // Klik tombol Masuk
    await page.locator('.btn-login').click();

    // Memastikan masuk Dashboard Guru
    await expect(page).toHaveURL(/\/guru\/dashboard\/?$/);

});


test('AT-ROLE-003 - Siswa diarahkan ke Dashboard Siswa', async ({ page }) => {

    const siswaPassword = process.env.SISWA_PASSWORD;

    expect(siswaPassword, 'SISWA_PASSWORD belum diatur').toBeTruthy();

    // Membuka halaman login
    await page.goto(`${BASE_URL}/login`);

    // Mengisi username Siswa
    await page.locator('input[name="username"]').fill('10102');

    // Mengisi password Siswa
    await page.locator('#pw').fill(siswaPassword);

    // Klik tombol Masuk
    await page.locator('.btn-login').click();

    // Memastikan masuk Dashboard Siswa
    await expect(page).toHaveURL(/\/siswa\/dashboard\/?$/);

});


test('AT-SEC-001 - Siswa tidak dapat mengakses Dashboard Admin', async ({ page }) => {

    const siswaPassword = process.env.SISWA_PASSWORD;

    expect(siswaPassword).toBeTruthy();

    // Login sebagai Siswa
    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[name="username"]').fill('10102');

    await page.locator('#pw').fill(siswaPassword);

    await page.locator('.btn-login').click();

    // Pastikan berhasil masuk Dashboard Siswa
    await expect(page).toHaveURL(/\/siswa\/dashboard\/?$/);

    // Mencoba membuka Dashboard Admin
    await page.goto(`${BASE_URL}/admin/dashboard`);

    // Memastikan tidak mendapatkan akses Dashboard Admin
    await expect(page).not.toHaveURL(/\/admin\/dashboard\/?$/);

});


test('AT-SEC-002 - Guru tidak dapat mengakses Dashboard Admin', async ({ page }) => {

    const guruPassword = process.env.GURU_PASSWORD;

    expect(guruPassword).toBeTruthy();

    // Login sebagai Guru
    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[name="username"]').fill('G002');

    await page.locator('#pw').fill(guruPassword);

    await page.locator('.btn-login').click();

    // Memastikan berhasil masuk Dashboard Guru
    await expect(page).toHaveURL(/\/guru\/dashboard\/?$/);

    // Mencoba membuka Dashboard Admin
    await page.goto(`${BASE_URL}/admin/dashboard`);

    // Memastikan tidak mendapatkan akses Admin
    await expect(page).not.toHaveURL(/\/admin\/dashboard\/?$/);

});


test('AT-SEC-003 - Siswa tidak dapat mengakses halaman Nilai Guru', async ({ page }) => {

    const siswaPassword = process.env.SISWA_PASSWORD;

    expect(siswaPassword).toBeTruthy();

    // Login sebagai Siswa
    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[name="username"]').fill('10102');

    await page.locator('#pw').fill(siswaPassword);

    await page.locator('.btn-login').click();

    // Memastikan Dashboard Siswa
    await expect(page).toHaveURL(/\/siswa\/dashboard\/?$/);

    // Mencoba mengakses halaman Nilai Guru
    await page.goto(`${BASE_URL}/guru/nilai`);

    // Memastikan tidak masuk ke halaman Nilai Guru
    await expect(page).not.toHaveURL(/\/guru\/nilai\/?$/);

});


test('AT-SEC-004 - Pengguna tanpa login tidak dapat mengakses Dashboard Admin', async ({ page }) => {

    // Membuka Dashboard Admin tanpa login
    await page.goto(`${BASE_URL}/admin/dashboard`);

    // Memastikan pengguna diarahkan ke halaman login
    await expect(page).toHaveURL(/\/login/);

});
