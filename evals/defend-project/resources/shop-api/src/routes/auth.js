const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const SECRET = "shopkart123";

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("user not found");
  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).send("wrong password");
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, SECRET);
  res.json({ token });
});

module.exports = router;
