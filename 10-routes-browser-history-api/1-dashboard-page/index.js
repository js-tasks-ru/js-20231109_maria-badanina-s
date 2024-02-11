import RangePicker from "./components/range-picker/src/index.js";
import SortableTable from "./components/sortable-table/src/index.js";
import ColumnChart from "./components/column-chart/src/index.js";
import header from "./bestsellers-header.js";

import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class Page {
  constructor() {}

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
      <div id="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <div data-element="rangePicker"></div>
        </div>

        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Best sellers</h3>
        <div data-element="sortableTable"></div>
      </div>
    `;
  }

  async render() {
    this.element = this.createElement(this.createTemplate());

    // range ppicker
    const rangePickerEl = this.element.querySelector(
      '[data-element="rangePicker"]'
    );
    const rangePicker = new RangePicker();
    rangePickerEl.appendChild(rangePicker.element);

    // column charts
    const ordersChartEl = this.element.querySelector(
      '[data-element="ordersChart"]'
    );
    const salesChartEl = this.element.querySelector(
      '[data-element="salesChart"]'
    );
    const customersChartEl = this.element.querySelector(
      '[data-element="customersChart"]'
    );

    const from = new Date();
    const to = new Date();

    const ordersChart = new ColumnChart({
      url: "api/dashboard/orders",
      range: {
        from,
        to,
      },
      label: "orders",
    });

    const salesChart = new ColumnChart({
      url: "api/dashboard/sales",
      range: {
        from,
        to,
      },
      label: "sales",
      formatHeading: (data) => `$${data}`,
    });

    const customersChart = new ColumnChart({
      url: "api/dashboard/customers",
      range: {
        from,
        to,
      },
      label: "customers",
    });

    ordersChartEl.appendChild(ordersChart.element);
    salesChartEl.appendChild(salesChart.element);
    customersChartEl.appendChild(customersChart.element);

    // sortable table
    const sortableTableEl = this.element.querySelector(
      '[data-element="sortableTable"]'
    );
    const sortableTable = new SortableTable(header, {
      url: "api/dashboard/bestsellers",
    });
    sortableTableEl.appendChild(sortableTable.element);

    this.subElements = {
      sortableTable: sortableTableEl,
      ordersChart: ordersChartEl,
      salesChart: salesChartEl,
      customersChart: customersChartEl,
      rangePicker: rangePickerEl,
    };

    return this.element;
  }

  destroy = () => {
    this.remove();
  };

  remove = () => {
    this.element.remove();
  };
}
