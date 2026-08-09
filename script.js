/* ==========================================================================
   Islamic Prayer Times - Main Application Logic
   ========================================================================== */

// Prayer Name Translations (English Key -> Arabic Display)
const PRAYER_NAMES_AR = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

// Application State
let is12HourFormat = localStorage.getItem("salat_format_12h") === "true";
let currentTimings = null;
let countdownInterval = null;
let currentCity = localStorage.getItem("salat_selected_city") || "tlemcen";

// DOM Elements
const citiesSelect = document.getElementById("cities");
const hijriDateEl = document.getElementById("hijri-date");
const gregorianDateEl = document.getElementById("gregorian-date");
const countdownTimerEl = document.getElementById("countdown-timer");
const nextPrayerNameEl = document.getElementById("next-prayer-name");
const formatToggleBtn = document.getElementById("format-toggle");
const geoBtn = document.getElementById("geo-btn");

/**
 * Format a Date object into DD-MM-YYYY string for Aladhan API
 */
function getFormattedDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format local Arabic Gregorian Date string
 */
function getFormattedGregorianDate(date = new Date()) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Algiers",
  };
  return date.toLocaleDateString("ar-DZ", options);
}

/**
 * Convert 24-hour time string ("17:30") to 12-hour or 24-hour formatted string
 */
function formatTime(timeStr) {
  if (!timeStr) return "--:--";
  
  // Strip any extra timezone metadata if present (e.g., "17:30 (CET)")
  const cleanTime = timeStr.split(" ")[0];
  const [hoursStr, minutesStr] = cleanTime.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;

  if (is12HourFormat) {
    const period = hours >= 12 ? "م" : "ص";
    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, "0");
    return `${formattedHours}:${minutes} ${period}`;
  }

  return `${hoursStr}:${minutes}`;
}

/**
 * Update DOM elements with dates and prayer timings
 */
function renderPrayerData(data) {
  currentTimings = data.timings;

  // Render Hijri Date
  const hijri = data.date.hijri;
  hijriDateEl.innerHTML = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

  // Render Gregorian Date
  gregorianDateEl.innerHTML = getFormattedGregorianDate();

  // Render Timings on Cards
  const cards = document.querySelectorAll(".time-card");
  cards.forEach((card) => {
    const prayerKey = card.getAttribute("data-prayer");
    const timeValEl = card.querySelector(".time-val");

    if (currentTimings[prayerKey] && timeValEl) {
      timeValEl.innerText = formatTime(currentTimings[prayerKey]);
    }
  });

  // Start live countdown and prayer highlights
  startNextPrayerTracker();
}

/**
 * Fetch prayer timings by city name
 */
function fetchPrayerTimes(city) {
  const formattedDate = getFormattedDate();
  const url = `https://api.aladhan.com/v1/timingsByCity?date=${formattedDate}&city=${encodeURIComponent(
    city
  )}&country=Algeria&method=9`;

  axios
    .get(url)
    .then((response) => {
      if (response.data && response.data.data) {
        renderPrayerData(response.data.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching prayer times:", error);
      hijriDateEl.innerText = "تعذر جلب المواقيت";
    });
}

/**
 * Fetch prayer timings by Geolocation (latitude & longitude)
 */
function fetchPrayerTimesByCoords(lat, lng) {
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=9`;

  axios
    .get(url)
    .then((response) => {
      if (response.data && response.data.data) {
        renderPrayerData(response.data.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching location timings:", error);
      alert("حدث خطأ أثناء جلب مواقيت الموقع الحالي");
    });
}

/**
 * Calculate the next prayer and remaining time
 */
function getNextPrayerInfo() {
  if (!currentTimings) return null;

  const now = new Date();
  const prayersOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  for (let key of prayersOrder) {
    const timeStr = currentTimings[key].split(" ")[0];
    const [h, m] = timeStr.split(":").map(Number);

    const prayerDate = new Date(now);
    prayerDate.setHours(h, m, 0, 0);

    if (prayerDate > now) {
      return {
        nameKey: key,
        nameAr: PRAYER_NAMES_AR[key],
        targetDate: prayerDate,
      };
    }
  }

  // If all prayers today have passed, the next prayer is Fajr tomorrow
  const fajrTimeStr = currentTimings.Fajr.split(" ")[0];
  const [h, m] = fajrTimeStr.split(":").map(Number);
  const tomorrowFajr = new Date(now);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  tomorrowFajr.setHours(h, m, 0, 0);

  return {
    nameKey: "Fajr",
    nameAr: PRAYER_NAMES_AR["Fajr"],
    targetDate: tomorrowFajr,
  };
}

/**
 * Start live 1-second countdown and highlight the next prayer card
 */
function startNextPrayerTracker() {
  if (countdownInterval) clearInterval(countdownInterval);

  function updateTracker() {
    const nextInfo = getNextPrayerInfo();
    if (!nextInfo) return;

    // Highlight active card
    const cards = document.querySelectorAll(".time-card");
    cards.forEach((card) => {
      if (card.getAttribute("data-prayer") === nextInfo.nameKey) {
        card.classList.add("active-next");
      } else {
        card.classList.remove("active-next");
      }
    });

    nextPrayerNameEl.innerText = nextInfo.nameAr;

    // Calculate time difference
    const now = new Date();
    const diffMs = nextInfo.targetDate - now;

    if (diffMs <= 0) {
      // Re-evaluate if prayer time just hit
      startNextPrayerTracker();
      return;
    }

    const totalSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const formattedH = String(hours).padStart(2, "0");
    const formattedM = String(mins).padStart(2, "0");
    const formattedS = String(secs).padStart(2, "0");

    countdownTimerEl.innerText = `${formattedH}:${formattedM}:${formattedS}`;
  }

  updateTracker();
  countdownInterval = setInterval(updateTracker, 1000);
}

/**
 * Setup Event Listeners & Initialize
 */
document.addEventListener("DOMContentLoaded", () => {
  // Sync selected city with select dropdown
  if (citiesSelect) {
    citiesSelect.value = currentCity;
    
    // Fallback if saved city value isn't in dropdown options
    if (citiesSelect.selectedIndex === -1) {
      citiesSelect.value = "tlemcen";
      currentCity = "tlemcen";
    }

    citiesSelect.addEventListener("change", (e) => {
      currentCity = e.target.value;
      localStorage.setItem("salat_selected_city", currentCity);
      fetchPrayerTimes(currentCity);
    });
  }

  // Toggle 12h / 24h format
  if (formatToggleBtn) {
    formatToggleBtn.innerText = is12HourFormat ? "⏱️ نظام 24 ساعة" : "⏱️ نظام 12 ساعة";
    
    formatToggleBtn.addEventListener("click", () => {
      is12HourFormat = !is12HourFormat;
      localStorage.setItem("salat_format_12h", is12HourFormat);
      formatToggleBtn.innerText = is12HourFormat ? "⏱️ نظام 24 ساعة" : "⏱️ نظام 12 ساعة";
      if (currentTimings) {
        renderPrayerData({
          timings: currentTimings,
          date: {
            hijri: {
              day: hijriDateEl.innerText.split(" ")[0],
              month: { ar: hijriDateEl.innerText.split(" ")[1] },
              year: hijriDateEl.innerText.split(" ")[2],
            },
          },
        });
      }
    });
  }

  // Geolocation Button
  if (geoBtn) {
    geoBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("خاصية تحديد الموقع غير مدعومة في متصفحك");
        return;
      }

      geoBtn.innerText = "⏳ جاري التحديد...";
      navigator.geolocation.getCurrentPosition(
        (position) => {
          geoBtn.innerText = "📍 موقعي الحالي";
          fetchPrayerTimesByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          geoBtn.innerText = "📍 موقعي الحالي";
          alert("تعذر الوصول إلى موقعك الجغرافي");
          console.error(error);
        }
      );
    });
  }

  // Initial Load
  fetchPrayerTimes(currentCity);
});

