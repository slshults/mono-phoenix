// Function to set dark mode based on the user's preference
function setDarkModePreference(isDarkMode) {
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  var bodyElement = document.body; // Use 'document.body' instead of 'getElementById'
  var lightModeToggle = document.getElementById('light-mode-toggle');
  var darkModeToggle = document.getElementById('dark-mode-toggle');
  if (isDarkMode) {
    bodyElement.classList.add('dark-mode');
    lightModeToggle.style.display = 'none';
    darkModeToggle.style.display = 'block';
  } else {
    bodyElement.classList.remove('dark-mode');
    lightModeToggle.style.display = 'block';
    darkModeToggle.style.display = 'none';
  }
}

// Function to toggle dark mode
function toggleDarkMode() {
  // Check if dark mode is currently enabled
  var isDarkMode = localStorage.getItem('darkMode') === 'true';
  // Toggle the dark mode preference and update the UI
  setDarkModePreference(!isDarkMode);
}

// Attach the toggleDarkMode function to the click event of the dark mode icon
var darkModeIcon = document.getElementById('dark-mode-icon');
if (darkModeIcon) {
  darkModeIcon.addEventListener('click', toggleDarkMode);
}

// Set the initial dark mode preference based on localStorage
var initialDarkMode = localStorage.getItem('darkMode') === 'true';
setDarkModePreference(initialDarkMode);
