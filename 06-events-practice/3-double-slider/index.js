export default class DoubleSlider {
  constructor({
    min = 100,
    max = 200,
    formatValue = (value) => "$" + value,
    selected = {
      from: min,
      to: max,
    },
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.element = this.createElement(this.createTemplate());
    this.isLeftDragging = false;
    this.isRightDragging = false;

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
          <span data-element="from">${this.formatValue(
            this.selected.from
          )}</span>
          <div class="range-slider__inner">
            <span class="range-slider__progress" style="left: ${this.initLeftThumbPos(
              this.selected?.from
            )}%; right: ${this.initRightThumbPos(this.selected.to)}%"></span>
            <span class="range-slider__thumb-left" style="left: ${this.initLeftThumbPos(
              this.selected.from
            )}%"></span>
            <span class="range-slider__thumb-right" style="right: ${this.initRightThumbPos(
              this.selected.to
            )}%"></span>
          </div>
          <span data-element="to">${this.formatValue(this.selected.to)}</span>
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
    // Get thumbs positions
    this.leftThumbPos =
      this.leftThumb.getBoundingClientRect().x -
      this.rect.left +
      this.leftThumb.offsetWidth;

    this.rightThumbPos =
      this.rightThumb.getBoundingClientRect().x - this.rect.left;

    let leftValue = (this.leftThumbPos / this.rect.width) * 100;
    let rightValue = (this.rightThumbPos / this.rect.width) * 100;

    // Select spans
    const spans = this.element.querySelectorAll(".range-slider > span");
    const minSpan = spans[0];
    const maxSpan = spans[spans.length - 1];

    // Convert percents to units
    const minDisplayValue =
      this.min + (leftValue / 100) * (this.max - this.min);

    const maxDisplayValue =
      this.min + (rightValue / 100) * (this.max - this.min);

    // Insert value to span
    minSpan.textContent = this.formatValue(minDisplayValue.toFixed(0));
    maxSpan.textContent = this.formatValue(maxDisplayValue.toFixed(0));
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}
