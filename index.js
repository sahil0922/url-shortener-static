const express = require('express');
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config()

console.log(process.env.PORT)

// local connect
// const mongoDBConnectionURL = "mongodb://0.0.0.0:27017/urlShortener"
// mongoose.connect(mongoDBConnectionURL, (err) => {
//     if(err){
//         console.log(err)
//     }else{
//         console.log("yes conneced")
//     }
// })

const mongodbConnect = process.env.MONGODB_URL
const connectToDB = async() =>{
    await mongoose.connect(mongodbConnect , { 
        useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 
    }, (err) => {
        if(err){
            console.log(err)
        }else{
            console.log("Database conneced Successfully")
        }
    })
} 

connectToDB()


const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls: shortUrls})
})

app.post('/shortUrl', async (req, res) => {
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl})
    if(shortUrl === null) return res.sendStatus(404)

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000)