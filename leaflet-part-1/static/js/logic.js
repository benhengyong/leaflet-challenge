//url link to json data for earthquakes
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

//create the map as shown in the challenge page
let myMap = L.map("map", {
    center: [0, 100],
    zoom: 2.5
  });
//add tile layer to display details of countries
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

function colorFunction(depth) {
  color = "";
  if (depth <= 10 ){
    color = "#DAF7A6";
  } else if (depth <= 30) {
    color = '#FFC300';
  } else if (depth <= 50) {
    color = '#FF5733';
  } else if (depth <= 70) {
    color = '#C70039';
  } else if (depth <= 90) {
    color = '#900C3F';
  } else {
    color = '#581845';
  }
  return color;
};

//use d3 to read in the json data
d3.json(url).then(function(response) {
    let features = response.features;

    let markers = [];

    for (let i = 0; i < features.length; i++) {

        let location = features[i].geometry;
        if(location){
          markers[i] = L.circle([location.coordinates[1], location.coordinates[0]], {
            color: colorFunction(location.coordinates[2]),
            fillOpacity: 0.75,
            radius: features[i].properties.mag**8
          }).addTo(myMap).bindPopup("<h1>" + features[i].properties.place +"</h1> <hr> <h2> Magnitude:" + 
          features[i].properties.mag + "</h2> <hr> <h2> Depth:" + location.coordinates[2]+"</h2>");
        }
    }
});

// Set up the legend.
let legend = L.control({ position: "bottomright" });

legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [];

  // generate a label with a colored square for each interval
  colorNumber = 0;
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colorFunction(grades[i] +1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      colorNumber += 20;
  }

  return div;
};
// Adding the legend to the map
legend.addTo(myMap);


  