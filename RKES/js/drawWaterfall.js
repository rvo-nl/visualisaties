let dataset_c
let dataset_nat
let dataset_int

let valueFactorAdjustment = 1
async function xlsxToJSON(url) {
  try {
    // Fetch the xlsx file
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    // Convert array buffer to workbook
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const result = {};
    // Iterate over each sheet
    workbook.SheetNames.forEach(sheetName => {
      // Convert the sheet to JSON
      const worksheet = workbook.Sheets[sheetName];
      result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
    });
  return result;
  } catch (error) {
    console.error('Error converting xlsx to JSON:', error);
    throw error;
  }
}

xlsxToJSON('https://rvo-nl.github.io/rkes/data/data_c.xlsx').then(data => {dataset_c = data}).catch(error => {console.error('Error:', error);});
xlsxToJSON('https://rvo-nl.github.io/rkes/data/data_int.xlsx').then(data => {dataset_int = data}).catch(error => {console.error('Error:', error);});
xlsxToJSON('https://rvo-nl.github.io/rkes/data/data_nat.xlsx')
  .then(data => {
    dataset_nat = data
    // INTEGRALE ROUTEKAART WARMTE
    drawWaterfallDiagram(data,
      {divID:'opbouw',
      chartID:'.chart_opbouw',
      sheetID: 'w_op_all', 
      yOffsetJaarTotalen: 259,
      annualMaxValueCorrect:0,
      titlesArray:   ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS'],
      colorsArray: ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444'],
      yMax: 1400, marginLeft: -100, marginTop: 25, marginBottom:30, yTicks: 5, classTag: 'A'
    })
    drawWaterfallDiagram(data,
      {divID:'ccs',
      chartID:'.chart_ccs',
      sheetID: 'w_cc_all',
      yOffsetJaarTotalen:53,
      annualMaxValueCorrect:0,
      titlesArray:   ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS'],
      colorsArray: ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444'],
      yMax: 100, marginLeft: -100, marginTop: 20,marginBottom:30, yTicks: 3, classTag: 'B'
    })
    drawWaterfallDiagram(data,{
      divID:'afbouw',chartID:'.chart_afbouw',
      sheetID: 'w_af_all',
      yOffsetJaarTotalen: 239,
      annualMaxValueCorrect:0,
      titlesArray:   ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS'],
      colorsArray: ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444'],
      yMax: 1400, marginLeft: -100, marginBottom:50,marginTop: 5, yTicks: 5, classTag: 'C'})
  })
  .catch(error => {
      console.error('Error:', error);
});

function drawWaterfallDiagram(result,config){
  drawMainContainerBackdrop(config)
  var totalWidth = 2000
  var margin = { top: config.marginTop, right: 30, bottom: config.marginBottom, left: config.marginLeft },

  width = 1500
  height = document.getElementById(config.divID).offsetHeight - margin.top - margin.bottom
  padding = 0.3;

  d3.select(config.chartID)
    .attr("width", totalWidth)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  var years = Object.keys(result[config.sheetID][0]).filter(key => key !== 'name'); // Extract years from column names
  var chartWidth = (width + margin.left + margin.right) / years.length; // Calculate width of each chart

  years.forEach((year, index) => {
  var data = result[config.sheetID].map(d => ({
    name: d.name,
    value: +d[year]/valueFactorAdjustment, // Get value for the current year
  }));


  var cumulative_period = 0;
  var cumulative_go = 0;
  var cumulative_ind = 0;
  var cumulative_ag = 0;
  var cumulative_tr = 0;
  
  var reference_subtotal_sector = 0
  let barWidths = []
  let barXpositions = []
  let barXposition_cumulative = 0
  let barWidth_current = 23
  let barWidth_subtotal = 329.5
  let barWidth_intermediates = 22
  let barWidth_last = 30

  let barPositionIncreaseIntermediates = 24.05
  let barPositionIncreaseSubTotals =0 
  let barPositionIncreaseStart = 70

  let subTotalShiftLeft = 262.5
  let colorsArray = []
  let classesArray = [] 
  data.forEach(function (d,index) {
    if (index == 0){
      d.start = cumulative_period;
      cumulative_period += d.value;
      d.end = cumulative_period;
      d.class = (d.value >= 0) ? 'positive' : 'negative';
      reference_subtotal_sector += d.value
      barWidths.push(barWidth_current)
      barXpositions.push(barXposition_cumulative)
      barXposition_cumulative += barPositionIncreaseStart
      colorsArray.push('none')
      classesArray.push('start')
      colorsArray.push(...config.colorsArray)
      classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');
    }
    else if (index > 0 && index < 9){
      d.start = cumulative_period;
      cumulative_period += d.value;
      d.end = cumulative_period;
      d.class = (d.value >= 0) ? 'positive' : 'negative';
      cumulative_go += d.value
      barWidths.push(barWidth_intermediates)
      barXpositions.push(barXposition_cumulative)
      barXposition_cumulative += barPositionIncreaseIntermediates
    } else if (index == 9){
      d.start = reference_subtotal_sector;
      d.end = cumulative_period;
      reference_subtotal_sector += cumulative_go
      d.class = (d.value >= 0) ? 'positive' : 'negative';
      barWidths.push(barWidth_subtotal)
      barXpositions.push(barXposition_cumulative)
      barXposition_cumulative += barPositionIncreaseSubTotals
      colorsArray.push('rgba(100,100,100,0.1)')
      classesArray.push('subtotal')
      colorsArray.push(...config.colorsArray)
      classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');
    } else if (index > 9 && index < 18){
      d.start = cumulative_period;
      cumulative_period += d.value;
      d.end = cumulative_period;
      d.class = (d.value >= 0) ? 'positive' : 'negative';
      barWidths.push(barWidth_intermediates)
      barXpositions.push(barXposition_cumulative)
      barXposition_cumulative += barPositionIncreaseIntermediates
      cumulative_ind += d.value
    } else if (index == 18){
      d.start = reference_subtotal_sector;
      d.end = cumulative_period;
      d.class = (d.value >= 0) ? 'positive' : 'negative';
      reference_subtotal_sector += cumulative_ind
      barXpositions.push(barXposition_cumulative)
      barXposition_cumulative += barPositionIncreaseSubTotals
      barWidths.push(barWidth_subtotal)
      colorsArray.push('rgba(100,100,100,0.0)')
      classesArray.push('subtotal')
      colorsArray.push(...config.colorsArray)
      classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');classesArray.push('intermediate');
    } else if (index > 18 && index < 27){
      d.start = cumulative_period;
      cumulative_period += d.value;
      d.end = cumulative_period;
      d.class = (d.value >= 0) ? 'positive' : 'negative';
      cumulative_ag += d.value
      barWidths.push(barWidth_intermediates)
      barXpositions.push(barXposition_cumulative)
      barXposition_cumulative += barPositionIncreaseIntermediates
    } else if (index == 27){
      d.start = reference_subtotal_sector;
      d.end = cumulative_period;
      d.class = (d.value >= 0) ? 'positive' : 'negative';
      reference_subtotal_sector += cumulative_ag
      barWidths.push(barWidth_subtotal)
      barXpositions.push(barXposition_cumulative)
      barXposition_cumulative += barPositionIncreaseSubTotals
      colorsArray.push('rgba(100,100,100,0.0)')
    }
  });

  data.push({
    name: 'Total',
    end: cumulative_period,
    start: 0,
    class: 'total'
  });

  var x = d3.scaleBand()
    .range([0, chartWidth])
    .padding(padding);

  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, config.yMax/valueFactorAdjustment]);

  var xAxis = d3.axisBottom(x).tickSize(0);

  var yAxis = d3.axisLeft(y).ticks(config.yTicks)
    .tickSize(-width)

  let shiftRight = 150
  var chart = d3.select(config.chartID)
    .append("svg")
    .attr('id','waterfallSVG')
    .attr("class", "chart-svg")
    .attr('width',totalWidth)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${index *  (chartWidth + margin.left + margin.right)+shiftRight},${margin.top})`); // Adjusted positioning

  x.domain(data.map(function (d) { return d.name; }));

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis) 
    .selectAll("text") // Select all text elements for the x-axis
    .style("text-anchor", "end") // Adjust the text-anchor for better alignment
    .attr("dx", "-.8em")
    .attr("dy", "-0.6em")
    .attr('fill','none')
    .attr("transform", "rotate(-90)") // Rotate the text

    if (index == 0 ){
    // Y GRIDLINES
      chart.append("g")
        .attr('id','yGridLines')
        .attr("class", "y axis")
        .style("stroke-opacity", 1)
        .style("shape-rendering", "crispEdges")
        .call(yAxis)
        .selectAll("text") // Select all text elements for the x-axis
        .attr("dx", "-.8em")
        .style('font-size','13px')
        .attr('fill','#666')
      d3.selectAll('#yGridLines line').style('stroke','#E8F0F4').style('stroke-width',2)//.style('visibility','hidden')
    }



    var bar = chart.selectAll(".bar")
      .data(data)
      .enter().append("g")
      .attr('fill',function(d,i){return colorsArray[i]})
      .attr('class',function(d,i){return classesArray[i]+'Bar_'+config.classTag+'_'+year})
      .attr('transform',function(d,i){
    if (classesArray[i] == 'subtotal'){
      var posx = barXpositions[i]-subTotalShiftLeft
      return 'translate('+posx+',0)'
    } else {
      return 'translate('+barXpositions[i]+',0)'
    }
  })

  moveBack(d3.select('.subtotalBar_'+config.classTag+'_'+'2020naar2030'),2)
  moveBack(d3.select('.subtotalBar_'+config.classTag+'_'+'2030naar2035'),3)
  moveBack(d3.select('.subtotalBar_'+config.classTag+'_'+'2035naar2040'),4)
  moveBack(d3.select('.subtotalBar_'+config.classTag+'_'+'2040naar2050'),5)
  
  bar.append("rect")
    .style('opacity',1)
    .attr("y", function (d) { if (!isNaN(y(Math.max(d.start, d.end))+0.5)){return y(Math.max(d.start, d.end))+0.5;} else return 0 })
    .attr("height", function (d) { if (Math.abs(y(d.start) - y(d.end)) - 1 > 0) {return Math.abs(y(d.start) - y(d.end)) - 1; } else {return 0}})
    .attr("width", function(d,i){return barWidths[i]})


  bar.append("text")
    .attr("x", x.bandwidth() / 2)
    .attr("y", function (d) {if (y(d.end) + 5 != NaN){ return y(d.end) + 5; } else return 0})
    .style('text-anchor', function (d) { return ((d.class == 'negative') ? 'end' : 'start'); })
    .text(function (d) { 
      if (d.end-d.start > 0){
        return '+ '+ parseInt(d.end - d.start);
      } else {
        return '- '+ Math.abs(parseInt(d.end - d.start)); }
    })
    .attr("transform", function(d) {
      // Calculate rotation and position for the rotation center
      var rotationX
      var rotationY
      if (d.class == 'negative'){
        rotationX = x.bandwidth() / 2+2;
        rotationY = y(d.end) +3
      }
      else {
        rotationX = x.bandwidth() / 2-2;
        rotationY = y(d.end) -2
      }            
      return "rotate(-90 " + rotationX + "," + rotationY + ")";
    }).style('visibility',
    function(d){
      if (parseInt(d.value)>0 || parseInt(d.value)){
      return 'visible'
      } else {return 'hidden'}
    })
    bar.filter(function (d) { return d.class != "total"; })
      .append("line")
      .attr('id','trackLine')
      .style('stroke','#666')
      .attr("x1", x.bandwidth() -22)
      .attr("y1", function (d) { return y(d.end); })
      .attr("x2", function(d){
        if (d.name == 'ccs'){
          return  x.bandwidth() / (1 - padding) +75
        }else if (d.name == 'Totaal start periode'){
          return  x.bandwidth() / (1 - padding) +27+6+20+7
        } else if (d.name != 'null'){
          return  x.bandwidth() / (1 - padding) +9+6+2-2
        }
      })
      .attr("y2", function (d) { return y(d.end); })
      .style('visibility',function(d){ 
        if (d.name == 'Totaal start periode' || d.name == 'ccs' ){
        return 'visible'
      } else return 'visible'  
    })
  });


  // adjust domain lines
  d3.selectAll('.domain').remove(); // remove all domain lines

  var yCoordinate = d3.scaleLinear()
  .range([height, 0])
  .domain([0, config.yMax]);

  let yearsList = ['2020','2030','2035','2040','2050']

  let annualMaxValues = []
  let annualMaxValuesAbsolute = []

  for (j=0;j<yearsList.length;j++){
    let count = 0
    for (i=0;i<result[config.sheetID+'_tot'].length;i++){
    count += result[config.sheetID+'_tot'][i][yearsList[j]] // /valueFactorAdjustment
    }
    annualMaxValues.push(height-yCoordinate(count)-config.annualMaxValueCorrect)
    annualMaxValuesAbsolute.push(count)
  }

      
  for(i=0;i<5;i++){
    let valuesArray = []
    for (j=0;j<8;j++){
      valuesArray.push(result[config.sheetID+'_tot'][j][yearsList[i]])
    }
    plotStackedBarGraph(config,
    valuesArray, // data
    annualMaxValues[i], // refHeight
    i*287.5+60, // xPos
    config.yOffsetJaarTotalen, // yPos
    config.chartID, // svg
    i, // index
    annualMaxValues, // annualMaxValues
    config.annualMaxValueCorrect, // annualMaxValueCorrext
    annualMaxValuesAbsolute) // annualMaxValuesAbsolute
    }
  }

// Function to move an element back by a specified number of levels
function moveBack(selection, levels) {
  selection.each(function() {
      var node = this;
      var parent = node.parentNode;
      // Ensure there's a parent and it has children
      if (parent) {
          var childNodes = parent.childNodes;
          // Find the current index of the node
          var currentIndex = Array.prototype.indexOf.call(childNodes, node);
          // Calculate the new index
          var newIndex = Math.max(currentIndex - levels, 0);
          // If the node is not already the first child, move it
          if (newIndex < currentIndex) {
              parent.insertBefore(node, childNodes[newIndex]);
          }
      }
  });
}

let previousTotal = 0
function plotStackedBarGraph(config,data, refHeight, xPos, yPos, svg,index,annualMaxValues,annualMaxValueCorrect,annualMaxValuesAbsolute) {
  // Calculate the total sum of the data array
  const totalSum = data.reduce((acc, val) => acc + val, 0);
  // Calculate the normalized heights based on the reference height
  const normalizedHeights = data.map(value => ((value) / totalSum) * refHeight);
  // Initial y position for the first bar segment starts at the base y position
  let currentY = yPos;
  // Create or select the SVG element
  svg = d3.select(svg);
  const barGroup = svg.append('g')
    .attr('transform', `translate(${xPos},0)`); // Translate only along x-axis
    // Colors for each bar segment
    // const colorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444'];
  const colorsArray=config.colorsArray

  svg.append('g').append('text')
    .attr('fill','#666')
    .attr('id','waterfallSVG')
    .style('text-anchor','middle')
    .style('font-size','13px')
    .text(Math.round(parseInt(totalSum)/valueFactorAdjustment))
    .attr('transform', `translate(${117+xPos-6}, ${yPos-refHeight-20+10}) `)

  if (index > 0){
    svg.append('line')
      .attr('id','waterfallSVG')
      .style('stroke-dasharray',3)
      .attr('x1',xPos+76)
      .attr('x2',xPos+76)
      .attr('y1',yPos-refHeight)
      .attr('y2',yPos-previousTotal)
      .style('stroke','#666')
    if (annualMaxValues[index-1] - annualMaxValues[index] < 0){
      svg.append('path')
        .attr('id','waterfallSVG')
        .attr('d','M10,10 L20,10 L15,0 Z')
        .attr('fill','#aaa')
        .attr('transform', `translate(${xPos+61}, ${yPos-refHeight+4-4})`)
      svg.append('text')
        .attr('id','waterfallSVG')
        .attr('fill','#aaa')
        .style('text-anchor','middle')
        .style('font-size','11px')
        .text('+ '+Math.round(parseInt(annualMaxValuesAbsolute[index]- annualMaxValuesAbsolute[index-1])/valueFactorAdjustment))
        .attr('transform', `translate(${xPos+61+32-14}, ${yPos-refHeight-10-9}) rotate (-90)`)
    } else {
      svg.append('path')
        .attr('id','waterfallSVG')
        .attr('d','M10,5 L20,5 L15,15 Z')
        .attr('fill','#aaa')
        .attr('transform', `translate(${xPos+61}, ${yPos-refHeight-10-9+4})`)
      svg.append('text')
      .attr('id','waterfallSVG')
      .attr('fill','#aaa')
      .style('text-anchor','end')
      .style('font-size','11px')
      .text('- '+Math.round(parseInt(annualMaxValuesAbsolute[index-1]-annualMaxValuesAbsolute[index])/valueFactorAdjustment))
      .attr('transform', `translate(${xPos+61+32-14}, ${yPos-refHeight+10}) rotate (-90)`)
    }

  }
  previousTotal = refHeight

  
  // Append each segment of the bar graph
  normalizedHeights.forEach((height, index) => {
    // For each bar, start from the currentY position and move upwards
    barGroup.append('rect')
      .attr('id','waterfallSVG')
      .attr('x', 100-10)
      .attr('y', function(){if (!isNaN(currentY - height+0.5)){return currentY - height+0.5} })  // Position the bar's top edge at currentY - height
      .attr('width', 23+19)  // Fixed width for the bar
      .attr('height', function(){ if (isNaN(height)){return 0} else return height})
      .attr('fill', colorsArray[index]);  // Color, using a predefined color scheme

    // Update y position for the next bar segment to move further up
    currentY -= height;  // Subtract height from currentY to move up
  });
}
