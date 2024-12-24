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

// d3.select('#testSVG').attr('transform', `scale(${(document.getElementById('scaleableSVGContainer').offsetWidth-40) / (900)})`)
// d3.select('#testSVG').attr('transform', 'scale(' + document.getElementById('scaleableSVGContainer').offsetWidth / 900).offsetWidth + ')'
// var buttonsContainerHeight = document.getElementById('scenarioButtons').offsetHeight
// d3.select('#buttonsContainer').style('height', buttonsContainerHeight + 35 + 50 + 'px')
// var posTop = initMainContainerTop + buttonsContainerHeight
// // console.log('Position Top:', posTop)
// d3.select('#mainContainer').style('top', `${posTop}px`)
// posTop = initYearButtonsTop + buttonsContainerHeight - 725
// // console.log('Position Top:', posTop)
// d3.select('#yearButtons').style('top', `${posTop}px`)
// posTop = initJaarButtonsTitleTop + buttonsContainerHeight
// d3.select('#jaarButtonsTitle').style('top', `${posTop}px`)
// posTop = initUnitSelectorDivTop + buttonsContainerHeight
// d3.select('#unitSelectorDiv').style('top', `${posTop}px`)
// posTop = initRemarksDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight + document.getElementById('energieDragersContainer').offsetHeight
// d3.select('#remarksContainer').style('top', `${posTop}px`)
// posTop = initEnergieDragersDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight
// d3.select('#energieDragersContainer').style('top', `${posTop}px`)
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
    const originalWidth = 1500; // Adjust based on your SVG's original width
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
    // 
    // // Dynamically adjust heights
    // d3.select('#mainContainer').style('height', `${width * 1.2}px`)
    // d3.select('#sankeyContainer').style('height', `${width * 0.62}px`)

    // // Adjust buttons container height
    // const buttonsContainerHeight = document.getElementById('scenarioButtons').offsetHeight
    // d3.select('#buttonsContainer').style('height', `${buttonsContainerHeight + 35 +  50}px`)

    // // Calculate and adjust top position dynamically
    // var posTop = initMainContainerTop + buttonsContainerHeight
    // d3.select('#mainContainer').style('top', `${posTop}px`)

    // posTop = initYearButtonsTop + buttonsContainerHeight - 725
    // d3.select('#yearButtons').style('top', `${posTop}px`)

    // posTop = initJaarButtonsTitleTop + buttonsContainerHeight
    // d3.select('#jaarButtonsTitle').style('top', `${posTop}px`)

    // posTop = initUnitSelectorDivTop + buttonsContainerHeight
    // d3.select('#unitSelectorDiv').style('top', `${posTop}px`)

    // posTop = initRemarksDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight + document.getElementById('energieDragersContainer').offsetHeight
    // d3.select('#remarksContainer').style('top', `${posTop}px`)
    // // console.log(buttonsContainerHeight)
    // posTop = initEnergieDragersDivTop + buttonsContainerHeight + document.getElementById('sankeyContainer').offsetHeight
    // d3.select('#energieDragersContainer').style('top', `${posTop}px`)

  // setWidth = document.getElementById('sankeyContainer').offsetWidth
  // // console.log(setWidth)
  // d3.select('#energieDragersContainer').style('width', `${setWidth*0.74}px`)
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
