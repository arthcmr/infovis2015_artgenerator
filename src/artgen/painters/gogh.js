//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('gogh', {
    paint: function() {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = randomColor({hue: 'monochrome'});
        this.ctx.fill();
    }
})