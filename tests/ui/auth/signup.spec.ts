import { test, expect } from '@playwright/test'
import { SignupPage } from '../../../pages/ui/auth/signup.page'


test.describe('Signup form', () => {
    let signupPage: SignupPage

    test.beforeEach(async ({ page }) => {
        signupPage = new SignupPage(page)
        await signupPage.goto()
    })

    test('New customer submission', async ({ page }) => {
        await signupPage.closeCookiePopup()
        await signupPage.fillForm({
            firstname: 'Anatoly',
            lastname: 'Makeyev',
            companyName: 'CloudBeat',
            suffix: 'LLC',
            email: 'anatoly.makeyev@gmail.com',
            gameName: 'Crash Bandicoot',
            mainPlatform: 'Mobile',
            gameEngine: 'Unity',
            howDidYouHear: 'Website',
        })

        // await page.waitForTimeout(10_000)
        // await signupPage.submit()
    })
})