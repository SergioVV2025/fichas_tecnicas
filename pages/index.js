import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import Section from "../components/Section.js";
import Properties from "../components/Properties.js";
import StorageService from "../components/StorageService.js";
import { fillPreview } from "../components/admin-previews.js";

/*---------- Instancias de Popups ----------*/

const newCardPopup = new PopupWithForm("#new-card-popup", handleCardFormSubmit);
const newPreviewPopup = new PopupWithForm(
  "#new-preview-popup",
  handlePreviewFormSubmit,
);
const propertiesData = StorageService.getProperties(Properties);

/*---------- Función callback para manejar el click en la imagen de la tarjeta ----------*/

const handleCardClick = (id) => {
  window.open(`property.html?id=${id}`, "_blank");
};

/*---------- Initial Properties en properties.js ----------*/

function renderCard(item) {
  const newCard = new Card(item, "#card-template", handleCardClick);
  const cardElement = newCard.generateCard();

  return cardElement;
}

const section = new Section(
  {
    // items: Properties,
    items: propertiesData,
    renderer: renderCard,
  },
  ".cards__list",
);

section.renderItems();

/*---------- Popup Add Card ----------*/

const profileAddButton = document.querySelector(".nav__list-link__card");
profileAddButton.addEventListener("click", () => {
  newCardPopup.open();
});

const saveCardForm = document.querySelector("#new-card-form");
function handleCardFormSubmit(formData) {
  const newId = StorageService.getNextId();

  const newProperty = {
    id: newId,
    hero: formData.hero,
    title: formData.title,
    price: formData.price,
    description: formData.description,
    features: formData.features,
    gallery: formData.gallery,
  };
  const card = new Card(newProperty, "#card-template", handleCardClick);
  // const card = new Card(
  //   {
  //     id: newId,
  //     hero: formData.hero,
  //     title: formData.title,
  //     price: formData.price,
  //     description: formData.description,
  //     features: formData.features,
  //     gallery: formData.gallery,
  //   },
  //   "#card-template",
  //   handleCardClick,
  // );
  const cardElement = card.generateCard();
  section.addItem(cardElement);

  StorageService.addProperty(newProperty);

  /*--- Deshabilitar botón "Crear" y limpiar formulario ---*/

  const newCardSubmitButton = saveCardForm.querySelector(".popup__button");
  newCardSubmitButton.disabled = true;
  saveCardForm.reset();

  newCardPopup.close();
}

/*---------- Formulario de Previews ----------*/

const newPreview = document.querySelector(".nav__list-link__preview");
newPreview.addEventListener("click", () => {
  // window.open("./admin-previews.html", "_blank");
  const previewIdMax = document.querySelector(".popup__input_type_property-id");
  const max = StorageService.getMaxId();
  if (max !== 0) {
    previewIdMax.setAttribute("max", max);
    newPreviewPopup.open();
  }
});

const newPreviewForm = document.forms["new-preview-form"];
const previewId = newPreviewForm.id;
const previewInputId = document.querySelector(".popup__input_type_property-id");
previewInputId.addEventListener("change", () => {
  recoverPropertyInfo(previewId.value - 1);
});

function recoverPropertyInfo(id) {
  const currentProperty = StorageService.getProperty(id - 1);
  // alert(currentProperty.title);
  const propertyTitle = document.querySelector(
    ".popup__input_type_property-title",
  );
  propertyTitle.value = currentProperty.title;
  const descriptionOG = document.querySelector(
    ".input__textarea-descriptionOG",
  );
  descriptionOG.value =
    currentProperty.price.toString() +
    "\t" +
    currentProperty.features +
    "\t" +
    currentProperty.description;

  const imageOG = document.querySelector(".popup__input_type_imageOG");
  imageOG.value =
    "https://sergiovv2025.github.io/fichas__tecnicas/" +
    currentProperty.hero.slice(2);

  const urlProject = document.querySelector(".popup__input_type_urlProject");
  urlProject.value = "https://sergiovv2025.github.io/fichas__tecnicas/";
}

function handlePreviewFormSubmit(formData) {
  const previewData = {
    id: formData.id,
    title: formData.title,
    descriptionOG: formData.descriptionOG,
    imageOG: formData.imageOG,
    urlProject: formData.urlProject,
  };
  fillPreview(previewData);
  newPreviewPopup.close();
}

//*---------- Objeto config para validación ----------*/

const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_error",
  errorClass: "popup__error_active",
};

/*---------- Instanciar validadores ----------*/

const cardFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#new-card-form"),
);

const previewFormValiator = new FormValidator(
  validationConfig,
  document.querySelector("#new-preview-form"),
);

// Habilitar validación

cardFormValidator.enableValidation();
previewFormValiator.enableValidation();
