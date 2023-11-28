export default class NotificationMessage {
  constructor(message = "Default message", options = {}) {
    const { type = "success", duration = 0 } = options;

    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = document.createElement("div");
    this.element.classList.add("notification", this.type);
    this.element.style.setProperty("--value", `${this.duration / 1000}s`);
    this.element.innerHTML = this.createTemplate();
    document.body.appendChild(this.element);
  }

  createTemplate() {
    return `
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
           ${this.message}
          </div>
        </div>
    `;
  }

  show(notificationDiv) {
    if (notificationDiv instanceof HTMLDivElement) {
      this.element = notificationDiv;
    }
    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
