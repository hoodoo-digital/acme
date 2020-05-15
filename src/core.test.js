const core = require('src/core')

describe('core', () => {
    describe('getData', () => {
        test('returns response object for valid request', async () => {
            const response = await core.getData('creds', 'valid')
            expect(response).toEqual(expect.objectContaining({ ok: true }))
        })

        test('returns response object for multiple choice request', async () => {
            const response = await core.getData('creds', 'multiple')
            expect(response).toStrictEqual(
                expect.objectContaining({ ok: true })
            )
        })

        test('throws error for invalid request', async () => {
            expect.assertions(1)
            await expect(core.getData('creds', 'error')).rejects.toThrow(
                'Error'
            )
        })
    })

    describe('getPageJson', () => {
        test('returns array of pages', () => {
            const json = require('test/resources/library.1.json')
            const expected = require('test/resources/expected/pages-json-array.json')
            expect(core.getPagesJson(json)).toEqual(
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
})
