//Base painter

var basePainter = {
	/* 
     * brushes that the painter uses
     */
    brushes: [],

    /* 
     * adds a new item to the set
     * @param {Object} canvas
     * @param {Object} ctx
     */
    init: function(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        for (var i = 0; i < this.brushes.length; i++) {
            this.brushes[i] = ARTGEN._brushes.get(this.brushes[i]);
        };
    },

    /* 
     * setup bruhes
     */
    setup: function() {
    	//placeholder method
    },

    /* 
     * gets one of the brushes that this painter uses
     */
    getBrush: function(name) {
        return this.brushes[name];
    }
};