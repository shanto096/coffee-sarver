const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = 'mongodb+srv://coffee:uhGwU22WsUUkgx6Q@cluster0.g50jtk2.mongodb.net/?retryWrites=true&w=majority';
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g50jtk2.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db("coffeeDB").collection('coffee');


        app.get('/coffee', async(req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        app.post("/coffee", async(req, res) => {
            const coffee = req.body
            console.log(coffee);
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result)
        })
        app.put('/coffee/:id', async(req, res) => {

            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const coffee = req.body;
            const updateCoffee = {
                $set: {
                    nameCoffee: coffee.nameCoffee,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    test: coffee.test,
                    category: coffee.category,
                    details: coffee.details,
                    photo: coffee.photo,
                    price: coffee.price,
                }
            }
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
            res.send(result)
        })
        app.delete('/coffee/:id', async(req, res) => {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const result = await coffeeCollection.deleteOne(query)
                res.send(result)
            })
            // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})