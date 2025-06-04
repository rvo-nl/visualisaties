function drawLineGraph (seriesData, divId, options = {}) {
  const { title = 'Line Graph', xAxisLabel = 'X Axis', yAxisLabel = 'Y Axis', xAxisTitleSize = 14, yAxisTitleSize = 14, graphTitleSize = 16, padding = 20, cornerRadius = 10, colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'], minYAxisValue = 0, maxYAxisValue = null } = options

  const container = document.getElementById(divId)
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight

  const width = containerWidth - padding * 2
  const height = containerHeight - padding * 2

  const margin = { top: 60, right: 30, bottom: 70, left: 75 }

  const svg = d3
    .select(`#${divId}`)
    .selectAll('svg')
    .data([null]) // Bind a single data point to the SVG
    .join('svg') // Reuse or append the SVG element
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .style('background', 'transparent')

  svg
    .selectAll('.background-rect')
    .data([null])
    .join('rect')
    .attr('class', 'background-rect')
    .attr('x', padding)
    .attr('y', padding)
    .attr('width', width)
    .attr('height', height)
    .attr('rx', cornerRadius)
    .attr('fill', 'white')

  const chartArea = svg
    .selectAll('.chart-area')
    .data([null])
    .join('g')
    .attr('class', 'chart-area')
    .attr(
      'transform',
      `translate(${margin.left + padding},${margin.top + padding})`
  )

  const allData = seriesData.flatMap((series) => series.data)
  const xLabels = [...new Set(allData.map((d) => d.x))]

  const x = d3
    .scaleBand()
    .domain(xLabels)
    .range([0, width - margin.left - margin.right])
    .padding(0.1)

  const computedYMax = d3.max(allData, (d) => d.y)
  const finalYMax = maxYAxisValue !== null ? maxYAxisValue : computedYMax

  const y = d3
    .scaleLinear()
    .domain([Math.min(minYAxisValue, finalYMax), finalYMax])
    .range([height - margin.top - margin.bottom, 0])

  // Draw or update gridlines
  chartArea
    .selectAll('.grid')
    .data([null])
    .join('g')
    .attr('class', 'grid')
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat('')
  )
    .selectAll('line')
    .attr('stroke', '#e0e0e0')

  // Draw or update axes
  chartArea
    .selectAll('.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr(
      'transform',
      `translate(0,${height - margin.top - margin.bottom})`
  )
    .call(d3.axisBottom(x))

  chartArea
    .selectAll('.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y).ticks(5))

  // Update or create axis labels
  svg
    .selectAll('.x-axis-label')
    .data([null])
    .join('text')
    .attr('class', 'x-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2 + width / 30)
    .attr('y', containerHeight - padding - 20)
    .text(xAxisLabel)
    .style('font-size', `${xAxisTitleSize}px`)
    .style('font-weight', 300)

  svg
    .selectAll('.y-axis-label')
    .data([null])
    .join('text')
    .attr('class', 'y-axis-label')
    .attr('text-anchor', 'middle')
    .attr(
      'transform',
      `rotate(-90)`
  )
    .attr(
      'x',
      -(padding + margin.top + (height - margin.top - margin.bottom) / 2)
  )
    .attr('y', padding + 30)
    .text(yAxisLabel)
    .style('font-size', `${yAxisTitleSize}px`)
    .style('font-weight', 300)

  svg
    .selectAll('.title')
    .data([null])
    .join('text')
    .attr('class', 'title')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2 + width / 30)
    .attr('y', padding + 25)
    .text(title)
    .style('font-size', `${graphTitleSize}px`)
    .style('font-weight', 400)

  const color = d3.scaleOrdinal(colors)

  // Create or update lines and points
  // seriesData.forEach((series, index) => {
  //   const line = d3
  //     .line()
  //     .x((d) => x(d.x) + x.bandwidth() / 2)
  //     .y((d) => y(d.y))

  //   // Update or create paths with transition
  //   const linePath = chartArea
  //     .selectAll(`.line-series-${index}`)
  //     .data([series.data])
  //     .join('path')
  //     .attr('class', `line-series-${index}`)
  //     .attr('fill', 'none')
  //     .attr('stroke', color(index))
  //     .attr('stroke-width', 2)

  //   if (window.suppressGraphAnimations) {
  //     linePath.attr('d', line) // Apply directly if flag is set
  //   } else {
  //     linePath
  //       .transition()
  //       .duration(750) // Set transition duration
  //       .attr('d', line)
  //   }

  //   // Update or create dots with transition
  //   const dotsSelection = chartArea
  //     .selectAll(`.dot-series-${index}`)
  //     .data(series.data)
  //     .join('circle')
  //     .attr('class', `dot-series-${index}`)
  //     .attr('r', 4)
  //     .attr('fill', color(index))
  //     .on('mouseover', function (event, d) {
  //       d3.select('body')
  //         .selectAll('.tooltip')
  //         .data([null])
  //         .join('div')
  //         .attr('class', 'tooltip')
  //         .style('position', 'absolute')
  //         .style('padding', '8px')
  //         .style('background', 'rgba(0, 0, 0, 0.7)')
  //         .style('color', '#fff')
  //         .style('border-radius', '4px')
  //         .style('pointer-events', 'none')
  //         .style('opacity', 1)
  //         .html(
  //           `<strong>${series.label}</strong><br>jaar: ${d.x}<br>waarde: ${d.y}`
  //       )
  //         .style('left', `${event.pageX + 10}px`)
  //         .style('top', `${event.pageY + 10}px`)
  //     })
  //     .on('mousemove', function (event) {
  //       d3.select('.tooltip')
  //         .style('left', `${event.pageX + 10}px`)
  //         .style('top', `${event.pageY + 10}px`)
  //     })
  //     .on('mouseout', function () {
  //       d3.select('.tooltip').style('opacity', 0)
  //     })

  //   if (window.suppressGraphAnimations) {
  //     dotsSelection
  //       .attr('cx', (d) => x(d.x) + x.bandwidth() / 2)
  //       .attr('cy', (d) => y(d.y)) // Apply directly if flag is set
  //   } else {
  //     dotsSelection
  //       .transition()
  //       .duration(750) // Set transition duration
  //       .attr('cx', (d) => x(d.x) + x.bandwidth() / 2)
  //       .attr('cy', (d) => y(d.y))
  //   }
  // })

  // --- Refactored D3 Data Join for Series ---

  // 1. Join seriesData to groups
  const seriesGroups = chartArea.selectAll('.series-group')
    .data(seriesData, d => d.label) // Keyed by label for object constancy

  // 2. Exit: Remove old series groups
  const seriesExit = seriesGroups.exit()
  if (window.suppressGraphAnimations) {
    seriesExit.remove()
  } else {
    seriesExit
      .transition().duration(350) // Shorter duration for fade out
      .style('opacity', 0)
      .remove()
  }

  // 3. Enter: Add new series groups and their contents (path and dots)
  const seriesEnter = seriesGroups.enter()
    .append('g')
    .attr('class', 'series-group')

  // Add path for new series (stroke and 'd' attribute will be set in the update section)
  seriesEnter.append('path')
    .attr('class', 'line-path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('opacity', 0); // Start transparent for fade-in

  // 4. Update (Enter + Update selection for groups)
  const seriesUpdate = seriesGroups.merge(seriesEnter)

  // Transition for newly entered groups to fade in
  if (!window.suppressGraphAnimations) {
    seriesEnter.transition().duration(750).style('opacity', 1)
  } else {
    seriesEnter.style('opacity', 1) // Make immediately visible
  }

  seriesUpdate.each(function (seriesObject, i) {
    const group = d3.select(this); // Current <g class="series-group">

    const lineGenerator = d3.line()
      .x(d_point => x(d_point.x) + x.bandwidth() / 2)
      .y(d_point => y(d_point.y))

    const pathElement = group.select('.line-path')
      .datum(seriesObject.data) // Bind the series data to the path for the line generator
      .attr('stroke', color(i)); // Use D3 ordinal scale with index `i`

    if (window.suppressGraphAnimations) {
      pathElement
        .attr('d', lineGenerator)
        .style('opacity', 1) // Ensure path is opaque
    } else {
      pathElement
        .transition()
        .duration(750)
        .attr('d', lineGenerator)
        .style('opacity', 1) // Transition path to opaque
    }

    // Dots: Data join for circles within this series group
    const dots = group.selectAll('.dot')
      .data(seriesObject.data, d_point => d_point.x); // Key dots by x-value

    // Exit dots (if data points within a series can change - less common for static datasets per series)
    dots.exit().remove() // Simple removal for now

    // Enter dots
    const dotsEnter = dots.enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 4)
      .attr('fill', color(i))
      .attr('cx', d_point => x(d_point.x) + x.bandwidth() / 2) // Initial position
      .attr('cy', d_point => y(d_point.y)) // Initial position
      .style('opacity', 0) // Start transparent for fade-in for new dots
      .on('mouseover', function (event, d_point) {
        // seriesObject is from the .each loop's closure
        d3.select('body')
          .selectAll('.tooltip')
          .data([null]) // Standard D3 pattern for single tooltip
          .join('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('padding', '8px')
          .style('background', 'rgba(0, 0, 0, 0.75)')
          .style('color', '#fff')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('opacity', 1)
          .html(
            `<strong>${seriesObject.label}</strong><br>Jaar: ${d_point.x}<br>Waarde: ${Math.round(d_point.y)}`
        )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
      })
      .on('mousemove', function (event) {
        d3.select('.tooltip')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
      })
      .on('mouseout', function () {
        d3.select('.tooltip').style('opacity', 0).remove() // Remove tooltip on mouseout
      })

    // Update dots (Enter + Update selection for dots)
    const dotsUpdate = dots.merge(dotsEnter)

    if (window.suppressGraphAnimations) {
      dotsUpdate
        .attr('cx', d_point => x(d_point.x) + x.bandwidth() / 2)
        .attr('cy', d_point => y(d_point.y))
        .style('opacity', 1) // Ensure visible
    } else {
      dotsUpdate
        .transition()
        .duration(750)
        .attr('cx', d_point => x(d_point.x) + x.bandwidth() / 2)
        .attr('cy', d_point => y(d_point.y))
        .style('opacity', 1) // Fade in/ensure visible
    }
  })
// --- End of Refactored D3 Data Join ---
}
// Example usage:
// const sampleSeriesData1 = [
//   {
//     label: 'Series 1',
//     data: [
//       { x: 0, y: 3 },
//       { x: 1, y: 7 },
//       { x: 2, y: 8 },
//       { x: 3, y: 5 },
//       { x: 4, y: 10 }
//     ]
//   },
//   {
//     label: 'Series 2',
//     data: [
//       { x: 0, y: 5 },
//       { x: 1, y: 4 },
//       { x: 2, y: 6 },
//       { x: 3, y: 9 },
//       { x: 4, y: 7 }
//     ]
//   },
//   {
//     label: 'Series 3',
//     data: [
//       { x: 0, y: 4 },
//       { x: 1, y: 4 },
//       { x: 2, y: 2 },
//       { x: 3, y: 1 },
//       { x: 4, y: 1 }
//     ]
//   }
// ]

// drawLineGraph(sampleSeriesData1, 'myDiv1', {
//   title: 'High',
//   xAxisLabel: 'Time (s)',
//   yAxisLabel: 'Value',
//   xAxisTitleSize: 12,
//   yAxisTitleSize: 12,
//   graphTitleSize: 14,
//   padding: 5,
//   cornerRadius: 8,
//   colors: ['#DD5471', '#62D3A4', '#3F88AE', '#F8D377'], // Custom color array
// })

// drawLineGraph(sampleSeriesData1, 'myDiv4', {
//   title: 'Low',
//   xAxisLabel: 'Time (s)',
//   yAxisLabel: 'Value',
//   xAxisTitleSize: 12,
//   yAxisTitleSize: 12,
//   graphTitleSize: 14,
//   padding: 5,
//   cornerRadius: 8,
//   colors: ['#DD5471', '#62D3A4', '#3F88AE', '#F8D377'], // Custom color array
// })
