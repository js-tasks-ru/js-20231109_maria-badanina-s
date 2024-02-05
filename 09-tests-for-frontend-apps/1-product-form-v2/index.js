//import SortableList from "../../2-sortable-list/src/index.js";
import escapeHtml from "./utils/escape-html.js";
import fetchJson from "./utils/fetch-json.js";
import ProductForm1 from "./../../08-forms-fetch-api-part-2/1-product-form-v1/index.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";

export default class ProductForm extends ProductForm1 {
  constructor(productId) {
    super();
    this.productId = productId;
  }

  //async render() {}
}
