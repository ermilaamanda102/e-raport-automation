
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

    // Lokasi folder automation test
    testDir: './tests',

    // Test dijalankan satu per satu
    fullyParallel: false,

    // Mencegah test.only tertinggal saat CI
    forbidOnly: !!process.env.CI,

    // Tidak mengulang test secara otomatis
    retries: 0,

    // Menggunakan satu worker
    workers: 1,

    // Membuat laporan HTML
    reporter: 'html',

    // Konfigurasi browser
   use: {
   baseURL: 'http://localhost/e-raport/public/',

        // Browser ditampilkan
        headless: false,

        // Screenshot jika gagal
        screenshot: 'only-on-failure',

        // Video jika gagal
        video: 'retain-on-failure',

        // Trace jika gagal
        trace: 'retain-on-failure',
    },

    // Hanya menggunakan Chromium
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],

});
