import Table from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends Table {
  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    super(headersConfig, data);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.sorted = sorted;
    this.attachHeaderEventListener();

    document.addEventListener("DOMContentLoaded", () => {
      this.setHeaderCellData(this.sorted);
      super.sort(this.sorted.id, this.sorted.order);
      this.attachHeaderEventListener();
    });
  }

  setHeaderCellData(sorted) {
    const headerCell = document.querySelector(
      `.sortable-table__cell[data-id="${sorted.id}"]`
    );
    if (headerCell) {
      headerCell.setAttribute("data-order", sorted.order);
    }
  }

  onHeaderClick(event) {
    const headerCell = event.target.closest(
      '.sortable-table__cell[data-sortable="true"]'
    );

    if (headerCell) {
      const field = headerCell.dataset.id;
      const currentOrder = headerCell.getAttribute("data-order") || "asc";
      const newOrder = currentOrder === "asc" ? "desc" : "asc";
      headerCell.setAttribute("data-order", newOrder);
      super.sort(field, newOrder);
    }
    this.reattachListeners();
  }
  attachHeaderEventListener() {
    // Remove existing listener if it exists
    this.removeHeaderEventListener();

    // Attach event listener to sortableTable.subElements.header
    if (this.subElements && this.subElements.header) {
      this.subElements.header.addEventListener(
        "pointerdown",
        this.onHeaderClick
      );
    }
  }

  removeHeaderEventListener() {
    if (this.subElements && this.subElements.header) {
      this.subElements.header.removeEventListener(
        "pointerdown",
        this.onHeaderClick
      );
    }
  }

  reattachListeners() {
    this.attachHeaderEventListener();
  }
}
