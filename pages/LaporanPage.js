
const { expect } = require('@playwright/test');

class LaporanPage {
    constructor(page) {
        this.page = page;

        this.judul = page.locator('.card-custom-header h5');

        this.filterKelas = page.locator('select[name="kelas"]');
        this.filterMapel = page.locator('select[name="mapel"]');
        this.filterSemester = page.locator('select[name="semester"]');
        this.filterTahun = page.locator('select[name="tahun_ajaran"]');

        this.tombolFilter = page.locator('button[type="submit"]');
        this.tombolReset = page.locator('a[href*="/admin/laporan"]').filter({
    hasText: 'Reset'
});
        this.tombolCetak = page.locator('a[href*="/admin/laporan/cetak"]');

        this.tabel = page.locator('table');
        this.baris = page.locator('table tbody tr');
       }

    async bukaHalaman() {
        await this.page.goto('admin/laporan');

        await expect(this.judul).toContainText(
            /Laporan Nilai Siswa/i
        );

        console.log('Halaman Laporan berhasil dibuka:', this.page.url());
    }


    async verifikasiHalaman() {
        await expect(this.judul).toContainText(/Laporan Nilai Siswa/i);
        await expect(this.filterKelas).toBeVisible();
        await expect(this.filterMapel).toBeVisible();
        await expect(this.filterSemester).toBeVisible();
        await expect(this.filterTahun).toBeVisible();
        await expect(this.tombolFilter).toBeVisible();
        await expect(this.tombolCetak).toBeVisible();
    }

    async filterDenganKelas(kelas) {
        await this.filterKelas.selectOption({ label: kelas });
        await this.tombolFilter.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async filterDenganMapel(mapel) {
        await this.filterMapel.selectOption({ label: mapel });
        await this.tombolFilter.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async filterDenganSemester(semester) {
        await this.filterSemester.selectOption(semester);
        await this.tombolFilter.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async filterDenganTahun(tahun) {
        await this.filterTahun.selectOption({ label: tahun });
        await this.tombolFilter.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async resetFilter() {
        await this.tombolReset.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async bukaCetak() {
        await this.tombolCetak.click();
    }
}

module.exports = { LaporanPage };
