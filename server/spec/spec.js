// Use `npm run test-start` to initiate testing db
var expect = require('chai').expect;
var request = require('supertest')('http://localhost:8080');

var db = require('../database/interface');

describe('Moodlet server API', function() {
  
  var token;

  this.timeout(4000);

  before(function(done) {
    this.timeout(10000);
    // Drops any existing tables
    db.init().then(function() {
      done();
    });
  });

  it('should accept submissions of new users with POST on /api/users', function(done) {

    request.post('/api/users')
      .send({
        username: 'Mike',
        password: '123'
      })
      .expect(201)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          if (res.body.success) {
            token = res.body.token;
            done();
          }
        }
      });

  }); // Closes 'it should accept submissions of new users'

  it('should have issued a token upon creation of new user', function() {
    expect(token).to.be.ok;
  });

  // TODO: add sign out tests

  it('should not sign in a user that doesn\'t exist', function(done) {

    request.post('/api/users/signin')
      .send({
        username: 'Cynthia',
        password: '123'
      })
      .expect(404)
      .end(function(err) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  }); // Closes 'it should not sign in a user that doesn\'t exist'

  it('should not sign in a user with an invalid password', function(done) {

    request.post('/api/users/signin')
      .send({
        username: 'Mike',
        password: 'beer'
      })
      .expect(404)
      .end(function(err) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  }); // Closes 'it should not sign in a user with an invalid password'

  it('should sign in an existing user with valid password', function(done) {

    request.post('/api/users/signin')
      .send({
        username: 'Mike',
        password: '123'
      })
      .expect(200)
      .end(function(err) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });

  }); // Closes 'it should sign in an existing user with valid password'

  it('should have issued a token upon signing in an existing user', function() {
    expect(token).to.be.ok;
  }); // Closes 'it should have issued a token upon signing in an existing user'

  it('should accept submissions of new entries with POST on /api/users/:username/entries', function(done) {

    request.post('/api/users/Mike/entries')
      .set('x-access-token', token)
      .send({
        emotion: 1,
        text: 'Beer'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err)
        } else {
          request.post('/api/users/Mike/entries')
            .send({
              emotion: 5,
              text: 'Cloudy'
            })
            .expect(200, done)
        }
      });

  }); // Closes 'it should accept submissions of new entries'


  it('should allow retrieval of all of a user\'s entries with GET on /api/users/:username/entries', function(done) {

    request.get('/api/users/Mike/entries')
      .set('x-access-token', token)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        expect(res.body.length).to.equal(2);
      })
      .end(done);

  }); // Closes 'it should allow retrieval of all of a user's entries'

  it('should allow retrieval of a single entry with GET on /api/users/:username/entries/:entryid', function(done) {

    request.get('/api/users/Mike/entries/2')
      .set('x-access-token', token)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        expect(res.body.emotion).to.equal(5);
        expect(res.body.text).to.equal('Cloudy');
      })
      .end(done);

  }); // Closes 'it should allow retrieval of a single entry'

  it('should allow modification of a single entry with PUT on /api/users/:username/entries/:entryid', function(done) {

    request.put('/api/users/Mike/entries/1')
      .set('x-access-token', token)
      .send({
        emotion: 3
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          request.get('/api/users/Mike/entries/1')
            .expect(200)
            .expect(function(res) {
              expect(res.body.emotion).to.equal(3);
              expect(res.body.text).to.equal('Beer');
            })
            .end(done);
        }
      });

  }); // Closes 'it should allow modification of a single entry'

  it('should allow deletion of a single entry with DELETE on /api/users/:username/entries/:entryid', function(done) {

    request.delete('/api/users/Mike/entries/2')
      .set('x-access-token', token)
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
