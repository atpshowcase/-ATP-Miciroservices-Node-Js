const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const mongoose = require("mongoose");

require("./Book");
const Book = mongoose.model("Book");

mongoose
  .connect("mongodb://127.0.0.1:27017/bookservice", { useNewUrlParser: true })
  .then(() => {
    console.log("Database Book is connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

app.get("/", (req, res) => {
  res.send("Server Books is running !!!");
});

app.post("/book", (req, res) => {
  var newBook = {
    title: req.body.title,
    author: req.body.author,
    numberPages: req.body.numberPages,
    publisher: req.body.publisher,
  };

  var book = new Book(newBook);

  book
    .save()
    .then(() => {
      console.log("New book created");
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });

  res.send("A new book created with success!");

  console.log(newBook);
});

app.get("/books", (req, res) => {
  Book.find()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.get("/book/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.delete("/book/:id", (req, res) => {
  Book.findOneAndDelete(req.params.id)
    .then(() => {
      res.send("Book removed with success!");
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.listen(4545, () => {
  console.log("Server 4545 Up and running! -- This is our Books service");
});
