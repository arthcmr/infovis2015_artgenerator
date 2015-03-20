ARTGEN.addBrush('thunderbolt', {
    init: function() {
		
		this.generation1perBolt = 20;// Times the number of beams in bolts[]
		this.boltsNb = 10;
		this.beamOpacity = 0.05;
		this.fallingParticlesOpacity = 0.025;
		this.birthRate = 2.0;
		this.deathRateBasis = 1.6;
		this.spokenRateToDeathRate = 0.1;
		this.energyToPositronRadiusRate = 5;// Max rad will be 5
		this.inverseOfStickiness = 0.02;
		this.minAngleDeg = -90;
		this.maxAngleDeg = 90;
		
		this.bolts = [];// Will contain arrays
		this.falling = [];// Will contain arrays
		this.boltsNb;
		
		/** Delayers **/
		// Only for spoken rate
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		// Required for expressiveness and energy as well if real data
		
		/** spokenRate **/
		this.spokenRate = 0;
		this.minSpokenRate = 0;
		this.maxSpokenRate = 50;
		
		/** Expressiveness **/
		this.expressiveness = 0.5;
		this.expCounter = 0;
		this.expressivenessVar = 500;
		
		/** Energy **/
		this.energy = .5;
		this.energyCounter = 0;
		this.energyVar = 500;
		
		/** Positrons **/
		this.positrons = [];
		
		this.splitThisBolt = 0;

    },
    update: function(canvas, ctx, data, color) {


    	this.expressiveness = data[0]/100; //getting 0 to 100
    	this.energy = data[1]/100; //getting 0 to 100
    	this.silence = data[2]; //value in ms

		// Plugged on channel 4 with silence data, 0 or 1
		// if (typeof data == "undefined" || data[0] == null || data == null) {
		// 	return;
		// }

		if (this.silence > 0) { this.silenceCounter++; }
		else if (this.silence == 0) { this.speakingCounter++; }
		
		if (this.silenceCounter >= this.silenceCountMax) {
			this.silenceCounter = 0;
			this.spokenRate--;
			if (this.spokenRate <= this.minSpokenRate) { this.spokenRate = this.minSpokenRate; }
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.speakingCounter = 0;
			this.spokenRate++;
			if (this.spokenRate >= this.maxSpokenRate) { this.spokenRate = this.maxSpokenRate; }
		}
		
		//if (this.expBuffer.length >= this.expBufferSize) { this.expBuffer.shift(); }
		//this.expBuffer.push(parseFloat(data[1]));
		// this.simulateExpressiveness();
		// this.simulateEnergy();
		//this.expBuffer.push(this.expressiveness);
		
		var births = Math.floor(Math.random()*(1 + this.birthRate));// 1 in ?
		var deaths = Math.floor(Math.random()*(1 + this.deathRateBasis + this.spokenRate * this.spokenRateToDeathRate));// 1 in ?
		
		// Life! :D
		this.feed(births);
		
		// Kill particles only if there are some left...
		if (this.bolts[0].length > deaths) { this.detach(deaths); }
		if (this.spokenRate >= this.maxSpokenRate / 3) {
			// Detach early (1/3) otherwise too few particles in bolts afterwards
			this.splitBolt(this.splitThisBolt);
			this.splitThisBolt++;
			this.splitThisBolt %= this.boltsNb;
			// Back to 0
			this.spokenRate = this.minSpokenRate;
		}
		
		this.movePositrons(canvas);
		this.moveElectrons(canvas); 
    },
    draw: function(ctx, color) {

    	this.color = color;
        this.drawElectrons(ctx, color);
    },
    start: function(ctx, canvas, extraArgs) {
		// For the brush thunderbolt, extraArgs == [{Number}, {Number}, {String}]
		// ctx.rect(0, 0, canvas.width, canvas.height);
		// ctx.fillStyle = "black";
		// ctx.fill();
		
		var xStart = extraArgs[0] * canvas.width;
		var yStart = extraArgs[1] * canvas.height;
		var way = extraArgs[2];

		this.maxX = canvas.width;
		this.maxY = canvas.height;
		
		for (var i = 0; i < this.boltsNb; i++) {
			this.bolts.push([]);
			this.falling.push([]);
			this.positrons.push({
				x: xStart,
				y: yStart,
				xSpeed: null,
				ySpeed: null,
				speed: 0.5,
				r: 5,
				way: way,
				angleOffset: 0
			});
		}
		
		this.feed(this.generation1perBolt);
    },
	// simulateExpressiveness: function() {
	// 	this.expCounter++;
	// 	this.expressiveness = 0.5 + 0.4 * Math.sin(2*Math.PI*this.expCounter/this.expressivenessVar) * Math.sin(55/67*Math.PI*this.expCounter/this.expressivenessVar);
		
	// },
	// simulateEnergy: function() {
	// 	this.energyCounter++;
	// 	this.energy = 0.5 + 0.4 * Math.sin(2*Math.PI*this.energyCounter/this.energyVar) * Math.cos(2/8.5*Math.PI*this.energyCounter/this.energyVar);
	// },
	addElectron: function(boltKey, x, y, xSpeed, ySpeed) {
		this.bolts[boltKey].push({
			x: x,
			xLast: x,
			y: y,
			yLast: y,
			xSpeed: xSpeed,
			ySpeed: ySpeed,
			yDist: 0
		});
	},
	movePositrons: function(canvas) {
		for (var key1 = 0; key1 < this.positrons.length; key1++) {
			var positron = this.positrons[key1];
			// Angle in desired range. If expressiveness remains around 0.5, the bolt with hore an horizontal overall motion
			// var positronSpeedAng = 2*Math.PI/360 * ( this.minAngleDeg + (this.maxAngleDeg - this.minAngleDeg) * this.expressiveness ) + positron.angleOffset;

			//TODO: Understand Why these angles
			var positronSpeedAng = 2*Math.PI/360 * ( 60 + this.minAngleDeg + (this.maxAngleDeg - this.minAngleDeg) * this.expressiveness ) + positron.angleOffset;
			
			// Left or right? Can be improved, using directly angle launch from painter parameter
			positronSpeedAng += (positron.way == "right" ? 0 : Math.PI);
			
			positron.xSpeed = positron.speed * Math.cos(positronSpeedAng); 
			positron.ySpeed = positron.speed * Math.sin(positronSpeedAng); 
			positron.x += positron.xSpeed;
			positron.y += positron.ySpeed;

			//TODO: Check if this makes sense
			positron.x = (positron.x > this.maxX || positron.x < 0) ? positron.x % this.maxX : positron.x;
			positron.y = (positron.y > this.maxY || positron.y < 0) ? positron.y % this.maxY : positron.y;

			positron.r = this.energyToPositronRadiusRate * this.energy;
		}
	},
	moveElectrons: function(canvas) {
	
		// In bolts
		for (boltKey in this.bolts) {
			var positron = this.positrons[boltKey];
			for (key in this.bolts[boltKey]) {
				var electron = this.bolts[boltKey][key];
				electron.xLast = electron.x;
				electron.yLast = electron.y;
				var distToPositronCenter = Math.sqrt(Math.pow(electron.x - positron.x, 2) + Math.pow(electron.y - positron.y, 2));
				// Spread the bolts electrons in the whole positron radius effect
				electron.xSpeed = positron.xSpeed; //+ 0.01 * Math.random() * Math.max(this.positronRad - distToPositronCenter, 0);
				electron.ySpeed = positron.ySpeed; //+ 0.01 * Math.random() * Math.max(this.positronRad - distToPositronCenter, 0);
				electron.x += electron.xSpeed;
				electron.y += electron.ySpeed;
				var newDistToPositronCenter = Math.sqrt(Math.pow(electron.x - positron.x, 2) + Math.pow(electron.y - positron.y, 2));
				var toReduceBy = newDistToPositronCenter / positron.r;
				electron.x  = positron.x + (electron.x - positron.x)/toReduceBy;
				electron.y  = positron.y + (electron.y - positron.y)/toReduceBy;
				// Don't forget last positions, otherwise ugly lines
				electron.xLast  = positron.x + (electron.xLast - positron.x)/toReduceBy;
				electron.yLast  = positron.y + (electron.yLast - positron.y)/toReduceBy;
				
			}
		}
		
		// In falling
		for (key2 in this.falling) {
			var positron = this.positrons[key2];
			for (key3 in this.falling[key2]) {
				var electron = this.falling[key2][key3];
				
				electron.xLast = electron.x;
				electron.yLast = electron.y;
				
				// Extra force so that the still follow the shape of the main beam
				//var attractor = (electron.y > this.positronY ? electron.y - this.positronY : 0);
				var attractor = (electron.y - positron.y) / 100;
				//electron.ySpeed += this.positronSpeedY / 10;
				
				// "Gravity"
				electron.ySpeed += this.inverseOfStickiness * attractor;
				
				// Motion
				electron.xSpeed = positron.xSpeed;
				electron.x += electron.xSpeed;
				//electron.y += electron.ySpeed;
				//electron.yDist *= 1 + this.inverseOfStickiness;
				electron.yDist += electron.ySpeed;
				
				electron.y = positron.y + electron.yDist;
				
				// Kill electrons that reach the edges of the canvas
				if (electron.x > canvas.width || electron.y > canvas.height || electron.x < 0 || electron.y < 0) {
					this.falling[key2].splice(key3, 1);
				}
			}
		}
		
	},
	drawElectrons: function(ctx, color) {

		// In bolts
		for (key in this.bolts) {
			for (key2 in this.bolts[key]) {
				var electron = this.bolts[key][key2];
				ctx.strokeStyle = "rgba("+ this.color.join(",") +", " + this.beamOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
		
		// In falling
		for (key3 in this.falling) {
			for (key4 in this.falling[key3]) {
				var electron = this.falling[key3][key4];
				ctx.strokeStyle = "rgba("+ this.color.join(",") +", " + this.fallingParticlesOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
	},
	feed: function(howMany) {
		for (key in this.bolts) {
			var positron = this.positrons[key];
			for (var i = 0; i < howMany; i++) {
				var angle = 2 * Math.PI * Math.random();
				var r = positron.r;
				// Particles added at the limit of the positron's area (its radius)
				this.addElectron(key, positron.x + r * Math.cos(angle), positron.y + r * Math.sin(angle), positron.xSpeed, positron.ySpeed);
			}
		}
	},
	detach: function(howMany) {
		for (key in this.bolts) {
			for (var i = 0; i < howMany; i++) {
				this.falling[key].push(this.bolts[key].shift());
			}
		}
	},
	splitBolt: function(boltKey) {
		// Preserve symmetry
		var multip = (this.positrons[boltKey].way == "right" ? 1 : -1);
		var tearApartBy = 1/8 * Math.PI * (this.positrons[boltKey].ySpeed > 0 ? multip : -multip);
		this.positrons[boltKey].angleOffset += tearApartBy;
	}
});