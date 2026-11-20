
const { test, expect } = require('@playwright/test');
const { SiswaPage } = require('../../pages/SiswaPage');

const BASE_URL = 'http://localhost/e-raport/public';

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

function dataSiswa() {
    const nis = `S${Date.now()}`;

    return {
        NIS: nis,
        nama: `Siswa Automation ${nis}`,
        kelas: 'X RPL 1',
        jenis_kelamin: 'L'
    };
}

// AT-SISWA-001
test('AT-SISWA-001 - Memastikan halaman Data Siswa tampil',
async ({ page }) => {
    const siswa = new SiswaPage(page);

    await siswa.bukaHalaman();
    await siswa.verifikasiHalaman();
});

// AT-SISWA-002
test('AT-SISWA-002 - Memastikan header tabel siswa tampil',
async ({ page }) => {
    const siswa = new SiswaPage(page);

    await siswa.bukaHalaman();

    const header = page.locator('table.table thead th');

    await expect(header).toHaveCount(6);

    await expect(header.nth(1)).toContainText('NIS');
    await expect(header.nth(2)).toContainText('Nama');
    await expect(header.nth(3)).toContainText('Kelas');
    await expect(header.nth(4)).toContainText('Jenis Kelamin');
    await expect(header.nth(5)).toContainText('Aksi');

    console.log('Seluruh header tabel siswa berhasil ditampilkan');
});

// AT-SISWA-003
test('AT-SISWA-003 - Memastikan form Tambah Siswa tampil',
async ({ page }) => {
    const siswa = new SiswaPage(page);

    await siswa.bukaHalaman();
    await siswa.bukaFormTambah();
    await siswa.verifikasiForm();

    console.log('Form Tambah Siswa berhasil ditampilkan');
});

// AT-SISWA-004
test('AT-SISWA-004 - Menolak penyimpanan form kosong',
async ({ page }) => {
    const siswa = new SiswaPage(page);

    await siswa.bukaHalaman();
    await siswa.bukaFormTambah();

    const valid = await siswa.inputNIS.evaluate(
        element => element.checkValidity()
    );

    expect(valid).toBe(false);

    console.log('Validasi NIS wajib diisi berhasil');
});

// AT-SISWA-005
test('AT-SISWA-005 - Menambahkan siswa dengan data valid',
async ({ page }) => {
    const siswa = new SiswaPage(page);
    const data = dataSiswa();

    await siswa.bukaHalaman();
    await siswa.bukaFormTambah();
    await siswa.isiForm(data);
    await siswa.simpan();

    const baris = await siswa.cariSiswa(data.NIS);

    await expect(baris).toHaveCount(1);
    await expect(baris).toContainText(data.nama);
    await expect(baris).toContainText(data.kelas);

    console.log('Siswa berhasil ditambahkan:', data.NIS);
});

// AT-SISWA-006
test('AT-SISWA-006 - Menolak NIS duplikat',
async ({ page }) => {
    const siswa = new SiswaPage(page);
    const data = dataSiswa();

    // Buat data pertama
    await siswa.bukaHalaman();
    await siswa.bukaFormTambah();
    await siswa.isiForm(data);
    await siswa.simpan();

    // Coba gunakan NIS yang sama
    await siswa.bukaFormTambah();

    await siswa.isiForm({
        ...data,
        nama: 'Siswa Duplikat'
    });

    await siswa.tombolSimpan.click();

    // Controller mengembalikan pengguna ke form
    await expect(siswa.judul).toContainText(/Tambah Siswa/i);

    await expect(page.locator('body')).toContainText(
        /sudah terdaftar/i
    );

    console.log('Validasi NIS duplikat berhasil');
});

// AT-SISWA-007
test('AT-SISWA-007 - Memastikan edit data siswa berhasil',
async ({ page }) => {
    const siswa = new SiswaPage(page);
    const data = dataSiswa();

    // Buat siswa untuk kebutuhan pengujian edit
    await siswa.bukaHalaman();
    await siswa.bukaFormTambah();
    await siswa.isiForm(data);
    await siswa.simpan();

    // Edit siswa
    await siswa.bukaEdit(data.NIS);

    const dataBaru = {
        ...data,
        nama: `Siswa Edit ${data.NIS}`,
        kelas: 'XI RPL 1',
        jenis_kelamin: 'P'
    };

    await siswa.editSiswa(dataBaru);

    const baris = await siswa.cariSiswa(data.NIS);

    await expect(baris).toContainText(dataBaru.nama);
    await expect(baris).toContainText(dataBaru.kelas);
    await expect(baris).toContainText('Perempuan');

    console.log('Data siswa berhasil diperbarui:', data.NIS);
});

// AT-SISWA-008
test('AT-SISWA-008 - Memastikan hapus data siswa berhasil',
async ({ page }) => {
    const siswa = new SiswaPage(page);
    const data = dataSiswa();

    // Buat data khusus untuk pengujian hapus
    await siswa.bukaHalaman();
    await siswa.bukaFormTambah();
    await siswa.isiForm(data);
    await siswa.simpan();

    // Hapus siswa
    await siswa.hapusSiswa(data.NIS);

    console.log('Data siswa berhasil dihapus:', data.NIS);
});
