const log = require('debug')('acme:create')
const { createStories, generatePreviewJS } = require('create')

const errorHandler = (err) => {
    log(err.message)

    // eslint-disable-next-line no-process-exit
    process.exit(1)
}
module.exports = {
    command: 'create',
    describe: 'Create stories from AEM content',
    builder: {
        source: {
            alias: 's',
            describe: 'Path to downloaded AEM assets',
            type: 'string',
            default: 'aem-assets'
        }
    },
    handler: async (argv) => {
        const start = process.hrtime()
        Promise.all([
            createStories(argv.source).catch(errorHandler),
            generatePreviewJS(argv.source).catch(errorHandler)
        ]).then(() => {
            const diff = process.hrtime(start)
            log('Took %d seconds', (diff[0] + diff[1] / 1e9).toFixed(3))
        })
    }
}
