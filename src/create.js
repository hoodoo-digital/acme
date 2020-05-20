// const argv = require('yargs').argv
const log = require('debug')('acme:Create stories')
const path = require('path')
const camelCase = require('camelcase')
const humanizeString = require('humanize-string')
const chalk = require('chalk')

const generator = require('generator')

const fs = require('fs')

const errorHandler = (err) => {
    if (err.code === 'ENOENT') {
        throw new Error(`Could not find ${chalk.red(err.path)} directory`)
    }
    throw err
}

const readdir = async (path) => {
    return await fs.promises
        .readdir(path, {
            withFileTypes: true
        })
        .catch(errorHandler)
}

const createStories = async (assetsPath) => {
    const componentsPath = path.join(assetsPath, 'components')
    // Path relative to assetsPath
    const policiesRelPath = path.join(path.sep, 'policies')
    const componentsRelPath = path.join(path.sep, 'components')
    const components = await readdir(componentsPath)

    for (const component of components) {
        if (component.isDirectory()) {
            const logMsg = chalk.green.bold(component.name)
            log(`Found ${logMsg} component`)

            log(`Creating stories file for ${logMsg}`)
            // Create stories file
            await generator.run('stories', component.name, {
                policiesPath: policiesRelPath
            })
            const templatesPath = path.join(componentsPath, component.name)
            const templatesRelPath = path.join(
                componentsRelPath,
                component.name
            )
            const templates = await readdir(templatesPath)
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
                await generator.run('story', component.name, {
                    storyName: storyName,
                    templatePath: path.join(templatesRelPath, template.name)
                })
            }
        }
    }
}

const generatePreviewJS = async (assetsPath) => {
    const resourcesPath = path.join(assetsPath, 'resources')
    const resources = await readdir(resourcesPath)
    const resourcesRelPath = resources.map((resource) => {
        return path.join('..', assetsPath, 'resources', resource.name)
    })

    log('Generating preview.js file')
    await generator.run('preview', null, {
        resourceList: resourcesRelPath.join()
    })
}

// createStories(argv.path).catch(console.error)
exports.createStories = createStories
exports.generatePreviewJS = generatePreviewJS
