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

const newEditPopup = new PopupWithForm("#new-card-popup", handleCardFormSubmit);

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
    handleEditClick,
  );

  const cardElement = newCard.generateCard();

  return cardElement;
}

const section = new Section(
  {
    items: propertiesData,
    renderer: renderCard,
  },
  ".cards__list",
);

section.renderItems();

/*---------- Popup Add Card ----------*/

const profileAddButton = document.querySelector(".nav__list-link__card");
profileAddButton.addEventListener("click", () => {
  const cardSubmitButton = document.forms["new-card-form"]["popup__button"];
  cardSubmitButton.textContent = "Crear";
  newCardPopup.open();
});

const saveCardForm = document.querySelector("#new-card-form");
function handleCardFormSubmit(formData) {
  if (currentEditingId) {
    const properties = StorageService.getProperties([]);

    const property = properties.find(
      (p) => Number(p.id) === Number(currentEditingId),
    );
    Object.assign(property, formData);

    StorageService.saveProperties(properties);
    location.reload();
  } else {
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
      isLiked: false,
    };
    const card = new Card(
      newProperty,
      "#card-template",
      handleCardClick,
      newConfirmationPopup,
      handleEditClick,
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

function fillForm(id, form) {
  let txt = "";
  const inputList = form.querySelectorAll(".popup__input");
  const inputListArray = [...inputList];
  const inputClassNames = inputListArray.map((input) => {
    txt = input.className.slice(13) + "*" + input.name + "\n";
    if (txt.startsWith("popup__select")) {
      txt = txt.slice(14);
    }
    if (txt.startsWith("popup__textarea")) {
      txt = txt.slice(16);
    }
    return txt;
  });

  const currentProperty = StorageService.getProperty(id);

  if (!currentProperty) {
    alert("No se encontró información para ese ID");
    return;
  }

  let currentPropEntries = [];
  for (let [prop, value] of Object.entries(currentProperty)) {
    currentPropEntries[prop] = value;
  }

  const BASE_URL = "https://sergiovv2025.github.io/fichas_tecnicas/";
  const heroPath = currentProperty.hero || "";
  let splitClassName = [],
    formInput,
    inputName,
    inputClass;
  inputClassNames.forEach((input) => {
    splitClassName = input.split("*");
    inputClass = "." + splitClassName[0].trim();
    inputName = splitClassName[1].trim();
    formInput = form.querySelector(inputClass);

    if (currentPropEntries[inputName] !== undefined) {
      formInput.value = currentPropEntries[inputName];
    }
    if (inputName === "features") {
      formInput.value = Array.isArray(currentPropEntries[inputName])
        ? currentPropEntries[inputName].join("\n")
        : currentPropEntries[inputName];
    }
    if (inputName === "gallery") {
      formInput.value = Array.isArray(currentPropEntries[inputName])
        ? currentPropEntries[inputName].join("\n")
        : "";
    }
    if (inputName === "descriptionOG") {
      formInput.value = currentPropEntries["description"];
    }
    if (inputName === "imageOG") {
      formInput.value =
        BASE_URL + (heroPath.startsWith("./") ? heroPath.slice(2) : heroPath);
    }
    if (inputName === "urlProject") {
      formInput.value = BASE_URL;
    }
  });
}

function recoverPropertyInfo(id) {
  fillForm(id, newPreviewForm);
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
        const normalized = data.properties.map((p) => ({
          ...p,
          isLiked: p.isLiked ?? false,
        }));

        localStorage.setItem("properties", JSON.stringify(normalized));
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

function handleConfirmationPopup(id, event, button, action) {
  if (action === "like") {
    event.target.classList.toggle("card__like-button_is-active");
    StorageService.toggleIsLiked(id);
  }

  if (action === "delete") {
    button.closest(".card").remove();
    StorageService.deleteProperty(id);
  }
}

/*------------- Edit Popup --------------*/

let currentEditingId;
function handleEditClick(data) {
  currentEditingId = data.id;
  const newCardForm = document.forms["new-card-form"];
  fillForm(currentEditingId, newCardForm);

  const editSubmitButton = document.forms["new-card-form"]["popup__button"];
  editSubmitButton.textContent = "Guardar";
  newEditPopup.open();
}
