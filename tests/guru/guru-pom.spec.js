
const { test, expect } = require('@playwright/test');
const { GuruPage } = require('../../pages/GuruPage');

const BASE_URL = 'http://localhost/e-raport/public';

test.beforeEach(async ({ page }) => {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'password';

    await page.goto(`${BASE_URL}/login`);

    await page.locator('[name="username"]').fill(username);
    await page.locator('#pw').fill(password);

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/admin\/dashboard/);
});

// AT-GURU-001
test('AT-GURU-001 - Memastikan halaman Data Guru tampil', async ({ page }) => {
    const guru = new GuruPage(page);

    await guru.bukaHalaman();
    await guru.verifikasiHalaman();

    console.log('Halaman Data Guru berhasil ditampilkan');
});

// AT-GURU-002
test('AT-GURU-002 - Memastikan form Tambah Guru tampil', async ({ page }) => {
    const guru = new GuruPage(page);

    await guru.bukaHalaman();
    await guru.bukaFormTambah();
    await guru.verifikasiForm();

    console.log('Form Tambah Guru berhasil ditampilkan');
});

// AT-GURU-003
test('AT-GURU-003 - Menambahkan guru dengan data valid', async ({ page }) => {
    const guru = new GuruPage(page);

    const id = `G${Date.now()}`;

    await guru.bukaHalaman();
    await guru.bukaFormTambah();

    await guru.isiForm({
        id_guru: id,
        nama_guru: 'Guru Automation',
        kelas: 'X IPS 1',
        mapel: true
    });

    await guru.simpan();

    await expect(page).toHaveURL(/admin\/guru$/);
    await expect(guru.pesanSuccess).toContainText('berhasil ditambahkan');

    console.log('Guru berhasil ditambahkan:', id);
});

// AT-GURU-004
test('AT-GURU-004 - Menolak ID Guru kosong', async ({ page }) => {
    const guru = new GuruPage(page);

    await guru.bukaHalaman();
    await guru.bukaFormTambah();

    await guru.isiForm({
        nama_guru: 'Guru Test',
        kelas: 'X IPS 1',
        mapel: true
    });

    await guru.simpan();

    await expect(guru.inputId).toBeVisible();
    await expect(guru.inputId).toHaveAttribute('required', '');

    console.log('Validasi ID Guru wajib diisi berhasil');
});

// AT-GURU-005
test('AT-GURU-005 - Menolak nama guru kosong', async ({ page }) => {
    const guru = new GuruPage(page);

    await guru.bukaHalaman();
    await guru.bukaFormTambah();

    await guru.isiForm({
        id_guru: `G${Date.now()}`,
        kelas: 'X IPS 1',
        mapel: true
    });

    await guru.simpan();

    await expect(guru.inputNama).toHaveAttribute('required', '');

    console.log('Validasi nama guru wajib diisi berhasil');
});

// AT-GURU-006
test('AT-GURU-006 - Menolak mata pelajaran kosong', async ({ page }) => {
    const guru = new GuruPage(page);

    await guru.bukaHalaman();
    await guru.bukaFormTambah();

    await guru.isiForm({
        id_guru: `G${Date.now()}`,
        nama_guru: 'Guru Test Mapel',
        kelas: 'X IPS 1'
    });

    await guru.simpan();

    await expect(guru.pesanError).toContainText(
        'Minimal pilih satu mata pelajaran!'
    );

    console.log('Validasi mata pelajaran kosong berhasil');
});

// AT-GURU-007
test('AT-GURU-007 - Menolak ID Guru duplikat', async ({ page }) => {
    const guru = new GuruPage(page);

    await guru.bukaHalaman();
    await guru.bukaFormTambah();

    await guru.isiForm({
        id_guru: 'G002',
        nama_guru: 'Guru Duplikat',
        kelas: 'X IPS 1',
        mapel: true
    });

    await guru.simpan();

    await expect(guru.pesanError).toContainText(
        'sudah digunakan'
    );

    console.log('Validasi ID Guru duplikat berhasil');
});

// AT-GURU-008
test('AT-GURU-008 - Memastikan data guru tampil di tabel', async ({ page }) => {
    const guru = new GuruPage(page);

    await guru.bukaHalaman();

    await expect(
        await guru.cariGuru('G002')
    ).toBeVisible();

    console.log('Data guru berhasil ditemukan di tabel');
});
