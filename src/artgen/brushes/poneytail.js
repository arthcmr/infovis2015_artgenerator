ARTGEN.addBrush('poneytail', {
    init: function() {
		
		this.generation1 = 20;
		this.minThickness = 1;
		this.minOpacity = 0.04;
		this.minOpacityBackground = 0.0035;
		this.birthRate = 0.06;
		this.afterlifeOpacity = 0.012;
		this.afterlifeDecline = 0.008;
		
		this.RGBank = [
			[	// 0 - Violets
				[42, 87, 167],
				[100, 47, 120],
				[43, 51, 86],
				[7, 31, 70],
				[25, 18, 52],
				[45, 66, 134],
				[5, 11, 46]
			], [ // 1 - Dragons & fire
				[255, 147, 21],
				[24, 34, 36],
				[44, 23, 12],
				[72, 55, 52],
				[36, 37, 36],
				[203, 11, 6],
				[46, 47, 44],
				[16, 21, 19],
			], [ // 2 - Rainbow
				[255, 0, 0],
				[255, 127, 0],
				[255, 255, 0],
				[0, 255, 0],
				[0, 0, 255],
				[75, 0, 130],
				[143, 0, 255]
			], [ // 3 - Forest
				[106,64,28],
				[121,72,33],
				[97,58,26],
				[74,54,26],
				[29,30,10],
				[67,84,6],
				[205,213,140],
				[222,229,203],
				[167,180,84],
				[66,80,14],
				[94,110,33],
				[99,107,51],
				[86,98,55],
				[162,170,109],
				[169,181,157],
				
			]
		];
		this.activeRGBank = 1;// Change to explore other color sets
		
		this.around = [];
		this.flying = [];
		this.afterlife = [];

		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		this.maxDist = null;
		
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
		/*this.initAngSpeed = 0.0002;
		this.minAngSpeed = 0.0002;
		this.maxAngSpeed = 0.0006;*/
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

		/**Adjust Number of Particles**/
		this.hasAddedParticles=false;

    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data[0] == 0) {
		//if (data == 0) {
			this.silenceCounter++;
		} else if (data[0] == 1) {
		//} else if (data == 1) {
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
		
		this.simulateExpressiveness(data);
		this.naturalRepulsionDecrease();
		//var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));// 1 in ?
		var howMany = Math.floor(Math.random()*(1 + this.birthRate + this.expressiveness));// 1 in ?
		
		this.feed(howMany);
		this.detach(howMany);

		if (this.expressiveness > 0.6) {
			if(!this.hasAddedParticles) {
				this.detach(this.generation1 * 0.3);
				this.hasAddedParticles = true;
			}
		} else if (this.expressiveness < 0.5) {
			if (this.hasAddedParticles) {
				this.feed(this.generation1 * 0.3);
				this.hasAddedParticles = false;
			}
		}
				
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas,data) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		this.maxDist = 0.5 * Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
		/*ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();*/
		
		this.feed(this.generation1);
		
    },
	simulateExpressiveness: function(data) {
		this.expCounter++;
		// Full range
		//this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Low values
		//this.expressiveness = 0.2 + 0.2*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Highvalues with sunburst effect
		//this.expressiveness = 0.8 + 0.2*1/5*Math.floor(5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Full range with sunburst effect
		//this.expressiveness = 0.5 + 0.5*1/3*Math.floor(3*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Live data with sunburst effect
		this.expressiveness = 1/7 * Math.floor(7 * parseFloat(data[1]));
		//this.expressiveness = parseFloat(data[1]);
		// Blur the thresholds a little
		this.expressiveness += 0.02*Math.random();
		//console.log(this.expressiveness);
	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius * (0.2 + 0.8 * this.expressiveness);
		var angle = 2*Math.PI*Math.random();
		var colorIndex = Math.floor(Math.random() * this.RGBank[this.activeRGBank].length);
		this.around.push({
			r: rad,
			rLast: rad,
			rSpeed: 0,
			ang: angle,
			angLast: angle,
			angSpeed: this.initAngSpeed,
			way: way,
			rgb: this.RGBank[this.activeRGBank][colorIndex]
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
			// this.around[key].rLast = this.around[key].r;
			this.around[key].rSpeed += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
			// Natural decrease (multiplicative)
			this.around[key].rSpeed *= (1 - this.rSpeedNaturalDecrease);
			// Careful!
			this.around[key].rSpeed = Math.min(Math.max(this.around[key].rSpeed, this.minRspeed), this.maxRspeed);
			
			this.around[key].r += this.around[key].rSpeed;
			// Careful you too!
			this.around[key].r = Math.max(0, this.around[key].r);
		}
		
		// In flying
		for (key2 in this.flying) {
			
			var bullet = this.flying[key2];
			bullet.rLast = bullet.r;
			bullet.r += 15;
			bullet.x = this.bigCenterX + bullet.r * Math.cos(bullet.ang);
			bullet.y = this.bigCenterY + bullet.r * Math.sin(bullet.ang);
			bullet.xLast = this.bigCenterX + bullet.rLast * Math.cos(bullet.angLast);
			bullet.yLast = this.bigCenterY + bullet.rLast * Math.sin(bullet.angLast);
			//bullet.thickness = Math.pow(bullet.r / 125, 2.5);
			bullet.thickness = bullet.r/125;
			
			// Kill bullets that reach the edges of the canvas
			/*
			if (bullet.x > canvas.width) {
				bullet.x = canvas.width;
				bullet.edge = "right";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);
			}
			if (bullet.y > canvas.height) {
				bullet.y = canvas.height;
				bullet.edge = "bottom";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);				
			}
			if (bullet.x < 0) {
				bullet.x = 0;
				bullet.edge = "left";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);				
			}
			if (bullet.y < 0) {
				bullet.y = 0;
				bullet.edge = "top";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);			
			}
			*/
			if (bullet.x > canvas.width || bullet.y > canvas.height || bullet.x < 0 || bullet.y < 0) {
				bullet.x = 0;
				bullet.yy = Math.random();
				bullet.y = canvas.height * (0.4 + 0.2 * bullet.yy);
				// LifeSpan override
				//bullet.lifeSpan = 10 * Math.pow(Math.sin(2*Math.PI*bullet.yy), 2);
				bullet.lifeSpan = 10/2 * (1 - Math.cos(2*Math.PI*bullet.yy / 0.5));
				bullet.edge = "left";
				
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);
				
			}
			
		}
		
		// In afterlife
		for (key3 in this.afterlife) {
			var bullet = this.afterlife[key3];
			bullet.life -= this.afterlifeDecline; // Linear decrease
			
			var tail = this.poneyTail(bullet);
			var par = tail.par;
			var orth = tail.orth;
			
			// Grow
			if (bullet.edge == "top") {
				bullet.y += bullet.growth;
				bullet.y += orth;
				bullet.x += par;
			} else if (bullet.edge == "bottom") {
				bullet.y -= bullet.growth;
				bullet.y -= orth;
				bullet.x -= par;
			} else if (bullet.edge == "left") {
				bullet.x += bullet.growth;
				bullet.x += orth;
				bullet.y += par;
			} else if (bullet.edge == "right") {
				bullet.x -= bullet.growth;
				bullet.x -= orth;
				bullet.y -= par;
			}
			
			// If dead, die.
			if (bullet.life <= 0) {
				this.afterlife.splice(key3, 1);
			}
			
		}
		
	},
	poneyTail: function(bullet) {
		// Shape poneytail
		// Natural oscillators
		var calmDown1 = 5;
		var osc1 = Math.sin(2*Math.PI * bullet.life / (calmDown1 * bullet.afterlifeRandom1));
		var calmDown2 = 10;
		var osc2 = Math.sin(2*Math.PI * bullet.life / (calmDown2 * bullet.afterlifeRandom2));
		var calmDown3 = 5 + 7.5 * bullet.yy;
		var osc3 = Math.sin(2*Math.PI * bullet.life / (calmDown3));
		
		// Exponents
		var exponent = bullet.yy + 0.5; // Linear
		
		// Option 3
		var T = 3 * (1 + 8 * (bullet.yy - 0.5)*(bullet.yy - 0.5));
		var t = bullet.lifeSpan - bullet.life;
		var h = 0.5 * (- Math.cos(2*Math.PI*t/T));// Integral of sine function (because we sum up)
		
		var result = {
			// Orthogonal motion
			orth: 0,
			// Parallel motion
			//par: 0.2 * Math.pow(t, exponent)
			par: (bullet.yy < 0.5 ? -h : h)
		}
		
		return result;
	},
	drawBullets: function(ctx) {
		/*ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();*/
		
		// In around
		for (key in this.around) {
			//var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			//var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			//var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			//var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			var XYR = this.deform(this.around[key]);
			var xLast = XYR.xLast;
			var yLast = XYR.yLast;
			var x = XYR.x;
			var y = XYR.y;
			var expander = Math.sqrt(this.around[key].r/30);
			var opa = this.minOpacity * expander;
			var rgb = this.around[key].rgb;
			ctx.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.lineWidth = this.minThickness * expander;
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.stroke();
		}
		
		// In flying
		/*for (key2 in this.flying) {
			var expander = Math.sqrt(this.flying[key2].r/30);
			var opa = this.minOpacityBackground * expander * this.expressiveness;
			var rgb = this.flying[key2].rgb;
			
			ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(this.flying[key2].x, this.flying[key2].y, this.flying[key2].thickness, 0, 2*Math.PI, true);
			ctx.fill();
		}*/
		
		// In afterlife
		for (key3 in this.afterlife) {
			var bullet = this.afterlife[key3];
			var opa = this.afterlifeOpacity * bullet.life;
			//var thick = bullet.lifeSpan/2;
			var thick = 2 * bullet.life/10;
			var rgb = bullet.rgb;
			
			ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(bullet.x, bullet.y, thick, 0, 2*Math.PI, true);
			ctx.fill();
		}
		
	},
	deform: function(bullet) {
		var r = bullet.r;
		var rLast = bullet.rLast;
		
		// Operations on radii
		//rLast = r * 0.99;
		
		var x = this.bigCenterX + r * Math.cos(bullet.ang);
		var y = this.bigCenterY + r * Math.sin(bullet.ang);
		var xLast = this.bigCenterX + rLast * Math.cos(bullet.angLast);
		var yLast = this.bigCenterY + rLast * Math.sin(bullet.angLast);
		
		return { 
			xLast: xLast, 
			yLast: yLast, 
			x: x, 
			y: y
		};
	},
	feed: function(howMany) {
		// Add bullets to around array
		for (var i = 0; i < howMany; i++) {
			this.addBullet("anticlockwise");
		}
	},
	detach: function(howMany) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		var targetDist = 10;// Not used
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
			
			newFlyer.x = this.bigCenterX + newFlyer.r * Math.cos(newFlyer.ang);
			newFlyer.y = this.bigCenterY + newFlyer.r * Math.sin(newFlyer.ang);
			newFlyer.xLast = newFlyer.x;
			newFlyer.yLast = newFlyer.y;
			newFlyer.xTarget = this.bigCenterX + targetDist * newFlyer.r * Math.cos(newFlyer.ang);// Not used
			newFlyer.yTarget = this.bigCenterY + targetDist * newFlyer.r * Math.sin(newFlyer.ang);// Not used
			newFlyer.thickness = 1;
			newFlyer.lifeSpan =  10 * Math.random() ;// How long the afterlife will be (not used in flying phase)
			newFlyer.life =  newFlyer.lifeSpan;// Remaining life (not used in flying phase)
			newFlyer.growth = 0.5;// Growth speed in the afterlife (not used in flying phase)
			newFlyer.afterlifeRandom1 = Math.random();// Random parameter for growing (not used in flying phase)
			newFlyer.afterlifeRandom2 = Math.random();// Random parameter for growing (not used in flying phase)
			
			this.flying.push(newFlyer);
		}
	},
});