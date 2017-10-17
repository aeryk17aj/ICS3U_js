$(document).ready(function () {
	document.body.onmousedown = function () { return false; }; // so page is unselectable

	// Canvas stuff
	const canvas = $('#canvas')[0];
	const ctx = canvas.getContext('2d');
	const w = $('#canvas').width();
	const h = $('#canvas').height();
	let mx, my;
	let gameLoop;

	let randNum;
	let counts;
	let inputString;
	let soldiers, creatures, victoryChance;

	function init () {
		randNum = 0;

		counts = [];

		soldiers = 25;
		creatures = 50;
		victoryChance = 7.5; // out of 10

		// It only does it once when entered correctly. Putting it in paint() will make it display repeatedly because it's a do/while loop
		// #2
		do inputString = prompt('Say my name!', 'the answer is Heisenberg');
		while (inputString !== 'Heisenberg');

		if (typeof gameLoop !== 'undefined') 
			clearInterval(gameLoop);
		gameLoop = setInterval(paint, 1000);
	}

	init();

	function paint () {
		// Necessary stuff
		ctx.fillStyle = '#00FF00';
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = 'black';
		randNum = Math.floor(Math.random() * 10) + 1;

		ctx.fillStyle = 'blue';
		ctx.fillRect(95, 20, 60, 60);
		ctx.fillStyle = '#00FF00';
		ctx.fillText('Reset', 110, 50);

		ctx.fillStyle = 'black';
		// #1
		while (randNum !== 7) {
			ctx.fillText(randNum, 95, 100 + (randNum * 10));
			// displays numbers in order, except 7 of course
			// if it were to generate 7, the fillText would've displayed it

			// #1b
			counts[randNum - 1]++;

			// It can generate more than one number. 7 will not be avoided so it can end the loop
			randNum = Math.floor(Math.random() * 10) + 1;
		}

		// #3 This is what chooses the resolution of the battle
		while (soldiers > 0 && creatures > 0) {
			if (Math.floor(Math.random() * 10) + 1 <= victoryChance)
				creatures -= 1;
			else
				soldiers -= 1;
		}

		// #1b - Result Display
		counts.forEach((c, i) =>
			ctx.fillText(c, 110, 110 + i * 10));

		// #3 - Soldier/Creature Battle - Result Display
		ctx.fillText('Soldiers Left: ' + soldiers, 100, 300);
		ctx.fillText('Creatures Left: ' + creatures, 100, 310);
		if (soldiers === 0 && creatures > 0)
			ctx.fillText('The creatures have dominated!', 100, 320);
		else if (soldiers > 0 && creatures === 0)
			ctx.fillText('The soldiers did it!', 100, 320);
	}

	canvas.addEventListener('click', function (evt) {
		// Resets both the counter and the battle
		if (mx > 95 && mx < 95 + 60) {
			if (my > 20 && my < 20 + 60) {
				counts.map(_ => 0);

				soldiers = 25;
				creatures = 50;
				victoryChance = 7.5;
			}
		}
	}, false);

	// canvas.addEventListener('mouseout', function () {}, false);
	// canvas.addEventListener('mouseover', function () {}, false);

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

	/* window.addEventListener('keydown', function (evt) {
		const key = evt.keyCode;

		// p 80
		// r 82
		// 1 49
		// 2 50
		// 3 51
	}, false); */
});
