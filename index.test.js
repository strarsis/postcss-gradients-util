const valuesParse = require('postcss-values-parser'),
      parseValues = valuesParse.parse;
const gradientTools    = require('./'),
      getGradientInfo  = gradientTools.getGradientInfo,
      getGradients     = gradientTools.getGradients,
      simplifyGradient = gradientTools.simplifyGradient;


async function runValues (input, output) {
  const parsedValues = parseValues(input);

  const gradient = getGradientInfo(parsedValues);

  const simplifiedGradient = simplifyGradient(gradient);
  expect(simplifiedGradient).toEqual(output)
}

async function run (input, output) {
  const parsedValues = parseValues(input);

  const gradients = getGradients(parsedValues);

  const simplifiedGradients = simplifyGradients(gradients);
  expect(simplifiedGradients).toEqual(output);
}


it('collects gradient angle and stops of a gradient value', async () => {
  await runValues(

`
  to right,
  #7b647e                  10%,
  rgb( 254, 123,  23)      30%,
  rgba(125, 231, 201, .34) 40%,
  salmon                   90%
`,

{
  "config": {
    "sideOrCorner": [
      "to",
      "right"
    ],
    "angle": [],
  },
  "colorStops": [
    {
      "value": [
        "#7b647e",
      ],
      "pos": [
        "10%"
      ]
    },
    {
      "value": [
        "rgb( 254, 123,  23)"
      ],
      "pos": [
        "30%"
      ]
    },
    {
      "value": [
        "rgba(125, 231, 201, .34)"
      ],
      "pos": [
        "40%"
      ]
    },
    {
      "value": [
        "salmon"
      ],
      "pos": [
        "90%"
      ]
    }
  ]
},

)
})


it('collects gradient angle and stops of a gradient value with calc(...) in position', async () => {
  await runValues(

`
to left,
#5bdcdc      calc((100% / 12) - 4px),
transparent  calc((100% / 12) - 4px),
#53cfd5      calc((100% / 12) + 4px),
red          90%
`,

{
  "config": {
    "sideOrCorner": [
      "to",
      "left"
    ],
    "angle": [],
  },
  "colorStops": [
    {
      "value": [
        "#5bdcdc"
      ],
      "pos": [
        "calc((100% / 12) - 4px)"
      ]
    },
    {
      "value": [
        "transparent"
      ],
      "pos": [
        "calc((100% / 12) - 4px)"
      ]
    },
    {
      "value": [
        "#53cfd5"
      ],
      "pos": [
        "calc((100% / 12) + 4px)"
      ]
    },
    {
      "value": [
        "red"
      ],
      "pos": [
        "90%"
      ]
    }
  ]
},

)
})


it('collects gradient stops of a gradient value without a sideOrCorner component', async () => {
  await runValues(

`
  #7b647e                  10%,
  rgb( 254, 123,  23)      30%,
  rgba(125, 231, 201, .34) 40%,
  salmon                   90%
`,

{
  "config": {
    "sideOrCorner": [],
    "angle": [],
  },
  "colorStops": [
    {
      "value": [
        "#7b647e",
      ],
      "pos": [
        "10%"
      ]
    },
    {
      "value": [
        "rgb( 254, 123,  23)"
      ],
      "pos": [
        "30%"
      ]
    },
    {
      "value": [
        "rgba(125, 231, 201, .34)"
      ],
      "pos": [
        "40%"
      ]
    },
    {
      "value": [
        "salmon"
      ],
      "pos": [
        "90%"
      ]
    }
  ]
},

)
})


it('collects gradient stops of a very simple gradient example without a sideOrCorner and only two stops', async () => {
  await runValues(

`
  red, blue
`,

{
  "config": {
    "sideOrCorner": [],
    "angle": [],
  },
  "colorStops": [
    {
      "value": [
        "red",
      ],
      "pos": []
    },
    {
      "value": [
        "blue"
      ],
      "pos": []
    },
  ]
},

)
})


it('collects angle and gradient stops of a very simple gradient example with angle', async () => {
  await runValues(

`
  123deg,
  red, blue
`,

{
  "config": {
    "sideOrCorner": [],
    "angle": [
      "123deg"
    ],
  },
  "colorStops": [
    {
      "value": [
        "red",
      ],
      "pos": []
    },
    {
      "value": [
        "blue"
      ],
      "pos": []
    },
  ]
},

)
})



it('collects angle and gradient stops of a very radial gradient example with angle', async () => {
  await runValues(

`
  circle at 100%, #333, #333 50%, #eee 75%, #333 75%
`,

{
  "config": {
    "sideOrCorner": [],
    "angle": [],
  },
  "colorStops": [
    {
      "value": [
        "#333",
      ],
      "pos": []
    },
    {
      "value": [
        "#333",
      ],
      "pos": [
        "50%"
      ]
    },
    {
      "value": [
        "#eee",
      ],
      "pos": [
        "75%"
      ]
    },
    {
      "value": [
        "#333",
      ],
      "pos": [
        "75%"
      ]
    },
  ]
},

)
})
