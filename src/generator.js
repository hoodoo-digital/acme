// For node environments < v11.6
require('core-js/features/array/flat-map')

const execa = require('execa')
const path = require('path')

const execOptions = {
    env: {
        HYGEN_TMPLS: path.join(__dirname, '_templates'),
        HYGEN_OVERWRITE: 1
    }
    // stdio: 'inherit'
}

const run = async (template, name, options) => {
    let args = ['--no-install', 'hygen', template, 'new', name]

    if (options) {
        const templateVars = Object.entries(options).flatMap((item) => {
            item[0] = '--' + item[0]
            return item
        })
        args = args.concat(templateVars)
    }
    await execa('npx', args, execOptions)
}

exports.run = run
