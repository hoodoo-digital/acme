const fs = require('fs')
const utils = require('./utils')

test('returns formatted html', () => {
    const options = {
        encoding: 'utf-8',
        flag: 'r'
    }
    const actual = fs.readFileSync('test/resources/unformatted.html', options)
    const expected = fs.readFileSync('test/resources/formatted.html', options)

    expect(utils.tidy(actual)).toBe(expected)
})
