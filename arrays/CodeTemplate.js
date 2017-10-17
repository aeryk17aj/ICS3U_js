$(document).ready(function () {
	document.body.onmousedown = function () { return false; }; // so page is unselectable

	// Canvas stuff
	const canvas = $('#canvas')[0];
	const ctx = canvas.getContext('2d');
	const w = $('#canvas').width();
	const h = $('#canvas').height();
	// let mx, my;
	let gameLoop;

	// #1
	const tenWords = [];

	// #2
	let threeVerbs = [];

	// #3
	const fiveNumbers = [];

	// #4
	const twentyNumbers = [];
	let removeNum;
	let spliced;

	function init () {
		// #1 Prompt
		for (let i = 0; i < 10; i++)
			tenWords[i] = prompt('Put a word', 'type here');

		// #2 Array
		threeVerbs = ['tumbling', 'eating', 'reaching'];

		// #3 Array value generator
		for (let i = 0; i < 5; i++)
			fiveNumbers[i] = Math.floor(Math.random() * 99);

		// #4 Array value generator + number to be removed
		for (let i = 0; i < 20; i++)
			twentyNumbers[i] = Math.floor(Math.random() * 10) + 1;

		// #4 Step 2
		// removeNum = Math.floor(Math.random()*10);
		do removeNum = prompt('What number do you want to be removed? (1-10)', '1');
		while (!(removeNum >= 1 && removeNum <= 10)); // It won't stop asking until it gets an input of 1-10

		spliced = 0;

		//////////
		//    STATE VARIABLES

		//////////////////////
		//    GAME ENGINE START
		//  This starts your game/program
		//  'paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
		//  '60' sets how fast things should go
		//  Once you choose a good speed for your program, you will never need to update this file ever again.

		if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
		gameLoop = setInterval(paint, 60);
	}

	init();

	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	//          Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint () {
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, w, h);

		// #1 Display
		ctx.fillStyle = '#000000';
		for (let i = 0; i < tenWords.length; i++)
			ctx.fillText(tenWords[i], 5, 15 + (10 * i));

		// #2 Display
		ctx.fillText('I am ' + threeVerbs[Math.floor(Math.random() * threeVerbs.length)] + ' towards the sofa', 5, 130);

		// #3.1 Sorts the array values in descending order
		fiveNumbers.sort(function (a, b) { return b - a; });

		// #3.2 Display
		for (let i = 0; i < 5; i++) {
			let moreWords = '';
			if (i === 0)
				moreWords = ' Index 0 is always the highest'; else moreWords = ''; // Just being cheap
			ctx.fillText(fiveNumbers[i].toString() + moreWords, 5, 150 + 10 * i);
		}

		// #4 Step 1
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 4; j++) {
				// It will stop the display loop as soon as it hits an undefined value
				if (!twentyNumbers[(j * 5) + i]) break;
				// starting from 5, 220, it displays a 5x4 number grid from the array
				ctx.fillText(twentyNumbers[(j * 5) + i], 5 + i * 15, 220 + j * 15);
			}
		}

		// #4 Step 3
		for (let i = 0; i < twentyNumbers.length; i++) {
			if (twentyNumbers[i] === removeNum) {
				twentyNumbers.splice(i, 1);
				spliced++;
			}
		}
		ctx.fillText(spliced + ' numbers were spliced.', 5, 300);
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
		// const key = evt.keyCode;

		// p 80
		// r 82
		// 1 49
		// 2 50
		// 3 51
	}, false); */
});
