//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('circle', {

    /* =============== META INFORMATION ================= */

    title: "Circle",
    description: "The ephemeral nature of speech represented through deformed rings",
    tags: ["energy", "color", "expressiveness"],

    // determine, in order, what the data values are used for
    data_values: [{
        description: "used for the 1st and 3rd brushes",
        options: ["rms", "energy","perceptualSharpness"]
    }, {
        description: "used for the 2nd and 5th brushes",
        options: ["perceptualSharpness", "rms", "energy"]
    }, {
        description: "used for the 4th brush",
        options: ["energy", "rms", "perceptualSharpness"]
    }],

    //extra visual options
    options: {
        color: {
            name: "Color",
            description: "used for determine the color palette",
            options: ["red", "blue", "purple", "monochromatic", "green", "orange", "gold", "*"]
        }
    },


    /* =============== IMPLEMENTATION ================= */

    brushes: ['flock', 'flock', 'flock', 'flock', 'flock'],

    _calcPos: function(func, time, data, order, radius, reference) {
        func = Math[func];
        return func(time % (2 * Math.PI)) * (radius / 3 + (data * 50 * (order * 0.5 + 1)) * 3) + reference;
    },

    paint: function(time, data) {

        if (!this._instantiated) {
            this.first_time = time;
            this.brushes = _.shuffle(this.brushes);
        }

        var flocks = [];
        for (var i = 0; i < this.brushes.length; i++) {
            flocks[i] = this.brushes[i];
        };

        var margin, min_x, max_x, min_y, max_y,
            max_width, max_height, center_x, center_y,
            length, zero_x, zero_y;
        //margins improve quality
        margin = 50;
        min_x = margin;
        max_x = this.canvas.width - margin;
        max_width = max_x - min_x;
        min_y = margin;
        max_y = this.canvas.height - margin;
        max_height = max_y - min_y;
        center_x = this.canvas.width / 2;
        center_y = this.canvas.height / 2,
            length = flocks.length;

        var time_var = (time - this.first_time) / 1000;

        var radius = max_height / 2;
        zero_x = this._calcPos('cos', time_var, 0, 0, radius, center_x);
        zero_y = this._calcPos('sin', time_var, 0, 0, radius, center_y);


        var targets = [];
        for (var i = 0; i < length; i++) {
            var p = new Vector();
            var d = data[i] || 0;
            p.x = this._calcPos('cos', time_var, d, i, radius, center_x);
            p.y = this._calcPos('sin', time_var, d, i, radius, center_y);
            targets.push(p);
        }

        if (!this._instantiated) {
            this.color = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            function formatColors(rgbArray) {
                var c = [];
                for (var i = 0; i < rgbArray.length; i++) {
                    c.push("rgba(" + rgbArray[i].join(',') + ",0.1)");
                };
                return c;
            }

            this.colors = formatColors(randomColor({
                hue: this.options.color,
                format: 'rgbArray',
                count: 5
            }));

            //initial positions and colors based on silence
            for (var i = 0; i < flocks.length; i++) {
                flocks[i].setColor(this.colors[i]);
                flocks[i].start(targets[i].x, targets[i].y);
                flocks[i].enable();
            };

            this._instantiated = true;
        }

        // for (var i = 0; i < flocks.length; i++) {
        //     var color = (data) ? this.colorDark1 : this.colorLight1;
        //     flocks[i].setColor(color);
        // }

        var color = "rgba(255,255,255,0.001)";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // target_x2 -= (!data * max_width);

        for (var i = 0; i < flocks.length; i++) {
            if (targets[i].x === zero_x && targets[i].y === zero_y) {
                flocks[i].disable();
            } else {
                flocks[i].enable();
            }

            flocks[i].setTarget(targets[i].x, targets[i].y);
            flocks[i].update();
            flocks[i].draw();
        }

    }
});