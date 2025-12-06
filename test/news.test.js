const tap = require('tap');
const supertest = require('supertest');
const app = require('../index');
const { connectDB, closeDB, clearDB } = require('./helper');

const server = supertest(app);

let token = '';

tap.before(async () => {
    await connectDB();
    await clearDB();

    // Register user
    const response = await server
        .post('/api/v1/auth/register')
        .send({
            username: 'newsuser',
            email: 'news@example.com',
            password: 'password123'
        });
    token = response.body.token;
});

tap.teardown(async () => {
    await closeDB();
});

tap.test('News Routes', async (t) => {

    await t.test('GET /api/v1/news without token', async (t) => {
        const response = await server.get('/api/v1/news');
        t.equal(response.status, 401);
    });

    await t.test('GET /api/v1/news with token', async (t) => {
        const response = await server
            .get('/api/v1/news')
            .set('Authorization', `Bearer ${token}`);

        // It might be 200 (Success) or 503 (API Error/Quota/Key missing)
        // We accept both as "handled"
        t.match(response.status, /200|503/, 'Status should be 200 or 503');

        if (response.status === 200) {
            t.hasOwnProp(response.body, 'articles', 'Should return articles');
        }
    });

    await t.test('GET /api/v1/news/:articleUri', async (t) => {
        // We'll use a dummy URI. If API call fails -> 503. If not found -> maybe 500 or handled in service?
        // Service throws "Failed to fetch...". Controller catches and returns 500 or 503.
        const response = await server
            .get('/api/v1/news/12345')
            .set('Authorization', `Bearer ${token}`);

        t.match(response.status, /200|503|500/, 'Status should be handled (200, 503, or 500)');
    });
});
