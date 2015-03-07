//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('circle', {
    brushes: ['marker' /*, 'flock', 'hairy'*/ ],
    paint: function(time, data) {

        if (!this._instantiated) {
            this.first_time = time;
            this.brushes = _.shuffle(this.brushes);
            this.posX = [];
            this.posY = [];
            for (var i = 0; i < this.brushes.length; i++) {
                this.brushes[i]._settings.BOIDS = _.random(20, 50);
            };
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

        var target_x = (Math.cos(time_variance % (2 * Math.PI)) * max_height) + center_x,
            target_y = (Math.sin(time_variance % (2 * Math.PI)) * max_height) + center_y;

        if (!this._instantiated) {
            this.color = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var colorLight = [
                [89, 3, 3],
                [220, 220, 220]
            ];
            var colorDark = [
                [209, 13, 13],
                [35, 35, 35]
            ];
            this.colorLight1 = 'rgba(' + colorLight[0].join(',') + ',0.1)';
            this.colorLight2 = 'rgba(' + colorLight[1].join(',') + ',0.1)';
            this.colorDark1 = 'rgba(' + colorDark[0].join(',') + ',0.1)';
            this.colorDark2 = 'rgba(' + colorDark[1].join(',') + ',0.1)';

            //initial positions and colors based on silence
            for (var i = 0; i < flocks.length; i++) {
                flocks[i].setColor(this.colorLight1);
                flocks[i].start(target_x, target_y);
                flocks[i].enable();
            };

            this._instantiated = true;
        }

        for (var i = 0; i < flocks.length; i++) {
            var color = (data) ? this.colorDark1 : this.colorLight1;
            flocks[i].setColor(color);
        }

        // this.color = "rgba(255,255,255,0.1)";
        // this.ctx.beginPath();
        // this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.fillStyle = this.color;
        // this.ctx.fill();

        // target_x2 -= (!data * max_width);

        for (var i = 0; i < flocks.length; i++) {
            flocks[i].setTarget(target_x, target_y);
            flocks[i].update();
            flocks[i].draw();
        }

    }
});