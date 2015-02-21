//Base brush

var baseBrush = {

	isDrawing: false,

	/* 
     * initialization function
     */
	init: function() {
		//placeholder method
	},

	/* 
     * start function
     */
	start: function(x,y) {
		this.isDrawing = true;
	},

	/* 
     * stop function
     */
	stop: function() {
		this.isDrawing = false;
	},

	/* 
     * move function
     */
	move: function(x,y) {
		//placeholder method
	},

	/* 
     * chose color
     */
    setColor: function(color) {
    	this.color = color;
    }
};