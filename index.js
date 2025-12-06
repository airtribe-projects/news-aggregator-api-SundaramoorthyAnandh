require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const newsRoutes = require('./src/routes/news');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('News Aggregator API is running.');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/news', newsRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


module.exports = app;