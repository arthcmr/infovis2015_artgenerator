//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('picasso', {
    brushes: ['flock', 'flock'],
    paint: function(time, data) {

        if(!this._instantiated) {
            this.first_time = time;
        }

        var flock = this.getBrush(0);
        var flock2 = this.getBrush(1);

        //margins improve quality
        margin = 50;
        min_x = margin;
        max_x = this.canvas.width - margin;
        max_width = max_x - min_x;
        min_y = margin;
        max_y = this.canvas.height - margin;
        max_height = max_y - min_y;

        //x is time, y is random

        var x = (time - this.first_time) / 100;

        //go back
        var back = (Math.floor(x/max_width)%2 !== 0);
        if(x > max_width && back ) {
            x = max_width - (x % max_width);
        }
        else if(x > max_width) {
            x = x % max_width;
        }

        //for flock 2 its the oposite
        var y = x;

        //go back
        var back = (Math.floor(y/max_height)%2 !== 0);
        if(y > max_height && back ) {
            y = max_height - (y % max_height);
        }
        else if(y > max_height) {
            y = y % max_height;
        }

        var target_x = min_x + x, target_y = min_y + (data * max_height);
        var target_x2 = min_x + (data * max_width), target_y2 = min_y + y;

        if(!this._instantiated) {
            this.color = "#F1F1EA";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var color1 = randomColor({hue: 'orange', luminosity: 'dark', format: 'rgbArray'});
            var color2 = randomColor({hue: 'monochrome', luminosity: 'dark', format: 'rgbArray'});
            var color3 = randomColor({hue: 'red', luminosity: 'dark', format: 'rgbArray'});

            this.color1 = 'rgba('+color1.join(',')+',0.1)';
            this.color2 = 'rgba('+color2.join(',')+',0.2)';
            this.color3 = 'rgba('+color3.join(',')+',0.1)';

            flock.setColor(this.color1);
            flock.start(target_x, target_y);
            flock2.setColor(this.color2);
            flock2.start(this.canvas.width - target_x2, target_y2);
            flock.enable();
            flock2.enable();
            this._instantiated = true;

            this._prevData = data;

        }

        if(data > this._prevData) {
            flock.setColor(this.color1);
        }
        else if(data < this._prevData) {
            flock.setColor(this.color3);
        }
    
        this._prevData = data;       

        flock.setTarget(target_x, target_y);
        flock.update();
        flock.draw();

        flock2.setTarget(this.canvas.width - target_x2, target_y2);
        flock2.update();
        flock2.draw();
    }
})