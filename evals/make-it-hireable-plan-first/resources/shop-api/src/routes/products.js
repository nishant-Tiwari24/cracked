const router = require("express").Router();
const Product = require("../models/product");

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

router.get("/search", async (req, res) => {
  const products = await Product.find({ name: { $regex: req.query.q } });
  res.json(products);
});

module.exports = router;
