# Performant Animations, Part 1: FLIP

## Introduction

Animations are great. They guide the user focus and can make a site feel snappy and fast. But if done incorrectly, they will do the opposite: they will make the site feel sluggish and janky.

### Janky?

When the browser needs to change the appearance of an element, it needs to recalculate every element affected by the change.
When a lot of elements are affected and need to be recalculated, the browser has to work longer for the calculations. If this process exceeds the time the screen takes to refresh it, it skips a frame.

An example: Most devices run at 60 frames per second. So the recalculation per frame shouldn’t take longer than roughly 10ms (1sec/60 => 16.66ms - housekeeping from the browser). Otherwise, the animation is not smooth and “stutters”

## How to do it then?

There are two ways to make animations feel smooth and keep them at 60 FPS and jank-free:

### The CSS way

Every change to the DOM triggers the calculation of the “critical render path” to bring the pixel updates to the screen. This involves up to 3 steps:

- **Layout / Reflow**
  In this step, the browser starts calculating the dimensions and space for each element, starting from the document root. This results in the elements [box-model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model).

- **Paint**
  This step is about creating layers and filling them with pixels. Including but not limited to text, colors, images, borders, and shadows.

- **Compositing**
  Here the browser will send the layers to the GPU to finally draw them in the correct order onto the screen. This happens on a different thread.

The more of these steps are involved, the more work the browser has to do. Since the `transform` and `opacity` properties only require changes of the compositing step, they are very efficient.

#### How? With a FLIP

You might think, these transforms may only really work for small visual changes (e.g. a button press) but they can also animate seemingly heavy layout changes like expanding a card or transitioning to a new view.

Instead of scaling / transitioning / rotating an elements' starting appearance to make it look like the end appearance, (for example scaling up a card to a full-screen view) you would do the opposite: change the card to its final form and scale it down to the previous size without animation. This step happens so fast, it looks like nothing happened. Afterwards, you animate the difference (which is now a scale operation).

This process involves 4 steps and therefore coined the term FLIP (First, Last, Invert, Play - [originaliy by Paul Lewis](https://aerotwist.com/blog/flip-your-animations/)):

#### An Example: Apple News

---

CODE EXAMPLE
[CodeSandbox](https://codesandbox.io/s/github/LucasPaetow/FLIP-Animation/tree/master) to see the code
[live site](https://goofy-saha-574aca.netlify.app/) to just see it in action

---

- **First**: get the dimensions of the starting element

```
first = collapsedImage.getBoundingClientRect();
```

Quick refresher: `getBoundingClientRect()` returns an object of values for height, width, top, right, bottom, left, x and y.

- **Last**: change the layout and get its dimensions.

```
  collapsedCard.classList.add("active");
	...
  last = fullscreenImage.getBoundingClientRect();

```

In this example, changing the layout is done via modifying the display-property. It's a simple yet very visual change, which triggers reflow.

- **Invert**: Transform the element from it's last form to the starting form

```
  widthDifference = first.width / last.width;
  heightDifference = first.height / last.height;
  xDifference = first.left - last.left;
  yDifference = first.top - last.top;

	...
  requestAnimationFrame(() => {
    	fullscreenImage.style.transform = `translate($					{xDifference}px, ${yDifference}px) scale($						{widthDifference}, ${heightDifference})`;
    	fullscreenImage.style.transition = "transform 0ms";
	...
  });

```

On the next possible repaint, the image gets translated and scaled so it is placed over on the starting image. This change happens without a transition and is not visually noticeable (if the calculation for the change takes under 100ms, we will perceive it as instantaneously)

- **Play**: Visually animate the difference

```
  requestAnimationFrame(() => {
		...
    requestAnimationFrame(() => {
      	fullscreenImage.style.transform = "";
      	fullscreenImage.style.transition = `transform ${transitionTime}ms ${easing}`;
    });
  });

```

Again, on the next possible repaint, the changes get reverted, but this time with an easing. So it falls back into its original shape with a nice and smooth transition.
This has to be done with at least one frame between the two actions. Otherwise, javascript would just batch the commands together and we wouldn't see any visual effects. For the separation of these commands, we can use a requestAnimationFrame within a requestAnimationFrame. More on this topic will follow soon.

#### Things to consider

- Some CSS properties (especially `border-radius`) might look different during this process and ruin the illusion.

For example: a 200x200px box with 'border-radius: 20px' and `transform: scale(0.5)` looks different than a 100x100px box with the same border-radius (percentage based values work, though)

- Beware: since it has to be done for each element, it gets complicated fast, especially if multiple elements are affected (modern frameworks might help reduce the complexity)

### Stay tuned

More on requestAnimationFrame and performant javascript animation will follow next week.
