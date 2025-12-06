const tap = require('tap');
const supertest = require('supertest');
const app = require('../index');
const { connectDB, closeDB, clearDB } = require('./helper');

const server = supertest(app);

const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
};

tap.before(async () => {
    await connectDB();
    await clearDB();
});

tap.teardown(async () => {
    await closeDB();
});

tap.test('Auth Routes', async (t) => {

    await t.test('POST /api/v1/auth/register', async (t) => {
        const response = await server
            .post('/api/v1/auth/register')
            .send(mockUser);

        t.equal(response.status, 201, 'Should return 201 Created');
        t.hasOwnProp(response.body, 'token', 'Should return a token');
        t.hasOwnProp(response.body.user, 'id', 'Should return user id');
    });

    await t.test('POST /api/v1/auth/register with existing email', async (t) => {
        const response = await server
            .post('/api/v1/auth/register')
            .send(mockUser);

        t.equal(response.status, 400, 'Should return 400 Bad Request');
        t.match(response.body.msg, /User already exists/, 'Should return correct error message');
    });

    await t.test('POST /api/v1/auth/login', async (t) => {
        const response = await server
            .post('/api/v1/auth/login')
            .send({
                email: mockUser.email,
                password: mockUser.password
            });

        t.equal(response.status, 200, 'Should return 200 OK');
        t.hasOwnProp(response.body, 'token', 'Should return a token');
    });

    await t.test('POST /api/v1/auth/login with wrong password', async (t) => {
        const response = await server
            .post('/api/v1/auth/login')
            .send({
                email: mockUser.email,
                password: 'wrongpassword'
            });

        t.equal(response.status, 400, 'Should return 400 Bad Request'); // Controller returns 400 for invalid creds
    });
});
