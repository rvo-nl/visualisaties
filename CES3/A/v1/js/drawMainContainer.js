let currentScenario = 'nat'
let currentSector = 'all'
let currentRoutekaart = 'w'
let currentYMax = [1400, 100, 1400]
let currentTitlesArray = ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS']
let currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444']
let sankeyModeActive = false
let currentZichtjaar = '2020'
let currentUnit = 'PJ'

let sankeyXLSXurl = 'data/CES3Overview_a_v1_06122024.xlsx'

function drawSankey (zichtjaar) {
  d3.select('#sankeyContainer').style('visibility', 'visible')

  initSankey({
    mode: 'xlsx',
    xlsxURL: sankeyXLSXurl,
    targetDIV: 'sankeyContainer_main',
    margins: {vertical: 0,horizontal: 200},
    sankeyData: null,
    legend: null,
    settings: null
  })
}

setTimeout(() => {
  sankeyModeActive = true
  drawSankey('2020')
}, 200)

// Select the div
const resizeableDiv = document.getElementById('main')

// init
let factor = 1300
setTimeout(() => {

  if (document.getElementById('main').offsetWidth > 1400) {
    windowScaleValueInit = 1400 / factor
  } else {windowScaleValueInit = document.getElementById('main').offsetWidth / factor }
  d3.select('#sankeySVG').attr('transform', 'scale(' + windowScaleValueInit + ')')
}, 500)

// Create a ResizeObserver instance
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    var { width, height } = entry.contentRect
    // console.log(`Div resized: Width = ${width}, Height = ${height}`)
    if (width > 1400) {width = 1400} // set max width
    let windowScaleValue = width / factor
    let remarksContainerPosition = width / 3 + 'px'

    d3.select('#sankeySVG').attr('transform', 'scale(' + windowScaleValue + ')')
    d3.select('#mainContainer').style('height', width * 1.2 + 'px')
    d3.select('#sankeyContainer').style('height', width * 0.85 + 'px')
  // d3.select('#mainContainer').style('width', width + 'px')
  }
})

// Observe the div for resize changes
resizeObserver.observe(resizeableDiv)

drawToelichting()
function drawToelichting () {
  d3.select('#toelichting').append('svg').attr('width', 700).attr('height', 300).attr('id', 'toelichtingSVG')
  let canvas = d3.select('#toelichtingSVG').append('g')

  canvas.append('path')
    .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
    .attr('fill', '#444')
    .attr('transform', 'translate(100,40)scale(0.05)rotate(180)')

  canvas.append('text')
    .attr('transform', 'translate(72,65)')
    .attr('fill', 'white')
    .style('font-size', '14px')
    .text('0')

  canvas.append('path')
    .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
    .attr('fill', '#c1121f')
    .attr('transform', 'translate(100,130)scale(0.05)rotate(180)')

  canvas.append('text')
    .attr('transform', 'translate(72,154)')
    .attr('fill', 'white')
    .style('font-size', '14px')
    .text('0')
}
