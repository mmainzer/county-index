const width = $('#chartContainer').width();
const height = $( window ).height() * 0.8;
let svg = d3
			.select("#chartContainer")
			.append("svg")
			.attr("height", height)
			.attr("width", width);

d3.csv('https://raw.githubusercontent.com/mmainzer/county-index/master/data/final/scoresTable.csv').then((data) => {

	let radius = 12;
	let categories = Array.from(new Set(data.map((d) => d.Category)));

	let yCoords = categories.map((d, i) => (height*0.17) + i * (height*0.17));
	let yScale = d3.scaleOrdinal().domain(categories).range(yCoords);

	let xScale = d3
					.scaleLinear()
					.domain(d3.extent(data.map((d) => +d['Score'])))
					.range([110, width-50]);

	let color = d3.scaleOrdinal().domain(categories).range(d3.schemePaired);

	const yAxisLeft = d3.axisLeft(yScale);
	const yAxisRight = d3.axisRight(yScale).tickSizeOuter(0).tickSizeInner(-width+(width*0.091));

	// const yAxisRight = d3.axisRight(y).tickSizeOuter(0).tickSizeInner(-width);


	svg.append("g")
			.attr("transform", `translate(90,0)`)
			.attr("class", "axis y left")
			.call(yAxisLeft)
			.append("text")
				.attr("x", -90)
		        .attr("y", 10)
		        .attr("fill", "none")
		        .attr("text-anchor", "start")

	svg.append("g")
			.attr("transform", "translate("+width+",0)")
			.attr("class", "axis y right")
			.call(yAxisRight)


	// create a way to hover over the dots to get their attributes
	let tooltip = d3.select("body")
						.append("div")
						.attr("class", "popup")
						.style("position", "absolute")
						.style("z-index", "10")
						.style("display", "none");

	tooltip
		.append("h5")
		.attr("class","popup-header")
		.classed("popup-content", true)
		.text("A tooltip header");
	tooltip
		.append("p")
		.attr("class","popup-description")
		.classed("popup-content", true)
		.text("This is the category score");

	svg.selectAll(".circ")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("value", (d) => d.Score)
	    .attr("category", (d) => d.Category)
	    .attr("class", (d) => d.County.replace(/\s/g , "-"))
	    .attr("stroke", "#4d4d4d")
	    .attr("fill", "#e8e8e8")
	    .attr( "r", 6.5 )
	    .attr("cx", (d) => xScale(d.Score))
	    .attr("cy", (d) => yScale(d.Category));

	// put a title at the top of the svg
	svg.append("text")
		.attr("class", "chart-title")
		.attr("x", width/2)
		.attr("y", 0 )
		.attr("text-anchor","middle")
		.text("Title Here")

	

	$("#scoreSubmit").click(function(){
        score = ( ( $('#econRange').val() * 0.3 ) + ( $('#eduRange').val() * 0.3 ) + ( $('#healthRange').val() * 0.2 ) + ( $('#oppRange').val() * 0.2 ) );
		score = score.toFixed(1);

		// the guessed score needs to be assigned a category as a placeholder

		// you don't need the difference displayed - just under/over estimated or correct

		// each component score needs to be 
        
        county = $("#select2-fill-select-container").text();
        let actual = scoresObj[county].CompQ;
        console.log(score, actual);
        let difference = ( actual - score ).toFixed(1);
        console.log(difference);


        

        county = county.replace(/\s/g , "-");
        if (difference > 0 ) {
        	$("#scorePlace").text("underestimated");
        } else if (difference < 0 ) {
        	$("#scorePlace").text("overestimated");
        } else {
        	$("#scoreExplain").text("You got it exactly right!");
        }

        //if selecting a new county, make sure all circles are colored grey again
        //this will avoid having the appearance of two selected counties
        svg.selectAll("circle")
        	.attr("fill", "#e8e8e8");

        // remove any guessed circles that may currently exist
        svg.selectAll(".My-Selection").remove();

        // color the circles of the selected county
        $("."+county).attr("fill", "rgba(0, 188, 241, 0.6)");

        // console.log(data);
        let compScore;
        let econScore;
        let eduScore;
        let healthScore;
        let oppScore;
        let scoreLabel;
        let actualLabel;

        if (score <= 1.5) {
        	compScore = 38.7;
        	scoreLabel = "Weak";
        } else if (score <= 2.5) {
        	compScore = 47.2;
        	scoreLabel = "Below Avg";
        } else if (score <= 3.5) {
        	compScore = 50.8;
        	scoreLabel = "Average";
        } else if (score <= 4.5) {
        	compScore = 56.4;
        	scoreLabel = "Above Avg";
        } else {
        	compScore = 73.5;
        	scoreLabel = "Strong";
        }

        if (actual <= 1.5) {
        	actualLabel = "Weak";
        } else if (actual <= 2.5) {
        	actualLabel = "Below Avg";
        } else if (actual <= 3.5) {
        	actualLabel = "Average";
        } else if (actual <= 4.5) {
        	actualLabel = "Above Avg";
        } else {
        	actualLabel = "Strong";
        }

        if ($('#econRange').val() <= 1.5) {
        	econScore = 25.8;
        } else if ($('#econRange').val() <= 2.5) {
        	econScore = 42;
        } else if ($('#econRange').val() <= 3.5) {
        	econScore = 48;
        } else if ($('#econRange').val() <= 4.5) {
        	econScore = 54;
        } else {
        	econScore = 55;
        }

        if ($('#eduRange').val() <= 1.5) {
        	eduScore = 34;
        } else if ($('#eduRange').val() <= 2.5) {
        	eduScore = 49.8;
        } else if ($('#eduRange').val() <= 3.5) {
        	eduScore = 54;
        } else if ($('#eduRange').val() <= 4.5) {
        	eduScore = 59.5;
        } else {
        	eduScore = 78;
        }

        if ($('#healthRange').val() <= 1.5) {
        	healthScore = 21;
        } else if ($('#healthRange').val() <= 2.5) {
        	healthScore = 35;
        } else if ($('#healthRange').val() <= 3.5) {
        	healthScore = 43;
        } else if ($('#healthRange').val() <= 4.5) {
        	healthScore = 49.5;
        } else {
        	healthScore = 75;
        }

        if ($('#oppRange').val() <= 1.5) {
        	oppScore = 38;
        } else if ($('#oppRange').val() <= 2.5) {
        	oppScore = 56;
        } else if ($('#oppRange').val() <= 3.5) {
        	oppScore = 63.5;
        } else if ($('#oppRange').val() <= 4.5) {
        	oppScore = 71;
        } else {
        	oppScore = 81;
        }



        // create an object for the new scores
        let newData = [
			        	{ County: "My-Selection", Category: "Composite", Population: "NA", Score: compScore },
			        	{ County: "My-Selection", Category: "Economy", Population: "NA", Score: econScore },
			        	{ County: "My-Selection", Category: "Education", Population: "NA", Score: eduScore },
			        	{ County: "My-Selection", Category: "Health", Population: "NA", Score: healthScore },
			        	{ County: "My-Selection", Category: "Opportunity", Population: "NA", Score: oppScore }
			        ];
		newData.forEach(entry => {
			data.push(entry);
		});

		console.log(newData);

		svg.selectAll('.circ')
		.data(newData)
		.join('circle')
		.attr("value", (d) => d.Score)
	    .attr("category", (d) => d.Category)
	    .attr("class", (d) => d.County)
	    .attr("stroke", "#4d4d4d")
	    .attr("fill", "#fdb714")
	    .attr( "r", 7 )
	    .attr("cx", (d) => xScale(d.Score))
	    .attr("cy", (d) => yScale(d.Category));

	    // create popup on hover
		$("circle").mouseover( function() {
		            let place = $(this).attr('class');
		            place = place.replace(/-/g, " ");
		            let score = $(this).attr('value');
		            let category = $(this).attr('category');
		            $(".popup-description").text(category+' Score: '+score);
		            $(".popup-header").text(place);
		            tooltip.style("display", "inline-block").style("left", (d3.pageX) + "px").style("top", (d3.pageY - 28) + "px");
		        }).mousemove( function() {
					tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");	        	
		        }).mouseout( function() {
		        	tooltip.style("display", "none");
		        });


        $('#guessScoreLabel').text(scoreLabel);
        $('#actualScoreLabel').text(actualLabel);
        $('.results-container').show();
        $('#chartContainer').css('display','inline-block');
        $('.table-container').show();
        $('.tableau-container').css("opacity",1);
    });

	let simulation = d3.forceSimulation(data)
					    .force("x", d3.forceX((d) => {
					        return xScale(d.Score);
					        }).strength(0.2))
					    .force("y", d3.forceY((d) => {
					        return yScale(d.Category);
					        }).strength(1))
					    .force("collide", d3.forceCollide((d) => {
					        return 7;
					        }))
					    .alphaDecay(0)
					    .alpha(0.3)
					    .on("tick", tick);

	function tick() {
	    d3.selectAll("circle")
	        .attr("cx", (d) => d.x)
	        .attr("cy", (d) => d.y);
	    }

	let init_decay = setTimeout(function () {
		    simulation.alphaDecay(0.1);
	    }, 1000); // start decay after 1 second

	$('#chartContainer').hide();

});

