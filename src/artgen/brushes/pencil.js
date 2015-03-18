ARTGEN.addBrush('pencil', {

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
             

    },

    draw: function(){
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
        this.ctx.lineTo(this.positionX, this.positionY);
        this.ctx.stroke();
    },

});