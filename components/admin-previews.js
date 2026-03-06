import StorageService from "../components/StorageService.js";

function fillPreview(previewData) {
  const id = previewData.id.trim();
  const title = previewData.title.trim();
  const description = previewData.descriptionOG.trim();
  const image = previewData.imageOG.trim();
  const baseUrl = previewData.urlProject.trim();
  const price = previewData.price.trim();
  const time = previewData.time.trim();
  const theme = previewData.theme.trim() || "theme-classic";
  const address = previewData.address.trim();

  // Features puede venir como string o como array
  let featuresRaw = previewData.features;
  let featuresList = [];

  if (Array.isArray(featuresRaw)) {
    featuresList = featuresRaw;
  } else if (typeof featuresRaw === "string") {
    featuresList = featuresRaw.split(/[\n]/);
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
  const previewUrl = `${baseUrl}previews/propiedad${id}${time}_preview.html`;

  const featuresHtml = featuresList
    .map((f) => `<li class="property__feature">${f.trim()}</li>`)
    .join("");

  const absoluteGallery = gallery.map((img) => {
    const absolutePath = baseUrl + img.slice(2);
    return absolutePath;
  });

  function getMapLink() {
    return `"https://www.google.com/maps?q=${encodeURIComponent(address)}"`;
  }
  const mapLink = getMapLink();

  function getAgentBlock(showAgent) {
    if (!showAgent) return "";

    return `
  <div class="property__cta">
    <a class="property__cta-button" href="https://wa.me/5215522425840?text=${encodeURIComponent(`Hola, estoy interesado en la propiedad "${title}".\n¿Podrías darme más información?`)}" target="_blank  ">
      Contactar por WhatsApp
    </a>
  </div>
  <div class="property__agent">
    <div class="property__agent-broker">&nbsp;Carolina Guerrero</div>
    <div class="property__agent-phone">
      <a class="property__agent-number" href="tel:5522425840">&nbsp;55 2242 5840</a>
    </div>
  </div>
  `;
  }

  function generateHTML(showAgent) {
    return `<!doctype html>
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
        <img class="property__hero-image" src="${image}" alt="${title}" />
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

      <div class="property__image-gallery">
        <img class="property__image" src="${absoluteGallery[0]}" alt="${title}">
        <button class="property__btn property__btn-left" id="btnBack">
          <img class="property__btn_image" src="${baseUrl}images/arrow_back.png" alt="Left arrow">
        </button>
        <button class="property__btn property__btn-right" id="btnForward">
          <img class="property__btn_image" src="${baseUrl}images/arrow_forward.png" alt="Right arrow">
        </button>
      </div>
      <div class="property__counter" id="imageCounter">
        1 / 1
      </div>
        ${getAgentBlock(showAgent)}
      <div>
      <p class="property__location-label">${address}</p>
        <a
        href=${mapLink}
        target="_blank"
        class="property__map-link"
        >
          Ir a ubicación &rarr;
        </a>
      </div>
    </section>

  </main>
<script>
  (function () {
    const images = ${JSON.stringify(absoluteGallery)};
    let currentIndex = 0;

    const img = document.querySelector(".property__image");
    const btnBack = document.getElementById("btnBack");
    const btnForward = document.getElementById("btnForward");
    const counter = document.getElementById("imageCounter");

    if (!img || !btnBack || !btnForward || images.length === 0) return;

    function updateSlider() {
      img.src = images[currentIndex];

      if (counter) {
        counter.textContent = (currentIndex + 1) + " / " + images.length;
      }
    }

    // 🔹 render inicial
    updateSlider();

    btnForward.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateSlider();
    });

    btnBack.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 1 + images.length) % images.length;
      updateSlider();
    });
  })();

</script>

</body>
</html>`;
  }

  StorageService.setMaxPublishedId(id);

  const htmlWithAgent = generateHTML(true);
  const htmlWithoutAgent = generateHTML(false);

  downloadHTML(`propiedad${id}${time}_preview.html`, htmlWithAgent);
  setTimeout(() => {
    downloadHTML(`propiedad${id}${time}_preview_SNT.html`, htmlWithoutAgent);
  }, 800);
}

function downloadHTML(filename, content) {
  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export { fillPreview };
