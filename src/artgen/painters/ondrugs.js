ARTGEN.addPainter('ondrugs', {
	brushes: ['mad'],
    paint: function(time, data){
    	var mad = this.getBrush(0);
    	if(!this._instantiated){
    		mad.setColor(randomColor());
    		mad.start(this.ctx,this.canvas);
    		this._instantiated = true;
    	}
    	mad.update(this.canvas,this.ctx,data);
    	mad.draw(this.ctx);
    }
})