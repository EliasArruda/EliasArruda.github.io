import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    fullyParallel: false,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:4173',
        browserName: 'chromium',
        locale: 'pt-BR',
        viewport: { width: 1440, height: 1000 },
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
            ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
            : {},
    },
    webServer: {
        command: 'pnpm run preview --host 127.0.0.1',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
    },
});
