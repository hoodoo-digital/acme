const acmeFetch = async (path) => {
    // eslint-disable-next-line no-undef
    const response = await fetch(path)
    return response.text()
}

/**
 * Retrieves the url for a given artboard
 *
 * @param {Array} data - Array of artboard objects
 * @param {String} name - Name of artboard
 * @returns {String} - Url of requested artboard; empty if artboard is not in the list or data is undefined/null
 */
const getArtboardUrl = (data, name) => {
    if (!data) {
        return ''
    }
    return data.find((item) => (item.name === name ? item.url : ''))
}

exports.acmeFetch = acmeFetch
exports.getArtboardUrl = getArtboardUrl
