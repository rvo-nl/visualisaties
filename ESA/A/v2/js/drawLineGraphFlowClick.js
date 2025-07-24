let globalVisibleScenarios
var globalPopupData = null
var globalPopupConfig = null

function closePopup () {
  d3.select('#nodeInfoPopup').remove()
  const container = d3.select('#popupContainer')
  container.on('click', null)
  container
    .style('background-color', 'rgba(0,0,0,0)')
    .style('pointer-events', 'none')
  document.body.style.overflow = 'auto'
  globalPopupData = null
  globalPopupConfig = null
}

function drawBarGraph (data, config) {
  globalPopupData = data
  globalPopupConfig = config
  console.log(config, data)

  /* ----------  POP‑UP SHELL  ---------- */
  d3.select('#popupContainer')
    .style('background-color', 'rgba(0,0,0,0.3)')
    .style('pointer-events', 'auto')
    .on('click', closePopup)

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
    .on('click', (event) => event.stopPropagation())
    .style('pointer-events', 'auto')
    .attr('id', 'flowAnalysisPopup')
    .style('position', 'absolute')
    .style('box-shadow', '0 4px 10px rgba(0,0,0,0.2)')
    .style('border-radius', '10px')
    .style('width', '1100px')
    .style('height', '720px')
    .style('background-color', '#f9f9f9')

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
    .text(`Flow '${sourceNode['title.system']} - ${targetNode['title.system']}' (${data.legend === 'co2flow' ? 'kton CO2' : (currentUnit === 'TWh' ? 'TWh' : 'PJ')})`)

  canvas.append('text')
    .attr('x', 100)
    .attr('y', 70)
    .style('font-size', '12px')
    .style('fill', '#666')
    .text(`Source ID: ${data.source} / Target ID: ${data.target}`)

  // canvas.append('rect')
    //   .attr('x', 30)
    //   .attr('y', 60)
    //   .attr('width', 940)
    //   .attr('height', 410)
    //   .attr('fill', '#fff')

  /* ----------  CLOSE BUTTON  ---------- */
  const CLOSE_SIZE = 30; // rectangle is 30×30
  const CLOSE_X = 1100 - 50 // your original offsets
  const CLOSE_Y = 30

  const closeGroup = canvas.append('g')
    .attr('class', 'close-btn')
    .attr('transform', `translate(${CLOSE_X}, ${CLOSE_Y})`)
    .style('cursor', 'pointer')
    .on('click', closePopup)

  /* button background */
  closeGroup.append('rect')
    .attr('width', CLOSE_SIZE)
    .attr('height', CLOSE_SIZE)
    .attr('rx', 4)
    .attr('fill', '#fff')
    .on('mouseover', function () { d3.select(this).attr('fill', '#999'); })
    .on('mouseout', function () { d3.select(this).attr('fill', '#fff'); })

  /* "X" icon (Material-icon path, 960 × 960 units)        *
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
  const graphWidth = 900
  const graphHeight = 350
  const shiftX = 100
  const graphTop = 130
  const graphBottom = graphTop + graphHeight

  /* ----------  DATA WRANGLING  ---------- */
  const pjToTWh = 3.6
  const unit = (typeof currentUnit !== 'undefined' && currentUnit === 'TWh') ? 'TWh' : 'PJ'

  const getValue = (value) => {
    if (data.legend === 'co2flow') {
      return value * globalCO2flowScale
    }
    if (unit === 'TWh') {
      return value / pjToTWh
    }
    return value
  }

  const determineMaxValue = Object.entries(data)
    .filter(([k]) => k.includes('scenario'))

  const co2Scale = v => data.legend !== 'co2flow' ? v : v * globalCO2flowScale

  const yearData = y => Object.entries(data)
    .filter(([k]) => k.includes('scenario') && k.includes('x' + y + 'x'))
    .map(([k, v]) => [k, getValue(v)])

  const scenarios2030 = yearData(2030)
  const scenarios2035 = yearData(2035)
  const scenarios2040 = yearData(2040)
  const scenarios2045 = yearData(2045)
  const scenarios2050 = yearData(2050)

  /* ----------  DRAW LINE GRAPH  ---------- */
  const years = [2030, 2035, 2040, 2045, 2050]
  const scenarios = [scenarios2030, scenarios2035, scenarios2040, scenarios2045, scenarios2050]

  const varianten = [
    'ADAPT', 'TRANSFORM',
    'TRANSFORM-C&Import', 'TRANSFORM-MC',
    'TRANSFORM-MC&Import', 'TVKN-PR40',
    'TVKN-SR20', 'TVKN-PB30', 'NBNL-V3KM',
    'NBNL-V3EM', 'NBNL-V3GB', 'NBNL-V3HA',
    'NBNL-V2NA', 'NBNL-V2IA'
  ]

  const variantTitles = {
    ADAPT: 'TNO-2024 | ADAPT',
    TRANSFORM: 'TNO-2024 | TRANSFORM',
    'TRANSFORM-C&Import': 'TNO-2024 | TRANSFORM | Competitief & Import',
    'TRANSFORM-MC': 'TNO-2024 | TRANSFORM | Competitief',
    'TRANSFORM-MC&Import': 'TNO-2024 | TRANSFORM | Minder Competitief & Import',
    'TVKN-PR40': 'PBL-2024 | TVKN | Pragmatisch Ruim 40',
    'TVKN-SR20': 'PBL-2024 | TVKN | Specifiek Ruim 20',
    'TVKN-PB30': 'PBL-2024 | TVKN | Pragmatisch Beperkt 30',
    'NBNL-V3KM': 'NBNL-2025 | II3050 v3 | Koersvaste Middenweg',
    'NBNL-V3EM': 'NBNL-2025 | II3050 v3 | Eigen Vermogen',
    'NBNL-V3GB': 'NBNL-2025 | II3050 v3 | Gezamenlijke Balans',
    'NBNL-V3HA': 'NBNL-2025 | II3050 v3 | Horizon Aanvoer',
    'NBNL-V2NA': 'NBNL-2023 | II3050 v2 | Nationale Drijfveren',
    'NBNL-V2IA': 'NBNL-2023 | II3050 v2 | Internationale Ambitie'
  }

  const categoryInfo = {
    'ADAPT/TRANSFORM': {
      baseColor: '#1f78b4', // blue
      scenarios: ['ADAPT', 'TRANSFORM', 'TRANSFORM-C&Import', 'TRANSFORM-MC', 'TRANSFORM-MC&Import']
    },
    TVKN: {
      baseColor: '#33a02c', // green
      scenarios: ['TVKN-PR40', 'TVKN-SR20', 'TVKN-PB30']
    },
    NBNL: {
      baseColor: '#ff7f00', // orange
      scenarios: ['NBNL-V3KM', 'NBNL-V3EM', 'NBNL-V3GB', 'NBNL-V3HA', 'NBNL-V2NA', 'NBNL-V2IA']
    }
  }

  const scenarioColors = {}
  Object.values(categoryInfo).forEach(cat => {
    const colorScale = d3.scaleLinear()
      .domain([0, cat.scenarios.length - 1])
      .range([d3.color(cat.baseColor).brighter(1.5), d3.color(cat.baseColor).darker(1.5)])
    cat.scenarios.forEach((scenario, i) => {
      scenarioColors[scenario] = colorScale(i)
    })
  })

  const symbols = [
    d3.symbolCircle, d3.symbolCross, d3.symbolDiamond, d3.symbolSquare,
    d3.symbolStar, d3.symbolTriangle, d3.symbolWye
  ]

  const scenarioSymbols = {}
  varianten.forEach((scenario, i) => {
    scenarioSymbols[scenario] = symbols[i % symbols.length]
  })

  if (globalVisibleScenarios === undefined) {
    globalVisibleScenarios = new Set(varianten) // All scenarios visible by default
  }

  // x-scale for years
  const x = d3.scalePoint()
    .domain(years)
    .range([shiftX, shiftX + graphWidth])

  // y-scale for values
  const y = d3.scaleLinear()
    .domain([0, d3.max(determineMaxValue, ([, v]) => getValue(v))])
    .range([graphBottom, graphTop])

  // line generator
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value))

  /* remove axis domain strokes */
  canvas.selectAll('.domain').remove()

  // Add a filter for the drop shadow
  const defs = svg.append('defs')

  const filter = defs.append('filter')
    .attr('id', 'tooltip-shadow')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%')
  filter.append('feGaussianBlur')
    .attr('in', 'SourceAlpha').attr('stdDeviation', 2).attr('result', 'blur')
  filter.append('feOffset')
    .attr('in', 'blur').attr('dx', 0).attr('dy', 1).attr('result', 'offsetBlur')
  const feMerge = filter.append('feMerge')
  feMerge.append('feMergeNode').attr('in', 'offsetBlur')
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

  // Tooltip
  const tooltip = canvas.append('g')
    .attr('class', 'chart-tooltip')
    .style('display', 'none')
    .attr('filter', 'url(#tooltip-shadow)')

  tooltip.append('rect')
    .attr('rx', 5).attr('ry', 5)
    .attr('fill', '#f9f9f9')
    .attr('stroke', '#ccc')

  tooltip.append('path')
    .attr('class', 'tooltip-pointer')

  tooltip.append('text')
    .attr('fill', '#333')
    .style('font-size', '12px')
    .attr('text-anchor', 'middle')

  function updateGraph () {
    // Clear existing lines and dots
    canvas.selectAll('.scenario-line').remove()
    canvas.selectAll('.scenario-dot').remove()
    canvas.selectAll('.hover-label').remove()

    // draw lines and dots for each scenario
    scenarios2030.forEach((scenario, index) => {
      const scenarioName = varianten[index]
      if (!globalVisibleScenarios.has(scenarioName)) {
        return
      }
      const color = scenarioColors[scenarioName]

      // Only include data up to 2050 for PR40, SR20, and PB30
      const scenarioData = scenarios.map((s, i) => {
        const point = s[index]
        if (point) {
          return {year: years[i], value: point[1], original: point}
        }
        return {year: years[i], value: undefined, original: undefined}
      })

      const isLimitedScenario = ['Pragmatisch Ruim 40', 'Specifiek Ruim 20', 'Pragmatisch Beperkt 30'].includes(scenarioName)
      const limitedScenarioData = isLimitedScenario ? scenarioData.slice(0, 5) : scenarioData

      // Draw line
      canvas.append('path')
        .datum(limitedScenarioData.filter(d => d.value !== undefined))
        .attr('class', 'scenario-line')
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line)

      // Draw dots
      const symbolGenerator = d3.symbol().type(scenarioSymbols[scenarioName]).size(64)
      limitedScenarioData.forEach((d, i) => {
        if (d.value === undefined) return
        canvas.append('path')
          .attr('d', symbolGenerator())
          .attr('class', 'scenario-dot')
          .attr('transform', `translate(${x(d.year)}, ${y(d.value)})`)
          .attr('fill', color)
          .on('mouseover', function (event) { // d is from closure
            tooltip.raise().style('display', 'block')

            const scenarioTitle = variantTitles[scenarioName] || scenarioName
            const valueText = `${d.year}: ${d3.format('.2f')(d.value)} ${unit}`
            const textEl = tooltip.select('text')

            textEl.selectAll('tspan').remove()

            textEl.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.2em')
              .style('font-weight', 'bold')
              .text(scenarioTitle)

            textEl.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.4em')
              .text(valueText)

            const padding = 10
            const textBBox = textEl.node().getBBox()

            const tooltipWidth = textBBox.width + padding * 2
            const tooltipHeight = textBBox.height + padding * 2

            tooltip.select('rect')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', tooltipWidth)
              .attr('height', tooltipHeight)

            // Vertically and horizontally center the text block
            textEl.attr('transform', `translate(${tooltipWidth / 2}, ${padding - textBBox.y})`)

            const pointerSize = 8
            const xPos = x(d.year)
            const yPos = y(d.value)

            let tooltipX = xPos - (tooltipWidth / 2)
            let tooltipY = yPos - tooltipHeight - pointerSize - 5; // 5px margin from point, above by default

            let pointerPath

            // Check top overflow
            if (tooltipY < graphTop) {
              tooltipY = yPos + pointerSize + 10 // position below point
            }

            // Check side overflows
            if (tooltipX < shiftX) {
              tooltipX = shiftX
            }
            if (tooltipX + tooltipWidth > shiftX + graphWidth) {
              tooltipX = shiftX + graphWidth - tooltipWidth
            }

            const pointerX = xPos - tooltipX; // pointer's x relative to tooltip's origin

            if (tooltipY > yPos) { // tooltip is below point, pointer points up
              pointerPath = `M${pointerX - pointerSize},0 L${pointerX},-${pointerSize} L${pointerX + pointerSize},0 Z`
            } else { // tooltip is above point, pointer points down
              pointerPath = `M${pointerX - pointerSize},${tooltipHeight} L${pointerX},${tooltipHeight + pointerSize} L${pointerX + pointerSize},${tooltipHeight} Z`
            }

            tooltip.select('.tooltip-pointer')
              .attr('d', pointerPath)
              .attr('fill', '#f9f9f9')

            tooltip.attr('transform', `translate(${tooltipX}, ${tooltipY})`)
          })
          .on('mouseout', function () {
            tooltip.style('display', 'none')
          })
      })
    })
  }

  // Add legend
  const legend = canvas.append('g')
    .attr('transform', `translate(${shiftX}, ${graphBottom + 70})`) // Position under the graph

  legend.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text('Scenarios')

  function updateLegend () {
    legend.selectAll('.legend-item')
      .each(function (d) {
        const item = d3.select(this)
        const isVisible = globalVisibleScenarios.has(d)
        item.select('.checkmark-box')
          .attr('fill', isVisible ? scenarioColors[d] : '#fff')
        item.select('.checkmark')
          .style('display', isVisible ? 'inline' : 'none')
        item.style('opacity', isVisible ? 1 : 0.6)
      })
  }

  const itemsPerColumn = Math.ceil(varianten.length / 3)
  const columnWidth = 320 // Adjust as needed
  const itemHeight = 25

  // Add legend items
  const legendItems = legend.selectAll('.legend-item')
    .data(varianten)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => {
      const col = Math.floor(i / itemsPerColumn)
      const row = i % itemsPerColumn
      return `translate(${col * columnWidth}, ${row * itemHeight})`
    })
    .style('cursor', 'pointer')
    .on('click', function (event, d) {
      if (globalVisibleScenarios.has(d)) {
        globalVisibleScenarios.delete(d)
      } else {
        globalVisibleScenarios.add(d)
      }
      updateGraph()
      updateLegend()
    })

  legendItems.append('rect')
    .attr('class', 'checkmark-box')
    .attr('width', 14)
    .attr('height', 14)
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('fill', '#fff')
    .attr('stroke', d => scenarioColors[d])
    .attr('stroke-width', 1.5)

  legendItems.append('text')
    .attr('class', 'checkmark')
    .attr('x', 2)
    .attr('y', 11)
    .style('font-size', '12px')
    .style('user-select', 'none')
    .style('fill', '#fff')
    .style('pointer-events', 'none')
    .text('✔')

  // Add symbol
  legendItems.append('path')
    .attr('d', d => d3.symbol().type(scenarioSymbols[d]).size(64)())
    .attr('transform', `translate(28, 7)`)
    .attr('fill', d => scenarioColors[d])
    .style('pointer-events', 'none')

  // Add text label
  legendItems.append('text')
    .attr('x', 45)
    .attr('y', 12)
    .style('font-size', '11px')
    .text(d => variantTitles[d] || d)
    .style('pointer-events', 'none')

  updateGraph()
  updateLegend()

  // x-axis
  canvas.append('g')
    .attr('transform', `translate(0, ${graphBottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).tickSize(0).tickPadding(10))
    .style('font-size', '13px')
    .select('.domain').remove()

  // y-axis
  canvas.append('g')
    .attr('transform', `translate(${shiftX}, 0)`)
    .call(d3.axisLeft(y).ticks(10).tickSize(0).tickPadding(10))
    .style('font-size', '13px')
    .select('.domain').remove()

  // Add Y-axis title
  canvas.append('text')
    .attr('transform', `translate(${shiftX - 60}, ${(graphBottom + graphTop) / 2}) rotate(-90)`)
    .style('text-anchor', 'middle')
    .style('font-size', '13px')
    .text(data.legend === 'co2flow' ? 'kton CO2/jaar' : (unit === 'TWh' ? 'TWh/jaar' : 'PJ/jaar'))

  // Add horizontal bands
  const yTicks = y.ticks(10)
  const bandGroup = canvas.append('g')
    .attr('class', 'grid-bands')
  bandGroup.selectAll('rect')
    .data(d3.range(0, yTicks.length - 1, 2))
    .enter()
    .append('rect')
    .attr('x', shiftX)
    .attr('y', i => y(yTicks[i + 1]))
    .attr('width', graphWidth)
    .attr('height', i => y(yTicks[i]) - y(yTicks[i + 1]))
    .style('fill', '#f0f0f0')

  // Add vertical gridlines
  const verticalGrid = canvas.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0, ${graphBottom})`)
    .call(d3.axisBottom(x)
      .tickSize(-graphHeight)
      .tickFormat(''))
  verticalGrid.selectAll('line')
    .style('stroke', '#cccccc')
    .style('stroke-dasharray', '2 2')
  verticalGrid.lower()
  bandGroup.lower()

  // Add a unit toggle inside the popup
  const unitToggle = canvas.append('g')
    .attr('class', 'unit-toggle-popup')
    .attr('transform', `translate(${1100 - 180}, 40) scale(0.9)`)
    .style('cursor', 'pointer')
    .on('click', () => {
      document.getElementById('sankeyUnitToggle').dispatchEvent(new MouseEvent('click'))
    })

  unitToggle.append('rect')
    .attr('width', 50)
    .attr('height', 25)
    .attr('rx', 12.5)
    .attr('ry', 12.5)
    .attr('fill', '#fff')
    .attr('stroke', '#ccc')

  unitToggle.append('circle')
    .attr('cx', currentUnit === 'PJ' ? 13 : 37)
    .attr('cy', 12.5)
    .attr('r', 10)
    .attr('fill', '#444')

  unitToggle.append('text')
    .attr('x', -25)
    .attr('y', 18)
    .attr('fill', '#444')
    .style('font-size', '15px')
    .text('PJ')

  unitToggle.append('text')
    .attr('x', 60)
    .attr('y', 18)
    .attr('fill', '#444')
    .style('font-size', '15px')
    .text('TWh')

  // remove old bar elements
  canvas.selectAll('.bar_').remove()
  canvas.selectAll('.value-label_').remove()
  canvas.selectAll('.domain').remove()
}
