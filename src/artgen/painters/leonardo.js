ARTGEN.addPainter('leonardo', {
	brushes: ['ink'],
    paint: function(iteration, data) {
    	var ink = this.getBrush(0);
    	if(!this._instantiated) {
    		ink.setColor(randomColor());
    		ink.start(this.canvas.width / 2, this.canvas.height / 2, 2000);
    		this._instantiated = true;
    	}
    	ink.update(this.canvas, data);
    	ink.draw(this.ctx);
    }
})