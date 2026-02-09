/*---------- Limpia los errores de span e input de los formularios ----------*/

function cleanFormErrors(formElement) {
  const spanList = formElement.querySelectorAll(".popup__error_active");
  spanList.forEach((span) => {
    span.classList.remove("popup__error_active");
  });
  const inputList = formElement.querySelectorAll(".popup__input_error");
  inputList.forEach((input) => {
    input.classList.remove("popup__input_error");
  });
}

export { cleanFormErrors };
