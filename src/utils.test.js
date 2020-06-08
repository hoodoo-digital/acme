const fs = require('fs')
const utils = require('src/utils')

// eslint-disable-next-line jest/no-disabled-tests
test.skip('returns formatted html', () => {
    const options = {
        encoding: 'utf-8',
        flag: 'r'
    }
    const actual = fs.readFileSync('test/resources/unformatted.html', options)
    const expected = fs.readFileSync('test/resources/formatted.html', options)

    expect(utils.tidy(actual)).toBe(expected)
})

describe('buildFilenameFromUrl', () => {
    test('return path for url with no extension', () => {
        expect(
            utils.buildFilename('text/css', 'http://somedomain.com/css')
        ).toBe('somedomain.com-css.css')
    })

    test('return path for url with extension', () => {
        expect(
            utils.buildFilename('text/html', 'http://somedomain.com/index.html')
        ).toBe('somedomain.com-index.html')
    })

    test('return path for url with extension irrespective of content-type', () => {
        expect(
            utils.buildFilename(null, 'http://somedomain.com/index.html')
        ).toBe('somedomain.com-index.html')
    })
})
