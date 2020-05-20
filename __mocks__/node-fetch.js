const responseMap = {
    error: {
        ok: false,
        text: () => {
            return new Promise((resolve, reject) => {
                const errorHtml = '<title>Error</title>'
                resolve(errorHtml)
            })
        }
    },
    valid: {
        status: 200,
        ok: true
    },
    multiple: {
        status: 300,
        json: () => {
            return new Promise((resolve, reject) => {
                resolve(['valid'])
            })
        }
    }
}

const fetch = (url, options) => {
    return new Promise((resolve, reject) => {
        resolve(responseMap[url])
    })
}

module.exports = fetch
