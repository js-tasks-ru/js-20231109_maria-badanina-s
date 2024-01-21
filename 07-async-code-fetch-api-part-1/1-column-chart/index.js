import fetchJson from "./utils/fetch-json.js";
import Chart from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChart extends Chart {
  constructor(props = {}) {
    const {
      label = "",
      link = "",
      url = "",
      range = { from: new Date(), to: new Date() },
    } = props;
    super({ label, link });

    this.url = url;
    this.from = range.from;
    this.to = range.to;
    this.update(this.from, this.to);

    this.subElements = {
      body: this.element.querySelector(`[data-element="body"]`),
      header: this.element.querySelector(`[data-element="header"]`),
    };
  }

  formatDateToAPIFormat(date) {
    const isoString = new Date(date).toISOString();
    return encodeURIComponent(isoString);
  }

  async update(from, to) {
    this.element.classList.add("column-chart_loading");

    const formatFrom = this.formatDateToAPIFormat(from);
    const formatTo = this.formatDateToAPIFormat(to);
    const url = `${BACKEND_URL}/${this.url}?from=${formatFrom}&to=${formatTo}`;

    try {
      const data = await fetchJson(url);
      const dataArray = Object.values(data);
      const total = dataArray.reduce((acc, currVal) => acc + currVal, 0);
      super.update(dataArray);
      this.subElements.body.innerHTML = super.createColumnElement(dataArray);
      this.subElements.header.innerHTML = total;
      return data;
    } catch (err) {
      console.log("Error:", err);
    } finally {
      this.element.classList.remove("column-chart_loading");
    }
  }
}
