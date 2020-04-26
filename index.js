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

    console.log("berhasil konek ke mongodb")

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
            })
        })
    })

    //get data berdasarkan nama
    app.get('/users',(req, res) => {
        

        db.collection('users').find({name :req.query.name}).toArray()
        .then((resp) => {
            // res.send(resp)
            if(resp.length > 0){
                return res.send(resp)
            }
            res.send({errMessage : "user not found"})
    })
    })

    app.get('/findone', (req,res) => {
        let usia = parseInt(req.query.usia)

        db.collection('users').findOne({age: usia , name: req.query.nama})
        .then((resp) => {
            res.send(resp)
        })
    })

    app.get('/find',(req,res) =>{
        let age = parseInt(req.query.usia)

        

        db.collection('users').find({age}).toArray()
        .then((resp) => {

            if(resp.length > 0){
               return res.send(resp)
            }
            res.send({message : 'Not Found'})
        })
    })

    //GET ALL USERS
    app.get('/alluser', (req, res) =>{
        
        db.collection('users').find({}).toArray()
        .then((resp) => {
            res.send(resp)
        })
    })

    //DELETE BY NAME
    app.delete('/user/:name',(req,res) => {
        let name = req.params.name

        name = name[0].toUpperCase() + name.slice(1)

        db.collections('users').deleteOne({name})
        .then((resp) => {
            res.send(resp)
        })    
    })

    app.patch('/user/:name', (req,res) => {
        let name = req.params.name
        name = name[0].toUpperCase() + name.slice(1)
        let newName = req.body.newName
        

        db.collection('users').updateOne({name}, {$set : {name: newName}})
        .then((resp) => {
            res.send(resp)
        })
    })
 
 

})

app.listen(port, () => {console.log('API running at port ' + port)})