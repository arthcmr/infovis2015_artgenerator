/* 
These graphics are drawn by knights that dwell independently.
They respond to (an inner) force, steering them left or right.
When the knight slows down, his trail becomes wider.

To manipulate the drawings, change the 
-number of knights
-mass of the knights
-the knights' mental stability
-the min and max speed
-other characteristics
*/

// namespace
POTATODIE = {};

// Create a container for your particles
// The field is associated with a canvas.
// It is the world the knights walk on
POTATODIE.Field = function( canvas ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    
    this.init();
};

POTATODIE.Field.prototype.init = function() {
    // create some knights
    this.particles[0] = new POTATODIE.Knight (this.width/4,this.height/2, 100, "#f34");
    this.particles[1] = new POTATODIE.Knight (2*this.width/4,this.height/2, 5000, "#001");
    this.particles[2] = new POTATODIE.Knight (3*this.width/4,this.height/2, 10, "#9a8");
    this.particles[3] = new POTATODIE.Knight (2*this.width/3,this.height/2, .200, "#d00");

    // Settings for the canvas
    
    // We're drawing dots, not (real) lines. To smoothen the line use transparent dots
    this.ctx.globalAlpha = .06;
                    
    // start loop
    /* I'd like to use a reference here (called 'update') instead of an inline function,
     * but then 'this' is not defined. Need to find a solution for that

      For now I set the loop consisting of update and draw in action here
     */
    var self = this;
    var iv = window.setInterval ( function() {
            var ms = new Date().getTime();
            var i, k, t = 0;
            var c = self.particles.length;
            while ( new Date().getTime() - ms < 5 ) { 
                // Do a little more 'generations' per refresh
                // There's a limit to that: Too many generations and there'll be no time to
                // draw
                // Instead of a counter, use time - shorter than refresh rate - to give
                // the machine a little time to refresh
                for ( i = 0; i < c; i++ ) {
                    k = self.particles[i];
                    
                    // move knights
                    self.update(k);
                    
                    // draw
                    self.draw(k, self.ctx );                
                }
                t++;
            }
            // console.log(t); // FF about 4000, Chrome 14000
        }    
        ,25 );
    }

/* Limit 2d vector to a maximum length (to limit speed for example) */
function limit ( v, min, max) {
    var norm = Math.sqrt(v.x*v.x + v.y*v.y);
    if ( norm > max ) {
        v.x *= max/norm;
        v.y *= max/norm;
    }
    else if ( norm < min  && min != 0) {
        v.x /= norm/min;
        v.y /= norm/min;
    }
}

POTATODIE.Field.prototype.update = function( k ) {
    // Change the innerForce of the knight a trifle
    k.innerForce.x += (( Math.random() - 0.5 ) / k.stability);
    k.innerForce.y += (( Math.random() - 0.5 ) / k.stability);
    limit( k.innerForce, 0, 100); 
    // innerForce must be limited too, or it gets excessive.
    // Would be nice if innerForce (and speed) would have 'reasonable' limits automatically,
    // must try to find some laws to get that done
    // console.log(k.innerForce)

    // Calculate acceleration and change speed
    k.v.x += (k.innerForce.x/k.mass);
    k.v.y += (k.innerForce.y/k.mass);
    // console.log(k.v)
    
    limit( k.v, k.minspeed, k.maxspeed);
    
    k.x += k.v.x; k.y += k.v.y;
    // console.log(k)

    // Keep the dot on the canvas
    if ( k.x >this.width ) k.x -= this.width;
    if ( k.y >this.height ) k.y -= this.height;
    if ( k.x < 0 ) k.x += this.width;
    if ( k.y < 0 ) k.y += this.height;  
}

POTATODIE.Field.prototype.draw = function( k, ctx ) {
    function drawDot(ctx, r, color) {
        ctx.beginPath();
        ctx.arc(0,0,r,0,Math.PI*2,true);
        ctx.fillStyle = color;
        ctx.fill();
        // ctx.stroke();
    }

    ctx.save()
    ctx.translate(k.x, k.y);
    var norm = Math.sqrt(k.v.x*k.v.x + k.v.y*k.v.y);
    console.log(norm);
    drawDot(ctx, k.radius/norm, k.color);
    ctx.restore();
}

POTATODIE.Knight = function ( x,y, m, color ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.minspeed = 0.1;
    this.maxspeed = 1;  // too large and you'll get loose dots
    this.v = {x:0, y:0};
    this.radius = 1; // Our knight is actually a dot
    
    this.stability = .002; // increase to make paths straighter (innerForce changes at smaller scale)

    // A spiritual force.
    this.innerForce = {x:0, y:0}; //{x:Math.random() - 0.5, y:Math.random() - 0.5};   
    this.mass = m; // Force/mass gives acceleration
}

$( function() {
    var field = new POTATODIE.Field ( document.getElementById('canvas'));
});
