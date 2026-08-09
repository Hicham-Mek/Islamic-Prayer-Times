# 🕌 مواقيت الصلاة (Prayer Times Web App)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Aladhan API](https://img.shields.io/badge/API-Aladhan-008080?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)

A modern, responsive, and visually stunning Islamic Prayer Times web application tailored for Algerian cities and worldwide users. Built with Vanilla HTML5, CSS3 Glassmorphism UI, JavaScript (ES6+), and integrated with the [Aladhan REST API](https://aladhan.com/prayer-times-api).

🌐 **Live Demo:** [https://sltm.netlify.app/](https://sltm.netlify.app/)

---

## ✨ Features

- 📍 **City Selection & Automatic Local Storage**: Easily select from major Algerian cities (Tlemcen, Algiers, Oran, Constantine, Annaba, Setif, Batna, Biskra, etc.). Saves user preference automatically.
- 🎯 **Browser Geolocation ("موقعي الحالي")**: Detect user latitude & longitude with a single click to fetch hyper-accurate local prayer times.
- ⏱️ **Live Countdown Timer**: Automatically calculates and displays a real-time countdown to the next upcoming prayer.
- 🌟 **Active Next Prayer Highlight**: Glowing gold visual highlight and badge on the upcoming prayer card.
- 📅 **Dual Hijri & Gregorian Calendar Display**: Displays the current Hijri date (e.g. `15 شعبان 1447 هـ`) alongside the local Arabic Gregorian date.
- 🕒 **12-Hour / 24-Hour Format Switcher**: Toggle easily between 12-hour format (with Arabic `ص`/`م` indicators) and 24-hour time format.
- 🎨 **Islamic Dark Emerald Glassmorphism UI**: High-end aesthetic using custom CSS variables, glassmorphic panels, Google Fonts (`Cairo` & `Amiri`), RTL direction, and responsive grid layouts.

---

## 🛠️ Tech Stack

- **Frontend Core**: HTML5 (Semantic & RTL Arabic markup), Modern JavaScript (ES6+ Modules)
- **Styling**: Vanilla CSS3 (Custom Glassmorphism, CSS Grid, Flexbox, Animations)
- **Typography**: [Google Fonts](https://fonts.google.com/) (`Cairo` for UI, `Amiri` for Arabic titles)
- **API & HTTP Client**: [Axios HTTP Client](https://axios-http.com/) & [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api)
- **Icons & Assets**: Custom SVG & PNG prayer timing graphics

---

## 📁 Project Structure

```text
API مواقيت لصلاة/
├── index.html          # Main HTML entry point (RTL layout, grid structure)
├── style.css           # Design system (Glassmorphism, animations, theme variables)
├── script.js           # Main application logic (API calls, live countdown, DOM)
├── package.json        # Dependencies & package configuration
├── images/             # Prayer icons (fajr, sunrise, dhuhr, asr, maghrib, isha)
└── README.md           # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

All you need is a modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari). No heavy server setup or build tooling required!

### Local Setup Instructions

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/Hicham-Mek/API-------------.git
   cd "API مواقيت لصلاة"
   ```

2. **Install Dependencies (Optional for node-based tooling):**
   ```bash
   npm install
   ```

3. **Run locally:**
   - Simply open `index.html` directly in your browser.
   - Alternatively, serve using any local HTTP server (e.g., Live Server extension in VS Code):
     ```bash
     npx serve .
     ```

---

## 📡 API Integration Details

This project fetches daily prayer times dynamically from the open-source **Aladhan API**:

- **By City Endpoint:**
  `GET https://api.aladhan.com/v1/timingsByCity?date={DD-MM-YYYY}&city={CITY}&country=Algeria&method=9`
- **By Coordinates Endpoint (Geolocation):**
  `GET https://api.aladhan.com/v1/timings/{TIMESTAMP}?latitude={LAT}&longitude={LNG}&method=9`

---

## 💻 Usage Example

Upon launching the web app:
1. The application automatically fetches and displays today's prayer timings for the selected default city.
2. Select any city from the dropdown menu to instantly fetch prayer times for that region.
3. Click **"📍 موقعي الحالي"** to fetch exact prayer timings for your current location.
4. Click **"⏱️ نظام 12 ساعة / 24 ساعة"** to switch the time display format.

---

## 🔗 Links & Live Demo

- **Live App**: [https://sltm.netlify.app/](https://sltm.netlify.app/)
- **Author**: Hicham

---

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).
