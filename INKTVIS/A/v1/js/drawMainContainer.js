let currentScenario = 'nat'
let currentSector = 'all'
let currentRoutekaart = 'w'
let currentYMax = [1400, 100, 1400]
let currentTitlesArray = ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS']
let currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444']
let sankeyModeActive = false
let currentZichtjaar = '2020'
let currentUnit = 'PJ'

let sankeyXLSXurl = 'data/SANKEY_INKTVIS_DATA_v11112024.xlsx'

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
}, 500)
