var graph = angular.module('greenfeels.graph',[]);

graph.controller('GraphController',
	['Auth','Entries','$scope','$window',function ( Auth, Entries, $scope,$window ){

		var signedIn = false;
	//get data off of controller
	//stub some data
	//only run this in testing mode ro protect db, signup fakeuser, post some data,then retrieve into an array
	var createFakeDBData = function(){
		var user = {username:'fakeUser1',password:'1234'};
		Auth.signup(user)
		.then(function (token) {
	        // Store session token for access to secured endpoints
	        $window.localStorage.setItem('moodlet', token);
	        // Store plaintext username for use as a URL parameter in ajax requests
	        $window.localStorage.setItem('moodlet.username', user.username);
	    })
		.catch(function(error) {
			// console.log(error);
			//already signed in 
			if (error.status === 409){
				console.log('already signed up')
				signedIn = true;
				return Auth.signin(user).then(function (token) {
		    		// Store session token for access to secured endpoints
		    		$window.localStorage.setItem('moodlet', token);
			        // Store plaintext username for use as a URL parameter in ajax requests
			        $window.localStorage.setItem('moodlet.username', user.username);
			    })
			}
		})
		.then(function(){
			var promiseArr = [];
			if (!signedIn){
				_.times(8,function(){
					promiseArr.push(Entries.addEntry({emotion: parseInt(Math.random()*8),text:faker.lorem.paragraph()}))
				})
			}
			return Promise.all(promiseArr)
		})				
		.then(function(){
			return Entries.getAll()
		})
		.then(function(data){
			console.log(data)
			//change createdAt to be over the scale of a year? is there a better way?
			_.each(data,function(element){
				element.createdAt = faker.date.recent();
			})
			//have to sort cuz now faking data again
			data.sort(function(a,b){
				return changeDateToDaysAgo(a.createdAt) - changeDateToDaysAgo(b.createdAt);
			})

			var parameters = initializeGraphParameters(data);
			generateAxis(parameters);
			generateLine(parameters);
			generateCircles(parameters);
		})      	
	}() //immediately invoke


	var initializeGraphParameters = function(data){
		//container 
		var parameters = {};
		parameters.data = data;

		//create svg
		var options ={
			width:1000,
			height:600,
			margin:50
		};

		parameters.options = options;
		//svg selector 
		var svg = d3.select("#graph1").append("svg")
		.attr("width",options.width)
		.attr("height",options.height)

		parameters.svg = d3.select('svg');
		data = parameters.data;
		//or updatedAt?
		var timeRange = _.pluck(data,'createdAt');
		// var daysAgoRange = changeArrayDateToDaysAgo(timeRange); 

		var emotionRange = _.pluck(data,'emotion');
		var bodyRange = _.map(data,function(element){
			return element.text.length
		})
		// console.log(bodyRange)

		//choose x axis and y axis
		// var xAxisArr = daysAgoRange;
		var yAxisArr = emotionRange;
		var sizeArr = bodyRange;
		var colorArr = emotionRange;
		parameters.mapX = d3.time.scale().domain(d3.extent(timeRange)).range([options.width-options.margin,options.margin]);
		parameters.mapY = d3.scale.linear().domain(d3.extent(yAxisArr)).range([options.margin,options.height - options.margin]);

		parameters.mapRadius = d3.scale.sqrt().domain(d3.extent(sizeArr)).range([0,20])
		// mapOpacity = d3.scale.linear().domain([d3.min(opacityArr),d3.max(opacityArr)]).range([0.5,1]);
		parameters.mapColor = d3.scale.category10().domain(colorArr).range(['#FF0000', ,'#FF1100','#FF2200','#FF3300','#FF4400','#FF5500','#FF6600','#FF7700','#FF8800','#FF9900','#FFAA00','#FFBB00','#FFCC00','#FFDD00','#FFEE00','#FFFF00','#EEFF00','#DDFF00','#CCFF00','#BBFF00','#AAFF00','#99FF00','#88FF00','#77FF00','#66FF00','#55FF00','#44FF00','#33FF00','#22FF00','#11FF00','#00FF00'].reverse())

		return parameters;
	}
	var generateAxis = function(parameters){

		//grab references from graph parameters
		var svg = parameters.svg
		var mapX = parameters.mapX
		var mapY = parameters.mapY
		var data = parameters.data;
		var options = parameters.options;


		var xAxis = d3.svg.axis()
		.scale(mapX) //where to orient numbers
		.orient('bottom') 

		// var yAxis = d3.svg.axis()
		// .scale(mapY)
		// .tickValues([])
		// .orient('left')

		//clear previous append
		svg.selectAll("g").remove()
		svg.selectAll(".h").remove()
		svg.selectAll(".v").remove()

		// use svg selector, add axis to svg as a collection of g elements
		svg.append("g")
		.attr('class','axis')
		.attr('transform','translate(0,'+ (options.height- options.margin) +')')
		.call(xAxis)
		// call with the yAxis function
		// svg.append("g")
		// .attr("class", "axis")
		// .attr("transform", "translate(" + (options.margin) + ",0)")
		// .call(yAxis);


		//fix later
		//create horizontal lines
		// svg.selectAll(".h").data(d3.range(-8,10,1)).enter()
		// .append("line").classed("h",1)
		// .attr("x1",options.margin).attr("x2",options.height-options.margin)
		// .attr("y1",mapY).attr("y2",mapY)
		// //create vertical lines
		// svg.selectAll(".v").data(d3.range(1,5)).enter()
		// .append("line").classed("v",1)
		// .attr("y1",options.margin).attr("y2",options.width-options.margin)
		// .attr("x1",mapX).attr("x2",mapX)
		 //refresh page with new axiss
		}



	//clear graph first
	var generateCircles = function(parameters){

		var svg = parameters.svg
		var mapX = parameters.mapX
		var mapY = parameters.mapY
		var mapOpacity = parameters.mapOpacity
		var mapRadius = parameters.mapRadius
		var mapColor = parameters.mapColor
		var data = parameters.data;
		var options = parameters.options;
		var emojiByInteger = ['😄', '😊', '😌', '😐', '😕', '😒', '😞', '😣'];


		svg.selectAll(".emojiText").remove()
		svg.selectAll(".emojiText").data(data,function(e,index){return index})
		.enter()
		.append("text")
		.attr('class','emojiText')
		.attr('x',function(d){return mapX(d["createdAt"])})
		.attr('y',function(d){return mapY(+d["emotion"])})
		.text(function(d){
			return emojiByInteger[+d["emotion"]];
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "30px")
		.on("mouseover", function(d) {
			d3.select(this).attr('opacity',0.3)
		})
		.on("mouseout", function(d) {
			d3.select(this).attr('opacity',1)
		})
		.on('click',function(d){
			d3.select('#graphText').text(d.text)
		})
		.append('title')
		.text(function(d){return moment(d["createdAt"]).fromNow()+" emotion"+d["emotion"]})	
	}

	var generateLine = function(parameters){
		var svg = parameters.svg
		var mapX = parameters.mapX
		var mapY = parameters.mapY
		var data = parameters.data;
		var options = parameters.options;

		var line = d3.svg.line()
		.interpolate("monotone")
		.x(function(d,i) {return mapX(d["createdAt"])})
		.y(function(d,i) {return mapY(+d["emotion"])})

		var path = svg.append("path")
		.attr("d", line(data))
		.attr("stroke", "steelblue")
		.attr("stroke-width", "2")
		.attr("fill", "none");

		var totalLength = path.node().getTotalLength();

		path
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(2000)
		.ease("linear")
		.attr("stroke-dashoffset", 0);
	}
}])