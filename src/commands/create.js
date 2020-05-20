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
        await createStories(argv.source).catch(errorHandler)
        await generatePreviewJS(argv.source).catch(errorHandler)
    }
}
