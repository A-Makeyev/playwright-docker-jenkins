import { Page, Locator, expect } from '@playwright/test'


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
        isGameLiveSelect: Locator
        domainNameInput: Locator
        appStoreLinkInput: Locator
        mainPlatformSelect: Locator
        gameEngineSelect: Locator
        howDidYouHearSelect: Locator
        publishersTermsCheckbox: Locator
        updatesConsentCheckbox: Locator
        privacyConsentCheckbox: Locator
        submitButton: Locator
        cookiesWindow: Locator
        rejectCookiesButton: Locator
        requiredErrorMessageText: Locator
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
            isGameLiveSelect: page.locator('//select[contains(@id, "is_your_game_live_already")]'),
            domainNameInput: page.locator('//input[contains(@id, "website_address__for_sellers")]'),
            appStoreLinkInput: page.locator('//input[contains(@id, "app_store_play_store_link")]'),
            mainPlatformSelect: page.locator('//select[contains(@id, "main_platform_on_signup")]'),
            gameEngineSelect: page.locator('//select[contains(@id, "main_game_engine_on_signup")]'),
            howDidYouHearSelect: page.locator('//select[contains(@id, "how_did_you_hear_about_us_")]'),
            publishersTermsCheckbox: page.locator('//input[contains(@id, "anzu_publishers_terms")]'),
            updatesConsentCheckbox: page.locator('//input[contains(@id, "LEGAL_CONSENT.subscription_type_")]'),
            privacyConsentCheckbox: page.locator('//input[contains(@id, "LEGAL_CONSENT.processing")]'),
            submitButton: page.locator('//input[@value="Sign up"]'),
            cookiesWindow: page.locator('#hs-eu-cookie-confirmation-inner'),
            rejectCookiesButton: page.locator('#hs-eu-decline-button'),
            requiredErrorMessageText: page.locator('//label[contains(@class, "hs-error-msg")]')
        }
    }

    async goto() {
        await this.page.goto('/sign-up')
    }

    async closeCookiePopup() {
        const popup = this.locators.cookiesWindow
        const isPopupPresent = await popup.evaluate(el => el !== null)

        if (isPopupPresent) {
            await this.page.waitForTimeout(1000)
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
        isGameLive?: string
        domainName: string
        appStoreLink: string
        gameEngine: string
        howDidYouHear: string
    }) {
        await this.locators.firstnameInput.pressSequentially(data.firstname, { delay: 50 })
        await this.locators.lastnameInput.pressSequentially(data.lastname)
        await this.locators.companyNameInput.pressSequentially(data.companyName)
        await this.locators.emailInput.pressSequentially(data.email)
        await this.locators.gameNameInput.pressSequentially(data.gameName)
        await this.locators.mainPlatformSelect.selectOption(data.mainPlatform)

        if (data.isGameLive) {
            await this.locators.isGameLiveSelect.selectOption(data.isGameLive)
        }
        
        await this.locators.domainNameInput.pressSequentially(data.domainName)
        await this.locators.gameEngineSelect.selectOption(data.gameEngine)
        await this.locators.appStoreLinkInput.pressSequentially(data.appStoreLink)

        await this.locators.suffixSelect.selectOption(data.suffix)
        await this.locators.howDidYouHearSelect.selectOption(data.howDidYouHear)

        await this.locators.publishersTermsCheckbox.check()
        await this.locators.updatesConsentCheckbox.check()
        // await this.locators.privacyConsentCheckbox.check()
    }

    async submit() {
        await this.locators.submitButton.click()
    }

    async checkSubmitError() {
        await this.locators.requiredErrorMessageText.waitFor({ state: 'visible', timeout: 10_000 })
        await expect(this.locators.requiredErrorMessageText).toBeVisible()
        await expect(this.locators.requiredErrorMessageText).toHaveText('Please complete this required field.')

        const errorColor = await this.locators.requiredErrorMessageText.evaluate((el) => window.getComputedStyle(el).color)
        await expect(errorColor).toBe('rgb(242, 84, 91)')
    }
}