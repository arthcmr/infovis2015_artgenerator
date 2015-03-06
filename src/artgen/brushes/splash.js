var canvas = document.getElementById("visualization");
var ctx = canvas.getContext("2d");

var particles = [];

canvas.onmousedown = function(e)
{
    for (var i = 0; i < getRandomInt(30, 100); i++)
    {
        particles.push({
            x: e.clientX,
            y: e.clientY,
            angle: i * 5,
            size: 5 + Math.random() * 3,
            life: 200 + Math.random() * 50
        });
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var delta = 0;
var last = Date.now();

function animate()
{
    delta = Date.now() - last;
    last = Date.now();
    for (var i = 0; i < particles.length; i++)
    {
        var p = particles[i];
        p.x += Math.cos(p.angle) * 4 + Math.random() * 2 - Math.random() * 2;
        p.y += Math.sin(p.angle) * 4 + Math.random() * 2 - Math.random() * 2;
        p.life -= delta;
        p.size -= delta / 50;
        
        if (p.size <= 0)
        {
            p.life = 0;
        }
        
        if (p.life <= 0)
        {
            particles.splice(i--, 1);
            continue;
        }
    }
}

function render()
{
    ctx.fillStyle = "#3498db";    
    //ctx.globalAlpha = 0.1;
    
    for (var i = 0; i < particles.length; i++)
    {
        if (Math.random() < 0.1)
        {
            continue;
        }
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

(function animloop(){
    requestAnimFrame(animloop);
    animate();
    render();
})();