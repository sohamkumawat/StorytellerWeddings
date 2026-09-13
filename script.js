// Storyteller Weddings - Studio Interactions & Theme Logic
const STUDIO_WHATSAPP_NUMBER = "919923768007";

document.addEventListener("DOMContentLoaded", () => {
  // Input Value State Sync Helper (Guarantees label floats when value is set)
  function syncInputState(inputEl) {
    if (!inputEl) return;
    if (inputEl.value && inputEl.value.trim() !== "") {
      inputEl.classList.add("has-value");
    } else {
      inputEl.classList.remove("has-value");
    }
  }

  document
    .querySelectorAll(".inputBox input, .inputBox select, .inputBox textarea")
    .forEach((el) => {
      syncInputState(el);
      el.addEventListener("input", () => syncInputState(el));
      el.addEventListener("change", () => syncInputState(el));
      el.addEventListener("blur", () => syncInputState(el));
    });

  // Custom Dropdown Logic
  const eventTypeDisplay = document.getElementById("eventTypeDisplay");
  const eventTypeSelect = document.getElementById("eventType");
  const eventTypeMenu = document.getElementById("eventTypeMenu");
  const dropdownArrow = document.querySelector(".dropdown-arrow");

  function closeDropdown() {
    if (eventTypeMenu) eventTypeMenu.style.display = "none";
    if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
  }

  if (eventTypeDisplay) {
    eventTypeDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      closeCalendar();
      const isOpen = eventTypeMenu && eventTypeMenu.style.display === "block";
      if (eventTypeMenu) eventTypeMenu.style.display = isOpen ? "none" : "block";
      if (dropdownArrow)
        dropdownArrow.style.transform = isOpen
          ? "rotate(0deg)"
          : "rotate(180deg)";
    });
  }

  document
    .querySelectorAll("#eventTypeMenu .dropdown-item")
    .forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const val = item.getAttribute("data-value");
        if (eventTypeSelect) eventTypeSelect.value = val;
        if (eventTypeDisplay) {
          eventTypeDisplay.value = val;
          syncInputState(eventTypeDisplay);
        }
        document
          .querySelectorAll("#eventTypeMenu .dropdown-item")
          .forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");
        closeDropdown();
      });
    });

  // Custom Calendar Date Picker Logic
  const eventDateDisplay = document.getElementById("eventDateDisplay");
  const eventDateInput = document.getElementById("eventDate");
  const calendarMenu = document.getElementById("calendarMenu");
  const calTitle = document.getElementById("calTitle");
  const calDays = document.getElementById("calDays");
  const calPrev = document.querySelector(".cal-prev");
  const calNext = document.querySelector(".cal-next");

  let currYear = new Date().getFullYear();
  let currMonth = new Date().getMonth();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function closeCalendar() {
    if (calendarMenu) calendarMenu.style.display = "none";
  }

  function renderCalendar(year, month) {
    if (!calTitle || !calDays) return;
    calTitle.textContent = `${months[month]} ${year}`;
    calDays.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "cal-day empty";
      calDays.appendChild(emptyCell);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayBtn = document.createElement("div");
      dayBtn.className = "cal-day";
      dayBtn.textContent = d;

      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateStr = `${year}-${mm}-${dd}`;

      if (eventDateInput && eventDateInput.value === dateStr) {
        dayBtn.classList.add("selected");
      }

      dayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (eventDateInput) eventDateInput.value = dateStr;

        const dateObj = new Date(year, month, d);
        const formatted = dateObj.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        if (eventDateDisplay) {
          eventDateDisplay.value = formatted;
          syncInputState(eventDateDisplay);
        }
        closeCalendar();
      });

      calDays.appendChild(dayBtn);
    }
  }

  if (eventDateDisplay) {
    eventDateDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      closeDropdown();
      const isOpen = calendarMenu && calendarMenu.style.display === "block";
      if (!isOpen) {
        renderCalendar(currYear, currMonth);
        if (calendarMenu) calendarMenu.style.display = "block";
      } else {
        closeCalendar();
      }
    });
  }

  if (calPrev) {
    calPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      currMonth--;
      if (currMonth < 0) {
        currMonth = 11;
        currYear--;
      }
      renderCalendar(currYear, currMonth);
    });
  }

  if (calNext) {
    calNext.addEventListener("click", (e) => {
      e.stopPropagation();
      currMonth++;
      if (currMonth > 11) {
        currMonth = 0;
        currYear++;
      }
      renderCalendar(currYear, currMonth);
    });
  }

  document.addEventListener("click", () => {
    closeDropdown();
    closeCalendar();
  });

  // WhatsApp Form Handler (Robust support for both Wedding & Corporate inquiries)
  function handleWhatsAppSubmit() {
    const name = (document.getElementById("clientName")?.value || document.getElementById("fullName")?.value || "").trim();
    const email = (document.getElementById("clientEmail")?.value || "").trim();
    const phone = (document.getElementById("clientPhone")?.value || document.getElementById("contactNumber")?.value || "").trim();
    const eventType = document.getElementById("eventType")?.value || "";
    const eventDate = document.getElementById("eventDate")?.value || document.getElementById("eventDateDisplay")?.value || "";
    const location = (document.getElementById("eventLocation")?.value || document.getElementById("city")?.value || "").trim();
    const details = (document.getElementById("eventDetails")?.value || document.getElementById("message")?.value || "").trim();

    if (!name || !phone) {
      alert("Please enter your name and phone/WhatsApp number.");
      return;
    }

    const isCorporate = window.location.href.includes("corporate");
    const heading = isCorporate ? "*New Corporate RFP / Commission Inquiry*" : "*New Wedding Photography Inquiry*";

    let message = `${heading}\n\n` +
      `*Name / Contact:* ${name}\n` +
      (email ? `*Email:* ${email}\n` : "") +
      `*Phone / WhatsApp:* ${phone}\n` +
      (eventType ? `*Event Type:* ${eventType}\n` : "") +
      (eventDate ? `*Event Date:* ${eventDate}\n` : "") +
      (location ? `*Venue / Location:* ${location}\n` : "") +
      (details ? `*Details & Vision:* ${details}\n` : "");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  }

  const submitWhatsappBtn = document.getElementById("submitWhatsapp");
  if (submitWhatsappBtn) {
    submitWhatsappBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleWhatsAppSubmit();
    });
  }

  const inquiryForm = document.getElementById("inquiryForm") || document.getElementById("inquiry-form");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleWhatsAppSubmit();
    });
  }

  // Hero Image Carousel (Auto-rotates with Randomized Images & Ultra-Smooth Crossfade)
  const carouselTrack = document.getElementById("heroCarousel");
  if (carouselTrack) {
    const prevBtn = document.getElementById("heroCarouselPrev");
    const nextBtn = document.getElementById("heroCarouselNext");

    // All 35 main carousel images
    const mainCarouselImages = Array.from(
      { length: 35 },
      (_, i) => `assets/main-carousel/MainCarousel${i + 1}.webp`
    );

    // Fisher-Yates Shuffle
    function shuffleArray(arr) {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    const randomizedImages = shuffleArray(mainCarouselImages);

    // Dynamically populate slides with randomized image order
    carouselTrack.innerHTML = "";
    randomizedImages.forEach((imgSrc, idx) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = `carousel-slide${idx === 0 ? " active" : ""}`;
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = `Storyteller Wedding Highlight ${idx + 1}`;
      img.loading = idx === 0 ? "eager" : "lazy";
      slideDiv.appendChild(img);
      carouselTrack.appendChild(slideDiv);
    });

    const slides = Array.from(carouselTrack.querySelectorAll(".carousel-slide"));
    let currentSlide = 0;
    let carouselTimer = null;
    let isTransitioning = false;

    function goToSlide(newIndex) {
      if (slides.length <= 1 || isTransitioning || newIndex === currentSlide) return;
      isTransitioning = true;

      const prevSlideEl = slides[currentSlide];
      const nextSlideEl = slides[newIndex];

      // Keep previous slide underneath during smooth crossfade
      slides.forEach((s) => s.classList.remove("last-active"));
      prevSlideEl.classList.add("last-active");
      prevSlideEl.classList.remove("active");

      // Fade in new slide on top layer
      nextSlideEl.classList.add("active");

      currentSlide = newIndex;

      setTimeout(() => {
        prevSlideEl.classList.remove("last-active");
        isTransitioning = false;
      }, 1450);
    }

    function nextSlide() {
      const nextIndex = (currentSlide + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    }

    function startCarouselTimer() {
      carouselTimer = setInterval(nextSlide, 5000);
    }

    function resetCarouselTimer() {
      if (carouselTimer) clearInterval(carouselTimer);
      startCarouselTimer();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        prevSlide();
        resetCarouselTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nextSlide();
        resetCarouselTimer();
      });
    }

    startCarouselTimer();
  }

  // Back to Top Handler
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Floating Mobile Navigation System ---
  function initMobileNavigation() {
    if (document.getElementById("mobileNavTrigger")) return;

    const path = window.location.pathname;
    const isWeddingsSub = path.includes("/weddings/");
    const isCorporateSub = path.includes("/corporate&events/") || path.includes("/corporate-events/");

    // Resolve exact relative URLs for requested menu destinations:
    // Home, Galleries, Testimonials, About, Enquire
    let homeUrl = "index.html";
    let galleriesUrl = "weddings/weddings-editorial.html";
    let testimonialsUrl = "weddings/weddings-home.html#testimonials";
    let aboutUrl = "about.html";
    let enquireUrl = "inquire.html";

    if (isWeddingsSub) {
      homeUrl = "weddings-home.html";
      galleriesUrl = "weddings-editorial.html";
      testimonialsUrl = "#testimonials";
      aboutUrl = "weddings-about.html";
      enquireUrl = "weddings-inquire.html";
    } else if (isCorporateSub) {
      homeUrl = "../index.html";
      galleriesUrl = "../weddings/weddings-editorial.html";
      testimonialsUrl = "../weddings/weddings-home.html#testimonials";
      aboutUrl = "corporate-about.html";
      enquireUrl = "corporate-inquire.html";
    }

    // Active state detection
    const isHomeActive = path.endsWith("index.html") || path.endsWith("landing-page.html") || path.endsWith("weddings-home.html") || path.endsWith("corporate-home.html") || path.endsWith("/");
    const isGalleriesActive = path.includes("editorial") || path.includes("galleries");
    const isTestimonialsActive = window.location.hash.includes("testimonials");
    const isAboutActive = path.includes("about");
    const isInquireActive = path.includes("inquire");

    // Find or create floating social bar on bottom right
    let socialBar = document.querySelector(".floating-social-bar");
    if (!socialBar) {
      socialBar = document.createElement("div");
      socialBar.className = "floating-social-bar";
      socialBar.setAttribute("aria-label", "Quick contact links");
      document.body.appendChild(socialBar);
    }

    // Create Trigger Button (Vertical M E N U stacked button, 2x height of single social)
    const triggerBtn = document.createElement("button");
    triggerBtn.id = "mobileNavTrigger";
    triggerBtn.type = "button";
    triggerBtn.setAttribute("aria-label", "Toggle Navigation Menu");
    triggerBtn.setAttribute("aria-expanded", "false");
    triggerBtn.innerHTML = `
      <div class="vertical-menu-text">
        <span>M</span>
        <span>E</span>
        <span>N</span>
        <span>U</span>
      </div>
    `;

    // Append trigger to social bar stack
    socialBar.appendChild(triggerBtn);

    // Create Square Light Theme Navigation Panel (Positioned Above)
    const navPanel = document.createElement("div");
    navPanel.id = "mobileNavPanel";
    navPanel.setAttribute("role", "navigation");
    navPanel.setAttribute("aria-label", "Mobile Floating Navigation");
    navPanel.innerHTML = `
      <ul class="mobile-nav-panel-links">
        <li><a href="${homeUrl}" class="${isHomeActive ? "active" : ""}">Home</a></li>
        <li><a href="${galleriesUrl}" class="${isGalleriesActive ? "active" : ""}">Galleries</a></li>
        <li><a href="${testimonialsUrl}" class="${isTestimonialsActive ? "active" : ""}">Testimonials</a></li>
        <li><a href="${aboutUrl}" class="${isAboutActive ? "active" : ""}">About</a></li>
        <li><a href="${enquireUrl}" class="btn-inquire-mobile ${isInquireActive ? "active" : ""}">Enquire</a></li>
      </ul>
    `;

    // Create Disconnected Light Theme Bottom Buttons Row ([ ✕ MENU ] [ WhatsApp ] [ Instagram ])
    const navBottomBar = document.createElement("div");
    navBottomBar.id = "mobileNavBottomBar";
    navBottomBar.setAttribute("aria-label", "Menu controls and socials");
    navBottomBar.innerHTML = `
      <button id="mobileNavCloseBtn" class="mobile-nav-close-btn" aria-label="Close Menu">
        <span class="close-x">&times;</span>
        <span class="close-text">MENU</span>
      </button>
      <a href="https://wa.me/919923768007" target="_blank" rel="noopener noreferrer" class="open-social-btn" aria-label="WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      </a>
      <a href="https://instagram.com/_storyteller.weddings_" target="_blank" rel="noopener noreferrer" class="open-social-btn" aria-label="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
        </svg>
      </a>
    `;

    document.body.appendChild(navPanel);
    document.body.appendChild(navBottomBar);

    const closeBtn = navBottomBar.querySelector("#mobileNavCloseBtn");

    function openNav() {
      socialBar.classList.add("is-hidden");
      navPanel.classList.add("is-open");
      navBottomBar.classList.add("is-open");
      triggerBtn.setAttribute("aria-expanded", "true");
    }

    function closeNav() {
      socialBar.classList.remove("is-hidden");
      navPanel.classList.remove("is-open");
      navBottomBar.classList.remove("is-open");
      triggerBtn.setAttribute("aria-expanded", "false");
    }

    function toggleNav(e) {
      if (e) e.stopPropagation();
      const isOpen = navPanel.classList.contains("is-open");
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    }

    triggerBtn.addEventListener("click", toggleNav);
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeNav();
      });
    }

    navPanel.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetLink = e.target.closest("a");
      if (targetLink) {
        closeNav();
      }
    });

    document.addEventListener("click", (e) => {
      if (!navPanel.contains(e.target) && !triggerBtn.contains(e.target) && !navBottomBar.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeNav();
      }
    });
  }

  initMobileNavigation();
});






