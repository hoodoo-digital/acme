const acmeFetch = async (path) => {
    // eslint-disable-next-line no-undef
    const response = await fetch(path)
    return response.text()
}
exports.acmeFetch = acmeFetch
