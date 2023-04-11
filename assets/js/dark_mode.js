// Function to toggle dark mode
    // Function to toggle dark mode
    function toggleDarkMode() {
      var bodyElement = document.getElementById('body-element');
      bodyElement.classList.toggle('dark-mode');
  }

  // Attach the toggleDarkMode function to the click event of the dark mode icon
  var darkModeIcon = document.getElementById('dark-mode-icon');
  if (darkModeIcon) {
      darkModeIcon.addEventListener('click', toggleDarkMode);
  }
  