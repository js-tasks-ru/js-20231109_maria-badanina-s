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

    this.doubleSlider = this.element.querySelector(".range-slider__inner");
    this.sliderProgress = this.element.querySelector(".range-slider__progress");
    this.leftThumb = this.element.querySelector(".range-slider__thumb-left");
    this.rightThumb = this.element.querySelector(".range-slider__thumb-right");
    this.minSpan = this.element.querySelector('[data-element="from"]');
    this.maxSpan = this.element.querySelector('[data-element="to"]');

    // Add listeners
    this.leftThumb.addEventListener("pointerdown", this.onLeftThumbDrag);
    this.rightThumb.addEventListener("pointerdown", this.onRightThumbDrag);
    document.addEventListener("pointerup", this.onPointerUp);
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

  // ------ Utility functions ------- /

  // Convert initial values to percentage
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
    return (value / this.slider.width) * 100;
  }

  // Convert percentage to value
  percentToValue(value) {
    const barWidth = this.slider.width;
    return (value / barWidth) * (this.max - this.min) + this.min;
  }

  // ------ Main functionality ------- /

  onLeftThumbDrag = () => {
    this.isLeftDragging = true;
    this.isRightDragging = false;
    document.addEventListener("pointermove", this.onPointerMove);
  };

  onRightThumbDrag = () => {
    this.isLeftDragging = false;
    this.isRightDragging = true;
    document.addEventListener("pointermove", this.onPointerMove);
  };

  moveThumb = (x, direction) => {
    this.leftThumbPos =
      this.leftThumb.getBoundingClientRect().x -
      this.slider.left +
      this.leftThumb.offsetWidth;

    this.rightThumbPos =
      this.rightThumb.getBoundingClientRect().x - this.slider.left;

    if (direction === "left") {
      if (x < 0) x = 0;

      if (x > this.rightThumbPos) x = this.rightThumbPos;

      this.leftThumb.style.left = `${this.pxToPercent(x)}%`;
      this.sliderProgress.style.left = `${this.pxToPercent(x)}%`;
      this.leftValue = this.percentToValue(x).toFixed(0);
      this.minSpan.textContent = this.formatValue(this.leftValue);
    }

    if (direction === "right") {
      if (x > this.slider.width) x = this.slider.width;

      if (x < this.leftThumbPos) x = this.leftThumbPos;

      this.rightThumb.style.right = `${100 - this.pxToPercent(x)}%`;
      this.sliderProgress.style.right = `${100 - this.pxToPercent(x)}%`;
      this.rightValue = this.percentToValue(x).toFixed(0);
      this.maxSpan.textContent = this.formatValue(this.rightValue);
    }
  };

  onPointerMove = (event) => {
    this.slider = this.doubleSlider.getBoundingClientRect();
    let x = event.clientX - this.slider.left;

    if (this.isLeftDragging) {
      this.moveThumb(x, "left");
    }
    if (this.isRightDragging) {
      this.moveThumb(x, "right");
    }
  };

  onPointerUp = () => {
    const rangeSelect = new CustomEvent("range-select", {
      detail: {
        from: Number(this.leftValue) || this.from,
        to: Number(this.rightValue) || this.to,
      },
      bubbles: true,
    });

    this.element.dispatchEvent(rangeSelect);
    document.removeEventListener("pointermove", this.onPointerMove);
  };

  destroy() {
    if (this.element) {
      this.element.remove();
      this.leftThumb.removeEventListener("pointerdown", this.onLeftThumbDrag);
      this.rightThumb.removeEventListener("pointerdown", this.onRightThumbDrag);
      document.removeEventListener("pointermove", this.onPointerMove);
      document.removeEventListener("pointerup", this.onPointerUp);
    }
  }
}
