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
      posthog.capture('used_search', { searched_for: searchQuery });
    }, 5000);
  }
}, false);

// Attach event listener to the PDF links for PostHog custom event
document.addEventListener('click', function (event) {
  if (event.target.matches('.monologue-pdflink')) {
    const linkElement = event.target.closest('a');
    if (linkElement) {
      const pdf_url = linkElement.getAttribute('href');
      
      // Get monologue context from the row
      const monologueRow = linkElement.closest('tr');
      let monologue_id = null;
      let character_name = null;
      let play_title = null;
      
      if (monologueRow) {
        // Try to get monologue ID from nearby summary icon
        const summaryIcon = monologueRow.querySelector('.summary-icon[phx-value-monologue-id]');
        if (summaryIcon) {
          monologue_id = summaryIcon.getAttribute('phx-value-monologue-id');
          character_name = summaryIcon.getAttribute('phx-value-character');
          play_title = summaryIcon.getAttribute('phx-value-play-title');
        }
        
        // Fallback to extracting from text content
        if (!character_name) {
          const characterElement = monologueRow.querySelector('.monologue-character');
          character_name = characterElement ? characterElement.textContent.trim() : null;
        }
        
        if (!play_title) {
          const playElement = monologueRow.querySelector('.monologue-playname a');
          play_title = playElement ? playElement.textContent.trim() : null;
        }
      }
      
      posthog.capture('pdf_clicked', {
        pdf_url: pdf_url,
        monologue_id: monologue_id,
        character_name: character_name,
        play_title: play_title
      });
    }
  }
}, false);

// Attach event listener to monologue first line clicks for PostHog custom event
document.addEventListener('click', function (event) {
  if (event.target.matches('.monologue-firstline-table') || 
      event.target.closest('.monologue-firstline-table')) {
    const firstLineElement = event.target.closest('.monologue-firstline-table') || event.target;
    const targetId = firstLineElement.getAttribute('data-target');
    const collapseElement = targetId ? document.querySelector(targetId) : null;
    
    // Determine if this is expanding or collapsing
    const isExpanding = collapseElement && !collapseElement.classList.contains('show');
    
    if (isExpanding) {
      // Get monologue details from the row context
      const monologueRow = firstLineElement.closest('tr');
      let monologue_id = null;
      let character_name = null;
      let play_title = null;
      
      if (monologueRow) {
        // Extract character name from the character span
        const characterElement = monologueRow.querySelector('.monologue-character');
        character_name = characterElement ? characterElement.textContent.trim() : null;
        
        // Extract play title from the play name span
        const playElement = monologueRow.querySelector('.monologue-play');
        play_title = playElement ? playElement.textContent.trim() : null;
        
        // Try to get monologue ID from nearby summary icon if present
        const summaryIcon = monologueRow.querySelector('.summary-icon[phx-value-monologue-id]');
        if (summaryIcon) {
          monologue_id = summaryIcon.getAttribute('phx-value-monologue-id');
        }
      }
      
      posthog.capture('monologue_expanded', {
        monologue_id: monologue_id,
        character_name: character_name,
        play_title: play_title
      });
    }
  }
}, false);

// Attach event listener to summary/paraphrasing icon clicks for PostHog custom event
document.addEventListener('click', function (event) {
  if (event.target.matches('.summary-icon') || 
      event.target.closest('.summary-icon')) {
    const summaryIcon = event.target.closest('.summary-icon') || event.target;
    
    // Get monologue details from the attributes
    const monologue_id = summaryIcon.getAttribute('phx-value-monologue-id');
    const character_name = summaryIcon.getAttribute('phx-value-character');
    const play_title = summaryIcon.getAttribute('phx-value-play-title');
    
    // Determine request type based on context or default to paraphrasing
    const monologueRow = summaryIcon.closest('tr');
    let request_type = 'paraphrasing'; // default
    
    // Check if this is in a play context (might be scene summary)
    if (monologueRow && monologueRow.querySelector('.monologue-actscene')) {
      const actScene = monologueRow.querySelector('.monologue-actscene');
      if (actScene && actScene.textContent.includes('Scene')) {
        request_type = 'scene_summary';
      }
    }
    
    posthog.capture('paraphrasing_requested', {
      monologue_id: monologue_id,
      character_name: character_name,
      play_title: play_title,
      request_type: request_type
    });
  }
}, false);

// Attach event listener to play name link clicks for PostHog custom event
document.addEventListener('click', function (event) {
  if (event.target.matches('.monologue-playname a') || 
      event.target.closest('.monologue-playname')) {
    const playElement = event.target.closest('.monologue-playname') || event.target;
    const linkElement = playElement.querySelector('a') || event.target.closest('a');
    
    if (linkElement) {
      const href = linkElement.getAttribute('href');
      const play_title = linkElement.textContent.trim();
      
      // Extract play_id and section from the href
      let play_id = null;
      let section = 'general';
      
      if (href) {
        if (href.includes('/men/')) {
          section = 'men';
          play_id = href.split('/men/')[1];
        } else if (href.includes('/women/')) {
          section = 'women';
          play_id = href.split('/women/')[1];
        } else if (href.includes('/play/')) {
          section = 'general';
          play_id = href.split('/play/')[1];
        }
      }
      
      // Get context from the page
      let source_context = 'unknown';
      if (document.querySelector('.search-box-default')) {
        source_context = 'search_results';
      } else if (window.location.pathname.includes('/plays')) {
        source_context = 'plays_listing';
      }
      
      posthog.capture('play_selected', {
        play_id: play_id,
        play_title: play_title,
        section: section,
        source_context: source_context
      });
    }
  }
}, false);

// Attach event listener to section navigation clicks for PostHog custom event
document.addEventListener('click', function (event) {
  const linkElement = event.target.closest('a');
  if (linkElement) {
    const href = linkElement.getAttribute('href');
    
    // Check if this is a section navigation link
    if (href === '/mens' || href === '/womens' || href === '/plays') {
      let section_selected = '';
      let current_section = 'unknown';
      
      // Determine which section was selected
      if (href === '/mens') {
        section_selected = 'men';
      } else if (href === '/womens') {
        section_selected = 'women';
      } else if (href === '/plays') {
        section_selected = 'all';
      }
      
      // Determine current section from URL
      const currentPath = window.location.pathname;
      if (currentPath.includes('/mens') || currentPath.includes('/men/')) {
        current_section = 'men';
      } else if (currentPath.includes('/womens') || currentPath.includes('/women/')) {
        current_section = 'women';
      } else if (currentPath.includes('/plays') || currentPath.includes('/play/')) {
        current_section = 'all';
      } else if (currentPath.includes('/search')) {
        // Check if it's a gendered search page
        if (currentPath.includes('men')) {
          current_section = 'men';
        } else if (currentPath.includes('women')) {
          current_section = 'women';
        } else {
          current_section = 'all';
        }
      }
      
      // Only track if they're actually switching sections
      if (section_selected !== current_section) {
        posthog.capture('section_filtered', {
          section_selected: section_selected,
          previous_section: current_section,
          source_page: currentPath
        });
      }
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

