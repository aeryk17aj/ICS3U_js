$(document).ready(function () {
	document.body.onmousedown = function () { return false; }; // so page is unselectable

	// Canvas stuff
	const canvas = $('#canvas')[0];
	const ctx = canvas.getContext('2d');
	const w = $('#canvas').width();
	const h = $('#canvas').height();
	let mx, my;
	let gameLoop;

	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts
	//////////////////////////////
	/////////////////////////////
	function init () {
		//////////
		///STATE VARIABLES

		//////////////////////
		///GAME ENGINE START
		//	This starts your game/program
		//	'paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
		//	'60' sets how fast things should go
		//	Once you choose a good speed for your program, you will never need to update this file ever again.

		if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
		gameLoop = setInterval(paint, 60);
	}

	init();

	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint () {
		ctx.fillStyle = '#00FF00';
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = '#000000';
		// #1
		for (let i = 0; i < 5; i++) {
			ctx.fillText('Aeryk', 20, 20 + (i * 10));
		}

		// #2
		ctx.fillText('W', 20, 70);
		for (let j = 0; j < 15; j++) {
			ctx.fillText('o', 28 + j * 5, 70);
		}

		// #3
		for (let k = 0; k < 6; k++) {
			ctx.fillRect(20 + k * 10, 80, 10, 10);
			ctx.fillRect(120, 80 + k * 10, 10, 10);
			ctx.fillRect(220 + k * 10, 80 + k * 10, 10, 10);
			ctx.fillRect(320 + k * 5, 80 + k * 10, 10, 10);
		}

		//#4
		for (let l = 0; l < Math.max(w, h) / 10; l++) {
			ctx.fillRect(0, l * 15, 10, 10);
			ctx.fillRect(l * 15, 0, 10, 10);
			ctx.fillRect(w - 10, l * 15, 10, 10);
			ctx.fillRect(l * 15, h - 10, 10, 10);
		}
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER

	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt) {

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

	///////////////////////////////////
	//////////////////////////////////
	//          KEY BOARD INPUT
	////////////////////////////////

	window.addEventListener('keydown', function (evt) {
		// const key = evt.keyCode;

		// p 80
		// r 82
		// 1 49
		// 2 50
		// 3 51
	}, false);
});
