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

  d3.select(`#${divId}`).selectAll("*").remove();

  const svg = d3.select(`#${divId}`)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .style("background", "transparent");

  svg.append("rect")
    .attr("x", padding)
    .attr("y", padding)
    .attr("width", width)
    .attr("height", height)
    .attr("rx", cornerRadius)
    .attr("fill", "white");

  const chartArea = svg
    .append("g")
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

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "8px")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Append the stacked areas and handle tooltips
  chartArea
    .selectAll(".area")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "area")
    .attr("d", area)
    .attr("fill", (d) => colorScale(d.key))
    .on("mouseover", function (event, layer) {
      tooltip.style("opacity", 1);
    })
    .on("mousemove", function (event, layer) {
      const [mouseX] = d3.pointer(event);
      const hoveredXValue = xScale.invert(mouseX);

      const xIndex = Math.round(hoveredXValue);
      if (xIndex < xValues[0] || xIndex > xValues[xValues.length - 1]) {
        tooltip.style("opacity", 0);
        return;
      }

      const hoveredPoint = layer.find((d) => d.data.x === xIndex);

      if (hoveredPoint) {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${layer.key}</strong><br>jaar: ${xIndex}<br>waarde: ${(
              hoveredPoint[1] - hoveredPoint[0]
            ).toFixed(2)}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      }
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

  // Add axes and labels
  chartArea.append("g")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(xValues.length));

  chartArea.append("g").call(d3.axisLeft(yScale).ticks(5));

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2 + width / 30)
    .attr("y", containerHeight - padding - 20)
    .text(xAxisLabel)
    .style("font-size", `${xAxisTitleSize}px`)
    .style("font-weight", 300);

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `rotate(-90)`
    )
    .attr("x", -(padding + margin.top + (height - margin.top - margin.bottom) / 2))
    .attr("y", padding + 30)
    .text(yAxisLabel)
    .style("font-size", `${yAxisTitleSize}px`)
    .style("font-weight", 300);

  svg.append("text")
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