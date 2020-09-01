const width = 1920;
const height = 1080;
let svg = d3
			.select("#chartContainer")
			.append("svg")
			.attr("height", height)
			.attr("width", width);

d3.csv('https://raw.githubusercontent.com/mmainzer/county-index/master/data/final/scoresTable.csv').then((data) => {
	
});

