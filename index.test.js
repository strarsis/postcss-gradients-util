
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




// Linear gradients
//   values

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
    "angle": [],
    "endingShape": [],
    "position": [],
    "sideOrCorner": [
      "to",
      "right"
    ],
    "size": [],
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
    "angle": [],
    "endingShape": [],
    "position": [],
    "sideOrCorner": [
      "to",
      "left"
    ],
    "size": [],
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
    "angle": [],
    "endingShape": [],
    "position": [],
    "sideOrCorner": [],
    "size": [],
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
    "angle": [],
    "endingShape": [],
    "position": [],
    "sideOrCorner": [],
    "size": [],
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
    "angle": [
      "123deg",
    ],
    "endingShape": [],
    "position": [],
    "sideOrCorner": [],
    "size": [],
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




// Radial gradients
//   values

it('collects angle and gradient stops of a very simple radial gradient example with only gradient stops', async () => {
  await runValues(

`
#e66465, #9198e5
`,

{
  "config": {
    "angle": [],
    "endingShape": [],
    "position": [],
    "sideOrCorner": [],
    "size": [],
  },
  "colorStops": [
    {
      "value": [
        "#e66465",
      ],
      "pos": []
    },
    {
      "value": [
        "#9198e5",
      ],
      "pos": []
    }
  ]
},

)
})

it('collects angle and gradient stops of a very simple radial gradient example with only gradient stops with some positions (color-hints)', async () => {
  await runValues(

`
yellow 10%, red 50%, blue 80%
`,

{
  "config": {
    "angle": [],
    "endingShape": [],
    "position": [],
    "sideOrCorner": [],
    "size": [],
  },
  "colorStops": [
    {
      "value": [
        "yellow",
      ],
      "pos": [
        "10%"
      ]
    },
    {
      "value": [
        "red",
      ],
      "pos": [
        "50%"
      ]
    },
    {
      "value": [
        "blue",
      ],
      "pos": [
        "80%"
      ]
    }
  ]
},

)
})

it('collects angle and gradient stops of a very simple radial gradient example with position and ending-shape (circle at)', async () => {
  await runValues(

`
  circle at 100%, #333, #333 50%, #eee 75%, #333 75%
`,

{
  "config": {
    "angle": [],
    "endingShape": [
      "circle",
    ],
    "position": [],
    "sideOrCorner": [],
    "size": [
      "at 100%",
    ],
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

it('collects angle and gradient stops of a very simple radial gradient example with only an ending shape', async () => {
  await runValues(

`
  circle at 100%, #333, #333 50%, #eee 75%, #333 75%
`,

{
  "config": {
    "angle": [],
    "endingShape": [
      "circle",
    ],
    "position": [],
    "sideOrCorner": [],
    "size": [
      "at 100%",
    ],
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




// Conic gradients
//   values



