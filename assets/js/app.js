// Set Up Height  and Width of the browser window frame
var svgHeight = 650;
var svgWidth = 1000;

// Set Up Margins  in svg 
var margin = {
    top: 20,
    right: 10,
    bottom: 65,
    left : 100
};

//Set up and adjust chartHeight and ChartWidth
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth  - margin.right - margin.left ;

// Create the svg wrapper and append attributes to the svg
var svg = d3.select("#scatter")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

//Add group tag and move svg to the center 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Use D3 to import the data csv file 
d3.csv("assets/data/data.csv").then(function(censusData){
    
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data){

        data.healthcare = +data.healthcare;
        data.poverty =  +data.poverty;
    });

    //Create axis functions
    var xLinearScale = d3.scaleLinear()
        .domain([ 8.5, d3.max(censusData, d => d.poverty)+3])
        .range([0, chartWidth]);
  
    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(censusData, d => d.healthcare)])
        .range([chartHeight, 15]);

    //Create the bottomand xAxis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append to chartgroup the yAxis and xAxis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    //Create scatterplot circles
    var circleGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12");
        // .attr("opacity", ".5");        

    //Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`${d.state}<br>Poverty (%): ${d.poverty}<br>Lack Healthcare(%): ${d.healthcare}`);
          });

    //  Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circleGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // On mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
      //Append  State Abbreviation on Scatterplot circles
      chartGroup.selectAll("text.text-circles")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText",true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",5);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 4- margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack of Healthcare(%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 20})`)
      .attr("class", "axisText")
      .text("In Proverty (%)");
  }).catch(function(error) {
    console.log(error);
    
});

