export default class NotificationMessage {
  static currentNotification = null;
  constructor(message = "Default message", options = {}) {
    const { type = "success", duration = 0 } = options;

    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement(this.createTemplate());
    this.time = null;
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:20s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
           ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  show(notificationDiv) {
    if (NotificationMessage.currentNotification) {
      NotificationMessage.currentNotification.remove();
    }
    NotificationMessage.currentNotification = this;

    if (notificationDiv instanceof HTMLDivElement) {
      this.element = notificationDiv;
    }

    document.body.appendChild(this.element);

    this.timer = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroyTimer() {
    clearTimeout(this.timer);
  }

  destroy() {
    this.remove();
    this.destroyTimer();
  }
}
