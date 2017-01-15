$(document).ready(function () {

	document.body.onmousedown = function () { return false; }; //so page is unselectable

	//Canvas stuff
	const canvas = $("#canvas")[0];
	const ctx = canvas.getContext("2d");
	const w = $("#canvas").width();
	const h = $("#canvas").height();
	let mx, my;
	let game_loop;
	let ar;

	let snakeHeadX, snakeHeadY;
	let snakeSpeed;
	let snakeArray;
	let tileX, tileY;
	let cellWidth, cellHeight;
	let gridLength, gridHeight;
	let fruitX, fruitY;
	let started;
	let points;
	let direction;
	let debugMode;

	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts
	//////////////////////////////
	/////////////////////////////
	function init () {
		//array of keys not to move the webpage when pressed
		ar = [33,34,35,36];

		snakeHeadX = 1;
		snakeHeadY = 1;
		snakeSpeed = 1;
		snakeArray = [];

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
		direction = "right"; // 1-2-3-4 | left-up-right-down
		debugMode = true;


	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}

	init();

	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint ()
	{

		//Background (Gray)
		ctx.fillStyle = "#888888";
		ctx.fillRect(0,0, w, h);

		drawGrid();
		spawnSnake();
		drawSnake();
		spawnFruit();

		let nx = snakeArray[0].x;
		let ny = snakeArray[0].y;

		if (direction == "right") nx++;
		else if (direction == "left") nx--;
		else if (direction == "up") ny--;
		else if (direction == "down") ny++;

		if (nx == -1 || nx == w / cellWidth || ny == -1 || ny == h / cellWidth || wallCheck(nx, ny)) {
			init();
			return;
		}

		/*if(snakeHeadX == fruitX && snakeHeadY == fruitY){
			generateFruitCoords();
			//snakeLength+=1;
			points+=1;
		}*/

		//Debug button to generate random fruit position
		/*if(debugMode){
			ctx.fillStyle="#009933";
			ctx.fillRect(w-21, h-21, 20, 20);

			ctx.fillStyle="#0000FF";
			ctx.fillRect(w-42, h-21, 20, 20);

			ctx.fillStyle="#990000";
			ctx.fillRect(w-63, h-21, 20, 20);
		}
		*/

	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

	////////// FUNCTIONS

	function drawGrid () {
		ctx.fillStyle = "#FFFFFF";
		for (let i = 0; i < gridLength; i++) {
			tileX = 1 + (21 * i);
			for (let j = 0; j < gridHeight; j++) {
				tileY = 1 + (21 * j);
				ctx.fillRect(tileX, tileY, cellWidth, cellHeight);
			}
		}
	}

	function spawnFruit () {
		ctx.fillStyle = "#FF0000";
		if (fruitX === 0 || fruitY === 0) {
			generateFruitCoords();
		}
		ctx.fillRect(fruitX, fruitY, cellWidth, cellHeight);
	}

	function spawnSnake () {
		const snakeLength = 3;
		for (let i = snakeLength - 1; i >= 0; i--) snakeArray.push({'x':i, 'y':0});
		if (snakeHeadX < (1 + ((cellWidth + 1) * 5)) || snakeHeadX > (1 + ((cellWidth + 1) * 25))) {
			if (snakeHeadY < (1 + ((cellHeight + 1) * 5)) || snakeHeadY > 1 + ((cellHeight + 1) * 25)) {
				if (!started) {
					generateSnakeCoords();
					started = true;
				}
			}
		}
	}

	function drawSnake () {
		ctx.fillStyle = "#000000";
		ctx.fillRect(snakeHeadX, snakeHeadY, cellWidth, cellHeight);
	}

	function generateFruitCoords () {
		fruitX = 1 + ((cellWidth + 1) * (Math.round(Math.random() * (gridLength - 1))));
		fruitY = 1 + ((cellHeight + 1) * (Math.round(Math.random() * (gridHeight - 1))));
	}

	function generateSnakeCoords () {
		snakeHeadX = 1 + ((cellWidth + 1) * 5) + ((cellWidth + 1) * (Math.round(Math.random() * (gridLength - 10))));
		snakeHeadY = 1 + ((cellHeight + 1) * 5) + ((cellHeight + 1) * (Math.round(Math.random() * (gridHeight - 10))));
	}

	function wallCheck (x, y) {
		// console.log(`${x} ${y}`);
		if (x < 0 || y < 0) return true;
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
	canvas.addEventListener('click', function () {
		if (mx >= w - 21 && my >= h - 21 && mx <= w && my <= h) {
			generateFruitCoords();
		}
		if (mx >= w - 42 && my >= h - 21 && mx <= w - 21 && my <= h) {
			console.log("Fruit X: " + fruitX);
			console.log("Fruit Y: " + fruitY);
		}
		if (mx >= w - 63 && my >= h - 21 && mx <= w - 42 && my <= h) {
			console.log("Snake X: " + snakeHeadX);
			console.log("Snake Y: " + snakeHeadY);
		}
	}, false);

	canvas.addEventListener('mouseout', function () {});
	canvas.addEventListener('mouseover', function () {});

	canvas.addEventListener('mousemove', function (evt) {
		const mousePos = getMousePos(evt);

		mx = mousePos.x;
		my = mousePos.y;
	}, false);

	function getMousePos (evt) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////

	window.addEventListener('keydown', function (evt) {
		const key = evt.keyCode;

		if ($.inArray(key, ar) > -1) {
			evt.preventDefault;
			return false;
		}

		if (key == 37) {
			if (snakeHeadX != 1) snakeHeadX -= 21;
		}
		else if (key == 38) {
			if (snakeHeadY != 1) snakeHeadY -= 21;
		}
		else if (key == 39) {
			if (snakeHeadX != w - 21) snakeHeadX += 21;
		}
		else if (key == 40) {
			if (snakeHeadY != h - 21)snakeHeadY += 21;
		}
		if (key > 36 && key < 41) direction = key - 36;
		// console.log(key);

		// P  R  1  2  3  W  A  S  D
		// 80 82 49 50 51 87 65 83 68

		// (Direction) U  D  L  R
		//             38 40 37 39
	}, false);
});
