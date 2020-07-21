import * as util from './roulette-util.js'

/**
 * Draw the wheel.
 */
export default class RouletteWheel {

  constructor(container) {

    this.canvasContainer = container;

    this.createCanvas();
    this.registerEvents();

    // Define callbacks:
    this.callback_rest = () => {};
    this.callback_spin = () => {};

    this.init(); // This needs to be called again once the object has been created, passing the real settings.

    this.drawFrame(); // Start animation loop.

  }

  createCanvas() {

    // Remove any existing children:
    while (this.canvasContainer.firstChild) {
       this.canvasContainer.removeChild(this.canvasContainer.firstChild);
    }

    this.canvas = document.createElement('canvas');
    this.canvasContainer.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');
    this.defaultCanvasWidth = 500; // So we can scale fonts.

  }

  registerEvents() {

    window.onresize = () => this.handleResize_window();

    this.canvas.onmousedown = (e) => this.handleMouseDown(e);
    this.canvas.onmousemove = (e) => this.handleMouseMove(e);
    this.canvas.onmouseout = (e) => this.handleMouseOut(e);

  }

  /**
   * Initalise variables, allowing the wheel to be drawn.
   */
  init(settings = {}) {

    // Destructure settings, define defaults:
    ({
      items:               this.items = [], // Array of item objects to show on the wheel.
      itemLabelRadius:     this.itemLabelRadius = .85, // Where to place the label along the radius (percent), starting from the inside of the circle.
      itemLabelMaxRadius:  this.itemLabelMaxRadius = 0, // Labels will be automatically resized to fit inside this radius (percent), starting from the inside of the circle.
      itemLabelRotation:   this.itemLabelRotation = 180, // Nessecary to flip the label upside down when changing `itemLabelAlign`.
      itemLabelAlign:      this.itemLabelAlign = util.AlignTextEnum.left,
      itemLabelLineHeight: this.itemLabelLineHeight = 0, // Adjust the line height of the font.
      itemLabelColor:      this.itemLabelColor = '#000',
      itemLabelFont:       this.itemLabelFont = 'sans-serif',
      itemLabelFontMaxSize:this.itemLabelFontMaxSize = 20, // Maximum font size, but font size may be resized further to fit `itemLabelMaxRadius`.
      itemLineWidth:       this.itemLineWidth = 1, // Width of the line that separates each item.
      itemLineColor:       this.itemLineColor = '#000', // Color of the line that separates each item.
      itemColorSet:        this.itemColorSet = [], // Pattern of colors that will be applied to items repeatedly.
      itemLabelColorSet:   this.itemLabelColorSet = [], // Pattern of colors that will be applied to items repeatedly.
      radius:              this.radius = .95, // Radius of wheel relative to canvas dimensions (percent).
      rotation:            this.rotation = 0, // The current rotation of the wheel.
      rotationSpeed:       this.rotationSpeed = 0, // The current speed of the wheel.
      maxRotationSpeed:    this.maxRotationSpeed = 250, // The max speed the wheel can reach (every spin will add to the speed).
      rotationResistance:  this.rotationResistance = -35, // How fast the wheel slows down while spinning.
      spinSpeed:           this.spinSpeed = 190, // The max speed that can be created by a single spin (speed is randomised, as low as 70% of this value).
      overlayImageUrl:     this.overlayImageUrl = null, // Image to be overlayed.
      clickToSpin:         this.clickToSpin = true, // Enable events so the user can click on the wheel to spin it (otherwise you need to manually implement `spin()`).
    } = settings);

    if (typeof settings.callback_rest === 'function') {
      this.callback_rest = settings.callback_rest;
    }

    if (typeof settings.callback_spin === 'function') {
      this.callback_spin = settings.callback_spin;
    }

    this.handleResize_window(); // Initalise canvas width/height.

    { // Clean items:

      let items = this.items;

      if (this.itemColorSet.length) {
        // Fill any empty colors with a repeating color set:
        for (let i = 0; i < items.length; i++) {
          const c = this.itemColorSet[i % this.itemColorSet.length];
          if (!items[i].color) {
            items[i].color = c;
          }
        }
      } else {
        // Fill any empty colors with white:
        for (let i = 0; i < items.length; i++) {
          if (!items[i].color) {
            items[i].color = '#fff';
          }
        }
      }

      // Set a default weight for items that don't have it:
      for (let i = 0; i < items.length; i++) {
        if (items[i].weight === undefined) {
          items[i].weight = 1
        };
      }

      // Apply repeating label colors:
      if (this.itemLabelColorSet.length) {
        for (let i = 0; i < items.length; i++) {
          const c = this.itemLabelColorSet[i % this.itemLabelColorSet.length];
          if (!items[i].labelColor) {
            items[i].labelColor = c;
          }
        }
      }

    }

    this.weightedItemAngle = 360 / util.sum(this.items, 'weight');
    this.pointerAngle = this.rotation;
    this.rotationDirection = this.getRotationDirection(this.rotationSpeed);

    // Load overlay image:
    if (this.overlayImageUrl) {
      this.overlayImage = new Image();
      this.overlayImage.src = this.overlayImageUrl;
    }

  }

  /**
   * Spin the wheel by increasing `rotationSpeed`.
   */
  spin(speed) {

    // Randomise `speed` slightly so we can't predict when the wheel will stop.
    let newRotationSpeed = this.rotationSpeed + util.getRandomInt(speed * 0.7, speed);
    newRotationSpeed = Math.min(this.maxRotationSpeed, newRotationSpeed);

    this.rotationDirection = this.getRotationDirection(newRotationSpeed);
    this.rotationSpeed = newRotationSpeed;

    this.callback_spin({
      event: 'spin',
      direction: this.rotationDirection,
      speed: this.rotationSpeed,
    });

  }

  getRotationDirection(speed) {
     return (speed > 0) ? 1 : -1; // 1 == clockwise, -1 == antiClockwise.
  }

  /**
   * Resize `canvas` to fit (contain) inside `canvasContainer`.
   */
  handleResize_window() {

    // Get the smallest dimension of `canvasContainer`:
    let size = Math.min(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);

    // Resize canvas:
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.canvas.width = size;
    this.canvas.height = size;

    // Calc some things for later on:
    this.canvasCenterX = size / 2;
    this.canvasCenterY = size / 2;
    this.wheelRadius = this.canvasCenterX * this.radius;

    // Adjust the font size of labels so they all fit inside `wheelRadius`:
    this.itemLabelFontSize = this.itemLabelFontMaxSize * (size / this.defaultCanvasWidth);
    const maxLabelWidth = this.wheelRadius * (this.itemLabelRadius - this.itemLabelMaxRadius)
    this.items.forEach((i) => {
      this.itemLabelFontSize = Math.min(this.itemLabelFontSize, util.getFontSizeToFit(i.label, this.itemLabelFont, maxLabelWidth, this.context));
    });

  }

  /**
   * Main animation loop.
   */
  drawFrame() {

    let ctx = this.context;

    ctx.clearRect(0 ,0, this.canvas.width, this.canvas.height); // Clear canvas.

    // Calculate delta since last frame:
    const now = Date.now();
      if (this.lastFrame === undefined) {
        this.lastFrame = now;
      }
      const delta = (now - this.lastFrame) / 1000;
      if (delta > 0) {
        this.rotation += delta * this.rotationSpeed;
        this.rotation = this.rotation % 360;
      }
      this.lastFrame = now;

      let currentItem;
      let itemAngle;
      let lastItemAngle; // Record the last angle so we can resume in the next loop.

      ctx.strokeStyle = this.itemLineColor;
      ctx.lineWidth = this.itemLineWidth;
      ctx.lineJoin = 'bevel';

      // Draw wedges:
      lastItemAngle = this.rotation;
      for (let i = 0; i < this.items.length; i++) {

        itemAngle = this.items[i].weight * this.weightedItemAngle;
        const startAngle = lastItemAngle;
        const endAngle = lastItemAngle + itemAngle;

        ctx.beginPath();
        ctx.moveTo(this.canvasCenterX, this.canvasCenterY);
        ctx.arc(
          this.canvasCenterX,
          this.canvasCenterY,
          this.wheelRadius,
          util.degRad(startAngle + util.arcAdjust),
          util.degRad(endAngle + util.arcAdjust)
        );
        ctx.closePath();

        ctx.fillStyle = this.items[i].color;
        ctx.fill();

        if (this.itemLineWidth > 0) {
          ctx.stroke();
        }

        lastItemAngle += itemAngle;

        if (util.isAngleBetween(this.pointerAngle, startAngle % 360, endAngle % 360)) {
          currentItem = this.items[i];
        }

      }

      // Set font:
      ctx.textBaseline = 'middle';
      ctx.textAlign = this.itemLabelAlign;
      ctx.font = this.itemLabelFontSize + 'px ' + this.itemLabelFont;
      ctx.fillStyle = this.itemLabelColor;

      ctx.save();

      // Draw item labels:
      lastItemAngle = this.rotation;
      for (let i = 0; i < this.items.length; i++) {

        itemAngle = this.items[i].weight * this.weightedItemAngle;

        ctx.save();
        ctx.beginPath();

        if (this.items[i].labelColor !== undefined) {
          ctx.fillStyle = this.items[i].labelColor;
        }

        let angle = lastItemAngle + (itemAngle / 2) + this.itemLabelLineHeight;

        ctx.translate(
          this.canvasCenterX + Math.cos(util.degRad(angle + util.arcAdjust)) * (this.wheelRadius * this.itemLabelRadius),
          this.canvasCenterY + Math.sin(util.degRad(angle + util.arcAdjust)) * (this.wheelRadius * this.itemLabelRadius)
        );

        ctx.rotate(util.degRad(angle + util.arcAdjust + this.itemLabelRotation));

        if (this.items[i].label !== undefined) {
          ctx.fillText(this.items[i].label, 0, 0);
        }

        ctx.restore();

        lastItemAngle += itemAngle;

      }

      // Draw overlayImage:
      // Stretch image to fill canvas.
      if (this.overlayImageUrl) {
        ctx.drawImage(this.overlayImage, 0, 0, this.canvas.width, this.canvas.height);
      }

      if (this.rotationSpeed !== 0) {

        // Decrease rotation (simulate drag):
        this.rotationSpeed += (this.rotationResistance * delta) * this.rotationDirection;

        // Prevent rotation from going back the oposite way:
        if (this.rotationDirection == 1 && this.rotationSpeed < 0) {
          this.rotationSpeed = 0;
        } else if (this.rotationDirection == -1 && this.rotationSpeed >= 0) {
          this.rotationSpeed = 0;
        }

        if (this.rotationSpeed == 0) {
          this.callback_rest({
            event: 'finish',
            item: currentItem,
          });
        }

    }

    // Wait until next frame.
    window.requestAnimationFrame(this.drawFrame.bind(this));

  }

  wheelHitTest(e) {
    const pos = util.getXYFromCanvasEvent(this.canvas, e);
    return util.isPointInCircle(pos.x, pos.y, this.canvasCenterX, this.canvasCenterY, this.wheelRadius);
  }

  handleMouseMove(e) {
    this.isMouse_over = this.wheelHitTest(e);
    this.setCursor();
  }

  handleMouseOut(e) {
    this.isMouse_over = false;
    this.setCursor();
  }

  handleMouseDown(e) {
    if (!this.wheelHitTest(e)) return;
    this.spin(this.spinSpeed);
  }

  setCursor() {
    if (this.isMouse_over) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

}
