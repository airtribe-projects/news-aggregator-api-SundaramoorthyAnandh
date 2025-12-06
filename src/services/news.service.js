const axios = require('axios');
require('dotenv').config();
const CONSTANTS = require('./constants');

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = process.env.NEWS_API_BASE_URL;

const newsCache = {};

const defaultPreferences = {
    apiKey: API_KEY,
    action: 'getArticles',
    resultType: 'articles',
    articlesSortBy: 'date',
    lang: ['eng'],
    startSourceRankPercentile: 0,
    endSourceRankPercentile: 30,
    articlesPage: 1,
    articlesCount: 30,
    articlesSortBy: "sourceImportance",
    articlesSortByAsc: false,
    articlesArticleBodyLen: -1,
    includeArticleConcepts: true,
    includeArticleCategories: true,
    includeArticleImage: true,
    includeArticleSocialScore: true,
    includeArticleLocation: true,
    forceMaxDataTimeWindow: 31,
};

/*
    @param {Object} preferences - User preferences object
    @returns {Promise<Array>} - Array of articles
*/
const fetchPersonalizedNews = async (userPreferences) => {

    const cacheKey = JSON.stringify(userPreferences);

    const now = Date.now();

    if (newsCache[cacheKey] && now - newsCache[cacheKey].timestamp < CACHE_LIFETIME) {
        return newsCache[cacheKey].data;
    }

    const params = {
        ...defaultPreferences,
        ...userPreferences
    };

    try {
        const response = await axios.get(BASE_URL + 'getArticles', { params });

        const articles = response.data.articles ? response.data.articles.results : [];

        newsCache[cacheKey] = {
            data: articles,
            timestamp: now,
        };

        return articles;

    } catch (error) {
        console.error("NewsAPI.ai Error:", error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch articles from external API.');
    }
};

const fetchNewsDetails = async (articleUri) => {
    if (!articleUri) {
        throw new Error(CONSTANTS.MESSAGES.NO_ARTICLE_URI);
    }
    const params = {
        apiKey: API_KEY,
        resultType: "info",
        articleUri
    };

    const cacheKey = JSON.stringify(params);

    const now = Date.now();

    if (newsCache[cacheKey] && now - newsCache[cacheKey].timestamp < CACHE_LIFETIME) {
        return newsCache[cacheKey].data;
    }

    try {
        const response = await axios.get(BASE_URL + 'getArticle', { params });

        const articles = response.data ? response.data[articleUri].info : [];

        newsCache[cacheKey] = {
            data: articles,
            timestamp: now,
        };

        return articles;

    } catch (error) {
        console.error("NewsAPI.ai Error:", error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch an article from external API.');
    }
}

module.exports = {
    fetchPersonalizedNews,
    fetchNewsDetails
};