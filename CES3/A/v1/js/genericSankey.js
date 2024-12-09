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
let globalCO2flowScale
let currentK = 1
let helicopterLabelsPreviousValues = {}
let initScenarioSwitchFlag = 2

let sankeyInitFlag = false

let globalActiveScenario = {}
let globalActiveYear = {}
let globalActiveWACC = {}

let links = {}
let nodes = {}
let legend = {}
let settings = {}
let remarks = {}

function initSankey (config) {
  switch (config.mode) {
    case 'xlsx':
      process_xlsx(config)
      break
    case 'xlsx_file':
      process_object(config)
      break
    default:
      console.log('WARNING - unknown plot mode')
      break
  }

  function process_xlsx (config) {
    if (dataSource == 'url') {
      d3.select('#loadFileDialog').style('visibility', 'hidden').style('pointer-events', 'none')
      d3.selectAll('.buttonTitles').style('visibility', 'visible')
      readExcelFile(config.xlsxURL, (links, nodes, legend, settings, remarks) => {
        console.log('Links:', links)
        console.log('Nodes:', nodes)
        console.log('Legend:', legend)
        console.log('Settings:', settings)
        console.log('Remarks:', remarks)

        nodesGlobal = nodes

        settings = transformData(settings)

        console.log(settings)

        if (settings[0].projectID != projectID || settings[0].versionID != versionID) {
          return
          console.log('ERROR')
        }

        function transformData (inputArray) { // this function converts the new input format for the settings tab to the old input format the rest of the code expects
          const output = {}

          inputArray.forEach(item => {
            const key = item.setting; // Get the key from "horizontalMargin"
            const value = item.waarde; // Get the value from "0"
            output[key] = value // Assign to the output object
          })
          // Wrap the resulting object in an array to match the desired structure
          return [output]
        }

        config.settings = settings
        config.legend = legend

        globalScaleInit = settings[0].scaleInit
        globalCO2flowScale = settings[0].scaleDataValueCO2flow

        sankeyData = {links: [],nodes: [],order: []}

        let scaleValues = settings[0].scaleDataValue
        let scaleValues_co2flow = settings[0].scaleDataValueCO2flow
        for (i = 0;i < links.length;i++) {
          let co2flow = false
          if (links[i].legend == 'co2flow') {co2flow = true}
          Object.keys(links[i]).forEach(key => {
            if (typeof links[i][key] == 'number') {
              if (co2flow) {
                links[i][key] = links[i][key] / scaleValues_co2flow
              }else { links[i][key] = links[i][key] / scaleValues}
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
          sankeyData.nodes.push({remark: remarks[i],title: nodes[i].title, id: nodes[i].id, direction: nodes[i].direction, index: i, dummy: nodes[i].dummy, x: nodes[i].x, y: nodes[i].y})
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
          sankeyData.links.push({remark: remarks[i], index: i, source: links[i]['source.id'], target: links[i]['target.id'], color: getColor(links[i]['legend'], legend), value: links[i].value, type: links[i].type, legend: links[i]['legend']})
          scenarios.forEach(element => {
            sankeyData.links[i][element.id] = links[i][element.id]
          })
        }

        adaptTotalHeight = config.settings[0].adaptTotalHeight

        let width = document.getElementById(config.targetDIV).offsetWidth
        let height = document.getElementById(config.targetDIV).offsetHeight

        sankeyLayout = d3.sankey().extent([[settings[0].horizontalMargin, settings[0].verticalMargin], [width - settings[0].horizontalMargin, height - settings[0].verticalMargin]])
        sankeyDiagram = d3.sankeyDiagram().nodeTitle(function (d) { return d.title }).linkColor(function (d) { return d.color }) // return d.title || d.id

        drawSankey(sankeyData)
      })
    }
    else if (dataSource == 'file') {
      console.log('FILE')
      d3.select('#loadFileDialog').style('visibility', 'visible').style('pointer-events', 'auto')
      // Get the container div with id "loadFileDialog"
      const loadFileDialog = document.getElementById('loadFileDialog')

      // Create the file input element
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.xlsx' // Restrict file type to Excel files

      // Append the file input element to the "loadFileDialog" div
      if (loadFileDialog) {
        loadFileDialog.appendChild(fileInput)
      } else {
        console.error('Element with id not found.')
      }

      // Listen for file selection
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0] // Get the selected file
        if (!file) {
          console.error('No file selected!')
          return
        }

        // Create a FileReader to read the file
        const reader = new FileReader()

        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result) // Read the file as a binary array
          const workbook = XLSX.read(data, { type: 'array' }) // Parse the Excel file

          // Extract data from sheets
          links = {}
          nodes = {}
          legend = {}
          settings = {}
          remarks = {}

          workbook.SheetNames.forEach((sheetName) => {
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
              case 'remarks':
                remarks = XLSX.utils.sheet_to_json(worksheet)
                break
              default:
                console.log(`Sheet '${sheetName}' ignored.`)
            }
          })

          // Pass the parsed data to your existing callback logic
          console.log(settings)

          settings = transformData(settings)

          console.log(settings)

          if (settings[0].projectID != projectID || settings[0].versionID != versionID || settings[0].productID != productID) {
            console.log('ERROR - ID MISMATCH')
            const loadFileDialog = document.getElementById('loadFileDialog')
            // Set the inner HTML with the desired text and link
            document.getElementById('loadFileDialog').innerHTML = `
                <div style="max-width: 500px; word-wrap: break-word;line-height: 35px;font-size:15px; ">
                    <strong style="line-height: 40px; font-size:28px;font-weight:300;">Error</strong> <br><br>De identificatienummers van het opgegeven databestand (<strong>${settings[0].projectID}_${settings[0].productID}_${settings[0].versionID}</strong>) en het ingeladen visualisatiescript (<strong>${projectID}_${productID}_${versionID}</strong>) komen niet overeen.<br><br>Gebruik de onderstaande link om naar het script te gaan dat bij het opgegeven bestand hoort en probeer het opnieuw.&nbsp
                    <br><br>
                    <a href="https://rvo-nl.github.io/visualisaties/${settings[0].projectID}/${settings[0].productID}/${settings[0].versionID}" style="color: blue; text-decoration: underline;">
                        https://rvo-nl.github.io/visualisaties/${settings[0].projectID}/${settings[0].productID}/${settings[0].versionID}
                    </a>
                </div>
            `

            return
          }

          d3.select('#loadFileDialog').style('visibility', 'hidden').style('pointer-events', 'none')
          d3.selectAll('.buttonTitles').style('visibility', 'visible')

          function transformData (inputArray) { // this function converts the new input format for the settings tab to the old input format the rest of the code expects
            const output = {}

            inputArray.forEach(item => {
              const key = item.setting; // Get the key from "horizontalMargin"
              const value = item.waarde; // Get the value from "0"
              output[key] = value // Assign to the output object
            })
            // Wrap the resulting object in an array to match the desired structure
            return [output]
          }

          processData(links, nodes, legend, settings, remarks)
        }

        reader.readAsArrayBuffer(file) // Read the file as a binary array
      })

      // Callback logic for processing the data
      function processData (links, nodes, legend, settings, remarks) {
        console.log('Links:', links)
        console.log('Nodes:', nodes)
        console.log('Legend:', legend)
        console.log('Settings:', settings)
        console.log('Remarks:', remarks)

        nodesGlobal = nodes

        config.settings = settings
        config.legend = legend

        globalScaleInit = settings[0].scaleInit
        globalCO2flowScale = settings[0].scaleDataValueCO2flow

        sankeyData = {links: [],nodes: [],order: []}

        let scaleValues = settings[0].scaleDataValue
        let scaleValues_co2flow = settings[0].scaleDataValueCO2flow
        for (i = 0;i < links.length;i++) {
          let co2flow = false
          if (links[i].legend == 'co2flow') {co2flow = true}
          Object.keys(links[i]).forEach(key => {
            if (typeof links[i][key] == 'number') {
              if (co2flow) {
                links[i][key] = links[i][key] / scaleValues_co2flow
              }else { links[i][key] = links[i][key] / scaleValues}
            }
          })
        }

        let maxColumn = 0

        // Generate order object
        nodes.forEach((element) => {
          if (element.column > maxColumn) {
            maxColumn = element.column
          }
        })

        const columnLength = maxColumn + 1
        for (let i = 0; i < columnLength; i++) {
          sankeyData.order.push([[]])
        }
        for (let i = 0; i < nodes.length; i++) {
          for (let j = 0; j < sankeyData.order.length; j++) {
            if (nodes[i].column === j) {
              if (sankeyData.order[j].length === 0) {
                sankeyData.order[j].push([])
              }
              for (let k = 0; k < nodes[i].cluster; k++) {
                if (!sankeyData.order[j].includes(k)) {
                  sankeyData.order[j].push([])
                }
              }
              if (
                sankeyData.order[j][nodes[i].cluster].length === 0
              ) {
                sankeyData.order[j][nodes[i].cluster].push([])
              }
              for (let k = 0; k < nodes[i].row; k++) {
                if (!sankeyData.order[j][nodes[i].cluster].includes(k)) {
                  sankeyData.order[j][nodes[i].cluster].push([])
                }
              }
              sankeyData.order[j][nodes[i].cluster][nodes[i].row].push(
                nodes[i].id
              )
            }
          }
        }

        // Generate nodes object
        for (let i = 0; i < nodes.length; i++) {
          sankeyData.nodes.push({
            remark: remarks[i],
            title: nodes[i].title,
            id: nodes[i].id,
            direction: nodes[i].direction,
            index: i,
            dummy: nodes[i].dummy,
            x: nodes[i].x,
            y: nodes[i].y
          })
        }

        // Generate scenario object
        const scenarios = []
        let counter = 0
        for (let s = 0; s < Object.keys(links[0]).length; s++) {
          if (Object.keys(links[0])[s].includes('scenario')) {
            if (counter < 10) {
              scenarios.push({
                title: Object.keys(links[0])[s].slice(10),
                id: Object.keys(links[0])[s]
              })
            } else {
              scenarios.push({
                title: Object.keys(links[0])[s].slice(11),
                id: Object.keys(links[0])[s]
              })
            }
            counter++
          }
        }

        config.scenarios = scenarios

        // Generate links object
        for (let i = 0; i < links.length; i++) {
          sankeyData.links.push({
            remark: remarks[i],
            index: i,
            source: links[i]['source.id'],
            target: links[i]['target.id'],
            color: getColor(links[i]['legend'], legend),
            value: links[i].value,
            type: links[i].type,
            legend: links[i]['legend']
          })
          scenarios.forEach((element) => {
            sankeyData.links[i][element.id] = links[i][element.id]
          })
        }

        adaptTotalHeight = config.settings[0].adaptTotalHeight

        const width = document.getElementById(config.targetDIV).offsetWidth
        const height = document.getElementById(config.targetDIV).offsetHeight

        sankeyLayout = d3.sankey().extent([
          [settings[0].horizontalMargin, settings[0].verticalMargin],
          [width - settings[0].horizontalMargin, height - settings[0].verticalMargin]
        ])
        sankeyDiagram = d3
          .sankeyDiagram()
          .nodeTitle((d) => d.title)
          .linkColor((d) => d.color)

        drawSankey(sankeyData)
      }
    }
  }

  function process_object (config) {
    sankeyData = config.sankeyData
    sankeyLayout = d3.sankey().extent([[config.margins.horizontal, config.margins.vertical], [width - config.margins.horizontal, height - config.margins.vertical]])
    sankeyDiagram = d3.sankeyDiagram().nodeTitle(function (d) { return d.title }).linkColor(function (d) { return d.color }) // return d.title || d.id

    drawSankey(sankeyData)
  }
  fileLoadButton()
  function fileLoadButton () {
    let config = {
      mode: 'xlsx',
      // xlsxURL: sankeyXLSXurl,
      targetDIV: 'sankeyContainer_main',
      margins: {vertical: 0,horizontal: 200},
      sankeyData: null,
      legend: null,
      settings: null
    }

    console.log('FILE')
    d3.select('#downloadUploadFile').style('visibility', 'visible').style('pointer-events', 'auto')
    // Get the container div with id "loadFileDialog"
    const loadFileDialog = document.getElementById('downloadUploadFile')

    // Create the file input element (Upload functionality)
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.xlsx' // Restrict file type to Excel files
    fileInput.style.display = 'none' // Hide the file input element

    const uploadButton = document.createElement('button')
    uploadButton.textContent = 'Importeer aangepast bronbestand' // Set the button text
    uploadButton.addEventListener('click', () => {
      fileInput.click() // Programmatically trigger the file input click event
    })
    fileInput.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0]
      if (selectedFile) {
        console.log(`Selected file: ${selectedFile.name}`)
      // Handle the selected file here
      }
    })

    // Create the download button
    const downloadButton = document.createElement('button')
    downloadButton.textContent = 'Download bronbestand' // Set the button text
    downloadButton.id = 'downloadButton'
    downloadButton.addEventListener('click', () => {
      const fileUrl = 'data/CES3Overview_a_v1_06122024.xlsx' // Replace with your file URL
      const anchor = document.createElement('a')
      anchor.href = fileUrl
      anchor.download = 'CES3Overview_a_v1_06122024.xlsx' // Replace with the desired filename
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    })

    // Append the buttons and file input to the "loadFileDialog" div
    if (loadFileDialog) {
      loadFileDialog.appendChild(uploadButton)
      loadFileDialog.appendChild(fileInput) // Keep the input for file selection
      loadFileDialog.appendChild(downloadButton) // Add the download button
    } else {
      console.error('Element with id not found.')
    }

    // Add change event listener to handle the file selection
    fileInput.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0]
      if (selectedFile) {
        console.log(`Selected file: ${selectedFile.name}`)
      // Handle the selected file here
      }
    })

    // Append the button and file input to the "loadFileDialog" div
    if (loadFileDialog) {
      loadFileDialog.appendChild(uploadButton)
      loadFileDialog.appendChild(fileInput) // Keep the input for file selection
    } else {
      console.error('Element with id not found.')
    }

    // Listen for file selection
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0] // Get the selected file
      if (!file) {
        console.error('No file selected!')
        return
      }

      // Create a FileReader to read the file
      const reader = new FileReader()

      reader.onload = (e) => {
        d3.select('#sankeyContainer_main').html('')
        d3.select('#downloadButton').remove()
        sankeyData = {links: [],nodes: [],order: []}

        const data = new Uint8Array(e.target.result) // Read the file as a binary array
        const workbook = XLSX.read(data, { type: 'array' }) // Parse the Excel file

        // Extract data from sheets
        links = {}
        nodes = {}
        legend = {}
        settings = {}
        remarks = {}

        workbook.SheetNames.forEach((sheetName) => {
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
            case 'remarks':
              remarks = XLSX.utils.sheet_to_json(worksheet)
              break
            default:
              console.log(`Sheet '${sheetName}' ignored.`)
          }
        })

        // Pass the parsed data to your existing callback logic
        console.log(settings)

        settings = transformData(settings)

        console.log(settings)

        if (settings[0].projectID != projectID || settings[0].versionID != versionID || settings[0].productID != productID) {
          console.log('ERROR - ID MISMATCH')
          const loadFileDialog = document.getElementById('loadFileDialog')
          // Set the inner HTML with the desired text and link
          document.getElementById('loadFileDialog').innerHTML = `
                  <div style="max-width: 500px; word-wrap: break-word;line-height: 35px;font-size:15px; ">
                      <strong style="line-height: 40px; font-size:28px;font-weight:300;">Error</strong> <br><br>De identificatienummers van het opgegeven databestand (<strong>${settings[0].projectID}_${settings[0].productID}_${settings[0].versionID}</strong>) en het ingeladen visualisatiescript (<strong>${projectID}_${productID}_${versionID}</strong>) komen niet overeen.<br><br>Gebruik de onderstaande link om naar het script te gaan dat bij het opgegeven bestand hoort en probeer het opnieuw.&nbsp
                      <br><br>
                      <a href="https://rvo-nl.github.io/visualisaties/${settings[0].projectID}/${settings[0].productID}/${settings[0].versionID}" style="color: blue; text-decoration: underline;">
                          https://rvo-nl.github.io/visualisaties/${settings[0].projectID}/${settings[0].productID}/${settings[0].versionID}
                      </a>
                  </div>
              `

          return
        }

        d3.select('#loadFileDialog').style('visibility', 'hidden').style('pointer-events', 'none')
        d3.selectAll('.buttonTitles').style('visibility', 'visible')

        function transformData (inputArray) { // this function converts the new input format for the settings tab to the old input format the rest of the code expects
          const output = {}

          inputArray.forEach(item => {
            const key = item.setting; // Get the key from "horizontalMargin"
            const value = item.waarde; // Get the value from "0"
            output[key] = value // Assign to the output object
          })
          // Wrap the resulting object in an array to match the desired structure
          return [output]
        }

        processData(links, nodes, legend, settings, remarks)
      }

      reader.readAsArrayBuffer(file) // Read the file as a binary array
    })

    // Callback logic for processing the data
    function processData (links, nodes, legend, settings, remarks) {
      console.log('Links:', links)
      console.log('Nodes:', nodes)
      console.log('Legend:', legend)
      console.log('Settings:', settings)
      console.log('Remarks:', remarks)

      nodesGlobal = nodes

      config.settings = settings
      config.legend = legend

      globalScaleInit = settings[0].scaleInit
      globalCO2flowScale = settings[0].scaleDataValueCO2flow

      newData = {links: [],nodes: [],order: []}

      let scaleValues = settings[0].scaleDataValue
      let scaleValues_co2flow = settings[0].scaleDataValueCO2flow
      for (i = 0;i < links.length;i++) {
        let co2flow = false
        if (links[i].legend == 'co2flow') {co2flow = true}
        Object.keys(links[i]).forEach(key => {
          if (typeof links[i][key] == 'number') {
            if (co2flow) {
              links[i][key] = links[i][key] / scaleValues_co2flow
            }else { links[i][key] = links[i][key] / scaleValues}
          }
        })
      }

      let maxColumn = 0

      // Generate order object
      nodes.forEach((element) => {
        if (element.column > maxColumn) {
          maxColumn = element.column
        }
      })

      const columnLength = maxColumn + 1
      for (let i = 0; i < columnLength; i++) {
        newData.order.push([[]])
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < sankeyData.order.length; j++) {
          if (nodes[i].column === j) {
            if (newData.order[j].length === 0) {
              newData.order[j].push([])
            }
            for (let k = 0; k < nodes[i].cluster; k++) {
              if (!newData.order[j].includes(k)) {
                newData.order[j].push([])
              }
            }
            if (
              newData.order[j][nodes[i].cluster].length === 0
            ) {
              newData.order[j][nodes[i].cluster].push([])
            }
            for (let k = 0; k < nodes[i].row; k++) {
              if (!newData.order[j][nodes[i].cluster].includes(k)) {
                newData.order[j][nodes[i].cluster].push([])
              }
            }
            newData.order[j][nodes[i].cluster][nodes[i].row].push(
              nodes[i].id
            )
          }
        }
      }

      // Generate nodes object
      for (let i = 0; i < nodes.length; i++) {
        newData.nodes.push({
          remark: remarks[i],
          title: nodes[i].title,
          id: nodes[i].id,
          direction: nodes[i].direction,
          index: i,
          dummy: nodes[i].dummy,
          x: nodes[i].x,
          y: nodes[i].y
        })
      }

      // Generate scenario object
      const scenarios = []
      let counter = 0
      for (let s = 0; s < Object.keys(links[0]).length; s++) {
        if (Object.keys(links[0])[s].includes('scenario')) {
          if (counter < 10) {
            scenarios.push({
              title: Object.keys(links[0])[s].slice(10),
              id: Object.keys(links[0])[s]
            })
          } else {
            scenarios.push({
              title: Object.keys(links[0])[s].slice(11),
              id: Object.keys(links[0])[s]
            })
          }
          counter++
        }
      }

      config.scenarios = scenarios

      // Generate links object
      for (let i = 0; i < links.length; i++) {
        newData.links.push({
          remark: remarks[i],
          index: i,
          source: links[i]['source.id'],
          target: links[i]['target.id'],
          color: getColor(links[i]['legend'], legend),
          value: links[i].value,
          type: links[i].type,
          legend: links[i]['legend']
        })
        scenarios.forEach((element) => {
          newData.links[i][element.id] = links[i][element.id]
        })
      }

      adaptTotalHeight = config.settings[0].adaptTotalHeight

      const width = document.getElementById(config.targetDIV).offsetWidth
      const height = document.getElementById(config.targetDIV).offsetHeight

      sankeyLayout = d3.sankey().extent([
        [settings[0].horizontalMargin, settings[0].verticalMargin],
        [width - settings[0].horizontalMargin, height - settings[0].verticalMargin]
      ])
      sankeyDiagram = d3
        .sankeyDiagram()
        .nodeTitle((d) => d.title)
        .linkColor((d) => d.color)

      // console.log(newData)
        // drawSankey(newData)

      drawSankey(newData)
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
  }

  function drawSankey (sankeyDataInput) {
    console.log(sankeyDataInput)
    sankeyData = sankeyDataInput
    d3.select('#sankeySVG').remove()
    // sankeyData = {}
    // koekje
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
    d3.select('#content').append('svg').style('position', 'absolute').attr('id', 'sankeySVGPARENT').attr('width', scrollExtentWidth + 'px').attr('height', scrollExtentHeight + 'px').style('pointer-events', 'none').append('g').attr('id', 'sankeySVG').style('pointer-events', 'auto') // scrollExtentWidth

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

    // sankeyCanvas.append('rect').attr('width', scrollExtentWidth).attr('height', scrollExtentHeight).attr('fill', '#ddd').style('opacity', 0.001)
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
      // DISABLE/ENABLE ZOOM FUNCTIONALITY HERE
      // d3.select('#sankeySVGPARENT').call(d3.zoom()
      //   .extent([[0, 0], [document.getElementById('sankeySVGPARENT').getAttribute('width').slice(0, -2), document.getElementById('sankeySVGPARENT').getAttribute('height').slice(0, -2)]])
      //   .scaleExtent([0.5, 8])
      //   .on('zoom', zoomed) // TOOGLES ZOOM FUNCTIONALITY ON CANVAS ON AND OFF
      // )
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

    // setTimeout(() => {
    //   // tick()
    //   setScenario(14)
    // }, 3000)

    // setInterval(() => {
    //   setScenario(1)
    // }, 2500)

    // setInterval(() => {
    //   setScenario(0)
    // }, 5000)

    let scenarioIdLookup = {
      // WACC_standaard: {
      alle: {
        2021: 0,
        2035: 1
      },
      rotterdam_moerdijk: {
        2021: 2,
        2035: 3
      },
      zeeland: {
        2021: 4,
        2035: 5
      },
      // },
      // WACC_hoger: {
      noordzeekanaalgebied: {
        2021: 6,
        2035: 7
      },
      noordnederland: {
        2021: 8,
        2035: 9
      },
    // }
    }
    // SET DEFAULTS
    globalActiveScenario.id = 'alle'
    globalActiveYear.id = '2021'
    // globalActiveWACC.id = 'WACC_standaard'

    console.log(scenarioIdLookup)

    function setScenario (scenario, type) {

      // d3.select('#remarksContainer').html('')
      // d3.selectAll('.buttonRect_' + config.targetDIV).attr('fill', '#fff')
      // d3.selectAll('.buttonText_' + config.targetDIV).attr('fill', '#333')
      // d3.select('#scenariobutton_' + scenario + '_rect').attr('fill', '#333')
      // d3.select('#scenariobutton_' + scenario + '_text').attr('fill', '#fff')
      activeScenario = scenario

      activeScenario = scenarioIdLookup[globalActiveScenario.id][globalActiveYear.id]
      currentScenarioID = activeScenario // neaten
      console.log(config)
      drawRemarks()
      if (type != 'soft') {tick()}
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
        {id: 'alle', title: 'Totaal vier clusters (exclusief Chemelot)'},
        {id: 'rotterdam_moerdijk', title: 'Rotterdam-Moerdijk'},
        {id: 'zeeland', title: 'Zeeland'},
        {id: 'noordzeekanaalgebied', title: 'Noordzeekanaalgebied'},
        {id: 'noordnederland', title: 'Noord Nederland'}

      ]

      let container = document.getElementById('scenarioButtons')

      // Clear existing content in case the function is called multiple times
      container.innerHTML = ''

      scenarios.forEach((scenario, index) => {
        let button = document.createElement('button')
        button.textContent = scenario.title

        // Apply CSS to style the button
        button.style.display = 'inline-block'
        // button.style.margin = '5px'
        button.style.padding = '5px 10px'
        button.style.cursor = 'pointer'
        button.style.whiteSpace = 'nowrap'
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
        {id: '2021', title: '2021'},
        {id: '2035', title: '2035'}
      ]

      let container = document.getElementById('yearButtons')

      // Clear existing content in case the function is called multiple times
      container.innerHTML = ''

      years.forEach((year, index) => {
        let button = document.createElement('button')
        button.textContent = year.title

        // Apply CSS to style the button
        button.style.display = 'inline-block'
        button.style.padding = '5px 10px'
        button.style.cursor = 'pointer'
        button.style.whiteSpace = 'nowrap'
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

          console.log('Selected scenario:', year)
          globalActiveYear = year
          setScenario()
        }

        container.appendChild(button)
      })
    }

    // drawWACCButtons()
    // function drawWACCButtons () {
    //   let waccs = [
    //     {id: 'WACC_standaard', title: 'Standaard (2.25%)'},
    //     {id: 'WACC_hoger', title: 'Verhoogd (4% - 8%)'}
    //   ]

    //   let container = document.getElementById('waccButtons')

    //   // Clear existing content in case the function is called multiple times
    //   container.innerHTML = ''

    //   waccs.forEach((wacc, index) => {
    //     let button = document.createElement('button')
    //     button.textContent = wacc.title

    //     // Apply CSS to style the button
    //     button.style.display = 'inline-block'
    //     button.style.padding = '5px 10px'
    //     button.style.cursor = 'pointer'
    //     button.style.whiteSpace = 'nowrap'
    //     // button.style.fontSize = '13px'

    //     // Highlight the first button by default
    //     if (index === 0) {
    //       button.classList.add('highlighted')
    //     }

    //     button.onclick = function () {
    //       // Remove 'highlighted' class from all buttons
    //       let buttons = container.getElementsByTagName('button')
    //       for (let i = 0; i < buttons.length; i++) {
    //         buttons[i].classList.remove('highlighted')
    //       }
    //       // Add 'highlighted' class to the clicked button
    //       button.classList.add('highlighted')

    //       console.log('Selected scenario:', wacc)
    //       globalActiveWACC = wacc
    //       setScenario()
    //     }

    //     container.appendChild(button)
    //   })
    // }

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

    // drawMenuBar() // DRAWMENUBAR IS DISABLED
    // disable 2030, 2040 & 2050
    d3.select('#button_rect_zichtjaar_2030').attr('fill', '#ddd').on('click', function () {})
    d3.select('#button_rect_zichtjaar_2040').attr('fill', '#ddd').on('click', function () {})
    d3.select('#button_rect_zichtjaar_2050').attr('fill', '#ddd').on('click', function () {})

    setTimeout(() => {
      drawHeader()
    }, 200)

    function drawHeader () {
      const svg = d3.select('#mainContainerHeader')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('id', 'sankeyHeaderSVG')
        .style('background-color', '#E8F0F4')

      const canvasHeader = svg.append('g')

      // Select the specific div by its ID
      const containerDiv = document.getElementById('main')
      const carbonDiv = document.getElementById('tempCO2Overview')

      const titleDiv = document.createElement('div')
      const introDiv = document.createElement('div')
      const versionDiv = document.createElement('div')
      const exDiv = document.createElement('div')
      const co2Div = document.createElement('div')
      const co2Div_2 = document.createElement('div')
      const blackDiv = document.createElement('div')
      const redDiv = document.createElement('div')

      // Add text content to the new div
      titleDiv.innerText = config.settings[0].title
      titleDiv.style.width = '900px' // Set the width of the div
      titleDiv.style.position = 'absolute' // Position it absolutely
      titleDiv.style.top = '100px' // Distance from the top of the container
      titleDiv.style.left = '70px' // Distance from the left of the container
      titleDiv.style.padding = '10px' // Add padding inside the div
      titleDiv.style.fontSize = '23px'
      titleDiv.style.fill = '#222'
      titleDiv.style.fontWeight = '400'
      containerDiv.appendChild(titleDiv)

      // Add text content to the new div
      versionDiv.innerText = config.settings[0].dataVersion
      versionDiv.style.width = '150px' // Set the width of the div
      versionDiv.style.position = 'absolute' // Position it absolutely
      versionDiv.style.top = '100px' // Distance from the top of the container
      versionDiv.style.left = '800px' // Distance from the left of the container
      versionDiv.style.padding = '10px' // Add padding inside the div
      versionDiv.style.fontSize = '14px'
      versionDiv.style.fill = '#222'
      versionDiv.style.fontWeight = '400'
      containerDiv.appendChild(versionDiv)

      // Add text content to the new div
      // exDiv.innerText = 'PJ'
      // exDiv.style.width = '900px' // Set the width of the div
      // exDiv.style.position = 'absolute' // Position it absolutely
      // exDiv.style.top = '50px' // Distance from the top of the container
      // exDiv.style.left = '70px' // Distance from the left of the container
      // exDiv.style.padding = '10px' // Add padding inside the div
      // exDiv.style.fontSize = '14px'
      // exDiv.style.fill = '#222'
      // exDiv.style.fontWeight = '300'
      // containerDiv.appendChild(exDiv)

      introDiv.innerHTML = 'Dit diagram toont de plannen voor energie-import, conversie en gebruik, evenals de bijbehorende CO₂-stromen in de clusters Rotterdam-Moerdijk, Zeeland, het Noordzeekanaalgebied en Noord-Nederland. De gegevens zijn gebaseerd op CES 3.0-documenten, aangevuld met schattingen voor restgassen, fossiele waterstofproductie en CO₂-emissies en afvang. De diagrammen tonen uitsluitend energieverbruik en CO₂-stromen, met de focus op fossiele CO₂. Biogene CO₂-emissies, afvang en opslag worden later toegevoegd. De huidige scope omvat alleen de industrie, inclusief waterstofproductie; elektriciteitscentrales en de clusters Chemelot en cluster 6 volgen in een later stadium. <br><br><br><br><br><br><br><br><br><br><br> Voor dit diagram is uitsluitend gebruik gemaakt van openbare gegevens.'
      introDiv.style.width = '750px' // Set the width of the div
      introDiv.style.position = 'absolute' // Position it absolutely
      introDiv.style.top = '160px' // Distance from the top of the container
      introDiv.style.left = '70px' // Distance from the left of the container
      introDiv.style.padding = '10px' // Add padding inside the div
      introDiv.style.fontSize = '14px'
      introDiv.style.fill = '#222'
      introDiv.style.fontWeight = '300'
      introDiv.style.lineHeight = '28px'
      containerDiv.appendChild(introDiv)

      blackDiv.innerHTML = 'Gegevens op onderdelen met een zwart label zijn 1:1 overgenomen uit de CES. Klik op de zwarte labels voor bronvermelding.'
      blackDiv.style.width = '550px' // Set the width of the div
      blackDiv.style.position = 'absolute' // Position it absolutely
      blackDiv.style.top = '370px' // Distance from the top of the container
      blackDiv.style.left = '200px' // Distance from the left of the container
      blackDiv.style.padding = '10px' // Add padding inside the div
      blackDiv.style.fontSize = '14px'
      blackDiv.style.fill = '#222'
      blackDiv.style.fontWeight = '300'
      blackDiv.style.lineHeight = '28px'
      containerDiv.appendChild(blackDiv)

      redDiv.innerHTML = 'Onderdelen met rode labels duiden op een gebrek aan informatie uit de CES. Op deze onderdelen zijn aannames, schattingen of berekeningen toegepast. Klik op de rode labels voor toelichting. De gebruikte cijfers voor deze onderdelen dienen te worden geverifieerd en mogen niet zonder meer worden overgenomen.'
      redDiv.style.width = '550px' // Set the width of the div
      redDiv.style.position = 'absolute' // Position it absolutely
      redDiv.style.top = '460px' // Distance from the top of the container
      redDiv.style.left = '200px' // Distance from the left of the container
      redDiv.style.padding = '10px' // Add padding inside the div
      redDiv.style.fontSize = '14px'
      redDiv.style.fill = '#222'
      redDiv.style.fontWeight = '300'
      redDiv.style.lineHeight = '28px'
      containerDiv.appendChild(redDiv)
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

  drawUnitSelector() // DRAW UNIT SELECTOR IS DISABLED
  function drawUnitSelector () {
    d3.select('#buttonsContainer').append('div').attr('id', 'unitSelectorDiv').style('width', '200px').style('height', '35px').style('position', 'absolute').style('top', '130px').style('right', '0px').append('svg').attr('width', 200).attr('height', 35).attr('id', 'selectorButtonSVGSankey').attr('transform', 'scale(0.8)')
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
      .style('pointer-events', 'auto')
      .on('click', function () {
        if (currentUnit == 'PJ') {currentUnit = 'TWh'} else currentUnit = 'PJ'
        d3.selectAll('#selectorStatus').transition().duration(200).attr('cx', function () {if (currentUnit == 'PJ') { return 63} else return 87})
        setScenario(lookupScenarioID()) // FIETS

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
      // console.log(node.remark[currentScenarioID + 1])
      // addToRemarksContainer(node.remark[currentScenarioID + 1], node.index + 1) // start counting at 1 instead of zero

      return [node.x, node.y]
    })

    let duration = 500
    d3.select('#sankeySVG').datum(sankeyLayout.scale(scaleInit)(json)).transition().duration(duration).ease(d3.easeLinear).call(sankeyDiagram)
    d3.select('.sankey').attr('transform', 'translate(' + offsetX + ',' + offsetY + ')')
    d3.selectAll('.node-title').style('font-size', fontSize + 'tepx')
    d3.selectAll('.link').style('pointer-events', 'auto').style('cursor', 'pointer')
    d3.selectAll('.node').style('pointer-events', 'auto')
    d3.selectAll('.node-backdrop-title').style('pointer-events', 'none') // otherwise nodevalue text gets in the way of mouseclick 
    d3.selectAll('.node-click-target').style('fill', '#555').style('stroke-width', 0).attr('width', 10).attr('rx', 0).attr('ry', 0).attr('transform', 'translate(-4,0)scale(1.005)')
    // attach id's to link paths
    d3.select('.sankey').select('.links').selectAll('.link').select('path').attr('data-value', function (d) {return {value: d.value, color: d.color}}).attr('id', function (d, i) { return 'linkindex_' + d.index}).on('click', function () { drawBarGraph(sankeyData.links[this.id.slice(10)], config) }).style('opacity', 0.9)
    // attach id's to node rects
    d3.select('.sankey').select('.nodes').selectAll('.node').select('.node-click-target').attr('id', function (d, i) {return 'nodeindex_' + d.index}).on('click', function () { nodeVisualisatieSingular(config, sankeyData.nodes[this.id.slice(10)], sankeyData, config.scenarios, config.targetDIV) })

    d3.selectAll('.link').on('mouseover', function (event, d) {showValueOnHover(d3.select(this)); d3.select(this).style('opacity', 0.8)}).on('mouseout', function (d) {d3.select(this).style('opacity', 1)})

    function showValueOnHover (value) {
      const formatMillions = (d) => {
        const scaled = d / 1e6 // Scale the number to millions
        return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(scaled); // Format with '.' as thousands separator
      }
      console.log(value._groups[0][0].__data__.legend)
      d3.select('#showValueOnHover').html(
        function (d) {
          if (value._groups[0][0].__data__.legend == 'co2flow') {
            return value._groups[0][0].__data__.legend + ' | ' + parseInt(value._groups[0][0].__data__.value) * globalCO2flowScale + ' kton CO2'
          } else {
            if (currentUnit == 'TWh') {
              return value._groups[0][0].__data__.legend + ' | ' + parseInt(value._groups[0][0].__data__.value / 3.6) + ' TWh'
            } else { return value._groups[0][0].__data__.legend + ' | ' + parseInt(value._groups[0][0].__data__.value) + ' PJ'}
          }
        } // note

      )
        .style('background-color', '#777').interrupt().style('opacity', 1)
      d3.select('#showValueOnHover').transition().duration(5000).style('opacity', 0)
      if (value._groups[0][0].__data__.color == '#F8D377' || value._groups[0][0].__data__.color == '#62D3A4') {d3.select('#showValueOnHover').style('color', 'white')} else {d3.select('#showValueOnHover').style('color', 'white')}
    }

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
    // setScenario(1)
  }, 5000)

  function tick () {
    // sankeyData = {links: [],nodes: [],order: []}
    console.log(sankeyData)
    // document.getElementById('remarksContainer').innerHTML = ''
    for (i = 0; i < sankeyData.links.length; i++) {
      sankeyData.links[i].value = Math.round(sankeyData.links[i][config.scenarios[activeScenario].id])
    }
    d3.selectAll('.node-remark-number').remove()
    d3.selectAll('.node-remarks').remove()

    let sankeyCanvas = d3.select('#sankeySVG').append('g')
    for (i = 0; i < sankeyData.nodes.length; i++) {
      // sankeyData.links[i].value = Math.round(sankeyData.links[i][config.scenarios[activeScenario].id])
      // console.log(sankeyData.nodes[i])
      let posx = sankeyData.nodes[i].x + 21
      let posy = sankeyData.nodes[i].y + 15
      sankeyCanvas.append('path') // EDIT TIJS  - add
        .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
        .attr('class', 'node-remarks')
        .attr('height', 20)
        .attr('dy', sankeyData.nodes[i].y)
        .attr('dx', sankeyData.nodes[i].x)
        .attr('rx', 3).attr('ry', 3)
        .attr('fill', 'black')
        .attr('transform', 'translate(' + posx + ',' + posy + ')scale(0.040)rotate(180)')
        .attr('remarksData', function () {
          return JSON.stringify(sankeyData.nodes[i].remark)
        })
        .attr('fill', function (d) {
          function containsAanname (inputString) {
            // Create a new DOMParser to parse the input string as HTML
            const parser = new DOMParser()
            const parsedHTML = parser.parseFromString(inputString, 'text/html')
            // Check if there are any <info> or <aanname> elements in the parsed HTML
            const infoItems = parsedHTML.querySelectorAll('info')
            const aannameItems = parsedHTML.querySelectorAll('aanname')
            // Return TRUE if at least one <info> or <aanname> item is present, otherwise return FALSE
            return aannameItems.length > 0
          }

          if (containsAanname(sankeyData.nodes[i].remark[currentScenarioID + 1])) {return '#c1121f'} else {return '#495057'} // if only 'info', then 'orange', if 'aanname', then 'red' 
        }).attr('opacity', function (d) { // only show marker if there's info or aanname applicable. Note: used opacity instead of 'visibility' attribute, because visibility attribute is used elsewhere  
        function containsInfoOrAanname (inputString) {
          // Create a new DOMParser to parse the input string as HTML
          const parser = new DOMParser()
          const parsedHTML = parser.parseFromString(inputString, 'text/html')
          // Check if there are any <info> or <aanname> elements in the parsed HTML
          const infoItems = parsedHTML.querySelectorAll('info')
          const aannameItems = parsedHTML.querySelectorAll('aanname')
          const bronItems = parsedHTML.querySelectorAll('bron')
          // Return TRUE if at least one <info> or <aanname> item is present, otherwise return FALSE
          return infoItems.length > 0 || aannameItems.length > 0 || bronItems.length > 0
        }

        if (containsInfoOrAanname(sankeyData.nodes[i].remark[currentScenarioID + 1])) {return 1} else {return 0}
      }).on('click', function () {
        const popup = document.createElement('div')
        // const remarksList = d3.select('#remarksContainer')
        popup.id = 'popup'

        d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0.3)')
        document.body.style.overflow = 'hidden'

        console.log('currentScenarioID: ' + currentScenarioID)

        // Parse remarksData for the current scenario
        const remarksData = JSON.parse(d3.select(this).attr('remarksData'))[currentScenarioID + 1]
        // addToRemarksContainer(remarksData)
        const titleData = 'Node <strong>' + d3.select(this).attr('titleData') + '</strong>' // .replace(/"/g, '')
        const valueData = d3.select(this).attr('valueData') + ' PJ'

        // Create a bullet list container
        const listContainer = document.createElement('ul')

        // Create a helper function to create icons based on type
        function createIcon (type) {
          const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          icon.setAttribute('width', '60')
          icon.setAttribute('height', '60')
          icon.setAttribute('viewBox', '0 -960 960 960')
          icon.setAttribute('transform', 'scale(1.5)')

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

          if (type === 'aanname') {
            // Path for the warning icon (same as your original code)
            path.setAttribute('d', 'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm371-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Z')
            path.setAttribute('fill', '#c1121f')
          } else if (type === 'info') {
            // Path for a different info icon
            path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
            path.setAttribute('fill', '#495057')
          } else if (type === 'bron') {
            path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
            path.setAttribute('fill', '#0096c7')
          }

          icon.appendChild(path)
          return icon
        }

        addListItem('title', titleData)
        addListItem('value', valueData)
        // Create a helper function to add list items
        function addListItem (type, htmlContent) {
          const listItem = document.createElement('li')
          listItem.style.display = 'flex' // To position the icon and text inline
          listItem.style.alignItems = 'flex-start' // Align the icon to the top

          const icon = createIcon(type)
          icon.style.marginRight = '8px' // Add space between icon and text

          const text = document.createElement('span')
          text.innerHTML = htmlContent; // Use innerHTML to support HTML content like <strong>

          listItem.appendChild(icon)
          listItem.appendChild(text)

          if (type == 'title') {
            text.style.fontSize = '20px'
          }
          if (type == 'value') {
            text.style.fontSize = '18px'
          }

          listContainer.appendChild(listItem)
        }

        // Parse the remarksData content as a string of HTML-like text
        const parser = new DOMParser()
        const parsedHTML = parser.parseFromString(remarksData, 'text/html')

        // Process <info> and <aanname> elements
        const infoItems = parsedHTML.querySelectorAll('info')
        const bronItems = parsedHTML.querySelectorAll('bron')
        const aannameItems = parsedHTML.querySelectorAll('aanname')

        // Add each <info> element to the list with the appropriate icon and content
        infoItems.forEach(info => {
          addListItem('info', info.innerHTML); // innerHTML will preserve <strong> tags
        })
        // Add each <bron> element to the list with the appropriate icon and content
        bronItems.forEach(aanname => {
          addListItem('bron', aanname.innerHTML); // innerHTML will preserve <strong> tags
        })

        // Add each <aanname> element to the list with the appropriate icon and content
        aannameItems.forEach(aanname => {
          addListItem('aanname', aanname.innerHTML); // innerHTML will preserve <strong> tags
        })

        // Create close button
        const closeButton = document.createElement('button')
        closeButton.id = 'closeButton'
        closeButton.textContent = 'Sluit'
        closeButton.onclick = function () {
          d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0)').style('pointer-events', 'none')
          popup.remove() // Remove popup when button is clicked
          document.body.style.overflow = 'auto'
        }
        // Append list and close button to popup
        popup.appendChild(listContainer)
        popup.appendChild(closeButton)

        // remarksList.appendChild(listContainer)''

        // Get main container and append popup
        const popupContainer = document.getElementById('popupContainer')
        popupContainer.appendChild(popup)

        // d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0)').style('pointer-events', 'all')
        // disable scrolling on body
        // const observer = new MutationObserver(() => {
        //   if (document.body.style.overflow !== 'hidden') {
        //     document.body.style.setProperty('overflow', 'hidden', 'important')
        //   }
        // })

        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })

        // Clone the listContainer before appending it to remarksList
        // const clonedListContainer = listContainer.cloneNode(true) // true for deep clone

      // Get the remarksContainer and append the cloned listContainer
      // const remarksList = document.getElementById('remarksContainer')
      // remarksList.appendChild(clonedListContainer)
      })

      sankeyCanvas.append('text')
        .attr('class', 'node-remark-number')
        .attr('fill', '#FFF')
        .style('font-weight', 800)
        .style('font-size', '10px')
        .attr('text-anchor', 'middle')
        .attr('dx', -19)
        .attr('dy', 18)
        .attr('transform', 'translate(' + posx + ',' + posy + ')')
        .style('pointer-events', 'none')
        .attr('opacity', function (d) { // only show marker if there's info or aanname applicable. Note: used opacity instead of 'visibility' attribute, because visibility attribute is used elsewhere  
          function containsInfoOrAanname (inputString) {
            // Create a new DOMParser to parse the input string as HTML
            const parser = new DOMParser()
            const parsedHTML = parser.parseFromString(inputString, 'text/html')
            // Check if there are any <info> or <aanname> elements in the parsed HTML
            const infoItems = parsedHTML.querySelectorAll('info')
            const aannameItems = parsedHTML.querySelectorAll('aanname')
            const bronItems = parsedHTML.querySelectorAll('bron')
            // Return TRUE if at least one <info> or <aanname> item is present, otherwise return FALSE
            return infoItems.length > 0 || aannameItems.length > 0 || bronItems.length > 0
          }

          if (containsInfoOrAanname(sankeyData.nodes[i].remark[currentScenarioID + 1])) {return 1} else {return 0}
        })
        .text(function (d) {
          // console.log(d)

          // add data to printable remarks list on bottom of visual
          // console.log(d.remark[currentScenarioID])
          // console.log(currentScenarioID)
          // console.log(sankeyData.nodes[i].remark[currentScenarioID + 1])
          // addToRemarksContainer(sankeyData.nodes[i].remark[currentScenarioID + 1], sankeyData.nodes[i].index + 1) // start counting at 1 instead of zero

          return sankeyData.nodes[i].index + 1}) // start counting at 1 instead of zero

    // sankeyCanvas.append('rect') // EDIT TIJS  - add
    //   .attr('class', 'node-remarks')
    //   .attr('width', 20)
    //   .attr('height', 20)
    //   .attr('y', 400)
    //   .attr('x', 300)
    //   .attr('rx', 3).attr('ry', 3)
    //   .attr('fill', 'black')
    //   .attr('id', 'POEPEN')
    //   .attr('transform', 'translate(100,100)')
    }

    // selection.append('path') // EDIT TIJS  - add
    //   .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
    //   .attr('class', 'node-remarks')
    //   .attr('height', 20)
    //   .attr('y', -11)
    //   .attr('x', 15)
    //   .attr('rx', 3).attr('ry', 3)
    //   .attr('fill', function (d) {
    //     function containsAanname (inputString) {
    //       // Create a new DOMParser to parse the input string as HTML
    //       const parser = new DOMParser()
    //       const parsedHTML = parser.parseFromString(inputString, 'text/html')
    //       // Check if there are any <info> or <aanname> elements in the parsed HTML
    //       const infoItems = parsedHTML.querySelectorAll('info')
    //       const aannameItems = parsedHTML.querySelectorAll('aanname')
    //       // Return TRUE if at least one <info> or <aanname> item is present, otherwise return FALSE
    //       return aannameItems.length > 0
    //     }

    //     if (containsAanname(d.remark[currentScenarioID + 1])) {return '#c1121f'} else {return '#495057'} // if only 'info', then 'orange', if 'aanname', then 'red' 
    //   })
    //   // .attr('opacity',1)
    //   .attr('opacity', function (d) { // only show marker if there's info or aanname applicable. Note: used opacity instead of 'visibility' attribute, because visibility attribute is used elsewhere  
    //     function containsInfoOrAanname (inputString) {
    //       // Create a new DOMParser to parse the input string as HTML
    //       const parser = new DOMParser()
    //       const parsedHTML = parser.parseFromString(inputString, 'text/html')
    //       // Check if there are any <info> or <aanname> elements in the parsed HTML
    //       const infoItems = parsedHTML.querySelectorAll('info')
    //       const aannameItems = parsedHTML.querySelectorAll('aanname')
    //       const bronItems = parsedHTML.querySelectorAll('bron')
    //       // Return TRUE if at least one <info> or <aanname> item is present, otherwise return FALSE
    //       return infoItems.length > 0 || aannameItems.length > 0 || bronItems.length > 0
    //     }

    //     if (containsInfoOrAanname(d.remark[currentScenarioID + 1])) {return 1} else {return 0}
    //   })
    //   //   .on('click', function(){
    //   //     const popup = document.createElement('div')
    //   //     // const remarksList = d3.select('#remarksContainer')
    //   //     popup.id = 'popup'
    //   //     d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0.3)')
    //   //     console.log('currentScenarioID: ' + currentScenarioID)

    // //     // Parse remarksData for the current scenario
    //   //     const remarksData = JSON.parse(d3.select(this).attr('remarksData'))[currentScenarioID+1]
    //   //     // addToRemarksContainer(remarksData)
    //   //     const titleData = 'Node <strong>' +d3.select(this).attr('titleData') + '</strong>' // .replace(/"/g, '')
    //   //     const valueData = d3.select(this).attr('valueData') + ' PJ'

    // //     // Create a bullet list container
    //   //     const listContainer = document.createElement('ul')

    // //     // Create a helper function to create icons based on type
    //   //     function createIcon(type) {
    //   //         const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    //   //         icon.setAttribute('width', '60')
    //   //         icon.setAttribute('height', '60')
    //   //         icon.setAttribute('viewBox', '0 -960 960 960')
    //   //         icon.setAttribute('transform', 'scale(1.5)')

    // //         const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    // //         if (type === 'aanname') {
    //   //             // Path for the warning icon (same as your original code)
    //   //             path.setAttribute('d', 'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm371-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Z')
    //   //             path.setAttribute('fill','#c1121f')
    //   //           } else if (type === 'info') {
    //   //             // Path for a different info icon
    //   //             path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
    //   //             path.setAttribute('fill','#495057')
    //   //           } else if (type === 'bron'){
    //   //             path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
    //   //             path.setAttribute('fill','#0096c7') 
    //   //           }

    // //         icon.appendChild(path)
    //   //         return icon
    //   //     }

    // //     addListItem('title',titleData)
    //   //     addListItem('value',valueData)
    //   //     // Create a helper function to add list items
    //   //     function addListItem(type, htmlContent) {
    //   //         const listItem = document.createElement('li')
    //   //         listItem.style.display = 'flex'  // To position the icon and text inline
    //   //         listItem.style.alignItems = 'flex-start'  // Align the icon to the top

    // //         const icon = createIcon(type)
    //   //         icon.style.marginRight = '8px'  // Add space between icon and text

    // //         const text = document.createElement('span')
    //   //         text.innerHTML = htmlContent;  // Use innerHTML to support HTML content like <strong>

    // //         listItem.appendChild(icon)
    //   //         listItem.appendChild(text)

    // //         if (type == "title"){
    //   //           text.style.fontSize = '20px'
    //   //         }
    //   //         if (type == "value"){
    //   //           text.style.fontSize = '18px'
    //   //         }

    // //         listContainer.appendChild(listItem)
    //   //     }

    // //     // Parse the remarksData content as a string of HTML-like text
    //   //     const parser = new DOMParser()
    //   //     const parsedHTML = parser.parseFromString(remarksData, 'text/html')

    // //     // Process <info> and <aanname> elements
    //   //     const infoItems = parsedHTML.querySelectorAll('info')
    //   //     const bronItems = parsedHTML.querySelectorAll('bron')
    //   //     const aannameItems = parsedHTML.querySelectorAll('aanname')

    // //     // Add each <info> element to the list with the appropriate icon and content
    //   //     infoItems.forEach(info => {
    //   //         addListItem('info', info.innerHTML);  // innerHTML will preserve <strong> tags
    //   //     })
    //   //        // Add each <bron> element to the list with the appropriate icon and content
    //   //        bronItems.forEach(aanname => {
    //   //         addListItem('bron', aanname.innerHTML);  // innerHTML will preserve <strong> tags
    //   //     })

    // //     // Add each <aanname> element to the list with the appropriate icon and content
    //   //     aannameItems.forEach(aanname => {
    //   //         addListItem('aanname', aanname.innerHTML);  // innerHTML will preserve <strong> tags
    //   //     })

    // //     // Create close button
    //   //     const closeButton = document.createElement('button')
    //   //     closeButton.id = 'closeButton'
    //   //     closeButton.textContent = 'Sluit'
    //   //     closeButton.onclick = function() {
    //   //         d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0)')
    //   //         popup.remove()  // Remove popup when button is clicked
    //   //     }

    // //     // Append list and close button to popup
    //   //     popup.appendChild(listContainer)
    //   //     popup.appendChild(closeButton)

    // //     // remarksList.appendChild(listContainer)''

    // //     // Get main container and append popup
    //   //     const popupContainer = document.getElementById('popupContainer')
    //   //     popupContainer.appendChild(popup)

    // //                   // Clone the listContainer before appending it to remarksList
    //   //     // const clonedListContainer = listContainer.cloneNode(true) // true for deep clone

    // //     // Get the remarksContainer and append the cloned listContainer
    //   //     // const remarksList = document.getElementById('remarksContainer')
    //   //     // remarksList.appendChild(clonedListContainer)
    //   // })

    // selection.append('text')
    //   .attr('class', 'node-remark-number')
    //   .attr('dy', 6)
    //   .attr('fill', '#FFF')
    //   .style('font-weight', 800)
    //   .style('font-size', '10px')
    //   .attr('text-anchor', 'middle')
    //   .attr('dx', 22)
    //   .style('pointer-events', 'none')
    //   .attr('opacity', function (d) { // only show marker if there's info or aanname applicable. Note: used opacity instead of 'visibility' attribute, because visibility attribute is used elsewhere  
    //     function containsInfoOrAanname (inputString) {
    //       // Create a new DOMParser to parse the input string as HTML
    //       const parser = new DOMParser()
    //       const parsedHTML = parser.parseFromString(inputString, 'text/html')
    //       // Check if there are any <info> or <aanname> elements in the parsed HTML
    //       const infoItems = parsedHTML.querySelectorAll('info')
    //       const aannameItems = parsedHTML.querySelectorAll('aanname')
    //       const bronItems = parsedHTML.querySelectorAll('bron')
    //       // Return TRUE if at least one <info> or <aanname> item is present, otherwise return FALSE
    //       return infoItems.length > 0 || aannameItems.length > 0 || bronItems.length > 0
    //     }

    //     if (containsInfoOrAanname(d.remark[currentScenarioID + 1])) {return 1} else {return 0}
    //   })

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
      links = {}
      nodes = {}
      legend = {}
      settings = {}
      remarks = {}
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
          case 'remarks':
            remarks = XLSX.utils.sheet_to_json(worksheet)
            break
          default:
            console.log(`Sheet '${sheetName}' ignored.`)
        }
      })
      // Call the callback function with the resulting objects
      callback(links, nodes, legend, settings, remarks)
    }
    // Set up the XMLHttpRequest to load the file from the specified URL
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    xhr.send()
  }
}

function drawBarGraph (data, config) {
  console.log(config, data)

  d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0.3)').style('pointer-events', 'none')

  // Show popup blinder with transition
  // d3.select('#popupBlinder')
  //   .style('visibility', 'visible')
  //   .style('opacity', 0)
  //   .transition().duration(300)
  //   .style('opacity', 0.3)
  //   .style('pointer-events', 'auto')

  // Create and style the main popup container
  // const popup = d3.select(`#${config.targetDIV}`)
  const popup = d3.select(`#popupContainer`)
    .append('div')
    .attr('id', 'nodeInfoPopup')
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('top', '0px')
    .style('left', '0px')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .append('div')
    .style('pointer-events', 'auto')
    .attr('id', 'flowAnalysisPopup')
    .style('position', 'absolute')
    .style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.2)')
    .style('border-radius', '10px')
    // .style('margin', 'auto')
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
    .attr('x', 245)
    .attr('y', 50)
    .style('font-size', '16px')
    .style('font-weight', 500)
    .text(`Flow '${sourceNode.title} - ${targetNode.title}'`)

  // Add path and rectangle elements to the canvas
  canvas.append('path')
    .attr('d', 'M94.333 812.333 40 772.667 232 466l119.714 140 159.619-258.666 109 162.333q-18.333 1.667-35.166 6.167-16.834 4.5-33.5 11.166l-37.334-57-152.371 248.333-121.296-141-146.333 235ZM872.334 1016 741.333 885q-20.666 14.667-45.166 22.333-24.5 7.667-50.5 7.667-72.222 0-122.778-50.578-50.555-50.579-50.555-122.834t50.578-122.754q50.578-50.5 122.833-50.5T768.5 618.889Q819 669.445 819 741.667q0 26-8 50.5t-22 46.465l131 129.702L872.334 1016ZM645.573 848.334q44.76 0 75.761-30.907 31-30.906 31-75.666 0-44.761-30.907-75.761-30.906-31-75.666-31Q601 635 570 665.906q-31 30.906-31 75.667 0 44.76 30.906 75.761 30.906 31 75.667 31ZM724.666 523q-16.333-6.667-33.833-9.666-17.5-3-36.166-4.667l211-332.667L920 215.666 724.666 523Z')
    .attr('transform', 'translate(190,27)scale(0.030)')
    .style('fill', '#666')

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
    .style('pointer-events', 'auto')
    .on('mouseover', () => d3.select(closeButton.node()).attr('fill', '#999'))
    .on('mouseout', () => d3.select(closeButton.node()).attr('fill', '#fff'))
    .on('click', () => {
      d3.select('#nodeInfoPopup').remove()
      d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0)').style('pointer-events', 'none')
      document.body.style.overflow = 'auto'

    // d3.select('#popupBlinder')
    //   .style('visibility', 'hidden')
    //   .style('pointer-events', 'none')
    })
  // document.documentElement.style.overflow = 'hidden'; // For <html>
  document.body.style.overflow = 'hidden'; // For <body>ß
  d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0.3)').style('pointer-events', 'all')

  canvas.append('path')
    .style('pointer-events', 'none')
    .attr('id', `${config.targetDIV}_closeButton`)
    .attr('d', 'm249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z')
    .attr('transform', 'translate(951,7)scale(0.04)')

  // Add scenario demarcation rectangles
  const demarcations = [
    // { width: 90, height: 40, x: 144, y: 85, fill: '#888' },
    { width: 105, height: 40, x: 244, y: 85 + 35, fill: '#999' },
    { width: 105, height: 40, x: 359, y: 85 + 35, fill: '#999' },
    { width: 105, height: 40, x: 474, y: 85 + 35, fill: '#999' },
    { width: 105, height: 40, x: 589, y: 85 + 35, fill: '#999' },
    { width: 105, height: 40, x: 704, y: 85 + 35, fill: '#999' },
    { width: 105, height: 40, x: 819, y: 85 + 35, fill: '#999' }

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
  var rectsData = [
    { width: 105, height: 270, x: 244, y: 130 + 40, fill: '#eee', text: 'TOTAAL' },
    { width: 105, height: 270, x: 359, y: 130 + 40, fill: '#eee', text: "R'dam-Mrd." },
    { width: 105, height: 270, x: 474, y: 130 + 40, fill: '#eee', text: 'Zeeland' },
    { width: 105, height: 270, x: 589, y: 130 + 40, fill: '#eee', text: 'NZKG' },
    { width: 105, height: 270, x: 704, y: 130 + 40, fill: '#eee', text: 'Noord-NL' },
    { width: 105, height: 270, x: 819, y: 130 + 40, fill: '#eee', text: 'Chemelot' }
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
      .attr('y', d.y - 20 - 5)
      .style('font-weight', 600)
      .attr('fill', 'white')
      .style('font-size', '15px')
      .text(d.text)
  })

  // rectsData = [
  //   { width: 335, height: 3, x: 244, y: 80 - 10 + 35,  fill: '#999', text: 'WACC 2.25%' },
  //   { width: 335, height: 3, x: 600 - 11, y: 80 - 10 + 35,  fill: '#999', text: 'WACC 4% - 8%' }
  // ]

  // rectsData.forEach(d => {
  //   canvas.append('rect')
  //     .attr('width', d.width)
  //     .attr('height', d.height)
  //     .attr('x', d.x)
  //     .attr('y', d.y)
  //     .attr('fill', d.fill)
  //   canvas.append('text')
  //     .attr('x', d.x)
  //     .attr('y', d.y - 20 + 10)
  //     .attr('fill', '#777')
  //     .style('font-weight', 500)
  //     .style('font-size', '15px')
  //     .text(d.text)
  // })

  // Chart dimensions and scales
  const margin = { top: 10, right: 30, bottom: 30, left: 60 }
  const height = 180
  const shiftX = 100
  let shiftXAdditional = 144
  const spacing = 40
  const width = 450

  var scenarios
  console.log(scenarios)
  if (data.legend != 'co2flow') {
    scenarios = Object.entries(data).filter(([key]) => key.includes('scenario'))
  } else {
    scenarios = Object.entries(data).filter(([key]) => key.includes('scenario'))
    console.log(scenarios)

    scenarios = scenarios.map(([key, value]) => [key, value * globalCO2flowScale])
    console.log(scenarios)
  }

  const x = d3.scaleBand()
    .range([0, width])
    .domain(scenarios.map(([key]) => key.substring(0, key.indexOf('_'))))
    .padding(0.1)

  console.log(data.legend)

  y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(scenarios, ([, value]) => value)])

  // Add y-axis gridlines and limit tick marks to 5
  canvas.append('g')
    .call(d3.axisLeft(y).ticks(10).tickSize(-width - 250).tickFormat(''))
    .attr('transform', `translate(${shiftX+shiftXAdditional-10}, 190)`) // Y POSITION
    .selectAll('.tick line')
    .style('stroke', '#999')
    .style('stroke-width', 1)
    .style('opacity', 0.8)
    .style('stroke-dasharray', '8,4')
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
      if ([2, 4, 6, 8, 10, 12].includes(i)) {shiftXAdditional += spacing}
      return `translate(${shiftX + shiftXAdditional+14},190)` // Y POSITION
    })

  // Add x-axis labels
  const varianten = ['2019', '2020', '2019', '2020', '2019', '2020', '2019', '2020', '2019', '2020', '2019', '2020', '2019', '2020' ]
  const posy = height + 165 + 40 // Y POSITION
  shiftXAdditional = 96 + 10

  scenarios.forEach((d, j) => {
    if ([2, 4, 6, 8, 10, 12].includes(j)) shiftXAdditional += spacing - 3.5
    const posx = shiftX + shiftXAdditional + j * (39) + 75
    canvas.append('text')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .attr('transform', `translate(${posx},${posy})rotate(-90)`)
      .text(varianten[j])
  })

  // Add y-axis with label
  const formatMillions = (d) => {
    const scaled = d
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(scaled); // Format with '.' as thousands separator
  }

  canvas.append('g')
    .call(d3.axisLeft(y).tickFormat(formatMillions))
    .attr('transform', `translate(${shiftX+ 130}, 190 )`) // Y POSITION
    .selectAll('text')
    .style('font-weight', 500)
    .style('font-size', '13px')

  canvas.append('text')
    .attr('transform', 'translate(140,270)rotate(-90)') // Y POSITION
    .attr('dy', '1em')
    .style('font-size', '15px')
    .style('text-anchor', 'middle')
    .style('fill', '#777')
    .style('font-weight', 500)
    .text(function () {if (data.legend != 'co2flow') {return 'PJ'} else {return 'kton CO2'}})

  d3.selectAll('.domain').remove() // remove domain lines ()

}

let currentScenarioID = 0

function lookupScenarioID () {
  let key = currentScenario + '_' + currentZichtjaar
  switch (key) {
    case 'c_2020':
      currentScenarioID = 0
      return 0
    case 'c_2030':
      currentScenarioID = 1
      return 1
    case 'c_2035':
      currentScenarioID = 2
      return 2
    case 'c_2040':
      currentScenarioID = 3
      return 3
    case 'c_2050':
      currentScenarioID = 4
      return 4
    case 'nat_2020':
      currentScenarioID = 0
      return 0
    case 'nat_2030':
      currentScenarioID = 5
      return 5
    case 'nat_2035':
      currentScenarioID = 6
      return 6
    case 'nat_2040':
      currentScenarioID = 7
      return 7
    case 'nat_2050':
      currentScenarioID = 8
      return 8
    case 'int_2020':
      currentScenarioID = 0
      return 0
    case 'int_2030':
      currentScenarioID = 9
      return 9
    case 'int_2035':
      currentScenarioID = 10
      return 10
    case 'int_2040':
      currentScenarioID = 11
      return 11
    case 'int_2050':
      currentScenarioID = 12
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

function drawRemarks () {
  console.log(sankeyData.nodes)
  d3.select('#remarksContainer').html('') // EDIT TIJS - add
  for (i = 0;i < sankeyData.nodes.length;i++) {
    // console.log(sankeyData.nodes[i])
    addToRemarksContainer(sankeyData.nodes[i].remark[currentScenarioID + 1], sankeyData.nodes[i].index + 1) // start counting at 1 instead of zero
  }
}

function addToRemarksContainer (remarksData2, index) {
  // console.log(remarksData2)
  // Create a bullet list container
  const listContainer2 = document.createElement('ul')

  // Create a helper function to create icons based on type
  function createIcon (type) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    icon.setAttribute('width', '60')
    icon.setAttribute('height', '60')
    icon.setAttribute('viewBox', '0 -960 960 960')
    icon.setAttribute('transform', 'scale(1.1)')

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    if (type === 'aanname') {
      // Path for the warning icon
      path.setAttribute('d', 'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm371-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Z')
      path.setAttribute('fill', '#c1121f')
    } else if (type === 'info') {
      // Path for a different info icon
      path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
      path.setAttribute('fill', '#495057')
    } else if (type === 'bron') {
      path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
      path.setAttribute('fill', '#0096c7')
    }

    icon.appendChild(path)
    return icon
  }

  // Create a helper function to add list items
  function addListItem (type, htmlContent) {
    const listItem2 = document.createElement('li')
    listItem2.style.display = 'flex' // To position the icon and text inline
    listItem2.style.alignItems = 'flex-start' // Align the icon to the top

    const icon = createIcon(type)
    icon.style.marginRight = '8px' // Add space between icon and text

    const text = document.createElement('span')
    text.innerHTML = htmlContent; // Use innerHTML to support HTML content like <strong>

    listItem2.appendChild(icon)
    listItem2.appendChild(text)

    if (type == 'title') {
      text.style.fontSize = '20px'
    }
    if (type == 'value') {
      text.style.fontSize = '18px'
    }

    listContainer2.appendChild(listItem2)
  }

  // Parse the remarksData content as a string of HTML-like text
  const parser = new DOMParser()

  const parsedHTML = parser.parseFromString(remarksData2, 'text/html')

  // Process <info> and <aanname> elements
  const infoItems = parsedHTML.querySelectorAll('info')
  const aannameItems = parsedHTML.querySelectorAll('aanname')
  const bronItems = parsedHTML.querySelectorAll('bron')

  // If no <info> or <aanname> elements are found, exit the function
  if (infoItems.length === 0 && aannameItems.length === 0 && bronItems.length === 0) {
    return; // Don't append anything if there are no <info> or <aanname> items
  }

  // Add each <info> element to the list with the appropriate icon and content
  infoItems.forEach(info => {
    addListItem('info', info.innerHTML); // innerHTML will preserve <strong> tags
  })

  bronItems.forEach(bron => {
    addListItem('bron', bron.innerHTML); // innerHTML will preserve <strong> tags
  })

  // Add each <aanname> element to the list with the appropriate icon and content
  aannameItems.forEach(aanname => {
    addListItem('aanname', aanname.innerHTML); // innerHTML will preserve <strong> tags
  })

  // console.log(aannameItems)

  // Create the two-column layout container
  const twoColumnContainer = document.createElement('div')
  twoColumnContainer.style.display = 'flex' // Flexbox for two columns

  // Left column: SVG path with 'A' in it
  const leftColumn = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  leftColumn.setAttribute('width', '60')
  leftColumn.setAttribute('height', '60')
  leftColumn.setAttribute('viewBox', '0 -960 960 960')

  // Create the path element with the given `d` attribute
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
  path.setAttribute('transform', 'translate(875,-770)rotate(180)scale(0.8)')
  path.setAttribute('fill', (function (remarksData2) {
    // console.log(remarksData2)

    function containsAanname (inputString) {
      // Create a new DOMParser to parse the input string as HTML
      const parser = new DOMParser()
      const parsedHTML = parser.parseFromString(inputString, 'text/html')
      // Check if there are any <info> or <aanname> elements in the parsed HTML
      const infoItems = parsedHTML.querySelectorAll('info')
      const aannameItems = parsedHTML.querySelectorAll('aanname')
      const bronItems = parsedHTML.querySelectorAll('bron')
      // Return TRUE if at least one <info> or <aanname> item is present, otherwise return FALSE
      return aannameItems.length > 0
    }

    // Set the fill color based on the presence of <aanname> elements
    return containsAanname(remarksData2) ? '#c1121f' : '#495057'; // if 'aanname', return 'red', else 'orange'
  })(remarksData2)); // Execute the function with 'remarksData2'

  // Add the path to the leftColumn (SVG)
  leftColumn.appendChild(path)

  // Create a text element to overlay the letter 'A'
  const textA = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  textA.setAttribute('x', '50%')
  textA.setAttribute('y', '-430'); // Adjust the position for the letter 'A'
  textA.setAttribute('dominant-baseline', 'middle')
  textA.setAttribute('text-anchor', 'middle')
  textA.setAttribute('font-size', '224')
  textA.setAttribute('fill', 'white')
  textA.setAttribute('font-weight', 'bold')
  textA.textContent = index

  // Add the text 'A' to the leftColumn (SVG)
  leftColumn.appendChild(textA)

  // Right column: the content of listContainer2
  const rightColumn = document.createElement('div')
  rightColumn.style.flex = '1' // Make the right column take up the remaining space
  rightColumn.appendChild(listContainer2)

  // Append both columns to the two-column container
  twoColumnContainer.appendChild(leftColumn)
  twoColumnContainer.appendChild(rightColumn)

  // Get the remarksContainer and append the two-column container
  console.log(twoColumnContainer)
  const remarksList = document.getElementById('remarksContainer')
  // d3.select('#remarksContainer').html('') // EDIT TIJS - add
  remarksList.appendChild(twoColumnContainer)
}
