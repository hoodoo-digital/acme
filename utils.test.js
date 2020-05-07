const utils = require('./utils')

test('returns formatted html', () => {
    const actual = `
    <div>
<span>Some HTML here</span>
  </div>
    `
    const expected = `<div>
  <span>Some HTML here</span>
</div>
`

    expect(utils.tidy(actual)).toBe(expected)
})
