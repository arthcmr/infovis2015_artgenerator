ARTGEN.addBrush('thunderbolt', {
    init: function() {
		
		this.generation1 = 200;
		this.minThickness = 1;
		this.minOpacity = 0.04;
		this.minOpacityBackground = 0.0035;
		this.birthRate = 0.06;
		
		this.air = [];
		this.falling = [];
		this.gravity = 0.02;
		
		/** Delayers **/
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		
		/** Repulsion **/
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 30;//px
		this.minRspeed = -3;
		this.maxRspeed = 3;
		
		/** Expressiveness **/
		this.expressiveness = 0.5;
		this.expBuffer = [];
		this.expBufferSize = 50;
		
		this.expCounter = 0;
		this.expressivenessVar = 500;
		
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
		
		if (this.expBuffer.length >= this.expBufferSize) { this.expBuffer.shift(); }
		//this.expBuffer.push(parseFloat(data[1]));
		this.simulateExpressiveness();
		this.expBuffer.push(this.expressiveness);
		
		var births = Math.floor(Math.random()*(1 + this.birthRate));// 1 in ?
		var deaths = Math.floor(Math.random()*(1 + this.repulsion/150));// 1 in ?
		
		this.feed(births);
		if (this.air.length > deaths) { this.detach(deaths); }
		
		this.movePositron(canvas);
		this.moveElectrons(canvas);
		/*console.log("Positron", this.positronX);
		console.log("buffer", this.expBuffer.length);
		console.log("air", this.air.length);
		console.log("falling", this.falling.length);*/
		
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
		this.positronSpeedX = 0.5;
		this.positronSpeedY = 0;
		this.positronRad = 10;
		
		this.feed(this.generation1);
    },
	simulateExpressiveness: function() {
		this.expCounter++;
		// Full range
		this.expressiveness = 0.5 + 0.4*Math.sin(2*Math.PI*this.expCounter/this.expressivenessVar)*Math.sin(55/67*Math.PI*this.expCounter/this.expressivenessVar);
		
	},
	addElectron: function(x, y, xSpeed, ySpeed) {
		this.air.push({
			x: x,
			xLast: x,
			y: y,
			yLast: y,
			xSpeed: xSpeed,
			ySpeed: ySpeed
		});
	},
	movePositron: function(canvas) {
		var expAvg = 0;
		for (key in this.expBuffer) {
			expAvg += this.expBuffer[key];
		}
		expAvg /= this.expBuffer.length;
		this.positronSpeedY += this.expressivenessInfluence * (expAvg - this.expressivenessThreshold);
		this.positronX += this.positronSpeedX;
		this.positronY += this.positronSpeedY;
	},
	moveElectrons: function(canvas) {
	
		// In air
		for (key in this.air) {
			var electron = this.air[key];
			electron.xLast = electron.x;
			electron.yLast = electron.y;
			electron.x += this.positronSpeedX;
			electron.y += this.positronSpeedY;
			electron.xSpeed = this.positronSpeedX;
			electron.ySpeed = this.positronSpeedY;
		}
		
		// In falling
		for (key2 in this.falling) {
			var electron = this.falling[key2];
			
			electron.xLast = electron.x;
			electron.yLast = electron.y;
			
			// Gravity
			electron.ySpeed += this.gravity;
			electron.x += electron.xSpeed;
			electron.y += electron.ySpeed;
			
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
			ctx.lineWidth = 2;
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