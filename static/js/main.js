function showMessage(selector, message, type = "info") {
  const element = document.querySelector(selector);
  if (!element) return;
  element.textContent = message;
  element.style.border = type === "error" ? "1px solid #f97316" : "1px solid #22c55e";
}

function validatePassword(password) {
  if (!password) return "Please enter a password.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (/^\d+$/.test(password)) return "Password cannot be numbers only.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/\d/.test(password)) return "Password must include at least one number.";
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return "Password must include at least one special character.";
  return null;
}

function setupPasswordToggles() {
  document.querySelectorAll(".password-toggle").forEach((button) => {
    const container = button.closest(".password-field");
    if (!container) return;
    const input = container.querySelector("input");
    if (!input) return;
    button.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
      } else {
        input.type = "password";
        button.textContent = "Show";
      }
    });
  });
}

let marketplaceListings = [];

function parsePrice(price) {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

function getSizeCategory(size) {
  if (size.includes("acre")) {
    const value = Number(size.replace(/[^0-9.]/g, ""));
    if (value < 1) return "small";
    if (value < 2) return "medium";
    return "large";
  }
  if (size.includes("sqm")) {
    const value = Number(size.replace(/[^0-9.]/g, ""));
    if (value < 600) return "small";
    if (value < 2000) return "medium";
    return "large";
  }
  return "all";
}

function renderListings(listings) {
  const grid = document.querySelector("#listings-grid");
  if (!grid) return;

  grid.innerHTML = listings
    .map(
      (listing) => `
      <article class="card">
        <p class="badge">${listing.badge}</p>
        <h3>${listing.title}</h3>
        <p>${listing.location}</p>
        <p class="listing-meta">${listing.size} · ${listing.price} · ${listing.type}</p>
        <p>${listing.description}</p>
        <div class="hero-actions">
          <a class="button button-outline" href="/contact?listing=${encodeURIComponent(listing.title)}">Request connection</a>
          <a class="button button-primary" href="/services">Request Survey</a>
        </div>
      </article>
    `,
    )
    .join("");
}

function renderMap(listings) {
  const mapGrid = document.querySelector("#map-grid");
  if (!mapGrid) return;

  const lats = listings.map((item) => item.coords.lat);
  const lngs = listings.map((item) => item.coords.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  mapGrid.innerHTML = listings
    .map((listing) => {
      const latPercent = ((listing.coords.lat - minLat) / (maxLat - minLat || 1)) * 80 + 10;
      const lngPercent = ((listing.coords.lng - minLng) / (maxLng - minLng || 1)) * 80 + 10;
      return `
        <div class="map-marker" style="top: ${100 - latPercent}%; left: ${lngPercent}%;">
          <span>${listing.title}</span>
        </div>
      `;
    })
    .join("");
}

function applyMarketplaceFilters() {
  const location = document.querySelector("#filter-location").value;
  const size = document.querySelector("#filter-size").value;
  const type = document.querySelector("#filter-type").value;
  const sortBy = document.querySelector("#sort-by").value;

  let results = [...marketplaceListings];

  if (location !== "all") {
    results = results.filter((item) => item.location === location);
  }
  if (type !== "all") {
    results = results.filter((item) => item.type === type);
  }
  if (size !== "all") {
    results = results.filter((item) => getSizeCategory(item.size) === size);
  }

  if (sortBy === "cheapest") {
    results.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortBy === "newest") {
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortBy === "verified") {
    results.sort((a, b) => Number(b.verified) - Number(a.verified));
  }

  const mapPanel = document.querySelector("#map-panel");
  const listPanel = document.querySelector("#listings-grid");
  if (mapPanel && !mapPanel.classList.contains("hidden")) {
    renderMap(results);
  }
  renderListings(results);
}

function populateMarketplaceFilters(listings) {
  const locationSelect = document.querySelector("#filter-location");
  const typeSelect = document.querySelector("#filter-type");
  if (!locationSelect || !typeSelect) return;

  const locations = Array.from(new Set(listings.map((item) => item.location))).sort();
  const types = Array.from(new Set(listings.map((item) => item.type))).sort();

  locationSelect.innerHTML = '<option value="all">All locations</option>' +
    locations.map((location) => `<option value="${location}">${location}</option>`).join("");
  typeSelect.innerHTML = '<option value="all">All types</option>' +
    types.map((type) => `<option value="${type}">${type}</option>`).join("");
}

async function loadListings() {
  const response = await fetch("/api/listings");
  marketplaceListings = await response.json();
  populateMarketplaceFilters(marketplaceListings);
  applyMarketplaceFilters();
  renderMap(marketplaceListings);
  return marketplaceListings;
}

async function handleForm(formId, apiPath, messageSelector, payloadMapper) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    if (formId === "register-form" || formId === "reset-form") {
      const passwordValue = formData.get("password") || formData.get("new_password");
      const confirmPassword = formData.get("confirm_password");
      const validationError = validatePassword(passwordValue);
      if (validationError) {
        showMessage(messageSelector, validationError, "error");
        return;
      }
      if (formId === "reset-form" && confirmPassword !== passwordValue) {
        showMessage(messageSelector, "Passwords do not match.", "error");
        return;
      }
    }

    const payload = payloadMapper(formData);

    const headers = {"Content-Type": "application/json"};
    if (window && window.CSRF_TOKEN) headers["X-CSRF-Token"] = window.CSRF_TOKEN;

    const response = await fetch(apiPath, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });

    const result = await response.json();
    showMessage(messageSelector, result.message, response.ok ? "success" : "error");

    if (response.ok) {
      if (formId === "register-form" || formId === "connection-form") {
        form.reset();
      }
      // On successful login or register, reload to pick up session and welcome name
      if (formId === "login-form" || formId === "register-form") {
        setTimeout(() => (window.location.href = "/"), 500);
      }
    }
  });
}

async function attachAdminActions() {
  const buttons = document.querySelectorAll(".verify-button");
  const message = "#admin-message";

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const listingId = Number(button.dataset.id);
      const response = await fetch("/api/verify-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });

      const result = await response.json();
      showMessage(message, result.message, response.ok ? "success" : "error");
      if (response.ok) {
        button.textContent = "Verified";
        button.disabled = true;
      }
    });
  });
}

async function attachConnectActions() {
  const buttons = document.querySelectorAll(".connect-button");
  const message = "#admin-message";

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const requestId = Number(button.dataset.id);
      const response = await fetch("/api/connect-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId }),
      });
      const result = await response.json();
      showMessage(message, result.message, response.ok ? "success" : "error");
      if (response.ok) {
        button.textContent = "Connected";
        button.disabled = true;
      }
    });
  });
}

function init() {
  const page = document.body.dataset.page;
  setupPasswordToggles();

  if (page === "listings") {
    loadListings().then(() => {
      const filterControls = ["#filter-location", "#filter-size", "#filter-type", "#sort-by"];
      filterControls.forEach((selector) => {
        const control = document.querySelector(selector);
        if (control) {
          control.addEventListener("change", applyMarketplaceFilters);
        }
      });

      const viewList = document.querySelector("#view-list");
      const viewMap = document.querySelector("#view-map");
      const mapPanel = document.querySelector("#map-panel");
      const listPanel = document.querySelector("#listings-grid");

      if (viewList && viewMap && mapPanel && listPanel) {
        viewList.addEventListener("click", () => {
          viewList.classList.add("active");
          viewMap.classList.remove("active");
          mapPanel.classList.add("hidden");
          listPanel.classList.remove("hidden");
        });
        viewMap.addEventListener("click", () => {
          viewMap.classList.add("active");
          viewList.classList.remove("active");
          listPanel.classList.add("hidden");
          mapPanel.classList.remove("hidden");
          renderMap(marketplaceListings);
        });
      }
    });
  }

  if (page === "services") {
    handleForm("survey-form", "/api/survey-request", "#survey-message", (formData) => ({
      property_title: formData.get("property_title"),
      owner_name: formData.get("owner_name"),
      email: formData.get("email"),
      location: formData.get("location"),
    }));
  }

  if (page === "contact") {
    const searchParams = new URLSearchParams(window.location.search);
    const listingTitle = searchParams.get("listing");
    const titleInput = document.querySelector("input[name='property_title']");
    if (titleInput && listingTitle) {
      titleInput.value = listingTitle;
    }
    handleForm("connection-form", "/api/interest-request", "#contact-message", (formData) => ({
      property_title: formData.get("property_title"),
      buyer_name: formData.get("buyer_name"),
      buyer_email: formData.get("buyer_email"),
      buyer_phone: formData.get("buyer_phone"),
      message: formData.get("message"),
    }));
  }

  if (page === "login") {
    handleForm("login-form", "/api/login", "#login-message", (formData) => ({
      email: formData.get("email"),
      password: formData.get("password"),
    }));
  }

  if (page === "register") {
    handleForm("register-form", "/api/register", "#register-message", (formData) => ({
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
    }));
  }

  if (page === "forgot") {
    handleForm("forgot-form", "/api/forgot-password", "#forgot-message", (formData) => ({
      email: formData.get("email"),
    }));
  }

  if (page === "reset") {
    handleForm("reset-form", "/api/reset-password", "#reset-message", (formData) => ({
      token: formData.get("token"),
      new_password: formData.get("new_password"),
    }));
  }

  if (page === "admin") {
    attachAdminActions();
    attachConnectActions();
  }
}

document.addEventListener("DOMContentLoaded", init);
