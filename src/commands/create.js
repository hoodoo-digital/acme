const log = require('debug')('acme:create')
const { createStories, generatePreviewJS } = require('create')
const xd = require('xd')

const errorHandler = (err) => {
    log(err.message)

    // eslint-disable-next-line no-process-exit
    process.exit(1)
}
module.exports = {
    command: 'create',
    describe: 'Create stories from AEM content',
    builder: (yargs) => {
        return yargs
            .option('source', {
                alias: 's',
                describe: 'Path to downloaded AEM assets',
                type: 'string',
                default: 'aem-assets'
            })
            .config()
            .demandOption('config')
    },
    handler: async (argv) => {
        const start = process.hrtime()
        Promise.all([
            xd
                .init(argv.designDocUrl, argv.apiKey, argv.source)
                .catch(errorHandler),
            createStories(argv.source).catch(errorHandler),
            generatePreviewJS(argv.source).catch(errorHandler)
        ]).then(() => {
            const diff = process.hrtime(start)
            log('Took %d seconds', (diff[0] + diff[1] / 1e9).toFixed(3))
        })
    }
}
