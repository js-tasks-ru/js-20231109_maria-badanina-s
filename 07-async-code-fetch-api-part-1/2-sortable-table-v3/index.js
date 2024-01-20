import Table from "../../06-events-practice/1-sortable-table-v2/index.js";
import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTable extends Table {
  constructor(
    headersConfig,
    {
      data = [],
      sorted = { id: "title", order: "asc" },
      url = "",
      isSortLocally = false,
    } = {}
  ) {
    super(headersConfig, data);
    this.url = url;
    this.isSortLocally = isSortLocally;

    this.render(sorted.id, sorted.order);
    super.sort(sorted.id, sorted.order);
    this.headerEl.removeEventListener("pointerdown", this.onHeaderClick);
    this.headerEl.addEventListener("pointerdown", this.sortOnClick);
  }

  async render(id, order) {
    const table = this.element.querySelector(`.sortable-table`);
    table.classList.add("sortable-table_loading"); // add progres bar

    const url = `${BACKEND_URL}/${this.url}?_sort=${id}&_order=${order}&_start=0&_end=30`;
    try {
      const data = await fetchJson(url);
      super.sort(id, order);
      super.updateBody(this.subElements.body, data);
      this.data = data;
      return data;
    } catch (err) {
      console.log("Error:", err);
    } finally {
      table.classList.remove("sortable-table_loading"); //remove progress bar
    }
  }

  sortOnClick = (event) => {
    const headerCell = event.target.closest(
      '.sortable-table__cell[data-sortable="true"]'
    );

    if (headerCell) {
      const field = headerCell.dataset.id;
      const currentOrder = headerCell.getAttribute("data-order") || "asc";
      const newOrder = currentOrder === "asc" ? "desc" : "asc";
      headerCell.setAttribute("data-order", newOrder);
      this.sort(field, newOrder);
    }
  };

  sort(fieldValue, orderValue) {
    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer(fieldValue, orderValue);
    }
  }

  sortOnClient(id, order) {
    const newData =
      id === "title"
        ? this.sortedByTitle(this.data, order)
        : this.sortedByNumbers(this.data, order, id);

    this.data = newData;
    this.updateBody(this.subElements.body, newData);
  }

  sortOnServer(fieldValue, orderValue) {
    this.render(fieldValue, orderValue);
  }

  destroy() {
    super.destroy();
    this.headerEl.removeEventListener("pointerdown", this.sortOnClick);
  }
}
