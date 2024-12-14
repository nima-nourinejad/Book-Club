const express = require("express");
const Joi = require("joi"); // Corrected Joi import
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection function
async function connectToDatabase() {
  try {
    const connectionString = "mongodb://localhost:27017";
    const dbName = "database";
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(`${connectionString}/${dbName}`, options);
    console.log(`Connected to MongoDB at ${connectionString}/${dbName}`);
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(1); // Stop the server if MongoDB connection fails
  }
}

// Schema definition
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  book: { type: String, required: true },
});

const Favorite = mongoose.model("Favorite", schema);

// Create a new favorite entry
async function createFavorite(newName, newBook) {
  try {
    const document = new Favorite({
      name: newName,
      book: newBook,
    });
    const savedDocument = await document.save();
    return savedDocument;  // Return saved document to the client
  } catch (err) {
    console.error("Error creating document: ", err.message);
    throw new Error("Failed to create favorite");
  }
}

// Get all favorite entries
async function getFavorites() {
  try {
    const favorites = await Favorite.find();
    return favorites;
  } catch (err) {
    console.error("Error getting favorites: ", err.message);
    throw new Error("Failed to fetch favorites");
  }
}

// Validate favorite entry using Joi
function validateFavorite(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    book: Joi.string().required(),
  });
  return schema.validate(body);
}

const port = 5000;

// GET route for fetching all favorites
app.get("/api/favorites", async (req, res) => {
  try {
    const favorites = await getFavorites();
    res.json(favorites);  // Send JSON response
  } catch (err) {
    res.status(500).send(err.message);  // Return error message if fetching fails
  }
});

// POST route for creating a new favorite
app.post("/api/favorites", async (req, res) => {
  const { error } = validateFavorite(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);  // Send validation error
  }

  try {
    const favorite = await createFavorite(req.body.name, req.body.book);
    res.status(201).json(favorite);  // Send back the created document
  } catch (err) {
    res.status(500).send(err.message);  // Send internal server error
  }
});

async function clearCollection() {
	try {
	  const db = mongoose.connection.db;
	  await db.collection('favorites').deleteMany({});
	} catch (err) {
	  console.error(err);
	}
  }

// Start server after connecting to the database
async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
//   clearCollection();
}

startServer();
