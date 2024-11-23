const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("./Order");
const Order = mongoose.model("Order");

app.use(bodyParser.json());

app.post("/order", (req, res) => {
  var newOrder = {
    CustomerID: req.body.CustomerID,
    BookID: req.body.BookID,
    initialDate: req.body.initialDate,
    deliveryDate: req.body.deliveryDate,
  };

  var order = new Order(newOrder);

  order
    .save()
    .then(() => {
      res.send(order);
      console.log("Order Created with success");
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.get("/orders", (req, res) => {
  Order.find()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.get("/order/:id", (req, res) => {
  var id = new mongoose.Types.ObjectId(req.params.id);
  Order.findById(id.toString())
    .then((order) => {
      if (order) {
        axios
          .get("http://localhost:5555/customer/" + order.CustomerID)
          .then((response) => {
            var orderObject = {
              customerName: response.data.name,
              bookTitle: "",
            };
            axios
              .get("http://localhost:4545/book/" + order.BookID)
              .then((response) => {
                orderObject.bookTitle = response.data.title;
                res.json(orderObject);
              });
          });
      } else {
        res.send("Invalid Order");
      }
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/orderservice", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Order is connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

app.listen(7777, () => {
  console.log("Up and running - Orders service");
});
