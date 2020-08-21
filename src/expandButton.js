const button = document.querySelector(".js-expand-button");
const expandedButton = document.querySelector(".js-shrink-contact-list");
const content = document.querySelector(".js-hide-during-transition");
const layoutChangeClass = "app__filter--hidden";
const contentHiddenClass = "filter--hidden";

let widthDifference;
let heightDifference;
let buttonDimensions;
let expandedButtonDimensions;

function expandButton() {
  // first: get the dimensions of the button once and store it, so it
  // doesnt need to be recalculated again
  if (!buttonDimensions) {
    buttonDimensions = button.getBoundingClientRect();
  }

  // Change the layout by removing a class with "display: none" to trigger
  // layout
  expandedButton.classList.remove(layoutChangeClass);

  // last: get the dimensions of the newly expanded button
  if (!expandedButtonDimensions) {
    expandedButtonDimensions = expandedButton.getBoundingClientRect();
  }

  // invert: invert the new layout to look like the old layout
  if (!widthDifference || !heightDifference) {
    widthDifference = buttonDimensions.width / expandedButtonDimensions.width;
    heightDifference =
      buttonDimensions.height / expandedButtonDimensions.height;
  }

  // scale the new component down to fit the old one
  requestAnimationFrame(() => {
    expandedButton.style.transform = `scale(${widthDifference}, ${heightDifference}) translate(0,0)`;
    expandedButton.style.transition = "all 0s";

    // play the animation on the next tick
    requestAnimationFrame(() => {
      expandedButton.style.transform = "";
      expandedButton.style.transition = "all 200ms ease-in";
    });
  });

  // restore styles after the animation is done
  // this could be in a setTimeout as well
  expandedButton.addEventListener(
    "transitionend",
    () => {
      content.classList.remove(contentHiddenClass);
      button.style.opacity = "0";
    },
    { once: true }
  );
}

// the reverse effect
function shrinkButton() {
  // hide content while transitioning
  content.classList.add(contentHiddenClass);
  button.style.opacity = "1";
  expandedButton.style.transition = "all 200ms ease-out";
  expandedButton.style.transform = `scale(${widthDifference}, ${heightDifference}) translate(0,0)`;

  expandedButton.addEventListener(
    "transitionend",
    () => {
      expandedButton.classList.add(layoutChangeClass);
      requestAnimationFrame(() => {
        expandedButton.style.transform = "";
        expandedButton.style.transition = "all 0s";
      });
    },
    { once: true }
  );
}

export default function initButtonAnimation() {
  console.log("init button");
  button.addEventListener("click", expandButton);
  expandedButton.addEventListener("click", shrinkButton);
}
