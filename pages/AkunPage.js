
const { expect } = require('@playwright/test');

class AkunPage {
    constructor(page) {
        this.page = page;

        this.judul = page.locator('.card-custom-header h5');
        // Tabel utama Kelola Akun
this.tabel = page.locator(
    '.card-custom-body table.table'
);

// Baris akun pada tabel utama
this.baris = this.tabel.locator('tbody tr');

        this.tombolTambah = page.locator(
            'a[href*="/register"]'
        );

        this.headerTabel = this.tabel.locator('thead th');
        this.pesanSukses = page.locator('.alert-success');
        this.pesanError = page.locator('.alert-danger');
    }

    async bukaHalaman() {
        await this.page.goto(
            'http://localhost/e-raport/public/admin/akun',
            { waitUntil: 'domcontentloaded' }
        );

        await expect(this.judul).toContainText(
            'Kelola Akun Pengguna'
        );
    }

    async verifikasiHalaman() {
        await expect(this.judul).toBeVisible();
        await expect(this.tabel).toBeVisible();
        await expect(this.tombolTambah).toBeVisible();
    }

    async jumlahAkun() {
        return await this.baris.count();
    }

    async verifikasiHeader() {
        const header = [
            '#',
            'Nama Lengkap',
            'Username',
            'Role',
            'Dibuat',
            'Aksi'
        ];

        for (let i = 0; i < header.length; i++) {
            await expect(
                this.headerTabel.nth(i)
            ).toHaveText(header[i]);
        }
    }

    barisAkun(username) {
        return this.baris.filter({
            has: this.page.locator('code', {
                hasText: username
            })
        });
    }

    async verifikasiAkun(username) {
        const baris = this.barisAkun(username);
        await expect(baris).toBeVisible();
    }

    async verifikasiTombolReset(username) {
        const baris = this.barisAkun(username);

        await expect(
            baris.locator('a[title="Reset Password"]')
        ).toBeVisible();
    }

    async resetPassword(username) {
        const baris = this.barisAkun(username);

        this.page.once('dialog', dialog => dialog.accept());

        await baris.locator(
            'a[title="Reset Password"]'
        ).click();
    }

    async verifikasiTombolHapus(username) {
        const baris = this.barisAkun(username);

        await expect(
            baris.locator('a[title="Hapus"]')
        ).toBeVisible();
    }

    async verifikasiTidakAdaTombolHapus(username) {
        const baris = this.barisAkun(username);

        await expect(
            baris.locator('a[title="Hapus"]')
        ).toHaveCount(0);
    }

    async batalkanHapus(username) {
        const baris = this.barisAkun(username);

        this.page.once('dialog', dialog => dialog.dismiss());

        await baris.locator(
            'a[title="Hapus"]'
        ).click();
    }
}

module.exports = { AkunPage };
