export interface HomeSettingsFormData {
    form: {
        portalId: number
        guid: string
        cssClass: string
        inlineMessage: string
        submitText: string
        formFieldGroups: Array<{
            fields: Array<{
                name: string
                required: boolean
                placeholder: string
                type: string
                fieldType: string
                propertyObjectType: string
            }>
        }>
    }
}