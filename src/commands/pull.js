const client = require('client')

module.exports = {
    command: 'pull',
    describe: 'Pull content from AEM',
    builder: (yargs) => {
        return yargs
            .option('destination', {
                alias: 'd',
                describe: 'Destination directory for AEM assets',
                type: 'string',
                default: 'aem-assets'
            })
            .config()
            .demandOption('config')
    },
    handler: async (argv) => {
        const username = argv.username || 'admin'
        const password = argv.password || 'admin'
        const credentials = username + ':' + password

        client.init({
            credentials: credentials,
            baseURL: argv.baseURL,
            containerPath: argv.pageContentContainerPath,
            containerType: argv.componentsContainerType,
            titleResourceType: argv.titleResourceType,
            assetsDir: argv.destination
        })
        await client.getAllComponents(argv.componentsContentPath)
        await client.getPolicies(argv.policyPath)
        await client.getResources(argv.homePage)
    }
}
