const core = require('src/core')

describe('core', () => {
    describe('getData', () => {
        const creds = 'creds'
        const baseUrl = 'base'
        test('returns response object for valid request', async () => {
            const response = await core.getData(creds, baseUrl, '/valid')
            expect(response).toEqual(expect.objectContaining({ ok: true }))
        })

        test('returns response object for multiple choice request', async () => {
            const response = await core.getData(creds, baseUrl, '/multiple')
            expect(response).toStrictEqual(
                expect.objectContaining({ ok: true })
            )
        })

        test('throws error for invalid request', async () => {
            expect.assertions(1)
            await expect(core.getData('creds', '/error')).rejects.toThrow(
                'Error'
            )
        })
    })

    describe('getPagePaths', () => {
        test('returns array of pages', () => {
            const json = require('test/resources/library.1.json')
            const expected = ['/accordion', '/breadcrumb', '/button']
            expect(core.getPagePaths(json)).toEqual(
                expect.arrayContaining(expected)
            )
        })
    })

    describe('getComponentPaths', () => {
        test('returns an array of paths to components on a page', () => {
            const json = require('test/resources/accordion.infinity.json')
            const expected = require('test/resources/expected/component-paths-array.json')
            const containerType =
                'core-components-examples/components/demo/component'
            expect(core.getComponentPaths(json, containerType)).toEqual(
                expect.arrayContaining(expected)
            )
        })
    })

    describe('getTitles', () => {
        test('returns an array of component titles', () => {
            const json = require('test/resources/accordion.infinity.json')
            const expected = require('test/resources/expected/titles-array.json')
            const resourceType = 'core/wcm/components/title/v2/title'
            const containerPath = '/jcr:content/root/responsivegrid'
            expect(
                core.getTitles(json, resourceType, containerPath, 6)
            ).toEqual(expect.arrayContaining(expected))
        })
        test('returns an array of titles for title components', () => {
            const json = require('test/resources/title.infinity.json')
            const expected = require('test/resources/expected/title-titles-array.json')
            const resourceType = 'core/wcm/components/title/v2/title'
            const containerPath = '/jcr:content/root/responsivegrid'
            expect(
                core.getTitles(json, resourceType, containerPath, 4)
            ).toEqual(expect.arrayContaining(expected))
        })
    })

    describe('getFontUrls', () => {
        test('returns urls for font files', () => {
            const css = `
            .fa,
            .fas {
            font-family: 'Font Awesome 5 Free';
            font-weight: 900; }

            @font-face {
                font-family: 'Source Code Pro';
                font-style: normal;
                font-weight: 400;
                src: url('clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.eot'); /* IE9 Compat Modes */
                src: local('Source Code Pro Regular'), local('SourceCodePro-Regular'),
                url("clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.eot?#iefix") format('embedded-opentype'), /* IE6-IE8 */
                url('clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
                url('clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.woff') format('woff'), /* Modern Browsers */
                url('clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
                url('clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.svg#SourceCodePro') format('svg'); /* Legacy iOS */
            }`
            const expected = [
                'clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.eot',
                'clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.eot',
                'clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.woff2',
                'clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.woff',
                'clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.ttf',
                'clientlib-fonts/resources/vendor/adobe-fonts/source-code-pro-v11-latin-regular.svg'
            ]
            expect(core.getFontUrls(css)).toStrictEqual(expected)
        })
    })
})
