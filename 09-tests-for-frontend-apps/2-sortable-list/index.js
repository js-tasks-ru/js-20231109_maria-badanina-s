export default class SortableList {
  constructor({ items }) {
    this.items = items;
    this.element = this.createListElement("ul");

    items.forEach((item) => {
      const listItem = this.createListItemElement(item);
      this.element.appendChild(listItem);
    });

    this.element.addEventListener("pointerdown", this.onMouseDown);

    this.currentDroppable = null;
  }

  onMouseDown(event) {
    const item = event.target.closest(".sortable-list__item");
    const dragButton = event.target.closest("[data-grab-handle]");
    if (event.target != dragButton) return;

    let shiftX = event.clientX - item.getBoundingClientRect().left;
    let shiftY = event.clientY - item.getBoundingClientRect().top;

    // put placeholder in the place of the grabbed element
    const placeholder = document.createElement("li");
    placeholder.classList.add(
      "sortable-list__placeholder",
      "sortable-list__item"
    );
    // Get the index of the original element within its parent
    const index = Array.from(this.children).indexOf(item);
    // Insert the placeholder at the same index as the original element
    this.insertBefore(placeholder, this.children[index + 1]);

    //elem.classList.add("sortable-list__placeholder");

    item.style.position = "absolute";
    item.style.zIndex = 1000;
    item.style.width = "100%";
    //document.body.append(item);

    //moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      item.style.left = pageX - shiftX + "px";
      item.style.top = pageY - shiftY + "px";
    }
    // let currentDroppable = this.currentDroppable;

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);

      item.style.visibility = "hidden";
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest(".sortable-list__item");

      item.style.visibility = "visible";

      if (this.currentDroppable != droppableBelow) {
        if (this.currentDroppable) {
          leaveDroppable(this.currentDroppable);
        }
        this.currentDroppable = droppableBelow;
        if (this.currentDroppable) {
          enterDroppable(this.currentDroppable);
        }
      }
    };

    document.addEventListener("pointermove", onMouseMove);

    item.onmouseup = function () {
      document.removeEventListener("pointermove", onMouseMove);
      item.onmouseup = null;
    };

    item.ondragstart = function () {
      return false;
    };

    function enterDroppable(elem) {
      //elem.classList.add("sortable-list__placeholder");
      /// here I need to swap elem with placeholder
    }

    function leaveDroppable(elem) {
      //elem.classList.remove("sortable-list__placeholder");
      // here I need to swap elem with placeholder too!!!
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

    deleteButton.addEventListener("pointerdown", () => {
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
