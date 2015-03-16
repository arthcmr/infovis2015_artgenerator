ARTGEN.addBrush('thunderbolt', {
    init: function() {
		
		this.generation1 = 350;
		this.minThickness = 1;
		this.minOpacity = 0.0015;
		this.minOpacityBackground = 0.0035;
		this.birthRate = 2.4;
		this.deathRateBasis = 1.6;
		this.repulsionToDeathRate = 0.1;
		
		this.air = [];
		this.falling = [];
		this.inverseOfStickiness = 0.002;
		
		/** Delayers **/
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		
		/** Repulsion **/
		this.repulsion = 25;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 30;//px
		this.minRspeed = -3;
		this.maxRspeed = 3;
		
		/** Expressiveness **/
		this.expressiveness = 0.5;
		//this.expBuffer = [];
		//this.expBufferSize = 50;
		this.expCounter = 0;
		this.expressivenessVar = 500;
		
		/** Energy **/
		this.energy = .5;
		this.energyCounter = 0;
		this.energyVar = 1000;
		
		/** Positron **/
		this.positronX;
		this.positronY;
		this.positronSpeedX;
		this.positronSpeedY;
		this.positronRad;
		this.expressivenessInfluence = 0.01;
		this.expressivenessThreshold = 0.5;

    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined" || data[0] == null) {
			return;
		}
		if (data[0] == 0) { this.silenceCounter++; }
		else if (data[0] == 1) { this.speakingCounter++; }
		
		if (this.silenceCounter >= this.silenceCountMax) {
			this.silenceCounter = 0;
			this.repulsion--;
			if (this.repulsion <= this.minRep) { this.repulsion = this.minRep; }
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.speakingCounter = 0;
			this.repulsion++;
			if (this.repulsion >= this.maxRep) { this.repulsion = this.maxRep; }
		}
		
		//if (this.expBuffer.length >= this.expBufferSize) { this.expBuffer.shift(); }
		//this.expBuffer.push(parseFloat(data[1]));
		this.simulateExpressiveness();
		this.simulateEnergy();
		//this.expBuffer.push(this.expressiveness);
		
		var births = Math.floor(Math.random()*(1 + this.birthRate));// 1 in ?
		var deaths = Math.floor(Math.random()*(1 + this.deathRateBasis + this.repulsion * this.repulsionToDeathRate));// 1 in ?
		
		this.feed(births);
		if (this.air.length > deaths) { this.detach(deaths); }
		
		this.movePositron(canvas);
		this.moveElectrons(canvas);
		
    },
    draw: function(ctx) {
        this.drawElectrons(ctx);
    },
    start: function(ctx, canvas,data) {
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
		
		this.positronX = 0;
		this.positronY = canvas.height/2;
		this.positronSpeedX = 0;
		this.positronSpeedY = 0;
		this.positronSpeed = 0.5;
		
		this.positronRad = 5;
		
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
	addElectron: function(x, y, xSpeed, ySpeed) {
		this.air.push({
			x: x,
			xLast: x,
			y: y,
			yLast: y,
			xSpeed: xSpeed,
			ySpeed: ySpeed,
			yDist: 0
		});
	},
	movePositron: function(canvas) {
		//var expAvg = 0;
		//for (key in this.expBuffer) {
		//	expAvg += this.expBuffer[key];
		//}
		//expAvg /= this.expBuffer.length;
		//var positronSpeedAng = 2*Math.PI * ( -1/4 + 1/2 * this.expressivenessInfluence * (expAvg - this.expressivenessThreshold) );
		var positronSpeedAng = 2*Math.PI * ( -1/4 + 1/2 * this.expressiveness );
		this.positronSpeedX = this.positronSpeed * Math.cos(positronSpeedAng); 
		this.positronSpeedY = this.positronSpeed * Math.sin(positronSpeedAng); 
		this.positronX += this.positronSpeedX;
		this.positronY += this.positronSpeedY;
		
		this.positronRad = 10 * this.energy;
	},
	moveElectrons: function(canvas) {
	
		// In air
		for (key in this.air) {
			var electron = this.air[key];
			electron.xLast = electron.x;
			electron.yLast = electron.y;
			var distToPositronCenter = Math.sqrt(Math.pow(electron.x - this.positronX, 2) + Math.pow(electron.y - this.positronY, 2));
			// Spread the air electrons in the whole positron radius effect
			electron.xSpeed = this.positronSpeedX; //+ 0.01 * Math.random() * Math.max(this.positronRad - distToPositronCenter, 0);
			electron.ySpeed = this.positronSpeedY; //+ 0.01 * Math.random() * Math.max(this.positronRad - distToPositronCenter, 0);
			electron.x += electron.xSpeed;
			electron.y += electron.ySpeed;
			var newDistToPositronCenter = Math.sqrt(Math.pow(electron.x - this.positronX, 2) + Math.pow(electron.y - this.positronY, 2));
			var toReduceBy = newDistToPositronCenter / this.positronRad;
			electron.x  = this.positronX + (electron.x - this.positronX)/toReduceBy;
			electron.y  = this.positronY + (electron.y - this.positronY)/toReduceBy;
			// Don't forget last positions, otherwise ugly lines
			electron.xLast  = this.positronX + (electron.xLast - this.positronX)/toReduceBy;
			electron.yLast  = this.positronY + (electron.yLast - this.positronY)/toReduceBy;
			
		}
		
		// In falling
		for (key2 in this.falling) {
			var electron = this.falling[key2];
			
			electron.xLast = electron.x;
			electron.yLast = electron.y;
			
			
			
			// Extra force so that the still follow the shape of the main beam
			//var attractor = (electron.y > this.positronY ? electron.y - this.positronY : 0);
			var attractor = (electron.y - this.positronY) / 100;
			//electron.ySpeed += this.positronSpeedY / 10;
			
			// "Gravity"
			electron.ySpeed += this.inverseOfStickiness * attractor;
			
			// Motion
			electron.xSpeed = this.positronSpeedX;
			electron.x += electron.xSpeed;
			//electron.y += electron.ySpeed;
			//electron.yDist *= 1 + this.inverseOfStickiness;
			electron.yDist += electron.ySpeed;
			
			electron.y = this.positronY + electron.yDist;
			
			// Kill electrons that reach the edges of the canvas
			if (electron.x > canvas.width || electron.y > canvas.height || electron.x < 0 || electron.y < 0) {
				this.falling.splice(key2, 1);
			}
			
		}
		
	},
	drawElectrons: function(ctx) {
		// In air
		for (key in this.air) {
			var electron = this.air[key];
			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(electron.xLast, electron.yLast);
			ctx.lineTo(electron.x, electron.y);
			ctx.stroke();
		}
		
		// In falling
		for (key2 in this.falling) {
			var electron = this.falling[key2];
			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(electron.xLast, electron.yLast);
			ctx.lineTo(electron.x, electron.y);
			ctx.stroke();
		}
	},
	feed: function(howMany) {
		for (var i = 0; i < howMany; i++) {
			var angle = 2 * Math.PI * Math.random();
			var r = this.positronRad;
			this.addElectron(this.positronX + r * Math.cos(angle), this.positronY + r * Math.sin(angle), this.positronSpeedX, this.positronSpeedY);
		}
	},
	detach: function(howMany) {
		for (var i = 0; i < howMany; i++) {
			this.falling.push(this.air.shift());
		}
	},
});