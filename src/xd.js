const fetch = require('node-fetch')
const path = require('path')

const baseUrl = 'https://xdce.adobe.io'

const init = async (designDocUrl, apiKey, dest) => {
    if (!designDocUrl || !apiKey) {
        throw Error(
            'The XD design document URL and/or XD api key not specified... skipping artboard file creation.'
        )
    }
    this.designDocUrl = designDocUrl
    this.apiKey = apiKey
    const artboards = await getDesigns()
    this.filePath = path.format({
        dir: dest,
        name: 'artboards',
        ext: '.json'
    })
    const { writeToFile } = require('./utils')
    return writeToFile(this.filePath, JSON.stringify(artboards))
}

const getDocumentApiPath = async () => {
    const discoveryPath = '/v2/api'
    const response = await fetch(baseUrl + discoveryPath, {
        method: 'OPTIONS',
        headers: {
            'x-api-key': this.apiKey,
            'x-adobexd-link': this.designDocUrl
        }
    })

    const link = response.headers.get('link')
    return link.replace(/<(.*)>.*/, (m, p) => p)
}

const getDocument = async (path) => {
    const response = await fetch(baseUrl + path, {
        method: 'GET',
        headers: {
            'x-api-key': this.apiKey
        }
    })

    return response.json()
}

const getArtboards = (data) => {
    return data.artboards.map((item) => {
        return {
            name: item.name,
            url: `${this.designDocUrl}/screen/${item.id}/${item.name.replace(
                /\s/g,
                ''
            )}`
        }
    })
}

const getDesigns = async () => {
    return getDocumentApiPath().then(getDocument).then(getArtboards)
}

exports.init = init
exports.getDesigns = getDesigns
