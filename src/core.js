const fetch = require('node-fetch')
// const mimeTypes = require('mime-types');
// const contentType = require('content-type');
const cheerio = require('cheerio')
const { JSONPath } = require('jsonpath-plus')
const util = require('util')
const stream = require('stream')
const streamPipeline = util.promisify(stream.pipeline)
const fs = require('fs')

const getTitle = (html) => {
    const $ = cheerio.load(html)
    return $('title').text()
}

const getData = async (creds, url) => {
    const buffer = Buffer.from(creds)
    const encodedCreds = buffer.toString('base64')
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Basic ${encodedCreds}`
            }
        })
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
    return streamPipeline(res.body, fs.createWriteStream('./' + filePath))
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

const parseHtml = (html) => {
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

const queryJson = (json, path) => {
    return JSONPath({
        path: path,
        json: json,
        resultType: 'pointer',
        wrap: false
    })
}

const getComponentPaths = (json, containerPath, containerType) => {
    // Find all sub-objects of any object with specified "containerType"
    const query = `*.[?(@["sling:resourceType"] === "${containerType}")].*@object()`
    // console.log(query)
    return queryJson(json, query)
}

const getPolicyPaths = (json) => {
    return queryJson(json, '$.*@object()')
}

// Get all child nodes of type "cq:Page"
const getPagesJson = (json) => {
    const path = '$[?(@["jcr:primaryType"] === "cq:Page")]'
    const result = JSONPath({
        path: path,
        json: json,
        resultType: 'all',
        wrap: false
    })

    // Return only 'pointer' and 'value' keys
    return result.map((item) => {
        return Object.keys(item)
            .filter((key) => ['pointer', 'value'].includes(key))
            .reduce((obj, key) => {
                obj[key] = item[key]
                return obj
            }, {})
    })
}

exports.getData = getData
exports.writeToFile = writeToFile
exports.getComponentPaths = getComponentPaths
exports.getHtml = getHtml
exports.getJson = getJson
exports.parseHtml = parseHtml
exports.getTitleText = getTitleText
exports.getPolicyPaths = getPolicyPaths
exports.getPagesJson = getPagesJson
