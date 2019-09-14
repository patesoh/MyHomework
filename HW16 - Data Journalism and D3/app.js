// @TODO: YOUR CODE HERE!

// setup the width, height and margin of the container box called 
// 'scatter' in the html file
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 85
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// canvas for the chart

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// Append group element
var chart = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Read CSV
d3.csv("data.csv")
.then(function(povertyData) {

  // parse data in columns of interest to esnure they are numbers
  povertyData.forEach(function(d) {
    d.poverty = +d.poverty;
    d.smokes = +d.smokes;
    console.log(d.poverty);
    console.log(d.smokes);
  });


  // create scales
  var xPovertyScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d.poverty)-1, d3.max(povertyData, d => d.poverty)+1])
    .range([0, width]);

  var ySmokesScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d.smokes)-3, d3.max(povertyData, d => d.smokes)+0.5])
    .range([height, 0]);

  // create axes and set number of ticks
  var xAxis = d3.axisBottom(xPovertyScale).ticks(8);
  var yAxis = d3.axisLeft(ySmokesScale).ticks(8);

  // append axes
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chart.append("g")
    .call(yAxis);

  // append circles
  var circlesGroup = chart.selectAll("circle").data(povertyData).enter();
  
  circleTool = circlesGroup.append("circle")
    .attr("cx", d => xPovertyScale(d.poverty))
    .attr("cy", d => ySmokesScale(d.smokes))
    .attr("r", "13")
    .attr("fill","grey")
    .attr("opacity",0.8);

  circlesGroup.append("text")
    .attr("x", d => xPovertyScale(d.poverty)-6)
    .attr("y", d => ySmokesScale(d.smokes))
    .attr("stroke", "#39ff14")
    .attr("font-size", "8px")
    .text(d => d.abbr)

    // Step 1: Initialize Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function(d) {
    return (`<strong>State: ${d.state}<br>Poverty%: ${d.poverty},<br>Smokes%: ${d.smokes}</strong>`);
   
});
    // Step 2: Create the tooltip in chartGroup.
    circleTool.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circleTool.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
    
    //  
    // Create axes labels
    chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("State Population Smokes (%)");

    chart.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty (%)");


})

