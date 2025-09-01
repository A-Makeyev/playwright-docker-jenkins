import { Page, Locator } from '@playwright/test'


export class SignupPage {
    readonly page: Page
    readonly locators: {
        form: Locator
        firstnameInput: Locator
        lastnameInput: Locator
        companyNameInput: Locator
        suffixSelect: Locator
        emailInput: Locator
        gameNameInput: Locator
        mainPlatformSelect: Locator
        gameEngineSelect: Locator
        howDidYouHearSelect: Locator
        publishersTermsCheckbox: Locator
        updatesConsentCheckbox: Locator
        privacyConsentCheckbox: Locator
        submitButton: Locator
        cookiesWindow: Locator
        rejectCookiesButton: Locator
    }

    constructor(page: Page) {
        this.page = page
        this.locators = {
            form: page.locator('form[class*="hs-form stacked"]'),
            firstnameInput: page.locator('//input[contains(@id, "firstname")]'),
            lastnameInput: page.locator('//input[contains(@id, "lastname")]'),
            companyNameInput: page.locator('//input[contains(@id, "0-2/name")]'),
            suffixSelect: page.locator('//select[contains(@id, "0-2/suffix")]'),
            emailInput: page.locator('//input[contains(@id, "email")]'),
            gameNameInput: page.locator('//input[contains(@id, "game_name")]'),
            mainPlatformSelect: page.locator('//select[contains(@id, "main_platform_on_signup")]'),
            gameEngineSelect: page.locator('//select[contains(@id, "main_game_engine_on_signup")]'),
            howDidYouHearSelect: page.locator('//select[contains(@id, "how_did_you_hear_about_us_")]'),
            publishersTermsCheckbox: page.locator('//input[contains(@id, "anzu_publishers_terms")]'),
            updatesConsentCheckbox: page.locator('//input[contains(@id, "LEGAL_CONSENT.subscription_type_")]'),
            privacyConsentCheckbox: page.locator('//input[contains(@id, "LEGAL_CONSENT.processing")]'),
            submitButton: page.locator('//input[@value="Sign up"]'),
            cookiesWindow: page.locator('#hs-eu-cookie-confirmation-inner'),
            rejectCookiesButton: page.locator('#hs-eu-decline-button')
        }
    }

    async goto() {
        await this.page.goto('/sign-up')
    }

    async closeCookiePopup() {
        const popup = this.locators.cookiesWindow
        const isPopupPresent = await popup.evaluate(el => el !== null)

        if (isPopupPresent) {
            await this.locators.rejectCookiesButton.click()
            await Promise.race([
                this.locators.cookiesWindow.waitFor({ state: 'hidden', timeout: 5000 }),
                new Promise(resolve => setTimeout(resolve, 5000))
            ]).catch(() => console.warn('Cookie popup did not disappear within 5 seconds'))
        }
    }

    async fillForm(data: {
        firstname: string
        lastname: string
        companyName: string
        suffix: string
        email: string
        gameName: string
        mainPlatform: string
        gameEngine: string
        howDidYouHear?: string
    }) {
        await this.locators.firstnameInput.pressSequentially(data.firstname)
        await this.locators.lastnameInput.pressSequentially(data.lastname)
        await this.locators.companyNameInput.pressSequentially(data.companyName)
        await this.locators.emailInput.pressSequentially(data.email, { delay: 50 })
        await this.locators.gameNameInput.pressSequentially(data.gameName)
        await this.locators.mainPlatformSelect.selectOption(data.mainPlatform)
        await this.locators.gameEngineSelect.selectOption(data.gameEngine)
        await this.locators.suffixSelect.selectOption(data.suffix)

        if (data.howDidYouHear) {
            await this.locators.howDidYouHearSelect.selectOption(data.howDidYouHear)
        }

        await this.locators.publishersTermsCheckbox.check()
        await this.locators.privacyConsentCheckbox.check()
        await this.locators.updatesConsentCheckbox.check()
    }

    async submit() {
        await this.locators.submitButton.click()
    }
}