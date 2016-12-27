$(document).ready(function () {

	document.body.onmousedown = function () { return false; }; //so page is unselectable

	//Canvas stuff
	const canvas = $("#canvas")[0];
	const ctx = canvas.getContext("2d");
	const w = $("#canvas").width();
	const h = $("#canvas").height();
	let mx, my;
	let game_loop;

	const background = new Image();
	let frame, frameSpeed, frameCool, maxFrame;
	const frame1 = new Image();
	const frame2 = new Image();
	const frame3 = new Image();
	const frame4 = new Image();

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
		background.src = "assets/img/bg.jpg";

		frame = 1;
		frameSpeed = 10;
		frameCool = frameSpeed;
		maxFrame = 4;

		frame1.src = "assets/img/falzar.jpg";
		frame2.src = "assets/img/gregar.jpg";
		frame3.src = "assets/img/heat-cb.png";
		frame4.src = "assets/img/spout-cb.png";

	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 500);
	}

	init();

	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint ()
	{
		ctx.drawImage(background,0,0,w,h);

		//frame cooldown
		if (frameCool > 0) {
			frameCool -= 1;
		} else {
			frameCool = frameSpeed;
			frame += 1;
		}

		//frame reset
		if (frame > maxFrame) {
			frame = 1;
		}

		//frame draw loops
		if (frame == 1) {
			ctx.drawImage(frame1, 0, 0, 330, 373);
			frame = 2;
		} else if (frame == 2) {
			ctx.drawImage(frame2, w - 330, 0, 330, 373);
			frame = 3;
		} else if (frame == 3) {
			ctx.drawImage(frame3, w - 330, h - 373, 330, 373);
			frame = 4;
		} else if (frame == 4) {
			ctx.drawImage(frame4, 0, h - 373, 330, 373);
			frame = 1;
		}

		ctx.fillStyle = "#000000";
		ctx.fillText("Aeryk Protacio", 5,10);//top left
		ctx.fillText("Aeryk Protacio", 5,h - 7);//bottom left
		ctx.fillText("Aeryk Protacio", w - 75,10);//top right
		ctx.fillText("Aeryk Protacio", w - 75,h - 7);//bottom right

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
