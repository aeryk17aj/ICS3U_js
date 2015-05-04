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
		
		//Ball object
		ball = {
			//Starting position (centre coords + radius)
			x : w/2,
			y : h*(3/4),
			r : 7,
			
			//Velocity in 2 directions
			dx : Math.floor(Math.random()*7)-3,
			dy : -7		
		};
		
		ball.display = function(color){
			this.color = color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
			ctx.stroke();
			ctx.fillStyle = color;
			ctx.fill();
		};
		
		ball.move = function(){
			ball.x+=ball.dx;
			ball.y+=ball.dy;
		};
		
		ball.resetPosition = function(){
			ball.x = w/2;
			ball.y = h*(3/4);
			ball.dx = Math.floor(Math.random()*7)-3;
			ball.dy = -7;
		};
		
		//Paddle object
		paddle = {
			//long, not tall
			h : 10,
			w : 100,
			
			//Starting position
			x : (w/2) - 50, //Perfectly centred horizontally
			y : h*(15/16),
			
			s : 20
		};
		
		paddle.display = function(color){
			this.color = color;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);	
		};
		
		for(int i = 0; i < 5; i++){
			bricks[i] = new Brick(200 + (i*(brick.w + 5)), 100, "#FFFFFF");
		}
		
		
	//////////
	///STATE VARIABLES
	
	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 14);
	}

	init();	
	


	
	
	
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint()
	{
		ctx.fillStyle = "#222222";
		ctx.fillRect(0,0, w, h);	
		
		ball.display("#009900");
		ball.move();
		
		paddle.display("white");
		
		//Paddle bounce
		if(ball.x >= paddle.x + ball.r && ball.x <= (paddle.x +  paddle.w) - ball.r){
			if(ball.y + ball.r >= paddle.y){
			
				//inverts the dy to simulate a bounce
				ball.dy = ball.dy*(-1);
				
				//This increases the dx depending on how far it is from the middle of the paddle
				//This encourages hitting the ball as near to the paddle's centre as possible 
				//for more consistent bounces
				ball.dx+=(ball.x - (paddle.w/2)) / (paddle.w)/2
			}
		}
		
		//Upper wall bounce
		if(ball.y < ball.r){
			ball.dy = ball.dy*(-1);	
		}
		
		//Side walls bounce
		if(ball.x < ball.r || ball.x > w - ball.r){
			ball.dx = ball.dx*(-1);	
		}
		
		//The bottom is a pit. The ball resets if it goes there
		if(ball.y - ball.r > h){
			ball.resetPosition();	
		}
		
		for(int i = 0; i < 5; i++){
			bricks[i].display();
		}
	
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	//Brick base object
	function Brick(x, y, color) {
		this.x = x;
		this.y = y;
		this.w = 30;
		this.h = 5;
		this.color = color;
		this.display = function() {
		    ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.x + this.w, this.y + this.h);	
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
		//37 Left
		//39 Right
		//A 65
		//D 68
		//alert(key);
		//prevents arrow scrolling (includes PgUp and PgDown)
		if($.inArray(key, ar) > -1){
			evt.preventDefault();
			return false;	
		}
		
		if(key == 37 || key == 65){
			if(paddle.x - paddle.s > 0){
				paddle.x-=paddle.s;
			}
		} else if(key == 39 || key == 68){
			if(paddle.x < w - paddle.w){
				paddle.x+=paddle.s;
			}
		}
		//console.log(paddle.x);
		
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
		
	}, false);




})
