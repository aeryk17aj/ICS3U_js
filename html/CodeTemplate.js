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
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = '#00FF00';
		for (let i = 0; i <= 28; i += 1)
			ctx.fillText(Math.round((Math.random() * Math.pow(10,16)) + Math.pow(10,15)).toString(2),5,0 + (i * 10) + 15);
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

		//p 80
		//r 82
		//1 49
		//2 50
		//3 51
	}, false); */
});
