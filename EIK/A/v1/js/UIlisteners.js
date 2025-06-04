setTimeout(() => {
  initializeUI
}, 500)

// init
let factor = 1675
let maxWidth = 1900

function initializeUI () {
  // initilize ui
  if (document.getElementById('main-container').offsetWidth > maxWidth) {
    windowScaleValueInit = maxWidth / factor
  } else {windowScaleValueInit = document.getElementById('main-container').offsetWidth / 940 }
}
// Create a ResizeObserver instance
let previousWidth = null // Store the previous width of the window

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    let { width, height } = entry.contentRect

    // Restrict to maxWidth if necessary
    if (width > maxWidth) width = maxWidth

    // Calculate scaling value and dynamic styles
    const windowScaleValue = width / factor
    const remarksContainerPosition = width / 3 + 'px'

    // Scale the SVG

    // d3.select('#testSVG').attr('transform', `scale(${(document.getElementById('scaleableSVGContainer').offsetWidth-40) / (900)})`)

    // Select the SVG element
    const svgElement1 = d3.select('#sankeySVGPARENT')

    // svgElement1.remove()
    // Get the container width
    const containerWidth = document.getElementById('scaleableSVGContainer').offsetWidth - 40

    // Original dimensions of your SVG
    const originalWidth = 1550; // Adjust based on your SVG's original width
    const originalHeight = 1050; // Adjust based on your SVG's original height

    // Calculate the new scale
    const scale = containerWidth / originalWidth
    // console.log(scale)

    // Set the viewBox attribute to scale the SVG
    svgElement1.attr('viewBox', `0 0 ${originalWidth} ${originalHeight}`)
    svgElement1.attr('width', originalWidth * scale)
    svgElement1.attr('height', originalHeight * scale)

    // console.log(document.getElementById('sankeySVGPARENT').getBoundingClientRect().height)
    d3.select('#scaleableSVGContainer').style('height', document.getElementById('sankeySVGPARENT').getBoundingClientRect().height + 'px')

    // Check if the width has changed
    if (width !== previousWidth) {
      previousWidth = width // Update the previous width

      document.querySelectorAll('.collapse').forEach((element) => {
        element.classList.remove('show') // Fold other elements
        const toggler = document.querySelector(`[data-bs-target="#${element.id}"]`)
        toggler.setAttribute('aria-expanded', 'false')
      })
      d3.select('#eindverbruikersCollapseIcon').text('+')
      d3.select('#ketensCollapseIcon').text('+')
      d3.select('#kostenCollapseIcon').text('+')

      drawGraphs({dataset_grafieken: dataset_grafieken})
    }
    d3.select('#menuContainer2').style('top', document.getElementById('menuContainer').offsetHeight + 'px')
  }
})

// Observe the target element
const targetElement = document.getElementById('main-container') // Adjust target as needed
if (targetElement) {
  resizeObserver.observe(targetElement)
} else {
  console.error('Target element for ResizeObserver not found.')
}
// Observe the div for resize changes
const resizeableDiv = document.getElementById('main-container')
resizeObserver.observe(resizeableDiv)
