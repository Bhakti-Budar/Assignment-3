const express = require("express");
const app = express();
const path = require("path");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const PORT = 3000;

app.use(express.json());
//Serve the static files/folder
app.use(express.static(path.join(__dirname, "public")));

// middleware: passing from data
app.use(express.urlencoded({ extended: true }));

// Set the view engine as ejs
app.set("view engine", "ejs");

const client = new MongoClient(
  "mongodb+srv://bhaktibudar12:MzIe0OhXqdwwrqNJ@cluster0.2rlj8.mongodb.net/user-database",
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("user-database");
    const usersCollection = database.collection("users");

    // Home page
    app.get("/", async (req, res) => {
      res.render("home");
    });

    // Users page
    app.get("/users", async (req, res) => {
      try {
        const result = await usersCollection.find({}).toArray();
        res.render("users", { users: result });
      } catch (error) {
        res.json({
          status: "Failed",
          message: error,
        });
      }
    });

    // Add user page
    app.get("/users/createUser", async (req, res) => {
      res.render("createUser");
    });

    // Create user
    app.post("/users/createUser", async (req, res) => {
      try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.redirect("/users");
      } catch (error) {
        res.json({
          status: "Failed",
          message: error,
        });
      }
    });

    // Edit user page
    app.get("/users/editUser/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      try {
        const result = await usersCollection.findOne({ _id: id });
        res.render("editUser", { user: result });
      } catch (error) {
        res.json({
          status: "Failed",
          message: error,
        });
      }
    });

    // Update user
    app.post("/users/editUser/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      const user = req.body;
      try {
        const result = await usersCollection.updateOne(
          { _id: id },
          { $set: user }
        );
        res.redirect("/users");
      } catch (error) {
        res.json({
          status: "Failed",
          message: error,
        });
      }
    });

    // Delete user
    app.get("/users/deleteUser/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      try {
        const result = await usersCollection.deleteOne({ _id: id });
        res.redirect("/users");
      } catch (error) {
        res.json({
          status: "Failed",
          message: error,
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
