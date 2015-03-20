ARTGEN.addPainter('zeus', {

    /* =============== META INFORMATION ================= */

    title: "Poseidon",
    description: "Reflecting the peregrinating nature of conversations, these cascading curtains of hair-fine droplets slowly develop into a beautiful meandering river",
    tags: ["particles", "flow"],

    // determine, in order, what the data values are used for
    data_values: [{
        description: "determines the angle",
        options: ["intensity", "silence", "emotion", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    },
    {
        description: "determines the radius",
        options: ["energy", "silence", "emotion", "intensity", "speed", "rms", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    },
    {
        description: "determines when particles die",
        options: ["silence", "emotion", "intensity", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }],

    //extra visual options
    options: {
        background: {
            name: "Background",
            description: "used for determine the background color",
            options: ["black", "green", "red", "orange", "yellow", "blue", "purple", "pink", "monochrome", "white"]
        },
        stroke: {
            name: "Stroke",
            description: "used for determine the foreground color",
            options: ["white", "red", "green", "orange", "yellow", "blue", "purple", "pink", "monochrome"]
        }
    },


    /* =============== IMPLEMENTATION ================= */


	brushes: ['thunderbolt'],
    paint: function(time, data) {
    	
        var bolt = this.getBrush(0);
    	// var bolt2 = this.getBrush(1);
    	
        if(!this._instantiated) {
            
            this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            if(this.options.background === "black" || this.options.background === "white") {
                this.ctx.fillStyle = this.options.background;
            }
            else {
                this.ctx.fillStyle = randomColor({ hue: this.options.background, luminosity: 'dark' });
            }
            this.ctx.fill();

            if(this.options.stroke === "black" || this.options.stroke === "white") {
                this.color = (this.options.stroke === "white") ? [255,255,255] : [0,0,0];
            }
            else {
                var luminosity = (this.options.background === "white") ? 'dark' :  'light';
                this.color = randomColor({ hue: this.options.stroke, luminosity: luminosity, format:"rgbArray" });
            }

    		bolt.start(this.ctx, this.canvas, [0, 1/2, "right"]);
    		// bolt2.start(this.ctx, this.canvas, [1, 1/2, "left"]);
    		this._instantiated = true;
    	}
    	
        bolt.update(this.canvas, this.ctx, data);
    	bolt.draw(this.ctx, this.color);

		// bolt2.update(this.canvas, this.ctx, data);
  //   	bolt2.draw(this.ctx);
    }
})