import { test, expect } from '@playwright/test'
import { Forms } from '../../../pages/api/home/forms.page'
import { HomeSettingsFormData } from '../../../utils/api/types/homeSettingsForm'


const expectedPortalId = 19825781
const expectedGuid = 'f1484f40-ad7d-404d-a404-c8d90c3edd1b'
const expectedFields = [
    { name: 'firstname', placeholder: 'First Name', required: true },
    { name: 'lastname', placeholder: 'Last Name', required: true },
    { name: 'email', placeholder: 'Email', required: true },
]

test.describe('Home settings form data', () => {
    let forms: Forms
    let data: HomeSettingsFormData
    let fields: HomeSettingsFormData['form']['formFieldGroups'][0]['fields']

    test.beforeAll(async ({ request }) => {
      forms = new Forms(request)

      try {
        data = await forms.getFormData()
        expect(data.form.formFieldGroups[0]).toBeDefined()
        fields = data.form.formFieldGroups[0].fields
      } catch (error) {
        throw new Error(`Failed to fetch form data: ${error.message}`)
      }
  })

  test('Actual portalId & guid should match expected portalId & expected guid', async () => {
      expect(data.form.portalId).toBe(expectedPortalId)
      expect(data.form.guid).toBe(expectedGuid)
  })

  test('Form should have correct UI related text properties', async () => {
      expect(data.form.cssClass).toBe('hs-form stacked')
      expect(data.form.inlineMessage).toBe('Thanks for submitting the form.')
      expect(data.form.submitText).toBe('Submit')
  })

  test('Form should contain at least one field group', async () => {
      expect(Array.isArray(data.form.formFieldGroups)).toBe(true)
      expect(data.form.formFieldGroups.length).toBeGreaterThan(0)
  })

  test('Form should have "firstname", "lastname", and "email" fields as required with the correct placeholders', async () => {
      for (const expectedField of expectedFields) {
          const field = fields.find((f) => f.name === expectedField.name)
          
          expect(field!.required).toBe(true)
          expect(field!.placeholder).toBe(expectedField.placeholder)
          expect(field, `Field ${expectedField.name} not found`).toBeDefined()
      }
  })

  test('Form should have correct types for "firstname", "lastname", and "email" fields', async () => {
      for (const expectedField of expectedFields) {
            const field = fields.find((f) => f.name === expectedField.name)

            expect(field!.type).toBe('string')
            expect(field!.fieldType).toBe('text')
            expect(field!.propertyObjectType).toBe('CONTACT')
            expect(field, `Field ${expectedField.name} not found`).toBeDefined()
        }
    })
})