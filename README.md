# E-Raport Automation Testing

Proyek pengujian otomatis (*Automation Testing*) pada aplikasi E-Raport (Rapor Elektronik) menggunakan Playwright, JavaScript, dan metode Page Object Model (POM).

## 1. Deskripsi Proyek

E-Raport Automation Testing merupakan proyek pengujian perangkat lunak yang bertujuan untuk mengotomatisasi pengujian fungsional pada aplikasi Rapor Elektronik.

Pengujian dilakukan menggunakan Playwright untuk memastikan fitur-fitur aplikasi berjalan sesuai dengan kebutuhan dan fungsinya.

Proyek ini menerapkan metode **Page Object Model (POM)** untuk memisahkan elemen halaman, locator, dan interaksi dengan skenario pengujian sehingga kode lebih terstruktur, mudah digunakan kembali, dan dipelihara.

## 2. Tujuan Pengujian

- Mengotomatisasi pengujian fungsional pada aplikasi E-Raport.
- Memastikan fitur aplikasi berjalan sesuai dengan yang diharapkan.
- Menguji validasi input dan proses pengolahan data.
- Mengidentifikasi kesalahan atau ketidaksesuaian fungsi aplikasi.
- Menerapkan metode Page Object Model dalam pembuatan script automation testing.
- Mendokumentasikan hasil pengujian sebagai bukti proses Quality Assurance.

## 3. Tools dan Teknologi

| Tools | Kegunaan |
|---|---|
| JavaScript | Bahasa pemrograman |
| Playwright | Framework automation testing |
| Node.js | Menjalankan JavaScript |
| Visual Studio Code | Editor kode |
| Git & GitHub | Version control dan penyimpanan proyek |
| Jira Cloud | Dokumentasi dan pengelolaan task pengujian |

## 4. Metode Pengujian

Proyek ini menggunakan pendekatan **Page Object Model (POM)**.

Penerapan POM dilakukan dengan memisahkan:

- **Pages:** Menyimpan locator dan fungsi interaksi pada setiap halaman aplikasi.
- **Tests:** Menyimpan skenario pengujian dan assertion untuk memvalidasi hasil pengujian.

Pendekatan ini membantu membuat script pengujian lebih terorganisasi dan mudah dikembangkan.

## 5. Struktur Folder Proyek

```text
e-raport-automation/
│
├── pages/
│   ├── AkunPage.js
│   ├── DashboardPage.js
│   ├── GuruPage.js
│   ├── LaporanPage.js
│   ├── MapelPage.js
│   ├── NilaiPage.js
│   └── SiswaPage.js
│
├── tests/
│   ├── akun/
│   ├── dashboard/
│   ├── guru/
│   ├── laporan/
│   ├── mapel/
│   ├── Nilai/
│   └── siswa/
│
├── playwright.config.js
├── package.json
└── package-lock.json
```

## 6. Cakupan Pengujian (Test Coverage)

Berikut modul yang telah berhasil menjalani pengujian otomatis:

| Modul | Jumlah Test Case | Hasil |
|---|---:|---|
| Mata Pelajaran | 8 | PASS |
| Kelola Akun | 8 | PASS |
| Data Siswa | 8 | PASS |
| Rekap Nilai | 8 | PASS |
| **Total** | **32** | **PASS** |

Catatan: Hasil di atas berdasarkan eksekusi pengujian yang telah dilakukan selama pengembangan proyek.

Terdapat tambahan script pengujian untuk modul Dashboard, Guru, dan Laporan. Hasil keseluruhan ketiga modul tersebut masih perlu diverifikasi.

## 7. Contoh Skenario Pengujian

Beberapa skenario yang diterapkan dalam proyek ini:

- Memastikan halaman aplikasi berhasil ditampilkan.
- Memastikan tabel dan data pengguna tersedia.
- Memvalidasi input form yang wajib diisi.
- Menguji proses tambah, edit, dan hapus data siswa.
- Menguji validasi NIS duplikat.
- Memastikan checkbox mata pelajaran dapat dipilih.
- Menguji input dan perhitungan nilai akhir.
- Menguji filter semester.
- Memastikan fungsi pengelolaan akun berjalan sesuai kebutuhan.

## 8. Cara Menjalankan Pengujian

### A. Persyaratan

Sebelum menjalankan pengujian, pastikan sudah tersedia:

- Node.js dan npm.
- Aplikasi E-Raport yang berjalan secara lokal.
- Akun pengujian untuk Admin dan Guru.

### B. Clone Repository

```bash
git clone https://github.com/ermilaamanda102/e-raport-automation.git
cd e-raport-automation
```

### C. Instalasi Dependensi

```bash
npm install
```

Instal browser Chromium:

```bash
npx playwright install chromium
```

### D. Konfigurasi Akun Pengujian

Atur kredensial melalui PowerShell:

```powershell
$env:ADMIN_USERNAME="username_admin"
$env:ADMIN_PASSWORD="password_admin"

$env:GURU_USERNAME="username_guru"
$env:GURU_PASSWORD="password_guru"
```

Gunakan akun pengujian lokal dan jangan mengunggah password ke repository GitHub.

### E. Menjalankan Pengujian

Menjalankan seluruh test:

```bash
npx playwright test --project=chromium
```

Menjalankan pengujian modul Mata Pelajaran:

```bash
npx playwright test tests/mapel/mapel-pom.spec.js --project=chromium
```

Menjalankan pengujian dengan browser terlihat:

```bash
npx playwright test --headed --workers=1 --project=chromium
```

Pastikan aplikasi E-Raport sudah berjalan pada alamat lokal yang dikonfigurasi dalam proyek sebelum menjalankan pengujian.

## 9. Laporan Hasil Pengujian

Playwright menyediakan laporan hasil pengujian dalam format HTML.

Untuk membuka laporan:

```bash
npx playwright show-report
```

Laporan ini dapat digunakan untuk melihat status pengujian, detail test case, dan informasi pengujian yang gagal.

## 10. Repository GitHub

Source code proyek dapat diakses melalui:

https://github.com/ermilaamanda102/e-raport-automation

## 11. Tentang Pengembang

**Ermila Amanda**

Proyek ini dibuat sebagai bagian dari portofolio pembelajaran dan pengembangan keterampilan di bidang Software Quality Assurance (QA) dan Automation Testing.

**Kompetensi yang diterapkan:**
- Functional Testing
- End-to-End Testing
- Automation Testing
- Playwright
- JavaScript
- Page Object Model (POM)
- Test Case Documentation
- Jira Cloud
- Git dan GitHub
