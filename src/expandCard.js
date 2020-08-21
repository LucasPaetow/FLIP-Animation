const cards = document.querySelectorAll(".js-expand-card");
const expandedCards = document.querySelectorAll(".card__content");
const parentElement = document.querySelector(".smartphone__app");

let parentDimensions;
let widthDifference;
let heightDifference;
let xDifference;
let yDifference;
let fullscreenCard;

function expandCard(event) {
  const currentCard = event.target.closest(".js-expand-card");

  // first: get the dimensions of the button once and store it, so it
  // doesnt need to be recalculated again
  let childDimensions = currentCard.getBoundingClientRect();

  parentDimensions = parentElement.getBoundingClientRect();

  //activate the card to be fullscreen
  currentCard.classList.add("active");
  fullscreenCard = document.querySelector(".active .card__content");
  // invert: invert the new layout to look like the old layout

  widthDifference = childDimensions.width / parentDimensions.width;
  heightDifference = childDimensions.height / parentDimensions.height;
  xDifference = childDimensions.left - parentDimensions.left;
  yDifference = childDimensions.top - parentDimensions.top;

  // scale the new component down to fit the old one
  requestAnimationFrame(() => {
    currentCard.classList.add("transitioning");
    fullscreenCard.style.transform = `translate(${xDifference}px, ${yDifference}px) scale(${widthDifference}, ${heightDifference})`;
    fullscreenCard.style.transition = "transform 0s";

    // play the animation on the next tick
    requestAnimationFrame(() => {
      fullscreenCard.style.transform = "";
      fullscreenCard.style.transition = "transform 400ms ease-in";
    });
  });

  currentCard.addEventListener(
    "transitionend",
    () => {
      currentCard.classList.remove("transitioning");
    },
    { once: true }
  );
}

// the reverse effect
function shrinkCard(event) {
  const currentCard = document.querySelector(".js-expand-card.active");
  event.stopPropagation();

  // play the animation on the next tick
  requestAnimationFrame(() => {
    currentCard.classList.add("transitioning");
    fullscreenCard.style.transition = "transform 400ms ease-out";
    fullscreenCard.style.transform = `translate(${xDifference}px, ${yDifference}px) scale(${widthDifference}, ${heightDifference}) `;
  });

  fullscreenCard.addEventListener(
    "transitionend",
    () => {
      currentCard.classList.remove("transitioning");
      currentCard.classList.remove("active");
      requestAnimationFrame(() => {
        fullscreenCard.style.transform = "";
        fullscreenCard.style.transition = "transform 0s";
      });
    },
    { once: true }
  );
}

export default function initCardTransition() {
  cards.forEach((card) => card.addEventListener("click", expandCard));
  expandedCards.forEach((card) => card.addEventListener("click", shrinkCard));
}
