//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('gogh', {
	brushes: ['flock'],
    paint: function(time, data) {

    	if(!this._instantiated) {
    		this.first_time = time;
    	}

        var flock = this.getBrush(0);

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

    	var target_x = min_x + x, target_y = min_y + (data * max_height);

    	if(!this._instantiated) {
    		this.color = "#F1F1EA";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var color1 = randomColor({hue: 'red', luminosity: 'dark', format: 'rgbArray'});
            var color2 = randomColor({hue: 'blue', luminosity: 'dark', format: 'rgbArray'});
            var color3 = randomColor({hue: 'red', luminosity: 'dark', format: 'rgbArray'});
            var color4 = randomColor({hue: 'blue', luminosity: 'dark', format: 'rgbArray'});

            this.color1 = 'rgba('+color1.join(',')+',0.2)';
            this.color2 = 'rgba('+color2.join(',')+',0.2)';
            this.color3 = 'rgba('+color3.join(',')+',0.2)';
            this.color4 = 'rgba('+color4.join(',')+',0.2)';

    		flock.setColor(this.color1);
    		flock.start(target_x, target_y);
	    	flock.enable();
    		this._instantiated = true;

	    	this._prevData = data;

    	}

    	if(data > this._prevData && !back) {
    		flock.setColor(this.color1);
    	}
    	else if(data > this._prevData && back) {
    		flock.setColor(this.color3);
    	}
    	else if(data < this._prevData && !back) {
    		flock.setColor(this.color2);
    	}
    	else if(data < this._prevData && back) {
    		flock.setColor(this.color4);
    	}
	
		this._prevData = data;    	 

    	flock.setTarget(target_x, target_y);
    	flock.update();
    	flock.draw();
    }
})