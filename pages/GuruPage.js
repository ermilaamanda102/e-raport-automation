const BASE_URL = 'http://localhost/e-raport/public';
const { expect } = require('@playwright/test');

class GuruPage {
    constructor(page) {
        this.page = page;

        this.judul = page.locator('.card-custom-header h5');
        this.tabel = page.locator('table');
        this.baris = page.locator('table tbody tr');

        this.tombolTambah = page.locator(
            'a[href*="/admin/guru/tambah"]'
        );

        this.inputId = page.locator('[name="id_guru"]');
        this.inputNama = page.locator('[name="nama_guru"]');
        this.inputKelas = page.locator('[name="kelas"]');

        this.checkboxMapel = page.locator(
            'input[name="mapel_ids[]"]'
        );

        this.tombolSimpan = page.locator(
            'button[type="submit"]'
        );

        this.pesanError = page.locator('.alert-danger');
        this.pesanSuccess = page.locator('.alert-success');
    }

    async bukaHalaman() {
    await this.page.goto(`${BASE_URL}/admin/guru`);

    await this.page.waitForLoadState('domcontentloaded');

    console.log('URL halaman Guru:', this.page.url());
    console.log('Judul halaman:', await this.page.title());

    await expect(this.judul).toContainText('Data Guru');

    console.log('Halaman Data Guru berhasil dibuka');
}

    async bukaFormTambah() {
    await this.page.goto(`${BASE_URL}/admin/guru/tambah`);

    await expect(this.inputId).toBeVisible();

    console.log('Form Tambah Guru berhasil dibuka');
}

    async verifikasiHalaman() {
        await expect(this.judul).toContainText('Data Guru');
        await expect(this.tabel).toBeVisible();
        await expect(this.tombolTambah).toBeVisible();
    }

    async verifikasiForm() {
        await expect(this.inputId).toBeVisible();
        await expect(this.inputNama).toBeVisible();
        await expect(this.inputKelas).toBeVisible();
        await expect(this.checkboxMapel.first()).toBeVisible();
        await expect(this.tombolSimpan).toBeVisible();
    }

    async isiForm(data) {
        if (data.id_guru !== undefined)
            await this.inputId.fill(data.id_guru);

        if (data.nama_guru !== undefined)
            await this.inputNama.fill(data.nama_guru);

        if (data.kelas !== undefined)
            await this.inputKelas.fill(data.kelas);

        if (data.mapel) {
            await this.checkboxMapel.first().check();
        }
    }

    async simpan() {
        await this.tombolSimpan.click();
    }

    async cariGuru(idGuru) {
        return this.page.locator('table tbody tr').filter({
            hasText: idGuru
        });
    }
}

module.exports = { GuruPage };
