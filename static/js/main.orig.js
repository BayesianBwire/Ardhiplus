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
      const eyeSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" fill="currentColor"/></svg>';
      const eyeOffSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.97 10.97 0 0112 19c-7 0-11-7-11-7 1.63-2.78 4.12-4.95 7.02-5.95M3 3l18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      if (input.type === "password") {
        input.type = "text";
        button.innerHTML = eyeOffSvg;
      } else {
        input.type = "password";
        button.innerHTML = eyeSvg;
      }
    });
  });
}

// Theme (dark/light) helpers
function getStoredTheme() {
  return localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.79 1.8-1.78zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.03 2.04l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM20 11v2h3v-2h-3zM12 7a5 5 0 100 10 5 5 0 000-10zm4.24 12.16l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM4.83 19.78l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM11 23h2v-3h-2v3z" fill="currentColor"/></svg>';
  const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>';
  if (icon) {
    icon.innerHTML = theme === 'light' ? sunSvg : moonSvg;
  } else if (btn) {
    btn.innerHTML = theme === 'light' ? sunSvg : moonSvg;
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#16a34a');
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const current = document.body.classList.contains('light') ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
  applyTheme(getStoredTheme());
}

let marketplaceListings = [];

function parsePrice(price) {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

function parseCoords(value) {
  if (!value) {
    return { lat: 0.0, lng: 0.0 };
  }
  const parts = value.split(",").map((part) => part.trim());
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  if (parts.length === 2 && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    return { lat, lng };
  }
  return { lat: 0.0, lng: 0.0 };
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
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (!listings.length) {
    grid.innerHTML = `
      <div class="empty-state p-12 text-center text-slate-400">
        <p class="text-lg font-semibold">No marketplace listings are available right now.</p>
        <p class="mt-2 text-sm">Please check back later or submit a property to populate the marketplace.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = listings
    .map(
      (listing) => `
      <article class="card listing-card" data-id="${listing.id}">
        <p class="badge">${listing.badge}</p>
        <h3>${listing.title}</h3>
        <p>${listing.location}</p>
        <p class="listing-meta">${listing.size} ┬╖ ${listing.price} ┬╖ ${listing.type}</p>
        <p>${listing.description}</p>
        <div class="hero-actions">
          <button class="button button-outline view-detail-button" type="button" data-id="${listing.id}">View details</button>
          <a class="button button-primary" href="${isLoggedIn ? `/contact?listing=${encodeURIComponent(listing.title)}` : '/login'}">${isLoggedIn ? 'Request connection' : 'Login to request'}</a>
        </div>
      </article>
    `,
    )
    .join("");

  attachListingDetailListeners();
}

function renderMap(listings) {
  const mapGrid = document.querySelector("#map-grid");
  if (!mapGrid) return;

  if (!listings.length) {
    mapGrid.innerHTML = `
      <div class="map-empty p-12 text-center text-slate-400">
        <p class="text-sm">No map markers available until listings are added.</p>
      </div>
    `;
    return;
  }

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

function openListingDetail(listingId) {
  const listing = marketplaceListings.find((item) => item.id === listingId);
  const modal = document.querySelector('#listing-detail-modal');
  const content = document.querySelector('#listing-detail-modal-content');
  if (!listing || !modal || !content) return;

  content.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" type="button" aria-label="Close details">├ù</button>
      <div class="modal-card-body">
        <div>
          <p class="badge">${listing.badge}</p>
          <h2>${listing.title}</h2>
          <p class="text-slate-400">${listing.location}</p>
          <p class="listing-meta">${listing.size} ┬╖ ${listing.price} ┬╖ ${listing.type}</p>
          <p class="mt-4 text-slate-300">${listing.description}</p>
          <ul class="detail-list">
            <li><strong>Bedrooms:</strong> ${listing.bedrooms || 'N/A'}</li>
            <li><strong>Bathrooms:</strong> ${listing.bathrooms || 'N/A'}</li>
            <li><strong>Verified:</strong> ${listing.verified ? 'Yes' : 'Pending'}</li>
            <li><strong>Listed:</strong> ${listing.created_at || 'Unknown'}</li>
          </ul>
        </div>
        <div class="modal-actions">
          <a class="button button-primary" href="${localStorage.getItem('token') ? '/services' : '/login'}">${localStorage.getItem('token') ? 'Request survey' : 'Login to request'}</a>
          <button class="button button-outline close-modal-button" type="button">Close</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.querySelector('.modal-close')?.addEventListener('click', closeListingDetail);
  modal.querySelector('.close-modal-button')?.addEventListener('click', closeListingDetail);
}

function closeListingDetail() {
  const modal = document.querySelector('#listing-detail-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.querySelector('#listing-detail-modal-content').innerHTML = '';
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeListingDetail();
  }
});

function attachListingDetailListeners() {
  document.querySelectorAll('.view-detail-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = Number((event.currentTarget).getAttribute('data-id'));
      openListingDetail(id);
    });
  });
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
      // On successful login, store user data and token in localStorage for React components
      if (formId === "login-form") {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify({
          id: result.id,
          name: result.name,
          role: result.role,
          email: result.email
        }));
        const redirectUrl = result.role && (result.role === 'tech' ? "/tech" : ["admin", "superadmin"].includes(result.role) ? "/ardhimwenyewe" : "/dashboard");
        setTimeout(() => (window.location.href = redirectUrl), 500);
      } else if (formId === "register-form") {
        setTimeout(() => (window.location.href = "/login"), 2000);
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
        setTimeout(() => location.reload(), 800);
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
  setupThemeToggle();

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

  if (page === "post-property") {
    handleForm("post-property-form", "/api/post-listing", "#post-property-message", (formData) => ({
      title: formData.get("title"),
      location: formData.get("location"),
      type: formData.get("type"),
      size: formData.get("size"),
      price: formData.get("price"),
      description: formData.get("description"),
      seller_name: formData.get("seller_name"),
      seller_phone: formData.get("seller_phone"),
      coords: parseCoords(formData.get("coords")),
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

// Prevent pasting into password fields globally (disable copy-paste for passwords)
document.addEventListener('paste', function (e) {
  try {
    const tgt = e.target || e.srcElement;
    if (tgt && tgt.tagName === 'INPUT' && tgt.type === 'password') {
      e.preventDefault();
      // optional: inform the user
      const notice = 'Pasting into password fields is disabled for security.';
      if (typeof window !== 'undefined' && window.alert) {
        // use a non-intrusive toast in future; alert for now
        // but avoid spamming alerts if many paste events
        setTimeout(()=>alert(notice), 50);
      }
      return false;
    }
  } catch (err) {
    // ignore
  }
});
