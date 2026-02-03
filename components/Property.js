import Properties from "./Properties.js";

const imageArray = [];
let i = 0;
const galleryImage = document.querySelector(".property__gallery-image");

function findId() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const property = Properties.find((p) => p.id === id);

  if (property) {
    displayHTML();
    setHTML(Properties[id - 1]);
  } else {
    handleError();
  }
}

function displayHTML() {
  document.querySelector(".property__hero-image").style.display = "block";
  document.querySelector(".property__cta-button").style.display = "block";
}

function setHTML(propertyElement) {
  const heroImage = document.querySelector(".property__hero-image");
  heroImage.setAttribute("src", propertyElement.hero);
  heroImage.setAttribute("alt", propertyElement.hero);

  const title = document.querySelector(".property__title");
  title.textContent = propertyElement.title;

  const price = document.querySelector(".property__price");
  price.textContent = propertyElement.price;

  const features = document.querySelector(".property__features-list");
  const pattern = /[^,.;:\n\t]+/g;
  const featuresArray = propertyElement.features.match(pattern);
  let featureElement, featureText;
  for (let feature of featuresArray) {
    featureElement = document.createElement("li");
    featureElement.className = "property__feature";
    featureText = document.createTextNode(feature);
    featureElement.append(featureText);
    features.appendChild(featureElement);
  }

  const comment = document.querySelector(".property__comment");
  comment.textContent = propertyElement.comment;

  for (i = 0; i < propertyElement.gallery.length; i++) {
    imageArray[i] = propertyElement.gallery[i];
  }

  i = 0;
  galleryImage.src = imageArray[i];
}

function handleError() {
  const contentError = document.querySelector(".property__content-error");
  contentError.style.display = "block";
  const errorTitle = document.querySelector(".property__content-title");
  errorTitle.textContent = "Propiedad no disponible";
  const errorText = document.querySelector(".property__content-text");
  errorText.textContent =
    "La propiedad que buscas no existe o ya no está publicada.";
  const propertyContent = document.querySelector(".property__content");
  propertyContent.style.display = "none";
  const propertyBackLink = document.querySelector(".property__back-link");
  propertyBackLink.style.display = "none";
}

function setEventlisteners() {
  const errorButton = document.querySelector(".property__button-goback");
  errorButton.textContent = "Volver a Propiedades";
  errorButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const goBackImageBtn = document.querySelector(".property__image_btn-back");
  goBackImageBtn.addEventListener("click", () => {
    i--;
    if (i >= 0) {
      galleryImage.src = imageArray[i];
    } else {
      i = imageArray.length - 1;
      galleryImage.src = imageArray[i];
    }
  });

  const goFwdImageBtn = document.querySelector(".property__image_btn-forward");
  goFwdImageBtn.addEventListener("click", () => {
    i++;
    if (i < imageArray.length) {
      galleryImage.src = imageArray[i];
    } else {
      i = 0;
      galleryImage.src = imageArray[i];
    }
  });
}

findId();
setEventlisteners();
