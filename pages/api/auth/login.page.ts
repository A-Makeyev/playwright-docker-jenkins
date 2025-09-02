import { APIRequestContext } from '@playwright/test'


export class Login {
  private readonly authURL = process.env.AUTH_URL || 'https://anzu.com'
  private readonly wrongUsername = process.env.AUTH_WRONG_USERNAME || 'SomeUsername'
  private readonly wrongPassword = process.env.AUTH_WRONG_PASSWORD || 'SomePassword'

  constructor(private readonly request: APIRequestContext) {}

  async loginWithWrongCredentials() {
        try {
            const response = await this.request.post(this.authURL, {
                headers: { 'content-type': 'application/json' },
                data: {
                    payload: [this.wrongUsername, this.wrongPassword]
                }
            })
            
            return await response.json()
        } catch (error: any) {
            throw new Error(`Failed to fetch login data: ${error.message}`)
        }
    }
}
