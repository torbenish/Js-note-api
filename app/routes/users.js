/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const secret = process.env.JWT_TOKEN;

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  try {
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error registering new user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Incorrect email or password' });
    } else {
      user.isCorrectPassword(password, (err, same) => {
        if (!same) {
          res.status(401).json({ error: 'Incorrect email or password' });
        } else {
          const token = jwt.sign({ email }, secret, { expiresIn: '10d' });
          res.json({ user, token });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error, please try again' });
  }
});

router.put('/', withAuth, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { name, email } },
      { upsert: true, new: true },
    );
    res.json(user);
  } catch (error) {
    res.status(401).json({ error });
  }
});

router.put('/password', withAuth, async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({ _id: req.user._id });
    user.password = password;
    user.save();
    res.json(user);
  } catch (error) {
    res.status(401).json({ error });
  }
});

router.delete('/', withAuth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    await user.delete();
    res.json({ message: 'OK' }).status(201);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
