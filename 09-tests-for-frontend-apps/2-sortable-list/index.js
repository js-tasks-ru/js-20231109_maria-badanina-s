export default class SortableList {
  constructor({ items = {} }) {
    this.element = this.createListElement("ul");
    this.setItems(items);
    this.attachEventListeners();
  }

  // Create the main list element and add a class
  createListElement(tagName) {
    const element = document.createElement(tagName);
    element.classList.add("sortable-list");
    return element;
  }

  // Set items in the list by adding them to the innerHTML
  setItems(items) {
    this.element.innerHTML = items
      .map((item) => {
        item.classList.add("sortable-list__item");
        return item.outerHTML;
      })
      .join("");
  }

  // Attach event listeners for delete and drag actions
  attachEventListeners() {
    document.addEventListener("pointerdown", this.onElementDelete);
    document.addEventListener("pointerdown", this.onElementDrag);
  }

  // Remove event listeners to avoid memory leaks
  detachEventListeners() {
    document.removeEventListener("pointerdown", this.onElementDelete);
    document.removeEventListener("pointerdown", this.onElementDrag);
  }

  // Handle deletion of a sortable-list__item when the delete button is clicked
  onElementDelete(event) {
    const item = event.target.closest(".sortable-list__item");
    const deleteButton = event.target.closest("[data-delete-handle]");
    if (event.target != deleteButton) return;
    item.remove();
  }

  // Handle the dragging of a sortable-list__item
  onElementDrag = (event) => {
    const item = event.target.closest(".sortable-list__item");
    const dragButton = event.target.closest("[data-grab-handle]");

    if (event.target !== dragButton) return;

    const shiftX = event.clientX - item.getBoundingClientRect().left;
    const shiftY = event.clientY - item.getBoundingClientRect().top;

    const placeholder = this.createPlaceholder(item);
    this.insertPlaceholder(item, placeholder);
    this.setupDragStyles(item);

    item.draggable = true;
    item.addEventListener("dragstart", this.onDragStart);

    // Handle mouse move event
    const onMouseMove = (event) => {
      this.moveItem(item, shiftX, shiftY, event);
      this.handleDroppable(item, placeholder, event);
    };
    // Handle mouse up event and clean up after dragging
    const handleMouseUp = () => {
      this.leaveDroppable(item, placeholder);
      item.removeEventListener("dragstart", this.onDragStart);
      document.removeEventListener("pointermove", onMouseMove);
      document.removeEventListener("pointerup", handleMouseUp);
    };

    document.addEventListener("pointermove", onMouseMove);
    document.addEventListener("pointerup", handleMouseUp);
  };

  onDragStart(event) {
    event.preventDefault();
  }

  // Create a placeholder element for the dragged item
  createPlaceholder() {
    const placeholder = document.createElement("li");
    placeholder.classList.add(
      "sortable-list__placeholder",
      "sortable-list__item"
    );
    return placeholder;
  }

  // Insert the placeholder element at the appropriate position
  insertPlaceholder(item, placeholder) {
    const index = Array.from(this.element.children).indexOf(item);
    this.element.insertBefore(placeholder, this.element.children[index + 1]);
  }

  // Set up styles for the dragged item during the drag operation
  setupDragStyles(item) {
    item.style.position = "fixed";
    item.style.zIndex = 1000;
  }

  // Move the dragged item based on mouse movement
  moveItem(item, shiftX, shiftY, event) {
    item.style.left = event.clientX - shiftX + "px";
    item.style.top = event.clientY - shiftY + "px";
  }

  // Handle the droppable area and update the placeholder accordingly
  handleDroppable(item, placeholder, event) {
    item.style.visibility = "hidden";
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    item.style.visibility = "visible";

    const droppableBelow = elemBelow?.closest(".sortable-list__item");

    if (this.currentDroppable !== droppableBelow) {
      this.currentDroppable = droppableBelow;
      if (this.currentDroppable) {
        this.enterDroppable(this.currentDroppable, placeholder);
      }
    }
  }

  // Enter a droppable area and swap elements
  enterDroppable(element1, element2) {
    if (element1?.parentNode && element2?.parentNode) {
      this.swapElements(element1, element2);
    }
  }

  // Swap positions of two elements
  swapElements(element1, element2) {
    const temp = document.createElement("div");

    element1.parentNode.insertBefore(temp, element1);
    element2.parentNode.replaceChild(element1, element2);
    temp.parentNode.replaceChild(element2, temp);
  }

  // Leave droppable area and reset styles
  leaveDroppable(item, placeholder) {
    if (item?.parentNode && placeholder?.parentNode) {
      const temp = document.createElement("div");
      item.parentNode.insertBefore(temp, item);
      placeholder.parentNode.replaceChild(item, placeholder);
      temp.parentNode.replaceChild(placeholder, temp);
      placeholder.remove();

      this.resetDragStyles(item);
    }
  }

  // Reset styles for the dragged item
  resetDragStyles(item) {
    item.style.position = "static";
    item.style.zIndex = 1;
  }

  // Destroy the SortableList instance by removing the element and event listeners
  destroy = () => {
    this.remove();
  };

  // Remove the SortableList element and event listeners
  remove = () => {
    this.element.remove();
    this.detachEventListeners();
  };
}
