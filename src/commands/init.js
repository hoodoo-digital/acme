const prompts = require('prompts')
const log = require('debug')('acme:init')
const os = require('os')
const xml2js = require('xml2js')
const fsPromises = require('fs').promises

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
        name: 'policyPath',
        message: 'What is the path to the component policies?',
        initial: async () => {
            return fsPromises
                .readFile('pom.xml')
                .then(
                    (data) => {
                        return xml2js
                            .parseStringPromise(data)
                            .then((obj) => obj.project.parent[0].artifactId[0])
                    },
                    (err) => {
                        log(
                            `Could not find ${err.path}... you will have to manually enter the policy path.`
                        )
                        return '<your-site>'
                    }
                )
                .then(
                    (siteName) =>
                        `/conf/${siteName}/settings/wcm/policies/${siteName}/components`
                )
        }
    }
]

const defaults = {
    componentsContentPath: '/content/core-components-examples/library',
    pageContentContainerPath: '/jcr:content/root/responsivegrid',
    componentsContainerType:
        'core-components-examples/components/demo/component',
    titleResourceType: 'core/wcm/components/title/v2/title'
}

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
        const onSubmit = (prompt, answer) => {
            if (prompt.name === 'site') {
                log()
            }
        }
        const response = await prompts(questions, { onSubmit })
        const settings = Object.assign(response, defaults)
        writeToFile(argv.file, JSON.stringify(settings, null, 4) + os.EOL)
        log(`Generated "${argv.file}"`)
    }
}
