let pepe = setInterval(miFuncion,1000);

function miFuncion() {
  console.log("hola");
  console.log("me voy");
}

const cardObjectDefinitions = [
  { id: 1, imagePath: "images/cmm-154-drown-in-sorrow (1).png" },
  { id: 2, imagePath: "images/cmr-113-corpse-churn.png" },
  { id: 3, imagePath: "images/cmr-115-crow-of-dark-tidings.png" },
  { id: 4, imagePath: "images/cmr-147-revenant.png" },
];

const aceId = 4;

const cardBackImgPath = "images/reverso_de_carta.jpg";

const cardContainerElem = document.querySelector(".card-container");

let cards = [];

const playGameButtonElem = document.getElementById("playGame");

const collapseGridAreaTemplate = '"a a" "a a"';
const cardCollectionCellClass = ".card-pos-a";

const numCards = cardObjectDefinitions.length;

const cardPositions = [];

let gameInProgress = false;
let shufflingInProgress = false;
let cardsRevealed = false;

const currentGameStatusElem = document.querySelector(".current-status");
const scoreContainerElem = document.querySelector(".header-score-container");
const scoreElem = document.querySelector(".score");
const roundContainerElem = document.querySelector(".header-round-container");
const roundElem = document.querySelector(".round");

const winColor = "green";
const loseColor = "red";
const primaryColor = "black";

let roundNum = 0;
let maxRounds = 4;
let score = 0;

loadGame();

function gameOver() {
  updateStatusElement(scoreContainerElem, "none");
  updateStatusElement(roundContainerElem, "none");

  const gameOverMessage = `Game Over! Final Score - <span class="badge">${score}</span>
                           Click 'Play Game' button to play again.`;

  updateStatusElement(
    currentGameStatusElem,
    "block",
    primaryColor,
    gameOverMessage
  );

  gameInProgress = false;
  playGameButtonElem.disabled = false;
}

function endRound() {
  setTimeout(() => {
    if (roundNum == maxRounds) {
      gameOver();
      return;
    } else {
      startRound();
    }
  }, 2000);
}

function chooseCard(card) {
  if (canChooseCard()) {
    evaluateCardChoice(card);
    flipCard(card, false);

    setTimeout(() => {
      flipCards(false);
      updateStatusElement(
        currentGameStatusElem,
        "block",
        primaryColor,
        "Card positions revealed"
      );

      endRound();
    }, 3000);

    cardsRevealed = true;
  }
}
function calculateScoreToAdd(roundNum) {
  if (roundNum == 1) {
    return 100;
  } else if (roundNum == 2) {
    return 50;
  } else if (roundNum == 3) {
    return 25;
  } else {
    return 10;
  }
}

function calculateScore() {
  const scoreToAdd = calculateScoreToAdd(roundNum);
  score += scoreToAdd;
}

function updateScore() {
  calculateScore();
  updateStatusElement(
    scoreElem,
    "block",
    primaryColor,
    `Score <span class="badge">${score}</span>`
  );
}

function updateStatusElement(elem, display, color, innerHTML) {
  elem.style.display = display;
  if (arguments.length > 2) {
    elem.style.color = color;
    elem.innerHTML = innerHTML;
  }
}

function outputChoiceFeedBack(hit) {
  if (hit) {
    updateStatusElement(
      currentGameStatusElem,
      "block",
      winColor,
      "Hit!! - Well Done!!"
    );
  } else {
    updateStatusElement(
      currentGameStatusElem,
      "block",
      loseColor,
      "Missed!! :("
    );
  }
}
function evaluateCardChoice(card) {
  if (card.id == aceId) {
    updateScore();
    outputChoiceFeedBack(true);
  } else {
    outputChoiceFeedBack(false);
  }
}
function canChooseCard() {
  return gameInProgress == true && !shufflingInProgress && !cardsRevealed;
}

//Load Game y Start Game functions ------------------------
function loadGame() {
  createCards();

  cards = document.querySelectorAll(".card");

  cardFlyInEffect();

  playGameButtonElem.addEventListener("click", () => startGame());

  updateStatusElement(scoreContainerElem, "none");
  updateStatusElement(roundContainerElem, "none");
}

function startGame() {
  initializeNewGame();
  startRound();
  alert("pepe");
}
function initializeNewGame() {
  score = 0;
  roundNum = 0;

  shufflingInProgress = false;

  updateStatusElement(scoreContainerElem, "flex");
  updateStatusElement(roundContainerElem, "flex");

  updateStatusElement(
    scoreElem,
    "block",
    primaryColor,
    `Score <span class='badge'>${score}</span>`
  );
  updateStatusElement(
    roundElem,
    "block",
    primaryColor,
    `Round <span class='badge'>${roundNum}</span>`
  );
}

function startRound() {
  initializeNewRound();
  collectCards();
  flipCards(true);
  shuffleCards();
}

function initializeNewRound() {
  roundNum++;
  playGameButtonElem.disabled = true;

  gameInProgress = true;
  shufflingInProgress = true;
  cardsRevealed = false;

  updateStatusElement(
    currentGameStatusElem,
    "block",
    primaryColor,
    "shuffling... "
  );

  updateStatusElement(
    roundElem,
    "block",
    primaryColor,
    `Round <span class='badge'>${roundNum}</span>`
  );
}
//Stack Cards --------------------------------------------
function collectCards() {
  transformGridArea(collapseGridAreaTemplate);
  addCardsToGridAreaCell(cardCollectionCellClass);
}
function transformGridArea(areas) {
  cardContainerElem.style.gridTemplateAreas = areas;
}

function addCardsToGridAreaCell(cellPositionClassName) {
  const cellPositionElem = document.querySelector(cellPositionClassName);

  cards.forEach((card, index) => {
    addChildElement(cellPositionElem, card);
  });
}

//Flip Cards ------------------------------------------
function flipCard(card, flipToBack) {
  const innerCardElem = card.firstChild;

  if (flipToBack && !innerCardElem.classList.contains("flip-it")) {
    innerCardElem.classList.add("flip-it");
  } else if (innerCardElem.classList.contains("flip-it")) {
    innerCardElem.classList.remove("flip-it");
  }
}

function flipCards(flipToBack) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      flipCard(card, flipToBack);
    }, index * 100);
  });
}

//Shuffle cards -------------------------------------------
function cardFlyInEffect() {
  const id = setInterval(flyIn, 50);

  let cardCount = 0;

  let count = 0;

  function flyIn() {
    count++;
    if (cardCount == numCards) {
      clearInterval(id);
    }
    if (count == 1 || count == 25 || count == 50 || count == 75) {
      cardCount++;
      let card = document.getElementById(cardCount);
      card.classList.remove("fly-in");
    }
  }
}

function removeShuffleClasses() {
  cards.forEach((card) => {
    card.classList.remove("shuffle-left");
    card.classList.remove("shuffle-right");
  });
}

function animateShuffle(shuffleCount) {
  const random1 = Math.floor(Math.random() * numCards) + 1;
  const random2 = Math.floor(Math.random() * numCards) + 1;

  let card1 = document.getElementById(random1);
  let card2 = document.getElementById(random2);

  if (shuffleCount % 4 == 0) {
    card1.classList.toggle("shuffle-left");
    card1.style.zIndex = 100;
  }
  if (shuffleCount % 10 == 0) {
    card2.classList.toggle("shuffle-right");
    card2.style.zIndex = 200;
  }
}

function shuffleCards() {
  const id = setInterval(shuffle, 12);
  let shuffleCount = 0;

  function shuffle() {
    randomizeCardPositions();
    animateShuffle(shuffleCount);
    if (shuffleCount == 500) {
      clearInterval(id);
      shufflingInProgress = false;
      removeShuffleClasses();
      console.log("no se si esto pasa");
      dealCards();
      updateStatusElement(
        currentGameStatusElem,
        "block",
        primaryColor,
        "Please clic the card that you think is the ace of spades...."
      );
    } else {
      shuffleCount++;
    }
  }
}

function randomizeCardPositions() {
  const random1 = Math.floor(Math.random() * numCards) + 1;
  const random2 = Math.floor(Math.random() * numCards) + 1;

  const temp = cardPositions[random1 - 1];

  cardPositions[random1 - 1] = cardPositions[random2 - 1];
  cardPositions[random2 - 1] = temp;
}

//Deal Cards ----------------------------------------------------
function dealCards() {
  addCardsToAppropiateCell();
  const areasTemplate = returnGridAreasMappedToCardPos();

  transformGridArea(areasTemplate);
}
function returnGridAreasMappedToCardPos() {
  let firstPart = "";
  let secondPart = "";
  let areas = "";

  cards.forEach((card, index) => {
    if (cardPositions[index] == 1) {
      areas = areas + "a ";
    } else if (cardPositions[index] == 2) {
      areas = areas + "b ";
    } else if (cardPositions[index] == 3) {
      areas = areas + "c ";
    } else if (cardPositions[index] == 4) {
      areas = areas + "d ";
    }

    if (index == 1) {
      firstPart = areas.substring(0, areas.length - 1);
      areas = "";
    } else if (index == 3) {
      secondPart = areas.substring(0, areas.length - 1);
    }
  });
  return `"${firstPart}" "${secondPart}"`;
}
function addCardsToAppropiateCell() {
  cards.forEach((card) => {
    addCardToGridCell(card);
  });
}

function createCards() {
  cardObjectDefinitions.forEach((cardItem) => createCard(cardItem));
}

function createCard(cardItem) {
  //Crea los divs que forman la carta
  const cardElem = createElement("div");
  const cardInnerElem = createElement("div");
  const cardFrontElem = createElement("div");
  const cardBackElem = createElement("div");

  //Crea las imagenes que del frente y el reverso de la carta
  const cardFrontImg = createElement("img");
  const cardBackImg = createElement("img");

  //Agrega clase y id a la carta
  addClassToElement(cardElem, "card");
  addIdToElement(cardElem, cardItem.id);

  //Agrega clase de animación inicial a la carta
  addClassToElement(cardElem, "fly-in")

  //Agrega clase al interior de la carta
  addClassToElement(cardInnerElem, "card-inner");

  //Agrega la clase al frente de la carta
  addClassToElement(cardFrontElem, "card-front");

  //Agrega la clase al reverso de la carta
  addClassToElement(cardBackElem, "card-back");

  //Agrega la clase a la imagen del frente de la carta
  addClassToElement(cardFrontImg, "card-image");

  //Agrega la clase a la imagen del reverso de la carta
  addClassToElement(cardBackImg, "card-image");

  //Agrega src y los valores apropiadoS al elemento img - frente de carta
  addSrcToImageElement(cardFrontImg, cardItem.imagePath);

  //Agrega src y los valores apropiadoS al elemento img - reverso de carta
  addSrcToImageElement(cardBackImg, cardBackImgPath);

  //Agrega el elemento de la imagen del frente como elemento hijo al elemento del frente de la carta
  addChildElement(cardFrontElem, cardFrontImg);

  //Agrega el elemento de la imagen del reverso como elemento hijo al elemento del reverso de la carta
  addChildElement(cardBackElem, cardBackImg);

  //Agrega el front element y el back element como elementos hijos de la carta al inner card
  addChildElement(cardInnerElem, cardFrontElem);
  addChildElement(cardInnerElem, cardBackElem);

  //Agrega el innercard element como elemento hijo a card
  addChildElement(cardElem, cardInnerElem);

  //Agrega un elemento carta como hijo al elemento adecuado grid cell
  addCardToGridCell(cardElem);

  initializeCardPositions(cardElem);

  attachClickEventHandlerToCard(cardElem);
}
function attachClickEventHandlerToCard(card) {
  card.addEventListener("click", () => chooseCard(card));
}
function initializeCardPositions(card) {
  cardPositions.push(card.id);
}
function createElement(elemType) {
  console.log("Estoy creando un " + elemType);
  return document.createElement(elemType);
}

function addClassToElement(elem, className) {
  console.log(`Estoy agregando ${className} a ${elem}`);
  elem.classList.add(className);
}

function addIdToElement(elem, id) {
  elem.id = id;
}

function addSrcToImageElement(imgElement, src) {
  imgElement.src = src;
}
function addChildElement(parentElem, childElem) {
  parentElem.appendChild(childElem);
}

function addCardToGridCell(card) {
  const cardPositionClassName = mapCardToGridCell(card);

  const cardPositionElem = document.querySelector(cardPositionClassName);

  addChildElement(cardPositionElem, card);
}

function mapCardToGridCell(card) {
  if (card.id == 1) {
    return ".card-pos-a";
  } else if (card.id == 2) {
    return ".card-pos-b";
  } else if (card.id == 3) {
    return ".card-pos-c";
  } else if (card.id == 4) {
    return ".card-pos-d";
  }
}
