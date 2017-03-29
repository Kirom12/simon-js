
var Score = function() {
	this.currentScore = 0;

	this.main = function(score) {
		console.log("main score");

		this.currentScore = score;

		let saveScoreButton = document.querySelector("#save-score");
		var _this = this;

		saveScoreButton.addEventListener("click", function() {
			_this.saveScore();
		});
		
		this.displayScore();
	}

	this.displayScore = function() {
		let tableElement = document.querySelector("#score-table");

		if (localStorage.getItem("simon-game") !== null) {
			let scores = JSON.parse(localStorage.getItem("simon-game"));

			scores = this.sortingScore(scores);

			console.log(scores);

			let html = `
				<table>
					<tr>
						<th>Prénom</th>
						<th>Score</th>
					</tr>`;

			for (let i = scores.length - 1; i >= 0; i--) {
				console.log(scores[i]);
				html += `<tr><td>`+scores[i].name+`</td><td>`+scores[i].score+`</td></tr>`;
			}

			html += `</table>`;

			tableElement.innerHTML = html;
		}

	}

	this.saveScore = function() {
		let name = document.querySelector("#name-input").value;
		let data, scoreJson;

		if (localStorage.getItem("simon-game") === null) {
			console.log("storage empty");

			scoreJson = [{
				name: name,
				score: this.currentScore
			}]
		} else {
			console.log("storage full");

			scoreJson = JSON.parse(localStorage.getItem("simon-game"));

			console.log(scoreJson);

			data = {
				name: name,
				score: this.currentScore
			}

			scoreJson.push(data);
		}

		localStorage.setItem("simon-game", JSON.stringify(scoreJson));

		let scoreElement = document.querySelector("#score");
		scoreElement.style.display = "none";

		this.displayScore();
	}

	this.sortingScore = function(array) {
		let tmp;

		for (let i in array) {
			for (let j in array) {
				if (array[i].score < array[j].score) {
					tmp = array[i];
					array[i] = array[j];
					array[j] = tmp;
				}
			}
		}

		return array;
	}
}