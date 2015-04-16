$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
	
	var snakeHeadX, snakeHeadY;
	var snakeSpeed;
	var snakeArray;
	var tileX, tileY;
	var cellWidth, cellHeight;
	var gridLength, gridHeight;
	var fruitX, fruitY;
	var started;
	var points;
	var direction;
	var debugMode;
	var nx, ny;


	
	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{
		
	//////////
	///STATE VARIABLES
	
	snakeHeadX = 1;
	snakeHeadY = 1;
	snakeSpeed = 1;
	
	nx = snakeArray[0].x;
	ny = snakeArray[0].y;
	
	tileX = 1;
	tileY = 1;
	cellWidth = 20;
	cellHeight = cellWidth;
	gridLength = 30; //pixel length = 1 + (gridLength*(cellWidth+1))
	gridHeight = 30; //pixel height = 1 + (gridHeight*(cellHeight+1))
	
	fruitX = 0;
	fruitY = 0;
	
	//Internal
	started = false;
	points = 0;
	direction = 2; // 1-2-3-4 | left-up-right-down
	debugMode = true;
	
	
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
		
		//Background (Gray)
		ctx.fillStyle = "#888888";
		ctx.fillRect(0,0, w, h);	
		
		//Game Grid (White Squares)
		ctx.fillStyle = "#FFFFFF";
		for (var i = 0; i < gridLength; i++){
			tileX = 1 + (21*i);
			for (var j = 0; j < gridHeight; j++){
				tileY = 1 + (21*j);
				ctx.fillRect(tileX, tileY, cellWidth, cellHeight);
			}
		}
		
		spawnSnake();
		spawnFruit();
		
		if(snakeHeadX == fruitX && snakeHeadY == fruitY){
			generateFruitCoords();
			//snakeLength+=1;
			points+=1;
		}
		
		//Debug button to generate random fruit position
		if(debugMode){
			ctx.fillStyle="#009933";
			ctx.fillRect(w-21, h-21, 20, 20);
			
			ctx.fillStyle="#0000FF";
			ctx.fillRect(w-42, h-21, 20, 20);
			
			ctx.fillStyle="#990000";
			ctx.fillRect(w-63, h-21, 20, 20);
		}
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	
	////////// FUNCTIONS
	function spawnFruit(){
		ctx.fillStyle="#FF0000";
		if(fruitX == 0 || fruitY == 0){
			generateFruitCoords();	
		}
		ctx.fillRect(fruitX, fruitY, cellWidth, cellHeight);
	}
	
	function spawnSnake(){
		var snakeLength = 3;
		snakeArray = [];
		for(var i = length - 1; i>=0; i--)
		{
			snakeArray.push({x:i, y:0});
		}
		ctx.fillStyle = "#000000";
		if(snakeHeadX < (1 + ((cellWidth + 1) * 5)) || snakeHeadX > (1 + ((cellWidth + 1) * 25))){
			if(snakeHeadY < (1 + ((cellHeight + 1) * 5)) || snakeHeadY > 1 + ((cellHeight + 1) * 25)){
				if(!started){
					generateSnakeCoords();
					started = true;
				}
			}
		}
		ctx.fillRect(snakeHeadX, snakeHeadY, cellWidth, cellHeight);
	}
	
	function generateFruitCoords(){
		fruitX = 1 + ((cellWidth + 1) * (Math.round(Math.random() * (gridLength - 1))));	
		fruitY = 1 + ((cellHeight + 1) * (Math.round(Math.random() * (gridHeight - 1))));
	}
	
	function generateSnakeCoords(){
		snakeHeadX = 1 + ((cellWidth + 1) * 5) + ((cellWidth + 1) * (Math.round(Math.random() * (gridLength - 10))));
		snakeHeadY = 1 + ((cellHeight + 1) * 5) + ((cellHeight + 1) * (Math.round(Math.random() * (gridHeight - 10))));
	}
	
	
	////////// FUNCTIONS END

	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	





	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt){
		if(mx >= w-21 && my >= h-21 && mx <= w && my <= h){
			generateFruitCoords();	
		}
		if(mx >= w-42 && my >= h-21 && mx <= w-21 && my <= h){
			console.log("Fruit X: " + fruitX);
			console.log("Fruit Y: " + fruitY);
		}
		if(mx >= w-63 && my >= h-21 && mx <= w-42 && my <= h){
			console.log("Snake X: " + snakeHeadX);
			console.log("Snake Y: " + snakeHeadY);
		}
		
	      
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
		
		if(key == 37)
		{
			if(!(snakeHeadX == 1))
			{
				snakeHeadX-=21;
			}
		} 
		else if(key == 38) 
		{
			if(!(snakeHeadY == 1))
			{
				snakeHeadY-=21;
			}
		}
		else if(key == 39)
		{
			if(!(snakeHeadX == w-21))
			{
				snakeHeadX+=21;
			}	
		} 
		else if(key == 40)
		{
			if(!(snakeHeadY == h-21))
			{
				snakeHeadY+=21;	
			}
		}
		if(key > 36 && key < 41){
			direction = key-36;
		}
		console.log(key);
		
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
	//w 87
	//a 65
	//s 83
	//d 68
	//left 37
	//up 38
	//right 39
	//down 40
		
	}, false);




})
