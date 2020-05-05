const getContentUrl = (path) => {
    return path + '.html?wcmmode=disabled'
}

const getJsonUrl = (path) => {
    return path + '.infinity.json'
}

exports.getContentUrl = getContentUrl
exports.getJsonUrl = getJsonUrl
