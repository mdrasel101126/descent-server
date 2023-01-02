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
    const bookingCollection = client.db("Descent").collection("bookings");
    const reviewCollection = client.db("Descent").collection("reviews");

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

    //get details api

    app.get("/products/details/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    //get reviews by service id api
    app.get("/reviews", async (req, res) => {
      let query = {};
      //console.log(req.query.id);
      if (req.query.id) {
        query = {
          product_id: req.query.id,
        };
      }
      const options = {
        sort: { comment_date: -1 },
      };
      const cursor = reviewCollection.find(query, options);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //post api
    //post products
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //post booking api

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    //post review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    //put api
    app.put("/users", async (req, res) => {
      const user = req.body;
      //console.log(user);
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
