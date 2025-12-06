const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const authMiddleware = require('../middlewares/auth');

/*
 @path - /api/v1/news
 @method - GET
 @desc Fetches the news based on the user's preferences.
 @access - Private
 */
router.get('/:articleUri', authMiddleware, newsController.getNewsDetails);
router.get('/', authMiddleware, newsController.getAllNews);

module.exports = router;