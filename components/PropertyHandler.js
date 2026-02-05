import Property from "./Property.js";
import Properties from "./Properties.js";

let property;
const btnConfig = {
  btnBack: ".property__image_btn-back",
  btnForward: ".property__image_btn-forward",
};

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const result = Properties.find((p) => p.id === id);

if (result) {
  property = new Property(Properties[id - 1], "#property__template", btnConfig);
  const HTML = property.generateHTML();
  property.renderHTML(HTML, ".property");
} else {
  property = new Property(Properties, "#property__template", btnConfig);
  property.handleError(".property__content-error");

  const btnVolverAProps = document.querySelector(".property__button-goback");
  btnVolverAProps.addEventListener("click", () => {
    location.href = "./index.html";
  });
}
