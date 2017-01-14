const express = require('express'),
    mongo = require('mongodb').MongoClient,
    app = express()

mongo.connect (process.env.MONGO_URI, (err, db) => {
    if (err) throw err
    console.log ('connected to database successfuly')
    app.locals.db = db
})
app.use('/', express.static('public'))

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
})
module.exports = app