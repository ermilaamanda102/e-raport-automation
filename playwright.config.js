
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // Lokasi folder automation test
  testDir: './tests',

  // Menjalankan test secara paralel
  fullyParallel: true,

  // Mencegah test.only tertinggal saat CI
  forbidOnly: !!process.env.CI,

  // Mengulang test jika gagal saat CI
  retries: process.env.CI ? 2 : 0,

  // Jumlah worker
  workers: process.env.CI ? 1 : undefined,

  // Membuat laporan HTML
  reporter: 'html',

  // Konfigurasi browser
  use: {
    baseURL: 'http://localhost:8080',

    // Browser ditampilkan saat test berjalan
    headless: false,

    // Mengambil trace jika test gagal dan diulang
    trace: 'on-first-retry',

    // Mengambil screenshot jika test gagal
    screenshot: 'only-on-failure',

    // Merekam video jika test gagal
    video: 'retain-on-failure',
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
