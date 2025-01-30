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
    const originalWidth = 1200; // Adjust based on your SVG's original width
    const originalHeight = 1100; // Adjust based on your SVG's original height

    // Calculate the new scale
    const scale = containerWidth / originalWidth
    // console.log(scale)

    // Set the viewBox attribute to scale the SVG
    svgElement1.attr('viewBox', `0 0 ${originalWidth} ${originalHeight}`)
    svgElement1.attr('width', originalWidth * scale)
    svgElement1.attr('height', originalHeight * scale)

    // console.log(document.getElementById('sankeySVGPARENT').getBoundingClientRect().height)
    d3.select('#scaleableSVGContainer').style('height', document.getElementById('sankeySVGPARENT').getBoundingClientRect().height + 'px')
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

drawToelichting()
function drawToelichting () {
  d3.select('#blackmarker').append('svg').attr('width', 60).attr('height', 60).attr('id', 'blackMarker')
  let canvas = d3.select('#blackMarker').append('g')
  canvas.append('path')
    .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
    .attr('fill', '#444')
    .attr('transform', 'translate(60,0)scale(0.05)rotate(180)')

  canvas.append('text')
    .attr('transform', 'translate(32,25)')
    .attr('fill', 'white')
    .style('font-size', '14px')
    .text('0')

  d3.select('#redmarker').append('svg').attr('width', 60).attr('height', 60).attr('id', 'redMarker')
  canvas = d3.select('#redMarker').append('g')
  canvas.append('path')
    .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
    .attr('fill', '#c1121f')
    .attr('transform', 'translate(60,0)scale(0.05)rotate(180)')

  canvas.append('text')
    .attr('transform', 'translate(32,25)')
    .attr('fill', 'white')
    .style('font-size', '14px')
    .text('0')
}
