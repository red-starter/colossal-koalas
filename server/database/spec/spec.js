var chai = require('chai');
var expect = chai.expect;

var db = require('../interface');

describe('Models', function() {
  this.timeout(4000); 

  before(function(done) {
    this.timeout(10000);
    db.init().then(function() {
      done();
    });
  });

  describe('User', function() {

    it('should save to the database with username and password', function(done) {
      db.User.create({ name: 'Mike', password: '123' })
        .then(function(user) {
          expect(user).not.to.be.null;
          expect(user.name).to.equal('Mike');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    }); // Closes 'it should save to the database with username and password'

    it('should hash the password upon creation', function(done) {
      db.User.findOne({ name: 'Mike' })
        .then(function(user) {
          expect(user.password).to.be.ok;
          expect(user.password).to.not.equal('123');
          done();
        })
        .catch(function(err) {
          done(err)
        });
    }); // Closes 'it should hash the password upon creation'

    it('should allow comparison to the original password', function(done) {
      db.User.findOne({ name: 'Mike' })
        .then(function(user) {
          user.comparePassword('666')
            .then(function(match) {
              expect(match).to.be.false;
            })
            .then(function() {
              return user.comparePassword('123');
            })
            .then(function(match) {
              expect(match).to.be.true;
              done();
            })
            .catch(function(err) {
              done(err);
            });
        })
    }); // Closes 'it should allow comparison to the original password'

  }); // Closes User suite

  describe('Entry', function() {

    it('should save to the database with emotion, text, and a user', function(done) {
      db.User.findOne({ name: 'Mike' })
        .then(function(user) {
          return db.Entry
            .create({ emotion: 7, text: 'Surf is bad this week' })
            .then(function(entry) {
              entry.setUser(user);
            })
            .then(function() {
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    }); // Closes 'it should save to the database with emotion, text, and a user'

  }); // Closes Entry suite

  // TODO: Prompt tests?

}); // Closes Models suite
