const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g8htdaf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const taskCollection = client.db('taskApp').collection('allTask')


        app.post('/alltask', async (req, res) => {
            const allTask = req.body;
            const result = await taskCollection.insertOne(allTask);
            res.send(result);
        })

        app.get('/alltask', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const myAllTask = await taskCollection.find(query).toArray();
            res.send(myAllTask);
        })


        app.put('/alltask/complete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: "complete"
                }
            }

            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.put('/alltask/incomplete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: "incomplete"
                }
            }

            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/alltask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/alltask/:status/:email', async (req, res) => {
            const status = req.params.status;
            const email = req.params.email;
            const query = { status: status, email: email };
            const allTask = await taskCollection.find(query).toArray();
            res.send(allTask);
        })

    }
    finally {

    }
}

run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Task Tool App server is running');
});


app.listen(port, () => {
    console.log(`Task Tool App server running on: ${port}`);
})

