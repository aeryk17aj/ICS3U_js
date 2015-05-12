$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
	var screenState;
	var ball;
	var paddle;
	var ar;
	var bricks;
	
	
	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{
		ar = [33,34,35,36,38,40]; // array of keys not to move the webpage when pressed
		screenState = 0;
		
		bricks = [];
		bricks[0] = new Brick(200, 100);
		bricks[1] = new Brick(255, 100);
		bricks[2] = new Brick(310, 100);
		
		//Ball object
		ball = {
			x : w/2,
			y : h*(3/4),
			//Radius
			r : 7, 
			
			//Velocity in 2 directions
			dx : Math.floor(Math.random()*7)-3,
			dy : -7		
		};
		
		//Ball spherical display
		ball.display = function(color){
			this.color = color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
			ctx.stroke();
			ctx.fillStyle = color;
			ctx.fill();
		};
		
		//Sets the ball moving
		ball.move = function(){
			ball.x+=ball.dx;
			ball.y+=ball.dy;
		};
		
		//Ball-related actions are done here when the ball reaches the bottom of the stage
		ball.resetPosition = function(){
			ball.x = w/2;
			ball.y = h*(3/4);
			ball.dx = Math.floor(Math.random()*7)-3;
			ball.dy = -7;
		};
		
		//Paddle object
		paddle = {
			h : 10,
			w : 100,
			
			//Starting position
			x : w/2 - 50, //Perfectly centred horizontally
			y : h*(15/16), //Near the bottom
			
			s : 20 //speed limit
		};
		
		paddle.display = function(color){
			this.color = color;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);	
		};
		
		//Brick constructor
		function Brick(x, y) {
			this.x = x;
			this.y = y;
			this.w = 50;
			this.h = 20;
		}
		
		//Brick static function
		Brick.prototype.display = function(color){
			this.color = color;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);		
		}

	//////////
	///STATE VARIABLES
	
	//////////////////////
	///GAME ENGINE START
	//	This starts the game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets the interval in milliseconds between frame refreshes

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 14);
		//7 144fps
		//9 120fps
		//10 100fps
		//14 75fps
		//17 60fps
	}

	init();	
	
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint()
	{
		////////
		///MENU SCREEN
		////////

		if(screenState == 0)
		{
			//BG
			ctx.fillStyle = "#222222";
			ctx.fillRect(0,0, w, h);

			//Placeholder content
			ctx.font = "13px Arial";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("Menu screen under construction. Press Enter to start the game.", 5, h-10);
		}
		
		////////
		///GAME SCREEN
		////////
		if(screenState == 1) 
		{
			//BG
			ctx.fillStyle = "#222222";
			ctx.fillRect(0,0, w, h);	
			
			//Ball init
			ball.display("#009900");
			ball.move();
			
			//Paddle init
			paddle.display("white");
			
			
			/*
				Somehow complex paddle collision detection
			*/
			//X Axis detection
			if(ball.x >= paddle.x + ball.r && ball.x <= (paddle.x +  paddle.w) - ball.r)
			{
				//Y Axis detection + ball direction
				if(ball.y + ball.r >= paddle.y && ball.dy == Math.abs(ball.dy))
				{
					//Ball location (doesn't trigger if ball is below the paddle)
					//This makes only the top side of the paddle bounce the ball
					//if the ball goes through the paddle, it simply passes through
					if(!(ball.y - ball.r >= paddle.y + paddle.h))
					{
						ball.dy = ball.dy * (-1);
						//dx increase depending on distance from paddle centre
						ball.dx+=(ball.x - (paddle.w/2)) / (paddle.w)/2;
					}
				}
				//Bottom side of the paddle doesn't need bounce as the paddle is placed close to the bottom of the game window
			}
			
			
			//Upper wall bounce
			if(ball.y < ball.r)
			{
				ball.dy = ball.dy*(-1);	
			}
			
			//Side walls bounce
			if(ball.x < ball.r || ball.x > w - ball.r)
			{
				ball.dx = ball.dx*(-1);	
			}
			
			//The bottom is a pit. The ball resets if it goes there
			if(ball.y - ball.r > h)
			{
				ball.resetPosition();
				//lives-=1;			
			}
			
			//Speed limiter, so the slight speed increase won't go too far when it glitches
			if(ball.dx > 7) ball.dx = 7;
			if(ball.dx < -7) ball.dx = -7;
			
			
			bricks[0].display("white");
			bricks[1].display("red");
			bricks[2].display("yellow");
		}
	
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	
	/////////////////
	///Mouse Click
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
	///	KEY BOARD INPUT
	////////////////////////////////

	//	keypress - triggers once when pressed and/or held down
	//	keyup - triggers when key is realeased
	//	keydown - keeps triggering while being pressed down
	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		
		//Enter 13
		//37 Left
		//39 Right
		//1-9 49-57
		//A 65
		//D 68
		//P 80
		//R 82
		
		
		//alert(key);
		
		//prevents arrow scrolling (includes PgUp and PgDown)
		if($.inArray(key, ar) > -1){
			evt.preventDefault();
			return false;	
		}
		
		if(screenState == 0)
		{
			if(key == 13)
			{
				screenState = 1;
			}
		}
		
		//WASD and arrow key both supported
		if(screenState == 1){
			if(key == 37 || key == 65){
				if(paddle.x - paddle.s > 0){
					paddle.x-=paddle.s;
				}
			} else if(key == 39 || key == 68){
				if(paddle.x < w - paddle.w){
					paddle.x+=paddle.s;
				}
			}
		}
	}, false);
})
