const fs = require('fs')
const fsPromises = fs.promises
const prettier = require('prettier')

const getHtmlPath = (path) => {
    return path + '.html?wcmmode=disable'
}

const getJsonPath = (path) => {
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
    return prettier.format(html, { parser: 'html' })
}

exports.getHtmlPath = getHtmlPath
exports.getJsonPath = getJsonPath
exports.writeToFile = writeToFile
exports.tidy = tidy
