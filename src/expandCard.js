const collapsedCards = document.querySelectorAll(".js-expand-card");
const expandedCards = document.querySelectorAll(".js-collapse-card");
const appContainer = document.querySelector(".js-get-scroll-position");
const transitionTime = 400;
const easing = "ease-out";

let collapsedCard;
let collapsedImage;
let fullscreenCard;
let fullscreenImage;
let last;
let first;
let widthDifference;
let heightDifference;
let xDifference;
let yDifference;
let scrollAdjustment = 0;

function expandCard(event) {
	collapsedCard = event.target.closest(".js-expand-card");
	collapsedImage = collapsedCard.firstElementChild.firstElementChild;

	// 1. first:
	//get the dimensions of the card element in its collapsed view
	first = collapsedImage.getBoundingClientRect();

	// 2. last:
	//activate the card to be fullscreen
	collapsedCard.classList.add("active");
	fullscreenCard = document.querySelector(".active .js-collapse-card");
	fullscreenImage = document.querySelector(".active .story__image-wrapper");
	//fix for the inner scroll position
	handleScrollPosition("onOpen");

	//and get its dimensions
	last = fullscreenImage.getBoundingClientRect();

	// 3. invert: invert the new layout to look like the old layout
	widthDifference = first.width / last.width;
	heightDifference = first.height / last.height;
	xDifference = first.left - last.left;
	yDifference = first.top - last.top;

	// which means scaling the newly fullscreen card back down to fit the size and position of the collapsed view
	requestAnimationFrame(() => {
		collapsedCard.classList.add("transitioning");
		fullscreenImage.style.transform = `translate(${xDifference}px, ${yDifference}px) scale(${widthDifference}, ${heightDifference})`;
		fullscreenImage.style.transition = "transform 0ms";

		// 4. play: Animate the difference reversal on the next tick
		requestAnimationFrame(() => {
			fullscreenImage.style.transform = "";
			fullscreenImage.style.transition = `transform ${transitionTime}ms ${easing}`;
		});
	});

	fullscreenImage.addEventListener(
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
		fullscreenImage.style.transition = `transform ${transitionTime}ms ${easing}`;
		fullscreenImage.style.transform = `translate(${xDifference}px, ${yDifference}px) scale(${widthDifference}, ${heightDifference}) `;
	});

	fullscreenImage.addEventListener(
		"transitionend",
		() => {
			collapsedCard.classList.remove("transitioning");
			collapsedCard.classList.remove("active");
			requestAnimationFrame(() => {
				fullscreenImage.style.transform = "";
				fullscreenImage.style.transition = "transform 0ms";
				//fix for the inner scroll position
				handleScrollPosition("onClose");
			});
		},
		{ once: true }
	);
}

// fixes for scroll position
function adjustCardPositionWhenScrolled(event) {
	scrollAdjustment = event.target.scrollTop;
}
// fixes for scroll position
function handleScrollPosition(animationState) {
	if (animationState === "onOpen") {
		fullscreenCard.style.top = `${scrollAdjustment}px`;
		fullscreenCard.style.bottom = `-${scrollAdjustment}px`;
		appContainer.style.overflowY = "hidden";
	}

	if (animationState === "onClose") {
		fullscreenCard.style.top = "";
		fullscreenCard.style.bottom = "";
		appContainer.style.overflowY = "";
	}
}
// fixes for scroll position
appContainer.addEventListener("scroll", adjustCardPositionWhenScrolled, {
	passive: true,
});

export default function initCardTransition() {
	collapsedCards.forEach((card) => card.addEventListener("click", expandCard));
	expandedCards.forEach((card) => card.addEventListener("click", shrinkCard));
}
