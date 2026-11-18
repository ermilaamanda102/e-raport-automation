
const { test, expect } = require('@playwright/test');
const { randomInt } = require('node:crypto');

// ==========================================
// KONFIGURASI
// ==========================================

const BASE_URL = 'http://localhost/e-raport/public';

// ==========================================
// HELPER: MEMBUAT NIS UNIK
// ==========================================

function generateNIS() {
    return String(randomInt(10000000, 99999999));
}

// ==========================================
// HELPER: MENCARI BARIS SISWA
// ==========================================

function cariBarisSiswa(page, nis) {
    return page.getByRole('row').filter({
        has: page.getByRole('cell', {
            name: nis,
            exact: true
        })
    });
}

// ==========================================
// HELPER: MEMBUAT DATA SISWA
// ==========================================

async function buatSiswaTesting(page, data = {}) {

    const nis = generateNIS();

    const nama = data.nama || 'Testing Automation QA';
    const kelas = data.kelas || 'X RPL 1';
    const jenisKelamin = data.jenisKelamin || 'L';

    await page.goto(`${BASE_URL}/admin/siswa/tambah`);

    await page.locator('input[name="NIS"]').fill(nis);

    await page.locator('input[name="nama"]').fill(nama);

    await page.locator('input[name="kelas"]').fill(kelas);

    await page.locator('select[name="jenis_kelamin"]')
        .selectOption(jenisKelamin);

    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(page).toHaveURL(/\/admin\/siswa\/?$/);

    const barisSiswa = cariBarisSiswa(page, nis);

    await expect(barisSiswa).toHaveCount(1);

    await expect(barisSiswa).toContainText(nama);

    console.log('Test data berhasil dibuat:', nis);

    return nis;
}

// ==========================================
// PERSIAPAN LOGIN ADMIN
// ==========================================

test.beforeEach(async ({ page }) => {

    const adminPassword = process.env.ADMIN_PASSWORD;

    expect(
        adminPassword,
        'ADMIN_PASSWORD belum diatur'
    ).toBeTruthy();

    await page.goto(`${BASE_URL}/login`, {
        waitUntil: 'domcontentloaded'
    });

    await page.locator('input[name="username"]').fill('admin');

    await page.locator('#pw').fill(adminPassword);

    await page.locator('.btn-login').click();

    await expect(page).toHaveURL(
        /\/admin\/dashboard\/?$/
    );

});

// ==========================================
// AT-SISWA-001
// Memastikan halaman Data Siswa tampil
// ==========================================

test('AT-SISWA-001 - Memastikan halaman Data Siswa tampil', async ({ page }) => {

    await page.goto(`${BASE_URL}/admin/siswa`);

    await expect(
        page.locator('table')
    ).toBeVisible();

});

// ==========================================
// AT-SISWA-002
// Memastikan form Tambah Siswa tampil
// ==========================================

test('AT-SISWA-002 - Memastikan form Tambah Siswa tampil', async ({ page }) => {

    await page.goto(`${BASE_URL}/admin/siswa/tambah`);

    await expect(
        page.locator('input[name="NIS"]')
    ).toBeVisible();

    await expect(
        page.locator('input[name="nama"]')
    ).toBeVisible();

    await expect(
        page.locator('input[name="kelas"]')
    ).toBeVisible();

    await expect(
        page.locator('select[name="jenis_kelamin"]')
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Simpan' })
    ).toBeVisible();

});

// ==========================================
// AT-SISWA-003
// Menambahkan siswa dengan data valid
// ==========================================

test('AT-SISWA-003 - Menambahkan siswa dengan data valid', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Siswa Automation QA',
        kelas: 'X RPL 1',
        jenisKelamin: 'L'
    });

    const siswaBaru = cariBarisSiswa(page, nis);

    await expect(siswaBaru).toContainText('Siswa Automation QA');

    await expect(siswaBaru).toContainText('X RPL 1');

    console.log('Siswa berhasil ditambahkan dengan NIS:', nis);

});

// ==========================================
// AT-SISWA-004
// Menambahkan siswa dengan NIS kosong
// ==========================================

test('AT-SISWA-004 - Menambahkan siswa dengan NIS kosong', async ({ page }) => {

    await page.goto(`${BASE_URL}/admin/siswa/tambah`);

    await page.locator('input[name="NIS"]').fill('');

    await page.locator('input[name="nama"]').fill('Testing QA Negative');

    await page.locator('input[name="kelas"]').fill('X RPL 1');

    await page.locator('select[name="jenis_kelamin"]').selectOption('L');

    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(
        page.locator('input[name="NIS"]')
    ).toBeFocused();

});

// ==========================================
// AT-SISWA-005
// Menambahkan siswa dengan nama kosong
// ==========================================

test('AT-SISWA-005 - Menambahkan siswa dengan nama kosong', async ({ page }) => {

    await page.goto(`${BASE_URL}/admin/siswa/tambah`);

    await page.locator('input[name="NIS"]').fill(generateNIS());

    await page.locator('input[name="nama"]').fill('');

    await page.locator('input[name="kelas"]').fill('X RPL 1');

    await page.locator('select[name="jenis_kelamin"]').selectOption('L');

    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(
        page.locator('input[name="nama"]')
    ).toBeFocused();

});

// ==========================================
// AT-SISWA-006
// Menambahkan siswa dengan kelas kosong
// ==========================================

test('AT-SISWA-006 - Menambahkan siswa dengan kelas kosong', async ({ page }) => {

    await page.goto(`${BASE_URL}/admin/siswa/tambah`);

    await page.locator('input[name="NIS"]').fill(generateNIS());

    await page.locator('input[name="nama"]').fill('Testing Kelas Kosong');

    await page.locator('input[name="kelas"]').fill('');

    await page.locator('select[name="jenis_kelamin"]').selectOption('L');

    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(
        page.locator('input[name="kelas"]')
    ).toBeFocused();

});

// ==========================================
// AT-SISWA-007
// Menambahkan siswa tanpa jenis kelamin
// ==========================================

test('AT-SISWA-007 - Menambahkan siswa tanpa jenis kelamin', async ({ page }) => {

    await page.goto(`${BASE_URL}/admin/siswa/tambah`);

    await page.locator('input[name="NIS"]').fill(generateNIS());

    await page.locator('input[name="nama"]').fill('Testing Gender Kosong');

    await page.locator('input[name="kelas"]').fill('X RPL 1');

    await page.locator('select[name="jenis_kelamin"]').selectOption('');

    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(
        page.locator('select[name="jenis_kelamin"]')
    ).toBeFocused();

});

// ==========================================
// AT-SISWA-008
// Menolak NIS duplikat
// ==========================================

test('AT-SISWA-008 - Sistem menolak NIS duplikat', async ({ page }) => {

    await page.goto(`${BASE_URL}/admin/siswa/tambah`);

    // NIS yang sudah diketahui terdaftar
    await page.locator('input[name="NIS"]').fill('101010');

    await page.locator('input[name="nama"]').fill('Testing Duplicate QA');

    await page.locator('input[name="kelas"]').fill('X RPL 1');

    await page.locator('select[name="jenis_kelamin"]').selectOption('L');

    await page.getByRole('button', { name: 'Simpan' }).click();

    // Memastikan tetap di halaman tambah
    await expect(page).toHaveURL(
        /\/admin\/siswa\/tambah\/?$/
    );

    // Memastikan pesan duplikat muncul
    const pesanValidasi = page.getByText(
        'NIS 101010 sudah terdaftar!',
        { exact: true }
    );

    await expect(pesanValidasi).toBeVisible();

    console.log(
        'Pesan validasi NIS duplikat:',
        await pesanValidasi.innerText()
    );

});

// ==========================================
// AT-SISWA-009
// Memastikan data siswa tampil di tabel
// ==========================================

test('AT-SISWA-009 - Memastikan data siswa tampil di tabel', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Testing Read QA',
        kelas: 'X RPL 1'
    });

    await page.reload();

    const barisSiswa = cariBarisSiswa(page, nis);

    await expect(barisSiswa).toHaveCount(1);

    await expect(barisSiswa).toContainText(nis);

    await expect(barisSiswa).toContainText('Testing Read QA');

    await expect(barisSiswa).toContainText('X RPL 1');

    console.log('Data siswa berhasil ditemukan:', nis);

});

// ==========================================
// AT-SISWA-010
// Memastikan halaman Edit Siswa tampil
// ==========================================

test('AT-SISWA-010 - Memastikan halaman Edit Siswa tampil', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Testing Edit QA',
        kelas: 'X RPL 1'
    });

    const barisSiswa = cariBarisSiswa(page, nis);

    await barisSiswa.locator('a[href*="/admin/siswa/edit/"]').click();

    await expect(page).toHaveURL(/\/admin\/siswa\/edit\/\d+/);

    await expect(
        page.locator('input[name="NIS"]')
    ).toHaveValue(nis);

    await expect(
        page.locator('input[name="nama"]')
    ).toHaveValue('Testing Edit QA');

    await expect(
        page.locator('input[name="kelas"]')
    ).toHaveValue('X RPL 1');

    await expect(
        page.locator('select[name="jenis_kelamin"]')
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Simpan' })
    ).toBeVisible();

});

// ==========================================
// AT-SISWA-011
// Mengubah nama dan kelas siswa
// ==========================================

test('AT-SISWA-011 - Mengubah nama dan kelas siswa', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Sebelum Update QA',
        kelas: 'X RPL 1'
    });

    const namaBaru = 'Sesudah Update QA';
    const kelasBaru = 'XI RPL 2';

    const barisSiswa = cariBarisSiswa(page, nis);

    await barisSiswa.locator('a[href*="/admin/siswa/edit/"]').click();

    await expect(page).toHaveURL(/\/admin\/siswa\/edit\/\d+/);

    await page.locator('input[name="nama"]').fill(namaBaru);

    await page.locator('input[name="kelas"]').fill(kelasBaru);

    await expect(
        page.locator('input[name="nama"]')
    ).toHaveValue(namaBaru);

    await expect(
        page.locator('input[name="kelas"]')
    ).toHaveValue(kelasBaru);

    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(page).toHaveURL(/\/admin\/siswa\/?$/);

    const dataSiswa = cariBarisSiswa(page, nis);

    await expect(dataSiswa).toHaveCount(1);

    await expect(dataSiswa).toContainText(namaBaru);

    await expect(dataSiswa).toContainText(kelasBaru);

    console.log('Data siswa berhasil diperbarui:', nis);

});

// ==========================================
// AT-SISWA-012
// Memastikan perubahan data siswa tersimpan
// ==========================================

test('AT-SISWA-012 - Memastikan perubahan data siswa tersimpan', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Data Awal QA',
        kelas: 'X RPL 1'
    });

    const namaBaru = 'Data Tersimpan QA';
    const kelasBaru = 'XI RPL 3';

    const barisSiswa = cariBarisSiswa(page, nis);

    await barisSiswa.locator('a[href*="/admin/siswa/edit/"]').click();

    await page.locator('input[name="nama"]').fill(namaBaru);

    await page.locator('input[name="kelas"]').fill(kelasBaru);

    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(page).toHaveURL(/\/admin\/siswa\/?$/);

    // Memuat ulang halaman untuk verifikasi persistence
    await page.reload();

    const dataSiswa = cariBarisSiswa(page, nis);

    await expect(dataSiswa).toHaveCount(1);

    await expect(dataSiswa).toContainText(namaBaru);

    await expect(dataSiswa).toContainText(kelasBaru);

    console.log('Perubahan data berhasil diverifikasi:', nis);

});

// ==========================================
// AT-SISWA-013
// Memastikan tombol Hapus tampil
// ==========================================

test('AT-SISWA-013 - Memastikan tombol Hapus tampil', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Testing Delete QA'
    });

    const barisSiswa = cariBarisSiswa(page, nis);

    await expect(barisSiswa).toHaveCount(1);

    await expect(
        barisSiswa.locator('i.bi-trash')
    ).toBeVisible();

});

// ==========================================
// AT-SISWA-014
// Menghapus siswa dengan konfirmasi
// ==========================================

test('AT-SISWA-014 - Menghapus siswa dengan konfirmasi', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Testing Delete Confirm QA'
    });

    const barisSiswa = cariBarisSiswa(page, nis);

    await expect(barisSiswa).toBeVisible();

    // Menangani dialog konfirmasi
    page.once('dialog', async dialog => {

        console.log('Pesan konfirmasi:', dialog.message());

        expect(dialog.message()).toBe(
            'Yakin ingin menghapus siswa ini?'
        );

        await dialog.accept();

    });

    await barisSiswa.locator('i.bi-trash').locator('..').click();

    // Memastikan siswa sudah dihapus
    await expect(
        cariBarisSiswa(page, nis)
    ).toHaveCount(0);

    console.log('Siswa berhasil dihapus:', nis);

});

// ==========================================
// AT-SISWA-015
// Memastikan data siswa terhapus
// ==========================================

test('AT-SISWA-015 - Memastikan data siswa terhapus', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Testing Delete Verify QA'
    });

    const barisSiswa = cariBarisSiswa(page, nis);

    await expect(barisSiswa).toBeVisible();

    page.once('dialog', async dialog => {

        expect(dialog.message()).toBe(
            'Yakin ingin menghapus siswa ini?'
        );

        await dialog.accept();

    });

    await barisSiswa.locator('i.bi-trash').locator('..').click();

    await page.reload();

    await expect(
        cariBarisSiswa(page, nis)
    ).toHaveCount(0);

    console.log('Data berhasil diverifikasi terhapus:', nis);

});

// ==========================================
// AT-SISWA-016
// Membatalkan penghapusan siswa
// ==========================================

test('AT-SISWA-016 - Membatalkan penghapusan siswa', async ({ page }) => {

    const nis = await buatSiswaTesting(page, {
        nama: 'Testing Delete Cancel QA'
    });

    const barisSiswa = cariBarisSiswa(page, nis);

    await expect(barisSiswa).toBeVisible();

    page.once('dialog', async dialog => {

        console.log('Pesan konfirmasi:', dialog.message());

        expect(dialog.message()).toBe(
            'Yakin ingin menghapus siswa ini?'
        );

        await dialog.dismiss();

    });

    await barisSiswa.locator('i.bi-trash').locator('..').click();

    // Memastikan data masih tersedia
    await expect(
        cariBarisSiswa(page, nis)
    ).toHaveCount(1);

    await expect(
        cariBarisSiswa(page, nis)
    ).toContainText('Testing Delete Cancel QA');

    console.log('Penghapusan dibatalkan. Data tetap tersedia:', nis);

});
