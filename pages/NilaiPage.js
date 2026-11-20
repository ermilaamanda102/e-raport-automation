
const { expect } = require('@playwright/test');

const BASE_URL = 'http://localhost/e-raport/public';

class NilaiPage {
    constructor(page) {
        this.page = page;

        // Halaman Rekap Nilai
        this.judulRekap = page.locator(
            '.card-custom-header h5'
        ).filter({ hasText: /Rekap Nilai/ });

        this.tabelNilai = page.locator(
            '.card-custom .table-responsive table'
        );

        this.buttonInputNilai = page.locator(
            '.card-custom-header a[href*="/guru/nilai/input"]'
        );

        this.selectSemesterFilter = page.locator(
            'form[action$="/guru/nilai"] select[name="semester"]'
        );

        // Form Input Nilai
        this.formInput = page.locator(
            'form[action*="/guru/nilai/simpan"]'
        );

        this.selectSiswa = this.formInput.locator(
            'select[name="siswa_id"]'
        );

        this.inputTugas = this.formInput.locator(
            'input[name="nilai_tugas"]'
        );

        this.inputUTS = this.formInput.locator(
            'input[name="nilai_uts"]'
        );

        this.inputUAS = this.formInput.locator(
            'input[name="nilai_uas"]'
        );

        this.selectSemester = this.formInput.locator(
            'select[name="semester"]'
        );

        this.inputTahunAjaran = this.formInput.locator(
            'input[name="tahun_ajaran"]'
        );

        this.buttonSimpan = this.formInput.getByRole(
            'button',
            { name: /Simpan Nilai/ }
        );

        this.buttonBatal = this.formInput.locator(
            'a.btn-secondary'
        );

        // Form Edit Nilai
        this.buttonUpdate = page.getByRole(
            'button',
            { name: /Update Nilai/ }
        );
    }

    // Membuka halaman Rekap Nilai
    async bukaHalamanNilai() {
        await this.page.goto(`${BASE_URL}/guru/nilai`, {
            waitUntil: 'domcontentloaded'
        });

        await expect(this.judulRekap).toBeVisible();
    }

    // Membuka form Input Nilai
    async bukaFormInput() {
        await this.page.goto(
            `${BASE_URL}/guru/nilai/input`,
            { waitUntil: 'domcontentloaded' }
        );

        await expect(this.formInput).toBeVisible();
    }

    // Memilih siswa
    async pilihSiswa(index = 0) {
        await expect(this.selectSiswa).toBeVisible();

        await this.selectSiswa.selectOption({
            index: index + 1
        });
    }

    // Mengisi nilai
    async isiNilai(tugas, uts, uas) {
        await this.inputTugas.fill(String(tugas));
        await this.inputUTS.fill(String(uts));
        await this.inputUAS.fill(String(uas));
    }

    // Memilih semester
    async pilihSemester(semester) {
        await this.selectSemester.selectOption(
            String(semester)
        );
    }

    // Mengisi tahun ajaran
    async isiTahunAjaran(tahun) {
        await this.inputTahunAjaran.fill(tahun);
    }

    // Mengisi seluruh form
    async isiFormNilai(data) {
        await this.pilihSiswa(data.siswaIndex ?? 0);

        await this.isiNilai(
            data.tugas,
            data.uts,
            data.uas
        );

        await this.pilihSemester(data.semester);

        await this.isiTahunAjaran(
            data.tahunAjaran
        );
    }

    // Menyimpan nilai
    async simpan() {
        await this.buttonSimpan.click();
    }

    // Verifikasi halaman Rekap Nilai
    async verifikasiHalamanRekap() {
        await expect(this.judulRekap).toBeVisible();
        await expect(this.tabelNilai).toBeVisible();
        await expect(this.buttonInputNilai).toBeVisible();

        console.log(
            'Halaman Rekap Nilai berhasil ditampilkan'
        );
    }

    // Verifikasi form Input Nilai
    async verifikasiFormInput() {
        await expect(this.selectSiswa).toBeVisible();
        await expect(this.inputTugas).toBeVisible();
        await expect(this.inputUTS).toBeVisible();
        await expect(this.inputUAS).toBeVisible();
        await expect(this.selectSemester).toBeVisible();
        await expect(this.inputTahunAjaran).toBeVisible();
        await expect(this.buttonSimpan).toBeVisible();

        console.log(
            'Form Input Nilai berhasil ditampilkan'
        );
    }

    // Menghitung nilai akhir
    hitungNilaiAkhir(tugas, uts, uas) {
        return (
            (0.30 * tugas) +
            (0.30 * uts) +
            (0.40 * uas)
        );
    }
}

module.exports = { NilaiPage };
