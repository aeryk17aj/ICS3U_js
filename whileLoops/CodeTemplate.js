$(document).ready(function () {

	document.body.onmousedown = function () { return false; }; //so page is unselectable

	//Canvas stuff
	const canvas = $("#canvas")[0];
	const ctx = canvas.getContext("2d");
	const w = $("#canvas").width();
	const h = $("#canvas").height();
	let mx, my;
	let game_loop;

	let randNum;
	let one, two, three, four, five, six, eight, nine, ten;
	let inputString;
	let soldiers, creatures, victoryChance, tieChance;

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
	//will be constantly randomized in paint()
		randNum = 0;

	//necessary for counter to work
		one = 0;
		two = 0;
		three = 0;
		four = 0;
		five = 0;
		six = 0;
		eight = 0;
		nine = 0;
		ten = 0;

		soldiers = 25;
		creatures = 50;
		victoryChance = 7.5; // out of 10

	//It only does it once when entered correctly. Putting it in paint() will make it display repeatedly because it's a do/while loop
	//#2
		do {
			inputString = prompt("Say my name!","the answer is Heisenberg");
		} while (inputString != "Heisenberg");


	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 1000);
	}

	init();

	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint ()
	{
		//Necessary stuff
		ctx.fillStyle = "#00FF00";
		ctx.fillRect(0,0,w,h);
		ctx.fillStyle = "black";
		randNum = Math.floor(Math.random() * 10) + 1;

		ctx.fillStyle = 'blue';
		ctx.fillRect(95,20, 60, 60);
		ctx.fillStyle = "#00FF00";
		ctx.fillText("Reset", 110,50);

		ctx.fillStyle = 'black';
		//#1
		while (randNum != 7) {
			ctx.fillText(randNum, 95, 100 + (randNum * 10));
			//displays numbers in order, except 7 of course
			//if it were to generate 7, the fillText would've displayed it

			//#1b
			if (randNum == 1)one++;
			else if (randNum == 2)two++;
			else if (randNum == 3)three++;
			else if (randNum == 4)four++;
			else if (randNum == 5)five++;
			else if (randNum == 6)six++;
			else if (randNum == 8)eight++;
			else if (randNum == 9)nine++;
			else if (randNum == 10)ten++;

			//It can generate more than one number. 7 will not be avoided so it can end the loop
			randNum = Math.floor(Math.random() * 10) + 1;
		}

		//#3 This is what chooses the resolution of the battle
		while (soldiers > 0 && creatures > 0) {
			if (Math.floor(Math.random() * 10) + 1 <= victoryChance) {
				creatures -= 1;
			} else {
				soldiers -= 1;
			}
		}

		//#1b - Result Display
		ctx.fillText(one, 110, 110);
		ctx.fillText(two, 110, 120);
		ctx.fillText(three, 110, 130);
		ctx.fillText(four, 110, 140);
		ctx.fillText(five, 110, 150);
		ctx.fillText(six, 110, 160);
		ctx.fillText(eight, 110, 180);
		ctx.fillText(nine, 110, 190);
		ctx.fillText(ten, 110, 200);

		//#3 - Soldier/Creature Battle - Result Display
		ctx.fillText("Soldiers Left: " + soldiers,100,300);
		ctx.fillText("Creatures Left: " + creatures,100,310);
		if (soldiers == 0 && creatures > 0) {
			ctx.fillText("The creatures have dominated!", 100, 320);
		} else if (soldiers > 0 && creatures == 0) {
			ctx.fillText("The soldiers did it!", 100, 320);
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

		//Resets both the counter and the battle
		if (mx > 95 && mx < 95 + 60) {
			if (my > 20 && my < 20 + 60) {
				one = 0;
				two = 0;
				three = 0;
				four = 0;
				five = 0;
				six = 0;
				eight = 0;
				nine = 0;
				ten = 0;

				soldiers = 25;
				creatures = 50;
				victoryChance = 7.5;
			}
		}

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
