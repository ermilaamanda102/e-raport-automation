
const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../../pages/DashboardPage');

const BASE_URL = 'http://localhost/e-raport/public';

// Fungsi login berdasarkan role
async function login(page, role) {

    page.setDefaultNavigationTimeout(60000);

    let username;
    let password;
    let dashboardUrl;

    if (role === 'admin') {
        username = process.env.ADMIN_USERNAME || 'admin';
        password = process.env.ADMIN_PASSWORD || 'password';
        dashboardUrl = /\/admin\/dashboard/;
    } else {
        username = process.env.GURU_USERNAME || 'G002';
        password = process.env.GURU_PASSWORD || 'password';
        dashboardUrl = /\/guru\/dashboard/;
    }

    await page.goto(`${BASE_URL}/login`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    await page.locator('input[name="username"]').fill(username);
    await page.locator('#pw').fill(password);

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(dashboardUrl, {
        timeout: 30000
    });

    console.log(`Login ${role} berhasil: ${username}`);
}

// ==========================================
// DASHBOARD ADMIN
// ==========================================

test.describe('Automation Testing Dashboard Admin', () => {

    let dashboard;

    test.beforeEach(async ({ page }) => {
        await login(page, 'admin');

        dashboard = new DashboardPage(page);
    });

    // AT-DASH-001
    test('AT-DASH-001 - Memastikan Dashboard Admin tampil',
        async ({ page }) => {

        await dashboard.verifikasiDashboardAdmin();

        console.log('Dashboard Admin berhasil ditampilkan');
    });

    // AT-DASH-002
    test('AT-DASH-002 - Memastikan total siswa tampil',
        async () => {

        await dashboard.verifikasiStatistik('Total Siswa');

        console.log('Total siswa berhasil ditampilkan');
    });

    // AT-DASH-003
    test('AT-DASH-003 - Memastikan total guru tampil',
        async () => {

        await dashboard.verifikasiStatistik('Total Guru');

        console.log('Total guru berhasil ditampilkan');
    });

    // AT-DASH-004
    test('AT-DASH-004 - Memastikan jumlah data nilai tampil',
        async () => {

        await dashboard.verifikasiStatistik('Data Nilai');

        console.log('Jumlah data nilai berhasil ditampilkan');
    });

    // AT-DASH-005
    test('AT-DASH-005 - Memastikan jumlah siswa lulus tampil',
        async () => {

        await dashboard.verifikasiStatistik('Siswa Lulus');

        console.log('Jumlah siswa lulus berhasil ditampilkan');
    });

    // AT-DASH-006
    test('AT-DASH-006 - Memastikan tombol Tambah Siswa berfungsi',
        async ({ page }) => {

        await dashboard.bukaAksiAdmin(
            'Tambah Siswa',
            '/admin/siswa/tambah'
        );

        console.log('Tombol Tambah Siswa berhasil digunakan');
    });

    // AT-DASH-007
    test('AT-DASH-007 - Memastikan tombol Tambah Guru berfungsi',
        async ({ page }) => {

        await dashboard.bukaAksiAdmin(
            'Tambah Guru',
            '/admin/guru/tambah'
        );

        console.log('Tombol Tambah Guru berhasil digunakan');
    });

    // AT-DASH-008
    test('AT-DASH-008 - Memastikan tombol Lihat Laporan berfungsi',
        async ({ page }) => {

        await dashboard.bukaAksiAdmin(
            'Lihat Laporan',
            '/admin/laporan'
        );

        console.log('Tombol Lihat Laporan berhasil digunakan');
    });

});

// ==========================================
// DASHBOARD GURU
// ==========================================

test.describe('Automation Testing Dashboard Guru', () => {

    let dashboard;

    test.beforeEach(async ({ page }) => {
        await login(page, 'guru');

        dashboard = new DashboardPage(page);
    });

    // AT-DASH-GURU-001
    test('AT-DASH-GURU-001 - Memastikan Dashboard Guru tampil',
        async () => {

        await dashboard.verifikasiDashboardGuru();

        console.log('Dashboard Guru berhasil ditampilkan');
    });

    // AT-DASH-GURU-002
    test('AT-DASH-GURU-002 - Memastikan total siswa tampil',
        async () => {

        await dashboard.verifikasiStatistik('Total Siswa');

        console.log('Total siswa berhasil ditampilkan');
    });

    // AT-DASH-GURU-003
    test('AT-DASH-GURU-003 - Memastikan jumlah nilai diinput tampil',
        async () => {

        await dashboard.verifikasiStatistik('Nilai Diinput');

        console.log('Jumlah nilai diinput berhasil ditampilkan');
    });

    // AT-DASH-GURU-004
    test('AT-DASH-GURU-004 - Memastikan jumlah siswa lulus tampil',
        async () => {

        await dashboard.verifikasiStatistik('Siswa Lulus');

        console.log('Jumlah siswa lulus berhasil ditampilkan');
    });

    // AT-DASH-GURU-005
    test('AT-DASH-GURU-005 - Memastikan profil mengajar tampil',
        async () => {

        await dashboard.verifikasiProfilGuru();

        console.log('Profil Mengajar berhasil ditampilkan');
    });

    // AT-DASH-GURU-006
    test('AT-DASH-GURU-006 - Memastikan informasi ID Guru dan mata pelajaran tampil',
        async () => {

        await dashboard.verifikasiProfilGuru();
        await dashboard.verifikasiInformasiGuru();

        console.log('Informasi ID Guru dan mata pelajaran berhasil ditampilkan');
    });

    // AT-DASH-GURU-007
    test('AT-DASH-GURU-007 - Memastikan tombol Input Nilai Baru berfungsi',
        async () => {

        await dashboard.bukaInputNilai();

        console.log('Tombol Input Nilai Baru berhasil digunakan');
    });

    // AT-DASH-GURU-008
    test('AT-DASH-GURU-008 - Memastikan tombol Lihat Rekap Nilai berfungsi',
        async () => {

        await dashboard.bukaRekapNilai();

        console.log('Tombol Lihat Rekap Nilai berhasil digunakan');
    });

});
