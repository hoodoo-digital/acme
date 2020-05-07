// const argv = require('yargs').argv
const execa = require('execa')
const log = require('debug')('acme:Create stories')
const path = require('path')
const camelCase = require('camelcase')
const humanizeString = require('humanize-string')
const chalk = require('chalk')

const fs = require('fs')

const createStories = async (assetsPath) => {
    const componentsPath = path.join(assetsPath, 'components')
    // Path relative to assetsPath
    const policiesRelPath = path.sep + 'policies'
    const componentsRelPath = path.sep + 'components'
    const components = await fs.promises.readdir(componentsPath, {
        withFileTypes: true
    })

    for (const component of components) {
        if (component.isDirectory()) {
            const logMsg = chalk.green.bold(component.name)
            log(`Found ${logMsg} component`)
            const storybookTemplatePath = path.join(__dirname, '_templates')
            const execOptions = {
                env: {
                    HYGEN_TMPLS: storybookTemplatePath,
                    HYGEN_OVERWRITE: 1
                }
                // stdio: 'inherit'
            }

            try {
                log(`Creating stories file for ${logMsg}`)
                // Create stories file
                await execa(
                    'npx',
                    [
                        '--no-install',
                        'hygen',
                        'stories',
                        'new',
                        component.name,
                        '--policiesPath',
                        policiesRelPath
                    ],
                    execOptions
                )
                const templatesPath = path.join(componentsPath, component.name)
                const templatesRelPath = path.join(
                    componentsRelPath,
                    component.name
                )
                const templates = await fs.promises.readdir(templatesPath, {
                    withFileTypes: true
                })
                for (const template of templates) {
                    // Add story to stories file
                    const storyName = camelCase(
                        path.basename(template.name, '.html'),
                        { pascalCase: true }
                    )
                    const templateLogMsg = chalk.yellow.bold(
                        humanizeString(storyName)
                    )
                    log(`Adding ${templateLogMsg} story`)
                    await execa(
                        'npx',
                        [
                            '--no-install',
                            'hygen',
                            'story',
                            'new',
                            component.name,
                            '--storyName',
                            storyName,
                            '--templatePath',
                            path.join(templatesRelPath, template.name)
                        ],
                        execOptions
                    )
                }
            } catch (error) {
                console.error(error.message)
                process.exit(1)
            }
        }
    }
}

// createStories(argv.path).catch(console.error)
module.exports = createStories
