const app = require ('./app'),
      isUrl = require ('is-url'),
      shortId = require ('shortid')

app.get ('/hello', (req, res) => {
    res.end ('Hello!')
})

app.get(/^\/new\/(.+)/, (req, res) => {
    let href = req.params[0] 
    if (isUrl(href)) {
        let newUrl
        insertNewUrl (href, (newUrl) => {
            
            console.log (newUrl)
            res.send (newUrl)
        })
    } else {
        res.status (500).send ('please provide a valid url')
    }
})

app.get ('/:shortUrl', (req, res) => {
    urlRedirect (req.params.shortUrl, (originalUrl) => {
        if (!originalUrl) {
            res.status (500).end ('short url was not found in database.')
        } else {
            res.redirect (originalUrl)
        } 
    })
})

const insertNewUrl = (url, callback) => {
//    let newUrl = {}
    const db = app.locals.db
    db.collection('shorts').find ({long: url}, {_id:0, short:1, long:1}).toArray ((err, res) => {
        if (err) throw err
//        console.log (res.ops[0])

        if (res.length == 0) {
            let newUrl = {
                short: shortId.generate(),
                long: url
            }
            db.collection('shorts').insertOne (Object.assign({}, newUrl), (err, res) => {
                if (err) throw err
                callback(newUrl)
            })

        } else {
            callback(res[0])
        }
    })
}

const urlRedirect = (shortUrl, callback) => {
    const db = app.locals.db
    db.collection('shorts')
        .find ({short: shortUrl})
        .toArray ((err, res) => {
        if (err) throw err
        if (res.length == 0) {
            callback (null)
        } else {
            callback (res[0].long)
        }
    })
}