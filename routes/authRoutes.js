const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      msg: "User created",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = User.findOne({ username });
    if (!user) return res.status(401).json({ msg: "user does not exist" });
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) return res.status(401).json({ msg: "invalid credentials" });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, username: user.username });
  } catch (err) {
    res.json(500).json({ error: err.message });
  }
});

module.exports = router;
