import StorageService from "../components/StorageService.js";

function fillPreview(previewData) {
  const id = previewData.id.trim();
  const title = previewData.title.trim();
  const description = previewData.descriptionOG.trim();
  const image = previewData.imageOG.trim();
  const baseUrl = previewData.urlProject.trim();
  const price = previewData.price.trim();
  const theme = previewData.theme || "theme-classic";

  // Features puede venir como string o como array
  let featuresRaw = previewData.features;
  let featuresList = [];

  if (Array.isArray(featuresRaw)) {
    featuresList = featuresRaw;
  } else if (typeof featuresRaw === "string") {
    featuresList = featuresRaw.split(/[,.;:\n]/);
  }

  const gallery = previewData.gallery || [];

  if (!image.startsWith("https://")) {
    alert("La imagen debe ser una URL absoluta que inicie con https://");
    return;
  }

  if (!baseUrl.startsWith("https://")) {
    alert("La URL debe ser absoluta y que inicie con https://");
    return;
  }

  // Ahora el preview vive dentro de /previews/
  const previewUrl = `${baseUrl}previews/propiedad${id}_preview.html`;

  const featuresHtml = featuresList
    .map((f) => `<li class="property__feature">${f.trim()}</li>`)
    .join("");

  let galleryHtml = "";

  gallery.forEach((img) => {
    const absolutePath =
      "https://sergiovv2025.github.io/fichas_tecnicas/" + img.slice(2);

    galleryHtml += `<img class="property__gallery-image" src="${absolutePath}" alt="${img}" />`;
  });

  const htmlContent = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>${title}</title>

<link rel="stylesheet" href="../blocks/property.css" />

<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${previewUrl}" />
<meta property="og:type" content="website" />

</head>

<body class="${theme}">
  <main class="property">

    <section class="property__content">

      <div>
        <img class="property__hero-image" src="${image}" alt="${image}" />
      </div>

      <div>
        <h1 class="property__title">${title}</h1>
        <p class="property__price">${price}</p>
      </div>

      <div>
        <ul class="property__features-list">
          ${featuresHtml}
        </ul>
      </div>

      <div>
        <p class="property__description">${description}</p>
      </div>

      <div class="property__gallery">
        ${galleryHtml}
      </div>

      <div class="property__cta">
        <a class="property__cta-button" href="https://wa.me/521XXXXXXXXXX">
          Contactar por WhatsApp
        </a>
      </div>

    </section>

  </main>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const a = document.createElement("a");

  StorageService.setMaxPublishedId(id);

  a.href = URL.createObjectURL(blob);

  a.download = `propiedad${id}_preview.html`;
  a.click();
}

export { fillPreview };
