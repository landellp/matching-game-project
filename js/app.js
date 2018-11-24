/*
 * Create a list that holds all of your cards
 */
let card = document.getElementsByClassName('card');
let allCards = [...card];
let deck = document.getElementsByClassName('deck')[0];

// variables needed for the score-panel move counter, stars, and timer
let moveCount = document.querySelector('.moves');
let stars = document.querySelectorAll('.fa-star');
let clock = document.querySelector('.timer');

// variables needed for card flip, match, disable functions to work
let matchingCard = document.getElementsByClassName('matching');
let openedCards = [];

// variable to update modal with dynamic statistics
let modal = document.getElementsByClassName('modal')[0];


// Function to ensure the cards are shuffled upon page load
document.body.onload = startGame();

// startGame function will shuffle cards, resets move counter, and runs start counter
function startGame() {
  allCards = shuffle(allCards);
  for (let i = 0; i < allCards.length; i++) {
  allCards.forEach(i => deck.appendChild(i));
    allCards[i].classList.remove('show', 'open', 'matching', 'disabled');
  }
  openedCards = [];
  moves = 0;
  moveCount.innerHTML = moves;
  for (let i = 0; i < stars.length; i++) {
    stars[i].style.color = '#ffff00';
    stars[i].style.display = 'inline';
  }
  let sec = 0;
  let min = 0;
  let hour = 0;
  let clock = document.querySelector('.timer');
  clock.innerHTML = '0 mins 0 secs';
  let interval;
  clearInterval(interval);
}

// function adds flipped cards to array, calls the counter function when two have been clicked, and checks if cards match
function cardFlip() {
  openedCards.push(this);
  let len = openedCards.length;
  if (len == 1 && moves == 0) {
    sec = 0;
    min = 0;
    hour = 0;
    startTimer();
  } else if (len === 2) {
    moveCounter();
    if (openedCards[0].type === openedCards[1].type) {
      matching();
    } else {
      noMatch();
    }
  }
}

// Calls startGame() function with user clicks restart icon
document.querySelector('.restart').addEventListener('click', startGame);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// function assigns/toggles classes to cards to drive css of card
let showCard = function() {
  this.classList.toggle('open');
  this.classList.toggle('show');
  this.classList.toggle('disabled');
};

// function will add and remove class based upon criteria
function matching() {
  openedCards[0].classList.add('matching', 'disabled');
  openedCards[1].classList.add('matching', 'disabled');
  openedCards[0].classList.remove('show', 'open');
  openedCards[1].classList.remove('show', 'open');
  openedCards = [];
}

// function looks for card mismatch and adds not-matching class and disables other cards from being flipped for .500 millisecs
function noMatch() {
  openedCards[0].classList.add('no-match');
  openedCards[1].classList.add('no-match');
  disable();
  setTimeout(function() {
    openedCards[0].classList.remove('show', 'open', 'no-match');
    openedCards[1].classList.remove('show', 'open', 'no-match');
    enable();
    openedCards = [];
  }, 500);
}

// function disables cards while others are flipped
function disable() {
  allCards.forEach(card => card.classList.add('disabled'));
}

// function enables cards and disables matched cards
function enable() {
  Array.prototype.filter.call(allCards, function(card) {
    card.classList.remove('disabled');
    for (let i = 0; i < matchingCard.length; i++) {
      matchingCard[i].classList.add('disabled');
    }
  });
}

// function increments counter and tracks performance in star list
function moveCounter() {
  moves++;
  moveCount.innerHTML = moves;
  if (moves > 14 && moves < 18) {
    for (i = 0; i < 3; i++) {
      if (i > 1) {
        stars[i].style.display = 'none';
      }
    }
  }
  else if (moves > 19) {
    for (i = 0; i < 3; i++) {
      if (i > 0) {
        stars[i].style.display = 'none';
      }
    }
  }
}

// function increments seconds to minutes and minutes to hours.  Seconds increment every 1000 millisecs
function startTimer() {
  interval = setInterval(function() {
    clock.innerHTML = min + ' mins ' + sec + ' secs';
    sec++;
    if (sec == 60) {
      min++;
      sec = 0;
    }
    if (min == 60) {
      hour++;
      min = 0;
    }
  }, 1000);
}

// function displays modal after 16 cards match to display the games metrics.
function modalMessage() {
  if (matchingCard.length == 16) {
    clearInterval(interval);
    let finalTime = clock.innerHTML;
    modal.classList.add('show');
    let starRating = document.querySelector('.stars').innerHTML;
    document.getElementsByClassName('final-moves')[0].innerHTML = moves;
    document.getElementsByClassName('star-rating')[0].innerHTML = starRating;
    document.getElementsByClassName('total-time')[0].innerHTML = finalTime;
  }
}

// Event Listener calls reset() function when play again button selected in modal
document.querySelector('.againButton').addEventListener('click', reset);

// function calls startGame() when restart button clicked and hides the flipped cards
function reset() {
  modal.classList.remove('show');
  startGame();
}

// Adds event listeners to each card
for (let i = 0; i < allCards.length; i++) {
  card = allCards[i];
  card.addEventListener('click', showCard);
  card.addEventListener('click', cardFlip);
  card.addEventListener('click', modalMessage);
}


