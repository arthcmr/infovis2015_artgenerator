ARTGEN.addBrush('ink', {
    init: function() {
        //initial values
        this.minspeed = 0.1;
        this.maxspeed = 2; // too large and you'll get loose dots
        //acceleration and change of speed
        this.v = {
            x: 0,
            y: 0
        };
        this.radius = 1;
        this.stability = .002; // increase to make paths straighter
        this.innerForce = {
            x: 0,
            y: 0
        };
    },
    update: function(canvas, data) {

        function limit(v, min, max) {
            var norm = Math.sqrt(v.x * v.x + v.y * v.y);
            if (norm > max) {
                v.x *= max / norm;
                v.y *= max / norm;
            } else if (norm < min && min != 0) {
                v.x /= norm / min;
                v.y /= norm / min;
            }
        }

        this.innerForce.x += ((1 - 0.5) / this.stability);
        this.innerForce.y += data / this.stability ; //0 //((1 - 0.5) / this.stability);
        limit(this.innerForce, 0, 100);

        this.v.x += (this.innerForce.x / this.mass);
        this.v.y += (this.innerForce.y / this.mass);
        limit(this.v, this.minspeed, this.maxspeed);
        this.x += this.v.x;
        this.y += this.v.y;

        //keep the dot within the canvas
        if (this.x > canvas.width) this.x -= canvas.width;
        if (this.y > canvas.height) this.y -= canvas.height;
        if (this.x < 0) this.x += canvas.width;
        if (this.y < 0) this.y += canvas.height;
    },
    draw: function(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y);
        var norm = Math.sqrt(this.v.x * this.v.x + this.v.y * this.v.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius / norm, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    },
    start: function(x, y, m) {
        this.x = x;
        this.y = y;
        this.mass = m; // Force/mass gives acceleration
    }
});