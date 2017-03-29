
var Game = function() {
	this.screenDiv = document.querySelector(".screen");
	this.homeDiv = document.querySelector("#home");
	this.gameDiv = document.querySelector("#game");
	this.resultDiv = document.querySelector("#result");

	this.colorSequence = [];

	this.currentCheck = 0;
	this.currentColorBlink = 0;
	this.currentLevel = 1;
	this.currentLifes = 3;

	this.score = new Score();
	
	/*
	 *	Launch one time at startup (when the start button is clicked)
	 *	Hide/show screens, add events and create first sequence
	 */
	this.startGame = function() {
		this.homeDiv.setAttribute("class", "screen");
		this.gameDiv.setAttribute("class", "screen active");

		//Add replay event
		let replayButton = document.querySelector("#replay");

		replayButton.addEventListener("click", function() {
			location.reload();
		});

		this.addToSequence();
	}

	/*
	 *	Launch one time at stop
	 *	Hide game screen and show result
	 */
	this.stopGame = function() {
		this.gameDiv.setAttribute("class", "screen");
		this.resultDiv.setAttribute("class", "screen active");

		//Call score main function to initialize scoreboard
		this.score.main(this.currentLevel);
	}

	/*
	 *	Main function, called one time at loading
	 */
	this.main = function() {
		let playButton = document.querySelector("#play");
		let colorDiv = document.querySelectorAll(".color");
		let _this = this;

		this.debug();

		playButton.addEventListener("click", function(){
			_this.startGame();
		});

		for (var i = colorDiv.length - 1; i >= 0; i--) {
			colorDiv[i].addEventListener("click", function(e){
				_this.checkSequence(e);
			});
		}
	}

	/*
	 *	Check correct color every click and display animation
	 *
	 *	@param DOM element clicked element
	 */
	this.checkSequence = function(e) {
		let clickedClass = e.target.id;
		let divElement, lifesElement, levelElement;
		var _this = this;

		if (clickedClass == this.getClassColor(this.colorSequence[this.currentCheck])) {

			divElement = document.querySelector("#"+clickedClass);

			//todo: refactor this shit (create a function)
			divElement.classList.add("active");
			this.playSound(this.currentCheck);

			setTimeout(function() {
				divElement.classList.remove("active");
			}, 500)

			console.log("ok click");

			if (this.currentCheck == this.colorSequence.length-1) {
				console.log("new turn !");
				this.currentLevel += 1;
				this.currentCheck = 0;

				levelElement = document.querySelector("#current-level");
				levelElement.innerHTML = this.currentLevel;

				setTimeout(function() {
					_this.addToSequence();
				}, 1000);
			} else {
				console.log("wait a click");
				this.currentCheck += 1;
			}


		} else {
			console.log("nok click");
			
			this.displayError();

			this.currentLifes -= 1;

			this.updateUiElement("lifes", this.currentLifes);	

			//Loose
			if (this.currentLifes <= 0) {
				levelElement = document.querySelector("#final-level");
				levelElement.innerHTML = this.currentLevel;

				this.stopGame();
			}
		}
	}

	/*
	 *	Recursive function. Animate the sequence and play sound
	 *
	 *	@param int current animated square
	 */
	this.playSequence = function(index) {
		let divElement, className;
		var _this = this;

		className = this.getClassColor(this.colorSequence[index]);
		divElement = document.querySelector("#"+className);

		console.log("blink");

		//todo: refactor this shit (create a function)
		divElement.classList.add("active");
		this.playSound(this.colorSequence[index]);

		setTimeout(function() {
			divElement.classList.remove("active");

			if (_this.currentColorBlink == _this.colorSequence.length-1) {
				console.log("stop blink");
				_this.currentColorBlink = 0;
			} else {
				_this.currentColorBlink += 1;
				setTimeout(function() {
					_this.playSequence(_this.currentColorBlink);	
				}, 400);
			}
		}, 500);
	}

	/*
	 *	Color all squares
	 */
	this.displayError = function() {
		let divElement;

		document.querySelectorAll(".color").forEach(function(e) {
			e.classList.add("active");

			setTimeout(function() {
				e.classList.remove("active");
			}, 400)
		});
	}

	/*
	 *	Play a sound
	 *
	 *	@param int index of current square
	 */
	this.playSound = function(mp3Index) {
		let audio = new Audio();
		audio.src = "sounds/mp3/sounds_0"+(mp3Index+1)+".mp3";

		audio.addEventListener("canplaythrough", function() {
			audio.play();
        });
	}

	/*
	 *	Add index 0 to 3 to sequence array
	 */
	this.addToSequence = function() {
		this.colorSequence.push(Math.floor((Math.random() * (3+1))));

		this.playSequence(0);
		console.log(this.colorSequence);
	}

	/*
	 *	Modify a DOM element
	 *
	 *	@param String id element
	 *	@param String inner html
	 */
	this.updateUiElement = function(idName, content) {
		let element = document.querySelector("#"+idName);
		element.innerHTML = content;
	}

	/*
	 *	Get square class name with a index
	 *
	 *	@param int index of current square
	 */
	this.getClassColor = function(index) {
		switch (index) {
			case 0:
				return "color-green";
				break;
			case 1:
				return "color-red";
				break;
			case 2:
				return "color-yellow";
				break;
			case 3:
				return "color-blue";
				break;
			default:
				return;
		}
	}

	/* 
	 *	Use for debug
	 */
	this.debug = function() {
		let addButton = document.querySelector("#add-to-sequence");
		var _this = this;

		addButton.addEventListener("click", function() {
			_this.addToSequence();
		});
	}
}

var simon = new Game();
simon.main();