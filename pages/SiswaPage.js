
const { expect } = require('@playwright/test');

const BASE_URL = 'http://localhost/e-raport/public';

class SiswaPage {
    constructor(page) {
        this.page = page;

        this.judul = page.locator('.card-custom-header h5');
        this.tabel = page.locator('table.table');
        this.baris = page.locator('table.table tbody tr');

        this.tombolTambah = page.getByRole('link', {
            name: /Tambah Siswa/i
        });

        this.inputNIS = page.locator('input[name="NIS"]');
        this.inputNama = page.locator('input[name="nama"]');
        this.inputKelas = page.locator('input[name="kelas"]');
        this.selectJK = page.locator('select[name="jenis_kelamin"]');

        this.tombolSimpan = page.locator(
            'button[type="submit"]'
        );

        this.tombolBatal = page.getByRole('link', {
            name: /Batal/i
        });
    }

    async bukaHalaman() {
        await this.page.goto(`${BASE_URL}/admin/siswa`, {
            waitUntil: 'commit',
            timeout: 60000
        });

        await expect(this.judul).toContainText(/Data Siswa/i);

        console.log('Halaman Data Siswa berhasil dibuka');
    }

    async verifikasiHalaman() {
        await expect(this.judul).toBeVisible();
        await expect(this.tabel).toBeVisible();
        await expect(this.tombolTambah).toBeVisible();

        console.log('Halaman Data Siswa berhasil ditampilkan');
    }

    async bukaFormTambah() {
        await this.tombolTambah.click();

        await expect(this.judul).toContainText(/Tambah Siswa/i);
        await expect(this.inputNIS).toBeVisible();

        console.log('Form Tambah Siswa berhasil dibuka');
    }

    async verifikasiForm() {
        await expect(this.inputNIS).toBeVisible();
        await expect(this.inputNama).toBeVisible();
        await expect(this.inputKelas).toBeVisible();
        await expect(this.selectJK).toBeVisible();
        await expect(this.tombolSimpan).toBeVisible();
        await expect(this.tombolBatal).toBeVisible();
    }

    async isiForm(data) {
        await this.inputNIS.fill(data.NIS);
        await this.inputNama.fill(data.nama);
        await this.inputKelas.fill(data.kelas);
        await this.selectJK.selectOption(data.jenis_kelamin);
    }

    async simpan() {
        await Promise.all([
            this.page.waitForURL(
                url => url.pathname.endsWith('/admin/siswa'),
                { waitUntil: 'commit', timeout: 30000 }
            ),
            this.tombolSimpan.click()
        ]);
    }

    async cariSiswa(nis) {
        return this.page.locator('table.table tbody tr')
            .filter({ hasText: nis });
    }

    async bukaEdit(nis) {
        const baris = await this.cariSiswa(nis);

        await expect(baris).toHaveCount(1);

        await baris.locator(
            'a[href*="/admin/siswa/edit/"]'
        ).click();

        await expect(this.judul).toContainText(/Edit Siswa/i);
    }

    async editSiswa(data) {
        await this.isiForm(data);
        await this.simpan();
    }

    async hapusSiswa(nis) {
        const baris = await this.cariSiswa(nis);

        await expect(baris).toHaveCount(1);

        this.page.once('dialog', dialog => dialog.accept());

        await baris.locator(
            'a[href*="/admin/siswa/hapus/"]'
        ).click();

        await expect(baris).toHaveCount(0);
    }
}

module.exports = { SiswaPage };
