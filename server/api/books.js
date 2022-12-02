const express = require("express");
const router = express.Router();
const { Book } = require("../db");

// GET - api/comics --> Gets all comics from the db
router.get("/", async (req, res, next) => {
  try {
    const allBooks = await Book.findAll();
    res.send(allBooks);
  } catch (err) {
    console.log(err);
  }
});
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const singleBook = await Book.findByPk(id);
    res.send(singleBook);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;