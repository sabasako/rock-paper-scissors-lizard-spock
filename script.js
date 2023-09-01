"use strict";

// prettier-ignore
const conclusionParagraph = document.querySelector("[data-conclusion-paragraph]");
const rulesBtn = document.querySelector("[data-rules-btn]");
const rulesSection = document.querySelector("[data-section-rules]");
const backgroundSection = document.querySelector("[data-section-background]");
const closeBtn = document.querySelector("[data-close-btn]");
const circles = document.querySelectorAll(".circle");
const pentagonSection = document.querySelector("[data-section-pentagon]");
const gameSection = document.querySelector("[data-section-game]");
const userPick = document.querySelector("[data-user-pick]");
const housePick = document.querySelector("[data-house-pick]");
const conclusion = document.querySelector("[data-conclusion]");
const gameParagraph = document.querySelector("[data-game-p]");
const scoreTextcontent = document.querySelector("[data-score]");
const playAgain = document.querySelector("[data-play-again]");
const userBackgroundCircle = document.querySelectorAll("#user-pick div");
const houseBackgroundCircle = document.querySelectorAll("#house-pick div");

class App {
  allCircles = ["scissors", "paper", "rock", "lizard", "spock"];
  userCircle;
  houseCircle;
  score = +localStorage.getItem("score") || 0;

  constructor() {
    // * Get data from local storage and display
    scoreTextcontent.textContent = this.score;

    // * Event handlers

    // When user clicks rules button, shows rules
    rulesBtn.addEventListener("click", this._showRules);

    // When user clicks close button, hides rules
    closeBtn.addEventListener("click", this._hideRules);

    // When user clicks on the background, hides rules
    backgroundSection.addEventListener("click", this._hideRules);

    // When user clicks on the Escape key, hides rules
    window.addEventListener("keydown", this._hideRules);

    // Event, when user chooses one of the options
    circles.forEach(this._changeDisplay, this);

    // Event, when user clicks play again button
    playAgain.addEventListener("click", this._restart);
  }

  _showRules() {
    rulesSection.classList.remove("hidden");
    backgroundSection.classList.remove("hidden");
    document.body.classList.add("hide-overflow");
    window.scrollTo(0, 0);
  }

  _hideRules(e) {
    if (e.key === "Escape") {
      rulesSection.classList.add("hidden");
      backgroundSection.classList.add("hidden");
      document.body.classList.remove("hide-overflow");
      return;
    }
    if (!e.key) {
      document.body.classList.remove("hide-overflow");
      rulesSection.classList.add("hidden");
      backgroundSection.classList.add("hidden");
    }
  }

  _changeDisplay(el) {
    el.addEventListener("click", () => {
      // User's circle name will become its class name
      this.userCircle = el.getAttribute("class").slice(7);

      // Changes display
      pentagonSection.classList.add("hidden");
      gameSection.classList.remove("hidden");

      // Selects circle based on selected circle value
      userPick.setAttribute("src", `images/icon-${this.userCircle}.svg`);
      userPick.parentElement.style.cssText = `border: ${this._correctBorder()}px solid var(--color-${
        this.userCircle
      });`;

      // Randomly selects house circle
      setTimeout(this._houseChooses.bind(this), 500);

      // Determines Winner (both times shoud match, otherwise function determines winner earlier than it is actually initialized)
      setTimeout(this._addConclusionDisplay.bind(this), 500);

      // Adds background for winner circles
      // setTimeout(this._addBackgroundCircle.bind(this), 500);
    });
  }

  _houseChooses() {
    // prettier-ignore
    housePick.setAttribute("src",`images/icon-${this._randomPick(this.allCircles)}.svg`);

    housePick.parentElement.style.cssText = `border: ${this._correctBorder()}px solid var(--color-${
      this.houseCircle
    }); background-color: #fff;`;
  }

  _addBackgroundCircle() {
    if (this._determineWinner() === "user") {
      userBackgroundCircle.forEach((el) => {
        el.classList.remove("hidden");
      });
    } else if (this._determineWinner() === "house") {
      houseBackgroundCircle.forEach((el) => {
        el.classList.remove("hidden");
      });
    }
  }

  _correctBorder() {
    // Returns circles border size based on users screen width
    if (window.screen.availWidth > 1220) return 35;
    else if (window.screen.availWidth > 950 && window.screen.availWidth < 1220)
      return 25;
    else if (window.screen.availWidth > 800 && window.screen.availWidth < 950)
      return 20;
    else if (window.screen.availWidth > 750 && window.screen.availWidth < 800)
      return 30;
    else if (window.screen.availWidth > 640 && window.screen.availWidth < 750)
      return 20;
    else if (window.screen.availWidth > 440 && window.screen.availWidth < 640)
      return 15;
    else if (window.screen.availWidth < 440) return 10;
  }

  _randomPick(args) {
    this.houseCircle = args[Math.floor(Math.random() * args.length)];
    return this.houseCircle;
  }

  _determineWinner() {
    const userIndex = this.allCircles.indexOf(this.userCircle) + 1;
    const houseIndex = this.allCircles.indexOf(this.houseCircle) + 1;

    let nextElement = userIndex + 1;
    let nextNextNextElement = userIndex + 3;

    // loops over array, so if nextElement is larger than length of an array, nextElements starts from the beginning of an array
    if (nextElement > this.allCircles.length)
      nextElement -= this.allCircles.length;
    if (nextNextNextElement > this.allCircles.length)
      nextNextNextElement -= this.allCircles.length;

    // I found that userCircle beats next and next next next element, and loses to next next and previous element, so I wrote conditions
    if (houseIndex === nextElement || houseIndex === nextNextNextElement)
      return "user";
    else if (userIndex === houseIndex) return "draw";
    else return "house";
  }

  _addConclusionDisplay() {
    gameSection.classList.add("game-conclusion");
    gameParagraph.classList.add("paragraph-conclusion");
    conclusion.classList.remove("hidden");
    if (this._determineWinner() === "user") {
      conclusionParagraph.textContent = "YOU WIN";
      this.score++;
      scoreTextcontent.textContent = this.score;
      this._updateLocalStorage();
    } else if (this._determineWinner() === "house") {
      conclusionParagraph.textContent = "YOU LOSE";
      this.score--;
      scoreTextcontent.textContent = this.score;
      this._updateLocalStorage();
    } else if (this._determineWinner() === "draw") {
      conclusionParagraph.textContent = "IT'S DRAW";
    }
  }

  _restart() {
    gameSection.classList.remove("game-conclusion");
    gameParagraph.classList.remove("paragraph-conclusion");
    conclusion.classList.add("hidden");
    pentagonSection.classList.remove("hidden");
    gameSection.classList.add("hidden");
    housePick.parentElement.style.cssText = "";
    housePick.removeAttribute("src");

    userBackgroundCircle.forEach((el) => {
      el.classList.add("hidden");
    });

    houseBackgroundCircle.forEach((el) => {
      el.classList.add("hidden");
    });
  }

  _updateLocalStorage() {
    localStorage.setItem("score", this.score);
  }
}

const app = new App();
