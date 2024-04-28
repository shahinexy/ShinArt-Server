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

        app.delete('/art&craft/id/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            console.log(id, query);
            const result = await artAndcraftCollection.deleteOne(query)
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