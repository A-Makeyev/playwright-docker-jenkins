import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
    testDir: './tests',
    outputDir: 'test-results/',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    timeout: 30_000,
    expect: {
        timeout: 10_000
    },

    use: {
        baseURL: 'https://www.anzu.io',
        headless: !!process.env.CI,
        viewport: null,
        trace: 'on-first-retry',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },

    reporter: [
        ['list'],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['allure-playwright', { outputFolder: 'allure-results' }],
    ],
    
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
})
