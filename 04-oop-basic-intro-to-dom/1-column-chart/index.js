export default class ColumnChart {
  constructor(props = {}) {
    const {
      data = [],
      label = "",
      link = "",
      value = 0,
      formatHeading = (data) => data,
    } = props;
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;
    this.chartHeight = 50;
    this.element = this.createElement(this.createTemplate());
  }

  createTemplate() {
    return `
        <div class="column-chart__title">
          Total ${this.label}
          <a href="/${this.link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container ">
        <div data-element="header" class="column-chart__header">${
          this.value
        }</div>
        <div data-element="body" class="column-chart__chart">${this.createColumnElement(
          this.data
        )}</div>
    `;
  }

  createElement(htmlTemplate) {
    const chartDiv = document.createElement("div");
    chartDiv.setAttribute("class", `column-chart ${this.loading()}`);
    chartDiv.setAttribute("style", "--chart-height: 50");
    chartDiv.innerHTML = htmlTemplate;
    return chartDiv;
  }

  createColumnElement(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map((item) => {
        const columnValue = Math.floor(item * scale);
        const columnPercentage = ((item / maxValue) * 100).toFixed(0);
        return `<div style="--value: ${columnValue}" data-tooltip="${columnPercentage}%"></div>`;
      })
      .join("");
  }

  loading() {
    if (this.data.length === 0) {
      return "column-chart_loading";
    }
  }

  update(data) {
    this.createColumnElement(data);
  }

  destroy = () => {
    this.remove();
  };

  remove = () => {
    this.element.remove();
  };
}
