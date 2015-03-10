ARTGEN.addBrush('spray_new', {

    init: function(c){

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}) );

        //Positions
        this.positionX;
        this.positionY;
        this.density = 50;
        this.radius = 10;
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

    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    update: function(){
        this.ctx.moveTo(this.positionX, this.positionY);   

    },

    draw: function(){
        this.ctx.lineWidth = 50;
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
        this.ctx.fillStyle= this.color;
        for (var i = this.density; i--; ) {
          var offsetX = Math.floor(Math.random() * (2*this.radius + 1)) -this.radius
          var offsetY = Math.floor(Math.random() * (2*this.radius + 1)) -this.radius
          this.ctx.fillRect(this.positionX + offsetX, this.positionY + offsetY, 1, 1);
        }
    },

});
