//Base brush

/* 
 * base brush constructor
 * @param {Object} canvas canvas object
 * @param {Object} ctx Canvas context
 */
var baseBrush = function() {}

/* 
 * initializes a painter
 */
baseBrush.prototype.init = function(ctx) {
    this.isDrawing = false;
};

/* 
 * start method
 */
baseBrush.prototype.start = function(x,y) {
    this.isDrawing = true;
};

/* 
 * stop method
 */
baseBrush.prototype.stop = function() {
    this.isDrawing = false;
};

/* 
 * choose brush color
 */
baseBrush.prototype.setColor = function(color) {
    this.color = color;
};

/*
 * set target for brushes extending flock
 */
baseBrush.prototype.setTarget = function(x, y) {
	this._settings.TARGET_POSITION = new Vector(x, y);
};

/*
 * draw with a transparent color
 */
baseBrush.prototype.disable = function() {
	this._enabled = false;
	this._settings.COLOR = "rgba(255,255,255,0)";
};

/*
 * set brush color
 */
baseBrush.prototype.setColor = function(color) {
	this.color = color;
	if (this._enabled) this._settings.COLOR = color;
};

/*
 * Stop drawing transparency
 */
baseBrush.prototype.enable = function() {
	this._enabled = true;
	this._settings.COLOR = this.color;
};

/*
 * Override required
 */
baseBrush.prototype.setPosition = function(x, y) {
	// Nothing
};