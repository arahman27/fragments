const request = require('supertest');

const app = require('../../src/app');

describe('/ App check', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/ABC');
    expect(res.statusCode).toBe(404);
  });
});
