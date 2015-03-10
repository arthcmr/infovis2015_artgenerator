ARTGEN.addBrush('thin_marker', {

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
        this.points = [ ];
        this.midX;
        this.midY;
        this.p1;
        this.p2;

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
        });

    },

    draw: function(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeStyle = this.color;
        this.p1 = this.points[0];
        this.p2 = this.points[1];
        this.ctx.lineWidth=5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y);

        for (var i = 1, len = this.points.length; i < len; i++) {
            // we pick the point between pi+1 & pi+2 as the
            // end point and p1 as our control point
            this.midX=this.p1.x + (this.p2.x - this.p1.x) / 2
            this.midY=this.p1.y + (this.p2.y - this.p1.y) / 2
            this.ctx.quadraticCurveTo(this.p1.x, this.p1.y, this.midX, this.midY);
            this.p1 = this.points[i];
            this.p2 = this.points[i+1];
        }
        // Draw last line as a straight line while
        // we wait for the next point to be able to calculate
        // the bezier control point
        this.ctx.lineTo(this.p1.x, this.p1.y);
        this.ctx.stroke();
    },

});