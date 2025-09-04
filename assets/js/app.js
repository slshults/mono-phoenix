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

let Hooks = {}

// Modal Click Handler Hook
Hooks.ModalClickHandler = {
  mounted() {
    console.log("ModalClickHandler mounted on element:", this.el)
    console.log("Element ID:", this.el.id)
    console.log("Element classes:", this.el.className)
    
    // Handle X button clicks with confirmation
    const closeButton = this.el.querySelector(".summary-modal-close")
    if (closeButton) {
      console.log("Close button found and event listener attached")
      closeButton.addEventListener("click", (e) => {
        e.preventDefault()
        this.handleModalClose()
      })
    } else {
      console.log("No close button found")
    }

    this.el.addEventListener("click", (e) => {
      // Debug ALL click events on the modal
      console.log("Click event detected on modal:")
      console.log("- Event target:", e.target)
      console.log("- Target tagName:", e.target.tagName)
      console.log("- Target classes:", e.target.className)
      console.log("- Target === this.el:", e.target === this.el)
      console.log("- this.el:", this.el)
      
      // Handle copy button clicks
      if (e.target.classList.contains("copy-to-clipboard-btn")) {
        console.log("Copy button clicked")
        const contentDiv = this.el.querySelector(".summary-content")
        if (contentDiv) {
          // Get text content, preserve line breaks
          const text = contentDiv.innerText || contentDiv.textContent || ""
          navigator.clipboard.writeText(text).then(() => {
            // Visual feedback - briefly change the icon
            const originalText = e.target.textContent
            e.target.textContent = "✅"
            setTimeout(() => {
              e.target.textContent = originalText
            }, 1000)
          }).catch(err => {
            console.warn('Failed to copy text: ', err)
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(text, e.target)
          })
        }
        return
      }
      
      // Click-outside-to-close behavior - only when NOT loading
      if (e.target === this.el) {
        console.log("=== CLICK-OUTSIDE DETECTED ===")
        
        // Check if we're currently loading (generating content)
        const loadingElement = this.el.querySelector(".summary-loading")
        const dataLoading = this.el.getAttribute("data-loading")
        
        console.log("Loading state check:")
        console.log("- .summary-loading element:", loadingElement)
        console.log("- data-loading attribute:", dataLoading)
        console.log("- Modal innerHTML preview:", this.el.innerHTML.substring(0, 200))
        
        if (loadingElement) {
          console.log("❌ PREVENTING CLOSE - content is loading")
          return
        }
        
        if (dataLoading === "true") {
          console.log("❌ PREVENTING CLOSE - data-loading is true")
          return
        }
        
        console.log("✅ ALLOWING CLOSE - not loading")
        this.handleModalClose()
      } else {
        console.log("Click was on child element, not closing modal")
      }
    })
  },
  
  handleModalClose() {
    console.log("=== handleModalClose() called ===")
    console.log("Pushing modal_close_request event to #summary-modal")
    
    // Push event directly to the LiveComponent using its ID
    this.pushEventTo("#summary-modal", "modal_close_request", {})
  },
  
  updated() {
    console.log("=== Modal updated ===")
    console.log("- data-loading:", this.el.getAttribute("data-loading"))
    console.log("- display style:", this.el.style.display)
    console.log("- .summary-loading present:", !!this.el.querySelector(".summary-loading"))
  },
  
  
  fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      const originalText = button.textContent
      button.textContent = "✅"
      setTimeout(() => {
        button.textContent = originalText
      }, 1000)
    } catch (err) {
      console.warn('Fallback copy failed: ', err)
    }
    document.body.removeChild(textArea)
  }
}

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
  params: {_csrf_token: csrfToken},
  hooks: Hooks
})

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

// Custom Ko-fi button click tracking for PostHog analytics - Direct Link Version
document.addEventListener('DOMContentLoaded', function() {
  // PostHog tracking for Ko-fi clicks (now direct links only)
  document.addEventListener('click', function(event) {
    if (event.target.closest('a[href*="ko-fi.com"]') || 
        event.target.closest('#kofi-left-direct-btn') ||
        event.target.closest('#kofi-footer-direct-btn') ||
        event.target.closest('#kofi-direct-btn')) {
      posthog.capture('clicked_tipjar');
    }
  }, false);
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

