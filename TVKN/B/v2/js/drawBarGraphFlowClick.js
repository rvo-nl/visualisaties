function drawBarGraph (data, config) {
  console.log(config, data)

  d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0.3)').style('pointer-events', 'none')

  const popup = d3.select(`#popupContainer`)
    .append('div')
    .attr('id', 'nodeInfoPopup')
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('top', '0px')
    .style('left', '0px')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .append('div')
    .style('pointer-events', 'auto')
    .attr('id', 'flowAnalysisPopup')
    .style('position', 'absolute')
    .style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.2)')
    .style('border-radius', '10px')
    // .style('margin', 'auto')
    .style('width', '1000px')
    .style('height', '700px')
    .style('background-color', 'rgba(255,255,255,1)')

  // Create and style the main SVG container
  const svg = popup.append('svg')
    .style('position', 'absolute')
    .style('width', '100%')
    .style('height', '100%')
    .attr('id', 'flowAnalysisSVG_main')

  const canvas = svg.append('g')

  // Add title text
  const sourceNode = nodesGlobal.find(item => item.id === data.source)
  const targetNode = nodesGlobal.find(item => item.id === data.target)
  canvas.append('text')
    .attr('x', 100)
    .attr('y', 50)
    .style('font-size', '16px')
    .style('font-weight', 500)
    .text(`Flow '${sourceNode.title} - ${targetNode.title}' (PJ)`)

  // Add path and rectangle elements to the canvas
  canvas.append('path')
    .attr('d', 'M94.333 812.333 40 772.667 232 466l119.714 140 159.619-258.666 109 162.333q-18.333 1.667-35.166 6.167-16.834 4.5-33.5 11.166l-37.334-57-152.371 248.333-121.296-141-146.333 235ZM872.334 1016 741.333 885q-20.666 14.667-45.166 22.333-24.5 7.667-50.5 7.667-72.222 0-122.778-50.578-50.555-50.579-50.555-122.834t50.578-122.754q50.578-50.5 122.833-50.5T768.5 618.889Q819 669.445 819 741.667q0 26-8 50.5t-22 46.465l131 129.702L872.334 1016ZM645.573 848.334q44.76 0 75.761-30.907 31-30.906 31-75.666 0-44.761-30.907-75.761-30.906-31-75.666-31Q601 635 570 665.906q-31 30.906-31 75.667 0 44.76 30.906 75.761 30.906 31 75.667 31ZM724.666 523q-16.333-6.667-33.833-9.666-17.5-3-36.166-4.667l211-332.667L920 215.666 724.666 523Z')
    .attr('transform', 'translate(50,27)scale(0.030)')
    .style('fill', '#666')

  canvas.append('rect')
    .attr('x', 30)
    .attr('y', 60)
    .attr('width', 940)
    .attr('height', 410)
    .attr('fill', '#fff')

  // Add close button with interactions
  const closeButton = canvas.append('rect')
    .attr('x', 955 - 20)
    .attr('y', 35)
    .attr('width', 30)
    .attr('height', 30)
    .attr('fill', '#FFF')
    .style('pointer-events', 'auto')
    .on('mouseover', () => d3.select(closeButton.node()).attr('fill', '#999'))
    .on('mouseout', () => d3.select(closeButton.node()).attr('fill', '#fff'))
    .on('click', () => {
      d3.select('#nodeInfoPopup').remove()
      d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0)').style('pointer-events', 'none')
      document.body.style.overflow = 'auto'
    })
  // document.documentElement.style.overflow = 'hidden'; // For <html>
  document.body.style.overflow = 'hidden'; // For <body>ß
  d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0.3)').style('pointer-events', 'all')

  canvas.append('path')
    .style('pointer-events', 'none')
    .attr('id', `${config.targetDIV}_closeButton`)
    .attr('d', 'm249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z')
    .attr('transform', 'translate(931,27)scale(0.04)')

  // Chart dimensions and scales
  const margin = { top: 10, right: 30, bottom: 30, left: 60 }
  const height = 50
  const shiftX = 100
  let shiftXAdditional = 144
  const spacing = 40
  const width = 450

  var determineMaxValue = Object.entries(data)
    .filter(([key]) => key.includes('scenario'))

  var scenarios2030
  if (data.legend !== 'co2flow') {
    scenarios2030 = Object.entries(data)
      .filter(([key]) => key.includes('scenario') && key.includes('x' + '2030' + 'x'))
  } else {
    scenarios2030 = Object.entries(data).filter(([key]) => key.includes('scenario') && key.includes('x2030x'))
    scenarios2030 = scenarios2030.map(([key, value]) => [key, value * globalCO2flowScale])
  }

  var scenarios2035
  if (data.legend !== 'co2flow') {
    scenarios2035 = Object.entries(data)
      .filter(([key]) => key.includes('scenario') && key.includes('x' + '2035' + 'x'))
  } else {
    scenarios2035 = Object.entries(data).filter(([key]) => key.includes('scenario') && key.includes('x2035x'))
    scenarios2035 = scenarios2035.map(([key, value]) => [key, value * globalCO2flowScale])
  }

  var scenarios2040
  if (data.legend !== 'co2flow') {
    scenarios2040 = Object.entries(data)
      .filter(([key]) => key.includes('scenario') && key.includes('x' + '2040' + 'x'))
  } else {
    scenarios2040 = Object.entries(data).filter(([key]) => key.includes('scenario') && key.includes('x2040x'))
    scenarios2040 = scenarios2040.map(([key, value]) => [key, value * globalCO2flowScale])
  }

  var scenarios2045
  if (data.legend !== 'co2flow') {
    scenarios2045 = Object.entries(data)
      .filter(([key]) => key.includes('scenario') && key.includes('x' + '2045' + 'x'))
  } else {
    scenarios2045 = Object.entries(data).filter(([key]) => key.includes('scenario') && key.includes('x2045x'))
    scenarios2045 = scenarios2045.map(([key, value]) => [key, value * globalCO2flowScale])
  }

  var scenarios2050
  if (data.legend !== 'co2flow') {
    scenarios2050 = Object.entries(data)
      .filter(([key]) => key.includes('scenario') && key.includes('x' + '2050' + 'x'))
  } else {
    scenarios2050 = Object.entries(data).filter(([key]) => key.includes('scenario') && key.includes('x2050x'))
    scenarios2050 = scenarios2050.map(([key, value]) => [key, value * globalCO2flowScale])
  }

  // ----- 2030

  for (i = 0;i < 36;i++) {
    canvas.append('rect')
      .attr('width', 1)
      .attr('height', 10)
      .attr('x', 161 + i * 20.44)
      .attr('y', 295 + 10)
      .attr('fill', '#ccc')
    canvas.append('rect')
      .attr('width', 1)
      .attr('height', 10)
      .attr('x', 161 + i * 20.44)
      .attr('y', 295 + 86 + 10)
      .attr('fill', '#ccc')
    canvas.append('rect')
      .attr('width', 1)
      .attr('height', 10)
      .attr('x', 161 + i * 20.44)
      .attr('y', 295 + 86 + 86 + 10)
      .attr('fill', '#ccc')
    canvas.append('rect')
      .attr('width', 1)
      .attr('height', 10)
      .attr('x', 161 + i * 20.44)
      .attr('y', 295 + 86 + 86 + 86 + 8)
      .attr('fill', '#ccc')
  }

  drawBarsPerYear(scenarios2030, '2030', {yPos: 235})
  drawBarsPerYear(scenarios2035, '2035', {yPos: 300 + 20})
  drawBarsPerYear(scenarios2040, '2040', {yPos: 365 + 40})
  drawBarsPerYear(scenarios2045, '2045', {yPos: 430 + 60})
  drawBarsPerYear(scenarios2050, '2050', {yPos: 495 + 80})

  function drawBarsPerYear (inputData, tag, yPos) {
    var x = d3.scaleBand()
      .range([0, width + 300])
      .domain(inputData.map(([key]) => key.substring(0, key.indexOf('_'))))
      .padding(0.7)

    // console.log(data.legend)

    y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(determineMaxValue, ([, value]) => value)])

    // Add y-axis gridlines and limit tick marks to 5
    canvas.append('g')
      .call(d3.axisLeft(y).ticks(3).tickSize(-width - 350).tickFormat(''))
      .attr('transform', `translate(${shiftX+shiftXAdditional-120}, ${yPos.yPos})`) // Y POSITION
      .selectAll('.tick line')
      .style('stroke', '#999')
      .style('stroke-width', 1)
      .style('opacity', 0.8)
    // .style('stroke-dasharray', '8,4')
    // Draw bars
    canvas.selectAll('.bar_' + tag)
      .data(inputData)
      .enter().append('rect')
      .attr('class', '.bar_' + tag)
      .attr('fill', d => config.legend.find(item => item.id === data.legend).color)
      .attr('x', d => x(d[0].substring(0, d[0].indexOf('_'))))
      .attr('y', d => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[1]))
      .attr('transform', (d, i) => {
        // if ([2, 4, 6, 8, 10, 12].includes(i)) {shiftXAdditional += spacing}
        if ([].includes(i)) {shiftXAdditional += spacing}
        return `translate(${shiftX + shiftXAdditional-100},${yPos.yPos})` // Y POSITION
      })

    // Add y-axis with label
    const formatMillions = (d) => {
      const scaled = d
      return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(scaled); // Format with '.' as thousands separator
    }

    canvas.append('g')
      .call(d3.axisLeft(y).ticks(3).tickFormat(formatMillions))
      .attr('transform', `translate(${shiftX+ 20}, ${yPos.yPos} )`) // Y POSITION
      .selectAll('text')
      .style('font-weight', 500)
      .style('font-size', '10px')

    canvas.append('text')
      .attr('transform', `translate(50, ${yPos.yPos+15} )`) // Y POSITION
      .attr('dy', '1em')
      .style('font-size', '15px')
      .style('text-anchor', 'middle')
      .style('fill', '#222')
      .style('font-weight', 400)
      // .text(function () {if (data.legend != 'co2flow') {return 'PJ'} else {return 'kton CO2'}})
      .text(tag)

    d3.selectAll('.domain').remove() // remove domain lines ()

  }
  // TAFEL
  // Add x-axis labels
  const varianten = ['(1) OP-CO2-opslag 40', '(2) OP-CO2-opslag 50', '(3) OP-geen kernenergie 2050', '(4) OP-methanolroute', '(5) OP-minder warmtenetten', '(6) OP-mob conservatief', '(7) OP-OP_CCS_30_in_2050', '(8) OP_kern_30_in_2050', '(9) OP_minder plastic afval', '(10) OP_wind_hoog', '(11) OP_FossilCarbonPenalty', '(12) OS_FossilCarbonPenalty', '(13) OS-geen kernenergie 2050', '(14) OS-methanolroute', '(15) OS_CCS_30_in_2050', '(16) OS_kern_30_in_2050', '(17) OS_minder plastic afval', '(18) OS_wind_hoog', '(19) OP-OS bio hoog waterstof laag', '(20) OP-OS bio laag waterstof hoog', '(21) OP-OS fossiel verbruik', '(22) OP-OS primair verbruik', '(23) OP-PP biogrondstoffen', '(24) OP-PP waterstof', '(25) PP_FossilCarbonPenalty', '(26) PP-CO2-opslag 40', '(27) PP-CO2-opslag 50', '(28) PP-geen kernenergie 2050', '(29) PP-methanolroute', '(30) PP-minder warmtenetten', '(31) OP-PP-mob conservatief', '(32) PP_CCS_30_in_2050', '(33) PP_kern_30_in_2050', '(34) PP_minder plastic afval', '(35) PP_wind_hoog', '(36) PPP - bio en h2 laag - CCS 40 in 2050']
  const posy = height + 165 + 10 // Y POSITION
  shiftXAdditional = 0

  scenarios2030.forEach((d, j) => {
    // if ([2, 4, 6, 8, 10, 12].includes(j)) shiftXAdditional += spacing - 3.5
    if ([].includes(j)) shiftXAdditional += spacing - 3.5
    const posx = shiftX + shiftXAdditional + j * (20.44) + 75 - 15 + 4
    canvas.append('text')
      .style('text-anchor', 'start')
      .style('font-size', '10px')
      .attr('transform', `translate(${posx},${posy})rotate(-90)`)
      .text(varianten[j])
  })
}
