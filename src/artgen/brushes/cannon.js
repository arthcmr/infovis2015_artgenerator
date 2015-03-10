ARTGEN.addBrush('cannon', {
    init: function() {
        //initial values
        this.minspeed = 0.1;
        this.maxspeed = 2; // too large and you'll get loose dots
        //acceleration and change of speed
		this.bullets = [];
		this.dying = [];// Dead bullets storage for special drawing
    
        this.explosionRadius = 15;
        
        this.xBoom = null;
		this.yBoom = null;
		this.superColor = "rgba(255,255,255,0.1)";
		
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 10;
		this.speakingCountMax = 10;
		
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
			this.addBullet("down",0.1,15*Math.random());
			this.silenceCounter = 0;
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.addBullet("up",0.1,15*Math.random());
			this.speakingCounter = 0;
		}
		this.moveBullets(canvas);
		this.explode(ctx);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx,canvas) {
		this.xBoom = 0;
		this.yBoom = canvas.height/2;
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
    },
	addBullet: function(way, gravity, speed){
		this.bullets.push({
			x: this.xBoom,
			xLast: this.xBoom,
			y: this.yBoom,
			yLast: this.yBoom,
			xSpeed: speed,
			ySpeed: 0, 
			way: way,
			gravity: gravity
		});
	},
	moveBullets: function(canvas){
		for (key in this.bullets){
			// Whay way will gravity be?
			if (this.bullets[key].way == "up"){
				var multip = -1;
			} else if (this.bullets[key].way == "down") {
				var multip = 1;
			}
			else{ console.log('No way'); }
			
			// Push positions to old positions
			this.bullets[key].xLast = this.bullets[key].x;
			this.bullets[key].yLast = this.bullets[key].y;
			
			//var oldXspeed = this.bullets[key].xSpeed;
			var oldYspeed = this.bullets[key].ySpeed;
			
			//this.bullets[key].xSpeed = oldXspeed;
			this.bullets[key].ySpeed = oldYspeed + multip * this.bullets[key].gravity;
			
			this.bullets[key].x += this.bullets[key].xSpeed;
			this.bullets[key].y += this.bullets[key].ySpeed;
			//keep the bullet within the canvas
			if (this.bullets[key].x > canvas.width) {
				this.bullets[key].x = canvas.width;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);
			}
			if (this.bullets[key].y > canvas.height) {
				this.bullets[key].y = canvas.height;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);				
			}
			if (this.bullets[key].x < 0) {
				this.bullets[key].x = 0;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);				
			}
			if (this.bullets[key].y < 0) {
				this.bullets[key].y = 0;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);			
			}
			//if (this.x > canvas.width) this.x -= canvas.width;
			//if (this.y > canvas.height) this.y -= canvas.height;
			//if (this.x < 0) this.x += canvas.width;
			//if (this.y < 0) this.y += canvas.height;
		}
	},
	drawBullets: function(ctx) {
		for (key in this.bullets) {
			//ctx.save();
			//ctx.translate(this.bullets[key].x, this.bullets[key].y);
			
			ctx.beginPath();
			ctx.moveTo(this.bullets[key].xLast,this.bullets[key].yLast);
			ctx.lineTo(this.bullets[key].x,this.bullets[key].y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 3;
			ctx.stroke();
			
			//ctx.restore();
		}
	},
	explode: function(ctx){
		for (key in this.dying){
			ctx.save();
			ctx.translate(this.dying[key].x, this.dying[key].y);
			
			ctx.arc(0, 0, this.explosionRadius, 0, Math.PI * 2, true);
			ctx.fillStyle = this.superColor;
			ctx.fill();
			
			ctx.restore();
		}
		this.dying = [];
	},
});