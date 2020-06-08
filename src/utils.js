const fs = require('fs')
const fsPromises = fs.promises
const prettier = require('prettier')
const mime = require('mime-types')
const path = require('path')

const getHtmlPath = (path) => {
    return path + '.html?wcmmode=disabled'
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

const isExternalUrl = (path) => /^http/.test(path)

const buildFilenameFromUrl = (contentType, resourcePath) => {
    const extension = mime.extension(contentType)
    const { hostname, pathname } = new URL(resourcePath)
    const extname = path.extname(pathname)
    const name = `${hostname}${pathname.replace('/', '-')}`
    return path.format({
        ext: extname ? '' : `.${extension}`,
        name: name
    })
}

exports.getHtmlPath = getHtmlPath
exports.getJsonPath = getJsonPath
exports.writeToFile = writeToFile
exports.tidy = tidy
exports.isExternalUrl = isExternalUrl
exports.buildFilename = buildFilenameFromUrl
