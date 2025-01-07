const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow requests from your frontend
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow these methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Add any necessary headers
//   })
// );

// // Ensure preflight requests are handled
// app.options("*", cors());

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
    process.exit(1);
  }
}

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
    await User.updateOne(
      {
        username: req.body.username,
      },
      {
        $push: { books: req.body.book },
      }
    );
    let userModified = await User.findOne({ username: req.body.username });
    res.status(200).json(userModified);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get(`/api/users/:username`, async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(422).send("No username provided");
  }
  try {
    const user = await User.findOne({ username });
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

//////////////////////////
const book_schema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: Array, default: [] },
});
const Book_model = mongoose.model("Book_collection", book_schema);

const user_schema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book_collection",
      default: [],
    },
  ],
});

const User_model = mongoose.model("User_collection", user_schema);

async function createBook_document(title, author, genre) {
  try {
    const document = new Book_model({
      title,
      author,
      genre,
    });
    const savedDocument = await document.save();
    return savedDocument;
  } catch (err) {
    console.error("Error creating book document: ", err.message);
  }
}

async function createUser_document(username, name) {
  try {
    const document = new User_model({
      username,
      name,
    });
    const savedDocument = await document.save();
    return savedDocument;
  } catch (err) {
    console.error("Error creating user document: ", err.message);
  }
}

async function addBook_toUser(username, book_id) {
  try {
    const user = await User_model.findOne({ username });
    if (!user) {
      return null;
    }
    await User_model.updateOne(
      {
        username,
      },
      {
        $push: { books: book_id },
      }
    );
    const userModified = await User_model.findOne({ username });
    return userModified;
  } catch (err) {
    return null;
  }
}

async function removeBook_fromUser(username, book_id) {
  try {
    const user = await User_model.findOne({ username });
    if (!user) {
      return null;
    }
    await User_model.updateOne(
      {
        username,
      },
      {
        $pull: { books: book_id },
      }
    );
    await Book_model.deleteOne({ _id: book_id });
    const userModified = await User_model.findOne({ username });
    return userModified;
  } catch (err) {
    return null;
  }
}

async function getBooks(username) {
  try {
    const user = await User_model.findOne({ username }).populate("books");
    if (!user) {
      return null;
    }
    return user.books;
  } catch (err) {
    return null;
  }
}

async function getFullUser(username) {
  try {
    const user = await User_model.findOne({ username }).populate("books");
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    return null;
  }
}

app.post("/api/new", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(422).send(error.details[0].message);
  }
  try {
    const oldUser = await User_model.findOne({ username: req.body.username });
    if (oldUser) {
      return res.status(400).send("Username already exists");
    }
    const user = await createUser_document(req.body.username, req.body.name);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// app.put("/api/new", async (req, res) => {
//   const { error } = validateBook(req.body);
//   if (error) {
//     return res.status(422).send(error.details[0].message);
//   }
//   try {
//     const oldUser = await User_model.findOne({ username: req.body.username });
//     if (!oldUser) {
//       return res.status(404).send("User not found");
//     }
//     const book = await createBook_document(req.body.book, []);
//     if (!book) {
//       return res.status(500).send("Error creating book");
//     }
//     const user = await addBook_toUser(req.body.username, book._id);
//     if (!user) {
//       Book_model.deleteOne({ _id: book._id });
//       return res.status(500).send("Error adding book to user");
//     }
//     const userModified = await getFullUser(req.body.username);
//     if (!userModified) {
//       Book_model.deleteOne({ _id: book._id });
//       return res.status(500).send("Error getting user");
//     }
//     res.status(200).json(userModified);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

app.put("/api/new", async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(422).send(error.details[0].message);
  }
  try {
    const oldUser = await User_model.findOne({ username: req.body.username });
    if (!oldUser) {
      return res.status(404).send("User not found");
    }
    const title = req.body.book;
    const formattedTitle = title.replaceAll(" ", "+");
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    console.log("API_KEY:", process.env.GOOGLE_BOOKS_API_KEY);
    url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${formattedTitle}&key=${API_KEY}`;
	console.log('usl start');
    console.log(url);
	console.log('usl end');
    const response = await axios.get(url);
    const result = {
      title: response.data.items[0]?.volumeInfo?.title,
      author: response.data.items[0]?.volumeInfo.authors?.toString(),
    };
	console.log('result start');
	console.log(result);
	console.log('result end');
	console.log('result.title start');
	console.log(result.title);
	console.log('result.title end');
	console.log('result.author start');
	console.log(result.author);
	console.log('result.author end');
    const book = await createBook_document(result.title, result.author, []);
    if (!book) {
      return res.status(500).send("Error creating book");
    }
    const user = await addBook_toUser(req.body.username, book._id);
    if (!user) {
      Book_model.deleteOne({ _id: book._id });
      return res.status(500).send("Error adding book to user");
    }
    const userModified = await getFullUser(req.body.username);
    if (!userModified) {
      Book_model.deleteOne({ _id: book._id });
      return res.status(500).send("Error getting user");
    }
    res.status(200).json(userModified);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/new", async (req, res) => {
  try {
    const users = await User_model.find().populate("books");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/new/:username", async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(422).send("No username provided");
  }

  const user = await User_model.findOne({
    username: req.params.username,
  }).populate("books");
  if (!user) {
    return res.status(404).send("User not found");
  }

  res.status(200).json(user);
});

app.delete("/api/new/:username/:book_id", async (req, res) => {
  //   const { error } = validateBook(req.params);
  //   if (error) {
  // 	return res.status(422).send(error.details[0].message);
  //   }
  try {
    const user = await removeBook_fromUser(
      req.params.username,
      req.params.book_id
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/google/:title", async (req, res) => {
  const title = req.params.title;
  if (!title) {
    console.log("No title provided");
    return res.status(422).send("No title provided");
  }
  console.log(title);
  const formattedTitle = title.replaceAll(" ", "+");
  console.log(formattedTitle);
  try {
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    console.log("API_KEY:", process.env.GOOGLE_BOOKS_API_KEY);
    url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${formattedTitle}&key=${API_KEY}`;
    console.log(url);
    const response = await axios.get(url);
    console.log(response);
    const books = [];
    response.data.items.forEach((item) => {
      if (item.volumeInfo?.authors) {
        const book = {
          title: item?.volumeInfo?.title,
          author: item?.volumeInfo.authors?.toString(),
          id: item?.id,
        };
        books.push(book);
      }
    });
    // const book = {
    //   title: response.data.items[0]?.volumeInfo?.title,
    //   Author: response.data.items[0]?.volumeInfo.authors?.toString(),
    //   id: response.data.items[0]?.id,
    // };
    // books.push(book);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/add", async (req, res) => {
  const { username, title, author } = req.body;
  if (!username || !title || !author) {
	return res.status(422).send("Missing required fields");
  }
  try {
	const user = await User_model.findOne({ username}).populate("books");
	if (!user) {
	  return res.status(404).send("User not found");
	}
	let book = await Book_model.findOne({ title, author });
	if (!book) {
	  book = await createBook_document(title, author, []);
	}
	let user_books = user.books;
	let bookExists = false;
	user_books.forEach((user_book) => {
	  if (user_book.title === book.title && user_book.author === book.author) {
		bookExists = true;
	  }
	});
	if (bookExists) {
	  return res.status(200).send("Book already exists in user's collection");
	}
	const userModified = await addBook_toUser(username, book._id);
	if (!userModified) {
	  return res.status(500).send("Error adding book to user");
	}
	res.status(200).json(userModified);
  } catch (err) {
	res.status(500).send(err.message);
  }});

////////////////
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
  //   clearFavorites();
  //   clearUsers();
}

startServer();
