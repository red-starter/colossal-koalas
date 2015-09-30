//this file set the environment to testing and abuses the database, is wrapped for safety
var request = require('request')

var  mockData = function(){
	process.env.NODE_DB_ENV = 'testing'

	//do some signup so we can access the db

	var formData = { username: 'Mike', password: '123'}

    request.post({url:'http://localhost:8080/api/users',formData:formData},function(err,response,body){
    	if(err){
    		return console.err('err',err)
    	}
    	console.log('success ',body);

    })




  //     .send({ username: 'Mike', password: '123'})
  //     .expect(201)
  //     .end(function(err, res) {
  //       if (err) {
  //         done(err);
  //       } else {
  //         if (res.body.success) {
  //           token = res.body.token;
  //           done();
  //         }
  //       }
  //     });

  // }); // Closes 'it should accept submissions of new users'

  // it('should have issued a token upon creation of new user', function() {
  //   expect(token).to.be.ok;
  // });

  // it('should accept submissions of new entries with POST on /api/users/:username/entries', function(done) {

  //   request.post('/api/users/Mike/entries')
  //     .set('x-access-token', token)
  //     .send({ emotion: 1, text: 'Beer' })
  //     .expect(200)
  //     .end(function(err, res) {
  //       if (err) {
  //         done(err)
  //       } else {
  //         request.post('/api/users/Mike/entries')
  //           .send({ emotion: 5, text: 'Cloudy' })
  //           .expect(200, done)
  //       }
  //     });


	var stubData = function(num){
		var stubData = []
	  //post {emotion:1-7 ,text:200 words,data,date:0-100 days ago}
	  _.times(num,function(){
	  	var stub ={}
	  	stub.emotion = parseInt(Math.random()*8)
	  	stub.date = faker.date.past()
	  	stub.body = faker.lorem.paragraph()
	  	stubData.push(stub);
	  })
	  return stubData;
	}
	var changeArrayDateToDaysAgo =function(arr){
		var now = new Date();
		var res = []
		_.each(arr,function(date){
			var then = new Date(date)
			var daysAgo = (now.getTime() - then.getTime())/(1000*60*60*24);
			res.push(parseInt(daysAgo));  
		});
		return res;

	}
	var changeDateToDaysAgo =function(date){
		var then =new Date(date);
		var now = new Date();
		var daysAgo = (now.getTime() - then.getTime())/(1000*60*60*24);
		return parseInt(daysAgo);
	}



}