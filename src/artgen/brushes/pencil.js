ARTGEN.addBrush('pencil', {
    init: function() {
        this.isDrawing = false;
        this.points = [];
        this.radius = 15;
    },
    start: function(x, y) {
        this.isDrawing = true;
        this._addPoint(x, y);
    },
    stop: function() {
        this.isDrawing = false;
    },
    move: function(x, y) {
        this.isDrawing = true;
        this._addPoint(x, y);
    },
    _addPoint: function(x, y) {
        this.points.push({
            x: x,
            y: y,
            radius: _.random(10, 30),
            opacity: Math.random()
        });
    }
})