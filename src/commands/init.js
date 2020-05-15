const prompts = require('prompts')
const log = require('debug')('acme:init')
const os = require('os')

const { writeToFile } = require('utils')

const questions = [
    {
        type: 'text',
        name: 'username',
        message: 'What is your AEM username?',
        initial: 'admin'
    },
    {
        type: 'text',
        name: 'password',
        message: 'What is your AEM password?',
        initial: 'admin'
    },
    {
        type: 'text',
        name: 'baseURL',
        message: 'What is the base URL of your AEM instance?',
        initial: 'http://localhost:4502'
    },
    {
        type: 'text',
        name: 'componentsContentPath',
        message: 'What is the content path to the Storybook sample content?',
        initial: '/content/core-components-examples/library'
    },
    {
        type: 'text',
        name: 'pageContentContainerPath',
        message: 'What is the path to the page content container?',
        initial: '/jcr:content/root/responsivegrid'
    },
    {
        type: 'text',
        name: 'componentsContainerType',
        message: 'What is the Sling Resource Type for the component container?',
        initial: 'core-components-examples/components/demo/component'
    },
    {
        type: 'text',
        name: 'titleResourceType',
        message: 'What is the Sling Resource Type for the title component?',
        initial: 'core/wcm/components/title/v2/title'
    },
    {
        type: 'text',
        name: 'policyPath',
        message: 'What is the path to the component policies?',
        initial:
            '/conf/core-components-examples/settings/wcm/policies/core-components-examples/components'
    }
]

module.exports = {
    command: 'init [file]',
    describe: 'Generate the configuration file',
    builder: (yargs) => {
        yargs.positional('file', {
            describe: 'Configuration file path',
            type: 'string',
            default: 'acme.settings.json'
        })
    },
    handler: async (argv) => {
        const response = await prompts(questions)
        writeToFile(argv.file, JSON.stringify(response, null, 4) + os.EOL)
        log(`Generated "${argv.file}"`)
    }
}
