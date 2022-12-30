const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Descent Server Running.....");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3m2j3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("Descent").collection("users");
    const productCollection = client.db("Descent").collection("products");

    //get api
    //get users api
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });
    //get shirt
    app.get("/products/shirts", async (req, res) => {
      const len = parseInt(req.query.len);
      const query = { category: "shirt" };
      const shirts = await productCollection.find(query).limit(len).toArray();
      res.send(shirts);
    });
    app.get("/products/tshirts", async (req, res) => {
      const len = parseInt(req.query.len);
      const query = { category: "Tshirt" };
      const shirts = await productCollection.find(query).limit(len).toArray();
      res.send(shirts);
    });
    app.get("/products/pants", async (req, res) => {
      const len = parseInt(req.query.len);
      const query = { category: "Pant" };
      const shirts = await productCollection.find(query).limit(len).toArray();
      res.send(shirts);
    });

    //post api
    //post products
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //put api
    app.put("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    //delete operation
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //never closed
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("Descent Server Running on Port ", port);
});
