import { defineConfig } from '@playwright/test';


export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    workers: '50%',
    retries: 0,
    use: {
        baseURL: 'https://www.anzu.io',
        headless: !!process.env.CI,
        viewport: null,
        trace: 'on-first-retry',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
        launchOptions: {
            args: ['--start-maximized'], 
        },
    },
    reporter: [
        ['list'],
        ['allure-playwright'],
        ['junit', { outputFile: 'test-results/results.xml' }]
    ],
    projects: [
        { name: 'Chromium', use: { browserName: 'chromium' } },
        { name: 'Firefox', use: { browserName: 'firefox' } },
        { name: 'WebKit', use: { browserName: 'webkit' } },
    ],
})


/* 
    Run commands:
    
    run all tests -> bunx playwright test
    run api sanity test -> bunx playwright test tests/api/home/sanity.spec.ts
    run ui signup test -> bunx playwright test tests/ui/auth/signup.spec.ts --project=chromium


    Open allure report

    bunx allure generate allure-results --clean -o allure-report
    bunx allure open allure-report


*/