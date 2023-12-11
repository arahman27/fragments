// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/id', () => {

  test('Authenticated user can find valid fragment without extension', async () => {
    const fragmentPost = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('fragment').set('content-type', 'text/plain');

    const fragmentId = fragmentPost.body.fragments.id;

    const res = await request(app).get(`/v1/fragments/${fragmentId}`).auth('user1@email.com', 'password1');
    expect(res.status).toBe(201);

  });

  test('Authenticated user can find valid fragment with extension', async () => {
    const fragmentPost = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('fragment').set('content-type', 'text/plain');

    const fragmentId = fragmentPost.body.fragments.id;

    const res = await request(app).get(`/v1/fragments/${fragmentId}.txt`).auth('user1@email.com', 'password1');
    expect(res.status).toBe(201);

  });

  test('Invalid conversion type', async () => {
    const fragmentPost = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('fragment').set('content-type', 'text/plain');

    const fragmentId = fragmentPost.body.fragments.id;

    const res = await request(app).get(`/v1/fragments/${fragmentId}.png`).auth('user1@email.com', 'password1');
    expect(res.status).toBe(401);

  });

});
