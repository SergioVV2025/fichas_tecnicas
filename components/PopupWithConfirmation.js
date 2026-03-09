import Popup from "./Popup.js";

class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
  }

  open(id, evt, button, action) {
    this._popup.classList.add("popup_is-opened");
    document.addEventListener("keydown", this._handleEscClose);
    this._id = id;
    this._evt = evt;
    this._button = button;
    this._action = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._popup
      .querySelector(".popup__form")
      .addEventListener("submit", (evt) => {
        evt.preventDefault();
        this._handleFormSubmit(this._id, this._evt, this._button, this._action);
        super.close();
      });
  }
}

export default PopupWithConfirmation;
