// const argv = require('yargs').argv
const log = require('debug')('acme:create')
const path = require('path')
const { titleCase } = require('title-case')
const humanize = require('humanize-string')
const chalk = require('chalk')
const fs = require('fs')

const generator = require('generator')

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

const addStory = async (componentsPath, componentName, logMsg) => {
    const componentsRelPath = path.join(path.sep, 'components')
    const templatesPath = path.join(componentsPath, componentName)
    const templatesRelPath = path.join(componentsRelPath, componentName)
    const templates = await readdir(templatesPath)
    let num = 1
    for (const template of templates) {
        const templateName = path.basename(template.name, '.html')
        // Add story to stories file
        const storyName = titleCase(humanize(templateName))
        const templateLogMsg = chalk.yellow.bold(storyName)
        log(`Adding ${templateLogMsg} story for ${logMsg} component`)
        await generator.run('story', componentName, {
            funcName: 'Example_' + num++,
            storyName: storyName,
            templatePath: path.join(templatesRelPath, template.name)
        })
    }
}

const createStories = async (assetsPath) => {
    const componentsPath = path.join(assetsPath, 'components')
    // Path relative to assetsPath
    const policiesRelPath = path.join(path.sep, 'policies')
    const components = await readdir(componentsPath)

    const generatedFiles = components
        .filter((component) => component.isDirectory())
        .map((component) => {
            const logMsg = chalk.green.bold(component.name)
            log(`Found ${logMsg} component... creating stories file`)
            // Create stories file
            return generator
                .run('stories', component.name, {
                    policiesPath: policiesRelPath
                })
                .then(() => addStory(componentsPath, component.name, logMsg))
        })
    return Promise.all(generatedFiles)
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
