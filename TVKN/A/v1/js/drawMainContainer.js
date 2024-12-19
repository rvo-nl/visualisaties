let currentScenario = 'nat'
let currentSector = 'all'
let currentRoutekaart = 'w'
let currentYMax = [1400, 100, 1400]
let currentTitlesArray = ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS']
let currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444']
let sankeyModeActive = false
let currentZichtjaar = '2030'
let currentUnit = 'PJ'

let sankeyXLSXurl = 'data/OverviewTVKN2024_a_v1_19122024.xlsx'

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

var initMainContainerTop
var initYearButtonsTop
var initJaarButtonsTitleTop
var initRemarksDivTop
// setTimeout(() => {
//  var buttonsContainerHeight = document.getElementById('scenarioButtons').offsetHeight
initMainContainerTop = 440 // document.getElementById('mainContainer').getBoundingClientRect().top
initYearButtonsTop = 760 // document.getElementById('yearButtons').getBoundingClientRect().top
initJaarButtonsTitleTop = 45
initUnitSelectorDivTop = 35
initEnergieDragersDivTop = 680
initRemarksDivTop = 1230
// }, 50)
// Select the div
const resizeableDiv = document.getElementById('main')

// init
let factor = 1675
let maxWidth = 1900

setTimeout(() => {
  initializeUI
}, 500)

function initializeUI () {
  // initilize ui
  if (document.getElementById('main').offsetWidth > maxWidth) {
    windowScaleValueInit = maxWidth / factor
  } else {windowScaleValueInit = document.getElementById('main').offsetWidth / factor }
  d3.select('#sankeySVG').attr('transform', 'scale(' + windowScaleValueInit + ')')
  var buttonsContainerHeight = document.getElementById('scenarioButtons').offsetHeight
  d3.select('#buttonsContainer').style('height', buttonsContainerHeight + 35 + 50 + 'px')
  var posTop = initMainContainerTop + buttonsContainerHeight
  // console.log('Position Top:', posTop)
  d3.select('#mainContainer').style('top', `${posTop}px`)
  posTop = initYearButtonsTop + buttonsContainerHeight - 725
  // console.log('Position Top:', posTop)
  d3.select('#yearButtons').style('top', `${posTop}px`)
  posTop = initJaarButtonsTitleTop + buttonsContainerHeight
  d3.select('#jaarButtonsTitle').style('top', `${posTop}px`)
  posTop = initUnitSelectorDivTop + buttonsContainerHeight
  d3.select('#unitSelectorDiv').style('top', `${posTop}px`)
  posTop = initRemarksDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight + document.getElementById('energieDragersContainer').offsetHeight
  d3.select('#remarksContainer').style('top', `${posTop}px`)
  posTop = initEnergieDragersDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight
  d3.select('#energieDragersContainer').style('top', `${posTop}px`)
}
// Create a ResizeObserver instance
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    let { width, height } = entry.contentRect

    // Restrict to maxWidth if necessary
    if (width > maxWidth) width = maxWidth

    // Calculate scaling value and dynamic styles
    const windowScaleValue = width / factor
    const remarksContainerPosition = width / 3 + 'px'

    // Scale the SVG
    d3.select('#sankeySVG').attr('transform', `scale(${windowScaleValue})`)

    // Dynamically adjust heights
    d3.select('#mainContainer').style('height', `${width * 1.2}px`)
    d3.select('#sankeyContainer').style('height', `${width * 0.62}px`)

    // Adjust buttons container height
    const buttonsContainerHeight = document.getElementById('scenarioButtons').offsetHeight
    d3.select('#buttonsContainer').style('height', `${buttonsContainerHeight + 35 +  50}px`)

    // Calculate and adjust top position dynamically
    var posTop = initMainContainerTop + buttonsContainerHeight
    d3.select('#mainContainer').style('top', `${posTop}px`)

    posTop = initYearButtonsTop + buttonsContainerHeight - 725
    d3.select('#yearButtons').style('top', `${posTop}px`)

    posTop = initJaarButtonsTitleTop + buttonsContainerHeight
    d3.select('#jaarButtonsTitle').style('top', `${posTop}px`)

    posTop = initUnitSelectorDivTop + buttonsContainerHeight
    d3.select('#unitSelectorDiv').style('top', `${posTop}px`)

    posTop = initRemarksDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight + document.getElementById('energieDragersContainer').offsetHeight
    d3.select('#remarksContainer').style('top', `${posTop}px`)
    // console.log(buttonsContainerHeight)
    posTop = initEnergieDragersDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight
    d3.select('#energieDragersContainer').style('top', `${posTop}px`)

    setWidth = document.getElementById('sankeyContainer').offsetWidth
    // console.log(setWidth)
    d3.select('#energieDragersContainer').style('width', `${setWidth*0.74}px`)
  }
})
// Observe the target element
const targetElement = document.getElementById('mainContainer') // Adjust target as needed
if (targetElement) {
  resizeObserver.observe(targetElement)
} else {
  console.error('Target element for ResizeObserver not found.')
}
// Observe the div for resize changes
resizeObserver.observe(resizeableDiv)

// drawToelichting()
function drawToelichting () {
  d3.select('#toelichting').append('svg').attr('width', 700).attr('height', 300).attr('id', 'toelichtingSVG')
  let canvas = d3.select('#toelichtingSVG').append('g')

  canvas.append('path')
    .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
    .attr('fill', '#444')
    .attr('transform', 'translate(100,20)scale(0.05)rotate(180)')

  canvas.append('text')
    .attr('transform', 'translate(72,45)')
    .attr('fill', 'white')
    .style('font-size', '14px')
    .text('0')

    // canvas.append('path')
    //   .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
    //   .attr('fill', '#c1121f')
    //   .attr('transform', 'translate(100,130)scale(0.05)rotate(180)')

// canvas.append('text')
//   .attr('transform', 'translate(72,154)')
//   .attr('fill', 'white')
//   .style('font-size', '14px')
//   .text('0')
}
setTimeout(() => {
  // d3.select('#sankeySVG')
  //   .append('g')
  //   .append('text')
  //   .attr('x', 100).attr('y', 20)
  //   .style('font-size', '26px')
  //   .text('Energiestromen')

  var targetDiv = document.getElementById('energieDragersContainer')
  var titleDiv = document.createElement('div')

  titleDiv.innerHTML =
    `
        De 87 energiedragers uit de OPERA data zijn conform de indeling in onderstaande tabel samengevoegd tot 20 hoofdcategorieën en geagreggeerd in het diagram weergegeven. 
    `
  titleDiv.style.width = '100%' // Set the width of the div
  // redDiv.style.maxWidth = '700px'
  titleDiv.style.position = 'absolute' // Position it absolutely
  // redDiv.style.top = '2100px' // Distance from the top of the container
  // redDiv.style.left = '230px' // Distance from the left of the container
  titleDiv.style.padding = '10px' // Add padding inside the div
  titleDiv.style.fontSize = '14px'
  titleDiv.style.fill = '#222'
  titleDiv.style.fontWeight = '300'
  titleDiv.style.lineHeight = '20px'
  targetDiv.appendChild(titleDiv)

  targetDiv = document.getElementById('sankeyContainer')
  titleDiv = document.createElement('div')
  titleDiv.innerHTML =
    `
        <span style="font-size:20px;">Sankey diagram | energiestromen</span>
        <br><br>
        De opties uit OPERA zijn onderverdeeld naar vier categorieën energie- en grondstofconversie en zeven sectorale categorieën finaal verbruik. Klik op de zwarte markers voor een specificatie van opties op elk knooppunt. Klik op de energiestromen voor een overview over alle scenario's en steekjaren.
    `
  titleDiv.style.width = '100%' // Set the width of the div
  titleDiv.style.maxWidth = '900px'
  titleDiv.style.position = 'absolute' // Position it absolutely
  // redDiv.style.top = '2100px' // Distance from the top of the container
  // redDiv.style.left = '230px' // Distance from the left of the container
  titleDiv.style.padding = '10px' // Add padding inside the div
  titleDiv.style.fontSize = '14px'
  titleDiv.style.top = '-130px'
  titleDiv.style.left = '80px'
  titleDiv.style.fill = '#222'
  titleDiv.style.fontWeight = '300'
  titleDiv.style.lineHeight = '20px'
  targetDiv.appendChild(titleDiv)
}, 500)
