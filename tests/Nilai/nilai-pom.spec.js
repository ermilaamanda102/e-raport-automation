const { test, expect } = require('@playwright/test');
const { NilaiPage } = require('../../pages/NilaiPage');

const BASE_URL = 'http://localhost/e-raport/public';
// Login Guru sebelum setiap test

// Login Guru sebelum setiap test

// Login Guru sebelum setiap test
test.beforeEach(async ({ page }) => {

    const username = process.env.GURU_USERNAME;
    const password = process.env.GURU_PASSWORD;

    expect(username, 'GURU_USERNAME belum diatur').toBeTruthy();
    expect(password, 'GURU_PASSWORD belum diatur').toBeTruthy();

    // Membuka URL login secara langsung
    await page.goto(`${BASE_URL}/login`, {
        waitUntil: 'domcontentloaded'
    });

    console.log('URL login:', page.url());

    // Memastikan form login benar-benar muncul
    const inputUsername = page.locator('input[name="username"]');
    const inputPassword = page.locator('input[name="password"]');

    await expect(inputUsername).toBeVisible({
        timeout: 15000
    });

    await expect(inputPassword).toBeVisible({
        timeout: 15000
    });

    // Mengisi akun Guru
    await inputUsername.fill(username);
    await inputPassword.fill(password);

    // Klik tombol Masuk
    await page.locator('button.btn-login').click();

    // Memastikan login berhasil
    await expect(page).toHaveURL(
        /\/guru\/dashboard\/?$/,
        { timeout: 15000 }
    );

    console.log('Login Guru berhasil:', username);
    console.log('URL Dashboard:', page.url());
});


// ==========================================
// AT-NILAI-001
// Memastikan halaman Rekap Nilai tampil
// ==========================================

test('AT-NILAI-001 - Memastikan halaman Rekap Nilai tampil', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    await nilaiPage.bukaHalamanNilai();

    await nilaiPage.verifikasiHalamanRekap();

    await expect(
        page.getByRole('heading', {
            name: /Rekap Nilai/
        })
    ).toBeVisible();

    console.log('Halaman Rekap Nilai berhasil ditampilkan');

});


// ==========================================
// AT-NILAI-002
// Memastikan form Input Nilai tampil
// ==========================================

test('AT-NILAI-002 - Memastikan form Input Nilai tampil', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    await nilaiPage.bukaFormInput();

    await nilaiPage.verifikasiFormInput();

    console.log('Form Input Nilai berhasil ditampilkan');

});


// ==========================================
// AT-NILAI-003
// Memastikan pilihan siswa tersedia
// ==========================================

test('AT-NILAI-003 - Memastikan pilihan siswa tersedia', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    await nilaiPage.bukaFormInput();

    const jumlahSiswa = await nilaiPage.selectSiswa
        .locator('option')
        .count();

    expect(jumlahSiswa).toBeGreaterThan(1);

    console.log(
        'Jumlah pilihan siswa:',
        jumlahSiswa - 1
    );

    console.log('Pilihan siswa berhasil ditampilkan');

});


// ==========================================
// AT-NILAI-004
// Memastikan form dapat diisi
// ==========================================

test('AT-NILAI-004 - Memastikan form Input Nilai dapat diisi', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    await nilaiPage.bukaFormInput();

    const dataNilai = {
        siswaIndex: 0,
        tugas: 80,
        uts: 85,
        uas: 90,
        semester: '1',
        tahunAjaran: '2026/2027'
    };

    await nilaiPage.isiFormNilai(dataNilai);

    await expect(
        nilaiPage.inputTugas
    ).toHaveValue('80');

    await expect(
        nilaiPage.inputUTS
    ).toHaveValue('85');

    await expect(
        nilaiPage.inputUAS
    ).toHaveValue('90');

    await expect(
        nilaiPage.selectSemester
    ).toHaveValue('1');

    await expect(
        nilaiPage.inputTahunAjaran
    ).toHaveValue('2026/2027');

    console.log('Form nilai berhasil diisi');

});


// ==========================================
// AT-NILAI-005
// Menghitung nilai akhir
// ==========================================

test('AT-NILAI-005 - Memastikan perhitungan nilai akhir', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    const tugas = 80;
    const uts = 85;
    const uas = 90;

    const nilaiAkhir = nilaiPage.hitungNilaiAkhir(
        tugas,
        uts,
        uas
    );

    expect(nilaiAkhir).toBe(85.5);

    console.log(
        'Nilai akhir berhasil dihitung:',
        nilaiAkhir
    );

});


// ==========================================
// AT-NILAI-006
// Validasi nilai melebihi 100
// ==========================================

test('AT-NILAI-006 - Menolak nilai lebih dari 100', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    await nilaiPage.bukaFormInput();

    await nilaiPage.inputTugas.fill('101');

    const validasi = await nilaiPage.inputTugas.evaluate(
        element => element.validity.rangeOverflow
    );

    expect(validasi).toBeTruthy();

    console.log(
        'Validasi berhasil: Nilai tidak boleh lebih dari 100'
    );

});


// ==========================================
// AT-NILAI-007
// Memastikan filter semester berfungsi
// ==========================================

test('AT-NILAI-007 - Memastikan filter semester berfungsi', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    await nilaiPage.bukaHalamanNilai();

    await nilaiPage.selectSemesterFilter.selectOption('1');

    await page.getByRole('button', {
        name: /Filter/
    }).click();

    await expect(page).toHaveURL(/semester=1/);

    console.log('Filter Semester 1 berhasil digunakan');

});


// ==========================================
// AT-NILAI-008
// Memastikan tombol Input Nilai tersedia
// ==========================================

test('AT-NILAI-008 - Memastikan tombol Input Nilai tersedia', async ({ page }) => {

    const nilaiPage = new NilaiPage(page);

    await nilaiPage.bukaHalamanNilai();

    await expect(
        nilaiPage.buttonInputNilai
    ).toBeVisible();

    await nilaiPage.buttonInputNilai.click();

    await expect(page).toHaveURL(
        /\/guru\/nilai\/input\/?$/
    );

    console.log('Tombol Input Nilai berhasil digunakan');

});