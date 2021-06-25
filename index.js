const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID =  require('mongodb').ObjectID;
require('dotenv').config()

const port = process.env.PORT || 4000

app.use(cors());
app.use(bodyParser.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.plb4i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("fresh-valley").collection("products");
    const ordersCollection = client.db("fresh-valley").collection("orders");

    app.get('/products',(req,res) => {
        productsCollection.find()
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    app.get('/product/:id',(req,res) => {
        productsCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err,documents) => {
            res.send(documents[0])
        })
    })

    app.post('/addOrder',(req,res) => {
        const productsOrder = req.body;
        ordersCollection.insertOne(productsOrder)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/orders',(req,res) => {
        const queryEmail = req.query.email;
        console.log(queryEmail)
        ordersCollection.find({email:queryEmail})
        .toArray((err,documents) => {
            res.send(documents)
            console.log(documents)
        })
    })

    app.post('/addProduct',(req,res) => {
        const newProduct = req.body;
        productsCollection.insertOne(newProduct)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        })

    })
    app.delete('/delete/:id',(req,res) => {
        productsCollection.deleteOne({_id:ObjectID(req.params.id)})
        .then(result => {
            console.log(result)
            res.send(result.deletedCount > 0)
        })
    })
    
});


app.get('/', (req, res) => {
    res.send('Hello World! ')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})