$(document).ready(function () {
	document.body.onmousedown = function () { return false; }; // so page is unselectable

	// Canvas stuff
	const canvas = $('#canvas')[0];
	const ctx = canvas.getContext('2d');
	const w = $('#canvas').width();
	const h = $('#canvas').height();
	// let mx, my;
	let gameLoop;

	function init () {
		if (!isGoodActor(prompt('What\'s your name?', ''))) alert('No. Not qualified');
		else alert('Hmm... pretty good.');

		if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
		gameLoop = setInterval(paint, 60);
	}

	init();

	function paint () {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, w, h);

		drawBody(50, 50);
		drawBody(130, 50);
	} // END PAINT/ GAME ENGINE

	// 1)
	function drawBody (x, y) {
		ctx.fillStyle = 'blue';
		// Head
		ctx.fillRect(x, y, 25, 25);
		// Body
		ctx.fillRect(x, y + 30, 25, 45);
		// Left Arm
		ctx.fillRect(x - 15, y + 30, 10, 40);
		// Right Arm
		ctx.fillRect(x + 30, y + 30, 10, 40);
		// Left Leg
		ctx.fillRect(x, y + 80, 10, 45);
		// Right Leg
		ctx.fillRect(x + 15, y + 80, 10, 45);
	}

	// 2)
	function generateNumber (par1, par2) {
		return Math.floor(Math.random() * (par2 - par1)) + par1;
	}

	// 3)
	function isGoodActor (yourName) {
		return yourName === 'Nicky Cage';
	}

	/* canvas.addEventListener('click', function (evt) {

	}, false);

	canvas.addEventListener('mouseout', function () {}, false);
	canvas.addEventListener('mouseover', function () {}, false);

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

	window.addEventListener('keydown', function (evt) {
		const key = evt.keyCode;

		// p 80
		// r 82
		// 1 49
		// 2 50
		// 3 51
	}, false); */
});
