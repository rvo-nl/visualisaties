let globalVisibleScenarios

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
    .style('height', '730px')
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
  const width = 350 // Reduced from 450 to make room for legend
  const height = 50 // height of a single bar row
  const shiftX = 100
  let shiftXAdditional = 144; // carried through every row – don't reset

  const graphTop = 130
  const graphBottom = 482.5 // (600 - 130) * 0.75 + 130

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
    .range([shiftX, shiftX + width + 300])

  // y-scale for values
  const y = d3.scaleLinear()
    .domain([0, d3.max(determineMaxValue, ([, v]) => v)])
    .range([graphBottom, graphTop])

  // line generator
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value))

  /* ----------  TOP‑OF‑CHART VARIANT LABELS  ---------- */

  /* x-scale identical to the 2030 row */
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
          .on('mouseover', function (event) {
            const xPos = x(d.year)
            const yPos = y(d.value)
            const scenarioTitle = variantTitles[scenarioName] || scenarioName
            canvas.append('text')
              .attr('x', xPos + 10)
              .attr('y', yPos - 10)
              .attr('class', 'hover-label')
              .style('font-size', '12px')
              .style('font-weight', 'bold')
              .style('fill', '#333')
              .text(`${scenarioTitle} (${d.year}): ${d3.format('.2f')(d.value)}`)
          })
          .on('mouseout', function () {
            canvas.selectAll('.hover-label').remove()
          })
      })
    })
  }

  // Add legend
  const legend = canvas.append('g')
    .attr('transform', `translate(${shiftX}, ${graphBottom + 60})`) // Position under the graph

  function updateLegend () {
    legend.selectAll('.legend-item')
      .each(function (d) {
        const item = d3.select(this)
        const isVisible = globalVisibleScenarios.has(d)
        item.select('.checkmark').text(isVisible ? '✔' : '')
        item.style('opacity', isVisible ? 1 : 0.5)
      })
  }

  const itemsPerColumn = Math.ceil(varianten.length / 2)
  const columnWidth = 400 // Adjust as needed
  const itemHeight = 20

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
    .attr('width', 12)
    .attr('height', 12)
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('fill', '#fff')
    .attr('stroke', '#ccc')

  legendItems.append('text')
    .attr('class', 'checkmark')
    .attr('x', 2)
    .attr('y', 10)
    .style('font-size', '12px')
    .style('user-select', 'none')
    .style('fill', '#333')
    .text('✔')

  // Add symbol
  legendItems.append('path')
    .attr('d', d => d3.symbol().type(scenarioSymbols[d]).size(64)())
    .attr('transform', `translate(25, 7.5)`)
    .attr('fill', d => scenarioColors[d])

  // Add text label
  legendItems.append('text')
    .attr('x', 40)
    .attr('y', 12)
    .style('font-size', '10px')
    .text(d => variantTitles[d] || d)

  updateGraph()
  updateLegend()

  // x-axis
  canvas.append('g')
    .attr('transform', `translate(0, ${graphBottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')))
    .style('font-size', '12px')

  // y-axis
  canvas.append('g')
    .attr('transform', `translate(${shiftX}, 0)`)
    .call(d3.axisLeft(y).ticks(10))
    .style('font-size', '12px')

  // Add Y-axis title
  canvas.append('text')
    .attr('transform', `translate(${shiftX - 40}, ${(graphBottom + graphTop) / 2}) rotate(-90)`)
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
    .attr('y1', graphTop)
    .attr('x2', shiftX)
    .attr('y2', graphBottom)
    .attr('stroke', '#000')
    .attr('stroke-width', 1)

  // remove old bar elements
  canvas.selectAll('.bar_').remove()
  canvas.selectAll('.value-label_').remove()
  canvas.selectAll('.domain').remove()
}
