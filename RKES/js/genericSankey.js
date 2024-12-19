let sankeyData = {links: [],nodes: [],order: []}
let sankeyLayout
let sankeyDiagram
let activeScenario = 0
let scaleInit = 1
let sankeyCanvas
let headerCanvas
let footerCanvas
let autoPlayStatus = false
let autoPlayTimer
let zoomHasInitialized = false
let nodesGlobal
let helicopterMarkers = []
let globalScaleInit
let currentK = 1
let helicopterLabelsPreviousValues = {}
let initScenarioSwitchFlag = 2

let sankeyInitFlag = false

function sankeyfy (config) {
  switch (config.mode) {
    case 'xlsx':
      process_xlsx(config)
      break
    case 'object':
      process_object(config)
      break
    default:
      console.log('WARNING - unknown plot mode')
      break
  }

  function process_xlsx (config) {
    readExcelFile(config.xlsxURL, (links, nodes, legend, settings) => {
      console.log('Links:', links)
      console.log('Nodes:', nodes)
      console.log('Legend:', legend)
      console.log('Settings:', settings)

      nodesGlobal = nodes

      config.settings = settings
      config.legend = legend

      globalScaleInit = settings[0].scaleInit

      sankeyData = {links: [],nodes: [],order: []}

      let scaleValues = settings[0].scaleDataValue
      for (i = 0;i < links.length;i++) {
        Object.keys(links[i]).forEach(key => {
          if (typeof links[i][key] == 'number') {
            links[i][key] = links[i][key] / scaleValues
          }
        })
      }
      let maxColumn = 0
      // generate order object
      nodes.forEach(element => {
        if (element.column > maxColumn) {maxColumn = element.column}
      })
      let columnLength = maxColumn + 1
      for (i = 0;i < columnLength;i++) {
        sankeyData.order.push([[]])
      }
      for (i = 0;i < nodes.length;i++) {
        for (j = 0;j < sankeyData.order.length;j++) {
          if (nodes[i].column == j) {
            if (sankeyData.order[j].length == 0) {sankeyData.order[j].push([])}
            for (k = 0; k < nodes[i].cluster;k++) {
              if (!(sankeyData.order[j].includes(k))) {
                sankeyData.order[j].push([])
              }
            }
            if (sankeyData.order[j][nodes[i].cluster].length == 0) {sankeyData.order[j][nodes[i].cluster].push([])}
            for (k = 0;k < nodes[i].row;k++) {
              if (!(sankeyData.order[j][nodes[i].cluster].includes(k))) {
                sankeyData.order[j][nodes[i].cluster].push([])
              }
            }
            sankeyData.order[j][nodes[i].cluster][nodes[i].row].push(nodes[i].id)
          }
        }
      }
      // generate nodes object

      for (i = 0;i < nodes.length;i++) {
        sankeyData.nodes.push({title: nodes[i].title, id: nodes[i].id, direction: nodes[i].direction, index: i, dummy: nodes[i].dummy, x: nodes[i].x, y: nodes[i].y})
      }

      // generate scenario object
      let scenarios = []
      let counter = 0
      for (s = 0;s < Object.keys(links[0]).length;s++) {
        if (Object.keys(links[0])[s].includes('scenario')) {
          if (counter < 10) {
            scenarios.push({title: Object.keys(links[0])[s].slice(10), id: Object.keys(links[0])[s]}) // NOTE: maximum number of allowed scenarios is 100 in this setup
          }else {
            scenarios.push({title: Object.keys(links[0])[s].slice(11), id: Object.keys(links[0])[s]})
          }
          counter++
        }
      }

      config.scenarios = scenarios
      // generate links object
      for (i = 0;i < links.length;i++) {
        sankeyData.links.push({index: i, source: links[i]['source.id'], target: links[i]['target.id'], color: getColor(links[i]['legend'], legend), value: links[i].value, type: links[i].type, legend: links[i]['legend']})
        scenarios.forEach(element => {
          sankeyData.links[i][element.id] = links[i][element.id]
        })
      }

      adaptTotalHeight = config.settings[0].adaptTotalHeight

      let width = document.getElementById(config.targetDIV).offsetWidth
      let height = document.getElementById(config.targetDIV).offsetHeight

      sankeyLayout = d3.sankey().extent([[settings[0].horizontalMargin, settings[0].verticalMargin], [width - settings[0].horizontalMargin, height - settings[0].verticalMargin]])
      sankeyDiagram = d3.sankeyDiagram().nodeTitle(function (d) { return d.title }).linkColor(function (d) { return d.color }) // return d.title || d.id

      drawSankey(sankeyData, legend, config)
    })
  }

  function process_object (config) {
    sankeyData = config.sankeyData
    sankeyLayout = d3.sankey().extent([[config.margins.horizontal, config.margins.vertical], [width - config.margins.horizontal, height - config.margins.vertical]])
    sankeyDiagram = d3.sankeyDiagram().nodeTitle(function (d) { return d.title }).linkColor(function (d) { return d.color }) // return d.title || d.id

    drawSankey(config, config.sankeyData, config.legend)
  }

  function drawSankey (sankeyData, legend, config) {
    d3.select('#sankeySVG').remove()

    assetslog = {}

    let scrollExtentWidth = config.settings[0].scrollExtentWidth
    let scrollExtentHeight = config.settings[0].scrollExtentHeight

    let viewportWidth = document.getElementById(config.targetDIV).offsetWidth
    let viewportHeight = document.getElementById(config.targetDIV).offsetHeight

    // create DIV structure
    // header
    d3.select('#' + config.targetDIV).append('div').attr('id', config.targetDIV + '_header').attr('class', 'header').style('position', 'absolute').style('top', '0px').style('left', '0px').style('right', '0px').style('overflow', 'hidden').style('height', '40px').style('width', '100%').append('svg').attr('id', config.targetDIV + '_headerSVG').attr('width', viewportWidth).attr('height', 40)
    // content wrapper
    d3.select('#' + config.targetDIV).append('div').attr('id', config.targetDIV + '_content-wrapper').style('position', 'relative').style('top', '0px').style('left', '0px').style('overflow', 'hidden').style('width', '100%').style('height', 'calc(100% - 0px)')
    // content
    d3.select('#' + config.targetDIV + '_content-wrapper').append('div').attr('id', 'content').style('width', viewportWidth + 'px').style('min-height', 'calc(100% - 0px)').style('height', viewportHeight + 'px').style('background-color', '')
    // footer
    d3.select('#' + config.targetDIV).append('div').attr('id', config.targetDIV + '_footer').attr('class', 'footer').style('height', '40px').style('width', '100%').style('position', 'absolute').style('bottom', '0px').style('left', '0px').style('overflow', 'hidden').append('svg').attr('id', config.targetDIV + '_footerSVG').attr('width', viewportWidth).attr('height', 40) // .style('background-color', '#666')
    // // button
    // d3.select('#' + config.targetDIV).append('div').attr('id', config.targetDIV + '_buttons').attr('class', 'buttons').style('height', '165px').style('width', '100%').style('position', 'absolute').style('top', '40px').style('left', '0px').style('overflow', 'hidden').append('svg').attr('id', config.targetDIV + '_buttonsSVG').attr('width', viewportWidth).attr('height', 165).style('background-color', 'none') // added 55
    // append SVGS
    d3.select('#content').append('svg').style('position', 'absolute').style('top', '0px').style('left', '0px').attr('id', 'sankeySVGbackdrop').attr('width', viewportWidth + 'px').attr('height', viewportHeight + 'px').style('pointer-events', 'none')
    d3.select('#content').append('svg').style('position', 'absolute').attr('id', 'sankeySVGPARENT').attr('width', scrollExtentWidth + 'px').attr('height', scrollExtentHeight + 'px').style('pointer-events', 'none').append('g').attr('id', 'sankeySVG').style('pointer-events', 'all') // scrollExtentWidth

    // append scenarioSummary container
    d3.select('#' + config.targetDIV).append('div').attr('class', 'scenarioSummary').style('position', 'absolute').style('left', '10px').style('top', '225px').style('width', '400px').style('background-color', 'rgba(255,255,255,0.8)').attr('id', 'scenarioSummaryContainer').style('pointer-events', 'none').style('visibility', 'hidden')

    // append huidgGetoond
    d3.select('#' + config.targetDIV).append('div').style('position', 'absolute').style('left', '10px').style('bottom', '50px').style('height', '21px').style('background-color', '#999').attr('id', 'huidigGetoond').style('pointer-events', 'none')

    // d3.select('#sankeySVG').style('transform-origin', '0px 0px')
    backdropCanvas = d3.select('#sankeySVGbackdrop')
    sankeyCanvas = d3.select('#sankeySVG')
    footerCanvas = d3.select('#' + config.targetDIV + '_footerSVG').append('g')
    buttonsCanvas = d3.select('#' + config.targetDIV + '_buttonsSVG').append('g')
    parentCanvas = d3.select('#sankeySVGPARENT').append('g')

    sankeyCanvas.append('rect').attr('width', scrollExtentWidth).attr('height', scrollExtentHeight).attr('fill', '#ddd').style('opacity', 0.001)
    backdropCanvas.append('rect').attr('id', 'backDropCanvasFill').attr('width', scrollExtentWidth).attr('height', scrollExtentHeight).attr('fill', '#E8F0F4') // .attr('fill', 'url(#dots)')

    window.addEventListener('resize', function (event) {
      d3.select('#backDropCanvasFill').attr('width', document.getElementById(config.targetDIV).offsetWidth).attr('height', document.getElementById(config.targetDIV).offsetWidth)
      d3.select('#sankeySVGbackdrop').attr('width', document.getElementById(config.targetDIV).offsetWidth).attr('height', document.getElementById(config.targetDIV).offsetWidth)
      d3.select('#' + config.targetDIV + '_buttonsSVG').attr('width', document.getElementById(config.targetDIV).offsetWidth)
    })

    function zoomed ({ transform }) {
      const initX = parseFloat(config.settings[0].initTransformX)
      const initY = parseFloat(config.settings[0].initTransformY)
      const initK = parseFloat(config.settings[0].initTransformK)
      var adjustedTransform = d3.zoomIdentity.translate(initX + transform.x, initY + transform.y).scale(initK * transform.k)
      d3.select('#sankeySVG').attr('transform', adjustedTransform)

      for (i = 0;i < helicopterMarkers.length;i++) {
        d3.select('#' + helicopterMarkers[i].id + '_group').attr('transform', 'scale(' + 1 / transform.k + ')')
      }
      currentK = 1 / transform.k
    }

    function initZoom () {
      d3.select('#sankeySVGPARENT').call(d3.zoom()
        .extent([[0, 0], [document.getElementById('sankeySVGPARENT').getAttribute('width').slice(0, -2), document.getElementById('sankeySVGPARENT').getAttribute('height').slice(0, -2)]])
        .scaleExtent([0.5, 8])
      // .on('zoom', zoomed) // TOOGLES ZOOM FUNCTIONALITY ON CANVAS ON AND OFF
      )
      const initX = parseFloat(config.settings[0].initTransformX)
      const initY = parseFloat(config.settings[0].initTransformY)
      const initK = parseFloat(config.settings[0].initTransformK)
      var initTransform = d3.zoomIdentity.translate(initX, initY).scale(initK)
      console.log(initTransform)

      d3.select('#sankeySVG').attr('transform', initTransform)
    }

    initZoom()

    d3.select('.sankey').select('.links').selectAll('.link').attr('id', function (d) {console.log(d)})

    // draw scenario buttons
    let spacing = 7
    let cumulativeXpos = 45

    scaleInit = config.settings[0].scaleInit

    function setScenario (scenario, type) {
      d3.selectAll('.buttonRect_' + config.targetDIV).attr('fill', '#fff')
      d3.selectAll('.buttonText_' + config.targetDIV).attr('fill', '#333')
      d3.select('#scenariobutton_' + scenario + '_rect').attr('fill', '#333')
      d3.select('#scenariobutton_' + scenario + '_text').attr('fill', '#fff')
      activeScenario = scenario
      console.log(config)

      if (type != 'soft') {tick()}
    }
    window.globalSetScenario = setScenario

    function updateActiveScenarioIndicator (scenario) {
      let conceptNotificatie = '. NB: Dit is een conceptversie, het diagram kan nog inconsistenties bevatten.'
      let scenarioTitles = {
        IP2024_KA_2025: 'Getoond: SSS',
        DUMMY_2050: 'Getoond: DUMMY - 2050'
      }
      d3.select('#huidigGetoond').html(scenarioTitles[config.scenarios[activeScenario].title])
    }

    // init
    setScenario(lookupScenarioID())
    updateActiveScenarioIndicator(activeScenario)

    // drawSankeyLegend(legend)
    function drawSankeyLegend () {
      let shiftY = config.settings[0].legendPositionTop
      let shiftX = config.settings[0].legendPositionLeft
      let box = 15
      let spacing = 35

      let legendEntries = []
      for (i = 0;i < legend.length;i++) {
        legendEntries.push({label: legend[i].id, color: legend[i].color, width: getTextWidth(legend[i].id, '13px', config.settings[0].font) + box + spacing})
      }

      let cumulativeWidth = 0
      for (i = 0; i < legendEntries.length; i++) {
        footerCanvas.append('rect').attr('x', cumulativeWidth + shiftX).attr('y', shiftY).attr('width', box).attr('height', box).attr('fill', legendEntries[i].color)
        footerCanvas.append('text').style('font-family', config.settings[0].fontFamily).attr('x', cumulativeWidth + shiftX + 25).attr('y', shiftY + box / 1.4).style('font-size', 12 + 'px').text(legendEntries[i].label).attr('fill', 'white')
        cumulativeWidth += legendEntries[i].width
      }
    }

    drawMenuBar()
    function drawMenuBar () {
      const years = ['2020', '2030', '2035', '2040', '2050']
      const buttonData = years.map((year, index) => ({
        year,
        x: 120 + index * 60,
        isSelected: () => currentZichtjaar === year
      }))

      const svg = d3.select('#sankeyContainer_header')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('id', 'sankeyMenuBarSVG')
        .style('background-color', '#E8F0F4')

      const canvasMenuBar = svg.append('g')

      // Zichtjaar label
      canvasMenuBar.append('text')
        .attr('fill', '#333')
        .style('font-weight', 500)
        .attr('x', 0)
        .attr('y', 0)
        .text('Zichtjaar')
        .style('text-anchor', 'end')
        .style('font-size', '16px')
        .attr('transform', 'translate(90, 30)')

      buttonData.forEach(({ year, x, isSelected }) => {
        // Append button rect
        canvasMenuBar.append('rect')
          .attr('id', `button_rect_zichtjaar_${year}`)
          .attr('width', 50)
          .attr('height', 35)
          .attr('fill', isSelected() ? '#444' : '#FFF')
          .attr('x', x)
          .attr('y', 7)
          .style('pointer-events', 'all')
          .style('stroke', '#333')
          .style('stroke-width', 0.5)
          .attr('rx', 17.5)
          .attr('ry', 17.5)
          .on('click', () => {
            currentZichtjaar = year
            setScenario(lookupScenarioID())
            buttonData.forEach(({ year }) => {
              d3.select(`#button_rect_zichtjaar_${year}`).attr('fill', currentZichtjaar === year ? '#444' : '#FFF')
              d3.select(`#button_text_zichtjaar_${year}`).attr('fill', currentZichtjaar === year ? '#FFF' : '#333')
            })
          })

        // Append button text
        canvasMenuBar.append('text')
          .attr('id', `button_text_zichtjaar_${year}`)
          .attr('fill', isSelected() ? '#FFF' : '#333')
          .style('font-size', '14px')
          .attr('x', x + 10)
          .attr('y', 30)
          .text(year)
      })

      drawWaterfallBackButton()
    }
  }
  let indicatorTimeOut
  function drawHelicopterMarkers (attributes) {
    let showDuration = 4000
    index = nodesGlobal.findIndex(item => item.id === attributes.id)
    attributes.value = Math.round(d3.select('#nodeindex_' + index).attr('height') / globalScaleInit)
    attributes.refX = nodesGlobal[index].x - 300
    attributes.refY = nodesGlobal[index].y - 1000
    helicopterMarkers.push(attributes)

    let icon = 'm480-123.807-252.769-252.77 20.384-21.538L465.346-180.5v-663.385h30.193V-180.5l216.846-218.115 21.269 22.038L480-123.807Z'

    sankeyCanvas.append('g').attr('id', attributes.id + '_group').attr('class', 'helicopterLabel')
    let group = d3.select('#' + attributes.id + '_group')

    let posx = 250 + attributes.refX
    let posy = 1100 + attributes.refY

    group.style('transform-origin', posx + 'px ' + posy + 'px')

    d3.select('#' + attributes.id + '_group').attr('transform', 'scale(' + currentK + ')')

    posx = 178 + attributes.refX
    posy = 1100 + attributes.refY

    let titleLabelWidth = getTextWidth(attributes.title, '60px', config.settings[0].font) * 0.96 + 60
    let valueLabelWidth = getTextWidth(attributes.value + ' PJ', '60px', config.settings[0].font) * 0.96 + 60
    group.append('path').attr('d', icon).attr('transform', 'translate(' + posx + ',' + posy + ')scale(0.15)')

    group.append('rect').attr('x', - titleLabelWidth + 260 + 10 + attributes.refX).attr('y', 850 + attributes.refY).attr('width', titleLabelWidth).attr('height', 95).attr('fill', 'white').style('opacity', 1)
    group.append('text').attr('x', 240 + attributes.refX).attr('y', 920 + attributes.refY).attr('fill', '#000').style('font-size', '60px').style('text-anchor', 'end').style('font-weight', '400').text(attributes.title)

    group.append('rect').attr('x', 270 + attributes.refX).attr('y', 850 + attributes.refY).attr('width', valueLabelWidth).attr('height', 95).attr('fill', '#333').style('opacity', 0.6)
    group.append('text').attr('x', 290 + attributes.refX).attr('y', 920 + attributes.refY).attr('fill', '#FFF').style('font-size', '60px').style('text-anchor', 'start').text(attributes.value + ' PJ')

    if (initScenarioSwitchFlag == 0) {
      clearTimeout(indicatorTimeOut)
      console.log(helicopterLabelsPreviousValues[attributes.id])

      posx = attributes.refX - titleLabelWidth - 110
      posy = 970 + attributes.refY
      // group.append('rect').attr('x', attributes.refX - titleLabelWidth + 50 - 95 - 40).attr('y', 850 + attributes.refY).attr('width', 95).attr('height', 95).attr('fill', '#333').style('opacity', 0.6).style('visibility', 'visible').attr('id', 'changeIndicator').transition().duration(showDuration).style('opacity', 0)
      let change = 0
      if (helicopterLabelsPreviousValues[attributes.id] < attributes.value) {
        // group.append('path').attr('d', up).attr('transform', 'translate(' + posx + ',' + posy + ')scale(0.15)').attr('fill', '#FFF').style('visibility', 'visible').attr('id', 'changeIndicator').transition().duration(showDuration).style('opacity', 0)
        let diff = attributes.value - helicopterLabelsPreviousValues[attributes.id]
        change = '+ ' + diff + ' PJ'
      }
      if (helicopterLabelsPreviousValues[attributes.id] > attributes.value) {
        // group.append('path').attr('d', down).attr('transform', 'translate(' + posx + ',' + posy + ')scale(0.15)').attr('fill', '#FFF').style('visibility', 'visible').attr('id', 'changeIndicator').transition().duration(showDuration).style('opacity', 0)
        // console.log()
        let diff = helicopterLabelsPreviousValues[attributes.id] - attributes.value
        change = '- ' + diff + ' PJ'
      }
      // group.append('rect').attr('x', attributes.refX).attr('y', 850 + attributes.refY + 90).attr('width', 250 * 0.8).attr('height', 95 * 0.8).attr('fill', 'black').style('opacity', 0.6).style('visibility', 'visible').attr('id', 'changeIndicator').transition().duration(showDuration).style('opacity', 0)
      group.append('text').attr('x', attributes.refX + 200).attr('y', 920 + attributes.refY + 90 + 40).attr('fill', '#000').style('font-size', '70px').style('text-anchor', 'end').text(change).style('visibility', 'visible').attr('id', 'changeIndicator').transition().duration(showDuration).style('opacity', 0)
      indicatorTimeOut = setTimeout(() => {
        d3.selectAll('#changeIndicator').remove()
      }, showDuration)
    }
    helicopterLabelsPreviousValues[attributes.id] = attributes.value
  }

  drawUnitSelector()
  function drawUnitSelector () {
    console.log('hello')
    d3.select('#sankeyContainer').append('div').attr('id', 'unitSelectorDiv').style('width', '200px').style('height', '35px').style('position', 'absolute').style('top', '70px').style('left', '10px').append('svg').attr('width', 200).attr('height', 35).attr('id', 'selectorButtonSVGSankey')
    let sCanvas = d3.select('#selectorButtonSVGSankey').append('g')
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
        if (currentUnit == 'PJ') {currentUnit = 'TWh'} else currentUnit = 'PJ'
        d3.selectAll('#selectorStatus').transition().duration(200).attr('cx', function () {if (currentUnit == 'PJ') { return 63} else return 87})
        globalSetScenario(lookupScenarioID()) // FIETS
        switchRoutekaart({
          scenario: currentScenario,
          sector: currentSector,
          routekaart: currentRoutekaart,
          yMax: currentYMax,
          titlesArray: currentTitlesArray,
          colorsArray: currentColorsArray
        })
        drawWaterfallBackButton()
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
  function updateSankey (json, offsetX, offsetY, fontSize, fontFamily) {
    try {
      var json = JSON.parse(json)
      d3.select('#error').text('')
    } catch (e) { d3.select('#error').text(e); return; }
    sankeyLayout.nodePosition(function (node) {
      return [node.x, node.y]
    })

    let duration = 500
    d3.select('#sankeySVG').datum(sankeyLayout.scale(scaleInit)(json)).transition().duration(duration).ease(d3.easeLinear).call(sankeyDiagram)
    d3.select('.sankey').attr('transform', 'translate(' + offsetX + ',' + offsetY + ')')
    d3.selectAll('.node-title').style('font-size', fontSize + 'tepx')
    d3.selectAll('.link').style('pointer-events', 'all')
    d3.selectAll('.node').style('pointer-events', 'all')
    d3.selectAll('.node-backdrop-title').style('pointer-events', 'none') // otherwise nodevalue text gets in the way of mouseclick 
    d3.selectAll('.node-click-target').style('fill', '#555').style('stroke-width', 0).attr('width', 10).attr('rx', 0).attr('ry', 0).attr('transform', 'translate(-4,0)scale(1.005)')
    // attach id's to link paths
    d3.select('.sankey').select('.links').selectAll('.link').select('path').attr('id', function (d, i) { return 'linkindex_' + d.index}).on('click', function () { drawBarGraph(sankeyData.links[this.id.slice(10)], config) })
    // attach id's to node rects
    d3.select('.sankey').select('.nodes').selectAll('.node').select('.node-click-target').attr('id', function (d, i) {return 'nodeindex_' + d.index}).on('click', function () { nodeVisualisatieSingular(config, sankeyData.nodes[this.id.slice(10)], sankeyData, config.scenarios, config.targetDIV) })

    setTimeout(() => {
      helicopterMarkers = []
      d3.selectAll('.helicopterLabel').remove()
      // drawHelicopterMarkers({id: 'node1', title: 'HERNIEUWBAAR',change: 30, color: '#1DE9B6'})
      if (initScenarioSwitchFlag > 0) { initScenarioSwitchFlag--}
    }, duration)
  }

  // INIT
  setTimeout(() => {
    // tick()
  }, 500)

  function tick () {
    console.log(sankeyData)
    for (i = 0; i < sankeyData.links.length; i++) {
      sankeyData.links[i].value = Math.round(sankeyData.links[i][config.scenarios[activeScenario].id])
    }
    console.log(config.settings)
    updateSankey(JSON.stringify(sankeyData), config.settings[0].offsetX, config.settings[0].offsetY, config.settings[0].fontSize, config.settings[0].font)
    d3.selectAll('.node-title').style('font-size', '11px')
  }

  function getColor (id, legend) {
    for (let i = 0; i < legend.length; i++) {
      if (legend[i].id === id) {
        return legend[i].color
      }
    }
    console.log('WARNING: DID NOT FIND MATCHING LEGEND ENTRY - "' + id + '"')
    return 'black'
  }

  function getTextWidth (text, fontSize, fontFamily, fontWeight) {
    // Create a temporary span element
    const span = document.createElement('span')
    // Set the span's font properties
    span.style.fontSize = fontSize
    span.style.fontFamily = fontFamily
    // Set the span's text content
    span.textContent = text
    // Add the span to the body to measure its width
    document.body.appendChild(span)
    // Get the width of the span
    const width = span.offsetWidth
    // Remove the span from the body
    document.body.removeChild(span)
    // Return the width
    return width
  }

  function readExcelFile (url, callback) {
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest()
    // Set up a callback for when the XMLHttpRequest finishes loading the file
    xhr.onload = () => {
      // Get the response data from the XMLHttpRequest
      const data = xhr.response
      // Create a new workbook object from the data
      const workbook = XLSX.read(data, {type: 'array'})
      // Define object variables for each sheet
      let links = {}
      let nodes = {}
      let legend = {}
      let settings = {}
      // Read the data from each sheet
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        switch (sheetName) {
          case 'links':
            links = XLSX.utils.sheet_to_json(worksheet)
            break
          case 'nodes':
            nodes = XLSX.utils.sheet_to_json(worksheet)
            break
          case 'legend':
            legend = XLSX.utils.sheet_to_json(worksheet)
            break
          case 'settings':
            settings = XLSX.utils.sheet_to_json(worksheet)
            break
          default:
            console.log(`Sheet '${sheetName}' ignored.`)
        }
      })
      // Call the callback function with the resulting objects
      callback(links, nodes, legend, settings)
    }
    // Set up the XMLHttpRequest to load the file from the specified URL
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    xhr.send()
  }
}

function drawBarGraph (data, config) {
  console.log(config, data)

  // Show popup blinder with transition
  d3.select('#popupBlinder')
    .style('visibility', 'visible')
    .style('opacity', 0)
    .transition().duration(300)
    .style('opacity', 0.3)
    .style('pointer-events', 'all')

  // Create and style the main popup container
  const popup = d3.select(`#${config.targetDIV}`)
    .append('div')
    .attr('id', 'nodeInfoPopup')
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('top', '40px')
    .style('left', '0px')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .append('div')
    .style('pointer-events', 'all')
    .attr('id', 'flowAnalysisPopup')
    .style('position', 'absolute')
    .style('box-shadow', '10px 20px 69px -15px rgba(0,0,0,0.75)')
    .style('margin', 'auto')
    .style('width', '1000px')
    .style('height', '500px')
    .style('background-color', 'rgba(255,255,255,1)')

  // Create and style the main SVG container
  const svg = popup.append('svg')
    .style('position', 'absolute')
    .style('width', '100%')
    .style('height', '100%')
    .attr('id', 'flowAnalysisSVG_main')

  const canvas = svg.append('g')

  // Add title text
  const sourceNode = nodesGlobal.find(item => item.id === data.source)
  const targetNode = nodesGlobal.find(item => item.id === data.target)
  canvas.append('text')
    .attr('x', 100)
    .attr('y', 50)
    .style('font-size', '16px')
    .style('font-weight', 800)
    .text(`Flow '${sourceNode.title} - ${targetNode.title}'`)

  // Add path and rectangle elements to the canvas
  canvas.append('path')
    .attr('d', 'M94.333 812.333 40 772.667 232 466l119.714 140 159.619-258.666 109 162.333q-18.333 1.667-35.166 6.167-16.834 4.5-33.5 11.166l-37.334-57-152.371 248.333-121.296-141-146.333 235ZM872.334 1016 741.333 885q-20.666 14.667-45.166 22.333-24.5 7.667-50.5 7.667-72.222 0-122.778-50.578-50.555-50.579-50.555-122.834t50.578-122.754q50.578-50.5 122.833-50.5T768.5 618.889Q819 669.445 819 741.667q0 26-8 50.5t-22 46.465l131 129.702L872.334 1016ZM645.573 848.334q44.76 0 75.761-30.907 31-30.906 31-75.666 0-44.761-30.907-75.761-30.906-31-75.666-31Q601 635 570 665.906q-31 30.906-31 75.667 0 44.76 30.906 75.761 30.906 31 75.667 31ZM724.666 523q-16.333-6.667-33.833-9.666-17.5-3-36.166-4.667l211-332.667L920 215.666 724.666 523Z')
    .attr('transform', 'translate(40,15)scale(0.035)')

  canvas.append('rect')
    .attr('x', 30)
    .attr('y', 60)
    .attr('width', 940)
    .attr('height', 410)
    .attr('fill', '#fff')

  // Add close button with interactions
  const closeButton = canvas.append('rect')
    .attr('x', 955)
    .attr('y', 15)
    .attr('width', 30)
    .attr('height', 30)
    .attr('fill', '#FFF')
    .style('pointer-events', 'all')
    .on('mouseover', () => d3.select(closeButton.node()).attr('fill', '#999'))
    .on('mouseout', () => d3.select(closeButton.node()).attr('fill', '#fff'))
    .on('click', () => {
      d3.select('#nodeInfoPopup').remove()
      d3.select('#popupBlinder')
        .style('visibility', 'hidden')
        .style('pointer-events', 'none')
    })

  canvas.append('path')
    .style('pointer-events', 'none')
    .attr('id', `${config.targetDIV}_closeButton`)
    .attr('d', 'm249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z')
    .attr('transform', 'translate(951,7)scale(0.04)')

  // Add scenario demarcation rectangles
  const demarcations = [
    { width: 90, height: 40, x: 144, y: 85, fill: '#888' },
    { width: 225, height: 40, x: 244, y: 85, fill: '#666' },
    { width: 230, height: 40, x: 475, y: 85, fill: '#666' },
    { width: 220, height: 40, x: 710, y: 85, fill: '#666' }
  ]

  demarcations.forEach(d => {
    canvas.append('rect')
      .attr('width', d.width)
      .attr('height', d.height)
      .attr('x', d.x)
      .attr('y', d.y)
      .attr('fill', d.fill)
  })

  // Add vertical rectangles representing scenario groups
  const rectsData = [
    { width: 90, height: 300, x: 144, y: 130, fill: '#eee',  text: 'Referentie'},
    { width: 225, height: 300, x: 244, y: 130, fill: '#eee', text: 'Scenario C' },
    { width: 230, height: 300, x: 475, y: 130, fill: '#eee', text: 'IP2024/II3050 - NAT' },
    { width: 220, height: 300, x: 710, y: 130, fill: '#eee', text: 'IP2024/II3050 - INT' }
  ]

  rectsData.forEach(d => {
    canvas.append('rect')
      .attr('width', d.width)
      .attr('height', d.height)
      .attr('x', d.x)
      .attr('y', d.y)
      .attr('fill', d.fill)
    canvas.append('text')
      .attr('x', d.x + 10)
      .attr('y', d.y - 20)
      .attr('fill', 'white')
      .style('font-size', '15px')
      .text(d.text)
  })

  // Chart dimensions and scales
  const margin = { top: 10, right: 30, bottom: 30, left: 60 }
  const height = 180
  const shiftX = 130
  let shiftXAdditional = 20
  const spacing = 50
  const width = 750 - 3 * spacing

  const scenarios = Object.entries(data).filter(([key]) => key.includes('scenario'))
  const x = d3.scaleBand()
    .range([0, width])
    .domain(scenarios.map(([key]) => key.substring(0, key.indexOf('_'))))
    .padding(0.1)

  const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(scenarios, ([, value]) => value)])

  // Add y-axis gridlines and limit tick marks to 5
  canvas.append('g')
    .call(d3.axisLeft(y).ticks(5).tickSize(-width - 210).tickFormat(''))
    .attr('transform', `translate(${shiftX}, 150)`)
    .selectAll('.tick line')
    .style('stroke', '#111')
    .style('stroke-width', 0.5)
    .style('opacity', 0.7)
    .style('stroke-dasharray', '4,4')
  // Draw bars
  canvas.selectAll('.bar')
    .data(scenarios)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('fill', d => config.legend.find(item => item.id === data.legend).color)
    .attr('x', d => x(d[0].substring(0, d[0].indexOf('_'))))
    .attr('y', d => y(d[1]))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d[1]))
    .attr('transform', (d, i) => {
      if ([1, 5, 9].includes(i)) {shiftXAdditional += spacing}
      return `translate(${shiftX + shiftXAdditional+14},150)`
    })

  // Add x-axis labels
  const varianten = ['2020', '2030', '2035', '2040', '2050', '2030', '2035', '2040', '2050', '2030', '2035', '2040', '2050']
  const posy = height + 165
  shiftXAdditional = 20

  scenarios.forEach((d, j) => {
    if ([1, 5, 9].includes(j)) shiftXAdditional += spacing - 4
    const posx = shiftX + shiftXAdditional + j * (47) + 43
    canvas.append('text')
      .style('text-anchor', 'end')
      .style('font-size', '15px')
      .attr('transform', `translate(${posx},${posy})rotate(-90)`)
      .text(varianten[j])
  })

  // Add y-axis with label
  canvas.append('g')
    .call(d3.axisLeft(y))
    .attr('transform', `translate(${shiftX}, 150)`)
    .selectAll('text')
    .style('font-size', '13px')

  canvas.append('text')
    .attr('transform', 'translate(50,260)rotate(-90)')
    .attr('dy', '1em')
    .style('font-size', '15px')
    .style('text-anchor', 'middle')
    .text('Energie (PJ/jaar)')

  d3.selectAll('.domain').remove() // remove domain lines ()
}

function lookupScenarioID () {
  let key = currentScenario + '_' + currentZichtjaar
  switch (key) {
    case 'c_2020':
      return 0
    case 'c_2030':
      return 1
    case 'c_2035':
      return 2
    case 'c_2040':
      return 3
    case 'c_2050':
      return 4
    case 'nat_2020':
      return 0
    case 'nat_2030':
      return 5
    case 'nat_2035':
      return 6
    case 'nat_2040':
      return 7
    case 'nat_2050':
      return 8
    case 'int_2020':
      return 0
    case 'int_2030':
      return 9
    case 'int_2035':
      return 10
    case 'int_2040':
      return 11
    case 'int_2050':
      return 12
    default:
      console.log('ERROR - unknown scenario')
      break
  }
}

function wrap (text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.8, // ems
      y = text.attr('y'),
      dy = parseFloat(text.attr('dy'))
    if (isNaN(dy)) {dy = 0}
    var tspan = text.text(null).append('tspan').attr('x', 10).attr('y', y).attr('dy', dy + 'em')
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text.append('tspan').attr('x', 10).attr('y', 0).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word) // changed x from 0 to 20 TIJS
      }
    }
  })
}

function drawWaterfallBackButton () {
  // Terug naar watervaldiagram knop
  let canvasOverlay = d3.select('#mainContainerOverlaySVG').append('g')
  canvasOverlay.append('rect')
    .attr('class', 'backToWaterfallButton')
    .attr('width', 260)
    .attr('height', 50)
    .attr('fill', '#FFF')
    .attr('x', 845)
    .attr('y', 27)
    .style('pointer-events', 'all')
    .style('stroke', '#333')
    .style('stroke-width', 0.5)
    .attr('rx', 25)
    .attr('ry', 25)
    .on('click', () => {
      // FIETS
      d3.select('#sankeyContainer').style('visibility', 'hidden')
      d3.select('#sankeyContainer_header').html('')
      d3.select('#sankeyContainer_main').html('')
      d3.selectAll('.backToWaterfallButton').remove()
      d3.select('#unitSelctorDiv').remove()
      currentZichtjaar = '2020'
      sankeyModeActive = false
    })
  canvasOverlay.append('path')
    .attr('class', 'backToWaterfallButton')
    .attr('d', 'm313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z')
    .attr('fill', '#555')
    .attr('transform', `translate(${860}, ${71}) rotate(0)scale(0.035)`)
  // Append button text
  canvasOverlay.append('text')
    .attr('class', 'backToWaterfallButton')
    // .attr('id', `button_text_zichtjaar_${year}`)
    .attr('fill', '#333')
    .style('font-size', '14px')
    .attr('x', 905)
    .attr('y', 58)
    .text('Terug naar watervaldiagram')
}
