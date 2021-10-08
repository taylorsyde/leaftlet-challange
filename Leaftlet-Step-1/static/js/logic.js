// Create a map object.
var myMap = L.map("map", {
    center: [37, -97],
    zoom: 3.6
});

// Add a copyright layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

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
        .addTo(myMap);
    }
};
        
//         // Define a function that we want to run once for each feature in the features array.
//         // Give each feature a popup that describes the place and time of the earthquake.
        
//         function onEachFeature(feature, layer) {
//             layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//         }
    
//         // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//         // Run the onEachFeature function once for each piece of data in the array.
//         var earthquakes = L.geoJSON(earthquakeData, {
//             onEachFeature: onEachFeature
//         });
    
//         // Send our earthquakes layer to the createMap function/
//         createMap(earthquakes);
  
//   function createMap(earthquakes) {
  
//     // Create the base layers.
//     var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     })
  
//     var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     });
  
//     // Create a baseMaps object.
//     var baseMaps = {
//       "Street Map": street,
//       "Topographic Map": topo
//     };
  
//     // Create an overlay object to hold our overlay.
//     var overlayMaps = {
//       Earthquakes: earthquakes
//     };
  
//     // Create our map, giving it the streetmap and earthquakes layers to display on load.
//     var myMap = L.map("map", {
//       center: [
//         37.09, -95.71
//       ],
//       zoom: 5,
//       layers: [street, earthquakes]
//     });
  
//     // Create a layer control.
//     // Pass it our baseMaps and overlayMaps.
//     // Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(myMap);
  
//   }

  
  
//   // Loop through the cities array, and create one marker for each city object.
//   for (var i = 0; i < countries.length; i++) {
  
//     // Conditionals for country points
//     var color = "";
//     if (countries[i].points > 200) {
//       color = "yellow";
//     }
//     else if (countries[i].points > 100) {
//       color = "blue";
//     }
//     else if (countries[i].points > 90) {
//       color = "green";
//     }
//     else {
//       color = "red";
//     }
  
//     // Add circles to the map.
//     L.circle(countries[i].location, {
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: color,
//       // Adjust the radius.
//       radius: Math.sqrt(countries[i].points) * 10000
//     }).bindPopup(`<h1>${countries[i].name}</h1> <hr> <h3>Points: ${countries[i].points}</h3>`).addTo(myMap);
//   }