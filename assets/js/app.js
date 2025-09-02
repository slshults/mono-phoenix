// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
import "../css/app.css"
// Import the dark mode toggle script
import "./dark_mode"

// PostHog analytics is handled via the web snippet in root.html.heex

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Capture searches for PostHog custom event
let searchTimeout;

// Attach event listener to the search input for PostHog custom event
document.addEventListener('input', function (event) {
  if (event.target.matches('.search-box-default')) {
    const searchQuery = event.target.value;
    
    // Clear the previous timeout
    clearTimeout(searchTimeout);
    
    // Set a new timeout to capture the event after 5 seconds of inactivity
    searchTimeout = setTimeout(function() {
      posthog.capture('used_search', { query: searchQuery });
    }, 5000);
  }
}, false);

// Attach event listener to the PDF links for PostHog custom event
document.addEventListener('click', function (event) {
  if (event.target.matches('.monologue-pdflink')) {
    const linkElement = event.target.closest('a');
    if (linkElement) {
      const clicked_3rdPartyUrl = linkElement.getAttribute('href');
      posthog.capture('clicked_3rdPartyUrl', {
        url: clicked_3rdPartyUrl
      });
    }
  }
}, false);

// Ko-fi Widget_2.js implementation with getHTML() method - DISABLED for custom implementation
/*
document.addEventListener('DOMContentLoaded', function() {
  // Load Ko-fi Widget_2.js script
  const kofiScript = document.createElement('script');
  kofiScript.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
  kofiScript.onload = function() {
    initializeKofiButtons();
  };
  document.head.appendChild(kofiScript);
  
  // Ko-fi button click tracking for PostHog analytics
  document.addEventListener('click', function(event) {
    if (event.target.closest('.kofi-button, a[href*="ko-fi.com"]')) {
      posthog.capture('clicked_tipjar');
    }
  }, false);
});

function initializeKofiButtons() {
  // Initialize Ko-fi widget once with settings
  if (typeof kofiwidget2 !== 'undefined') {
    kofiwidget2.init('Tip Jar', '#E8E8C8', 'C0C71KLE85');
    
    // Insert Ko-fi buttons into multiple locations using getHTML()
    const locations = ['kofi-left-menu', 'kofi-center-footer', 'kofi-right-sidebar'];
    
    locations.forEach(function(containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = kofiwidget2.getHTML();
        console.log('Ko-fi button inserted into:', containerId);
      } else {
        console.log('Ko-fi container not found:', containerId);
      }
    });
  } else {
    console.log('kofiwidget2 not available');
  }
}
*/

// Custom Ko-fi button click tracking for PostHog analytics and iframe toggle
document.addEventListener('DOMContentLoaded', function() {
  // PostHog tracking for Ko-fi clicks
  document.addEventListener('click', function(event) {
    if (event.target.closest('a[href*="ko-fi.com"]') || 
        event.target.closest('#kofi-toggle-btn') ||
        event.target.closest('#kofi-left-toggle-btn') ||
        event.target.closest('#kofi-footer-toggle-btn')) {
      posthog.capture('clicked_tipjar');
    }
  }, false);

  // Static pages Ko-fi iframe toggle functionality
  const toggleBtn = document.getElementById('kofi-toggle-btn');
  const closeBtn = document.getElementById('kofi-close-btn');
  const iframeContainer = document.getElementById('kofi-iframe-container');

  if (toggleBtn && iframeContainer) {
    toggleBtn.addEventListener('click', function() {
      if (iframeContainer.style.display === 'none') {
        iframeContainer.style.display = 'block';
        iframeContainer.style.visibility = 'visible';
      } else {
        iframeContainer.style.display = 'none';
        iframeContainer.style.visibility = 'hidden';
      }
    });
  }

  if (closeBtn && iframeContainer) {
    closeBtn.addEventListener('click', function() {
      iframeContainer.style.display = 'none';
      iframeContainer.style.visibility = 'hidden';
    });
  }

  // LiveView pages Ko-fi iframe toggle functionality - Left column (opens below)
  const leftToggleBtn = document.getElementById('kofi-left-toggle-btn');
  const leftCloseBtn = document.getElementById('kofi-left-close-btn');
  const leftIframeContainer = document.getElementById('kofi-left-iframe-container');

  if (leftToggleBtn && leftIframeContainer) {
    leftToggleBtn.addEventListener('click', function() {
      if (leftIframeContainer.style.display === 'none') {
        leftIframeContainer.style.display = 'block';
        leftIframeContainer.style.visibility = 'visible';
      } else {
        leftIframeContainer.style.display = 'none';
        leftIframeContainer.style.visibility = 'hidden';
      }
    });
  }

  if (leftCloseBtn && leftIframeContainer) {
    leftCloseBtn.addEventListener('click', function() {
      leftIframeContainer.style.display = 'none';
      leftIframeContainer.style.visibility = 'hidden';
    });
  }

  // LiveView pages Ko-fi iframe toggle functionality - Footer (opens above)
  const footerToggleBtn = document.getElementById('kofi-footer-toggle-btn');
  const footerCloseBtn = document.getElementById('kofi-footer-close-btn');
  const footerIframeContainer = document.getElementById('kofi-footer-iframe-container');

  if (footerToggleBtn && footerIframeContainer) {
    footerToggleBtn.addEventListener('click', function() {
      if (footerIframeContainer.style.display === 'none') {
        footerIframeContainer.style.display = 'block';
        footerIframeContainer.style.visibility = 'visible';
      } else {
        footerIframeContainer.style.display = 'none';
        footerIframeContainer.style.visibility = 'hidden';
      }
    });
  }

  if (footerCloseBtn && footerIframeContainer) {
    footerCloseBtn.addEventListener('click', function() {
      footerIframeContainer.style.display = 'none';
      footerIframeContainer.style.visibility = 'hidden';
    });
  }
});

// Also initialize Ko-fi buttons on LiveView navigation - DISABLED for custom implementation
/*
window.addEventListener("phx:page-loading-stop", () => {
  // Wait a bit for the DOM to be ready, then initialize Ko-fi buttons
  setTimeout(function() {
    if (typeof kofiwidget2 !== 'undefined') {
      initializeKofiButtons();
    }
  }, 100);
});
*/


// Trigger for PostHog surveys:

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    const surveyH1 = document.querySelector('.survey-h1');
    if (surveyH1) {
      surveyH1.classList.add('delayed-survey');
    }
  }, 120000); // 2 minutes
});


// Show progress bar on live navigation and form submits, if still loading after 500ms
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
let topBarScheduled = undefined

window.addEventListener("phx:page-loading-start", () => {
  if(!topBarScheduled) {
    topBarScheduled = setTimeout(() => topbar.show(), 500)
  }
})

window.addEventListener("phx:page-loading-stop", () => {
  clearTimeout(topBarScheduled)
  topBarScheduled = undefined
  topbar.hide()
})

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

