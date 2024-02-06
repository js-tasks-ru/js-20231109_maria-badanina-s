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

    let shiftX = event.clientX - item.getBoundingClientRect().left;
    let shiftY = event.clientY - item.getBoundingClientRect().top;

    item.style.position = "absolute";
    item.style.zIndex = 1000;
    item.style.width = "100%";
    //document.body.append(item);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      item.style.left = pageX - shiftX + "px";
      item.style.top = pageY - shiftY + "px";
    }
    // let currentDroppable = this.currentDroppable;

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);

      item.style.visibility = "hidden";
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      console.log("elemBelow--->", elemBelow);

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest(".sortable-list__item");
      console.log("droppableBelow--->", droppableBelow);

      item.style.visibility = "visible";

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
    const deleteButton = item.querySelector("[data-delete-handle]");
    const dragButton = item.querySelector("[data-grab-handle]");

    deleteButton.addEventListener("click", () => {
      item.remove();
    });

    return item;
  }

  destroy = () => {
    this.remove();
  };

  remove = () => {
    this.element.remove();
  };
}
