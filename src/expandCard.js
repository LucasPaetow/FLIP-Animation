const collapsedCards = document.querySelectorAll(".js-expand-card");
const expandedCards = document.querySelectorAll(".js-collapse-card");

let last;
let first;
let widthDifference;
let heightDifference;
let xDifference;
let yDifference;
let fullscreenCard;
let collapsedCard;

function expandCard(event) {
	collapsedCard = event.target.closest(".js-expand-card");

	// 1. first:
	//get the dimensions of the card element in its collapsed view
	first = collapsedCard.getBoundingClientRect();

	// 2. last:
	//activate the card to be fullscreen
	collapsedCard.classList.add("active");
	fullscreenCard = document.querySelector(".active .story__content");

	//and get its dimensions
	last = fullscreenCard.getBoundingClientRect();
	console.log("last", last);
	// 3. invert: invert the new layout to look like the old layout
	widthDifference = first.width / last.width;
	heightDifference = first.height / last.height;
	xDifference = first.left - last.left;
	yDifference = first.top - last.top;

	// which means scaling the newly fullscreen card back down to fit the size and position of the collapsed view
	requestAnimationFrame(() => {
		collapsedCard.classList.add("transitioning");
		fullscreenCard.style.transform = `translate(${xDifference}px, ${yDifference}px) scale(${widthDifference}, ${heightDifference})`;
		fullscreenCard.style.transition = "transform 0s";

		// 4. play: Animate the difference reversal on the next tick
		requestAnimationFrame(() => {
			fullscreenCard.style.transform = "";
			fullscreenCard.style.transition = "transform 400ms ease-in";
		});
	});

	collapsedCard.addEventListener(
		"transitionend",
		() => {
			collapsedCard.classList.remove("transitioning");
		},
		{ once: true }
	);
}

// To reverse the  effect, the transform operation needs to be applied again
function shrinkCard(event) {
	event.stopPropagation();

	// play the animation on the next tick
	requestAnimationFrame(() => {
		collapsedCard.classList.add("transitioning");
		fullscreenCard.style.transition = "transform 400ms ease-out";
		fullscreenCard.style.transform = `translate(${xDifference}px, ${yDifference}px) scale(${widthDifference}, ${heightDifference}) `;
	});

	fullscreenCard.addEventListener(
		"transitionend",
		() => {
			collapsedCard.classList.remove("transitioning");
			collapsedCard.classList.remove("active");
			requestAnimationFrame(() => {
				fullscreenCard.style.transform = "";
				fullscreenCard.style.transition = "transform 0s";
			});
		},
		{ once: true }
	);
}

export default function initCardTransition() {
	collapsedCards.forEach((card) => card.addEventListener("click", expandCard));
	expandedCards.forEach((card) => card.addEventListener("click", shrinkCard));
}
