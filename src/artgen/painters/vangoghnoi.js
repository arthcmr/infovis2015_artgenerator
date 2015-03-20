//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('vangoghnoi', {

    /* =============== META INFORMATION ================= */

    title: "Van Goghnoi",
    description: "Using veronoi diagrams to express speech",
    tags: ["energy", "color", "expressiveness"],

    // determine, in order, what the data values are used for
    data_values: [{
        description: "determines when a point will be added",
        options: ["silence", "emotion", "intensity", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]

        //all possible
    }, {
        description: "used for X position",
        options: ["emotion", "intensity", "silence", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }, {
        description: "used for Y position",
        options: ["intensity", "emotion", "silence", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }, {
        description: "used for color",
        options: ["intensity", "emotion", "silence", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }],

    //extra visual options
    options: {
        color1: {
            name: "Color 1",
            description: "used for determine the first color",
            options: ["green", "red", "orange", "yellow", "blue", "purple", "pink", "monochrome"]
        },
        color2: {
            name: "Color 2",
            description: "used for determine the second",
            options: ["red", "green", "orange", "yellow", "blue", "purple", "pink", "monochrome"]
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

        function easeIn(t, d) {
            t /= d;
            return d * t * t * t;
        };

        function easeOut(t, d) {
            t /= d;
            t--;
            return d * (t * t * t + 1);
        };

        function easeOutIn(t, d) {
            var half = d / 2;
            if (t <= half) {
                return easeOut(t, half);
            } else {
                return half + easeIn((t - half), half);
            }
        }

        var max_x = this.canvas.width,
            max_y = this.canvas.height,
            center_x = this.canvas.width / 2,
            center_y = this.canvas.height / 2,
            target_x = easeOutIn(data[1], 100) / 100 * max_x || 0,
            target_y = easeOutIn(data[2], 100) / 100 * max_y || 0,
            ratio_x = 1;
            ratio_y = 1;

            target_x = target_x * 1/ratio_x;
            target_y = target_y * 1/ratio_y;

        if (!this._instantiated) {
            this.first_time = time;
        }

        if (!this._instantiated) {


            var color = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // this.ctx.globalCompositeOperation = 'source-over';

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
            brush.addRandom(200);

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
        if (change > 1) change = 1;
        if (change < 0) change = 0;

        var color = interpolateColors(this.color1, this.color2, change);

        if (this.options.intervals === "yes" && data[0] > 0) {
            color = [255, 255, 255];
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

        //only move if not silent when drawing 
        if (this.options.intervals !== "yes" || data[0] === 0) {
            brush.setTarget(target_x, target_y);
        }
        brush.update();
        brush.draw();
    }
});