const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.ashqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Creating database
    const database = client.db("campaigns_db");
    const campaignCollections = database.collection("campaignCollections");

    // Add new campaign start
    app.post("/addCampaign", async (req, res) => {
      const result = await campaignCollections.insertOne(req.body);
      res.send(result);
    });
    // Add new campaign end

    // Get all campaigns start
    app.get("/allCampaign", async (req, res) => {
      const cursor = campaignCollections.find();
      const result = await cursor.toArray();

      res.send(result);
    });
    // Get all campaigns end

    // Get a signle campaign start
    app.get("/campaign/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const campaign = await campaignCollections.findOne(query);

      res.send(campaign);
    });
    // Get a signle campaign end

    // Get all of my campaigns start
    app.post("/myCampaign", async (req, res) => {
      const { email } = req.body;
      const query = { userEmail: email };
      const cursor = campaignCollections.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });
    // Get all of my campaigns end

    // Update my campaign start
    app.post("/updateCampaign/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          imageURL: req.body.imageURL,
          campaignTitle: req.body.campaignTitle,
          campaignType: req.body.campaignType,
          description: req.body.description,
          minimumDonation: req.body.minimumDonation,
          deadline: req.body.deadline,
          userEmail: req.body.userEmail,
          userName: req.body.userName,
        },
      };
      const result = await campaignCollections.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });
    // Update my campaign end

    // Delete my campaign start
    app.delete("/myCampaign/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollections.deleteOne(query);

      res.send(result);
    });
    // Delete my campaign end
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Assaigment 10</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
