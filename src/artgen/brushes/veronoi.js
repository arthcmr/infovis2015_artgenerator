ARTGEN.addBrush('veronoi', {

    init: function(c) {

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}));

        //Positions
        this.positionX;
        this.positionY;

        this.voronoi = new Voronoi();
        this.sites = [{
            x: 0,
            y: 0
        }];
        this.bbox = {
            xl: 0,
            xr: this.ctx.canvas.width,
            yt: 0,
            yb: this.ctx.canvas.height
        };

        this.diagram = this.voronoi.compute(this.sites, this.bbox);
        this.target = this.sites[0];
        this.style = 'fill';
    },

    start: function(x, y) {
        this.target.x = x;
        this.target.y = y;
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },


    setTarget: function(x, y) {
        this.target.x = x;
        this.target.y = y;
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },

    setStyle: function(style) {
        this.style = style;
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

    addRandom: function(number) {
        for (var i = 0; i < number; i++) {
            this.sites.push({
                x: Math.round(Math.random() * this.ctx.canvas.width),
                y: Math.round(Math.random() * this.ctx.canvas.height)
            });
        }
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },

    clearAll: function() {
        this.sites = [{
            x: 0,
            y: 0
        }];
        this.target = this.sites[0];
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },

    addPoint: function() {
        this.sites.push({
            x: this.target.x+1,
            y: this.target.y+1
        });
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
        this.target = this.sites[0];
    },

    update: function() {
        this.bbox = {
            xl: 0,
            xr: this.ctx.canvas.width,
            yt: 0,
            yb: this.ctx.canvas.height
        };
    },

    draw: function() {

        var cell = this.diagram.cells[this.sites[0].voronoiId];
        if (cell) {
            var halfedges = cell.halfedges,
                nHalfedges = halfedges.length;
            if (nHalfedges > 2) {
                var v = halfedges[0].getStartpoint();
                this.ctx.beginPath();
                this.ctx.moveTo(v.x, v.y);
                for (var iHalfedge = 0; iHalfedge < nHalfedges; iHalfedge++) {
                    v = halfedges[iHalfedge].getEndpoint();
                    this.ctx.lineTo(v.x, v.y);
                }

                if(this.style === 'stroke') {
                    this.ctx.strokeStyle = this._settings.COLOR;
                    this.ctx.stroke();
                } else {
                    this.ctx.fillStyle = this._settings.COLOR;
                    this.ctx.fill();
                }

            }
        }
    },

});