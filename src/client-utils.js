const getArtboardUrl = (name) => {
    const artboards = require(this.filePath)
    return artboards.find((item) => (item.name === name ? item.url : ''))
}

exports.getArtboardUrl = getArtboardUrl
