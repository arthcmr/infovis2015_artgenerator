ARTGEN.addBrush('splash', {

    init: function(c){

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}) );

        this.particles = [];

        this.delta = 0;
        this.last = Date.now();

        //Positions
        this.positionX;
        this.positionY;
    },

    start: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    setTarget: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },
    disble: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(52, 152, 219, 0)" ;
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    update: function(){
       for (var i = 0; i < _.random(30,100); i++){
            this.particles.push({
                x: this.positionX,
                y: this.positionY + margin,
                angle: i * 5,
                size: 5 + Math.random() * 3,
                life: 200 + Math.random() * 50
            });
        }
       
        this.delta = Date.now() - this.last;
        this.last = Date.now();
        for (var i = 0; i < this.particles.length; i++)
        {
            var p = this.particles[i];
            p.x += Math.cos(p.angle) * 4 + Math.random() * 2 - Math.random() * 2;
            p.y += Math.sin(p.angle) * 4 + Math.random() * 2 - Math.random() * 2;
            p.life -= this.delta;
            p.size -= this.delta / 50;
            
            if (p.size <= 0)
            {
                p.life = 0;
            }
            
            if (p.life <= 0)
            {
                this.particles.splice(i--, 1);
                continue;
            }
        }
    },

    draw: function(){
        this.ctx.fillStyle = this._settings.COLOR;    
        
        for (var i = 0; i < this.particles.length; i++)
        {
            if (Math.random() < 0.1)
            {
                continue;
            }
            var p = this.particles[i];
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            this.ctx.fill();
        }
    },

});