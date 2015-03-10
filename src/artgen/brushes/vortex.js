ARTGEN.addBrush('vortex', {
    init: function() {
	
        this.explosionRadius = 15;
        
		this.superColor = "rgba(255,255,255,0.2)";
		
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 2;
		
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 50;//px
		this.acceleration = 5;
		this.accelerationSmooth = 100000;
		this.minAcc = -10;
		this.maxAcc = 10;
		this.minAngSpeed = -10;
		this.maxAngSpeed = 10;
		
		this.expCounter = 0;
		this.expressivenessVar = 5000;
		this.expressiveness = 0;
		
		this.around = [];
		this.flying = [];
		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		
    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data == 0) {
			this.silenceCounter++;
		} else if (data == 1) {
			this.speakingCounter++;
		}
		else{}
		
		if (this.silenceCounter >= this.silenceCountMax) {
			/*this.acceleration--;
			if(this.acceleration <= this.minAcc) {
				this.acceleration = this.minAcc;
			}
			this.silenceCounter = 0;*/
			this.repulsion--;
			if(this.repulsion <= this.minRep) {
				this.repulsion = this.minRep;
			}
			this.silenceCounter = 0;
			
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			/*this.acceleration++;
			if(this.acceleration >= this.maxAcc) {
				this.acceleration = this.maxAcc;
			}
			this.speakingCounter = 0;*/
			this.repulsion++;
			if(this.repulsion >= this.maxRep) {
				this.repulsion = this.maxRep;
			}
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness();
		this.naturalAccelerationDecrease();
		this.naturalRepulsionDecrease();
		var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));
		//howMany = 1;
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
		
		this.feed(50);
    },
	simulateExpressiveness: function() {
		this.expCounter++;
		this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
	},
	naturalAccelerationDecrease: function(){
		this.acceleration -= 0.01;
		if (this.acceleration <= 0) {
			this.acceleration = 0;
		}
	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius + 10*Math.random();
		var angle = 2*Math.PI*Math.random();
		this.around.push({
			r: rad,
			rLast: rad,
			ang: angle,
			angLast: angle,
			angSpeed: 0.005,
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
			
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.acceleration / this.accelerationSmooth);
			// Well, careful
			this.around[key].angSpeed = Math.min(Math.max(this.around[key].angSpeed, this.minAngSpeed), this.maxAngSpeed);
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
			// New radius with repulsion
			this.around[key].r += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
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
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();
		for (key in this.around) {
			var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 2;
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
			this.addBullet("clockwise");
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