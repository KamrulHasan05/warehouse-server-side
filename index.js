const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();



app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://dbuser1:GRN1oR86pHRhGl4E@cluster0.vliyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const cycleCollection = client.db('cycle').collection('cycle-details');

        app.get('/product', async (req, res) => {
            const query = {};
            const cycleData = cycleCollection.find(query);
            const result = await cycleData.limit(6).toArray();
            res.send(result);
        });

        app.get('/allProducts', async (req, res) => {
            const query = {};
            const cycleData = cycleCollection.find(query);
            const result = await cycleData.toArray();
            res.send(result);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await cycleCollection.findOne(query);
            res.send(product)
        });

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const quarry = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDetails = {
                $set: {
                    img: updateProduct.img,
                    name: updateProduct.name,
                    description: updateProduct.description,
                    supplier: updateProduct.supplier,
                    price: updateProduct.price,
                    quantity: updateProduct.quantity
                }
            };
            const result = await cycleCollection.updateOne(quarry, updateDetails, option);
            res.send(result);
        });

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cycleCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/product', async (req, res) => {
            const productBody = req.body;
            const result = await cycleCollection.insertOne(productBody);
            res.send(result);
        });

    }
    finally {
        //  await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})