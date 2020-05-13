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
            storybookContentPath: argv.storybookContentPath,
            containerType: argv.componentsContainerType,
            assetsDir: argv.destination,
            policyPath: argv.policyPath
        })
        client.getAllComponents()
        client.getPolicies()
        client.getResources()
    }
}
