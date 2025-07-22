function drawUIButtons () {
  drawScenarioButtons()
  function drawScenarioButtons () {
    let scenarios = [
      {id: 'OP.CCS.40', title: 'PBL | Pragmatisch Ruim 40'},
      {id: 'OptimistischSelectiefFossilCarbonPenalty', title: 'PBL | Specifiek Ruim 20'},
      {id: 'PP.CCS.30.in.2050', title: 'PBL | Pragmatisch Beperkt 30'},
      {id: 'ADAPT', title: 'TNO | ADAPT'},
      {id: 'TRANSFORM', title: 'TNO | TRANSFORM'},
      {id: 'TRANSFORM.Competitief.import', title: 'TNO | TRANSFORM Competitief & Import'},
      {id: 'TRANSFORM.Minder.competitief', title: 'TNO | TRANSFORM Minder Competitief'},
      {id: 'TRANSFORM.Minder.competitief.import', title: 'TNO | TRANSFORM Minder Competitief & Import'}
    ]

    let container = document.getElementById('scenarioButtons')

    // Clear existing content in case the function is called multiple times
    container.innerHTML = ''

    scenarios.forEach((scenario, index) => {
      let button = document.createElement('button')
      button.className = 'button-black button-outline'
      button.textContent = scenario.title
      button.style.textTransform = 'none'
      button.style.display = 'inline-block'
      button.style.margin = '3px'
      button.style.fontWeight = 300
      button.style.border = '0px solid black'
      button.style.color = 'black'
      button.style.backgroundColor = 'white'
      button.style.paddingLeft = '15px'
      button.style.paddingRight = '15px'
      button.style.paddingTop = '5px'
      button.style.paddingBottom = '5px'
      button.style.fontSize = '14px'
      button.style.textAlign = 'center'
      button.style.height = '25px'
      button.style.boxSizing = 'border-box'
      button.style.verticalAlign = 'middle'
      button.style.lineHeight = '15px'

      // Highlight the default scenario
      if (scenario.id === globalActiveScenario.id) {
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

        // console.log('Selected scenario:', scenario)
        globalActiveScenario = scenario
        setScenario()
      }

      container.appendChild(button)
    })
  }

  drawWACCButtons()
  function drawWACCButtons () {
    let waccs = [
      {id: 'wacc_standaard', title: 'Maatschappelijk (2.25%)'},
      {id: 'wacc_verhoogd', title: 'Marktconform (4% - 8%)'},
      {id: 'wacc_actiefbeleid', title: 'Marktconform met actief beleid (4% - 6.5%)'}

    ]

    let container = document.getElementById('waccButtons')

    // Clear existing content in case the function is called multiple times
    container.innerHTML = ''

    waccs.forEach((waccs, index) => {
      let button = document.createElement('button')
      button.className = 'button-black button-outline'
      button.textContent = waccs.title
      button.style.textTransform = 'lowercase'
      button.style.display = 'inline-block'
      button.style.margin = '3px'
      button.style.fontWeight = 300
      button.style.border = '0px solid black'
      button.style.color = 'black'
      button.style.backgroundColor = 'white'
      button.style.paddingLeft = '15px'
      button.style.paddingRight = '15px'
      button.style.paddingTop = '5px'
      button.style.paddingBottom = '5px'
      button.style.fontSize = '14px'
      button.style.textAlign = 'center'
      button.style.height = '25px'
      button.style.boxSizing = 'border-box'
      button.style.verticalAlign = 'middle'
      button.style.lineHeight = '15px'

      // Highlight the default WACC
      if (waccs.id === globalActiveWACC.id) {
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

        // console.log('Selected scenario:', waccs)
        globalActiveWACC = waccs
        setScenario()
      }

      container.appendChild(button)
    })
  }

  drawTaxButtons()
  function drawTaxButtons () {
    let tax = [
      {id: 'Nee', title: 'Zonder belastingen'},
      {id: 'Ja', title: 'Met belastingen'}

    ]

    let container = document.getElementById('taxButtons')

    // Clear existing content in case the function is called multiple times
    container.innerHTML = ''

    tax.forEach((tax, index) => {
      let button = document.createElement('button')
      button.className = 'button-black button-outline'
      button.textContent = tax.title
      button.style.textTransform = 'lowercase'
      button.style.display = 'inline-block'
      button.style.margin = '3px'
      button.style.fontWeight = 300
      button.style.border = '0px solid black'
      button.style.color = 'black'
      button.style.backgroundColor = 'white'
      button.style.paddingLeft = '15px'
      button.style.paddingRight = '15px'
      button.style.paddingTop = '5px'
      button.style.paddingBottom = '5px'
      button.style.fontSize = '14px'
      button.style.textAlign = 'center'
      button.style.height = '25px'
      button.style.boxSizing = 'border-box'
      button.style.verticalAlign = 'middle'
      button.style.lineHeight = '15px'

      // Highlight the default tax setting
      if (tax.id === globalActiveTax.id) {
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

        // console.log('Selected scenario:', tax)
        globalActiveTax = tax
        setScenario()
      }

      container.appendChild(button)
    })
  }

  drawUsetimeButtons()
  function drawUsetimeButtons () {
    let timeuse = [
      {id: 'Nee', title: 'Zonder flex'},
      {id: 'Ja', title: 'Met flex'}
    ]

    let container = document.getElementById('usetimeButtons')

    // Clear existing content in case the function is called multiple times
    container.innerHTML = ''

    timeuse.forEach((timeuse, index) => {
      let button = document.createElement('button')
      button.className = 'button-black button-outline'
      button.textContent = timeuse.title
      button.style.textTransform = 'lowercase'
      button.style.display = 'inline-block'
      button.style.margin = '3px'
      button.style.fontWeight = 300
      button.style.border = '0px solid black'
      button.style.color = 'black'
      button.style.backgroundColor = 'white'
      button.style.paddingLeft = '15px'
      button.style.paddingRight = '15px'
      button.style.paddingTop = '5px'
      button.style.paddingBottom = '5px'
      button.style.fontSize = '14px'
      button.style.textAlign = 'center'
      button.style.height = '25px'
      button.style.boxSizing = 'border-box'
      button.style.verticalAlign = 'middle'
      button.style.lineHeight = '15px'

      // Highlight the default timeuse setting
      if (timeuse.id === globalActiveTimeUse.id) {
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

        // console.log('Selected scenario:', timeuse)
        globalActiveTimeUse = timeuse
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
      button.style.paddingTop = '5px'
      button.style.paddingBottom = '5px'
      button.style.fontSize = '14px'
      button.style.textAlign = 'center'
      button.style.height = '25px'
      button.style.boxSizing = 'border-box'
      button.style.verticalAlign = 'middle'
      button.style.lineHeight = '15px'

      // Highlight the default year
      if (year.id === globalActiveYear.id) {
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
  initializeLineGraphScenarioSelector()
}

// --- START: Added for Line Graph Scenario Selection ---

// Define the details for all 8 scenarios, including their IDs, labels, and colors.
// This should ideally be consistent with allScenarios in drawGraphs.js
window.allScenarioDetails = {
  'OP.CCS.40': { label: 'Pragmatisch Ruim 40', color: '#DD5471' },
  'OptimistischSelectiefFossilCarbonPenalty': { label: 'Specifiek Ruim 20', color: '#62D3A4' },
  'PP.CCS.30.in.2050': { label: 'Pragmatisch Beperkt 30', color: '#3F88AE' },
  'ADAPT': { label: 'ADAPT', color: '#D78062' },
  'TRANSFORM': { label: 'TRANSFORM', color: '#E8C964' },
  'TRANSFORM.Competitief.import': { label: 'TRANSFORM Competitief & Import', color: '#9F67C8' },
  'TRANSFORM.Minder.competitief': { label: 'TRANSFORM Minder Competitief', color: '#78A8E6' },
  'TRANSFORM.Minder.competitief.import': { label: 'TRANSFORM Minder Competitief & Import', color: '#FABE5A' }
}

// Initialize the global array for selected line graph scenarios.
// Default to all scenarios.
window.globalSelectedLineGraphScenarios = Object.keys(window.allScenarioDetails)

// Function to update the global list of selected scenarios for line graphs
function updateGlobalSelectedLineGraphScenarios () {
  const selectedScenarios = []
  const checkboxes = document.querySelectorAll('#scenarioCheckboxItemsContainer input[type="checkbox"]')
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedScenarios.push(checkbox.value)
    }
  })
  window.globalSelectedLineGraphScenarios = selectedScenarios
  console.log('Updated globalSelectedLineGraphScenarios:', window.globalSelectedLineGraphScenarios)

  // IMPORTANT: Trigger graph refresh here
  // This is where you need to call your application's function to redraw the graphs.
  // For example:
  // if (window.globalInputData) {
  //   window.handleInputDataAndDraw(window.globalInputData)
  // } else {
  //   window.requestDataAndDraw() // Or however your application normally fetches data and redraws
  // }
  // Or simply:
  window.suppressGraphAnimations = true // Set flag to suppress animations
  setScenario(); // If setScenario() is your main function to refresh/redraw everything
  window.suppressGraphAnimations = false // Reset flag
}

// --- New function to control visibility of the scenario selector bar ---
function checkAndToggleScenarioBarVisibility () {
  const sankeyContainer = document.getElementById('scaleableSVGContainer')
  const scenarioBar = document.getElementById('scenarioSelectorBar')

  if (!scenarioBar) {
    // If the bar hasn't been created yet or is removed, do nothing.
    return
  }

  if (!sankeyContainer) {
    scenarioBar.style.display = 'none' // Default to hidden if sankey container is missing
    // console.warn('Element with ID "scaleableSVGContainer" not found. Scenario selector bar visibility will be managed by scroll.')
    return
  }

  const sankeyRect = sankeyContainer.getBoundingClientRect()

  if (sankeyRect.bottom < 250) { // If bottom of sankey is less than 250px from the top of the viewport (e.g. partially visible or scrolled past)
    scenarioBar.style.display = 'flex'; // Show the bar (original display style was flex)
  } else {
    scenarioBar.style.display = 'none' // Hide the bar
  }
}
// --- End of new function ---

// Function to initialize the scenario selector checkboxes for line graphs
function initializeLineGraphScenarioSelector () {
  const mainContainer = document.getElementById('main-container')
  if (!mainContainer) {
    console.error('Element with ID "main-container" not found. Cannot append scenario selector bar.')
    return
  }

  // Create the main bar, now to be sticky at the bottom of its parent
  const scenarioSelectorBar = document.createElement('div')
  scenarioSelectorBar.id = 'scenarioSelectorBar'
  scenarioSelectorBar.style.position = 'sticky'; // Changed from 'fixed'
  scenarioSelectorBar.style.bottom = '0'
  // scenarioSelectorBar.style.left = '0'; // Left is relative to parent, usually 0 by default or can be managed by parent's padding
  scenarioSelectorBar.style.width = '100%'; // Will take full width of parent (main-container)
  scenarioSelectorBar.style.backgroundColor = '#DCE6EF' // A light background color - UPDATED
  scenarioSelectorBar.style.padding = '10px 20px'
  scenarioSelectorBar.style.boxSizing = 'border-box'
  scenarioSelectorBar.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.1)'
  scenarioSelectorBar.style.zIndex = '1000'
  scenarioSelectorBar.style.display = 'flex'
  scenarioSelectorBar.style.flexDirection = 'row' // Changed from 'column' to 'row'
  scenarioSelectorBar.style.alignItems = 'flex-start'; // Align items to the start (top of the row)

  // Initially hide the bar, its visibility will be controlled by scroll.
  scenarioSelectorBar.style.display = 'none'

  // Title for the selector bar
  const titleElement = document.createElement('h4')

  titleElement.textContent = 'Scenarioselectie grafieken' // Simplified title
  titleElement.style.fontSize = '14px'
  titleElement.style.fontWeight = 500
  titleElement.style.color = '#666'
  titleElement.style.margin = '5px 20px 0 0'; // Margin: top right bottom left (space to the right)
  // titleElement.style.flexShrink = '0' // Prevent title from shrinking
  titleElement.style.padding = '0'
  scenarioSelectorBar.appendChild(titleElement)

  // Create a container for the actual checkbox items (this will be flex row)
  const checkboxItemsContainer = document.createElement('div')
  checkboxItemsContainer.id = 'scenarioCheckboxItemsContainer'
  checkboxItemsContainer.style.display = 'flex'
  checkboxItemsContainer.style.flexWrap = 'wrap'
  checkboxItemsContainer.style.gap = '5px 18px' // Spacing: row-gap column-gap
  checkboxItemsContainer.style.flexGrow = '1' // Allow checkbox container to take remaining space
  checkboxItemsContainer.style.paddingTop = '5px' // Added padding above checkboxes
  // checkboxItemsContainer.style.justifyContent = 'center' // If you want them centered

  Object.keys(window.allScenarioDetails).forEach(scenarioId => {
    const scenario = window.allScenarioDetails[scenarioId]

    const checkboxWrapper = document.createElement('div')
    checkboxWrapper.style.display = 'flex'
    checkboxWrapper.style.alignItems = 'center'
    // checkboxWrapper.style.marginBottom = '5px'; // Removed, gap handles vertical spacing
    // checkboxWrapper.style.marginLeft = '10px'; // Removed, gap handles horizontal spacing

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = `scenario-checkbox-${scenarioId}`
    checkbox.value = scenarioId
    checkbox.checked = window.globalSelectedLineGraphScenarios.includes(scenarioId)
    checkbox.style.marginRight = '8px' // Increased margin for larger checkbox
    checkbox.style.transform = 'scale(1.5) translateY(2px)' // Adjusted for vertical alignment - trying 2px down
    checkbox.style.verticalAlign = 'middle' // Align scaled checkbox with label

    const label = document.createElement('label')
    label.htmlFor = checkbox.id
    label.textContent = scenario.label
    label.style.fontSize = '13px'
    label.style.fontWeight = 300
    label.style.display = 'flex'
    label.style.alignItems = 'center'
    // label.style.paddingBottom = '10px' // Removed to reduce vertical spacing

    checkbox.addEventListener('change', updateGlobalSelectedLineGraphScenarios)

    checkboxWrapper.appendChild(checkbox)
    checkboxWrapper.appendChild(label)
    checkboxItemsContainer.appendChild(checkboxWrapper); // New: Appending to items container
  })

  scenarioSelectorBar.appendChild(checkboxItemsContainer) // Add checkbox items to the bar
  // document.body.appendChild(scenarioSelectorBar); // Old: Appending to body
  mainContainer.appendChild(scenarioSelectorBar); // New: Appending to main-container

  // Add scroll listener and perform initial check for scenario bar visibility
  window.addEventListener('scroll', checkAndToggleScenarioBarVisibility)
  checkAndToggleScenarioBarVisibility() // Call once to set initial state
}

// --- END: Added for Line Graph Scenario Selection ---
