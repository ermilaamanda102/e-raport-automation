
const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;

        // Komponen statistik
        this.statCards = page.locator('.stat-card');

        // Dashboard Admin
        this.quickActions = page.locator('a.quick-action');

        // Dashboard Guru
        this.profilMengajar = page.locator('.card-custom')
            .filter({
                has: page.getByRole('heading', {
                    name: 'Profil Mengajar'
                })
            });

        this.idGuru = this.profilMengajar.locator('.row').nth(0)
            .locator('.col-sm-9');

        this.mapelGuru = this.profilMengajar.locator('.row').nth(1)
            .locator('.col-sm-9');

        this.tombolInputNilai = page.locator('a.btn-primary')
            .filter({ hasText: 'Input Nilai Baru' });

        this.tombolRekapNilai = page.locator('a.btn-outline-primary')
            .filter({ hasText: 'Lihat Rekap Nilai' });
    }

    // Mengambil kartu statistik berdasarkan label
    kartuStatistik(label) {
        return this.statCards.filter({
            has: this.page.locator('.stat-label')
                .getByText(label, { exact: true })
        });
    }

    // Memastikan kartu statistik tampil
    async verifikasiStatistik(label) {
        const kartu = this.kartuStatistik(label);

        await expect(kartu).toHaveCount(1);
        await expect(kartu).toBeVisible();

        await expect(
            kartu.locator('.stat-value')
        ).toHaveText(/^\d+$/);
    }

    // Verifikasi Dashboard Admin
    async verifikasiDashboardAdmin() {
        await expect(this.statCards).toHaveCount(4);

        await this.verifikasiStatistik('Total Siswa');
        await this.verifikasiStatistik('Total Guru');
        await this.verifikasiStatistik('Data Nilai');
        await this.verifikasiStatistik('Siswa Lulus');
    }

    // Verifikasi Dashboard Guru
    async verifikasiDashboardGuru() {
        await expect(this.statCards).toHaveCount(3);

        await this.verifikasiStatistik('Total Siswa');
        await this.verifikasiStatistik('Nilai Diinput');
        await this.verifikasiStatistik('Siswa Lulus');
    }

    // Verifikasi aksi cepat Admin
    async verifikasiAksiAdmin(label, tujuan) {
        const tombol = this.quickActions.filter({
            hasText: label
        });

        await expect(tombol).toBeVisible();
        await expect(tombol).toHaveAttribute(
            'href',
            new RegExp(tujuan)
        );
    }

    // Klik aksi cepat Admin
    async bukaAksiAdmin(label, tujuan) {
        const tombol = this.quickActions.filter({
            hasText: label
        });

        await expect(tombol).toBeVisible();
        await tombol.click();

        await expect(this.page).toHaveURL(
            new RegExp(tujuan),
            { timeout: 15000 }
        );
    }

    // Verifikasi profil Guru
    async verifikasiProfilGuru() {
        await expect(this.profilMengajar).toBeVisible();

        await expect(
            this.page.getByRole('heading', {
                name: 'Profil Mengajar'
            })
        ).toBeVisible();
    }

    // Verifikasi informasi ID Guru dan mata pelajaran
    async verifikasiInformasiGuru() {
        await expect(this.idGuru).not.toBeEmpty();
        await expect(this.mapelGuru).not.toBeEmpty();
    }

    // Verifikasi tombol Input Nilai
    async verifikasiTombolInputNilai() {
        await expect(this.tombolInputNilai).toBeVisible();

        await expect(this.tombolInputNilai)
            .toHaveAttribute('href', /\/guru\/nilai\/input/);
    }

    // Verifikasi tombol Rekap Nilai
    async verifikasiTombolRekapNilai() {
        await expect(this.tombolRekapNilai).toBeVisible();

        await expect(this.tombolRekapNilai)
            .toHaveAttribute('href', /\/guru\/nilai$/);
    }

    // Membuka form Input Nilai
    async bukaInputNilai() {
        await this.tombolInputNilai.click();

        await expect(this.page).toHaveURL(
            /\/guru\/nilai\/input/
        );
    }

    // Membuka halaman Rekap Nilai
    async bukaRekapNilai() {
        await this.tombolRekapNilai.click();

        await expect(this.page).toHaveURL(
            /\/guru\/nilai$/
        );
    }
}

module.exports = { DashboardPage };
