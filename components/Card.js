import StorageService from "./StorageService.js";

class Card {
  constructor(
    data,
    cardSelector,
    handleCardClick,
    confirmationPopup,
    handleEdit,
  ) {
    this._data = data;
    this._id = data.id;
    this._hero = data.hero;
    this._title = data.title;
    this._price = data.price;
    this._description = data.description;
    this._features = data.features;
    this._gallery = data.gallery;
    this._time = data.time;
    this._address = data.address;
    this._theme = data.theme;
    this._isLiked = data.isLiked;
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
    this._confirmationPopup = confirmationPopup;
    this._handleEdit = handleEdit;
  }

  _like(evt, cardLikeButton) {
    this._confirmationPopup.open(this._id, evt, cardLikeButton, "like");
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
      if (this._id !== 0) {
        this._handleCardClick(this._id, this._time);
      }
    });

    const cardLikeButton =
      this._cardElement.querySelector(".card__like-button");
    cardLikeButton.addEventListener("click", (evt) => {
      // evt.stopPropagation();
      this._like(evt, cardLikeButton);
    });

    const cardDeleteButton = this._cardElement.querySelector(
      ".card__delete-button",
    );
    cardDeleteButton.addEventListener("click", (evt) => {
      // evt.stopPropagation();
      if (this._id !== 0) {
        this._confirmationPopup.open(this._id, evt, cardDeleteButton, "delete");
      }
    });

    const cardEditButton =
      this._cardElement.querySelector(".card__edit-button");
    cardEditButton.addEventListener("click", (evt) => {
      evt.stopPropagation();
      this._handleEdit(this._data);
    });

    const cardWhatsappButton = this._cardElement.querySelector(
      ".card__whatsapp-button",
    );
    cardWhatsappButton.addEventListener("click", (evt) => {
      evt.stopPropagation();

      const publishedMax = StorageService.getMaxPublishedId();

      if (Number(this._id) > publishedMax) {
        alert(
          "Esta propiedad aún no está publicada.\n\n" +
            "Debes generar el preview y subirlo a GitHub dentro de la carpeta /previews para poder compartirla.",
        );
        return;
      }

      const previewUrl = `https://sergiovv2025.github.io/fichas_tecnicas/previews/propiedad${this._id}${this._time}_preview.html`;

      const message = `Te comparto esta propiedad:\n${previewUrl}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
    });

    const priceInput = document.querySelector(".popup__input_type_card-price");
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
    cardImage.alt = this._hero;

    const cardPrice = this._cardElement.querySelector(".card__price");
    cardPrice.textContent = this._price;

    const cardDescription =
      this._cardElement.querySelector(".card__description");
    cardDescription.textContent = this._description;

    const cardFeatures = this._cardElement.querySelector(".card__features");
    const pattern = /[^;\n\t]+/g;
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

    const cardAddress = this._cardElement.querySelector(".card__address");
    cardAddress.textContent = this._address;

    const cardTheme = this._cardElement.querySelector(".card__theme");
    cardTheme.textContent = this._theme;

    const cardIsLiked = this._cardElement.querySelector(".card__like-button");
    this._isLiked === true
      ? cardIsLiked.classList.add("card__like-button_is-active")
      : cardIsLiked.classList.remove("card__like-button_is-active");

    this._setEventListeners();

    return this._cardElement;
  }
}

export default Card;
