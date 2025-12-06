const newsService = require('../services/news.service');
const MESSAGES = require('./constants');

const { NEWS } = MESSAGES;

const getAllNews = async (req, res) => {
    try {
        let userPreferences = req.body;

        console.log("userPreferences", userPreferences);

        if (!userPreferences?.keyword) {
            userPreferences = { keyword: 'latest', language: ['eng'], articleImage: false };

            const articles = await newsService.fetchPersonalizedNews(userPreferences);

            return res.status(200).json({
                msg: NEWS.NO_PREFERENCES,
                articles: articles
            });
        }

        const articles = await newsService.fetchPersonalizedNews(userPreferences);

        res.status(200).json({
            msg: NEWS.SUCCESS,
            articles: articles
        });

    } catch (err) {
        console.error(err.message);
        if (err.message.includes('external API')) {
            return res.status(503).json({ msg: NEWS.ERROR });
        }
        res.status(500).json({ msg: NEWS.ERROR });
    }
};

const getNewsDetails = async (req, res) => {
    const articleUri = req.params.articleUri;

    if (!articleUri) {
        return res.status(400).json({ msg: NEWS.NO_ARTICLE_URI });
    }

    try {
        const response = await newsService.fetchNewsDetails(articleUri);

        return res.status(200).json({
            msg: NEWS.SUCCESS,
            article: response
        });
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('external API')) {
            return res.status(503).json({ msg: NEWS.ERROR });
        }
        res.status(500).json({ msg: NEWS.ERROR });
    }
}

module.exports = {
    getAllNews,
    getNewsDetails
};