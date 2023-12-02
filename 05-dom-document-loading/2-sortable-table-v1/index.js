/* eslint-disable indent */
export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate(this.data));
    this.parent = document.querySelector("#root");
  }

  /// create layout logic
  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }
  createTemplate(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.createHeaderTemplate(this.headerConfig)}
        ${data
          .map((item) => {
            const { images, title, quantity, price, sales, id } = item;
            return this.createItemTemplate(
              images?.[1]?.url,
              title,
              quantity,
              price,
              sales,
              id
            );
          })
          .join("")}
      </div>
    `;
  }
  createItemTemplate(image, title, quantity, price, sales, link) {
    return `
        <a href="/products/${link}" class="sortable-table__row">
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${image}">
          </div>
          <div class="sortable-table__cell">${title}</div>
          <div class="sortable-table__cell">${quantity}</div>
          <div class="sortable-table__cell">${price}</div>
          <div class="sortable-table__cell">${sales}</div>
        </a>
    `;
  }
  createHeaderTemplate(headerData) {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${headerData
          .map((item) => {
            const { id, sortable, title } = item;
            return `
              <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="">
                <span>${title}</span>
                ${
                  sortable
                    ? `<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>`
                    : ""
                }
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  /// sorting logic
  LOCALE_OPTIONS = { sensitivity: "case", caseFirst: "upper" };
  sortStringsAscending(arr) {
    const arrCopy = [...arr];
    arrCopy.sort((a, b) =>
      a.title.localeCompare(b.title, "ru", this.LOCALE_OPTIONS)
    );
    return arrCopy;
  }
  sortStringsDescending(arr) {
    const arrCopy = [...arr];
    arrCopy.sort((a, b) =>
      b.title.localeCompare(a.title, "ru", this.LOCALE_OPTIONS)
    );
    return arrCopy;
  }

  sortedData(arr, param = "asc") {
    const asc = this.sortStringsAscending(arr);
    const desc = this.sortStringsDescending(arr);
    return param === "desc" ? desc : asc;
  }

  sort(fieldValue, orderValue) {
    const newData = this.sortedData(this.data, orderValue);
    const newTemplate = this.createElement(this.createTemplate(newData));
    this.update(this.element, newTemplate);
    this.element = newTemplate;
  }

  // create update logic
  update(oldElement, newElement) {
    this.parent.replaceChild(newElement, oldElement);
  }

  destroy() {
    this.element.remove();
  }
}
