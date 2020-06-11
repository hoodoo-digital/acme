// For node environments < v11.6
require('core-js/features/array/flat-map')

const { runner } = require('hygen')
const Logger = require('hygen/lib/logger')
const path = require('path')
const defaultTemplates = path.join(__dirname, '_templates')
const log = require('debug')('acme-debug:generator')

const noop = () => {}

// process.env.HYGEN_OVERWRITE = 1

const run = async (template, name, options) => {
    let args = [template, 'new', name]

    if (options) {
        const templateVars = Object.entries(options).flatMap((item) => {
            item[0] = '--' + item[0]
            return item
        })
        args = args.concat(templateVars)
    }

    // See https://github.com/jondot/hygen#build-your-own
    await runner(args, {
        templates: defaultTemplates,
        cwd: process.cwd(),
        logger: new Logger(log),
        createPrompter: noop,
        exec: noop,
        debug: !!process.env.DEBUG
    })
}

exports.run = run
