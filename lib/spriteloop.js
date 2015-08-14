function SpriteLoop(params) {
  if (typeof window === 'undefined') {
    throw 'SpriteLoop must run in a browser';
  }

  params = params || {};
  this.ct = params.container || undefined;
  this.fc = params.frameCount || undefined;
  this.fr = params.frameRate || undefined;
  this.s = params.sprites || undefined;
  this.c = 0; // Cursor/current frame number

  if (typeof this.ct === 'string') {
    this.ct = document.getElementById(this.ct);
  }

  if (!this.ct) return;

  return this._next();
}

/**
 * Start looping the next sprite in the list.
 */
SpriteLoop.prototype._next = function() {
  if (!this.s.length) return;
  var sprite = this.s.splice(0, 1);
  sprite = sprite[0];

  if (typeof sprite === 'string') {
    var url = sprite;
    sprite = new Image();
    sprite.src = url;
  }

  if (!(sprite instanceof HTMLImageElement)) {
    // This image couldn't be loaded. Skip it and try the next one.
    this._next();
    return;
  }

  var self = this;
  var start = function() {
    // Prevent this function from running more than once
    if (!sprite.width) return;
    if (sprite.l) return;
    sprite.l = true;

    self._set(sprite)

    // Start the loop
    ._shift()

    // Load the next sprite
    ._next();
  };

  if (sprite.complete || sprite.readyState === 4) {
    start();
  } else {
    // The image is still not loaded, wait for it
    if (sprite.addEventListener) {
      sprite.addEventListener('load', start);
    } else {
      sprite.attachEvent('onload', start);
    }

    // Some really old browsers don't support any kind of
    // 'onload'/'load' events on images. Work around this by
    // repeatedly checking wether the image has dimensions.
    var test = function() {
      if (!sprite.width) {
        setTimeout(test, 100);
      }
      start();
    }();
  }
  return this;
};

/**
 * Initialize a sprite.
 *
 * Generates frames from the given sprite image.
 */
SpriteLoop.prototype._set = function(sprite) {
  if (sprite instanceof HTMLImageElement) {
    this._current = sprite;
  }
  if (!this._current) {
    throw 'There are no sprites to show';
  }

  // Clear the container
  this.ct.innerHTML = '';

  // Store the width. We'll use this in _shift() to check
  // whether the size of the container has changed between
  // two frames.
  this._containerWidth = this.ct.offsetWidth;

  // Generate frames
  var frameWidth = this._current.width;
  var frameHeight;
  if (this.fc) {
    frameHeight = this._current.height / this.fc;
  }

  var ar = frameHeight / frameWidth;
  var scaledFrameWidth = this._containerWidth;
  var scaledFrameHeight = this._containerWidth * ar;

  var frames = [];
  var i;
  for (i = 0; i < this.fc; i++) {
    var f = document.createElement('div');
    f.style.background = 'url(\'' + this._current.src + '\')';
    f.style.backgroundSize = '100%';
    f.style.backgroundPosition = '0 -' + Math.round(scaledFrameHeight * i) + 'px';
    f.style.width = scaledFrameWidth + 'px';
    f.style.height = scaledFrameHeight + 'px';
    frames.push(f);
  }
  if (this._loopHandle) {
    clearTimeout(this._loopHandle);
  }
  this._frames = frames;
  if (!this._frames.length) {
    throw 'Couldn\'t parse frames';
  }
  return this;
};

/**
 * Show the next frame in the sequence.
 */
SpriteLoop.prototype._shift = function() {
  var self = this;

  if (typeof this.c === 'undefined') {
    this.c = 0;
  }

  if (this.ct.offsetWidth !== this._containerWidth) {
    // The container has changed been resized: regenerate the
    // frames and start again.
    this._set()._shift();
    return;
  }

  if (!this.ct.children.length) {
    this.ct.appendChild(this._frames[0]);
    // Override the recorded container width after the first
    // frame has been inserted. Motivation: if the inserted
    // frame makes the window show scrollbars the offsetWidth
    // value may be lower than previously recorded.
    this._containerWidth = this.ct.offsetWidth;
  }

  this._loopHandle = setTimeout(function() {
    // Increment the frame counter
    self.c++;
    if (self.c === self._frames.length) self.c = 0;

    // Replace the current frame with the next one
    self.ct.replaceChild(self._frames[self.c], self.ct.children[0]);
    self._shift();
  }, 1000 / this.fr);

  return this;
};

module.exports = SpriteLoop;
