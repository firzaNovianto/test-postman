const express = require('express')
const app = express()
const port = 2021

app.use(express.json())
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const URL = 'mongodb://127.0.0.1:27017'
const database = 'api-mongo'

MongoClient.connect(URL, {useNewUrlParser : true, useUnifiedTopology : true}, (err,client) => {
    if(err){
        return console.log('gagal konek')

    }

    const db = client.db(database)

    app.get('/',(req,res) => {
        res.send(
            '<h1>welcome </h1>'
        )
    })

    app.post('/users',(req, res) => {
        const {name, age} = req.body

        db.collection("users").insertOne({name,age})
        .then((resp) => {
            res.send({
                idNewUser : resp.insertedId,
                dataUser : resp.ops[0]
            }   
            )
        })
        })
 

})

app.listen(port, () => {console.log('API running at port ' + port)})