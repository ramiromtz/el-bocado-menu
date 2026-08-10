const categoryOrder = ["Hamburguesas", "Snacks", "Bebidas", "Papas"];
const menuContent = document.querySelector("#menu-content");
const categoryNav = document.querySelector("#category-nav");
let imageObserver;

const slugify = (value) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const formatPrice = (price) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(price);

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = `product-card${product.available ? "" : " unavailable"}`;

  const media = document.createElement("div");
  media.className = "product-image";

  const image = document.createElement("img");
  image.dataset.src = product.image;
  image.alt = product.alt;
  image.className = "lazy-image";
  image.width = 1200;
  image.height = 868;
  image.decoding = "async";
  image.addEventListener("load", () => image.classList.add("is-loaded"));
  image.addEventListener("error", () => media.classList.add("is-error"));
  media.append(image);

  const fallback = document.createElement("span");
  fallback.className = "image-fallback";
  fallback.setAttribute("aria-hidden", "true");
  fallback.textContent = "EB";
  media.append(fallback);

  if (product.badge) {
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    media.append(badge);
  }

  const info = document.createElement("div");
  info.className = "product-info";
  const nameBox = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "product-name";
  title.textContent = product.name;
  nameBox.append(title);

  if (Array.isArray(product.topics) && product.topics.length) {
    const topics = document.createElement("ul");
    topics.className = "product-topics";
    topics.setAttribute("aria-label", `Ingredientes de ${product.name}`);
    product.topics.forEach((topic) => {
      const item = document.createElement("li");
      item.textContent = topic;
      topics.append(item);
    });
    nameBox.append(topics);
  }

  if (Array.isArray(product.variants) && product.variants.length) {
    const variantsId = `variants-${product.id}`;
    const toggle = document.createElement("button");
    toggle.className = "variants-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", variantsId);
    toggle.innerHTML = `Ver sabores <span aria-hidden="true">+</span>`;

    const panel = document.createElement("div");
    panel.className = "variants-panel";
    panel.id = variantsId;
    panel.hidden = true;

    const label = document.createElement("p");
    label.className = "variants-label";
    label.textContent = product.variantLabel || "Sabores disponibles";

    const list = document.createElement("ul");
    list.className = "variants-list";
    product.variants.forEach((variant) => {
      const item = document.createElement("li");
      item.textContent = variant;
      list.append(item);
    });
    panel.append(label, list);

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.innerHTML = `${isOpen ? "Ver sabores" : "Ocultar sabores"} <span aria-hidden="true">${isOpen ? "+" : "−"}</span>`;
      panel.hidden = isOpen;
    });

    nameBox.append(toggle, panel);
  }

  if (!product.available) {
    const status = document.createElement("p");
    status.className = "product-status";
    status.textContent = "Muy pronto en nuestro menú";
    nameBox.append(status);
  }
  info.append(nameBox);

  const price = document.createElement("span");
  price.className = "product-price";
  price.innerHTML = product.price === null ? "—" : `${formatPrice(product.price)}<small>MXN</small>`;
  info.append(price);

  article.append(media, info);
  return article;
}

function loadImage(image) {
  if (!image.dataset.src) return;
  image.src = image.dataset.src;
  delete image.dataset.src;
}

function observeProductImages() {
  const images = document.querySelectorAll("img[data-src]");

  if (!("IntersectionObserver" in window)) {
    images.forEach(loadImage);
    return;
  }

  imageObserver?.disconnect();
  imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadImage(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "250px 0px", threshold: 0.01 });

  images.forEach((image) => imageObserver.observe(image));
}

function renderMenu(products) {
  const categories = categoryOrder.filter((category) => products.some((product) => product.category === category));
  categoryNav.replaceChildren(...categories.map((category) => {
    const link = document.createElement("a");
    link.className = "category-link";
    link.href = `#${slugify(category)}`;
    link.textContent = category;
    return link;
  }));

  const sections = categories.map((category) => {
    const section = document.createElement("section");
    section.className = "category-block";
    section.id = slugify(category);
    const heading = document.createElement("h3");
    heading.className = "category-title";
    heading.textContent = category;
    const grid = document.createElement("div");
    grid.className = "product-grid";
    products.filter((product) => product.category === category).forEach((product) => grid.append(createProductCard(product)));
    section.append(heading, grid);
    return section;
  });

  menuContent.replaceChildren(...sections);
  menuContent.setAttribute("aria-busy", "false");
  observeProductImages();
}

function renderError() {
  menuContent.innerHTML = `<div class="error-state"><strong>No pudimos cargar el menú.</strong><p>Actualiza la página en un momento o comunícate con nosotros para consultar los productos.</p></div>`;
  menuContent.setAttribute("aria-busy", "false");
}

async function loadMenu() {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();
    if (!Array.isArray(products) || products.length === 0) throw new Error("Catálogo vacío");
    renderMenu(products);
  } catch (error) {
    console.error("No fue posible cargar products.json:", error);
    renderError();
  }
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
loadMenu();
