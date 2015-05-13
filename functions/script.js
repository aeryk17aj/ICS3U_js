$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
	var ballx, bally;
	var ballspeedx, ballspeedy;
	
	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{
		ballx = [0];
		bally = [0];
		ballspeedx = [0];
		ballspeedy = [0];
		
	//////////
	///STATE VARIABLES
	
	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}

	init();	
	
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint()
	{
		
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0, w, h);	
		
		drawBody(50, 50);
		drawBody(130, 50);
		
		ctx.fillStyle = "green";
		

		ctx.fillRect(ballx[0], bally[0], 20, 20);
		ballx[0]+=ballspeedx[0];
		bally[0]+=ballspeedy[0];
		
		addBall(100, 200, 3, 3);
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	
	///1)
	function drawBody(x, y){
		ctx.fillStyle = "blue";
		//Head
		ctx.fillRect(x, y, 25, 25);
		//Body
		ctx.fillRect(x, y + 30, 25, 45);
		//Left Arm
		ctx.fillRect(x - 15, y + 30, 10, 40);
		//Right Arm
		ctx.fillRect(x + 30, y + 30, 10, 40);
		//Left Leg
		ctx.fillRect(x, y + 80, 10, 45);
		//Right Leg
		ctx.fillRect(x + 15, y + 80, 10, 45);
	}
	
	///2)
	function generateNumber(par1, par2){
		return Math.floor(Math.random()*(par2 - par1)) + par1;
	}
	
	///3)
	function addBall(x, y, sx, sy){
		ballx.push(x);
		bally.push(y);
		ballspeedx.push(sx);
		ballspeedy.push(sy);
	}
	
	///4)
	function bounceBall(i){
		if(mx >= ballx[i] && mx < ballx[i] + 20){
			if(my >= bally[i] && my < bally[i] + 20){
				ballspeedx[i]*=-1;
				ballspeedy[i]*=-1;
			}
		}
	}
	
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////

	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt){
		
		
	      
	}, false);

	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){pause = false;}, false);

      	canvas.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

      	}, false);


	function getMousePos(canvas, evt) 
	{
	        var rect = canvas.getBoundingClientRect();
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
      	}
      

	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////

	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
		
	}, false);
})
