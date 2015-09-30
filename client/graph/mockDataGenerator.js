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