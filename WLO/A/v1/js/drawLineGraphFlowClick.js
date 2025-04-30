function drawBarGraph (data, config) {
  console.log(config, data)

  /* ----------  POP‑UP SHELL  ---------- */
  d3.select('#popupContainer')
    .style('background-color', 'rgba(0,0,0,0.3)')
    .style('pointer-events', 'none')

  const popup = d3.select('#popupContainer')
    .append('div')
    .attr('id', 'nodeInfoPopup')
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0)
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .append('div')
    .style('pointer-events', 'auto')
    .attr('id', 'flowAnalysisPopup')
    .style('position', 'absolute')
    .style('box-shadow', '0 4px 10px rgba(0,0,0,0.2)')
    .style('border-radius', '10px')
    .style('width', '1000px')
    .style('height', '700px')
    .style('background-color', '#fff')

  const svg = popup.append('svg')
    .style('position', 'absolute')
    .style('width', '100%')
    .style('height', '100%')
    .attr('id', 'flowAnalysisSVG_main')

  const canvas = svg.append('g')

  /* ----------  HEADER & FRAME  ---------- */
  // Find source and target nodes, with fallback text if undefined
  const sourceNode = nodesGlobal.find(n => n.id === data.source) || {title: 'Unknown source'}
  const targetNode = nodesGlobal.find(n => n.id === data.target) || {title: 'Unknown target'}
  console.log(nodesGlobal)
  canvas.append('text')
    .attr('x', 100)
    .attr('y', 50)
    .style('font-size', '14px')
    .style('font-weight', 500)
    .text(`Flow '${sourceNode['title.system']} - ${targetNode['title.system']}' (PJ)`)

  // canvas.append('rect')
    //   .attr('x', 30)
    //   .attr('y', 60)
    //   .attr('width', 940)
    //   .attr('height', 410)
    //   .attr('fill', '#fff')

  /* ----------  CLOSE BUTTON  ---------- */
  const CLOSE_SIZE = 30; // rectangle is 30×30
  const CLOSE_X = 955 - 20 // your original offsets
  const CLOSE_Y = 35

  const closeGroup = canvas.append('g')
    .attr('class', 'close-btn')
    .attr('transform', `translate(${CLOSE_X}, ${CLOSE_Y})`)
    .style('cursor', 'pointer')
    .on('click', () => {
      d3.select('#nodeInfoPopup').remove()
      d3.select('#popupContainer')
        .style('background-color', 'rgba(0,0,0,0)')
        .style('pointer-events', 'none')
      document.body.style.overflow = 'auto'
    })

  /* button background */
  closeGroup.append('rect')
    .attr('width', CLOSE_SIZE)
    .attr('height', CLOSE_SIZE)
    .attr('rx', 4)
    .attr('fill', '#fff')
    .on('mouseover', function () { d3.select(this).attr('fill', '#999'); })
    .on('mouseout', function () { d3.select(this).attr('fill', '#fff'); })

  /* “X” icon (Material‑icon path, 960 × 960 units)        *
   * 1️⃣ translate(-480,-480)  → move centre of icon to (0,0)
   * 2️⃣ scale(0.03125)        → 960 × 0.03125 = 30 px wide
   * 3️⃣ translate(15,15)      → centre of our 30 × 30 button */
  const ICON_PATH = 'm249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z'

  closeGroup.append('path')
    .attr('d', ICON_PATH)
    .attr('transform', 'translate(15,15) scale(0.03125) translate(-480,-480)')
    .attr('fill', '#666')
    .style('pointer-events', 'none') // rectangle handles the clicks

  /* ----------  CONSTANTS  ---------- */
  const width = 350 // Reduced from 450 to make room for legend
  const height = 50 // height of a single bar row
  const shiftX = 100
  let shiftXAdditional = 144; // carried through every row – don't reset

  /* ----------  DATA WRANGLING  ---------- */
  const determineMaxValue = Object.entries(data)
    .filter(([k]) => k.includes('scenario'))

  const co2Scale = v => data.legend !== 'co2flow' ? v : v * globalCO2flowScale

  const yearData = y => Object.entries(data)
    .filter(([k]) => k.includes('scenario') && k.includes('x' + y + 'x'))
    .map(([k, v]) => [k, co2Scale(v)])

  const scenarios2030 = yearData(2030)
  const scenarios2035 = yearData(2035)
  const scenarios2040 = yearData(2040)
  const scenarios2045 = yearData(2045)
  const scenarios2050 = yearData(2050)
  const scenarios2055 = yearData(2055)
  const scenarios2060 = yearData(2060)

  /* ----------  DRAW LINE GRAPH  ---------- */
  const years = [2030, 2035, 2040, 2045, 2050, 2055, 2060]
  const scenarios = [scenarios2030, scenarios2035, scenarios2040, scenarios2045, scenarios2050, scenarios2055, scenarios2060]
  const colors = d3.schemeCategory10; // Use D3's category10 color scheme for unique colors

  // x-scale for years
  const x = d3.scalePoint()
    .domain(years)
    .range([shiftX, shiftX + width + 300])

  // y-scale for values
  const y = d3.scaleLinear()
    .domain([0, d3.max(determineMaxValue, ([, v]) => v)])
    .range([height + 550, 130])

  // line generator
  const line = d3.line()
    .x((d, i) => x(years[i]))
    .y(d => y(d[1]))

  /* ----------  TOP‑OF‑CHART VARIANT LABELS  ---------- */
  const varianten = [

    'WLO1', 'WLO2',
    'WLO3', 'WLO4',
    'Pragmatisch Ruim 40', 'Specifiek Ruim 20',
    'Pragmatisch Beperkt 30'
  ]

  /* x‑scale identical to the 2030 row */
  const xTop = d3.scaleBand()
    .range([0, width + 300])
    .domain(scenarios2030.map(([k]) => k.split('_')[0]))
    .padding(0.7)

  /* labels share the same translate as bars */
  const labelGroup = canvas.append('g')
    .attr('transform',
      `translate(${shiftX + shiftXAdditional - 100}, ${height + 165 + 10})`)

  /* remove axis domain strokes */
  canvas.selectAll('.domain').remove()

  // draw lines and dots for each scenario
  scenarios2030.forEach((scenario, index) => {
    const scenarioName = varianten[index]
    const color = colors[index % colors.length]

    // Only include data up to 2050 for PR40, SR20, and PB30
    const scenarioData = scenarios.map(s => s[index])
    const isLimitedScenario = ['Pragmatisch Ruim 40', 'Specifiek Ruim 20', 'Pragmatisch Beperkt 30'].includes(scenarioName)
    const limitedScenarioData = isLimitedScenario ? scenarioData.slice(0, 5) : scenarioData
    const limitedYears = isLimitedScenario ? years.slice(0, 5) : years

    // Draw line
    canvas.append('path')
      .datum(limitedScenarioData)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line)

    // Draw dots
    limitedScenarioData.forEach((d, i) => {
      canvas.append('circle')
        .attr('cx', x(limitedYears[i]))
        .attr('cy', y(d[1]))
        .attr('r', 4)
        .attr('fill', color)
        .on('mouseover', function (event) {
          const [xPos, yPos] = d3.pointer(event)
          canvas.append('text')
            .attr('x', xPos + 5)
            .attr('y', yPos - 10)
            .attr('class', 'hover-label')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text(`${scenarioName}: ${d3.format('.2f')(d[1])}`)
        })
        .on('mouseout', function () {
          canvas.selectAll('.hover-label').remove()
        })
    })
  })

  // Add legend
  const legend = canvas.append('g')
    .attr('transform', `translate(${shiftX + width + 350}, 130)`) // Moved closer to graph

  // Add legend items
  varianten.forEach((variant, i) => {
    const legendItem = legend.append('g')
      .attr('transform', `translate(0, ${i * 25})`) // 25px spacing between items

    // Add colored square
    legendItem.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', colors[i % colors.length])

    // Add text label
    legendItem.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .text(variant)
  })

  // x-axis
  canvas.append('g')
    .attr('transform', `translate(0, ${height + 550})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')))
    .style('font-size', '12px')

  // y-axis
  canvas.append('g')
    .attr('transform', `translate(${shiftX}, 0)`)
    .call(d3.axisLeft(y).ticks(10))
    .style('font-size', '12px')

  // Add Y-axis title
  canvas.append('text')
    .attr('transform', `translate(${shiftX - 40}, ${(height + 550 + 130) / 2}) rotate(-90)`)
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('PJ/jaar')

  // Add horizontal gridlines
  canvas.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${shiftX}, 0)`) // Align with y-axis
    .call(d3.axisLeft(y)
      .ticks(10)
      .tickSize(-width - 300) // Adjusted to match new width
      .tickFormat(''))

  // Add y-axis line
  canvas.append('line')
    .attr('x1', shiftX)
    .attr('y1', 130)
    .attr('x2', shiftX)
    .attr('y2', height + 550)
    .attr('stroke', '#000')
    .attr('stroke-width', 1)

  // remove old bar elements
  canvas.selectAll('.bar_').remove()
  canvas.selectAll('.value-label_').remove()
  canvas.selectAll('.domain').remove()
}
