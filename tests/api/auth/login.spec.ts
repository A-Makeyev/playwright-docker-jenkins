import { test, expect } from '@playwright/test'
import { Login } from '../../../pages/api/auth/login.page'


test.describe('Authentication Test', () => {
    let login: Login 

    test('Login with wrong credentials should return 401', async ({ request }) => {
        login = new Login(request) 
        const response = await login.loginWithWrongCredentials()

        expect(response.code).toBe(401)
        expect(response.name).toBe('NotAuthenticated')
        expect(response.className).toBe('not-authenticated')
        expect(response.message).toContain('Invalid authentication information')
        console.log(response)
    })

    test('Login with wrong credentials response time should take less than 5 seconds', async ({ request }) => {
        const login = new Login(request)
        const start = Date.now()

        await login.loginWithWrongCredentials()
        const duration = Date.now() - start
        
        expect(duration).toBeLessThan(5000)
        console.log('Login duration: ' + duration + ' ms')
    })
})
