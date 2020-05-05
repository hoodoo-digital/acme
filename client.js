const core = require('./core')
const utils = require('./utils')
const path = require('path')
const mkdirp = require('mkdirp')
const log = require('debug')('acme:Pull content')
const chalk = require('chalk')

let getData,
    baseURL,
    storybookContentPath,
    componentsContainer,
    componentContent,
    assetsDir,
    policiesPath

const init = (config) => {
    getData = core.getData.bind(null, config.credentials)
    baseURL = config.baseURL
    storybookContentPath = baseURL + config.storybookContentPath
    componentsContainer = config.componentsContainer
    assetsDir = config.assetsDir
    policiesPath = config.policyPath
}

const getComponentPages = async () => {
    return getData(utils.getJsonUrl(storybookContentPath))
        .then(core.getJson)
        .then(core.getPagesJson)
}

const getComponentTemplate = async (
    componentContentUrl,
    title,
    componentLogMsg,
    componentDir
) => {
    const componentContentUrlObj = new URL(componentContentUrl)
    const extension = path.extname(componentContentUrlObj.pathname)
    log(
        `Saving template file for ${chalk.yellow.bold(
            title
        )} state of ${componentLogMsg} component`
    )
    const filename = title.replace(/\s+/g, '-') + extension
    return getData(componentContentUrl)
        .then((response) => {
            return core.writeToFile(response, `${componentDir}/${filename}`)
        })
        .catch((error) => {
            throw new Error(error)
        })
}

const getComponentTemplates = async (json) => {
    // console.log(json)
    const component = json.pointer.replace(/^\//, '')
    const componentLogMsg = chalk.green.bold(component)
    log(`Retrieving states from ${componentLogMsg} component page`)
    const componentContent = `${storybookContentPath}/${component}`
    const componentDir = `${assetsDir}/components/${component}`
    const paths = core.getComponentPaths(json.value, componentsContainer)
    // Assuming every even component is the title
    const titlePaths = paths.filter((p, ind) => ind % 2 === 0)
    const componentPaths = paths.filter((p, ind) => ind % 2 === 1)

    // console.log('Titles: ' + titlePaths)
    // console.log('Components: ' + componentPaths)
    const getAllTitles = titlePaths.map((item) => {
        const componentContentUrl = utils.getContentUrl(
            componentContent + item
        )
        return getData(componentContentUrl)
            .then(core.getHtml)
            .then(core.getTitleText)
    })

    return Promise.all(getAllTitles).then((titles) => {
        mkdirp.sync(componentDir)
        const result = []
        for (const [ind, componentPath] of componentPaths.entries()) {
            const title = titles[ind]
            const componentContentUrl = utils.getContentUrl(
                componentContent + componentPath
            )
            result.push(
                getComponentTemplate(
                    componentContentUrl,
                    title,
                    componentLogMsg,
                    componentDir
                )
            )
        }
        return result
    })
}

const getAllComponents = async () => {
    return getComponentPages()
        .then((pagesArray) => {
            const result = []
            for (const pageJson of pagesArray) {
                result.push(getComponentTemplates(pageJson))
            }
            return result
        })
        .then(Promise.all.bind(Promise))
}

const getResources = async () => {
    getData(utils.getContentUrl(componentContent))
        .then(core.getHtml)
        .then((html) => {
            const resourcePaths = core.parseHtml(html)
            resourcePaths
                .filter((p) => !/^http/.test(p))
                .forEach((resourcePath) => {
                    const targetPath =
                        assetsDir + '/public' + path.dirname(resourcePath)
                    const filename = path.basename(resourcePath)
                    // console.log(baseURL + resourcePath)
                    getData(baseURL + resourcePath).then((response) => {
                        mkdirp(targetPath).then((made) => {
                            core.writeToFile(
                                response,
                                `${targetPath}/${filename}`
                            )
                        })
                    })
                })
        })
}

const getPolicy = async (policyPath, policiesDir) => {
    const component = policyPath.replace(/^\//, '')
    log(`Retrieving policy for ${chalk.green.bold(component)} component`)
    return getData(utils.getJsonUrl(baseURL + policiesPath + policyPath)).then(
        (response) => {
            return core.writeToFile(
                response,
                policiesDir + policyPath + '.json'
            )
        }
    )
}

const getPolicies = async () => {
    return getData(utils.getJsonUrl(baseURL + policiesPath))
        .then(core.getJson)
        .then((json) => {
            // console.log(json)
            const policyPaths = core.getPolicyPaths(json)
            // console.log(paths)
            const policiesDir = assetsDir + '/policies'
            mkdirp.sync(policiesDir)

            const result = []
            for (const policyPath of policyPaths) {
                result.push(getPolicy(policyPath, policiesDir))
            }
            return result
        })
        .then(Promise.all.bind(Promise))
}

exports.getAllComponents = getAllComponents
exports.getComponentPages = getComponentPages
exports.getComponentTemplates = getComponentTemplates
exports.getResources = getResources
exports.getPolicies = getPolicies
exports.init = init
