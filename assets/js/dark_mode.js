// Function to read the value of a cookie by its name
function getCookie(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Firefox throws "SecurityError: The operation is insecure." on any
// localStorage access when storage is blocked (e.g. cookies disabled, some
// private-browsing setups). This file runs at the top of the app.js bundle,
// so an unguarded throw here would halt the rest of the bundle. Fall back to
// the darkModePreference cookie we already set in setDarkModePreference.
function readDarkModePreference() {
  try {
    return localStorage.getItem('darkMode');
  } catch (e) {
    return getCookie('darkModePreference');
  }
}

function saveDarkModePreference(value) {
  try {
    localStorage.setItem('darkMode', value);
  } catch (e) {
    // Storage blocked; the darkModePreference cookie is the fallback store.
  }
}

// Function to set dark mode based on the user's preference
function setDarkModePreference(isDarkMode) {
  saveDarkModePreference(isDarkMode ? 'true' : 'false');
  // Set a cookie for the dark mode preference
  document.cookie = 'darkModePreference=' + (isDarkMode ? 'true' : 'false') + ';path=/';
  var bodyElement = document.body; // Use 'document.body' instead of 'getElementById'
  var lightModeToggle = document.getElementById('light-mode-toggle');
  var darkModeToggle = document.getElementById('dark-mode-toggle');
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode');
    bodyElement.classList.add('dark-mode');
    lightModeToggle.style.display = 'none';
    darkModeToggle.style.display = 'block';
  } else {
    document.documentElement.classList.remove('dark-mode');
    bodyElement.classList.remove('dark-mode');
    lightModeToggle.style.display = 'block';
    darkModeToggle.style.display = 'none';
  }
}

// Function to toggle dark mode
function toggleDarkMode() {
  // Check if dark mode is currently enabled
  var isDarkMode = readDarkModePreference() === 'true';
  // Toggle the dark mode preference and update the UI
  setDarkModePreference(!isDarkMode);
}

// Event delegation: catches clicks on the dark-mode-icon (or its child <img>s)
// regardless of whether the element was present at script-load time, was
// replaced during a LiveView morph, or got re-rendered later. More robust
// than `getElementById(...).addEventListener(...)`, which only binds once
// to whatever element happened to exist at that moment.
document.addEventListener('click', function(e) {
  if (e.target.closest && e.target.closest('#dark-mode-icon')) {
    toggleDarkMode();
  }
});

// Set the initial dark mode preference based on localStorage
var initialDarkMode = readDarkModePreference() === 'true';
setDarkModePreference(initialDarkMode);

window.getCookie = function(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};
