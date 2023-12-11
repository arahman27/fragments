// tests/unit/put.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments/id', () => {

  test('Authenticated user can update fragment', async () => {
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('fragment').set('content-type', 'text/plain');

    const fragmentId = res.body.fragments.id;

    const update = await request(app).put(`/v1/fragments/${fragmentId}`).auth('user1@email.com', 'password1').send('updated fragment value').set('content-type', 'text/plain');

    expect(update.statusCode).toBe(201);
    expect(update.body.status).toBe('ok');
    expect(update.body.fragments != null).toBe(true);
  });

  test('Invalid fragment id', async () => {
    await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('abcdefg').set('content-type', 'text/plain');

    const update = await request(app).put('/v1/fragments/123').auth('user1@email.com', 'password1').send('update').set('content-type', 'text/plain');

    expect(update.statusCode).toBe(401);
  });
});
