function drawStackedAreaGraph(seriesData, divId, options = {}) {
  const {
    title = "Stacked Area Graph",
    xAxisLabel = "X Axis",
    yAxisLabel = "Y Axis",
    xAxisTitleSize = 14,
    yAxisTitleSize = 14,
    graphTitleSize = 16,
    padding = 20,
    cornerRadius = 10,
    colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
    minYAxisValue,
    maxYAxisValue,
  } = options;

  const container = document.getElementById(divId);
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const width = containerWidth - padding * 2;
  const height = containerHeight - padding * 2;

  const margin = { top: 60, right: 30, bottom: 70, left: 65 };

  const svg = d3.select(`#${divId}`)
    .selectAll("svg")
    .data([null]) // Ensure the SVG element is bound to the container
    .join("svg") // Reuse or append the SVG element
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .style("background", "transparent");

  // White background with rounded corners
  svg
    .selectAll(".background-rect")
    .data([null])
    .join("rect")
    .attr("class", "background-rect")
    .attr("x", padding)
    .attr("y", padding)
    .attr("width", width)
    .attr("height", height)
    .attr("rx", cornerRadius)
    .attr("fill", "white");

  const chartArea = svg
    .selectAll(".chart-area")
    .data([null])
    .join("g")
    .attr("class", "chart-area")
    .attr("transform", `translate(${margin.left + padding},${margin.top + padding})`);

  const keys = seriesData.map((d) => d.label);
  const xValues = seriesData[0].data.map((d) => d.x);

  const transformedData = xValues.map((x) => {
    const point = { x };
    seriesData.forEach((series) => {
      const value = series.data.find((d) => d.x === x)?.y || 0;
      point[series.label] = value;
    });
    return point;
  });

  const stack = d3.stack().keys(keys);
  const stackedData = stack(transformedData);

  const calculatedMaxYAxisValue = d3.max(stackedData, (layer) =>
    d3.max(layer, (d) => d[1])
  );
  const yAxisMin = minYAxisValue !== undefined ? minYAxisValue : 0;
  const yAxisMax = maxYAxisValue !== undefined ? maxYAxisValue : calculatedMaxYAxisValue;

  const xScale = d3.scaleLinear()
    .domain(d3.extent(xValues))
    .range([0, width - margin.left - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([yAxisMin, yAxisMax])
    .range([height - margin.top - margin.bottom, 0]);

  const colorScale = d3.scaleOrdinal(colors).domain(keys);

  const area = d3.area()
    .x((d) => xScale(d.data.x))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  // Update or create the stacked areas
  const areasSelection = chartArea
    .selectAll(".area")
    .data(stackedData)
    .join("path")
    .attr("class", "area")
    .attr("fill", (d) => colorScale(d.key));

  // Attach tooltip event listeners BEFORE the transition
  // --- START: Tooltip Logic for Stacked Area Graphs ---
  areasSelection
    .on('mouseover', function (event, d) {
      const tooltip = d3.select('body')
        .selectAll('.tooltip')
        .data([null]) // Ensure only one tooltip div
        .join('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('padding', '8px')
        .style('background', 'rgba(0, 0, 0, 0.75)')
        .style('color', '#fff')
        .style('border-radius', '4px')
        .style('pointer-events', 'none') // So it doesn't interfere with mouse events on other elements
        .style('opacity', 0); // Start hidden

      tooltip.transition().duration(200).style('opacity', 1);

      const pointer = d3.pointer(event, chartArea.node());
      const xValue = xScale.invert(pointer[0]);
      
      const bisectDate = d3.bisector(item => item.data.x).left;
      const index = bisectDate(d, xValue, 1);
      const d0 = d[index - 1];
      const d1 = d[index];
      
      let dataPoint;
      if (d0 && d1) {
        dataPoint = xValue - d0.data.x > d1.data.x - xValue ? d1 : d0;
      } else if (d0) {
        dataPoint = d0;
      } else if (d1) {
        dataPoint = d1;
      } else {
        return; // No data point found
      }

      const year = dataPoint.data.x;
      const categoryValue = dataPoint[1] - dataPoint[0]; // Value of this specific layer
      const categoryName = d.key;

      tooltip.html(
        `<strong>${categoryName}</strong><br>Jaar: ${year}<br>Waarde: ${categoryValue.toFixed(2)}`
      )
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mousemove', function (event) {
      d3.select('.tooltip')
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', function () {
      d3.select('.tooltip').transition().duration(500).style('opacity', 0);
    });
  // --- END: Tooltip Logic for Stacked Area Graphs ---

  // Now, apply the transition for the path's 'd' attribute
  areasSelection
    .transition()
    .duration(750) // Set transition duration
    .attr("d", area);

  // Update or create axes with transitions
  const xAxis = d3.axisBottom(xScale).ticks(xValues.length);
  chartArea
    .selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .transition()
    .duration(750) // Animate axis updates
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale).ticks(5);
  chartArea
    .selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .transition()
    .duration(750) // Animate axis updates
    .call(yAxis);

  // Update or create labels
  svg
    .selectAll(".x-axis-label")
    .data([null])
    .join("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2 + width / 30)
    .attr("y", containerHeight - padding - 20)
    .text(xAxisLabel)
    .style("font-size", `${xAxisTitleSize}px`)
    .style("font-weight", 300);

  svg
    .selectAll(".y-axis-label")
    .data([null])
    .join("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90)`)
    .attr(
      "x",
      -(padding + margin.top + (height - margin.top - margin.bottom) / 2)
    )
    .attr("y", padding + 30)
    .text(yAxisLabel)
    .style("font-size", `${yAxisTitleSize}px`)
    .style("font-weight", 300);

  svg
    .selectAll(".title")
    .data([null])
    .join("text")
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .attr("x", width / 2 + width / 30)
    .attr("y", padding + 30)
    .text(title)
    .style("font-size", `${graphTitleSize}px`)
    .style("font-weight", 400);
}
// Example usage:
const sampleData3 = [
  {
      label: "Category 1",
      data: [
          { x: 0, y: 10 },
          { x: 1, y: 20 },
          { x: 2, y: 30 },
          { x: 3, y: 40 },
          { x: 4, y: 60 },
      ],
  },
  {
      label: "Category 2",
      data: [
          { x: 0, y: 5 },
          { x: 1, y: 15 },
          { x: 2, y: 25 },
          { x: 3, y: 35 },
          { x: 4, y: 10 },
      ],
  },
  {
      label: "Category 3",
      data: [
          { x: 0, y: 2 },
          { x: 1, y: 12 },
          { x: 2, y: 22 },
          { x: 3, y: 20 },
          { x: 4, y: 42 },
      ],
  },
];

// drawStackedAreaGraph(sampleData3, "myDiv3", {
//   title: "Customized Stacked Area Graph",
//   xAxisLabel: "Time (s)",
//   yAxisLabel: "Values",
//   xAxisTitleSize: 12,
//   yAxisTitleSize: 12,
//   graphTitleSize: 14,
//   padding: 5,
//   cornerRadius: 8,
//   colors: ["#DD5471", "#62D3A4", "#3F88AE"], // Custom color array
// });

// drawStackedAreaGraph(sampleData3, "myDiv6", {
//   title: "Customized Stacked Area Graph",
//   xAxisLabel: "Time (s)",
//   yAxisLabel: "Values",
//   xAxisTitleSize: 12,
//   yAxisTitleSize: 12,
//   graphTitleSize: 14,
//   padding: 5,
//   cornerRadius: 8,
//   colors: ["#DD5471", "#62D3A4", "#3F88AE"], // Custom color array
// });