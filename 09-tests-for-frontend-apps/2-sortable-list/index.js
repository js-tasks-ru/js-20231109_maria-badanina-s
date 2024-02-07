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
    //item.style.border = "1px solid red";
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

    item.style.position = "fixed";
    item.style.zIndex = 1000;
    item.style.width = "100%";

    function moveAt(pageX, pageY) {
      item.style.left = pageX - shiftX + "px";
      item.style.top = pageY - shiftY + "px";
    }

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);

      item.style.visibility = "hidden";
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest(".sortable-list__item");

      item.style.visibility = "visible";

      if (this.currentDroppable != droppableBelow) {
        this.currentDroppable = droppableBelow;
        if (this.currentDroppable) {
          enterDroppable(this.currentDroppable, placeholder);
        }
      }
    };

    document.addEventListener("pointermove", onMouseMove);

    item.onmouseup = function () {
      document.removeEventListener("pointermove", onMouseMove);
      leaveDroppable(item, placeholder);
      item.onmouseup = null;
    };

    item.ondragstart = function () {
      return false;
    };

    function enterDroppable(element1, element2) {
      /// here I need to swap elem with placeholder
      if (element1?.parentNode && element2?.parentNode) {
        // Create a temporary storage for element1
        let temp = document.createElement("div");

        // Step in between to hold the place of element1
        element1.parentNode.insertBefore(temp, element1);

        // Replace element1 with element2
        element2.parentNode.replaceChild(element1, element2);

        // Move element2 to the original position of element1
        temp.parentNode.replaceChild(element2, temp);
      }
    }

    function leaveDroppable(item, placeholder) {
      /// here I need to swap elem with placeholder
      if (item?.parentNode && placeholder?.parentNode) {
        // Create a temporary storage for item
        let temp = document.createElement("div");

        // Step in between to hold the place of item
        item.parentNode.insertBefore(temp, item);

        // Replace item with placeholder
        placeholder.parentNode.replaceChild(item, placeholder);

        // Move placeholder to the original position of item
        temp.parentNode.replaceChild(placeholder, temp);
        placeholder.remove();

        item.style.position = "static";
        item.style.zIndex = 1;
        item.style.width = "auto";
      }
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
    this.element.removeEventListener("pointerdown", this.onMouseDown);
  };
}
