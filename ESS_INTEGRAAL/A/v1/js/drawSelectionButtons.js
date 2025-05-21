let globalActiveToepassing = 'alle'
let globalActiveSector = 'alle'

function drawSelectionButtons (config) {
  let scenarioIdLookup = {
    'TNO.ADAPT': {
      2030: 0,
      2035: 1,
      2040: 2,
      2045: 3,
      2050: 4,
    },
    'TNO.TRANSFORM': {
      2030: 5,
      2035: 6,
      2040: 7,
      2045: 8,
      2050: 9
    },
    'TNO.TRANSFORM.C.EN.I': {
      2030: 10,
      2035: 11,
      2040: 12,
      2045: 13,
      2050: 14
    },
    'TNO.TRANSFORM.MC': {
      2030: 15,
      2035: 16,
      2040: 17,
      2045: 18,
      2050: 19
    },
    'TNO.TRANSFORM.MC.EN.I': {
      2030: 20,
      2035: 21,
      2040: 22,
      2045: 23,
      2050: 24
    },
    'PBL.PR40': {
      2030: 25,
      2035: 26,
      2040: 27,
      2045: 28,
      2050: 29
    },
    'PBL.SR20': {
      2030: 30,
      2035: 31,
      2040: 32,
      2045: 33,
      2050: 34
    },
    'PBL.PB30': {
      2030: 35,
      2035: 36,
      2040: 37,
      2045: 38,
      2050: 39
    }
  }
  // SET DEFAULTS
  globalActiveScenario.id = 'TNO.ADAPT'
  globalActiveYear.id = '2030'
  globalActiveEnergyflowsSankey.id = 'system'
  globalSankeyInstancesActiveDataset = {
    energyflows: {id: 'system'}
  }
  globalActiveEnergyflowsFilter = 'system'
  // globalActiveWACC.id = 'WACC_standaard'

  // console.log(scenarioIdLookup)

  function setScenario (scenario, type) {

    // d3.select('#remarksContainer').html('')
    // d3.selectAll('.buttonRect_' + config.targetDIV).attr('fill', '#fff')
    // d3.selectAll('.buttonText_' + config.targetDIV).attr('fill', '#333')
    // d3.select('#scenariobutton_' + scenario + '_rect').attr('fill', '#333')
    // d3.select('#scenariobutton_' + scenario + '_text').attr('fill', '#fff')
    activeScenario = scenario

    activeScenario = scenarioIdLookup[globalActiveScenario.id][globalActiveYear.id]
    currentScenarioID = activeScenario // neaten
    currentScenario = globalActiveScenario.id
    // console.log(globalActiveScenario.id)
    // console.log(config)
    // 
    setTimeout(() => {
      drawRemarks()
    }, 500)

    // update all sankeys
    console.log(sankeyInstances)
    sankeyConfigs.forEach(element => {
      config.sankeyDataID = element.sankeyDataID
      tick(config)
    })
  }
  window.setScenario = setScenario // make setScenario available globally

  function updateActiveScenarioIndicator (scenario) {
    let conceptNotificatie = '. NB: Dit is een conceptversie, het diagram kan nog inconsistenties bevatten.'
    let scenarioTitles = {
      IP2024_KA_2025: 'Getoond: SSS',
      DUMMY_2050: 'Getoond: DUMMY - 2050'
    }
    d3.select('#huidigGetoond').html(scenarioTitles[config.scenarios[activeScenario].title])
  }

  drawScenarioButtons()
  function drawScenarioButtons () {
    let scenarios = [

      {id: 'TNO.ADAPT', title: 'TNO.ADAPT'},
      {id: 'TNO.TRANSFORM', title: 'TNO.TRANSFORM'},
      {id: 'TNO.TRANSFORM.C.EN.I', title: 'TNO.TRANSFORM.C.EN.I'},
      {id: 'TNO.TRANSFORM.MC', title: 'TNO.TRANSFORM.MC'},
      {id: 'TNO.TRANSFORM.MC.EN.I', title: 'TNO.TRANSFORM.MC.EN.I'},
      {id: 'PBL.PR40', title: 'PBL.TVKN-PR40'},
      {id: 'PBL.SR20', title: 'PBL.TVKN-SR20'},
      {id: 'PBL.PB30', title: 'PBL.TVKN-PB30'},
      // {id: 'SRMPA', title: 'Specifiek Ruim - Minder plastic afval'},

    ]

    let container = document.getElementById('scenarioButtons')
    container.innerHTML = ''

    // Add label
    let label = document.createElement('div')
    label.className = 'menu-label'
    label.textContent = 'Scenario'
    container.appendChild(label)

    // Add buttons
    scenarios.forEach((scenario, index) => {
      let button = document.createElement('button')
      button.textContent = scenario.title
      createButton(button, index)

      button.onclick = function () {
        let buttons = container.getElementsByTagName('button')
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove('highlighted')
        }
        button.classList.add('highlighted')
        globalActiveScenario = scenario
        setScenario()

        console.log(globalActiveScenario.id)
        switchRoutekaart({
          scenario: globalActiveScenario.id,
          sector: globalActiveSector,
          routekaart: globalActiveToepassing,
          yMax: getYMax(globalActiveToepassing, globalActiveSector),
          titlesArray: currentTitlesArray,
          colorsArray: currentColorsArray
        })



      }

      container.appendChild(button)
    })
  }

  drawYearButtons()
  function drawYearButtons () {
    let years = [
      {id: '2030', title: '2030'},
      {id: '2035', title: '2035'},
      {id: '2040', title: '2040'},
      {id: '2045', title: '2045'},
      {id: '2050', title: '2050'}
    ]

    let container = document.getElementById('yearButtons')
    container.innerHTML = ''

    // Add label
    let label = document.createElement('div')
    label.className = 'menu-label'
    label.textContent = 'Jaar'
    container.appendChild(label)

    years.forEach((year, index) => {
      let button = document.createElement('button')
      button.textContent = year.title
      createButton(button, index)

      // Function to update button states
      function updateButtonState() {
        button.disabled = false
        button.style.opacity = '1'
      }

      // Initial state
      updateButtonState()

      button.onclick = function () {
        if (button.disabled) return // Don't allow clicking disabled buttons
        
        let buttons = container.getElementsByTagName('button')
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove('highlighted')
        }
        button.classList.add('highlighted')
        globalActiveYear = year
        setScenario()
      }

      container.appendChild(button)
    })

    // Add event listener to update year button states when scenario changes
    const scenarioButtons = document.getElementById('scenarioButtons')
    scenarioButtons.addEventListener('click', function() {
      setTimeout(() => {
        const yearButtons = container.getElementsByTagName('button')
        Array.from(yearButtons).forEach(button => {
          const yearId = button.textContent
          const isWLO = ['WLO1', 'WLO2', 'WLO3', 'WLO4'].includes(globalActiveScenario.id)
          const isLateYear = ['2055', '2060'].includes(yearId)
          
          if (!isWLO && isLateYear) {
            button.disabled = true
            button.style.opacity = '0.5'
            if (button.classList.contains('highlighted')) {
              // If the current year is disabled, switch to 2050
              const year2050Button = Array.from(yearButtons).find(btn => btn.textContent === '2050')
              if (year2050Button) {
                year2050Button.click()
              }
            }
          } else {
            button.disabled = false
            button.style.opacity = '1'
          }
        })
      }, 0)
    })
  }

  drawToepassingButtons()

function drawToepassingButtons () {
  const toepassing = [
    {id: 'alle', title: 'Alle toepassingen'},
    {id: 'warmte', title: 'Warmte'},
    {id: 'proces', title: 'Proces'},
    {id: 'transport', title: 'Transport'},
    {id: 'overige', title: 'Overige'}
  ]

  const container = document.getElementById('toepassingenButtons')
  container.innerHTML = ''

  // Add label
  let label = document.createElement('div')
  label.className = 'menu-label'
  label.textContent = 'Toepassing'
  container.appendChild(label)

  toepassing.forEach((toepassing, index) => {
    const button = document.createElement('button')
    button.textContent = toepassing.title
    createButton(button, index)

    button.onclick = function () {
      Array.from(container.getElementsByTagName('button')).forEach(btn => {
        btn.classList.remove('highlighted')
      })
      button.classList.add('highlighted')
      globalActiveToepassing = toepassing.id
      
      // Update button states based on selection
      updateButtonStates()
      
      try {
        switchRoutekaart({
          scenario: currentScenario,
          sector: globalActiveSector,
          routekaart: toepassing.id,
          yMax: getYMax(toepassing.id, globalActiveSector),
          titlesArray: currentTitlesArray,
          colorsArray: currentColorsArray
        })
      } catch (error) {
        console.error('Error in switchRoutekaart:', error)
        // Switch to 'alle sectoren' if an error occurs
        const mainSectorButtons = document.getElementById('mainSectorButtons').getElementsByTagName('button')
        const alleSectorenButton = Array.from(mainSectorButtons).find(btn => btn.textContent === 'Alle sectoren')
        if (alleSectorenButton) {
          alleSectorenButton.click()
        }
      }
    }

    container.appendChild(button)
  })
}

function updateButtonStates() {
  // Get all sector buttons
  const mainSectorButtons = document.getElementById('mainSectorButtons').getElementsByTagName('button')
  const toepassingButtons = document.getElementById('toepassingenButtons').getElementsByTagName('button')
  const subSectorButtons = document.getElementById('subSectorButtons').getElementsByTagName('button')
  
  // Reset all buttons to enabled state
  Array.from(mainSectorButtons).forEach(btn => {
    btn.disabled = false
    btn.style.opacity = '1'
  })
  Array.from(toepassingButtons).forEach(btn => {
    btn.disabled = false
    btn.style.opacity = '1'
  })
  Array.from(subSectorButtons).forEach(btn => {
    btn.disabled = false
    btn.style.opacity = '1'
  })
  
  // If 'warmte' is selected, disable mobility sectors
  if (globalActiveToepassing === 'warmte') {
    Array.from(mainSectorButtons).forEach(btn => {
      if (btn.textContent === 'Mobiliteit nationaal' || btn.textContent === 'Mobiliteit internationaal') {
        btn.disabled = true
        btn.style.opacity = '0.5'
      }
    })
  }
  
  // If 'huishoudens' or 'utiliteit' is selected, disable transport and proces
  if (globalActiveSector === 'hh' || globalActiveSector === 'ut') {
    Array.from(toepassingButtons).forEach(btn => {
      if (btn.textContent === 'Transport' || btn.textContent === 'Proces') {
        btn.disabled = true
        btn.style.opacity = '0.5'
      }
    })
  }

  // If 'transport' is selected, disable non-mobility sectors
  if (globalActiveToepassing === 'transport') {
    // Disable main sector buttons
    Array.from(mainSectorButtons).forEach(btn => {
      if (btn.textContent !== 'Mobiliteit nationaal' && 
          btn.textContent !== 'Mobiliteit internationaal' && 
          btn.textContent !== 'Alle sectoren') {
        btn.disabled = true
        btn.style.opacity = '0.5'
      }
    })
    
    // Disable all subsector buttons
    Array.from(subSectorButtons).forEach(btn => {
      btn.disabled = true
      btn.style.opacity = '0.5'
    })
  }
}



  drawSectorButtons()
  function drawSectorButtons () {
    let mainSectoren = [
      {id: 'alle', title: 'Alle sectoren'},
      {id: 'hh', title: 'Huishoudens'},
      {id: 'ut', title: 'Utiliteit'},
      {id: 'lb', title: 'Landbouw'},
      {id: 'mob_nat', title: 'Mobiliteit nationaal'},
      {id: 'mob_int', title: 'Mobiliteit internationaal'},
      {id: 'overige', title: 'Overige'}
    ]

    let subsectoren = [
      {id: 'ind_alle', title: 'Alle industrie'},
      {id: 'ind_ch', title: 'Chemie'},
      {id: 'ind_km', title: 'Kunstmest'},
      {id: 'ind_fe', title: 'Ferro'},
      {id: 'ind_nf', title: 'Non-ferro'},
      {id: 'ind_fd', title: 'Voedsel'},
      {id: 'ind_ws', title: 'Afval'},
      {id: 'ind_ov', title: 'Industrie Overige'}
    ]

    let mainContainer = document.getElementById('mainSectorButtons')
    let subContainer = document.getElementById('subSectorButtons')
    
    mainContainer.innerHTML = ''
    subContainer.innerHTML = ''

    // Add main sector label
    let mainLabel = document.createElement('div')
    mainLabel.className = 'menu-label'
    mainLabel.textContent = 'Sector'
    mainContainer.appendChild(mainLabel)

    // Create main sectors buttons
    mainSectoren.forEach((sector, index) => {
      let button = document.createElement('button')
      button.textContent = sector.title
      createButton(button, index)

      button.onclick = function () {
        // Remove highlight from all buttons in both containers
        let mainButtons = mainContainer.getElementsByTagName('button')
        let subButtons = subContainer.getElementsByTagName('button')
        
        for (let i = 0; i < mainButtons.length; i++) {
          mainButtons[i].classList.remove('highlighted')
        }
        for (let i = 0; i < subButtons.length; i++) {
          subButtons[i].classList.remove('highlighted')
        }
        
        button.classList.add('highlighted')
        globalActiveSector = sector.id

        // Update button states based on selection
        updateButtonStates()

        try {
          switchRoutekaart({
            scenario: currentScenario,
            sector: sector.id,
            routekaart: globalActiveToepassing,
            yMax: getYMax(globalActiveToepassing, sector.id),
            titlesArray: currentTitlesArray,
            colorsArray: currentColorsArray
          })
        } catch (error) {
          console.error('Error in switchRoutekaart:', error)
          // Switch to 'alle sectoren' if an error occurs
          const alleSectorenButton = Array.from(mainButtons).find(btn => btn.textContent === 'Alle sectoren')
          if (alleSectorenButton) {
            alleSectorenButton.click()
          }
        }
      }

      mainContainer.appendChild(button)
    })

    // Add subsector label
    let subLabel = document.createElement('div')
    subLabel.className = 'menu-label'
    subLabel.textContent = ''
    subContainer.appendChild(subLabel)

    // Create subsector buttons
    subsectoren.forEach((sector, index) => {
      let button = document.createElement('button')
      button.textContent = sector.title
      createButton(button, -1) // Pass -1 to prevent default highlighting

      button.onclick = function () {
        // Remove highlight from all buttons in both containers
        let mainButtons = mainContainer.getElementsByTagName('button')
        let subButtons = subContainer.getElementsByTagName('button')
        
        for (let i = 0; i < mainButtons.length; i++) {
          mainButtons[i].classList.remove('highlighted')
        }
        for (let i = 0; i < subButtons.length; i++) {
          subButtons[i].classList.remove('highlighted')
        }
        
        button.classList.add('highlighted')
        globalActiveSector = sector.id

        // Update button states based on selection
        updateButtonStates()

        try {
          switchRoutekaart({
            scenario: currentScenario,
            sector: sector.id,
            routekaart: globalActiveToepassing,
            yMax: getYMax(globalActiveToepassing, sector.id),
            titlesArray: currentTitlesArray,
            colorsArray: currentColorsArray
          })
        } catch (error) {
          console.error('Error in switchRoutekaart:', error)
          // Switch to 'alle sectoren' if an error occurs
          const alleSectorenButton = Array.from(mainButtons).find(btn => btn.textContent === 'Alle sectoren')
          if (alleSectorenButton) {
            alleSectorenButton.click()
          }
        }
      }

      subContainer.appendChild(button)
    })
  }
  // init

// updateActiveScenarioIndicator(activeScenario)
}

drawSankeyEnergiestromenSelectieButtons()
function drawSankeyEnergiestromenSelectieButtons () {
  let focusOptions = [
    {id: 'system', title: 'Energiesysteem'},
    {id: 'electricity', title: 'Elektriciteitsketen'},
    {id: 'hydrogen', title: 'Waterstofketen'},
    {id: 'heat', title: 'Warmteketen'},
    {id: 'carbon', title: 'Koolstofketen'}
  ]

  let container = document.getElementById('sankeyEnergiestromenSelectieMenu')

  // Clear existing content in case the function is called multiple times
  container.innerHTML = ''

  // Add label
  let label = document.createElement('div')
  label.className = 'menu-label'
  label.textContent = 'Scope'
  container.appendChild(label)

  focusOptions.forEach((focus, index) => {
    let button = document.createElement('button')
    button.textContent = focus.title
    createButton(button, index)

    button.onclick = function () {
      // Remove 'highlighted' class from all buttons
      let buttons = container.getElementsByTagName('button')
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('highlighted')
      }
      // Add 'highlighted' class to the clicked button
      button.classList.add('highlighted')

      globalActiveEnergyflowsSankey = focus
      globalActiveEnergyflowsFilter = focus.id

      switch (focus.id) {
        case 'system':
          d3.select('#sankeyTitle').html('Energiesysteem')
          break
        case 'electricity':
          d3.select('#sankeyTitle').html('Elektriciteitsketen')
          break
        case 'hydrogen':
          d3.select('#sankeyTitle').html('Waterstofketen')
          break
        case 'heat':
          d3.select('#sankeyTitle').html('Warmteketen')
          break
        case 'carbon':
          d3.select('#sankeyTitle').html('Koolstofketen')
          break
        default:
          break
      }

      setScenario()
    }

    container.appendChild(button)
  })
}




// LOOKUP YVALUES


function getYMax(toepassing, sector) {
  const baseKey = `${toepassing}_${sector}`;
  const values = lookup_ymaxvalues[baseKey] ?? [2500, 500, 2500];
  return ['boven', 'midden', 'onder'].map((_, i) => values[i]);
}

// Define only one set of values per toepassing+sector combo
const lookup_ymaxvalues = {
  "alle_alle": [2500, 1000, 2500],
  "warmte_hh": [400, 1000, 400],
  "overige_hh": [100, 1000, 100],
  "warmte_ut": [150, 1000, 150],
  "overige_ut": [200, 1000, 200],
  "warmte_lb": [60, 1000, 60],
  "overige_lb": [50, 1000, 50],
  "proces_lb": [100, 1000, 100],
  "warmte_ind_ch": [200, 1000, 200],
  "overige_ind_ch": [100, 1000, 100],
  "proces_ind_ch": [500, 1000, 500],
  "warmte_ind_km": [20, 1000, 20],
  "overige_ind_km": [2500, 1000, 2500],
  "proces_ind_km": [100, 1000, 100],
  "warmte_ind_fe": [20, 1000, 20],
  "overige_ind_fe": [10, 1000, 10],
  "proces_ind_fe": [100, 1000, 100],
  "warmte_ind_nf": [5, 1000, 5],
  "overige_ind_nf": [10, 1000, 10],
  "proces_ind_nf": [10, 1000, 10],
  "warmte_ind_fd": [5, 1000, 5],
  "overige_ind_fd": [100, 1000, 100],
  "proces_ind_fd": [50, 1000, 50],
  "warmte_ind_ws": [20, 1000, 20],
  "overige_ind_ws": [10, 1000, 10],
  "proces_ind_ws": [20, 1000, 20],
  "warmte_ind_ov": [100, 1000, 100],
  "overige_ind_ov": [50, 1000, 50],
  "proces_ind_ov": [2500, 1000, 2500],
  "transport_mob_nat": [400, 1000, 400],
  "overige_mob_nat": [2500, 1000, 2500],
  "transport_mob_int": [600, 1000, 600],
  "overige_mob_int": [2500, 1000, 2500],
  "warmte_overige": [100, 1000, 100],
  "overige_overige": [75, 1000, 75],
  "proces_overige": [2500, 1000, 2500],
  "warmte_alle": [800, 1000, 800],
  "overige_alle": [700, 1000, 700],
  "proces_alle": [750, 1000, 750],
  "transport_alle": [1000, 1000, 1000],
  "warmte_ind_alle": [300, 1000, 300],
  "overige_ind_alle": [150, 1000, 150],
  "proces_ind_alle": [650, 1000, 650],
  "alle_ind_alle": [1200, 1200, 1200],
  "alle_ind_ch": [650, 1000, 650],
  "alle_ind_km": [130, 1000, 130],
  "alle_ind_fe": [130, 1000, 130],
  "alle_ind_nf": [30, 1000, 30],
  "alle_ind_fd": [200, 1000, 200],
  "alle_ind_ws": [50, 1000, 50],
  "alle_ind_ov": [300, 1000, 300],
  "alle_hh": [450, 1000, 450],
  "alle_ut": [300, 1000, 300],
  "alle_lb": [100, 1000, 100],
  "alle_mob_nat": [400, 1000, 400],
  "alle_mob_int": [600, 1000, 600],
  "alle_overige": [100, 1000, 100]
};

function createButton(button, index) {
  button.className = 'button-black button-outline'
  button.style.textTransform = 'lowercase'
  button.style.display = 'inline-block'
  button.style.margin = '3px'
  button.style.fontWeight = 300
  button.style.border = '0px solid black'
  button.style.color = 'black'
  button.style.backgroundColor = 'white'
  button.style.padding = '4px 8px'
  button.style.lineHeight = '1.2'
  button.style.fontSize = '12px'
  button.style.textAlign = 'center'
  button.style.height = '26px'
  button.style.width = 'auto'
  button.style.minWidth = 'auto'
  button.style.maxWidth = 'none'
  button.style.borderRadius = '3px'
  button.style.transition = 'all 0.2s ease'
  button.style.overflow = 'hidden'
  button.style.textOverflow = 'ellipsis'
  button.style.whiteSpace = 'nowrap'

  if (index === 0) {
    button.classList.add('highlighted')
  }
}