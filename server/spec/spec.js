var expect = require('chai').expect;
var request = require('supertest')('http://localhost:8080');

describe('Moodlet server API', function() {

  it('should accept submissions of new users with POST on /api/users', function(done) {

    request.post('/api/users')
      .send({ username: 'Mike', password: '123'})
      .expect(201, done);

  }); // Closes 'it should accept submissions of new users'

  it('should accept submissions of new entries with POST on /api/users/:username/entries', function(done) {

    request.post('/api/users/Mike/entries')
      .send({ emotion: 1, text: 'Beer' })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err)
        } else {
          request.post('/api/users/Mike/entries')
            .send({ emotion: 5, text: 'Cloudy' })
            .expect(200, done)
        }
      });

  }); // Closes 'it should accept submissions of new entries'

  it('should allow retrieval of all of a user\'s entries with GET on /api/users/:username/entries', function(done) {

    request.get('/api/users/Mike/entries')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        expect(res.body.length).to.equal(2);
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });

  }); // Closes 'it should allow retrieval of all of a user's entries'

  it('should allow retrieval of a single entry with GET on /api/users/:username/entries/:entryid', function(done) {

    request.get('/api/users/Mike/entries/2')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        expect(res.body.emotion).to.equal(5);
        expect(res.body.text).to.equal('Cloudy');
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });

  }); // Closes 'it should allow retrieval of a single entry'

  it('should allow modification of a single entry with PUT on /api/users/:username/entries/:entryid', function(done) {

    request.put('/api/users/Mike/entries/1')
      .send({ emotion: 3 })
      .expect(200)
      .expect(function(res) {
        expect(res.body.emotion).to.equal(3);
        expect(res.body.text).to.equal('Beer');
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });

  }); // Closes 'it should allow modification of a single entry'

  it('should allow deletion of a single entry with DELETE on /api/users/:username/entries/:entryid', function(done) {

    request.delete('/api/users/Mike/entries/2')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          request.get('/api/users/Mike/entries/2')
            .expect(404, done);
        }
      });

  }); // Closes 'it should allow deletion of a single entry'


}); // Closes 'Moodlet server API;