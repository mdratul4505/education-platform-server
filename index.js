const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware for body parsing
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mj89i6p.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("education_db");
    const skillCollection = db.collection("skills");

    // GET all skills
    app.get("/skills", async (req, res) => {
      try {
        const result = await skillCollection.find({}).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to fetch skills" });
      }
    });

    // --- Single skill ---

    app.get("/skills/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const result = await skillCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to fetch artwork" });
      }
    });

    // --- Add skill --

    // POST new skill
    app.post("/skills", async (req, res) => {
      try {
        const newSkill = req.body;
        const result = await skillCollection.insertOne(newSkill);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to add skill" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
