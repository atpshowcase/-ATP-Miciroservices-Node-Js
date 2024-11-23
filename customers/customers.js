const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

require("./Customer");
const Customer = mongoose.model("Customer");

mongoose
  .connect("mongodb://127.0.0.1:27017/customerservice", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Customer is connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });


app.get("/", (req, res) => {
  res.send("Server Customers is running !!!");
});

app.post("/customer", (req, res) => {
  var newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };
  var customer = new Customer(newCustomer);

  customer
    .save()
    .then(() => {
      res.send("Customer created");
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.get("/customers", (req, res) => {
  Customer.find()
    .then((customers) => {
      res.json(customers);
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.get("/customer/:id", (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.send("Invalid ID");
    return;
  }

  Customer.findById(req.params.id)
    .then((customer) => {
      if (customer) {
        res.json(customer);
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

app.delete("/customer/:id", (req, res) => {
  Customer.findOneAndDelete(req.params.id)
    .then(() => {
      res.send("Customer removed with success!");
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

app.listen("5555", () => {
  console.log("Server 5555 Up and running - Customers service");
});
