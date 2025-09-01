import { APIRequestContext, expect } from '@playwright/test'
import { HomeSettingsFormData } from '../../../utils/api/types/homeSettingsForm'


export class Forms {
    constructor(
        private readonly request: APIRequestContext,
        private readonly portalId: number = 19825781,
        private readonly appVersion: string = '1.9606',
        private readonly guid: string = 'f1484f40-ad7d-404d-a404-c8d90c3edd1b',
    ) {}

    private getFormUrl(): string {
        return `/_hcms/forms/embed/v3/form/${this.portalId}/${this.guid}/json?hs_static_app=forms-embed&hs_static_app_version=${this.appVersion}&X-HubSpot-Static-App-Info=forms-embed-${this.appVersion}`
    }

    async getFormData(): Promise<HomeSettingsFormData> {
        try {
            const response = await this.request.get(this.getFormUrl())
            expect(response.ok(), `Form data request failed with status ${response.status()}: ${await response.text()}`).toBeTruthy()

            const data: HomeSettingsFormData = await response.json()
            expect(data).toHaveProperty('form.portalId')
            
            // console.log(data.form.formFieldGroups[0].fields)
            return data
        } catch (error) {
            throw new Error(`Failed to fetch form data: ${error.message}`)
        }
    }
}
