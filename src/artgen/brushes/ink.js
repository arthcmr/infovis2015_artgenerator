ARTGEN.addBrush('ink', {

    _settings: {
        COLOR: "rgba(255,255,255,0)"
    },

    init: function(c) {

        this.ctx = c;
        this.ctx.lineJoin = this.ctx.lineCap = 'round';

    },
    update: function() {


    },
    draw: function() {

        this.ctx.beginPath();
        var x1 = this._prevPOS.x;
        var y1 = this._prevPOS.y;
        var x2 = this._settings.TARGET_POSITION.x;
        var y2 = this._settings.TARGET_POSITION.y;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineWidth = _.random(3,6);
        this.ctx.strokeStyle = this._settings.COLOR;
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

    },
    setTarget: function(x, y) {
        this._prevPOS = this._settings.TARGET_POSITION;
        this._settings.TARGET_POSITION = new Vector(x, y);
    },
    start: function(x, y, m) {
        this.setTarget(x, y);
        this._prevPOS = this._settings.TARGET_POSITION;
    }
});