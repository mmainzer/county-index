const width = 1920;
const height = 1080;
let svg = d3
			.select("#chartContainer")
			.append("svg")
			.attr("height", height)
			.attr("width", width);

let categories = ["Composite","Economy","Education","Health","Opportunity"];

let yCoords = categories.map((d, i) => 150 + i * 150);
let yScale = d3.scaleOrdinal().domain(categories).range(yCoords);

