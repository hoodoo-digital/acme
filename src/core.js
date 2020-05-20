const fetch = require('node-fetch')
// const mimeTypes = require('mime-types');
// const contentType = require('content-type');
const cheerio = require('cheerio')
const { JSONPath } = require('jsonpath-plus')
const fs = require('fs')
const css = require('css')

const getTitle = (html) => {
    const $ = cheerio.load(html)
    return $('title').text()
}

const getData = async (creds, baseUrl, path) => {
    const buffer = Buffer.from(creds)
    const encodedCreds = buffer.toString('base64')
    try {
        const response = await fetch(baseUrl + path, {
            headers: {
                Authorization: `Basic ${encodedCreds}`
            }
        })
        // Multiple Choices
        if (response.status === 300) {
            const choices = await getJson(response)
            return getData(creds, baseUrl, choices.shift())
        }
        if (!response.ok) {
            throw new Error(await getHtml(response).then(getTitle))
        }
        return response
    } catch (error) {
        // console.log(`Error accessing "${url}"`)
        throw new Error(error)
    }
}

const getHtml = async (res) => {
    return await res.text()
}

const getJson = async (res) => {
    return await res.json()
}

const writeToFile = async (res, filePath) => {
    const dest = fs.createWriteStream(filePath)
    return await res.body.pipe(dest)
}

// const parseHtmlFile = file => {
//     fs.readFile(file, (err, data) => {
//         if (err) {
//             console.error(err)
//             return
//         }
//         parseHtml(data);
//     })

// }
const getTitleText = (html) => {
    const $ = cheerio.load(html)
    return $('.cmp-title__text').text()
}

const getResourcePaths = (html) => {
    const $ = cheerio.load(html)
    const resourceTypes = [
        {
            selector: 'img',
            attr: 'src'
        },
        {
            selector: 'link',
            attr: 'href'
        },
        {
            selector: 'script',
            attr: 'src'
        }
    ]
    const resources = []
    resourceTypes.forEach((type) => {
        const sel = `${type.selector}[${type.attr}]`
        $(sel).each((ind, el) => {
            resources.push($(el).attr(type.attr))
        })
    })
    return resources
}

const getPointers = (json, path) => {
    return JSONPath({
        path: path,
        json: json,
        resultType: 'pointer'
    })
}

const getTitles = (json, resourceType, containerPath, count) => {
    // e.g. /jcr:content/root/container/container
    const path = containerPath
        .split('/')
        .map((item) => {
            return item.includes(':') ? `'${item}'` : item
        })
        .join('.')
    const query = `$.${path}[?(@['sling:resourceType'] === '${resourceType}' )].'jcr:title'`
    const result = JSONPath({
        path: query,
        json: json,
        resultType: 'value',
        wrap: false
    })
    return result && result.slice(-count)
}

const getComponentPaths = (json, containerType) => {
    // Find all sub-objects of any object with specified "containerType"
    const query = `*.[?(@["sling:resourceType"] === "${containerType}")].*@object()`
    // console.log(query)
    return getPointers(json, query)
}

const getPolicyPaths = (json) => {
    return getPointers(json, '$.*@object()')
}

// Get all child nodes of type "cq:Page"
const getPagePaths = (json) => {
    const path = '$[?(@["jcr:primaryType"] === "cq:Page")]'
    return getPointers(json, path)
}

const getFontUrls = (cssString) => {
    const cssObj = css.parse(cssString)
    const path =
        '$[?(@.type === "font-face")].declarations[?(@.property === "src")].value'
    const srcArr = JSONPath({
        path: path,
        json: cssObj.stylesheet.rules,
        resultType: 'value'
    })
    const result = []
    for (const src of srcArr) {
        const matches = src.matchAll(/url\(('|")(?<url>.*?)('|")\)/g)
        for (const match of matches) {
            // Strip any query string in url
            const cleanUrl = match.groups.url.replace(/(\?|#).*$/, '')
            result.push(cleanUrl)
        }
    }
    return result
}
exports.getData = getData
exports.writeToFile = writeToFile
exports.getComponentPaths = getComponentPaths
exports.getHtml = getHtml
exports.getJson = getJson
exports.getResourcePaths = getResourcePaths
exports.getTitleText = getTitleText
exports.getPolicyPaths = getPolicyPaths
exports.getPagePaths = getPagePaths
exports.getTitles = getTitles
exports.getFontUrls = getFontUrls
