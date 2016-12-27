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

		drawBody(50, 50);
		drawBody(130, 50);

	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

	///1)
	function drawBody (x, y) {
		ctx.fillStyle = "blue";
		//Head
		ctx.fillRect(x, y, 25, 25);
		//Body
		ctx.fillRect(x, y + 30, 25, 45);
		//Left Arm
		ctx.fillRect(x - 15, y + 30, 10, 40);
		//Right Arm
		ctx.fillRect(x + 30, y + 30, 10, 40);
		//Left Leg
		ctx.fillRect(x, y + 80, 10, 45);
		//Right Leg
		ctx.fillRect(x + 15, y + 80, 10, 45);
	}

	///2)
	function generateNumber (par1, par2) {
		return Math.floor(Math.random() * (par2 - par1)) + par1;
	}

	/*
	3) Write a function that has parameters (yourName).  Have the function return true of false
	based on if the name send in is the same as "Nicky Cage".  This function only returns a value
	it does NOT use fillText, or alert, or prompt or anything like that.

	Use you function with a prompt and alert up in the init section to get the program to ask for a name
	and alert whether or not the user is good actor based on the results from the function you wrote.
	*/

	///3)
	function isGoodActor (yourName) {
		return yourName == "Nicky Cage";
	}

	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER

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
