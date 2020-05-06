const fs = require('fs')
const fsPromises = fs.promises
const cheerio = require('cheerio')
const prettier = require('prettier')

const getContentUrl = (path) => {
    return path + '.html?wcmmode=disabled'
}

const getJsonUrl = (path) => {
    return path + '.infinity.json'
}

const writeToFile = async (path, data) => {
    let fileHandle = null
    try {
        fileHandle = await fsPromises.open(path, 'w')
        await fileHandle.writeFile(data)
    } finally {
        if (fileHandle) {
            await fileHandle.close()
        }
    }
}

const tidy = (html) => {
    const $ = cheerio.load(html, {
        xmlMode: true
    })
    return prettier.format($.html(), { parser: 'html' })
}

exports.getContentUrl = getContentUrl
exports.getJsonUrl = getJsonUrl
exports.writeToFile = writeToFile
exports.tidy = tidy
