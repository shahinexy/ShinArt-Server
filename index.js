const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// ShinArt
// gUgrBItmVWm1LJ9K


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.76h69in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const artAndcraftCollection = client.db("art&craftDB").collection("art&craft");
        const categoryCollection = client.db("art&craftDB").collection("category");

        app.post('/art&craft', async (req, res) => {
            const newItem = req.body;
            const result = await artAndcraftCollection.insertOne(newItem)
            res.send(result)
        })

        app.get('/art&craft', async (req, res) => {
            const cursor = artAndcraftCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/art&craft/id/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artAndcraftCollection.findOne(query)
            res.send(result)
        })


        app.get('/art&craft/uid/:loginUid', async (req, res) => {
            const uid = req.params.loginUid;
            const filter = { loginUid: uid };
            const result = await artAndcraftCollection.find(filter).toArray();
            res.send(result)
        })

        app.put('/art&craft/id/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateData = {
                $set: {
                    photo: data.photo,
                    item_name: data.item_name,
                    subcategory_Name: data.subcategory_Name,
                    price: data.price,
                    rating: data.rating,
                    customization: data.customization,
                    processing_time: data.processing_time,
                    stockStatus: data.stockStatus,
                    description: data.description,
                }
            }

            const result = await artAndcraftCollection.updateOne(query, updateData, options)
            res.send(result)
        })

        app.delete('/art&craft/id/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artAndcraftCollection.deleteOne(query)
            res.send(result)
        })

        // fore categories collection API
        app.get('/category', async (req, res) => {
            const cursor = categoryCollection.find()
            console.log("cetegory", cursor);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/category/:type', async(req, res)=>{
            const type = req.params.type;
            const query = { subcategory_Name: type }
            const result = await categoryCollection.findOne(query)
            res.send(result)
        })

        app.post('/category', async (req, res) => {
            const newItem = req.body;
            console.log('cetegory', newItem);
            const result = await categoryCollection.insertOne(newItem)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Art & Carft server i running')
})

app.listen(port, () => {
    console.log("My server is running on port:", port);
})