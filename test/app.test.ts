import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /users', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/users')
      .expect(200, done);
  });
});
