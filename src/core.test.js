const core = require('src/core')

describe('core', () => {
    describe('getPageJson', () => {
        test('returns array of pages', () => {
            const json = require('test/resources/library.1.json')
            const expected = require('test/resources/expected.json')
            expect(core.getPagesJson(json)).toEqual(
                expect.arrayContaining(expected)
            )
        })
    })

    describe('getComponentPaths', () => {
        test('returns an array of paths to components on a page', () => {
            const json = require('../test/resources/accordion.infinity.json')
            const expected = ['a', 'b', 'c']
            const containerType =
                'core-components-examples/components/demo/component'
            expect(core.getComponentPaths(json, null, containerType)).toEqual(
                expect.arrayContaining(expected)
            )
        })
    })
})
