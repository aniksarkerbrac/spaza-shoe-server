const express = require('express')
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhyhe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const shoeCollection = client.db("spazaShoe").collection("shoes");
    const orderCollection = client.db("spazaShoe").collection("orders");

    //post one data in database
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        shoeCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.acknowledged);
            })
    })
    // add order details in database
    app.post('/addOrder',(req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
        .then(result => {
            res.send(result.acknowledged);
        })
    })

    //retrive all data from database
    app.get('/products', (req, res) => {
        shoeCollection.find({})
            .toArray((err, shoes) => {
                res.send(shoes);
            })
    })

    //retrive one data using _id
    app.get('/product/:id', (req, res) => {
        const id = req.params.id;
        shoeCollection.find({ _id: ObjectId(id)})
        .toArray((err, shoes) => {
            res.send(shoes);
        })
    })

    //delete one data from database
    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id;
        shoeCollection.deleteOne({ _id: ObjectId(id) })
            .then(result => {
                res.send(result.deletedCount>0);
            })
    })
    // find all order specified by user email
    app.post('/findByEmail', (req, res) => {
        const emailId = req.body.email;
        orderCollection.find({email: emailId})
        .toArray((err, orders)=>{
            res.send(orders)
        })
    })

});


app.get('/', (req, res) => {
    res.send('Hello spaza shoe')
})

app.listen(port);