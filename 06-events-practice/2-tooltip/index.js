class Tooltip {
  static instance = null;
  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    } else {
      return Tooltip.instance;
    }
  }

  initialize() {
    this.container = document.querySelector("body");
    // Attach events
    this.container.addEventListener("pointerover", this.showTooltip);
    this.container.addEventListener("pointerout", this.hideTooltip);
  }

  render = (x, y, text) => {
    // Render tooltip
    this.element = this.createElement(text);
    document.body.append(this.element);
    // Add Tooltip Position
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  };

  createTemplate(text) {
    return `<div class = "tooltip">${text}</div>`;
  }

  createElement(html) {
    const element = document.createElement("div");
    element.innerHTML = this.createTemplate(html);
    return element.firstElementChild;
  }

  updateTooltipPosition = (x, y) => {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  };

  showTooltip = (event) => {
    this.tooltipHtml = event.target.dataset.tooltip;
    if (!this.tooltipHtml) return;

    this.render(event.x, event.y, this.tooltipHtml);

    event.target.addEventListener("pointermove", (e) => {
      this.updateTooltipPosition(e.x, e.y);
    });
  };

  hideTooltip = () => {
    if (!this.element) return;

    this.element.removeEventListener("pointermove", this.updateTooltipPosition);
    this.element.remove();
    this.element = null;
  };

  destroy() {
    // Remove event listeners when the tooltip is no longer needed
    this.container.removeEventListener("pointerover", this.showTooltip);
    this.container.removeEventListener("pointerout", this.hideTooltip);
    this.hideTooltip(); // Clean up any existing tooltip
  }
}
export default Tooltip;
