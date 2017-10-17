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
		if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
		gameLoop = setInterval(paint, 60);
	}

	init();

	function paint () {
		ctx.fillStyle = '#F0F0F0';
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = '#808080';
		ctx.fillText('Hello World.', 100, 50);
	} // END PAINT/ GAME ENGINE

/* 	canvas.addEventListener('click', function (evt) {

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
