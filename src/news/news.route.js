const router = require('express').Router();
const newsController = require('./news.controller');
// GET
router.route("/:id")
    .get(newsController.getNews)

// GET ALL
router.route("/")
    .get(newsController.getAllNews);

module.exports = router;
