const router = require("express").Router();
const Order = require("../models/order");
const Product = require("../models/product");

router.post("/", async (req, res) => {
  let total = 0;
  for (const item of req.body.items) {
    const p = await Product.findById(item.productId);
    total += p.price * item.qty;
    p.stock = p.stock - item.qty;
    await p.save();
  }
  const order = await Order.create({ user: req.body.userId, items: req.body.items, total });
  res.json(order);
});

module.exports = router;
