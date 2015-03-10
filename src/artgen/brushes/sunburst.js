ARTGEN.addBrush('sunburst', {
    init: function() {
		
		this.generation1 = 25;
		
		this.minThickness = 1;
		this.minOpacity = 0.01;
		this.around = [];
		this.flying = [];
		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		
		/** Delayers **/
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		
		/** Angle **/
		this.angAcc = 0;
		this.minAngAcc = -20;
		this.maxAngAcc = 20;
		this.angAccSmooth = 10000;
		this.initAngSpeed = 0.007;
		this.minAngSpeed = 0.001;
		this.maxAngSpeed = 0.007;
		this.angSpeedNaturalDecrease = 0.001;// Additive, 0.01 is huge
		
		/** Radius **/
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 30;//px
		this.minRspeed = -3;
		this.maxRspeed = 3;
		this.rSpeedNaturalDecrease = 0.3;// Multiplicator Should remain [0,1] 0.3 is very very high
		
		/** Simulated expressiveness **/
		this.expCounter = 0;
		this.expressivenessVar = 500;
		this.expressiveness = 0.5;

    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data == 0) {
			this.silenceCounter++;
		} else if (data == 1) {
			this.speakingCounter++;
		} else {}
		
		if (this.silenceCounter >= this.silenceCountMax) {
			this.angAcc--;
			this.repulsion--;
			if(this.angAcc <= this.minAngAcc) {
				this.angAcc = this.minAngAcc;
			}
			if(this.repulsion <= this.minRep) {
				this.repulsion = this.minRep;
			}
			this.silenceCounter = 0;
			
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.angAcc++;
			this.repulsion++;
			if(this.angAcc >= this.maxAngAcc) {
				this.angAcc = this.maxAngAcc;
			}
			if(this.repulsion >= this.maxRep) {
				this.repulsion = this.maxRep;
			}
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness();
		this.naturalRepulsionDecrease();
		//var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));// 1 in ?
		var howMany = Math.floor(Math.random()*(1+0.08));// 1 in ?
		this.feed(howMany);
		this.detach(howMany);
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
		
		this.feed(this.generation1);
    },
	simulateExpressiveness: function() {
		this.expCounter++;
		// Full range
		//this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Low values
		//this.expressiveness = 0.2 + 0.2*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Highvalues with sunburst effect
		//this.expressiveness = 0.8 + 0.2*1/5*Math.floor(5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Full range with sunburst effect
		this.expressiveness = 0.5 + 0.5*1/3*Math.floor(3*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius * (0.35 + 0.65 * this.expressiveness);
		var angle = 2*Math.PI*Math.random();
		this.around.push({
			r: rad,
			rLast: rad,
			rSpeed: 0,
			ang: angle,
			angLast: angle,
			angSpeed: this.initAngSpeed,
			way: way
		});
	},
	moveBullets: function(canvas) {
		// In around
		for (key in this.around) {
			// Whay way will motion happen?
			if (this.around[key].way == "clockwise") {
				var multip = -1;
			} else if (this.around[key].way == "anticlockwise") {
				var multip = 1;
			}
			else { console.log('No way'); }
			
			/** Angle **/
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.angAcc / this.angAccSmooth);
			// Natural decrease (additive)
			this.around[key].angSpeed -= this.angSpeedNaturalDecrease;
			// Well, careful
			this.around[key].angSpeed = Math.min(Math.max(this.around[key].angSpeed, this.minAngSpeed), this.maxAngSpeed);
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
			/** Radius **/
			// New radius with repulsion
			// Memorize last r (if you don't, the brush becomes 'vortex')
			//this.around[key].rLast = this.around[key].r;
			this.around[key].rSpeed += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
			// Natural decrease (multiplicative)
			this.around[key].rSpeed *= (1 - this.rSpeedNaturalDecrease);
			// Careful!
			this.around[key].rSpeed = Math.min(Math.max(this.around[key].rSpeed, this.minRspeed), this.maxRspeed);
			
			this.around[key].r += this.around[key].rSpeed;
		}
		/*
		// In flying
		for (key2 in this.flying) {
			//keep the bullet within the canvas
			if (this.around[key].x > canvas.width) {
				this.around[key].x = canvas.width;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);
			}
			if (this.around[key].y > canvas.height) {
				this.around[key].y = canvas.height;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].x < 0) {
				this.around[key].x = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].y < 0) {
				this.around[key].y = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);			
			}
		}
		*/
	},
	drawBullets: function(ctx) {
		/*ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();*/
		
		for (key in this.around) {
			var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			var expander = Math.sqrt(this.around[key].r/30);
			var opa = this.minOpacity * expander;
			ctx.strokeStyle = "rgba(255,255,255,"+opa+")";
			ctx.lineWidth = this.minThickness * expander;
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.stroke();
		}
		/*
		for (key2 in this.flying) {
			ctx.beginPath();
			ctx.moveTo(this.bullets[key].xLast,this.bullets[key].yLast);
			ctx.lineTo(this.bullets[key].x,this.bullets[key].y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		*/
	},
	feed: function(howMany){
		// Add bullets to around array
		for (var i = 0; i < howMany; i++) {
			this.addBullet("anticlockwise");
		}
	},
	detach: function(howMany) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
		/*
			newFlyer.x = 
			newFlyer.y = 
			newFlyer.xLast = 
			newFlyer.yLast = 
			newFlyer.xTarget = 
			newFlyer.yTarget = 
			newFlyer.mass = 
		*/
			this.flying.push(newFlyer);
		}
	},
});