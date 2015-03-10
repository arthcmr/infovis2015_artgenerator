//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('circle', {
    brushes: ['ink', 'ink' /*, 'flock', 'hairy'*/ ],
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
            max_width, max_height, center_x, center_y;
        //margins improve quality
        margin = 50;
        min_x = margin;
        max_x = this.canvas.width - margin;
        max_width = max_x - min_x;
        min_y = margin;
        max_y = this.canvas.height - margin;
        max_height = max_y - min_y;
        center_x = this.canvas.width / 2;
        center_y = this.canvas.height / 2;

        var time_variance = (time - this.first_time) / 1000;

        var target_x = (Math.cos(time_variance % (2 * Math.PI)) * (max_height / 2 + (50 - data) * 3)) + center_x,
            target_y = (Math.sin(time_variance % (2 * Math.PI)) * (max_height / 2 + (50 - data) * 3)) + center_y;

        var target_x2 = (Math.cos(time_variance % (2 * Math.PI)) * (max_height / 2 + (50 - data) * 3)) + center_x,
            target_y2 = (Math.sin(time_variance % (2 * Math.PI)) * (max_height / 2 + (50 - data) * 3)) + center_y;

        if (!this._instantiated) {
            this.color = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var color1 = randomColor({
                hue: 'blue',
                format: 'rgbArray'
            });
            var color2 = randomColor({
                hue: 'red',
                format: 'rgbArray'
            });
            this.colors = ['rgba(' + color1.join(',') + ',0.1)', 'rgba(' + color2.join(',') + ',0.1)'];

            //initial positions and colors based on silence
            for (var i = 0; i < flocks.length; i++) {
                flocks[i].setColor(this.colors[i]);
                if (i === 1) {
                    flocks[i].start(target_x2, target_y2);

                } else {
                    flocks[i].start(target_x, target_y);
                }
                flocks[i].enable();
            };

            this._instantiated = true;
        }

        // for (var i = 0; i < flocks.length; i++) {
        //     var color = (data) ? this.colorDark1 : this.colorLight1;
        //     flocks[i].setColor(color);
        // }

        // this.color = "rgba(255,255,255,0.1)";
        // this.ctx.beginPath();
        // this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.fillStyle = this.color;
        // this.ctx.fill();

        // target_x2 -= (!data * max_width);

        for (var i = 0; i < flocks.length; i++) {
            if (i === 1) {
                flocks[i].setTarget(target_x2, target_y2);

            } else {
                flocks[i].setTarget(target_x, target_y);

            }
            flocks[i].update();
            flocks[i].draw();
        }

    }
});