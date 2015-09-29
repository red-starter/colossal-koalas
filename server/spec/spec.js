var expect = require('chai').expect;
var request = require('supertest')('http://localhost:8080');

describe('Moodlet server API', function() {

  it('should accept submissions of new users on api/users', function(done) {

    request.post('/api/users')
      .send({ username: 'Mike', password: '123'})
      .expect(201, done);

  });

})