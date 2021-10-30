/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const Note = require('../models/note');
const withAuth = require('../middlewares/auth');

const isOwner = (user, note) => {
  if (JSON.stringify(user._id) === JSON.stringify(note.author._id)) return true;
  return false;
};

router.post('/', withAuth, async (req, res) => {
  const { title, body } = req.body;

  try {
    const note = new Note({ title, body, author: req.user._id });
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Problem to create a new note' });
  }
});

router.get('/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (isOwner(req.user, note)) res.json(note);
    else res.status(403).json({ error: 'Permission denied' });
  } catch (error) {
    res.status(500).json({ error: 'Problem to get a note' });
  }
});

router.get('/', withAuth, async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user._id });
    res.json(notes);
  } catch (error) {
    res.json({ error }.status(500));
  }
});

module.exports = router;
