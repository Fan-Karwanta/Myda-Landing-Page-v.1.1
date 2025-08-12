/**
 * @copyright 2025 myda
 * @license Apache-2.0
 */

'use strict';

// add event on multiple elements
const addEventOnElem = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

const $header = document.querySelector('[data-header]');
const $navbar = document.querySelector('[data-navbar]');
const $navToggler = document.querySelectorAll('[data-nav-toggler]');
const $overlay = document.querySelector('[data-overlay]');
const $dropdownToggler = document.querySelector('[data-dropdown-toggler]');
const $dropdown = document.querySelector('[data-dropdown]');
const $cartToggler = document.querySelector('[data-cart-toggler]');
const $cartModal = document.querySelector('[data-cart-modal]');

const toggleNavbar = function () {
  $navbar.classList.toggle('active');
  $overlay.classList.toggle('active');
  document.body.classList.toggle('active');
}

addEventOnElem($navToggler, 'click', toggleNavbar);

// Close mobile navbar when clicking on navigation links
const $navbarLinks = document.querySelectorAll('.navbar-link');
const closeNavbar = function () {
  $navbar.classList.remove('active');
  $overlay.classList.remove('active');
  document.body.classList.remove('active');
}

// Add click event to all navbar links to close mobile menu
addEventOnElem($navbarLinks, 'click', closeNavbar);

// element toggle function
const toggleElem = function (elem) {
  elem.classList.toggle('active');
}

// toggle dropdown
// toggle dropdown (guard if missing on some pages)
if ($dropdownToggler && $dropdown) {
  $dropdownToggler.addEventListener('click', function () {
    toggleElem($dropdown);
  });
}

// toggle cart (guard if missing on some pages)
if ($cartToggler && $cartModal) {
  $cartToggler.addEventListener('click', function () {
    toggleElem($cartModal);
  });
}

// header active when windows scrollY 50px
const activeHeader = function () {
  window.scrollY > 50 ? $header.classList.add('active') : $header.classList.remove('active');
}

window.addEventListener('scroll', activeHeader);

// Custom slider

const $sliderContainers = document.querySelectorAll('[data-slider-container]');

function sliderInitial($sliderContainer) {
  const $slider = $sliderContainer.querySelector('[data-slider]');
  const $prevBtn = $sliderContainer.querySelector('[data-prev-btn]');
  const $nextBtn = $sliderContainer.querySelector('[data-next-btn]');

  function nextSlide() {
    $slider.appendChild($slider.firstElementChild);
  }
  $nextBtn.addEventListener('click', nextSlide);

  function prevSlide() {
    $slider.prepend($slider.lastElementChild);
  }
  $prevBtn.addEventListener('click', prevSlide);

  let autoSlideIntervalId;

  function autoSlide() {
    autoSlideIntervalId = setInterval(function () {
      nextSlide();
    }, 2000);
  }

  autoSlide();

  function deleteAutoSliding() {
    clearInterval(autoSlideIntervalId);
  }

  // Stop auto sliding when mouseover
  $slider.addEventListener('mouseover', deleteAutoSliding);
  $prevBtn.addEventListener('mouseover', deleteAutoSliding);
  $nextBtn.addEventListener('mouseover', deleteAutoSliding);

  // Resume auto sliding when mouseout
  $slider.addEventListener('mouseout', autoSlide);
  $prevBtn.addEventListener('mouseout', autoSlide);
  $nextBtn.addEventListener('mouseout', autoSlide);
}

for (let i = 0; i < $sliderContainers.length; i++) {
  sliderInitial($sliderContainers[i]);
}

/**
 * Therapist-specific Booking Calendar (inline per card)
 * - Summons a collapsible calendar + time selector for the clicked card
 * - Modern styling handled via page-specific CSS in therapist.html
 */
(function initTherapistBooking() {
  const cards = document.querySelectorAll('.therapist-card');
  if (!cards.length) return; // Only on therapist page

  // Close any open panel
  function closeAllPanels() {
    document.querySelectorAll('.booking-panel-wrap.open').forEach((wrap) => {
      wrap.classList.remove('open');
      wrap.innerHTML = '';
    });
  }

  // Show a thank-you modal overlay and navigate home on action
  function showThankYouModal({ therapistName, dateStr, timeStr }) {
    const overlay = document.createElement('div');
    overlay.className = 'thanks-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="thanks-modal">
        <div class="confetti" aria-hidden="true"></div>
        <img src="./assets/images-new/MYDA_LOGO.png" alt="MYDA" class="thanks-logo" />
        <h3 class="thanks-heading">Thank you!</h3>
        <p class="thanks-text">Your booking request for <strong>${therapistName}</strong><br>on <strong>${dateStr}</strong> at <strong>${timeStr}</strong> has been received.</p>
        <button type="button" class="thanks-home-btn">Back to home</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Build a simple confetti burst
    const colors = ['#b38b40', '#c8a563', '#f5efe2', '#ffffff', '#4f3120'];
    const confetti = overlay.querySelector('.confetti');
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 0.8) + 's';
      s.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      s.style.backgroundColor = colors[i % colors.length];
      confetti.appendChild(s);
    }

    const homeBtn = overlay.querySelector('.thanks-home-btn');
    homeBtn.addEventListener('click', () => {
      // Clear booking UIs and go home
      closeAllPanels();
      overlay.remove();
      document.body.style.overflow = '';
      window.location.href = 'index.html#home';
    });
  }

  // Render calendar into a host element
  function mountBookingUI(host, therapistName) {
    host.innerHTML = `
      <div class="booking-panel" role="region" aria-label="Booking panel">
        <div class="booking-header">
          <div class="booking-title">Book with <strong>${therapistName}</strong></div>
          <button class="booking-close" type="button" aria-label="Close">
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </div>

        <div class="booking-body">
          <div class="date-header">
            <button class="date-nav prev" type="button" aria-label="Previous month">
              <ion-icon name="chevron-back-outline" aria-hidden="true"></ion-icon>
            </button>
            <div class="month-label" aria-live="polite"></div>
            <button class="date-nav next" type="button" aria-label="Next month">
              <ion-icon name="chevron-forward-outline" aria-hidden="true"></ion-icon>
            </button>
          </div>
          <div class="date-grid" role="grid" aria-label="Calendar">
            <div class="day-name" role="columnheader">Sun</div>
            <div class="day-name" role="columnheader">Mon</div>
            <div class="day-name" role="columnheader">Tue</div>
            <div class="day-name" role="columnheader">Wed</div>
            <div class="day-name" role="columnheader">Thu</div>
            <div class="day-name" role="columnheader">Fri</div>
            <div class="day-name" role="columnheader">Sat</div>
            <!-- Days will be injected here -->
          </div>

          <div class="time-section">
            <div class="time-title">Select a time</div>
            <div class="time-grid" role="list"></div>
          </div>
        </div>

        <div class="booking-actions">
          <div class="selection-display" aria-live="polite"></div>
          <button class="booking-confirm" type="button" disabled>Confirm booking</button>
        </div>
      </div>
    `;

    // State
    const today = new Date();
    const viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = null;
    let selectedTime = null;

    // Elements
    const closeBtn = host.querySelector('.booking-close');
    const prevBtn = host.querySelector('.date-nav.prev');
    const nextBtn = host.querySelector('.date-nav.next');
    const monthLabel = host.querySelector('.month-label');
    const grid = host.querySelector('.date-grid');
    const timeGrid = host.querySelector('.time-grid');
    const confirmBtn = host.querySelector('.booking-confirm');
    const selectionDisplay = host.querySelector('.selection-display');

    // Time slots (adjust as needed)
    const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

    function pad(n) { return n.toString().padStart(2, '0'); }

    function updateSelectionDisplay() {
      if (selectedDate && selectedTime) {
        const d = selectedDate;
        const nice = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} at ${selectedTime}`;
        selectionDisplay.textContent = `Selected: ${nice}`;
        confirmBtn.disabled = false;
      } else {
        selectionDisplay.textContent = '';
        confirmBtn.disabled = true;
      }
    }

    function renderTimeSlots() {
      timeGrid.innerHTML = '';
      timeSlots.forEach((t) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-slot';
        btn.textContent = t;
        btn.addEventListener('click', () => {
          timeGrid.querySelectorAll('.time-slot.selected').forEach((x) => x.classList.remove('selected'));
          btn.classList.add('selected');
          selectedTime = t;
          updateSelectionDisplay();
        });
        timeGrid.appendChild(btn);
      });
    }

    function renderCalendar() {
      // Update month label
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      monthLabel.textContent = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

      // Remove prior day cells (keep first 7 header items)
      grid.querySelectorAll('.date-cell').forEach((n) => n.remove());

      const firstDayIndex = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
      const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

      // Leading blanks
      for (let i = 0; i < firstDayIndex; i++) {
        const blank = document.createElement('div');
        blank.className = 'date-cell disabled';
        blank.setAttribute('aria-hidden', 'true');
        grid.appendChild(blank);
      }

      // Day cells
      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'date-cell';
        btn.textContent = d;

        // Disable past dates
        const isPast = cellDate.setHours(0,0,0,0) < today.setHours(0,0,0,0);
        if (isPast) {
          btn.classList.add('disabled');
          btn.disabled = true;
        }

        btn.addEventListener('click', () => {
          grid.querySelectorAll('.date-cell.selected').forEach((x) => x.classList.remove('selected'));
          btn.classList.add('selected');
          selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
          updateSelectionDisplay();
        });

        grid.appendChild(btn);
      }
    }

    prevBtn.addEventListener('click', () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      renderCalendar();
    });

    closeBtn.addEventListener('click', () => {
      host.classList.remove('open');
      host.innerHTML = '';
    });

    confirmBtn.addEventListener('click', () => {
      if (!(selectedDate && selectedTime)) return;
      const pad2 = (n) => n.toString().padStart(2, '0');
      const dateStr = `${selectedDate.getFullYear()}-${pad2(selectedDate.getMonth() + 1)}-${pad2(selectedDate.getDate())}`;
      showThankYouModal({ therapistName, dateStr, timeStr: selectedTime });
    });

    renderCalendar();
    renderTimeSlots();
    updateSelectionDisplay();
  }

  cards.forEach((card) => {
    const btn = card.querySelector('.card-links .book-now');
    const host = card.querySelector('[data-booking-panel]');
    if (!btn || !host) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const therapistName = card.querySelector('.t-name')?.textContent?.trim() || 'Therapist';

      // Toggle current; close others first
      const alreadyOpen = host.classList.contains('open');
      closeAllPanels();
      if (alreadyOpen) return; // just closed

      // Open and mount
      host.classList.add('open');
      mountBookingUI(host, therapistName);
      // Scroll into view for better UX on mobile
      host.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();

// Massage Modal System
const massageServices = {
  'Relaxation Massage': {
    image: './assets/images-new/massage_types/26.webp',
    description: 'Long flowing strokes to calm your nerves and ease everyday stress. Using gentle, rhythmic movements and calming aromatherapy, this treatment promotes relaxation, reduces anxiety, and encourages uninterrupted sleep. Perfect for unwinding before bed or resetting after restless nights.'
  },
  'Postnatal Massage': {
    image: './assets/images-new/massage_types/postnatal_massage_bellamama.jpg.webp',
    description: 'Gentle touch to restore, rebalance, and relieve tension after childbirth. You gave life—now let your body heal.'
  },
  'Slimming Lymphatic Combo Massage': {
    image: './assets/images-new/massage_types/iStock-520413044.jpg',
    description: 'A sculpting blend of firm strokes and drainage to tone and flush toxins. Using targeted pressure and lymphatic drainage techniques, this treatment helps contour the body, break down stubborn areas, and boost circulation for a lighter, more energized feeling.'
  },
  'Slimming Massage': {
    image: './assets/images-new/massage_types/dsc6089-15399456973578_920x920_tt_90.jpg',
    description: 'Targeted pressure to contour, break down fat, and boost circulation. This intensive treatment uses specialized techniques to help sculpt and tone problem areas while improving overall body confidence and wellness.'
  },
  'Detox Massage': {
    image: './assets/images-new/massage_types/detox-massage-therapy-1.jpg',
    description: 'Gentle rhythmic movements to cleanse your system and boost immunity. Using specialized drainage techniques and detoxifying oils, this treatment helps eliminate toxins, reduce bloating, and restore your body\'s natural balance.'
  },
  'Lymphatic Drainage': {
    image: './assets/images-new/massage_types/legs-sports-massage-therapy-2021-08-26-16-53-49-utc.webp',
    description: 'Gentle rhythmic movements to cleanse your system and boost immunity. This specialized technique helps reduce swelling, improve circulation, and support your body\'s natural detoxification process for optimal wellness.'
  },
  'Sleep Massage': {
    image: './assets/images-new/massage_types/hero-1.jpg',
    description: 'A deeply soothing, slow-pressure massage designed to quiet the nervous system and guide the body into a state of deep rest. Using gentle, rhythmic strokes and calming aromatherapy, this treatment promotes relaxation, reduces anxiety, and encourages uninterrupted sleep. Perfect for unwinding before bed or resetting after restless nights.'
  },
  'Hot Stone Massage': {
    image: './assets/images-new/massage_types/hot-stone-massage-in-dubai-DWS.jpg',
    description: 'Warm stones melt muscle tension and ground your energy. The heated stones penetrate deep into muscles, releasing chronic tension while the therapeutic heat promotes profound relaxation and stress relief.'
  },
  'Cupping Massage': {
    image: './assets/images-new/massage_types/94b91f7b-3522-4c12-86c4-1762f321d087.jpg',
    description: 'Suction therapy to lift, release, and improve blood flow. This ancient technique uses gentle suction to release fascial restrictions, improve circulation, and provide deep muscle relief for enhanced mobility and wellness.'
  },
  'Sports Massage': {
    image: './assets/images-new/massage_types/massage-your-questions-answered.jpg',
    description: 'Performance-driven pressure to recover muscles and prevent injury. Designed for athletes and active individuals, this treatment uses targeted techniques to enhance performance, speed recovery, and prevent sports-related injuries.'
  },
  'Deep Tissue': {
    image: './assets/images-new/massage_types/ad.jpeg',
    description: 'Intense pressure to target knots and chronic pain at the root. This therapeutic treatment focuses on deeper muscle layers and connective tissue to release chronic tension patterns and provide lasting pain relief.'
  },
  'Prenatal Massage': {
    image: './assets/images-new/massage_types/Prenatal1.png',
    description: 'Soothing strokes designed for your changing body and baby\'s comfort. Specially adapted techniques provide relief from pregnancy discomforts while ensuring safety and relaxation for both mother and baby.'
  },
  'Reflexology Massage': {
    image: './assets/images-new/massage_types/dadad.png',
    description: 'Focused foot therapy to balance your entire body\'s systems. By applying pressure to specific reflex points on the feet, this treatment promotes healing and balance throughout the entire body for holistic wellness.'
  },
  'Balinese Massage': {
    image: './assets/images-new/massage_types/hero-1.jpg',
    description: 'A tropical fusion of acupressure, stretches, and essential oils. This traditional Indonesian technique combines gentle stretches, acupressure, and aromatherapy to restore balance and harmony to body and mind.'
  },
  'Thai Massage': {
    image: './assets/images-new/massage_types/thai-massage-2-1024x683.jpg',
    description: 'Stretch-based therapy to energize, realign, and awaken your body. This ancient practice combines yoga-like stretches, acupressure, and energy work to improve flexibility, reduce tension, and restore vitality.'
  },
  'Aromatherapy': {
    image: './assets/images-new/massage_types/aromatherapy-massageAA.jpg',
    description: 'Essential oils + massage to calm the mind and awaken the senses. This sensory journey combines therapeutic massage with carefully selected essential oils to promote deep relaxation and emotional balance.'
  }
};

function openMassageModal(serviceName) {
  const modal = document.getElementById('massageModal');
  const service = massageServices[serviceName];
  
  if (!service) return;
  
  // Update modal content
  document.getElementById('modalImage').src = service.image;
  document.getElementById('modalImage').alt = serviceName;
  document.getElementById('modalTitle').textContent = serviceName;
  document.getElementById('modalDescription').textContent = service.description;
  
  // Reset price selection and book now button
  resetPriceSelection();
  
  // Show modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Initialize price card click handlers
  initializePriceSelection();
}

function resetPriceSelection() {
  // Remove selected class from all price cards
  const priceCards = document.querySelectorAll('.massage-pricing-card');
  priceCards.forEach(card => {
    card.classList.remove('selected');
  });
  
  // Disable book now button
  const bookNowBtn = document.getElementById('bookNowBtn');
  if (bookNowBtn) {
    bookNowBtn.classList.add('disabled');
  }
}

// Flag to track if Book Now event listener has been added
let bookNowListenerAdded = false;

function initializePriceSelection() {
  const priceCards = document.querySelectorAll('.massage-pricing-card');
  const bookNowBtn = document.getElementById('bookNowBtn');
  
  priceCards.forEach(card => {
    // Remove existing listeners first
    card.removeEventListener('click', handlePriceCardClick);
    // Add new listener
    card.addEventListener('click', handlePriceCardClick);
  });
  
  // Add Book Now event listener only once
  if (bookNowBtn && !bookNowListenerAdded) {
    bookNowBtn.addEventListener('click', handleBookNowClick);
    bookNowListenerAdded = true;
  }
}

function handlePriceCardClick() {
  const priceCards = document.querySelectorAll('.massage-pricing-card');
  const bookNowBtn = document.getElementById('bookNowBtn');
  
  // Remove selected class from all cards
  priceCards.forEach(c => c.classList.remove('selected'));
  
  // Add selected class to clicked card
  this.classList.add('selected');
  
  // Enable book now button
  if (bookNowBtn) {
    bookNowBtn.classList.remove('disabled');
  }
  
  // Auto-scroll to "Book now" button on mobile devices
  if (window.innerWidth <= 768 && bookNowBtn) {
    setTimeout(() => {
      bookNowBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100); // Small delay to ensure the DOM has updated
  }
}

function handleBookNowClick(e) {
  e.preventDefault();
  
  // Check if a price card is selected
  const selectedCard = document.querySelector('.massage-pricing-card.selected');
  if (selectedCard) {
    // Redirect to contact form page
    window.location.href = 'contact-form.html';
  }
}

function closeMassageModal() {
  const modal = document.getElementById('massageModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('massageModal');
  if (event.target === modal) {
    closeMassageModal();
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeMassageModal();
  }
});

// Initialize massage modal triggers
document.addEventListener('DOMContentLoaded', function() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    const serviceTitle = card.querySelector('.service-title').textContent.trim();
    const bookNowSpan = card.querySelector('.service-cta');
    
    if (bookNowSpan) {
      bookNowSpan.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMassageModal(serviceTitle);
      });
    }
  });
});