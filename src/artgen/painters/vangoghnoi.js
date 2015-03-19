//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('vangoghnoi', {

    /* =============== META INFORMATION ================= */

    title: "Van Goghnoi",
    description: "Using veronoi diagrams to express speech",
    tags: ["energy", "color", "expressiveness"],

    // determine, in order, what the data values are used for
    data_values: [{
        description: "determines when a point will be added",
        options: ["silence", "zcr", "rms", "spectralCentroid", "spectralSlope", "spectralSpread", "energy", "spectralRolloff", "spectralKurtosis", "spectralSkewness", "loudness", "perceptualSpread", "perceptualSharpness"]

        //all possible
    }, {
        description: "used for X position",
        options: ["emotion", "energy", "mfcc", "spectralCentroid", "spectralSlope", "spectralSpread", "spectralRolloff", "spectralKurtosis", "spectralSkewness", "loudness", "perceptualSpread", "perceptualSharpness"]
    }, {
        description: "used for Y position",
        options: ["intensity", "speed", "zcr", "rms", "spectralCentroid", "spectralSlope", "spectralSpread", "mfcc", "spectralRolloff", "spectralKurtosis", "spectralSkewness", "loudness", "perceptualSpread", "perceptualSharpness"]
    }, {
        description: "used for color",
        options: ["intensity", "speed", "emotion", "perceptualSpread", "loudness", "spectralCentroid", "spectralSlope", "spectralSpread", "mfcc", "spectralRolloff", "spectralKurtosis", "spectralSkewness", "rms", "perceptualSpread", "perceptualSharpness"]
    }],

    //extra visual options
    options: {
        color1: {
            name: "Color 1",
            description: "used for determine the first color",
            options: ["blue", "red", "purple", "monochrome", "green", "orange", "gold", "*"]
        },
        color2: {
            name: "Color 2",
            description: "used for determine the second",
            options: ["green", "red", "blue", "purple", "monochrome", "orange", "gold", "*"]
        },
        size: {
            name: "Size",
            description: "initial size",
            options: ["100", "50", "200"]
        },
        style: {
            name: "Style",
            description: 'Style of this paiting',
            options: ['fill', "stroke"]
        },
        intervals: {
            name: "Intervals",
            description: 'Draw Intervals?',
            options: ['no', "yes"]
        },
        composition: {
            name: "Composition",
            description: 'Composition type',
            options: ['source-over', "darker"]
        }
    },


    /* =============== IMPLEMENTATION ================= */

    brushes: ['veronoi'],

    paint: function(time, data) {

        function formatColor(rgbArray, alph) {
            if (!alph) alph = 0.08;
            return "rgba(" + rgbArray.join(',') + "," + alph.toString() + ")";
        }

        function interpolateColors(rgb1, rgb2, percentage) {
            var res = [];
            for (var i = 0; i < 3; i++) {
                res[i] = Math.round(rgb1[i] + ((rgb2[i] - rgb1[i]) * percentage));
            }
            return res;
        }

        var brush = this.brushes[0];

        var max_x = this.canvas.width,
            max_y = this.canvas.height,
            center_x = this.canvas.width / 2,
            center_y = this.canvas.height / 2,
            target_x = data[1] / 100 * max_x || 0,
            target_y = data[2] / 100 * max_y || 0;

        if (!this._instantiated) {
            this.first_time = time;
        }

        if (!this._instantiated) {


            var color = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            this.ctx.globalCompositeOperation = this.options.composition;

            if (this.options.style === 'fill') {
                this.color1 = randomColor({
                    hue: this.options.color1,
                    format: 'rgbArray'
                });

                this.color2 = randomColor({
                    hue: this.options.color2,
                    format: 'rgbArray'
                });
            } else {
                this.color1 = randomColor({
                    hue: this.options.color1,
                    format: 'rgbArray',
                    luminosity: 'dark'
                });

                this.color2 = randomColor({
                    hue: this.options.color2,
                    format: 'rgbArray',
                    luminosity: 'dark'
                });
            }
            
            brush.setColor(formatColor(this.color1));
            brush.start(target_x, target_y);
            brush.addRandom(this.options.size);

            this._instantiated = true;
            this._prevData = 1;
            if (this.options.intervals === "yes") {
                brush.enable();
            }
        }

        // for (var i = 0; i < flocks.length; i++) {
        //     var color = (data) ? this.colorDark1 : this.colorLight1;
        //     flocks[i].setColor(color);
        // }

        // var color = "rgba(255,255,255,0.)";
        // this.ctx.beginPath();
        // this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.fillStyle = color;
        // this.ctx.fill();

        // target_x2 -= (!data * max_width);

        //data 0 is used for adding points

        if (this._prevData !== 0 && data[0] === 0) {
            //not silent
            if (this.options.intervals === "no") {
                brush.enable();
            }
        } else if (this._prevData === 0 && data[0] !== 0) {
            //now its silent
            if (this.options.intervals === "no") {
                // brush.clearAll();
                // brush.addRandom(this.options.size);
                brush.addPoint();
                brush.disable();
            }
        }
        this._prevData = data[0];

        var change = (data[3] / 100);
        if(change > 1) change = 1;
        if(change < 0) change = 0;

        var color = interpolateColors(this.color1, this.color2, change);

        if (this.options.intervals === "yes" && data[0] > 0) {
            color = [255,255,255];
        }


        // var color = "rgba(255,255,255,0.001)";
        // this.ctx.beginPath();
        // this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.fillStyle = color;
        // this.ctx.fill();

        //data 3 is used for color scale

        brush.setStyle(this.options.style);
        var alpha = (this.options.style === 'fill') ? 0.08 : 0.1;
        brush.setColor(formatColor(color, alpha));
        brush.setTarget(target_x, target_y);
        brush.update();
        brush.draw();
    }
});