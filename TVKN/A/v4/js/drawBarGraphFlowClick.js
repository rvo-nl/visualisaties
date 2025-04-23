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
    .style('font-size', '16px')
    .style('font-weight', 500)
    .text(`Flow '${sourceNode['title.system']} - ${targetNode['title.system']}' (PJ)`)

  canvas.append('rect')
    .attr('x', 30)
    .attr('y', 60)
    .attr('width', 940)
    .attr('height', 410)
    .attr('fill', '#fff')

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
  const width = 450
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

  /* ----------  DRAW ONE BAR ROW  ---------- */
  function drawBarsPerYear (rows, tag, yPos) {

    /* x‑scale for this row */
    const x = d3.scaleBand()
      .range([0, width + 300])
      .domain(rows.map(([k]) => k.split('_')[0]))
      .padding(0.7)

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(determineMaxValue, ([, v]) => v)])

    /* gridlines */
    canvas.append('g')
      .call(d3.axisLeft(y).ticks(3).tickSize(-width - 350).tickFormat(''))
      .attr('transform',
        `translate(${shiftX + shiftXAdditional - 120}, ${yPos})`)
      .selectAll('.tick line')
      .style('stroke', '#999')
      .style('stroke-width', 1)
      .style('opacity', 0.8)

    /* bars */
    canvas.selectAll('.bar_' + tag)
      .data(rows)
      .enter().append('rect')
      .attr('class', 'bar_' + tag)
      .attr('fill', config.legend.find(l => l.id === data.legend).color)
      .attr('x', d => x(d[0].split('_')[0]))
      .attr('y', d => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[1]))
      .attr('transform',
        `translate(${shiftX + shiftXAdditional - 100}, ${yPos})`)

    /* value labels */
    canvas.selectAll('.value-label_' + tag)
      .data(rows)
      .enter().append('text')
      .attr('class', 'value-label_' + tag)
      .attr('x', d => x(d[0].split('_')[0]) + x.bandwidth() / 2)
      .attr('y', d => y(d[1]) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 500)
      .style('fill', '#666')
      .text(d => new Intl.NumberFormat('de-DE').format(Math.round(d[1])))
      .attr('transform',
        `translate(${shiftX + shiftXAdditional - 100}, ${yPos})`)

    /* left axis */
    const fmt = d => new Intl.NumberFormat('de-DE').format(d)

    canvas.append('g')
      .call(d3.axisLeft(y).ticks(3).tickFormat(fmt))
      .attr('transform', `translate(${shiftX + 20}, ${yPos})`)
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-weight', 500)

    /* row caption (year) */
    canvas.append('text')
      .attr('transform', `translate(50, ${yPos + 15})`)
      .attr('dy', '1em')
      .style('font-size', '15px')
      .style('text-anchor', 'middle')
      .style('fill', '#222')
      .style('font-weight', 400)
      .text(tag)
  }

  /* ----------  DRAW ALL ROWS  ---------- */
  drawBarsPerYear(scenarios2030, '2030', 235)
  drawBarsPerYear(scenarios2035, '2035', 320)
  drawBarsPerYear(scenarios2040, '2040', 405)
  drawBarsPerYear(scenarios2045, '2045', 490)
  drawBarsPerYear(scenarios2050, '2050', 575)

  /* ----------  TOP‑OF‑CHART VARIANT LABELS  ---------- */
  const varianten = [
    'Pragmatisch Ruim 40', 'Specifiek Ruim 20',
    'Pragmatisch Beperkt 30', 'SR - Minder plastic afval',
    'WLO1', 'WLO2',
    'WLO3', 'WLO4'
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

  labelGroup.selectAll('text')
    .data(scenarios2030)
    .enter().append('text')
    /* translate to bar centre, then rotate about origin so Y stays constant */
    .attr('transform', d => {
      const cx = xTop(d[0].split('_')[0]) + xTop.bandwidth() / 2
      return `translate(${cx}, -20) rotate(-90)`
    })
    .style('text-anchor', 'start')
    .style('font-size', '10px')
    .style('font-weight', 500)
    .text((d, i) => varianten[i])

  /* remove axis domain strokes */
  canvas.selectAll('.domain').remove()
}
