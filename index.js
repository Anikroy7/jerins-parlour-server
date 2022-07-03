const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const cors = require('cors');
require('dotenv').config()


// middleware 

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Welcome to jerins parlour server')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.saft5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {



    try {

        await client.connect()
        const serviceCollection = client.db('jerins_parlour').collection('services');
        const reviewCollection = client.db('jerins_parlour').collection('reviews');
        const orderCollection = client.db('jerins_parlour').collection('orders');


        app.get('/services', async (req, res) => {
            const query = {};
            const result = await serviceCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const result = await reviewCollection.find(query).toArray()
            res.send(result);
        })

        app.put('/order', async (req, res) => {
            const order = req.body;
            console.log(order);
            const name = req.body.name;
            const filter = { name: name }
            const options = { upsert: true };
            const updateDoc = {
                $set: order
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })
    }
    finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`jerins parlour server is running on ${port}`)
})