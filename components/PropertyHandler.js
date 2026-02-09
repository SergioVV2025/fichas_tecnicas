import Property from "./Property.js";
import Properties from "./Properties.js";
import StorageService from "./StorageService.js";

let property;
const btnConfig = {
  btnBack: ".property__image_btn-back",
  btnForward: ".property__image_btn-forward",
};

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
alert(Properties.length + " - length de Properties en propertyHandler");
const result = StorageService.getProperties(Properties).find(
  (p) => p.id === id,
);

alert(result + "- id = " + id + " - result en propertyHandler");

if (result) {
  property = new Property(
    StorageService.getProperty(id),
    "#property__template",
    btnConfig,
  );
  const HTML = property.generateHTML();
  property.renderHTML(HTML, ".property");
} else {
  property = new Property(
    StorageService.getProperties,
    "#property__template",
    btnConfig,
  );
  property.handleError(".property__content-error");
  const btnVolverAProps = document.querySelector(".property__button-goback");
  btnVolverAProps.addEventListener("click", () => {
    // location.href = "./index.html";
    window.close();
  });
}
