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