ARTGEN.addPainter('zeus', {
	brushes: ['thunderbolt', 'thunderbolt'],
    paint: function(time, data) {
    	var bolt = this.getBrush(0);
    	var bolt2 = this.getBrush(1);
    	if(!this._instantiated) {
    		bolt.start(this.ctx, this.canvas, [0, 1/2, "right"]);
    		bolt2.start(this.ctx, this.canvas, [1, 1/2, "left"]);
    		this._instantiated = true;
    	}
    	bolt.update(this.canvas, this.ctx, data);
    	bolt.draw(this.ctx);
		bolt2.update(this.canvas, this.ctx, data);
    	bolt2.draw(this.ctx);
    }
})