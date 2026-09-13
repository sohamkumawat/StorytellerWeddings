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
});

