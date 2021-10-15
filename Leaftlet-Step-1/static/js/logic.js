// Create a map object.
var quakeMap = L.map("map", {
    center: [37, -97],
    zoom: 3.6
});


// Add a copyright layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(quakeMap);

// Create the view layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };


// POPULATE QUAKE MARKERS
// API reports all earthquakes from the past 7 days
let queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

// request data and create markers using function/
d3.json(queryURL).then(data => {
    console.log('USGS API Data:', data.features)
    createFeatures(data.features);
});
  
function createFeatures(quakeData) {
    // Loop through the data and create a marker for each earthquake
    for (var i = 0; i < quakeData.length; i++) {
        let currQuake = quakeData[i].geometry;
        let currQuakeDepth =  currQuake.coordinates[2]  
        
        var color = ""; // conditional formatting for depth
        if (currQuakeDepth < 10) {
            color = "#90EE90";}
        else if (currQuakeDepth < 25) {
            color = "limegreen";}
        else if (currQuakeDepth < 75) {
            color = "yellow";}
        else if (currQuakeDepth < 100) {
            color = "orange";}
        else {
            color = "red";}
        
        // add circles to the map.
        let currQuakeProps = quakeData[i].properties
        L.circle([currQuake.coordinates[1],currQuake.coordinates[0]], {
            fillOpacity: 0.75,
            color: 'white',
            weight: .5,
            fillColor: color,
            radius: currQuakeProps.mag * 50000
        })
        .bindPopup(`<h2>${currQuakeProps.place}</h2> <hr> <h3>Magnitude: ${currQuakeProps.mag}</h3>`)
        .addTo(quakeMap);
    }
};

let legend = L.control({ position: "bottomright" });
legend.onAdd = () => {
    let div = L.DomUtil.create("div", "info legend");
    let legendInfo = "<p>Earthquake Depth <br> (kilometers)</p>" +
        "<div class=\"labels\">" +
        "</div>";
    div.innerHTML = legendInfo;
    let depthCats = ['< 10km','10 - 25km','25 - 75km','75 - 100km','> 100km'];
    let colors = ['#90EE90','limegreen','yellow','orange','red'];
    let labels = [];
    depthCats.forEach((a, i) => {
        labels.push("<li><div style=\"background-color: " + colors[i] + "\"></div>&nbsp;&nbsp;" + depthCats[i] + "</li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

legend.addTo(quakeMap);

// POPULATE LEGEND 

