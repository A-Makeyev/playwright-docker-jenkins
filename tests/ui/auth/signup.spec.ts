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
            isGameLive: 'Yes',
            gameEngine: 'Unity',
            domainName: 'https://CrashBandicoot.com',
            appStoreLink: 'https://play.google.com/store/apps/details?id=com.ninjabaseballarcade.mameclassic&pcampaignid=web_share',
            howDidYouHear: 'Website'
        })

        await signupPage.submit()
        await signupPage.checkSubmitError()
    })
})