export default class SortableList {
  constructor({ items }) {
    this.element = this.createListElement("ul");

    items.forEach((item) => {
      const listItem = this.createListItemElement(item);
      this.element.appendChild(listItem);
    });

    this.element.addEventListener("mousedown", this.onMouseDown);

    this.currentDroppable = null;
  }

  onMouseDown(event) {
    const item = event.target.closest(".sortable-list__item");
    const dragButton = event.target.closest("[data-grab-handle]");
    if (event.target != dragButton) return;

    item.classList.remove("droppable");

    let shiftX = event.clientX - item.getBoundingClientRect().left;
    let shiftY = event.clientY - item.getBoundingClientRect().top;

    item.style.position = "absolute";
    item.style.zIndex = 1000;
    document.body.append(item);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      item.style.left = pageX - shiftX + "px";
      item.style.top = pageY - shiftY + "px";
    }
    // let currentDroppable = this.currentDroppable;

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);

      item.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      console.log("elemBelow--->", elemBelow);
      item.hidden = false;

      if (!elemBelow) return;

      console.log("this--->", this);

      let droppableBelow = item.closest(".droppable");
      console.log("droppableBelow--->", droppableBelow);

      if (this.currentDroppable != droppableBelow && item != droppableBelow) {
        if (this.currentDroppable) {
          leaveDroppable(this.currentDroppable);
        }
        this.currentDroppable = droppableBelow;
        if (this.currentDroppable) {
          enterDroppable(this.currentDroppable);
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    item.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      item.onmouseup = null;
      item.classList.add("droppable");
    };

    item.ondragstart = function () {
      return false;
    };

    function enterDroppable(elem) {
      elem.style.background = "pink";
    }

    function leaveDroppable(elem) {
      elem.style.background = "";
    }
  }

  createListElement(tagName) {
    const element = document.createElement(tagName);
    element.classList.add("sortable-list");
    return element;
  }

  createListItemElement(item) {
    item.classList.add("sortable-list__item");
    item.classList.add("droppable");
    const deleteButton = item.querySelector("[data-delete-handle]");
    const dragButton = item.querySelector("[data-grab-handle]");

    deleteButton.addEventListener("click", () => {
      item.remove();
    });

    return item;
  }
}
