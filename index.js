const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(cors());
app.use(express.json());

// MongoDB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.talr0yk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Create database and collection objects
    const touristsCollection = client.db("spotsDB").collection("spots");
    const countriesCollection = client.db("spotsDB").collection("countries");

    // routes

    app.get("/touristspots", async (req, res) => {
      const touristSpotsCursor = await touristsCollection.find();
      const countriesCursor = await countriesCollection.find();
      const touristSpotsResult = await touristSpotsCursor.toArray();
      res.send(touristSpotsResult);
      res.send(countriesCursor);
    });

    app.get("/touristspots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const touristSpotsResult = await touristsCollection.findOne(query);
      const countriesResult = await countriesCollection.findOne(query);
      res.send(touristSpotsResult);
      res.send(countriesResult);
    });

    app.post("/touristspots", async (req, res) => {
      const spots = req.body;
      const touristSpotsResult = await touristsCollection.insertOne(spots);
      const countriesResult = await countriesCollection.insertOne(spots);
      res.send(touristSpotsResult);
      res.send(countriesResult);
    });

    app.put("/touristspots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = { $set: req.body };
      const touristSpotsResult = await touristsCollection.updateOne(
        query,
        updatedData,
        options
      );
      const countriesResult = await countriesCollection.updateOne(
        query,
        updatedData,
        options
      );
      res.send(touristSpotsResult);
      res.send(countriesResult);
    });

    app.delete("/touristspots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const touristSpotsResult = await touristsCollection.deleteOne(query);
      const countriesResult = await countriesCollection.deleteOne(query);
      res.send(touristSpotsResult);
      res.send(countriesResult);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
