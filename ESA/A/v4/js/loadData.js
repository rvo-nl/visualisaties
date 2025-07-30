// let currentScenario = 'nat'
// let currentSector = 'all'
// let currentRoutekaart = 'w'
// let currentYMax = [1400, 100, 1400]
// let currentTitlesArray = ['Directe elektrificatie (COP~1)', 'Directe elektrificatie (COP>1)', 'Waterstofnet', 'Warmtenet', 'Biobrandstoffen', 'Omgevings-, zonne- en aardwarmte', 'Aardgas, olie, kolen', 'CCS']
// let currentColorsArray = ['#E99172', '#F8D377', '#3F88AE', '#DD5471', '#62D3A4', '#aaaaaa', '#666666', '#444']
// let sankeyModeActive = false
// let currentZichtjaar = '2030'
// let currentUnit = 'PJ'

let XLSXurl = 'data/data_sankeydiagram_ESA_v4_30072025.xlsm'

let sankeyConfigs = []

function initTool () {
  sankeyConfigs.push({ sankeyDataID: 'system', sankeyInstanceID: 'energyflows', targetDIV: 'SVGContainer_energyflows', width: 1600, height: 1200})
  // sankeyConfigs.push({ sankeyDataID: 'electricity', sankeyInstanceID: 'energyflows', targetDIV: 'SVGContainer_energyflows', width: 1600, height: 1050})
  // sankeyConfigs.push({ sankeyDataID: 'hydrogen', sankeyInstanceID: 'energyflows', targetDIV: 'SVGContainer_energyflows', width: 1600, height: 1050})
  // sankeyConfigs.push({ sankeyDataID: 'heat', sankeyInstanceID: 'energyflows', targetDIV: 'SVGContainer_energyflows', width: 1600, height: 1050})
  // sankeyConfigs.push({ sankeyDataID: 'carbon', sankeyInstanceID: 'energyflows', targetDIV: 'SVGContainer_energyflows', width: 1600, height: 1050})

  // console.log(sankeyConfigs)

  if (dataSource == 'url') {
    readExcelFile(XLSXurl, (rawSankeyData) => {

      d3.select('#loadFileDialog').style('visibility', 'hidden').style('pointer-events', 'none')
      d3.selectAll('.buttonTitles').style('visibility', 'visible')

      // console.log(rawSankeyData)

      sankeyConfigs.forEach(element => {

        let configString = JSON.stringify(element) // stringify in order to prevent code further down the line to transform sankeyConfigs object
        let config = JSON.parse(configString)

        var links = rawSankeyData.links[config.sankeyDataID]
        var nodes = rawSankeyData.nodes[config.sankeyDataID]
        var legend = rawSankeyData.legend[config.sankeyDataID]
        var settings = rawSankeyData.settings[config.sankeyDataID]
        var remarks = rawSankeyData.remarks[config.sankeyDataID]


        // console.log('Links:', links)
        // console.log('Nodes:', nodes)
        // console.log('Legend:', legend)
        // console.log('Settings:', settings)
        // console.log('Remarks:', remarks)

        nodesGlobal = nodes

        settings = transformData(settings)

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

        processData(links, nodes, legend, settings, remarks, config)
      })
    })
  } else if (dataSource == 'file') {
    console.log('FILE')

    d3.select('#loadFileDialog').style('visibility', 'visible').style('pointer-events', 'auto')
    // // Get the container div with id "loadFileDialog"
    // const loadFileDialog = document.getElementById('loadFileDialog')

    // // Create the file input element
    // const fileInput = document.createElement('input')
    // fileInput.type = 'file'
    // fileInput.accept = '.xlsx' // Restrict file type to Excel files

    // // Append the file input element to the "loadFileDialog" div
    // if (loadFileDialog) {
    //   loadFileDialog.appendChild(fileInput)
    // } else {
    //   console.error('Element with id not found.')
    // }

    // // Listen for file selection
    // fileInput.addEventListener('change', (event) => {
    //   const file = event.target.files[0] // Get the selected file
    //   if (!file) {
    //     console.error('No file selected!')
    //     return
    //   }

    //   // Create a FileReader to read the file
    //   const reader = new FileReader()

    //   reader.onload = (e) => {
    //     const data = new Uint8Array(e.target.result) // Read the file as a binary array
    //     const workbook = XLSX.read(data, { type: 'array' }) // Parse the Excel file

    //     const rawSankeyData = generateSankeyLibrary(workbook)

    //     sankeyConfigs.forEach(element => {

    //       let configString = JSON.stringify(element) // stringify in order to prevent code further down the line to transform sankeyConfigs object
    //       let config = JSON.parse(configString)

    //       var links = rawSankeyData.links[config.sankeyDataID]
    //       var nodes = rawSankeyData.nodes[config.sankeyDataID]
    //       var legend = rawSankeyData.legend[config.sankeyDataID]
    //       var settings = rawSankeyData.settings[config.sankeyDataID]
    //       var remarks = rawSankeyData.remarks[config.sankeyDataID]

    //       settings = transformData(settings)

    //       // console.log(settings)

    //       if (settings[0].projectID != projectID || settings[0].versionID != versionID || settings[0].productID != productID) {
    //         console.log('ERROR - ID MISMATCH')
    //         const loadFileDialog = document.getElementById('loadFileDialog')
    //         // Set the inner HTML with the desired text and link
    //         document.getElementById('loadFileDialog').innerHTML = `
    //           <div style="max-width: 500px; word-wrap: break-word;line-height: 35px;font-size:15px; ">
    //               <strong style="line-height: 40px; font-size:28px;font-weight:300;">Error</strong> <br><br>De identificatienummers van het opgegeven databestand (<strong>${settings[0].projectID}_${settings[0].productID}_${settings[0].versionID}</strong>) en het ingeladen visualisatiescript (<strong>${projectID}_${productID}_${versionID}</strong>) komen niet overeen.<br><br>Gebruik de onderstaande link om naar het script te gaan dat bij het opgegeven bestand hoort en probeer het opnieuw.&nbsp
    //               <br><br>
    //               <a href="https://rvo-nl.github.io/visualisaties/${settings[0].projectID}/${settings[0].productID}/${settings[0].versionID}" style="color: blue; text-decoration: underline;">
    //                   https://rvo-nl.github.io/visualisaties/${settings[0].projectID}/${settings[0].productID}/${settings[0].versionID}
    //               </a>
    //           </div>
    //       `

    //         return
    //       }

    //       d3.select('#loadFileDialog').style('visibility', 'hidden').style('pointer-events', 'none')
    //       d3.selectAll('.buttonTitles').style('visibility', 'visible')

    //       function transformData (inputArray) { // this function converts the new input format for the settings tab to the old input format the rest of the code expects
    //         const output = {}

    //         inputArray.forEach(item => {
    //           const key = item.setting; // Get the key from "horizontalMargin"
    //           const value = item.waarde; // Get the value from "0"
    //           output[key] = value // Assign to the output object
    //         })
    //         // Wrap the resulting object in an array to match the desired structure
    //         return [output]
    //       }
    //       processData(links, nodes, legend, settings, remarks, config)
    //     })
    //   }

    //   reader.readAsArrayBuffer(file) // Read the file as a binary array
    // })
  }
}

setTimeout(() => {
  sankeyModeActive = true
  initTool()
}, 200)

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

    const result = generateSankeyLibrary(workbook)
    // Call the callback function with the resulting objects
    callback(result)
  }
  // Set up the XMLHttpRequest to load the file from the specified URL
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.send()
}

function generateSankeyLibrary (workbook) {
  // Read the data from each sheet
  let sankeyDataLibrary = {}
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    if (worksheet && sheetName.startsWith('snky_')) {
      const [before, after] = sheetName.slice(5).split('_', 2)
      if (after && ['links', 'nodes', 'remarks', 'legend', 'settings'].includes(after)) {
        // Ensure the top-level object exists
        if (!sankeyDataLibrary[after]) {
          sankeyDataLibrary[after] = {}
        }
        // Store the data in the correct structure
        sankeyDataLibrary[after][before] = XLSX.utils.sheet_to_json(worksheet)
      }
    }
  })
  // console.log(sankeyDataLibrary)
  return sankeyDataLibrary
}

// setTimeout(() => { // TODO: MAKE SEQUENTIAL WITH TOKEN
//   setScenario() // init
// }, 1000)







 // Inject file input into the target div
 const container = document.getElementById('loadFileDialog');
 const input = document.createElement('input');
 input.type = 'file';
 input.accept = '.zip';
 input.style.display = 'block';
 input.style.margin = '1em 0';

 const label = document.createElement('label');
//  label.textContent = 'Select a ZIP file containing Excel files:';
 label.style.display = 'block';

 container.appendChild(label);
 container.appendChild(input);

 input.addEventListener('change', async (event) => {
   const file = event.target.files[0];
   if (!file) return;

   try {
     const zip = new JSZip();
     const zipContent = await zip.loadAsync(file);
     const excelData = {};

     const excelExtensions = /\.(xls[xmb]?|ods|csv|tsv|txt|xml)$/i;

     for (const fileName of Object.keys(zipContent.files)) {
       const zipFile = zipContent.files[fileName];

       if (!zipFile.dir && excelExtensions.test(fileName)) {
         const fileData = await zipFile.async('arraybuffer');

         try {
           const workbook = XLSX.read(fileData, { type: 'array' });
           const sheets = {};
           workbook.SheetNames.forEach(sheetName => {
             sheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });
           });

           const baseName = fileName.split('/').pop().replace(/\.[^.]+$/, '');
           excelData[baseName] = sheets;
         } catch (err) {
           console.warn(`Failed to parse "${fileName}":`, err);
         }
       }
     }

     console.log('Extracted Excel Data:', excelData);
     dataset_ADAPT = excelData['data_watervaldiagram_A_ADAPT']
     dataset_TRANSFORM_DEFAULT = excelData['data_watervaldiagram_B_TRANSFORM - Default']
     dataset_TRANSFORM_C_EN_I = excelData['data_watervaldiagram_C_TRANSFORM - Competitief en import']
     dataset_TRANSFORM_MC = excelData['data_watervaldiagram_D_TRANSFORM - Minder competitief']
     dataset_TRANSFORM_MC_EN_I = excelData['data_watervaldiagram_E_TRANSFORM - Minder competitief en import']
     dataset_PR40 = excelData['data_watervaldiagram_OP - CO2-opslag 40']
     dataset_SR20 = excelData['data_watervaldiagram_OptimistischSelectiefFossilCarbonPenalty']
     dataset_PB30 = excelData['data_watervaldiagram_PP_CCS_30_in_2050']
     dataset_WLO1 = excelData['data_watervaldiagram_WLO1']
     dataset_WLO2 = excelData['data_watervaldiagram_WLO2']
     dataset_WLO3 = excelData['data_watervaldiagram_WLO3']
     dataset_WLO4 = excelData['data_watervaldiagram_WLO4']

     initWaterfallDiagram()

    //  alert('Excel data extracted — check the console!');

     // GENERATE SANKEY
     var rawSankeyData = generateSankeyLibrary(jsonToWorkbook(excelData.data_sankeydiagram_ESA_v4_30072025))
     sankeyConfigs.forEach(element => {

      let configString = JSON.stringify(element) // stringify in order to prevent code further down the line to transform sankeyConfigs object
      let config = JSON.parse(configString)

      var links = rawSankeyData.links[config.sankeyDataID]
      var nodes = rawSankeyData.nodes[config.sankeyDataID]
      var legend = rawSankeyData.legend[config.sankeyDataID]
      var settings = rawSankeyData.settings[config.sankeyDataID]
      var remarks = rawSankeyData.remarks[config.sankeyDataID]

      settings = transformData(settings)

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
      processData(links, nodes, legend, settings, remarks, config)
    })



   } catch (err) {
     console.error('Error reading ZIP file:', err);
    //  alert('Failed to read ZIP file.');
   }
 });




 function jsonToWorkbook(jsonObject) {
  const workbook = XLSX.utils.book_new();

  for (const sheetName in jsonObject) {
    const sheetData = jsonObject[sheetName];
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  return workbook;
}

































// extractExcelDataFromZip('/data/scenarioviewer_tvkn_v3_april_2025.zip')
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

//   async function extractExcelDataFromZip(url) {
//     const zip = new JSZip();
  
//     // Fetch the zip file
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Failed to download ZIP: ${response.statusText}`);
//     }
  
//     const blob = await response.blob();
//     const zipContent = await zip.loadAsync(blob);
  
//     const excelData = {};
  
//     const excelExtensions = /\.(xls[xmb]?|ods|csv|tsv|txt|xml)$/i;
  
//     for (const fileName of Object.keys(zipContent.files)) {
//       const file = zipContent.files[fileName];
  
//       if (!file.dir && excelExtensions.test(fileName)) {
//         const fileData = await file.async('arraybuffer');
  
//         try {
//           const workbook = XLSX.read(fileData, { type: 'array' });
  
//           const sheets = {};
//           workbook.SheetNames.forEach(sheetName => {
//             sheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });
//           });
  
//           const baseName = fileName.split('/').pop().replace(/\.[^.]+$/, '');
//           excelData[baseName] = sheets;
//         } catch (err) {
//           console.warn(`Failed to parse Excel file "${fileName}":`, err);
//         }
//       }
//     }
  
//     return excelData;
//   }