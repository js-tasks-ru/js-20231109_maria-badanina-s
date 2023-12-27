import Table from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends Table {
  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    super(headersConfig, data);

    // Attach header click listener for the first time
    this.initHeaderListeners();

    // On DOM loaded, set initial column sorting
    document.addEventListener("DOMContentLoaded", () => {
      // Set visual order indicator on current sorted column
      this.setCurrentCell(sorted);

      // Call Table sort() method to actually sort rows
      super.sort(sorted.id, sorted.order);

      // Re-attach header click handler
      // (in case headers were re-rendered)
      this.initHeaderListeners();
    });
  }

  // Set 'data-order' attribute on currently sorted header
  setCurrentCell(sorted) {
    const headerCell = document.querySelector(
      `.sortable-table__cell[data-id="${sorted.id}"]`
    );
    if (headerCell) {
      headerCell.setAttribute("data-order", sorted.order);
    }
  }

  onHeaderClick = (event) => {
    // Get header cell element
    const headerCell = event.target.closest(
      '.sortable-table__cell[data-sortable="true"]'
    );

    if (headerCell) {
      // Toggle data attributes for sorting
      const field = headerCell.dataset.id;
      const currentOrder = headerCell.getAttribute("data-order") || "asc";
      const newOrder = currentOrder === "asc" ? "desc" : "asc";
      headerCell.setAttribute("data-order", newOrder);

      // Call Table sort() to actually rearrange rows
      super.sort(field, newOrder);
    }

    // Re-attach header click handler
    // Needed for it to work after any DOM updates
    this.initHeaderListeners();
  };

  initHeaderListeners() {
    if (!this.headerEl) return;
    this.headerEl.addEventListener("pointerdown", this.onHeaderClick);
  }

  destroy() {
    // Clean up on destroy
    super.destroy();
    this.headerEl.removeEventListener("pointerdown", this.onHeaderClick);
  }

  get headerEl() {
    return this.subElements.header;
  }
}