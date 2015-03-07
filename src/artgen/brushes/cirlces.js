ARTGEN.addBrush('circles', {

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
        this.prevX;
        this.prevY;
        this.points = [ ];
        this.radius = 15;
        this.radius = Math.floor(Math.random() * (16)) + 5;
        this.opacity = Math.random();
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
    this.points.push({ 
    x: this.positionX,
    y: this.positionY,
    radius: Math.floor(Math.random() * (21)) + 10,
    opacity: Math.random()
  });

},


draw: function(){
if(Math.abs(this.prevX-this.positionX)>10 || Math.abs(this.prevY-this.positionY)>10){

this.ctx.lineJoin = this.ctx.lineCap = 'round';
this.ctx.fillStyle = this.color;
this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  for (var i = 0; i < this.points.length; i++) {
    this.ctx.beginPath();
    this.ctx.globalAlpha = this.points[i].opacity;
    this.ctx.arc(
      this.points[i].x, this.points[i].y, this.points[i].radius, 
      false, Math.PI * 2, false);
    this.ctx.fill();
  }
}
this.prevX=this.positionX;
this.prevY=this.positionY;

},

});