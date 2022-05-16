const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
        // 6 product load in home page
        app.get('/product', async (req, res) => {
            const query = {};
            const cycleData = cycleCollection.find(query);
            const result = await cycleData.limit(6).toArray();
            res.send(result);
        });
        // all product load
        app.get('/allProducts', async (req, res) => {
            const query = {};
            const cycleData = cycleCollection.find(query);
            const result = await cycleData.toArray();
            res.send(result);
        });
        // product load by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await cycleCollection.findOne(query);
            res.send(product)
        });
        // product update by id
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
        // delete product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cycleCollection.deleteOne(query);
            res.send(result);
        })
        // add product
        app.post('/product', async (req, res) => {
            const productBody = req.body;
            console.log(productBody);
            const result = await cycleCollection.insertOne(productBody);
            res.send(result);
        });

        app.get('/myitems', async (req, res) => {
            const email = req.query.email;
            const myItemData = cycleCollection.find({ email });
            const result = await myItemData.toArray();
            res.send(result);
        })
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