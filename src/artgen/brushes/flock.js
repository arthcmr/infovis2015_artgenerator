ARTGEN.addBrush('flock', {

    //code adapted from http://codepen.io/ferronsays/pen/gcfph

    init: function(c) {

        //context
        this.ctx = c;
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(255,255,255,0)",
            BOIDS: 40,
            MAX_SPEED: 4,
            MAX_FORCE: 30,
            MAX_SIZE: 2,
            DESIRED_SEPARATION: 9,
            NEIGHBOR_RADIUS: 150,
            SEPARATION_WEIGHT: 1000,
            ALIGNMENT_WEIGHT: 1,
            COHESION_WEIGHT: 1,
            TARGET_POSITION: new Vector(c.canvas.width / 2, c.canvas.height / 2),
            TARGET_SIGN: 1,
            TARGET_FORCE: 2000,
            TARGET_COHESION: 0.1,
            BOID_STYLE: 2,
            DRAW_TRAILS: false,
            LINE_WIDTH: 1,
        }, (this._settings || {}) );

        this.boids = [];

    },
    update: function(canvas, data) {
        for (i in this.boids) {
            this.boids[i].step(this.boids);
        }
    },
    draw: function(ctx) {
        for (i in this.boids) {
            this.boids[i].draw();
        }
    },
    setTarget: function(x, y) {
        this._settings.TARGET_POSITION = new Vector(x, y);
    },
    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },
    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },
    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },
    setPosition: function(x, y) {
        for (var i = 0; i < this.boids.length; i++) {
            var new_x = x + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;
            var new_y = y + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;
            this.boids[i].loc = new Vector(new_x, new_y);
        }
    },
    start: function(x, y) {

        var settings = this._settings;
        var BoidStyleEnum = {
            Square: 0,
            Line: 1,
            Circle: 2
        };

        var Boid = function(location, velocity, ctx) {
            this.init(location, velocity, ctx);
        };

        Boid.prototype.init = function(location, velocity, ctx) {
            this.loc = location.duplicate();
            this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
            this.ctx = ctx;
        };

        Boid.prototype.step = function(neighbors) {
            var acceleration = this.flock(neighbors).add(this.influence());
            this.velocity.add(acceleration).limit(settings.MAX_SPEED);
            this.loc.add(this.velocity);
            this.wrapToCanvasBounds();
        };

        Boid.prototype.wrapToCanvasBounds = function() {
            this.loc.x = this.loc.x < 0 ? this.ctx.canvas.width : this.loc.x;
            this.loc.x = this.loc.x > this.ctx.canvas.width ? 0 : this.loc.x;
            this.loc.y = this.loc.y < 0 ? this.ctx.canvas.height : this.loc.y;
            this.loc.y = this.loc.y > this.ctx.canvas.height ? 0 : this.loc.y;
        };

        Boid.prototype.flock = function(neighbors) {
            var separation = this.separate(neighbors).multiply(settings.SEPARATION_WEIGHT);
            var alignment = this.align(neighbors).multiply(settings.ALIGNMENT_WEIGHT);
            var cohesion = this.cohere(neighbors).multiply(settings.COHESION_WEIGHT);

            return separation.add(alignment).add(cohesion);
        };

        Boid.prototype.cohere = function(neighbors) {
            var sum = new Vector(0, 0);
            var count = 0;

            for (boid in neighbors) {
                var d = this.loc.distance(neighbors[boid].loc);
                if (d > 0 && d < settings.NEIGHBOR_RADIUS) {
                    sum.add(neighbors[boid].loc);
                    count++;
                }
            }

            if (count > 0)
                return this.steer_to(sum.divide(count));
            else
                return sum;
        };

        Boid.prototype.steer_to = function(target) {
            var desired = Vector.subtract(target, this.loc);
            var d = desired.magnitude();
            var steer;

            if (d > 0) {
                desired.normalize();

                if (d < 100)
                    desired.multiply(settings.MAX_SPEED * (d / 100));
                else
                    desired.multiply(settings.MAX_SPEED);

                steer = desired.subtract(this.velocity);
                steer.limit(settings.MAX_FORCE);
            } else {
                steer = new Vector(0, 0);
            }

            return steer;
        };

        Boid.prototype.align = function(neighbors) {
            var mean = new Vector();
            var count = 0;
            for (boid in neighbors) {
                var d = this.loc.distance(neighbors[boid].loc);
                if (d > 0 && d < settings.NEIGHBOR_RADIUS) {
                    mean.add(neighbors[boid].velocity);
                    count++;
                }
            }

            if (count > 0)
                mean.divide(count)

            mean.limit(settings.MAX_FORCE);

            return mean;
        };

        Boid.prototype.separate = function(neighbors) {
            var mean = new Vector();
            var count = 0;

            for (boid in neighbors) {
                var d = this.loc.distance(neighbors[boid].loc);
                if (d > 0 && d < settings.DESIRED_SEPARATION) {
                    mean.add(Vector.subtract(this.loc, neighbors[boid].loc).normalize().divide(d));
                    count++;
                }
            }

            if (count > 0)
                mean.divide(count);

            return mean;
        };

        Boid.prototype.influence = function() {
            var g = new Vector();
            var target = Vector.subtract(settings.TARGET_POSITION, this.loc);
            d = settings.TARGET_COHESION;
            g.add(target.normalize().divide(d * d).multiply(settings.TARGET_SIGN).limit(settings.TARGET_FORCE));
            return g;
        };

        Boid.prototype.draw = function() {

            var vv = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) / 2;
            var color = settings.COLOR;
            switch (settings.BOID_STYLE) {
                case BoidStyleEnum.Square:
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(this.loc.x, this.loc.y, Math.min(vv * 5, settings.MAX_SIZE), Math.min(vv * 5, settings.MAX_SIZE));
                    break;
                case BoidStyleEnum.Line:
                    this.ctx.lineWidth = settings.LINE_WIDTH;
                    this.ctx.strokeStyle = color;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.loc.x, this.loc.y);
                    this.ctx.lineTo(this.loc.x + Math.min(this.velocity.x * 5, settings.MAX_SIZE), this.loc.y + Math.min(this.velocity.y * 5, settings.MAX_SIZE));
                    this.ctx.stroke();
                    break;
                case BoidStyleEnum.Circle:
                    this.ctx.beginPath();
                    this.ctx.arc(this.loc.x, this.loc.y, Math.min(vv * 3, settings.MAX_SIZE), 0, 2 * Math.PI, false);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                    break;
                default:
                    this.ctx.beginPath();
                    this.ctx.arc(this.loc.x, this.loc.y, Math.min(vv * 3, settings.MAX_SIZE), 0, 2 * Math.PI, false);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                    break;
            }
        };

        this.boids = [];
        for (var i = 0; i < this._settings.BOIDS; i++) {

            //random around the same area
            var new_x = x + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;
            var new_y = y + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;

            var boid = new Boid(
                new Vector(new_x, new_y),
                new Vector(Math.random(10), Math.random(10)),
                this.ctx);

            this.boids.push(boid);
        }
    }
});