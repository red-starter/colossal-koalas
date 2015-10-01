var graph = angular.module('greenfeels.graph',[]);

graph.controller('GraphController',
	['Auth','Entries','$scope','$window',function ( Auth, Entries, $scope,$window ){

		var data;
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
				signin = true;
				return Auth.signin(user).then(function (token) {
		    		// Store session token for access to secured endpoints
		    		$window.localStorage.setItem('moodlet', token);
			        // Store plaintext username for use as a URL parameter in ajax requests
			        $window.localStorage.setItem('moodlet.username', user.username);
			    })
			}
		}).then(function(){
			var promiseArr = [];
			if (!signin){
				_.times(8,function(){
					promiseArr.push(Entries.addEntry({emotion: parseInt(Math.random()*8),text:faker.lorem.paragraph()}))
				})
			}
			return Promise.all(promiseArr)
			})				
		}
		.then(function(data){
			data = data;
			console.log(data)
					// smoothLine();
					// genGraph();
					// initAxis();
				})
	})	      	
	}() //immediately invoke

	//replace with moment.js
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

	//create svg
	var options ={
		width:600,
		height:600,
		margin:50
	}
	//svg selector 
	var svg = d3.select("#graph1").append("svg")
	.attr("width",options.width)
	.attr("height",options.height)

	//or updatedAt?
	var timeRange = _.pluck(data,'createdAt');
	var daysAgoRange = changeArrayDateToDaysAgo(timeRange); 

	var emotionRange = _.pluck(data,'emotion');
	var bodyRange = _.map(data,function(element){
		console.log(data)
		return element.text.length
	})
	// console.log(bodyRange)

	//choose x axis and y axis
	var xAxisArr = daysAgoRange;
	var yAxisArr = emotionRange;
	var sizeArr = bodyRange;
	var colorArr = emotionRange;

	//grab values off of UserInput
	// var xAxisArr = _.pluck($scope.userInput,$scope.xaxis) 
	// var yAxisArr = _.pluck($scope.userInput,$scope.yaxis) 
	// var sizeArr = _.pluck($scope.userInput,$scope.size)
	// var opacityArr = _.pluck($scope.userInput,$scope.opacity)
	// console.log(xAxisArr,yAxisArr)
	//initialize mapping based on range of user input
	mapX = d3.scale.linear().domain(d3.extent(xAxisArr)).range([options.margin,options.width-options.margin]);
	mapY = d3.scale.linear().domain(d3.extent(yAxisArr)).range([options.height - options.margin,options.margin]);

	mapRadius = d3.scale.sqrt().domain(d3.extent(sizeArr)).range([0,20])
	// mapOpacity = d3.scale.linear().domain([d3.min(opacityArr),d3.max(opacityArr)]).range([0.5,1]);
	mapColor = d3.scale.category10().domain(colorArr).range(['#FF0000', ,'#FF1100','#FF2200','#FF3300','#FF4400','#FF5500','#FF6600','#FF7700','#FF8800','#FF9900','#FFAA00','#FFBB00','#FFCC00','#FFDD00','#FFEE00','#FFFF00','#EEFF00','#DDFF00','#CCFF00','#BBFF00','#AAFF00','#99FF00','#88FF00','#77FF00','#66FF00','#55FF00','#44FF00','#33FF00','#22FF00','#11FF00','#00FF00'].reverse())

	var initAxis = function(){


		var xAxis = d3.svg.axis()
		.scale(mapX) //where to orient numbers
		.orient('bottom') 

		var yAxis = d3.svg.axis()
		.scale(mapY)
		.orient('left')

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
		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (options.margin) + ",0)")
		.call(yAxis);
		//fix later
		//create horizontal lines
		svg.selectAll(".h").data(d3.range(-8,10,1)).enter()
		.append("line").classed("h",1)
		.attr("x1",options.margin).attr("x2",options.height-options.margin)
		.attr("y1",mapY).attr("y2",mapY)
		//create vertical lines
		svg.selectAll(".v").data(d3.range(1,5)).enter()
		.append("line").classed("v",1)
		.attr("y1",options.margin).attr("y2",options.width-options.margin)
		.attr("x1",mapX).attr("x2",mapX)
		 //refresh page with new axiss
		}



	//clear graph first
	var genGraph = function(){
		svg.selectAll("circle").remove()
		svg.selectAll("circle").data(data,function(e,index){return index})
		.enter()
		.append("circle")
		.attr('cx',function(d){return mapX(changeDateToDaysAgo(+d["date"]))})
		.attr('cy',function(d){return mapY(+d["emotion"])})
		.attr('r',function(d){return mapRadius(+d["text"].length)}) //sqrt makes negative
		.attr('fill',function(d){return mapColor(d["emotion"])})
		// .attr('opacity',function(d){return mapOpacity(d[$scope.opacity])})
		.on("mouseover", function(d) {
			d3.select(this).attr('opacity',0.3)
		})
		.on("mouseout", function(d) {
			d3.select(this).attr('opacity',1)
		})
		.append('title')
		.text(function(d){return d["text"]})	
	}

	var smoothLine = function(){
		var line = d3.svg.line()
		.interpolate("cardinal")
		.x(function(d,i) {return mapX(changeDateToDaysAgo(+d["date"]))})
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

		svg.on("click", function(){
			path      
			.transition()
			.duration(2000)
			.ease("linear")
			.attr("stroke-dashoffset", totalLength);
		})
	}
}])