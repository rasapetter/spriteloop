# SpriteLoop

Like GIF but different.

A cross-platform, cross-browser alternative to GIFs or even (silent) HTML5
video. Takes an image containing the frames from a video and generates an
animated sequence using plain Javascript.

## Why?

This is something I toyed with when trying to solve the problem of displaying
videos in the background of a web page. These days this isn't usually considered
a problem, a setup with an HTML5 video and a GIFs as backup will work nicely in
most cases. My goal, however, was to find a solution that works on as many
platform/browser/version combinations as possible (even on really old devices)
while remaining as lightweight as possible in order for it to be usable over
poor networks.

This library should work in any browser that can display JPEG images and run
Javascript, as opposed to HTML5 which requires a fairly modern browser (and
you'll probably have a hard time getting it to play automatically from start
on mobile devices). By compressing the JPEG you should be able to get something
much smaller than a GIF. The library itself is less than 3kb (compressed).

Most of this should be taken with a pinch of salt, though, since I haven't
tested the library on more than a few devices and none of them were very old.

## How?

1) Clone the repository.

2) Extract the frames of your video and merge them into a single image. If you'd
like to use a GIF there's a bash script included in this repository that does
this for you, check out `explode.sh`. When used correctly it should produce an
image that looks something like this:


```
 ---------
| Frame 1 |
|---------|
| Frame 2 |
|---------|
| Frame 3 |
 ---------|
|   ...   |
|---------|
| Frame N |
 ---------
```

3) Build the Javascript: run `gulp` in the `spriteloop` directory. If everything
goes well you should find `spriteloop.js` in a directory named `dist`. Include
this on your web page and...

4) Start 'er up!

```html
<div id="kittens"></div>
```

```javascript
new SpriteLoop({
  container: 'kittens'
  sprites: ['kittens.jpg'],
  frameCount: 100,
  frameRate: 25
});
```

**Bonus/experimental feature:**

If given more than one image in the `sprites` array, SpriteLoop will load the
images one after the other and start animating the sequences as soon as their
images have been downloaded. When switching from one sequence to the next, it
will start the sequence at the same frame as the previous sequence was at that
moment. This will let you serve one sequence in multiple resolutions/qualities.
The client will download each version in turn and smoothly transition into
better qualities over time.

```javascript
sprites: ['kittens-240.jpg', 'kittens-480.jpg', 'kittens-720.jpg']
```
