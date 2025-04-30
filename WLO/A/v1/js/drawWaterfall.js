// ============================================================================
// Data Loading and Parsing
// ============================================================================

// Global states
let currentScenario = 'nat'
let currentSector = 'alle'
let currentRoutekaart = 'alle'
let currentYMax = [2500,1000,2500]
let currentUnit = 'PJ'
let currentTitlesArray = ['Elektriciteit', 'Waterstof', 'Warmte', 'Biomassa', 'Synthetisch', 'Olie, kolen, afval', 'Methaan', 'Aardwarmte', 'Omgevingswarmte']
let currentColorsArray = ['#F8D377', '#7555F6', '#DD5471', '#62D3A4', '#E99172', '#444444', '#3F88AE', '#06402B', '#aaa']

// Global datasets
let datasetPR40;
let datasetSR20;
let datasetPB30;
let datasetSRMPA;
let datasetWLO1;
let datasetWLO2;
let datasetWLO3;
let datasetWLO4;

const valueFactorAdjustment = 1;

/**
 * Fetches an XLSX file from the given URL and converts it into a JSON object.
 * @param {string} url - The URL of the XLSX file.
 * @returns {Promise<Object>} - A promise that resolves with a JSON representation of the XLSX file.
 */
async function xlsxToJSON(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const result = {};

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
    });

    return result;
  } catch (error) {
    console.error('Error converting xlsx to JSON:', error);
    throw error;
  }
}


//  dataSource = 'file';


// Load waterfalldiagram datasets
// if (dataSource == 'url') {
// xlsxToJSON('/data/data_watervaldiagram_OptimistischSelectiefFossilCarbonPenalty.xlsx')
//   .then(data => {  console.log(data); datasetSR20 = data; })
//   .catch(error => { console.error('Error loading data_c:', error); });

// xlsxToJSON('/data/data_watervaldiagram_OS_minder plastic afval.xlsx')
//   .then(data => { datasetSRMPA = data; })
//   .catch(error => { console.error('Error loading data_int:', error); });

// xlsxToJSON('/data/data_watervaldiagram_PP_CCS_30_in_2050.xlsx')
//   .then(data => { datasetPB30 = data; })
//   .catch(error => { console.error('Error loading data_int:', error); });

//   xlsxToJSON('/data/data_watervaldiagram_WLO1.xlsx')
//   .then(data => { datasetWLO1 = data; })
//   .catch(error => { console.error('Error loading data_int:', error); });

//   xlsxToJSON('/data/data_watervaldiagram_WLO2.xlsx')
//   .then(data => { datasetWLO2 = data; })
//   .catch(error => { console.error('Error loading data_int:', error); });

//   xlsxToJSON('/data/data_watervaldiagram_WLO3.xlsx')
//   .then(data => { datasetWLO3 = data; })
//   .catch(error => { console.error('Error loading data_int:', error); });

//   xlsxToJSON('/data/data_watervaldiagram_WLO4.xlsx')
//   .then(data => { datasetWLO4 = data; })
//   .catch(error => { console.error('Error loading data_int:', error); });

// xlsxToJSON('/data/data_watervaldiagram_OP - CO2-opslag 40.xlsx')
//   .then(data => {
//     datasetPR40 = data;
//     initWaterfallDiagram()
//   })
//   .catch(error => {
//     console.error('Error loading data:', error);
//   });
// }


  function initWaterfallDiagram () {
    // Draw waterfall diagrams with the national dataset using different configurations
    drawWaterfallDiagram(datasetPR40, {
      divID: 'opbouw',
      chartID: '.chart_opbouw',
      sheetID: 'alle_boven_alle',
      yOffsetJaarTotalen: 216,
      annualMaxValueCorrect: 0,
      titlesArray: ['Elektriciteit', 'Waterstof', 'Warmte', 'Biomassa', 'Synthetisch', 'Olie, kolen, afval', 'Methaan', 'Aardwarmte', 'Omgevingswarmte'],
      colorsArray: ['#F8D377', '#7555F6', '#DD5471', '#62D3A4', '#E99172', '#444444', '#3F88AE', '#06402B', '#aaa'],
      yMax: 2500,
      marginLeft: -100,
      marginTop: 43,
      marginBottom: 33,
      yTicks: 5,
      classTag: 'A'
    });

    drawWaterfallDiagram(datasetPR40, {
      divID: 'ccs',
      chartID: '.chart_ccs',
      sheetID: 'alle_midden_alle',
      yOffsetJaarTotalen: 98,
      annualMaxValueCorrect: 0,
      titlesArray: ['Elektriciteit', 'Waterstof', 'Warmte', 'Biomassa', 'Synthetisch', 'Olie, kolen, afval', 'Methaan', 'Aardwarmte', 'Omgevingswarmte'],
      colorsArray: ['#F8D377', '#7555F6', '#DD5471', '#62D3A4', '#E99172', '#444444', '#3F88AE', '#06402B', '#aaa'],
      yMax: 1000,
      marginLeft: -100,
      marginTop: 27,
      marginBottom: 27,
      yTicks: 2,
      classTag: 'B'
    });

    drawWaterfallDiagram(datasetPR40, {
      divID: 'afbouw',
      chartID: '.chart_afbouw',
      sheetID: 'alle_onder_alle',
      yOffsetJaarTotalen:  207,
      annualMaxValueCorrect: 0,
      titlesArray: ['Elektriciteit', 'Waterstof', 'Warmte', 'Biomassa', 'Synthetisch', 'Olie, kolen, afval', 'Methaan', 'Aardwarmte', 'Omgevingswarmte'],
      colorsArray: ['#F8D377', '#7555F6', '#DD5471', '#62D3A4', '#E99172', '#444444', '#3F88AE', '#06402B', '#aaa'],
      yMax: 2500,
      marginLeft: -100,
      marginTop: 33,
      marginBottom: 43,
      yTicks: 5,
      classTag: 'C'
    });

    // Set initial selection display
    updateWaterfallSelectionDisplay(currentRoutekaart, currentSector);
    
    // Directly set text for initial view in case the DOM isn't ready
    const displayElement = document.getElementById('waterval-selection-display');
    if (displayElement) {
      displayElement.textContent = 'Alle toepassingen | Alle sectoren';
    }
  }

// Setup a MutationObserver to watch for changes to the waterfall selection display
document.addEventListener('DOMContentLoaded', function() {
  const displayElement = document.getElementById('waterval-selection-display');
  if (displayElement) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          console.log('Waterfall selection display changed to:', displayElement.textContent);
        }
      });
    });
    
    observer.observe(displayElement, { 
      characterData: true,
      childList: true,
      subtree: true
    });
  }
});



// ============================================================================
// Waterfall Diagram Drawing Functions
// ============================================================================

/**
 * Draws the waterfall diagram using the given dataset and configuration.
 * @param {Object} result - The JSON data from the XLSX file.
 * @param {Object} config - Configuration options for drawing the chart.
 */
function drawWaterfallDiagram(result, config) {
  // Setup container (assumes drawMainContainerBackdrop is defined elsewhere)
  drawMainContainerBackdrop(config);

  const totalWidth = 2000;
  const margin = {
    top: config.marginTop,
    right: 30,
    bottom: config.marginBottom,
    left: config.marginLeft
  };
  const width = 1500;
  const containerHeight = document.getElementById(config.divID).offsetHeight - margin.top - margin.bottom;
  const padding = 0.3;

  // Create the base SVG element for the chart
  d3.select(config.chartID)
    .attr("width", totalWidth)
    .attr("height", containerHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Extract years from the sheet (excluding the 'name' column)
  // console.log(config.sheetID)
  const years = Object.keys(result[config.sheetID][0]).filter(key => key !== 'name');
  const chartWidth = (width + margin.left + margin.right) / years.length;

  // Iterate through each year and draw a chart segment
  years.forEach((year, yearIndex) => {
    // Prepare the year-specific data
    const yearData = result[config.sheetID].map(d => ({
      name: d.name,
      value: +d[year] / valueFactorAdjustment
    }));

    // ------------------------------------------------------------------------
    // Calculate cumulative values, bar widths, and positions for the bars
    // ------------------------------------------------------------------------
    let cumulativePeriod = 0;
    let cumulativeGO = 0;
    let cumulativeIND = 0;
    let cumulativeAG = 0;
    let referenceSubtotalSector = 0;

    const barWidths = [];
    const barXPositions = [];
    let barXPositionCumulative = 0;

    // Define helper constants to replace magic numbers
    const BAR_WIDTH_CURRENT = 23;
    const BAR_WIDTH_SUBTOTAL = 329.5 + 24.05;
    const BAR_WIDTH_INTERMEDIATES = 22;
    const BAR_POSITION_INCREASE_INTERMEDIATES = 24.05;
    const BAR_POSITION_INCREASE_SUBTOTALS = 0;
    const BAR_POSITION_INCREASE_START = 70;
    const SUBTOTAL_SHIFT_LEFT = 262.5;

    // Arrays to hold extra color and class information
    const colorsArray = [];
    const classesArray = [];

    // Process each data point for the year
    yearData.forEach((d, index) => {
      if (index === 0) {
        // Starting point
        d.start = cumulativePeriod;
        cumulativePeriod += d.value;
        d.end = cumulativePeriod;
        d.class = d.value >= 0 ? 'positive' : 'negative';
        referenceSubtotalSector += d.value;
        barWidths.push(BAR_WIDTH_CURRENT);
        barXPositions.push(barXPositionCumulative);
        barXPositionCumulative += BAR_POSITION_INCREASE_START;
        colorsArray.push('none');
        classesArray.push('start');
        // Append intermediate colors/classes from the configuration
        colorsArray.push(...config.colorsArray);
        classesArray.push(...Array(9).fill('intermediate'));
      } else if (index > 0 && index < 10) {
        // Intermediate data points for the first segment
        d.start = cumulativePeriod;
        cumulativePeriod += d.value;
        d.end = cumulativePeriod;
        d.class = d.value >= 0 ? 'positive' : 'negative';
        cumulativeGO += d.value;
        barWidths.push(BAR_WIDTH_INTERMEDIATES);
        barXPositions.push(barXPositionCumulative);
        barXPositionCumulative += BAR_POSITION_INCREASE_INTERMEDIATES;
      } else if (index === 10) {
        // First subtotal
        d.start = referenceSubtotalSector;
        d.end = cumulativePeriod;
        referenceSubtotalSector += cumulativeGO;
        d.class = d.value >= 0 ? 'positive' : 'negative';
        barWidths.push(BAR_WIDTH_SUBTOTAL);
        barXPositions.push(barXPositionCumulative);
        barXPositionCumulative += BAR_POSITION_INCREASE_SUBTOTALS;
        colorsArray.push('rgba(100,100,100,0.1)');
        classesArray.push('subtotal');
        colorsArray.push(...config.colorsArray);
        classesArray.push(...Array(9).fill('intermediate'));
      } else if (index > 10 && index < 19) {
        // Intermediate data for second segment
        d.start = cumulativePeriod;
        cumulativePeriod += d.value;
        d.end = cumulativePeriod;
        d.class = d.value >= 0 ? 'positive' : 'negative';
        barWidths.push(BAR_WIDTH_INTERMEDIATES);
        barXPositions.push(barXPositionCumulative);
        barXPositionCumulative += BAR_POSITION_INCREASE_INTERMEDIATES;
        cumulativeIND += d.value;
      } else if (index === 19) {
        // Second subtotal
        d.start = referenceSubtotalSector;
        d.end = cumulativePeriod;
        d.class = d.value >= 0 ? 'positive' : 'negative';
        referenceSubtotalSector += cumulativeIND;
        barXPositions.push(barXPositionCumulative);
        barXPositionCumulative += BAR_POSITION_INCREASE_SUBTOTALS;
        barWidths.push(BAR_WIDTH_SUBTOTAL);
        colorsArray.push('rgba(100,100,100,0.0)');
        classesArray.push('subtotal');
        colorsArray.push(...config.colorsArray);
        classesArray.push(...Array(9).fill('intermediate'));
      } else if (index > 19 && index < 28) {
        // Intermediate data for third segment
        d.start = cumulativePeriod;
        cumulativePeriod += d.value;
        d.end = cumulativePeriod;
        d.class = d.value >= 0 ? 'positive' : 'negative';
        cumulativeAG += d.value;
        barWidths.push(BAR_WIDTH_INTERMEDIATES);
        barXPositions.push(barXPositionCumulative);
        barXPositionCumulative += BAR_POSITION_INCREASE_INTERMEDIATES;
      } else if (index === 28) {
        // Third subtotal
        d.start = referenceSubtotalSector;
        d.end = cumulativePeriod;
        d.class = d.value >= 0 ? 'positive' : 'negative';
        referenceSubtotalSector += cumulativeAG;
        barWidths.push(BAR_WIDTH_SUBTOTAL);
        barXPositions.push(barXPositionCumulative);
        barXPositionCumulative += BAR_POSITION_INCREASE_SUBTOTALS;
        colorsArray.push('rgba(100,100,100,0.0)');
      }
    });

    // Append total as the final bar
    yearData.push({
      name: 'Total',
      start: 0,
      end: cumulativePeriod,
      class: 'total'
    });

    // ------------------------------------------------------------------------
    // Create scales and axes
    // ------------------------------------------------------------------------
    const xScale = d3.scaleBand()
      .domain(yearData.map(d => d.name))
      .range([0, chartWidth])
      .padding(padding);

    const yScale = d3.scaleLinear()
      .domain([0, config.yMax / valueFactorAdjustment])
      .range([containerHeight, 0]);

    const xAxis = d3.axisBottom(xScale).tickSize(0);
    const yAxis = d3.axisLeft(yScale).ticks(config.yTicks)
      .tickSize(-width);

    const shiftRight = 150;

    // Create an SVG group for the current year's chart segment
    const chart = d3.select(config.chartID)
      .append("svg")
      .attr('id', 'waterfallSVG')
      .attr("class", "chart-svg")
      .attr('width', totalWidth)
      .attr("height", containerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${yearIndex * (BAR_POSITION_INCREASE_INTERMEDIATES + chartWidth + margin.left + margin.right) + shiftRight},${margin.top})`);

    // Append the x-axis and rotate labels for clarity
    const xAxisGroup = chart.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${containerHeight})`)
      .call(xAxis);

    xAxisGroup.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-0.6em")
      .attr('fill', 'none')
      .attr("transform", "rotate(-90)");

    // Only for the first year: Append y-axis grid lines
    if (yearIndex === 0) {
      const yAxisGroup = chart.append("g")
        .attr('id', 'yGridLines')
        .attr("class", "y axis")
        .style("stroke-opacity", 1)
        .style("shape-rendering", "crispEdges")
        .call(yAxis);

      yAxisGroup.selectAll("text")
        .attr("dx", "-.8em")
        .style('font-size', '13px')
        .attr('fill', '#666');

      d3.selectAll('#yGridLines line')
        .style('stroke', '#E8F0F4')
        .style('stroke-width', 2);
    }

    // ------------------------------------------------------------------------
    // Draw Bars, Labels, and Track Lines
    // ------------------------------------------------------------------------
    const barGroup = chart.selectAll(".bar")
      .data(yearData)
      .enter()
      .append("g")
      .attr('fill', (d, i) => colorsArray[i])
      .attr('class', (d, i) => `${classesArray[i]}Bar_${config.classTag}_${year}`)
      .attr('transform', (d, i) => {
        const posX = classesArray[i] === 'subtotal'
          ? barXPositions[i] - SUBTOTAL_SHIFT_LEFT - BAR_POSITION_INCREASE_INTERMEDIATES
          : barXPositions[i];
        return `translate(${posX},0)`;
      });

    // Adjust layering for specific subtotal elements
    moveBack(d3.select(`.subtotalBar_${config.classTag}_2030naar2035`), 2);
    moveBack(d3.select(`.subtotalBar_${config.classTag}_2035naar2040`), 3);
    moveBack(d3.select(`.subtotalBar_${config.classTag}_2040naar2045`), 4);
    moveBack(d3.select(`.subtotalBar_${config.classTag}_2045naar2050`), 5);

    // Append rectangle bars
    barGroup.append("rect")
      .style('opacity', 1)
      .attr("y", d => {
        const posY = yScale(Math.max(d.start, d.end));
        return !isNaN(posY + 0.5) ? posY + 0.5 : 0;
      })
      .attr("height", d => {
        const heightValue = Math.abs(yScale(d.start) - yScale(d.end)) - 1;
        return heightValue > 0 ? heightValue : 0;
      })
      .attr("width", (d, i) => barWidths[i]);

    // Append text labels on the bars
    barGroup.append("text")
      .attr("x", xScale.bandwidth() / 2)
      .attr("y", d => !isNaN(yScale(d.end) + 5) ? yScale(d.end) + 5 : 0)
      .style('text-anchor', d => d.class === 'negative' ? 'end' : 'start')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(d => d.end - d.start > 0
        ? `+ ${parseInt(d.end - d.start)}`
        : `- ${Math.abs(parseInt(d.end - d.start))}`)
      .attr("transform", d => {
        const rotationX = d.class === 'negative' ? xScale.bandwidth() / 2 + 2 : xScale.bandwidth() / 2 - 2;
        const rotationY = d.class === 'negative' ? yScale(d.end) + 3 : yScale(d.end) - 2;
        return `rotate(-90 ${rotationX},${rotationY})`;
      })
      .style('visibility', d => (parseInt(d.value) > 0 || parseInt(d.value)) ? 'visible' : 'hidden');

    // Append track lines (for non-total bars)
    barGroup.filter(d => d.class !== "total")
      .append("line")
      .attr('id', 'trackLine')
      .style('stroke', '#666')
      .attr("x1", xScale.bandwidth() - 22)
      .attr("y1", d => yScale(d.end))
      .attr("x2", d => {
        if (d.name === 'mt_omgevingswarmte') {
          return xScale.bandwidth() / (1 - padding) + 75;
        } else if (d.name === 'Totaal start periode') {
          return xScale.bandwidth() / (1 - padding) + 27 + 6 + 20 + 7;
        } else if (d.name !== 'null') {
          return xScale.bandwidth() / (1 - padding) + 9 + 6 + 2 - 2;
        }
      })
      .attr("y2", d => yScale(d.end))
      .style('visibility', d => (d.name === 'Totaal start periode' || d.name === 'mt_omgevingswarmte')
        ? 'visible'
        : 'visible');
  });

  // ------------------------------------------------------------------------
  // Adjust Domain Lines and Plot Stacked Bar Graphs
  // ------------------------------------------------------------------------
  d3.selectAll('.domain').remove();

  const yCoordinateScale = d3.scaleLinear()
    .domain([0, config.yMax])
    .range([containerHeight, 0]);

  const yearsList = ['2030', '2035', '2040', '2045', '2050'];
  const annualMaxValues = [];
  const annualMaxValuesAbsolute = [];

  yearsList.forEach(year => {
    // console.log(year)
    let count = 0;
    // console.log(config.sheetID)
    // console.log(result)
    result[`${config.sheetID}`+'_tot'].forEach(row => { //result[`${config.sheetID}+'_tot`].forEach(row => {
      count += row[year];
    });
    annualMaxValues.push(containerHeight - yCoordinateScale(count) - config.annualMaxValueCorrect);
    annualMaxValuesAbsolute.push(count);
  });

  // Plot the stacked bar graphs for each year
  for (let i = 0; i < yearsList.length; i++) {
    const valuesArray = [];
    for (let j = 0; j < 9; j++) {
      valuesArray.push(result[`${config.sheetID}`+'_tot'][j][yearsList[i]]); //valuesArray.push(result[`${config.sheetID}+'_tot`][j][yearsList[i]]);
    }
    plotStackedBarGraph(
      config,
      valuesArray,
      annualMaxValues[i],
      i * (287.5 + 24) + 60,
      config.yOffsetJaarTotalen,
      config.chartID,
      i,
      annualMaxValues,
      config.annualMaxValueCorrect,
      annualMaxValuesAbsolute
    );
  }
  d3.select(config.chartID).selectAll("rect[fill='rgba(238, 245, 250, 0.7)']").remove();
  // Add transparent overlay for middle graph if not 'alle_alle' - moved to the end
  if (config.divID === 'ccs' && config.sheetID !== 'alle_midden_alle') {
    d3.select(config.chartID)
      .append("rect")
      .attr("width", totalWidth)
      .attr("height", containerHeight + margin.top + margin.bottom + 20) // Increased height
      .attr("fill", "rgba(238, 245, 250, 0.7)")
      .style("pointer-events", "none")
      .style("z-index", "1000"); // Add z-index to ensure it stays on top

      d3.select(config.chartID)
      .append("text")
      .attr('id','CCgreyOutText')
      .attr('x',230)
      .attr('y', 50-20)
      .attr('fill', '#999')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('font-weight', 400)
      .style('text-anchor','start')
      .style('font-size', '15px')
      .text('Voor subselecties van toepassingen en sectoren is geen uitsplitsing naar CC(S) gemaakt')

      d3.select(config.chartID)
      .append("text")
      .attr('id','CCgreyOutText')
      .attr('x',230)
      .attr('y', 70-15)
      .attr('fill', '#999')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('font-weight', 300)
      .style('text-anchor','start')
      .style('font-size', '14px')
      .text('Finaal verbruik waarvoor CC(S) op fossiel wordt ingezet, is ondergebracht onder \'afbouw\'.')

      d3.select(config.chartID)
      .append("text")
      .attr('id','CCgreyOutText')
      .attr('x',230)
      .attr('y', 90-5-5)
      .attr('fill', '#999')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('font-weight', 300)
      .style('text-anchor','start')
      .style('font-size', '14px')
      .text('Finaal verbruik waarvoor CC(S) op biogeen wordt ingezet, is ondergebracht onder \'opbouw\'.')


  } else if (config.divID === 'ccs') {
    // Remove any existing overlay when 'alle_alle' is selected
    d3.select(config.chartID).selectAll("rect[fill='rgba(238, 245, 250, 0.5)']").remove();
    d3.selectAll('#CCgreyOutText').remove();
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Moves a D3 selection back by a specified number of levels in the DOM.
 * @param {d3.selection} selection - The D3 selection to move.
 * @param {number} levels - The number of levels to move back.
 */
function moveBack(selection, levels) {
  selection.each(function() {
    const node = this;
    const parent = node.parentNode;
    if (parent) {
      const childNodes = parent.childNodes;
      const currentIndex = Array.prototype.indexOf.call(childNodes, node);
      const newIndex = Math.max(currentIndex - levels, 0);
      if (newIndex < currentIndex) {
        parent.insertBefore(node, childNodes[newIndex]);
      }
    }
  });
}

let previousTotal = 0;

/**
 * Plots a stacked bar graph within the waterfall diagram.
 * @param {Object} config - The configuration object.
 * @param {number[]} data - Array of numeric data for the segments.
 * @param {number} refHeight - The reference height for normalization.
 * @param {number} xPos - The x-axis position where the graph begins.
 * @param {number} yPos - The y-axis base position.
 * @param {string} svgSelector - The selector for the target SVG element.
 * @param {number} index - The index of the current year (for labeling).
 * @param {number[]} annualMaxValues - Array of computed maximum values for each year.
 * @param {number} annualMaxValueCorrect - A correction value for the maximum value.
 * @param {number[]} annualMaxValuesAbsolute - Array of the absolute annual values.
 */
function plotStackedBarGraph(config, data, refHeight, xPos, yPos, svgSelector, index, annualMaxValues, annualMaxValueCorrect, annualMaxValuesAbsolute) {
  const totalSum = data.reduce((acc, value) => acc + value, 0);
  const normalizedHeights = data.map(value => (value / totalSum) * refHeight);
  let currentY = yPos;

  const svg = d3.select(svgSelector);
  const barGroup = svg.append('g')
    .attr('transform', `translate(${xPos},0)`);

  const colorsArray = config.colorsArray;
  const namesArray = config.namesArray || data.map((_, i) => `Segment ${i + 1}`); // fallback names

  // Tooltip div
  let tooltip = d3.select("body").select("#tooltip");
  if (tooltip.empty()) {
    tooltip = d3.select("body").append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)");
  }

  svg.append('g')
    .append('text')
    .attr('fill', '#666')
    .attr('id', 'waterfallSVG')
    .style('text-anchor', 'middle')
    .style('font-size', '13px')
    .text(Math.round(parseInt(totalSum) / valueFactorAdjustment))
    .attr('transform', `translate(${117 + xPos - 6}, ${yPos - refHeight - 20 + 10})`);

  if (index > 0) {
    svg.append('line')
      .attr('id', 'waterfallSVG')
      .style('stroke-dasharray', 3)
      .attr('x1', xPos + 76)
      .attr('x2', xPos + 76)
      .attr('y1', yPos - refHeight)
      .attr('y2', yPos - previousTotal)
      .style('stroke', '#666');

    if (annualMaxValues[index - 1] - annualMaxValues[index] < 0) {
      svg.append('path')
        .attr('id', 'waterfallSVG')
        .attr('d', 'M10,10 L20,10 L15,0 Z')
        .attr('fill', '#aaa')
        .attr('transform', `translate(${xPos + 61}, ${yPos - refHeight + 4 - 4})`);
      svg.append('text')
        .attr('id', 'waterfallSVG')
        .attr('fill', '#aaa')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 500)
        .text('+ ' + Math.round(parseInt(annualMaxValuesAbsolute[index] - annualMaxValuesAbsolute[index - 1]) / valueFactorAdjustment))
        .attr('transform', `translate(${xPos + 80}, ${yPos - refHeight - 25}) rotate(-90)`);
    } else {
      svg.append('path')
        .attr('id', 'waterfallSVG')
        .attr('d', 'M10,5 L20,5 L15,15 Z')
        .attr('fill', '#aaa')
        .attr('transform', `translate(${xPos + 61}, ${yPos - refHeight - 10 - 9 + 4})`);
      svg.append('text')
        .attr('id', 'waterfallSVG')
        .attr('fill', '#aaa')
        .style('text-anchor', 'end')
        .style('font-size', '14px')
        .style('font-weight', 500)
        .text('- ' + Math.round(parseInt(annualMaxValuesAbsolute[index - 1] - annualMaxValuesAbsolute[index]) / valueFactorAdjustment))
        .attr('transform', `translate(${xPos + 61 + 32 - 14}, ${yPos - refHeight + 10}) rotate(-90)`);
    }
  }

  previousTotal = refHeight;

  // Append each segment of the stacked bar with tooltip interaction
  normalizedHeights.forEach((segmentHeight, idx) => {
    barGroup.append('rect')
      .attr('id', 'waterfallSVG')
      .attr('x', 90)
      .attr('y', () => !isNaN(currentY - segmentHeight + 0.5) ? currentY - segmentHeight + 0.5 : currentY)
      .attr('width', 42)
      .attr('height', isNaN(segmentHeight) ? 0 : segmentHeight)
      .attr('fill', colorsArray[idx])
      .on('mouseover', function () {
        tooltip.style("visibility", "visible")
          .html(`<strong>${config.titlesArray[idx] || `Segment ${idx + 1}`}</strong><br/>${Math.round(data[idx])} `+ currentUnit);
      })
      .on('mousemove', function (event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on('mouseout', function () {
        tooltip.style("visibility", "hidden");
      });

    currentY -= segmentHeight;
  });
}




function switchRoutekaart (config) {
  console.log('Switch')
  d3.selectAll('#waterfallSVG').remove()
  
  // Update global state variables
  currentRoutekaart = config.routekaart;
  currentSector = config.sector;
  
  let data
  switch (config.scenario) {
    case 'PR40':
      data = datasetPR40
      break
    case 'SR20':
      data = datasetSR20
      break
    case 'PB30':
      data = datasetPB30
      break
    case 'SRMPA':
      data = datasetSRMPA
      break
    case 'WLO1':
      data = datasetWLO1
      break
    case 'WLO2':
      data = datasetWLO2
      break
    case 'WLO3':
      data = datasetWLO3
      break
    case 'WLO4':
      data = datasetWLO4
      break
    default:
      break
  }
  
  // Update the selection display text
  updateWaterfallSelectionDisplay(config.routekaart, config.sector);
  
  drawWaterfallDiagram(data,
    {divID: 'opbouw',
      chartID: '.chart_opbouw',
      sheetID: config.routekaart + '_boven_' + config.sector,
      yOffsetJaarTotalen: 216,
      annualMaxValueCorrect: 0,
      titlesArray: config.titlesArray,
      colorsArray: config.colorsArray,
      yMax: config.yMax[0], marginLeft: -100, marginTop: 43, marginBottom: 33, yTicks: 5, classTag: 'A'
    })
  drawWaterfallDiagram(data,
    {divID: 'ccs',
      chartID: '.chart_ccs',
      sheetID: config.routekaart + '_midden_' + config.sector,
      yOffsetJaarTotalen: 98,
      annualMaxValueCorrect: 0,
      titlesArray: config.titlesArray,
      colorsArray: config.colorsArray,
      yMax: config.yMax[1], marginLeft: -100, marginTop: 27,marginBottom: 27, yTicks: 2, classTag: 'B'
    })
  drawWaterfallDiagram(data, {
    divID: 'afbouw',chartID: '.chart_afbouw',
    sheetID: config.routekaart + '_onder_' + config.sector,
    yOffsetJaarTotalen: 207,
    annualMaxValueCorrect: 0,
    titlesArray: config.titlesArray,
    colorsArray: config.colorsArray,
  yMax: config.yMax[2], marginLeft: -100, marginTop: 33,marginBottom: 43, yTicks: 5, classTag: 'C'})
}

// Function to update the waterfall selection display text
function updateWaterfallSelectionDisplay(routekaart, sector) {
  // Map routekaart codes to display names based on what's in the UI
  const routekaartMapping = {
    'w': 'Warmte',
    'm': 'Mobiliteit',
    'o': 'Elektriciteit',
    'n': 'Grondstoffen, non-energetisch',
    'alle': 'Alle toepassingen'
  };
  
  // Map sector codes to display names based on what's in the UI
  const sectorMappings = {
    // Regular sectors
    'all': 'Alle sectoren',
    'go': 'Gebouwde Omgeving',
    'ind': 'Industrie',
    'ind_km': 'Industrie Km',
    'ind_hw': 'Industrie Hw',
    'ind_fo': 'Industrie Fo',
    'hh': 'Huishoudens',
    'ag': 'Landbouw',
    'en': 'Energie',
    
    // Mobility sectors
    'au': 'Auto',
    'bbus': 'Bestelbus',
    'bus': 'Bus',
    'vw': 'Vrachtwagen',
    'schip': 'Schip',
    'vtg': 'Vliegtuig',
    'tp': 'Trein passagier',
    'tv': 'Trein vracht',
    'mf': 'Motorfiets',
    'f': 'Fiets',
    'weg': 'Wegvervoer',
    'lucht': 'Luchtvaart',
    'scheep': 'Scheepvaart',
    'spoor': 'Railvervoer',
    
    // Non-energetic sectors
    'km': 'Kunstmest',
    'ch': 'Chemie',
    'raf': 'Raffinaderijen', 
    'mo': 'Mobiliteit',
    'on': 'Ongespecificeerd',
    
    // Aliases
    'alle': 'Alle sectoren'
  };
  
  // Get the display names from the mappings, defaulting to the codes if not found
  const routekaartText = routekaartMapping[routekaart] || routekaart || 'Alle toepassingen';
  const sectorText = sectorMappings[sector] || sector || 'Alle sectoren';
  
  // Update the display element
  const displayElement = document.getElementById('waterval-selection-display');
  if (displayElement) {
    displayElement.textContent = `${routekaartText} | ${sectorText}`;
    console.log(`Updating waterfall display: ${routekaartText} | ${sectorText} (codes: ${routekaart}, ${sector})`);
  }
}

// setTimeout(() => {
//   switchRoutekaart({
//     scenario: currentScenario,
//     sector: 'ind_km',
//     routekaart: 'proces',
//     yMax: [100,0,100 ],
//     titlesArray: currentTitlesArray,
//     colorsArray: currentColorsArray
//   })
// }, 3000);


