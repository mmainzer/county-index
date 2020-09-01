

mapboxgl.accessToken = 'pk.eyJ1IjoibW1haW56ZXIiLCJhIjoiY2tkdWk4MmdsMTI3MzJ6bXB5bzZ0M28yeCJ9.uw-OOPrBDJFNu9dskLTbVA';

const map = new mapboxgl.Map({
	container: 'map', // container id
	style: 'mapbox://styles/mmainzer/ckdrv48fi0cl019n593vurl2t?latest=true', // stylesheetmapbox://styles/mmainzer/ck5r0lcgr0eti1iqiiglddux6
	center: [-84.3712,33.7737], // starting position [lng, lat]
	zoom: 9.0, // starting zoom
	scrollZoom: false
});

// Create a popup, but don't add it to the map yet.
const fillPopup = new mapboxgl.Popup({
	closeButton: false,
	closeOnClick: false
});

const pointPopup = new mapboxgl.Popup({
	closeButton: false,
	closeOnClick: false
});

// add zoom and rotation controls to the map
const nav = new mapboxgl.NavigationControl({showCompass:false});
map.addControl(nav, 'top-left');

// add another control at the bottom with a zoom to extent button
const resetIcon = "<button class='mapboxgl-ctrl-reset' type='button' title='Reset Map' aria-label='Reset Map'><span class='reset-map-icon' aria-hidden='true'><img class='reset-icon' src='../assets/images/map-regular.svg'></span></button>"
$(".mapboxgl-ctrl.mapboxgl-ctrl-group").append(resetIcon);
// after the map loads, bring in the source and layer you want displayed

map.on('load', function() {
	
	initPoints();

	map.addSource('fillSource', {
		type: 'vector',
		url: 'mapbox://mmainzer.8jigleg8?'
	});

	map.addLayer({
		'id':'boundaryLayer',
		'type':'line',
		'source':'fillSource',
		'layout': {
          'visibility':'visible',
        },
        'paint': {
        	'line-color':['case',['boolean',['feature-state','hover'],false],"#333","hsla(180, 100%, 92%, 0.6)"],
        	'line-width':['case',['boolean',['feature-state','hover'],false],2,0.1]
        },
        'source-layer':'reflectionZips'
	}, 'admin-0-boundary-disputed')

	map.addLayer({
		'id':'fillLayer',
		'type':'fill',
		'source':'fillSource',
		'layout': {
          'visibility':'visible',
        },
        'paint': {
        	'fill-color':[
						  "interpolate",["linear"],
						  ["get","zipData_Pct_2020_Jobs"],
						  0,"hsla(180, 100%, 92%, 0.6)",
						  0.838,"hsla(186, 71%, 85%, 0.6)",
						  1.675,"hsla(189, 62%, 78%, 0.6)",
						  2.513,"hsla(192, 59%, 71%, 0.6)",
						  3.35,"hsla(195, 58%, 65%, 0.6)",
						  4.188,"hsla(197, 57%, 58%, 0.6)",
						  5.025,"hsla(199, 57%, 52%, 0.6)",
						  5.863,"hsla(200, 67%, 45%, 0.6)",
						  6.7,"hsla(199, 100%, 36%, 0.6)"
						]
        },
        'source-layer':'reflectionZips'
	}, 'boundaryLayer');

});