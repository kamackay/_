/* constant values */

const E = { x: .5, y: .5, z: -.5 }
const viewWindow = { ul: { x: 0, y: 1, z: 0 }, ll: { x: 0, y: 1, z: 0 }, ur: { x: 1, y: 1, z: 0 }, lr: { x: 1, y: 1, z: 0 } }
const lights = [{ location: { x: 2, y: 4, z: -.5 }, ambient: [1, 1, 1], diffuse: [1, 1, 1], specular: [1, 1, 1] }];
/* classes */

// Color constructor
class Color {
    constructor(r, g, b, a) {
        try {
            if ((typeof (r) !== 'number') || (typeof (g) !== 'number') || (typeof (b) !== 'number') || (typeof (a) !== 'number'))
                throw 'color component not a number'
            else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
                throw 'color component less than 0'
            else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
                throw 'color component bigger than 255'
            else {
                this.r = r
                this.g = g
                this.b = b
                this.a = a
            }
        } // end try
        catch (e) {
            console.log(e)
        }
    } // end Color constructor

    // Color change method
    change(r, g, b, a) {
        try {
            if ((typeof (r) !== 'number') || (typeof (g) !== 'number') || (typeof (b) !== 'number') || (typeof (a) !== 'number'))
                throw 'color component not a number'
            else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
                throw 'color component less than 0'
            else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
                throw 'color component bigger than 255'
            else {
                this.r = r
                this.g = g
                this.b = b
                this.a = a
            }
        } // end throw
        catch (e) {
            console.log(e)
        }
    } // end Color change method
} // end color class

/* utility functions */

//Math Functions that can be performed on Vecors
const vectorMath = {
    dotProduct: function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    },
    magnitude: function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z + v.z)
    },
    minus: function (v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
    }, normalize: function (v) {
        const mag = this.magnitude(v);
        return normV = { x: v.x / mag, y: v.y / mag, z: v.z / mag };
    }
}


// draw a pixel at x,y using color
function drawPixel(imagedata, x, y, color) {
    try {
        if ((typeof (x) !== 'number') || (typeof (y) !== 'number'))
            throw 'drawpixel location not a number'
        else if ((x < 0) || (y < 0) || (x >= imagedata.width) || (y >= imagedata.height))
            throw 'drawpixel location outside of image'
        else if (color instanceof Color) {
            var pixelindex = (y * imagedata.width + x) * 4
            imagedata.data[pixelindex] = color.r
            imagedata.data[pixelindex + 1] = color.g
            imagedata.data[pixelindex + 2] = color.b
            imagedata.data[pixelindex + 3] = color.a
        } else
            throw 'drawpixel color is not a Color'
    } // end try
    catch (e) {
        console.log(e)
    }
} // end drawPixel

// draw random pixels
function drawRandPixels(context) {
    var c = new Color(0, 0, 0, 0); // the color at the pixel: black
    var w = context.canvas.width
    var h = context.canvas.height
    var imagedata = context.createImageData(w, h)
    const PIXEL_DENSITY = 0.01
    var numPixels = (w * h) * PIXEL_DENSITY

    // Loop over 1% of the pixels in the image
    for (var x = 0; x < numPixels; x++) {
        c.change(Math.random() * 255, Math.random() * 255,
            Math.random() * 255, 255) // rand color
        drawPixel(imagedata,
            Math.floor(Math.random() * w),
            Math.floor(Math.random() * h),
            c)
    } // end for x
    context.putImageData(imagedata, 0, 0)
} // end draw random pixels

// get the input spheres from the standard class URL
function getInputSpheres() {
    const INPUT_SPHERES_URL =
        'https://ncsucgclass.github.io/prog1/spheres.json'; // https://ncsucgclass.github.io/prog1/spheres.json

    // load the spheres file
    var httpReq = new XMLHttpRequest() // a new http request
    httpReq.open('GET', INPUT_SPHERES_URL, false) // init the request
    httpReq.send(null) // send the request
    var startTime = Date.now()
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now() - startTime) > 3000)
            break
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log * ('Unable to open input spheres file!')
        return String.null
    } else
        return JSON.parse(httpReq.response)
} // end get input spheres

/**
 * Draws the circles using ray tracing
 * 
 * calcLight parameter, if set to true, will determine the color based on the lights in the environment
 */
function drawAllPixels(context, calcLight = false) {
    var inputSpheres = getInputSpheres()
    var w = context.canvas.width;
    var c = new Color(0, 0, 0, 255)
    var h = context.canvas.height
    var imagedata = context.createImageData(w, h)
    const pixelCount = w * h
    if (inputSpheres != String.null) {
        for (var i = 0; i < pixelCount; i++) {
            const x = Math.floor(i % w),
                y = Math.floor(i / w)
            for (var s = 0; s < inputSpheres.length; s++) {
                //check to see if this pixel would encounter any of the circles
                const cir = inputSpheres[s]
                var calc = {
                    circle: cir,
                    r: cir.r,
                    C: {
                        x: cir.x, y: cir.y, z: cir.z
                    },
                    E: E,
                    P: {
                        x: x / w, y: 1 - (y / h), z: 0
                    }
                    //y = 1 - y/h in order to render the world right-side up
                }
                calc.D = vectorMath.minus(calc.P, calc.E)
                calc.e_min_c = vectorMath.minus(calc.E, calc.C)
                calc.a = vectorMath.dotProduct(calc.D, calc.D)
                calc.b = 2 * vectorMath.dotProduct(calc.D, calc.e_min_c)
                calc.c = vectorMath.dotProduct(calc.e_min_c, calc.e_min_c) - calc.r * calc.r
                calc.dis = calc.b * calc.b - 4 * calc.a * calc.c;
                if (calc.dis >= 0) {
                    //Color the pixel with the data from the circle
                    if (calcLight) {
                        //Use the lights to calculate the lighting
                    } else {
                        c.change(
                            cir.diffuse[0] * 255,
                            cir.diffuse[1] * 255,
                            cir.diffuse[2] * 255,
                            255) // rand color
                    }
                    drawPixel(imagedata, x, y, c)
                    break;
                    //Breaking here seems to improve runtime, and since none of the circles overlap, I'll keep it for now
                }
            }
        }
        context.putImageData(imagedata, 0, 0)
    }
}

/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas and context
    var canvas = document.getElementById('viewport')
    var context = canvas.getContext('2d')
    drawAllPixels(context)
}