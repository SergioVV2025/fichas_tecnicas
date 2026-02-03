const form = document.getElementById("previewForm");
const result = document.getElementById("result");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = document.getElementById("id").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const image = document.getElementById("image").value.trim();
  const baseUrl = document.getElementById("baseUrl").value.trim();

  if (!image.startsWith("https://")) {
    alert("La imagen debe ser una URL absoluta que inicie con https://");
    return;
  }

  const previewUrl = `${baseUrl}propiedad${id}_preview.html`;
  const redirectUrl = `property.html?id=${id}`;

  const htmlContent = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />

<title>${title}</title>

<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${previewUrl}" />
<meta property="og:type" content="website" />

<meta http-equiv="refresh" content="0; url=${redirectUrl}" />
</head>
<body></body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = `propiedad${id}_preview.html`;
  a.click();

  result.hidden = false;
});
