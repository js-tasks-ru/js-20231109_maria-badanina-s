import SortableList from "../2-sortable-list/index.js";
import ProductForm1 from "./../../08-forms-fetch-api-part-2/1-product-form-v1/index.js";
import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class ProductForm extends ProductForm1 {
  constructor(productId) {
    super();
    this.productId = productId;
  }

  async render() {
    // Call the render method of the base class
    await super.render();
    // Retrieve images and pass them to SortableList
    const productUrl = `${BACKEND_URL}/api/rest/products?id=${this.productId}`;
    try {
      const productData = await fetchJson(productUrl);
      new SortableList({ items: super.createImages(productData[0]) });
    } catch (err) {
      console.log("Error:", err);
    }

    return this.element;
  }
}
