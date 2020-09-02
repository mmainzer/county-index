const width = $('#chartContainer').width();
const height = $( window ).height() * 0.8;
let svg = d3
			.select("#chartContainer")
			.append("svg")
			.attr("height", height)
			.attr("width", width);

d3.csv('https://raw.githubusercontent.com/mmainzer/county-index/master/data/final/scoresTable.csv').then((data) => {

	let categories = Array.from(new Set(data.map((d) => d.Category)));

	let yCoords = categories.map((d, i) => (height*0.17) + i * (height*0.17));
	let yScale = d3.scaleOrdinal().domain(categories).range(yCoords);

	let xScale = d3
					.scaleLinear()
					.domain(d3.extent(data.map((d) => +d['Score'])))
					.range([width - 50, 50]);

	let color = d3.scaleOrdinal().domain(categories).range(d3.schemePaired);

	let popDomain = d3.extent(data.map( (d) => ( d["Population"] ) ) );
	console.log(popDomain);
	popDomain = popDomain.map((d) => Math.sqrt(d));
	let size = d3.scaleLinear().domain(popDomain).range([5, 30]);
	console.log(size);

	svg.selectAll(".circ")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("class", "circ")
	    .attr("stroke", "black")
	    .attr("fill", (d) => color(d.Category))
	    .attr( "r", (d) => 7 )
	    .attr("cx", (d) => xScale(d.Score))
	    .attr("cy", (d) => yScale(d.Category));


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
	    d3.selectAll(".circ")
	        .attr("cx", (d) => d.x)
	        .attr("cy", (d) => d.y);
	    }

	let init_decay = setTimeout(function () {
		    console.log("start alpha decay");
		    simulation.alphaDecay(0.1);
	    }, 1000); // start decay after 3 seconds

	$('#chartContainer').hide();

});

