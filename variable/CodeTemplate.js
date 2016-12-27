$(document).ready(function () {

	document.body.onmousedown = function () { return false; }; //so page is unselectable

	//Canvas stuff
	const canvas = $("#canvas")[0];
	const ctx = canvas.getContext("2d");
	const w = $("#canvas").width();
	const h = $("#canvas").height();
	let mx, my;
	let game_loop;

	let myName, myAge;

	let itemName, itemPrice;
	let taxAmount, taxPrice;

	const Item = function (name, price) {
		this.name = name;
		this.price = price;
	};

	let items1, items2, items3, items4, items5;

	const pokeStatus = {
		RegTotal:301,
		NatTotal:649,
		NatSeen:485,
		RegSeen:280,
		NatCaptured:171,
		RegCaptured:105
	};
	let name, avg;
	let marks1, marks2, marks3, marks4;

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
		myName = "Aeryk";
		myAge = 15;

		itemName = "Iron";
		itemPrice = 815;
		taxAmount = itemPrice * 0.15;
		taxPrice = itemPrice * 1.15;

		items1 = new Item("5 Skill Points",20);
		items2 = new Item("10 Skill Points", 35);
		items3 = new Item("1 Starter Boost", 15);
		items4 = new Item("3 Starter Boosts",40);
		items5 = new Item("20 of each Bundle Pack", 100);

		name = "Peterson, Hugh";
		marks1 = 65;
		marks2 = 73;
		marks3 = 82;
		marks4 = 91;
		avg = (marks1 + marks2 + marks3 + marks4) / 4;

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
		ctx.fillStyle = '#66FFFF';
		ctx.fillRect(0,0,w,h);

		ctx.fillStyle = '#56972F';
		ctx.fillRect(10,10,w - 20,h - 20);

		ctx.fillStyle = 'white';
		ctx.fillText("My name is " + myName + " and I'm " + myAge + " years old.", 50,50);

		ctx.fillText("The original price of " + itemName + " is " + itemPrice + " with tax value of " + taxAmount + " adding up to a total of " + Math.round(taxPrice) + ".", 50, 70);

		//keeping 2 sentences in the same line for name /t price
		ctx.fillText(items1.name, 50, 90); ctx.fillText(items1.price, 200, 90);
		ctx.fillText(items2.name, 50, 100); ctx.fillText(items2.price, 200, 100);
		ctx.fillText(items3.name, 50, 110); ctx.fillText(items3.price, 200, 110);
		ctx.fillText(items4.name, 50, 120); ctx.fillText(items4.price, 200, 120);
		ctx.fillText(items5.name, 50, 130); ctx.fillText(items5.price, 200, 130);

		ctx.fillText("Endgame Summary: (as of September 19, 2013)", 50, 150);
		ctx.fillText(pokeStatus.NatTotal + " total number of Pokemon from Gen I to V", 50, 160);
		ctx.fillText(pokeStatus.RegTotal + " total number of Pokemon in the Unova Region (B2/W2)", 50, 170);
		ctx.fillText("Captured " + pokeStatus.RegCaptured + " out of " + pokeStatus.RegSeen + " seen Pokemon in the Unova region.", 50, 180);
		ctx.fillText("Captured " + pokeStatus.NatCaptured + " out of " + pokeStatus.NatSeen + " seen Pokemon nationally.", 50, 190);
		ctx.fillText(name + "'s average is " + Math.round(avg) + ". (" + avg + ")",50, 210);

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
