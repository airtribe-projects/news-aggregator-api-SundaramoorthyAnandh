const tap = require('tap');
const supertest = require('supertest');
const app = require('../index');
const { connectDB, closeDB, clearDB } = require('./helper');

const server = supertest(app);

let token = '';

tap.before(async () => {
    await connectDB();
    await clearDB();

    // Register a user to get token
    const response = await server
        .post('/api/v1/auth/register')
        .send({
            username: 'userpref',
            email: 'pref@example.com',
            password: 'password123'
        });
    token = response.body.token;
});

tap.teardown(async () => {
    await closeDB();
});

tap.test('User Routes', async (t) => {

    await t.test('GET /api/v1/user/preferences (Default)', async (t) => {
        const response = await server
            .get('/api/v1/user/preferences')
            .set('Authorization', `Bearer ${token}`);

        t.equal(response.status, 200);
        // Default preferences might be empty or specific values from User model
        t.hasOwnProp(response.body, 'preferences');
    });

    await t.test('PUT /api/v1/user/preferences', async (t) => {
        const newPreferences = {
            keyword: 'bitcoin',
            language: ['eng', 'deu'],
            articleImage: true
        };

        const response = await server
            .put('/api/v1/user/preferences')
            .set('Authorization', `Bearer ${token}`)
            .send(newPreferences);

        t.equal(response.status, 200);
        t.equal(response.body.msg, 'Preferences updated successfully.');
        // Verify update
        t.equal(response.body.preferences.keyword, 'bitcoin');
        t.same(response.body.preferences.language, ['eng', 'deu']);
    });

    await t.test('GET /api/v1/user/preferences (Updated)', async (t) => {
        const response = await server
            .get('/api/v1/user/preferences')
            .set('Authorization', `Bearer ${token}`);

        t.equal(response.status, 200);
        t.equal(response.body.preferences.keyword, 'bitcoin');
    });

    await t.test('GET /api/v1/user/preferences without token', async (t) => {
        const response = await server.get('/api/v1/user/preferences');
        t.equal(response.status, 401);
    });
});
