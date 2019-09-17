// Create a map object
var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 2
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: "pk.eyJ1IjoicGF0ZXNvaCIsImEiOiJjanpmbW81a3kwY3VuM2hxNnYxemdxcmxoIn0.CxhothartepQEhL-J1Sz1Q"
}).addTo(myMap);


// Perform an API call to the USGS Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // style "circle" markers such that radius of the circle is based on the magnitude ("mag") feature of the earthquake
  console.log(data);
  
  function styleInfo(feature) {
    return {
      fillOpacity:0.6,
      color: "#000",
      radius: getRadius(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      stroke: true,
      weight: 1.0
    };
  }


// colors for different magnitude ranges
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#900C3F";
    case magnitude > 4:
      return "#C70039";
    case magnitude > 3:
      return "#FF5733";
    case magnitude > 2:
      return "#FFC300";
    case magnitude > 1:
      return "#DAF7A6";
    case magnitude > 0:
      return "#F0E6E4"
    }
  }
//multiply magnitude by 3.5 so circles are a decent size
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3.5;
  }

// Add a geoJSON layer to map, turn each earthquake recorded (or feature) into a circle marker, use markerradius styling created above
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    //add a popup feature for each marker to display location and magnitude
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Location: " + feature.properties.place + "<br>Date-Time: " + Date(feature.properties.time) + "<br>Magnitude: " + feature.properties.mag)
    }
  }).addTo(myMap);



// Create legend control object

var legend = L.control({
    position: "bottomleft"
  });


// create a box (bew "div" in html) to hold legend details
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend"),
      magnitudes = [0, 1, 2, 3, 4, 5],
      labels = [];

  

  // loop through the arrays above to generate a different colored label for the specific magnitude ranges
  div.innerHTML += "<strong><h3>Magnitudes</h3></strong>"
  for (var i=0; i<magnitudes.length; i++) {
    div.innerHTML += 
    '<i style="background: ' + getColor(magnitudes[i] + 1) + '">&nbsp&nbsp&nbsp</i>  ' +
     magnitudes[i] + (magnitudes[i+1] ? '&ndash;' + magnitudes[i+1] + '<br>' : '+');
  }
  return div;
  };

 //add legend to the map
  legend.addTo(myMap);

  
})







  