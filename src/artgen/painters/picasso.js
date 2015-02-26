//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('picasso', {
    brushes: ['flock', 'spray', 'hairy', 'hairy', 'flock', 'spray', 'flock', 'flock', 'spray', 'hairy'],
    paint: function(time, data) {

        if (!this._instantiated) {
            this.first_time = time;
            this.brushes = _.shuffle(this.brushes);
            this.posX = [];
            this.posY = [];
            for (var i = 0; i < this.brushes.length; i++) {
                this.brushes[i]._settings.BOIDS = _.random(20,50);
                this.posX[i] = Math.random();
                this.posY[i] = Math.random();
            };
        }


        var flocks = [];
        for (var i = 0; i < this.brushes.length; i++) {
            flocks[i] = this.brushes[i];
        };
        half = flocks.length / 2;

        //margins improve quality
        margin = 50;
        min_x = margin;
        max_x = this.canvas.width - margin;
        max_width = max_x - min_x;
        min_y = margin;
        max_y = this.canvas.height - margin;
        max_height = max_y - min_y;

        //x is time, y is random

        var y = (time - this.first_time) / 100;

        var target_x2 = min_x + (data * max_width),
            target_y2 = min_y + y;

        if (!this._instantiated) {
            this.color = "#FFFCEF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var colorLight = [
                [89,3,3],
                [220, 220, 220]
            ];
            var colorDark = [
                [209,13,13],
                [35, 35, 35]
            ];
            this.colorLight1 = 'rgba(' + colorLight[0].join(',') + ',0.1)';
            this.colorLight2 = 'rgba(' + colorLight[1].join(',') + ',0.1)';
            this.colorDark1 = 'rgba(' + colorDark[0].join(',') + ',0.1)';
            this.colorDark2 = 'rgba(' + colorDark[1].join(',') + ',0.1)';

            //initial positions and colors based on silence
            for (var i = 0; i < flocks.length; i++) {
                var first, c, posX, posY, v;
                first = !(i < half);
                v = this.posX[i] * max_width;
                v2 = this.posY[i] * max_height;
                posX = (first) ? this.canvas.width - target_x2 - v : target_x2 + v;
                posY = target_y2 + v2;

                flocks[i].setColor(this.colorLight1);
                flocks[i].start(posX, posY);
                flocks[i].enable();
            };

            this._instantiated = true;
        }

        for (var i = 0; i < flocks.length; i++) {
            var color = (data) ? this.colorDark1 : this.colorLight1;
            flocks[i].setColor(color);
        }

        target_x2 -= (!data * max_width);

        for (var i = 0; i < flocks.length; i++) {
            var first, posX, posY, half, v;
            first = !(i < half);

            v = this.posX[i] * max_width;
            v2 = this.posY[i] * max_height;

            posX = (first) ? this.canvas.width - target_x2 - v : target_x2 + v;
            posY = target_y2 + v2;

            //go back
            var back = (Math.floor(posY / max_height) % 2 !== 0);
            if (posY > max_height && back) {
                posY = max_height - (posY % max_height);
            } else if (posY > max_height) {
                posY = posY % max_height;
            }

            flocks[i].setTarget(posX, posY);
            flocks[i].update();
            flocks[i].draw();
        }

    }
});