import Popup from "./Popup.js";
import { cleanFormErrors } from "../utils/utils.js";

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._inputList = this._popup.querySelectorAll(".popup__input");
    this._form = this._popup.querySelector(".popup__form");
  }

  _setCardTime() {
    const date = new Date();
    const hour = date.getHours();
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const minute = date.getMinutes();
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
    const second = date.getSeconds();
    const formattedSecond = second < 10 ? `0${second}` : `${second}`;

    const fullTime = `${formattedHour}${formattedMinute}${formattedSecond}`;
    this._popup.querySelector(".popup__input_type_card-time").value = fullTime;
  }

  _getInputValues() {
    if (this._popup.querySelector(".popup__form").id === "new-card-form") {
      this._setCardTime();
    }
    const formData = {};
    this._inputList.forEach((input) => {
      if (input.name === "gallery") {
        const pattern = /[^,;:\n\t]+/g;
        const galleryArray = input.value.match(pattern);
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
        evt.stopPropagation();
        this._handleFormSubmit(this._getInputValues(), this._type);
      });
  }

  close() {
    cleanFormErrors(this._form);
    super.close();
    this._popup.querySelector(".popup__form").reset();
  }
}

export default PopupWithForm;
