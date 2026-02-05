class Property {
  constructor(properties, selector, config) {
    this._propertyId = properties.id;
    this._imageHero = properties.hero;
    this._title = properties.title;
    this._price = properties.price;
    this._comment = properties.comment;
    this._features = properties.features;
    this._gallery = properties.gallery;
    this._btnBack = config.btnBack;
    this._btnForward = config.btnForward;
    this._selector = selector;
    this._i = 0;
  }

  findId(id, Properties) {
    const result = Properties.find((p) => p.id === id);

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  _getTemplate() {
    const htmlElement = document
      .querySelector(this._selector)
      .content.querySelector(".property__content")
      .cloneNode(true);
    return htmlElement;
  }

  _setEventListeners() {
    const htmlGalleryImage = this._htmlElement.querySelector(
      ".property__gallery-image",
    );

    const btnImageBack = this._htmlElement.querySelector(this._btnBack);
    btnImageBack.addEventListener("click", () => {
      this._i--;
      if (this._i >= 0) {
        htmlGalleryImage.src = this._gallery[this._i];
        htmlGalleryImage.alt = this._gallery[this._i];
      } else {
        this._i = this._gallery.length - 1;
        htmlGalleryImage.src = this._gallery[this._i];
        htmlGalleryImage.alt = this._gallery[this._i];
      }
    });

    const btnImageFwd = this._htmlElement.querySelector(this._btnForward);
    btnImageFwd.addEventListener("click", () => {
      this._i++;
      if (this._i < this._gallery.length) {
        htmlGalleryImage.src = this._gallery[this._i];
        htmlGalleryImage.alt = this._gallery[this._i];
      } else {
        this._i = 0;
        htmlGalleryImage.src = this._gallery[this._i];
        htmlGalleryImage.alt = this._gallery[this._i];
      }
    });
  }

  generateHTML() {
    this._htmlElement = this._getTemplate();

    const htmlHero = this._htmlElement.querySelector(".property__hero-image");
    htmlHero.src = this._imageHero;
    htmlHero.alt = this._imageHero;

    const htmlTitle = this._htmlElement.querySelector(".property__title");
    htmlTitle.textContent = this._title;

    const htmlPrice = this._htmlElement.querySelector(".property__price");
    htmlPrice.textContent = this._price;

    const htmlFeatures = this._htmlElement.querySelector(
      ".property__features-list",
    );
    const pattern = /[^,.;:\n\t]+/g;
    const featuresArray = this._features.match(pattern);
    let featureElement, featureText;
    for (let feature of featuresArray) {
      featureElement = document.createElement("li");
      featureElement.className = "property__feature";
      featureText = document.createTextNode(feature);
      featureElement.append(featureText);
      htmlFeatures.appendChild(featureElement);
    }

    const htmlComment = this._htmlElement.querySelector(".property__comment");
    htmlComment.textContent = this._comment;

    const htmlGalleryImage = this._htmlElement.querySelector(
      ".property__gallery-image",
    );

    htmlGalleryImage.src = this._gallery[this._i];
    htmlGalleryImage.alt = this._gallery[this._i];

    this._setEventListeners();

    return this._htmlElement;
  }

  renderHTML(htmlElement, selector) {
    const container = document.querySelector(selector);
    container.append(htmlElement);
  }

  handleError(selector) {
    const error = document.querySelector(selector);
    error.style.display = "block";
  }
}

export default Property;
