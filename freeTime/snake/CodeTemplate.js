$(document).ready(function () {
	document.body.onmousedown = function () { return false; }; // so page is unselectable

	// Canvas stuff
	const canvas = $('#canvas')[0];
	const ctx = canvas.getContext('2d');
	const w = $('#canvas').width();
	const h = $('#canvas').height();
	let mx, my;
	let gameLoop;

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
	let nx, ny;

	function init () {
		snakeHeadX = 1;
		snakeHeadY = 1;
		snakeSpeed = 1;

		nx = snakeArray[0].x;
		ny = snakeArray[0].y;

		tileX = 1;
		tileY = 1;
		cellWidth = 20;
		cellHeight = cellWidth;
		gridLength = 30; // pixel length = 1 + (gridLength*(cellWidth+1))
		gridHeight = 30; // pixel height = 1 + (gridHeight*(cellHeight+1))

		fruitX = 0;
		fruitY = 0;

		// Internal
		started = false;
		points = 0;
		direction = 2; // 1-2-3-4 | left-up-right-down
		debugMode = true;

		if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
		gameLoop = setInterval(paint, 60);
	}

	init();

	function paint () {
		// Background (Gray)
		ctx.fillStyle = '#888888';
		ctx.fillRect(0, 0, w, h);

		// Game Grid (White Squares)
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < gridLength; i++) {
			tileX = 1 + (21 * i);
			for (let j = 0; j < gridHeight; j++) {
				tileY = 1 + (21 * j);
				ctx.fillRect(tileX, tileY, cellWidth, cellHeight);
			}
		}

		spawnSnake();
		spawnFruit();

		if (snakeHeadX === fruitX && snakeHeadY === fruitY) {
			generateFruitCoords();
			// snakeLength+=1;
			points += 1;
		}

		// Debug button to generate random fruit position
		if (debugMode) {
			ctx.fillStyle = '#009933';
			ctx.fillRect(w - 21, h - 21, 20, 20);

			ctx.fillStyle = '#0000FF';
			ctx.fillRect(w - 42, h - 21, 20, 20);

			ctx.fillStyle = '#990000';
			ctx.fillRect(w - 63, h - 21, 20, 20);
		}
	}

	function spawnFruit () {
		ctx.fillStyle = '#FF0000';
		if (fruitX === 0 || fruitY === 0)
			generateFruitCoords();

		ctx.fillRect(fruitX, fruitY, cellWidth, cellHeight);
	}

	function spawnSnake () {
		let snakeLength = 3;
		snakeArray = [];
		for (let i = snakeLength - 1; i >= 0; i--)
			snakeArray.push({ x: i, y: 0 });

		ctx.fillStyle = '#000000';
		if (snakeHeadX < (1 + ((cellWidth + 1) * 5)) || snakeHeadX > (1 + ((cellWidth + 1) * 25))) {
			if (snakeHeadY < (1 + ((cellHeight + 1) * 5)) || snakeHeadY > 1 + ((cellHeight + 1) * 25)) {
				if (!started) {
					generateSnakeCoords();
					started = true;
				}
			}
		}
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

	canvas.addEventListener('click', function (evt) {
		if (mx >= w - 21 && my >= h - 21 && mx <= w && my <= h)
			generateFruitCoords();

		if (mx >= w - 42 && my >= h - 21 && mx <= w - 21 && my <= h) {
			console.log('Fruit X: ' + fruitX);
			console.log('Fruit Y: ' + fruitY);
		}

		if (mx >= w - 63 && my >= h - 21 && mx <= w - 42 && my <= h) {
			console.log('Snake X: ' + snakeHeadX);
			console.log('Snake Y: ' + snakeHeadY);
		}
	}, false);

	canvas.addEventListener('mouseout', function () {}, false);
	canvas.addEventListener('mouseover', function () {}, false);

	canvas.addEventListener('mousemove', function (evt) {
		const { left, top } = canvas.getBoundingClientRect();

		mx = evt.clientX - left;
		my = evt.clientY - top;
	}, false);

	window.addEventListener('keydown', function (evt) {
		const key = evt.keyCode;

		if (key === 37) {
			if (!(snakeHeadX === 1))
				snakeHeadX -= 21;
		} else if (key === 38) {
			if (!(snakeHeadY === 1))
				snakeHeadY -= 21;
		} else if (key === 39) {
			if (!(snakeHeadX === w - 21))
				snakeHeadX += 21;
		} else if (key === 40) {
			if (!(snakeHeadY === h - 21))
				snakeHeadY += 21;
		}

		if (key > 36 && key < 41)
			direction = key - 36;

		console.log(key);
	}, false);
});
