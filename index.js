
function getGradientInfo(funcNode) {
    
    let gradient = createEmptyGradient();

    let inConfigPart = false,
        inStopsPart  = false;
    var curStop      = false;
    funcNode.each((node, nodeIndex) => {

		// entering (optional) side-or-corner/angle component
        if((isSideOrCornerNode(node) || isAngleNode(node)) && !inStopsPart) {
            inConfigPart = true;
        }

		// entering gradient stops component (that follows an (optional) side-or-corner/angle component)
        if(!inStopsPart && (isCommaNode(node) || isColorNode(node))) {
            inConfigPart = false;
            inStopsPart  = true;
        }


		// in side-or-corner/angle component
        if(inConfigPart && !isCommaNode(node)) {
            if(isSideOrCornerNode(node)) {
                gradient.config.sideOrCorner.push(node);
            } else if(isAngleNode(node)) {
                gradient.config.angle.push(node);
            }
        }

        
		// in gradient stops component
        if(inStopsPart) { // stops
            if(isCommaNode(node)) {
				// in next gradient stop
                if(curStop) {
                    gradient.colorStops.push(curStop);
                }
                curStop = createEmptyStop();
            } else {
                // in current gradient stop
                if(!curStop) {
                    curStop = createEmptyStop();
                }

                if(isColorNode(node)) { // (transparent not treated as color)
                    // color component of a gradient stop
                    curStop.value.push(node);
                } else {
                    // position component of a gradient stop
                    curStop.pos.push(node);
                }
            }
        }
    });
    gradient.colorStops.push(curStop); // last stop

    return gradient;
}


function createEmptyGradient() {
    return {
        config: {
            sideOrCorner: [], // linear gradient

            angle:        [], // linear gradient, conic gradient
            position:     [], // radial gradient, conic gradient

            endingShape:  [], // radial gradient
            size:         [], // radial gradient

        },
        colorStops: [], // linear gradient, conic gradient, radial gradient (linear-color-stop|color-hint)
    };
}

function createEmptyStop() {
    return {
        value: [], // color
        pos:   [], // position (for linear-color-stop, otherwise it is a color-hint)
    };
}


function isColorNode(node) {
	return (node.isColor || (node.type === 'word' && node.value === 'transparent'));
}

function isCommaNode(node) {
	return (node.type === 'punctuation' && node.value === ',');
}

function isSideOrCornerNode(node) {
    return (node.type === 'word' && !node.isColor);
}

const angularUnits = [ 'deg', 'grad', 'rad', 'turn', ];

function isAngleNode(node) {
    return (node.type === 'numeric' &&  angularUnits.includes(node.unit));
}


function walkGradientFuncs(values, cb) {
    values.walkFuncs((funcNode) => {
        if(!funcNode.name.includes('-gradient')) return;

        const type = 'linear';

        if(typeof cb === 'function' && !cb(funcNode, type)) {
            return;
        }
    });
}

function getGradients(values) {
    let gradients = [];
    walkGradientFuncs(values, (gradientFunc, type) => {
       const gradientInfo = getGradientInfo(gradientFunc);

       gradientInfo.type  = type;
       gradientInfo.func  = gradientInfo;
       gradients.push(gradientInfo);
    });
    return gradients;
}


function simplifyGradient(gradient) {
    let gradientSimplified = createEmptyGradient();

    for(const sideOrCorner of gradient.config.sideOrCorner) {
        gradientSimplified.config.sideOrCorner.push(sideOrCorner.toString())
    }

    for(const angle of gradient.config.angle) {
        gradientSimplified.config.angle.push(angle.toString())
    }

    
    for(const colorStop of gradient.colorStops) {
        let colorStopSimplified = {
            value: [],
            pos:   [],
        };

        for(const value of colorStop.value) {
        colorStopSimplified.value.push(value.toString());
        }

        for(const pos of colorStop.pos) {
        colorStopSimplified.pos.push(pos.toString());
        }

        gradientSimplified.colorStops.push(colorStopSimplified);
    }
    return gradientSimplified;
}

function simplifyGradients(gradients) {
    let gradientsSimplified = [];
    for(const gradient of gradients) {
        let gradientSimplified  = simplifyGradient(gradient);
        gradientSimplified.type = gradient.type;
        gradientsSimplified.push(gradientSimplified);
    }
    return gradientsSimplified;
}


module.exports.simplifyGradient  = simplifyGradient;
module.exports.simplifyGradients = simplifyGradients;

module.exports.walkGradientFuncs = walkGradientFuncs;

module.exports.getGradientInfo   = getGradientInfo;
module.exports.getGradients      = getGradients;
