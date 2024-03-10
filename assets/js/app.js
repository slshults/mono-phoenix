// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
import "../css/app.css"
// Import the dark mode toggle script
import "./dark_mode"

// Adding PostHog js library goodies
import posthog from "posthog-js"

posthog.init('phc_Byagoba6TS6UBZ4AAMOSY5NZpbaEUJltMKH9CsZkv4l', { api_host: 'https://app.posthog.com' })

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
    posthog.capture('clicked_pdflink');
  }
}, false);

// Attach event listener to the TipJar buttons for PostHog custom event
document.addEventListener('click', function (event) {
  if (event.target.matches('.tip_jar')) {
    posthog.capture('clicked_tipjar');
  }
}, false);

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

