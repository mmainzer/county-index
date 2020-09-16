const width = $('#chartContainer').width();
const height = $( window ).height() * 0.8;
let svg = d3
			.select("#chartContainer")
			.append("svg")
			.attr("height", height)
			.attr("width", width);

d3.csv('https://raw.githubusercontent.com/mmainzer/county-index/master/data/final/scoresTable.csv').then((data) => {

	console.log(data);
	let categories = Array.from(new Set(data.map((d) => d.Category)));

	let yCoords = categories.map((d, i) => (height*0.17) + i * (height*0.17));
	let yScale = d3.scaleOrdinal().domain(categories).range(yCoords);

	let xScale = d3
					.scaleLinear()
					.domain(d3.extent(data.map((d) => +d['Score'])))
					.range([50, width - 50]);

	let color = d3.scaleOrdinal().domain(categories).range(d3.schemePaired);

	// let popDomain = d3.extent(data.map( (d) => ( d["Population"] ) ) );
	// popDomain = popDomain.map((d) => Math.sqrt(d));
	// let size = d3.scaleLinear().domain(popDomain).range([5, 30]);
	
	// const y = d3.scaleBand().rangeRound([0, height]);
	

	// const yAxisLeft = d3.axisLeft(y).tickSize(0);

	// const yAxisRight = d3.axisRight(y).tickSizeOuter(0).tickSizeInner(-width);


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
	    .attr( "r", 7 )
	    .attr("cx", (d) => xScale(d.Score))
	    .attr("cy", (d) => yScale(d.Category));

	$("#scoreSubmit").click(function(){
        score = ( ( $('#econRange').val() * 0.3 ) + ( $('#eduRange').val() * 0.3 ) + ( $('#healthRange').val() * 0.2 ) + ( $('#oppRange').val() * 0.2 ) );
		score = score.toFixed(1);
        $('#guessScoreLabel').text(score);
        county = $("#select2-fill-select-container").text();
        let actual = scoresObj[county].Composite;
        let difference = ( actual - score ).toFixed(1);
        county = county.replace(/\s/g , "-");
        if (difference > 0 ) {
        	$("#scorePlace").text("underestimated");
        } else if (difference < 0 ) {
        	$("#scorePlace").text("overestimated");
        } else {
        	$("#scoreExplain").text("You got it exactly right!");
        }

        // color the circles of the selected county
        $("."+county).attr("fill", "rgba(0, 188, 241, 0.6)");

        // console.log(data);
        // create an object for the new scores
        let newData = [
			        	{ County: "My-Selection", Category: "Composite", Population: "NA", Score: score },
			        	{ County: "My-Selection", Category: "Economy", Population: "NA", Score: $('#econRange').val() },
			        	{ County: "My-Selection", Category: "Education", Population: "NA", Score: $('#eduRange').val() },
			        	{ County: "My-Selection", Category: "Health", Population: "NA", Score: $('#healthRange').val() },
			        	{ County: "My-Selection", Category: "Opportunity", Population: "NA", Score: $('#oppRange').val() }
			        ];
		newData.forEach(entry => {
			data.push(entry);
		});
		// console.log(newData);

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


        $("#differenceLabel").text(Math.abs( difference ) + " points");
        $('#actualScoreLabel').text(actual);
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

