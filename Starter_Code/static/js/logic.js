// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

});


function createFeatures(earthquakeData) {

    var circ;
    var color;
    

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}
    </p><br><p>Magnitude: ${feature.properties.mag}</p><br><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    console.log(feature)

    if(feature.geometry.coordinates[2] < 10 && feature.geometry.coordinates[2]>=-10) {
        color =  "#a3f600"
    } else if(feature.geometry.coordinates[2] < 30) {
        color = "#dcf400"
    } else if (feature.geometry.coordinates[2] < 50) {
        color = "#f7db11"

    } else if (feature.geometry.coordinates[2] < 70) {
        color = "#fdb72a"
        
    } else if (feature.geometry.coordinates[2] < 90) {
        color = "#fca35d"
        
    } else if (feature.geometry.coordinates[2] >= 90) {
        color = "#ff5f65"
        
    }
    circ = feature.properties.mag *3.5

    
  }
  

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

  // code is from https://leafletjs.com/examples/geojson/
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions = {
            radius: circ,
            fillColor: color,
            color: "#000",
            weight: 0.2,
            opacity: 1,
            fillOpacity: 0.8
        })
    
    }
  });
  

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
//code from https://codepen.io/haakseth/pen/KQbjdO
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");

  div.innerHTML += '<i style="background: #a3f600"></i><span>-10—10</span><br>';
  div.innerHTML += '<i style="background: #dcf400"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #f7db11"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #fdb72a"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #fca35d"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #ff5f65"></i><span>+90</span><br>';
  
  
  

  return div;
};





  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
 
  legend.addTo(myMap);

}



