$(document).ready(function () {

	document.body.onmousedown = function () { return false; }; //so page is unselectable

	//Canvas stuff
	const canvas = $("#canvas")[0];
	const ctx = canvas.getContext("2d");
	const w = $("#canvas").width();
	const h = $("#canvas").height();
	let mx, my;
	let game_loop;

	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts
	//////////////////////////////
	/////////////////////////////
	function init ()
	{


	//////////
	///STATE VARIABLES

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
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0, w, h);

		ctx.fillStyle = "#00FF00";
		for (let i = 0;i <= 28;i += 1) {
			ctx.fillText(Math.round((Math.random() * Math.pow(10,16)) + Math.pow(10,15)).toString(2),5,0 + (i * 10) + 15);
		}
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////

	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt) {

	}, false);

	canvas.addEventListener ('mouseout', function () {}, false);
	canvas.addEventListener ('mouseover', function () {}, false);

	canvas.addEventListener('mousemove', function (evt) {
		const mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;
	}, false);


	function getMousePos (canvas, evt)
	{
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

	//p 80
	//r 82
	//1 49
	//2 50
	//3 51

	}, false);




});
