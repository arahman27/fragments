// tests/unit/delete.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments/id', () => {

  test('Authenticated user can delete a fragment', async () => {
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('delete me').set('content-type', 'text/plain');

    const fragmentId = res.body.fragments.id;

    const deleteFragment = await request(app).delete(`/v1/fragments/${fragmentId}`).auth('user1@email.com', 'password1');

    expect(deleteFragment.statusCode).toBe(201);
    expect(deleteFragment.body.status).toBe('ok');
  });

  test('Cannot delete invalid fragment id', async () => {
    await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send('delete me').set('content-type', 'text/plain');

    const deleteFragment = await request(app).delete('/v1/fragments/123').auth('user1@email.com', 'password1');

    expect(deleteFragment.statusCode).toBe(401);
  });
});
