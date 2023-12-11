// tests/unit/getInfo.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/id/info', () => {

  test('Authenticated user can get metadata of fragment', async () => {
    const fragmentPost = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('fragment').set('content-type', 'text/plain');

    const fragmentId = fragmentPost.body.fragments.id;

    const res = await request(app).get(`/v1/fragments/${fragmentId}/info`).auth('user1@email.com', 'password1');
    expect(res.status).toBe(201);

  });

  test('Trying to get metadata of invalid fragment', async () => {
    await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('fragment').set('content-type', 'text/plain');

    const res = await request(app).get(`/v1/fragments/123/info`).auth('user1@email.com', 'password1');
    expect(res.status).toBe(401);

  });
});
