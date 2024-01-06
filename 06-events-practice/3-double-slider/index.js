export default class DoubleSlider {
  constructor({
    min = 100,
    max = 200,
    formatValue = (value) => "$" + value,
    selected = {},
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.from = selected.from && selected.from > min ? selected.from : min;
    this.to = selected.to && selected.to < max ? selected.to : max;
    this.element = this.createElement(this.createTemplate());
    this.isLeftDragging = false;
    this.isRightDragging = false;

    // this.doubleSlider = this.element.querySelector(".range-slider__inner");
    // this.sliderProgress = this.element.querySelector(".range-slider__progress");
    // this.leftThumb = this.element.querySelector(".range-slider__thumb-left");
    // this.rightThumb = this.element.querySelector(".range-slider__thumb-right");
    // this.initialize();

    document.addEventListener("DOMContentLoaded", () => {
      this.doubleSlider = document.querySelector(".range-slider__inner");
      this.sliderProgress = document.querySelector(".range-slider__progress");
      this.leftThumb = document.querySelector(".range-slider__thumb-left");
      this.rightThumb = document.querySelector(".range-slider__thumb-right");
      this.initialize();
    });
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
        <div class="range-slider">
          <span data-element="from">${this.formatValue(this.from)}</span>
          <div class="range-slider__inner">
            <span class="range-slider__progress" style="left: ${this.initLeftThumbPos(
              this.from
            )}%; right: ${this.initRightThumbPos(this.to)}%"></span>
            <span class="range-slider__thumb-left" style="left: ${this.initLeftThumbPos(
              this.from
            )}%"></span>
            <span class="range-slider__thumb-right" style="right: ${this.initRightThumbPos(
              this.to
            )}%"></span>
          </div>
          <span data-element="to">${this.formatValue(this.to)}</span>
        </div>
    `;
  }

  initialize() {
    this.rect = this.doubleSlider.getBoundingClientRect();
    this.leftThumbX = this.leftThumb.getBoundingClientRect();

    this.leftThumb.addEventListener("pointerdown", () => {
      this.isLeftDragging = true;
    });

    this.rightThumb.addEventListener("pointerdown", () => {
      this.isRightDragging = true;
    });

    document.addEventListener("pointerup", () => {
      this.isLeftDragging = false;
      this.isRightDragging = false;
    });

    document.addEventListener("pointermove", (event) => {
      let x = event.clientX - this.rect.left;
      this.moveLeftThumb(x);
      this.moveRightThumb(x);
    });
  }

  // Convert initial values to percetage
  initValueToPercent(value) {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }
  initLeftThumbPos(value) {
    return this.initValueToPercent(value);
  }
  initRightThumbPos(value) {
    return 100 - this.initValueToPercent(value);
  }

  // Convert pixels to percentage
  pxToPercent(value) {
    return (value / this.rect.width) * 100;
  }

  // Move functions
  moveLeftThumb(x) {
    if (!this.isLeftDragging) return;

    if (x < 0) x = 0;
    if (x > this.rightThumbPos) x = this.rightThumbPos;

    this.leftThumb.style.left = `${this.pxToPercent(x)}%`;
    this.sliderProgress.style.left = `${this.pxToPercent(x)}%`;

    this.updateValues();
  }

  moveRightThumb(x) {
    if (!this.isRightDragging) return;

    if (x > this.rect.width) x = this.rect.width;

    if (x < this.leftThumbPos) x = this.leftThumbPos;

    this.rightThumb.style.right = `${100 - this.pxToPercent(x)}%`;
    this.sliderProgress.style.right = `${100 - this.pxToPercent(x)}%`;

    this.updateValues();
  }

  updateValues() {
    const barWidth = this.rect.width;
    this.leftThumbPos =
      this.leftThumb.getBoundingClientRect().x -
      this.rect.left +
      this.leftThumb.offsetWidth;
    this.rightThumbPos =
      this.rightThumb.getBoundingClientRect().x - this.rect.left;

    const leftValue =
      (this.leftThumbPos / barWidth) * (this.max - this.min) + this.min;

    const rightValue =
      (this.rightThumbPos / barWidth) * (this.max - this.min) + this.min;

    const minSpan = this.element.querySelector('[data-element="from"]');
    const maxSpan = this.element.querySelector('[data-element="to"]');

    minSpan.textContent = this.formatValue(leftValue.toFixed(0));
    maxSpan.textContent = this.formatValue(rightValue.toFixed(0));
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}
