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
    handler: (argv) => {
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
        client.getAllComponents(argv.componentsContentPath)
        client.getPolicies(argv.policyPath)
        client.getResources(argv.homePage)
    }
}
