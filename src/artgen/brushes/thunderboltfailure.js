ARTGEN.addBrush('thunderboltfailure', {
    init: function() {
		
		this.generation1 = 350;
		this.beamOpacity = 0.1;
		this.fallingParticlesOpacity = 0.05;
		this.birthRate = 2.4;
		this.deathRateBasis = 1.6;
		this.spokenRateToDeathRate = 0.1;
		this.energyToPositronRadiusRate = 10;
		this.inverseOfStickiness = 0.002;
		this.minAngleDeg = -90;
		this.maxAngleDeg = 90;
		
		/** Particle arrays **/
		this.bolts = [];
		this.bolts.push([]);
		this.lightfalls = [];
		this.lightfalls.push([]);
		
		/** Delayers **/
		// Only for spoken rate
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		// Required for expressiveness and energy as well if real data
		
		/** Spoken rate **/
		this.spokenRate = 25;
		this.minSpokenRate = 0;
		this.maxSpokenRate = 50;
		
		/** Expressiveness **/
		this.expressiveness = 0.5;
		this.expCounter = 0;
		this.expressivenessVar = 500;
		
		/** Energy **/
		this.energy = .5;
		this.energyCounter = 0;
		this.energyVar = 1000;
		
		/** Positrons **/
		this.positrons = [
			{
				x: null,
				y: null,
				xSpeed: null,
				ySpeed: null,
				r: null
			}
		];
		
		this.splitOnce = 1;
    },
    update: function(canvas, ctx, data) {
		
		// Plugged on channel 4 with silence data, 0 or 1
		if (typeof data == "undefined" || data[0] == null || data == null) {
			return;
		}
		if (data[0] == 0) { this.silenceCounter++; }
		else if (data[0] == 1) { this.speakingCounter++; }
		
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
		this.simulateExpressiveness();
		this.simulateEnergy();
		//this.expBuffer.push(this.expressiveness);
		
		var births = Math.floor(Math.random()*(1 + this.birthRate));// 1 in ?
		var deaths = Math.floor(Math.random()*(1 + this.deathRateBasis + this.spokenRate * this.spokenRateToDeathRate));// 1 in ?
		
		// Life! :D
		this.feed(births);
		
		// Kill particles only if there are some left...
		if (this.bolts[0].length > deaths) { this.detach(deaths); }
		if (this.spokenRate == this.maxSpokenRate && this.splitOnce == 1) {
			this.splitBolt(0);
			this.splitOnce = 0;
		}
		this.movePositrons(canvas);
		this.moveElectrons(canvas);
		
    },
    draw: function(ctx) {
        this.drawElectrons(ctx);
    },
    start: function(ctx, canvas, extraArgs) {
		// For the brush thunderbolt, extraArgs = [{Number}]
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
		
		this.positrons[0].x = 0;
		this.positrons[0].y = canvas.height * extraArgs[0];
		this.positrons[0].xSpeed = 0;
		this.positrons[0].ySpeed = 0;
		this.positrons[0].speed = 0.5;
		this.positrons[0].r = 5;
		
		this.feed(this.generation1);
    },
	simulateExpressiveness: function() {
		this.expCounter++;
		this.expressiveness = 0.5 + 0.4 * Math.sin(2*Math.PI*this.expCounter/this.expressivenessVar) * Math.sin(55/67*Math.PI*this.expCounter/this.expressivenessVar);
		
	},
	simulateEnergy: function() {
		this.energyCounter++;
		this.energy = 0.5 + 0.4 * Math.sin(2*Math.PI*this.energyCounter/this.energyVar) * Math.cos(2/8.5*Math.PI*this.energyCounter/this.energyVar);
	},
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
			var positronSpeedAng = 2*Math.PI/360 * ( this.minAngleDeg + (this.maxAngleDeg - this.minAngleDeg) * this.expressiveness );
			
			positron.xSpeed = positron.speed * Math.cos(positronSpeedAng); 
			positron.ySpeed = positron.speed * Math.sin(positronSpeedAng); 
			positron.x += positron.xSpeed;
			positron.y += positron.ySpeed;
			positron.r = this.energyToPositronRadiusRate * this.energy;
		}
	},
	moveElectrons: function(canvas) {
		
		// In bolts
		for (var boltKey = 0; boltKey < this.bolts.length; boltKey++) {
		
			var bolt = this.bolts[boltKey];
			var positron = this.positrons[boltKey];
			
			for (var key2 = 0; key2 < bolt.length; key2++) {
				var electron = bolt[key2];
				electron.xLast = electron.x;
				electron.yLast = electron.y;
				
				// Spread the air electrons in the whole positron radius effect
				electron.xSpeed = positron.xSpeed;
				electron.ySpeed = positron.ySpeed;
				electron.x += electron.xSpeed;
				electron.y += electron.ySpeed;
				
				// Keep it in the positron's area defined by positron current radius
				var newDistToPositronCenter = Math.sqrt(Math.pow(electron.x - positron.x, 2) + Math.pow(electron.y - positron.y, 2));
				var toReduceBy = newDistToPositronCenter / positron.r;
				electron.x  = positron.x + (electron.x - positron.x)/toReduceBy;
				electron.y  = positron.y + (electron.y - positron.y)/toReduceBy;
				
				// Don't forget last positions, otherwise ugly lines
				electron.xLast  = positron.x + (electron.xLast - positron.x)/toReduceBy;
				electron.yLast  = positron.y + (electron.yLast - positron.y)/toReduceBy;
				
			}
		}
		
		// In lightfalls
		for (var key3 = 0; key3 < this.lightfalls.length; key3++) {
			var self = this;
			(function(key3clo) {
				var positron = self.positrons[key3];
				for (var key4 = 0; key4 < self.lightfalls[key3clo].length; key4++) {
					(function(key4clo) {
						var electron = self.lightfalls[key3clo][key4clo];
						
						electron.xLast = electron.x;
						electron.yLast = electron.y;
						
						// Extra force so that they still follow the shape of the main beam
						var attractor = (electron.y - positron.y) / 100;
						
						// "Gravity", the farther the particle from the beam, the higher the 'repulsion'
						electron.ySpeed += self.inverseOfStickiness * attractor;
						
						// Motion
						electron.xSpeed = positron.xSpeed;
						electron.x += electron.xSpeed;
						
						// Intermediate y coordinate, will always be translated by the positron's y coordinate
						electron.yDist += electron.ySpeed;
						electron.y = positron.y + electron.yDist;
						
						// Kill electrons that reach the edges of the canvas
						if (electron.x > canvas.width || electron.y > canvas.height || electron.x < 0 || electron.y < 0) {
							self.lightfalls[key3clo].splice(key4clo, 1);
						}
					})(key4);
				}
			})(key3);
		}
		
	},
	drawElectrons: function(ctx) {
		// In bolts
		for (var boltKey2 = 0; boltKey2 < this.bolts.length; boltKey2++) {
			var bolt = this.bolts[boltKey2];
			for (var key5 = 0; key5 < bolt.length; key5++) {
				var electron = bolt[key5];
				ctx.strokeStyle = "rgba(255, 255, 255, " + this.beamOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
		
		// In lightfalls
		for (var key6 = 0; key6 < this.lightfalls.length; key6++) {
			var fall = this.lightfalls[key6];
			for (var key7 = 0; key7 < fall.length; key7++) {
				var electron = fall[key7];
				ctx.strokeStyle = "rgba(255, 255, 255, " + this.fallingParticlesOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
	},
	feed: function(howMany) {
		for (var boltKey3 = 0; boltKey3 < this.bolts.length; boltKey3++) {
			var bolt = this.bolts[boltKey3];
			var positron = this.positrons[boltKey3];
			for (var i = 0; i < howMany; i++) {
				var angle = 2 * Math.PI * Math.random();
				var r = positron.r;
				// Particles added at the limit of the positron's area (its radius)
				this.addElectron(boltKey3, positron.x + r * Math.cos(angle), positron.y + r * Math.sin(angle), positron.xSpeed, positron.ySpeed);
			}
		}
	},
	detach: function(howMany) {
		var self = this;
		for (var i = 0; i < this.bolts.length; i++) {
			(function(iClo) {
				for (var j = 0; j < howMany; j++) {
					self.lightfalls[iClo].push(self.bolts[iClo].shift());
				}
			})(i);
		}
	},
	splitBolt: function(boltKey) {
		
		var positron = this.positrons[boltKey];
		
		// Create new bolt, new fall and new positron
		this.bolts.push([]);
		this.lightfalls.push([]);
		this.positrons.push({
			x: positron.x,
			y: positron.y + 30,
			xSpeed: positron.xSpeed,
			ySpeed: positron.ySpeed,
			r: positron.r
		});
		
		// Fill them with half the content of the boltKey'th bolt and fall
		for (var i = 0; i < Math.floor(this.bolts[boltKey].length / 2); i++) {
			this.bolts[this.bolts.length - 1].push(this.bolts[boltKey].shift());
		}
		for (var j = 0; j < Math.floor(this.lightfalls[boltKey].length / 2); j++) {
			var what = {};
			jQuery.extend(true, what, this.lightfalls[boltKey].shift() );
			console.log(what);
			/*this.lightfalls[this.lightfalls.length - 1].push({
				x: what.x,
				xLast: what.xLast,
				y: what.y,
				yLast: what.yLast,
				xSpeed: what.xSpeed,
				ySpeed: what.ySpeed,
				yDist: what.yDist
			});*/
			this.lightfalls[this.lightfalls.length - 1].push(what);
			console.log(this.lightfalls[this.lightfalls.length - 1][this.lightfalls[this.lightfalls.length - 1].length - 1]);// WTF!?
			//this.lightfalls[boltKey].push( jQuery.extend({}, this.lightfalls[boltKey].shift()) );
		}
	}
});