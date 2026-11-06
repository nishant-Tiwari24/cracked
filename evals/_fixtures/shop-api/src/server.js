const express = require("express");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const products = require("./routes/products");
const orders = require("./routes/orders");

const app = express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/shopkart");

app.use("/auth", auth);
app.use("/products", products);
app.use("/orders", orders);

app.listen(3000, () => console.log("listening on 3000"));
