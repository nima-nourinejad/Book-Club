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

// async function connectToDatabase() {
//   try {
//     const user = "nima";
//     const password = "123";
//     const cluster = "cluster0.gpkfp.mongodb.net";
//     const dbName = "dbName";
//     const options = "retryWrites=true&w=majority";

//     const connectionString = `mongodb+srv://${user}:${password}@${cluster}`;
//     const uri = `${connectionString}/${dbName}?${options}`;

//     await mongoose.connect(uri);
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("Error connecting to MongoDB: ", err);
//     process.exit(1);
//   }
// }


async function connectToDatabase() {
  try {
    const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`;
    const uri = `${connectionString}/${process.env.DB_NAME}?${process.env.DB_OPTIONS}`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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

const schema_user = new mongoose.Schema({
	  name: { type: String, required: true },
	  username: { type: String, required: true },
	  books: { type: Array, default: [] },
});

const Favorite = mongoose.model("Favorite", schema);
const User = mongoose.model("User", schema_user);

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

async function createUser(newName, newUsername) {
	  try {
	const document = new User({
	  name: newName,
	  username: newUsername,
	});
	const savedDocument = await document.save();
	return savedDocument;
  } catch (err) {
	console.error("Error creating user: ", err.message);
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

function validateUser(body) {
	  const schema = Joi.object({
		name: Joi.string().required(),
		username: Joi.string().required(),
	  });
	  return schema.validate(body);
}

function validateBook(body) {
	  const schema = Joi.object({
		username: Joi.string().required(),
		book: Joi.string().required(),
	  });
	  return schema.validate(body);
}

function validateUserName(body) {
	  const schema = Joi.object({
		username: Joi.string().required(),
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

app.post("/api/users", async (req, res) => {
	  const { error } = validateUser(req.body);
	  if (error) {
		return res.status(422).send(error.details[0].message);
	  }
	  try {
		const oldUser = await User.findOne({ username: req.body.username });
		if (oldUser) {
			return res.status(400).send("Username already exists");
		}
		const user = await createUser(req.body.name, req.body.username);
		res.status(201).json(user);
	  } catch (err) {
		res.status(500).send(err.message);
	  }
});

app.put("/api/users", async (req, res) => {
	  const { error } = validateBook(req.body);
	  if (error) {
		return res.status(422).send(error.details[0].message);
	  }
	  try {
		let user = await User.findOne({ username: req.body.username });
		if (!user) {
			return res.status(404).send("User not found");
		}
		await User.updateOne({
			username: req.body.username,
		},
		{
			$push: { books: req.body.book },
		});
		let user = await User.findOne({ username: req.body.username });
		res.status(200).json(user);
		// res.status(200).send("Book added to user");
	  }
	  catch (err) {
		res.status(500).send(err.message);
	  }
});

app.get(`/api/users/:username`, async (req, res) => {
	const { username } = req.params;
	if (!username) {
		return res.status(422).send("No username provided");
	}
	try {
		const user = await User.findOne({username});
		if (!user) {
			return res.status(404).send("User not found");
		}
		res.status(200).json(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/users", async (req, res) => {
	try {
		const books = [];
		const users = await User.find();
		users.forEach((user) => {
			
			if (user.books.length > 0) {
				let member = {
					name: user.name,
					book: user.books.toString(),
					_id: user._id,
				};
				books.push(member);
		}
		});
		res.status(200).json(books);
	} catch (err) {
		res.status(500).send(err.message);
	}
});


async function clearFavorites() {
  try {
    const db = mongoose.connection.db;
    await db.collection("favorites").deleteMany({});
  } catch (err) {
    console.error(err);
  }
}
async function clearUsers() {
	  try {
	const db = mongoose.connection.db;
	await db.collection("users").deleteMany({});
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
