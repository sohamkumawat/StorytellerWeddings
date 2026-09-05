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

  // Hero Image Carousel (Auto-rotates every 5 seconds with Arrow Navigation)
  const carouselTrack = document.getElementById("heroCarousel");
  if (carouselTrack) {
    const slides = carouselTrack.querySelectorAll(".carousel-slide");
    const prevBtn = document.getElementById("heroCarouselPrev");
    const nextBtn = document.getElementById("heroCarouselNext");
    let currentSlide = 0;
    let carouselTimer = null;

    if (slides.length > 0) {
      function updateSlideClasses() {
        slides.forEach((slide, idx) => {
          slide.classList.toggle("active", idx === currentSlide);
        });
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlideClasses();
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlideClasses();
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
  }

  // Back to Top Handler
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

