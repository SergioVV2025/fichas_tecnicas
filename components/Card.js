class Card {
  constructor(data, cardSelector, handleCardClick) {
    this._id = data.id;
    this._hero = data.hero;
    this._title = data.title;
    this._price = data.price;
    this._comment = data.comment;
    this._features = data.features;
    this._gallery = data.gallery;
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardElement;
  }

  _setEventListeners() {
    const cardImage = this._cardElement.querySelector(".card__image");
    cardImage.addEventListener("click", () => {
      this._handleCardClick(this._id);
    });

    const cardLikeButton =
      this._cardElement.querySelector(".card__like-button");
    cardLikeButton.addEventListener("click", (evt) => {
      evt.target.classList.toggle("card__like-button_is-active");
    });

    const cardDeleteButton = this._cardElement.querySelector(
      ".card__delete-button",
    );
    cardDeleteButton.addEventListener("click", () => {
      cardDeleteButton.closest(".card").remove();
    });

    const cardWhatsappButton = this._cardElement.querySelector(
      ".card__whatsapp-button",
    );

    cardWhatsappButton.addEventListener("click", (evt) => {
      evt.stopPropagation();

      const previewUrl = `https://sergiovv2025.github.io/fichas_tecnicas/previews/propiedad${this._id}_preview.html`;

      const message = `Te comparto esta propiedad:\n${previewUrl}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
    });

    const priceInput = document.forms["new-card-form"]["price"];
    const pattern = /\d/;
    let caracter = "";

    let price = document.forms["new-card-form"]["price"].value;
    priceInput.addEventListener("keyup", () => {
      price = document.forms["new-card-form"]["price"].value;
      caracter = price.charAt(price.length - 1);

      if (!pattern.test(caracter)) {
        price = price.slice(0, -1);
        priceInput.value = price;
      }
    });

    priceInput.addEventListener("blur", () => {
      if (!isNaN(priceInput.value)) {
        priceInput.value =
          Number(priceInput.value).toLocaleString() + ".00 MXN";
      }
    });
  }

  generateCard() {
    this._cardElement = this._getTemplate();

    const cardId = this._cardElement.querySelector(".card__id");
    cardId.textContent = this._id;

    const cardTitle = this._cardElement.querySelector(".card__title");
    cardTitle.textContent = this._title;

    const cardImage = this._cardElement.querySelector(".card__image");
    cardImage.src = this._hero;
    cardImage.alt = this._title;

    const cardPrice = this._cardElement.querySelector(".card__price");
    cardPrice.textContent = this._price;

    const cardComment = this._cardElement.querySelector(".card__comment");
    cardComment.textContent = this._comment;

    const cardFeatures = this._cardElement.querySelector(".card__features");
    const pattern = /[^,.;:\n\t]+/g;
    const featuresArray = this._features.match(pattern);
    let featuresStringDisplay = "";
    for (let feature of featuresArray) {
      featuresStringDisplay += "- " + feature + "<br>";
    }
    cardFeatures.innerHTML = featuresStringDisplay;

    const imageGallery = this._cardElement.querySelector(".card__gallery");
    for (let i = 0; i < this._gallery.length; i++) {
      const imageItem = document.createElement("img");
      imageItem.className = "card__gallery_image";
      imageItem.setAttribute("src", this._gallery[i]);
      imageItem.setAttribute("alt", this._gallery[i]);
      imageGallery.appendChild(imageItem);
    }

    this._setEventListeners();

    return this._cardElement;
  }
}

export default Card;
