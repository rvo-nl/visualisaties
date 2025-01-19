let sankeyLayout
let sankeyDiagram
let activeScenario = 0
let scaleInit = 1
let nodesGlobal
let globalScaleInit
let globalCO2flowScale
let currentK = 1
let globalActiveScenario = {}
let globalActiveYear = {}
let globalActiveWACC = {}
let globalActiveTax = {}
let globalActiveTimeUse = {}
let links = {}
let nodes = {}
let legend = {}
let settings = {}
let remarks = {}
let dataset_grafieken

// SET DEFAULTS
globalActiveScenario.id = 'OP.CCS.40'
globalActiveYear.id = '2030'
globalActiveWACC.id = 'wacc_standaard'
globalActiveTax.id = 'false'
globalActiveTimeUse.id = 'false'

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
      readExcelFile(config.xlsxURL, (links, nodes, legend, settings, remarks, dataset_grafieken) => {
        console.log('Links:', links)
        console.log('Nodes:', nodes)
        console.log('Legend:', legend)
        console.log('Settings:', settings)
        console.log('Remarks:', remarks)
        console.log('dataset_grafieken', dataset_grafieken)

        drawGraphs({dataset_grafieken: dataset_grafieken})

        nodesGlobal = nodes

        console.log(nodes)
        // TEMPORARY SOLUTION, SHIFT ALL NODES to the left
        // for (i = 0;i < nodes.length;i++) {
        //   nodes[i].x = nodes[i].x - 100
        // }

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
              case 'dataset_grafieken':
                dataset_grafieken = XLSX.utils.sheet_to_json(worksheet)
                break
              default:
                console.log(`Sheet '${sheetName}' ignored.`)
            }
          })

          // Pass the parsed data to your existing callback logic
          // console.log(settings)

          settings = transformData(settings)

          // TEMPORARY SOLUTION, SHIFT ALL NODES to the left
          // for (i = 0;i < nodes.length;i++) {
          //   nodes[i].x = nodes[i].x - 100
          // }

          // console.log(settings)

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

  // fileLoadButton()
  function fileLoadButton () {
    let config = {
      mode: 'xlsx',
      // xlsxURL: sankeyXLSXurl,
      targetDIV: 'scaleableSVGContainer',
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
    d3.select('#sankeySVGPARENT').remove()

    assetslog = {}

    let scrollExtentWidth = config.settings[0].scrollExtentWidth
    let scrollExtentHeight = config.settings[0].scrollExtentHeight

    d3.select('#' + config.targetDIV).append('svg').style('position', 'relative').attr('id', 'sankeySVGPARENT').attr('width', scrollExtentWidth + 'px').attr('height', scrollExtentHeight + 'px').style('pointer-events', 'none').append('g') // .attr('id', 'sankeySVG').style('pointer-events', 'auto') // scrollExtentWidth

    // backdropCanvas = d3.select('#sankeySVGbackdrop')
    sankeyCanvas = d3.select('#sankeySVGPARENT')
    buttonsCanvas = d3.select('#' + config.targetDIV + '_buttonsSVG').append('g')
    parentCanvas = d3.select('#sankeySVGPARENT').append('g')

    // sankeyCanvas.append('rect').attr('width', 382).attr('height', 850).attr('x', 15).attr('fill', '#DCE6EF').attr('rx', 20).attr('ry', 20)
    // sankeyCanvas.append('rect').attr('width', 692).attr('height', 850).attr('x', 15 + 382 + 8).attr('fill', '#DCE6EF').attr('rx', 20).attr('ry', 20)
    // sankeyCanvas.append('rect').attr('width', 242).attr('height', 850).attr('x', 15 + 382 + 8 + 700).attr('fill', '#DCE6EF').attr('rx', 20).attr('ry', 20)

    sankeyCanvas.append('rect').attr('id', 'graph_button_1').attr('width', 370).attr('height', 5).attr('x', 15).attr('y', 90).attr('fill', '#888').attr('rx', 2.5).attr('ry', 2.5)
    sankeyCanvas.append('rect').attr('id', 'graph_button_2').attr('width', 660).attr('height', 5).attr('x', 420).attr('y', 90).attr('fill', '#888').attr('rx', 2.5).attr('ry', 2.5)
    sankeyCanvas.append('rect').attr('id', 'graph_button_3').attr('width', 415).attr('height', 5).attr('x', 1120).attr('y', 90).attr('fill', '#888').attr('rx', 2.5).attr('ry', 2.5)

    sankeyCanvas.append('rect').style('pointer-events', 'all').attr('width', 370).attr('height', 70).attr('x', 15).attr('y', 20).attr('fill', 'none').attr('rx', 2.5).attr('ry', 2.5)
      .on('click', function () {
        toggleCollapse('#kostenCollapse')
        drawGraphs({dataset_grafieken: dataset_grafieken})
        d3.select('#eindverbruikersCollapseIcon').text('+')
        d3.select('#ketensCollapseIcon').text('+')
        d3.select('#kostenCollapseIcon').text('-')
        scrollToTarget('hook_capexopex', 'menuContainer')
      }).on('mouseover', function () {d3.selectAll('#graph_button_1').attr('fill', '#000'); d3.select(this).style('cursor', 'pointer');}).on('mouseout', function () {d3.selectAll('#graph_button_1').attr('fill', '#666');d3.select(this).style('cursor', 'default');})
    sankeyCanvas.append('rect').style('pointer-events', 'all').attr('width', 660).attr('height', 70).attr('x', 420).attr('y', 20).attr('fill', 'none').attr('rx', 2.5).attr('ry', 2.5)
      .on('click', function () {
        toggleCollapse('#ketensCollapse')
        drawGraphs({dataset_grafieken: dataset_grafieken})
        d3.select('#eindverbruikersCollapseIcon').text('+')
        d3.select('#ketensCollapseIcon').text('-')
        d3.select('#kostenCollapseIcon').text('+')
        scrollToTarget('hook_ketens', 'menuContainer')
      }).on('mouseover', function () {d3.selectAll('#graph_button_2').attr('fill', '#000'); d3.select(this).style('cursor', 'pointer');}).on('mouseout', function () {d3.selectAll('#graph_button_2').attr('fill', '#666');d3.select(this).style('cursor', 'default');})
    sankeyCanvas.append('rect').style('pointer-events', 'all').attr('width', 415).attr('height', 70).attr('x', 1120).attr('y', 20).attr('fill', 'none').attr('rx', 2.5).attr('ry', 2.5)
      .on('click', function () {
        toggleCollapse('#eindverbruikersCollapse')
        drawGraphs({dataset_grafieken: dataset_grafieken})
        d3.select('#eindverbruikersCollapseIcon').text('-')
        d3.select('#ketensCollapseIcon').text('+')
        d3.select('#kostenCollapseIcon').text('+')
        scrollToTarget('hook_eindverbruik', 'menuContainer')
      }).on('mouseover', function () {d3.selectAll('#graph_button_3').attr('fill', '#000'); d3.select(this).style('cursor', 'pointer');}).on('mouseout', function () {d3.selectAll('#graph_button_3').attr('fill', '#666');d3.select(this).style('cursor', 'default');})

    sankeyCanvas.append('circle').attr('id', 'graph_button_1').attr('r', 21).attr('cx', 40).attr('cy', 55).attr('fill', '#666')
    sankeyCanvas.append('circle').attr('id', 'graph_button_2').attr('r', 21).attr('cx', 445).attr('cy', 55).attr('fill', '#666')
    sankeyCanvas.append('circle').attr('id', 'graph_button_3').attr('r', 21).attr('cx', 1145).attr('cy', 55).attr('fill', '#666')

    sankeyCanvas.append('text').attr('x', 29).attr('y', 69).attr('fill', '#fff').style('font-size', '40px').text('+')
    sankeyCanvas.append('text').attr('x', 434).attr('y', 69).attr('fill', '#FFF').style('font-size', '40px').text('+')
    sankeyCanvas.append('text').attr('x', 1134).attr('y', 69).attr('fill', '#FFF').style('font-size', '40px').text('+')

    sankeyCanvas.append('text').attr('id', 'graph_button_1').attr('x', 29 + 50).attr('y', 69 - 7).attr('fill', '#666').style('font-weight', 400).style('font-size', '18px').text('Kosten CAPEX, OPEX en brandstof')
    sankeyCanvas.append('text').attr('id', 'graph_button_2').attr('x', 434 + 50).attr('y', 69 - 7).attr('fill', '#666').style('font-weight', 400).style('font-size', '20px').text('Kosten per keten en toepassing')
    sankeyCanvas.append('text').attr('id', 'graph_button_3').attr('x', 1134 + 50).attr('y', 69 - 7).attr('fill', '#666').style('font-weight', 400).style('font-size', '20px').text('Kosten per sector en eenheid')

    // backdropCanvas.append('rect').attr('id', 'backDropCanvasFill').attr('width', scrollExtentWidth).attr('height', scrollExtentHeight).attr('fill', '#ddd').attr('fill', 'url(#dots)')

    // backdropCanvas.append('rect').attr('width', 199).attr('height', 200)

    function scrollToTarget (targetId, stickyId) {
      const targetElement = document.getElementById(targetId)
      const stickyElement = document.getElementById(stickyId)

      if (targetElement && stickyElement) {
        // Get the height of the sticky element
        const stickyHeight = stickyElement.offsetHeight

        // Get the position of the target element
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset

        // Conversion factor: 0.5 cm to pixels
        const cmToPx = 0.25 * (window.devicePixelRatio * 96 / 2.54); // 1 inch = 2.54 cm, 96 DPI standard

        // Scroll to the target position minus the sticky height and 0.5 cm
        window.scrollTo({
          top: targetPosition - stickyHeight - cmToPx,
          behavior: 'smooth'
        })
      } else {
        console.error('One or more required elements are missing in the DOM.')
      }
    }

    function toggleCollapse (targetId) {
      const targetElement = document.querySelector(targetId); // Find the element by the data-bs-target ID
      const allCollapsibleElements = document.querySelectorAll('.collapse') // Get all collapsible elements

      if (!targetElement) {
        console.error('Target element not found:', targetId)
        return
      }

      // Fold all collapsible elements except the target element
      allCollapsibleElements.forEach((element) => {
        if (element.id !== targetId.substring(1)) {
          element.classList.remove('show') // Fold other elements
          const toggler = document.querySelector(`[data-bs-target="#${element.id}"]`)
          if (toggler) toggler.setAttribute('aria-expanded', 'false')
        }
      })

      // Ensure the target element stays unfolded
      if (!targetElement.classList.contains('show')) {
        targetElement.classList.add('show') // Unfold if not already unfolded
        const toggler = document.querySelector(`[data-bs-target="${targetId}"]`)
        if (toggler) toggler.setAttribute('aria-expanded', 'true')
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      // Example: Attach toggle functionality to all toggle buttons
      document.querySelectorAll('[data-bs-toggle="collapse"]').forEach((toggleElement) => {
        toggleElement.addEventListener('click', (event) => {
          const targetId = toggleElement.getAttribute('data-bs-target')
          toggleCollapse(targetId)
        })
      })
    })

    document.addEventListener('DOMContentLoaded', () => {
      // Example: Toggle specific collapsible content on click
      document.querySelectorAll('[data-bs-toggle="collapse"]').forEach((toggleElement) => {
        toggleElement.addEventListener('click', (event) => {
          const targetId = toggleElement.getAttribute('data-bs-target')
          toggleCollapse(targetId)
        })
      })
    })

    d3.select('.sankey').select('.links').selectAll('.link').attr('id', function (d) {console.log(d)})

    // draw scenario buttons
    let spacing = 7
    let cumulativeXpos = 45

    scaleInit = config.settings[0].scaleInit

    let scenarioIdLookup = {
      wacc_standaard: {
        'OP.CCS.40': {
          2030: 0,
          2035: 1,
          2040: 2,
          2045: 3,
          2050: 4
        },
        'OptimistischSelectiefFossilCarbonPenalty': {
          2030: 5,
          2035: 6,
          2040: 7,
          2045: 8,
          2050: 9
        },
        'PP.CCS.30.in.2050': {
          2030: 10,
          2035: 11,
          2040: 12,
          2045: 13,
          2050: 14
        }
      },
      wacc_verhoogd: {
        'OP.CCS.40': {
          2030: 15,
          2035: 16,
          2040: 17,
          2045: 18,
          2050: 19
        },
        'OptimistischSelectiefFossilCarbonPenalty': {
          2030: 20,
          2035: 21,
          2040: 22,
          2045: 23,
          2050: 24
        },
        'PP.CCS.30.in.2050': {
          2030: 25,
          2035: 26,
          2040: 27,
          2045: 28,
          2050: 29
        }
      },
      wacc_actiefbeleid: {
        'OP.CCS.40': {
          2030: 30,
          2035: 31,
          2040: 32,
          2045: 33,
          2050: 34
        },
        'OptimistischSelectiefFossilCarbonPenalty': {
          2030: 35,
          2035: 36,
          2040: 37,
          2045: 38,
          2050: 39
        },
        'PP.CCS.30.in.2050': {
          2030: 40,
          2035: 41,
          2040: 42,
          2045: 43,
          2050: 44
        }
      }
    }

    // console.log(scenarioIdLookup)

    function setScenario (scenario, type) {

      // d3.select('#remarksContainer').html('')
      // d3.selectAll('.buttonRect_' + config.targetDIV).attr('fill', '#fff')
      // d3.selectAll('.buttonText_' + config.targetDIV).attr('fill', '#333')
      // d3.select('#scenariobutton_' + scenario + '_rect').attr('fill', '#333')
      // d3.select('#scenariobutton_' + scenario + '_text').attr('fill', '#fff')
      activeScenario = scenario
      console.log(globalActiveWACC)
      console.log(globalActiveScenario.id)
      activeScenario = scenarioIdLookup[globalActiveWACC.id][globalActiveScenario.id][globalActiveYear.id]
      currentScenarioID = activeScenario // neaten
      // console.log(config)
      // 
      setTimeout(() => {
        drawRemarks()
      }, 500)
      if (type != 'soft') {tick()}
      drawGraphs({dataset_grafieken: dataset_grafieken})
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
        {id: 'OP.CCS.40', title: 'Pragmatisch Ruim 40'},
        {id: 'OptimistischSelectiefFossilCarbonPenalty', title: 'Specifiek Ruim 20'},
        {id: 'PP.CCS.30.in.2050', title: 'Pragmatisch Beperkt 30'}

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
        button.style.paddingTop = '15px'
        button.style.paddingBottom = '15px'
        button.style.lineHeight = '6px'
        button.style.fontSize = '14px'
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
        button.style.paddingTop = '15px'
        button.style.paddingBottom = '15px'
        button.style.lineHeight = '0px'
        button.style.fontSize = '14px'
        button.style.textAlign = 'center'
        button.style.height = '25px'

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

          console.log('Selected scenario:', waccs)
          globalActiveWACC = waccs
          setScenario()
        }

        container.appendChild(button)
      })
    }

    drawTaxButtons()
    function drawTaxButtons () {
      let tax = [
        {id: 'false', title: 'Zonder belastingen'},
        {id: 'true', title: 'Met belastingen'}

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
        button.style.paddingTop = '15px'
        button.style.paddingBottom = '15px'
        button.style.lineHeight = '0px'
        button.style.fontSize = '14px'
        button.style.textAlign = 'center'
        button.style.height = '25px'

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

          console.log('Selected scenario:', tax)
          globalActiveTax = tax
          setScenario()
        }

        container.appendChild(button)
      })
    }

    drawUsetimeButtons()
    function drawUsetimeButtons () {
      let timeuse = [
        {id: 'false', title: 'Zonder'},
        {id: 'true', title: 'Met'}
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
        button.style.paddingTop = '15px'
        button.style.paddingBottom = '15px'
        button.style.lineHeight = '0px'
        button.style.fontSize = '14px'
        button.style.textAlign = 'center'
        button.style.height = '25px'

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

          console.log('Selected scenario:', timeuse)
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
        button.style.paddingTop = '15px'
        button.style.paddingBottom = '15px'
        button.style.lineHeight = '6px'
        button.style.fontSize = '14px'
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
    setScenario()
    updateActiveScenarioIndicator(activeScenario)

    // drawSankeyLegend(legend)
    // function drawSankeyLegend () {
    //   let shiftY = config.settings[0].legendPositionTop
    //   let shiftX = config.settings[0].legendPositionLeft
    //   let box = 15
    //   let spacing = 35

    //   let legendEntries = []
    //   for (i = 0;i < legend.length;i++) {
    //     legendEntries.push({label: legend[i].id, color: legend[i].color, width: getTextWidth(legend[i].id, '13px', config.settings[0].font) + box + spacing})
    //   }

    //   let cumulativeWidth = 0
    //   for (i = 0; i < legendEntries.length; i++) {
    //     footerCanvas.append('rect').attr('x', cumulativeWidth + shiftX).attr('y', shiftY).attr('width', box).attr('height', box).attr('fill', legendEntries[i].color)
    //     footerCanvas.append('text').style('font-family', config.settings[0].fontFamily).attr('x', cumulativeWidth + shiftX + 25).attr('y', shiftY + box / 1.4).style('font-size', 12 + 'px').text(legendEntries[i].label).attr('fill', 'white')
    //     cumulativeWidth += legendEntries[i].width
    //   }
    // }

    // drawMenuBar() // DRAWMENUBAR IS DISABLED
    // disable 2030, 2040 & 2050
    d3.select('#button_rect_zichtjaar_2030').attr('fill', '#ddd').on('click', function () {})
    d3.select('#button_rect_zichtjaar_2040').attr('fill', '#ddd').on('click', function () {})
    d3.select('#button_rect_zichtjaar_2050').attr('fill', '#ddd').on('click', function () {})

    setTimeout(() => {
      // drawHeader()
    }, 200)
  }

  drawUnitSelector() // DRAW UNIT SELECTOR IS DISABLED
  function drawUnitSelector () {
    d3.select('#unitSelector').append('div').attr('id', 'unitSelectorDiv').style('width', '200px').style('height', '35px').style('position', 'absolute').style('top', '0px').style('right', '0px').append('svg').attr('width', 200).attr('height', 35).attr('id', 'selectorButtonSVGSankey').attr('transform', 'scale(0.8)')
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
        setScenario() // FIETS

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
    d3.select('#sankeySVGPARENT').datum(sankeyLayout.scale(scaleInit)(json)).transition().duration(duration).ease(d3.easeLinear).call(sankeyDiagram)
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
      d3.select('#showValueOnHover').html(function (d) {
        if (value._groups[0][0].__data__.legend == 'co2flow') {
          return value._groups[0][0].__data__.legend + ' | ' + parseInt(value._groups[0][0].__data__.value) * globalCO2flowScale + ' kton CO2'
        } else {
          if (currentUnit == 'TWh') {
            return value._groups[0][0].__data__.legend + ' | ' + parseInt(value._groups[0][0].__data__.value / 3.6) + ' TWh'
          } else { return value._groups[0][0].__data__.legend + ' | € ' + formatWithThousandsSeparator(parseInt(value._groups[0][0].__data__.value / 1000000)) + ' miljoen'}
        }
      } // note

      )
        .style('background-color', value._groups[0][0].__data__.color).interrupt().style('opacity', 1)
      d3.select('#showValueOnHover').transition().duration(4000).style('opacity', 0)
      if (value._groups[0][0].__data__.color == '#F8D377' || value._groups[0][0].__data__.color == '#62D3A4') {d3.select('#showValueOnHover').style('color', 'black')} else {d3.select('#showValueOnHover').style('color', 'white')}
    }
  }

  function tick () {
    // sankeyData = {links: [],nodes: [],order: []}
    // console.log(sankeyData)
    // document.getElementById('remarksContainer').innerHTML = ''
    for (i = 0; i < sankeyData.links.length; i++) {
      sankeyData.links[i].value = Math.round(sankeyData.links[i][config.scenarios[activeScenario].id])
    }
    d3.selectAll('.node-remark-number').remove()
    d3.selectAll('.node-remarks').remove()

    let sankeyCanvas = d3.select('#sankeySVGPARENT').append('g')
    for (i = 0; i < sankeyData.nodes.length; i++) {
      // sankeyData.links[i].value = Math.round(sankeyData.links[i][config.scenarios[activeScenario].id])
      // console.log(sankeyData.nodes[i])
      let posx = sankeyData.nodes[i].x + 21
      let posy = sankeyData.nodes[i].y + 15
      sankeyCanvas.append('path') // EDIT TIJS  - add
        .attr('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
        .attr('class', 'node-remarks')
        .style('pointer-events', 'all')
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
      })
      // .on('click', function () {
      //   // Create the popup container
      //   const popup = document.createElement('div')
      //   popup.id = 'popup'

      //   // Dim the background
      //   d3.select('#popupContainer').style('background-color', 'rgba(0,0,0,0.3)')
      //   document.body.style.overflow = 'hidden'

      //   console.log('currentScenarioID: ' + currentScenarioID)

      //   // Parse remarksData for the current scenario
      //   const remarksData = JSON.parse(d3.select(this).attr('remarksData'))[currentScenarioID + 1]

      //   // Create a bullet list container
      //   const listContainer = document.createElement('ul')

      //   // Optional: Add some basic styling to the list
      //   listContainer.style.listStyleType = 'none' // Remove default bullets
      //   listContainer.style.padding = '0'
      //   listContainer.style.margin = '0'
      //   listContainer.style.rowGap = '10px' // Add spacing between items
      //   listContainer.style.width = '100%' // Ensure it takes full width

      //   // ─────────────────────────────────────────────────────────────────────────────
      //   // 1. Helper function to create a separate “logo” (Column 1)
      //   //    Replacing the green circle with the specified path.
      //   // ─────────────────────────────────────────────────────────────────────────────
      //   function createLogo () {
      //     const logo = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      //     logo.setAttribute('width', '60')
      //     logo.setAttribute('height', '60')
      //     // Adjust viewBox to fit the provided path
      //     logo.setAttribute('viewBox', '0 -960 960 960') // Adjusted based on path coordinates

      //     const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      //     path.setAttribute('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
      //     path.setAttribute('fill', '#2ecc71') // Change color if desired

      //     logo.appendChild(path)
      //     return logo
      //   }

      //   // ─────────────────────────────────────────────────────────────────────────────
      //   // 2. Helper function to create icons (Column 2) based on "type"
      //   // ─────────────────────────────────────────────────────────────────────────────
      //   function createIcon (type) {
      //     const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      //     icon.setAttribute('width', '60')
      //     icon.setAttribute('height', '60')
      //     icon.setAttribute('viewBox', '0 -960 960 960')

      //     const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

      //     if (type === 'aanname') {
      //       // Path for the warning icon
      //       path.setAttribute('d', 'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm371-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Z')
      //       path.setAttribute('fill', '#c1121f')
      //     } else if (type === 'info') {
      //       // Path for an info icon
      //       path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
      //       path.setAttribute('fill', '#495057')
      //     } else if (type === 'bron') {
      //       // Path for a different colored icon
      //       path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
      //       path.setAttribute('fill', '#0096c7')
      //     }

      //     icon.appendChild(path)
      //     return icon
      //   }

      //   // ─────────────────────────────────────────────────────────────────────────────
      //   // 3. Helper function to add list items using a 3-column grid
      //   //    (Column 1: logo, Column 2: icon, Column 3: text)
      //   // ─────────────────────────────────────────────────────────────────────────────
      //   function addListItem (type, htmlContent) {
      //     const listItem = document.createElement('li')

      //     // Use CSS Grid with 3 columns
      //     listItem.style.display = 'grid'
      //     listItem.style.gridTemplateColumns = '60px 60px 1fr' // adjust as needed
      //     listItem.style.columnGap = '8px'
      //     listItem.style.alignItems = 'flex-start'
      //     listItem.style.width = '100%' // Ensure full width

      //     // Column 1: Logo
      //     const logo = createLogo()

      //     // Column 2: Icon (based on "type")
      //     const icon = createIcon(type)

      //     // Column 3: Text content
      //     const text = document.createElement('span')
      //     text.innerHTML = htmlContent

      //     // You can modify font sizes if desired
      //     if (type === 'title') {
      //       text.style.fontSize = '20px'
      //       text.style.fontWeight = 'bold'; // Example: Make titles bold
      //     } else if (type === 'value') {
      //       text.style.fontSize = '18px'
      //     } else {
      //       text.style.fontSize = '12px' // Default font size for other types
      //     }

      //     // Append columns
      //     listItem.appendChild(logo)
      //     listItem.appendChild(icon)
      //     listItem.appendChild(text)

      //     // Finally, append to the <ul> container
      //     listContainer.appendChild(listItem)
      //   }

      //   // Parse the remarksData content as a string of HTML
      //   const parser = new DOMParser()
      //   const parsedHTML = parser.parseFromString(remarksData, 'text/html')

      //   // Process <info>, <bron>, <aanname> elements
      //   const infoItems = parsedHTML.querySelectorAll('info')
      //   const bronItems = parsedHTML.querySelectorAll('bron')
      //   const aannameItems = parsedHTML.querySelectorAll('aanname')

      //   // Add each <info> item
      //   infoItems.forEach(info => {
      //     addListItem('info', info.innerHTML)
      //   })

      //   // Add each <bron> item
      //   bronItems.forEach(bron => {
      //     addListItem('bron', bron.innerHTML)
      //   })

      //   // Add each <aanname> item
      //   aannameItems.forEach(aanname => {
      //     addListItem('aanname', aanname.innerHTML)
      //   })

      //   // Create close button
      //   const closeButton = document.createElement('button')
      //   closeButton.id = 'closeButton'
      //   closeButton.textContent = 'Sluit'

      //   // Optional: Style the close button
      //   closeButton.style.marginTop = '20px'
      //   closeButton.style.padding = '10px 20px'
      //   closeButton.style.backgroundColor = '#f44336'
      //   closeButton.style.color = '#fff'
      //   closeButton.style.border = 'none'
      //   closeButton.style.borderRadius = '4px'
      //   closeButton.style.cursor = 'pointer'

      //   closeButton.onclick = function () {
      //     d3.select('#popupContainer')
      //       .style('background-color', 'rgba(0,0,0,0)')
      //       .style('pointer-events', 'none')
      //     popup.remove()
      //     document.body.style.overflow = 'auto'
      //   }

      //   // Append listContainer + closeButton to the popup
      //   popup.appendChild(listContainer)
      //   popup.appendChild(closeButton)

      //   // Optionally, add some styling to the popup
      //   popup.style.position = 'fixed'
      //   popup.style.top = '50%'
      //   popup.style.left = '50%'
      //   popup.style.transform = 'translate(-50%, -50%)'
      //   popup.style.backgroundColor = '#fff'
      //   popup.style.padding = '20px'
      //   popup.style.borderRadius = '8px'
      //   popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
      //   popup.style.zIndex = '1001'; // Ensure it's above the dimmed background
      //   popup.style.maxHeight = '80vh'; // Optional: Limit popup height
      //   popup.style.overflowY = 'auto'; // Optional: Add scroll if content overflows

      //   // Finally, insert the popup into #popupContainer
      //   const popupContainer = document.getElementById('popupContainer')
      //   popupContainer.appendChild(popup)

      //   console.log('ENTER')

      // // Observe body style to keep it from scrolling
      // // Ensure that 'observer' is defined somewhere in your code
      // // If not, you can comment out or remove the following lines
      // /*
      // observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
      // */
      // })

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

          return sankeyData.nodes[i].index + 1}) // start counting at 1 instead of zero
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
      links = {}
      nodes = {}
      legend = {}
      settings = {}
      remarks = {}
      dataset_grafieken = {}
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
          case 'dataset_grafieken':
            dataset_grafieken = XLSX.utils.sheet_to_json(worksheet)
            break

          default:
            console.log(`Sheet '${sheetName}' ignored.`)
        }
      })
      // Call the callback function with the resulting objects
      callback(links, nodes, legend, settings, remarks, dataset_grafieken)
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
    .style('pointer-events', 'auto')

  // Create and style the main popup container
  const popup = d3.select(`#scaleableSVGContainer`)
    .append('div')
    .attr('id', 'nodeInfoPopup')
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('top', '470px')
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
    .style('box-shadow', '10px 20px 69px -15px rgba(0,0,0,0.75)')
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
    { width: 105, height: 270, x: 244, y: 130 + 40, fill: '#eee', text: 'OP.CCS.40' },
    { width: 105, height: 270, x: 359, y: 130 + 40, fill: '#eee', text: 'Opt.Sel.FCP' },
    { width: 105, height: 270, x: 474, y: 130 + 40, fill: '#eee', text: 'PP.CCS.30' },
    { width: 105, height: 270, x: 589, y: 130 + 40, fill: '#eee', text: 'OP.CCS.40' },
    { width: 105, height: 270, x: 704, y: 130 + 40, fill: '#eee', text: 'Opt.Sel.FCP' },
    { width: 105, height: 270, x: 819, y: 130 + 40, fill: '#eee', text: 'PP.CCS.30' }
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

  rectsData = [
    { width: 335, height: 3, x: 244, y: 80 - 10 + 35,  fill: '#999', text: 'WACC 2.25%' },
    { width: 335, height: 3, x: 600 - 11, y: 80 - 10 + 35,  fill: '#999', text: 'WACC 4% - 8%' }
  ]

  rectsData.forEach(d => {
    canvas.append('rect')
      .attr('width', d.width)
      .attr('height', d.height)
      .attr('x', d.x)
      .attr('y', d.y)
      .attr('fill', d.fill)
    canvas.append('text')
      .attr('x', d.x)
      .attr('y', d.y - 20 + 10)
      .attr('fill', '#777')
      .style('font-weight', 500)
      .style('font-size', '15px')
      .text(d.text)
  })

  // Chart dimensions and scales
  const margin = { top: 10, right: 30, bottom: 30, left: 60 }
  const height = 180
  const shiftX = 100
  let shiftXAdditional = 144
  const spacing = 40
  const width = 450

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
      if ([5, 10, 15, 20, 25].includes(i)) {shiftXAdditional += spacing}
      return `translate(${shiftX + shiftXAdditional+14},190)` // Y POSITION
    })

  // Add x-axis labels
  const varianten = ['2030', '2035', '2040', '2045', '2050', '2030', '2035', '2040', '2045', '2050', '2030', '2035', '2040', '2045', '2050', '2030', '2035', '2040', '2045', '2050', '2030', '2035', '2040', '2045', '2050', '2030', '2035', '2040', '2045', '2050']
  const posy = height + 165 + 40 // Y POSITION
  shiftXAdditional = 96

  scenarios.forEach((d, j) => {
    if ([5, 10, 15, 20, 25].includes(j)) shiftXAdditional += spacing - 3.5
    const posx = shiftX + shiftXAdditional + j * (15.50) + 75
    canvas.append('text')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .attr('transform', `translate(${posx},${posy})rotate(-90)`)
      .text(varianten[j])
  })

  // Add y-axis with label
  const formatMillions = (d) => {
    const scaled = d / 1e6 // Scale the number to millions
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
    .text('Kosten (€ miljoen)')

  d3.selectAll('.domain').remove() // remove domain lines ()

}

let currentScenarioID = 0

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
    addToRemarksContainer('remarksContainer', sankeyData.nodes[i].remark[currentScenarioID + 1], sankeyData.nodes[i].index + 1) // start counting at 1 instead of zero
  }
}

function addToRemarksContainer (targetdiv, remarksData2, index) {
  // Parse any <info>, <aanname>, <bron> from the remarksData2 HTML string
  const parser = new DOMParser()
  const parsedHTML = parser.parseFromString(remarksData2, 'text/html')

  const infoItems = parsedHTML.querySelectorAll('info')
  const aannameItems = parsedHTML.querySelectorAll('aanname')
  const bronItems = parsedHTML.querySelectorAll('bron')

  // If there are no recognized custom tags, exit early
  if (infoItems.length === 0 && aannameItems.length === 0 && bronItems.length === 0) {
    return
  }

  // Create a 2-column "wrapper":
  //   Column #1: The big "A" path
  //   Column #2: A <ul> with multiple <li> entries
  const wrapper = document.createElement('div')
  wrapper.style.display = 'grid'
  // Adjust the width of the first column (where the big "A" goes) to your liking
  wrapper.style.gridTemplateColumns = '0px auto'
  wrapper.style.columnGap = '16px'
  wrapper.style.alignItems = 'start'
  // Optional margin to space out each entire group
  wrapper.style.marginBottom = '24px'
  wrapper.style.marginRight = '0px'

  // 1) Left column: the big "A" SVG
  const leftColumn = document.createElement('div')
  // We'll create the big "A" via a helper function
  const bigASVG = createBigA(index, remarksData2)
  leftColumn.appendChild(bigASVG)

  // 2) Right column: a <ul> that holds the different remarks
  const rightColumn = document.createElement('ul')
  rightColumn.style.listStyleType = 'none'
  rightColumn.style.padding = '0' // remove default padding
  rightColumn.style.margin = '0' // remove default margin

  // Attach columns to the wrapper
  wrapper.appendChild(leftColumn)
  wrapper.appendChild(rightColumn)

  // A small helper to add an <li> with an icon (left) and text (right)
  function addListItem (tagType, content) {
    const li = document.createElement('li')

    // Each <li> is effectively another 2-column layout
    li.style.display = 'grid'
    li.style.gridTemplateColumns = '80px auto'; // icon column + text column
    li.style.alignItems = 'start'
    li.style.columnGap = '8px'
    li.style.marginBottom = '8px' // space between each item

    // The small icon
    const icon = createIcon(tagType)
    // The text next to the icon
    const textSpan = document.createElement('span')
    textSpan.innerHTML = content // keep HTML if needed

    // Append icon + text to li
    li.appendChild(icon)
    li.appendChild(textSpan)

    // (Optional: styling based on type, e.g., bigger font for <aanname> or so)
    // if (tagType === 'aanname') {
    //   textSpan.style.fontWeight = 'bold'
    // }

    rightColumn.appendChild(li)
  }

  // Finally, loop over each item found and add them as list items
  infoItems.forEach((elem) => {
    addListItem('info', elem.innerHTML)
  })

  bronItems.forEach((elem) => {
    addListItem('bron', elem.innerHTML)
  })

  aannameItems.forEach((elem) => {
    addListItem('aanname', elem.innerHTML)
  })

  // Append everything to #remarksContainer
  document.getElementById(targetdiv).appendChild(wrapper)
}

/**
 * Helper function to create the big "A" (or any index letter/number) in an SVG.
 * Color depends on whether <aanname> appears in remarksData2.
 */
function createBigA (index, remarksData2) {
  // Create the SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '60')
  svg.setAttribute('height', '60')
  svg.setAttribute('viewBox', '0 -960 960 960')

  // Main path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z')
  path.setAttribute('transform', 'translate(1075,-970) rotate(180) scale(0.8)')

  // Decide fill color based on <aanname> presence
  const fillColor = hasAanname(remarksData2) ? '#c1121f' : '#495057'
  path.setAttribute('fill', fillColor)

  svg.appendChild(path) // disable i

  // Overlay text (the 'A' or your index)
  const textA = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  textA.setAttribute('x', '690')
  textA.setAttribute('y', '-650')
  textA.setAttribute('text-anchor', 'middle')
  textA.setAttribute('dominant-baseline', 'middle')
  textA.setAttribute('font-size', '224')
  textA.setAttribute('fill', 'white')
  textA.setAttribute('font-weight', 'bold')
  textA.textContent = index; // e.g. 'A' or '1' or something

  svg.appendChild(textA)

  return svg
}

/**
 * Helper function to detect if <aanname> tags exist in the given string.
 */
function hasAanname (inputString) {
  const parser = new DOMParser()
  const parsedHTML = parser.parseFromString(inputString, 'text/html')
  const aannameItems = parsedHTML.querySelectorAll('aanname')
  return aannameItems.length > 0
}

/**
 * Helper function to create the small icon (info/aanname/bron).
 * You can adjust sizes, colors, paths as needed.
 */
function createIcon (type) {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('width', '32')
  icon.setAttribute('height', '32')
  icon.setAttribute('viewBox', '0 -960 960 960')

  // Shift the icon downward:
  icon.style.position = 'relative'
  icon.style.top = '8px' // Adjust as needed
  icon.style.scale = 0.9

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  if (type === 'aanname') {
    path.setAttribute('d', 'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm371-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Z')
    path.setAttribute('fill', '#c1121f')
  }
  else if (type === 'info') {
    path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
    path.setAttribute('fill', '#495057')
  }
  else if (type === 'bron') {
    path.setAttribute('d', 'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z')
    path.setAttribute('fill', '#0096c7')
  }

  // icon.appendChild(path) // disable i-logo
  return icon
}
