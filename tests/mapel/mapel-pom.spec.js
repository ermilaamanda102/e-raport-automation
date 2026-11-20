
const { test, expect } = require('@playwright/test');
const { MapelPage } = require('../../pages/MapelPage');

const BASE_URL = 'http://localhost/e-raport/public';
const GURU_ID = 11;




test.beforeEach(async ({ page }) => {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'password';

    await page.goto(`${BASE_URL}/login`, {
        waitUntil: 'commit',
        timeout: 60000
    });

    await page.locator('input[name="username"]').waitFor({
        state: 'visible',
        timeout: 15000
    });

    await page.locator('input[name="username"]').fill(username);
    await page.locator('#pw').fill(password);

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/admin\/dashboard/, {
        timeout: 30000
    });

    console.log('Login Admin berhasil:', username);
    console.log('URL Dashboard:', page.url());
});



test('AT-MAPEL-001 - Memastikan halaman Atur Mata Pelajaran tampil', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);
    await mapel.verifikasiHalaman();

    console.log('Halaman Atur Mata Pelajaran berhasil ditampilkan');
});

test('AT-MAPEL-002 - Memastikan daftar mata pelajaran tersedia', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);

    const jumlah = await mapel.jumlahMapel();

    console.log('Jumlah mata pelajaran:', jumlah);

    expect(jumlah).toBe(15);
});

test('AT-MAPEL-003 - Memastikan checkbox dapat dipilih', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);
    await mapel.pilihMapel(0);

    await expect(mapel.checkboxMapel.nth(0)).toBeChecked();

    console.log('Checkbox mata pelajaran berhasil dipilih');
});

test('AT-MAPEL-004 - Memastikan beberapa mata pelajaran dapat dipilih', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);

    await mapel.pilihBeberapaMapel([0, 1, 2]);

    await expect(mapel.checkboxMapel.nth(0)).toBeChecked();
    await expect(mapel.checkboxMapel.nth(1)).toBeChecked();
    await expect(mapel.checkboxMapel.nth(2)).toBeChecked();

    console.log('Tiga mata pelajaran berhasil dipilih');
});

test('AT-MAPEL-005 - Memastikan pilihan mata pelajaran berhasil disimpan', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);
    await mapel.hapusSemuaPilihan();
    await mapel.pilihBeberapaMapel([0, 1]);

    await mapel.simpan();

    await expect(page).toHaveURL(/admin\/guru$/);

    await expect(
        page.locator('.alert-success')
    ).toContainText('Mata pelajaran guru berhasil diperbarui!');

    console.log('Pilihan mata pelajaran berhasil disimpan');
});

test('AT-MAPEL-006 - Memastikan pilihan tersimpan setelah halaman dibuka kembali', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);

    await expect(mapel.checkboxMapel.nth(0)).toBeChecked();
    await expect(mapel.checkboxMapel.nth(1)).toBeChecked();

    console.log('Pilihan mata pelajaran berhasil dipertahankan');
});

test('AT-MAPEL-007 - Menolak penyimpanan tanpa memilih mata pelajaran', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);
    await mapel.hapusSemuaPilihan();

    await mapel.simpan();

    await expect(page).toHaveURL(/admin\/guru\/mapel\/11/);

    await expect(
        page.locator('.alert-danger')
    ).toContainText('Minimal pilih satu mata pelajaran!');

    console.log('Validasi tanpa pilihan mata pelajaran berhasil');
});

test('AT-MAPEL-008 - Memastikan tombol Kembali berfungsi', async ({ page }) => {
    const mapel = new MapelPage(page);

    await mapel.bukaHalaman(GURU_ID);
    await mapel.kembali();

    await expect(page).toHaveURL(/admin\/guru$/);

    console.log('Tombol Kembali berhasil digunakan');
});
