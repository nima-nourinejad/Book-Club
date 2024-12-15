const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

// async function connectToDatabase() {
//   try {
//     const connectionString = "mongodb://localhost:27017";
//     const dbName = "database";
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };
//     await mongoose.connect(`${connectionString}/${dbName}`, options);
//     console.log(`Connected to MongoDB at ${connectionString}/${dbName}`);
//   } catch (err) {
//     console.error("Error connecting to MongoDB: ", err);
//     process.exit(1);
//   }
// }

async function connectToDatabase() {
  try {
    const user = "nima";
    const password = "123";
    const cluster = "cluster0.gpkfp.mongodb.net";
    const dbName = "dbName";
    const options = "retryWrites=true&w=majority";

    const connectionString = `mongodb+srv://${user}:${password}@${cluster}`;
    const uri = `${connectionString}/${dbName}?${options}`;

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(1);
  }
}

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  book: { type: String, required: true },
});

const Favorite = mongoose.model("Favorite", schema);

async function createFavorite(newName, newBook) {
  try {
    const document = new Favorite({
      name: newName,
      book: newBook,
    });
    const savedDocument = await document.save();
    return savedDocument;
  } catch (err) {
    console.error("Error creating document: ", err.message);
    throw new Error("Failed to create favorite");
  }
}

async function getFavorites() {
  try {
    const favorites = await Favorite.find();
    return favorites;
  } catch (err) {
    console.error("Error getting favorites: ", err.message);
    throw new Error("Failed to fetch favorites");
  }
}

function validateFavorite(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    book: Joi.string().required(),
  });
  return schema.validate(body);
}

const PORT = process.env.PORT || 5000;

app.get("/api/favorites", async (req, res) => {
  try {
    const favorites = await getFavorites();
    res.json(favorites);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/favorites", async (req, res) => {
  const { error } = validateFavorite(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const favorite = await createFavorite(req.body.name, req.body.book);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

async function clearCollection() {
  try {
    const db = mongoose.connection.db;
    await db.collection("favorites").deleteMany({});
  } catch (err) {
    console.error(err);
  }
}

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
  //   clearCollection();
}

startServer();
