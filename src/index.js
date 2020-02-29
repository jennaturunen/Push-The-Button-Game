'use strict';
// Used HTML-elements
const mainBtn = document.querySelector('.circle');
const displayScores = document.querySelector('.scores');
const countTillWin = document.querySelector('.countTillWin');
const continueGame = document.querySelector('.continueGame');
const continueText = document.querySelector('.continueText');
const continueBtn = document.querySelector('.continueBtn');
const endBtn = document.querySelector('.endBtn');
const mainGame = document.querySelector('.mainGame');
const winningSection = document.querySelector('.winningSection');
const congrats = document.querySelector('.congrats');
const loserSection = document.querySelector('.loserSection');
const listOfLosers = document.querySelector('.listOfLosers');
const restartGameBtn = document.querySelector('.restartGameBtn');
const startGameBtn = document.querySelector('.startGameBtn');
const addPlayersSection = document.querySelector('.addPlayersSection');
const form = document.querySelector('form');
const whoIsNext = document.querySelector('.whoIsNext');

let allPlayers = [];
let currentPlayer;
let allLosers = [];
let counter = 0;
let randomPlayer;


/*
 * Get the players names from the input values and initialize the game
 */
startGameBtn.addEventListener('click', () => {
  const players = document.querySelectorAll('.players');
  // Choose every input where is value written and make it as a player
  for (const onePlayer of players) {
    if (onePlayer.value !== '') {
      const player = {};
      player.name = onePlayer.value;
      player.score = 10;
      allPlayers.push(player);
    }
  }

  // Has to be at least two players before starting the game
  if (allPlayers.length >= 2) {
    mainGame.style.display = 'flex';
    addPlayersSection.style.display = 'none';
    loserSection.style.display = 'flex';

    localStorage.setItem('players', JSON.stringify(allPlayers));
    localStorage.setItem('counter', counter);
    localStorage.setItem('losers', JSON.stringify(allLosers));

    form.reset();
    initGame();
  }
});


/*
 * Check if there is already a started game in localstorage and choose the starting player by random
 */
const initGame = () => {
  const previuousGamePlayers = JSON.parse(localStorage.getItem('players'));
  const previousGameCounter = localStorage.getItem('counter');
  const previousGameLosers = JSON.parse(localStorage.getItem('losers'));

  // If there is already a ongoing game in localstore, continue it
  if (previuousGamePlayers) {
    allPlayers = previuousGamePlayers;
    counter = parseInt(previousGameCounter);

    if (previousGameLosers !== null) {
      allLosers = previousGameLosers;
    }

    // Choose the starting player by random, after the players names have been inserted
    randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    whoIsNext.innerHTML = `<strong>${randomPlayer.name}</strong> it is your turn to press the button!`;

    // Check how many rounds till next win and display it
    const leftTillWin = 10 - counter % 10;
    countTillWin.innerHTML = `Presses left to next extra points: ${leftTillWin} `;

    addPlayersSection.style.display = 'none';
    mainGame.style.display = 'flex';
    loserSection.style.display = 'flex';
  }

  // Display all players
  for (const player of allPlayers) {
    displayScores.innerHTML += `<br><strong>${player.name}</strong> score: ${player.score}<br>`;
  }

  // Display all losers in HTML
  if (allLosers) {
    for (const loser of allLosers) {
      listOfLosers.innerHTML += `${loser.name}<br>`;
    }
  }

};


// When reloading the page, check the localstorage
initGame();


/*
 * Play the game by clicking the button
 */
const playTheGame = () => {

  // Update the counter
  counter++;
  localStorage.setItem('counter', counter);

  displayScores.innerHTML = '';

  randomPlayer.score--;
  currentPlayer = randomPlayer;

  // Add to extra-scores when there is winning round
  if (counter % 500 === 0) {
    randomPlayer.score += 250;
  } else if (counter % 100 === 0) {
    randomPlayer.score += 40;
  } else if (counter % 10 === 0) {
    randomPlayer.score += 5;
  }

  // Update the scores
  localStorage.setItem('players', JSON.stringify(allPlayers));

  // When the players score is zero, end or restart the game for the players part
  if (randomPlayer.score === 0) {
    mainGame.style.display = 'none';
    continueGame.style.display = 'flex';
    continueText.innerHTML = `Oh no <strong>${randomPlayer.name}</strong>! Your game ended. Would you like to restart or end the game?`;
  }

  // Display all players and the scores
  for (const player of allPlayers) {
    displayScores.innerHTML += `<br><strong>${player.name}</strong> score: ${player.score}<br>`;
  }

  // Check how many rounds till next win and display it
  const leftTillWin = 10 - counter % 10;
  countTillWin.innerHTML = `Presses left to next extra points: ${leftTillWin} `;

  // Choose the next player by random
  randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
  whoIsNext.innerHTML = `<strong>${randomPlayer.name}</strong> it is your turn to press the button!`;

};

mainBtn.addEventListener('click', playTheGame);


/*
 *  Display the winner in HTML and display the restart-view when the game is over
 */
const gameOver = () => {
  winningSection.style.display = 'flex';
  mainGame.style.display = 'none';
  loserSection.style.display = 'none';

  congrats.innerHTML = `Congratulations <strong>${allPlayers[0].name}</strong>, YOU WON THE GAME!!`;

  // Reset game
  allLosers = [];
  allPlayers = [];
  counter = 0;
  localStorage.setItem('players', allPlayers);
  localStorage.setItem('losers', allLosers);
  localStorage.setItem('counter', counter);
};


/*
 * When user wants to keep playing, set the score to 20 and continue the game
 */
continueBtn.addEventListener('click', () => {
  mainGame.style.display = 'flex';
  continueGame.style.display = 'none';

  currentPlayer.score = 20;

  displayScores.innerHTML = '';

  for (const player of allPlayers) {
    displayScores.innerHTML += `<br><strong>${player.name}</strong> score: ${player.score}<br>`;
  }

  localStorage.setItem('players', JSON.stringify(allPlayers));
});


/*
 * When player wants to end the game, check if there is a winner and display all the players and losers
 */
endBtn.addEventListener('click', () => {
  mainGame.style.display = 'flex';
  continueGame.style.display = 'none';

  // Save players and losers to separate arrays
  allLosers.push(currentPlayer);
  allPlayers = allPlayers.filter(player => player.score >= 1);

  localStorage.setItem('losers', JSON.stringify(allLosers));
  localStorage.setItem('players', JSON.stringify(allPlayers));

  // Choose the next player by random from the players who are still playing
  randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
  whoIsNext.innerHTML = `<strong>${randomPlayer.name}</strong> it is your turn to press the button!`;

  displayScores.innerHTML = '';
  listOfLosers.innerHTML = '';

  // Display all players and their scores in HTML
  for (const player of allPlayers) {
    displayScores.innerHTML += `<br><strong>${player.name}</strong> score: ${player.score}<br>`;
  }

  // Display all the losers in HTML
  for (const loser of allLosers) {
    listOfLosers.innerHTML += `${loser.name}<br>`;
  }

  // If there is only one player left -> game is over
  if (allPlayers.length === 1) {
    gameOver();
  }
});


/*
 * Clear the page and let player name the players again for the new game
 */
const restartTheGame = () => {
  addPlayersSection.style.display = 'flex';
  winningSection.style.display = 'none';

  // Clear HTMl
  displayScores.innerHTML = '';
  listOfLosers.innerHTML = '';
  countTillWin.innerHTML = '';
};

restartGameBtn.addEventListener('click', restartTheGame);
