$(document).ready(function () {

	document.body.onmousedown = function () { return false; }; //so page is unselectable

	//Canvas stuff
	const canvas = $("#canvas")[0];
	const ctx = canvas.getContext("2d");
	const w = $("#canvas").width();
	const h = $("#canvas").height();
	let game_loop;
	let mx, my;
	let screenState;
	let displayScreen;
	let ball;
	let paddle;
	let ar;
	let bricks;
	let btnCols;
	let lives;
	let levelsUnlocked;
	let skipNextLevel;
	let infiniteLives;
	let ss2State;
	let levelBeaten;
	let generateLevel;
	let currentLevel;

	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts
	//////////////////////////////
	/////////////////////////////
	function init () {
		//array of keys not to move the webpage when pressed
		ar = [33,34,35,36,38,40];
		//Default is Menu Screen
		screenState = 0;
		// 0 - Fail/Out of Lives | 1 - Success/Destroyed all bricks
		ss2State = 0;
		//Array of boolean values that tells if level <index> is beaten or not (therefore, index 0 is always false)
		levelBeaten = [false, false, false];
		//Default
		currentLevel = 1;

		lives = 3;

		generateLevel = [
			function () {
				//NO OP; No Level 0
			},
			function () {
				bricks = [];
				for (let l1r1 = 0; l1r1 < 3; l1r1++) {
					bricks[l1r1] = new Brick(240 + l1r1 * 55, 100);
				}
				for (let l1r2 = 3; l1r2 < 7; l1r2++) {
					bricks[l1r2] = new Brick(215 + (l1r2 - 3) * 55, 125);
				}
				for (let l1r3 = 7; l1r3 < 10; l1r3++) {
					bricks[l1r3] = new Brick(240 + (l1r3 - 7) * 55, 150);
				}
			},
			function () {
				//Going the lazy way with the "add more bricks" mentality
				bricks = [];
				for (let l2r1 = 0; l2r1 < 5; l2r1++) {
					bricks[l2r1] = new Brick(185 + l2r1 * 55, 100);
				}
				for (let l2r2 = 5; l2r2 < 10; l2r2++) {
					bricks[l2r2] = new Brick(185 + (l2r2 - 5) * 55, 125);
				}
				for (let l2r3 = 10; l2r3 < 15; l2r3++) {
					bricks[l2r3] = new Brick(185 + (l2r3 - 10) * 55, 150);
				}
			},
			function () {
				//NO OP; Level 3 would've existed with more time
			}
		];

		//Initiates the first level at first boot
		generateLevel[currentLevel]();

		/*
		Button colour indexes used in each screen
		0-2     Menu
		3-4     Level Finished
		5-14    Level Select
		15-16   Options
		*/
		btnCols = [];
		for (let ibc = 0; ibc < 17; ibc++) {
			btnCols.push("#777777");
		}

		levelsUnlocked = 1;
		skipNextLevel = false;

		///Brick Layout End

		//Ball object
		ball = {
			x : w / 2,
			y : 440,//h*(3/4)
			//Radius
			r : 7,

			//Velocity in 2 directions
			dx : 0,
			dy : 0
		};

		ball.display = function (color) {
			this.color = color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fillStyle = color;
			ctx.fill();
		};

		ball.move = function () {
			ball.x += ball.dx;
			ball.y += ball.dy;
		};

		ball.resetPosition = function () {
			ball.x = w / 2;
			ball.y = 440;
			ball.dx = 0;
			ball.dy = 0;
		};

		ball.bounceX = function () {
			ball.dx = ball.dx * (-1);
		};

		ball.bounceY = function () {
			ball.dy = ball.dy * (-1);
		};

		//Paddle object
		paddle = {
			h : 10,
			w : 100,

			//Starting position
			x : w / 2 - 50, //Perfectly centred horizontally
			y : 450, //Near the bottom

			s : 20 //speed limit
		};

		paddle.display = function (color) {
			this.color = color;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.beginPath();
			ctx.moveTo(this.x, this.y + this.h);
			ctx.lineTo(this.x + this.w / 2, this.y + this.h + 10);
			ctx.lineTo(this.x + this.w, this.y + this.h);
			ctx.closePath();
			ctx.fill();
		};

		paddle.resetPosition = function () {
			paddle.x = w / 2 - 50;
		};

		//Brick static function
		Brick.prototype.display = function (color) {
			this.color = color;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		};

		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 14);
		//7 144fps
		//9 120fps
		//10 100fps
		//14 75fps
		//17 60fps
	}

	init();

	////////
	///MENU SCREEN
	////////
	displayScreen[0] = () => {
		//BG
		setBackground("#333333");

		///3 Buttons - [Play], [...], [Options]
		//Shadow
		for (let iSh = 0; iSh < 3; iSh++) {
			ctx.fillStyle = btnCols[iSh] == "#999999" ? "#777777" : "#666666";
			ctx.fillRect(17, h - 67 - (iSh * 70), 200, 50);
		}
		//Front
		for (let iFr = 0; iFr < 3; iFr++) {
			ctx.fillStyle = btnCols[iFr];
			ctx.fillRect(20, h - 70 - (iFr * 70), 200, 50);
		}

		//Text
		ctx.font = "48px Calibri";
		ctx.fillStyle = "#333333";
		ctx.fillText("Play", 30, 308);
		ctx.fillText("...", 30, 378);
		ctx.fillText("Options", 30, 448);

		//Cursor
		drawCursor();
	};

	displayScreen[1] = () => {
		//BG
		setBackground("#222222");

		//Side Border Overlay
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0, 100, h);
		ctx.fillRect(w - 100, 0, 100, h);

		//Ball init
		ball.display("#119911");
		ball.move();

		//Paddle init
		paddle.display("white");
		///Paddle position based on mouse position
		//if the paddle is right by the black boundaries
		if (mx >= 100 + paddle.w / 2 && mx <= w - 100 - paddle.w / 2) {
			paddle.x = mx - paddle.w / 2;
		}

		///Paddle collision
		//X Axis check
		if (ball.x >= paddle.x + ball.r && ball.x <= (paddle.x +  paddle.w) - ball.r)
		{
			//Y Axis + ball direction check (checks if dy is positive, to be specific)
			if (ball.y + ball.r >= paddle.y && ball.dy == Math.abs(ball.dy))
			{
				//Ball location check
				//This makes only the top side of the paddle bounce the ball
				//If the ball goes through the paddle, it simply passes through
				if (ball.y - ball.r < paddle.y + paddle.h)
				{
					ball.bounceY();
					//random dx increase (if it's 0); ranges from -3 to 3
					ball.dx += Math.floor(ball.dx) === 0 ?  (Math.random() * 7) - 4 : 0;
				}
			}
			//Bottom side of the paddle doesn't need bounce as the paddle is placed close to the bottom of the game window
		}

		///Ball wall bounce
		//Upper wall
		if (ball.y < ball.r)
		{
			ball.bounceY();
		}
		//Side walls
		if (ball.x < ball.r + 100 || ball.x > w - ball.r - 100)
		{
			ball.bounceX();
		}

		//The bottom is a pit. The ball resets if it goes there
		if (ball.y - ball.r > h)
		{
			ball.resetPosition();
			paddle.resetPosition();
			lives += infiniteLives ? 0 : -1;
		}

		//Ball speed limiter, so the slight speed increase won't go too far
		if (ball.dx > 7) ball.dx = 7;
		if (ball.dx < -7) ball.dx = -7;

		//Win condition
		if (bricks.length === 0) {
			if (!skipNextLevel) {
				ss2State = 1;
				setScreenFinished();
			} else {
				currentLevel++;
			}

			if (!levelBeaten[currentLevel]) {
				levelBeaten[currentLevel] = true;
				levelsUnlocked++;
			}
		}

		//Lose condition
		if (lives === 0) {
			ss2State = 0;
			setScreenFinished();
		}

		//Brick display
		for (let ibd = 0; ibd < bricks.length; ibd++) {
			bricks[ibd].display("#99FF99");
		}

		//Brick collision
		for (let iCol = 0; iCol < bricks.length; iCol++) {
			//If within x range
			if (ball.x >= bricks[iCol].x && ball.x <= bricks[iCol].x + bricks[iCol].w) {
				//Top side bounce check + ball direction check
				if (ball.y + ball.r >= bricks[iCol].y && ball.dy == Math.abs(ball.dy) && ball.dy !== 0) {
					//Checks if the ball is indeed on top of the brick
					if (ball.y - ball.r < bricks[iCol].y + bricks[iCol].h) {
						ball.bounceY();
						ball.dx += Math.floor(ball.x - (bricks[iCol].x + bricks[iCol].w / 2)) / (bricks[iCol].w / 2 - bricks[iCol].x);
						bricks.splice(iCol, 1);
						break;
					}
				}
				//Bottom side bounce check + ball direction check
				if (ball.y - ball.r <= bricks[iCol].y + bricks[iCol].h && ball.dy != Math.abs(ball.dy)) {
					//Checks if the ball is indeed on the bottom of the brick
					if (ball.y + ball.r > bricks[iCol].y) {
						ball.bounceY();
						ball.dx += Math.floor(ball.x - (bricks[iCol].x + bricks[iCol].w / 2)) / (bricks[iCol].w / 2 - bricks[iCol].x);
						bricks.splice(iCol, 1);
						break;
					}
				}
			}
			//If within y range
			if (ball.y >= bricks[iCol].y && ball.y <= bricks[iCol].y + bricks[iCol].h) {
				//Left side bounce check + ball direction check
				if (ball.x + ball.r >= bricks[iCol].x && ball.dx == Math.abs(ball.dx) && ball.dx !== 0) {
					//Checks if the ball is indeed on the left of the brick
					if (ball.x - ball.r < bricks[iCol].x + bricks[iCol].w) {
						ball.bounceX();
						bricks.splice(iCol, 1);
						break;
					}
				}
				//Right side bounce check + ball direction check
				if (ball.x - ball.r <= bricks[iCol].x + bricks[iCol].w && ball.dx != Math.abs(ball.dx)) {
					//Checks if the ball is indeed on the right of the brick
					if (ball.x + ball.r > bricks[iCol].x) {
						ball.bounceX();
						bricks.splice(iCol, 1);
						break;
					}
				}
			}
		}
	};

	displayScreen[2] = () => {
		//BG
		setBackground("#333333");

		//Failure State
		if (ss2State === 0)
		{
			//Level Failed text
			ctx.font = "40px Calibri";
			ctx.fillStyle = "#FF1111";
			ctx.fillText("Level Failed", 10, 50);
			ctx.fillText("You lost all 3 lives", 10, 100);

			//Shadow
			ctx.fillStyle = btnCols[3] == "#999999" ? "#777777" : "#666666";
			ctx.fillRect(17, h - 67, 200, 50);

			//Front
			ctx.fillStyle = btnCols[3];
			ctx.fillRect(20, h - 70, 200, 50);

			//Button Text
			ctx.font = "48px Calibri";
			ctx.fillStyle = "#333333";
			ctx.fillText("Menu", 35, 450);
		}
		//Victory State
		else if (ss2State == 1)
		{
			//Level Finished text
			ctx.font = "40px Calibri";
			ctx.fillStyle = "#11FF11";
			ctx.fillText("Level Finished", 10, 50);

			//Buttons for Next Level and back to Menu
			//Shadow
			for (let i = 0; i < 2; i++) {
				ctx.fillStyle = btnCols[i + 3] == "#999999" ? "#777777" : "#666666";
				ctx.fillRect(17 + (i * 220), h - 67, 200, 50);
			}
			//Front
			for (let i = 0; i < 2; i++) {
				ctx.fillStyle = btnCols[i + 3];
				ctx.fillRect(20 + (i * 220), h - 70, 200, 50);
			}

			//Button Text
			ctx.font = "48px Calibri";
			ctx.fillStyle = "#333333";
			ctx.fillText("Menu", 35, 450);
			ctx.fillText("Next Lvl", 255, 450);
		}

		//Cursor
		drawCursor();
	};

	////////
	///LEVEL SELECT SCREEN
	////////
	displayScreen[3] = () => {
		//BG
		setBackground("#333333");
		//Shadow
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < 5; j++) {
				ctx.fillStyle = btnCols[i * 5 + j + 5] == "#999999" ? "#777777" : "#666666";
				ctx.fillRect(47 + j * 100, 53 + i * 100, 70, 70);
			}
		}

		//Front
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < 5; j++) {
				ctx.fillStyle = btnCols[i * 5 + j + 5];
				ctx.fillRect(50 + j * 100, 50 + i * 100, 70, 70);

				//Level Number Display
				ctx.fillStyle = "#FFFFFF";
				ctx.fillText(
					i * 5 + j + 1,
					70 + j * 100  - ((i * 5 + j + 1).toString().length > 1 ? ((i * 5 + j + 1).toString().length - 1) * 10 : 0),
					100 + i * 100
				);
			}
		}

		//Cursor
		drawCursor();
	};

	////////
	///OPTIONS SCREEN
	////////
	displayScreen[4] = () => {
		//BG
		setBackground("#333333");

		//Shadow
		for (let i = 0; i < 2; i++) {
			ctx.fillStyle = btnCols[i + 15] == "#999999" ? "#777777" : "#666666";
			ctx.fillRect(17, 23 + i * 30, 200, 25);
		}

		//Front
		for (let i = 0; i < 2; i++) {
			ctx.fillStyle = btnCols[i + 15];
			ctx.fillRect(20, 20 + i * 30, 200, 25);
		}

		//Button Text
		ctx.font = "20px Calibri";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("Skip Next Level: " + (skipNextLevel ? "ON" : "OFF"), 25, 38);
		ctx.fillText("Infinite Lives: " + (infiniteLives ? "ON" : "OFF"), 25, 68);

		//Cursor
		drawCursor();
	};

	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	function paint () {
		displayScreen[screenState]();
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

	function setScreen (num) {screenState = num;}

	function setScreenMenu () {       setScreen(0);   }
	function setScreenGame () {       setScreen(1);   }
	function setScreenFinished () {   setScreen(2);   }
	function setScreenSelect () {     setScreen(3);   }
	function setScreenOptions () {    setScreen(4);   }

	function setBackground (color) {
		ctx.fillStyle = color;
		ctx.fillRect(0,0, w, h);
	}

	//Cursor used in all screens but the game screen
	function drawCursor () {
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.moveTo(mx, my);
		ctx.lineTo(mx + 7, my + 9);
		ctx.lineTo(mx, my + 14);
		ctx.closePath();
		ctx.fill();
	}

	//Brick constructor
	function Brick (x, y) {
		this.x = x;
		this.y = y;
		this.w = 50;
		this.h = 20;
	}

	function resetBricks () {
		generateLevel(currentLevel);
	}

	function setLevel (level) {
		currentLevel = level;
		generateLevel[level]();
	}

	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///	MOUSE LISTENER
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////

	/////////////////
	///Mouse Click
	///////////////
	canvas.addEventListener('click', e => {
		//Menu
		if (screenState === 0) {
			for (let i = 0; i < 3; i++) {
				if (my >= h - 210 + (i * 70) && my <= h - 160 + (i * 70)) {
					if (mx >= 20 && mx <= 220) {
						console.log(i);
						switch (i) {
							//Play
							case 0:
								//Goes to first level if no other levels are unlocked
								if (levelsUnlocked > 1) {
									setScreenSelect();
								} else {
									setScreenGame();
									setLevel(1);
								}
								break;
							//...
							case 1:
								alert("You expected a change of screens, but it was me, an alert!");
								break;
							//Options
							case 2:
								setScreenOptions();
								break;
							default:
						}
					}
				}
			}
		}

		//Game
		if (screenState == 1) {
			if (ball.dx === 0 && ball.dy === 0) {
				ball.dx = Math.floor(Math.random() * 7) - 3;
				ball.dy = -7;
			}
		}

		//Level Finished
		if (screenState == 2) {
			for (let i = 0; i < 2; i++) {
				if (my >= h - 70 && my <= h - 20) {
					if (mx >= 20 + (i * 220) && mx <= (i + 1) * 220) {
						switch (i) {
							//Main Menu
							case 0:
								setScreenMenu();
								break;
							//Next Level
							case 1:
								if (currentLevel == 1) {
									setScreenGame();
									setLevel(2);
								} else if (currentLevel == 2) {
									alert("That's the end of it!");
								}
								break;
							default:
						}
					}
				}
			}
		}


		//Level Select
		if (screenState == 3) {
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < 5; j++) {
					if (my >= 50 + (i * 100) && my <= 120 + (i * 100)) {
						if (mx >= 50 + (j * 100) && mx <= 120 + (j * 100)) {
							setScreenGame();
							setLevel((i * 5) + j + 1);
						}
					}
				}
			}
		}


		//Options
		if (screenState == 4) {
			for (let i = 0; i < 2; i++) {
				if (my >= 20 + i * 30 && my <= 45 + i * 30) {
					if (mx >= 20 && mx <= 220) {
						switch (i) {
							case 0:
								//Skip Next Level Screen (Not fail state)
								if (skipNextLevel) skipNextLevel = false;
								else if (!skipNextLevel) skipNextLevel = true;
								break;
							case 1:
								//Toggle Lives
								if (infiniteLives) infiniteLives = false;
								else if (!infiniteLives) infiniteLives = true;
								break;
							default:
						}
					}
				}
			}
		}
	}, false);

	canvas.addEventListener ('mouseout', () => {});
	canvas.addEventListener ('mouseover', () => {});

	canvas.addEventListener('mousemove', function (evt) {
		const mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

		///Button colour change through mouseover (technically mousemove)
		/*
		Button colour indexes used in each screen
		0-2     Menu
		3-4     Level Finished
		5-14    Level Select
		15-16   Options
		*/

		//Menu
		if (screenState === 0) {
			for (let i = 0; i < 3; i++) {
				if (my >= h - ((i + 1) * 70) && my <= h -  20 - (i * 70)) {
					if (mx >= 20 && mx <= 220) {
						btnCols[i] = "#999999";
					} else btnCols[i] = "#777777";
				} else btnCols[i] = "#777777";
			}
		}

		//Level Finished
		if (screenState == 2) {
			for (let i = 0; i < 2; i++) {
				if (my >= h - 70 && my <= h - 20) {
					if (mx >= 20 + (i * 220) && mx <= (i + 1) * 220) {
						btnCols[i + 3] = "#999999";
					} else btnCols[i + 3] = "#777777";
				} else btnCols[i + 3] = "#777777";
			}
		}

		//Level Select
		if (screenState == 3) {
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < 5; j++) {
					if (my >= 50 + (i * 100) && my <= 120 + (i * 100)) {
						if (mx >= 50 + (j * 100) && mx <= 120 + (j * 100)) {
							btnCols[i * 5 + j + 5] = "#999999";
						} else btnCols[i * 5 + j + 5] = "#777777";
					} else btnCols[i * 5 + j + 5] = "#777777";
				}
			}
		}

		//Options
		if (screenState == 4) {
			for (let i = 0; i < 2; i++) {
				if (my >= 20 + i * 30 && my <= 45 + i * 30) {
					if (mx >= 20 && mx <= 220) {
						btnCols[i + 15] = "#999999";
					} else btnCols[i + 15] = "#777777";
				} else btnCols[i + 15] = "#777777";
			}
		}
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
	///	KEY BOARD INPUT
	////////////////////////////////

	/*
	Enter 13
	Shift 16
	Ctrl 17
	Alt 18
	Esc 27
	Space 32
	37 Left
	38 Up
	39 Right
	40 Down
	48-57 0-9
	65-90 A-Z
	+= 187
	-_ 189
	*/

	window.addEventListener('keydown', function (evt) {
		const key = evt.keyCode;

		//alert(key);

		//prevents arrow scrolling (includes PgUp and PgDown)
		if ($.inArray(key, ar) > -1) {
			evt.preventDefault();
			return false;
		}

		//Debug
		if (key == 187) levelsUnlocked++;
		if (key == 189) levelsUnlocked--;

		//Esc to menu
		if (screenState !== 0 && key == 27) setScreenMenu();

		//Quick short cut: Warps straight to the 'Level Finished' screen. Feel free to use this to see if things work
		if (screenState === 0 || screenState == 1)
		{
			if (key == 13)
			{
				ss2State = 1;
				setScreenFinished();
			}
		}

		if (screenState == 1) {
			//Alternative ball launch: Space
			if (key == 32 && ball.dx === 0 && ball.dy === 0) {
				ball.dx = Math.floor(Math.random() * 7) - 3;
				ball.dy = -7;
			}
		}
	}, false);
});
