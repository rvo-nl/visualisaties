let currentScenario = 'nat'
let currentSector = 'all'
let currentRoutekaart = 'w'
let currentYMax = [1400, 100, 1400]
let currentTitlesArray = ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS']
let currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444']
let sankeyModeActive = false
let currentZichtjaar = '2020'
let currentUnit = 'PJ'

function drawMainContainerBackdrop (config) {
  let width = 1920
  let height = 1080

  d3.select('#mainContainerBackdropSVG').remove()
  d3.select('#mainContainerOverlaySVG').remove()

  d3.select('#mainContainerBackdrop').append('svg')
    .attr('width', width).attr('height', height)
    // .style('background-color', 'red')
    .style('position', 'absolute')
    .style('top', '0px')
    .attr('id', 'mainContainerBackdropSVG')
    // .style('background-color', 'green')
    // .attr('transform', 'translate(100,0)')

  d3.select('#mainContainerOverlay').append('svg')
    .attr('width', width).attr('height', height)
    // .style('background-color', 'red')
    .style('position', 'absolute')
    .style('top', '0px')
    .attr('id', 'mainContainerOverlaySVG')
    // .attr('transform', 'translate(100,0)')

  let canvasBackdrop = d3.select('#mainContainerBackdropSVG').append('g')
  let canvasOverlay = d3.select('#mainContainerOverlaySVG').append('g')

  let colorsArray = config.colorsArray

  // add domain lines

  canvasBackdrop.append('text')
    .attr('fill', '#111')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text('Routekaart Energiesysteem')
    .style('font-size', '24px')
    .attr('transform', `translate(${21}, 60)`)

  // BUTTONS SCENARIOS

  // Function to create a text element
  function createText (parent, id, fill, fontSize, x, y, textContent) {
    let textElement = parent.append('text')
      .attr('id', id)
      .attr('fill', fill)
      .style('font-size', fontSize)
      .attr('x', x)
      .attr('y', y)
      .text(textContent)

    return textElement
  }

  // Function to create a button
  function createButton (parent, id, width, height, fillCondition, x, y, onClick) {
    let buttonElement = parent.append('rect')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', fillCondition)
      .attr('x', x)
      .attr('y', y)
      .style('stroke', '#333')
      .style('stroke-width', 0.5)
      .attr('rx', 17.5)
      .attr('ry', 17.5)
      .style('pointer-events', 'all')
      .on('click', onClick)

    return buttonElement
  }

  // Function to update scenario buttons
  function updateScenarioButtons (scenario) {
    d3.selectAll('.scenario-button').attr('fill', '#FFF')
    d3.selectAll('.scenario-text').attr('fill', '#444')

    d3.select(`#button_rect_scenario_${scenario}`).attr('fill', '#444')
    d3.select(`#button_text_scenario_${scenario}`).attr('fill', '#FFF')
  }

  // Add backdrop text
  canvasBackdrop.append('text')
    .attr('fill', '#333')
    .style('font-weight', 500)
    .attr('x', 70)
    .attr('y', 0)
    .text('Scenario')
    .style('text-anchor', 'end')
    .style('font-size', '17px')
    .attr('transform', `translate(22, 120)`)

  // Scenario NAT Button
  createButton(canvasOverlay, 'button_rect_scenario_nat', 405, 35, () => currentScenario == 'nat' ? '#444' : '#FFF', 280 - 160, 98, () => {
    currentScenario = 'nat'
    updateScenarioButtons('nat')
    switchRoutekaart({ scenario: currentScenario, sector: currentSector, routekaart: currentRoutekaart, yMax: currentYMax, titlesArray: currentTitlesArray, colorsArray: currentColorsArray })
    if (sankeyModeActive) { globalSetScenario(lookupScenarioID());  drawWaterfallBackButton()}
  })
  createText(canvasOverlay, 'button_text_scenario_nat', currentScenario == 'nat' ? '#FFF' : '#444', '14px', 292 - 160, 120, 'Nationale Drijfveren (IP2024), Nationaal Leiderschap (II3050)')

  // Scenario INT Button
  createButton(canvasOverlay, 'button_rect_scenario_int', 410, 35, () => currentScenario == 'int' ? '#333' : '#FFF', 695 - 160, 98, () => {
    currentScenario = 'int'
    updateScenarioButtons('int')
    switchRoutekaart({ scenario: currentScenario, sector: currentSector, routekaart: currentRoutekaart, yMax: currentYMax, titlesArray: currentTitlesArray, colorsArray: currentColorsArray })
    if (sankeyModeActive) { globalSetScenario(lookupScenarioID());  drawWaterfallBackButton()}
  })
  createText(canvasOverlay, 'button_text_scenario_int', currentScenario == 'int' ? '#FFF' : '#333', '14px', 707 - 160, 120, 'Internationale Ambitie (IP2024), Internationale Handel (II3050)')

  // Scenario NPE Button
  createButton(canvasOverlay, 'button_rect_scenario_npe', 150, 35, () => currentScenario == 'npe' ? '#444' : '#DDD', 120 + 800 + 35, 98, () => {
    // currentScenario = 'npe'
    // updateScenarioButtons('npe')
    // switchRoutekaart({ scenario: currentScenario, sector: currentSector, routekaart: currentRoutekaart, yMax: currentYMax, titlesArray: currentTitlesArray, colorsArray: currentColorsArray })
    // if (sankeyModeActive) { globalSetScenario(lookupScenarioID());  drawWaterfallBackButton()}
  })
  createText(canvasOverlay, 'button_text_scenario_npe', currentScenario == 'npe' ? '#fff' : '#aaa', '14px', 995, 120, 'Scenario C')

  // Backdrop text for section
  canvasBackdrop.append('text')
    .attr('fill', '#333')
    .style('font-weight', 500)
    .attr('x', 70)
    .attr('y', 0)
    .text('Toepassing')
    .style('text-anchor', 'end')
    .style('font-size', '17px')
    .attr('transform', `translate(22, 165)`)

  // Heat (Warmte) Button
  createButton(canvasOverlay, 'button_rect_routekaart_warmte', 70, 35, () => currentRoutekaart == 'w' ? '#444' : '#FFF', 120, 143, () => {
    currentRoutekaart = 'w'
    currentSector = 'all'
    currentYMax = [1300, 100, 1300]
    currentTitlesArray = ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS']
    currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444']
    switchRoutekaart({ scenario: currentScenario, sector: currentSector, routekaart: currentRoutekaart, yMax: currentYMax, titlesArray: currentTitlesArray, colorsArray: currentColorsArray })
    d3.selectAll('.routekaart-button').attr('fill', '#FFF')
    d3.select('#button_rect_routekaart_warmte').attr('fill', '#444')
    d3.selectAll('.routekaart-text').attr('fill', '#444')
    d3.select('#button_text_routekaart_warmte').attr('fill', '#FFF')
  })
  createText(canvasOverlay, 'button_text_routekaart_warmte', currentRoutekaart == 'w' ? '#FFF' : '#444', '14px', 130, 165, 'Warmte')

  // Other (Overige) Button
  createButton(canvasOverlay, 'button_rect_routekaart_overige', 450, 35, () => currentRoutekaart == 'o' ? '#444' : '#FFF', 285, 143, () => {
    currentRoutekaart = 'o'
    currentSector = 'all'
    currentYMax = [1300, 100, 1300]
    currentTitlesArray = ['Elektriciteit licht, apparaten', 'Elektriciteit koeling', 'Elektriciteit eigen verbruik e.sector', 'Elektriciteit CCS', 'Omgevingskoude', 'Elektriciteit overige', 'Elektriciteit export', 'CCS']
    currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444']
    switchRoutekaart({ scenario: currentScenario, sector: currentSector, routekaart: currentRoutekaart, yMax: currentYMax, titlesArray: currentTitlesArray, colorsArray: currentColorsArray })
    d3.selectAll('.routekaart-button').attr('fill', '#FFF')
    d3.select('#button_rect_routekaart_overige').attr('fill', '#444')
    d3.selectAll('.routekaart-text').attr('fill', '#444')
    d3.select('#button_text_routekaart_overige').attr('fill', '#FFF')
  })
  createText(canvasOverlay, 'button_text_routekaart_overige', currentRoutekaart == 'o' ? '#FFF' : '#444', '14px', 297, 165, 'Elektriciteit (licht, koeling, ongespecificeerd finaal verbruik en export)')

  // Mobility (Mobiliteit) Button
  createButton(canvasOverlay, 'button_rect_routekaart_mobiliteit', 75, 35, () => currentRoutekaart == 'm' ? '#444' : '#FFF', 200, 143, () => {
    currentRoutekaart = 'm'
    currentSector = 'all'
    currentYMax = [550, 100, 550]
    currentTitlesArray = ['Elektriciteit', 'Waterstof en ammoniak', 'Biobrandstoffen', 'LNG, CNG, LPG', 'Kerosine', 'Diesel (fossiel), benzine', 'Kolen', 'CCS']
    currentColorsArray = ['#E99172', '#3F88AE', '#62D3A4', '#DD5471', '#F8D377' , '#666666', '#aaaaaa', '#444']
    switchRoutekaart({ scenario: currentScenario, sector: currentSector, routekaart: currentRoutekaart, yMax: currentYMax, titlesArray: currentTitlesArray, colorsArray: currentColorsArray })
    d3.selectAll('.routekaart-button').attr('fill', '#FFF')
    d3.select('#button_rect_routekaart_mobiliteit').attr('fill', '#444')
    d3.selectAll('.routekaart-text').attr('fill', '#444')
    d3.select('#button_text_routekaart_mobiliteit').attr('fill', '#FFF')
  })
  createText(canvasOverlay, 'button_text_routekaart_mobiliteit', currentRoutekaart == 'm' ? '#FFF' : '#444', '14px', 210, 165, 'Mobiliteit')

  // Non-energetic (Non-energetisch) Button
  createButton(canvasOverlay, 'button_rect_routekaart_nonenergetisch', 212, 35, () => currentRoutekaart == 'n' ? '#444' : '#FFF', 745, 143, () => {
    currentRoutekaart = 'n'
    currentSector = 'all'
    currentYMax = [3500, 100, 3500]
    currentTitlesArray = ['Kolen', 'Olie', 'Aardgas', 'Biomassa', 'Waterstof', 'Cokes', 'Ongespecificeerd', 'CCS']
    currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#62D3A4', '#DD5471', '#aaaaaa', '#666666', '#444']
    switchRoutekaart({ scenario: currentScenario, sector: currentSector, routekaart: currentRoutekaart, yMax: currentYMax, titlesArray: currentTitlesArray, colorsArray: currentColorsArray })
    d3.selectAll('.routekaart-button').attr('fill', '#FFF')
    d3.select('#button_rect_routekaart_nonenergetisch').attr('fill', '#444')
    d3.selectAll('.routekaart-text').attr('fill', '#444')
    d3.select('#button_text_routekaart_nonenergetisch').attr('fill', '#FFF')
  })
  createText(canvasOverlay, 'button_text_routekaart_nonenergetisch', currentRoutekaart == 'n' ? '#FFF' : '#333', '14px', 755, 165, 'Grondstoffen, non-energetisch')

  // Additional buttons
  canvasOverlay.append('rect')
    .attr('width', 142)
    .attr('height', 35)
    .attr('fill', '#FFF')
    .attr('x', 967)
    .attr('y', 143)
    .style('stroke', '#333')
    .style('stroke-width', 0.5)
    .attr('rx', 17.5)
    .attr('ry', 17.5)
    .attr('id', 'onderdeelSelectie_0')
    .style('pointer-events', 'all')

  createText(canvasOverlay, null, '#999', '14px', 977, 165, 'Bunkerbrandstoffen')

  // BUTTONS SECTOREN

  canvasOverlay
    .append('text')
    .attr('fill', '#333')
    .style('font-size', '17px')
    .style('text-anchor', 'end')
    .style('font-weight', 500)
    .attr('x', 90)
    .attr('y', 210)
    .attr('id', 'sectorLabel')
    .text('Sector')

  switch (currentRoutekaart) {
    case 'w':
      drawSectorButtons()
      d3.select('#sectorLabel').text('Sector')
      break
    case 'm':
      drawModaliteitButtons()
      d3.select('#sectorLabel').text('Modaliteit')
      break
    case 'n':
      drawNonEnergetischButtons()
      d3.select('#sectorLabel').text('Sector')
      break
    case 'o':
      drawOverigeButtons()
      d3.select('#sectorLabel').text('Sector')
      break

    default:
      break
  }

  function drawSectorButtons () {
    d3.selectAll('.sectorButtonItem, .modaliteitButtonItem, .sectorNonButtonItem, .sectorOverigeButton').remove()

    const sectors = [
      { id: 'all', text: 'Alle sectoren', x: 120, width: 100, yMax: [1400, 100, 1400] },
      { id: 'go', text: 'Gebouwde Omgeving', x: 230, width: 158, yMax: [600, 100, 600] },
      { id: 'ind', text: 'Industrie', x: 398, width: 88 - 10, yMax: [800, 100, 800] },
      { id: 'ag', text: 'Landbouw', x: 497 - 10, width: 88, yMax: [200, 10, 200] }
    ]

    sectors.forEach(sector => {
      canvasOverlay.append('rect')
        .attr('id', `button_rect_sector_${sector.id}`)
        .attr('class', 'sectorButtonItem')
        .attr('width', sector.width)
        .attr('height', 35)
        .attr('fill', () => currentSector === sector.id ? '#444' : '#FFF')
        .attr('x', sector.x)
        .attr('y', 188)
        .style('stroke', '#333')
        .style('stroke-width', 0.5)
        .attr('rx', 17.5)
        .attr('ry', 17.5)
        .style('pointer-events', 'all')
        .on('click', () => {
          currentSector = sector.id
          currentYMax = sector.yMax
          switchRoutekaart({
            scenario: currentScenario,
            sector: sector.id,
            routekaart: currentRoutekaart,
            yMax: sector.yMax,
            titlesArray: currentTitlesArray,
            colorsArray: currentColorsArray
          })

          // Update colors for all buttons
          sectors.forEach(s => {
            d3.select(`#button_rect_sector_${s.id}`).attr('fill', currentSector === s.id ? '#444' : '#FFF')
            d3.select(`#button_text_sector_${s.id}`).attr('fill', currentSector === s.id ? '#FFF' : '#444')
          })
        })

      canvasOverlay.append('text')
        .attr('id', `button_text_sector_${sector.id}`)
        .attr('class', 'sectorButtonItem')
        .attr('fill', () => currentSector === sector.id ? '#FFF' : '#444')
        .style('font-size', '14px')
        .attr('x', sector.x + 10)
        .attr('y', 210)
        .text(sector.text)
    })
  }

  function drawModaliteitButtons () {
    d3.selectAll('.sectorButtonItem, .modaliteitButtonItem, .sectorNonButtonItem, .sectorOverigeButton').remove()

    const modaliteiten = [
      { id: 'all', text: 'Alle modaliteiten', x: 120, width: 125, yMax: [550, 100, 550] },
      { id: 'au', text: 'Auto', x: 255, width: 48, yMax: [300, 100, 300] },
      { id: 'bbus', text: 'Bestelbus', x: 313, width: 85, yMax: [100, 100, 100] },
      { id: 'bus', text: 'Bus', x: 408, width: 45, yMax: [20, 100, 20] },
      { id: 'vw', text: 'Vrachtwagen', x: 463, width: 103, yMax: [500, 100, 500] },
      { id: 'schip', text: 'Schip', x: 576, width: 58, yMax: [20, 100, 20] },
      { id: 'vtg', text: 'Vliegtuig', x: 644, width: 76, yMax: [2, 100, 2] },
      { id: 'tp', text: 'Trein passagier', x: 730, width: 118, yMax: [20, 100, 20] },
      { id: 'tv', text: 'Trein vracht', x: 858, width: 98, yMax: [5, 100, 5] },
      { id: 'mf', text: 'Motorfiets', x: 966, width: 82, yMax: [5, 100, 5] },
      { id: 'f', text: 'Fiets', x: 1058, width: 53, yMax: [5, 100, 5] }
    ]

    modaliteiten.forEach(modaliteit => {
      canvasOverlay.append('rect')
        .attr('id', `button_rect_modaliteit_${modaliteit.id}`)
        .attr('class', 'modaliteitButtonItem')
        .attr('width', modaliteit.width)
        .attr('height', 35)
        .attr('fill', () => currentSector === modaliteit.id ? '#444' : '#FFF')
        .attr('x', modaliteit.x)
        .attr('y', 188)
        .style('stroke', '#333')
        .style('stroke-width', 0.5)
        .attr('rx', 17.5)
        .attr('ry', 17.5)
        .style('pointer-events', 'all')
        .on('click', () => {
          currentSector = modaliteit.id
          currentYMax = modaliteit.yMax
          switchRoutekaart({
            scenario: currentScenario,
            sector: modaliteit.id,
            routekaart: currentRoutekaart,
            yMax: modaliteit.yMax,
            titlesArray: currentTitlesArray,
            colorsArray: currentColorsArray
          })

          // Update colors for all buttons
          modaliteiten.forEach(m => {
            d3.select(`#button_rect_modaliteit_${m.id}`).attr('fill', currentSector === m.id ? '#444' : '#FFF')
            d3.select(`#button_text_modaliteit_${m.id}`).attr('fill', currentSector === m.id ? '#FFF' : '#444')
          })
        })

      canvasOverlay.append('text')
        .attr('id', `button_text_modaliteit_${modaliteit.id}`)
        .attr('class', 'modaliteitButtonItem')
        .attr('fill', () => currentSector === modaliteit.id ? '#FFF' : '#444')
        .style('font-size', '14px')
        .attr('x', modaliteit.x + 10)
        .attr('y', 210)
        .text(modaliteit.text)
    })
  }

  function drawOverigeButtons () {
    d3.selectAll('.sectorButtonItem, .modaliteitButtonItem, .sectorNonButtonItem, .sectorOverigeButton').remove()

    const overigeButtons = [
      { id: 'all', text: 'Alle sectoren', x: 120, width: 100, yMax: [1400, 100, 1400] },
      { id: 'go', text: 'Gebouwde Omgeving', x: 230, width: 158, yMax: [600, 100, 600] },
      { id: 'ind', text: 'Industrie', x: 398, width: 78, yMax: [800, 100, 800] },
      { id: 'ag', text: 'Landbouw', x: 487, width: 88, yMax: [300, 10, 300] },
      { id: 'en', text: 'Energie', x: 586, width: 69, yMax: [500, 10, 500] }
    ]

    overigeButtons.forEach(button => {
      canvasOverlay.append('rect')
        .attr('id', `button_rect_sector_${button.id}`)
        .attr('class', 'sectorOverigeButton')
        .attr('width', button.width)
        .attr('height', 35)
        .attr('fill', () => currentSector === button.id ? '#444' : '#FFF')
        .attr('x', button.x)
        .attr('y', 188)
        .style('stroke', '#333')
        .style('stroke-width', 0.5)
        .attr('rx', 17.5)
        .attr('ry', 17.5)
        .style('pointer-events', 'all')
        .on('click', () => {
          currentSector = button.id
          currentYMax = button.yMax
          switchRoutekaart({
            scenario: currentScenario,
            sector: button.id,
            routekaart: currentRoutekaart,
            yMax: button.yMax,
            titlesArray: currentTitlesArray,
            colorsArray: currentColorsArray
          })

          // Update colors for all buttons
          overigeButtons.forEach(b => {
            d3.select(`#button_rect_sector_${b.id}`).attr('fill', currentSector === b.id ? '#444' : '#FFF')
            d3.select(`#button_text_sector_${b.id}`).attr('fill', currentSector === b.id ? '#FFF' : '#444')
          })
        })

      canvasOverlay.append('text')
        .attr('id', `button_text_sector_${button.id}`)
        .attr('class', 'sectorOverigeButton')
        .attr('fill', () => currentSector === button.id ? '#FFF' : '#444')
        .style('font-size', '14px')
        .attr('x', button.x + 10)
        .attr('y', 210)
        .text(button.text)
    })
  }

  function drawNonEnergetischButtons () {
    d3.selectAll('.sectorButtonItem, .modaliteitButtonItem, .sectorNonButtonItem, .sectorOverigeButton').remove()

    const nonEnergetischButtons = [
      { id: 'all', text: 'Alle sectoren', x: 120, width: 100, yMax: [3500, 100, 3500] },
      { id: 'km', text: 'Kunstmest', x: 230, width: 88, yMax: [100, 100, 100] },
      { id: 'ch', text: 'Chemie', x: 328, width: 70, yMax: [500, 100, 500] },
      { id: 'raf', text: 'Raffinaderijen', x: 409, width: 108, yMax: [3000, 10, 3000] },
      { id: 'mo', text: 'Mobiliteit', x: 529, width: 77, yMax: [550, 10, 550] },
      { id: 'on', text: 'Ongespecificeerd', x: 618, width: 131, yMax: [50, 10, 50] }
    ]

    nonEnergetischButtons.forEach(button => {
      canvasOverlay.append('rect')
        .attr('id', `button_rect_sectornon_${button.id}`)
        .attr('class', 'sectorNonButtonItem')
        .attr('width', button.width)
        .attr('height', 35)
        .attr('fill', () => currentSector === button.id ? '#444' : '#FFF')
        .attr('x', button.x)
        .attr('y', 188)
        .style('stroke', '#333')
        .style('stroke-width', 0.5)
        .attr('rx', 17.5)
        .attr('ry', 17.5)
        .style('pointer-events', 'all')
        .on('click', () => {
          currentSector = button.id
          currentYMax = button.yMax
          switchRoutekaart({
            scenario: currentScenario,
            sector: button.id,
            routekaart: currentRoutekaart,
            yMax: button.yMax,
            titlesArray: currentTitlesArray,
            colorsArray: currentColorsArray
          })

          // Update colors for all buttons
          nonEnergetischButtons.forEach(b => {
            d3.select(`#button_rect_sectornon_${b.id}`).attr('fill', currentSector === b.id ? '#444' : '#FFF')
            d3.select(`#button_text_sectornon_${b.id}`).attr('fill', currentSector === b.id ? '#FFF' : '#444')
          })
        })

      canvasOverlay.append('text')
        .attr('id', `button_text_sectornon_${button.id}`)
        .attr('class', 'sectorNonButtonItem')
        .attr('fill', () => currentSector === button.id ? '#FFF' : '#444')
        .style('font-size', '14px')
        .attr('x', button.x + 10)
        .attr('y', 210)
        .text(button.text)
    })
  }

  switch (currentRoutekaart) {
    case 'w':
      drawSectorButtons()
      d3.select('#sectorLabel').text('Sector')
      d3.select('#button_rect_routekaart_warmte').attr('fill', '#444')
      d3.select('#button_text_routekaart_warmte').attr('fill', '#FFF')
      break
    case 'm':
      drawModaliteitButtons()
      d3.select('#sectorLabel').text('Modaliteit')
      d3.select('#button_rect_routekaart_mobiliteit').attr('fill', '#444')
      d3.select('#button_text_routekaart_mobiliteit').attr('fill', '#FFF')
      break
    case 'e':
      // dont draw any sectoral buttons
      d3.select('#sectorLabel').text('')
      d3.select('#button_rect_routekaart_elektriciteitsaanbod').attr('fill', '#444')
      d3.select('#button_text_routekaart_elektriciteitsaanbod').attr('fill', '#FFF')
      break
    case 'o':
      drawOverigeButtons()
      d3.select('#sectorLabel').text('Sector')
      d3.select('#button_rect_routekaart_overige').attr('fill', '#444')
      d3.select('#button_text_routekaart_overige').attr('fill', '#FFF')
      break
    case 'n':
      drawNonEnergetischButtons()
      d3.select('#sectorLabel').text('Sector')
      d3.select('#button_rect_routekaart_nonenergetisch').attr('fill', '#444')
      d3.select('#button_text_routekaart_nonenergetisch').attr('fill', '#FFF')
    default:
      break
  }

  // DOMAIN LINES
  canvasOverlay.append('rect')
    .attr('fill', '#000')
    .style('opacity', 0.2)
    .attr('width', 1208)
    .attr('height', 1)
    .attr('y', 620)
    .attr('x', 150)

  canvasOverlay.append('rect')
    .attr('fill', '#000')
    .style('opacity', 0.2)
    .attr('width', 1208)
    .attr('height', 1)
    .attr('y', 702)
    .attr('x', 150)

  canvasOverlay.append('rect')
    .attr('fill', '#000')
    .style('opacity', 0.2)
    .attr('width', 1208)
    .attr('height', 1)
    .attr('y', 970)
    .attr('x', 150)

  const createRects = (xPositions, width, height, yPosition, step, count) => {
    for (let i = 0; i < count; i++) {
      xPositions.forEach(xBase => {
        canvasBackdrop.append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('fill', '#FFF')
          .attr('y', yPosition)
          .attr('x', i * step + xBase)
      })
    }
  }

  // Verticale vlakken jaartotalen
  const jaartotalenXPositions = [150]
  const jaartotalenStep = 287.5

  createRects(jaartotalenXPositions, 42, 231, 388, jaartotalenStep, 5)
  createRects(jaartotalenXPositions, 42, 51, 651, jaartotalenStep, 5)
  createRects(jaartotalenXPositions, 42, 236, 734, jaartotalenStep, 5)

  // Verticale vlakken maatregelen
  const maatregelenXPositions = [220, 507.5, 795, 1082.5]
  const maatregelenStep = 24

  createRects(maatregelenXPositions, 22, 232, 388, maatregelenStep, 8)
  createRects(maatregelenXPositions, 22, 51, 651, maatregelenStep, 8)
  createRects(maatregelenXPositions, 22, 236, 734, maatregelenStep, 8)

  let titlesArray = config.titlesArray
  for (cnt = 0;cnt < 4;cnt++) {
    for (i = 0;i < 8;i++) {
      canvasBackdrop.append('text')
        .attr('fill', '#000')
        .attr('x', 125) // Start at origin for x
        .attr('y', 115) // Start at origin for y
        .text(titlesArray[i])
        .style('font-size', '11px')
        .attr('transform', `translate(${ i * 24+cnt* 287.5+62}, ${376}) rotate(-45)`)

      canvasBackdrop.append('rect')
        .attr('fill', colorsArray[i])
        .attr('x', i * 24 + cnt * 287.3 + 220)
        .attr('y', 377)
        .attr('width', 22)
        .attr('height', 5)
    }
  }

  let yearsArray = ['2020', '2030', '2035', '2040', '2050']
  for (i = 0;i < 5;i++) {
    canvasBackdrop.append('text')

      // .style('font-weight', 100)
      .attr('fill', '#666')
      .attr('x', 0 + 100) // Start at origin for x
      .attr('y', 110) // Start at origin for y
      .text(yearsArray[i])
      .style('font-size', '24px')
      .attr('transform', `translate(${i*287+20}, ${358}) rotate(-45)`)

    canvasBackdrop.append('rect')
      .attr('id', 'zichtjaar_' + yearsArray[i])
      .attr('width', 80)
      .attr('height', 25)
      .attr('fill', 'white')
      .style('stroke', '#333')
      .style('stroke-width', 0.5)
      .attr('rx', 12.5)
      .attr('ry', 12.5)
      .attr('transform', `translate(${i*287+198}, ${304}) rotate(-45)`)
      .style('pointer-events', 'all')
      .on('click', function () {
        sankeyModeActive = true
        currentZichtjaar = this.id.substring(10)
        drawSankey(this.id.substring(10))
      })

    canvasBackdrop.append('text')
      .attr('fill', '#666')
      .style('font-weight', 500)
      .attr('x', 0 + 100) // Start at origin for x
      .attr('y', 110) // Start at origin for y
      .text('Toon Sankey')
      .style('font-size', '12px')
      .attr('transform', `translate(${i*287+66}, ${305}) rotate(-45)`)
  }

  canvasBackdrop.append('text')
    .attr('fill', '#666')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text('OPBOUW')
    .style('font-size', '22px')
    .attr('transform', `translate(${40}, ${550}) rotate(-90)`)

  canvasBackdrop.append('text')
    .attr('fill', '#666')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text(function () { if (currentUnit == 'PJ') {return 'CO2-vrij (PJ/jaar)'}else {return 'CO2-vrij (TWh/jaar)'}})
    .style('font-size', '14px')
    .attr('transform', `translate(${80}, ${553}) rotate(-90)`)

  canvasBackdrop.append('text')
    .attr('fill', '#666')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text('CC(S)')
    .style('font-size', '22px')
    .attr('transform', `translate(${40}, ${708}) rotate(-90)`)

  canvasBackdrop.append('text')
    .attr('fill', '#666')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text(function () { if (currentUnit == 'PJ') {return '(PJ/jaar)'}else {return '(TWh/jaar)'}})
    .style('font-size', '14px')
    .attr('transform', `translate(${80}, ${706}) rotate(-90)`)

  canvasBackdrop.append('text')
    .attr('fill', '#666')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text('AFBOUW')
    .style('font-size', '22px')
    .attr('transform', `translate(${40}, ${888}) rotate(-90)`)

  canvasBackdrop.append('text')
    .attr('fill', '#666')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text(function () { if (currentUnit == 'PJ') {return 'Fossiel (PJ/jaar)'}else {return 'Fossiel (TWh/jaar)'}})
    .style('font-size', '14px')
    .attr('transform', `translate(${80}, ${893}) rotate(-90)`)

  canvasBackdrop.append('text')
    .attr('fill', '#666')
    .attr('x', 0) // Start at origin for x
    .attr('y', 0) // Start at origin for y
    .text('De grafiek toont het verbruik van primaire energie om aan de finale vraag van de geselecteerde toepassing te voldoen.')
    .style('font-size', '14px')
    .attr('transform', `translate(${110}, ${1010})`)
}

function switchRoutekaart (config) {
  d3.selectAll('#waterfallSVG').remove()
  let data
  switch (config.scenario) {
    case 'npe':
      data = dataset_c
      break
    case 'nat':
      data = dataset_nat
      break
    case 'int':
      data = dataset_int
      break
    default:
      break
  }
  drawWaterfallDiagram(data,
    {divID: 'opbouw',
      chartID: '.chart_opbouw',
      sheetID: config.routekaart + '_op_' + config.sector,
      yOffsetJaarTotalen: 259,
      annualMaxValueCorrect: 0,
      titlesArray: config.titlesArray,
      colorsArray: config.colorsArray,
      yMax: config.yMax[0], marginLeft: -100, marginTop: 25, marginBottom: 30, yTicks: 5, classTag: 'A'
    })
  drawWaterfallDiagram(data,
    {divID: 'ccs',
      chartID: '.chart_ccs',
      sheetID: config.routekaart + '_cc_' + config.sector,
      yOffsetJaarTotalen: 53,
      annualMaxValueCorrect: 0,
      titlesArray: config.titlesArray,
      colorsArray: config.colorsArray,
      yMax: config.yMax[1], marginLeft: -100, marginTop: 20,marginBottom: 30, yTicks: 3, classTag: 'B'
    })
  drawWaterfallDiagram(data, {
    divID: 'afbouw',chartID: '.chart_afbouw',
    sheetID: config.routekaart + '_af_' + config.sector,
    yOffsetJaarTotalen: 239,
    annualMaxValueCorrect: 0,
    titlesArray: config.titlesArray,
    colorsArray: config.colorsArray,
  yMax: config.yMax[2], marginLeft: -100, marginBottom: 50,marginTop: 5, yTicks: 5, classTag: 'C'})
}

function drawSankey (zichtjaar) {
  d3.select('#sankeyContainer').style('visibility', 'visible')

  sankeyfy({
    mode: 'xlsx',
    xlsxURL: '/data/sankeydata.xlsx',
    // xlsxURL: '/gitexclude/analysesheets/ANALYSEBESTAND II3050_NPE_ETM_v10122024.xlsx',

    targetDIV: 'sankeyContainer_main',
    margins: {vertical: 0,horizontal: 200},
    sankeyData: null,
    legend: null,
    settings: null
  })
}
drawUnitSelectorWaterfall()
function drawUnitSelectorWaterfall () {
  console.log('hello')
  d3.select('#mainContainerOverlay').append('div').attr('id', 'unitSelctorDivWaterfall').style('width', '200px').style('height', '35px').style('position', 'absolute').style('top', '255px').style('left', '0px').append('svg').attr('width', 200).attr('height', 35).attr('id', 'selectorButtonSVG')
  let sCanvas = d3.select('#selectorButtonSVG').append('g')
  sCanvas.append('rect')
    .attr('x', 50)
    .attr('y', 0)
    .attr('width', 50)
    .attr('height', 25)
    .attr('fill', '#FFF')
    .attr('rx', 12.5).attr('ry', 12.5)
    .style('stroke', '#333')
    .style('stroke-width', 0.5)
    .style('pointer-events', 'all')
    .on('click', function () {
      if (currentUnit == 'PJ') {currentUnit = 'TWh'; valueFactorAdjustment = 3.6} else {currentUnit = 'PJ';valueFactorAdjustment = 1}
      d3.selectAll('#selectorStatus').transition().duration(200).attr('cx', function () {if (currentUnit == 'PJ') { return 63} else return 87})
      switchRoutekaart({
        scenario: currentScenario,
        sector: currentSector,
        routekaart: currentRoutekaart,
        yMax: currentYMax,
        titlesArray: currentTitlesArray,
        colorsArray: currentColorsArray
      })
    })
  sCanvas.append('circle')
    .attr('id', 'selectorStatus')
    .style('pointer-events', 'none')
    .attr('cx', function () {if (currentUnit == 'PJ') { return 63} else return 87})
    .attr('cy', 12.5)
    .attr('r', 10)
    .attr('fill', '#444')
  sCanvas.append('text')
    .attr('x', 12.5 + 7)
    .attr('y', 12.5 + 6)
    .attr('fill', '#444')
    .style('font-size', '15px')
    .style('font-weight', 400)
    .text('PJ')
  sCanvas.append('text')
    .attr('x', 12.5 + 100 + 14 - 13)
    .attr('y', 12.5 + 6)
    .attr('fill', '#444')
    .style('font-size', '15px')
    .style('font-weight', 400)
    .text('TWh')
}
