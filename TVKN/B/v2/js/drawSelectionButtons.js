function drawSelectionButtons (config) {
  let scenarioIdLookup = {
    'PR40': {
      2030: 0,
      2035: 1,
      2040: 2,
      2045: 3,
      2050: 4
    },
    'SR20': {
      2030: 5,
      2035: 6,
      2040: 7,
      2045: 8,
      2050: 9
    },
    'PB30': {
      2030: 10,
      2035: 11,
      2040: 12,
      2045: 13,
      2050: 14
    },
    'SR-minder-plastic-afval': {
      2030: 15,
      2035: 16,
      2040: 17,
      2045: 18,
      2050: 19
    },
    'PR-SR-biohoog-waterstoflaag': {
      2030: 20,
      2035: 21,
      2040: 22,
      2045: 23,
      2050: 24
    }
  }
  // SET DEFAULTS
  globalActiveScenario.id = 'PR40'
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
      {id: 'PR40', title: 'Pragmatisch Ruim 40'},
      {id: 'SR20', title: 'Specifiek Ruim 20'},
      {id: 'PB30', title: 'Pragmatisch Beperkt 30'},
      {id: 'SR-minder-plastic-afval', title: 'Specifiek Ruim - Minder plastic afval'},
      {id: 'PR-SR-biohoog-waterstoflaag', title: 'Overgang PR-SR - bio hoog, h2 laag'}
    ]

    let container = document.getElementById('scenarioButtons')

    // Clear existing content in case the function is called multiple times
    container.innerHTML = ''

    scenarios.forEach((scenario, index) => {
      let button = document.createElement('button')
      button.className = 'button-black button-outline'
      button.textContent = scenario.title

      button.style.textTransform = 'lowercase'
      button.style.display = 'inline-block'
      button.style.margin = '3px'
      button.style.fontWeight = 300
      button.style.border = '0px solid black'
      button.style.color = 'black'
      button.style.backgroundColor = 'white'
      button.style.paddingLeft = '15px'
      button.style.paddingRight = '15px'
      button.style.paddingTop = '15px'
      button.style.paddingBottom = '15px'
      button.style.lineHeight = '6px'
      button.style.fontSize = '12px'
      button.style.textAlign = 'center'

      // Highlight the first button by default
      if (index === 0) {
        button.classList.add('highlighted')
      }

      button.onclick = function () {
        // Remove 'highlighted' class from all buttons
        let buttons = container.getElementsByTagName('button')
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove('highlighted')
        }
        // Add 'highlighted' class to the clicked button
        button.classList.add('highlighted')

        console.log('Selected scenario:', scenario)
        globalActiveScenario = scenario
        setScenario()
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

    // Clear existing content in case the function is called multiple times
    container.innerHTML = ''

    years.forEach((year, index) => {
      let button = document.createElement('button')
      button.className = 'yearButton'
      button.textContent = year.title

      // Apply CSS to style the button

      button.className = 'button-black button-outline'
      // button.textContent = scenario.title

      button.style.textTransform = 'lowercase'
      button.style.display = 'inline-block'
      button.style.margin = '3px'
      button.style.fontWeight = 300
      button.style.border = '0px solid black'
      button.style.color = 'black'
      button.style.backgroundColor = 'white'
      button.style.paddingLeft = '15px'
      button.style.paddingRight = '15px'
      button.style.paddingTop = '15px'
      button.style.paddingBottom = '15px'
      button.style.lineHeight = '6px'
      button.style.fontSize = '12px'
      button.style.textAlign = 'center'
      // button.style.fontSize = '13px'

      // Highlight the first button by default
      if (index === 0) {
        button.classList.add('highlighted')
      }

      button.onclick = function () {
        // Remove 'highlighted' class from all buttons
        let buttons = container.getElementsByTagName('button')
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove('highlighted')
        }
        // Add 'highlighted' class to the clicked button
        button.classList.add('highlighted')

        // console.log('Selected scenario:', year)
        globalActiveYear = year
        setScenario()
      }

      container.appendChild(button)
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

  focusOptions.forEach((focus, index) => {
    let button = document.createElement('button')
    button.className = 'focusEnergiestromenButton'
    button.textContent = focus.title

    // Apply CSS to style the button

    button.className = 'button-black button-outline'
    // button.textContent = scenario.title

    button.style.textTransform = 'lowercase'
    button.style.display = 'inline-block'
    button.style.margin = '3px'
    button.style.fontWeight = 300
    button.style.border = '0px solid black'
    button.style.color = 'black'
    button.style.backgroundColor = 'white'
    button.style.paddingLeft = '15px'
    button.style.paddingRight = '15px'
    button.style.paddingTop = '15px'
    button.style.paddingBottom = '15px'
    button.style.lineHeight = '6px'
    button.style.fontSize = '12px'
    button.style.textAlign = 'center'
    // button.style.fontSize = '13px'

    // Highlight the first button by default
    if (index === 0) {
      button.classList.add('highlighted')
    }

    button.onclick = function () {
      // Remove 'highlighted' class from all buttons
      let buttons = container.getElementsByTagName('button')
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('highlighted')
      }
      // Add 'highlighted' class to the clicked button
      button.classList.add('highlighted')

      // console.log('Selected scenario:', year)
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
