$(document).ready(function () {
	document.body.onmousedown = function () { return false; }; // so page is unselectable

	// Canvas stuff
	const canvas = $('#canvas')[0];
	const ctx = canvas.getContext('2d');
	const w = $('#canvas').width();
	const h = $('#canvas').height();
	let mx, my;
	let gameLoop;
	let multiball, numBall, randBall;// , targetCool;
	const ballX = [];
	const ballY = [];
	let bDx = [];
	let bDy = [];
	const dist = [];
	let ballRad;
	let p1score, p2score, sPlus;
	let p1X, p2X, p1Y, p2Y, dHeight;
	let pLength, pHeight;
	let ar = [];
	let screenState;
	let displayScreen;
	const pongLogo = new Image();
	const buttonColor = [];
	let paddleAI, pSpeed;
	let p1col, p2col;
	let minIndex;

	/*
	VERSION 1.3
	*/

	// GAME INIT
	// Runs this code right away, as soon as the page loads.
	// Use this code to get everything in order before your game starts
	function init () {
		// STATE VARIABLES

		// Menu screen stuff

		// Screen State
		screenState = 0; displayScreen = [];
		// 0 = Menu
		// 1 = Options
		// 2 = Game
		// 3 = Info

		// Pong logo
		// ../../../assets/img/
		pongLogo.src = 'logo-pong.png';

		// button colors - for pages 0 & 1
		for (let i = 0; i < 8; i++) {
			buttonColor[i] = 'orangered';
		}

		// Menu screen stuff end////////////////////////////////////////////////////////////////////////////

		// Main Content Stuff

		// Original ball positions
		for (let i = 0; i < 3; i++) {
			ballX[i] = w / 2;
			ballY[i] = h / 2;
		}

		// ball stuff
		numBall = (multiball === 'ON') ? 3 : 1; // can be changed back to 1
		ballRad = 8;
		bDx = [0, 0, 0]; // will be randomized in-game
		bDy = [0, 0, 0];
		multiball = 'ON';
		minIndex = 0;

		// paddle stuff
		pLength = 10;
		pHeight = 100;
		p1col = '#FFFFFF';
		p2col = '#FFFFFF';
		pSpeed = 10;
		paddleAI = false;

		// paddle height, gets dynamically changed
		dHeight = (h / 2) - (pHeight / 2);
		p1Y = dHeight;
		p2Y = dHeight;

		// paddle top left coordinates
		p1X = 30;
		p2X = w - 45;

		// game score
		p1score = 0;
		p2score = 0;

		// other stuff
		ar = [33, 34, 35, 36, 37, 38, 39, 40]; // array of keys not to move the webpage when pressed
		sPlus = 0; // speed boost, adds up when paddle hits
		randBall = 0;
		// targetCool = 0; // paddle AI random target selector

		// one-time randomizer
		randDirection();

		// GAME ENGINE START
		//	This starts your game/program
		//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
		//	"60" sets how fast things should go
		//	Once you choose a good speed for your program, you will never need to update this file ever again.

		if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
		gameLoop = setInterval(paint, 30);
	}

	init();

	// Menu Screen
	displayScreen[0] = () => {
		for (let i = 0; i < 2; i++) { // SP and MP buttons
			ctx.fillStyle = buttonColor[i];
			ctx.fillRect(15, 15 + (i * 65), 200, 50);
		}
		// Options button
		ctx.fillStyle = buttonColor[2];
		ctx.fillRect(w - 230, 15, 200, 50);// 520, 15, to 720, 65
		// Info button
		ctx.fillStyle = buttonColor[8];
		ctx.fillRect(w - 230, 80, 200, 50);// 520, 80, to 720, 130

		// Button Text
		ctx.font = '25px Arial';
		ctx.fillStyle = 'white';
		ctx.fillText('1 Player', 20, 50);
		ctx.fillText('2 Player (Match)', 20, 115);
		ctx.fillText('Options', w - 220, 50);
		ctx.fillText('Additional Info', w - 220, 115);
		ctx.drawImage(pongLogo, 25, 250);

		// Mouseover tricks
		for (let i = 0; i < 2; i++) {
			// SP and MP buttons
			if (mx > 15 && mx < 215 && my > 15 + (i * 65) && my < 65 + (i * 65)) buttonColor[i] = 'blue';
			else buttonColor[i] = 'orangered';
		}

		if (mx > 520 && mx < 720 && my > 15 && my < 65) buttonColor[2] = 'blue';// Options
		else buttonColor[2] = 'orangered';

		if (mx > 520 && mx < 720 && my > 80 && my < 130) buttonColor[8] = 'blue';// Info
		else buttonColor[8] = 'orangered';

		// not having this keeps the balls stationary in the middle of the board
		randDirection();
	};

	function displayBackButton () {
		ctx.fillStyle = buttonColor[7]; // seperate button
		ctx.fillRect(15, 485, 100, 50); // " Back " ; 15, 485 to 115, 535
		ctx.font = '16px Verdana';
		ctx.fillStyle = 'white';
		ctx.fillText('Back', 30, h - 35);
		if (mx > 15 && mx < 115 && my > 485 && my < 535) buttonColor[7] = 'blue'; // back button
		else buttonColor[7] = 'orangered';
	}

	// Options Screen
	displayScreen[1] = () => {
		// Button dispplay
		for (let i = 0; i < 2; i++) {
			ctx.fillStyle = buttonColor[(i * 2) + 3]; // "-"
			ctx.fillRect(15, 15 + (i * 60), 50, 50);
			ctx.fillStyle = buttonColor[(i * 2) + 4]; // "+"
			ctx.fillRect(275, 15 + (i * 60), 50, 50);
			ctx.fillStyle = 'orangered';
			ctx.fillRect(70, 15 + (i * 60), 200, 50);
		}
		ctx.font = '16px Verdana';
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 2; i++) {
			ctx.fillText(' - ', 30, 45 + i * 60);
			ctx.fillText(' + ', 285, 45 + i * 60);
		}
		ctx.fillText('Paddle Speed: ' + pSpeed, 73, 45);
		ctx.fillText('Multi-ball: ' + multiball, 73, 105);

		// Button mousover
		for (let i = 0; i < 2; i++) {
			if (mx > 15 && mx < 65 && my > 15 + (i * 60) && my < 65 + (i * 60)) buttonColor[(i * 2) + 3] = 'blue';
			else buttonColor[(i * 2) + 3] = 'orangered';

			if (mx > 275 && mx < 325 && my > 15 + (i * 60) && my < 65 + (i * 60)) buttonColor[(i * 2) + 4] = 'blue';
			else buttonColor[(i * 2) + 4] = 'orangered';
		}

		displayBackButton();
	};

	function displayScore () {
		ctx.font = '30px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText(p1score, w / 4 + 5, 50);
		ctx.fillText(p2score, w * 3 / 4 - 5, 50);
	}

	function displayBalls () {
		for (let i = 0; i < numBall; i++) {
			// Displays the main ball(s)
			ctx.beginPath();
			ctx.globalAlpha = 0.8;
			ctx.arc(ballX[i], ballY[i], ballRad, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
			ctx.fill();
		}
	}

	function displayBallTrails () {
		for (let i = 0; i < numBall; i++) {
			// Trail	- multi ball support after multiball itself works
			// trail length default is 6
			for (let j = 0; j < 6; j++) {
				ctx.globalAlpha = 0.5;
				ctx.beginPath();
				// Math.random value gives the slight offset so it's not a straight trail
				ctx.arc(
					ballX[i] - j * bDx[i] + Math.floor(Math.random() * 7), // centre point x
					ballY[i] - j * bDy[i] + Math.floor(Math.random() * 7), // centre point y
					// Math.random()*a
					// a = spacing between balls
					ballRad - j, // radius
					0, // angle start
					2 * Math.PI);// angle end
				ctx.stroke(); // draws circle outline
				ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
				ctx.fill(); // fill the circle/s with color
			}
		}
	}

	function moveBall () {
		for (let i = 0; i < numBall; i++) {
			// Movement
			ballX[i] += bDx[i];
			ballY[i] += bDy[i];

			// Ball speed limiter - precautionary for paddle glitch
			if (bDx[i] > 10)bDx[i]--;
			else if (bDx[i] < (-10)) bDx[i]++;

			if (bDy[i] > 10)bDy[i]--;
			else if (bDy[i] < (-10))bDy[i]++;
		}
	}

	function bounceBallOffPaddle () {
		for (let i = 0; i < numBall; i++) {
			// Left paddle
			if (ballX[i] - ballRad < p1X + pLength && ballY[i] + ballRad > p1Y && ballY[i] < p1Y + pHeight) {
				bDx[i] *= (-1);
				p1col = colGen();

				// speed boost w/limit
				if (sPlus < 7) {
					bDx[i]--;
					sPlus++;
				}
			}

			// Right paddle - same conditions and methods for controlled and AI paddle
			if (ballX[i] + ballRad > p2X && ballY[i] > p2Y && ballY[i] < p2Y + pHeight) {
				bDx[i] *= (-1);
				p2col = colGen();

				if (sPlus < 7) {
					bDx[i]--;
					sPlus++;
				}
			}
		}
	}

	function paddleTube () {
		for (let i = 0; i < numBall; i++) {
			// Left tube
			// If the ball is manages to go inside the paddle, make the ball go vertical only.
			if (ballX[i] > p1X - 5 && ballX[i] < p1X + pLength + 5 && ballY[i] > p1Y && ballX[i] < p1Y + pLength) bDx[i] = 0;
			// Else if the ball is still travelling vertically after it it got out of the paddle, it will go towards the opponent's side.
			else if (bDx[i] === 0 && ballX[i] > p1X - 5 && ballX[i] < p1X + pLength + 5) {
				if (ballY[i] < p1Y - 10 || ballY[i] > p1Y + pHeight + 10) bDx[i] = Math.floor(Math.random() * 5) + 4;
			}

			// Right tube
			if (ballX[i] > p2X - 5 && ballX[i] < p2X + pLength + 5 && ballY[i] > p2Y && ballX[i] < p2Y + pLength) bDx[i] = 0;
			else if (bDx[i] === 0 && (ballY[i] < p2Y - 10 || ballY[i] > p2Y + pHeight + 10) && ballX[i] > p2X - 5 && ballX[i] < p2X + pLength + 5) {
				bDx[i] = Math.floor(Math.random() * 5) - 7;
			}
		}
	}

	function onBallSplice () {
		for (let i = 0; i < numBall; i++) {
			// multiball purge
			if ((ballX[i] > w - ballRad || ballX[i] < 0) && numBall > 1) {
				ballX.splice(i, 1);
				ballY.splice(i, 1);
				numBall--;
				if (paddleAI) randBall = Math.floor(Math.random() * numBall) + 1;
			// below here adds the score for the respective side
			} else if (ballX[i] > w - ballRad && numBall === 1) {
				resetGame('board');
				p1score++;
			} else if (ballX[i] < 0 && numBall === 1) {
				resetGame('board');
				p2score++;
			}
		}
	}

	function followBalls () {
		if (numBall > 1) {
			// Finds nearest ball
			for (let i = 0; i < numBall; i++) {
				dist[i] = p2X - ballX[i];
			}
			minIndex = dist.indexOf(arrayMin(dist));

			// Follows nearest ball - multiball
			for (let i = 0; i < numBall; i++) {
				if (ballY[minIndex] < p2Y && ballY[minIndex] - p2Y < pSpeed) {
					// If the ball is not near the border:
					// The paddle follows nearest ball with the speed it's given
					// With the limited speed, it may or may not catch the ball

					// if the ball is above the paddle
					if (ballY[minIndex] > pHeight / 2 + 15 && ballY[minIndex] < (h - 15) - pHeight / 2) {
						// if the distance between the ball and the centre of the paddle is LESS than the paddle speed
						if ((p2Y + pHeight / 2) - ballY[minIndex] > pSpeed) {
							// it moves with its max speed
							p2Y -= pSpeed;
						} else {
							// otherwise, it slows down as it nears the ball
							p2Y -= Math.sqrt((p2Y + pHeight / 2) - ballY[minIndex]);
						}
					// if the ball is below the paddle
					} else if (ballY[minIndex] > p2Y + pHeight && ballY[minIndex] - (p2Y + pHeight) < pSpeed) {
						// if the distance between the ball and the centre of the paddle is GREATER than the paddle speed
						if (ballY[minIndex] - (p2Y + pHeight / 2) > pSpeed) {
							// it moves with its max speed
							p2Y += pSpeed;
						} else {
							// otherwise, it slows down as it nears the ball
							p2Y += ballY[minIndex] - (p2Y + pHeight / 2);
						}
					}
				}
			}
		} else if (numBall === 1) {
			// Follows nearest ball - single ball, hence index 0
			if (ballY[0] > pHeight / 2 + 15 && ballY[0] < (h - 15) - pHeight / 2) {
				if (ballY[0] < p2Y && ballY[0] - p2Y < pSpeed) p2Y -= pSpeed;
				else if (ballY[0] > p2Y + pHeight && ballY[0] - (p2Y + pHeight) < pSpeed) p2Y += pSpeed;
			}
		}
	}

	// Game Screen
	displayScreen[2] = () => {
		// area divider using squares
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < h / 20; i++) {
			ctx.fillRect((w / 2) - 10, i * 20, 15, 15);
		}
		ctx.fillRect(0, 0, w, 15);
		ctx.fillRect(0, h - 15, w, 15);

		// Score display
		displayScore();

		// Note: Multiple for loops with identical conditions were necessary to make it work

		// Ball stuff
		// Multiball mode
		displayBalls();

		// Multiball trail
		displayBallTrails();

		// necessary resetting for other code below this line
		ctx.globalAlpha = 1;
		ctx.font = '10px Verdana';

		// Ball movement
		moveBall();

		// Paddle bounce
		bounceBallOffPaddle();

		// UNIQUE FEATURE - the paddles are actually tubes, this is not working, too
		paddleTube();

		ctx.fillStyle = 'white';
		// ctx.fillText(bDx + ' ' + bDy, 150, 150);

		// Ball splicer, score adder
		onBallSplice();

		// ball ceiling and floor bounce
		for (let i = 0; i < numBall; i++) {
			if (ballY[i] > h - ballRad - 15 || ballY[i] - ballRad < 15) bDy[i] *= (-1);
		}

		// Paddle
		// Display
		ctx.fillStyle = p1col;
		ctx.fillRect(p1X, p1Y, pLength, pHeight);
		ctx.fillStyle = p2col;
		ctx.fillRect(p2X, p2Y, pLength, pHeight);

		// Just a friendly reminder
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText('Press Backspace to go back to menu', 5, h - 20);

		if (paddleAI) followBalls();
		// AI Procedures
		/*
		OLD - not in this code
		1. Picks any of the 3 balls to chase
		2. Follows the ball w/same speed

		- Impossible to score against

		NEW - current
		1. Finds nearest ball
		2. TRIES to follow it using its limited speed
		3. If it does catch it within its range, it bounces the ball back

		+ Limited speed gives player a chance to score
		*/
	};

	// Info Screen
	displayScreen[3] = () => {
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = '#FFFFFF';
		ctx.font = '12px Verdana';
		ctx.fillText('Unique feature - The paddles work like tubes, meaning that the bounces on its respective sides work', 50, 50);
		ctx.fillText('as intended except with its top and bottom sides. How it works is it goes through the paddle ', 50, 65);
		ctx.fillText('vertically, and then goes towards the oppenent\'s side as soon as it\'s out of the paddle/tube.', 50, 80);

		ctx.fillText('Issues: quite a lot regarding the bounce. Workarounds have been made but are not fully effective', 50, 125);

		displayBackButton();
	};

	// Main Game Engine
	function paint () {
		// Background
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, w, h);

		displayScreen[screenState]();

		if (multiball === 'ON')numBall = ballX.length;
		else numBall = 1;
	} // END PAINT/ GAME ENGINE

	/*****************
	 * FUNCTION
	 ******/
	function resetGame (type) {
		if (type === 'game') {
			p1score = 0;
			p2score = 0;
			p1Y = dHeight;
			p2Y = dHeight;
		} else if (type === 'board') {
			p1Y = dHeight;
			p2Y = dHeight;
		}

		ballX[0] = w / 2;
		ballY[0] = h / 2;

		while (numBall !== 3) {
			ballX.push(h / 2);
			ballY.push(h / 2);
			numBall++;
		}

		sPlus = 0;
		p1col = '#FFFFFF';
		p2col = '#FFFFFF';
		randDirection();
	}

	function goToScreen (par1) {
		screenState = par1;
	}

	function randDirection () {
		for (let i = 0; i < numBall; i++) {
			switch (Math.floor(Math.random() * 4) + 1) {
				case 1:
					bDx[i] = Math.floor(Math.random() * 5) + 4;
					bDy[i] = Math.floor(Math.random() * 5) + 4;
					break;
				case 2:
					bDx[i] = Math.floor(Math.random() * 5) - 7;
					bDy[i] = Math.floor(Math.random() * 5) - 7;
					break;
				case 3:
					bDx[i] = Math.floor(Math.random() * 5) + 4;
					bDy[i] = Math.floor(Math.random() * 5) - 7;
					break;
				case 4:
					bDx[i] = Math.floor(Math.random() * 5) - 7;
					bDy[i] = Math.floor(Math.random() * 5) + 4;
					break;
			}
		}
	}

	function colGen () {
		let color = '#';
		const letters = '0123456789ABCDEF'.split('');
		for (let i = 0; i < 6; i++) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	}

	function arrayMin (arr) {
		return Math.min.apply(Math, arr);
	}

	// FUNCTIONS END

	/**********************
	 * Mouse Listeners
	 ***********/

	/*****************
	 * Mouse click
	 ******/
	canvas.addEventListener('click', () => {
		// Menu screenclicks
		if (screenState === 0) {
			if (mx > 520 && mx < 720 && my > 15 && my < 65) {
				goToScreen(1);
				paddleAI = false;
			} else if (mx > 14 && mx < 216 && my > 79 && my < 131) {
				goToScreen(2);
				paddleAI = false;
			} else if (mx > 14 && mx < 216 && my > 14 && my < 66) {
				goToScreen(2);
				paddleAI = true;
			} else if (mx > 520 && mx < 720 && my > 80 && my < 130) {
				goToScreen(3);
				paddleAI = false;
			}
		}

		// Options screen clicks
		if (screenState === 1) {
			if (mx > 15 && mx < 65 && my > 15 && my < 65 && pSpeed > 5) {
				pSpeed--;
			} else if (mx > 275 && mx < 325 && my > 15 && my < 65 && pSpeed < 25) {
				pSpeed++;
			}

			if (mx > 15 && mx < 65 && my > 75 && my < 125 && multiball === 'ON') {
				multiball = 'OFF';
			} else if (mx > 275 && mx < 325 && my > 75 && my < 125 && multiball === 'OFF') {
				multiball = 'ON';
			}
		}

		if (screenState === 1 || screenState === 3) {
			if (mx > 15 && mx < 115 && my > 485 && my < 535) {
				goToScreen(0);
			}
		}
	});

	canvas.addEventListener('mouseout', function () {});
	canvas.addEventListener('mouseover', function () {});

	canvas.addEventListener('mousemove', function (evt) {
		const mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;
	});

	function getMousePos (canvas, evt) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	/*****************
	 * KEY BOARD INPUT
	 ******/
	window.addEventListener('keydown', evt => {
		const key = evt.keyCode;

		// p 80
		// r 82
		// 1 49
		// 2 50
		// 3 51
		// w 87
		// s 83
		// i 87
		// j 83
		// up 38
		// down 40
		// prevents arrow scrolling (includes PgUp and PgDown)
		if ($.inArray(key, ar) > -1) {
			evt.preventDefault();
			return false;
		}
		// backspace while in-game returns to menu
		if (screenState === 2 && key === 8) {
			resetGame('game');
			goToScreen(0);
		}
		// paddle 1 move
		if (key === 87 && p1Y > 15 && p1Y - 15 > pSpeed) p1Y -= pSpeed;
		else if (key === 83 && p1Y < h - pHeight - ballRad && h - 15 - (p1Y + pHeight) > pSpeed) p1Y += pSpeed;

		// paddle 2, controllable when using 2-player match
		if (!paddleAI) {
			if (key === 73 && p2Y > 15 && p2Y - 15 > pSpeed) p2Y -= pSpeed;
			else if (key === 75 && p2Y < h - pHeight - ballRad && h - 15 - (p2Y + pHeight) > pSpeed)p2Y += pSpeed;
		}
	}, false);
});
