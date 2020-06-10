const acmeFetch = async (path) => {
    // eslint-disable-next-line no-undef
    const response = await fetch(path)
    return response.text()
}

const getArtboardUrl = (data, name) => {
    const obj = data.find((item) => (item.name === name ? item.url : ''))
    return obj && obj.url
}

exports.acmeFetch = acmeFetch
exports.getArtboardUrl = getArtboardUrl
