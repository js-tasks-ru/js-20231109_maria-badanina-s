import escapeHtml from "./utils/escape-html.js";
import fetchJson from "./utils/fetch-json.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";

export default class ProductForm {
  constructor(productId = "") {
    this.productId = productId;

    this.element = this.createElement(this.createTemplate());

    this.subElements = {
      title: this.element.querySelector('[name="title"]'),
      description: this.element.querySelector('[name="description"]'),
      quantity: this.element.querySelector('[name="quantity"]'),
      subcategory: this.element.querySelector('[name="subcategory"]'),
      status: this.element.querySelector('[name="status"]'),
      price: this.element.querySelector('[name="price"]'),
      discount: this.element.querySelector('[name="discount"]'),
      select: this.element.querySelector(`[name="subcategory"]`),
      productForm: this.element.querySelector(`[data-element="productForm"]`),
      imageListContainer: this.element.querySelector(
        `[data-element="imageListContainer"]`
      ),
    };
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer"><ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
              <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
              <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
              <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="https://i.imgur.com/MWorX2R.jpg">
            <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
          </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
              </button></li></ul></div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" id="subcategory" name="subcategory"></select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  async render() {
    const url = `${BACKEND_URL}/api/rest/products?id=${this.productId}`;

    try {
      const data = await fetchJson(url);

      //console.log("data--->", data);

      // show item caracteristics
      this.createItemData(data[0]);

      // get item subcategory and select it from the list
      const selectedValue = data[0].subcategory;
      this.getCategry(selectedValue);

      return this.element;
    } catch (err) {
      console.log("Error:", err);
    }
  }

  createItemData(data) {
    const {
      title,
      description,
      quantity,
      subcategory,
      status,
      price,
      discount,
    } = this.subElements;

    if (!data) return;

    title.value = data.title;
    // title.value = escapeHtml(data.title);
    description.value = data.description;
    // description.value = escapeHtml(data.description);
    quantity.value = data.quantity;
    subcategory.value = data.subcategory;
    // subcategory.value = escapeHtml(data.subcategory);
    status.value = data.status;
    price.value = data.price;
    discount.value = data.discount;

    console.log("subcategory--->", subcategory);
  }

  async getCategry(selectedValue) {
    const url = `${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`;

    try {
      const data = await fetchJson(url);
      this.subElements.select.innerHTML = this.createCategoryTemplate(
        data,
        selectedValue
      );
    } catch (err) {
      console.log("Error:", err);
    }
  }

  createCategoryTemplate(data, selectedValue) {
    const list = this.prepareCategoryList(data);
    return list?.map((item) => {
      const isSelected = item.value === selectedValue ? "selected" : "";
      return `<option value=${item.value} ${isSelected}>${item.name}</option>`;
    });
  }

  prepareCategoryList(categoriesData) {
    if (!categoriesData) return;
    const names = [];
    for (const category of categoriesData) {
      if (!category.subcategories) return;
      for (const child of category.subcategories) {
        names.push({
          value: child.id,
          name: `${escapeHtml(category.title)} &gt; ${escapeHtml(child.title)}`,
        });
      }
    }
    return names;
  }

  destroy = () => {
    this.remove();
  };

  remove = () => {
    this.element.remove();
  };
}
