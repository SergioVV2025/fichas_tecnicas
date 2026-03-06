import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import Section from "../components/Section.js";
import Properties from "../components/Properties.js";
import StorageService from "../components/StorageService.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import { fillPreview } from "../components/admin-previews.js";

/*---------- Instancias de Popups ----------*/

const newCardPopup = new PopupWithForm("#new-card-popup", handleCardFormSubmit);
const newPreviewPopup = new PopupWithForm(
  "#new-preview-popup",
  handlePreviewFormSubmit,
);
const newImportPopup = new PopupWithForm(
  "#new-import-popup",
  handleImportSubmit,
);
const newExportPopup = new PopupWithForm("#new-export-popup", handleExportData);
const newConfirmationPopup = new PopupWithConfirmation(
  "#new-confirmation-popup",
  handleConfirmationPopup,
);
const newDeletePopup = new PopupWithConfirmation(
  "#new-confirmation-popup",
  handleDeletePopup,
);

const propertiesData = StorageService.getProperties(Properties);

/*---------- Función callback para manejar el click en la imagen de la tarjeta ----------*/

const handleCardClick = (id, time) => {
  const publishedMax = StorageService.getMaxPublishedId();

  if (Number(id) > publishedMax) {
    alert(
      "Esta propiedad aún no está publicada.\n\n" +
        "Debes generar el preview y subirlo a GitHub dentro de la carpeta /previews para poder compartirla.",
    );
    return;
  } else {
    window.open(`./previews/propiedad${id}${time}_preview.html`, "_blank");
    // window.open(`https://sergiovv2025.github.io/fichas_tecnicas/previews/propiedad${id}${time}_preview.html`, "_blank");
  }
};

/*---------- Initial Properties en properties.js ----------*/

function renderCard(item) {
  const newCard = new Card(
    item,
    "#card-template",
    handleCardClick,
    newConfirmationPopup,
    newDeletePopup,
  );
  // const newCard = new Card(item, "#card-template");

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
    time: formData.time,
    theme: formData.theme,
    address: formData.address,
  };

  const card = new Card(
    newProperty,
    "#card-template",
    handleCardClick,
    newConfirmationPopup,
    newDeletePopup,
  );
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
  const previewIdMax = document.querySelector(".popup__input_type_property-id");
  const max = StorageService.getMaxId();
  if (max !== 0) {
    previewIdMax.setAttribute("max", max);
    newPreviewPopup.open();
  } else {
    alert("No hay propiedades registradas!");
  }
});

const newPreviewForm = document.forms["new-preview-form"];
const previewId = newPreviewForm.id;
const previewInputId = document.querySelector(".popup__input_type_property-id");
previewInputId.addEventListener("change", () => {
  recoverPropertyInfo(previewId.value);
});

function recoverPropertyInfo(id) {
  const currentProperty = StorageService.getProperty(id);

  if (!currentProperty) {
    alert("No se encontró información para ese ID");
    return;
  }

  const BASE_URL = "https://sergiovv2025.github.io/fichas_tecnicas/";

  document.querySelector(".popup__input_type_property-title").value =
    currentProperty.title;

  document.querySelector(".input__textarea-descriptionOG").value =
    currentProperty.description;

  const heroPath = currentProperty.hero || "";
  document.querySelector(".popup__input_type_imageOG").value =
    BASE_URL + (heroPath.startsWith("./") ? heroPath.slice(2) : heroPath);

  document.querySelector(".popup__input_type_urlProject").value = BASE_URL;

  document.querySelector(".popup__input_type_preview-price").value =
    currentProperty.price;

  document.querySelector(".popup__input_type_preview-features").value =
    Array.isArray(currentProperty.features)
      ? currentProperty.features.join("\n")
      : currentProperty.features;

  document.querySelector(".popup__input_type_preview-gallery").value =
    Array.isArray(currentProperty.gallery)
      ? currentProperty.gallery.join("\n")
      : "";

  document.querySelector(".popup__input_type_preview-time").value =
    currentProperty.time;

  document.querySelector(".popup__input_type_preview-theme").value =
    currentProperty.theme;

  document.querySelector(".popup__input_type_preview-address").value =
    currentProperty.address;
}

function handlePreviewFormSubmit(formData) {
  const previewData = {
    id: formData.id,
    title: formData.title,
    descriptionOG: formData.descriptionOG,
    imageOG: formData.imageOG,
    urlProject: formData.urlProject,
    price: formData.price,
    features: formData.features,
    gallery: formData.gallery,
    time: formData.time,
    theme: formData.theme,
    address: formData.address,
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

const importFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#new-import-form"),
);

const exportFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#new-export-form"),
);

/*--------- Habilitar validación -----------*/

cardFormValidator.enableValidation();
previewFormValiator.enableValidation();
importFormValidator.enableValidation();
exportFormValidator.enableValidation();

/*---------- Backup / Restore localStoreage ---------*/

const storageExport = document.querySelector(".nav__list-link__export");
storageExport.addEventListener("click", () => {
  newExportPopup.open();
});

const storeageImport = document.querySelector(".nav__list-link__import");
storeageImport.addEventListener("click", () => {
  newImportPopup.open();
});

function handleExportData() {
  const exportFileName = document.querySelector(
    ".popup__input_type_file-export",
  );

  const data = {
    properties: JSON.parse(localStorage.getItem("properties") || "[]"),
    publishedMaxId: Number(localStorage.getItem("publishedMaxId") || 0),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  // const fileName = prompt("Nombre del archivo:", "backup") || "backup";
  const fileName = exportFileName.value || "backup";
  a.download = `${fileName}.json`;

  a.click();

  URL.revokeObjectURL(url);
  newExportPopup.close();
}

function handleImportSubmit() {
  const fileInput = document.querySelector(".popup__input_type_file-import");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      if (Array.isArray(data.properties)) {
        localStorage.setItem("properties", JSON.stringify(data.properties));
      }

      if (typeof data.publishedMaxId === "number") {
        localStorage.setItem("publishedMaxId", String(data.publishedMaxId));
      }

      alert("Respaldo cargado correctamente");
      location.reload();
    } catch (err) {
      alert("Archivo inválido");
    }
  };

  reader.readAsText(file);
  newImportPopup.close();
}

function setFocus() {
  const cardListFocus = document.querySelector(".cards__list");
  const cardFocus = cardListFocus.lastElementChild;
  const cardFocusWhats = cardFocus.querySelector(".card__whatsapp-button");
  cardFocusWhats.focus();
}

setFocus();

/*----------- Confirmation Popup -----------*/

function handleConfirmationPopup(id, event, like, cardLikeButton, isLiked) {
  like(event, isLiked);
  newConfirmationPopup.close();
}

function handleDeletePopup(id, event, like, cardDeleteButton) {
  cardDeleteButton.closest(".card").remove();
  StorageService.deleteProperty(id);
}
