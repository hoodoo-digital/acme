const prompts = require('prompts')
const log = require('debug')('acme:init')

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
        name: 'storybookContentPath',
        message: 'What is the content path to the Storybook sample content?',
        initial: '/content/<my-site>/storybook-sample-content'
    },
    {
        type: 'text',
        name: 'componentsContainer',
        message:
            'What is the JCR path to the component variations on each page?',
        initial: 'jcr:content/root/container'
    },
    {
        type: 'text',
        name: 'policyPath',
        message: 'What is the path to the component policies?',
        initial: '/conf/<my-site>/settings/wcm/policies/<my-site>/components'
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
        writeToFile(argv.file, JSON.stringify(response, null, 4))
        log(`Generated "${argv.file}"`)
    }
}
