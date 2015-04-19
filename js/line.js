window.onload = init;
function init() {
    // canvas related variables
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var $canvas=$("#canvas");
var canvasOffset=$canvas.offset();
var offsetX=canvasOffset.left;
var offsetY=canvasOffset.top;

// dom element to indicate if mouse is inside/outside line
var $hit=$("#hit");

// determine how close the mouse must be to the line
// for the mouse to be inside the line
var tolerance=5;

// define the starting & ending points of the line
var line={x0:50,y0:50,x1:100,y1:100};

// set the fillstyle of the canvas
ctx.fillStyle="red";

// draw the line for the first time
draw(line);

// function to draw the line
// and optionally draw a dot when the mouse is inside
function draw(line,mouseX,mouseY,lineX,lineY){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.moveTo(line.x0,line.y0);
    ctx.lineTo(line.x1,line.y1);
    ctx.stroke();
    if(mouseX && lineX){
        ctx.beginPath();
        ctx.arc(lineX,lineY,tolerance,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
}

// calculate the point on the line that's 
// nearest to the mouse position
function linepointNearestMouse(line,x,y) {
    //
    lerp=function(a,b,x){ return(a+x*(b-a)); };
    var dx=line.x1-line.x0;
    var dy=line.y1-line.y0;
    var t=((x-line.x0)*dx+(y-line.y0)*dy)/(dx*dx+dy*dy);
    var lineX=lerp(line.x0, line.x1, t);
    var lineY=lerp(line.y0, line.y1, t);
    return({x:lineX,y:lineY});
};

// handle mousemove events
// calculate how close the mouse is to the line
// if that distance is less than tolerance then
// display a dot on the line
function handleMousemove(e){
    e.preventDefault();
    e.stopPropagation();
    mouseX=parseInt(e.clientX-offsetX);
    mouseY=parseInt(e.clientY-offsetY);
    if(mouseX<line.x0 || mouseX>line.x1){
        $hit.text("Outside");
        draw(line);
        return;          
    }
    var linepoint=linepointNearestMouse(line,mouseX,mouseY);
    var dx=mouseX-linepoint.x;
    var dy=mouseY-linepoint.y;
    var distance=Math.abs(Math.sqrt(dx*dx+dy*dy));
    if(distance<tolerance){
        $hit.text("Inside the line");
        draw(line,mouseX,mouseY,linepoint.x,linepoint.y);
    }else{
        $hit.text("Outside");
        draw(line);
    }
}

// tell the browser to call handleMousedown
// whenever the mouse moves
$("#canvas").mousemove(function(e){handleMousemove(e);});

   
}
    