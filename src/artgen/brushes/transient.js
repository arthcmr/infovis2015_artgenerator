ARTGEN.addBrush('transient', {
    init: function() {
	
        this.explosionRadius = 15;
        
		this.superColor = "rgba(255,255,255,0.2)";
		
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 10;
		this.speakingCountMax = 10;
		
		this.acceleration = 0;
		this.accelerationSmooth = 1000;
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
			this.acceleration--;
			if(this.acceleration <= 0) {
				this.acceleration = 0;
			}
			this.silenceCounter = 0;
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.acceleration++;
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness();
		this.naturalAccelerationDecrease();
		this.feed();
		//this.detach();
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
	addBullet: function(way) {
		var rad = this.bigRadius + 10*Math.random();
		var angle = 2*Math.PI*Math.random();
		this.around.push({
			r: rad,
			rLast: rad,
			ang: angle,
			angLast: angle,
			angSpeed: 0.01,
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
			
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
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
		ctx.fillStyle = "rgba(0,0,0,0.01)";
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
	feed: function(){
		// Add bullets to around array
		var howMany = Math.floor(1.01*Math.random());
		for (var i = 0; i < howMany; i++) {
			this.addBullet("clockwise");
		}
	},
	detach: function(ctx) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		var howMany = Math.floor(10*this.expressiveness);
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
		this.dying = [];
	},
});