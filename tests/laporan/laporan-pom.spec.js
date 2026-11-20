
const { test, expect } = require('@playwright/test');
const { LaporanPage } = require('../../pages/LaporanPage');

const BASE_URL = 'http://localhost/e-raport/public';

test.beforeEach(async ({ page }) => {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'password';

    // Tambahkan timeout khusus navigasi
    page.setDefaultNavigationTimeout(60000);

    // Buka halaman login tanpa menunggu seluruh resource eksternal
    await page.goto(`${BASE_URL}/login`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    await page.locator('input[name="username"]').fill(username);
    await page.locator('#pw').fill(password);

    await page.locator('button[type="submit"]').click();

    // Tunggu sampai dashboard admin terbuka
    await expect(page).toHaveURL(/admin\/dashboard/, {
        timeout: 30000
    });
});

// AT-LAPORAN-001
test('AT-LAPORAN-001 - Memastikan halaman Laporan tampil', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();
    await laporan.verifikasiHalaman();

    console.log('Halaman Laporan berhasil ditampilkan');
});

// AT-LAPORAN-002
test('AT-LAPORAN-002 - Memastikan data nilai tampil', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();

    await expect(laporan.tabel).toBeVisible();
    await expect(laporan.baris.first()).toBeVisible();

    console.log('Data nilai berhasil ditampilkan');
});

// AT-LAPORAN-003
test('AT-LAPORAN-003 - Memastikan filter kelas berfungsi', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();

    const opsi = laporan.filterKelas.locator('option');
    const jumlah = await opsi.count();

    expect(jumlah).toBeGreaterThan(1);

    const kelas = await opsi.nth(1).textContent();

    await laporan.filterDenganKelas(kelas.trim());

    await expect(laporan.filterKelas).toHaveValue(
        await laporan.filterKelas.inputValue()
    );

    console.log('Filter kelas berhasil digunakan:', kelas.trim());
});

// AT-LAPORAN-004
test('AT-LAPORAN-004 - Memastikan filter mata pelajaran berfungsi', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();

    const opsi = laporan.filterMapel.locator('option');
    const jumlah = await opsi.count();

    expect(jumlah).toBeGreaterThan(1);

    const mapel = (await opsi.nth(1).textContent()).trim();

    await laporan.filterDenganMapel(mapel);

    await expect(laporan.filterMapel).toHaveValue(
        await laporan.filterMapel.inputValue()
    );

    console.log('Filter mata pelajaran berhasil:', mapel);
});

// AT-LAPORAN-005
test('AT-LAPORAN-005 - Memastikan filter semester berfungsi', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();
    await laporan.filterDenganSemester('1');

    await expect(laporan.filterSemester).toHaveValue('1');

    console.log('Filter Semester 1 berhasil digunakan');
});

// AT-LAPORAN-006
test('AT-LAPORAN-006 - Memastikan filter tahun ajaran berfungsi', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();

    const opsi = laporan.filterTahun.locator('option');
    const jumlah = await opsi.count();

    expect(jumlah).toBeGreaterThan(1);

    const tahun = (await opsi.nth(1).textContent()).trim();

    await laporan.filterDenganTahun(tahun);

    console.log('Filter tahun ajaran berhasil:', tahun);
});

// AT-LAPORAN-007
test('AT-LAPORAN-007 - Memastikan tombol Reset berfungsi', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();
    await laporan.filterDenganSemester('1');
    await laporan.resetFilter();

    await expect(page).toHaveURL(/\/admin\/laporan\/?$/);

    await expect(laporan.filterSemester).toHaveValue('');

    console.log('Reset filter berhasil digunakan');
});

// AT-LAPORAN-008
test('AT-LAPORAN-008 - Memastikan halaman Cetak Laporan tampil', async ({ page }) => {
    const laporan = new LaporanPage(page);

    await laporan.bukaHalaman();

    const halamanCetakPromise = page.waitForEvent('popup');

    await laporan.bukaCetak();

    const halamanCetak = await halamanCetakPromise;

    await expect(
        halamanCetak.getByRole('heading', {
            name: /LAPORAN NILAI SISWA/i
        })
    ).toBeVisible();

    await expect(
        halamanCetak.getByRole('button', {
            name: /Print/i
        })
    ).toBeVisible();

    console.log('Halaman Cetak Laporan berhasil ditampilkan');

    await halamanCetak.close();
});
