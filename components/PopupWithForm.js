import Popup from "./Popup.js";
import { cleanFormErrors } from "../utils/utils.js";

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._inputList = this._popup.querySelectorAll(".popup__input");
    this._form = this._popup.querySelector(".popup__form");
  }

  _getInputValues() {
    const formData = {};
    this._inputList.forEach((input) => {
      if (input.name === "gallery") {
        // alert(input.name);
        const pattern = /[^,;:\n]+/g;
        const galleryArray = input.value.match(pattern);
        // for (let image of galleryArray) {
        //   alert(image);
        // }
        formData[input.name] = galleryArray;
      } else {
        formData[input.name] = input.value;
      }
    });
    return formData;
  }

  // Se llama porque hay un nuevo evento que gestionar
  // En caso de no llamar this.setEventListeners() en la clase padre, se agregaría super.setEventListeners(); aquí
  setEventListeners() {
    super.setEventListeners();
    this._popup
      .querySelector(".popup__form")
      .addEventListener("submit", (evt) => {
        evt.preventDefault();
        this._handleFormSubmit(this._getInputValues());
      });
  }

  close() {
    cleanFormErrors(this._form);
    super.close();
    this._popup.querySelector(".popup__form").reset();
  }
}

export default PopupWithForm;
