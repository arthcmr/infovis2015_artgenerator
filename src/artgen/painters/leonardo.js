ARTGEN.addPainter('leonardo', {
    paint: function() {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = randomColor();
        this.ctx.fill();
    }
})