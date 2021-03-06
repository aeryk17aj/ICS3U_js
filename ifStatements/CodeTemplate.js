$(document).ready(function () {
	document.body.onmousedown = function () { return false; }; // so page is unselectable

	// Canvas stuff
	const canvas = $('#canvas')[0];
	const ctx = canvas.getContext('2d');
	const w = $('#canvas').width();
	const h = $('#canvas').height();
	let mx, my;
	let gameLoop;

	// Universal button width and height
	let bHeight;
	let bWidth;

	// Button colors
	let b1c, b2c, b3c;

	// X and Y coordinate of the top left corner of the left most button
	let tlx;
	let tly;

	function init () {
		// Button width and height
		bWidth = 70;
		bHeight = 70;

		// top left corner of left-est button
		tlx = 5;
		tly = 5;

		// Initial colors ranging from  dim yellow to blue
		b1c = ctx.fillStyle = '#5555' + (Math.round(Math.random() * 255)).toString(16);
		b2c = ctx.fillStyle = '#5555' + (Math.round(Math.random() * 255)).toString(16);
		b3c = ctx.fillStyle = '#5555' + (Math.round(Math.random() * 255)).toString(16);

		if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
		gameLoop = setInterval(paint, 60);
	}

	init();

	function paint () {
		// White Background
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, w, h);

		// Button drawing with for loops
		for (let i = 0; i < 3; i++) {
			switch (i) {
				case 0:
					ctx.fillStyle = b1c;
					break;
				case 1:
					ctx.fillStyle = b2c;
					break;
				case 2:
					ctx.fillStyle = b3c;
					break;
				default:
					ctx.fillStyle = '#000000';
			}
			ctx.fillRect(tlx + i * (bWidth + tlx), tly, bWidth, bHeight);
		}

		// Change color on mouseover
		if (my > 5 && my < 75) {
			if (mx > 5 && mx < 75)
				b1c = getRandomColor();
			if (mx > 80 && mx < 150)
				b2c = getRandomColor();
			if (mx > 155 && mx < 225)
				b3c = getRandomColor();
		}
	}

	// Returns a String containing a hexadecimal color value
	function getRandomColor () {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	/* canvas.addEventListener('click', function (evt) {

	}, false);

	canvas.addEventListener('mouseout', function () {}, false);
	canvas.addEventListener('mouseover', function () {}, false); */

	canvas.addEventListener('mousemove', function (evt) {
		const mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;
	}, false);

	function getMousePos (canvas, evt) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	/* window.addEventListener('keydown', function (evt) {
		const key = evt.keyCode;

		// p 80
		// r 82
		// 1 49
		// 2 50
		// 3 51
	}, false); */
});
