//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('strains', {
    brushes: ['line'],


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

        //map brushes to values
        var mappings = ['energy', 'energy2', 'energy', 'energy2', 'energy'];
            var targets = [];


        if (!this._instantiated) {
            this._prevData = { energy: 0, silence: 0, energy2: 0};
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

            for (var i = 0; i < length; i++) {
                var p = new Vector();
                var d = data[mappings[i]] || 0;
                p.x = center_x;
                p.y = center_y;
                targets.push(p);
            }

            this.colors = formatColors([
                [6, 43, 104],
                [10, 21, 117],
                [8, 95, 127],
                [8, 6, 114],
                [4, 71, 99]
            ]);

            //initial positions and colors based on silence
            for (var i = 0; i < flocks.length; i++) {
                flocks[i].setColor(this.colors[i]);
                flocks[i].start(targets[i].x, targets[i].y);
                flocks[i].enable();
            };

            this._instantiated = true;
        } else {
            for (var i = 0; i < length; i++) {
                var p = new Vector();
                var d = data[mappings[i]] || 0;
                p.x = max_width * data.silence;
                p.y = -100;
                targets.push(p);
            }
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
        var diff = Math.abs(data.energy - this._prevData.energy);


        for (var i = 0; i < flocks.length; i++) {
            
            if(diff > 0.2) console.log(diff);
            var s = flocks[i]._settings;
            if(diff > 0.2) {
                s.MAX_SPEED = 3;
                s.DESIRED_SEPARATION = diff * 100000;
                s.TARGET_FORCE = 0;
            } else {
                s.MAX_SPEED = 3;
                s.DESIRED_SEPARATION = diff * 100000;
                s.TARGET_FORCE = 2000;
            }

            flocks[i].setTarget(targets[i].x, targets[i].y);
            flocks[i].update();
            flocks[i].draw();
        }

        this._prevData = _.clone(data);

    }
});