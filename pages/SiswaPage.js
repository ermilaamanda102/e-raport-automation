
class SiswaPage {

    constructor(page) {
        this.page = page;

        this.nisInput = page.locator('input[name="NIS"]');
        this.namaInput = page.locator('input[name="nama"]');
        this.kelasInput = page.locator('input[name="kelas"]');

        this.jenisKelaminSelect = page.locator(
            'select[name="jenis_kelamin"]'
        );

        this.simpanButton = page.getByRole('button', {
            name: 'Simpan'
        });

        this.table = page.locator('table');
    }

    // Membuka halaman Data Siswa
    async open() {
        await this.page.goto(
            'http://localhost/e-raport/public/admin/siswa'
        );
    }

    // Membuka form Tambah Siswa
    async openTambah() {
        await this.page.goto(
            'http://localhost/e-raport/public/admin/siswa/tambah'
        );
    }

    // Mengisi form siswa
    async isiForm(data) {
        await this.nisInput.fill(data.nis);
        await this.namaInput.fill(data.nama);
        await this.kelasInput.fill(data.kelas);

        await this.jenisKelaminSelect.selectOption(
            data.jenisKelamin
        );
    }

    // Menyimpan data siswa
    async simpan() {
        await this.simpanButton.click();
    }

    // Mencari baris siswa berdasarkan NIS
    cariBaris(nis) {
        return this.page.getByRole('row').filter({
            has: this.page.getByRole('cell', {
                name: nis,
                exact: true
            })
        });
    }

    // Membuka halaman Edit Siswa
    async bukaEdit(nis) {
        const baris = this.cariBaris(nis);

        await baris.locator(
            'a[href*="/admin/siswa/edit/"]'
        ).click();
    }

    // Mengubah nama dan kelas
    async updateData(nama, kelas) {
        await this.namaInput.fill(nama);
        await this.kelasInput.fill(kelas);

        await this.simpan();
    }

    // Menghapus siswa
    async hapus(nis) {
        const baris = this.cariBaris(nis);

        this.page.once('dialog', dialog => dialog.accept());

        await baris.locator('i.bi-trash').locator('..').click();
    }

}

module.exports = { SiswaPage };
