const express = require ('express'),
      mongo = require ('mongodb').MongoClient,
      app = express (),
      urlRegExp = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

mongo.connect (process.env.MONGO_URI, (err, db) => {
    if (err) throw err
    console.log ('connected to database successfuly')
    db.collection ('shorts').createIndex ({long: 1}, (err, res) => {
        console.log (res)
    })
})
app.use ('/', express.static('public'))
app.get ('/:h', (req, res) => {

    //match url (number:url)
    let urlNum = parseInt (req.params.h),
        match = req.params.h.match (urlRegExp)
        url = (match)? match[0] : null
//    console.log (url)
    if (urlNum) {
        //find in database
    mongo.connect (process.env.MONGO_URI, (err, db) => {
        if (err) throw err
        console.log ('connected to database successfuly')
        db.collection ('shorts').find({_id: urlNum}).toArray((err, url) => {
            console.log (url)

            if (err) throw err
            res.redirect ('http://' + 'google.com')
        })
        db.close ()
    })
        
    }
    else if (url) {
//            console.log ('url')

        mongo.connect (process.env.MONGO_URI, (err, db) => {
            if (err) throw err
            console.log ('connected to database successfuly')
            db.collection ('shorts').find ({long: url}).toArray((err, r) => {
                if (err) throw err
                if (r.length == 0) {
                    console.log ('inserting new url')
                    db.collection ('shorts').insert ({long: url}, (err, url) => {
                        if (err) throw err
                        console.log (url)
                        res.json ({
                            original: url.ops[0].long,
                            short: url.ops[0]._id
                        })
                    })
                } else {
                    console.log (r)
                    res.json ({
                            original: r.long,
                            short: r._id
                        })
                    res.end()
                }
                db.close ()
            })
        })
    }
    else {
        res.status(500).send({ error: 'Either the original url provided was invalid, or the short url was not found.' });
    }
})


app.listen (process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
})