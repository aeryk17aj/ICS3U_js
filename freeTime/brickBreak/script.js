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
	var btnCols;
	var levelsUnlocked;
	var skipNextLevel;
	var ss2State;
	var levelBeaten;
	
	
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
		ss2State = 0; // 0 - Fail/Out of Lives | 1 - Success/Destroyed all bricks
		levelBeaten = [0, 0];
		
		
		/*
		Button colour indexes used in each screen
		
		0-2  Menu
		3-4  Level Finished
		5-14 Level Select
		15   Options
		*/
		btnCols = [];
		for(var i = 0; i < 16; i++){
			btnCols.push("#777777");
		}
		
		levelsUnlocked = 1;
		skipNextLevel = false;
		
		bricks = [];
		///Brick Layout Start
		for(var i = 0; i < 3; i++){
			bricks[i] = new Brick(240 + i*55, 100);
		}
		for(var i = 3; i < 7; i++){
			bricks[i] = new Brick(215 + (i-3)*55, 125);
		}
		for(var i = 7; i < 10; i++){
			bricks[i] = new Brick(240 + (i-7)*55, 150);
		}
		
		///Brick Layout End

		//Ball object
		ball = {
			x : w/2,
			y : 440,//h*(3/4)
			//Radius
			r : 7, 
			
			//Velocity in 2 directions
			dx : 0,
			dy : 0		
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
			ball.y = 440;
			ball.dx = 0;
			ball.dy = 0;
		};
		
		ball.bounceX = function(){
			ball.dx = ball.dx * (-1);
		};
		
		ball.bounceY = function(){
			ball.dy = ball.dy * (-1);
		}
		
		//Paddle object
		paddle = {
			h : 10,
			w : 100,
			
			//Starting position
			x : w/2 - 50, //Perfectly centred horizontally
			y : 450, //Near the bottom
			
			s : 20 //speed limit
		};
		
		paddle.display = function(color){
			this.color = color;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.beginPath();
			ctx.moveTo(this.x, this.y + this.h);
			ctx.lineTo(this.x + this.w/2, this.y + this.h + 10);
			ctx.lineTo(this.x + this.w, this.y + this.h);
			ctx.closePath;
			ctx.fill();
		};
		
		paddle.resetPosition = function(){
			paddle.x = w/2 - 50;
			//No need for Y reset if you can't move it vertically
		}
		
		//Brick static function
		Brick.prototype.display = function(color){
			this.color = color;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);		
		};
		
		

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
			ctx.fillStyle = "#333333";
			ctx.fillRect(0, 0, w, h);

			///3 Buttons - [Play], [], [Options]
			//Shadow
			for(var i = 0; i < 3; i++){
				ctx.fillStyle = btnCols[i] == "#999999" ? "#777777" : "#666666";
				ctx.fillRect(17, h - 67 - (i*70), 200, 50);
			}
			//Front
			for(var i = 0; i < 3; i++){
				ctx.fillStyle = btnCols[i];
				ctx.fillRect(20, h - 70 - (i*70), 200, 50);
			}
			
			//Text
			ctx.font = "48px Calibri";
			ctx.fillStyle = "#333333";
			ctx.fillText("Play", 30, 308);
			ctx.fillText("...", 30, 378);
			ctx.fillText("Options", 30, 448);
			
			//Cursor
			ctx.fillStyle = "#FFFFFF";
			ctx.beginPath();
			ctx.moveTo(mx, my);
			ctx.lineTo(mx + 7, my + 9);
			ctx.lineTo(mx, my + 14);
			ctx.closePath();
			ctx.fill();
		}
		
		////////
		///GAME SCREEN
		////////
		if(screenState == 1) 
		{
			//BG
			ctx.fillStyle = "#222222";
			ctx.fillRect(0,0, w, h);	
			
			//Side Border Overlay
			ctx.fillStyle = "#000000";
			ctx.fillRect(0,0, 100, h);
			ctx.fillRect(w-100, 0, 100, h);
			
			//Ball init
			ball.display("#119911");
			ball.move();
			
			//Paddle init
			paddle.display("white");
			paddle.x = mx - paddle.w/2;
			
			
			///Paddle collision
			//X Axis check
			if(ball.x >= paddle.x + ball.r && ball.x <= (paddle.x +  paddle.w) - ball.r)
			{
				//Y Axis + ball direction check (checks if dy is positive, to be specific)
				if(ball.y + ball.r >= paddle.y && ball.dy == Math.abs(ball.dy))
				{
					//Ball location check
					//This makes only the top side of the paddle bounce the ball
					//If the ball goes through the paddle, it simply passes through
					if(!(ball.y - ball.r >= paddle.y + paddle.h))
					{
						ball.bounceY();
						//dx increase depending on distance from paddle centre
						ball.dx+=Math.floor(Math.abs(ball.x - paddle.x - paddle.w/2)/(paddle.w/2));
					}
				}
				//Bottom side of the paddle doesn't need bounce as the paddle is placed close to the bottom of the game window
			}
			
			///Ball wall bounce
			//Upper wall
			if(ball.y < ball.r)
			{
				ball.bounceY();	
			}
			//Side walls
			if(ball.x < ball.r + 100 || ball.x > w - ball.r - 100)
			{
				ball.bounceX();
			}
			
			//The bottom is a pit. The ball resets if it goes there
			if(ball.y - ball.r > h)
			{
				ball.resetPosition();
				paddle.resetPosition();
				//resetBricks();		
			}
			
			//Ball speed limiter, so the slight speed increase won't go too far
			if(ball.dx > 7) ball.dx = 7;
			if(ball.dx < -7) ball.dx = -7;
			
			if(bricks.length == 0){
				ss2State = 1;
				screenState = 2;
				
				//(TODO) if this level hasn't been completed yet
				if(!levelBeaten[0]) {
					levelsUnlocked++; 
				}
			}
			
			//Brick display
			for(var i = 0; i < bricks.length; i++){
				bricks[i].display("#99FF99");
			}
			
			//Brick collision
			for(var i = 0; i < bricks.length; i++){				
				//If within x range
				if(ball.x >= bricks[i].x && ball.x <= bricks[i].x + bricks[i].w){
					//Top side bounce check + ball direction check
					if(ball.y + ball.r >= bricks[i].y && ball.dy == Math.abs(ball.dy) && ball.dy != 0){
						//Checks if the ball is indeed on top of the brick
						if(!(ball.y - ball.r >= bricks[i].y + bricks[i].h)){
							ball.bounceY();
							ball.dx+=Math.floor(Math.abs(ball.x - bricks[i].x - bricks[i].w/2)/(bricks[i].w/2));
							bricks.splice(i, 1);
							break;
						}
					} 
					//Bottom side bounce check + ball direction check
					if(ball.y - ball.r <= bricks[i].y + bricks[i].h && ball.dy != Math.abs(ball.dy)){
						//Checks if the ball is indeed on the bottom of the brick					
						if(!(ball.y + ball.r <= bricks[i].y)){
							ball.bounceY();
							ball.dx+=Math.floor(Math.abs(ball.x - bricks[i].x - bricks[i].w/2)/(bricks[i].w/2));
							bricks.splice(i, 1);
							break;
						}
					}
				}
				//If within y range
				if(ball.y >= bricks[i].y && ball.y <= bricks[i].y + bricks[i].h){
					//Left side bounce check + ball direction check
					if(ball.x + ball.r >= bricks[i].x && ball.dx == Math.abs(ball.dx) && ball.dx != 0){
						//Checks if the ball is indeed on the left of the brick	
						if(!(ball.x - ball.r >= bricks[i].x + bricks[i].w)){
							ball.bounceX();
							bricks.splice(i, 1);
							break;
						}
					}
					//Right side bounce check + ball direction check
					if(ball.x - ball.r <= bricks[i].x + bricks[i].w && ball.dx != Math.abs(ball.dx)){
						//Checks if the ball is indeed on the right of the brick	
						if(!(ball.x + ball.r <= bricks[i].x)){
							ball.bounceX();
							bricks.splice(i, 1);
							break;
						}
					}
				}
			}
		}
		
		
		////////
		///LEVEL FINISHED SCREEN
		////////
		if(screenState == 2){
			//BG
			ctx.fillStyle = "#333333";
			ctx.fillRect(0,0, w, h);
			
			if(ss2State == 0){
				//Fail text
				ctx.font = "40px Arial";
				ctx.fillStyle = "#FF1111";
				ctx.fillText("Level Failed", 10, 50);
				
				//Only button goes back to menu
				
			} else if(ss2State == 1){
				//Next Level text
				ctx.fillStyle = "#11FF11";
				ctx.fillText("Level Finished", 10, 50);
				//Buttons for Next Level and back to Menu
				
			}
			
			//Shadow
			for(var i = 0; i < 2; i++){
				ctx.fillStyle = btnCols[i + 3] == "#999999" ? "#777777" : "#666666";
				ctx.fillRect(17 + (i*220), h - 67, 200, 50);
			}
			//Front
			for(var i = 0; i < 2; i++){
				ctx.fillStyle = btnCols[i + 3];
				ctx.fillRect(20 + (i*220), h - 70, 200, 50);
			}
			
			//Cursor
			ctx.fillStyle = "#FFFFFF";
			ctx.beginPath();
			ctx.moveTo(mx, my);
			ctx.lineTo(mx + 7, my + 9);
			ctx.lineTo(mx, my + 14);
			ctx.closePath();
			ctx.fill();
		}
		
		////////
		///LEVEL SELECT SCREEN
		////////
		if(screenState == 3){
			//BG
			ctx.fillStyle = "#333333";
			ctx.fillRect(0,0, w, h);
			
			//Shadow
			for(var i = 0; i < 2; i++){
				for(var j = 0; j < 5; j++){
					ctx.fillStyle = btnCols[i*5 + j + 5] == "#999999" ? "#777777" : "#666666";
					ctx.fillRect(47 + j*100, 53 + i*100, 70, 70);
				}
			}
			
			//Front
			for(var i = 0; i < 2; i++){
				for(var j = 0; j < 5; j++){
					ctx.fillStyle = btnCols[i*5 + j + 5];
					ctx.fillRect(50 + j*100, 50 + i*100, 70, 70);
					
					//Level Number Display
					ctx.fillStyle = "#FFFFFF";
					ctx.fillText(
						i*5 + j + 1, 
						70 + j*100  - ((i*5 + j + 1).toString().length > 1 ? ((i*5 + j + 1).toString().length - 1) * 10 : 0), 
						100 + i*100
					);
				}
			}
			
			//Cursor
			ctx.fillStyle = "#FFFFFF";
			ctx.beginPath();
			ctx.moveTo(mx, my);
			ctx.lineTo(mx + 7, my + 9);
			ctx.lineTo(mx, my + 14);
			ctx.closePath();
			ctx.fill();
		}
		
		////////
		///OPTIONS SCREEN
		////////
		if(screenState == 4){
			//BG
			ctx.fillStyle = "#333333";
			ctx.fillRect(0,0, w, h);
			
			//Shadow
			ctx.fillStyle = btnCols[15] == "#999999" ? "#777777" : "#666666";
			ctx.fillRect(17, 23, 200, 25);
			
			//Front
			ctx.fillStyle = btnCols[16];
			ctx.fillRect(20, 20, 200, 25);
			
			//Button Text
			ctx.font = "20px Calibri";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("Skip Next Level: " + (skipNextLevel ? "ON" : "OFF"), 25, 38);
			
			//Cursor
			ctx.fillStyle = "#FFFFFF";
			ctx.beginPath();
			ctx.moveTo(mx, my);
			ctx.lineTo(mx + 7, my + 9);
			ctx.lineTo(mx, my + 14);
			ctx.closePath();
			ctx.fill();
		}
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	
	//Brick constructor
	function Brick(x, y) {
		this.x = x;
		this.y = y;
		this.w = 50;
		this.h = 20;
	};
	
	function resetBricks(){
		bricks = [];
		
		//Level 1
		for(var i = 0; i < 3; i++){
			bricks.push(new Brick(240 + i*55, 100));
		}
		for(var i = 0; i < 4; i++){
			bricks.push(new Brick(215 + i*55, 125));
		}
		for(var i = 0; i < 3; i++){
			bricks.push(new Brick(240 + i*55, 150));
		}
	};
	
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	
	/////////////////
	///Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt){
		if(screenState == 0){
			if(mx >= 20 && mx <= 220){
				//Play
				if(my >= h - 210 && my <= h - 160){
					//Goes to first level if no other levels are unlocked
					screenState = levelsUnlocked > 1 ? 3 : 1;
				}
				//...
				if(my >= h - 140 && my <= h - 90){
					
				}
				//Options
				if(my >= h - 70 && my <= h - 20){
					screenState = 4;
				}
			}
		}
		
		if(screenState == 2){
			for(var i = 0; i < 2; i++){
				if(my >= h - 70 && my <= h - 20){
					if(mx >= 20 + (i*220) && mx <= (i+1)*220){
						
					}
				}
			}
		}
		
		if(screenState == 3){
			for(var i = 0; i < 2; i++){
				for(var j = 0; j < 5; j++){
					if(my >= 50 + i*100 && my <= 120 + i*100){
						if(mx >= 50 + i*100 && mx <= 120 + i*100){
							
						} else {
							
						}
					} else {
						
					}
				}
			}
		}
		
		if(screenState == 4){
			if(my >= 20 && my <= 45){
				if(mx >= 20 && mx <= 220){
					//Skip Next Level Screen (Not fail state)
					if(skipNextLevel) skipNextLevel = false;
					else if(!skipNextLevel) skipNextLevel = true;
				}
			}
		}
	}, false);

	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){
		pause = false;
		
	}, false);

	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;
		
		///Button colour change through mouseover (technically mousemove)
		
		//Menu
		if(screenState == 0){
			for(var i = 0; i < 3; i++){
				if(my >= h - ((i+1)*70) && my <= h -  20 - (i*70)){
					if(mx >= 20 && mx <= 220){
						btnCols[i] = "#999999";
					} else btnCols[i] = "#777777";					
				} else btnCols[i] = "#777777";				
			}
		}
		
		//Level Finished
		if(screenState == 2){
			for(var i = 0; i < 2; i++){
				if(my >= h - 70 && my <= h - 20){
					if(mx >= 20 + (i*220) && mx <= (i+1)*220){
						btnCols[i + 3] = "#999999";
					} else btnCols[i] = "#777777";					
				} else btnCols[i] = "#777777";				
			}
		}
		
		//Level Select
		if(screenState == 3){
			for(var i = 0; i < 2; i++){
				for(var j = 0; j < 5; j++){
					if(my >= 50 + (i*100) && my <= 120 + (i*100)){
						if(mx >= 50 + (j*100) && mx <= 120 + (j*100)){
							btnCols[i*5 + j + 5] = "#999999";
						} else btnCols[i*5 + j + 5] = "#777777";						
					} else btnCols[i*5 + j + 5] = "#777777";					
				}
			}
		}
		
		//Options
		if(screenState == 4){
			if(my >= 20 && my <= 45){
				if(mx >= 20 && mx <= 220){
					btnCols[15] = "#999999";
				} else btnCols[15] = "#777777";				
			} else btnCols[15] = "#777777"			
		}
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

	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		
		//Enter 13
		//Shift 16
		//Ctrl 17
		//Alt 18
		//Esc 27
		//Space 32
		//37 Left
		//38 Up
		//39 Right
		//40 Down
		//48-57 0-9 
		//65-90 A-Z
		//+= 187
		//-_ 189
		
		//alert(key);
		
		if(key == 187) levelsUnlocked++;
		if(key == 189) levelsUnlocked--;
		
		//prevents arrow scrolling (includes PgUp and PgDown)
		if($.inArray(key, ar) > -1){
			evt.preventDefault();
			return false;	
		}
		
		if(screenState != 0){
			if(key == 27){
				screenState = 0;
			}
		}
		
		//Quick short cut
		if(screenState == 0)
		{
			if(key == 13)
			{
				ss2State = 1;
				screenState = 2;
			}
		}
		
		//WASD and arrow key both supported
		
		if(screenState == 1){
			if(key == 32) {
				ball.dx = Math.floor(Math.random()*7)-3;
				ball.dy = -7;
			}
		}
		
	}, false);
})
