# Performant CSS Animations

## Why animations

- useful to preserve context
- guide focus
- looks good

## Performance

- Render steps for the browser
  _ JS (Layout change here), Styles (which CSS classes apply?), Layout (box model of all elements), Paint (Colors, images, shadows), Composition (layering)[Rendering Performance | Web Fundamentals | Google Developers](https://developers.google.com/web/fundamentals/performance/rendering)
  _ [CSS Triggers](https://csstriggers.com/)
  _ Depending on why is changing, layout and paint can be skipped
  _ Every Calc must be done in under 10ms (16ms - browser housekeeping) or it skips a frame, which appears as lagging/Janking ([Rendering Performance | Web Fundamentals | Google Developers](https://developers.google.com/web/fundamentals/performance/rendering))
- Only `Rotate, Translate, Scale, Opacity` can be animated with good performance
  _ Can be done by the graphics card
  _ JS Animations are done on the main thread as well as any animations that triggers layout or paint https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance

## FlIP Animations

- a performant trick to make it look like a seamless transition, but its actually 2 elements
- the second element gets made to look like the firs
