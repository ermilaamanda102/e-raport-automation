
const { expect } = require('@playwright/test');

const BASE_URL = 'http://localhost/e-raport/public';

class MapelPage {
    constructor(page) {
        this.page = page;

        this.judul = page.locator('.card-custom-header h5');

        this.checkboxMapel = page.locator(
            'input[name="mapel_ids[]"]'
        );

        this.tombolSimpan = page.locator(
            'button[type="submit"]'
        );

        this.tombolKembali = page.getByRole('link', {
            name: /Kembali/i
        });

        this.pesan = page.locator('.alert');
    }

    async bukaHalaman(idGuru = 11) {
        const url = `${BASE_URL}/admin/guru/mapel/${idGuru}`;

        await this.page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await expect(this.judul).toContainText(
            'Atur Mata Pelajaran'
        );

        console.log('URL halaman Mapel:', this.page.url());
        console.log('Judul halaman:', await this.page.title());
    }

    async verifikasiHalaman() {
        await expect(this.judul).toBeVisible();
        await expect(this.checkboxMapel.first()).toBeVisible();
        await expect(this.tombolSimpan).toBeVisible();
        await expect(this.tombolKembali).toBeVisible();
    }

    async jumlahMapel() {
        return await this.checkboxMapel.count();
    }

    // Memilih checkbox melalui label agar tidak terjadi
    // klik ganda akibat event onclick pada elemen induk.
    async pilihMapel(index) {
    const checkbox = this.checkboxMapel.nth(index);

    if (!(await checkbox.isChecked())) {
        await checkbox.check();
    }

    await expect(checkbox).toBeChecked();
}

    async pilihBeberapaMapel(indexes) {
    for (const index of indexes) {
        await this.pilihMapel(index);
    }
}

    async hapusSemuaPilihan() {
    const jumlah = await this.checkboxMapel.count();

    for (let i = 0; i < jumlah; i++) {
        const checkbox = this.checkboxMapel.nth(i);

        if (await checkbox.isChecked()) {
            await checkbox.uncheck();
        }

        await expect(checkbox).not.toBeChecked();
    }
}

    async simpan() {
        await this.tombolSimpan.click();
    }

    async kembali() {
        await this.tombolKembali.click();
    }
}

module.exports = { MapelPage };
