//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('gogh', {
    paint: function(iteration) {
        if (iteration % 100 === 0) {
            this.color = randomColor();
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }
})