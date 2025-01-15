
function drawGraphs(inputData){


  
console.log(inputData)

  

  const grafiekdata = transformData(inputData.dataset_grafieken);
  console.log(grafiekdata)
  console.log(globalActiveWACC)
  console.log(grafiekdata.kosten.investeringen[globalActiveWACC.id]['OP.CCS.40'])

  
  // GRAFIEKEN KOSTEN

  const grafiekdata_investeringen = [
      {
        label: 'op.ccs.40',
        data: [
          { x: 2030, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
        ]
      },
      {
        label: 'optimistischSelectiefFossilCarbonPenalty',
        data: [
          { x: 2030, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
        ]
      },
      {
        label: 'pp.ccs.30.in.2050',
        data: [
          { x: 2030, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.investeringen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
        ]
      }
    ]

    const grafiekdata_capex = [
      {
        label: 'op.ccs.40',
        data: [
          { x: 2030, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
        ]
      },
      {
        label: 'optimistischSelectiefFossilCarbonPenalty',
        data: [
          { x: 2030, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.capex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
        ]
      },
      {
        label: 'pp.ccs.30.in.2050',
        data: [
          { x: 2030, y: grafiekdata.kosten.capex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.capex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.capex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.capex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.capex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
        ]
      }
    ]

    const grafiekdata_opex = [
      {
        label: 'op.ccs.40',
        data: [
          { x: 2030, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
        ]
      },
      {
        label: 'optimistischSelectiefFossilCarbonPenalty',
        data: [
          { x: 2030, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.opex[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
        ]
      },
      {
        label: 'pp.ccs.30.in.2050',
        data: [
          { x: 2030, y: grafiekdata.kosten.opex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.opex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.opex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.opex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.opex[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
        ]
      }
    ]

    const grafiekdata_brandstof = [
      {
        label: 'op.ccs.40',
        data: [
          { x: 2030, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
        ]
      },
      {
        label: 'optimistischSelectiefFossilCarbonPenalty',
        data: [
          { x: 2030, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
        ]
      },
      {
        label: 'pp.ccs.30.in.2050',
        data: [
          { x: 2030, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.brandstoffen[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
        ]
      }
    ]


    const grafiekdata_nationaleKostenTotaal = [
      {
        label: 'op.ccs.40',
        data: [
          { x: 2030, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
        ]
      },
      {
        label: 'optimistischSelectiefFossilCarbonPenalty',
        data: [
          { x: 2030, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
        ]
      },
      {
        label: 'pp.ccs.30.in.2050',
        data: [
          { x: 2030, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
          { x: 2035, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
          { x: 2040, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
          { x: 2045, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
          { x: 2050, y: grafiekdata.kosten.nationale_kosten[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
        ]
      }
    ]


    const kosten_capex_opex_brandstof_legend_entries = [
      { color: '#DD5471', text: 'op.ccs.40' },
      { color: '#62D3A4', text: 'optimistischSelectiefFossilCarbonPenalty' },
      { color: '#3F88AE', text: 'pp.ccs.30.in.2050' },
    ];
    createLegend('capex_opex_legend', kosten_capex_opex_brandstof_legend_entries)


    
  drawLineGraph(grafiekdata_investeringen, 'natKosten_investeringen', {
    title: 'Investeringen per jaar',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ miljard per jaar',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 40,
    maxYAxisValue: 100,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })

  drawLineGraph(grafiekdata_capex, 'natKosten_capex', {
    title: 'Kapitaalslasten',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ miljard per jaar',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 40,
    maxYAxisValue: 120,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })

  drawLineGraph(grafiekdata_opex, 'natKosten_opex', {
    title: 'O&M over kapitaal',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ miljard per jaar',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 8,
    maxYAxisValue: 25,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })

  drawLineGraph(grafiekdata_brandstof, 'natKosten_brandstof', {
    title: 'Brandstofkosten',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ miljard per jaar',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 15,
    maxYAxisValue: 40,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })

  drawLineGraph(grafiekdata_nationaleKostenTotaal, 'natKosten_totaal', {
    title: 'Nationale kosten totaal',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ miljard per jaar',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 90,
    maxYAxisValue: 160,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })


  // GRAFIEKEN KETENS

  const grafiekdata_ketens_elektriciteit = [
    {
      label: 'op.ccs.40',
      data: [
        { x: 2030, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
      ]
    },
    {
      label: 'optimistischSelectiefFossilCarbonPenalty',
      data: [
        { x: 2030, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
      ]
    },
    {
      label: 'pp.ccs.30.in.2050',
      data: [
        { x: 2030, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.elektriciteit[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
      ]
    }
  ]
  
  const grafiekdata_ketens_koolstof = [
    {
      label: 'op.ccs.40',
      data: [
        { x: 2030, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
      ]
    },
    {
      label: 'optimistischSelectiefFossilCarbonPenalty',
      data: [
        { x: 2030, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
      ]
    },
    {
      label: 'pp.ccs.30.in.2050',
      data: [
        { x: 2030, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.koolstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
      ]
    }
  ]
  

  const grafiekdata_ketens_warmte = [
    {
      label: 'op.ccs.40',
      data: [
        { x: 2030, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
      ]
    },
    {
      label: 'optimistischSelectiefFossilCarbonPenalty',
      data: [
        { x: 2030, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
      ]
    },
    {
      label: 'pp.ccs.30.in.2050',
      data: [
        { x: 2030, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.warmte[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
      ]
    }
  ]


  const grafiekdata_ketens_waterstof = [
    {
      label: 'op.ccs.40',
      data: [
        { x: 2030, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
      ]
    },
    {
      label: 'optimistischSelectiefFossilCarbonPenalty',
      data: [
        { x: 2030, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
      ]
    },
    {
      label: 'pp.ccs.30.in.2050',
      data: [
        { x: 2030, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
        { x: 2035, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
        { x: 2040, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
        { x: 2045, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
        { x: 2050, y: grafiekdata.ketens.waterstof[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
      ]
    }
  ]
  
  
  

  const kosten_ketens_legend_entries = [
    { color: '#DD5471', text: 'op.ccs.40' },
    { color: '#62D3A4', text: 'optimistischSelectiefFossilCarbonPenalty' },
    { color: '#3F88AE', text: 'pp.ccs.30.in.2050' },
  ];
  createLegend('ketens_legend', kosten_ketens_legend_entries)

  
  drawLineGraph(grafiekdata_ketens_elektriciteit, 'grafiek_ketens_elektriciteit', {
    title: 'Elektriciteitsprijs (inclusief infra)',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ / MWh',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 60,
    maxYAxisValue: 140,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })


  drawLineGraph(grafiekdata_ketens_koolstof, 'grafiek_ketens_koolstof', {
    title: 'Koolstofprijs (inclusief infra)',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ / MWh',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 40,
    maxYAxisValue: 140,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })

  drawLineGraph(grafiekdata_ketens_warmte, 'grafiek_ketens_warmte', {
    title: 'Warmteprijs (inclusief infra)',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ / MWh',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 0,
    maxYAxisValue: 80,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })

  drawLineGraph(grafiekdata_ketens_waterstof, 'grafiek_ketens_waterstof', {
    title: 'Waterstofprijs (inclusief infra)',
    xAxisLabel: 'Jaar',
    yAxisLabel: '€ / MWh',
    xAxisTitleSize: 12,
    yAxisTitleSize: 12,
    graphTitleSize: 14,
    minYAxisValue: 80,
    maxYAxisValue: 200,
    padding: 5,
    cornerRadius: 8,
    colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
  })



    // GRAFIEKEN SECTOREN

const grafiek_sectoren_totaal_alle_sectoren = [
  {
      label: "Gebouwde omgeving",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2050] }
      ],
  },
  {
      label: "Industrie",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2050] }
      ],
  },
  {
      label: "Transport nationaal",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2050] }
      ],
  },
  {
    label: "Transport internationaal",
    data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2050] }
    ],
},{
  label: "Landbouw",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['totaal'][2050] }
  ],
}
];

const kosten_sector_alle_legend = [
  { color: '#DD5471', text: 'Gebouwde omgeving' },
  { color: '#666666', text: 'Industrie' },
  { color: '#3F88AE', text: 'Transport nationaal' },
  { color: '#D78062', text: 'Transport internationaal' },
  { color: '#62D3A4', text: 'Landbouw' },
];
createLegend('sectoren_alle_legend', kosten_sector_alle_legend)

drawStackedAreaGraph(grafiek_sectoren_totaal_alle_sectoren, "grafiek_sectoren_totaal", {
  title: "Nationale kosten per sector",
  xAxisLabel: "Jaar",
  yAxisLabel: "€ miljard per jaar",
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 0,
  maxYAxisValue: 180,
  padding: 5,
  cornerRadius: 8,
  colors: ["#C5446E", "#666666", "#3980A4","#D78062","#62D3A4"]// Custom color array
});



const grafiek_sectoren_gebouwde_omgeving = [
  {
      label: "Installaties eindgebruiker",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2050] }
      ],
  },
  {
      label: "Elektriciteit infra",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2050] }
      ],
  },
  {
      label: "Elektriciteit productie",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2050] }
      ],
  },
  {
    label: "Koolstof infra",
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2050] }
    ],
},{
  label: "Koolstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2050] }
  ],
},{
  label: "Warmte infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2050] }
  ],
},{
  label: "Warmte productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2050] }
  ],
},{
  label: "Waterstof infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2050] }
  ],
},{
  label: "Waterstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.gebouwde_omgeving[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2050] }
  ],
}
];


const grafiek_sectoren_industrie = [
  {
      label: "Installaties eindgebruiker",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2050] }
      ],
  },
  {
      label: "Elektriciteit infra",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2050] }
      ],
  },
  {
      label: "Elektriciteit productie",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2050] }
      ],
  },
  {
    label: "Koolstof infra",
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2050] }
    ],
},{
  label: "Koolstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2050] }
  ],
},{
  label: "Warmte infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2050] }
  ],
},{
  label: "Warmte productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2050] }
  ],
},{
  label: "Waterstof infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2050] }
  ],
},{
  label: "Waterstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.industrie[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2050] }
  ],
}
];

// const grafiek_sectoren_landbouw = [
//   {
//       label: "Installaties eindgebruiker",
//       data: [
//         { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2030]},
//         { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2035] },
//         { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2040] },
//         { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2045] },
//         { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2050] }
//       ],
//   },
//   {
//       label: "Elektriciteit infra",
//       data: [
//         { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2030]},
//         { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2035] },
//         { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2040] },
//         { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2045] },
//         { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2050] }
//       ],
//   },
//   {
//       label: "Elektriciteit productie",
//       data: [
//         { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2030]},
//         { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2035] },
//         { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2040] },
//         { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2045] },
//         { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2050] }
//       ],
//   },
//   {
//     label: "Koolstof infra",
//     data: [
//       { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2030]},
//         { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2035] },
//         { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2040] },
//         { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2045] },
//         { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2050] }
//     ],
// },{
//   label: "Koolstof productie",
//   data: [
//     { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2030]},
//     { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2035] },
//     { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2040] },
//     { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2045] },
//     { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2050] }
//   ],
// },{
//   label: "Warmte infra",
//   data: [
//     { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2030]},
//     { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2035] },
//     { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2040] },
//     { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2045] },
//     { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2050] }
//   ],
// },{
//   label: "Warmte productie",
//   data: [
//     { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2030]},
//     { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2035] },
//     { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2040] },
//     { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2045] },
//     { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2050] }
//   ],
// },{
//   label: "Waterstof infra",
//   data: [
//     { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2030]},
//     { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2035] },
//     { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2040] },
//     { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2045] },
//     { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2050] }
//   ],
// },{
//   label: "Waterstof productie",
//   data: [
//     { x: 2030, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2030]},
//     { x: 2035, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2035] },
//     { x: 2040, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2040] },
//     { x: 2045, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2045] },
//     { x: 2050, y: grafiekdata.eindverbruik_sector.landbouw[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2050] }
//   ],
// }
// ];


const grafiek_sectoren_transport_nationaal = [
  {
      label: "Installaties eindgebruiker",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2050] }
      ],
  },
  {
      label: "Elektriciteit infra",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2050] }
      ],
  },
  {
      label: "Elektriciteit productie",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2050] }
      ],
  },
  {
    label: "Koolstof infra",
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2050] }
    ],
},{
  label: "Koolstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2050] }
  ],
},{
  label: "Warmte infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2050] }
  ],
},{
  label: "Warmte productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2050] }
  ],
},{
  label: "Waterstof infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2050] }
  ],
},{
  label: "Waterstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_nationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2050] }
  ],
}
];


const grafiek_sectoren_transport_internationaal = [
  {
      label: "Installaties eindgebruiker",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['installaties_eindgebruiker'][2050] }
      ],
  },
  {
      label: "Elektriciteit infra",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_infra'][2050] }
      ],
  },
  {
      label: "Elektriciteit productie",
      data: [
        { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['elektriciteit_productie'][2050] }
      ],
  },
  {
    label: "Koolstof infra",
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2030]},
        { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2035] },
        { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2040] },
        { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2045] },
        { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_infra'][2050] }
    ],
},{
  label: "Koolstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['koolstof_productie'][2050] }
  ],
},{
  label: "Warmte infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_infra'][2050] }
  ],
},{
  label: "Warmte productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['warmte_productie'][2050] }
  ],
},{
  label: "Waterstof infra",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_infra'][2050] }
  ],
},{
  label: "Waterstof productie",
  data: [
    { x: 2030, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2030]},
    { x: 2035, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2035] },
    { x: 2040, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2040] },
    { x: 2045, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2045] },
    { x: 2050, y: grafiekdata.eindverbruik_sector.transport_internationaal[globalActiveWACC.id][globalActiveScenario.id]['waterstof_productie'][2050] }
  ],
}
];

const kosten_sector_persector_legend = [
  { color: '#666666', text: 'Installaties eindgebruiker' },
  { color: '#BA9E59', text: 'Elektriciteit infra' },
  { color: '#F8D377', text: 'Elektriciteit productie' },
  { color: '#583FB8', text: 'Koolstof infra' },
  { color: '#7555F6', text: 'Koolstof productie' },
  { color: '#A63F54', text: 'Warmte infra' },
  { color: '#C5446E', text: 'Warmte productie' },
  { color: '#499F7B', text: 'Waterstof infra' },
  { color: '#62D3A4', text: 'Waterstof productie' },

];
createLegend('sectoren_persector_legend', kosten_sector_persector_legend)


drawStackedAreaGraph(grafiek_sectoren_gebouwde_omgeving, "grafiek_sectoren_gebouwde_omgeving", {
  title: "Gebouwde Omgeving",
  xAxisLabel: "Jaar",
  yAxisLabel: "€ miljard per jaar",
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 0,
  maxYAxisValue: 25,
  padding: 5,
  cornerRadius: 8,
    colors: ['#666666','#BA9E59','#F8D377','#583FB8','#7555F6','#A63F54','#C5446E','#499F7B','#62D3A4']// Custom color array
});

drawStackedAreaGraph(grafiek_sectoren_industrie, "grafiek_sectoren_industrie", {
  title: "Industrie",
  xAxisLabel: "Jaar",
  yAxisLabel: "€ miljard per jaar",
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 0,
  maxYAxisValue: 50,
  padding: 5,
  cornerRadius: 8,
  colors: ['#666666','#BA9E59','#F8D377','#583FB8','#7555F6','#A63F54','#C5446E','#499F7B','#62D3A4']// Custom color array
});


drawStackedAreaGraph(grafiek_sectoren_transport_nationaal, "grafiek_sectoren_transport_nationaal", {
  title: "Transport Nationaal",
  xAxisLabel: "Jaar",
  yAxisLabel: "€ miljard per jaar",
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 0,
  maxYAxisValue: 50,
  padding: 5,
  cornerRadius: 8,
  colors: ['#666666','#BA9E59','#F8D377','#583FB8','#7555F6','#A63F54','#C5446E','#499F7B','#62D3A4']// Custom color array
});

drawStackedAreaGraph(grafiek_sectoren_transport_internationaal, "grafiek_sectoren_transport_internationaal", {
  title: "Transport Internationaal",
  xAxisLabel: "Jaar",
  yAxisLabel: "€ miljard per jaar",
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 0,
  maxYAxisValue: 20,
  padding: 5,
  cornerRadius: 8,
  colors: ['#666666','#BA9E59','#F8D377','#583FB8','#7555F6','#A63F54','#C5446E','#499F7B','#62D3A4']// Custom color array
});


// drawStackedAreaGraph(grafiek_sectoren_landbouw, "grafiek_sectoren_landbouw", {
//   title: "Landbouw",
//   xAxisLabel: "Jaar",
//   yAxisLabel: "€ miljard",
//   xAxisTitleSize: 12,
//   yAxisTitleSize: 12,
//   graphTitleSize: 14,
//   padding: 5,
//   cornerRadius: 8,
//   colors: ["#C5446E", "#5CC295", "#3980A4", "#D78062", "#E8C964", "#9F67C8", "#78A8E6", "#EF8A5A", "#FABE5A"]// Custom color array
// });



// GRAFIEKEN EINDVERBRUIK PER EENHEID

//verwarming huishoudens (€/hh)
// staalindustrie (€/ton staal)
// luchtvaar (€/PJ)
// chemische industrie (€/ton product)
// Personenvervoer weg (€/100 km)


const grafiekdata_eenheid_huishoudens = [
  {
    label: 'op.ccs.40',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
    ]
  },
  {
    label: 'optimistischSelectiefFossilCarbonPenalty',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
    ]
  },
  {
    label: 'pp.ccs.30.in.2050',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.huishoudens[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
    ]
  }
]

const grafiekdata_eenheid_personenvervoer_weg = [
  {
    label: 'op.ccs.40',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
    ]
  },
  {
    label: 'optimistischSelectiefFossilCarbonPenalty',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
    ]
  },
  {
    label: 'pp.ccs.30.in.2050',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.personenvervoer_weg[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
    ]
  }
]

const grafiekdata_eenheid_luchtvaart = [
  {
    label: 'op.ccs.40',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
    ]
  },
  {
    label: 'optimistischSelectiefFossilCarbonPenalty',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
    ]
  },
  {
    label: 'pp.ccs.30.in.2050',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.luchtvaart[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
    ]
  }
]

const grafiekdata_eenheid_staalindustrie = [
  {
    label: 'op.ccs.40',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
    ]
  },
  {
    label: 'optimistischSelectiefFossilCarbonPenalty',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
    ]
  },
  {
    label: 'pp.ccs.30.in.2050',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.industrie_staal[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
    ]
  }
]

const grafiekdata_eenheid_chemischeindustrie = [
  {
    label: 'op.ccs.40',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OP.CCS.40']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OP.CCS.40']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OP.CCS.40']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OP.CCS.40']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OP.CCS.40']['null'][2050] }
    ]
  },
  {
    label: 'optimistischSelectiefFossilCarbonPenalty',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['OptimistischSelectiefFossilCarbonPenalty']['null'][2050] }
    ]
  },
  {
    label: 'pp.ccs.30.in.2050',
    data: [
      { x: 2030, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2030]},
      { x: 2035, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2035] },
      { x: 2040, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2040] },
      { x: 2045, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2045] },
      { x: 2050, y: grafiekdata.eindverbruik_subsector.industrie_chemie[globalActiveWACC.id]['PP.CCS.30.in.2050']['null'][2050] }
    ]
  }
]


const kosten_eindverbruik_eenheid_legend_entries = [
  { color: '#DD5471', text: 'op.ccs.40' },
  { color: '#62D3A4', text: 'optimistischSelectiefFossilCarbonPenalty' },
  { color: '#3F88AE', text: 'pp.ccs.30.in.2050' },
];
createLegend('ketens_eindverbruik_eenheid', kosten_eindverbruik_eenheid_legend_entries)


drawLineGraph(grafiekdata_eenheid_huishoudens, 'grafiek_eenheid_huishoudens', {
  title: 'Huishoudens | verwarming',
  xAxisLabel: 'Jaar',
  yAxisLabel: '€ / huishouden',
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 1000,
  maxYAxisValue: 1800,
  padding: 5,
  cornerRadius: 8,
  colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
})

drawLineGraph(grafiekdata_eenheid_personenvervoer_weg, 'grafiek_eenheid_personenvervoer_weg', {
  title: 'Personenvervoer | weg',
  xAxisLabel: 'Jaar',
  yAxisLabel: '€ / 100 km',
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 20,
  maxYAxisValue: 30,
  padding: 5,
  cornerRadius: 8,
  colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
})

drawLineGraph(grafiekdata_eenheid_luchtvaart, 'grafiek_eenheid_luchtvaart', {
  title: 'Luchtvaart',
  xAxisLabel: 'Jaar',
  yAxisLabel: '€ / PJ',
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 60,
  maxYAxisValue: 160,
  padding: 5,
  cornerRadius: 8,
  colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
})

drawLineGraph(grafiekdata_eenheid_chemischeindustrie, 'grafiek_eenheid_chemischeindustrie', {
  title: 'Industrie | chemie',
  xAxisLabel: 'Jaar',
  yAxisLabel: '€ / ton product',
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 1100,
  maxYAxisValue: 2500,
  padding: 5,
  cornerRadius: 8,
  colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
})

drawLineGraph(grafiekdata_eenheid_staalindustrie, 'grafiek_eenheid_staalindustrie', {
  title: 'Industrie | staal',
  xAxisLabel: 'Jaar',
  yAxisLabel: '€ / ton staal',
  xAxisTitleSize: 12,
  yAxisTitleSize: 12,
  graphTitleSize: 14,
  minYAxisValue: 0,
  maxYAxisValue: 1500,
  padding: 5,
  cornerRadius: 8,
  colors: ['#DD5471', '#62D3A4', '#3F88AE'], // Custom color array
})






}







function transformData(data) {
  const output = {};

  data.forEach((item) => {
    const { group, subject, waccvariant, scenario,label, ...years } = item;

    // Initialize nested objects if they don't exist yet
    if (!output[group]) {
      output[group] = {};
    }
    if (!output[group][subject]) {
      output[group][subject] = {};
    }
    if (!output[group][subject][waccvariant]) {
      output[group][subject][waccvariant] = {};
    }
    if (!output[group][subject][waccvariant][scenario]) {
      output[group][subject][waccvariant][scenario] = {};
    }
    if (!output[group][subject][waccvariant][scenario][label]) {
      output[group][subject][waccvariant][scenario][label] = {};
    }

    // Copy year/value pairs (e.g. 2030, 2035, ...) into our nested structure
    for (const [year, value] of Object.entries(years)) {
      // Skip the keys that are not numeric years if necessary
      if (!isNaN(parseInt(year, 10))) {
        output[group][subject][waccvariant][scenario][label][year] = value;
      }
    }
  });

  return output;
}



function createLegend(divId, entries) {
  // Get the div element by ID
  const container = document.getElementById(divId);

  if (!container) {
      console.error(`Element with ID "${divId}" not found.`);
      return;
  }

  // Clear existing content
  container.innerHTML = '';

  // Apply styles to the container
  // container.style.backgroundColor = 'white';
  // container.style.borderRadius = '8px';
  // container.style.padding = '10px';
  // // container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
  // container.style.display = 'flex';
  // container.style.flexWrap = 'wrap';
  // container.style.gap = '10px';
  // container.style.alignItems = 'center';

  // Create legend entries
  entries.forEach(entry => {
      const { color, text } = entry;

      // Entry wrapper
      const entryWrapper = document.createElement('div');
      entryWrapper.style.display = 'flex';
      entryWrapper.style.alignItems = 'center';
      entryWrapper.style.gap = '5px';

      // Circle
      const circle = document.createElement('div');
      circle.style.width = '11px';
      circle.style.height = '11px';
      circle.style.borderRadius = '50%';
      circle.style.backgroundColor = color;
      circle.style.flexShrink = '0';

      // Text
      const label = document.createElement('span');
      label.style.fontSize = '12px';
      label.style.color = '#333';
      label.textContent = text;

      // Append circle and text to entry wrapper
      entryWrapper.appendChild(circle);
      entryWrapper.appendChild(label);

      // Append entry wrapper to container
      container.appendChild(entryWrapper);
  });
}
