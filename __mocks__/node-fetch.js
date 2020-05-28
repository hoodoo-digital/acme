const responseMap = {
    '/error': {
        ok: false,
        text: () => Promise.resolve('<title>Error</title>')
    },
    '/valid': {
        status: 200,
        ok: true
    },
    '/multiple': {
        status: 300,
        json: () => Promise.resolve(['/valid'])
    }
}

const fetch = (url, options) => {
    // Strip leading "baseUrl" string
    const path = url.replace(/\w+/, '')
    return Promise.resolve(responseMap[path])
}

module.exports = fetch
