(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, progressTimerId, fadeTimerId, currentProgress, showing, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function() {
            if (showing)
              return;
            showing = true;
            if (fadeTimerId !== null)
              window2.cancelAnimationFrame(fadeTimerId);
            if (!canvas)
              createCanvas();
            canvas.style.opacity = 1;
            canvas.style.display = "block";
            topbar2.progress(0);
            if (options.autoRun) {
              (function loop() {
                progressTimerId = window2.requestAnimationFrame(loop);
                topbar2.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
              })();
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // js/dark_mode.js
  function setDarkModePreference(isDarkMode) {
    localStorage.setItem("darkMode", isDarkMode ? "true" : "false");
    document.cookie = "darkModePreference=" + (isDarkMode ? "true" : "false") + ";path=/";
    var bodyElement = document.body;
    var lightModeToggle = document.getElementById("light-mode-toggle");
    var darkModeToggle = document.getElementById("dark-mode-toggle");
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      bodyElement.classList.add("dark-mode");
      lightModeToggle.style.display = "none";
      darkModeToggle.style.display = "block";
    } else {
      document.documentElement.classList.remove("dark-mode");
      bodyElement.classList.remove("dark-mode");
      lightModeToggle.style.display = "block";
      darkModeToggle.style.display = "none";
    }
  }
  function toggleDarkMode() {
    var isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkModePreference(!isDarkMode);
  }
  var darkModeIcon = document.getElementById("dark-mode-icon");
  if (darkModeIcon) {
    darkModeIcon.addEventListener("click", toggleDarkMode);
  }
  var initialDarkMode = localStorage.getItem("darkMode") === "true";
  setDarkModePreference(initialDarkMode);
  window.getCookie = function(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2)
      return parts.pop().split(";").shift();
    return null;
  };

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "none";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      submit.type = "submit";
      form.appendChild(submit);
      submit.click();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method") && element.getAttribute("data-to")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || globalThis;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var AUTH_TOKEN_PREFIX = "base64url.bearer.phx.";
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(this.socket.onOpen(() => {
        this.rejoinTimer.reset();
        if (this.isErrored()) {
          this.rejoin();
        }
      }));
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    onMessage(_event, payload, _ref) {
      return payload;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, headers, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else if (global.XMLHttpRequest) {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback);
      } else if (global.fetch && global.AbortController) {
        return this.fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback);
      } else {
        throw new Error("No suitable XMLHttpRequest implementation found");
      }
    }
    static fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback) {
      let options = {
        method,
        headers,
        body
      };
      let controller = null;
      if (timeout) {
        controller = new AbortController();
        const _timeoutId = setTimeout(() => controller.abort(), timeout);
        options.signal = controller.signal;
      }
      global.fetch(endPoint, options).then((response) => response.text()).then((data) => this.parseJSON(data)).then((data) => callback && callback(data)).catch((err) => {
        if (err.name === "AbortError" && ontimeout) {
          ontimeout();
        } else {
          callback && callback(null);
        }
      });
      return controller;
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      for (let [key, value] of Object.entries(headers)) {
        req.setRequestHeader(key, value);
      }
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var arrayBufferToBase64 = (buffer) => {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  var LongPoll = class {
    constructor(endPoint, protocols) {
      if (protocols && protocols.length === 2 && protocols[1].startsWith(AUTH_TOKEN_PREFIX)) {
        this.authToken = atob(protocols[1].slice(AUTH_TOKEN_PREFIX.length));
      }
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.awaitingBatchAck = false;
      this.currentBatch = null;
      this.currentBatchTimer = null;
      this.batchBuffer = [];
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      setTimeout(() => this.poll(), 0);
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      const headers = { "Accept": "application/json" };
      if (this.authToken) {
        headers["X-Phoenix-AuthToken"] = this.authToken;
      }
      this.ajax("GET", headers, null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    send(body) {
      if (typeof body !== "string") {
        body = arrayBufferToBase64(body);
      }
      if (this.currentBatch) {
        this.currentBatch.push(body);
      } else if (this.awaitingBatchAck) {
        this.batchBuffer.push(body);
      } else {
        this.currentBatch = [body];
        this.currentBatchTimer = setTimeout(() => {
          this.batchSend(this.currentBatch);
          this.currentBatch = null;
        }, 0);
      }
    }
    batchSend(messages) {
      this.awaitingBatchAck = true;
      this.ajax("POST", { "Content-Type": "application/x-ndjson" }, messages.join("\n"), () => this.onerror("timeout"), (resp) => {
        this.awaitingBatchAck = false;
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        } else if (this.batchBuffer.length > 0) {
          this.batchSend(this.batchBuffer);
          this.batchBuffer = [];
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      this.batchBuffer = [];
      clearTimeout(this.currentBatchTimer);
      this.currentBatchTimer = null;
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, headers, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), headers, body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.primaryPassedHealthCheck = false;
      this.longPollFallbackMs = opts.longPollFallbackMs;
      this.fallbackTimer = null;
      this.sessionStore = opts.sessionStorage || global && global.sessionStorage;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      if (!this.logger && opts.debug) {
        this.logger = (kind, msg, data) => {
          console.log(`${kind}: ${msg}`, data);
        };
      }
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
      this.authToken = opts.authToken;
    }
    getLongPollTransport() {
      return LongPoll;
    }
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    endPointURL() {
      let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.disconnecting = true;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      this.teardown(() => {
        this.disconnecting = false;
        callback && callback();
      }, code, reason);
    }
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn && !this.disconnecting) {
        return;
      }
      if (this.longPollFallbackMs && this.transport !== LongPoll) {
        this.connectWithFallback(LongPoll, this.longPollFallbackMs);
      } else {
        this.transportConnect();
      }
    }
    log(kind, msg, data) {
      this.logger && this.logger(kind, msg, data);
    }
    hasLogger() {
      return this.logger !== null;
    }
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    transportConnect() {
      this.connectClock++;
      this.closeWasClean = false;
      let protocols = void 0;
      if (this.authToken) {
        protocols = ["phoenix", `${AUTH_TOKEN_PREFIX}${btoa(this.authToken).replace(/=/g, "")}`];
      }
      this.conn = new this.transport(this.endPointURL(), protocols);
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    getSession(key) {
      return this.sessionStore && this.sessionStore.getItem(key);
    }
    storeSession(key, val) {
      this.sessionStore && this.sessionStore.setItem(key, val);
    }
    connectWithFallback(fallbackTransport, fallbackThreshold = 2500) {
      clearTimeout(this.fallbackTimer);
      let established = false;
      let primaryTransport = true;
      let openRef, errorRef;
      let fallback = (reason) => {
        this.log("transport", `falling back to ${fallbackTransport.name}...`, reason);
        this.off([openRef, errorRef]);
        primaryTransport = false;
        this.replaceTransport(fallbackTransport);
        this.transportConnect();
      };
      if (this.getSession(`phx:fallback:${fallbackTransport.name}`)) {
        return fallback("memorized");
      }
      this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
      errorRef = this.onError((reason) => {
        this.log("transport", "error", reason);
        if (primaryTransport && !established) {
          clearTimeout(this.fallbackTimer);
          fallback(reason);
        }
      });
      this.onOpen(() => {
        established = true;
        if (!primaryTransport) {
          if (!this.primaryPassedHealthCheck) {
            this.storeSession(`phx:fallback:${fallbackTransport.name}`, "true");
          }
          return this.log("transport", `established ${fallbackTransport.name} fallback`);
        }
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
        this.ping((rtt) => {
          this.log("transport", "connected to primary after", rtt);
          this.primaryPassedHealthCheck = true;
          clearTimeout(this.fallbackTimer);
        });
      });
      this.transportConnect();
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `${this.transport.name} connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.triggerChanError();
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      let connectClock = this.connectClock;
      this.waitForBufferDone(() => {
        if (connectClock !== this.connectClock) {
          return;
        }
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (connectClock !== this.connectClock) {
            return;
          }
          if (this.conn) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      this.clearHeartbeats();
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    isConnected() {
      return this.connectionState() === "open";
    }
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c !== channel);
    }
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          this.clearHeartbeats();
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading",
    "phx-hook-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF_LOADING = "data-phx-ref-loading";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_REF_LOCK = "data-phx-ref-lock";
  var PHX_PENDING_REFS = "phx-pending-refs";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_MAGIC_ID = "data-phx-id";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_LOADING_CLASS = "phx-loading";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_CLIENT_ERROR_CLASS = "phx-client-error";
  var PHX_SERVER_ERROR_CLASS = "phx-server-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_VIEWPORT_TOP = "viewport-top";
  var PHX_VIEWPORT_BOTTOM = "viewport-bottom";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_STREAM = "stream";
  var PHX_STREAM_REF = "data-phx-stream";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_LV_HISTORY_POSITION = "phx:nav-history-position";
  var PHX_PROGRESS = "progress";
  var PHX_MOUNTED = "mounted";
  var PHX_RELOAD_STATUS = "__phoenix_reload_status__";
  var LOADER_TIMEOUT = 1;
  var MAX_CHILD_JOIN_ATTEMPTS = 3;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var DISCONNECTED_TIMEOUT = 500;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var PHX_PENDING_ATTRS = [PHX_REF_LOADING, PHX_REF_SRC, PHX_REF_LOCK];
  var DYNAMICS = "d";
  var STATIC = "s";
  var ROOT = "r";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var STREAM = "stream";
  var EntryUploader = class {
    constructor(entry, config, liveSocket2) {
      let { chunk_size, chunk_timeout } = config;
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunk_size;
      this.chunkTimeout = chunk_timeout;
      this.chunkTimer = null;
      this.errored = false;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      if (this.errored) {
        return;
      }
      this.uploadChannel.leave();
      this.errored = true;
      clearTimeout(this.chunkTimer);
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk, this.chunkTimeout).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      }).receive("error", ({ reason }) => this.error(reason));
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  function detectInvalidStreamInserts(inserts) {
    const errors = /* @__PURE__ */ new Set();
    Object.keys(inserts).forEach((id) => {
      const streamEl = document.getElementById(id);
      if (streamEl && streamEl.parentElement && streamEl.parentElement.getAttribute("phx-update") !== "stream") {
        errors.add(`The stream container with id "${streamEl.parentElement.id}" is missing the phx-update="stream" attribute. Ensure it is set for streams to work properly.`);
      }
    });
    errors.forEach((error) => console.error(error));
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`) && !el.disabled) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage2, namespace, subkey) {
      return localStorage2.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage2, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage2, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage2.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage2, namespace, subkey) {
      return JSON.parse(localStorage2.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          window.requestAnimationFrame(() => {
            let hashEl = this.getHashTargetEl(window.location.hash);
            if (hashEl) {
              hashEl.scrollIntoView();
            } else if (meta.type === "redirect") {
              window.scroll(0, 0);
            }
          });
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value, maxAgeSeconds) {
      let expires = typeof maxAgeSeconds === "number" ? ` max-age=${maxAgeSeconds};` : "";
      document.cookie = `${name}=${value};${expires} path=/`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    deleteCookie(name) {
      document.cookie = `${name}=; max-age=-1; path=/`;
    },
    redirect(toURL, flash) {
      if (flash) {
        this.setCookie("__phoenix_flash__", flash, 60);
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    isAutoUpload(inputEl) {
      return inputEl.hasAttribute("data-phx-auto-upload");
    },
    findUploadInputs(node) {
      const formId = node.id;
      const inputsOutsideForm = this.all(document, `input[type="file"][${PHX_UPLOAD_REF}][form="${formId}"]`);
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`).concat(inputsOutsideForm);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    wantsNewTab(e) {
      let wantsNewTab = e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button === 1;
      let isDownload = e.target instanceof HTMLAnchorElement && e.target.hasAttribute("download");
      let isTargetBlank = e.target.hasAttribute("target") && e.target.getAttribute("target").toLowerCase() === "_blank";
      let isTargetNamedTab = e.target.hasAttribute("target") && !e.target.getAttribute("target").startsWith("_");
      return wantsNewTab || isTargetBlank || isDownload || isTargetNamedTab;
    },
    isUnloadableFormSubmit(e) {
      let isDialogSubmit = e.target && e.target.getAttribute("method") === "dialog" || e.submitter && e.submitter.getAttribute("formmethod") === "dialog";
      if (isDialogSubmit) {
        return false;
      } else {
        return !e.defaultPrevented && !this.wantsNewTab(e);
      }
    },
    isNewPageClick(e, currentLocation) {
      let href = e.target instanceof HTMLAnchorElement ? e.target.getAttribute("href") : null;
      let url;
      if (e.defaultPrevented || href === null || this.wantsNewTab(e)) {
        return false;
      }
      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        return false;
      }
      if (e.target.isContentEditable) {
        return false;
      }
      try {
        url = new URL(href);
      } catch (e2) {
        try {
          url = new URL(href, currentLocation);
        } catch (e3) {
          return true;
        }
      }
      if (url.host === currentLocation.host && url.protocol === currentLocation.protocol) {
        if (url.pathname === currentLocation.pathname && url.search === currentLocation.search) {
          return url.hash === "" && !url.href.endsWith("#");
        }
      }
      return url.protocol.startsWith("http");
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findExistingParentCIDs(node, cids) {
      let parentCids = /* @__PURE__ */ new Set();
      let childrenCids = /* @__PURE__ */ new Set();
      cids.forEach((cid) => {
        this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node).forEach((parent) => {
          parentCids.add(cid);
          this.filterWithinSameLiveView(this.all(parent, `[${PHX_COMPONENT}]`), parent).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => childrenCids.add(childCID));
        });
      });
      childrenCids.forEach((childCid) => parentCids.delete(childCid));
      return parentCids;
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    syncPendingAttrs(fromEl, toEl) {
      if (!fromEl.hasAttribute(PHX_REF_SRC)) {
        return;
      }
      PHX_EVENT_CLASSES.forEach((className) => {
        fromEl.classList.contains(className) && toEl.classList.add(className);
      });
      PHX_PENDING_ATTRS.filter((attr) => fromEl.hasAttribute(attr)).forEach((attr) => {
        toEl.setAttribute(attr, fromEl.getAttribute(attr));
      });
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      if (titleEl) {
        let { prefix, suffix, default: defaultTitle } = titleEl.dataset;
        let isEmpty2 = typeof str !== "string" || str.trim() === "";
        if (isEmpty2 && typeof defaultTitle !== "string") {
          return;
        }
        let inner = isEmpty2 ? defaultTitle : str;
        document.title = `${prefix || ""}${inner || ""}${suffix || ""}`;
      } else {
        document.title = str;
      }
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
      let debounce = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce === "") {
        debounce = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      let value = debounce || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          this.incCycle(el, "debounce-blur-cycle", () => {
            if (asyncFilter()) {
              callback();
            }
          });
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => this.triggerCycle(el, "debounce-blur-cycle"));
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              const t = setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
              this.putPrivate(el, THROTTLED, t);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => {
              clearTimeout(this.private(el, THROTTLED));
              this.triggerCycle(el, DEBOUNCE_TRIGGER);
            });
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom) {
      if (fromEl.hasAttribute && fromEl.hasAttribute("data-phx-hook") && !toEl.hasAttribute("data-phx-hook")) {
        toEl.setAttribute("data-phx-hook", fromEl.getAttribute("data-phx-hook"));
      }
      if (toEl.hasAttribute && (toEl.hasAttribute(phxViewportTop) || toEl.hasAttribute(phxViewportBottom))) {
        toEl.setAttribute("data-phx-hook", "Phoenix.InfiniteScroll");
      }
    },
    putCustomElHook(el, hook) {
      if (el.isConnected) {
        el.setAttribute("data-phx-hook", "");
      } else {
        console.error(`
        hook attached to non-connected DOM element
        ensure you are calling createHook within your connectedCallback. ${el.outerHTML}
      `);
      }
      this.putPrivate(el, "custom-el-hook", hook);
    },
    getCustomElHook(el) {
      return this.private(el, "custom-el-hook");
    },
    isUsedInput(el) {
      return el.nodeType === Node.ELEMENT_NODE && (this.private(el, PHX_HAS_FOCUSED) || this.private(el, PHX_HAS_SUBMITTED));
    },
    resetForm(form) {
      Array.from(form.elements).forEach((input) => {
        this.deletePrivate(input, PHX_HAS_FOCUSED);
        this.deletePrivate(input, PHX_HAS_SUBMITTED);
      });
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    isChildOfAny(el, parents) {
      return !!parents.find((parent) => parent.contains(el));
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let defaultBubble = true;
      let isUploadTarget = target.nodeName === "INPUT" && target.type === "file";
      if (isUploadTarget && name === "click") {
        defaultBubble = false;
      }
      let bubbles = opts.bubbles === void 0 ? defaultBubble : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    mergeAttrs(target, source, opts = {}) {
      let exclude = new Set(opts.exclude || []);
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (!exclude.has(name)) {
          const sourceValue = source.getAttribute(name);
          if (target.getAttribute(name) !== sourceValue && (!isIgnored || isIgnored && name.startsWith("data-"))) {
            target.setAttribute(name, sourceValue);
          }
        } else {
          if (name === "value" && target.value === source.value) {
            target.setAttribute("value", source.getAttribute(name));
          }
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name) && !PHX_PENDING_ATTRS.includes(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (focused instanceof HTMLSelectElement) {
        focused.focus();
      }
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null && document.body.contains(el);
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend", PHX_STREAM])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode && childNode.nodeType !== Node.COMMENT_NODE) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    },
    isLocked(el) {
      return el.hasAttribute && el.hasAttribute(PHX_REF_LOCK);
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    static isPreflightInProgress(file) {
      return file._preflightInProgress === true;
    }
    static markPreflightInProgress(file) {
      file._preflightInProgress = true;
    }
    constructor(fileEl, file, view, autoUpload) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.autoUpload = autoUpload;
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    isCancelled() {
      return this._isCancelled;
    }
    cancel() {
      this.file._preflightInProgress = false;
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      if (!this.isAutoUpload()) {
        LiveUploader.clearFiles(this.fileEl);
      }
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        LiveUploader.untrackFile(this.fileEl, this.file);
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        relative_path: this.file.webkitRelativePath,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref,
        meta: typeof this.file.meta === "function" ? this.file.meta() : void 0
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class _LiveUploader {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.last_modified = file.lastModified;
        entry.name = file.name || entry.ref;
        entry.relative_path = file.webkitRelativePath;
        entry.type = file.type;
        entry.size = file.size;
        if (typeof file.meta === "function") {
          entry.meta = file.meta();
        }
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files, dataTransfer) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.updatePrivate(inputEl, "files", [], (existing) => existing.concat(newFiles));
        inputEl.value = null;
      } else {
        if (dataTransfer && dataTransfer.files.length > 0) {
          inputEl.files = dataTransfer.files;
        }
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f) && !UploadEntry.isPreflightInProgress(f));
    }
    static markPreflightInProgress(entries) {
      entries.forEach((entry) => UploadEntry.markPreflightInProgress(entry.file));
    }
    constructor(inputEl, view, onComplete) {
      this.autoUpload = dom_default.isAutoUpload(inputEl);
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(_LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view, this.autoUpload));
      _LiveUploader.markPreflightInProgress(this._entries);
      this.numEntriesInProgress = this._entries.length;
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        if (entry.isCancelled()) {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        } else {
          entry.zipPostFlight(resp);
          entry.onDone(() => {
            this.numEntriesInProgress--;
            if (this.numEntriesInProgress === 0) {
              this.onComplete();
            }
          });
        }
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        if (!entry.meta) {
          return acc;
        }
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var ARIA = {
    anyOf(instance, classes) {
      return classes.find((name) => instance instanceof name);
    },
    isFocusable(el, interactiveOnly) {
      return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== void 0 || !el.disabled && this.anyOf(el, [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement]) || el instanceof HTMLIFrameElement || (el.tabIndex >= 0 && el.getAttribute("aria-hidden") !== "true" || !interactiveOnly && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true");
    },
    attemptFocus(el, interactiveOnly) {
      if (this.isFocusable(el, interactiveOnly)) {
        try {
          el.focus();
        } catch (e) {
        }
      }
      return !!document.activeElement && document.activeElement.isSameNode(el);
    },
    focusFirstInteractive(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child, true) || this.focusFirstInteractive(child, true)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusFirst(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusFirst(child)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusLast(el) {
      let child = el.lastElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusLast(child)) {
          return true;
        }
        child = child.previousElementSibling;
      }
    }
  };
  var aria_default = ARIA;
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view().cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    },
    FocusWrap: {
      mounted() {
        this.focusStart = this.el.firstElementChild;
        this.focusEnd = this.el.lastElementChild;
        this.focusStart.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.nextElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusFirst(nextFocus);
          } else {
            aria_default.focusLast(this.el);
          }
        });
        this.focusEnd.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.previousElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusLast(nextFocus);
          } else {
            aria_default.focusFirst(this.el);
          }
        });
        this.el.addEventListener("phx:show-end", () => this.el.focus());
        if (window.getComputedStyle(this.el).display !== "none") {
          aria_default.focusFirst(this.el);
        }
      }
    }
  };
  var findScrollContainer = (el) => {
    if (["HTML", "BODY"].indexOf(el.nodeName.toUpperCase()) >= 0)
      return null;
    if (["scroll", "auto"].indexOf(getComputedStyle(el).overflowY) >= 0)
      return el;
    return findScrollContainer(el.parentElement);
  };
  var scrollTop = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.scrollTop;
    } else {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }
  };
  var bottom = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().bottom;
    } else {
      return window.innerHeight || document.documentElement.clientHeight;
    }
  };
  var top = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().top;
    } else {
      return 0;
    }
  };
  var isAtViewportTop = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  var isAtViewportBottom = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.bottom) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.bottom) <= bottom(scrollContainer);
  };
  var isWithinViewport = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  Hooks.InfiniteScroll = {
    mounted() {
      this.scrollContainer = findScrollContainer(this.el);
      let scrollBefore = scrollTop(this.scrollContainer);
      let topOverran = false;
      let throttleInterval = 500;
      let pendingOp = null;
      let onTopOverrun = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => true;
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id, _overran: true }, () => {
          pendingOp = null;
        });
      });
      let onFirstChildAtTop = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => firstChild.scrollIntoView({ block: "start" });
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(firstChild, this.scrollContainer)) {
              firstChild.scrollIntoView({ block: "start" });
            }
          });
        });
      });
      let onLastChildAtBottom = this.throttle(throttleInterval, (bottomEvent, lastChild) => {
        pendingOp = () => lastChild.scrollIntoView({ block: "end" });
        this.liveSocket.execJSHookPush(this.el, bottomEvent, { id: lastChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(lastChild, this.scrollContainer)) {
              lastChild.scrollIntoView({ block: "end" });
            }
          });
        });
      });
      this.onScroll = (_e) => {
        let scrollNow = scrollTop(this.scrollContainer);
        if (pendingOp) {
          scrollBefore = scrollNow;
          return pendingOp();
        }
        let rect = this.el.getBoundingClientRect();
        let topEvent = this.el.getAttribute(this.liveSocket.binding("viewport-top"));
        let bottomEvent = this.el.getAttribute(this.liveSocket.binding("viewport-bottom"));
        let lastChild = this.el.lastElementChild;
        let firstChild = this.el.firstElementChild;
        let isScrollingUp = scrollNow < scrollBefore;
        let isScrollingDown = scrollNow > scrollBefore;
        if (isScrollingUp && topEvent && !topOverran && rect.top >= 0) {
          topOverran = true;
          onTopOverrun(topEvent, firstChild);
        } else if (isScrollingDown && topOverran && rect.top <= 0) {
          topOverran = false;
        }
        if (topEvent && isScrollingUp && isAtViewportTop(firstChild, this.scrollContainer)) {
          onFirstChildAtTop(topEvent, firstChild);
        } else if (bottomEvent && isScrollingDown && isAtViewportBottom(lastChild, this.scrollContainer)) {
          onLastChildAtBottom(bottomEvent, lastChild);
        }
        scrollBefore = scrollNow;
      };
      if (this.scrollContainer) {
        this.scrollContainer.addEventListener("scroll", this.onScroll);
      } else {
        window.addEventListener("scroll", this.onScroll);
      }
    },
    destroyed() {
      if (this.scrollContainer) {
        this.scrollContainer.removeEventListener("scroll", this.onScroll);
      } else {
        window.removeEventListener("scroll", this.onScroll);
      }
    },
    throttle(interval, callback) {
      let lastCallAt = 0;
      let timer;
      return (...args) => {
        let now = Date.now();
        let remainingTime = interval - (now - lastCallAt);
        if (remainingTime <= 0 || remainingTime > interval) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          lastCallAt = now;
          callback(...args);
        } else if (!timer) {
          timer = setTimeout(() => {
            lastCallAt = Date.now();
            timer = null;
            callback(...args);
          }, remainingTime);
        }
      };
    }
  };
  var hooks_default = Hooks;
  var ElementRef = class {
    static onUnlock(el, callback) {
      if (!dom_default.isLocked(el) && !el.closest(`[${PHX_REF_LOCK}]`)) {
        return callback();
      }
      const closestLock = el.closest(`[${PHX_REF_LOCK}]`);
      const ref = closestLock.closest(`[${PHX_REF_LOCK}]`).getAttribute(PHX_REF_LOCK);
      closestLock.addEventListener(`phx:undo-lock:${ref}`, () => {
        callback();
      }, { once: true });
    }
    constructor(el) {
      this.el = el;
      this.loadingRef = el.hasAttribute(PHX_REF_LOADING) ? parseInt(el.getAttribute(PHX_REF_LOADING), 10) : null;
      this.lockRef = el.hasAttribute(PHX_REF_LOCK) ? parseInt(el.getAttribute(PHX_REF_LOCK), 10) : null;
    }
    maybeUndo(ref, phxEvent, eachCloneCallback) {
      if (!this.isWithin(ref)) {
        dom_default.updatePrivate(this.el, PHX_PENDING_REFS, [], (pendingRefs) => {
          pendingRefs.push(ref);
          return pendingRefs;
        });
        return;
      }
      this.undoLocks(ref, phxEvent, eachCloneCallback);
      this.undoLoading(ref, phxEvent);
      dom_default.updatePrivate(this.el, PHX_PENDING_REFS, [], (pendingRefs) => {
        return pendingRefs.filter((pendingRef) => {
          let opts = {
            detail: { ref: pendingRef, event: phxEvent },
            bubbles: true,
            cancelable: false
          };
          if (this.loadingRef && this.loadingRef > pendingRef) {
            this.el.dispatchEvent(new CustomEvent(`phx:undo-loading:${pendingRef}`, opts));
          }
          if (this.lockRef && this.lockRef > pendingRef) {
            this.el.dispatchEvent(new CustomEvent(`phx:undo-lock:${pendingRef}`, opts));
          }
          return pendingRef > ref;
        });
      });
      if (this.isFullyResolvedBy(ref)) {
        this.el.removeAttribute(PHX_REF_SRC);
      }
    }
    isWithin(ref) {
      return !(this.loadingRef !== null && this.loadingRef > ref && (this.lockRef !== null && this.lockRef > ref));
    }
    undoLocks(ref, phxEvent, eachCloneCallback) {
      if (!this.isLockUndoneBy(ref)) {
        return;
      }
      let clonedTree = dom_default.private(this.el, PHX_REF_LOCK);
      if (clonedTree) {
        eachCloneCallback(clonedTree);
        dom_default.deletePrivate(this.el, PHX_REF_LOCK);
      }
      this.el.removeAttribute(PHX_REF_LOCK);
      let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
      this.el.dispatchEvent(new CustomEvent(`phx:undo-lock:${this.lockRef}`, opts));
    }
    undoLoading(ref, phxEvent) {
      if (!this.isLoadingUndoneBy(ref)) {
        if (this.canUndoLoading(ref) && this.el.classList.contains("phx-submit-loading")) {
          this.el.classList.remove("phx-change-loading");
        }
        return;
      }
      if (this.canUndoLoading(ref)) {
        this.el.removeAttribute(PHX_REF_LOADING);
        let disabledVal = this.el.getAttribute(PHX_DISABLED);
        let readOnlyVal = this.el.getAttribute(PHX_READONLY);
        if (readOnlyVal !== null) {
          this.el.readOnly = readOnlyVal === "true" ? true : false;
          this.el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          this.el.disabled = disabledVal === "true" ? true : false;
          this.el.removeAttribute(PHX_DISABLED);
        }
        let disableRestore = this.el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          this.el.innerText = disableRestore;
          this.el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
        this.el.dispatchEvent(new CustomEvent(`phx:undo-loading:${this.loadingRef}`, opts));
      }
      PHX_EVENT_CLASSES.forEach((name) => {
        if (name !== "phx-submit-loading" || this.canUndoLoading(ref)) {
          dom_default.removeClass(this.el, name);
        }
      });
    }
    isLoadingUndoneBy(ref) {
      return this.loadingRef === null ? false : this.loadingRef <= ref;
    }
    isLockUndoneBy(ref) {
      return this.lockRef === null ? false : this.lockRef <= ref;
    }
    isFullyResolvedBy(ref) {
      return (this.loadingRef === null || this.loadingRef <= ref) && (this.lockRef === null || this.lockRef <= ref);
    }
    canUndoLoading(ref) {
      return this.lockRef === null || this.lockRef <= ref;
    }
  };
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
            if (!curChild) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        toNode = toNode.firstElementChild;
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var skipFromChildren = options.skipFromChildren || noop;
      var addChild = options.addChild || function(parent, child) {
        return parent.appendChild(child);
      };
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
          if (beforeUpdateResult === false) {
            return;
          } else if (beforeUpdateResult instanceof HTMLElement) {
            fromEl = beforeUpdateResult;
            indexTree(fromEl);
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var skipFrom = skipFromChildren(fromEl, toEl);
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (!skipFrom && curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                          curFromNodeKey = getNodeKey(curFromNodeChild);
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              if (!skipFrom) {
                addChild(fromEl, matchingFromEl);
              }
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                addChild(fromEl, curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    constructor(view, container, id, html, streams, targetCID, opts = {}) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.streams = streams;
      this.streamInserts = {};
      this.streamComponentRestore = {};
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.pendingRemoves = [];
      this.phxRemove = this.liveSocket.binding("remove");
      this.targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
      this.withChildren = opts.withChildren || opts.undoRef || false;
      this.undoRef = opts.undoRef;
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      let phxUpdate = this.liveSocket.binding(PHX_UPDATE);
      dom_default.all(this.container, `[${phxUpdate}=append] > *, [${phxUpdate}=prepend] > *`, (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform(isJoinPatch) {
      let { view, liveSocket: liveSocket2, html, container } = this;
      let targetContainer = this.targetContainer;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      if (this.isCIDPatch()) {
        const closestLock = targetContainer.closest(`[${PHX_REF_LOCK}]`);
        if (closestLock) {
          const clonedTree = dom_default.private(closestLock, PHX_REF_LOCK);
          if (clonedTree) {
            targetContainer = clonedTree.querySelector(`[data-phx-component="${this.targetCID}"]`);
          }
        }
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxViewportTop = liveSocket2.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = liveSocket2.binding(PHX_VIEWPORT_BOTTOM);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let externalFormTriggered = null;
      function morph(targetContainer2, source, withChildren = this.withChildren) {
        let morphCallbacks = {
          childrenOnly: targetContainer2.getAttribute(PHX_COMPONENT) === null && !withChildren,
          getNodeKey: (node) => {
            if (dom_default.isPhxDestroyed(node)) {
              return null;
            }
            if (isJoinPatch) {
              return node.id;
            }
            return node.id || node.getAttribute && node.getAttribute(PHX_MAGIC_ID);
          },
          skipFromChildren: (from) => {
            return from.getAttribute(phxUpdate) === PHX_STREAM;
          },
          addChild: (parent, child) => {
            let { ref, streamAt } = this.getStreamInsert(child);
            if (ref === void 0) {
              return parent.appendChild(child);
            }
            this.setStreamRef(child, ref);
            if (streamAt === 0) {
              parent.insertAdjacentElement("afterbegin", child);
            } else if (streamAt === -1) {
              let lastChild = parent.lastElementChild;
              if (lastChild && !lastChild.hasAttribute(PHX_STREAM_REF)) {
                let nonStreamChild = Array.from(parent.children).find((c) => !c.hasAttribute(PHX_STREAM_REF));
                parent.insertBefore(child, nonStreamChild);
              } else {
                parent.appendChild(child);
              }
            } else if (streamAt > 0) {
              let sibling = Array.from(parent.children)[streamAt];
              parent.insertBefore(child, sibling);
            }
          },
          onBeforeNodeAdded: (el) => {
            dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
            this.trackBefore("added", el);
            let morphedEl = el;
            if (this.streamComponentRestore[el.id]) {
              morphedEl = this.streamComponentRestore[el.id];
              delete this.streamComponentRestore[el.id];
              morph.call(this, morphedEl, el, true);
            }
            return morphedEl;
          },
          onNodeAdded: (el) => {
            if (el.getAttribute) {
              this.maybeReOrderStream(el, true);
            }
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => this.onNodeDiscarded(el),
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentElement !== null && el.id && dom_default.isPhxUpdate(el.parentElement, phxUpdate, [PHX_STREAM, "append", "prepend"])) {
              return false;
            }
            if (this.maybePendingRemove(el)) {
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
            this.maybeReOrderStream(el, false);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            if (fromEl.id && fromEl.isSameNode(targetContainer2) && fromEl.id !== toEl.id) {
              morphCallbacks.onNodeDiscarded(fromEl);
              fromEl.replaceWith(toEl);
              return morphCallbacks.onNodeAdded(toEl);
            }
            dom_default.syncPendingAttrs(fromEl, toEl);
            dom_default.maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom);
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              this.maybeReOrderStream(fromEl);
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              [PHX_SESSION, PHX_STATIC, PHX_ROOT_ID].map((attr) => [attr, fromEl.getAttribute(attr), toEl.getAttribute(attr)]).forEach(([attr, fromVal, toVal]) => {
                if (toVal && fromVal !== toVal) {
                  fromEl.setAttribute(attr, toVal);
                }
              });
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: dom_default.isIgnored(fromEl, phxUpdate) });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            let focusedSelectChanged = isFocusedFormEl && this.isChangedSelect(fromEl, toEl);
            if (fromEl.hasAttribute(PHX_REF_SRC)) {
              const ref = new ElementRef(fromEl);
              if (ref.lockRef && (!this.undoRef || !ref.isLockUndoneBy(this.undoRef))) {
                if (dom_default.isUploadInput(fromEl)) {
                  dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
                  this.trackBefore("updated", fromEl, toEl);
                  updates.push(fromEl);
                }
                dom_default.applyStickyOperations(fromEl);
                let isLocked = fromEl.hasAttribute(PHX_REF_LOCK);
                let clone2 = isLocked ? dom_default.private(fromEl, PHX_REF_LOCK) || fromEl.cloneNode(true) : null;
                if (clone2) {
                  dom_default.putPrivate(fromEl, PHX_REF_LOCK, clone2);
                  if (!isFocusedFormEl) {
                    fromEl = clone2;
                  }
                }
              }
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (this.undoRef && dom_default.private(toEl, PHX_REF_LOCK)) {
              dom_default.putPrivate(fromEl, PHX_REF_LOCK, dom_default.private(toEl, PHX_REF_LOCK));
            }
            dom_default.copyPrivates(toEl, fromEl);
            if (isFocusedFormEl && fromEl.type !== "hidden" && !focusedSelectChanged) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (focusedSelectChanged) {
                fromEl.blur();
              }
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return fromEl;
            }
          }
        };
        morphdom_esm_default(targetContainer2, source, morphCallbacks);
      }
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        this.streams.forEach(([ref, inserts, deleteIds, reset]) => {
          inserts.forEach(([key, streamAt, limit]) => {
            this.streamInserts[key] = { ref, streamAt, limit, reset };
          });
          if (reset !== void 0) {
            dom_default.all(container, `[${PHX_STREAM_REF}="${ref}"]`, (child) => {
              this.removeStreamChildElement(child);
            });
          }
          deleteIds.forEach((id) => {
            let child = container.querySelector(`[id="${id}"]`);
            if (child) {
              this.removeStreamChildElement(child);
            }
          });
        });
        if (isJoinPatch) {
          dom_default.all(this.container, `[${phxUpdate}=${PHX_STREAM}]`).filter((el) => this.view.ownsElement(el)).forEach((el) => {
            Array.from(el.children).forEach((child) => {
              this.removeStreamChildElement(child, true);
            });
          });
        }
        morph.call(this, targetContainer, html);
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
        detectInvalidStreamInserts(this.streamInserts);
        Array.from(document.querySelectorAll("input[name=id]")).forEach((node) => {
          if (node.form) {
            console.error('Detected an input with name="id" inside a form! This will cause problems when patching the DOM.\n', node);
          }
        });
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      this.transitionPendingRemoves();
      if (externalFormTriggered) {
        liveSocket2.unload();
        const submitter = dom_default.private(externalFormTriggered, "submitter");
        if (submitter && submitter.name && targetContainer.contains(submitter)) {
          const input = document.createElement("input");
          input.type = "hidden";
          const formId = submitter.getAttribute("form");
          if (formId) {
            input.setAttribute("form", formId);
          }
          input.name = submitter.name;
          input.value = submitter.value;
          submitter.parentElement.insertBefore(input, submitter);
        }
        Object.getPrototypeOf(externalFormTriggered).submit.call(externalFormTriggered);
      }
      return true;
    }
    onNodeDiscarded(el) {
      if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
        this.liveSocket.destroyViewByEl(el);
      }
      this.trackAfter("discarded", el);
    }
    maybePendingRemove(node) {
      if (node.getAttribute && node.getAttribute(this.phxRemove) !== null) {
        this.pendingRemoves.push(node);
        return true;
      } else {
        return false;
      }
    }
    removeStreamChildElement(child, force = false) {
      if (!force && !this.view.ownsElement(child)) {
        return;
      }
      if (this.streamInserts[child.id]) {
        this.streamComponentRestore[child.id] = child;
        child.remove();
      } else {
        if (!this.maybePendingRemove(child)) {
          child.remove();
          this.onNodeDiscarded(child);
        }
      }
    }
    getStreamInsert(el) {
      let insert = el.id ? this.streamInserts[el.id] : {};
      return insert || {};
    }
    setStreamRef(el, ref) {
      dom_default.putSticky(el, PHX_STREAM_REF, (el2) => el2.setAttribute(PHX_STREAM_REF, ref));
    }
    maybeReOrderStream(el, isNew) {
      let { ref, streamAt, reset } = this.getStreamInsert(el);
      if (streamAt === void 0) {
        return;
      }
      this.setStreamRef(el, ref);
      if (!reset && !isNew) {
        return;
      }
      if (!el.parentElement) {
        return;
      }
      if (streamAt === 0) {
        el.parentElement.insertBefore(el, el.parentElement.firstElementChild);
      } else if (streamAt > 0) {
        let children = Array.from(el.parentElement.children);
        let oldIndex = children.indexOf(el);
        if (streamAt >= children.length - 1) {
          el.parentElement.appendChild(el);
        } else {
          let sibling = children[streamAt];
          if (oldIndex > streamAt) {
            el.parentElement.insertBefore(el, sibling);
          } else {
            el.parentElement.insertBefore(el, sibling.nextElementSibling);
          }
        }
      }
      this.maybeLimitStream(el);
    }
    maybeLimitStream(el) {
      let { limit } = this.getStreamInsert(el);
      let children = limit !== null && Array.from(el.parentElement.children);
      if (limit && limit < 0 && children.length > limit * -1) {
        children.slice(0, children.length + limit).forEach((child) => this.removeStreamChildElement(child));
      } else if (limit && limit >= 0 && children.length > limit) {
        children.slice(limit).forEach((child) => this.removeStreamChildElement(child));
      }
    }
    transitionPendingRemoves() {
      let { pendingRemoves, liveSocket: liveSocket2 } = this;
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves, () => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
    }
    isChangedSelect(fromEl, toEl) {
      if (!(fromEl instanceof HTMLSelectElement) || fromEl.multiple) {
        return false;
      }
      if (fromEl.options.length !== toEl.options.length) {
        return true;
      }
      toEl.value = fromEl.value;
      return !fromEl.isEqualNode(toEl);
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.hasAttribute(PHX_SKIP);
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    indexOf(parent, child) {
      return Array.from(parent.children).indexOf(child);
    }
  };
  var VOID_TAGS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  var quoteChars = /* @__PURE__ */ new Set(["'", '"']);
  var modifyRoot = (html, attrs, clearInnerHTML) => {
    let i = 0;
    let insideComment = false;
    let beforeTag, afterTag, tag, tagNameEndsAt, id, newHTML;
    let lookahead = html.match(/^(\s*(?:<!--.*?-->\s*)*)<([^\s\/>]+)/);
    if (lookahead === null) {
      throw new Error(`malformed html ${html}`);
    }
    i = lookahead[0].length;
    beforeTag = lookahead[1];
    tag = lookahead[2];
    tagNameEndsAt = i;
    for (i; i < html.length; i++) {
      if (html.charAt(i) === ">") {
        break;
      }
      if (html.charAt(i) === "=") {
        let isId = html.slice(i - 3, i) === " id";
        i++;
        let char = html.charAt(i);
        if (quoteChars.has(char)) {
          let attrStartsAt = i;
          i++;
          for (i; i < html.length; i++) {
            if (html.charAt(i) === char) {
              break;
            }
          }
          if (isId) {
            id = html.slice(attrStartsAt + 1, i);
            break;
          }
        }
      }
    }
    let closeAt = html.length - 1;
    insideComment = false;
    while (closeAt >= beforeTag.length + tag.length) {
      let char = html.charAt(closeAt);
      if (insideComment) {
        if (char === "-" && html.slice(closeAt - 3, closeAt) === "<!-") {
          insideComment = false;
          closeAt -= 4;
        } else {
          closeAt -= 1;
        }
      } else if (char === ">" && html.slice(closeAt - 2, closeAt) === "--") {
        insideComment = true;
        closeAt -= 3;
      } else if (char === ">") {
        break;
      } else {
        closeAt -= 1;
      }
    }
    afterTag = html.slice(closeAt + 1, html.length);
    let attrsStr = Object.keys(attrs).map((attr) => attrs[attr] === true ? attr : `${attr}="${attrs[attr]}"`).join(" ");
    if (clearInnerHTML) {
      let idAttrStr = id ? ` id="${id}"` : "";
      if (VOID_TAGS.has(tag)) {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}/>`;
      } else {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}></${tag}>`;
      }
    } else {
      let rest = html.slice(tagNameEndsAt, closeAt + 1);
      newHTML = `<${tag}${attrsStr === "" ? "" : " "}${attrsStr}${rest}`;
    }
    return [newHTML, beforeTag, afterTag];
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.magicId = 0;
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      let [str, streams] = this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids, true, {});
      return [str, streams];
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids, changeTracking, rootAttrs) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids, streams: /* @__PURE__ */ new Set() };
      this.toOutputBuffer(rendered, null, output, changeTracking, rootAttrs);
      return [output.buffer, output.streams];
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    resetRender(cid) {
      if (this.rendered[COMPONENTS][cid]) {
        this.rendered[COMPONENTS][cid].reset = true;
      }
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff, true);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 || oldc[cid] === void 0 ? cdiff : this.cloneMerge(oldc[cid], cdiff, false);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        let isObjVal = isObject(val);
        if (isObjVal && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
      if (target[ROOT]) {
        target.newRender = true;
      }
    }
    cloneMerge(target, source, pruneMagicId) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val, pruneMagicId);
        } else if (val === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, {}, pruneMagicId);
        }
      }
      if (pruneMagicId) {
        delete merged.magicId;
        delete merged.newRender;
      } else if (target[ROOT]) {
        merged.newRender = true;
      }
      return merged;
    }
    componentToString(cid) {
      let [str, streams] = this.recursiveCIDToString(this.rendered[COMPONENTS], cid, null);
      let [strippedHTML, _before, _after] = modifyRoot(str, {});
      return [strippedHTML, streams];
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    nextMagicID() {
      this.magicId++;
      return `m${this.magicId}-${this.parentViewId()}`;
    }
    toOutputBuffer(rendered, templates, output, changeTracking, rootAttrs = {}) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let isRoot = rendered[ROOT];
      let prevBuffer = output.buffer;
      if (isRoot) {
        output.buffer = "";
      }
      if (changeTracking && isRoot && !rendered.magicId) {
        rendered.newRender = true;
        rendered.magicId = this.nextMagicID();
      }
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output, changeTracking);
        output.buffer += statics[i];
      }
      if (isRoot) {
        let skip = false;
        let attrs;
        if (changeTracking || rendered.magicId) {
          skip = changeTracking && !rendered.newRender;
          attrs = __spreadValues({ [PHX_MAGIC_ID]: rendered.magicId }, rootAttrs);
        } else {
          attrs = rootAttrs;
        }
        if (skip) {
          attrs[PHX_SKIP] = true;
        }
        let [newRoot, commentBefore, commentAfter] = modifyRoot(output.buffer, attrs, skip);
        rendered.newRender = false;
        output.buffer = prevBuffer + commentBefore + newRoot + commentAfter;
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics, [STREAM]: stream } = rendered;
      let [_ref, _inserts, deleteIds, reset] = stream || [null, {}, [], null];
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          let changeTracking = false;
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output, changeTracking);
          output.buffer += statics[i];
        }
      }
      if (stream !== void 0 && (rendered[DYNAMICS].length > 0 || deleteIds.length > 0 || reset)) {
        delete rendered[STREAM];
        rendered[DYNAMICS] = [];
        output.streams.add(stream);
      }
    }
    dynamicToBuffer(rendered, templates, output, changeTracking) {
      if (typeof rendered === "number") {
        let [str, streams] = this.recursiveCIDToString(output.components, rendered, output.onlyCids);
        output.buffer += str;
        output.streams = /* @__PURE__ */ new Set([...output.streams, ...streams]);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output, changeTracking, {});
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let attrs = { [PHX_COMPONENT]: cid };
      let skip = onlyCids && !onlyCids.has(cid);
      component.newRender = !skip;
      component.magicId = `c${cid}-${this.parentViewId()}`;
      let changeTracking = !component.reset;
      let [html, streams] = this.recursiveToString(component, components, onlyCids, changeTracking, attrs);
      delete component.reset;
      return [html, streams];
    }
  };
  var focusStack = [];
  var default_transition_time = 200;
  var JS = {
    exec(e, eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, { callback: defaults && defaults.callback }];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind) {
          args = __spreadValues(__spreadValues({}, defaultArgs), args);
          args.callback = args.callback || defaultArgs.callback;
        }
        this.filterToEls(view.liveSocket, sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](e, eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    isInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      return rect.right > 0 && rect.bottom > 0 && rect.left < windowWidth && rect.top < windowHeight;
    },
    exec_exec(e, eventType, phxEvent, view, sourceEl, el, { attr, to }) {
      let encodedJS = el.getAttribute(attr);
      if (!encodedJS) {
        throw new Error(`expected ${attr} to contain JS command on "${to}"`);
      }
      view.liveSocket.execJS(el, encodedJS, eventType);
    },
    exec_dispatch(e, eventType, phxEvent, view, sourceEl, el, { event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(e, eventType, phxEvent, view, sourceEl, el, args) {
      let { event, data, target, page_loading, loading, value, dispatcher, callback } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      const handler = (targetView, targetCtx) => {
        if (!targetView.isConnected()) {
          return;
        }
        if (eventType === "change") {
          let { newCid, _target } = args;
          _target = _target || (dom_default.isFormInput(sourceEl) ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          let { submitter } = args;
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, submitter, pushOpts, callback);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts, callback);
        }
      };
      if (args.targetView && args.targetCtx) {
        handler(args.targetView, args.targetCtx);
      } else {
        view.withinTargets(phxTarget, handler);
      }
    },
    exec_navigate(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.historyRedirect(e, href, replace ? "replace" : "push", null, sourceEl);
    },
    exec_patch(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.pushHistoryPatch(e, href, replace ? "replace" : "push", sourceEl);
    },
    exec_focus(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.attemptFocus(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.attemptFocus(el));
      });
    },
    exec_focus_first(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el));
      });
    },
    exec_push_focus(e, eventType, phxEvent, view, sourceEl, el) {
      focusStack.push(el || sourceEl);
    },
    exec_pop_focus(_e, _eventType, _phxEvent, _view, _sourceEl, _el) {
      const el = focusStack.pop();
      if (el) {
        el.focus();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => el.focus());
        });
      }
    },
    exec_add_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view, blocking);
    },
    exec_remove_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view, blocking);
    },
    exec_toggle_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.toggleClasses(el, names, transition, time, view, blocking);
    },
    exec_toggle_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val1, val2] }) {
      this.toggleAttr(el, attr, val1, val2);
    },
    exec_transition(e, eventType, phxEvent, view, sourceEl, el, { time, transition, blocking }) {
      this.addOrRemoveClasses(el, [], [], transition, time, view, blocking);
    },
    exec_toggle(e, eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time, blocking }) {
      this.toggle(eventType, view, el, display, ins, outs, time, blocking);
    },
    exec_show(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.show(eventType, view, el, display, transition, time, blocking);
    },
    exec_hide(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.hide(eventType, view, el, display, transition, time, blocking);
    },
    exec_set_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(e, eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    show(eventType, view, el, display, transition, time, blocking) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time, blocking);
      }
    },
    hide(eventType, view, el, display, transition, time, blocking) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time, blocking);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time, blocking) {
      time = time || default_transition_time;
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            const stickyDisplay = display || this.defaultDisplay(el);
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => {
                dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
                this.addOrRemoveClasses(el, inEndClasses, inStartClasses);
              });
            });
          };
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          };
          el.dispatchEvent(new Event("phx:show-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            let stickyDisplay = display || this.defaultDisplay(el);
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    toggleClasses(el, classes, transition, time, view, blocking) {
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let newAdds = classes.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let newRemoves = classes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        this.addOrRemoveClasses(el, newAdds, newRemoves, transition, time, view, blocking);
      });
    },
    toggleAttr(el, attr, val1, val2) {
      if (el.hasAttribute(attr)) {
        if (val2 !== void 0) {
          if (el.getAttribute(attr) === val1) {
            this.setOrRemoveAttrs(el, [[attr, val2]], []);
          } else {
            this.setOrRemoveAttrs(el, [[attr, val1]], []);
          }
        } else {
          this.setOrRemoveAttrs(el, [], [attr]);
        }
      } else {
        this.setOrRemoveAttrs(el, [[attr, val1]], []);
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view, blocking) {
      time = time || default_transition_time;
      let [transitionRun, transitionStart, transitionEnd] = transition || [[], [], []];
      if (transitionRun.length > 0) {
        let onStart = () => {
          this.addOrRemoveClasses(el, transitionStart, [].concat(transitionRun).concat(transitionEnd));
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, transitionRun, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, transitionEnd, transitionStart));
          });
        };
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transitionEnd), removes.concat(transitionRun).concat(transitionStart));
        if (blocking === false) {
          onStart();
          setTimeout(onDone, time);
        } else {
          view.transition(time, onStart, onDone);
        }
        return;
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(liveSocket2, sourceEl, { to }) {
      let defaultQuery = () => {
        if (typeof to === "string") {
          return document.querySelectorAll(to);
        } else if (to.closest) {
          let toEl = sourceEl.closest(to.closest);
          return toEl ? [toEl] : [];
        } else if (to.inner) {
          return sourceEl.querySelectorAll(to.inner);
        }
      };
      return to ? liveSocket2.jsQuerySelectorAll(sourceEl, to, defaultQuery) : [sourceEl];
    },
    defaultDisplay(el) {
      return { tr: "table-row", td: "table-cell" }[el.tagName.toLowerCase()] || "block";
    },
    transitionClasses(val) {
      if (!val) {
        return null;
      }
      let [trans, tStart, tEnd] = Array.isArray(val) ? val : [val.split(" "), [], []];
      trans = Array.isArray(trans) ? trans : trans.split(" ");
      tStart = Array.isArray(tStart) ? tStart : tStart.split(" ");
      tEnd = Array.isArray(tEnd) ? tEnd : tEnd.split(" ");
      return [trans, tStart, tEnd];
    }
  };
  var js_default = JS;
  var HOOK_ID = "hookId";
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return dom_default.private(el, HOOK_ID);
    }
    constructor(view, el, callbacks) {
      this.el = el;
      this.__attachView(view);
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      dom_default.putPrivate(this.el, HOOK_ID, this.constructor.makeID());
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __attachView(view) {
      if (view) {
        this.__view = () => view;
        this.liveSocket = view.liveSocket;
      } else {
        this.__view = () => {
          throw new Error(`hook not yet attached to a live view: ${this.el.outerHTML}`);
        };
        this.liveSocket = null;
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
      dom_default.deletePrivate(this.el, HOOK_ID);
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    js() {
      let hook = this;
      return {
        exec(encodedJS) {
          hook.__view().liveSocket.execJS(hook.el, encodedJS, "hook");
        },
        show(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.show("hook", owner, el, opts.display, opts.transition, opts.time, opts.blocking);
        },
        hide(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.hide("hook", owner, el, null, opts.transition, opts.time, opts.blocking);
        },
        toggle(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          opts.in = js_default.transitionClasses(opts.in);
          opts.out = js_default.transitionClasses(opts.out);
          js_default.toggle("hook", owner, el, opts.display, opts.in, opts.out, opts.time, opts.blocking);
        },
        addClass(el, names, opts = {}) {
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, names, [], opts.transition, opts.time, owner, opts.blocking);
        },
        removeClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], names, opts.transition, opts.time, owner, opts.blocking);
        },
        toggleClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.toggleClasses(el, names, opts.transition, opts.time, owner, opts.blocking);
        },
        transition(el, transition, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], [], js_default.transitionClasses(transition), opts.time, owner, opts.blocking);
        },
        setAttribute(el, attr, val) {
          js_default.setOrRemoveAttrs(el, [[attr, val]], []);
        },
        removeAttribute(el, attr) {
          js_default.setOrRemoveAttrs(el, [], [attr]);
        },
        toggleAttribute(el, attr, val1, val2) {
          js_default.toggleAttr(el, attr, val1, val2);
        }
      };
    }
    pushEvent(event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            const ref = this.__view().pushHookEvent(this.el, null, event, payload, (reply, _ref) => resolve(reply));
            if (ref === false) {
              reject(new Error("unable to push hook event. LiveView not connected"));
            }
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().pushHookEvent(this.el, null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            this.__view().withinTargets(phxTarget, (view, targetCtx) => {
              const ref = view.pushHookEvent(this.el, targetCtx, event, payload, (reply, _ref) => resolve(reply));
              if (ref === false) {
                reject(new Error("unable to push hook event. LiveView not connected"));
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(this.el, targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view().dispatchUploads(null, name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        view.dispatchUploads(targetCtx, name, files);
      });
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var prependFormDataKey = (key, prefix) => {
    let isArray = key.endsWith("[]");
    let baseKey = isArray ? key.slice(0, -2) : key;
    baseKey = baseKey.replace(/([^\[\]]+)(\]?$)/, `${prefix}$1$2`);
    if (isArray) {
      baseKey += "[]";
    }
    return baseKey;
  };
  var serializeForm = (form, opts, onlyNames = []) => {
    const { submitter } = opts;
    let injectedElement;
    if (submitter && submitter.name) {
      const input = document.createElement("input");
      input.type = "hidden";
      const formId = submitter.getAttribute("form");
      if (formId) {
        input.setAttribute("form", formId);
      }
      input.name = submitter.name;
      input.value = submitter.value;
      submitter.parentElement.insertBefore(input, submitter);
      injectedElement = input;
    }
    const formData = new FormData(form);
    const toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    const params = new URLSearchParams();
    const { inputsUnused, onlyHiddenInputs } = Array.from(form.elements).reduce((acc, input) => {
      const { inputsUnused: inputsUnused2, onlyHiddenInputs: onlyHiddenInputs2 } = acc;
      const key = input.name;
      if (!key) {
        return acc;
      }
      if (inputsUnused2[key] === void 0) {
        inputsUnused2[key] = true;
      }
      if (onlyHiddenInputs2[key] === void 0) {
        onlyHiddenInputs2[key] = true;
      }
      const isUsed = dom_default.private(input, PHX_HAS_FOCUSED) || dom_default.private(input, PHX_HAS_SUBMITTED);
      const isHidden = input.type === "hidden";
      inputsUnused2[key] = inputsUnused2[key] && !isUsed;
      onlyHiddenInputs2[key] = onlyHiddenInputs2[key] && isHidden;
      return acc;
    }, { inputsUnused: {}, onlyHiddenInputs: {} });
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        let isUnused = inputsUnused[key];
        let hidden = onlyHiddenInputs[key];
        if (isUnused && !(submitter && submitter.name == key) && !hidden) {
          params.append(prependFormDataKey(key, "_unused_"), "");
        }
        params.append(key, val);
      }
    }
    if (submitter && injectedElement) {
      submitter.parentElement.removeChild(injectedElement);
    }
    return params.toString();
  };
  var View = class _View {
    static closestView(el) {
      let liveViewEl = el.closest(PHX_VIEW_SELECTOR);
      return liveViewEl ? dom_default.private(liveViewEl, "view") : null;
    }
    constructor(el, liveSocket2, parentView, flash, liveReferer) {
      this.isDead = false;
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      dom_default.putPrivate(this.el, "view", this);
      this.id = this.el.id;
      this.ref = 0;
      this.lastAckRef = null;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.disconnectedTimer = null;
      this.pendingDiffs = [];
      this.pendingForms = /* @__PURE__ */ new Set();
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinAttempts = 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.formsForRecovery = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        let url = this.href && this.expandURL(this.href);
        return {
          redirect: this.redirect ? url : void 0,
          url: this.redirect ? void 0 : url || void 0,
          params: this.connectParams(liveReferer),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash,
          sticky: this.el.hasAttribute(PHX_STICKY)
        };
      });
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.hasAttribute(PHX_MAIN);
    }
    connectParams(liveReferer) {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      params["_mount_attempts"] = this.joinAttempts;
      params["_live_referer"] = liveReferer;
      this.joinAttempts++;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(PHX_CONNECTED_CLASS, PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS, PHX_SERVER_ERROR_CLASS);
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_LOADING_CLASS);
      }
    }
    execAll(binding) {
      dom_default.all(this.el, `[${binding}]`, (el) => this.liveSocket.execJS(el, el.getAttribute(binding)));
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      clearTimeout(this.disconnectedTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
      this.execAll(this.binding("connected"));
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    withinTargets(phxTarget, callback, dom = document, viewEl) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(viewEl || this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(dom.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      callback({ diff, reply, events });
      if (typeof title === "string" || type == "mount") {
        window.requestAnimationFrame(() => dom_default.putTitle(title));
      }
    }
    onJoin(resp) {
      let { rendered, container, liveview_version } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      if (this.root === this) {
        this.formsForRecovery = this.getFormsForRecovery();
      }
      if (this.isMain() && window.history.state === null) {
        browser_default.pushState("replace", {
          type: "patch",
          id: this.id,
          position: this.liveSocket.currentHistoryPosition
        });
      }
      if (liveview_version !== this.liveSocket.version()) {
        console.error(`LiveView asset version mismatch. JavaScript version ${this.liveSocket.version()} vs. server ${liveview_version}. To avoid issues, please ensure that your assets use the same version as the server.`);
      }
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let [html, streams] = this.renderContainer(null, "join");
        this.dropPendingRefs();
        this.joinCount++;
        this.joinAttempts = 0;
        this.maybeRecoverForms(html, () => {
          this.onJoinComplete(resp, html, streams, events);
        });
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (el) => {
        el.removeAttribute(PHX_REF_LOADING);
        el.removeAttribute(PHX_REF_SRC);
        el.removeAttribute(PHX_REF_LOCK);
      });
    }
    onJoinComplete({ live_patch }, html, streams, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, streams, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        if (fromEl) {
          fromEl.setAttribute(PHX_ROOT_ID, this.root.id);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, streams, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    execNewMounted(parent = this.el) {
      let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
      dom_default.all(parent, `[${phxViewportTop}], [${phxViewportBottom}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          dom_default.maintainPrivateHooks(hookEl, hookEl, phxViewportTop, phxViewportBottom);
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_MOUNTED)}]`, (el) => {
        if (this.ownsElement(el)) {
          this.maybeMounted(el);
        }
      });
    }
    applyJoinPatch(live_patch, html, streams, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false, true);
      this.joinNewChildren();
      this.execNewMounted();
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    maybeMounted(el) {
      let phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
      let hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
      if (phxMounted && !hasBeenInvoked) {
        this.liveSocket.execJS(el, phxMounted);
        dom_default.putPrivate(el, "mounted", true);
      }
    }
    maybeAddNewHook(el) {
      let newHook = this.addHook(el);
      if (newHook) {
        newHook.__mounted();
      }
    }
    performPatch(patch, pruneCids, isJoinPatch = false) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      this.liveSocket.triggerDOM("onPatchStart", [patch.targetContainer]);
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
        let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
        dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
        this.maybeAddNewHook(el);
        if (el.getAttribute) {
          this.maybeMounted(el);
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform(isJoinPatch);
      this.afterElementsRemoved(removedEls, pruneCids);
      this.liveSocket.triggerDOM("onPatchEnd", [patch.targetContainer]);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-hook]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    maybeRecoverForms(html, callback) {
      const phxChange = this.binding("change");
      const oldForms = this.root.formsForRecovery;
      let template = document.createElement("template");
      template.innerHTML = html;
      const rootEl = template.content.firstElementChild;
      rootEl.id = this.id;
      rootEl.setAttribute(PHX_ROOT_ID, this.root.id);
      rootEl.setAttribute(PHX_SESSION, this.getSession());
      rootEl.setAttribute(PHX_STATIC, this.getStatic());
      rootEl.setAttribute(PHX_PARENT_ID, this.parent ? this.parent.id : null);
      const formsToRecover = dom_default.all(template.content, "form").filter((newForm) => newForm.id && oldForms[newForm.id]).filter((newForm) => !this.pendingForms.has(newForm.id)).filter((newForm) => oldForms[newForm.id].getAttribute(phxChange) === newForm.getAttribute(phxChange)).map((newForm) => {
        return [oldForms[newForm.id], newForm];
      });
      if (formsToRecover.length === 0) {
        return callback();
      }
      formsToRecover.forEach(([oldForm, newForm], i) => {
        this.pendingForms.add(newForm.id);
        this.pushFormRecovery(oldForm, newForm, template.content.firstElementChild, () => {
          this.pendingForms.delete(newForm.id);
          if (i === formsToRecover.length - 1) {
            callback();
          }
        });
      });
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      var _a;
      if (el.id === this.id) {
        return this;
      } else {
        return (_a = this.children[el.getAttribute(PHX_PARENT_ID)]) == null ? void 0 : _a[el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new _View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.pendingForms.clear();
      this.formsForRecovery = {};
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events, isPending = false) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
        if (!isPending) {
          this.pendingDiffs.push({ diff, events });
        }
        return false;
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findExistingParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let [html, streams] = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
      return true;
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff) : null;
        let [html, streams] = this.rendered.toString(cids);
        return [`<${tag}>${html}</${tag}>`, streams];
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let [html, streams] = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, streams, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      let hookElId = ViewHook.elementID(el);
      if (el.getAttribute && !this.ownsElement(el)) {
        return;
      }
      if (hookElId && !this.viewHooks[hookElId]) {
        let hook = dom_default.getCustomElHook(el) || logError(`no hook found for custom element: ${el.id}`);
        this.viewHooks[hookElId] = hook;
        hook.__attachView(this);
        return hook;
      } else if (hookElId || !el.getAttribute) {
        return;
      } else {
        let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
        let callbacks = this.liveSocket.getHookCallbacks(hookName);
        if (callbacks) {
          if (!el.id) {
            logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
          }
          let hook = new ViewHook(this, el, callbacks);
          this.viewHooks[ViewHook.elementID(hook.el)] = hook;
          return hook;
        } else if (hookName !== null) {
          logError(`unknown hook found for "${hookName}"`, el);
        }
      }
    }
    destroyHook(hook) {
      const hookId = ViewHook.elementID(hook.el);
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[hookId];
    }
    applyPendingUpdates() {
      this.pendingDiffs = this.pendingDiffs.filter(({ diff, events }) => !this.update(diff, events, true));
      this.eachChild((child) => child.applyPendingUpdates());
    }
    eachChild(callback) {
      let children = this.root.children[this.id] || {};
      for (let id in children) {
        callback(this.getChildById(id));
      }
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      this.eachChild((child) => child.destroy());
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      let e = new CustomEvent("phx:server-navigate", { detail: { to, kind, flash } });
      this.liveSocket.historyRedirect(e, url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash, reloadToken }) {
      this.liveSocket.redirect(to, flash, reloadToken);
    }
    isDestroyed() {
      return this.destroyed;
    }
    joinDead() {
      this.isDead = true;
    }
    joinPush() {
      this.joinPush = this.joinPush || this.channel.join();
      return this.joinPush;
    }
    join(callback) {
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.wrapPush(() => this.channel.join(), {
        ok: (resp) => this.liveSocket.requestDOMUpdate(() => this.onJoin(resp)),
        error: (error) => this.onJoinError(error),
        timeout: () => this.onJoinError({ reason: "timeout" })
      });
    }
    onJoinError(resp) {
      if (resp.reason === "reload") {
        this.log("error", () => [`failed mount with ${resp.status}. Falling back to page reload`, resp]);
        this.onRedirect({ to: this.root.href, reloadToken: resp.token });
        return;
      } else if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        this.onRedirect({ to: this.root.href, flash: this.flash });
        return;
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      if (this.isMain()) {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        if (this.liveSocket.isConnected()) {
          this.liveSocket.reloadWithJitter(this);
        }
      } else {
        if (this.joinAttempts >= MAX_CHILD_JOIN_ATTEMPTS) {
          this.root.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.log("error", () => [`giving up trying to mount after ${MAX_CHILD_JOIN_ATTEMPTS} tries`, resp]);
          this.destroy();
        }
        let trueChildEl = dom_default.byId(this.el.id);
        if (trueChildEl) {
          dom_default.mergeAttrs(trueChildEl, this.el);
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.el = trueChildEl;
        } else {
          this.destroy();
        }
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.isMain() && this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        if (this.liveSocket.isConnected()) {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        } else {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS]);
        }
      }
    }
    displayError(classes) {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(...classes);
      this.delayedDisconnected();
    }
    delayedDisconnected() {
      this.disconnectedTimer = setTimeout(() => {
        this.execAll(this.binding("disconnected"));
      }, this.liveSocket.disconnectedTimeout);
    }
    wrapPush(callerPush, receives) {
      let latency = this.liveSocket.getLatencySim();
      let withLatency = latency ? (cb) => setTimeout(() => !this.isDestroyed() && cb(), latency) : (cb) => !this.isDestroyed() && cb();
      withLatency(() => {
        callerPush().receive("ok", (resp) => withLatency(() => receives.ok && receives.ok(resp))).receive("error", (reason) => withLatency(() => receives.error && receives.error(reason))).receive("timeout", () => withLatency(() => receives.timeout && receives.timeout()));
      });
    }
    pushWithReply(refGenerator, event, payload) {
      if (!this.isConnected()) {
        return Promise.reject({ error: "noconnection" });
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let oldJoinCount = this.joinCount;
      let onLoadingDone = function() {
      };
      if (opts.page_loading) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return new Promise((resolve, reject) => {
        this.wrapPush(() => this.channel.push(event, payload, PUSH_TIMEOUT), {
          ok: (resp) => {
            if (ref !== null) {
              this.lastAckRef = ref;
            }
            let finish = (hookReply) => {
              if (resp.redirect) {
                this.onRedirect(resp.redirect);
              }
              if (resp.live_patch) {
                this.onLivePatch(resp.live_patch);
              }
              if (resp.live_redirect) {
                this.onLiveRedirect(resp.live_redirect);
              }
              onLoadingDone();
              resolve({ resp, reply: hookReply });
            };
            if (resp.diff) {
              this.liveSocket.requestDOMUpdate(() => {
                this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
                  if (ref !== null) {
                    this.undoRefs(ref, payload.event);
                  }
                  this.update(diff, events);
                  finish(reply);
                });
              });
            } else {
              if (ref !== null) {
                this.undoRefs(ref, payload.event);
              }
              finish(null);
            }
          },
          error: (reason) => reject({ error: reason }),
          timeout: () => {
            reject({ timeout: true });
            if (this.joinCount === oldJoinCount) {
              this.liveSocket.reloadWithJitter(this, () => {
                this.log("timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          }
        });
      });
    }
    undoRefs(ref, phxEvent, onlyEls) {
      if (!this.isConnected()) {
        return;
      }
      let selector = `[${PHX_REF_SRC}="${this.refSrc()}"]`;
      if (onlyEls) {
        onlyEls = new Set(onlyEls);
        dom_default.all(document, selector, (parent) => {
          if (onlyEls && !onlyEls.has(parent)) {
            return;
          }
          dom_default.all(parent, selector, (child) => this.undoElRef(child, ref, phxEvent));
          this.undoElRef(parent, ref, phxEvent);
        });
      } else {
        dom_default.all(document, selector, (el) => this.undoElRef(el, ref, phxEvent));
      }
    }
    undoElRef(el, ref, phxEvent) {
      let elRef = new ElementRef(el);
      elRef.maybeUndo(ref, phxEvent, (clonedTree) => {
        let patch = new DOMPatch(this, el, this.id, clonedTree, [], null, { undoRef: ref });
        const phxChildrenAdded = this.performPatch(patch, true);
        dom_default.all(el, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (child) => this.undoElRef(child, ref, phxEvent));
        if (phxChildrenAdded) {
          this.joinNewChildren();
        }
      });
    }
    refSrc() {
      return this.el.id;
    }
    putRef(elements, phxEvent, eventType, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        let loadingEls = dom_default.all(document, opts.loading).map((el) => {
          return { el, lock: true, loading: true };
        });
        elements = elements.concat(loadingEls);
      }
      for (let { el, lock, loading } of elements) {
        if (!lock && !loading) {
          throw new Error("putRef requires lock or loading");
        }
        el.setAttribute(PHX_REF_SRC, this.refSrc());
        if (loading) {
          el.setAttribute(PHX_REF_LOADING, newRef);
        }
        if (lock) {
          el.setAttribute(PHX_REF_LOCK, newRef);
        }
        if (!loading || opts.submitter && !(el === opts.submitter || el === opts.form)) {
          continue;
        }
        let lockCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-lock:${newRef}`, () => resolve(detail), { once: true });
        });
        let loadingCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-loading:${newRef}`, () => resolve(detail), { once: true });
        });
        el.classList.add(`phx-${eventType}-loading`);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute(PHX_DISABLED, el.getAttribute(PHX_DISABLED) || el.disabled);
          el.setAttribute("disabled", "");
        }
        let detail = {
          event: phxEvent,
          eventType,
          ref: newRef,
          isLoading: loading,
          isLocked: lock,
          lockElements: elements.filter(({ lock: lock2 }) => lock2).map(({ el: el2 }) => el2),
          loadingElements: elements.filter(({ loading: loading2 }) => loading2).map(({ el: el2 }) => el2),
          unlock: (els) => {
            els = Array.isArray(els) ? els : [els];
            this.undoRefs(newRef, phxEvent, els);
          },
          lockComplete: lockCompletePromise,
          loadingComplete: loadingCompletePromise,
          lock: (lockEl) => {
            return new Promise((resolve) => {
              if (this.isAcked(newRef)) {
                return resolve(detail);
              }
              lockEl.setAttribute(PHX_REF_LOCK, newRef);
              lockEl.setAttribute(PHX_REF_SRC, this.refSrc());
              lockEl.addEventListener(`phx:lock-stop:${newRef}`, () => resolve(detail), { once: true });
            });
          }
        };
        el.dispatchEvent(new CustomEvent("phx:push", {
          detail,
          bubbles: true,
          cancelable: false
        }));
        if (phxEvent) {
          el.dispatchEvent(new CustomEvent(`phx:push:${phxEvent}`, {
            detail,
            bubbles: true,
            cancelable: false
          }));
        }
      }
      return [newRef, elements.map(({ el }) => el), opts];
    }
    isAcked(ref) {
      return this.lastAckRef !== null && this.lastAckRef >= ref;
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = opts.target || target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(el, targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([{ el, loading: true, lock: true }], event, "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }).then(({ resp: _resp, reply: hookReply }) => onReply(hookReply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0 && !(el instanceof HTMLFormElement)) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}, onReply) {
      this.pushWithReply(() => this.putRef([{ el, loading: true, lock: true }], phxEvent, type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      }).then(({ reply }) => onReply && onReply(reply)).catch((error) => logError("Failed to push event", error));
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push file progress", error));
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      if (!inputEl.form) {
        throw new Error("form events require the input to be inside a form");
      }
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx, opts);
      let refGenerator = () => {
        return this.putRef([
          { el: inputEl, loading: true, lock: true },
          { el: inputEl.form, loading: true, lock: true }
        ], phxEvent, "change", opts);
      };
      let formData;
      let meta = this.extractMeta(inputEl.form, {}, opts.value);
      let serializeOpts = {};
      if (inputEl instanceof HTMLButtonElement) {
        serializeOpts.submitter = inputEl;
      }
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, serializeOpts, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, serializeOpts);
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        meta: __spreadValues({
          _target: opts._target || "undefined"
        }, meta),
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event).then(({ resp }) => {
        if (dom_default.isUploadInput(inputEl) && dom_default.isAutoUpload(inputEl)) {
          ElementRef.onUnlock(inputEl, () => {
            if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
              let [ref, _els] = refGenerator();
              this.undoRefs(ref, phxEvent, [inputEl.form]);
              this.uploadFiles(inputEl.form, phxEvent, targetCtx, ref, cid, (_uploads) => {
                callback && callback(resp);
                this.triggerAwaitingSubmit(inputEl.form, phxEvent);
                this.undoRefs(ref, phxEvent);
              });
            }
          });
        } else {
          callback && callback(resp);
        }
      }).catch((error) => logError("Failed to push input event", error));
    }
    triggerAwaitingSubmit(formEl, phxEvent) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl, phxEvent);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl, phxEvent) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _opts, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref, phxEvent);
          return false;
        } else {
          return true;
        }
      });
    }
    disableForm(formEl, phxEvent, opts = {}) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let formElements = Array.from(formEl.elements);
      let disables = formElements.filter(filterDisables);
      let buttons = formElements.filter(filterButton).filter(filterIgnored);
      let inputs = formElements.filter(filterInput).filter(filterIgnored);
      buttons.forEach((button) => {
        button.setAttribute(PHX_DISABLED, button.disabled);
        button.disabled = true;
      });
      inputs.forEach((input) => {
        input.setAttribute(PHX_READONLY, input.readOnly);
        input.readOnly = true;
        if (input.files) {
          input.setAttribute(PHX_DISABLED, input.disabled);
          input.disabled = true;
        }
      });
      let formEls = disables.concat(buttons).concat(inputs).map((el) => {
        return { el, loading: true, lock: true };
      });
      let els = [{ el: formEl, loading: true, lock: false }].concat(formEls).reverse();
      return this.putRef(els, phxEvent, "submit", opts);
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply) {
      let refGenerator = () => this.disableForm(formEl, phxEvent, __spreadProps(__spreadValues({}, opts), {
        form: formEl,
        submitter
      }));
      dom_default.putPrivate(formEl, "submitter", submitter);
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, phxEvent, targetCtx, ref, cid, (_uploads) => {
          if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
            return this.undoRefs(ref, phxEvent);
          }
          let meta = this.extractMeta(formEl, {}, opts.value);
          let formData = serializeForm(formEl, { submitter });
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            meta,
            cid
          }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push form submit", error));
        });
      } else if (!(formEl.hasAttribute(PHX_REF_SRC) && formEl.classList.contains("phx-submit-loading"))) {
        let meta = this.extractMeta(formEl, {}, opts.value);
        let formData = serializeForm(formEl, { submitter });
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          meta,
          cid
        }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push form submit", error));
      }
    }
    uploadFiles(formEl, phxEvent, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        if (entries.length === 0) {
          numFileInputsInProgress--;
          return;
        }
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload).then(({ resp }) => {
          this.log("upload", () => ["got preflight response", resp]);
          uploader.entries().forEach((entry) => {
            if (resp.entries && !resp.entries[entry.ref]) {
              this.handleFailedEntryPreflight(entry.ref, "failed preflight", uploader);
            }
          });
          if (resp.error || Object.keys(resp.entries).length === 0) {
            this.undoRefs(ref, phxEvent);
            let errors = resp.error || [];
            errors.map(([entry_ref, reason]) => {
              this.handleFailedEntryPreflight(entry_ref, reason, uploader);
            });
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        }).catch((error) => logError("Failed to push upload", error));
      });
    }
    handleFailedEntryPreflight(uploadRef, reason, uploader) {
      if (uploader.isAutoUpload()) {
        let entry = uploader.entries().find((entry2) => entry2.ref === uploadRef.toString());
        if (entry) {
          entry.cancel();
        }
      } else {
        uploader.entries().map((entry) => entry.cancel());
      }
      this.log("upload", () => [`error for entry ${uploadRef}`, reason]);
    }
    dispatchUploads(targetCtx, name, filesOrBlobs) {
      let targetElement = this.targetCtxElement(targetCtx) || this.el;
      let inputs = dom_default.findUploadInputs(targetElement).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    targetCtxElement(targetCtx) {
      if (isCid(targetCtx)) {
        let [target] = dom_default.findComponentNodeList(this.el, targetCtx);
        return target;
      } else if (targetCtx) {
        return targetCtx;
      } else {
        return null;
      }
    }
    pushFormRecovery(oldForm, newForm, templateDom, callback) {
      const phxChange = this.binding("change");
      const phxTarget = newForm.getAttribute(this.binding("target")) || newForm;
      const phxEvent = newForm.getAttribute(this.binding(PHX_AUTO_RECOVER)) || newForm.getAttribute(this.binding("change"));
      const inputs = Array.from(oldForm.elements).filter((el) => dom_default.isFormInput(el) && el.name && !el.hasAttribute(phxChange));
      if (inputs.length === 0) {
        callback();
        return;
      }
      inputs.forEach((input2) => input2.hasAttribute(PHX_UPLOAD_REF) && LiveUploader.clearFiles(input2));
      let input = inputs.find((el) => el.type !== "hidden") || inputs[0];
      let pending = 0;
      this.withinTargets(phxTarget, (targetView, targetCtx) => {
        const cid = this.targetComponentID(newForm, targetCtx);
        pending++;
        let e = new CustomEvent("phx:form-recovery", { detail: { sourceElement: oldForm } });
        js_default.exec(e, "change", phxEvent, this, input, ["push", {
          _target: input.name,
          targetView,
          targetCtx,
          newCid: cid,
          callback: () => {
            pending--;
            if (pending === 0) {
              callback();
            }
          }
        }]);
      }, templateDom, templateDom);
    }
    pushLinkPatch(e, href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let loading = e.isTrusted && e.type !== "popstate";
      let refGen = targetEl ? () => this.putRef([{ el: targetEl, loading, lock: true }], null, "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let url = href.startsWith("/") ? `${location.protocol}//${location.host}${href}` : href;
      this.pushWithReply(refGen, "live_patch", { url }).then(({ resp }) => {
        this.liveSocket.requestDOMUpdate(() => {
          if (resp.link_redirect) {
            this.liveSocket.replaceMain(href, null, callback, linkRef);
          } else {
            if (this.liveSocket.commitPendingLink(linkRef)) {
              this.href = href;
            }
            this.applyPendingUpdates();
            callback && callback(linkRef);
          }
        });
      }, ({ error: _error, timeout: _timeout }) => fallback());
    }
    getFormsForRecovery() {
      if (this.joinCount === 0) {
        return {};
      }
      let phxChange = this.binding("change");
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
        const clonedForm = form.cloneNode(false);
        dom_default.copyPrivates(clonedForm, form);
        Array.from(form.elements).forEach((el) => {
          const clonedEl = el.cloneNode(true);
          morphdom_esm_default(clonedEl, el);
          dom_default.copyPrivates(clonedEl, el);
          clonedForm.appendChild(clonedEl);
        });
        return clonedForm;
      }).reduce((acc, form) => {
        acc[form.id] = form;
        return acc;
      }, {});
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        willDestroyCIDs.forEach((cid) => this.rendered.resetRender(cid));
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }).then(() => {
          this.liveSocket.requestDOMUpdate(() => {
            let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
              return dom_default.findComponentNodeList(this.el, cid).length === 0;
            });
            if (completelyDestroyCIDs.length > 0) {
              this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }).then(({ resp }) => {
                this.rendered.pruneCIDs(resp.cids);
              }).catch((error) => logError("Failed to push components destroyed", error));
            }
          });
        }).catch((error) => logError("Failed to push components destroyed", error));
      }
    }
    ownsElement(el) {
      let parentViewEl = el.closest(PHX_VIEW_SELECTOR);
      return el.getAttribute(PHX_PARENT_ID) === this.id || parentViewEl && parentViewEl.id === this.id || !parentViewEl && this.isDead;
    }
    submitForm(form, targetCtx, phxEvent, submitter, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      const inputs = Array.from(form.elements);
      inputs.forEach((input) => dom_default.putPrivate(input, PHX_HAS_SUBMITTED, true));
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, submitter, opts, () => {
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.disconnectedTimeout = opts.disconnectedTimeout || DISCONNECTED_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.boundEventNames = /* @__PURE__ */ new Set();
      this.serverCloseRef = null;
      this.domCallbacks = Object.assign({
        jsQuerySelectorAll: null,
        onPatchStart: closure2(),
        onPatchEnd: closure2(),
        onNodeAdded: closure2(),
        onBeforeElUpdated: closure2()
      }, opts.dom || {});
      this.transitions = new TransitionSet();
      this.currentHistoryPosition = parseInt(this.sessionStorage.getItem(PHX_LV_HISTORY_POSITION)) || 0;
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    version() {
      return "1.0.18";
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        this.resetReloadStatus();
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        } else {
          this.bindTopLevelEvents({ dead: true });
        }
        this.joinDeadView();
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      if (this.serverCloseRef) {
        this.socket.off(this.serverCloseRef);
        this.serverCloseRef = null;
      }
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    execJS(el, encodedJS, eventType = null) {
      let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
      this.owner(el, (view) => js_default.exec(e, eventType, encodedJS, view, el));
    }
    execJSHookPush(el, phxEvent, data, callback) {
      this.withinOwners(el, (view) => {
        let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
        js_default.exec(e, "hook", phxEvent, view, el, ["push", { data, callback }]);
      });
    }
    unload() {
      if (this.unloaded) {
        return;
      }
      if (this.main && this.isConnected()) {
        this.log(this.main, "socket", () => ["disconnect for page nav"]);
      }
      this.unloaded = true;
      this.destroyAllViews();
      this.disconnect();
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          setTimeout(() => cb(data), latency);
        }
      });
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      if (tries >= this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
        if (tries >= this.maxReloads) {
          this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        }
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinDeadView() {
      let body = document.body;
      if (body && !this.isPhxView(body) && !this.isPhxView(document.firstElementChild)) {
        let view = this.newRootView(body);
        view.setHref(this.getHref());
        view.joinDead();
        if (!this.main) {
          this.main = view;
        }
        window.requestAnimationFrame(() => {
          var _a;
          view.execNewMounted();
          this.maybeScroll((_a = history.state) == null ? void 0 : _a.scroll);
        });
      }
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          if (!dom_default.isPhxSticky(rootEl)) {
            view.setHref(this.getHref());
          }
          view.join();
          if (rootEl.hasAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash, reloadToken) {
      if (reloadToken) {
        browser_default.setCookie(PHX_RELOAD_STATUS, reloadToken, 60);
      }
      this.unload();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      const liveReferer = this.currentLocation.href;
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      const stickies = dom_default.findPhxSticky(document) || [];
      const removeEls = dom_default.all(this.outgoingMainEl, `[${this.binding("remove")}]`).filter((el) => !dom_default.isChildOfAny(el, stickies));
      const newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash, liveReferer);
      this.main.setRedirect(href);
      this.transitionRemoves(removeEls);
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            removeEls.forEach((el) => el.remove());
            stickies.forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && callback(linkRef);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements, callback) {
      let removeAttr = this.binding("remove");
      let silenceEvents = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      elements.forEach((el) => {
        for (let event of this.boundEventNames) {
          el.addEventListener(event, silenceEvents, true);
        }
        this.execJS(el, el.getAttribute(removeAttr), "remove");
      });
      this.requestDOMUpdate(() => {
        elements.forEach((el) => {
          for (let event of this.boundEventNames) {
            el.removeEventListener(event, silenceEvents, true);
          }
        });
        callback && callback();
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash, liveReferer) {
      let view = new View(el, this, null, flash, liveReferer);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view;
      const closestViewEl = childEl.closest(PHX_VIEW_SELECTOR);
      if (closestViewEl) {
        view = this.getViewByEl(closestViewEl);
      } else {
        view = this.main;
      }
      return view && callback ? callback(view) : view;
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
      this.main = null;
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    getActiveElement() {
      return document.activeElement;
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents({ dead } = {}) {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.serverCloseRef = this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          return this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      if (!dead) {
        this.bindNav();
      }
      this.bindClicks();
      if (!dead) {
        this.bindForms();
      }
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, _phxTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (!phxTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.on("dragover", (e) => e.preventDefault());
      this.on("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files, e.dataTransfer);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      this.resetReloadStatus();
      return this.linkRef;
    }
    resetReloadStatus() {
      browser_default.deleteCookie(PHX_RELOAD_STATUS);
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, browserEventName, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, browserEventName, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      this.on("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click");
    }
    bindClick(eventName, bindingName) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (e.detail === 0)
          this.clickStartedAtTarget = e.target;
        let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
        target = closestPhxBinding(e.target, click);
        this.dispatchClickAway(e, clickStartedAtTarget);
        this.clickStartedAtTarget = null;
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          if (dom_default.isNewPageClick(e, window.location)) {
            this.unload();
          }
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        if (target.hasAttribute(PHX_REF_SRC)) {
          return;
        }
        this.debounce(target, e, "click", () => {
          this.withinOwners(target, (view) => {
            js_default.exec(e, "click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, false);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(el, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el) && js_default.isInViewport(el)) {
              js_default.exec(e, "click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, backType, id, scroll, position } = event.state || {};
        let href = window.location.href;
        let isForward = position > this.currentHistoryPosition;
        type = isForward ? type : backType || type;
        this.currentHistoryPosition = position || 0;
        this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
        dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: type === "patch", pop: true, direction: isForward ? "forward" : "backward" } });
        this.requestDOMUpdate(() => {
          const callback = () => {
            this.maybeScroll(scroll);
          };
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(event, href, null, callback);
          } else {
            this.replaceMain(href, null, callback);
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        if (!type || !this.isConnected() || !this.main || dom_default.wantsNewTab(e)) {
          return;
        }
        let href = target.href instanceof SVGAnimatedString ? target.href.baseVal : target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(e, href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(e, href, linkState, null, target);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
          let phxClick = target.getAttribute(this.binding("click"));
          if (phxClick) {
            this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
          }
        });
      }, false);
    }
    maybeScroll(scroll) {
      if (typeof scroll === "number") {
        requestAnimationFrame(() => {
          window.scrollTo(0, scroll);
        });
      }
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(e, href, linkState, targetEl) {
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href);
      }
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(e, href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      this.currentHistoryPosition++;
      this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
      browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "patch" }));
      browser_default.pushState(linkState, {
        type: "patch",
        id: this.main.id,
        position: this.currentHistoryPosition
      }, href);
      dom_default.dispatchEvent(window, "phx:navigate", { detail: { patch: true, href, pop: false, direction: "forward" } });
      this.registerNewLocation(window.location);
    }
    historyRedirect(e, href, linkState, flash, targetEl) {
      const clickLoading = targetEl && e.isTrusted && e.type !== "popstate";
      if (clickLoading) {
        targetEl.classList.add("phx-click-loading");
      }
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href, flash);
      }
      if (/^\/$|^\/[^\/]+.*$/.test(href)) {
        let { protocol, host } = window.location;
        href = `${protocol}//${host}${href}`;
      }
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, (linkRef) => {
          if (linkRef === this.linkRef) {
            this.currentHistoryPosition++;
            this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
            browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "redirect" }));
            browser_default.pushState(linkState, {
              type: "redirect",
              id: this.main.id,
              scroll,
              position: this.currentHistoryPosition
            }, href);
            dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: false, pop: false, direction: "forward" } });
            this.registerNewLocation(window.location);
          }
          if (clickLoading) {
            targetEl.classList.remove("phx-click-loading");
          }
          done();
        });
      });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      let externalFormSubmitted = false;
      this.on("submit", (e) => {
        let phxSubmit = e.target.getAttribute(this.binding("submit"));
        let phxChange = e.target.getAttribute(this.binding("change"));
        if (!externalFormSubmitted && phxChange && !phxSubmit) {
          externalFormSubmitted = true;
          e.preventDefault();
          this.withinOwners(e.target, (view) => {
            view.disableForm(e.target);
            window.requestAnimationFrame(() => {
              if (dom_default.isUnloadableFormSubmit(e)) {
                this.unload();
              }
              e.target.submit();
            });
          });
        }
      });
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          if (dom_default.isUnloadableFormSubmit(e)) {
            this.unload();
          }
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec(e, "submit", phxEvent, view, e.target, ["push", { submitter: e.submitter }]);
        });
      });
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          if (e instanceof CustomEvent && e.target.form === void 0) {
            if (e.detail && e.detail.dispatcher) {
              throw new Error(`dispatching a custom ${type} event is only supported on input elements inside a form`);
            }
            return;
          }
          let phxChange = this.binding("change");
          let input = e.target;
          if (e.isComposing) {
            const key = `composition-listener-${type}`;
            if (!dom_default.private(input, key)) {
              dom_default.putPrivate(input, key, true);
              input.addEventListener("compositionend", () => {
                input.dispatchEvent(new Event(type, { bubbles: true }));
                dom_default.deletePrivate(input, key);
              }, { once: true });
            }
            return;
          }
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type === "change" && lastType === "input") {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              js_default.exec(e, "change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        });
      }
      this.on("reset", (e) => {
        let form = e.target;
        dom_default.resetForm(form);
        let input = Array.from(form.elements).find((el) => el.type === "reset");
        if (input) {
          window.requestAnimationFrame(() => {
            input.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
          });
        }
      });
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
          callback();
        });
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      this.boundEventNames.add(event);
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
    jsQuerySelectorAll(sourceEl, query, defaultQuery) {
      let all = this.domCallbacks.jsQuerySelectorAll;
      return all ? all(sourceEl, query, defaultQuery) : defaultQuery();
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
    }
    reset() {
      this.transitions.forEach((timer) => {
        clearTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        this.flushPendingOps();
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      if (this.size() > 0) {
        return;
      }
      let op = this.pendingOps.shift();
      if (op) {
        op();
        this.flushPendingOps();
      }
    }
  };

  // js/app.js
  var import_topbar = __toESM(require_topbar());
  var Hooks2 = {};
  Hooks2.ModalClickHandler = {
    mounted() {
      console.debug("ModalClickHandler mounted on element:", this.el);
      console.debug("Element ID:", this.el.id);
      console.debug("Element classes:", this.el.className);
      const closeButton = this.el.querySelector(".summary-modal-close");
      if (closeButton) {
        console.debug("Close button found and event listener attached");
        closeButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleModalClose();
        });
      } else {
        console.debug("No close button found");
      }
      this.el.addEventListener("click", (e) => {
        console.debug("Click event detected on modal:");
        console.debug("- Event target:", e.target);
        console.debug("- Target tagName:", e.target.tagName);
        console.debug("- Target classes:", e.target.className);
        console.debug("- Target === this.el:", e.target === this.el);
        console.debug("- this.el:", this.el);
        if (e.target.classList.contains("copy-to-clipboard-btn")) {
          console.debug("Copy button clicked");
          const contentDiv = this.el.querySelector(".summary-content");
          if (contentDiv) {
            const text = contentDiv.innerText || contentDiv.textContent || "";
            navigator.clipboard.writeText(text).then(() => {
              const originalText = e.target.textContent;
              e.target.textContent = "\u2705";
              setTimeout(() => {
                e.target.textContent = originalText;
              }, 1e3);
            }).catch((err) => {
              console.warn("Failed to copy text: ", err);
              this.fallbackCopyTextToClipboard(text, e.target);
            });
          }
          return;
        }
        if (e.target === this.el) {
          console.debug("=== CLICK-OUTSIDE DETECTED ===");
          const loadingElement = this.el.querySelector(".summary-loading");
          const dataLoading = this.el.getAttribute("data-loading");
          console.debug("Loading state check:");
          console.debug("- .summary-loading element:", loadingElement);
          console.debug("- data-loading attribute:", dataLoading);
          console.debug("- Modal innerHTML preview:", this.el.innerHTML.substring(0, 200));
          if (loadingElement) {
            console.debug("\u274C PREVENTING CLOSE - content is loading");
            return;
          }
          if (dataLoading === "true") {
            console.debug("\u274C PREVENTING CLOSE - data-loading is true");
            return;
          }
          console.debug("\u2705 ALLOWING CLOSE - not loading");
          this.handleModalClose();
        } else {
          console.debug("Click was on child element, not closing modal");
        }
      });
    },
    handleModalClose() {
      console.debug("=== handleModalClose() called ===");
      console.debug("Pushing modal_close_request event to #" + this.el.id);
      this.pushEventTo("#" + this.el.id, "modal_close_request", {});
    },
    updated() {
      console.debug("=== Modal updated ===");
      console.debug("- data-loading:", this.el.getAttribute("data-loading"));
      console.debug("- display style:", this.el.style.display);
      console.debug("- .summary-loading present:", !!this.el.querySelector(".summary-loading"));
    },
    fallbackCopyTextToClipboard(text, button) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        const originalText = button.textContent;
        button.textContent = "\u2705";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1e3);
      } catch (err) {
        console.warn("Fallback copy failed: ", err);
      }
      document.body.removeChild(textArea);
    }
  };
  Hooks2.FeedbackForm = {
    mounted() {
      this.setupFeedbackInteractions();
      this.setupAutoHideSuccess();
    },
    updated() {
      this.setupFeedbackInteractions();
      this.setupAutoHideSuccess();
    },
    setupFeedbackInteractions() {
      const toggles = ["dont_like", "wrong"];
      toggles.forEach((value) => {
        const checkbox = this.el.querySelector(`input[value="${value}"]`);
        const detailsDiv = this.el.querySelector(`.feedback-details-field[data-for="${value}"]`);
        if (checkbox && detailsDiv) {
          checkbox.addEventListener("change", (e) => {
            var _a;
            if (e.target.checked) {
              detailsDiv.style.display = "block";
              (_a = detailsDiv.querySelector("textarea")) == null ? void 0 : _a.focus();
            } else {
              detailsDiv.style.display = "none";
              const textarea = detailsDiv.querySelector("textarea");
              if (textarea)
                textarea.value = "";
            }
          });
        }
      });
    },
    setupAutoHideSuccess() {
      const thanksDiv = document.querySelector(".feedback-thanks");
      if (thanksDiv && thanksDiv.textContent.trim() === "Thanks!" && !thanksDiv.dataset.tracked) {
        this.trackPostHogFeedback();
        thanksDiv.dataset.tracked = "true";
        setTimeout(() => {
          const parentModal = this.el.closest(".summary-modal-overlay");
          if (parentModal) {
            this.pushEventTo("#" + parentModal.id, "reset_feedback_success", {});
          }
        }, 3e3);
      }
    },
    trackPostHogFeedback() {
      var _a, _b;
      if (typeof posthog === "undefined")
        return;
      const modal = this.el.closest(".summary-modal-overlay");
      if (!modal)
        return;
      const titleText = ((_b = (_a = modal.querySelector(".summary-modal-title")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || "";
      const recordId = modal.dataset.recordId || "Unknown";
      let content_type = titleText;
      let character_name = null;
      let play_title = null;
      let location2 = null;
      if (titleText.startsWith("Modern Paraphrasing: ")) {
        content_type = "Paraphrasing";
        character_name = titleText.replace("Modern Paraphrasing: ", "").trim();
      } else if (titleText.startsWith("Play Summary: ")) {
        content_type = "Play Summary";
        play_title = titleText.replace("Play Summary: ", "").trim();
      } else if (titleText.startsWith("Scene Summary: ")) {
        content_type = "Scene Summary";
        const rest = titleText.replace("Scene Summary: ", "").trim();
        const dashIdx = rest.indexOf(" - ");
        if (dashIdx !== -1) {
          play_title = rest.substring(0, dashIdx);
          location2 = rest.substring(dashIdx + 3);
        } else {
          play_title = rest;
        }
      }
      const properties = {
        content_type,
        record_id: recordId,
        timestamp: new Date().toISOString()
      };
      if (character_name)
        properties.character_name = character_name;
      if (play_title)
        properties.play_title = play_title;
      if (location2)
        properties.location = location2;
      posthog.capture("ai_content_feedback", properties);
    }
  };
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, {
    params: { _csrf_token: csrfToken },
    hooks: Hooks2
  });
  var searchTimeout;
  document.addEventListener("input", function(event) {
    if (event.target.matches(".search-box-default")) {
      const searchQuery = event.target.value;
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() {
        posthog.capture("used_search", { searched_for: searchQuery });
      }, 5e3);
    }
  }, false);
  document.addEventListener("click", function(event) {
    if (event.target.matches(".monologue-pdflink")) {
      const linkElement = event.target.closest("a");
      if (linkElement) {
        const pdf_url = linkElement.getAttribute("href");
        const monologueRow = linkElement.closest("tr");
        let monologue_id = null;
        let character_name = null;
        let play_title = null;
        if (monologueRow) {
          const summaryIcon = monologueRow.querySelector(".summary-icon[phx-value-monologue-id]");
          if (summaryIcon) {
            monologue_id = summaryIcon.getAttribute("phx-value-monologue-id");
            character_name = summaryIcon.getAttribute("phx-value-character");
            play_title = summaryIcon.getAttribute("phx-value-play-title");
          }
          if (!character_name) {
            const characterElement = monologueRow.querySelector(".monologue-character");
            character_name = characterElement ? characterElement.textContent.trim() : null;
          }
          if (!play_title) {
            const playElement = monologueRow.querySelector(".monologue-playname");
            play_title = playElement ? playElement.textContent.trim() : null;
          }
        }
        const location2 = monologueRow ? monologueRow.dataset.location : null;
        const first_line = monologueRow ? monologueRow.dataset.firstline : null;
        posthog.capture("pdf_clicked", {
          pdf_url,
          monologue_id,
          character_name,
          play_title,
          location: location2,
          first_line
        });
      }
    }
  }, false);
  document.addEventListener("click", function(event) {
    if (event.target.matches(".monologue-firstline-table") || event.target.closest(".monologue-firstline-table")) {
      const firstLineElement = event.target.closest(".monologue-firstline-table") || event.target;
      const targetId = firstLineElement.getAttribute("data-target");
      const collapseElement = targetId ? document.querySelector(targetId) : null;
      const isExpanding = collapseElement && !collapseElement.classList.contains("show");
      if (isExpanding) {
        const monologueRow = firstLineElement.closest("tr");
        let monologue_id = null;
        let character_name = null;
        let play_title = null;
        if (monologueRow) {
          const characterElement = monologueRow.querySelector(".monologue-character");
          character_name = characterElement ? characterElement.textContent.trim() : null;
          const playElement = monologueRow.querySelector(".monologue-playname");
          play_title = playElement ? playElement.textContent.trim() : null;
          const summaryIcon = monologueRow.querySelector(".summary-icon[phx-value-monologue-id]");
          if (summaryIcon) {
            monologue_id = summaryIcon.getAttribute("phx-value-monologue-id");
          }
        }
        const location2 = monologueRow ? monologueRow.dataset.location : null;
        const first_line = monologueRow ? monologueRow.dataset.firstline : null;
        posthog.capture("monologue_expanded", {
          monologue_id,
          character_name,
          play_title,
          location: location2,
          first_line
        });
      }
    }
  }, false);
  document.addEventListener("click", function(event) {
    if (event.target.matches(".summary-icon") || event.target.closest(".summary-icon")) {
      const summaryIcon = event.target.closest(".summary-icon") || event.target;
      const monologue_id = summaryIcon.getAttribute("phx-value-monologue-id");
      const character_name = summaryIcon.getAttribute("phx-value-character");
      const play_title = summaryIcon.getAttribute("phx-value-play-title");
      const location2 = summaryIcon.getAttribute("phx-value-location");
      const phxClick = summaryIcon.getAttribute("phx-click");
      const monologueRow = summaryIcon.closest("tr");
      let event_name = "paraphrasing_requested";
      let properties = {
        timestamp: new Date().toISOString()
      };
      if (phxClick === "show_play_summary") {
        event_name = "play_summary_requested";
        properties.play_title = play_title;
      } else if (phxClick === "show_scene_summary") {
        event_name = "scene_summary_requested";
        properties.play_title = play_title;
        properties.location = location2;
      } else {
        event_name = "paraphrasing_requested";
        properties.monologue_id = monologue_id;
        properties.character_name = character_name;
        let resolved_play_title = play_title;
        if (!resolved_play_title && monologueRow) {
          const playEl = monologueRow.querySelector(".monologue-playname");
          resolved_play_title = playEl ? playEl.textContent.trim() : null;
        }
        properties.play_title = resolved_play_title;
        if (monologueRow) {
          properties.location = monologueRow.dataset.location || null;
          const firstLineElement = monologueRow.querySelector(".monologue-firstline-table");
          if (firstLineElement) {
            properties.first_line = firstLineElement.textContent.trim().replace("\u21B4", "").trim();
          }
        }
      }
      posthog.capture(event_name, properties);
    }
  }, false);
  document.addEventListener("click", function(event) {
    if (event.target.matches(".monologue-playname a") || event.target.closest(".monologue-playname")) {
      const playElement = event.target.closest(".monologue-playname") || event.target;
      const linkElement = playElement.querySelector("a") || event.target.closest("a");
      if (linkElement) {
        const href = linkElement.getAttribute("href");
        const play_title = linkElement.textContent.trim();
        let play_id = null;
        let section = "general";
        if (href) {
          if (href.includes("/men/")) {
            section = "men";
            play_id = href.split("/men/")[1];
          } else if (href.includes("/women/")) {
            section = "women";
            play_id = href.split("/women/")[1];
          } else if (href.includes("/play/")) {
            section = "general";
            play_id = href.split("/play/")[1];
          }
        }
        let source_context = "unknown";
        if (document.querySelector(".search-box-default")) {
          source_context = "search_results";
        } else if (window.location.pathname.includes("/plays")) {
          source_context = "plays_listing";
        }
        posthog.capture("play_selected", {
          play_id,
          play_title,
          section,
          source_context
        });
      }
    }
  }, false);
  document.addEventListener("click", function(event) {
    const linkElement = event.target.closest("a");
    if (linkElement) {
      const href = linkElement.getAttribute("href");
      if (href === "/mens" || href === "/womens" || href === "/plays") {
        let section_selected = "";
        let current_section = "unknown";
        if (href === "/mens") {
          section_selected = "men";
        } else if (href === "/womens") {
          section_selected = "women";
        } else if (href === "/plays") {
          section_selected = "all";
        }
        const currentPath = window.location.pathname;
        if (currentPath.includes("/mens") || currentPath.includes("/men/")) {
          current_section = "men";
        } else if (currentPath.includes("/womens") || currentPath.includes("/women/")) {
          current_section = "women";
        } else if (currentPath.includes("/plays") || currentPath.includes("/play/")) {
          current_section = "all";
        } else if (currentPath.includes("/search")) {
          if (currentPath.includes("men")) {
            current_section = "men";
          } else if (currentPath.includes("women")) {
            current_section = "women";
          } else {
            current_section = "all";
          }
        }
        if (section_selected !== current_section) {
          posthog.capture("section_filtered", {
            section_selected,
            previous_section: current_section,
            source_page: currentPath
          });
        }
      }
    }
  }, false);
  document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function(event) {
      if (event.target.closest('a[href*="ko-fi.com"]') || event.target.closest("#kofi-left-direct-btn") || event.target.closest("#kofi-footer-direct-btn") || event.target.closest("#kofi-direct-btn")) {
        posthog.capture("clicked_tipjar");
      }
    }, false);
  });
  window.addEventListener("phx:posthog_capture", (e) => {
    if (typeof posthog !== "undefined") {
      posthog.capture(e.detail.event, e.detail.properties);
    }
  });
  function clickOpenChat() {
    var container = document.getElementById("ph-conversations-widget-container");
    if (!container)
      return false;
    var btn = container.querySelector('button[aria-label="Open chat"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }
  window.openSupportWidget = function() {
    if (clickOpenChat())
      return false;
    var chatModal = document.getElementById("cookie-chat-modal");
    if (chatModal && localStorage.getItem("consent_choice") !== "granted") {
      chatModal.style.display = "block";
      return false;
    }
    return true;
  };
  document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("contact") === "true") {
      const maxAttempts = 40;
      let attempts = 0;
      const tryOpen = setInterval(function() {
        attempts++;
        if (clickOpenChat()) {
          clearInterval(tryOpen);
          const url = new URL(window.location);
          url.searchParams.delete("contact");
          window.history.replaceState({}, "", url);
        } else if (attempts >= maxAttempts) {
          clearInterval(tryOpen);
        }
      }, 250);
    }
  });
  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      const surveyH1 = document.querySelector(".survey-h1");
      if (surveyH1) {
        surveyH1.classList.add("delayed-survey");
      }
    }, 12e4);
  });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  var topBarScheduled = void 0;
  window.addEventListener("phx:page-loading-start", () => {
    if (!topBarScheduled) {
      topBarScheduled = setTimeout(() => import_topbar.default.show(), 500);
    }
  });
  window.addEventListener("phx:page-loading-stop", () => {
    clearTimeout(topBarScheduled);
    topBarScheduled = void 0;
    import_topbar.default.hide();
  });
  document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("adblock-overlay");
    if (!overlay)
      return;
    const dismissedAt = localStorage.getItem("adblock_dismissed");
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < 3 * 24 * 60 * 60 * 1e3)
      return;
    function showAdblockModal() {
      overlay.style.display = "flex";
      if (typeof posthog !== "undefined")
        posthog.capture("adblock_modal_shown");
    }
    setTimeout(function() {
      fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
        mode: "no-cors",
        cache: "no-store"
      }).then(function(r) {
        if (r.type === "basic") {
          showAdblockModal();
          return;
        }
        const probe = document.getElementById("adblock-probe");
        const cssBlocked = !probe || probe.offsetHeight === 0 || window.getComputedStyle(probe).display === "none";
        if (cssBlocked)
          showAdblockModal();
      }).catch(function() {
        showAdblockModal();
      });
    }, 5e3);
    document.getElementById("adblock-dismiss").addEventListener("click", function() {
      if (typeof posthog !== "undefined")
        posthog.capture("adblock_modal_dismissed");
      localStorage.setItem("adblock_dismissed", Date.now().toString());
      overlay.style.display = "none";
    });
    const adblockKofiLink = document.querySelector('#adblock-modal a[href*="ko-fi.com"]');
    if (adblockKofiLink) {
      adblockKofiLink.addEventListener("click", function() {
        if (typeof posthog !== "undefined")
          posthog.capture("clicked_tipjar", { source: "adblock_modal" });
      });
    }
    document.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && overlay.style.display === "flex") {
        document.getElementById("adblock-dismiss").click();
      }
    });
  });
  document.addEventListener("DOMContentLoaded", function() {
    const chatIcon = document.getElementById("cookie-chat-icon");
    const chatModal = document.getElementById("cookie-chat-modal");
    if (!chatIcon || !chatModal)
      return;
    if (localStorage.getItem("consent_choice") !== "granted") {
      chatIcon.style.display = "block";
    }
    chatIcon.addEventListener("click", function() {
      chatModal.style.display = chatModal.style.display === "none" ? "block" : "none";
    });
    document.getElementById("cookie-chat-modal-close").addEventListener("click", function() {
      chatModal.style.display = "none";
    });
    document.getElementById("cookie-chat-accept-from-modal").addEventListener("click", function() {
      chatModal.style.display = "none";
      chatIcon.style.display = "none";
      document.getElementById("consent-accept").click();
    });
  });
  document.addEventListener("DOMContentLoaded", function() {
    const banner = document.getElementById("consent-banner");
    if (!banner)
      return;
    if (!localStorage.getItem("consent_choice")) {
      banner.style.display = "block";
    }
    document.getElementById("consent-accept").addEventListener("click", function() {
      localStorage.setItem("consent_choice", "granted");
      gtag("consent", "update", {
        "ad_storage": "granted",
        "ad_user_data": "granted",
        "ad_personalization": "granted",
        "analytics_storage": "granted"
      });
      if (typeof posthog !== "undefined" && !posthog.__loaded) {
        posthog.init("phc_6aYLpkqQsmYJanYseJ8SJcOMicomCxj9v9Pl6hnZQS3", {
          api_host: "https://autolycus.shakespeare-monologues.org",
          ui_host: "https://us.posthog.com",
          defaults: "2026-01-30",
          person_profiles: "identified_only"
        });
      }
      banner.style.display = "none";
    });
    document.getElementById("consent-decline").addEventListener("click", function() {
      localStorage.setItem("consent_choice", "declined");
      banner.style.display = "none";
    });
  });
  liveSocket.connect();
  liveSocket.enableDebug();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 1.0.0, 2021-01-06
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2RhcmtfbW9kZS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfaHRtbC9wcml2L3N0YXRpYy9waG9lbml4X2h0bWwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9jb25zdGFudHMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3B1c2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3RpbWVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9jaGFubmVsLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9hamF4LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9sb25ncG9sbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvcHJlc2VuY2UuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3NlcmlhbGl6ZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3NvY2tldC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9jb25zdGFudHMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZW50cnlfdXBsb2FkZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdXRpbHMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvYnJvd3Nlci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb20uanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdXBsb2FkX2VudHJ5LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2xpdmVfdXBsb2FkZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvYXJpYS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9ob29rcy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9lbGVtZW50X3JlZi5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcG9zdF9tb3JwaF9yZXN0b3Jlci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L25vZGVfbW9kdWxlcy9tb3JwaGRvbS9kaXN0L21vcnBoZG9tLWVzbS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcGF0Y2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvcmVuZGVyZWQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvanMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdmlld19ob29rLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXcuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvbGl2ZV9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvaW5kZXguanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2FwcC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIHRvcGJhciAxLjAuMCwgMjAyMS0wMS0wNlxuICogaHR0cHM6Ly9idXVuZ3V5ZW4uZ2l0aHViLmlvL3RvcGJhclxuICogQ29weXJpZ2h0IChjKSAyMDIxIEJ1dSBOZ3V5ZW5cbiAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFtcIm1zXCIsIFwibW96XCIsIFwid2Via2l0XCIsIFwib1wiXTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdIHx8XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgfVxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgfSwgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIHZhciBjYW52YXMsXG4gICAgcHJvZ3Jlc3NUaW1lcklkLFxuICAgIGZhZGVUaW1lcklkLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzaG93aW5nKSByZXR1cm47XG4gICAgICAgIHNob3dpbmcgPSB0cnVlO1xuICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgIGlmICghY2FudmFzKSBjcmVhdGVDYW52YXMoKTtcbiAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdG9wYmFyLnByb2dyZXNzKDApO1xuICAgICAgICBpZiAob3B0aW9ucy5hdXRvUnVuKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICAgICAgdG9wYmFyLnByb2dyZXNzKFxuICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9ncmVzczogZnVuY3Rpb24gKHRvKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0byA9XG4gICAgICAgICAgICAodG8uaW5kZXhPZihcIitcIikgPj0gMCB8fCB0by5pbmRleE9mKFwiLVwiKSA+PSAwXG4gICAgICAgICAgICAgID8gY3VycmVudFByb2dyZXNzXG4gICAgICAgICAgICAgIDogMCkgKyBwYXJzZUZsb2F0KHRvKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50UHJvZ3Jlc3MgPSB0byA+IDEgPyAxIDogdG87XG4gICAgICAgIHJlcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgIH0sXG4gICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwgIi8vIEZ1bmN0aW9uIHRvIHJlYWQgdGhlIHZhbHVlIG9mIGEgY29va2llIGJ5IGl0cyBuYW1lXG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICBjb25zdCB2YWx1ZSA9ICc7ICcgKyBkb2N1bWVudC5jb29raWU7XG4gIGNvbnN0IHBhcnRzID0gdmFsdWUuc3BsaXQoJzsgJyArIG5hbWUgKyAnPScpO1xuICBpZiAocGFydHMubGVuZ3RoID09PSAyKSByZXR1cm4gcGFydHMucG9wKCkuc3BsaXQoJzsnKS5zaGlmdCgpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gRnVuY3Rpb24gdG8gc2V0IGRhcmsgbW9kZSBiYXNlZCBvbiB0aGUgdXNlcidzIHByZWZlcmVuY2VcbmZ1bmN0aW9uIHNldERhcmtNb2RlUHJlZmVyZW5jZShpc0RhcmtNb2RlKSB7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkYXJrTW9kZScsIGlzRGFya01vZGUgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgLy8gU2V0IGEgY29va2llIGZvciB0aGUgZGFyayBtb2RlIHByZWZlcmVuY2VcbiAgZG9jdW1lbnQuY29va2llID0gJ2RhcmtNb2RlUHJlZmVyZW5jZT0nICsgKGlzRGFya01vZGUgPyAndHJ1ZScgOiAnZmFsc2UnKSArICc7cGF0aD0vJztcbiAgdmFyIGJvZHlFbGVtZW50ID0gZG9jdW1lbnQuYm9keTsgLy8gVXNlICdkb2N1bWVudC5ib2R5JyBpbnN0ZWFkIG9mICdnZXRFbGVtZW50QnlJZCdcbiAgdmFyIGxpZ2h0TW9kZVRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaWdodC1tb2RlLXRvZ2dsZScpO1xuICB2YXIgZGFya01vZGVUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFyay1tb2RlLXRvZ2dsZScpO1xuICBpZiAoaXNEYXJrTW9kZSkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrLW1vZGUnKTtcbiAgICBib2R5RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrLW1vZGUnKTtcbiAgICBsaWdodE1vZGVUb2dnbGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBkYXJrTW9kZVRvZ2dsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGFyay1tb2RlJyk7XG4gICAgYm9keUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGFyay1tb2RlJyk7XG4gICAgbGlnaHRNb2RlVG9nZ2xlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGRhcmtNb2RlVG9nZ2xlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cbn1cblxuLy8gRnVuY3Rpb24gdG8gdG9nZ2xlIGRhcmsgbW9kZVxuZnVuY3Rpb24gdG9nZ2xlRGFya01vZGUoKSB7XG4gIC8vIENoZWNrIGlmIGRhcmsgbW9kZSBpcyBjdXJyZW50bHkgZW5hYmxlZFxuICB2YXIgaXNEYXJrTW9kZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkYXJrTW9kZScpID09PSAndHJ1ZSc7XG4gIC8vIFRvZ2dsZSB0aGUgZGFyayBtb2RlIHByZWZlcmVuY2UgYW5kIHVwZGF0ZSB0aGUgVUlcbiAgc2V0RGFya01vZGVQcmVmZXJlbmNlKCFpc0RhcmtNb2RlKTtcbn1cblxuLy8gQXR0YWNoIHRoZSB0b2dnbGVEYXJrTW9kZSBmdW5jdGlvbiB0byB0aGUgY2xpY2sgZXZlbnQgb2YgdGhlIGRhcmsgbW9kZSBpY29uXG52YXIgZGFya01vZGVJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RhcmstbW9kZS1pY29uJyk7XG5pZiAoZGFya01vZGVJY29uKSB7XG4gIGRhcmtNb2RlSWNvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURhcmtNb2RlKTtcbn1cblxuLy8gU2V0IHRoZSBpbml0aWFsIGRhcmsgbW9kZSBwcmVmZXJlbmNlIGJhc2VkIG9uIGxvY2FsU3RvcmFnZVxudmFyIGluaXRpYWxEYXJrTW9kZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkYXJrTW9kZScpID09PSAndHJ1ZSc7XG5zZXREYXJrTW9kZVByZWZlcmVuY2UoaW5pdGlhbERhcmtNb2RlKTtcblxud2luZG93LmdldENvb2tpZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgY29uc3QgdmFsdWUgPSAnOyAnICsgZG9jdW1lbnQuY29va2llO1xuICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KCc7ICcgKyBuYW1lICsgJz0nKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikgcmV0dXJuIHBhcnRzLnBvcCgpLnNwbGl0KCc7Jykuc2hpZnQoKTtcbiAgcmV0dXJuIG51bGw7XG59O1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBQb2x5ZmlsbEV2ZW50ID0gZXZlbnRDb25zdHJ1Y3RvcigpO1xuXG4gIGZ1bmN0aW9uIGV2ZW50Q29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHdpbmRvdy5DdXN0b21FdmVudDtcbiAgICAvLyBJRTw9OSBTdXBwb3J0XG4gICAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBDdXN0b21FdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkSGlkZGVuSW5wdXQobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlbGVtZW50LCB0YXJnZXRNb2RpZmllcktleSkge1xuICAgIHZhciB0byA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSxcbiAgICAgICAgbWV0aG9kID0gYnVpbGRIaWRkZW5JbnB1dChcIl9tZXRob2RcIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSksXG4gICAgICAgIGNzcmYgPSBidWlsZEhpZGRlbklucHV0KFwiX2NzcmZfdG9rZW5cIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNzcmZcIikpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG4gICAgICAgIHN1Ym1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxcbiAgICAgICAgdGFyZ2V0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIik7XG5cbiAgICBmb3JtLm1ldGhvZCA9IChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpID09PSBcImdldFwiKSA/IFwiZ2V0XCIgOiBcInBvc3RcIjtcbiAgICBmb3JtLmFjdGlvbiA9IHRvO1xuICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgaWYgKHRhcmdldCkgZm9ybS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgZWxzZSBpZiAodGFyZ2V0TW9kaWZpZXJLZXkpIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2QpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG5cbiAgICAvLyBJbnNlcnQgYSBidXR0b24gYW5kIGNsaWNrIGl0IGluc3RlYWQgb2YgdXNpbmcgYGZvcm0uc3VibWl0YFxuICAgIC8vIGJlY2F1c2UgdGhlIGBzdWJtaXRgIGZ1bmN0aW9uIGRvZXMgbm90IGVtaXQgYSBgc3VibWl0YCBldmVudC5cbiAgICBzdWJtaXQudHlwZSA9IFwic3VibWl0XCI7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChzdWJtaXQpO1xuICAgIHN1Ym1pdC5jbGljaygpO1xuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSkge1xuICAgICAgdmFyIHBob2VuaXhMaW5rRXZlbnQgPSBuZXcgUG9seWZpbGxFdmVudCgncGhvZW5peC5saW5rLmNsaWNrJywge1xuICAgICAgICBcImJ1YmJsZXNcIjogdHJ1ZSwgXCJjYW5jZWxhYmxlXCI6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWVsZW1lbnQuZGlzcGF0Y2hFdmVudChwaG9lbml4TGlua0V2ZW50KSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRvXCIpKSB7XG4gICAgICAgIGhhbmRsZUNsaWNrKGVsZW1lbnQsIGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgZmFsc2UpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaG9lbml4LmxpbmsuY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBtZXNzYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb25maXJtXCIpO1xuICAgIGlmKG1lc3NhZ2UgJiYgIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KSgpO1xuIiwgIi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsdWUpID0+IHtcbiAgaWYodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpe1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxldCBjbG9zdXJlID0gZnVuY3Rpb24gKCl7IHJldHVybiB2YWx1ZSB9XG4gICAgcmV0dXJuIGNsb3N1cmVcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbFxuZXhwb3J0IGNvbnN0IHBoeFdpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBudWxsXG5leHBvcnQgY29uc3QgZ2xvYmFsID0gZ2xvYmFsU2VsZiB8fCBwaHhXaW5kb3cgfHwgZ2xvYmFsVGhpc1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVlNOID0gXCIyLjAuMFwiXG5leHBvcnQgY29uc3QgU09DS0VUX1NUQVRFUyA9IHtjb25uZWN0aW5nOiAwLCBvcGVuOiAxLCBjbG9zaW5nOiAyLCBjbG9zZWQ6IDN9XG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUID0gMTAwMDBcbmV4cG9ydCBjb25zdCBXU19DTE9TRV9OT1JNQUwgPSAxMDAwXG5leHBvcnQgY29uc3QgQ0hBTk5FTF9TVEFURVMgPSB7XG4gIGNsb3NlZDogXCJjbG9zZWRcIixcbiAgZXJyb3JlZDogXCJlcnJvcmVkXCIsXG4gIGpvaW5lZDogXCJqb2luZWRcIixcbiAgam9pbmluZzogXCJqb2luaW5nXCIsXG4gIGxlYXZpbmc6IFwibGVhdmluZ1wiLFxufVxuZXhwb3J0IGNvbnN0IENIQU5ORUxfRVZFTlRTID0ge1xuICBjbG9zZTogXCJwaHhfY2xvc2VcIixcbiAgZXJyb3I6IFwicGh4X2Vycm9yXCIsXG4gIGpvaW46IFwicGh4X2pvaW5cIixcbiAgcmVwbHk6IFwicGh4X3JlcGx5XCIsXG4gIGxlYXZlOiBcInBoeF9sZWF2ZVwiXG59XG5cbmV4cG9ydCBjb25zdCBUUkFOU1BPUlRTID0ge1xuICBsb25ncG9sbDogXCJsb25ncG9sbFwiLFxuICB3ZWJzb2NrZXQ6IFwid2Vic29ja2V0XCJcbn1cbmV4cG9ydCBjb25zdCBYSFJfU1RBVEVTID0ge1xuICBjb21wbGV0ZTogNFxufVxuZXhwb3J0IGNvbnN0IEFVVEhfVE9LRU5fUFJFRklYID0gXCJiYXNlNjR1cmwuYmVhcmVyLnBoeC5cIlxuIiwgIi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIFB1c2hcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBUaGUgZXZlbnQsIGZvciBleGFtcGxlIGBcInBoeF9qb2luXCJgXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2FkLCBmb3IgZXhhbXBsZSBge3VzZXJfaWQ6IDEyM31gXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZW91dCAtIFRoZSBwdXNoIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1c2gge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBldmVudCwgcGF5bG9hZCwgdGltZW91dCl7XG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuZXZlbnQgPSBldmVudFxuICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQgfHwgZnVuY3Rpb24gKCl7IHJldHVybiB7fSB9XG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICAgIHRoaXMucmVjSG9va3MgPSBbXVxuICAgIHRoaXMuc2VudCA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXRcbiAgICovXG4gIHJlc2VuZCh0aW1lb3V0KXtcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy5yZXNldCgpXG4gICAgdGhpcy5zZW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgc2VuZCgpe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoXCJ0aW1lb3V0XCIpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnN0YXJ0VGltZW91dCgpXG4gICAgdGhpcy5zZW50ID0gdHJ1ZVxuICAgIHRoaXMuY2hhbm5lbC5zb2NrZXQucHVzaCh7XG4gICAgICB0b3BpYzogdGhpcy5jaGFubmVsLnRvcGljLFxuICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXG4gICAgICBwYXlsb2FkOiB0aGlzLnBheWxvYWQoKSxcbiAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICBqb2luX3JlZjogdGhpcy5jaGFubmVsLmpvaW5SZWYoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSBzdGF0dXNcbiAgICogQHBhcmFtIHsqfSBjYWxsYmFja1xuICAgKi9cbiAgcmVjZWl2ZShzdGF0dXMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmhhc1JlY2VpdmVkKHN0YXR1cykpe1xuICAgICAgY2FsbGJhY2sodGhpcy5yZWNlaXZlZFJlc3AucmVzcG9uc2UpXG4gICAgfVxuXG4gICAgdGhpcy5yZWNIb29rcy5wdXNoKHtzdGF0dXMsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpe1xuICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgIHRoaXMucmVmID0gbnVsbFxuICAgIHRoaXMucmVmRXZlbnQgPSBudWxsXG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbWF0Y2hSZWNlaXZlKHtzdGF0dXMsIHJlc3BvbnNlLCBfcmVmfSl7XG4gICAgdGhpcy5yZWNIb29rcy5maWx0ZXIoaCA9PiBoLnN0YXR1cyA9PT0gc3RhdHVzKVxuICAgICAgLmZvckVhY2goaCA9PiBoLmNhbGxiYWNrKHJlc3BvbnNlKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsUmVmRXZlbnQoKXtcbiAgICBpZighdGhpcy5yZWZFdmVudCl7IHJldHVybiB9XG4gICAgdGhpcy5jaGFubmVsLm9mZih0aGlzLnJlZkV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dFRpbWVyKVxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnRpbWVvdXRUaW1lcil7IHRoaXMuY2FuY2VsVGltZW91dCgpIH1cbiAgICB0aGlzLnJlZiA9IHRoaXMuY2hhbm5lbC5zb2NrZXQubWFrZVJlZigpXG4gICAgdGhpcy5yZWZFdmVudCA9IHRoaXMuY2hhbm5lbC5yZXBseUV2ZW50TmFtZSh0aGlzLnJlZilcblxuICAgIHRoaXMuY2hhbm5lbC5vbih0aGlzLnJlZkV2ZW50LCBwYXlsb2FkID0+IHtcbiAgICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgICAgdGhpcy5jYW5jZWxUaW1lb3V0KClcbiAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gcGF5bG9hZFxuICAgICAgdGhpcy5tYXRjaFJlY2VpdmUocGF5bG9hZClcbiAgICB9KVxuXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcihcInRpbWVvdXRcIiwge30pXG4gICAgfSwgdGhpcy50aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYXNSZWNlaXZlZChzdGF0dXMpe1xuICAgIHJldHVybiB0aGlzLnJlY2VpdmVkUmVzcCAmJiB0aGlzLnJlY2VpdmVkUmVzcC5zdGF0dXMgPT09IHN0YXR1c1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKHN0YXR1cywgcmVzcG9uc2Upe1xuICAgIHRoaXMuY2hhbm5lbC50cmlnZ2VyKHRoaXMucmVmRXZlbnQsIHtzdGF0dXMsIHJlc3BvbnNlfSlcbiAgfVxufVxuIiwgIi8qKlxuICpcbiAqIENyZWF0ZXMgYSB0aW1lciB0aGF0IGFjY2VwdHMgYSBgdGltZXJDYWxjYCBmdW5jdGlvbiB0byBwZXJmb3JtXG4gKiBjYWxjdWxhdGVkIHRpbWVvdXQgcmV0cmllcywgc3VjaCBhcyBleHBvbmVudGlhbCBiYWNrb2ZmLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsZXQgcmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4gdGhpcy5jb25uZWN0KCksIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCA1MDAwLCAxMDAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfSlcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDUwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gdGltZXJDYWxjXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIHRpbWVyQ2FsYyl7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgdGhpcy50aW1lckNhbGMgPSB0aW1lckNhbGNcbiAgICB0aGlzLnRpbWVyID0gbnVsbFxuICAgIHRoaXMudHJpZXMgPSAwXG4gIH1cblxuICByZXNldCgpe1xuICAgIHRoaXMudHJpZXMgPSAwXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyBhbnkgcHJldmlvdXMgc2NoZWR1bGVUaW1lb3V0IGFuZCBzY2hlZHVsZXMgY2FsbGJhY2tcbiAgICovXG4gIHNjaGVkdWxlVGltZW91dCgpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmllcyA9IHRoaXMudHJpZXMgKyAxXG4gICAgICB0aGlzLmNhbGxiYWNrKClcbiAgICB9LCB0aGlzLnRpbWVyQ2FsYyh0aGlzLnRyaWVzICsgMSkpXG4gIH1cbn1cbiIsICJpbXBvcnQge2Nsb3N1cmV9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTLFxuICBDSEFOTkVMX1NUQVRFUyxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IFB1c2ggZnJvbSBcIi4vcHVzaFwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbil9IHBhcmFtc1xuICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcbiAgY29uc3RydWN0b3IodG9waWMsIHBhcmFtcywgc29ja2V0KXtcbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgdGhpcy50b3BpYyA9IHRvcGljXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldFxuICAgIHRoaXMuYmluZGluZ3MgPSBbXVxuICAgIHRoaXMuYmluZGluZ1JlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSB0aGlzLnNvY2tldC50aW1lb3V0XG4gICAgdGhpcy5qb2luZWRPbmNlID0gZmFsc2VcbiAgICB0aGlzLmpvaW5QdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMuam9pbiwgdGhpcy5wYXJhbXMsIHRoaXMudGltZW91dClcbiAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzID0gW11cblxuICAgIHRoaXMucmVqb2luVGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luKCkgfVxuICAgIH0sIHRoaXMuc29ja2V0LnJlam9pbkFmdGVyTXMpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbkVycm9yKCgpID0+IHRoaXMucmVqb2luVGltZXIucmVzZXQoKSkpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLmlzRXJyb3JlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSlcbiAgICApXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5lZFxuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIuZm9yRWFjaChwdXNoRXZlbnQgPT4gcHVzaEV2ZW50LnNlbmQoKSlcbiAgICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5vbkNsb3NlKCgpID0+IHtcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGNsb3NlICR7dGhpcy50b3BpY30gJHt0aGlzLmpvaW5SZWYoKX1gKVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZFxuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlKHRoaXMpXG4gICAgfSlcbiAgICB0aGlzLm9uRXJyb3IocmVhc29uID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBlcnJvciAke3RoaXMudG9waWN9YCwgcmVhc29uKVxuICAgICAgaWYodGhpcy5pc0pvaW5pbmcoKSl7IHRoaXMuam9pblB1c2gucmVzZXQoKSB9XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgdGltZW91dCAke3RoaXMudG9waWN9ICgke3RoaXMuam9pblJlZigpfSlgLCB0aGlzLmpvaW5QdXNoLnRpbWVvdXQpXG4gICAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aGlzLnRpbWVvdXQpXG4gICAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLnJlcGx5LCAocGF5bG9hZCwgcmVmKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIodGhpcy5yZXBseUV2ZW50TmFtZShyZWYpLCBwYXlsb2FkKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSm9pbiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byBqb2luIG11bHRpcGxlIHRpbWVzLiAnam9pbicgY2FuIG9ubHkgYmUgY2FsbGVkIGEgc2luZ2xlIHRpbWUgcGVyIGNoYW5uZWwgaW5zdGFuY2VcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgICAgdGhpcy5qb2luZWRPbmNlID0gdHJ1ZVxuICAgICAgdGhpcy5yZWpvaW4oKVxuICAgICAgcmV0dXJuIHRoaXMuam9pblB1c2hcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgY2xvc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spe1xuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGVycm9yc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjayl7XG4gICAgcmV0dXJuIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuZXJyb3IsIHJlYXNvbiA9PiBjYWxsYmFjayhyZWFzb24pKVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgb24gY2hhbm5lbCBldmVudHNcbiAgICpcbiAgICogU3Vic2NyaXB0aW9uIHJldHVybnMgYSByZWYgY291bnRlciwgd2hpY2ggY2FuIGJlIHVzZWQgbGF0ZXIgdG9cbiAgICogdW5zdWJzY3JpYmUgdGhlIGV4YWN0IGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNvbnN0IHJlZjIgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fb3RoZXJfc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICogLy8gU2luY2UgdW5zdWJzY3JpcHRpb24sIGRvX3N0dWZmIHdvbid0IGZpcmUsXG4gICAqIC8vIHdoaWxlIGRvX290aGVyX3N0dWZmIHdpbGwga2VlcCBmaXJpbmcgb24gdGhlIFwiZXZlbnRcIlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybnMge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5iaW5kaW5nUmVmKytcbiAgICB0aGlzLmJpbmRpbmdzLnB1c2goe2V2ZW50LCByZWYsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIG9mZiBvZiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBVc2UgdGhlIHJlZiByZXR1cm5lZCBmcm9tIGEgY2hhbm5lbC5vbigpIHRvIHVuc3Vic2NyaWJlIG9uZVxuICAgKiBoYW5kbGVyLCBvciBwYXNzIG5vdGhpbmcgZm9yIHRoZSByZWYgdG8gdW5zdWJzY3JpYmUgYWxsXG4gICAqIGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gZXZlbnQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFVuc3Vic2NyaWJlIHRoZSBkb19zdHVmZiBoYW5kbGVyXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICpcbiAgICogLy8gVW5zdWJzY3JpYmUgYWxsIGhhbmRsZXJzIGZyb20gZXZlbnRcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiKVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9mZihldmVudCwgcmVmKXtcbiAgICB0aGlzLmJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoKGJpbmQpID0+IHtcbiAgICAgIHJldHVybiAhKGJpbmQuZXZlbnQgPT09IGV2ZW50ICYmICh0eXBlb2YgcmVmID09PSBcInVuZGVmaW5lZFwiIHx8IHJlZiA9PT0gYmluZC5yZWYpKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhblB1c2goKXsgcmV0dXJuIHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0pvaW5lZCgpIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIGBldmVudGAgdG8gcGhvZW5peCB3aXRoIHRoZSBwYXlsb2FkIGBwYXlsb2FkYC5cbiAgICogUGhvZW5peCByZWNlaXZlcyB0aGlzIGluIHRoZSBgaGFuZGxlX2luKGV2ZW50LCBwYXlsb2FkLCBzb2NrZXQpYFxuICAgKiBmdW5jdGlvbi4gaWYgcGhvZW5peCByZXBsaWVzIG9yIGl0IHRpbWVzIG91dCAoZGVmYXVsdCAxMDAwMG1zKSxcbiAgICogdGhlbiBvcHRpb25hbGx5IHRoZSByZXBseSBjYW4gYmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwucHVzaChcImV2ZW50XCIpXG4gICAqICAgLnJlY2VpdmUoXCJva1wiLCBwYXlsb2FkID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCByZXBsaWVkOlwiLCBwYXlsb2FkKSlcbiAgICogICAucmVjZWl2ZShcImVycm9yXCIsIGVyciA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggZXJyb3JlZFwiLCBlcnIpKVxuICAgKiAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBjb25zb2xlLmxvZyhcInRpbWVkIG91dCBwdXNoaW5nXCIpKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIHB1c2goZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHBheWxvYWQgPSBwYXlsb2FkIHx8IHt9XG4gICAgaWYoIXRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyaWVkIHRvIHB1c2ggJyR7ZXZlbnR9JyB0byAnJHt0aGlzLnRvcGljfScgYmVmb3JlIGpvaW5pbmcuIFVzZSBjaGFubmVsLmpvaW4oKSBiZWZvcmUgcHVzaGluZyBldmVudHNgKVxuICAgIH1cbiAgICBsZXQgcHVzaEV2ZW50ID0gbmV3IFB1c2godGhpcywgZXZlbnQsIGZ1bmN0aW9uICgpeyByZXR1cm4gcGF5bG9hZCB9LCB0aW1lb3V0KVxuICAgIGlmKHRoaXMuY2FuUHVzaCgpKXtcbiAgICAgIHB1c2hFdmVudC5zZW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgcHVzaEV2ZW50LnN0YXJ0VGltZW91dCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIucHVzaChwdXNoRXZlbnQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHB1c2hFdmVudFxuICB9XG5cbiAgLyoqIExlYXZlcyB0aGUgY2hhbm5lbFxuICAgKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBzZXJ2ZXIgZXZlbnRzLCBhbmRcbiAgICogaW5zdHJ1Y3RzIGNoYW5uZWwgdG8gdGVybWluYXRlIG9uIHNlcnZlclxuICAgKlxuICAgKiBUcmlnZ2VycyBvbkNsb3NlKCkgaG9va3NcbiAgICpcbiAgICogVG8gcmVjZWl2ZSBsZWF2ZSBhY2tub3dsZWRnZW1lbnRzLCB1c2UgdGhlIGByZWNlaXZlYFxuICAgKiBob29rIHRvIGJpbmQgdG8gdGhlIHNlcnZlciBhY2ssIGllOlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLmxlYXZlKCkucmVjZWl2ZShcIm9rXCIsICgpID0+IGFsZXJ0KFwibGVmdCFcIikgKVxuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBsZWF2ZSh0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICB0aGlzLmpvaW5QdXNoLmNhbmNlbFRpbWVvdXQoKVxuXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmxlYXZpbmdcbiAgICBsZXQgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBsZWF2ZSAke3RoaXMudG9waWN9YClcbiAgICAgIHRoaXMudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgXCJsZWF2ZVwiKVxuICAgIH1cbiAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aW1lb3V0KVxuICAgIGxlYXZlUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IG9uQ2xvc2UoKSlcbiAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgaWYoIXRoaXMuY2FuUHVzaCgpKXsgbGVhdmVQdXNoLnRyaWdnZXIoXCJva1wiLCB7fSkgfVxuXG4gICAgcmV0dXJuIGxlYXZlUHVzaFxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRhYmxlIG1lc3NhZ2UgaG9va1xuICAgKlxuICAgKiBSZWNlaXZlcyBhbGwgZXZlbnRzIGZvciBzcGVjaWFsaXplZCBtZXNzYWdlIGhhbmRsaW5nXG4gICAqIGJlZm9yZSBkaXNwYXRjaGluZyB0byB0aGUgY2hhbm5lbCBjYWxsYmFja3MuXG4gICAqXG4gICAqIE11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgb25NZXNzYWdlKF9ldmVudCwgcGF5bG9hZCwgX3JlZil7IHJldHVybiBwYXlsb2FkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZil7XG4gICAgaWYodGhpcy50b3BpYyAhPT0gdG9waWMpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgaWYoam9pblJlZiAmJiBqb2luUmVmICE9PSB0aGlzLmpvaW5SZWYoKSl7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBcImRyb3BwaW5nIG91dGRhdGVkIG1lc3NhZ2VcIiwge3RvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZn0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGpvaW5SZWYoKXsgcmV0dXJuIHRoaXMuam9pblB1c2gucmVmIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlam9pbih0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBpZih0aGlzLmlzTGVhdmluZygpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnNvY2tldC5sZWF2ZU9wZW5Ub3BpYyh0aGlzLnRvcGljKVxuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nXG4gICAgdGhpcy5qb2luUHVzaC5yZXNlbmQodGltZW91dClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKXtcbiAgICBsZXQgaGFuZGxlZFBheWxvYWQgPSB0aGlzLm9uTWVzc2FnZShldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKVxuICAgIGlmKHBheWxvYWQgJiYgIWhhbmRsZWRQYXlsb2FkKXsgdGhyb3cgbmV3IEVycm9yKFwiY2hhbm5lbCBvbk1lc3NhZ2UgY2FsbGJhY2tzIG11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXCIpIH1cblxuICAgIGxldCBldmVudEJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoYmluZCA9PiBiaW5kLmV2ZW50ID09PSBldmVudClcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBldmVudEJpbmRpbmdzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBiaW5kID0gZXZlbnRCaW5kaW5nc1tpXVxuICAgICAgYmluZC5jYWxsYmFjayhoYW5kbGVkUGF5bG9hZCwgcmVmLCBqb2luUmVmIHx8IHRoaXMuam9pblJlZigpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVwbHlFdmVudE5hbWUocmVmKXsgcmV0dXJuIGBjaGFuX3JlcGx5XyR7cmVmfWAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNDbG9zZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmNsb3NlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Vycm9yZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmVycm9yZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5lZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5pbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5pbmcgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNMZWF2aW5nKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nIH1cbn1cbiIsICJpbXBvcnQge1xuICBnbG9iYWwsXG4gIFhIUl9TVEFURVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWpheCB7XG5cbiAgc3RhdGljIHJlcXVlc3QobWV0aG9kLCBlbmRQb2ludCwgaGVhZGVycywgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgaWYoZ2xvYmFsLlhEb21haW5SZXF1ZXN0KXtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhEb21haW5SZXF1ZXN0KCkgLy8gSUU4LCBJRTlcbiAgICAgIHJldHVybiB0aGlzLnhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9IGVsc2UgaWYoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KXtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCkgLy8gSUU3KywgRmlyZWZveCwgQ2hyb21lLCBPcGVyYSwgU2FmYXJpXG4gICAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgaGVhZGVycywgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9IGVsc2UgaWYoZ2xvYmFsLmZldGNoICYmIGdsb2JhbC5BYm9ydENvbnRyb2xsZXIpe1xuICAgICAgLy8gRmV0Y2ggd2l0aCBBYm9ydENvbnRyb2xsZXIgZm9yIG1vZGVybiBicm93c2Vyc1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hSZXF1ZXN0KG1ldGhvZCwgZW5kUG9pbnQsIGhlYWRlcnMsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN1aXRhYmxlIFhNTEh0dHBSZXF1ZXN0IGltcGxlbWVudGF0aW9uIGZvdW5kXCIpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGZldGNoUmVxdWVzdChtZXRob2QsIGVuZFBvaW50LCBoZWFkZXJzLCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgIG1ldGhvZCxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBib2R5LFxuICAgIH1cbiAgICBsZXQgY29udHJvbGxlciA9IG51bGxcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcbiAgICAgIGNvbnN0IF90aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGNvbnRyb2xsZXIuYWJvcnQoKSwgdGltZW91dClcbiAgICAgIG9wdGlvbnMuc2lnbmFsID0gY29udHJvbGxlci5zaWduYWxcbiAgICB9XG4gICAgZ2xvYmFsLmZldGNoKGVuZFBvaW50LCBvcHRpb25zKVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAgICAgLnRoZW4oZGF0YSA9PiB0aGlzLnBhcnNlSlNPTihkYXRhKSlcbiAgICAgIC50aGVuKGRhdGEgPT4gY2FsbGJhY2sgJiYgY2FsbGJhY2soZGF0YSkpXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgaWYoZXJyLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiICYmIG9udGltZW91dCl7XG4gICAgICAgICAgb250aW1lb3V0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHJldHVybiBjb250cm9sbGVyXG4gIH1cblxuICBzdGF0aWMgeGRvbWFpblJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50KVxuICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLnBhcnNlSlNPTihyZXEucmVzcG9uc2VUZXh0KVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgLy8gV29yayBhcm91bmQgYnVnIGluIElFOSB0aGF0IHJlcXVpcmVzIGFuIGF0dGFjaGVkIG9ucHJvZ3Jlc3MgaGFuZGxlclxuICAgIHJlcS5vbnByb2dyZXNzID0gKCkgPT4geyB9XG5cbiAgICByZXEuc2VuZChib2R5KVxuICAgIHJldHVybiByZXFcbiAgfVxuXG4gIHN0YXRpYyB4aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgaGVhZGVycywgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgcmVxLm9wZW4obWV0aG9kLCBlbmRQb2ludCwgdHJ1ZSlcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICBmb3IobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhoZWFkZXJzKSl7XG4gICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbHVlKVxuICAgIH1cbiAgICByZXEub25lcnJvciA9ICgpID0+IGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwpXG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmKHJlcS5yZWFkeVN0YXRlID09PSBYSFJfU1RBVEVTLmNvbXBsZXRlICYmIGNhbGxiYWNrKXtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgcmVxLnNlbmQoYm9keSlcbiAgICByZXR1cm4gcmVxXG4gIH1cblxuICBzdGF0aWMgcGFyc2VKU09OKHJlc3Ape1xuICAgIGlmKCFyZXNwIHx8IHJlc3AgPT09IFwiXCIpeyByZXR1cm4gbnVsbCB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzcClcbiAgICB9IGNhdGNoIHtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJmYWlsZWQgdG8gcGFyc2UgSlNPTiByZXNwb25zZVwiLCByZXNwKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2VyaWFsaXplKG9iaiwgcGFyZW50S2V5KXtcbiAgICBsZXQgcXVlcnlTdHIgPSBbXVxuICAgIGZvcih2YXIga2V5IGluIG9iail7XG4gICAgICBpZighT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSl7IGNvbnRpbnVlIH1cbiAgICAgIGxldCBwYXJhbUtleSA9IHBhcmVudEtleSA/IGAke3BhcmVudEtleX1bJHtrZXl9XWAgOiBrZXlcbiAgICAgIGxldCBwYXJhbVZhbCA9IG9ialtrZXldXG4gICAgICBpZih0eXBlb2YgcGFyYW1WYWwgPT09IFwib2JqZWN0XCIpe1xuICAgICAgICBxdWVyeVN0ci5wdXNoKHRoaXMuc2VyaWFsaXplKHBhcmFtVmFsLCBwYXJhbUtleSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeVN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwYXJhbUtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVZhbCkpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0ci5qb2luKFwiJlwiKVxuICB9XG5cbiAgc3RhdGljIGFwcGVuZFBhcmFtcyh1cmwsIHBhcmFtcyl7XG4gICAgaWYoT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGggPT09IDApeyByZXR1cm4gdXJsIH1cblxuICAgIGxldCBwcmVmaXggPSB1cmwubWF0Y2goL1xcPy8pID8gXCImXCIgOiBcIj9cIlxuICAgIHJldHVybiBgJHt1cmx9JHtwcmVmaXh9JHt0aGlzLnNlcmlhbGl6ZShwYXJhbXMpfWBcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFNPQ0tFVF9TVEFURVMsXG4gIFRSQU5TUE9SVFMsXG4gIEFVVEhfVE9LRU5fUFJFRklYXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuXG5sZXQgYXJyYXlCdWZmZXJUb0Jhc2U2NCA9IChidWZmZXIpID0+IHtcbiAgbGV0IGJpbmFyeSA9IFwiXCJcbiAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKVxuICBsZXQgbGVuID0gYnl0ZXMuYnl0ZUxlbmd0aFxuICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspeyBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSkgfVxuICByZXR1cm4gYnRvYShiaW5hcnkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvbmdQb2xsIHtcblxuICBjb25zdHJ1Y3RvcihlbmRQb2ludCwgcHJvdG9jb2xzKXtcbiAgICAvLyB3ZSBvbmx5IHN1cHBvcnQgc3VicHJvdG9jb2xzIGZvciBhdXRoVG9rZW5cbiAgICAvLyBbXCJwaG9lbml4XCIsIFwiYmFzZTY0dXJsLmJlYXJlci5waHguQkFTRTY0X0VOQ09ERURfVE9LRU5cIl1cbiAgICBpZihwcm90b2NvbHMgJiYgcHJvdG9jb2xzLmxlbmd0aCA9PT0gMiAmJiBwcm90b2NvbHNbMV0uc3RhcnRzV2l0aChBVVRIX1RPS0VOX1BSRUZJWCkpe1xuICAgICAgdGhpcy5hdXRoVG9rZW4gPSBhdG9iKHByb3RvY29sc1sxXS5zbGljZShBVVRIX1RPS0VOX1BSRUZJWC5sZW5ndGgpKVxuICAgIH1cbiAgICB0aGlzLmVuZFBvaW50ID0gbnVsbFxuICAgIHRoaXMudG9rZW4gPSBudWxsXG4gICAgdGhpcy5za2lwSGVhcnRiZWF0ID0gdHJ1ZVxuICAgIHRoaXMucmVxcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlXG4gICAgdGhpcy5jdXJyZW50QmF0Y2ggPSBudWxsXG4gICAgdGhpcy5jdXJyZW50QmF0Y2hUaW1lciA9IG51bGxcbiAgICB0aGlzLmJhdGNoQnVmZmVyID0gW11cbiAgICB0aGlzLm9ub3BlbiA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9uZXJyb3IgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbmNsb3NlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMucG9sbEVuZHBvaW50ID0gdGhpcy5ub3JtYWxpemVFbmRwb2ludChlbmRQb2ludClcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3RpbmdcbiAgICAvLyB3ZSBtdXN0IHdhaXQgZm9yIHRoZSBjYWxsZXIgdG8gZmluaXNoIHNldHRpbmcgdXAgb3VyIGNhbGxiYWNrcyBhbmQgdGltZW91dCBwcm9wZXJ0aWVzXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnBvbGwoKSwgMClcbiAgfVxuXG4gIG5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KXtcbiAgICByZXR1cm4gKGVuZFBvaW50XG4gICAgICAucmVwbGFjZShcIndzOi8vXCIsIFwiaHR0cDovL1wiKVxuICAgICAgLnJlcGxhY2UoXCJ3c3M6Ly9cIiwgXCJodHRwczovL1wiKVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChcIiguKilcXC9cIiArIFRSQU5TUE9SVFMud2Vic29ja2V0KSwgXCIkMS9cIiArIFRSQU5TUE9SVFMubG9uZ3BvbGwpKVxuICB9XG5cbiAgZW5kcG9pbnRVUkwoKXtcbiAgICByZXR1cm4gQWpheC5hcHBlbmRQYXJhbXModGhpcy5wb2xsRW5kcG9pbnQsIHt0b2tlbjogdGhpcy50b2tlbn0pXG4gIH1cblxuICBjbG9zZUFuZFJldHJ5KGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIHRoaXMuY2xvc2UoY29kZSwgcmVhc29uLCB3YXNDbGVhbilcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3RpbmdcbiAgfVxuXG4gIG9udGltZW91dCgpe1xuICAgIHRoaXMub25lcnJvcihcInRpbWVvdXRcIilcbiAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAwNSwgXCJ0aW1lb3V0XCIsIGZhbHNlKVxuICB9XG5cbiAgaXNBY3RpdmUoKXsgcmV0dXJuIHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5vcGVuIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nIH1cblxuICBwb2xsKCl7XG4gICAgY29uc3QgaGVhZGVycyA9IHtcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cbiAgICBpZih0aGlzLmF1dGhUb2tlbil7XG4gICAgICBoZWFkZXJzW1wiWC1QaG9lbml4LUF1dGhUb2tlblwiXSA9IHRoaXMuYXV0aFRva2VuXG4gICAgfVxuICAgIHRoaXMuYWpheChcIkdFVFwiLCBoZWFkZXJzLCBudWxsLCAoKSA9PiB0aGlzLm9udGltZW91dCgpLCByZXNwID0+IHtcbiAgICAgIGlmKHJlc3Ape1xuICAgICAgICB2YXIge3N0YXR1cywgdG9rZW4sIG1lc3NhZ2VzfSA9IHJlc3BcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgPSAwXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaChzdGF0dXMpe1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICAgICAgICAvLyBUYXNrcyBhcmUgd2hhdCB0aGluZ3MgbGlrZSBldmVudCBoYW5kbGVycywgc2V0VGltZW91dCBjYWxsYmFja3MsXG4gICAgICAgICAgICAvLyBwcm9taXNlIHJlc29sdmVzIGFuZCBtb3JlIGFyZSBydW4gd2l0aGluLlxuICAgICAgICAgICAgLy8gSW4gbW9kZXJuIGJyb3dzZXJzLCB0aGVyZSBhcmUgdHdvIGRpZmZlcmVudCBraW5kcyBvZiB0YXNrcyxcbiAgICAgICAgICAgIC8vIG1pY3JvdGFza3MgYW5kIG1hY3JvdGFza3MuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFyZSBtYWlubHkgdXNlZCBmb3IgUHJvbWlzZXMsIHdoaWxlIG1hY3JvdGFza3MgYXJlXG4gICAgICAgICAgICAvLyB1c2VkIGZvciBldmVyeXRoaW5nIGVsc2UuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFsd2F5cyBoYXZlIHByaW9yaXR5IG92ZXIgbWFjcm90YXNrcy4gSWYgdGhlIEpTIGVuZ2luZVxuICAgICAgICAgICAgLy8gaXMgbG9va2luZyBmb3IgYSB0YXNrIHRvIHJ1biwgaXQgd2lsbCBhbHdheXMgdHJ5IHRvIGVtcHR5IHRoZVxuICAgICAgICAgICAgLy8gbWljcm90YXNrIHF1ZXVlIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHJ1biBhbnl0aGluZyBmcm9tIHRoZVxuICAgICAgICAgICAgLy8gbWFjcm90YXNrIHF1ZXVlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEZvciB0aGUgV2ViU29ja2V0IHRyYW5zcG9ydCwgbWVzc2FnZXMgYWx3YXlzIGFycml2ZSBpbiB0aGVpciBvd25cbiAgICAgICAgICAgIC8vIGV2ZW50LiBUaGlzIG1lYW5zIHRoYXQgaWYgYW55IHByb21pc2VzIGFyZSByZXNvbHZlZCBmcm9tIHdpdGhpbixcbiAgICAgICAgICAgIC8vIHRoZWlyIGNhbGxiYWNrcyB3aWxsIGFsd2F5cyBmaW5pc2ggZXhlY3V0aW9uIGJ5IHRoZSB0aW1lIHRoZVxuICAgICAgICAgICAgLy8gbmV4dCBtZXNzYWdlIGV2ZW50IGhhbmRsZXIgaXMgcnVuLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIGVtdWxhdGUgdGhpcyBiZWhhdmlvdXIsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIGVhY2hcbiAgICAgICAgICAgIC8vIG9ubWVzc2FnZSBoYW5kbGVyIGlzIHJ1biB3aXRoaW4gaXRzIG93biBtYWNyb3Rhc2suXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMub25tZXNzYWdlKHtkYXRhOiBtc2d9KSwgMClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyMDQ6XG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQxMDpcbiAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLm9wZW5cbiAgICAgICAgICB0aGlzLm9ub3Blbih7fSlcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDAzOlxuICAgICAgICAgIHRoaXMub25lcnJvcig0MDMpXG4gICAgICAgICAgdGhpcy5jbG9zZSgxMDA4LCBcImZvcmJpZGRlblwiLCBmYWxzZSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgIGNhc2UgNTAwOlxuICAgICAgICAgIHRoaXMub25lcnJvcig1MDApXG4gICAgICAgICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMTEsIFwiaW50ZXJuYWwgc2VydmVyIGVycm9yXCIsIDUwMClcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYHVuaGFuZGxlZCBwb2xsIHN0YXR1cyAke3N0YXR1c31gKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyB3ZSBjb2xsZWN0IGFsbCBwdXNoZXMgd2l0aGluIHRoZSBjdXJyZW50IGV2ZW50IGxvb3AgYnlcbiAgLy8gc2V0VGltZW91dCAwLCB3aGljaCBvcHRpbWl6ZXMgYmFjay10by1iYWNrIHByb2NlZHVyYWxcbiAgLy8gcHVzaGVzIGFnYWluc3QgYW4gZW1wdHkgYnVmZmVyXG5cbiAgc2VuZChib2R5KXtcbiAgICBpZih0eXBlb2YoYm9keSkgIT09IFwic3RyaW5nXCIpeyBib2R5ID0gYXJyYXlCdWZmZXJUb0Jhc2U2NChib2R5KSB9XG4gICAgaWYodGhpcy5jdXJyZW50QmF0Y2gpe1xuICAgICAgdGhpcy5jdXJyZW50QmF0Y2gucHVzaChib2R5KVxuICAgIH0gZWxzZSBpZih0aGlzLmF3YWl0aW5nQmF0Y2hBY2spe1xuICAgICAgdGhpcy5iYXRjaEJ1ZmZlci5wdXNoKGJvZHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudEJhdGNoID0gW2JvZHldXG4gICAgICB0aGlzLmN1cnJlbnRCYXRjaFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuYmF0Y2hTZW5kKHRoaXMuY3VycmVudEJhdGNoKVxuICAgICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IG51bGxcbiAgICAgIH0sIDApXG4gICAgfVxuICB9XG5cbiAgYmF0Y2hTZW5kKG1lc3NhZ2VzKXtcbiAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSB0cnVlXG4gICAgdGhpcy5hamF4KFwiUE9TVFwiLCB7XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LW5kanNvblwifSwgbWVzc2FnZXMuam9pbihcIlxcblwiKSwgKCkgPT4gdGhpcy5vbmVycm9yKFwidGltZW91dFwiKSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSBmYWxzZVxuICAgICAgaWYoIXJlc3AgfHwgcmVzcC5zdGF0dXMgIT09IDIwMCl7XG4gICAgICAgIHRoaXMub25lcnJvcihyZXNwICYmIHJlc3Auc3RhdHVzKVxuICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgZmFsc2UpXG4gICAgICB9IGVsc2UgaWYodGhpcy5iYXRjaEJ1ZmZlci5sZW5ndGggPiAwKXtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5iYXRjaEJ1ZmZlcilcbiAgICAgICAgdGhpcy5iYXRjaEJ1ZmZlciA9IFtdXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIGZvcihsZXQgcmVxIG9mIHRoaXMucmVxcyl7IHJlcS5hYm9ydCgpIH1cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNsb3NlZFxuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7Y29kZTogMTAwMCwgcmVhc29uOiB1bmRlZmluZWQsIHdhc0NsZWFuOiB0cnVlfSwge2NvZGUsIHJlYXNvbiwgd2FzQ2xlYW59KVxuICAgIHRoaXMuYmF0Y2hCdWZmZXIgPSBbXVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmN1cnJlbnRCYXRjaFRpbWVyKVxuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsXG4gICAgaWYodHlwZW9mKENsb3NlRXZlbnQpICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHRoaXMub25jbG9zZShuZXcgQ2xvc2VFdmVudChcImNsb3NlXCIsIG9wdHMpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uY2xvc2Uob3B0cylcbiAgICB9XG4gIH1cblxuICBhamF4KG1ldGhvZCwgaGVhZGVycywgYm9keSwgb25DYWxsZXJUaW1lb3V0LCBjYWxsYmFjayl7XG4gICAgbGV0IHJlcVxuICAgIGxldCBvbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIG9uQ2FsbGVyVGltZW91dCgpXG4gICAgfVxuICAgIHJlcSA9IEFqYXgucmVxdWVzdChtZXRob2QsIHRoaXMuZW5kcG9pbnRVUkwoKSwgaGVhZGVycywgYm9keSwgdGhpcy50aW1lb3V0LCBvbnRpbWVvdXQsIHJlc3AgPT4ge1xuICAgICAgdGhpcy5yZXFzLmRlbGV0ZShyZXEpXG4gICAgICBpZih0aGlzLmlzQWN0aXZlKCkpeyBjYWxsYmFjayhyZXNwKSB9XG4gICAgfSlcbiAgICB0aGlzLnJlcXMuYWRkKHJlcSlcbiAgfVxufVxuIiwgIi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIFByZXNlbmNlXG4gKiBAcGFyYW0ge0NoYW5uZWx9IGNoYW5uZWwgLSBUaGUgQ2hhbm5lbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBUaGUgb3B0aW9ucyxcbiAqICAgICAgICBmb3IgZXhhbXBsZSBge2V2ZW50czoge3N0YXRlOiBcInN0YXRlXCIsIGRpZmY6IFwiZGlmZlwifX1gXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbmNlIHtcblxuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBvcHRzID0ge30pe1xuICAgIGxldCBldmVudHMgPSBvcHRzLmV2ZW50cyB8fCB7c3RhdGU6IFwicHJlc2VuY2Vfc3RhdGVcIiwgZGlmZjogXCJwcmVzZW5jZV9kaWZmXCJ9XG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICB0aGlzLmpvaW5SZWYgPSBudWxsXG4gICAgdGhpcy5jYWxsZXIgPSB7XG4gICAgICBvbkpvaW46IGZ1bmN0aW9uICgpeyB9LFxuICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvblN5bmM6IGZ1bmN0aW9uICgpeyB9XG4gICAgfVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5zdGF0ZSwgbmV3U3RhdGUgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICB0aGlzLmpvaW5SZWYgPSB0aGlzLmNoYW5uZWwuam9pblJlZigpXG4gICAgICB0aGlzLnN0YXRlID0gUHJlc2VuY2Uuc3luY1N0YXRlKHRoaXMuc3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpXG5cbiAgICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goZGlmZiA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpXG4gICAgICB9KVxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgICAgb25TeW5jKClcbiAgICB9KVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5kaWZmLCBkaWZmID0+IHtcbiAgICAgIGxldCB7b25Kb2luLCBvbkxlYXZlLCBvblN5bmN9ID0gdGhpcy5jYWxsZXJcblxuICAgICAgaWYodGhpcy5pblBlbmRpbmdTeW5jU3RhdGUoKSl7XG4gICAgICAgIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goZGlmZilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpXG4gICAgICAgIG9uU3luYygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbihjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uSm9pbiA9IGNhbGxiYWNrIH1cblxuICBvbkxlYXZlKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25MZWF2ZSA9IGNhbGxiYWNrIH1cblxuICBvblN5bmMoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vblN5bmMgPSBjYWxsYmFjayB9XG5cbiAgbGlzdChieSl7IHJldHVybiBQcmVzZW5jZS5saXN0KHRoaXMuc3RhdGUsIGJ5KSB9XG5cbiAgaW5QZW5kaW5nU3luY1N0YXRlKCl7XG4gICAgcmV0dXJuICF0aGlzLmpvaW5SZWYgfHwgKHRoaXMuam9pblJlZiAhPT0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKSlcbiAgfVxuXG4gIC8vIGxvd2VyLWxldmVsIHB1YmxpYyBzdGF0aWMgQVBJXG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc3luYyB0aGUgbGlzdCBvZiBwcmVzZW5jZXMgb24gdGhlIHNlcnZlclxuICAgKiB3aXRoIHRoZSBjbGllbnQncyBzdGF0ZS4gQW4gb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFjayBjYW5cbiAgICogYmUgcHJvdmlkZWQgdG8gcmVhY3QgdG8gY2hhbmdlcyBpbiB0aGUgY2xpZW50J3MgbG9jYWwgcHJlc2VuY2VzIGFjcm9zc1xuICAgKiBkaXNjb25uZWN0cyBhbmQgcmVjb25uZWN0cyB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBzeW5jU3RhdGUoY3VycmVudFN0YXRlLCBuZXdTdGF0ZSwgb25Kb2luLCBvbkxlYXZlKXtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLmNsb25lKGN1cnJlbnRTdGF0ZSlcbiAgICBsZXQgam9pbnMgPSB7fVxuICAgIGxldCBsZWF2ZXMgPSB7fVxuXG4gICAgdGhpcy5tYXAoc3RhdGUsIChrZXksIHByZXNlbmNlKSA9PiB7XG4gICAgICBpZighbmV3U3RhdGVba2V5XSl7XG4gICAgICAgIGxlYXZlc1trZXldID0gcHJlc2VuY2VcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMubWFwKG5ld1N0YXRlLCAoa2V5LCBuZXdQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBuZXdSZWZzID0gbmV3UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgY3VyUmVmcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBqb2luZWRNZXRhcyA9IG5ld1ByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IGN1clJlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgbGV0IGxlZnRNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBuZXdSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIGlmKGpvaW5lZE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGpvaW5zW2tleV0gPSBuZXdQcmVzZW5jZVxuICAgICAgICAgIGpvaW5zW2tleV0ubWV0YXMgPSBqb2luZWRNZXRhc1xuICAgICAgICB9XG4gICAgICAgIGlmKGxlZnRNZXRhcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICBsZWF2ZXNba2V5XSA9IHRoaXMuY2xvbmUoY3VycmVudFByZXNlbmNlKVxuICAgICAgICAgIGxlYXZlc1trZXldLm1ldGFzID0gbGVmdE1ldGFzXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGpvaW5zW2tleV0gPSBuZXdQcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuc3luY0RpZmYoc3RhdGUsIHtqb2luczogam9pbnMsIGxlYXZlczogbGVhdmVzfSwgb25Kb2luLCBvbkxlYXZlKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFVzZWQgdG8gc3luYyBhIGRpZmYgb2YgcHJlc2VuY2Ugam9pbiBhbmQgbGVhdmVcbiAgICogZXZlbnRzIGZyb20gdGhlIHNlcnZlciwgYXMgdGhleSBoYXBwZW4uIExpa2UgYHN5bmNTdGF0ZWAsIGBzeW5jRGlmZmBcbiAgICogYWNjZXB0cyBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrcyB0byByZWFjdCB0byBhIHVzZXJcbiAgICogam9pbmluZyBvciBsZWF2aW5nIGZyb20gYSBkZXZpY2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBzeW5jRGlmZihzdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKXtcbiAgICBsZXQge2pvaW5zLCBsZWF2ZXN9ID0gdGhpcy5jbG9uZShkaWZmKVxuICAgIGlmKCFvbkpvaW4peyBvbkpvaW4gPSBmdW5jdGlvbiAoKXsgfSB9XG4gICAgaWYoIW9uTGVhdmUpeyBvbkxlYXZlID0gZnVuY3Rpb24gKCl7IH0gfVxuXG4gICAgdGhpcy5tYXAoam9pbnMsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgc3RhdGVba2V5XSA9IHRoaXMuY2xvbmUobmV3UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2Upe1xuICAgICAgICBsZXQgam9pbmVkUmVmcyA9IHN0YXRlW2tleV0ubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgY3VyTWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gam9pbmVkUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBzdGF0ZVtrZXldLm1ldGFzLnVuc2hpZnQoLi4uY3VyTWV0YXMpXG4gICAgICB9XG4gICAgICBvbkpvaW4oa2V5LCBjdXJyZW50UHJlc2VuY2UsIG5ld1ByZXNlbmNlKVxuICAgIH0pXG4gICAgdGhpcy5tYXAobGVhdmVzLCAoa2V5LCBsZWZ0UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBpZighY3VycmVudFByZXNlbmNlKXsgcmV0dXJuIH1cbiAgICAgIGxldCByZWZzVG9SZW1vdmUgPSBsZWZ0UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgY3VycmVudFByZXNlbmNlLm1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihwID0+IHtcbiAgICAgICAgcmV0dXJuIHJlZnNUb1JlbW92ZS5pbmRleE9mKHAucGh4X3JlZikgPCAwXG4gICAgICB9KVxuICAgICAgb25MZWF2ZShrZXksIGN1cnJlbnRQcmVzZW5jZSwgbGVmdFByZXNlbmNlKVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlLm1ldGFzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIGRlbGV0ZSBzdGF0ZVtrZXldXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gc3RhdGVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcmVzZW5jZXMsIHdpdGggc2VsZWN0ZWQgbWV0YWRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmVzZW5jZXNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2hvb3NlclxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgbGlzdChwcmVzZW5jZXMsIGNob29zZXIpe1xuICAgIGlmKCFjaG9vc2VyKXsgY2hvb3NlciA9IGZ1bmN0aW9uIChrZXksIHByZXMpeyByZXR1cm4gcHJlcyB9IH1cblxuICAgIHJldHVybiB0aGlzLm1hcChwcmVzZW5jZXMsIChrZXksIHByZXNlbmNlKSA9PiB7XG4gICAgICByZXR1cm4gY2hvb3NlcihrZXksIHByZXNlbmNlKVxuICAgIH0pXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgc3RhdGljIG1hcChvYmosIGZ1bmMpe1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLm1hcChrZXkgPT4gZnVuYyhrZXksIG9ialtrZXldKSlcbiAgfVxuXG4gIHN0YXRpYyBjbG9uZShvYmopeyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSB9XG59XG4iLCAiLyogVGhlIGRlZmF1bHQgc2VyaWFsaXplciBmb3IgZW5jb2RpbmcgYW5kIGRlY29kaW5nIG1lc3NhZ2VzICovXG5pbXBvcnQge1xuICBDSEFOTkVMX0VWRU5UU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEhFQURFUl9MRU5HVEg6IDEsXG4gIE1FVEFfTEVOR1RIOiA0LFxuICBLSU5EUzoge3B1c2g6IDAsIHJlcGx5OiAxLCBicm9hZGNhc3Q6IDJ9LFxuXG4gIGVuY29kZShtc2csIGNhbGxiYWNrKXtcbiAgICBpZihtc2cucGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RW5jb2RlKG1zZykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBwYXlsb2FkID0gW21zZy5qb2luX3JlZiwgbXNnLnJlZiwgbXNnLnRvcGljLCBtc2cuZXZlbnQsIG1zZy5wYXlsb2FkXVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGUocmF3UGF5bG9hZCwgY2FsbGJhY2spe1xuICAgIGlmKHJhd1BheWxvYWQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKXtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLmJpbmFyeURlY29kZShyYXdQYXlsb2FkKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IFtqb2luX3JlZiwgcmVmLCB0b3BpYywgZXZlbnQsIHBheWxvYWRdID0gSlNPTi5wYXJzZShyYXdQYXlsb2FkKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKHtqb2luX3JlZiwgcmVmLCB0b3BpYywgZXZlbnQsIHBheWxvYWR9KVxuICAgIH1cbiAgfSxcblxuICAvLyBwcml2YXRlXG5cbiAgYmluYXJ5RW5jb2RlKG1lc3NhZ2Upe1xuICAgIGxldCB7am9pbl9yZWYsIHJlZiwgZXZlbnQsIHRvcGljLCBwYXlsb2FkfSA9IG1lc3NhZ2VcbiAgICBsZXQgbWV0YUxlbmd0aCA9IHRoaXMuTUVUQV9MRU5HVEggKyBqb2luX3JlZi5sZW5ndGggKyByZWYubGVuZ3RoICsgdG9waWMubGVuZ3RoICsgZXZlbnQubGVuZ3RoXG4gICAgbGV0IGhlYWRlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLkhFQURFUl9MRU5HVEggKyBtZXRhTGVuZ3RoKVxuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGhlYWRlcilcbiAgICBsZXQgb2Zmc2V0ID0gMFxuXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdGhpcy5LSU5EUy5wdXNoKSAvLyBraW5kXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgam9pbl9yZWYubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIHJlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdG9waWMubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGV2ZW50Lmxlbmd0aClcbiAgICBBcnJheS5mcm9tKGpvaW5fcmVmLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbShyZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHRvcGljLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbShldmVudCwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuXG4gICAgdmFyIGNvbWJpbmVkID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyLmJ5dGVMZW5ndGggKyBwYXlsb2FkLmJ5dGVMZW5ndGgpXG4gICAgY29tYmluZWQuc2V0KG5ldyBVaW50OEFycmF5KGhlYWRlciksIDApXG4gICAgY29tYmluZWQuc2V0KG5ldyBVaW50OEFycmF5KHBheWxvYWQpLCBoZWFkZXIuYnl0ZUxlbmd0aClcblxuICAgIHJldHVybiBjb21iaW5lZC5idWZmZXJcbiAgfSxcblxuICBiaW5hcnlEZWNvZGUoYnVmZmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpXG4gICAgbGV0IGtpbmQgPSB2aWV3LmdldFVpbnQ4KDApXG4gICAgbGV0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKVxuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5wdXNoOiByZXR1cm4gdGhpcy5kZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5yZXBseTogcmV0dXJuIHRoaXMuZGVjb2RlUmVwbHkoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLmJyb2FkY2FzdDogcmV0dXJuIHRoaXMuZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICB9XG4gIH0sXG5cbiAgZGVjb2RlUHVzaChidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIHRoaXMuTUVUQV9MRU5HVEggLSAxIC8vIHB1c2hlcyBoYXZlIG5vIHJlZlxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG4gICAgcmV0dXJuIHtqb2luX3JlZjogam9pblJlZiwgcmVmOiBudWxsLCB0b3BpYzogdG9waWMsIGV2ZW50OiBldmVudCwgcGF5bG9hZDogZGF0YX1cbiAgfSxcblxuICBkZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgcmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgzKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDQpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIHRoaXMuTUVUQV9MRU5HVEhcbiAgICBsZXQgam9pblJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGpvaW5SZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBqb2luUmVmU2l6ZVxuICAgIGxldCByZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyByZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyByZWZTaXplXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG4gICAgbGV0IHBheWxvYWQgPSB7c3RhdHVzOiBldmVudCwgcmVzcG9uc2U6IGRhdGF9XG4gICAgcmV0dXJuIHtqb2luX3JlZjogam9pblJlZiwgcmVmOiByZWYsIHRvcGljOiB0b3BpYywgZXZlbnQ6IENIQU5ORUxfRVZFTlRTLnJlcGx5LCBwYXlsb2FkOiBwYXlsb2FkfVxuICB9LFxuXG4gIGRlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDEpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgMlxuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplXG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemVcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIHtqb2luX3JlZjogbnVsbCwgcmVmOiBudWxsLCB0b3BpYzogdG9waWMsIGV2ZW50OiBldmVudCwgcGF5bG9hZDogZGF0YX1cbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIGdsb2JhbCxcbiAgcGh4V2luZG93LFxuICBDSEFOTkVMX0VWRU5UUyxcbiAgREVGQVVMVF9USU1FT1VULFxuICBERUZBVUxUX1ZTTixcbiAgU09DS0VUX1NUQVRFUyxcbiAgVFJBTlNQT1JUUyxcbiAgV1NfQ0xPU0VfTk9STUFMLFxuICBBVVRIX1RPS0VOX1BSRUZJWFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9zdXJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEFqYXggZnJvbSBcIi4vYWpheFwiXG5pbXBvcnQgQ2hhbm5lbCBmcm9tIFwiLi9jaGFubmVsXCJcbmltcG9ydCBMb25nUG9sbCBmcm9tIFwiLi9sb25ncG9sbFwiXG5pbXBvcnQgU2VyaWFsaXplciBmcm9tIFwiLi9zZXJpYWxpemVyXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKiBJbml0aWFsaXplcyB0aGUgU29ja2V0ICpcbiAqXG4gKiBGb3IgSUU4IHN1cHBvcnQgdXNlIGFuIEVTNS1zaGltIChodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3czovL2V4YW1wbGUuY29tL3NvY2tldFwiYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCJ3c3M6Ly9leGFtcGxlLmNvbVwiYFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9zb2NrZXRcImAgKGluaGVyaXRlZCBob3N0ICYgcHJvdG9jb2wpXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMudHJhbnNwb3J0XSAtIFRoZSBXZWJzb2NrZXQgVHJhbnNwb3J0LCBmb3IgZXhhbXBsZSBXZWJTb2NrZXQgb3IgUGhvZW5peC5Mb25nUG9sbC5cbiAqXG4gKiBEZWZhdWx0cyB0byBXZWJTb2NrZXQgd2l0aCBhdXRvbWF0aWMgTG9uZ1BvbGwgZmFsbGJhY2sgaWYgV2ViU29ja2V0IGlzIG5vdCBkZWZpbmVkLlxuICogVG8gZmFsbGJhY2sgdG8gTG9uZ1BvbGwgd2hlbiBXZWJTb2NrZXQgYXR0ZW1wdHMgZmFpbCwgdXNlIGBsb25nUG9sbEZhbGxiYWNrTXM6IDI1MDBgLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5sb25nUG9sbEZhbGxiYWNrTXNdIC0gVGhlIG1pbGxpc2Vjb25kIHRpbWUgdG8gYXR0ZW1wdCB0aGUgcHJpbWFyeSB0cmFuc3BvcnRcbiAqIGJlZm9yZSBmYWxsaW5nIGJhY2sgdG8gdGhlIExvbmdQb2xsIHRyYW5zcG9ydC4gRGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmRlYnVnXSAtIFdoZW4gdHJ1ZSwgZW5hYmxlcyBkZWJ1ZyBsb2dnaW5nLiBEZWZhdWx0IGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmVuY29kZV0gLSBUaGUgZnVuY3Rpb24gdG8gZW5jb2RlIG91dGdvaW5nIG1lc3NhZ2VzLlxuICpcbiAqIERlZmF1bHRzIHRvIEpTT04gZW5jb2Rlci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5kZWNvZGVdIC0gVGhlIGZ1bmN0aW9uIHRvIGRlY29kZSBpbmNvbWluZyBtZXNzYWdlcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBKU09OOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIChwYXlsb2FkLCBjYWxsYmFjaykgPT4gY2FsbGJhY2soSlNPTi5wYXJzZShwYXlsb2FkKSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lb3V0XSAtIFRoZSBkZWZhdWx0IHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIHRyaWdnZXIgcHVzaCB0aW1lb3V0cy5cbiAqXG4gKiBEZWZhdWx0cyBgREVGQVVMVF9USU1FT1VUYFxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmhlYXJ0YmVhdEludGVydmFsTXNdIC0gVGhlIG1pbGxpc2VjIGludGVydmFsIHRvIHNlbmQgYSBoZWFydGJlYXQgbWVzc2FnZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucmVjb25uZWN0QWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICogc29ja2V0IHJlY29ubmVjdCBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIERlZmF1bHRzIHRvIHN0ZXBwZWQgYmFja29mZiBvZjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucmVqb2luQWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBtaWxsaXNlY1xuICogcmVqb2luIGludGVydmFsIGZvciBpbmRpdmlkdWFsIGNoYW5uZWxzLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMubG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZywgaWU6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24oa2luZCwgbXNnLCBkYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKGAke2tpbmR9OiAke21zZ31gLCBkYXRhKVxuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmxvbmdwb2xsZXJUaW1lb3V0XSAtIFRoZSBtYXhpbXVtIHRpbWVvdXQgb2YgYSBsb25nIHBvbGwgQUpBWCByZXF1ZXN0LlxuICpcbiAqIERlZmF1bHRzIHRvIDIwcyAoZG91YmxlIHRoZSBzZXJ2ZXIgbG9uZyBwb2xsIHRpbWVyKS5cbiAqXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24pfSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIHBhcmFtcyB0byBwYXNzIHdoZW4gY29ubmVjdGluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmF1dGhUb2tlbl0gLSB0aGUgb3B0aW9uYWwgYXV0aGVudGljYXRpb24gdG9rZW4gdG8gYmUgZXhwb3NlZCBvbiB0aGUgc2VydmVyXG4gKiB1bmRlciB0aGUgYDphdXRoX3Rva2VuYCBjb25uZWN0X2luZm8ga2V5LlxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmFyeVR5cGVdIC0gVGhlIGJpbmFyeSB0eXBlIHRvIHVzZSBmb3IgYmluYXJ5IFdlYlNvY2tldCBmcmFtZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gXCJhcnJheWJ1ZmZlclwiXG4gKlxuICogQHBhcmFtIHt2c259IFtvcHRzLnZzbl0gLSBUaGUgc2VyaWFsaXplcidzIHByb3RvY29sIHZlcnNpb24gdG8gc2VuZCBvbiBjb25uZWN0LlxuICpcbiAqIERlZmF1bHRzIHRvIERFRkFVTFRfVlNOLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBQaG9lbml4IHVzZXMgc2Vzc2lvblN0b3JhZ2UgZm9yIGxvbmdwb2xsIGZhbGxiYWNrIGhpc3RvcnkuIE92ZXJyaWRpbmcgdGhlIHN0b3JlIGlzXG4gKiB1c2VmdWwgd2hlbiBQaG9lbml4IHdvbid0IGhhdmUgYWNjZXNzIHRvIGBzZXNzaW9uU3RvcmFnZWAuIEZvciBleGFtcGxlLCBUaGlzIGNvdWxkXG4gKiBoYXBwZW4gaWYgYSBzaXRlIGxvYWRzIGEgY3Jvc3MtZG9tYWluIGNoYW5uZWwgaW4gYW4gaWZyYW1lLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqICAgICBjbGFzcyBJbk1lbW9yeVN0b3JhZ2Uge1xuICogICAgICAgY29uc3RydWN0b3IoKSB7IHRoaXMuc3RvcmFnZSA9IHt9IH1cbiAqICAgICAgIGdldEl0ZW0oa2V5TmFtZSkgeyByZXR1cm4gdGhpcy5zdG9yYWdlW2tleU5hbWVdIHx8IG51bGwgfVxuICogICAgICAgcmVtb3ZlSXRlbShrZXlOYW1lKSB7IGRlbGV0ZSB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gfVxuICogICAgICAgc2V0SXRlbShrZXlOYW1lLCBrZXlWYWx1ZSkgeyB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gPSBrZXlWYWx1ZSB9XG4gKiAgICAgfVxuICpcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXQge1xuICBjb25zdHJ1Y3RvcihlbmRQb2ludCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzID0ge29wZW46IFtdLCBjbG9zZTogW10sIGVycm9yOiBbXSwgbWVzc2FnZTogW119XG4gICAgdGhpcy5jaGFubmVscyA9IFtdXG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQgfHwgREVGQVVMVF9USU1FT1VUXG4gICAgdGhpcy50cmFuc3BvcnQgPSBvcHRzLnRyYW5zcG9ydCB8fCBnbG9iYWwuV2ViU29ja2V0IHx8IExvbmdQb2xsXG4gICAgdGhpcy5wcmltYXJ5UGFzc2VkSGVhbHRoQ2hlY2sgPSBmYWxzZVxuICAgIHRoaXMubG9uZ1BvbGxGYWxsYmFja01zID0gb3B0cy5sb25nUG9sbEZhbGxiYWNrTXNcbiAgICB0aGlzLmZhbGxiYWNrVGltZXIgPSBudWxsXG4gICAgdGhpcy5zZXNzaW9uU3RvcmUgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IChnbG9iYWwgJiYgZ2xvYmFsLnNlc3Npb25TdG9yYWdlKVxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucyA9IDBcbiAgICB0aGlzLmRlZmF1bHRFbmNvZGVyID0gU2VyaWFsaXplci5lbmNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuZGVmYXVsdERlY29kZXIgPSBTZXJpYWxpemVyLmRlY29kZS5iaW5kKFNlcmlhbGl6ZXIpXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSBmYWxzZVxuICAgIHRoaXMuYmluYXJ5VHlwZSA9IG9wdHMuYmluYXJ5VHlwZSB8fCBcImFycmF5YnVmZmVyXCJcbiAgICB0aGlzLmNvbm5lY3RDbG9jayA9IDFcbiAgICBpZih0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5lbmNvZGUgPSBvcHRzLmVuY29kZSB8fCB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IG9wdHMuZGVjb2RlIHx8IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmNvZGUgPSB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9XG4gICAgbGV0IGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgaWYocGh4V2luZG93ICYmIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IHRoaXMuY29ubmVjdENsb2NrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VzaG93XCIsIF9lID0+IHtcbiAgICAgICAgaWYoYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9PT0gdGhpcy5jb25uZWN0Q2xvY2spe1xuICAgICAgICAgIGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgICAgICAgdGhpcy5jb25uZWN0KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zID0gb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zIHx8IDMwMDAwXG4gICAgdGhpcy5yZWpvaW5BZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlam9pbkFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWpvaW5BZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVjb25uZWN0QWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYob3B0cy5yZWNvbm5lY3RBZnRlck1zKXtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVjb25uZWN0QWZ0ZXJNcyh0cmllcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXIgfHwgbnVsbFxuICAgIGlmKCF0aGlzLmxvZ2dlciAmJiBvcHRzLmRlYnVnKXtcbiAgICAgIHRoaXMubG9nZ2VyID0gKGtpbmQsIG1zZywgZGF0YSkgPT4geyBjb25zb2xlLmxvZyhgJHtraW5kfTogJHttc2d9YCwgZGF0YSkgfVxuICAgIH1cbiAgICB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0ID0gb3B0cy5sb25ncG9sbGVyVGltZW91dCB8fCAyMDAwMFxuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLmVuZFBvaW50ID0gYCR7ZW5kUG9pbnR9LyR7VFJBTlNQT1JUUy53ZWJzb2NrZXR9YFxuICAgIHRoaXMudnNuID0gb3B0cy52c24gfHwgREVGQVVMVF9WU05cbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IG51bGxcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gbnVsbFxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIHRoaXMudGVhcmRvd24oKCkgPT4gdGhpcy5jb25uZWN0KCkpXG4gICAgfSwgdGhpcy5yZWNvbm5lY3RBZnRlck1zKVxuICAgIHRoaXMuYXV0aFRva2VuID0gb3B0cy5hdXRoVG9rZW5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBMb25nUG9sbCB0cmFuc3BvcnQgcmVmZXJlbmNlXG4gICAqL1xuICBnZXRMb25nUG9sbFRyYW5zcG9ydCgpeyByZXR1cm4gTG9uZ1BvbGwgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBhbmQgcmVwbGFjZXMgdGhlIGFjdGl2ZSB0cmFuc3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3VHJhbnNwb3J0IC0gVGhlIG5ldyB0cmFuc3BvcnQgY2xhc3MgdG8gaW5zdGFudGlhdGVcbiAgICpcbiAgICovXG4gIHJlcGxhY2VUcmFuc3BvcnQobmV3VHJhbnNwb3J0KXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gdHJ1ZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgaWYodGhpcy5jb25uKXtcbiAgICAgIHRoaXMuY29ubi5jbG9zZSgpXG4gICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgfVxuICAgIHRoaXMudHJhbnNwb3J0ID0gbmV3VHJhbnNwb3J0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc29ja2V0IHByb3RvY29sXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90b2NvbCgpeyByZXR1cm4gbG9jYXRpb24ucHJvdG9jb2wubWF0Y2goL15odHRwcy8pID8gXCJ3c3NcIiA6IFwid3NcIiB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxseSBxdWFsaWZpZWQgc29ja2V0IHVybFxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZW5kUG9pbnRVUkwoKXtcbiAgICBsZXQgdXJpID0gQWpheC5hcHBlbmRQYXJhbXMoXG4gICAgICBBamF4LmFwcGVuZFBhcmFtcyh0aGlzLmVuZFBvaW50LCB0aGlzLnBhcmFtcygpKSwge3ZzbjogdGhpcy52c259KVxuICAgIGlmKHVyaS5jaGFyQXQoMCkgIT09IFwiL1wiKXsgcmV0dXJuIHVyaSB9XG4gICAgaWYodXJpLmNoYXJBdCgxKSA9PT0gXCIvXCIpeyByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfToke3VyaX1gIH1cblxuICAgIHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9Oi8vJHtsb2NhdGlvbi5ob3N0fSR7dXJpfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyB0aGUgc29ja2V0XG4gICAqXG4gICAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2xvc2VFdmVudCNTdGF0dXNfY29kZXMgZm9yIHZhbGlkIHN0YXR1cyBjb2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgYWZ0ZXIgc29ja2V0IGlzIGRpc2Nvbm5lY3RlZC5cbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBjb2RlIC0gQSBzdGF0dXMgY29kZSBmb3IgZGlzY29ubmVjdGlvbiAoT3B0aW9uYWwpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVhc29uIC0gQSB0ZXh0dWFsIGRlc2NyaXB0aW9uIG9mIHRoZSByZWFzb24gdG8gZGlzY29ubmVjdC4gKE9wdGlvbmFsKVxuICAgKi9cbiAgZGlzY29ubmVjdChjYWxsYmFjaywgY29kZSwgcmVhc29uKXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5kaXNjb25uZWN0aW5nID0gdHJ1ZVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IHRydWVcbiAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMudGVhcmRvd24oKCkgPT4ge1xuICAgICAgdGhpcy5kaXNjb25uZWN0aW5nID0gZmFsc2VcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9LCBjb2RlLCByZWFzb24pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbXMgdG8gc2VuZCB3aGVuIGNvbm5lY3RpbmcsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogdXNlclRva2VufWBcbiAgICpcbiAgICogUGFzc2luZyBwYXJhbXMgdG8gY29ubmVjdCBpcyBkZXByZWNhdGVkOyBwYXNzIHRoZW0gaW4gdGhlIFNvY2tldCBjb25zdHJ1Y3RvciBpbnN0ZWFkOlxuICAgKiBgbmV3IFNvY2tldChcIi9zb2NrZXRcIiwge3BhcmFtczoge3VzZXJfaWQ6IHVzZXJUb2tlbn19KWAuXG4gICAqL1xuICBjb25uZWN0KHBhcmFtcyl7XG4gICAgaWYocGFyYW1zKXtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJwYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQgcGFzcyA6cGFyYW1zIHRvIHRoZSBTb2NrZXQgY29uc3RydWN0b3JcIilcbiAgICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMpXG4gICAgfVxuICAgIGlmKHRoaXMuY29ubiAmJiAhdGhpcy5kaXNjb25uZWN0aW5nKXsgcmV0dXJuIH1cbiAgICBpZih0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcyAmJiB0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5jb25uZWN0V2l0aEZhbGxiYWNrKExvbmdQb2xsLCB0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmFuc3BvcnRDb25uZWN0KClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ncyB0aGUgbWVzc2FnZS4gT3ZlcnJpZGUgYHRoaXMubG9nZ2VyYCBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZy4gbm9vcHMgYnkgZGVmYXVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2luZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBsb2coa2luZCwgbXNnLCBkYXRhKXsgdGhpcy5sb2dnZXIgJiYgdGhpcy5sb2dnZXIoa2luZCwgbXNnLCBkYXRhKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIGxvZ2dlciBoYXMgYmVlbiBzZXQgb24gdGhpcyBzb2NrZXQuXG4gICAqL1xuICBoYXNMb2dnZXIoKXsgcmV0dXJuIHRoaXMubG9nZ2VyICE9PSBudWxsIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBvcGVuIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25PcGVuKGZ1bmN0aW9uKCl7IGNvbnNvbGUuaW5mbyhcInRoZSBzb2NrZXQgd2FzIG9wZW5lZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25PcGVuKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4ucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gY2xvc2UgZXZlbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkNsb3NlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGVycm9yIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25FcnJvcihmdW5jdGlvbihlcnJvcil7IGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gbWVzc2FnZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uTWVzc2FnZShjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBQaW5ncyB0aGUgc2VydmVyIGFuZCBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBSVFQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGluZyB3YXMgcHVzaGVkIG9yIGZhbHNlIGlmIHVuYWJsZSB0byBiZSBwdXNoZWQuXG4gICAqL1xuICBwaW5nKGNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogcmVmfSlcbiAgICBsZXQgb25Nc2dSZWYgPSB0aGlzLm9uTWVzc2FnZShtc2cgPT4ge1xuICAgICAgaWYobXNnLnJlZiA9PT0gcmVmKXtcbiAgICAgICAgdGhpcy5vZmYoW29uTXNnUmVmXSlcbiAgICAgICAgY2FsbGJhY2soRGF0ZS5ub3coKSAtIHN0YXJ0VGltZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgdHJhbnNwb3J0Q29ubmVjdCgpe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIGxldCBwcm90b2NvbHMgPSB1bmRlZmluZWRcbiAgICAvLyBTZWMtV2ViU29ja2V0LVByb3RvY29sIGJhc2VkIHRva2VuXG4gICAgLy8gKGxvbmdwb2xsIHVzZXMgQXV0aG9yaXphdGlvbiBoZWFkZXIgaW5zdGVhZClcbiAgICBpZih0aGlzLmF1dGhUb2tlbil7XG4gICAgICBwcm90b2NvbHMgPSBbXCJwaG9lbml4XCIsIGAke0FVVEhfVE9LRU5fUFJFRklYfSR7YnRvYSh0aGlzLmF1dGhUb2tlbikucmVwbGFjZSgvPS9nLCBcIlwiKX1gXVxuICAgIH1cbiAgICB0aGlzLmNvbm4gPSBuZXcgdGhpcy50cmFuc3BvcnQodGhpcy5lbmRQb2ludFVSTCgpLCBwcm90b2NvbHMpXG4gICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSB0aGlzLmJpbmFyeVR5cGVcbiAgICB0aGlzLmNvbm4udGltZW91dCA9IHRoaXMubG9uZ3BvbGxlclRpbWVvdXRcbiAgICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5vbkNvbm5PcGVuKClcbiAgICB0aGlzLmNvbm4ub25lcnJvciA9IGVycm9yID0+IHRoaXMub25Db25uRXJyb3IoZXJyb3IpXG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHRoaXMub25Db25uTWVzc2FnZShldmVudClcbiAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGV2ZW50ID0+IHRoaXMub25Db25uQ2xvc2UoZXZlbnQpXG4gIH1cblxuICBnZXRTZXNzaW9uKGtleSl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yZSAmJiB0aGlzLnNlc3Npb25TdG9yZS5nZXRJdGVtKGtleSkgfVxuXG4gIHN0b3JlU2Vzc2lvbihrZXksIHZhbCl7IHRoaXMuc2Vzc2lvblN0b3JlICYmIHRoaXMuc2Vzc2lvblN0b3JlLnNldEl0ZW0oa2V5LCB2YWwpIH1cblxuICBjb25uZWN0V2l0aEZhbGxiYWNrKGZhbGxiYWNrVHJhbnNwb3J0LCBmYWxsYmFja1RocmVzaG9sZCA9IDI1MDApe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgbGV0IGVzdGFibGlzaGVkID0gZmFsc2VcbiAgICBsZXQgcHJpbWFyeVRyYW5zcG9ydCA9IHRydWVcbiAgICBsZXQgb3BlblJlZiwgZXJyb3JSZWZcbiAgICBsZXQgZmFsbGJhY2sgPSAocmVhc29uKSA9PiB7XG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZmFsbGluZyBiYWNrIHRvICR7ZmFsbGJhY2tUcmFuc3BvcnQubmFtZX0uLi5gLCByZWFzb24pXG4gICAgICB0aGlzLm9mZihbb3BlblJlZiwgZXJyb3JSZWZdKVxuICAgICAgcHJpbWFyeVRyYW5zcG9ydCA9IGZhbHNlXG4gICAgICB0aGlzLnJlcGxhY2VUcmFuc3BvcnQoZmFsbGJhY2tUcmFuc3BvcnQpXG4gICAgICB0aGlzLnRyYW5zcG9ydENvbm5lY3QoKVxuICAgIH1cbiAgICBpZih0aGlzLmdldFNlc3Npb24oYHBoeDpmYWxsYmFjazoke2ZhbGxiYWNrVHJhbnNwb3J0Lm5hbWV9YCkpeyByZXR1cm4gZmFsbGJhY2soXCJtZW1vcml6ZWRcIikgfVxuXG4gICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG5cbiAgICBlcnJvclJlZiA9IHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJlcnJvclwiLCByZWFzb24pXG4gICAgICBpZihwcmltYXJ5VHJhbnNwb3J0ICYmICFlc3RhYmxpc2hlZCl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgICAgIGZhbGxiYWNrKHJlYXNvbilcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMub25PcGVuKCgpID0+IHtcbiAgICAgIGVzdGFibGlzaGVkID0gdHJ1ZVxuICAgICAgaWYoIXByaW1hcnlUcmFuc3BvcnQpe1xuICAgICAgICAvLyBvbmx5IG1lbW9yaXplIExQIGlmIHdlIG5ldmVyIGNvbm5lY3RlZCB0byBwcmltYXJ5XG4gICAgICAgIGlmKCF0aGlzLnByaW1hcnlQYXNzZWRIZWFsdGhDaGVjayl7IHRoaXMuc3RvcmVTZXNzaW9uKGBwaHg6ZmFsbGJhY2s6JHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfWAsIFwidHJ1ZVwiKSB9XG4gICAgICAgIHJldHVybiB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZXN0YWJsaXNoZWQgJHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfSBmYWxsYmFja2ApXG4gICAgICB9XG4gICAgICAvLyBpZiB3ZSd2ZSBlc3RhYmxpc2hlZCBwcmltYXJ5LCBnaXZlIHRoZSBmYWxsYmFjayBhIG5ldyBwZXJpb2QgdG8gYXR0ZW1wdCBwaW5nXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG4gICAgICB0aGlzLnBpbmcocnR0ID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJjb25uZWN0ZWQgdG8gcHJpbWFyeSBhZnRlclwiLCBydHQpXG4gICAgICAgIHRoaXMucHJpbWFyeVBhc3NlZEhlYWx0aENoZWNrID0gdHJ1ZVxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMudHJhbnNwb3J0Q29ubmVjdCgpXG4gIH1cblxuICBjbGVhckhlYXJ0YmVhdHMoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpXG4gIH1cblxuICBvbkNvbm5PcGVuKCl7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYCR7dGhpcy50cmFuc3BvcnQubmFtZX0gY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSBmYWxzZVxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucysrXG4gICAgdGhpcy5mbHVzaFNlbmRCdWZmZXIoKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMucmVzZXRIZWFydGJlYXQoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mub3Blbi5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IGNhbGxiYWNrKCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgaGVhcnRiZWF0VGltZW91dCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXsgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJoZWFydGJlYXQgdGltZW91dC4gQXR0ZW1wdGluZyB0byByZS1lc3RhYmxpc2ggY29ubmVjdGlvblwiKSB9XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICAgIHRoaXMudGVhcmRvd24oKCkgPT4gdGhpcy5yZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSwgV1NfQ0xPU0VfTk9STUFMLCBcImhlYXJ0YmVhdCB0aW1lb3V0XCIpXG4gICAgfVxuICB9XG5cbiAgcmVzZXRIZWFydGJlYXQoKXtcbiAgICBpZih0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnNraXBIZWFydGJlYXQpeyByZXR1cm4gfVxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIHRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIGlmKCF0aGlzLmNvbm4pe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG4gICAgbGV0IGNvbm5lY3RDbG9jayA9IHRoaXMuY29ubmVjdENsb2NrXG5cbiAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKCgpID0+IHtcbiAgICAgIGlmKGNvbm5lY3RDbG9jayAhPT0gdGhpcy5jb25uZWN0Q2xvY2speyByZXR1cm4gfVxuICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgaWYoY29kZSl7IHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24gfHwgXCJcIikgfSBlbHNlIHsgdGhpcy5jb25uLmNsb3NlKCkgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoKCkgPT4ge1xuICAgICAgICBpZihjb25uZWN0Q2xvY2sgIT09IHRoaXMuY29ubmVjdENsb2NrKXsgcmV0dXJuIH1cbiAgICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgICB0aGlzLmNvbm4ub25vcGVuID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbmVycm9yID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uLm9uY2xvc2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uID0gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgd2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzID0gMSl7XG4gICAgaWYodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCAhdGhpcy5jb25uLmJ1ZmZlcmVkQW1vdW50KXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy53YWl0Rm9yQnVmZmVyRG9uZShjYWxsYmFjaywgdHJpZXMgKyAxKVxuICAgIH0sIDE1MCAqIHRyaWVzKVxuICB9XG5cbiAgd2FpdEZvclNvY2tldENsb3NlZChjYWxsYmFjaywgdHJpZXMgPSAxKXtcbiAgICBpZih0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8IHRoaXMuY29ubi5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNsb3NlZCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZChjYWxsYmFjaywgdHJpZXMgKyAxKVxuICAgIH0sIDE1MCAqIHRyaWVzKVxuICB9XG5cbiAgb25Db25uQ2xvc2UoZXZlbnQpe1xuICAgIGxldCBjbG9zZUNvZGUgPSBldmVudCAmJiBldmVudC5jb2RlXG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJjbG9zZVwiLCBldmVudClcbiAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgIHRoaXMuY2xlYXJIZWFydGJlYXRzKClcbiAgICBpZighdGhpcy5jbG9zZVdhc0NsZWFuICYmIGNsb3NlQ29kZSAhPT0gMTAwMCl7XG4gICAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpXG4gICAgfVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UuZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjayhldmVudCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubkVycm9yKGVycm9yKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBlcnJvcilcbiAgICBsZXQgdHJhbnNwb3J0QmVmb3JlID0gdGhpcy50cmFuc3BvcnRcbiAgICBsZXQgZXN0YWJsaXNoZWRCZWZvcmUgPSB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnNcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4ge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIHRyYW5zcG9ydEJlZm9yZSwgZXN0YWJsaXNoZWRCZWZvcmUpXG4gICAgfSlcbiAgICBpZih0cmFuc3BvcnRCZWZvcmUgPT09IHRoaXMudHJhbnNwb3J0IHx8IGVzdGFibGlzaGVkQmVmb3JlID4gMCl7XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlckNoYW5FcnJvcigpe1xuICAgIHRoaXMuY2hhbm5lbHMuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGlmKCEoY2hhbm5lbC5pc0Vycm9yZWQoKSB8fCBjaGFubmVsLmlzTGVhdmluZygpIHx8IGNoYW5uZWwuaXNDbG9zZWQoKSkpe1xuICAgICAgICBjaGFubmVsLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgY29ubmVjdGlvblN0YXRlKCl7XG4gICAgc3dpdGNoKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4ucmVhZHlTdGF0ZSl7XG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZzogcmV0dXJuIFwiY29ubmVjdGluZ1wiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMub3BlbjogcmV0dXJuIFwib3BlblwiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY2xvc2luZzogcmV0dXJuIFwiY2xvc2luZ1wiXG4gICAgICBkZWZhdWx0OiByZXR1cm4gXCJjbG9zZWRcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLmNvbm5lY3Rpb25TdGF0ZSgpID09PSBcIm9wZW5cIiB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbm5lbH1cbiAgICovXG4gIHJlbW92ZShjaGFubmVsKXtcbiAgICB0aGlzLm9mZihjaGFubmVsLnN0YXRlQ2hhbmdlUmVmcylcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVscy5maWx0ZXIoYyA9PiBjICE9PSBjaGFubmVsKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWAgcmVnaXN0cmF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtyZWZzfSAtIGxpc3Qgb2YgcmVmcyByZXR1cm5lZCBieSBjYWxscyB0b1xuICAgKiAgICAgICAgICAgICAgICAgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWBcbiAgICovXG4gIG9mZihyZWZzKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzKXtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XS5maWx0ZXIoKFtyZWZdKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzLmluZGV4T2YocmVmKSA9PT0gLTFcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhIG5ldyBjaGFubmVsIGZvciB0aGUgZ2l2ZW4gdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjaGFuUGFyYW1zIC0gUGFyYW1ldGVycyBmb3IgdGhlIGNoYW5uZWxcbiAgICogQHJldHVybnMge0NoYW5uZWx9XG4gICAqL1xuICBjaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zID0ge30pe1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW4pXG4gICAgcmV0dXJuIGNoYW5cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgcHVzaChkYXRhKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IGRhdGFcbiAgICAgIHRoaXMubG9nKFwicHVzaFwiLCBgJHt0b3BpY30gJHtldmVudH0gKCR7am9pbl9yZWZ9LCAke3JlZn0pYCwgcGF5bG9hZClcbiAgICB9XG5cbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkpe1xuICAgICAgdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlci5wdXNoKCgpID0+IHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYgKyAxXG4gICAgaWYobmV3UmVmID09PSB0aGlzLnJlZil7IHRoaXMucmVmID0gMCB9IGVsc2UgeyB0aGlzLnJlZiA9IG5ld1JlZiB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWYudG9TdHJpbmcoKVxuICB9XG5cbiAgc2VuZEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiAmJiAhdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmfSlcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5oZWFydGJlYXRUaW1lb3V0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIGZsdXNoU2VuZEJ1ZmZlcigpe1xuICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKVxuICAgICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB9XG4gIH1cblxuICBvbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2Upe1xuICAgIHRoaXMuZGVjb2RlKHJhd01lc3NhZ2UuZGF0YSwgbXNnID0+IHtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IG1zZ1xuICAgICAgaWYocmVmICYmIHJlZiA9PT0gdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKXtcbiAgICAgICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwicmVjZWl2ZVwiLCBgJHtwYXlsb2FkLnN0YXR1cyB8fCBcIlwifSAke3RvcGljfSAke2V2ZW50fSAke3JlZiAmJiBcIihcIiArIHJlZiArIFwiKVwiIHx8IFwiXCJ9YCwgcGF5bG9hZClcblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hhbm5lbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tpXVxuICAgICAgICBpZighY2hhbm5lbC5pc01lbWJlcih0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5fcmVmKSl7IGNvbnRpbnVlIH1cbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgbGV0IFssIGNhbGxiYWNrXSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZVtpXVxuICAgICAgICBjYWxsYmFjayhtc2cpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxlYXZlT3BlblRvcGljKHRvcGljKXtcbiAgICBsZXQgZHVwQ2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjID0+IGMudG9waWMgPT09IHRvcGljICYmIChjLmlzSm9pbmVkKCkgfHwgYy5pc0pvaW5pbmcoKSkpXG4gICAgaWYoZHVwQ2hhbm5lbCl7XG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgbGVhdmluZyBkdXBsaWNhdGUgdG9waWMgXCIke3RvcGljfVwiYClcbiAgICAgIGR1cENoYW5uZWwubGVhdmUoKVxuICAgIH1cbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBDT05TRUNVVElWRV9SRUxPQURTID0gXCJjb25zZWN1dGl2ZS1yZWxvYWRzXCJcbmV4cG9ydCBjb25zdCBNQVhfUkVMT0FEUyA9IDEwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NSU4gPSA1MDAwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NQVggPSAxMDAwMFxuZXhwb3J0IGNvbnN0IEZBSUxTQUZFX0pJVFRFUiA9IDMwMDAwXG5leHBvcnQgY29uc3QgUEhYX0VWRU5UX0NMQVNTRVMgPSBbXG4gIFwicGh4LWNsaWNrLWxvYWRpbmdcIiwgXCJwaHgtY2hhbmdlLWxvYWRpbmdcIiwgXCJwaHgtc3VibWl0LWxvYWRpbmdcIixcbiAgXCJwaHgta2V5ZG93bi1sb2FkaW5nXCIsIFwicGh4LWtleXVwLWxvYWRpbmdcIiwgXCJwaHgtYmx1ci1sb2FkaW5nXCIsIFwicGh4LWZvY3VzLWxvYWRpbmdcIixcbiAgXCJwaHgtaG9vay1sb2FkaW5nXCJcbl1cbmV4cG9ydCBjb25zdCBQSFhfQ09NUE9ORU5UID0gXCJkYXRhLXBoeC1jb21wb25lbnRcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0xJTksgPSBcImRhdGEtcGh4LWxpbmtcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19TVEFUSUMgPSBcInRyYWNrLXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX0xJTktfU1RBVEUgPSBcImRhdGEtcGh4LWxpbmstc3RhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUZfTE9BRElORyA9IFwiZGF0YS1waHgtcmVmLWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUZfU1JDID0gXCJkYXRhLXBoeC1yZWYtc3JjXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVGX0xPQ0sgPSBcImRhdGEtcGh4LXJlZi1sb2NrXCJcbmV4cG9ydCBjb25zdCBQSFhfUEVORElOR19SRUZTID0gXCJwaHgtcGVuZGluZy1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJBQ0tfVVBMT0FEUyA9IFwidHJhY2stdXBsb2Fkc1wiXG5leHBvcnQgY29uc3QgUEhYX1VQTE9BRF9SRUYgPSBcImRhdGEtcGh4LXVwbG9hZC1yZWZcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUkVGTElHSFRFRF9SRUZTID0gXCJkYXRhLXBoeC1wcmVmbGlnaHRlZC1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfRE9ORV9SRUZTID0gXCJkYXRhLXBoeC1kb25lLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9EUk9QX1RBUkdFVCA9IFwiZHJvcC10YXJnZXRcIlxuZXhwb3J0IGNvbnN0IFBIWF9BQ1RJVkVfRU5UUllfUkVGUyA9IFwiZGF0YS1waHgtYWN0aXZlLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCA9IFwicGh4OmxpdmUtZmlsZTp1cGRhdGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfU0tJUCA9IFwiZGF0YS1waHgtc2tpcFwiXG5leHBvcnQgY29uc3QgUEhYX01BR0lDX0lEID0gXCJkYXRhLXBoeC1pZFwiXG5leHBvcnQgY29uc3QgUEhYX1BSVU5FID0gXCJkYXRhLXBoeC1wcnVuZVwiXG5leHBvcnQgY29uc3QgUEhYX0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWNvbm5lY3RlZFwiXG5leHBvcnQgY29uc3QgUEhYX0xPQURJTkdfQ0xBU1MgPSBcInBoeC1sb2FkaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfRVJST1JfQ0xBU1MgPSBcInBoeC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX0NMSUVOVF9FUlJPUl9DTEFTUyA9IFwicGh4LWNsaWVudC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1NFUlZFUl9FUlJPUl9DTEFTUyA9IFwicGh4LXNlcnZlci1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1BBUkVOVF9JRCA9IFwiZGF0YS1waHgtcGFyZW50LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfTUFJTiA9IFwiZGF0YS1waHgtbWFpblwiXG5leHBvcnQgY29uc3QgUEhYX1JPT1RfSUQgPSBcImRhdGEtcGh4LXJvb3QtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXUE9SVF9UT1AgPSBcInZpZXdwb3J0LXRvcFwiXG5leHBvcnQgY29uc3QgUEhYX1ZJRVdQT1JUX0JPVFRPTSA9IFwidmlld3BvcnQtYm90dG9tXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJJR0dFUl9BQ1RJT04gPSBcInRyaWdnZXItYWN0aW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfSEFTX0ZPQ1VTRUQgPSBcInBoeC1oYXMtZm9jdXNlZFwiXG5leHBvcnQgY29uc3QgRk9DVVNBQkxFX0lOUFVUUyA9IFtcInRleHRcIiwgXCJ0ZXh0YXJlYVwiLCBcIm51bWJlclwiLCBcImVtYWlsXCIsIFwicGFzc3dvcmRcIiwgXCJzZWFyY2hcIiwgXCJ0ZWxcIiwgXCJ1cmxcIiwgXCJkYXRlXCIsIFwidGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwiY29sb3JcIiwgXCJyYW5nZVwiXVxuZXhwb3J0IGNvbnN0IENIRUNLQUJMRV9JTlBVVFMgPSBbXCJjaGVja2JveFwiLCBcInJhZGlvXCJdXG5leHBvcnQgY29uc3QgUEhYX0hBU19TVUJNSVRURUQgPSBcInBoeC1oYXMtc3VibWl0dGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfU0VTU0lPTiA9IFwiZGF0YS1waHgtc2Vzc2lvblwiXG5leHBvcnQgY29uc3QgUEhYX1ZJRVdfU0VMRUNUT1IgPSBgWyR7UEhYX1NFU1NJT059XWBcbmV4cG9ydCBjb25zdCBQSFhfU1RJQ0tZID0gXCJkYXRhLXBoeC1zdGlja3lcIlxuZXhwb3J0IGNvbnN0IFBIWF9TVEFUSUMgPSBcImRhdGEtcGh4LXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX1JFQURPTkxZID0gXCJkYXRhLXBoeC1yZWFkb25seVwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVEID0gXCJkYXRhLXBoeC1kaXNhYmxlZFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVfV0lUSCA9IFwiZGlzYWJsZS13aXRoXCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUgPSBcImRhdGEtcGh4LWRpc2FibGUtd2l0aC1yZXN0b3JlXCJcbmV4cG9ydCBjb25zdCBQSFhfSE9PSyA9IFwiaG9va1wiXG5leHBvcnQgY29uc3QgUEhYX0RFQk9VTkNFID0gXCJkZWJvdW5jZVwiXG5leHBvcnQgY29uc3QgUEhYX1RIUk9UVExFID0gXCJ0aHJvdHRsZVwiXG5leHBvcnQgY29uc3QgUEhYX1VQREFURSA9IFwidXBkYXRlXCJcbmV4cG9ydCBjb25zdCBQSFhfU1RSRUFNID0gXCJzdHJlYW1cIlxuZXhwb3J0IGNvbnN0IFBIWF9TVFJFQU1fUkVGID0gXCJkYXRhLXBoeC1zdHJlYW1cIlxuZXhwb3J0IGNvbnN0IFBIWF9LRVkgPSBcImtleVwiXG5leHBvcnQgY29uc3QgUEhYX1BSSVZBVEUgPSBcInBoeFByaXZhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9BVVRPX1JFQ09WRVIgPSBcImF1dG8tcmVjb3ZlclwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0RFQlVHID0gXCJwaHg6bGl2ZS1zb2NrZXQ6ZGVidWdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9QUk9GSUxFID0gXCJwaHg6bGl2ZS1zb2NrZXQ6cHJvZmlsaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfTEFURU5DWV9TSU0gPSBcInBoeDpsaXZlLXNvY2tldDpsYXRlbmN5LXNpbVwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0hJU1RPUllfUE9TSVRJT04gPSBcInBoeDpuYXYtaGlzdG9yeS1wb3NpdGlvblwiXG5leHBvcnQgY29uc3QgUEhYX1BST0dSRVNTID0gXCJwcm9ncmVzc1wiXG5leHBvcnQgY29uc3QgUEhYX01PVU5URUQgPSBcIm1vdW50ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUxPQURfU1RBVFVTID0gXCJfX3Bob2VuaXhfcmVsb2FkX3N0YXR1c19fXCJcbmV4cG9ydCBjb25zdCBMT0FERVJfVElNRU9VVCA9IDFcbmV4cG9ydCBjb25zdCBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUUyA9IDNcbmV4cG9ydCBjb25zdCBCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUID0gMjAwXG5leHBvcnQgY29uc3QgRElTQ09OTkVDVEVEX1RJTUVPVVQgPSA1MDBcbmV4cG9ydCBjb25zdCBCSU5ESU5HX1BSRUZJWCA9IFwicGh4LVwiXG5leHBvcnQgY29uc3QgUFVTSF9USU1FT1VUID0gMzAwMDBcbmV4cG9ydCBjb25zdCBMSU5LX0hFQURFUiA9IFwieC1yZXF1ZXN0ZWQtd2l0aFwiXG5leHBvcnQgY29uc3QgUkVTUE9OU0VfVVJMX0hFQURFUiA9IFwieC1yZXNwb25zZS11cmxcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1RSSUdHRVIgPSBcImRlYm91bmNlLXRyaWdnZXJcIlxuZXhwb3J0IGNvbnN0IFRIUk9UVExFRCA9IFwidGhyb3R0bGVkXCJcbmV4cG9ydCBjb25zdCBERUJPVU5DRV9QUkVWX0tFWSA9IFwiZGVib3VuY2UtcHJldi1rZXlcIlxuZXhwb3J0IGNvbnN0IERFRkFVTFRTID0ge1xuICBkZWJvdW5jZTogMzAwLFxuICB0aHJvdHRsZTogMzAwXG59XG5leHBvcnQgY29uc3QgUEhYX1BFTkRJTkdfQVRUUlMgPSBbUEhYX1JFRl9MT0FESU5HLCBQSFhfUkVGX1NSQywgUEhYX1JFRl9MT0NLXVxuLy8gUmVuZGVyZWRcbmV4cG9ydCBjb25zdCBEWU5BTUlDUyA9IFwiZFwiXG5leHBvcnQgY29uc3QgU1RBVElDID0gXCJzXCJcbmV4cG9ydCBjb25zdCBST09UID0gXCJyXCJcbmV4cG9ydCBjb25zdCBDT01QT05FTlRTID0gXCJjXCJcbmV4cG9ydCBjb25zdCBFVkVOVFMgPSBcImVcIlxuZXhwb3J0IGNvbnN0IFJFUExZID0gXCJyXCJcbmV4cG9ydCBjb25zdCBUSVRMRSA9IFwidFwiXG5leHBvcnQgY29uc3QgVEVNUExBVEVTID0gXCJwXCJcbmV4cG9ydCBjb25zdCBTVFJFQU0gPSBcInN0cmVhbVwiXG4iLCAiaW1wb3J0IHtcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRyeVVwbG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZW50cnksIGNvbmZpZywgbGl2ZVNvY2tldCl7XG4gICAgbGV0IHtjaHVua19zaXplLCBjaHVua190aW1lb3V0fSA9IGNvbmZpZ1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiAgICB0aGlzLmVudHJ5ID0gZW50cnlcbiAgICB0aGlzLm9mZnNldCA9IDBcbiAgICB0aGlzLmNodW5rU2l6ZSA9IGNodW5rX3NpemVcbiAgICB0aGlzLmNodW5rVGltZW91dCA9IGNodW5rX3RpbWVvdXRcbiAgICB0aGlzLmNodW5rVGltZXIgPSBudWxsXG4gICAgdGhpcy5lcnJvcmVkID0gZmFsc2VcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwgPSBsaXZlU29ja2V0LmNoYW5uZWwoYGx2dToke2VudHJ5LnJlZn1gLCB7dG9rZW46IGVudHJ5Lm1ldGFkYXRhKCl9KVxuICB9XG5cbiAgZXJyb3IocmVhc29uKXtcbiAgICBpZih0aGlzLmVycm9yZWQpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5sZWF2ZSgpXG4gICAgdGhpcy5lcnJvcmVkID0gdHJ1ZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmNodW5rVGltZXIpXG4gICAgdGhpcy5lbnRyeS5lcnJvcihyZWFzb24pXG4gIH1cblxuICB1cGxvYWQoKXtcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwub25FcnJvcihyZWFzb24gPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5qb2luKClcbiAgICAgIC5yZWNlaXZlKFwib2tcIiwgX2RhdGEgPT4gdGhpcy5yZWFkTmV4dENodW5rKCkpXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsIHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMub2Zmc2V0ID49IHRoaXMuZW50cnkuZmlsZS5zaXplIH1cblxuICByZWFkTmV4dENodW5rKCl7XG4gICAgbGV0IHJlYWRlciA9IG5ldyB3aW5kb3cuRmlsZVJlYWRlcigpXG4gICAgbGV0IGJsb2IgPSB0aGlzLmVudHJ5LmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIHRoaXMuY2h1bmtTaXplICsgdGhpcy5vZmZzZXQpXG4gICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICBpZihlLnRhcmdldC5lcnJvciA9PT0gbnVsbCl7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IGUudGFyZ2V0LnJlc3VsdC5ieXRlTGVuZ3RoXG4gICAgICAgIHRoaXMucHVzaENodW5rKGUudGFyZ2V0LnJlc3VsdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsb2dFcnJvcihcIlJlYWQgZXJyb3I6IFwiICsgZS50YXJnZXQuZXJyb3IpXG4gICAgICB9XG4gICAgfVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICB9XG5cbiAgcHVzaENodW5rKGNodW5rKXtcbiAgICBpZighdGhpcy51cGxvYWRDaGFubmVsLmlzSm9pbmVkKCkpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5wdXNoKFwiY2h1bmtcIiwgY2h1bmssIHRoaXMuY2h1bmtUaW1lb3V0KVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50cnkucHJvZ3Jlc3MoKHRoaXMub2Zmc2V0IC8gdGhpcy5lbnRyeS5maWxlLnNpemUpICogMTAwKVxuICAgICAgICBpZighdGhpcy5pc0RvbmUoKSl7XG4gICAgICAgICAgdGhpcy5jaHVua1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSwgdGhpcy5saXZlU29ja2V0LmdldExhdGVuY3lTaW0oKSB8fCAwKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCAoe3JlYXNvbn0pID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFBIWF9WSUVXX1NFTEVDVE9SXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBFbnRyeVVwbG9hZGVyIGZyb20gXCIuL2VudHJ5X3VwbG9hZGVyXCJcblxuZXhwb3J0IGxldCBsb2dFcnJvciA9IChtc2csIG9iaikgPT4gY29uc29sZS5lcnJvciAmJiBjb25zb2xlLmVycm9yKG1zZywgb2JqKVxuXG5leHBvcnQgbGV0IGlzQ2lkID0gKGNpZCkgPT4ge1xuICBsZXQgdHlwZSA9IHR5cGVvZihjaWQpXG4gIHJldHVybiB0eXBlID09PSBcIm51bWJlclwiIHx8ICh0eXBlID09PSBcInN0cmluZ1wiICYmIC9eKDB8WzEtOV1cXGQqKSQvLnRlc3QoY2lkKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdER1cGxpY2F0ZUlkcygpe1xuICBsZXQgaWRzID0gbmV3IFNldCgpXG4gIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2lkXVwiKVxuICBmb3IobGV0IGkgPSAwLCBsZW4gPSBlbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgaWYoaWRzLmhhcyhlbGVtc1tpXS5pZCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTXVsdGlwbGUgSURzIGRldGVjdGVkOiAke2VsZW1zW2ldLmlkfS4gRW5zdXJlIHVuaXF1ZSBlbGVtZW50IGlkcy5gKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZHMuYWRkKGVsZW1zW2ldLmlkKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0SW52YWxpZFN0cmVhbUluc2VydHMoaW5zZXJ0cyl7XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBTZXQoKVxuICBPYmplY3Qua2V5cyhpbnNlcnRzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgIGNvbnN0IHN0cmVhbUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICAgaWYoc3RyZWFtRWwgJiYgc3RyZWFtRWwucGFyZW50RWxlbWVudCAmJiBzdHJlYW1FbC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcInBoeC11cGRhdGVcIikgIT09IFwic3RyZWFtXCIpe1xuICAgICAgZXJyb3JzLmFkZChgVGhlIHN0cmVhbSBjb250YWluZXIgd2l0aCBpZCBcIiR7c3RyZWFtRWwucGFyZW50RWxlbWVudC5pZH1cIiBpcyBtaXNzaW5nIHRoZSBwaHgtdXBkYXRlPVwic3RyZWFtXCIgYXR0cmlidXRlLiBFbnN1cmUgaXQgaXMgc2V0IGZvciBzdHJlYW1zIHRvIHdvcmsgcHJvcGVybHkuYClcbiAgICB9XG4gIH0pXG4gIGVycm9ycy5mb3JFYWNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKVxufVxuXG5leHBvcnQgbGV0IGRlYnVnID0gKHZpZXcsIGtpbmQsIG1zZywgb2JqKSA9PiB7XG4gIGlmKHZpZXcubGl2ZVNvY2tldC5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICBjb25zb2xlLmxvZyhgJHt2aWV3LmlkfSAke2tpbmR9OiAke21zZ30gLSBgLCBvYmopXG4gIH1cbn1cblxuLy8gd3JhcHMgdmFsdWUgaW4gY2xvc3VyZSBvciByZXR1cm5zIGNsb3N1cmVcbmV4cG9ydCBsZXQgY2xvc3VyZSA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIiA/IHZhbCA6IGZ1bmN0aW9uICgpeyByZXR1cm4gdmFsIH1cblxuZXhwb3J0IGxldCBjbG9uZSA9IChvYmopID0+IHsgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSkgfVxuXG5leHBvcnQgbGV0IGNsb3Nlc3RQaHhCaW5kaW5nID0gKGVsLCBiaW5kaW5nLCBib3JkZXJFbCkgPT4ge1xuICBkbyB7XG4gICAgaWYoZWwubWF0Y2hlcyhgWyR7YmluZGluZ31dYCkgJiYgIWVsLmRpc2FibGVkKXsgcmV0dXJuIGVsIH1cbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZVxuICB9IHdoaWxlKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxICYmICEoKGJvcmRlckVsICYmIGJvcmRlckVsLmlzU2FtZU5vZGUoZWwpKSB8fCBlbC5tYXRjaGVzKFBIWF9WSUVXX1NFTEVDVE9SKSkpXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBsZXQgaXNPYmplY3QgPSAob2JqKSA9PiB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAhKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxufVxuXG5leHBvcnQgbGV0IGlzRXF1YWxPYmogPSAob2JqMSwgb2JqMikgPT4gSlNPTi5zdHJpbmdpZnkob2JqMSkgPT09IEpTT04uc3RyaW5naWZ5KG9iajIpXG5cbmV4cG9ydCBsZXQgaXNFbXB0eSA9IChvYmopID0+IHtcbiAgZm9yKGxldCB4IGluIG9iail7IHJldHVybiBmYWxzZSB9XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBsZXQgbWF5YmUgPSAoZWwsIGNhbGxiYWNrKSA9PiBlbCAmJiBjYWxsYmFjayhlbClcblxuZXhwb3J0IGxldCBjaGFubmVsVXBsb2FkZXIgPSBmdW5jdGlvbiAoZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldCl7XG4gIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgbGV0IGVudHJ5VXBsb2FkZXIgPSBuZXcgRW50cnlVcGxvYWRlcihlbnRyeSwgcmVzcC5jb25maWcsIGxpdmVTb2NrZXQpXG4gICAgZW50cnlVcGxvYWRlci51cGxvYWQoKVxuICB9KVxufVxuIiwgImxldCBCcm93c2VyID0ge1xuICBjYW5QdXNoU3RhdGUoKXsgcmV0dXJuICh0eXBlb2YgKGhpc3RvcnkucHVzaFN0YXRlKSAhPT0gXCJ1bmRlZmluZWRcIikgfSxcblxuICBkcm9wTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKVxuICB9LFxuXG4gIHVwZGF0ZUxvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXksIGluaXRpYWwsIGZ1bmMpe1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5nZXRMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBuZXdWYWwgPSBjdXJyZW50ID09PSBudWxsID8gaW5pdGlhbCA6IGZ1bmMoY3VycmVudClcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG5ld1ZhbCkpXG4gICAgcmV0dXJuIG5ld1ZhbFxuICB9LFxuXG4gIGdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpe1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKSlcbiAgfSxcblxuICB1cGRhdGVDdXJyZW50U3RhdGUoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjYWxsYmFjayhoaXN0b3J5LnN0YXRlIHx8IHt9KSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gIH0sXG5cbiAgcHVzaFN0YXRlKGtpbmQsIG1ldGEsIHRvKXtcbiAgICBpZih0aGlzLmNhblB1c2hTdGF0ZSgpKXtcbiAgICAgIGlmKHRvICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZil7XG4gICAgICAgIGlmKG1ldGEudHlwZSA9PSBcInJlZGlyZWN0XCIgJiYgbWV0YS5zY3JvbGwpe1xuICAgICAgICAgIC8vIElmIHdlJ3JlIHJlZGlyZWN0aW5nIHN0b3JlIHRoZSBjdXJyZW50IHNjcm9sbFkgZm9yIHRoZSBjdXJyZW50IGhpc3Rvcnkgc3RhdGUuXG4gICAgICAgICAgbGV0IGN1cnJlbnRTdGF0ZSA9IGhpc3Rvcnkuc3RhdGUgfHwge31cbiAgICAgICAgICBjdXJyZW50U3RhdGUuc2Nyb2xsID0gbWV0YS5zY3JvbGxcbiAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjdXJyZW50U3RhdGUsIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG1ldGEuc2Nyb2xsIC8vIE9ubHkgc3RvcmUgdGhlIHNjcm9sbCBpbiB0aGUgcmVkaXJlY3QgY2FzZS5cbiAgICAgICAgaGlzdG9yeVtraW5kICsgXCJTdGF0ZVwiXShtZXRhLCBcIlwiLCB0byB8fCBudWxsKSAvLyBJRSB3aWxsIGNvZXJjZSB1bmRlZmluZWQgdG8gc3RyaW5nXG5cbiAgICAgICAgLy8gd2hlbiB1c2luZyBuYXZpZ2F0ZSwgd2UnZCBjYWxsIHB1c2hTdGF0ZSBpbW1lZGlhdGVseSBiZWZvcmUgcGF0Y2hpbmcgdGhlIERPTSxcbiAgICAgICAgLy8ganVtcGluZyBiYWNrIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2UsIGVmZmVjdGl2ZWx5IGlnbm9yaW5nIHRoZSBzY3JvbGxJbnRvVmlldztcbiAgICAgICAgLy8gdGhlcmVmb3JlIHdlIHdhaXQgZm9yIHRoZSBuZXh0IGZyYW1lIChhZnRlciB0aGUgRE9NIHBhdGNoKSBhbmQgb25seSB0aGVuIHRyeVxuICAgICAgICAvLyB0byBzY3JvbGwgdG8gdGhlIGhhc2hFbFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBsZXQgaGFzaEVsID0gdGhpcy5nZXRIYXNoVGFyZ2V0RWwod2luZG93LmxvY2F0aW9uLmhhc2gpXG4gIFxuICAgICAgICAgIGlmKGhhc2hFbCl7XG4gICAgICAgICAgICBoYXNoRWwuc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgIH0gZWxzZSBpZihtZXRhLnR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsKDAsIDApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZGlyZWN0KHRvKVxuICAgIH1cbiAgfSxcblxuICBzZXRDb29raWUobmFtZSwgdmFsdWUsIG1heEFnZVNlY29uZHMpe1xuICAgIGxldCBleHBpcmVzID0gdHlwZW9mKG1heEFnZVNlY29uZHMpID09PSBcIm51bWJlclwiID8gYCBtYXgtYWdlPSR7bWF4QWdlU2Vjb25kc307YCA6IFwiXCJcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbHVlfTske2V4cGlyZXN9IHBhdGg9L2BcbiAgfSxcblxuICBnZXRDb29raWUobmFtZSl7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCg/Oig/Ol58Lio7XFxzKikke25hbWV9XFxzKlxcPVxccyooW147XSopLiokKXxeLiokYCksIFwiJDFcIilcbiAgfSxcblxuICBkZWxldGVDb29raWUobmFtZSl7XG4gICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09OyBtYXgtYWdlPS0xOyBwYXRoPS9gXG4gIH0sXG5cbiAgcmVkaXJlY3QodG9VUkwsIGZsYXNoKXtcbiAgICBpZihmbGFzaCl7IHRoaXMuc2V0Q29va2llKFwiX19waG9lbml4X2ZsYXNoX19cIiwgZmxhc2gsIDYwKSB9XG4gICAgd2luZG93LmxvY2F0aW9uID0gdG9VUkxcbiAgfSxcblxuICBsb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSl7IHJldHVybiBgJHtuYW1lc3BhY2V9LSR7c3Via2V5fWAgfSxcblxuICBnZXRIYXNoVGFyZ2V0RWwobWF5YmVIYXNoKXtcbiAgICBsZXQgaGFzaCA9IG1heWJlSGFzaC50b1N0cmluZygpLnN1YnN0cmluZygxKVxuICAgIGlmKGhhc2ggPT09IFwiXCIpeyByZXR1cm4gfVxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBhW25hbWU9XCIke2hhc2h9XCJdYClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyXG4iLCAiaW1wb3J0IHtcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgREVCT1VOQ0VfUFJFVl9LRVksXG4gIERFQk9VTkNFX1RSSUdHRVIsXG4gIEZPQ1VTQUJMRV9JTlBVVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9NQUlOLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJJVkFURSxcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9SRUZfTE9DSyxcbiAgUEhYX1BFTkRJTkdfQVRUUlMsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1VQTE9BRF9SRUYsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfU1RJQ0tZLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgVEhST1RUTEVELFxuICBQSFhfU1RSRUFNLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmxldCBET00gPSB7XG4gIGJ5SWQoaWQpeyByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIHx8IGxvZ0Vycm9yKGBubyBpZCBmb3VuZCBmb3IgJHtpZH1gKSB9LFxuXG4gIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpe1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxuICAgIGlmKGVsLmNsYXNzTGlzdC5sZW5ndGggPT09IDApeyBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKSB9XG4gIH0sXG5cbiAgYWxsKG5vZGUsIHF1ZXJ5LCBjYWxsYmFjayl7XG4gICAgaWYoIW5vZGUpeyByZXR1cm4gW10gfVxuICAgIGxldCBhcnJheSA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBhcnJheS5mb3JFYWNoKGNhbGxiYWNrKSA6IGFycmF5XG4gIH0sXG5cbiAgY2hpbGROb2RlTGVuZ3RoKGh0bWwpe1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZEVsZW1lbnRDb3VudFxuICB9LFxuXG4gIGlzVXBsb2FkSW5wdXQoZWwpeyByZXR1cm4gZWwudHlwZSA9PT0gXCJmaWxlXCIgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSAhPT0gbnVsbCB9LFxuXG4gIGlzQXV0b1VwbG9hZChpbnB1dEVsKXsgcmV0dXJuIGlucHV0RWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtYXV0by11cGxvYWRcIikgfSxcblxuICBmaW5kVXBsb2FkSW5wdXRzKG5vZGUpe1xuICAgIGNvbnN0IGZvcm1JZCA9IG5vZGUuaWRcbiAgICBjb25zdCBpbnB1dHNPdXRzaWRlRm9ybSA9IHRoaXMuYWxsKGRvY3VtZW50LCBgaW5wdXRbdHlwZT1cImZpbGVcIl1bJHtQSFhfVVBMT0FEX1JFRn1dW2Zvcm09XCIke2Zvcm1JZH1cIl1gKVxuICAgIHJldHVybiB0aGlzLmFsbChub2RlLCBgaW5wdXRbdHlwZT1cImZpbGVcIl1bJHtQSFhfVVBMT0FEX1JFRn1dYCkuY29uY2F0KGlucHV0c091dHNpZGVGb3JtKVxuICB9LFxuXG4gIGZpbmRDb21wb25lbnROb2RlTGlzdChub2RlLCBjaWQpe1xuICAgIHJldHVybiB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSlcbiAgfSxcblxuICBpc1BoeERlc3Ryb3llZChub2RlKXtcbiAgICByZXR1cm4gbm9kZS5pZCAmJiBET00ucHJpdmF0ZShub2RlLCBcImRlc3Ryb3llZFwiKSA/IHRydWUgOiBmYWxzZVxuICB9LFxuXG4gIHdhbnRzTmV3VGFiKGUpe1xuICAgIGxldCB3YW50c05ld1RhYiA9IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5IHx8IGUubWV0YUtleSB8fCAoZS5idXR0b24gJiYgZS5idXR0b24gPT09IDEpXG4gICAgbGV0IGlzRG93bmxvYWQgPSAoZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJkb3dubG9hZFwiKSlcbiAgICBsZXQgaXNUYXJnZXRCbGFuayA9IGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcInRhcmdldFwiKSAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJfYmxhbmtcIlxuICAgIGxldCBpc1RhcmdldE5hbWVkVGFiID0gZS50YXJnZXQuaGFzQXR0cmlidXRlKFwidGFyZ2V0XCIpICYmICFlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIikuc3RhcnRzV2l0aChcIl9cIilcbiAgICByZXR1cm4gd2FudHNOZXdUYWIgfHwgaXNUYXJnZXRCbGFuayB8fCBpc0Rvd25sb2FkIHx8IGlzVGFyZ2V0TmFtZWRUYWJcbiAgfSxcblxuICBpc1VubG9hZGFibGVGb3JtU3VibWl0KGUpe1xuICAgIC8vIElnbm9yZSBmb3JtIHN1Ym1pc3Npb25zIGludGVuZGVkIHRvIGNsb3NlIGEgbmF0aXZlIDxkaWFsb2c+IGVsZW1lbnRcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvZGlhbG9nI3VzYWdlX25vdGVzXG4gICAgbGV0IGlzRGlhbG9nU3VibWl0ID0gKGUudGFyZ2V0ICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcIm1ldGhvZFwiKSA9PT0gXCJkaWFsb2dcIikgfHxcbiAgICAgIChlLnN1Ym1pdHRlciAmJiBlLnN1Ym1pdHRlci5nZXRBdHRyaWJ1dGUoXCJmb3JtbWV0aG9kXCIpID09PSBcImRpYWxvZ1wiKVxuXG4gICAgaWYoaXNEaWFsb2dTdWJtaXQpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhZS5kZWZhdWx0UHJldmVudGVkICYmICF0aGlzLndhbnRzTmV3VGFiKGUpXG4gICAgfVxuICB9LFxuXG4gIGlzTmV3UGFnZUNsaWNrKGUsIGN1cnJlbnRMb2NhdGlvbil7XG4gICAgbGV0IGhyZWYgPSBlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ID8gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA6IG51bGxcbiAgICBsZXQgdXJsXG5cbiAgICBpZihlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgaHJlZiA9PT0gbnVsbCB8fCB0aGlzLndhbnRzTmV3VGFiKGUpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBpZihocmVmLnN0YXJ0c1dpdGgoXCJtYWlsdG86XCIpIHx8IGhyZWYuc3RhcnRzV2l0aChcInRlbDpcIikpeyByZXR1cm4gZmFsc2UgfVxuICAgIGlmKGUudGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgIHRyeSB7XG4gICAgICB1cmwgPSBuZXcgVVJMKGhyZWYpXG4gICAgfSBjYXRjaCB7XG4gICAgICB0cnkge1xuICAgICAgICB1cmwgPSBuZXcgVVJMKGhyZWYsIGN1cnJlbnRMb2NhdGlvbilcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBiYWQgVVJMLCBmYWxsYmFjayB0byBsZXQgYnJvd3NlciB0cnkgaXQgYXMgZXh0ZXJuYWxcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZih1cmwuaG9zdCA9PT0gY3VycmVudExvY2F0aW9uLmhvc3QgJiYgdXJsLnByb3RvY29sID09PSBjdXJyZW50TG9jYXRpb24ucHJvdG9jb2wpe1xuICAgICAgaWYodXJsLnBhdGhuYW1lID09PSBjdXJyZW50TG9jYXRpb24ucGF0aG5hbWUgJiYgdXJsLnNlYXJjaCA9PT0gY3VycmVudExvY2F0aW9uLnNlYXJjaCl7XG4gICAgICAgIHJldHVybiB1cmwuaGFzaCA9PT0gXCJcIiAmJiAhdXJsLmhyZWYuZW5kc1dpdGgoXCIjXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1cmwucHJvdG9jb2wuc3RhcnRzV2l0aChcImh0dHBcIilcbiAgfSxcblxuICBtYXJrUGh4Q2hpbGREZXN0cm95ZWQoZWwpe1xuICAgIGlmKHRoaXMuaXNQaHhDaGlsZChlbCkpeyBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04sIFwiXCIpIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFwiZGVzdHJveWVkXCIsIHRydWUpXG4gIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuSW5GcmFnbWVudChodG1sLCBwYXJlbnRJZCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0aGlzLmZpbmRQaHhDaGlsZHJlbih0ZW1wbGF0ZS5jb250ZW50LCBwYXJlbnRJZClcbiAgfSxcblxuICBpc0lnbm9yZWQoZWwsIHBoeFVwZGF0ZSl7XG4gICAgcmV0dXJuIChlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSB8fCBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC11cGRhdGVcIikpID09PSBcImlnbm9yZVwiXG4gIH0sXG5cbiAgaXNQaHhVcGRhdGUoZWwsIHBoeFVwZGF0ZSwgdXBkYXRlVHlwZXMpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgdXBkYXRlVHlwZXMuaW5kZXhPZihlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkgPj0gMFxuICB9LFxuXG4gIGZpbmRQaHhTdGlja3koZWwpeyByZXR1cm4gdGhpcy5hbGwoZWwsIGBbJHtQSFhfU1RJQ0tZfV1gKSB9LFxuXG4gIGZpbmRQaHhDaGlsZHJlbihlbCwgcGFyZW50SWQpe1xuICAgIHJldHVybiB0aGlzLmFsbChlbCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9WyR7UEhYX1BBUkVOVF9JRH09XCIke3BhcmVudElkfVwiXWApXG4gIH0sXG5cbiAgZmluZEV4aXN0aW5nUGFyZW50Q0lEcyhub2RlLCBjaWRzKXtcbiAgICAvLyB3ZSBvbmx5IHdhbnQgdG8gZmluZCBwYXJlbnRzIHRoYXQgZXhpc3Qgb24gdGhlIHBhZ2VcbiAgICAvLyBpZiBhIGNpZCBpcyBub3Qgb24gdGhlIHBhZ2UsIHRoZSBvbmx5IHdheSBpdCBjYW4gYmUgYWRkZWQgYmFjayB0byB0aGUgcGFnZVxuICAgIC8vIGlzIGlmIGEgcGFyZW50IGFkZHMgaXQgYmFjaywgdGhlcmVmb3JlIGlmIGEgY2lkIGRvZXMgbm90IGV4aXN0IG9uIHRoZSBwYWdlLFxuICAgIC8vIHdlIHNob3VsZCBub3QgdHJ5IHRvIHJlbmRlciBpdCBieSBpdHNlbGYgKGJlY2F1c2UgaXQgd291bGQgYmUgcmVuZGVyZWQgdHdpY2UsXG4gICAgLy8gb25lIGJ5IHRoZSBwYXJlbnQsIGFuZCBhIHNlY29uZCB0aW1lIGJ5IGl0c2VsZilcbiAgICBsZXQgcGFyZW50Q2lkcyA9IG5ldyBTZXQoKVxuICAgIGxldCBjaGlsZHJlbkNpZHMgPSBuZXcgU2V0KClcblxuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4ge1xuICAgICAgdGhpcy5maWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcodGhpcy5hbGwobm9kZSwgYFske1BIWF9DT01QT05FTlR9PVwiJHtjaWR9XCJdYCksIG5vZGUpLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgICAgcGFyZW50Q2lkcy5hZGQoY2lkKVxuICAgICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKSwgcGFyZW50KVxuICAgICAgICAgIC5tYXAoZWwgPT4gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKSlcbiAgICAgICAgICAuZm9yRWFjaChjaGlsZENJRCA9PiBjaGlsZHJlbkNpZHMuYWRkKGNoaWxkQ0lEKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGNoaWxkcmVuQ2lkcy5mb3JFYWNoKGNoaWxkQ2lkID0+IHBhcmVudENpZHMuZGVsZXRlKGNoaWxkQ2lkKSlcblxuICAgIHJldHVybiBwYXJlbnRDaWRzXG4gIH0sXG5cbiAgZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KG5vZGVzLCBwYXJlbnQpe1xuICAgIGlmKHBhcmVudC5xdWVyeVNlbGVjdG9yKFBIWF9WSUVXX1NFTEVDVE9SKSl7XG4gICAgICByZXR1cm4gbm9kZXMuZmlsdGVyKGVsID0+IHRoaXMud2l0aGluU2FtZUxpdmVWaWV3KGVsLCBwYXJlbnQpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZXNcbiAgICB9XG4gIH0sXG5cbiAgd2l0aGluU2FtZUxpdmVWaWV3KG5vZGUsIHBhcmVudCl7XG4gICAgd2hpbGUobm9kZSA9IG5vZGUucGFyZW50Tm9kZSl7XG4gICAgICBpZihub2RlLmlzU2FtZU5vZGUocGFyZW50KSl7IHJldHVybiB0cnVlIH1cbiAgICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKSAhPT0gbnVsbCl7IHJldHVybiBmYWxzZSB9XG4gICAgfVxuICB9LFxuXG4gIHByaXZhdGUoZWwsIGtleSl7IHJldHVybiBlbFtQSFhfUFJJVkFURV0gJiYgZWxbUEhYX1BSSVZBVEVdW2tleV0gfSxcblxuICBkZWxldGVQcml2YXRlKGVsLCBrZXkpeyBlbFtQSFhfUFJJVkFURV0gJiYgZGVsZXRlIChlbFtQSFhfUFJJVkFURV1ba2V5XSkgfSxcblxuICBwdXRQcml2YXRlKGVsLCBrZXksIHZhbHVlKXtcbiAgICBpZighZWxbUEhYX1BSSVZBVEVdKXsgZWxbUEhYX1BSSVZBVEVdID0ge30gfVxuICAgIGVsW1BIWF9QUklWQVRFXVtrZXldID0gdmFsdWVcbiAgfSxcblxuICB1cGRhdGVQcml2YXRlKGVsLCBrZXksIGRlZmF1bHRWYWwsIHVwZGF0ZUZ1bmMpe1xuICAgIGxldCBleGlzdGluZyA9IHRoaXMucHJpdmF0ZShlbCwga2V5KVxuICAgIGlmKGV4aXN0aW5nID09PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHVwZGF0ZUZ1bmMoZGVmYXVsdFZhbCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGV4aXN0aW5nKSlcbiAgICB9XG4gIH0sXG5cbiAgc3luY1BlbmRpbmdBdHRycyhmcm9tRWwsIHRvRWwpe1xuICAgIGlmKCFmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfU1JDKSl7IHJldHVybiB9XG4gICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgZnJvbUVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpICYmIHRvRWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG4gICAgfSlcbiAgICBQSFhfUEVORElOR19BVFRSUy5maWx0ZXIoYXR0ciA9PiBmcm9tRWwuaGFzQXR0cmlidXRlKGF0dHIpKS5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoYXR0ciwgZnJvbUVsLmdldEF0dHJpYnV0ZShhdHRyKSlcbiAgICB9KVxuICB9LFxuXG4gIGNvcHlQcml2YXRlcyh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1BIWF9QUklWQVRFXSl7XG4gICAgICB0YXJnZXRbUEhYX1BSSVZBVEVdID0gc291cmNlW1BIWF9QUklWQVRFXVxuICAgIH1cbiAgfSxcblxuICBwdXRUaXRsZShzdHIpe1xuICAgIGxldCB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRpdGxlXCIpXG4gICAgaWYodGl0bGVFbCl7XG4gICAgICBsZXQge3ByZWZpeCwgc3VmZml4LCBkZWZhdWx0OiBkZWZhdWx0VGl0bGV9ID0gdGl0bGVFbC5kYXRhc2V0XG4gICAgICBsZXQgaXNFbXB0eSA9IHR5cGVvZihzdHIpICE9PSBcInN0cmluZ1wiIHx8IHN0ci50cmltKCkgPT09IFwiXCJcbiAgICAgIGlmKGlzRW1wdHkgJiYgdHlwZW9mKGRlZmF1bHRUaXRsZSkgIT09IFwic3RyaW5nXCIpeyByZXR1cm4gfVxuXG4gICAgICBsZXQgaW5uZXIgPSBpc0VtcHR5ID8gZGVmYXVsdFRpdGxlIDogc3RyXG4gICAgICBkb2N1bWVudC50aXRsZSA9IGAke3ByZWZpeCB8fCBcIlwifSR7aW5uZXIgfHwgXCJcIn0ke3N1ZmZpeCB8fCBcIlwifWBcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQudGl0bGUgPSBzdHJcbiAgICB9XG4gIH0sXG5cbiAgZGVib3VuY2UoZWwsIGV2ZW50LCBwaHhEZWJvdW5jZSwgZGVmYXVsdERlYm91bmNlLCBwaHhUaHJvdHRsZSwgZGVmYXVsdFRocm90dGxlLCBhc3luY0ZpbHRlciwgY2FsbGJhY2spe1xuICAgIGxldCBkZWJvdW5jZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhEZWJvdW5jZSlcbiAgICBsZXQgdGhyb3R0bGUgPSBlbC5nZXRBdHRyaWJ1dGUocGh4VGhyb3R0bGUpXG5cbiAgICBpZihkZWJvdW5jZSA9PT0gXCJcIil7IGRlYm91bmNlID0gZGVmYXVsdERlYm91bmNlIH1cbiAgICBpZih0aHJvdHRsZSA9PT0gXCJcIil7IHRocm90dGxlID0gZGVmYXVsdFRocm90dGxlIH1cbiAgICBsZXQgdmFsdWUgPSBkZWJvdW5jZSB8fCB0aHJvdHRsZVxuICAgIHN3aXRjaCh2YWx1ZSl7XG4gICAgICBjYXNlIG51bGw6IHJldHVybiBjYWxsYmFjaygpXG5cbiAgICAgIGNhc2UgXCJibHVyXCI6XG4gICAgICAgIHRoaXMuaW5jQ3ljbGUoZWwsIFwiZGVib3VuY2UtYmx1ci1jeWNsZVwiLCAoKSA9PiB7XG4gICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IGNhbGxiYWNrKCkgfVxuICAgICAgICB9KVxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiZGVib3VuY2UtYmx1clwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIFwiZGVib3VuY2UtYmx1ci1jeWNsZVwiKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGV0IHRpbWVvdXQgPSBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgbGV0IHRyaWdnZXIgPSAoKSA9PiB0aHJvdHRsZSA/IHRoaXMuZGVsZXRlUHJpdmF0ZShlbCwgVEhST1RUTEVEKSA6IGNhbGxiYWNrKClcbiAgICAgICAgbGV0IGN1cnJlbnRDeWNsZSA9IHRoaXMuaW5jQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIsIHRyaWdnZXIpXG4gICAgICAgIGlmKGlzTmFOKHRpbWVvdXQpKXsgcmV0dXJuIGxvZ0Vycm9yKGBpbnZhbGlkIHRocm90dGxlL2RlYm91bmNlIHZhbHVlOiAke3ZhbHVlfWApIH1cbiAgICAgICAgaWYodGhyb3R0bGUpe1xuICAgICAgICAgIGxldCBuZXdLZXlEb3duID0gZmFsc2VcbiAgICAgICAgICBpZihldmVudC50eXBlID09PSBcImtleWRvd25cIil7XG4gICAgICAgICAgICBsZXQgcHJldktleSA9IHRoaXMucHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVkpXG4gICAgICAgICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIERFQk9VTkNFX1BSRVZfS0VZLCBldmVudC5rZXkpXG4gICAgICAgICAgICBuZXdLZXlEb3duID0gcHJldktleSAhPT0gZXZlbnQua2V5XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoIW5ld0tleURvd24gJiYgdGhpcy5wcml2YXRlKGVsLCBUSFJPVFRMRUQpKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUikgfVxuICAgICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgVEhST1RUTEVELCB0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgY3VycmVudEN5Y2xlKSB9XG4gICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtID0gZWwuZm9ybVxuICAgICAgICBpZihmb3JtICYmIHRoaXMub25jZShmb3JtLCBcImJpbmQtZGVib3VuY2VcIikpe1xuICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKChuZXcgRm9ybURhdGEoZm9ybSkpLmVudHJpZXMoKSwgKFtuYW1lXSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtuYW1lfVwiXWApXG4gICAgICAgICAgICAgIHRoaXMuaW5jQ3ljbGUoaW5wdXQsIERFQk9VTkNFX1RSSUdHRVIpXG4gICAgICAgICAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgVEhST1RUTEVEKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub25jZShlbCwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBiZWNhdXNlIHdlIHRyaWdnZXIgdGhlIGNhbGxiYWNrIGhlcmUsXG4gICAgICAgICAgICAvLyB3ZSBhbHNvIGNsZWFyIHRoZSB0aHJvdHRsZSB0aW1lb3V0IHRvIHByZXZlbnQgdGhlIGNhbGxiYWNrXG4gICAgICAgICAgICAvLyBmcm9tIGJlaW5nIGNhbGxlZCBhZ2FpbiBhZnRlciB0aGUgdGltZW91dCBmaXJlc1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucHJpdmF0ZShlbCwgVEhST1RUTEVEKSlcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdHJpZ2dlckN5Y2xlKGVsLCBrZXksIGN1cnJlbnRDeWNsZSl7XG4gICAgbGV0IFtjeWNsZSwgdHJpZ2dlcl0gPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZighY3VycmVudEN5Y2xlKXsgY3VycmVudEN5Y2xlID0gY3ljbGUgfVxuICAgIGlmKGN1cnJlbnRDeWNsZSA9PT0gY3ljbGUpe1xuICAgICAgdGhpcy5pbmNDeWNsZShlbCwga2V5KVxuICAgICAgdHJpZ2dlcigpXG4gICAgfVxuICB9LFxuXG4gIG9uY2UoZWwsIGtleSl7XG4gICAgaWYodGhpcy5wcml2YXRlKGVsLCBrZXkpID09PSB0cnVlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdHJ1ZSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGluY0N5Y2xlKGVsLCBrZXksIHRyaWdnZXIgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgbGV0IFtjdXJyZW50Q3ljbGVdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpIHx8IFswLCB0cmlnZ2VyXVxuICAgIGN1cnJlbnRDeWNsZSsrXG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIFtjdXJyZW50Q3ljbGUsIHRyaWdnZXJdKVxuICAgIHJldHVybiBjdXJyZW50Q3ljbGVcbiAgfSxcblxuICAvLyBtYWludGFpbnMgb3IgYWRkcyBwcml2YXRlbHkgdXNlZCBob29rIGluZm9ybWF0aW9uXG4gIC8vIGZyb21FbCBhbmQgdG9FbCBjYW4gYmUgdGhlIHNhbWUgZWxlbWVudCBpbiB0aGUgY2FzZSBvZiBhIG5ld2x5IGFkZGVkIG5vZGVcbiAgLy8gZnJvbUVsIGFuZCB0b0VsIGNhbiBiZSBhbnkgSFRNTCBub2RlIHR5cGUsIHNvIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBhbiBlbGVtZW50IG5vZGVcbiAgbWFpbnRhaW5Qcml2YXRlSG9va3MoZnJvbUVsLCB0b0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pe1xuICAgIC8vIG1haW50YWluIHRoZSBob29rcyBjcmVhdGVkIHdpdGggY3JlYXRlSG9va1xuICAgIGlmKGZyb21FbC5oYXNBdHRyaWJ1dGUgJiYgZnJvbUVsLmhhc0F0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIikgJiYgIXRvRWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiKSl7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgZnJvbUVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIikpXG4gICAgfVxuICAgIC8vIGFkZCBob29rcyB0byBlbGVtZW50cyB3aXRoIHZpZXdwb3J0IGF0dHJpYnV0ZXNcbiAgICBpZih0b0VsLmhhc0F0dHJpYnV0ZSAmJiAodG9FbC5oYXNBdHRyaWJ1dGUocGh4Vmlld3BvcnRUb3ApIHx8IHRvRWwuaGFzQXR0cmlidXRlKHBoeFZpZXdwb3J0Qm90dG9tKSkpe1xuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1ob29rXCIsIFwiUGhvZW5peC5JbmZpbml0ZVNjcm9sbFwiKVxuICAgIH1cbiAgfSxcblxuICBwdXRDdXN0b21FbEhvb2soZWwsIGhvb2spe1xuICAgIGlmKGVsLmlzQ29ubmVjdGVkKXtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgXCJcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihgXG4gICAgICAgIGhvb2sgYXR0YWNoZWQgdG8gbm9uLWNvbm5lY3RlZCBET00gZWxlbWVudFxuICAgICAgICBlbnN1cmUgeW91IGFyZSBjYWxsaW5nIGNyZWF0ZUhvb2sgd2l0aGluIHlvdXIgY29ubmVjdGVkQ2FsbGJhY2suICR7ZWwub3V0ZXJIVE1MfVxuICAgICAgYClcbiAgICB9XG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBcImN1c3RvbS1lbC1ob29rXCIsIGhvb2spXG4gIH0sXG5cbiAgZ2V0Q3VzdG9tRWxIb29rKGVsKXsgcmV0dXJuIHRoaXMucHJpdmF0ZShlbCwgXCJjdXN0b20tZWwtaG9va1wiKSB9LFxuXG4gIGlzVXNlZElucHV0KGVsKXtcbiAgICByZXR1cm4gKGVsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgKHRoaXMucHJpdmF0ZShlbCwgUEhYX0hBU19GT0NVU0VEKSB8fCB0aGlzLnByaXZhdGUoZWwsIFBIWF9IQVNfU1VCTUlUVEVEKSkpXG4gIH0sXG5cbiAgcmVzZXRGb3JtKGZvcm0pe1xuICAgIEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICB0aGlzLmRlbGV0ZVByaXZhdGUoaW5wdXQsIFBIWF9IQVNfRk9DVVNFRClcbiAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpXG4gICAgfSlcbiAgfSxcblxuICBpc1BoeENoaWxkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKVxuICB9LFxuXG4gIGlzUGh4U3RpY2t5KG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfU1RJQ0tZKSAhPT0gbnVsbFxuICB9LFxuXG4gIGlzQ2hpbGRPZkFueShlbCwgcGFyZW50cyl7XG4gICAgcmV0dXJuICEhcGFyZW50cy5maW5kKHBhcmVudCA9PiBwYXJlbnQuY29udGFpbnMoZWwpKVxuICB9LFxuXG4gIGZpcnN0UGh4Q2hpbGQoZWwpe1xuICAgIHJldHVybiB0aGlzLmlzUGh4Q2hpbGQoZWwpID8gZWwgOiB0aGlzLmFsbChlbCwgYFske1BIWF9QQVJFTlRfSUR9XWApWzBdXG4gIH0sXG5cbiAgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIG5hbWUsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGRlZmF1bHRCdWJibGUgPSB0cnVlXG4gICAgbGV0IGlzVXBsb2FkVGFyZ2V0ID0gdGFyZ2V0Lm5vZGVOYW1lID09PSBcIklOUFVUXCIgJiYgdGFyZ2V0LnR5cGUgPT09IFwiZmlsZVwiXG4gICAgaWYoaXNVcGxvYWRUYXJnZXQgJiYgbmFtZSA9PT0gXCJjbGlja1wiKXtcbiAgICAgIGRlZmF1bHRCdWJibGUgPSBmYWxzZVxuICAgIH1cbiAgICBsZXQgYnViYmxlcyA9IG9wdHMuYnViYmxlcyA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdEJ1YmJsZSA6ICEhb3B0cy5idWJibGVzXG4gICAgbGV0IGV2ZW50T3B0cyA9IHtidWJibGVzOiBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlLCBkZXRhaWw6IG9wdHMuZGV0YWlsIHx8IHt9fVxuICAgIGxldCBldmVudCA9IG5hbWUgPT09IFwiY2xpY2tcIiA/IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwgZXZlbnRPcHRzKSA6IG5ldyBDdXN0b21FdmVudChuYW1lLCBldmVudE9wdHMpXG4gICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gIH0sXG5cbiAgY2xvbmVOb2RlKG5vZGUsIGh0bWwpe1xuICAgIGlmKHR5cGVvZiAoaHRtbCkgPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgcmV0dXJuIG5vZGUuY2xvbmVOb2RlKHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjbG9uZWQgPSBub2RlLmNsb25lTm9kZShmYWxzZSlcbiAgICAgIGNsb25lZC5pbm5lckhUTUwgPSBodG1sXG4gICAgICByZXR1cm4gY2xvbmVkXG4gICAgfVxuICB9LFxuXG4gIC8vIG1lcmdlIGF0dHJpYnV0ZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0XG4gIC8vIGlmIGFuIGVsZW1lbnQgaXMgaWdub3JlZCwgd2Ugb25seSBtZXJnZSBkYXRhIGF0dHJpYnV0ZXNcbiAgLy8gaW5jbHVkaW5nIHJlbW92aW5nIGRhdGEgYXR0cmlidXRlcyB0aGF0IGFyZSBubyBsb25nZXIgaW4gdGhlIHNvdXJjZVxuICBtZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCBvcHRzID0ge30pe1xuICAgIGxldCBleGNsdWRlID0gbmV3IFNldChvcHRzLmV4Y2x1ZGUgfHwgW10pXG4gICAgbGV0IGlzSWdub3JlZCA9IG9wdHMuaXNJZ25vcmVkXG4gICAgbGV0IHNvdXJjZUF0dHJzID0gc291cmNlLmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSBzb3VyY2VBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHNvdXJjZUF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKCFleGNsdWRlLmhhcyhuYW1lKSl7XG4gICAgICAgIGNvbnN0IHNvdXJjZVZhbHVlID0gc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKVxuICAgICAgICBpZih0YXJnZXQuZ2V0QXR0cmlidXRlKG5hbWUpICE9PSBzb3VyY2VWYWx1ZSAmJiAoIWlzSWdub3JlZCB8fCAoaXNJZ25vcmVkICYmIG5hbWUuc3RhcnRzV2l0aChcImRhdGEtXCIpKSkpe1xuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUobmFtZSwgc291cmNlVmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGV4Y2x1ZGUgdGhlIHZhbHVlIGZyb20gYmVpbmcgbWVyZ2VkIG9uIGZvY3VzZWQgaW5wdXRzLCBiZWNhdXNlIHRoZVxuICAgICAgICAvLyB1c2VyJ3MgaW5wdXQgc2hvdWxkIGFsd2F5cyB3aW4uXG4gICAgICAgIC8vIFdlIGNhbiBzdGlsbCBhc3NpZ24gaXQgYXMgbG9uZyBhcyB0aGUgdmFsdWUgcHJvcGVydHkgaXMgdGhlIHNhbWUsIHRob3VnaC5cbiAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBhIHNpdHVhdGlvbiB3aGVyZSB0aGUgdXBkYXRlZCBob29rIGlzIG5vdCBiZWluZyB0cmlnZ2VyZWRcbiAgICAgICAgLy8gd2hlbiBhbiBpbnB1dCBpcyBiYWNrIGluIGl0cyBcIm9yaWdpbmFsIHN0YXRlXCIsIGJlY2F1c2UgdGhlIGF0dHJpYnV0ZVxuICAgICAgICAvLyB3YXMgbmV2ZXIgY2hhbmdlZCwgc2VlOlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMjE2M1xuICAgICAgICBpZihuYW1lID09PSBcInZhbHVlXCIgJiYgdGFyZ2V0LnZhbHVlID09PSBzb3VyY2UudmFsdWUpe1xuICAgICAgICAgIC8vIGFjdHVhbGx5IHNldCB0aGUgdmFsdWUgYXR0cmlidXRlIHRvIHN5bmMgaXQgd2l0aCB0aGUgdmFsdWUgcHJvcGVydHlcbiAgICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0YXJnZXRBdHRycyA9IHRhcmdldC5hdHRyaWJ1dGVzXG4gICAgZm9yKGxldCBpID0gdGFyZ2V0QXR0cnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuICAgICAgbGV0IG5hbWUgPSB0YXJnZXRBdHRyc1tpXS5uYW1lXG4gICAgICBpZihpc0lnbm9yZWQpe1xuICAgICAgICBpZihuYW1lLnN0YXJ0c1dpdGgoXCJkYXRhLVwiKSAmJiAhc291cmNlLmhhc0F0dHJpYnV0ZShuYW1lKSAmJiAhUEhYX1BFTkRJTkdfQVRUUlMuaW5jbHVkZXMobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpKXsgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShuYW1lKSB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1lcmdlRm9jdXNlZElucHV0KHRhcmdldCwgc291cmNlKXtcbiAgICAvLyBza2lwIHNlbGVjdHMgYmVjYXVzZSBGRiB3aWxsIHJlc2V0IGhpZ2hsaWdodGVkIGluZGV4IGZvciBhbnkgc2V0QXR0cmlidXRlXG4gICAgaWYoISh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkpeyBET00ubWVyZ2VBdHRycyh0YXJnZXQsIHNvdXJjZSwge2V4Y2x1ZGU6IFtcInZhbHVlXCJdfSkgfVxuXG4gICAgaWYoc291cmNlLnJlYWRPbmx5KXtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIilcbiAgICB9XG4gIH0sXG5cbiAgaGFzU2VsZWN0aW9uUmFuZ2UoZWwpe1xuICAgIHJldHVybiBlbC5zZXRTZWxlY3Rpb25SYW5nZSAmJiAoZWwudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZWwudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKVxuICB9LFxuXG4gIHJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKXtcbiAgICBpZihmb2N1c2VkIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpeyBmb2N1c2VkLmZvY3VzKCkgfVxuICAgIGlmKCFET00uaXNUZXh0dWFsSW5wdXQoZm9jdXNlZCkpeyByZXR1cm4gfVxuXG4gICAgbGV0IHdhc0ZvY3VzZWQgPSBmb2N1c2VkLm1hdGNoZXMoXCI6Zm9jdXNcIilcbiAgICBpZighd2FzRm9jdXNlZCl7IGZvY3VzZWQuZm9jdXMoKSB9XG4gICAgaWYodGhpcy5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSl7XG4gICAgICBmb2N1c2VkLnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpXG4gICAgfVxuICB9LFxuXG4gIGlzRm9ybUlucHV0KGVsKXsgcmV0dXJuIC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KGVsLnRhZ05hbWUpICYmIGVsLnR5cGUgIT09IFwiYnV0dG9uXCIgfSxcblxuICBzeW5jQXR0cnNUb1Byb3BzKGVsKXtcbiAgICBpZihlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgQ0hFQ0tBQkxFX0lOUFVUUy5pbmRleE9mKGVsLnR5cGUudG9Mb2NhbGVMb3dlckNhc2UoKSkgPj0gMCl7XG4gICAgICBlbC5jaGVja2VkID0gZWwuZ2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiKSAhPT0gbnVsbFxuICAgIH1cbiAgfSxcblxuICBpc1RleHR1YWxJbnB1dChlbCl7IHJldHVybiBGT0NVU0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZSkgPj0gMCB9LFxuXG4gIGlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKXtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShwaHhUcmlnZ2VyRXh0ZXJuYWwpICE9PSBudWxsICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpXG4gIH0sXG5cbiAgY2xlYW5DaGlsZE5vZGVzKGNvbnRhaW5lciwgcGh4VXBkYXRlKXtcbiAgICBpZihET00uaXNQaHhVcGRhdGUoY29udGFpbmVyLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIiwgUEhYX1NUUkVBTV0pKXtcbiAgICAgIGxldCB0b1JlbW92ZSA9IFtdXG4gICAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgIGlmKCFjaGlsZE5vZGUuaWQpe1xuICAgICAgICAgIC8vIFNraXAgd2FybmluZyBpZiBpdCdzIGFuIGVtcHR5IHRleHQgbm9kZSAoZS5nLiBhIG5ldy1saW5lKVxuICAgICAgICAgIGxldCBpc0VtcHR5VGV4dE5vZGUgPSBjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIGNoaWxkTm9kZS5ub2RlVmFsdWUudHJpbSgpID09PSBcIlwiXG4gICAgICAgICAgaWYoIWlzRW1wdHlUZXh0Tm9kZSAmJiBjaGlsZE5vZGUubm9kZVR5cGUgIT09IE5vZGUuQ09NTUVOVF9OT0RFKXtcbiAgICAgICAgICAgIGxvZ0Vycm9yKFwib25seSBIVE1MIGVsZW1lbnQgdGFncyB3aXRoIGFuIGlkIGFyZSBhbGxvd2VkIGluc2lkZSBjb250YWluZXJzIHdpdGggcGh4LXVwZGF0ZS5cXG5cXG5cIiArXG4gICAgICAgICAgICAgIGByZW1vdmluZyBpbGxlZ2FsIG5vZGU6IFwiJHsoY2hpbGROb2RlLm91dGVySFRNTCB8fCBjaGlsZE5vZGUubm9kZVZhbHVlKS50cmltKCl9XCJcXG5cXG5gKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0b1JlbW92ZS5wdXNoKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRvUmVtb3ZlLmZvckVhY2goY2hpbGROb2RlID0+IGNoaWxkTm9kZS5yZW1vdmUoKSlcbiAgICB9XG4gIH0sXG5cbiAgcmVwbGFjZVJvb3RDb250YWluZXIoY29udGFpbmVyLCB0YWdOYW1lLCBhdHRycyl7XG4gICAgbGV0IHJldGFpbmVkQXR0cnMgPSBuZXcgU2V0KFtcImlkXCIsIFBIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfTUFJTiwgUEhYX1JPT1RfSURdKVxuICAgIGlmKGNvbnRhaW5lci50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRhZ05hbWUudG9Mb3dlckNhc2UoKSl7XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5hdHRyaWJ1dGVzKVxuICAgICAgICAuZmlsdGVyKGF0dHIgPT4gIXJldGFpbmVkQXR0cnMuaGFzKGF0dHIubmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSkpXG5cbiAgICAgIE9iamVjdC5rZXlzKGF0dHJzKVxuICAgICAgICAuZmlsdGVyKG5hbWUgPT4gIXJldGFpbmVkQXR0cnMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgIC5mb3JFYWNoKGF0dHIgPT4gY29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpXG5cbiAgICAgIHJldHVybiBjb250YWluZXJcblxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKVxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goYXR0ciA9PiBuZXdDb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcbiAgICAgIHJldGFpbmVkQXR0cnMuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgY29udGFpbmVyLmdldEF0dHJpYnV0ZShhdHRyKSkpXG4gICAgICBuZXdDb250YWluZXIuaW5uZXJIVE1MID0gY29udGFpbmVyLmlubmVySFRNTFxuICAgICAgY29udGFpbmVyLnJlcGxhY2VXaXRoKG5ld0NvbnRhaW5lcilcbiAgICAgIHJldHVybiBuZXdDb250YWluZXJcbiAgICB9XG4gIH0sXG5cbiAgZ2V0U3RpY2t5KGVsLCBuYW1lLCBkZWZhdWx0VmFsKXtcbiAgICBsZXQgb3AgPSAoRE9NLnByaXZhdGUoZWwsIFwic3RpY2t5XCIpIHx8IFtdKS5maW5kKChbZXhpc3RpbmdOYW1lLF0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSlcbiAgICBpZihvcCl7XG4gICAgICBsZXQgW19uYW1lLCBfb3AsIHN0YXNoZWRSZXN1bHRdID0gb3BcbiAgICAgIHJldHVybiBzdGFzaGVkUmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0eXBlb2YoZGVmYXVsdFZhbCkgPT09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRWYWwoKSA6IGRlZmF1bHRWYWxcbiAgICB9XG4gIH0sXG5cbiAgZGVsZXRlU3RpY2t5KGVsLCBuYW1lKXtcbiAgICB0aGlzLnVwZGF0ZVByaXZhdGUoZWwsIFwic3RpY2t5XCIsIFtdLCBvcHMgPT4ge1xuICAgICAgcmV0dXJuIG9wcy5maWx0ZXIoKFtleGlzdGluZ05hbWUsIF9dKSA9PiBleGlzdGluZ05hbWUgIT09IG5hbWUpXG4gICAgfSlcbiAgfSxcblxuICBwdXRTdGlja3koZWwsIG5hbWUsIG9wKXtcbiAgICBsZXQgc3Rhc2hlZFJlc3VsdCA9IG9wKGVsKVxuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICBsZXQgZXhpc3RpbmdJbmRleCA9IG9wcy5maW5kSW5kZXgoKFtleGlzdGluZ05hbWUsXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgICAgaWYoZXhpc3RpbmdJbmRleCA+PSAwKXtcbiAgICAgICAgb3BzW2V4aXN0aW5nSW5kZXhdID0gW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BzLnB1c2goW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHNcbiAgICB9KVxuICB9LFxuXG4gIGFwcGx5U3RpY2t5T3BlcmF0aW9ucyhlbCl7XG4gICAgbGV0IG9wcyA9IERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKVxuICAgIGlmKCFvcHMpeyByZXR1cm4gfVxuXG4gICAgb3BzLmZvckVhY2goKFtuYW1lLCBvcCwgX3N0YXNoZWRdKSA9PiB0aGlzLnB1dFN0aWNreShlbCwgbmFtZSwgb3ApKVxuICB9LFxuXG4gIGlzTG9ja2VkKGVsKXtcbiAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlICYmIGVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NXG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGNoYW5uZWxVcGxvYWRlcixcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWRFbnRyeSB7XG4gIHN0YXRpYyBpc0FjdGl2ZShmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBpc05ldyA9IGZpbGUuX3BoeFJlZiA9PT0gdW5kZWZpbmVkXG4gICAgbGV0IGFjdGl2ZVJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzQWN0aXZlID0gYWN0aXZlUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGZpbGUuc2l6ZSA+IDAgJiYgKGlzTmV3IHx8IGlzQWN0aXZlKVxuICB9XG5cbiAgc3RhdGljIGlzUHJlZmxpZ2h0ZWQoZmlsZUVsLCBmaWxlKXtcbiAgICBsZXQgcHJlZmxpZ2h0ZWRSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzUHJlZmxpZ2h0ZWQgPSBwcmVmbGlnaHRlZFJlZnMuaW5kZXhPZihMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKSkgPj0gMFxuICAgIHJldHVybiBpc1ByZWZsaWdodGVkICYmIHRoaXMuaXNBY3RpdmUoZmlsZUVsLCBmaWxlKVxuICB9XG5cbiAgc3RhdGljIGlzUHJlZmxpZ2h0SW5Qcm9ncmVzcyhmaWxlKXtcbiAgICByZXR1cm4gZmlsZS5fcHJlZmxpZ2h0SW5Qcm9ncmVzcyA9PT0gdHJ1ZVxuICB9XG5cbiAgc3RhdGljIG1hcmtQcmVmbGlnaHRJblByb2dyZXNzKGZpbGUpe1xuICAgIGZpbGUuX3ByZWZsaWdodEluUHJvZ3Jlc3MgPSB0cnVlXG4gIH1cblxuICBjb25zdHJ1Y3RvcihmaWxlRWwsIGZpbGUsIHZpZXcsIGF1dG9VcGxvYWQpe1xuICAgIHRoaXMucmVmID0gTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSlcbiAgICB0aGlzLmZpbGVFbCA9IGZpbGVFbFxuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5tZXRhID0gbnVsbFxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gZmFsc2VcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZVxuICAgIHRoaXMuX3Byb2dyZXNzID0gMFxuICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAtMVxuICAgIHRoaXMuX29uRG9uZSA9IGZ1bmN0aW9uKCl7IH1cbiAgICB0aGlzLl9vbkVsVXBkYXRlZCA9IHRoaXMub25FbFVwZGF0ZWQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmlsZUVsLmFkZEV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICB0aGlzLmF1dG9VcGxvYWQgPSBhdXRvVXBsb2FkXG4gIH1cblxuICBtZXRhZGF0YSgpeyByZXR1cm4gdGhpcy5tZXRhIH1cblxuICBwcm9ncmVzcyhwcm9ncmVzcyl7XG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHByb2dyZXNzKVxuICAgIGlmKHRoaXMuX3Byb2dyZXNzID4gdGhpcy5fbGFzdFByb2dyZXNzU2VudCl7XG4gICAgICBpZih0aGlzLl9wcm9ncmVzcyA+PSAxMDApe1xuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IDEwMFxuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gMTAwXG4gICAgICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCAxMDAsICgpID0+IHtcbiAgICAgICAgICBMaXZlVXBsb2FkZXIudW50cmFja0ZpbGUodGhpcy5maWxlRWwsIHRoaXMuZmlsZSlcbiAgICAgICAgICB0aGlzLl9vbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IHRoaXMuX3Byb2dyZXNzXG4gICAgICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwgdGhpcy5fcHJvZ3Jlc3MpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNDYW5jZWxsZWQoKXsgcmV0dXJuIHRoaXMuX2lzQ2FuY2VsbGVkIH1cblxuICBjYW5jZWwoKXtcbiAgICB0aGlzLmZpbGUuX3ByZWZsaWdodEluUHJvZ3Jlc3MgPSBmYWxzZVxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gdHJ1ZVxuICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICB0aGlzLl9vbkRvbmUoKVxuICB9XG5cbiAgaXNEb25lKCl7IHJldHVybiB0aGlzLl9pc0RvbmUgfVxuXG4gIGVycm9yKHJlYXNvbiA9IFwiZmFpbGVkXCIpe1xuICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIHtlcnJvcjogcmVhc29ufSlcbiAgICBpZighdGhpcy5pc0F1dG9VcGxvYWQoKSl7IExpdmVVcGxvYWRlci5jbGVhckZpbGVzKHRoaXMuZmlsZUVsKSB9XG4gIH1cblxuICBpc0F1dG9VcGxvYWQoKXsgcmV0dXJuIHRoaXMuYXV0b1VwbG9hZCB9XG5cbiAgLy9wcml2YXRlXG5cbiAgb25Eb25lKGNhbGxiYWNrKXtcbiAgICB0aGlzLl9vbkRvbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLmZpbGVFbC5yZW1vdmVFdmVudExpc3RlbmVyKFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCwgdGhpcy5fb25FbFVwZGF0ZWQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgb25FbFVwZGF0ZWQoKXtcbiAgICBsZXQgYWN0aXZlUmVmcyA9IHRoaXMuZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGlmKGFjdGl2ZVJlZnMuaW5kZXhPZih0aGlzLnJlZikgPT09IC0xKXtcbiAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKVxuICAgICAgdGhpcy5jYW5jZWwoKVxuICAgIH1cbiAgfVxuXG4gIHRvUHJlZmxpZ2h0UGF5bG9hZCgpe1xuICAgIHJldHVybiB7XG4gICAgICBsYXN0X21vZGlmaWVkOiB0aGlzLmZpbGUubGFzdE1vZGlmaWVkLFxuICAgICAgbmFtZTogdGhpcy5maWxlLm5hbWUsXG4gICAgICByZWxhdGl2ZV9wYXRoOiB0aGlzLmZpbGUud2Via2l0UmVsYXRpdmVQYXRoLFxuICAgICAgc2l6ZTogdGhpcy5maWxlLnNpemUsXG4gICAgICB0eXBlOiB0aGlzLmZpbGUudHlwZSxcbiAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICBtZXRhOiB0eXBlb2YodGhpcy5maWxlLm1ldGEpID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzLmZpbGUubWV0YSgpIDogdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkZXIodXBsb2FkZXJzKXtcbiAgICBpZih0aGlzLm1ldGEudXBsb2FkZXIpe1xuICAgICAgbGV0IGNhbGxiYWNrID0gdXBsb2FkZXJzW3RoaXMubWV0YS51cGxvYWRlcl0gfHwgbG9nRXJyb3IoYG5vIHVwbG9hZGVyIGNvbmZpZ3VyZWQgZm9yICR7dGhpcy5tZXRhLnVwbG9hZGVyfWApXG4gICAgICByZXR1cm4ge25hbWU6IHRoaXMubWV0YS51cGxvYWRlciwgY2FsbGJhY2s6IGNhbGxiYWNrfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge25hbWU6IFwiY2hhbm5lbFwiLCBjYWxsYmFjazogY2hhbm5lbFVwbG9hZGVyfVxuICAgIH1cbiAgfVxuXG4gIHppcFBvc3RGbGlnaHQocmVzcCl7XG4gICAgdGhpcy5tZXRhID0gcmVzcC5lbnRyaWVzW3RoaXMucmVmXVxuICAgIGlmKCF0aGlzLm1ldGEpeyBsb2dFcnJvcihgbm8gcHJlZmxpZ2h0IHVwbG9hZCByZXNwb25zZSByZXR1cm5lZCB3aXRoIHJlZiAke3RoaXMucmVmfWAsIHtpbnB1dDogdGhpcy5maWxlRWwsIHJlc3BvbnNlOiByZXNwfSkgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0RPTkVfUkVGUyxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlMsXG4gIFBIWF9VUExPQURfUkVGXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IFVwbG9hZEVudHJ5IGZyb20gXCIuL3VwbG9hZF9lbnRyeVwiXG5cbmxldCBsaXZlVXBsb2FkZXJGaWxlUmVmID0gMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlVXBsb2FkZXIge1xuICBzdGF0aWMgZ2VuRmlsZVJlZihmaWxlKXtcbiAgICBsZXQgcmVmID0gZmlsZS5fcGh4UmVmXG4gICAgaWYocmVmICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHJlZlxuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlLl9waHhSZWYgPSAobGl2ZVVwbG9hZGVyRmlsZVJlZisrKS50b1N0cmluZygpXG4gICAgICByZXR1cm4gZmlsZS5fcGh4UmVmXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldEVudHJ5RGF0YVVSTChpbnB1dEVsLCByZWYsIGNhbGxiYWNrKXtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmaWxlID0+IHRoaXMuZ2VuRmlsZVJlZihmaWxlKSA9PT0gcmVmKVxuICAgIGNhbGxiYWNrKFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpXG4gIH1cblxuICBzdGF0aWMgaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKXtcbiAgICBsZXQgYWN0aXZlID0gMFxuICAgIERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbCkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpICE9PSBpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX0RPTkVfUkVGUykpe1xuICAgICAgICBhY3RpdmUrK1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFjdGl2ZSA+IDBcbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpe1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbClcbiAgICBsZXQgZmlsZURhdGEgPSB7fVxuICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBsZXQgZW50cnkgPSB7cGF0aDogaW5wdXRFbC5uYW1lfVxuICAgICAgbGV0IHVwbG9hZFJlZiA9IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXSA9IGZpbGVEYXRhW3VwbG9hZFJlZl0gfHwgW11cbiAgICAgIGVudHJ5LnJlZiA9IHRoaXMuZ2VuRmlsZVJlZihmaWxlKVxuICAgICAgZW50cnkubGFzdF9tb2RpZmllZCA9IGZpbGUubGFzdE1vZGlmaWVkXG4gICAgICBlbnRyeS5uYW1lID0gZmlsZS5uYW1lIHx8IGVudHJ5LnJlZlxuICAgICAgZW50cnkucmVsYXRpdmVfcGF0aCA9IGZpbGUud2Via2l0UmVsYXRpdmVQYXRoXG4gICAgICBlbnRyeS50eXBlID0gZmlsZS50eXBlXG4gICAgICBlbnRyeS5zaXplID0gZmlsZS5zaXplXG4gICAgICBpZih0eXBlb2YoZmlsZS5tZXRhKSA9PT0gXCJmdW5jdGlvblwiKXsgZW50cnkubWV0YSA9IGZpbGUubWV0YSgpIH1cbiAgICAgIGZpbGVEYXRhW3VwbG9hZFJlZl0ucHVzaChlbnRyeSlcbiAgICB9KVxuICAgIHJldHVybiBmaWxlRGF0YVxuICB9XG5cbiAgc3RhdGljIGNsZWFyRmlsZXMoaW5wdXRFbCl7XG4gICAgaW5wdXRFbC52YWx1ZSA9IG51bGxcbiAgICBpbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRilcbiAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdKVxuICB9XG5cbiAgc3RhdGljIHVudHJhY2tGaWxlKGlucHV0RWwsIGZpbGUpe1xuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgRE9NLnByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiKS5maWx0ZXIoZiA9PiAhT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgfVxuXG4gIHN0YXRpYyB0cmFja0ZpbGVzKGlucHV0RWwsIGZpbGVzLCBkYXRhVHJhbnNmZXIpe1xuICAgIGlmKGlucHV0RWwuZ2V0QXR0cmlidXRlKFwibXVsdGlwbGVcIikgIT09IG51bGwpe1xuICAgICAgbGV0IG5ld0ZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gIXRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmID0+IE9iamVjdC5pcyhmLCBmaWxlKSkpXG4gICAgICBET00udXBkYXRlUHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdLCAoZXhpc3RpbmcpID0+IGV4aXN0aW5nLmNvbmNhdChuZXdGaWxlcykpXG4gICAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXNldCBpbnB1dEVsIGZpbGVzIHRvIGFsaWduIG91dHB1dCB3aXRoIHByb2dyYW1tYXRpYyBjaGFuZ2VzIChpLmUuIGRyYWcgYW5kIGRyb3ApXG4gICAgICBpZihkYXRhVHJhbnNmZXIgJiYgZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCA+IDApeyBpbnB1dEVsLmZpbGVzID0gZGF0YVRyYW5zZmVyLmZpbGVzIH1cbiAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgZmlsZXMpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoZWwgPT4gZWwuZmlsZXMgJiYgdGhpcy5hY3RpdmVGaWxlcyhlbCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmVGaWxlcyhpbnB1dCl7XG4gICAgcmV0dXJuIChET00ucHJpdmF0ZShpbnB1dCwgXCJmaWxlc1wiKSB8fCBbXSkuZmlsdGVyKGYgPT4gVXBsb2FkRW50cnkuaXNBY3RpdmUoaW5wdXQsIGYpKVxuICB9XG5cbiAgc3RhdGljIGlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCl7XG4gICAgbGV0IGZpbGVJbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyhmb3JtRWwpXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZmlsZUlucHV0cykuZmlsdGVyKGlucHV0ID0+IHRoaXMuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBmaWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KXtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dCkuZmlsdGVyKGYgPT4gIVVwbG9hZEVudHJ5LmlzUHJlZmxpZ2h0ZWQoaW5wdXQsIGYpICYmICFVcGxvYWRFbnRyeS5pc1ByZWZsaWdodEluUHJvZ3Jlc3MoZikpXG4gIH1cblxuICBzdGF0aWMgbWFya1ByZWZsaWdodEluUHJvZ3Jlc3MoZW50cmllcyl7XG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IFVwbG9hZEVudHJ5Lm1hcmtQcmVmbGlnaHRJblByb2dyZXNzKGVudHJ5LmZpbGUpKVxuICB9XG5cbiAgY29uc3RydWN0b3IoaW5wdXRFbCwgdmlldywgb25Db21wbGV0ZSl7XG4gICAgdGhpcy5hdXRvVXBsb2FkID0gRE9NLmlzQXV0b1VwbG9hZChpbnB1dEVsKVxuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlXG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICBBcnJheS5mcm9tKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpIHx8IFtdKVxuICAgICAgICAubWFwKGZpbGUgPT4gbmV3IFVwbG9hZEVudHJ5KGlucHV0RWwsIGZpbGUsIHZpZXcsIHRoaXMuYXV0b1VwbG9hZCkpXG5cbiAgICAvLyBwcmV2ZW50IHNlbmRpbmcgZHVwbGljYXRlIHByZWZsaWdodCByZXF1ZXN0c1xuICAgIExpdmVVcGxvYWRlci5tYXJrUHJlZmxpZ2h0SW5Qcm9ncmVzcyh0aGlzLl9lbnRyaWVzKVxuXG4gICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9IHRoaXMuX2VudHJpZXMubGVuZ3RoXG4gIH1cblxuICBpc0F1dG9VcGxvYWQoKXsgcmV0dXJuIHRoaXMuYXV0b1VwbG9hZCB9XG5cbiAgZW50cmllcygpeyByZXR1cm4gdGhpcy5fZW50cmllcyB9XG5cbiAgaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgbGl2ZVNvY2tldCl7XG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICB0aGlzLl9lbnRyaWVzLm1hcChlbnRyeSA9PiB7XG4gICAgICAgIGlmKGVudHJ5LmlzQ2FuY2VsbGVkKCkpe1xuICAgICAgICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MtLVxuICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50cnkuemlwUG9zdEZsaWdodChyZXNwKVxuICAgICAgICAgIGVudHJ5Lm9uRG9uZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzLS1cbiAgICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW50cnlcbiAgICAgIH0pXG5cbiAgICBsZXQgZ3JvdXBlZEVudHJpZXMgPSB0aGlzLl9lbnRyaWVzLnJlZHVjZSgoYWNjLCBlbnRyeSkgPT4ge1xuICAgICAgaWYoIWVudHJ5Lm1ldGEpeyByZXR1cm4gYWNjIH1cbiAgICAgIGxldCB7bmFtZSwgY2FsbGJhY2t9ID0gZW50cnkudXBsb2FkZXIobGl2ZVNvY2tldC51cGxvYWRlcnMpXG4gICAgICBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gfHwge2NhbGxiYWNrOiBjYWxsYmFjaywgZW50cmllczogW119XG4gICAgICBhY2NbbmFtZV0uZW50cmllcy5wdXNoKGVudHJ5KVxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIHt9KVxuXG4gICAgZm9yKGxldCBuYW1lIGluIGdyb3VwZWRFbnRyaWVzKXtcbiAgICAgIGxldCB7Y2FsbGJhY2ssIGVudHJpZXN9ID0gZ3JvdXBlZEVudHJpZXNbbmFtZV1cbiAgICAgIGNhbGxiYWNrKGVudHJpZXMsIG9uRXJyb3IsIHJlc3AsIGxpdmVTb2NrZXQpXG4gICAgfVxuICB9XG59XG4iLCAibGV0IEFSSUEgPSB7XG4gIGFueU9mKGluc3RhbmNlLCBjbGFzc2VzKXsgcmV0dXJuIGNsYXNzZXMuZmluZChuYW1lID0+IGluc3RhbmNlIGluc3RhbmNlb2YgbmFtZSkgfSxcblxuICBpc0ZvY3VzYWJsZShlbCwgaW50ZXJhY3RpdmVPbmx5KXtcbiAgICByZXR1cm4gKFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZWwucmVsICE9PSBcImlnbm9yZVwiKSB8fFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFyZWFFbGVtZW50ICYmIGVsLmhyZWYgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICghZWwuZGlzYWJsZWQgJiYgKHRoaXMuYW55T2YoZWwsIFtIVE1MSW5wdXRFbGVtZW50LCBIVE1MU2VsZWN0RWxlbWVudCwgSFRNTFRleHRBcmVhRWxlbWVudCwgSFRNTEJ1dHRvbkVsZW1lbnRdKSkpIHx8XG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCkgfHxcbiAgICAgICgoZWwudGFiSW5kZXggPj0gMCAmJiBlbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSAhPT0gXCJ0cnVlXCIpIHx8ICghaW50ZXJhY3RpdmVPbmx5ICYmIGVsLmdldEF0dHJpYnV0ZShcInRhYmluZGV4XCIpICE9PSBudWxsICYmIGVsLmdldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpICE9PSBcInRydWVcIikpXG4gICAgKVxuICB9LFxuXG4gIGF0dGVtcHRGb2N1cyhlbCwgaW50ZXJhY3RpdmVPbmx5KXtcbiAgICBpZih0aGlzLmlzRm9jdXNhYmxlKGVsLCBpbnRlcmFjdGl2ZU9ubHkpKXsgdHJ5IHsgZWwuZm9jdXMoKSB9IGNhdGNoIHt9IH1cbiAgICByZXR1cm4gISFkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShlbClcbiAgfSxcblxuICBmb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpe1xuICAgIGxldCBjaGlsZCA9IGVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgd2hpbGUoY2hpbGQpe1xuICAgICAgaWYodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQsIHRydWUpIHx8IHRoaXMuZm9jdXNGaXJzdEludGVyYWN0aXZlKGNoaWxkLCB0cnVlKSl7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfSxcblxuICBmb2N1c0ZpcnN0KGVsKXtcbiAgICBsZXQgY2hpbGQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzRmlyc3QoY2hpbGQpKXtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIGNoaWxkID0gY2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9LFxuXG4gIGZvY3VzTGFzdChlbCl7XG4gICAgbGV0IGNoaWxkID0gZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzTGFzdChjaGlsZCkpe1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgY2hpbGQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBUklBXG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTLFxuICBQSFhfVVBMT0FEX1JFRlxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IEFSSUEgZnJvbSBcIi4vYXJpYVwiXG5cbmxldCBIb29rcyA9IHtcbiAgTGl2ZUZpbGVVcGxvYWQ6IHtcbiAgICBhY3RpdmVSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpIH0sXG5cbiAgICBwcmVmbGlnaHRlZFJlZnMoKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKSB9LFxuXG4gICAgbW91bnRlZCgpeyB0aGlzLnByZWZsaWdodGVkV2FzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKSB9LFxuXG4gICAgdXBkYXRlZCgpe1xuICAgICAgbGV0IG5ld1ByZWZsaWdodHMgPSB0aGlzLnByZWZsaWdodGVkUmVmcygpXG4gICAgICBpZih0aGlzLnByZWZsaWdodGVkV2FzICE9PSBuZXdQcmVmbGlnaHRzKXtcbiAgICAgICAgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IG5ld1ByZWZsaWdodHNcbiAgICAgICAgaWYobmV3UHJlZmxpZ2h0cyA9PT0gXCJcIil7XG4gICAgICAgICAgdGhpcy5fX3ZpZXcoKS5jYW5jZWxTdWJtaXQodGhpcy5lbC5mb3JtKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuYWN0aXZlUmVmcygpID09PSBcIlwiKXsgdGhpcy5lbC52YWx1ZSA9IG51bGwgfVxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChQSFhfTElWRV9GSUxFX1VQREFURUQpKVxuICAgIH1cbiAgfSxcblxuICBMaXZlSW1nUHJldmlldzoge1xuICAgIG1vdW50ZWQoKXtcbiAgICAgIHRoaXMucmVmID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1lbnRyeS1yZWZcIilcbiAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSlcbiAgICAgIExpdmVVcGxvYWRlci5nZXRFbnRyeURhdGFVUkwodGhpcy5pbnB1dEVsLCB0aGlzLnJlZiwgdXJsID0+IHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmxcbiAgICAgICAgdGhpcy5lbC5zcmMgPSB1cmxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkZXN0cm95ZWQoKXtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodGhpcy51cmwpXG4gICAgfVxuICB9LFxuICBGb2N1c1dyYXA6IHtcbiAgICBtb3VudGVkKCl7XG4gICAgICB0aGlzLmZvY3VzU3RhcnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0aGlzLmZvY3VzRW5kID0gdGhpcy5lbC5sYXN0RWxlbWVudENoaWxkXG4gICAgICB0aGlzLmZvY3VzU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlKSA9PiB7XG4gICAgICAgIGlmKCFlLnJlbGF0ZWRUYXJnZXQgfHwgIXRoaXMuZWwuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0KSl7IFxuICAgICAgICAgIC8vIEhhbmRsZSBmb2N1cyBlbnRlcmluZyBmcm9tIG91dHNpZGUgKGUuZy4gVGFiIHdoZW4gYm9keSBpcyBmb2N1c2VkKVxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNjM2XG4gICAgICAgICAgY29uc3QgbmV4dEZvY3VzID0gZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgICAgICAgQVJJQS5hdHRlbXB0Rm9jdXMobmV4dEZvY3VzKSB8fCBBUklBLmZvY3VzRmlyc3QobmV4dEZvY3VzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEFSSUEuZm9jdXNMYXN0KHRoaXMuZWwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmZvY3VzRW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICBpZighZS5yZWxhdGVkVGFyZ2V0IHx8ICF0aGlzLmVsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpeyBcbiAgICAgICAgICAvLyBIYW5kbGUgZm9jdXMgZW50ZXJpbmcgZnJvbSBvdXRzaWRlIChlLmcuIFNoaWZ0K1RhYiB3aGVuIGJvZHkgaXMgZm9jdXNlZClcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzYzNlxuICAgICAgICAgIGNvbnN0IG5leHRGb2N1cyA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmdcbiAgICAgICAgICBBUklBLmF0dGVtcHRGb2N1cyhuZXh0Rm9jdXMpIHx8IEFSSUEuZm9jdXNMYXN0KG5leHRGb2N1cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBBUklBLmZvY3VzRmlyc3QodGhpcy5lbClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpzaG93LWVuZFwiLCAoKSA9PiB0aGlzLmVsLmZvY3VzKCkpXG4gICAgICBpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsKS5kaXNwbGF5ICE9PSBcIm5vbmVcIil7XG4gICAgICAgIEFSSUEuZm9jdXNGaXJzdCh0aGlzLmVsKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5sZXQgZmluZFNjcm9sbENvbnRhaW5lciA9IChlbCkgPT4ge1xuICAvLyB0aGUgc2Nyb2xsIGV2ZW50IHdvbid0IGJlIGZpcmVkIG9uIHRoZSBodG1sL2JvZHkgZWxlbWVudCBldmVuIGlmIG92ZXJmbG93IGlzIHNldFxuICAvLyB0aGVyZWZvcmUgd2UgcmV0dXJuIG51bGwgdG8gaW5zdGVhZCBsaXN0ZW4gZm9yIHNjcm9sbCBldmVudHMgb24gZG9jdW1lbnRcbiAgaWYoW1wiSFRNTFwiLCBcIkJPRFlcIl0uaW5kZXhPZihlbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpKSA+PSAwKSByZXR1cm4gbnVsbFxuICBpZihbXCJzY3JvbGxcIiwgXCJhdXRvXCJdLmluZGV4T2YoZ2V0Q29tcHV0ZWRTdHlsZShlbCkub3ZlcmZsb3dZKSA+PSAwKSByZXR1cm4gZWxcbiAgcmV0dXJuIGZpbmRTY3JvbGxDb250YWluZXIoZWwucGFyZW50RWxlbWVudClcbn1cblxubGV0IHNjcm9sbFRvcCA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXG4gIH1cbn1cblxubGV0IGJvdHRvbSA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbVxuICB9IGVsc2Uge1xuICAgIC8vIHdoZW4gd2UgaGF2ZSBubyBjb250YWluZXIsIHRoZSB3aG9sZSBwYWdlIHNjcm9sbHMsXG4gICAgLy8gdGhlcmVmb3JlIHRoZSBib3R0b20gY29vcmRpbmF0ZSBpcyB0aGUgdmlld3BvcnQgaGVpZ2h0XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gIH1cbn1cblxubGV0IHRvcCA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICB9IGVsc2Uge1xuICAgIC8vIHdoZW4gd2UgaGF2ZSBubyBjb250YWluZXIgdGhlIHdob2xlIHBhZ2Ugc2Nyb2xscyxcbiAgICAvLyB0aGVyZWZvcmUgdGhlIHRvcCBjb29yZGluYXRlIGlzIDBcbiAgICByZXR1cm4gMFxuICB9XG59XG5cbmxldCBpc0F0Vmlld3BvcnRUb3AgPSAoZWwsIHNjcm9sbENvbnRhaW5lcikgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiBNYXRoLmNlaWwocmVjdC50b3ApID49IHRvcChzY3JvbGxDb250YWluZXIpICYmIE1hdGguY2VpbChyZWN0LmxlZnQpID49IDAgJiYgTWF0aC5mbG9vcihyZWN0LnRvcCkgPD0gYm90dG9tKHNjcm9sbENvbnRhaW5lcilcbn1cblxubGV0IGlzQXRWaWV3cG9ydEJvdHRvbSA9IChlbCwgc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIE1hdGguY2VpbChyZWN0LmJvdHRvbSkgPj0gdG9wKHNjcm9sbENvbnRhaW5lcikgJiYgTWF0aC5jZWlsKHJlY3QubGVmdCkgPj0gMCAmJiBNYXRoLmZsb29yKHJlY3QuYm90dG9tKSA8PSBib3R0b20oc2Nyb2xsQ29udGFpbmVyKVxufVxuXG5sZXQgaXNXaXRoaW5WaWV3cG9ydCA9IChlbCwgc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIE1hdGguY2VpbChyZWN0LnRvcCkgPj0gdG9wKHNjcm9sbENvbnRhaW5lcikgJiYgTWF0aC5jZWlsKHJlY3QubGVmdCkgPj0gMCAmJiBNYXRoLmZsb29yKHJlY3QudG9wKSA8PSBib3R0b20oc2Nyb2xsQ29udGFpbmVyKVxufVxuXG5Ib29rcy5JbmZpbml0ZVNjcm9sbCA9IHtcbiAgbW91bnRlZCgpe1xuICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyID0gZmluZFNjcm9sbENvbnRhaW5lcih0aGlzLmVsKVxuICAgIGxldCBzY3JvbGxCZWZvcmUgPSBzY3JvbGxUb3AodGhpcy5zY3JvbGxDb250YWluZXIpXG4gICAgbGV0IHRvcE92ZXJyYW4gPSBmYWxzZVxuICAgIGxldCB0aHJvdHRsZUludGVydmFsID0gNTAwXG4gICAgbGV0IHBlbmRpbmdPcCA9IG51bGxcblxuICAgIGxldCBvblRvcE92ZXJydW4gPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsICh0b3BFdmVudCwgZmlyc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gdHJ1ZVxuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKU0hvb2tQdXNoKHRoaXMuZWwsIHRvcEV2ZW50LCB7aWQ6IGZpcnN0Q2hpbGQuaWQsIF9vdmVycmFuOiB0cnVlfSwgKCkgPT4ge1xuICAgICAgICBwZW5kaW5nT3AgPSBudWxsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBsZXQgb25GaXJzdENoaWxkQXRUb3AgPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsICh0b3BFdmVudCwgZmlyc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gZmlyc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwic3RhcnRcIn0pXG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTSG9va1B1c2godGhpcy5lbCwgdG9wRXZlbnQsIHtpZDogZmlyc3RDaGlsZC5pZH0sICgpID0+IHtcbiAgICAgICAgcGVuZGluZ09wID0gbnVsbFxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGUgRE9NIGlzIHBhdGNoZWQgYnkgd2FpdGluZyBmb3IgdGhlIG5leHQgdGlja1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZighaXNXaXRoaW5WaWV3cG9ydChmaXJzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICAgICAgZmlyc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwic3RhcnRcIn0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgbGV0IG9uTGFzdENoaWxkQXRCb3R0b20gPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsIChib3R0b21FdmVudCwgbGFzdENoaWxkKSA9PiB7XG4gICAgICBwZW5kaW5nT3AgPSAoKSA9PiBsYXN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcImVuZFwifSlcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlNIb29rUHVzaCh0aGlzLmVsLCBib3R0b21FdmVudCwge2lkOiBsYXN0Q2hpbGQuaWR9LCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdPcCA9IG51bGxcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIERPTSBpcyBwYXRjaGVkIGJ5IHdhaXRpbmcgZm9yIHRoZSBuZXh0IHRpY2tcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYoIWlzV2l0aGluVmlld3BvcnQobGFzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICAgICAgbGFzdENoaWxkLnNjcm9sbEludG9WaWV3KHtibG9jazogXCJlbmRcIn0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vblNjcm9sbCA9IChfZSkgPT4ge1xuICAgICAgbGV0IHNjcm9sbE5vdyA9IHNjcm9sbFRvcCh0aGlzLnNjcm9sbENvbnRhaW5lcilcblxuICAgICAgaWYocGVuZGluZ09wKXtcbiAgICAgICAgc2Nyb2xsQmVmb3JlID0gc2Nyb2xsTm93XG4gICAgICAgIHJldHVybiBwZW5kaW5nT3AoKVxuICAgICAgfVxuICAgICAgbGV0IHJlY3QgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBsZXQgdG9wRXZlbnQgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSh0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhcInZpZXdwb3J0LXRvcFwiKSlcbiAgICAgIGxldCBib3R0b21FdmVudCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwidmlld3BvcnQtYm90dG9tXCIpKVxuICAgICAgbGV0IGxhc3RDaGlsZCA9IHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgICAgbGV0IGZpcnN0Q2hpbGQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgICBsZXQgaXNTY3JvbGxpbmdVcCA9IHNjcm9sbE5vdyA8IHNjcm9sbEJlZm9yZVxuICAgICAgbGV0IGlzU2Nyb2xsaW5nRG93biA9IHNjcm9sbE5vdyA+IHNjcm9sbEJlZm9yZVxuXG4gICAgICAvLyBlbCBvdmVycmFuIHdoaWxlIHNjcm9sbGluZyB1cFxuICAgICAgaWYoaXNTY3JvbGxpbmdVcCAmJiB0b3BFdmVudCAmJiAhdG9wT3ZlcnJhbiAmJiByZWN0LnRvcCA+PSAwKXtcbiAgICAgICAgdG9wT3ZlcnJhbiA9IHRydWVcbiAgICAgICAgb25Ub3BPdmVycnVuKHRvcEV2ZW50LCBmaXJzdENoaWxkKVxuICAgICAgfSBlbHNlIGlmKGlzU2Nyb2xsaW5nRG93biAmJiB0b3BPdmVycmFuICYmIHJlY3QudG9wIDw9IDApe1xuICAgICAgICB0b3BPdmVycmFuID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYodG9wRXZlbnQgJiYgaXNTY3JvbGxpbmdVcCAmJiBpc0F0Vmlld3BvcnRUb3AoZmlyc3RDaGlsZCwgdGhpcy5zY3JvbGxDb250YWluZXIpKXtcbiAgICAgICAgb25GaXJzdENoaWxkQXRUb3AodG9wRXZlbnQsIGZpcnN0Q2hpbGQpXG4gICAgICB9IGVsc2UgaWYoYm90dG9tRXZlbnQgJiYgaXNTY3JvbGxpbmdEb3duICYmIGlzQXRWaWV3cG9ydEJvdHRvbShsYXN0Q2hpbGQsIHRoaXMuc2Nyb2xsQ29udGFpbmVyKSl7XG4gICAgICAgIG9uTGFzdENoaWxkQXRCb3R0b20oYm90dG9tRXZlbnQsIGxhc3RDaGlsZClcbiAgICAgIH1cbiAgICAgIHNjcm9sbEJlZm9yZSA9IHNjcm9sbE5vd1xuICAgIH1cblxuICAgIGlmKHRoaXMuc2Nyb2xsQ29udGFpbmVyKXtcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbClcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbClcbiAgICB9XG4gIH0sXG4gIFxuICBkZXN0cm95ZWQoKXtcbiAgICBpZih0aGlzLnNjcm9sbENvbnRhaW5lcil7XG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfVxuICB9LFxuXG4gIHRocm90dGxlKGludGVydmFsLCBjYWxsYmFjayl7XG4gICAgbGV0IGxhc3RDYWxsQXQgPSAwXG4gICAgbGV0IHRpbWVyXG5cbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpXG4gICAgICBsZXQgcmVtYWluaW5nVGltZSA9IGludGVydmFsIC0gKG5vdyAtIGxhc3RDYWxsQXQpXG5cbiAgICAgIGlmKHJlbWFpbmluZ1RpbWUgPD0gMCB8fCByZW1haW5pbmdUaW1lID4gaW50ZXJ2YWwpe1xuICAgICAgICBpZih0aW1lcil7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgICAgIHRpbWVyID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGxhc3RDYWxsQXQgPSBub3dcbiAgICAgICAgY2FsbGJhY2soLi4uYXJncylcbiAgICAgIH0gZWxzZSBpZighdGltZXIpe1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxhc3RDYWxsQXQgPSBEYXRlLm5vdygpXG4gICAgICAgICAgdGltZXIgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2soLi4uYXJncylcbiAgICAgICAgfSwgcmVtYWluaW5nVGltZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEhvb2tzXG4iLCAiaW1wb3J0IHtcbiAgUEhYX1JFRl9MT0FESU5HLFxuICBQSFhfUkVGX0xPQ0ssXG4gIFBIWF9SRUZfU1JDLFxuICBQSFhfUEVORElOR19SRUZTLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgUEhYX0RJU0FCTEVELFxuICBQSFhfUkVBRE9OTFksXG4gIFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRVxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnRSZWYge1xuICBzdGF0aWMgb25VbmxvY2soZWwsIGNhbGxiYWNrKXtcbiAgICBpZighRE9NLmlzTG9ja2VkKGVsKSAmJiAhZWwuY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKSl7IHJldHVybiBjYWxsYmFjaygpIH1cbiAgICBjb25zdCBjbG9zZXN0TG9jayA9IGVsLmNsb3Nlc3QoYFske1BIWF9SRUZfTE9DS31dYClcbiAgICBjb25zdCByZWYgPSBjbG9zZXN0TG9jay5jbG9zZXN0KGBbJHtQSFhfUkVGX0xPQ0t9XWApLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgY2xvc2VzdExvY2suYWRkRXZlbnRMaXN0ZW5lcihgcGh4OnVuZG8tbG9jazoke3JlZn1gLCAoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfSwge29uY2U6IHRydWV9KVxuICB9XG5cbiAgY29uc3RydWN0b3IoZWwpe1xuICAgIHRoaXMuZWwgPSBlbFxuICAgIHRoaXMubG9hZGluZ1JlZiA9IGVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpID8gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9SRUZfTE9BRElORyksIDEwKSA6IG51bGxcbiAgICB0aGlzLmxvY2tSZWYgPSBlbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKSA/IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spLCAxMCkgOiBudWxsXG4gIH1cblxuICAvLyBwdWJsaWNcblxuICBtYXliZVVuZG8ocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzV2l0aGluKHJlZikpe1xuICAgICAgLy8gd2UgY2Fubm90IHVuZG8gdGhlIGxvY2sgLyBsb2FkaW5nIG5vdywgYXMgdGhlcmUgaXMgYSBuZXdlciBvbmUgYWxyZWFkeSBzZXQ7XG4gICAgICAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBvcmlnaW5hbCByZWYgd2UgdHJpZWQgdG8gc2VuZCB0aGUgdW5kbyBldmVudCBsYXRlclxuICAgICAgRE9NLnVwZGF0ZVByaXZhdGUodGhpcy5lbCwgUEhYX1BFTkRJTkdfUkVGUywgW10sIChwZW5kaW5nUmVmcykgPT4ge1xuICAgICAgICBwZW5kaW5nUmVmcy5wdXNoKHJlZilcbiAgICAgICAgcmV0dXJuIHBlbmRpbmdSZWZzXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gdW5kbyBsb2NrcyBhbmQgYXBwbHkgY2xvbmVzXG4gICAgdGhpcy51bmRvTG9ja3MocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spXG5cbiAgICAvLyB1bmRvIGxvYWRpbmcgc3RhdGVzXG4gICAgdGhpcy51bmRvTG9hZGluZyhyZWYsIHBoeEV2ZW50KVxuXG4gICAgLy8gZW5zdXJlIHVuZG8gZXZlbnRzIGFyZSBmaXJlZCBmb3IgcGVuZGluZyByZWZzIHRoYXRcbiAgICAvLyBhcmUgcmVzb2x2ZWQgYnkgdGhlIGN1cnJlbnQgcmVmLCBvdGhlcndpc2Ugd2UnZCBsZWFrIGV2ZW50IGxpc3RlbmVyc1xuICAgIERPTS51cGRhdGVQcml2YXRlKHRoaXMuZWwsIFBIWF9QRU5ESU5HX1JFRlMsIFtdLCAocGVuZGluZ1JlZnMpID0+IHtcbiAgICAgIHJldHVybiBwZW5kaW5nUmVmcy5maWx0ZXIoKHBlbmRpbmdSZWYpID0+IHtcbiAgICAgICAgbGV0IG9wdHMgPSB7XG4gICAgICAgICAgZGV0YWlsOiB7cmVmOiBwZW5kaW5nUmVmLCBldmVudDogcGh4RXZlbnR9LFxuICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5sb2FkaW5nUmVmICYmIHRoaXMubG9hZGluZ1JlZiA+IHBlbmRpbmdSZWYpe1xuICAgICAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgcGh4OnVuZG8tbG9hZGluZzoke3BlbmRpbmdSZWZ9YCwgb3B0cyksXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMubG9ja1JlZiAmJiB0aGlzLmxvY2tSZWYgPiBwZW5kaW5nUmVmKXtcbiAgICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYHBoeDp1bmRvLWxvY2s6JHtwZW5kaW5nUmVmfWAsIG9wdHMpLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGVuZGluZ1JlZiA+IHJlZlxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gY2xlYW4gdXAgaWYgZnVsbHkgcmVzb2x2ZWRcbiAgICBpZih0aGlzLmlzRnVsbHlSZXNvbHZlZEJ5KHJlZikpeyB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQykgfVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGlzV2l0aGluKHJlZil7XG4gICAgcmV0dXJuICEoKHRoaXMubG9hZGluZ1JlZiAhPT0gbnVsbCAmJiB0aGlzLmxvYWRpbmdSZWYgPiByZWYpICYmICh0aGlzLmxvY2tSZWYgIT09IG51bGwgJiYgdGhpcy5sb2NrUmVmID4gcmVmKSlcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBjbG9uZWQgUEhYX1JFRl9MT0NLIGVsZW1lbnQgdGhhdCBoYXMgYmVlbiBtb3JwaGVkIGJlaGluZFxuICAvLyB0aGUgc2NlbmVzIHdoaWxlIHRoaXMgZWxlbWVudCB3YXMgbG9ja2VkIGluIHRoZSBET00uXG4gIC8vIFdoZW4gd2UgYXBwbHkgdGhlIGNsb25lZCB0cmVlIHRvIHRoZSBhY3RpdmUgRE9NIGVsZW1lbnQsIHdlIG11c3RcbiAgLy9cbiAgLy8gICAxLiBleGVjdXRlIHBlbmRpbmcgbW91bnRlZCBob29rcyBmb3Igbm9kZXMgbm93IGluIHRoZSBET01cbiAgLy8gICAyLiB1bmRvIGFueSByZWYgaW5zaWRlIHRoZSBjbG9uZWQgdHJlZSB0aGF0IGhhcyBzaW5jZSBiZWVuIGFjaydkXG4gIHVuZG9Mb2NrcyhyZWYsIHBoeEV2ZW50LCBlYWNoQ2xvbmVDYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuaXNMb2NrVW5kb25lQnkocmVmKSl7IHJldHVybiB9XG5cbiAgICBsZXQgY2xvbmVkVHJlZSA9IERPTS5wcml2YXRlKHRoaXMuZWwsIFBIWF9SRUZfTE9DSylcbiAgICBpZihjbG9uZWRUcmVlKXtcbiAgICAgIGVhY2hDbG9uZUNhbGxiYWNrKGNsb25lZFRyZWUpXG4gICAgICBET00uZGVsZXRlUHJpdmF0ZSh0aGlzLmVsLCBQSFhfUkVGX0xPQ0spXG4gICAgfVxuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcblxuICAgIGxldCBvcHRzID0ge2RldGFpbDoge3JlZjogcmVmLCBldmVudDogcGh4RXZlbnR9LCBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiBmYWxzZX1cbiAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6dW5kby1sb2NrOiR7dGhpcy5sb2NrUmVmfWAsIG9wdHMpKVxuICB9XG5cbiAgdW5kb0xvYWRpbmcocmVmLCBwaHhFdmVudCl7XG4gICAgaWYoIXRoaXMuaXNMb2FkaW5nVW5kb25lQnkocmVmKSl7XG4gICAgICBpZih0aGlzLmNhblVuZG9Mb2FkaW5nKHJlZikgJiYgdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJwaHgtc3VibWl0LWxvYWRpbmdcIikpe1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJwaHgtY2hhbmdlLWxvYWRpbmdcIilcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmKHRoaXMuY2FuVW5kb0xvYWRpbmcocmVmKSl7XG4gICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpXG4gICAgICBsZXQgZGlzYWJsZWRWYWwgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICBsZXQgcmVhZE9ubHlWYWwgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpXG4gICAgICAvLyByZXN0b3JlIGlucHV0c1xuICAgICAgaWYocmVhZE9ubHlWYWwgIT09IG51bGwpe1xuICAgICAgICB0aGlzLmVsLnJlYWRPbmx5ID0gcmVhZE9ubHlWYWwgPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUFET05MWSlcbiAgICAgIH1cbiAgICAgIGlmKGRpc2FibGVkVmFsICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5lbC5kaXNhYmxlZCA9IGRpc2FibGVkVmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICB9XG4gICAgICAvLyByZXN0b3JlIGRpc2FibGVzXG4gICAgICBsZXQgZGlzYWJsZVJlc3RvcmUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpXG4gICAgICBpZihkaXNhYmxlUmVzdG9yZSAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJUZXh0ID0gZGlzYWJsZVJlc3RvcmVcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgfVxuXG4gICAgICBsZXQgb3B0cyA9IHtkZXRhaWw6IHtyZWY6IHJlZiwgZXZlbnQ6IHBoeEV2ZW50fSwgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2V9XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6dW5kby1sb2FkaW5nOiR7dGhpcy5sb2FkaW5nUmVmfWAsIG9wdHMpKVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBjbGFzc2VzXG4gICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGlmKG5hbWUgIT09IFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIgfHwgdGhpcy5jYW5VbmRvTG9hZGluZyhyZWYpKXtcbiAgICAgICAgRE9NLnJlbW92ZUNsYXNzKHRoaXMuZWwsIG5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlzTG9hZGluZ1VuZG9uZUJ5KHJlZil7IHJldHVybiB0aGlzLmxvYWRpbmdSZWYgPT09IG51bGwgPyBmYWxzZSA6IHRoaXMubG9hZGluZ1JlZiA8PSByZWYgfVxuICBpc0xvY2tVbmRvbmVCeShyZWYpeyByZXR1cm4gdGhpcy5sb2NrUmVmID09PSBudWxsID8gZmFsc2UgOiB0aGlzLmxvY2tSZWYgPD0gcmVmIH1cblxuICBpc0Z1bGx5UmVzb2x2ZWRCeShyZWYpe1xuICAgIHJldHVybiAodGhpcy5sb2FkaW5nUmVmID09PSBudWxsIHx8IHRoaXMubG9hZGluZ1JlZiA8PSByZWYpICYmICh0aGlzLmxvY2tSZWYgPT09IG51bGwgfHwgdGhpcy5sb2NrUmVmIDw9IHJlZilcbiAgfVxuXG4gIC8vIG9ubHkgcmVtb3ZlIHRoZSBwaHgtc3VibWl0LWxvYWRpbmcgY2xhc3MgaWYgd2UgYXJlIG5vdCBsb2NrZWRcbiAgY2FuVW5kb0xvYWRpbmcocmVmKXsgcmV0dXJuIHRoaXMubG9ja1JlZiA9PT0gbnVsbCB8fCB0aGlzLmxvY2tSZWYgPD0gcmVmIH1cbn1cbiIsICJpbXBvcnQge1xuICBtYXliZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NUG9zdE1vcnBoUmVzdG9yZXIge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXJCZWZvcmUsIGNvbnRhaW5lckFmdGVyLCB1cGRhdGVUeXBlKXtcbiAgICBsZXQgaWRzQmVmb3JlID0gbmV3IFNldCgpXG4gICAgbGV0IGlkc0FmdGVyID0gbmV3IFNldChbLi4uY29udGFpbmVyQWZ0ZXIuY2hpbGRyZW5dLm1hcChjaGlsZCA9PiBjaGlsZC5pZCkpXG5cbiAgICBsZXQgZWxlbWVudHNUb01vZGlmeSA9IFtdXG5cbiAgICBBcnJheS5mcm9tKGNvbnRhaW5lckJlZm9yZS5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICBpZihjaGlsZC5pZCl7IC8vIGFsbCBvZiBvdXIgY2hpbGRyZW4gc2hvdWxkIGJlIGVsZW1lbnRzIHdpdGggaWRzXG4gICAgICAgIGlkc0JlZm9yZS5hZGQoY2hpbGQuaWQpXG4gICAgICAgIGlmKGlkc0FmdGVyLmhhcyhjaGlsZC5pZCkpe1xuICAgICAgICAgIGxldCBwcmV2aW91c0VsZW1lbnRJZCA9IGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZy5pZFxuICAgICAgICAgIGVsZW1lbnRzVG9Nb2RpZnkucHVzaCh7ZWxlbWVudElkOiBjaGlsZC5pZCwgcHJldmlvdXNFbGVtZW50SWQ6IHByZXZpb3VzRWxlbWVudElkfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmNvbnRhaW5lcklkID0gY29udGFpbmVyQWZ0ZXIuaWRcbiAgICB0aGlzLnVwZGF0ZVR5cGUgPSB1cGRhdGVUeXBlXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5ID0gZWxlbWVudHNUb01vZGlmeVxuICAgIHRoaXMuZWxlbWVudElkc1RvQWRkID0gWy4uLmlkc0FmdGVyXS5maWx0ZXIoaWQgPT4gIWlkc0JlZm9yZS5oYXMoaWQpKVxuICB9XG5cbiAgLy8gV2UgZG8gdGhlIGZvbGxvd2luZyB0byBvcHRpbWl6ZSBhcHBlbmQvcHJlcGVuZCBvcGVyYXRpb25zOlxuICAvLyAgIDEpIFRyYWNrIGlkcyBvZiBtb2RpZmllZCBlbGVtZW50cyAmIG9mIG5ldyBlbGVtZW50c1xuICAvLyAgIDIpIEFsbCB0aGUgbW9kaWZpZWQgZWxlbWVudHMgYXJlIHB1dCBiYWNrIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBET00gdHJlZVxuICAvLyAgICAgIGJ5IHN0b3JpbmcgdGhlIGlkIG9mIHRoZWlyIHByZXZpb3VzIHNpYmxpbmdcbiAgLy8gICAzKSBOZXcgZWxlbWVudHMgYXJlIGdvaW5nIHRvIGJlIHB1dCBpbiB0aGUgcmlnaHQgcGxhY2UgYnkgbW9ycGhkb20gZHVyaW5nIGFwcGVuZC5cbiAgLy8gICAgICBGb3IgcHJlcGVuZCwgd2UgbW92ZSB0aGVtIHRvIHRoZSBmaXJzdCBwb3NpdGlvbiBpbiB0aGUgY29udGFpbmVyXG4gIHBlcmZvcm0oKXtcbiAgICBsZXQgY29udGFpbmVyID0gRE9NLmJ5SWQodGhpcy5jb250YWluZXJJZClcbiAgICB0aGlzLmVsZW1lbnRzVG9Nb2RpZnkuZm9yRWFjaChlbGVtZW50VG9Nb2RpZnkgPT4ge1xuICAgICAgaWYoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKXtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKSwgcHJldmlvdXNFbGVtID0+IHtcbiAgICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgICBsZXQgaXNJblJpZ2h0UGxhY2UgPSBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlkID09IHByZXZpb3VzRWxlbS5pZFxuICAgICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgICAgcHJldmlvdXNFbGVtLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGVsZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGNvbnRhaW5lclxuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09IG51bGxcbiAgICAgICAgICBpZighaXNJblJpZ2h0UGxhY2Upe1xuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgZWxlbSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmKHRoaXMudXBkYXRlVHlwZSA9PSBcInByZXBlbmRcIil7XG4gICAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZC5yZXZlcnNlKCkuZm9yRWFjaChlbGVtSWQgPT4ge1xuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtSWQpLCBlbGVtID0+IGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cbiIsICJ2YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSA9IDExO1xuXG5mdW5jdGlvbiBtb3JwaEF0dHJzKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICB2YXIgdG9Ob2RlQXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cjtcbiAgICB2YXIgYXR0ck5hbWU7XG4gICAgdmFyIGF0dHJOYW1lc3BhY2VVUkk7XG4gICAgdmFyIGF0dHJWYWx1ZTtcbiAgICB2YXIgZnJvbVZhbHVlO1xuXG4gICAgLy8gZG9jdW1lbnQtZnJhZ21lbnRzIGRvbnQgaGF2ZSBhdHRyaWJ1dGVzIHNvIGxldHMgbm90IGRvIGFueXRoaW5nXG4gICAgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSB8fCBmcm9tTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50XG4gICAgZm9yICh2YXIgaSA9IHRvTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGF0dHIgPSB0b05vZGVBdHRyc1tpXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgYXR0clZhbHVlID0gYXR0ci52YWx1ZTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKTtcblxuICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHIucHJlZml4ID09PSAneG1sbnMnKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7IC8vIEl0J3Mgbm90IGFsbG93ZWQgdG8gc2V0IGFuIGF0dHJpYnV0ZSB3aXRoIHRoZSBYTUxOUyBuYW1lc3BhY2Ugd2l0aG91dCBzcGVjaWZ5aW5nIHRoZSBgeG1sbnNgIHByZWZpeFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgZXh0cmEgYXR0cmlidXRlcyBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgRE9NIGVsZW1lbnQgdGhhdFxuICAgIC8vIHdlcmVuJ3QgZm91bmQgb24gdGhlIHRhcmdldCBlbGVtZW50LlxuICAgIHZhciBmcm9tTm9kZUF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgIGZvciAodmFyIGQgPSBmcm9tTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGQgPj0gMDsgZC0tKSB7XG4gICAgICAgIGF0dHIgPSBmcm9tTm9kZUF0dHJzW2RdO1xuICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgYXR0ck5hbWVzcGFjZVVSSSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuXG4gICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuXG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHJhbmdlOyAvLyBDcmVhdGUgYSByYW5nZSBvYmplY3QgZm9yIGVmZmljZW50bHkgcmVuZGVyaW5nIHN0cmluZ3MgdG8gZWxlbWVudHMuXG52YXIgTlNfWEhUTUwgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbnZhciBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogZG9jdW1lbnQ7XG52YXIgSEFTX1RFTVBMQVRFX1NVUFBPUlQgPSAhIWRvYyAmJiAnY29udGVudCcgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG52YXIgSEFTX1JBTkdFX1NVUFBPUlQgPSAhIWRvYyAmJiBkb2MuY3JlYXRlUmFuZ2UgJiYgJ2NyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCcgaW4gZG9jLmNyZWF0ZVJhbmdlKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cikge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudCA9IHJhbmdlLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzdHIpO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cikge1xuICAgIHZhciBmcmFnbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgZnJhZ21lbnQuaW5uZXJIVE1MID0gc3RyO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgYWJvdXQgdGhlIHNhbWVcbiAqIHZhciBodG1sID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhzdHIsICd0ZXh0L2h0bWwnKTtcbiAqIHJldHVybiBodG1sLmJvZHkuZmlyc3RDaGlsZDtcbiAqXG4gKiBAbWV0aG9kIHRvRWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5mdW5jdGlvbiB0b0VsZW1lbnQoc3RyKSB7XG4gICAgc3RyID0gc3RyLnRyaW0oKTtcbiAgICBpZiAoSEFTX1RFTVBMQVRFX1NVUFBPUlQpIHtcbiAgICAgIC8vIGF2b2lkIHJlc3RyaWN0aW9ucyBvbiBjb250ZW50IGZvciB0aGluZ3MgbGlrZSBgPHRyPjx0aD5IaTwvdGg+PC90cj5gIHdoaWNoXG4gICAgICAvLyBjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQgZG9lc24ndCBzdXBwb3J0XG4gICAgICAvLyA8dGVtcGxhdGU+IHN1cHBvcnQgbm90IGF2YWlsYWJsZSBpbiBJRVxuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cik7XG4gICAgfSBlbHNlIGlmIChIQVNfUkFOR0VfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVJhbmdlKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVdyYXAoc3RyKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdHdvIG5vZGUncyBuYW1lcyBhcmUgdGhlIHNhbWUuXG4gKlxuICogTk9URTogV2UgZG9uJ3QgYm90aGVyIGNoZWNraW5nIGBuYW1lc3BhY2VVUklgIGJlY2F1c2UgeW91IHdpbGwgbmV2ZXIgZmluZCB0d28gSFRNTCBlbGVtZW50cyB3aXRoIHRoZSBzYW1lXG4gKiAgICAgICBub2RlTmFtZSBhbmQgZGlmZmVyZW50IG5hbWVzcGFjZSBVUklzLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiIFRoZSB0YXJnZXQgZWxlbWVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZU5vZGVOYW1lcyhmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgZnJvbU5vZGVOYW1lID0gZnJvbUVsLm5vZGVOYW1lO1xuICAgIHZhciB0b05vZGVOYW1lID0gdG9FbC5ub2RlTmFtZTtcbiAgICB2YXIgZnJvbUNvZGVTdGFydCwgdG9Db2RlU3RhcnQ7XG5cbiAgICBpZiAoZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZyb21Db2RlU3RhcnQgPSBmcm9tTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcbiAgICB0b0NvZGVTdGFydCA9IHRvTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcblxuICAgIC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIHZpcnR1YWwgRE9NIG5vZGUgb3IgU1ZHIG5vZGUgdGhlbiB3ZSBtYXlcbiAgICAvLyBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgdGFnIG5hbWUgYmVmb3JlIGNvbXBhcmluZy4gTm9ybWFsIEhUTUwgZWxlbWVudHMgdGhhdCBhcmVcbiAgICAvLyBpbiB0aGUgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCJcbiAgICAvLyBhcmUgY29udmVydGVkIHRvIHVwcGVyIGNhc2VcbiAgICBpZiAoZnJvbUNvZGVTdGFydCA8PSA5MCAmJiB0b0NvZGVTdGFydCA+PSA5NykgeyAvLyBmcm9tIGlzIHVwcGVyIGFuZCB0byBpcyBsb3dlclxuICAgICAgICByZXR1cm4gZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIGlmICh0b0NvZGVTdGFydCA8PSA5MCAmJiBmcm9tQ29kZVN0YXJ0ID49IDk3KSB7IC8vIHRvIGlzIHVwcGVyIGFuZCBmcm9tIGlzIGxvd2VyXG4gICAgICAgIHJldHVybiB0b05vZGVOYW1lID09PSBmcm9tTm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlbGVtZW50LCBvcHRpb25hbGx5IHdpdGggYSBrbm93biBuYW1lc3BhY2UgVVJJLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSBlbGVtZW50IG5hbWUsIGUuZy4gJ2Rpdicgb3IgJ3N2ZydcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZXNwYWNlVVJJXSB0aGUgZWxlbWVudCdzIG5hbWVzcGFjZSBVUkksIGkuZS4gdGhlIHZhbHVlIG9mXG4gKiBpdHMgYHhtbG5zYCBhdHRyaWJ1dGUgb3IgaXRzIGluZmVycmVkIG5hbWVzcGFjZS5cbiAqXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZSwgbmFtZXNwYWNlVVJJKSB7XG4gICAgcmV0dXJuICFuYW1lc3BhY2VVUkkgfHwgbmFtZXNwYWNlVVJJID09PSBOU19YSFRNTCA/XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50KG5hbWUpIDpcbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIG5hbWUpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgY2hpbGRyZW4gb2Ygb25lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgRE9NIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gbW92ZUNoaWxkcmVuKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICB2YXIgbmV4dENoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIHRvRWwuYXBwZW5kQ2hpbGQoY3VyQ2hpbGQpO1xuICAgICAgICBjdXJDaGlsZCA9IG5leHRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHRvRWw7XG59XG5cbmZ1bmN0aW9uIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCBuYW1lKSB7XG4gICAgaWYgKGZyb21FbFtuYW1lXSAhPT0gdG9FbFtuYW1lXSkge1xuICAgICAgICBmcm9tRWxbbmFtZV0gPSB0b0VsW25hbWVdO1xuICAgICAgICBpZiAoZnJvbUVsW25hbWVdKSB7XG4gICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgICBPUFRJT046IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGZyb21FbC5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgdmFyIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgcGFyZW50TmFtZSA9IHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdTRUxFQ1QnICYmICFwYXJlbnROb2RlLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgICAgICAgIGlmIChmcm9tRWwuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpICYmICF0b0VsLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIE1TIEVkZ2UgYnVnIHdoZXJlIHRoZSAnc2VsZWN0ZWQnIGF0dHJpYnV0ZSBjYW4gb25seSBiZVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmVkIGlmIHNldCB0byBhIG5vbi1lbXB0eSB2YWx1ZTpcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvMTIwODc2NzkvXG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gcmVzZXQgc2VsZWN0IGVsZW1lbnQncyBzZWxlY3RlZEluZGV4IHRvIC0xLCBvdGhlcndpc2Ugc2V0dGluZ1xuICAgICAgICAgICAgICAgIC8vIGZyb21FbC5zZWxlY3RlZCB1c2luZyB0aGUgc3luY0Jvb2xlYW5BdHRyUHJvcCBiZWxvdyBoYXMgbm8gZWZmZWN0LlxuICAgICAgICAgICAgICAgIC8vIFRoZSBjb3JyZWN0IHNlbGVjdGVkSW5kZXggd2lsbCBiZSBzZXQgaW4gdGhlIFNFTEVDVCBzcGVjaWFsIGhhbmRsZXIgYmVsb3cuXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdzZWxlY3RlZCcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudCBzaW5jZSBpdCBzZXRzXG4gICAgICogdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCIgYXR0cmlidXRlIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICogXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZSBubyBlZmZlY3Qgc2luY2UgaXQgaXMgb25seSB1c2VkIHRvIHRoZSBzZXQgdGhlXG4gICAgICogaW5pdGlhbCB2YWx1ZS4gIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUsIGFuZCBcImRpc2FibGVkXCIuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2NoZWNrZWQnKTtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFRFWFRBUkVBOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgaWYgKGZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIC8vIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgc2V0cyB0aGUgcGxhY2Vob2xkZXIgYXMgdGhlXG4gICAgICAgICAgICAvLyBub2RlIHZhbHVlIGFuZCB2aXNlIHZlcnNhLiBUaGlzIGlnbm9yZXMgYW4gZW1wdHkgdXBkYXRlLlxuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gZmlyc3RDaGlsZC5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PSBuZXdWYWx1ZSB8fCAoIW5ld1ZhbHVlICYmIG9sZFZhbHVlID09IGZyb21FbC5wbGFjZWhvbGRlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpcnN0Q2hpbGQubm9kZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFNFTEVDVDogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIGlmICghdG9FbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvb3AgdGhyb3VnaCBjaGlsZHJlbiBvZiBmcm9tRWwsIG5vdCB0b0VsIHNpbmNlIG5vZGVzIGNhbiBiZSBtb3ZlZFxuICAgICAgICAgICAgLy8gZnJvbSB0b0VsIHRvIGZyb21FbCBkaXJlY3RseSB3aGVuIG1vcnBoaW5nLlxuICAgICAgICAgICAgLy8gQXQgdGhlIHRpbWUgdGhpcyBzcGVjaWFsIGhhbmRsZXIgaXMgaW52b2tlZCwgYWxsIGNoaWxkcmVuIGhhdmUgYWxyZWFkeSBiZWVuIG1vcnBoZWRcbiAgICAgICAgICAgIC8vIGFuZCBhcHBlbmRlZCB0byAvIHJlbW92ZWQgZnJvbSBmcm9tRWwsIHNvIHVzaW5nIGZyb21FbCBoZXJlIGlzIHNhZmUgYW5kIGNvcnJlY3QuXG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBvcHRncm91cDtcbiAgICAgICAgICAgIHZhciBub2RlTmFtZTtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZSAmJiBjdXJDaGlsZC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRncm91cCA9IGN1ckNoaWxkO1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBlbXB0eSBvcHRncm91cHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGdyb3VwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmcm9tRWwuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEgPSAxMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgcmV0dXJuIChub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgbm9kZS5pZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycykge1xuXG4gIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICB0b05vZGUgPSB0b05vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuXG4gICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uRWxVcGRhdGVkID0gb3B0aW9ucy5vbkVsVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIHNraXBGcm9tQ2hpbGRyZW4gPSBvcHRpb25zLnNraXBGcm9tQ2hpbGRyZW4gfHwgbm9vcDtcbiAgICB2YXIgYWRkQ2hpbGQgPSBvcHRpb25zLmFkZENoaWxkIHx8IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTsgfTtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciBrZXllZFJlbW92YWxMaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBhZGRLZXllZFJlbW92YWwoa2V5KSB7XG4gICAgICBrZXllZFJlbW92YWxMaXN0LnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuXG4gICAgICAgICAgdmFyIGtleSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChza2lwS2V5ZWROb2RlcyAmJiAoa2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCkpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgc2tpcHBpbmcga2V5ZWQgbm9kZXMgdGhlbiB3ZSBhZGQgdGhlIGtleVxuICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVwb3J0IHRoZSBub2RlIGFzIGRpc2NhcmRlZCBpZiBpdCBpcyBub3Qga2V5ZWQuIFdlIGRvIHRoaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGRpc2NhcmQgdGhlbSBpbiBvbmUgZmluYWwgcGFzcy5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJlbW92ZXMgYSBET00gbm9kZSBvdXQgb2YgdGhlIG9yaWdpbmFsIERPTVxuICAgICpcbiAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgKiBAcGFyYW0gIHtOb2RlfSBwYXJlbnROb2RlIFRoZSBub2RlcyBwYXJlbnRcbiAgICAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBLZXllZE5vZGVzIElmIHRydWUgdGhlbiBlbGVtZW50cyB3aXRoIGtleXMgd2lsbCBiZSBza2lwcGVkIGFuZCBub3QgZGlzY2FyZGVkLlxuICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlLCBwYXJlbnROb2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICBvbk5vZGVEaXNjYXJkZWQobm9kZSk7XG4gICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgLy8gICAgICAgICByb290LFxuICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBlbDtcbiAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAvLyAgICAgdmFyIGVsO1xuICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2FsayByZWN1cnNpdmVseVxuICAgICAgICAgIGluZGV4VHJlZShjdXJDaGlsZCk7XG5cbiAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5kZXhUcmVlKGZyb21Ob2RlKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZU5vZGVBZGRlZChlbCkge1xuICAgICAgb25Ob2RlQWRkZWQoZWwpO1xuXG4gICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIHZhciB1bm1hdGNoZWRGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBba2V5XTtcbiAgICAgICAgICAvLyBpZiB3ZSBmaW5kIGEgZHVwbGljYXRlICNpZCBub2RlIGluIGNhY2hlLCByZXBsYWNlIGBlbGAgd2l0aCBjYWNoZSB2YWx1ZVxuICAgICAgICAgIC8vIGFuZCBtb3JwaCBpdCB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICBpZiAodW5tYXRjaGVkRnJvbUVsICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyQ2hpbGQsIHVubWF0Y2hlZEZyb21FbCkpIHtcbiAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FsbCBmb3IgY3VyQ2hpbGQgYW5kIGl0J3MgY2hpbGRyZW4gdG8gc2VlIGlmIHdlIGZpbmQgc29tZXRoaW5nIGluXG4gICAgICAgICAgLy8gZnJvbU5vZGVzTG9va3VwXG4gICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpc1xuICAgICAgLy8gbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkXG4gICAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgaWYgKChjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkpIHtcbiAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcblxuICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBmcm9tTm9kZXNMb29rdXBbdG9FbEtleV07XG4gICAgICB9XG5cbiAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIHZhciBiZWZvcmVVcGRhdGVSZXN1bHQgPSBvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpO1xuICAgICAgICBpZiAoYmVmb3JlVXBkYXRlUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChiZWZvcmVVcGRhdGVSZXN1bHQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIGZyb21FbCA9IGJlZm9yZVVwZGF0ZVJlc3VsdDtcbiAgICAgICAgICAvLyByZWluZGV4IHRoZSBuZXcgZnJvbUVsIGluIGNhc2UgaXQncyBub3QgaW4gdGhlIHNhbWVcbiAgICAgICAgICAvLyB0cmVlIGFzIHRoZSBvcmlnaW5hbCBmcm9tRWxcbiAgICAgICAgICAvLyAoUGhvZW5peCBMaXZlVmlldyBzb21ldGltZXMgcmV0dXJucyBhIGNsb25lZCB0cmVlLFxuICAgICAgICAgIC8vICBidXQga2V5ZWQgbG9va3VwcyB3b3VsZCBzdGlsbCBwb2ludCB0byB0aGUgb3JpZ2luYWwgdHJlZSlcbiAgICAgICAgICBpbmRleFRyZWUoZnJvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50IGZpcnN0XG4gICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgb25FbFVwZGF0ZWQoZnJvbUVsKTtcblxuICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbUVsLm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXJzLlRFWFRBUkVBKGZyb21FbCwgdG9FbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgIHZhciBza2lwRnJvbSA9IHNraXBGcm9tQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuXG4gICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG5cbiAgICAgIC8vIHdhbGsgdGhlIGNoaWxkcmVuXG4gICAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgY3VyVG9Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgLy8gd2FsayB0aGUgZnJvbU5vZGUgY2hpbGRyZW4gYWxsIHRoZSB3YXkgdGhyb3VnaFxuICAgICAgICB3aGlsZSAoIXNraXBGcm9tICYmIGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgLy8gdGhpcyBtZWFucyBpZiB0aGUgY3VyRnJvbU5vZGVDaGlsZCBkb2VzbnQgaGF2ZSBhIG1hdGNoIHdpdGggdGhlIGN1clRvTm9kZUNoaWxkXG4gICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZUNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuXG4gICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGFyZ2V0IG5vZGUgaGFzIGEga2V5IHNvIHdlIHdhbnQgdG8gbWF0Y2ggaXQgdXAgd2l0aCB0aGUgY29ycmVjdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBzaW5nbGUgZWxlbWVudCByZW1vdmFscy4gVG8gYXZvaWQgcmVtb3ZpbmcgdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIG5vZGUgb3V0IG9mIHRoZSB0cmVlIChzaW5jZSB0aGF0IGNhbiBicmVhayBDU1MgdHJhbnNpdGlvbnMsIGV0Yy4pLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpb24gdG8gcHJvcGVybHkgbWF0Y2ggdXAgdGhlIGtleWVkIHRhcmdldCBlbGVtZW50IHdpdGggaXRzIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgIC8vIExldCdzIG1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gaXQuXG5cbiAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSB1c2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgcmVwbGFjZUNoaWxkIGJlY2F1c2Ugd2Ugd2FudCB0byBnbyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGxpZmVjeWNsZSBob29rcyBhcmUgY29ycmVjdGx5IGludm9rZWRcbiAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG1hdGNoaW5nRnJvbUVsO1xuICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5vZGVzIGFyZSBub3QgY29tcGF0aWJsZSBzaW5jZSB0aGUgXCJ0b1wiIG5vZGUgaGFzIGEga2V5IGFuZCB0aGVyZVxuICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHwgY3VyRnJvbU5vZGVUeXBlID09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRvIGFzIHdlIGFscmVhZHkgcmVjdXJzaXZlbHkgY2FsbGVkIG1vcnBoQ2hpbGRyZW4gYWJvdmVcbiAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgLy8gbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTS4gSG93ZXZlciwgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSBmcm9tIG5vZGUgaXMgbm90IGtleWVkXG4gICAgICAgICAgLy8gc2luY2UgaXQgaXMgcG9zc2libGUgdGhhdCBhIGtleWVkIG5vZGUgbWlnaHQgbWF0Y2ggdXAgd2l0aCBhIG5vZGUgc29tZXdoZXJlIGVsc2UgaW4gdGhlXG4gICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAvLyBob21lIGluIHRoZSBmaW5hbCBET00gdHJlZS4gQWZ0ZXIgZXZlcnl0aGluZyBpcyBkb25lIHdlIHdpbGwgcmVtb3ZlIGFueSBrZXllZCBub2Rlc1xuICAgICAgICAgIC8vIHRoYXQgZGlkbid0IGZpbmQgYSBob21lXG4gICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgIH0gLy8gRU5EOiB3aGlsZShjdXJGcm9tTm9kZUNoaWxkKSB7fVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICBpZighc2tpcEZyb20peyBhZGRDaGlsZChmcm9tRWwsIG1hdGNoaW5nRnJvbUVsKTsgfVxuICAgICAgICAgIG1vcnBoRWwobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENoaWxkKGZyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIGNsZWFudXBGcm9tRWwoZnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBjdXJGcm9tTm9kZUtleSk7XG5cbiAgICAgIHZhciBzcGVjaWFsRWxIYW5kbGVyID0gc3BlY2lhbEVsSGFuZGxlcnNbZnJvbUVsLm5vZGVOYW1lXTtcbiAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXIoZnJvbUVsLCB0b0VsKTtcbiAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhDaGlsZHJlbiguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgLy8gY29tcGF0aWJsZSAoZS5nLiA8ZGl2PiAtLT4gPHNwYW4+IG9yIDxkaXY+IC0tPiBURVhUKVxuICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICBpZiAoIWNvbXBhcmVOb2RlTmFtZXMoZnJvbU5vZGUsIHRvTm9kZSkpIHtcbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vdmVDaGlsZHJlbihmcm9tTm9kZSwgY3JlYXRlRWxlbWVudE5TKHRvTm9kZS5ub2RlTmFtZSwgdG9Ob2RlLm5hbWVzcGFjZVVSSSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBtb3JwaGVkTm9kZVR5cGUpIHtcbiAgICAgICAgICBpZiAobW9ycGhlZE5vZGUubm9kZVZhbHVlICE9PSB0b05vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUZXh0IG5vZGUgdG8gc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb3JwaGVkTm9kZSA9PT0gdG9Ob2RlKSB7XG4gICAgICAvLyBUaGUgXCJ0byBub2RlXCIgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIFwiZnJvbSBub2RlXCIgc28gd2UgaGFkIHRvXG4gICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgLy8gV2Ugbm93IG5lZWQgdG8gbG9vcCBvdmVyIGFueSBrZXllZCBub2RlcyB0aGF0IG1pZ2h0IG5lZWQgdG8gYmVcbiAgICAgIC8vIHJlbW92ZWQuIFdlIG9ubHkgZG8gdGhlIHJlbW92YWwgaWYgd2Uga25vdyB0aGF0IHRoZSBrZXllZCBub2RlXG4gICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgLy8gaXQgb3V0IG9mIGZyb21Ob2Rlc0xvb2t1cCBhbmQgd2UgdXNlIGZyb21Ob2Rlc0xvb2t1cCB0byBkZXRlcm1pbmVcbiAgICAgIC8vIGlmIGEga2V5ZWQgbm9kZSBoYXMgYmVlbiBtYXRjaGVkIHVwIG9yIG5vdFxuICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49a2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxUb1JlbW92ZSA9IGZyb21Ob2Rlc0xvb2t1cFtrZXllZFJlbW92YWxMaXN0W2ldXTtcbiAgICAgICAgICBpZiAoZWxUb1JlbW92ZSkge1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgaWYgKG1vcnBoZWROb2RlLmFjdHVhbGl6ZSkge1xuICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgfTtcbn1cblxudmFyIG1vcnBoZG9tID0gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3JwaGRvbTtcbiIsICJpbXBvcnQge1xuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfUFJVTkUsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NLSVAsXG4gIFBIWF9NQUdJQ19JRCxcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSSUdHRVJfQUNUSU9OLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfU1RSRUFNLFxuICBQSFhfU1RSRUFNX1JFRixcbiAgUEhYX1ZJRVdQT1JUX1RPUCxcbiAgUEhYX1ZJRVdQT1JUX0JPVFRPTSxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgZGV0ZWN0RHVwbGljYXRlSWRzLFxuICBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyxcbiAgaXNDaWRcbn0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IEVsZW1lbnRSZWYgZnJvbSBcIi4vZWxlbWVudF9yZWZcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IERPTVBvc3RNb3JwaFJlc3RvcmVyIGZyb20gXCIuL2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyXCJcbmltcG9ydCBtb3JwaGRvbSBmcm9tIFwibW9ycGhkb21cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBET01QYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHZpZXcsIGNvbnRhaW5lciwgaWQsIGh0bWwsIHN0cmVhbXMsIHRhcmdldENJRCwgb3B0cz17fSl7XG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyXG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy5yb290SUQgPSB2aWV3LnJvb3QuaWRcbiAgICB0aGlzLmh0bWwgPSBodG1sXG4gICAgdGhpcy5zdHJlYW1zID0gc3RyZWFtc1xuICAgIHRoaXMuc3RyZWFtSW5zZXJ0cyA9IHt9XG4gICAgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlID0ge31cbiAgICB0aGlzLnRhcmdldENJRCA9IHRhcmdldENJRFxuICAgIHRoaXMuY2lkUGF0Y2ggPSBpc0NpZCh0aGlzLnRhcmdldENJRClcbiAgICB0aGlzLnBlbmRpbmdSZW1vdmVzID0gW11cbiAgICB0aGlzLnBoeFJlbW92ZSA9IHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgdGhpcy50YXJnZXRDb250YWluZXIgPSB0aGlzLmlzQ0lEUGF0Y2goKSA/IHRoaXMudGFyZ2V0Q0lEQ29udGFpbmVyKGh0bWwpIDogY29udGFpbmVyXG4gICAgdGhpcy5jYWxsYmFja3MgPSB7XG4gICAgICBiZWZvcmVhZGRlZDogW10sIGJlZm9yZXVwZGF0ZWQ6IFtdLCBiZWZvcmVwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVyYWRkZWQ6IFtdLCBhZnRlcnVwZGF0ZWQ6IFtdLCBhZnRlcmRpc2NhcmRlZDogW10sIGFmdGVycGh4Q2hpbGRBZGRlZDogW10sXG4gICAgICBhZnRlcnRyYW5zaXRpb25zRGlzY2FyZGVkOiBbXVxuICAgIH1cbiAgICB0aGlzLndpdGhDaGlsZHJlbiA9IG9wdHMud2l0aENoaWxkcmVuIHx8IG9wdHMudW5kb1JlZiB8fCBmYWxzZVxuICAgIHRoaXMudW5kb1JlZiA9IG9wdHMudW5kb1JlZlxuICB9XG5cbiAgYmVmb3JlKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGJlZm9yZSR7a2luZH1gXS5wdXNoKGNhbGxiYWNrKSB9XG4gIGFmdGVyKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cblxuICB0cmFja0JlZm9yZShraW5kLCAuLi5hcmdzKXtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICB0cmFja0FmdGVyKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BhZnRlciR7a2luZH1gXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKVxuICB9XG5cbiAgbWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKXtcbiAgICBsZXQgcGh4VXBkYXRlID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSlcbiAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT1hcHBlbmRdID4gKiwgWyR7cGh4VXBkYXRlfT1wcmVwZW5kXSA+ICpgLCBlbCA9PiB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1BSVU5FLCBcIlwiKVxuICAgIH0pXG4gIH1cblxuICBwZXJmb3JtKGlzSm9pblBhdGNoKXtcbiAgICBsZXQge3ZpZXcsIGxpdmVTb2NrZXQsIGh0bWwsIGNvbnRhaW5lcn0gPSB0aGlzXG4gICAgbGV0IHRhcmdldENvbnRhaW5lciA9IHRoaXMudGFyZ2V0Q29udGFpbmVyXG4gICAgaWYodGhpcy5pc0NJRFBhdGNoKCkgJiYgIXRhcmdldENvbnRhaW5lcil7IHJldHVybiB9XG5cbiAgICBpZih0aGlzLmlzQ0lEUGF0Y2goKSl7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9wdWxsLzM5NDJcbiAgICAgIC8vIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgbm8gcGFyZW50IGlzIGxvY2tlZFxuICAgICAgY29uc3QgY2xvc2VzdExvY2sgPSB0YXJnZXRDb250YWluZXIuY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKVxuICAgICAgaWYoY2xvc2VzdExvY2spe1xuICAgICAgICBjb25zdCBjbG9uZWRUcmVlID0gRE9NLnByaXZhdGUoY2xvc2VzdExvY2ssIFBIWF9SRUZfTE9DSylcbiAgICAgICAgaWYoY2xvbmVkVHJlZSl7XG4gICAgICAgICAgLy8gaWYgYSBwYXJlbnQgaXMgbG9ja2VkIHdpdGggYSBjbG9uZWQgdHJlZSwgd2UgbmVlZCB0byBwYXRjaCB0aGUgY2xvbmVkIHRyZWUgaW5zdGVhZFxuICAgICAgICAgIHRhcmdldENvbnRhaW5lciA9IGNsb25lZFRyZWUucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGBbZGF0YS1waHgtY29tcG9uZW50PVwiJHt0aGlzLnRhcmdldENJRH1cIl1gLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBmb2N1c2VkID0gbGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBsZXQge3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmR9ID0gZm9jdXNlZCAmJiBET00uaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkgPyBmb2N1c2VkIDoge31cbiAgICBsZXQgcGh4VXBkYXRlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9VUERBVEUpXG4gICAgbGV0IHBoeFZpZXdwb3J0VG9wID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9WSUVXUE9SVF9UT1ApXG4gICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgbGV0IHBoeFRyaWdnZXJFeHRlcm5hbCA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfVFJJR0dFUl9BQ1RJT04pXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBsZXQgdXBkYXRlcyA9IFtdXG4gICAgbGV0IGFwcGVuZFByZXBlbmRVcGRhdGVzID0gW11cblxuICAgIGxldCBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBudWxsXG5cbiAgICBmdW5jdGlvbiBtb3JwaCh0YXJnZXRDb250YWluZXIsIHNvdXJjZSwgd2l0aENoaWxkcmVuPXRoaXMud2l0aENoaWxkcmVuKXtcbiAgICAgIGxldCBtb3JwaENhbGxiYWNrcyA9IHtcbiAgICAgICAgLy8gbm9ybWFsbHksIHdlIGFyZSBydW5uaW5nIHdpdGggY2hpbGRyZW5Pbmx5LCBhcyB0aGUgcGF0Y2ggSFRNTCBmb3IgYSBMVlxuICAgICAgICAvLyBkb2VzIG5vdCBpbmNsdWRlIHRoZSBMViBhdHRycyAoZGF0YS1waHgtc2Vzc2lvbiwgZXRjLilcbiAgICAgICAgLy8gd2hlbiB3ZSBhcmUgcGF0Y2hpbmcgYSBsaXZlIGNvbXBvbmVudCwgd2UgZG8gd2FudCB0byBwYXRjaCB0aGUgcm9vdCBlbGVtZW50IGFzIHdlbGw7XG4gICAgICAgIC8vIGFub3RoZXIgY2FzZSBpcyB0aGUgcmVjdXJzaXZlIHBhdGNoIG9mIGEgc3RyZWFtIGl0ZW0gdGhhdCB3YXMga2VwdCBvbiByZXNldCAoLT4gb25CZWZvcmVOb2RlQWRkZWQpXG4gICAgICAgIGNoaWxkcmVuT25seTogdGFyZ2V0Q29udGFpbmVyLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSA9PT0gbnVsbCAmJiAhd2l0aENoaWxkcmVuLFxuICAgICAgICBnZXROb2RlS2V5OiAobm9kZSkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc1BoeERlc3Ryb3llZChub2RlKSl7IHJldHVybiBudWxsIH1cbiAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgam9pbiBwYXRjaCwgdGhlbiBieSBkZWZpbml0aW9uIHRoZXJlIHdhcyBubyBQSFhfTUFHSUNfSUQuXG4gICAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gcmVkdWNlIHRoZSBhbW91bnQgb2YgZWxlbWVudHMgbW9ycGhkb20gZGlzY2FyZHMuXG4gICAgICAgICAgaWYoaXNKb2luUGF0Y2gpeyByZXR1cm4gbm9kZS5pZCB9XG4gICAgICAgICAgcmV0dXJuIG5vZGUuaWQgfHwgKG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9NQUdJQ19JRCkpXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNraXAgaW5kZXhpbmcgZnJvbSBjaGlsZHJlbiB3aGVuIGNvbnRhaW5lciBpcyBzdHJlYW1cbiAgICAgICAgc2tpcEZyb21DaGlsZHJlbjogKGZyb20pID0+IHsgcmV0dXJuIGZyb20uZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkgPT09IFBIWF9TVFJFQU0gfSxcbiAgICAgICAgLy8gdGVsbCBtb3JwaGRvbSBob3cgdG8gYWRkIGEgY2hpbGRcbiAgICAgICAgYWRkQ2hpbGQ6IChwYXJlbnQsIGNoaWxkKSA9PiB7XG4gICAgICAgICAgbGV0IHtyZWYsIHN0cmVhbUF0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGNoaWxkKVxuICAgICAgICAgIGlmKHJlZiA9PT0gdW5kZWZpbmVkKXsgcmV0dXJuIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCkgfVxuXG4gICAgICAgICAgdGhpcy5zZXRTdHJlYW1SZWYoY2hpbGQsIHJlZilcblxuICAgICAgICAgIC8vIHN0cmVhbWluZ1xuICAgICAgICAgIGlmKHN0cmVhbUF0ID09PSAwKXtcbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGNoaWxkKVxuICAgICAgICAgIH0gZWxzZSBpZihzdHJlYW1BdCA9PT0gLTEpe1xuICAgICAgICAgICAgbGV0IGxhc3RDaGlsZCA9IHBhcmVudC5sYXN0RWxlbWVudENoaWxkXG4gICAgICAgICAgICBpZihsYXN0Q2hpbGQgJiYgIWxhc3RDaGlsZC5oYXNBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYpKXtcbiAgICAgICAgICAgICAgbGV0IG5vblN0cmVhbUNoaWxkID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmQoYyA9PiAhYy5oYXNBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYpKVxuICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBub25TdHJlYW1DaGlsZClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYoc3RyZWFtQXQgPiAwKXtcbiAgICAgICAgICAgIGxldCBzaWJsaW5nID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pW3N0cmVhbUF0XVxuICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgc2libGluZylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlTm9kZUFkZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBET00ubWFpbnRhaW5Qcml2YXRlSG9va3MoZWwsIGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGVsKVxuXG4gICAgICAgICAgbGV0IG1vcnBoZWRFbCA9IGVsXG4gICAgICAgICAgLy8gdGhpcyBpcyBhIHN0cmVhbSBpdGVtIHRoYXQgd2FzIGtlcHQgb24gcmVzZXQsIHJlY3Vyc2l2ZWx5IG1vcnBoIGl0XG4gICAgICAgICAgaWYodGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2VsLmlkXSl7XG4gICAgICAgICAgICBtb3JwaGVkRWwgPSB0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmVbZWwuaWRdXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2VsLmlkXVxuICAgICAgICAgICAgbW9ycGguY2FsbCh0aGlzLCBtb3JwaGVkRWwsIGVsLCB0cnVlKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkRWxcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGVsLCB0cnVlKSB9XG5cbiAgICAgICAgICAvLyBoYWNrIHRvIGZpeCBTYWZhcmkgaGFuZGxpbmcgb2YgaW1nIHNyY3NldCBhbmQgdmlkZW8gdGFnc1xuICAgICAgICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCAmJiBlbC5zcmNzZXQpe1xuICAgICAgICAgICAgZWwuc3Jjc2V0ID0gZWwuc3Jjc2V0XG4gICAgICAgICAgfSBlbHNlIGlmKGVsIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCAmJiBlbC5hdXRvcGxheSl7XG4gICAgICAgICAgICBlbC5wbGF5KClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKSl7XG4gICAgICAgICAgICBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBlbFxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoKERPTS5pc1BoeENoaWxkKGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsKSkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsLnBhcmVudE5vZGUpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcInBoeENoaWxkQWRkZWRcIiwgZWwpXG4gICAgICAgICAgfVxuICAgICAgICAgIGFkZGVkLnB1c2goZWwpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZURpc2NhcmRlZDogKGVsKSA9PiB0aGlzLm9uTm9kZURpc2NhcmRlZChlbCksXG4gICAgICAgIG9uQmVmb3JlTm9kZURpc2NhcmRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfUFJVTkUpICE9PSBudWxsKXsgcmV0dXJuIHRydWUgfVxuICAgICAgICAgIGlmKGVsLnBhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgZWwuaWQgJiZcbiAgICAgICAgICAgIERPTS5pc1BoeFVwZGF0ZShlbC5wYXJlbnRFbGVtZW50LCBwaHhVcGRhdGUsIFtQSFhfU1RSRUFNLCBcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZih0aGlzLm1heWJlUGVuZGluZ1JlbW92ZShlbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcoZWwpKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uRWxVcGRhdGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwZGF0ZXMucHVzaChlbClcbiAgICAgICAgICB0aGlzLm1heWJlUmVPcmRlclN0cmVhbShlbCwgZmFsc2UpXG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlRWxVcGRhdGVkOiAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICAgICAgLy8gaWYgd2UgYXJlIHBhdGNoaW5nIHRoZSByb290IHRhcmdldCBjb250YWluZXIgYW5kIHRoZSBpZCBoYXMgY2hhbmdlZCwgdHJlYXQgaXQgYXMgYSBuZXcgbm9kZVxuICAgICAgICAgIC8vIGJ5IHJlcGxhY2luZyB0aGUgZnJvbUVsIHdpdGggdGhlIHRvRWwsIHdoaWNoIGVuc3VyZXMgaG9va3MgYXJlIHRvcm4gZG93biBhbmQgcmUtY3JlYXRlZFxuICAgICAgICAgIGlmKGZyb21FbC5pZCAmJiBmcm9tRWwuaXNTYW1lTm9kZSh0YXJnZXRDb250YWluZXIpICYmIGZyb21FbC5pZCAhPT0gdG9FbC5pZCl7XG4gICAgICAgICAgICBtb3JwaENhbGxiYWNrcy5vbk5vZGVEaXNjYXJkZWQoZnJvbUVsKVxuICAgICAgICAgICAgZnJvbUVsLnJlcGxhY2VXaXRoKHRvRWwpXG4gICAgICAgICAgICByZXR1cm4gbW9ycGhDYWxsYmFja3Mub25Ob2RlQWRkZWQodG9FbClcbiAgICAgICAgICB9XG4gICAgICAgICAgRE9NLnN5bmNQZW5kaW5nQXR0cnMoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgIERPTS5tYWludGFpblByaXZhdGVIb29rcyhmcm9tRWwsIHRvRWwsIHBoeFZpZXdwb3J0VG9wLCBwaHhWaWV3cG9ydEJvdHRvbSlcbiAgICAgICAgICBET00uY2xlYW5DaGlsZE5vZGVzKHRvRWwsIHBoeFVwZGF0ZSlcbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKHRvRWwpKXtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSBsaXZlIGNvbXBvbmVudCB1c2VkIGluIGEgc3RyZWFtLCB3ZSBtYXkgbmVlZCB0byByZW9yZGVyIGl0XG4gICAgICAgICAgICB0aGlzLm1heWJlUmVPcmRlclN0cmVhbShmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzUGh4U3RpY2t5KGZyb21FbCkpe1xuICAgICAgICAgICAgW1BIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfUk9PVF9JRF1cbiAgICAgICAgICAgICAgLm1hcChhdHRyID0+IFthdHRyLCBmcm9tRWwuZ2V0QXR0cmlidXRlKGF0dHIpLCB0b0VsLmdldEF0dHJpYnV0ZShhdHRyKV0pXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChbYXR0ciwgZnJvbVZhbCwgdG9WYWxdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodG9WYWwgJiYgZnJvbVZhbCAhPT0gdG9WYWwpeyBmcm9tRWwuc2V0QXR0cmlidXRlKGF0dHIsIHRvVmFsKSB9XG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNJZ25vcmVkKGZyb21FbCwgcGh4VXBkYXRlKSB8fCAoZnJvbUVsLmZvcm0gJiYgZnJvbUVsLmZvcm0uaXNTYW1lTm9kZShleHRlcm5hbEZvcm1UcmlnZ2VyZWQpKSl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IERPTS5pc0lnbm9yZWQoZnJvbUVsLCBwaHhVcGRhdGUpfSlcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihmcm9tRWwudHlwZSA9PT0gXCJudW1iZXJcIiAmJiAoZnJvbUVsLnZhbGlkaXR5ICYmIGZyb21FbC52YWxpZGl0eS5iYWRJbnB1dCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGhhcyBQSFhfUkVGX1NSQywgaXQgaXMgbG9hZGluZyBvciBsb2NrZWQgYW5kIGF3YWl0aW5nIGFuIGFjay5cbiAgICAgICAgICAvLyBJZiBpdCdzIGxvY2tlZCwgd2UgY2xvbmUgdGhlIGZyb21FbCB0cmVlIGFuZCBpbnN0cnVjdCBtb3JwaGRvbSB0byB1c2VcbiAgICAgICAgICAvLyB0aGUgY2xvbmVkIHRyZWUgYXMgdGhlIHNvdXJjZSBvZiB0aGUgbW9ycGggZm9yIHRoaXMgYnJhbmNoIGZyb20gaGVyZSBvbiBvdXQuXG4gICAgICAgICAgLy8gV2Uga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgY2xvbmVkIHRyZWUgaW4gdGhlIGVsZW1lbnQncyBwcml2YXRlIGRhdGEsIGFuZFxuICAgICAgICAgIC8vIG9uIGFjayAodmlldy51bmRvUmVmcyksIHdlIG1vcnBoIHRoZSBjbG9uZWQgdHJlZSB3aXRoIHRoZSB0cnVlIGZyb21FbCBpbiB0aGUgRE9NIHRvXG4gICAgICAgICAgLy8gYXBwbHkgYW55IGNoYW5nZXMgdGhhdCBoYXBwZW5lZCB3aGlsZSB0aGUgZWxlbWVudCB3YXMgbG9ja2VkLlxuICAgICAgICAgIGxldCBpc0ZvY3VzZWRGb3JtRWwgPSBmb2N1c2VkICYmIGZyb21FbC5pc1NhbWVOb2RlKGZvY3VzZWQpICYmIERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpXG4gICAgICAgICAgbGV0IGZvY3VzZWRTZWxlY3RDaGFuZ2VkID0gaXNGb2N1c2VkRm9ybUVsICYmIHRoaXMuaXNDaGFuZ2VkU2VsZWN0KGZyb21FbCwgdG9FbClcbiAgICAgICAgICBpZihmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfU1JDKSl7XG4gICAgICAgICAgICBjb25zdCByZWYgPSBuZXcgRWxlbWVudFJlZihmcm9tRWwpXG4gICAgICAgICAgICAvLyBvbmx5IHBlcmZvcm0gdGhlIGNsb25lIHN0ZXAgaWYgdGhpcyBpcyBub3QgYSBwYXRjaCB0aGF0IHVubG9ja3NcbiAgICAgICAgICAgIGlmKHJlZi5sb2NrUmVmICYmICghdGhpcy51bmRvUmVmIHx8ICFyZWYuaXNMb2NrVW5kb25lQnkodGhpcy51bmRvUmVmKSkpe1xuICAgICAgICAgICAgICBpZihET00uaXNVcGxvYWRJbnB1dChmcm9tRWwpKXtcbiAgICAgICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IHRydWV9KVxuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgICBsZXQgaXNMb2NrZWQgPSBmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcbiAgICAgICAgICAgICAgbGV0IGNsb25lID0gaXNMb2NrZWQgPyBET00ucHJpdmF0ZShmcm9tRWwsIFBIWF9SRUZfTE9DSykgfHwgZnJvbUVsLmNsb25lTm9kZSh0cnVlKSA6IG51bGxcbiAgICAgICAgICAgICAgaWYoY2xvbmUpe1xuICAgICAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGZyb21FbCwgUEhYX1JFRl9MT0NLLCBjbG9uZSlcbiAgICAgICAgICAgICAgICBpZighaXNGb2N1c2VkRm9ybUVsKXtcbiAgICAgICAgICAgICAgICAgIGZyb21FbCA9IGNsb25lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZCh0b0VsKSl7XG4gICAgICAgICAgICBsZXQgcHJldlNlc3Npb24gPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKVxuICAgICAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7ZXhjbHVkZTogW1BIWF9TVEFUSUNdfSlcbiAgICAgICAgICAgIGlmKHByZXZTZXNzaW9uICE9PSBcIlwiKXsgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgcHJldlNlc3Npb24pIH1cbiAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdElEKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpZiB3ZSBhcmUgdW5kb2luZyBhIGxvY2ssIGNvcHkgcG90ZW50aWFsbHkgbmVzdGVkIGNsb25lcyBvdmVyXG4gICAgICAgICAgaWYodGhpcy51bmRvUmVmICYmIERPTS5wcml2YXRlKHRvRWwsIFBIWF9SRUZfTE9DSykpe1xuICAgICAgICAgICAgRE9NLnB1dFByaXZhdGUoZnJvbUVsLCBQSFhfUkVGX0xPQ0ssIERPTS5wcml2YXRlKHRvRWwsIFBIWF9SRUZfTE9DSykpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyBjb3B5IHJlZ3VsYXIgRE9NLnByaXZhdGUgZGF0YVxuICAgICAgICAgIERPTS5jb3B5UHJpdmF0ZXModG9FbCwgZnJvbUVsKVxuXG4gICAgICAgICAgLy8gc2tpcCBwYXRjaGluZyBmb2N1c2VkIGlucHV0cyB1bmxlc3MgZm9jdXMgaXMgYSBzZWxlY3QgdGhhdCBoYXMgY2hhbmdlZCBvcHRpb25zXG4gICAgICAgICAgaWYoaXNGb2N1c2VkRm9ybUVsICYmIGZyb21FbC50eXBlICE9PSBcImhpZGRlblwiICYmICFmb2N1c2VkU2VsZWN0Q2hhbmdlZCl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VGb2N1c2VkSW5wdXQoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLnN5bmNBdHRyc1RvUHJvcHMoZnJvbUVsKVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJsdXIgZm9jdXNlZCBzZWxlY3QgaWYgaXQgY2hhbmdlZCBzbyBuYXRpdmUgVUkgaXMgdXBkYXRlZCAoaWUgc2FmYXJpIHdvbid0IHVwZGF0ZSB2aXNpYmxlIG9wdGlvbnMpXG4gICAgICAgICAgICBpZihmb2N1c2VkU2VsZWN0Q2hhbmdlZCl7IGZyb21FbC5ibHVyKCkgfVxuICAgICAgICAgICAgaWYoRE9NLmlzUGh4VXBkYXRlKHRvRWwsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgICAgICAgICBhcHBlbmRQcmVwZW5kVXBkYXRlcy5wdXNoKG5ldyBET01Qb3N0TW9ycGhSZXN0b3Jlcihmcm9tRWwsIHRvRWwsIHRvRWwuZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyh0b0VsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyh0b0VsKVxuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgcmV0dXJuIGZyb21FbFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbW9ycGhkb20odGFyZ2V0Q29udGFpbmVyLCBzb3VyY2UsIG1vcnBoQ2FsbGJhY2tzKVxuICAgIH1cblxuICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBjb250YWluZXIpXG4gICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgY29udGFpbmVyLCBjb250YWluZXIpXG5cbiAgICBsaXZlU29ja2V0LnRpbWUoXCJtb3JwaGRvbVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0cmVhbXMuZm9yRWFjaCgoW3JlZiwgaW5zZXJ0cywgZGVsZXRlSWRzLCByZXNldF0pID0+IHtcbiAgICAgICAgaW5zZXJ0cy5mb3JFYWNoKChba2V5LCBzdHJlYW1BdCwgbGltaXRdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdHJlYW1JbnNlcnRzW2tleV0gPSB7cmVmLCBzdHJlYW1BdCwgbGltaXQsIHJlc2V0fVxuICAgICAgICB9KVxuICAgICAgICBpZihyZXNldCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICBET00uYWxsKGNvbnRhaW5lciwgYFske1BIWF9TVFJFQU1fUkVGfT1cIiR7cmVmfVwiXWAsIGNoaWxkID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlSWRzLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2lkfVwiXWApXG4gICAgICAgICAgaWYoY2hpbGQpeyB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkgfVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8gY2xlYXIgc3RyZWFtIGl0ZW1zIGZyb20gdGhlIGRlYWQgcmVuZGVyIGlmIHRoZXkgYXJlIG5vdCBpbnNlcnRlZCBhZ2FpblxuICAgICAgaWYoaXNKb2luUGF0Y2gpe1xuICAgICAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT0ke1BIWF9TVFJFQU19XWApXG4gICAgICAgICAgLy8gaXQgaXMgaW1wb3J0YW50IHRvIGZpbHRlciB0aGUgZWxlbWVudCBiZWZvcmUgcmVtb3ZpbmcgdGhlbSwgYXNcbiAgICAgICAgICAvLyBpdCBtYXkgaGFwcGVuIHRoYXQgc3RyZWFtcyBhcmUgbmVzdGVkIGFuZCB0aGUgb3duZXIgY2hlY2sgZmFpbHMgaWZcbiAgICAgICAgICAvLyBhIHBhcmVudCBpcyByZW1vdmVkIGJlZm9yZSBhIGNoaWxkXG4gICAgICAgICAgLmZpbHRlcihlbCA9PiB0aGlzLnZpZXcub3duc0VsZW1lbnQoZWwpKVxuICAgICAgICAgIC5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oZWwuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAvLyB3ZSBhbHJlYWR5IHBlcmZvcm1lZCB0aGUgb3duZXIgY2hlY2ssIGVhY2ggY2hpbGQgaXMgZ3VhcmFudGVlZCB0byBiZSBvd25lZFxuICAgICAgICAgICAgICAvLyBieSB0aGUgdmlldy4gVG8gcHJldmVudCB0aGUgbmVzdGVkIG93bmVyIGNoZWNrIGZyb20gZmFpbGluZyBpbiBjYXNlIG9mIG5lc3RlZFxuICAgICAgICAgICAgICAvLyBzdHJlYW1zIHdoZXJlIHRoZSBwYXJlbnQgaXMgcmVtb3ZlZCBiZWZvcmUgdGhlIGNoaWxkLCB3ZSBmb3JjZSB0aGUgcmVtb3ZhbFxuICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCwgdHJ1ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgbW9ycGguY2FsbCh0aGlzLCB0YXJnZXRDb250YWluZXIsIGh0bWwpXG4gICAgfSlcblxuICAgIGlmKGxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgICBkZXRlY3REdXBsaWNhdGVJZHMoKVxuICAgICAgZGV0ZWN0SW52YWxpZFN0cmVhbUluc2VydHModGhpcy5zdHJlYW1JbnNlcnRzKVxuICAgICAgLy8gd2FybiBpZiB0aGVyZSBhcmUgYW55IGlucHV0cyBuYW1lZCBcImlkXCJcbiAgICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWU9aWRdXCIpKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBpZihub2RlLmZvcm0pe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJEZXRlY3RlZCBhbiBpbnB1dCB3aXRoIG5hbWU9XFxcImlkXFxcIiBpbnNpZGUgYSBmb3JtISBUaGlzIHdpbGwgY2F1c2UgcHJvYmxlbXMgd2hlbiBwYXRjaGluZyB0aGUgRE9NLlxcblwiLCBub2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGFwcGVuZFByZXBlbmRVcGRhdGVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50aW1lKFwicG9zdC1tb3JwaCBhcHBlbmQvcHJlcGVuZCByZXN0b3JhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLmZvckVhY2godXBkYXRlID0+IHVwZGF0ZS5wZXJmb3JtKCkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxpdmVTb2NrZXQuc2lsZW5jZUV2ZW50cygoKSA9PiBET00ucmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpKVxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGRvY3VtZW50LCBcInBoeDp1cGRhdGVcIilcbiAgICBhZGRlZC5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcImFkZGVkXCIsIGVsKSlcbiAgICB1cGRhdGVzLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwidXBkYXRlZFwiLCBlbCkpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25QZW5kaW5nUmVtb3ZlcygpXG5cbiAgICBpZihleHRlcm5hbEZvcm1UcmlnZ2VyZWQpe1xuICAgICAgbGl2ZVNvY2tldC51bmxvYWQoKVxuICAgICAgLy8gY2hlY2sgZm9yIHN1Ym1pdHRlciBhbmQgaW5qZWN0IGl0IGFzIGhpZGRlbiBpbnB1dCBmb3IgZXh0ZXJuYWwgc3VibWl0O1xuICAgICAgLy8gSW4gdGhlb3J5LCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB0aGUgc3RvcmVkIHN1Ym1pdHRlciBpcyBvdXRkYXRlZCBhbmQgZG9lc24ndFxuICAgICAgLy8gZXhpc3QgaW4gdGhlIERPTSBhbnkgbW9yZSwgYnV0IHRoaXMgaXMgdW5saWtlbHksIHNvIHdlIGp1c3QgYWNjZXB0IGl0IGZvciBub3cuXG4gICAgICBjb25zdCBzdWJtaXR0ZXIgPSBET00ucHJpdmF0ZShleHRlcm5hbEZvcm1UcmlnZ2VyZWQsIFwic3VibWl0dGVyXCIpXG4gICAgICBpZihzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUgJiYgdGFyZ2V0Q29udGFpbmVyLmNvbnRhaW5zKHN1Ym1pdHRlcikpe1xuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgICAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIlxuICAgICAgICBjb25zdCBmb3JtSWQgPSBzdWJtaXR0ZXIuZ2V0QXR0cmlidXRlKFwiZm9ybVwiKVxuICAgICAgICBpZihmb3JtSWQpe1xuICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImZvcm1cIiwgZm9ybUlkKVxuICAgICAgICB9XG4gICAgICAgIGlucHV0Lm5hbWUgPSBzdWJtaXR0ZXIubmFtZVxuICAgICAgICBpbnB1dC52YWx1ZSA9IHN1Ym1pdHRlci52YWx1ZVxuICAgICAgICBzdWJtaXR0ZXIucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQsIHN1Ym1pdHRlcilcbiAgICAgIH1cbiAgICAgIC8vIHVzZSBwcm90b3R5cGUncyBzdWJtaXQgaW4gY2FzZSB0aGVyZSdzIGEgZm9ybSBjb250cm9sIHdpdGggbmFtZSBvciBpZCBvZiBcInN1Ym1pdFwiXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEZvcm1FbGVtZW50L3N1Ym1pdFxuICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVybmFsRm9ybVRyaWdnZXJlZCkuc3VibWl0LmNhbGwoZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkKVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgb25Ob2RlRGlzY2FyZGVkKGVsKXtcbiAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgIGlmKERPTS5pc1BoeENoaWxkKGVsKSB8fCBET00uaXNQaHhTdGlja3koZWwpKXsgdGhpcy5saXZlU29ja2V0LmRlc3Ryb3lWaWV3QnlFbChlbCkgfVxuICAgIHRoaXMudHJhY2tBZnRlcihcImRpc2NhcmRlZFwiLCBlbClcbiAgfVxuXG4gIG1heWJlUGVuZGluZ1JlbW92ZShub2RlKXtcbiAgICBpZihub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSh0aGlzLnBoeFJlbW92ZSkgIT09IG51bGwpe1xuICAgICAgdGhpcy5wZW5kaW5nUmVtb3Zlcy5wdXNoKG5vZGUpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICByZW1vdmVTdHJlYW1DaGlsZEVsZW1lbnQoY2hpbGQsIGZvcmNlPWZhbHNlKXtcbiAgICAvLyBtYWtlIHN1cmUgdG8gb25seSByZW1vdmUgZWxlbWVudHMgb3duZWQgYnkgdGhlIGN1cnJlbnQgdmlld1xuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzA0N1xuICAgIC8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzY4MVxuICAgIGlmKCFmb3JjZSAmJiAhdGhpcy52aWV3Lm93bnNFbGVtZW50KGNoaWxkKSl7IHJldHVybiB9XG5cbiAgICAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBub2RlIGlmIGl0IGlzIGFjdHVhbGx5IHJlLWFkZGVkIGluIHRoZSBzYW1lIHBhdGNoXG4gICAgLy8gd2UgZG8gTk9UIHdhbnQgdG8gZXhlY3V0ZSBwaHgtcmVtb3ZlLCB3ZSBkbyBOT1Qgd2FudCB0byBjYWxsIG9uTm9kZURpc2NhcmRlZFxuICAgIGlmKHRoaXMuc3RyZWFtSW5zZXJ0c1tjaGlsZC5pZF0pe1xuICAgICAgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2NoaWxkLmlkXSA9IGNoaWxkXG4gICAgICBjaGlsZC5yZW1vdmUoKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmx5IHJlbW92ZSB0aGUgZWxlbWVudCBub3cgaWYgaXQgaGFzIG5vIHBoeC1yZW1vdmUgYmluZGluZ1xuICAgICAgaWYoIXRoaXMubWF5YmVQZW5kaW5nUmVtb3ZlKGNoaWxkKSl7XG4gICAgICAgIGNoaWxkLnJlbW92ZSgpXG4gICAgICAgIHRoaXMub25Ob2RlRGlzY2FyZGVkKGNoaWxkKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFN0cmVhbUluc2VydChlbCl7XG4gICAgbGV0IGluc2VydCA9IGVsLmlkID8gdGhpcy5zdHJlYW1JbnNlcnRzW2VsLmlkXSA6IHt9XG4gICAgcmV0dXJuIGluc2VydCB8fCB7fVxuICB9XG5cbiAgc2V0U3RyZWFtUmVmKGVsLCByZWYpe1xuICAgIERPTS5wdXRTdGlja3koZWwsIFBIWF9TVFJFQU1fUkVGLCBlbCA9PiBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYsIHJlZikpXG4gIH1cblxuICBtYXliZVJlT3JkZXJTdHJlYW0oZWwsIGlzTmV3KXtcbiAgICBsZXQge3JlZiwgc3RyZWFtQXQsIHJlc2V0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGVsKVxuICAgIGlmKHN0cmVhbUF0ID09PSB1bmRlZmluZWQpeyByZXR1cm4gfVxuXG4gICAgLy8gd2UgbmVlZCB0byBzZXQgdGhlIFBIWF9TVFJFQU1fUkVGIGhlcmUgYXMgd2VsbCBhcyBhZGRDaGlsZCBpcyBpbnZva2VkIG9ubHkgZm9yIHBhcmVudHNcbiAgICB0aGlzLnNldFN0cmVhbVJlZihlbCwgcmVmKVxuXG4gICAgaWYoIXJlc2V0ICYmICFpc05ldyl7XG4gICAgICAvLyB3ZSBvbmx5IHJlb3JkZXIgaWYgdGhlIGVsZW1lbnQgaXMgbmV3IG9yIGl0J3MgYSBzdHJlYW0gcmVzZXRcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGhhcyBhIHBhcmVudCBlbGVtZW50O1xuICAgIC8vIGl0IGRvZXNuJ3QgaWYgd2UgYXJlIGN1cnJlbnRseSByZWN1cnNpdmVseSBtb3JwaGluZyAocmVzdG9yaW5nIGEgc2F2ZWQgc3RyZWFtIGNoaWxkKVxuICAgIC8vIGJlY2F1c2UgdGhlIGVsZW1lbnQgaXMgbm90IHlldCBhZGRlZCB0byB0aGUgcmVhbCBkb207XG4gICAgLy8gcmVvcmRlcmluZyBkb2VzIG5vdCBtYWtlIHNlbnNlIGluIHRoYXQgY2FzZSBhbnl3YXlcbiAgICBpZighZWwucGFyZW50RWxlbWVudCl7IHJldHVybiB9XG5cbiAgICBpZihzdHJlYW1BdCA9PT0gMCl7XG4gICAgICBlbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbCwgZWwucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZClcbiAgICB9IGVsc2UgaWYoc3RyZWFtQXQgPiAwKXtcbiAgICAgIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWwucGFyZW50RWxlbWVudC5jaGlsZHJlbilcbiAgICAgIGxldCBvbGRJbmRleCA9IGNoaWxkcmVuLmluZGV4T2YoZWwpXG4gICAgICBpZihzdHJlYW1BdCA+PSBjaGlsZHJlbi5sZW5ndGggLSAxKXtcbiAgICAgICAgZWwucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzaWJsaW5nID0gY2hpbGRyZW5bc3RyZWFtQXRdXG4gICAgICAgIGlmKG9sZEluZGV4ID4gc3RyZWFtQXQpe1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nLm5leHRFbGVtZW50U2libGluZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWF5YmVMaW1pdFN0cmVhbShlbClcbiAgfVxuXG4gIG1heWJlTGltaXRTdHJlYW0oZWwpe1xuICAgIGxldCB7bGltaXR9ID0gdGhpcy5nZXRTdHJlYW1JbnNlcnQoZWwpXG4gICAgbGV0IGNoaWxkcmVuID0gbGltaXQgIT09IG51bGwgJiYgQXJyYXkuZnJvbShlbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKVxuICAgIGlmKGxpbWl0ICYmIGxpbWl0IDwgMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCAqIC0xKXtcbiAgICAgIGNoaWxkcmVuLnNsaWNlKDAsIGNoaWxkcmVuLmxlbmd0aCArIGxpbWl0KS5mb3JFYWNoKGNoaWxkID0+IHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKSlcbiAgICB9IGVsc2UgaWYobGltaXQgJiYgbGltaXQgPj0gMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCl7XG4gICAgICBjaGlsZHJlbi5zbGljZShsaW1pdCkuZm9yRWFjaChjaGlsZCA9PiB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkpXG4gICAgfVxuICB9XG5cbiAgdHJhbnNpdGlvblBlbmRpbmdSZW1vdmVzKCl7XG4gICAgbGV0IHtwZW5kaW5nUmVtb3ZlcywgbGl2ZVNvY2tldH0gPSB0aGlzXG4gICAgaWYocGVuZGluZ1JlbW92ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRyYW5zaXRpb25SZW1vdmVzKHBlbmRpbmdSZW1vdmVzLCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdSZW1vdmVzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IERPTS5maXJzdFBoeENoaWxkKGVsKVxuICAgICAgICAgIGlmKGNoaWxkKXsgbGl2ZVNvY2tldC5kZXN0cm95Vmlld0J5RWwoY2hpbGQpIH1cbiAgICAgICAgICBlbC5yZW1vdmUoKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBwZW5kaW5nUmVtb3ZlcylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaXNDaGFuZ2VkU2VsZWN0KGZyb21FbCwgdG9FbCl7XG4gICAgaWYoIShmcm9tRWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkgfHwgZnJvbUVsLm11bHRpcGxlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBpZihmcm9tRWwub3B0aW9ucy5sZW5ndGggIT09IHRvRWwub3B0aW9ucy5sZW5ndGgpeyByZXR1cm4gdHJ1ZSB9XG5cbiAgICAvLyBrZWVwIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgdG9FbC52YWx1ZSA9IGZyb21FbC52YWx1ZVxuXG4gICAgLy8gaW4gZ2VuZXJhbCB3ZSBoYXZlIHRvIGJlIHZlcnkgY2FyZWZ1bCB3aXRoIHVzaW5nIGlzRXF1YWxOb2RlIGFzIGl0IGRvZXMgbm90IGEgcmVsaWFibGVcbiAgICAvLyBET00gdHJlZSBlcXVhbGl0eSBjaGVjaywgYnV0IGZvciBzZWxlY3Rpb24gYXR0cmlidXRlcyBhbmQgb3B0aW9ucyBpdCB3b3JrcyBmaW5lXG4gICAgcmV0dXJuICFmcm9tRWwuaXNFcXVhbE5vZGUodG9FbClcbiAgfVxuXG4gIGlzQ0lEUGF0Y2goKXsgcmV0dXJuIHRoaXMuY2lkUGF0Y2ggfVxuXG4gIHNraXBDSURTaWJsaW5nKGVsKXtcbiAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGVsLmhhc0F0dHJpYnV0ZShQSFhfU0tJUClcbiAgfVxuXG4gIHRhcmdldENJRENvbnRhaW5lcihodG1sKXtcbiAgICBpZighdGhpcy5pc0NJRFBhdGNoKCkpeyByZXR1cm4gfVxuICAgIGxldCBbZmlyc3QsIC4uLnJlc3RdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpXG4gICAgaWYocmVzdC5sZW5ndGggPT09IDAgJiYgRE9NLmNoaWxkTm9kZUxlbmd0aChodG1sKSA9PT0gMSl7XG4gICAgICByZXR1cm4gZmlyc3RcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpcnN0ICYmIGZpcnN0LnBhcmVudE5vZGVcbiAgICB9XG4gIH1cblxuICBpbmRleE9mKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmluZGV4T2YoY2hpbGQpIH1cbn1cbiIsICJpbXBvcnQge1xuICBDT01QT05FTlRTLFxuICBEWU5BTUlDUyxcbiAgVEVNUExBVEVTLFxuICBFVkVOVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9TS0lQLFxuICBQSFhfTUFHSUNfSUQsXG4gIFJFUExZLFxuICBTVEFUSUMsXG4gIFRJVExFLFxuICBTVFJFQU0sXG4gIFJPT1QsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGlzT2JqZWN0LFxuICBsb2dFcnJvcixcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuY29uc3QgVk9JRF9UQUdTID0gbmV3IFNldChbXG4gIFwiYXJlYVwiLFxuICBcImJhc2VcIixcbiAgXCJiclwiLFxuICBcImNvbFwiLFxuICBcImNvbW1hbmRcIixcbiAgXCJlbWJlZFwiLFxuICBcImhyXCIsXG4gIFwiaW1nXCIsXG4gIFwiaW5wdXRcIixcbiAgXCJrZXlnZW5cIixcbiAgXCJsaW5rXCIsXG4gIFwibWV0YVwiLFxuICBcInBhcmFtXCIsXG4gIFwic291cmNlXCIsXG4gIFwidHJhY2tcIixcbiAgXCJ3YnJcIlxuXSlcbmNvbnN0IHF1b3RlQ2hhcnMgPSBuZXcgU2V0KFtcIidcIiwgXCJcXFwiXCJdKVxuXG5leHBvcnQgbGV0IG1vZGlmeVJvb3QgPSAoaHRtbCwgYXR0cnMsIGNsZWFySW5uZXJIVE1MKSA9PiB7XG4gIGxldCBpID0gMFxuICBsZXQgaW5zaWRlQ29tbWVudCA9IGZhbHNlXG4gIGxldCBiZWZvcmVUYWcsIGFmdGVyVGFnLCB0YWcsIHRhZ05hbWVFbmRzQXQsIGlkLCBuZXdIVE1MXG5cbiAgbGV0IGxvb2thaGVhZCA9IGh0bWwubWF0Y2goL14oXFxzKig/OjwhLS0uKj8tLT5cXHMqKSopPChbXlxcc1xcLz5dKykvKVxuICBpZihsb29rYWhlYWQgPT09IG51bGwpeyB0aHJvdyBuZXcgRXJyb3IoYG1hbGZvcm1lZCBodG1sICR7aHRtbH1gKSB9XG5cbiAgaSA9IGxvb2thaGVhZFswXS5sZW5ndGhcbiAgYmVmb3JlVGFnID0gbG9va2FoZWFkWzFdXG4gIHRhZyA9IGxvb2thaGVhZFsyXVxuICB0YWdOYW1lRW5kc0F0ID0gaVxuXG4gIC8vIFNjYW4gdGhlIG9wZW5pbmcgdGFnIGZvciBpZCwgaWYgdGhlcmUgaXMgYW55XG4gIGZvcihpOyBpIDwgaHRtbC5sZW5ndGg7IGkrKyl7XG4gICAgaWYoaHRtbC5jaGFyQXQoaSkgPT09IFwiPlwiICl7IGJyZWFrIH1cbiAgICBpZihodG1sLmNoYXJBdChpKSA9PT0gXCI9XCIpe1xuICAgICAgbGV0IGlzSWQgPSBodG1sLnNsaWNlKGkgLSAzLCBpKSA9PT0gXCIgaWRcIlxuICAgICAgaSsrXG4gICAgICBsZXQgY2hhciA9IGh0bWwuY2hhckF0KGkpXG4gICAgICBpZihxdW90ZUNoYXJzLmhhcyhjaGFyKSl7XG4gICAgICAgIGxldCBhdHRyU3RhcnRzQXQgPSBpXG4gICAgICAgIGkrK1xuICAgICAgICBmb3IoaTsgaSA8IGh0bWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGlmKGh0bWwuY2hhckF0KGkpID09PSBjaGFyKXsgYnJlYWsgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGlzSWQpe1xuICAgICAgICAgIGlkID0gaHRtbC5zbGljZShhdHRyU3RhcnRzQXQgKyAxLCBpKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgY2xvc2VBdCA9IGh0bWwubGVuZ3RoIC0gMVxuICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgd2hpbGUoY2xvc2VBdCA+PSBiZWZvcmVUYWcubGVuZ3RoICsgdGFnLmxlbmd0aCl7XG4gICAgbGV0IGNoYXIgPSBodG1sLmNoYXJBdChjbG9zZUF0KVxuICAgIGlmKGluc2lkZUNvbW1lbnQpe1xuICAgICAgaWYoY2hhciA9PT0gXCItXCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMywgY2xvc2VBdCkgPT09IFwiPCEtXCIpe1xuICAgICAgICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgICAgICAgY2xvc2VBdCAtPSA0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZUF0IC09IDFcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoY2hhciA9PT0gXCI+XCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMiwgY2xvc2VBdCkgPT09IFwiLS1cIil7XG4gICAgICBpbnNpZGVDb21tZW50ID0gdHJ1ZVxuICAgICAgY2xvc2VBdCAtPSAzXG4gICAgfSBlbHNlIGlmKGNoYXIgPT09IFwiPlwiKXtcbiAgICAgIGJyZWFrXG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3NlQXQgLT0gMVxuICAgIH1cbiAgfVxuICBhZnRlclRhZyA9IGh0bWwuc2xpY2UoY2xvc2VBdCArIDEsIGh0bWwubGVuZ3RoKVxuXG4gIGxldCBhdHRyc1N0ciA9XG4gICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAubWFwKGF0dHIgPT4gYXR0cnNbYXR0cl0gPT09IHRydWUgPyBhdHRyIDogYCR7YXR0cn09XCIke2F0dHJzW2F0dHJdfVwiYClcbiAgICAgIC5qb2luKFwiIFwiKVxuXG4gIGlmKGNsZWFySW5uZXJIVE1MKXtcbiAgICAvLyBLZWVwIHRoZSBpZCBpZiBhbnlcbiAgICBsZXQgaWRBdHRyU3RyID0gaWQgPyBgIGlkPVwiJHtpZH1cImAgOiBcIlwiXG4gICAgaWYoVk9JRF9UQUdTLmhhcyh0YWcpKXtcbiAgICAgIG5ld0hUTUwgPSBgPCR7dGFnfSR7aWRBdHRyU3RyfSR7YXR0cnNTdHIgPT09IFwiXCIgPyBcIlwiIDogXCIgXCJ9JHthdHRyc1N0cn0vPmBcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3SFRNTCA9IGA8JHt0YWd9JHtpZEF0dHJTdHJ9JHthdHRyc1N0ciA9PT0gXCJcIiA/IFwiXCIgOiBcIiBcIn0ke2F0dHJzU3RyfT48LyR7dGFnfT5gXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCByZXN0ID0gaHRtbC5zbGljZSh0YWdOYW1lRW5kc0F0LCBjbG9zZUF0ICsgMSlcbiAgICBuZXdIVE1MID0gYDwke3RhZ30ke2F0dHJzU3RyID09PSBcIlwiID8gXCJcIiA6IFwiIFwifSR7YXR0cnNTdHJ9JHtyZXN0fWBcbiAgfVxuXG4gIHJldHVybiBbbmV3SFRNTCwgYmVmb3JlVGFnLCBhZnRlclRhZ11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZWQge1xuICBzdGF0aWMgZXh0cmFjdChkaWZmKXtcbiAgICBsZXQge1tSRVBMWV06IHJlcGx5LCBbRVZFTlRTXTogZXZlbnRzLCBbVElUTEVdOiB0aXRsZX0gPSBkaWZmXG4gICAgZGVsZXRlIGRpZmZbUkVQTFldXG4gICAgZGVsZXRlIGRpZmZbRVZFTlRTXVxuICAgIGRlbGV0ZSBkaWZmW1RJVExFXVxuICAgIHJldHVybiB7ZGlmZiwgdGl0bGUsIHJlcGx5OiByZXBseSB8fCBudWxsLCBldmVudHM6IGV2ZW50cyB8fCBbXX1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXdJZCwgcmVuZGVyZWQpe1xuICAgIHRoaXMudmlld0lkID0gdmlld0lkXG4gICAgdGhpcy5yZW5kZXJlZCA9IHt9XG4gICAgdGhpcy5tYWdpY0lkID0gMFxuICAgIHRoaXMubWVyZ2VEaWZmKHJlbmRlcmVkKVxuICB9XG5cbiAgcGFyZW50Vmlld0lkKCl7IHJldHVybiB0aGlzLnZpZXdJZCB9XG5cbiAgdG9TdHJpbmcob25seUNpZHMpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlVG9TdHJpbmcodGhpcy5yZW5kZXJlZCwgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIHRydWUsIHt9KVxuICAgIHJldHVybiBbc3RyLCBzdHJlYW1zXVxuICB9XG5cbiAgcmVjdXJzaXZlVG9TdHJpbmcocmVuZGVyZWQsIGNvbXBvbmVudHMgPSByZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIGNoYW5nZVRyYWNraW5nLCByb290QXR0cnMpe1xuICAgIG9ubHlDaWRzID0gb25seUNpZHMgPyBuZXcgU2V0KG9ubHlDaWRzKSA6IG51bGxcbiAgICBsZXQgb3V0cHV0ID0ge2J1ZmZlcjogXCJcIiwgY29tcG9uZW50czogY29tcG9uZW50cywgb25seUNpZHM6IG9ubHlDaWRzLCBzdHJlYW1zOiBuZXcgU2V0KCl9XG4gICAgdGhpcy50b091dHB1dEJ1ZmZlcihyZW5kZXJlZCwgbnVsbCwgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzKVxuICAgIHJldHVybiBbb3V0cHV0LmJ1ZmZlciwgb3V0cHV0LnN0cmVhbXNdXG4gIH1cblxuICBjb21wb25lbnRDSURzKGRpZmYpeyByZXR1cm4gT2JqZWN0LmtleXMoZGlmZltDT01QT05FTlRTXSB8fCB7fSkubWFwKGkgPT4gcGFyc2VJbnQoaSkpIH1cblxuICBpc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpe1xuICAgIGlmKCFkaWZmW0NPTVBPTkVOVFNdKXsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGlmZikubGVuZ3RoID09PSAxXG4gIH1cblxuICBnZXRDb21wb25lbnQoZGlmZiwgY2lkKXsgcmV0dXJuIGRpZmZbQ09NUE9ORU5UU11bY2lkXSB9XG5cbiAgcmVzZXRSZW5kZXIoY2lkKXtcbiAgICAvLyB3ZSBhcmUgcmFjaW5nIGEgY29tcG9uZW50IGRlc3Ryb3ksIGl0IGNvdWxkIG5vdCBleGlzdCwgc29cbiAgICAvLyBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCB0cnkgdG8gc2V0IHJlc2V0IG9uIHVuZGVmaW5lZFxuICAgIGlmKHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSl7XG4gICAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0ucmVzZXQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgbWVyZ2VEaWZmKGRpZmYpe1xuICAgIGxldCBuZXdjID0gZGlmZltDT01QT05FTlRTXVxuICAgIGxldCBjYWNoZSA9IHt9XG4gICAgZGVsZXRlIGRpZmZbQ09NUE9ORU5UU11cbiAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy5tdXRhYmxlTWVyZ2UodGhpcy5yZW5kZXJlZCwgZGlmZilcbiAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSB8fCB7fVxuXG4gICAgaWYobmV3Yyl7XG4gICAgICBsZXQgb2xkYyA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11cblxuICAgICAgZm9yKGxldCBjaWQgaW4gbmV3Yyl7XG4gICAgICAgIG5ld2NbY2lkXSA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChjaWQsIG5ld2NbY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2MpeyBvbGRjW2NpZF0gPSBuZXdjW2NpZF0gfVxuICAgICAgZGlmZltDT01QT05FTlRTXSA9IG5ld2NcbiAgICB9XG4gIH1cblxuICBjYWNoZWRGaW5kQ29tcG9uZW50KGNpZCwgY2RpZmYsIG9sZGMsIG5ld2MsIGNhY2hlKXtcbiAgICBpZihjYWNoZVtjaWRdKXtcbiAgICAgIHJldHVybiBjYWNoZVtjaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZGlmZiwgc3RhdCwgc2NpZCA9IGNkaWZmW1NUQVRJQ11cblxuICAgICAgaWYoaXNDaWQoc2NpZCkpe1xuICAgICAgICBsZXQgdGRpZmZcblxuICAgICAgICBpZihzY2lkID4gMCl7XG4gICAgICAgICAgdGRpZmYgPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoc2NpZCwgbmV3Y1tzY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGRpZmYgPSBvbGRjWy1zY2lkXVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdCA9IHRkaWZmW1NUQVRJQ11cbiAgICAgICAgbmRpZmYgPSB0aGlzLmNsb25lTWVyZ2UodGRpZmYsIGNkaWZmLCB0cnVlKVxuICAgICAgICBuZGlmZltTVEFUSUNdID0gc3RhdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmRpZmYgPSBjZGlmZltTVEFUSUNdICE9PSB1bmRlZmluZWQgfHwgb2xkY1tjaWRdID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgIGNkaWZmIDogdGhpcy5jbG9uZU1lcmdlKG9sZGNbY2lkXSwgY2RpZmYsIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICBjYWNoZVtjaWRdID0gbmRpZmZcbiAgICAgIHJldHVybiBuZGlmZlxuICAgIH1cbiAgfVxuXG4gIG11dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1NUQVRJQ10gIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gc291cmNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2UpXG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGZvcihsZXQga2V5IGluIHNvdXJjZSl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgbGV0IGlzT2JqVmFsID0gaXNPYmplY3QodmFsKVxuICAgICAgaWYoaXNPYmpWYWwgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXRWYWwsIHZhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHRhcmdldFtST09UXSl7XG4gICAgICB0YXJnZXQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8vIE1lcmdlcyBjaWQgdHJlZXMgdG9nZXRoZXIsIGNvcHlpbmcgc3RhdGljcyBmcm9tIHNvdXJjZSB0cmVlLlxuICAvL1xuICAvLyBUaGUgYHBydW5lTWFnaWNJZGAgaXMgcGFzc2VkIHRvIGNvbnRyb2wgcHJ1bmluZyB0aGUgbWFnaWNJZCBvZiB0aGVcbiAgLy8gdGFyZ2V0LiBXZSBtdXN0IGFsd2F5cyBwcnVuZSB0aGUgbWFnaWNJZCB3aGVuIHdlIGFyZSBzaGFyaW5nIHN0YXRpY3NcbiAgLy8gZnJvbSBhbm90aGVyIGNvbXBvbmVudC4gSWYgbm90IHBydW5pbmcsIHdlIHJlcGxpY2F0ZSB0aGUgbG9naWMgZnJvbVxuICAvLyBtdXRhYmxlTWVyZ2UsIHdoZXJlIHdlIHNldCBuZXdSZW5kZXIgdG8gdHJ1ZSBpZiB0aGVyZSBpcyBhIHJvb3RcbiAgLy8gKGVmZmVjdGl2ZWx5IGZvcmNpbmcgdGhlIG5ldyB2ZXJzaW9uIHRvIGJlIHJlbmRlcmVkIGluc3RlYWQgb2Ygc2tpcHBlZClcbiAgLy9cbiAgY2xvbmVNZXJnZSh0YXJnZXQsIHNvdXJjZSwgcHJ1bmVNYWdpY0lkKXtcbiAgICBsZXQgbWVyZ2VkID0gey4uLnRhcmdldCwgLi4uc291cmNlfVxuICAgIGZvcihsZXQga2V5IGluIG1lcmdlZCl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgaWYoaXNPYmplY3QodmFsKSAmJiB2YWxbU1RBVElDXSA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHZhbCwgcHJ1bmVNYWdpY0lkKVxuICAgICAgfSBlbHNlIGlmKHZhbCA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHt9LCBwcnVuZU1hZ2ljSWQpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHBydW5lTWFnaWNJZCl7XG4gICAgICBkZWxldGUgbWVyZ2VkLm1hZ2ljSWRcbiAgICAgIGRlbGV0ZSBtZXJnZWQubmV3UmVuZGVyXG4gICAgfSBlbHNlIGlmKHRhcmdldFtST09UXSl7XG4gICAgICBtZXJnZWQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICBjb21wb25lbnRUb1N0cmluZyhjaWQpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcodGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgY2lkLCBudWxsKVxuICAgIGxldCBbc3RyaXBwZWRIVE1MLCBfYmVmb3JlLCBfYWZ0ZXJdID0gbW9kaWZ5Um9vdChzdHIsIHt9KVxuICAgIHJldHVybiBbc3RyaXBwZWRIVE1MLCBzdHJlYW1zXVxuICB9XG5cbiAgcHJ1bmVDSURzKGNpZHMpe1xuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4gZGVsZXRlIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBnZXQoKXsgcmV0dXJuIHRoaXMucmVuZGVyZWQgfVxuXG4gIGlzTmV3RmluZ2VycHJpbnQoZGlmZiA9IHt9KXsgcmV0dXJuICEhZGlmZltTVEFUSUNdIH1cblxuICB0ZW1wbGF0ZVN0YXRpYyhwYXJ0LCB0ZW1wbGF0ZXMpe1xuICAgIGlmKHR5cGVvZiAocGFydCkgPT09IFwibnVtYmVyXCIpe1xuICAgICAgcmV0dXJuIHRlbXBsYXRlc1twYXJ0XVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFydFxuICAgIH1cbiAgfVxuXG4gIG5leHRNYWdpY0lEKCl7XG4gICAgdGhpcy5tYWdpY0lkKytcbiAgICByZXR1cm4gYG0ke3RoaXMubWFnaWNJZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgfVxuXG4gIC8vIENvbnZlcnRzIHJlbmRlcmVkIHRyZWUgdG8gb3V0cHV0IGJ1ZmZlci5cbiAgLy9cbiAgLy8gY2hhbmdlVHJhY2tpbmcgY29udHJvbHMgaWYgd2UgY2FuIGFwcGx5IHRoZSBQSFhfU0tJUCBvcHRpbWl6YXRpb24uXG4gIC8vIEl0IGlzIGRpc2FibGVkIGZvciBjb21wcmVoZW5zaW9ucyBzaW5jZSB3ZSBtdXN0IHJlLXJlbmRlciB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgLy8gYW5kIG5vIGluZGl2aWR1YWwgZWxlbWVudCBpcyB0cmFja2VkIGluc2lkZSB0aGUgY29tcHJlaGVuc2lvbi5cbiAgdG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzID0ge30pe1xuICAgIGlmKHJlbmRlcmVkW0RZTkFNSUNTXSl7IHJldHVybiB0aGlzLmNvbXByZWhlbnNpb25Ub0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpIH1cbiAgICBsZXQge1tTVEFUSUNdOiBzdGF0aWNzfSA9IHJlbmRlcmVkXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBpc1Jvb3QgPSByZW5kZXJlZFtST09UXVxuICAgIGxldCBwcmV2QnVmZmVyID0gb3V0cHV0LmJ1ZmZlclxuICAgIGlmKGlzUm9vdCl7IG91dHB1dC5idWZmZXIgPSBcIlwiIH1cblxuICAgIC8vIHRoaXMgY29uZGl0aW9uIGlzIGNhbGxlZCB3aGVuIGZpcnN0IHJlbmRlcmluZyBhbiBvcHRpbWl6YWJsZSBmdW5jdGlvbiBjb21wb25lbnQuXG4gICAgLy8gTEMgaGF2ZSB0aGVpciBtYWdpY0lkIHByZXZpb3VzbHkgc2V0XG4gICAgaWYoY2hhbmdlVHJhY2tpbmcgJiYgaXNSb290ICYmICFyZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgIHJlbmRlcmVkLm5ld1JlbmRlciA9IHRydWVcbiAgICAgIHJlbmRlcmVkLm1hZ2ljSWQgPSB0aGlzLm5leHRNYWdpY0lEKClcbiAgICB9XG5cbiAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF1cbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZFtpIC0gMV0sIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgIH1cblxuICAgIC8vIEFwcGxpZXMgdGhlIHJvb3QgdGFnIFwic2tpcFwiIG9wdGltaXphdGlvbiBpZiBzdXBwb3J0ZWQsIHdoaWNoIGNsZWFyc1xuICAgIC8vIHRoZSByb290IHRhZyBhdHRyaWJ1dGVzIGFuZCBpbm5lckhUTUwsIGFuZCBvbmx5IG1haW50YWlucyB0aGUgbWFnaWNJZC5cbiAgICAvLyBXZSBjYW4gb25seSBza2lwIHdoZW4gY2hhbmdlVHJhY2tpbmcgaXMgc3VwcG9ydGVkIChvdXRzaWRlIG9mIGEgY29tcHJlaGVuc2lvbiksXG4gICAgLy8gYW5kIHdoZW4gdGhlIHJvb3QgZWxlbWVudCBoYXNuJ3QgZXhwZXJpZW5jZWQgYW4gdW5yZW5kZXJlZCBtZXJnZSAobmV3UmVuZGVyIHRydWUpLlxuICAgIGlmKGlzUm9vdCl7XG4gICAgICBsZXQgc2tpcCA9IGZhbHNlXG4gICAgICBsZXQgYXR0cnNcbiAgICAgIC8vIFdoZW4gYSBMQyBpcyByZS1hZGRlZCB0byB0aGUgcGFnZSwgd2UgbmVlZCB0byByZS1yZW5kZXIgdGhlIGVudGlyZSBMQyB0cmVlLFxuICAgICAgLy8gdGhlcmVmb3JlIGNoYW5nZVRyYWNraW5nIGlzIGZhbHNlOyBob3dldmVyLCB3ZSBuZWVkIHRvIGtlZXAgYWxsIHRoZSBtYWdpY0lkc1xuICAgICAgLy8gZnJvbSBhbnkgZnVuY3Rpb24gY29tcG9uZW50IHNvIHRoZSBuZXh0IHRpbWUgdGhlIExDIGlzIHVwZGF0ZWQsIHdlIGNhbiBhcHBseVxuICAgICAgLy8gdGhlIHNraXAgb3B0aW1pemF0aW9uXG4gICAgICBpZihjaGFuZ2VUcmFja2luZyB8fCByZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgICAgc2tpcCA9IGNoYW5nZVRyYWNraW5nICYmICFyZW5kZXJlZC5uZXdSZW5kZXJcbiAgICAgICAgYXR0cnMgPSB7W1BIWF9NQUdJQ19JRF06IHJlbmRlcmVkLm1hZ2ljSWQsIC4uLnJvb3RBdHRyc31cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0gcm9vdEF0dHJzXG4gICAgICB9XG4gICAgICBpZihza2lwKXsgYXR0cnNbUEhYX1NLSVBdID0gdHJ1ZSB9XG4gICAgICBsZXQgW25ld1Jvb3QsIGNvbW1lbnRCZWZvcmUsIGNvbW1lbnRBZnRlcl0gPSBtb2RpZnlSb290KG91dHB1dC5idWZmZXIsIGF0dHJzLCBza2lwKVxuICAgICAgcmVuZGVyZWQubmV3UmVuZGVyID0gZmFsc2VcbiAgICAgIG91dHB1dC5idWZmZXIgPSBwcmV2QnVmZmVyICsgY29tbWVudEJlZm9yZSArIG5ld1Jvb3QgKyBjb21tZW50QWZ0ZXJcbiAgICB9XG4gIH1cblxuICBjb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBsZXQge1tEWU5BTUlDU106IGR5bmFtaWNzLCBbU1RBVElDXTogc3RhdGljcywgW1NUUkVBTV06IHN0cmVhbX0gPSByZW5kZXJlZFxuICAgIGxldCBbX3JlZiwgX2luc2VydHMsIGRlbGV0ZUlkcywgcmVzZXRdID0gc3RyZWFtIHx8IFtudWxsLCB7fSwgW10sIG51bGxdXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBjb21wVGVtcGxhdGVzID0gdGVtcGxhdGVzIHx8IHJlbmRlcmVkW1RFTVBMQVRFU11cbiAgICBmb3IobGV0IGQgPSAwOyBkIDwgZHluYW1pY3MubGVuZ3RoOyBkKyspe1xuICAgICAgbGV0IGR5bmFtaWMgPSBkeW5hbWljc1tkXVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIC8vIEluc2lkZSBhIGNvbXByZWhlbnNpb24sIHdlIGRvbid0IHRyYWNrIGhvdyBkeW5hbWljcyBjaGFuZ2VcbiAgICAgICAgLy8gb3ZlciB0aW1lIChhbmQgZmVhdHVyZXMgbGlrZSBzdHJlYW1zIHdvdWxkIG1ha2UgdGhhdCBpbXBvc3NpYmxlXG4gICAgICAgIC8vIHVubGVzcyB3ZSBtb3ZlIHRoZSBzdHJlYW0gZGlmZmluZyBhd2F5IGZyb20gbW9ycGhkb20pLFxuICAgICAgICAvLyBzbyB3ZSBjYW4ndCBwZXJmb3JtIHJvb3QgY2hhbmdlIHRyYWNraW5nLlxuICAgICAgICBsZXQgY2hhbmdlVHJhY2tpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihkeW5hbWljW2kgLSAxXSwgY29tcFRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzW2ldXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoc3RyZWFtICE9PSB1bmRlZmluZWQgJiYgKHJlbmRlcmVkW0RZTkFNSUNTXS5sZW5ndGggPiAwIHx8IGRlbGV0ZUlkcy5sZW5ndGggPiAwIHx8IHJlc2V0KSl7XG4gICAgICBkZWxldGUgcmVuZGVyZWRbU1RSRUFNXVxuICAgICAgcmVuZGVyZWRbRFlOQU1JQ1NdID0gW11cbiAgICAgIG91dHB1dC5zdHJlYW1zLmFkZChzdHJlYW0pXG4gICAgfVxuICB9XG5cbiAgZHluYW1pY1RvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcpe1xuICAgIGlmKHR5cGVvZiAocmVuZGVyZWQpID09PSBcIm51bWJlclwiKXtcbiAgICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpXG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0clxuICAgICAgb3V0cHV0LnN0cmVhbXMgPSBuZXcgU2V0KFsuLi5vdXRwdXQuc3RyZWFtcywgLi4uc3RyZWFtc10pXG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KHJlbmRlcmVkKSl7XG4gICAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcsIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHJlbmRlcmVkXG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlQ0lEVG9TdHJpbmcoY29tcG9uZW50cywgY2lkLCBvbmx5Q2lkcyl7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY2lkXSB8fCBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvciBDSUQgJHtjaWR9YCwgY29tcG9uZW50cylcbiAgICBsZXQgYXR0cnMgPSB7W1BIWF9DT01QT05FTlRdOiBjaWR9XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZClcbiAgICAvLyBUd28gb3B0aW1pemF0aW9uIHBhdGhzIGFwcGx5IGhlcmU6XG4gICAgLy9cbiAgICAvLyAgIDEuIFRoZSBvbmx5Q2lkcyBvcHRpbWl6YXRpb24gd29ya3MgYnkgdGhlIHNlcnZlciBkaWZmIHRlbGxpbmcgdXMgb25seSBzcGVjaWZpY1xuICAgIC8vICAgICBjaWQncyBoYXZlIGNoYW5nZWQuIFRoaXMgYWxsb3dzIHVzIHRvIHNraXAgcmVuZGVyaW5nIGFueSBjb21wb25lbnQgdGhhdCBoYXNuJ3QgY2hhbmdlZCxcbiAgICAvLyAgICAgd2hpY2ggdWx0aW1hdGVseSBzZXRzIFBIWF9TS0lQIHJvb3QgYXR0cmlidXRlIGFuZCBhdm9pZHMgcmVuZGVyaW5nIHRoZSBpbm5lckhUTUwuXG4gICAgLy9cbiAgICAvLyAgIDIuIFRoZSByb290IFBIWF9TS0lQIG9wdGltaXphdGlvbiBnZW5lcmFsaXplcyB0byBhbGwgSEVFeCBmdW5jdGlvbiBjb21wb25lbnRzLCBhbmRcbiAgICAvLyAgICAgd29ya3MgaW4gdGhlIHNhbWUgUEhYX1NLSVAgYXR0cmlidXRlIGZhc2hpb24gYXMgMSwgYnV0IHRoZSBuZXdSZW5kZXIgdHJhY2tpbmcgaXMgZG9uZVxuICAgIC8vICAgICBhdCB0aGUgZ2VuZXJhbCBkaWZmIG1lcmdlIGxldmVsLiBJZiB3ZSBtZXJnZSBhIGRpZmYgd2l0aCBuZXcgZHluYW1pY3MsIHdlIG5lY2Vzc2FyaWx5IGhhdmVcbiAgICAvLyAgICAgZXhwZXJpZW5jZWQgYSBjaGFuZ2Ugd2hpY2ggbXVzdCBiZSBhIG5ld1JlbmRlciwgYW5kIHRodXMgd2UgY2FuJ3Qgc2tpcCB0aGUgcmVuZGVyLlxuICAgIC8vXG4gICAgLy8gQm90aCBvcHRpbWl6YXRpb24gZmxvd3MgYXBwbHkgaGVyZS4gbmV3UmVuZGVyIGlzIHNldCBiYXNlZCBvbiB0aGUgb25seUNpZHMgb3B0aW1pemF0aW9uLCBhbmRcbiAgICAvLyB3ZSB0cmFjayBhIGRldGVybWluaXN0aWMgbWFnaWNJZCBiYXNlZCBvbiB0aGUgY2lkLlxuICAgIC8vXG4gICAgLy8gY2hhbmdlVHJhY2tpbmcgaXMgYWJvdXQgdGhlIGVudGlyZSB0cmVlXG4gICAgLy8gbmV3UmVuZGVyIGlzIGFib3V0IHRoZSBjdXJyZW50IHJvb3QgaW4gdGhlIHRyZWVcbiAgICAvL1xuICAgIC8vIEJ5IGRlZmF1bHQgY2hhbmdlVHJhY2tpbmcgaXMgZW5hYmxlZCwgYnV0IHdlIHNwZWNpYWwgY2FzZSB0aGUgZmxvdyB3aGVyZSB0aGUgY2xpZW50IGlzIHBydW5pbmdcbiAgICAvLyBjaWRzIGFuZCB0aGUgc2VydmVyIGFkZHMgdGhlIGNvbXBvbmVudCBiYWNrLiBJbiBzdWNoIGNhc2VzLCB3ZSBleHBsaWNpdGx5IGRpc2FibGUgY2hhbmdlVHJhY2tpbmdcbiAgICAvLyB3aXRoIHJlc2V0UmVuZGVyIGZvciB0aGlzIGNpZCwgdGhlbiByZS1lbmFibGUgaXQgYWZ0ZXIgdGhlIHJlY3Vyc2l2ZSBjYWxsIHRvIHNraXAgdGhlIG9wdGltaXphdGlvblxuICAgIC8vIGZvciB0aGUgZW50aXJlIGNvbXBvbmVudCB0cmVlLlxuICAgIGNvbXBvbmVudC5uZXdSZW5kZXIgPSAhc2tpcFxuICAgIGNvbXBvbmVudC5tYWdpY0lkID0gYGMke2NpZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgICAvLyBlbmFibGUgY2hhbmdlIHRyYWNraW5nIGFzIGxvbmcgYXMgdGhlIGNvbXBvbmVudCBoYXNuJ3QgYmVlbiByZXNldFxuICAgIGxldCBjaGFuZ2VUcmFja2luZyA9ICFjb21wb25lbnQucmVzZXRcbiAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyhjb21wb25lbnQsIGNvbXBvbmVudHMsIG9ubHlDaWRzLCBjaGFuZ2VUcmFja2luZywgYXR0cnMpXG4gICAgLy8gZGlzYWJsZSByZXNldCBhZnRlciB3ZSd2ZSByZW5kZXJlZFxuICAgIGRlbGV0ZSBjb21wb25lbnQucmVzZXRcblxuICAgIHJldHVybiBbaHRtbCwgc3RyZWFtc11cbiAgfVxufVxuIiwgImltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBBUklBIGZyb20gXCIuL2FyaWFcIlxuXG5sZXQgZm9jdXNTdGFjayA9IFtdXG5sZXQgZGVmYXVsdF90cmFuc2l0aW9uX3RpbWUgPSAyMDBcblxubGV0IEpTID0ge1xuICAvLyBwcml2YXRlXG4gIGV4ZWMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGRlZmF1bHRzKXtcbiAgICBsZXQgW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc10gPSBkZWZhdWx0cyB8fCBbbnVsbCwge2NhbGxiYWNrOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jYWxsYmFja31dXG4gICAgbGV0IGNvbW1hbmRzID0gcGh4RXZlbnQuY2hhckF0KDApID09PSBcIltcIiA/XG4gICAgICBKU09OLnBhcnNlKHBoeEV2ZW50KSA6IFtbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXV1cblxuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYoa2luZCA9PT0gZGVmYXVsdEtpbmQpe1xuICAgICAgICAvLyBhbHdheXMgcHJlZmVyIHRoZSBhcmdzLCBidXQga2VlcCBleGlzdGluZyBrZXlzIGZyb20gdGhlIGRlZmF1bHRBcmdzXG4gICAgICAgIGFyZ3MgPSB7Li4uZGVmYXVsdEFyZ3MsIC4uLmFyZ3N9XG4gICAgICAgIGFyZ3MuY2FsbGJhY2sgPSBhcmdzLmNhbGxiYWNrIHx8IGRlZmF1bHRBcmdzLmNhbGxiYWNrXG4gICAgICB9XG4gICAgICB0aGlzLmZpbHRlclRvRWxzKHZpZXcubGl2ZVNvY2tldCwgc291cmNlRWwsIGFyZ3MpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICB0aGlzW2BleGVjXyR7a2luZH1gXShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIGFyZ3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgaXNWaXNpYmxlKGVsKXtcbiAgICByZXR1cm4gISEoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0IHx8IGVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMClcbiAgfSxcblxuICAvLyByZXR1cm5zIHRydWUgaWYgYW55IHBhcnQgb2YgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSB2aWV3cG9ydFxuICBpc0luVmlld3BvcnQoZWwpe1xuICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgY29uc3Qgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcblxuICAgIHJldHVybiAoXG4gICAgICByZWN0LnJpZ2h0ID4gMCAmJlxuICAgICAgcmVjdC5ib3R0b20gPiAwICYmXG4gICAgICByZWN0LmxlZnQgPCB3aW5kb3dXaWR0aCAmJlxuICAgICAgcmVjdC50b3AgPCB3aW5kb3dIZWlnaHRcbiAgICApXG4gIH0sXG5cbiAgLy8gcHJpdmF0ZVxuXG4gIC8vIGNvbW1hbmRzXG5cbiAgZXhlY19leGVjKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHIsIHRvfSl7XG4gICAgbGV0IGVuY29kZWRKUyA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKVxuICAgIGlmKCFlbmNvZGVkSlMpeyB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICR7YXR0cn0gdG8gY29udGFpbiBKUyBjb21tYW5kIG9uIFwiJHt0b31cImApIH1cbiAgICB2aWV3LmxpdmVTb2NrZXQuZXhlY0pTKGVsLCBlbmNvZGVkSlMsIGV2ZW50VHlwZSlcbiAgfSxcblxuICBleGVjX2Rpc3BhdGNoKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2V2ZW50LCBkZXRhaWwsIGJ1YmJsZXN9KXtcbiAgICBkZXRhaWwgPSBkZXRhaWwgfHwge31cbiAgICBkZXRhaWwuZGlzcGF0Y2hlciA9IHNvdXJjZUVsXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZWwsIGV2ZW50LCB7ZGV0YWlsLCBidWJibGVzfSlcbiAgfSxcblxuICBleGVjX3B1c2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKXtcbiAgICBsZXQge2V2ZW50LCBkYXRhLCB0YXJnZXQsIHBhZ2VfbG9hZGluZywgbG9hZGluZywgdmFsdWUsIGRpc3BhdGNoZXIsIGNhbGxiYWNrfSA9IGFyZ3NcbiAgICBsZXQgcHVzaE9wdHMgPSB7bG9hZGluZywgdmFsdWUsIHRhcmdldCwgcGFnZV9sb2FkaW5nOiAhIXBhZ2VfbG9hZGluZ31cbiAgICBsZXQgdGFyZ2V0U3JjID0gZXZlbnRUeXBlID09PSBcImNoYW5nZVwiICYmIGRpc3BhdGNoZXIgPyBkaXNwYXRjaGVyIDogc291cmNlRWxcbiAgICBsZXQgcGh4VGFyZ2V0ID0gdGFyZ2V0IHx8IHRhcmdldFNyYy5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFwidGFyZ2V0XCIpKSB8fCB0YXJnZXRTcmNcbiAgICBjb25zdCBoYW5kbGVyID0gKHRhcmdldFZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgaWYoIXRhcmdldFZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICBpZihldmVudFR5cGUgPT09IFwiY2hhbmdlXCIpe1xuICAgICAgICBsZXQge25ld0NpZCwgX3RhcmdldH0gPSBhcmdzXG4gICAgICAgIF90YXJnZXQgPSBfdGFyZ2V0IHx8IChET00uaXNGb3JtSW5wdXQoc291cmNlRWwpID8gc291cmNlRWwubmFtZSA6IHVuZGVmaW5lZClcbiAgICAgICAgaWYoX3RhcmdldCl7IHB1c2hPcHRzLl90YXJnZXQgPSBfdGFyZ2V0IH1cbiAgICAgICAgdGFyZ2V0Vmlldy5wdXNoSW5wdXQoc291cmNlRWwsIHRhcmdldEN0eCwgbmV3Q2lkLCBldmVudCB8fCBwaHhFdmVudCwgcHVzaE9wdHMsIGNhbGxiYWNrKVxuICAgICAgfSBlbHNlIGlmKGV2ZW50VHlwZSA9PT0gXCJzdWJtaXRcIil7XG4gICAgICAgIGxldCB7c3VibWl0dGVyfSA9IGFyZ3NcbiAgICAgICAgdGFyZ2V0Vmlldy5zdWJtaXRGb3JtKHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBzdWJtaXR0ZXIsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFZpZXcucHVzaEV2ZW50KGV2ZW50VHlwZSwgc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIGRhdGEsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaW4gY2FzZSBvZiBmb3JtUmVjb3ZlcnksIHRhcmdldFZpZXcgYW5kIHRhcmdldEN0eCBhcmUgcGFzc2VkIGFzIGFyZ3VtZW50XG4gICAgLy8gYXMgdGhleSBhcmUgbG9va2VkIHVwIGluIGEgdGVtcGxhdGUgZWxlbWVudCwgbm90IHRoZSByZWFsIERPTVxuICAgIGlmKGFyZ3MudGFyZ2V0VmlldyAmJiBhcmdzLnRhcmdldEN0eCl7XG4gICAgICBoYW5kbGVyKGFyZ3MudGFyZ2V0VmlldywgYXJncy50YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIGV4ZWNfbmF2aWdhdGUoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgcmVwbGFjZSA/IFwicmVwbGFjZVwiIDogXCJwdXNoXCIsIG51bGwsIHNvdXJjZUVsKVxuICB9LFxuXG4gIGV4ZWNfcGF0Y2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5wdXNoSGlzdG9yeVBhdGNoKGUsIGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiLCBzb3VyY2VFbClcbiAgfSxcblxuICBleGVjX2ZvY3VzKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5hdHRlbXB0Rm9jdXMoZWwpXG4gICAgLy8gaW4gY2FzZSB0aGUgSlMuZm9jdXMgY29tbWFuZCBpcyBpbiBhIEpTLnNob3cvaGlkZS90b2dnbGUgY2hhaW4sIGZvciBzaG93IHdlIG5lZWRcbiAgICAvLyB0byB3YWl0IGZvciBKUy5zaG93IHRvIGhhdmUgdXBkYXRlZCB0aGUgZWxlbWVudCdzIGRpc3BsYXkgcHJvcGVydHkgKHNlZSBleGVjX3RvZ2dsZSlcbiAgICAvLyBidXQgdGhhdCBydW4gaW4gbmVzdGVkIGFuaW1hdGlvbiBmcmFtZXMsIHRoZXJlZm9yZSB3ZSBuZWVkIHRvIHVzZSB0aGVtIGhlcmUgYXMgd2VsbFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBBUklBLmF0dGVtcHRGb2N1cyhlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX2ZvY3VzX2ZpcnN0KGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbClcbiAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX3B1c2hfZm9jdXMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKXtcbiAgICBmb2N1c1N0YWNrLnB1c2goZWwgfHwgc291cmNlRWwpXG4gIH0sXG5cbiAgZXhlY19wb3BfZm9jdXMoX2UsIF9ldmVudFR5cGUsIF9waHhFdmVudCwgX3ZpZXcsIF9zb3VyY2VFbCwgX2VsKXtcbiAgICBjb25zdCBlbCA9IGZvY3VzU3RhY2sucG9wKClcbiAgICBpZihlbCl7XG4gICAgICBlbC5mb2N1cygpXG4gICAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGVsLmZvY3VzKCkpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBleGVjX2FkZF9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgbmFtZXMsIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3JlbW92ZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9hdHRyKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHI6IFthdHRyLCB2YWwxLCB2YWwyXX0pe1xuICAgIHRoaXMudG9nZ2xlQXR0cihlbCwgYXR0ciwgdmFsMSwgdmFsMilcbiAgfSxcblxuICBleGVjX3RyYW5zaXRpb24oZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dGltZSwgdHJhbnNpdGlvbiwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lLCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3Nob3coZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY19oaWRlKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy5oaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKVxuICB9LFxuXG4gIGV4ZWNfc2V0X2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cjogW2F0dHIsIHZhbF19KXtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cn0pe1xuICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgfSxcblxuICAvLyB1dGlscyBmb3IgY29tbWFuZHNcblxuICBzaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZighdGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIG51bGwsIHRpbWUsIGJsb2NraW5nKVxuICAgIH1cbiAgfSxcblxuICBoaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgbnVsbCwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nKXtcbiAgICB0aW1lID0gdGltZSB8fCBkZWZhdWx0X3RyYW5zaXRpb25fdGltZVxuICAgIGxldCBbaW5DbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcywgaW5FbmRDbGFzc2VzXSA9IGlucyB8fCBbW10sIFtdLCBbXV1cbiAgICBsZXQgW291dENsYXNzZXMsIG91dFN0YXJ0Q2xhc3Nlcywgb3V0RW5kQ2xhc3Nlc10gPSBvdXRzIHx8IFtbXSwgW10sIFtdXVxuICAgIGlmKGluQ2xhc3Nlcy5sZW5ndGggPiAwIHx8IG91dENsYXNzZXMubGVuZ3RoID4gMCl7XG4gICAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0U3RhcnRDbGFzc2VzLCBpbkNsYXNzZXMuY29uY2F0KGluU3RhcnRDbGFzc2VzKS5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRDbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dEVuZENsYXNzZXMsIG91dFN0YXJ0Q2xhc3NlcykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZihldmVudFR5cGUgPT09IFwicmVtb3ZlXCIpeyByZXR1cm4gfVxuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5TdGFydENsYXNzZXMsIG91dENsYXNzZXMuY29uY2F0KG91dFN0YXJ0Q2xhc3NlcykuY29uY2F0KG91dEVuZENsYXNzZXMpKVxuICAgICAgICAgIGNvbnN0IHN0aWNreURpc3BsYXkgPSBkaXNwbGF5IHx8IHRoaXMuZGVmYXVsdERpc3BsYXkoZWwpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhZGQgdGhlIHN0YXJ0aW5nICsgYWN0aXZlIGNsYXNzLCBUSEVOIG1ha2UgdGhlIGVsZW1lbnQgdmlzaWJsZVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGlmIHdlIHRvZ2dsZWQgdGhlIHZpc2liaWxpdHkgZWFybGllciBjc3MgYW5pbWF0aW9uc1xuICAgICAgICAgICAgLy8gd291bGQgZmxpY2tlciwgYXMgdGhlIGVsZW1lbnQgYmVjb21lcyB2aXNpYmxlIGJlZm9yZSB0aGUgYWN0aXZlIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gY2xhc3MgaXMgc2V0IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM0NTYpXG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5DbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIC8vIGFkZE9yUmVtb3ZlQ2xhc3NlcyB1c2VzIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGl0c2VsZiwgdGhlcmVmb3JlIHdlIG5lZWQgdG8gbW92ZSB0aGUgcHV0U3RpY2t5XG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBuZXh0IHJlcXVlc3RBbmltYXRpb25GcmFtZS4uLlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkVuZENsYXNzZXMsIGluU3RhcnRDbGFzc2VzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGxldCBvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIGluQ2xhc3Nlcy5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtc3RhcnRcIikpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICAgIGxldCBzdGlja3lEaXNwbGF5ID0gZGlzcGxheSB8fCB0aGlzLmRlZmF1bHREaXNwbGF5KGVsKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZUNsYXNzZXMoZWwsIGNsYXNzZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcsIGJsb2NraW5nKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGxldCBbcHJldkFkZHMsIHByZXZSZW1vdmVzXSA9IERPTS5nZXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBbW10sIFtdXSlcbiAgICAgIGxldCBuZXdBZGRzID0gY2xhc3Nlcy5maWx0ZXIobmFtZSA9PiBwcmV2QWRkcy5pbmRleE9mKG5hbWUpIDwgMCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBjbGFzc2VzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBuZXdBZGRzLCBuZXdSZW1vdmVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgICB9KVxuICB9LFxuXG4gIHRvZ2dsZUF0dHIoZWwsIGF0dHIsIHZhbDEsIHZhbDIpe1xuICAgIGlmKGVsLmhhc0F0dHJpYnV0ZShhdHRyKSl7XG4gICAgICBpZih2YWwyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAvLyB0b2dnbGUgYmV0d2VlbiB2YWwxIGFuZCB2YWwyXG4gICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZShhdHRyKSA9PT0gdmFsMSl7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDJdXSwgW10pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlbW92ZSBhdHRyXG4gICAgICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgfVxuICB9LFxuXG4gIGFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcywgcmVtb3ZlcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpe1xuICAgIHRpbWUgPSB0aW1lIHx8IGRlZmF1bHRfdHJhbnNpdGlvbl90aW1lXG4gICAgbGV0IFt0cmFuc2l0aW9uUnVuLCB0cmFuc2l0aW9uU3RhcnQsIHRyYW5zaXRpb25FbmRdID0gdHJhbnNpdGlvbiB8fCBbW10sIFtdLCBbXV1cbiAgICBpZih0cmFuc2l0aW9uUnVuLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uU3RhcnQsIFtdLmNvbmNhdCh0cmFuc2l0aW9uUnVuKS5jb25jYXQodHJhbnNpdGlvbkVuZCkpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uUnVuLCBbXSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uRW5kLCB0cmFuc2l0aW9uU3RhcnQpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLmNvbmNhdCh0cmFuc2l0aW9uRW5kKSwgcmVtb3Zlcy5jb25jYXQodHJhbnNpdGlvblJ1bikuY29uY2F0KHRyYW5zaXRpb25TdGFydCkpXG4gICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICBvblN0YXJ0KClcbiAgICAgICAgc2V0VGltZW91dChvbkRvbmUsIHRpbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgW1tdLCBbXV0pXG4gICAgICBsZXQga2VlcEFkZHMgPSBhZGRzLmZpbHRlcihuYW1lID0+IHByZXZBZGRzLmluZGV4T2YobmFtZSkgPCAwICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQga2VlcFJlbW92ZXMgPSByZW1vdmVzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBuZXdBZGRzID0gcHJldkFkZHMuZmlsdGVyKG5hbWUgPT4gcmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBBZGRzKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBhZGRzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcFJlbW92ZXMpXG5cbiAgICAgIERPTS5wdXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LnJlbW92ZSguLi5uZXdSZW1vdmVzKVxuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LmFkZCguLi5uZXdBZGRzKVxuICAgICAgICByZXR1cm4gW25ld0FkZHMsIG5ld1JlbW92ZXNdXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgc2V0T3JSZW1vdmVBdHRycyhlbCwgc2V0cywgcmVtb3Zlcyl7XG4gICAgbGV0IFtwcmV2U2V0cywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJhdHRyc1wiLCBbW10sIFtdXSlcblxuICAgIGxldCBhbHRlcmVkQXR0cnMgPSBzZXRzLm1hcCgoW2F0dHIsIF92YWxdKSA9PiBhdHRyKS5jb25jYXQocmVtb3ZlcylcbiAgICBsZXQgbmV3U2V0cyA9IHByZXZTZXRzLmZpbHRlcigoW2F0dHIsIF92YWxdKSA9PiAhYWx0ZXJlZEF0dHJzLmluY2x1ZGVzKGF0dHIpKS5jb25jYXQoc2V0cylcbiAgICBsZXQgbmV3UmVtb3ZlcyA9IHByZXZSZW1vdmVzLmZpbHRlcigoYXR0cikgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHJlbW92ZXMpXG5cbiAgICBET00ucHV0U3RpY2t5KGVsLCBcImF0dHJzXCIsIGN1cnJlbnRFbCA9PiB7XG4gICAgICBuZXdSZW1vdmVzLmZvckVhY2goYXR0ciA9PiBjdXJyZW50RWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpKVxuICAgICAgbmV3U2V0cy5mb3JFYWNoKChbYXR0ciwgdmFsXSkgPT4gY3VycmVudEVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpKVxuICAgICAgcmV0dXJuIFtuZXdTZXRzLCBuZXdSZW1vdmVzXVxuICAgIH0pXG4gIH0sXG5cbiAgaGFzQWxsQ2xhc3NlcyhlbCwgY2xhc3Nlcyl7IHJldHVybiBjbGFzc2VzLmV2ZXJ5KG5hbWUgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKSB9LFxuXG4gIGlzVG9nZ2xlZE91dChlbCwgb3V0Q2xhc3Nlcyl7XG4gICAgcmV0dXJuICF0aGlzLmlzVmlzaWJsZShlbCkgfHwgdGhpcy5oYXNBbGxDbGFzc2VzKGVsLCBvdXRDbGFzc2VzKVxuICB9LFxuXG4gIGZpbHRlclRvRWxzKGxpdmVTb2NrZXQsIHNvdXJjZUVsLCB7dG99KXtcbiAgICBsZXQgZGVmYXVsdFF1ZXJ5ID0gKCkgPT4ge1xuICAgICAgaWYodHlwZW9mKHRvKSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRvKVxuICAgICAgfSBlbHNlIGlmKHRvLmNsb3Nlc3Qpe1xuICAgICAgICBsZXQgdG9FbCA9IHNvdXJjZUVsLmNsb3Nlc3QodG8uY2xvc2VzdClcbiAgICAgICAgcmV0dXJuIHRvRWwgPyBbdG9FbF0gOiBbXVxuICAgICAgfSBlbHNlIGlmKHRvLmlubmVyKXtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUVsLnF1ZXJ5U2VsZWN0b3JBbGwodG8uaW5uZXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0byA/IGxpdmVTb2NrZXQuanNRdWVyeVNlbGVjdG9yQWxsKHNvdXJjZUVsLCB0bywgZGVmYXVsdFF1ZXJ5KSA6IFtzb3VyY2VFbF1cbiAgfSxcblxuICBkZWZhdWx0RGlzcGxheShlbCl7XG4gICAgcmV0dXJuIHt0cjogXCJ0YWJsZS1yb3dcIiwgdGQ6IFwidGFibGUtY2VsbFwifVtlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCldIHx8IFwiYmxvY2tcIlxuICB9LFxuXG4gIHRyYW5zaXRpb25DbGFzc2VzKHZhbCl7XG4gICAgaWYoIXZhbCl7IHJldHVybiBudWxsIH1cblxuICAgIGxldCBbdHJhbnMsIHRTdGFydCwgdEVuZF0gPSBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwgOiBbdmFsLnNwbGl0KFwiIFwiKSwgW10sIFtdXVxuICAgIHRyYW5zID0gQXJyYXkuaXNBcnJheSh0cmFucykgPyB0cmFucyA6IHRyYW5zLnNwbGl0KFwiIFwiKVxuICAgIHRTdGFydCA9IEFycmF5LmlzQXJyYXkodFN0YXJ0KSA/IHRTdGFydCA6IHRTdGFydC5zcGxpdChcIiBcIilcbiAgICB0RW5kID0gQXJyYXkuaXNBcnJheSh0RW5kKSA/IHRFbmQgOiB0RW5kLnNwbGl0KFwiIFwiKVxuICAgIHJldHVybiBbdHJhbnMsIHRTdGFydCwgdEVuZF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKU1xuIiwgImltcG9ydCBKUyBmcm9tIFwiLi9qc1wiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmNvbnN0IEhPT0tfSUQgPSBcImhvb2tJZFwiXG5cbmxldCB2aWV3SG9va0lEID0gMVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0hvb2sge1xuICBzdGF0aWMgbWFrZUlEKCl7IHJldHVybiB2aWV3SG9va0lEKysgfVxuICBzdGF0aWMgZWxlbWVudElEKGVsKXsgcmV0dXJuIERPTS5wcml2YXRlKGVsLCBIT09LX0lEKSB9XG5cbiAgY29uc3RydWN0b3IodmlldywgZWwsIGNhbGxiYWNrcyl7XG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5fX2F0dGFjaFZpZXcodmlldylcbiAgICB0aGlzLl9fY2FsbGJhY2tzID0gY2FsbGJhY2tzXG4gICAgdGhpcy5fX2xpc3RlbmVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgSE9PS19JRCwgdGhpcy5jb25zdHJ1Y3Rvci5tYWtlSUQoKSlcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9fY2FsbGJhY2tzKXsgdGhpc1trZXldID0gdGhpcy5fX2NhbGxiYWNrc1trZXldIH1cbiAgfVxuXG4gIF9fYXR0YWNoVmlldyh2aWV3KXtcbiAgICBpZih2aWV3KXtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4gdmlld1xuICAgICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGhvb2sgbm90IHlldCBhdHRhY2hlZCB0byBhIGxpdmUgdmlldzogJHt0aGlzLmVsLm91dGVySFRNTH1gKVxuICAgICAgfVxuICAgICAgdGhpcy5saXZlU29ja2V0ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIF9fbW91bnRlZCgpeyB0aGlzLm1vdW50ZWQgJiYgdGhpcy5tb3VudGVkKCkgfVxuICBfX3VwZGF0ZWQoKXsgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpIH1cbiAgX19iZWZvcmVVcGRhdGUoKXsgdGhpcy5iZWZvcmVVcGRhdGUgJiYgdGhpcy5iZWZvcmVVcGRhdGUoKSB9XG4gIF9fZGVzdHJveWVkKCl7XG4gICAgdGhpcy5kZXN0cm95ZWQgJiYgdGhpcy5kZXN0cm95ZWQoKVxuICAgIERPTS5kZWxldGVQcml2YXRlKHRoaXMuZWwsIEhPT0tfSUQpIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNDk2XG4gIH1cbiAgX19yZWNvbm5lY3RlZCgpe1xuICAgIGlmKHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCl7XG4gICAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWNvbm5lY3RlZCAmJiB0aGlzLnJlY29ubmVjdGVkKClcbiAgICB9XG4gIH1cbiAgX19kaXNjb25uZWN0ZWQoKXtcbiAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSB0cnVlXG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgJiYgdGhpcy5kaXNjb25uZWN0ZWQoKVxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIHRoZSBob29rIHRvIEpTIGNvbW1hbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge1ZpZXdIb29rfSBob29rIC0gVGhlIFZpZXdIb29rIGluc3RhbmNlIHRvIGJpbmQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIG1ldGhvZHMgdG8gbWFuaXB1bGF0ZSB0aGUgRE9NIGFuZCBleGVjdXRlIEphdmFTY3JpcHQuXG4gICAqL1xuICBqcygpe1xuICAgIGxldCBob29rID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogRXhlY3V0ZXMgZW5jb2RlZCBKYXZhU2NyaXB0IGluIHRoZSBjb250ZXh0IG9mIHRoZSBob29rIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGVuY29kZWRKUyAtIFRoZSBlbmNvZGVkIEphdmFTY3JpcHQgc3RyaW5nIHRvIGV4ZWN1dGUuXG4gICAgICAgKi9cbiAgICAgIGV4ZWMoZW5jb2RlZEpTKXtcbiAgICAgICAgaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0LmV4ZWNKUyhob29rLmVsLCBlbmNvZGVkSlMsIFwiaG9va1wiKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTaG93cyBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gc2hvdy5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldCB3aGVuIHNob3dpbmcuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZV0gLSBUaGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMuIERlZmF1bHRzIDIwMC5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgc2hvdyhlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5zaG93KFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEhpZGVzIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBoaWRlLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnRyYW5zaXRpb25dIC0gVGhlIENTUyB0cmFuc2l0aW9uIGNsYXNzZXMgdG8gc2V0IHdoZW4gaGlkaW5nLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLiBEZWZhdWx0cyAyMDAuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJsb2NraW5nXSAtIFRoZSBib29sZWFuIGZsYWcgdG8gYmxvY2sgdGhlIFVJIGR1cmluZyB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqICAgRGVmYXVsdHMgYHRydWVgLlxuICAgICAgICovXG4gICAgICBoaWRlKGVsLCBvcHRzID0ge30pe1xuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLmhpZGUoXCJob29rXCIsIG93bmVyLCBlbCwgbnVsbCwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5pbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyBmb3Igc2hvd2luZy5cbiAgICAgICAqICAgQWNjZXB0cyBlaXRoZXIgdGhlIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgaW4sIG9yXG4gICAgICAgKiAgIGEgMy10dXBsZSBjb250YWluaW5nIHRoZSB0cmFuc2l0aW9uIGNsYXNzLCB0aGUgY2xhc3MgdG8gYXBwbHlcbiAgICAgICAqICAgdG8gc3RhcnQgdGhlIHRyYW5zaXRpb24sIGFuZCB0aGUgZW5kaW5nIHRyYW5zaXRpb24gY2xhc3MsIHN1Y2ggYXM6XG4gICAgICAgKlxuICAgICAgICogICAgICAgW1wiZWFzZS1vdXQgZHVyYXRpb24tMzAwXCIsIFwib3BhY2l0eS0wXCIsIFwib3BhY2l0eS0xMDBcIl1cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMub3V0XSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIGZvciBoaWRpbmcuXG4gICAgICAgKiAgIEFjY2VwdHMgZWl0aGVyIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgb3V0LCBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHRvZ2dsZShlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBvcHRzLmluID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy5pbilcbiAgICAgICAgb3B0cy5vdXQgPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLm91dClcbiAgICAgICAgSlMudG9nZ2xlKFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy5pbiwgb3B0cy5vdXQsIG9wdHMudGltZSwgb3B0cy5ibG9ja2luZylcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyBDU1MgY2xhc3NlcyB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYWRkIGNsYXNzZXMgdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byBhZGQuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gcHJvcGVydHkgdG8gc2V0LlxuICAgICAgICogICBBY2NlcHRzIGEgc3RyaW5nIG9mIGNsYXNzZXMgdG8gYXBwbHkgd2hlbiBhZGRpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMFwiLCBcIm9wYWNpdHktMTAwXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgYWRkQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG5hbWVzLCBbXSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmVzIENTUyBjbGFzc2VzIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSBjbGFzc2VzIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byByZW1vdmUuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyB0byBzZXQuXG4gICAgICAgKiAgIEFjY2VwdHMgYSBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHJlbW92aW5nIGNsYXNzZXMgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIm9wYWNpdHktMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBuYW1lcywgb3B0cyA9IHt9KXtcbiAgICAgICAgb3B0cy50cmFuc2l0aW9uID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy50cmFuc2l0aW9uKVxuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBuYW1lcywgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIENTUyBjbGFzc2VzIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgY2xhc3NlcyBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBuYW1lcyAtIFRoZSBjbGFzcyBuYW1lKHMpIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldC5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdG9nZ2xlQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBvcHRzLnRyYW5zaXRpb24gPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLnRyYW5zaXRpb24pXG4gICAgICAgIG5hbWVzID0gQXJyYXkuaXNBcnJheShuYW1lcykgPyBuYW1lcyA6IG5hbWVzLnNwbGl0KFwiIFwiKVxuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCBvcHRzLnRyYW5zaXRpb24sIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFwcGxpZXMgYSBDU1MgdHJhbnNpdGlvbiB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYXBwbHkgdGhlIHRyYW5zaXRpb24gdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdHJhbnNpdGlvbiAtIFRoZSB0cmFuc2l0aW9uIGNsYXNzKGVzKSB0byBhcHBseS5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdHJhbnNpdGlvbmluZyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdHJhbnNpdGlvbihlbCwgdHJhbnNpdGlvbiwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBbXSwgSlMudHJhbnNpdGlvbkNsYXNzZXModHJhbnNpdGlvbiksIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNldHMgYW4gYXR0cmlidXRlIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBzZXQgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHNldC5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwgLSBUaGUgdmFsdWUgdG8gc2V0IGZvciB0aGUgYXR0cmlidXRlLlxuICAgICAgICovXG4gICAgICBzZXRBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbCl7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKSB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZXMgYW4gYXR0cmlidXRlIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byByZW1vdmUuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShlbCwgYXR0cil7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtdLCBbYXR0cl0pIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlcyBhbiBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudCBiZXR3ZWVuIHR3byB2YWx1ZXMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwxIC0gVGhlIGZpcnN0IHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbDIgLSBUaGUgc2Vjb25kIHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICovXG4gICAgICB0b2dnbGVBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbDEsIHZhbDIpeyBKUy50b2dnbGVBdHRyKGVsLCBhdHRyLCB2YWwxLCB2YWwyKSB9LFxuICAgIH1cbiAgfVxuXG4gIHB1c2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9LCBvblJlcGx5KXtcbiAgICBpZihvblJlcGx5ID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZWYgPSB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIChyZXBseSwgX3JlZikgPT4gcmVzb2x2ZShyZXBseSkpXG4gICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwidW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gIH1cblxuICBwdXNoRXZlbnRUbyhwaHhUYXJnZXQsIGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkpe1xuICAgIGlmKG9uUmVwbHkgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZiA9IHZpZXcucHVzaEhvb2tFdmVudCh0aGlzLmVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCAocmVwbHksIF9yZWYpID0+IHJlc29sdmUocmVwbHkpKVxuICAgICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICByZXR1cm4gdmlldy5wdXNoSG9va0V2ZW50KHRoaXMuZWwsIHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IGNhbGxiYWNrUmVmID0gKGN1c3RvbUV2ZW50LCBieXBhc3MpID0+IGJ5cGFzcyA/IGV2ZW50IDogY2FsbGJhY2soY3VzdG9tRXZlbnQuZGV0YWlsKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmFkZChjYWxsYmFja1JlZilcbiAgICByZXR1cm4gY2FsbGJhY2tSZWZcbiAgfVxuXG4gIHJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKXtcbiAgICBsZXQgZXZlbnQgPSBjYWxsYmFja1JlZihudWxsLCB0cnVlKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFja1JlZilcbiAgfVxuXG4gIHVwbG9hZChuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkuZGlzcGF0Y2hVcGxvYWRzKG51bGwsIG5hbWUsIGZpbGVzKVxuICB9XG5cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcuZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXMpXG4gICAgfSlcbiAgfVxuXG4gIF9fY2xlYW51cF9fKCl7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrUmVmID0+IHRoaXMucmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpKVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCxcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgQ09OU0VDVVRJVkVfUkVMT0FEUyxcbiAgUEhYX0FVVE9fUkVDT1ZFUixcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0NPTk5FQ1RFRF9DTEFTUyxcbiAgUEhYX0RJU0FCTEVfV0lUSCxcbiAgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLFxuICBQSFhfRElTQUJMRUQsXG4gIFBIWF9MT0FESU5HX0NMQVNTLFxuICBQSFhfRVJST1JfQ0xBU1MsXG4gIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1MsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9IT09LLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJPR1JFU1MsXG4gIFBIWF9SRUFET05MWSxcbiAgUEhYX1JFRl9MT0FESU5HLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9TVElDS1ksXG4gIFBIWF9UUkFDS19TVEFUSUMsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9NQUlOLFxuICBQSFhfTU9VTlRFRCxcbiAgUFVTSF9USU1FT1VULFxuICBQSFhfVklFV1BPUlRfVE9QLFxuICBQSFhfVklFV1BPUlRfQk9UVE9NLFxuICBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGlzRW1wdHksXG4gIGlzRXF1YWxPYmosXG4gIGxvZ0Vycm9yLFxuICBtYXliZSxcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRWxlbWVudFJlZiBmcm9tIFwiLi9lbGVtZW50X3JlZlwiXG5pbXBvcnQgRE9NUGF0Y2ggZnJvbSBcIi4vZG9tX3BhdGNoXCJcbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5pbXBvcnQgUmVuZGVyZWQgZnJvbSBcIi4vcmVuZGVyZWRcIlxuaW1wb3J0IFZpZXdIb29rIGZyb20gXCIuL3ZpZXdfaG9va1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5pbXBvcnQgbW9ycGhkb20gZnJvbSBcIm1vcnBoZG9tXCJcblxuZXhwb3J0IGxldCBwcmVwZW5kRm9ybURhdGFLZXkgPSAoa2V5LCBwcmVmaXgpID0+IHtcbiAgbGV0IGlzQXJyYXkgPSBrZXkuZW5kc1dpdGgoXCJbXVwiKVxuICAvLyBSZW1vdmUgdGhlIFwiW11cIiBpZiBpdCdzIGFuIGFycmF5XG4gIGxldCBiYXNlS2V5ID0gaXNBcnJheSA/IGtleS5zbGljZSgwLCAtMikgOiBrZXlcbiAgLy8gUmVwbGFjZSBsYXN0IG9jY3VycmVuY2Ugb2Yga2V5IGJlZm9yZSBhIGNsb3NpbmcgYnJhY2tldCBvciB0aGUgZW5kIHdpdGgga2V5IHBsdXMgc3VmZml4XG4gIGJhc2VLZXkgPSBiYXNlS2V5LnJlcGxhY2UoLyhbXlxcW1xcXV0rKShcXF0/JCkvLCBgJHtwcmVmaXh9JDEkMmApXG4gIC8vIEFkZCBiYWNrIHRoZSBcIltdXCIgaWYgaXQgd2FzIGFuIGFycmF5XG4gIGlmKGlzQXJyYXkpeyBiYXNlS2V5ICs9IFwiW11cIiB9XG4gIHJldHVybiBiYXNlS2V5XG59XG5cbmxldCBzZXJpYWxpemVGb3JtID0gKGZvcm0sIG9wdHMsIG9ubHlOYW1lcyA9IFtdKSA9PiB7XG4gIGNvbnN0IHtzdWJtaXR0ZXJ9ID0gb3B0c1xuXG4gIC8vIFdlIG11c3QgaW5qZWN0IHRoZSBzdWJtaXR0ZXIgaW4gdGhlIG9yZGVyIHRoYXQgaXQgZXhpc3RzIGluIHRoZSBET01cbiAgLy8gcmVsYXRpdmUgdG8gb3RoZXIgaW5wdXRzLiBGb3IgZXhhbXBsZSwgZm9yIGNoZWNrYm94IGdyb3VwcywgdGhlIG9yZGVyIG11c3QgYmUgbWFpbnRhaW5lZC5cbiAgbGV0IGluamVjdGVkRWxlbWVudFxuICBpZihzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUpe1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCJcbiAgICAvLyBzZXQgdGhlIGZvcm0gYXR0cmlidXRlIGlmIHRoZSBzdWJtaXR0ZXIgaGFzIG9uZTtcbiAgICAvLyB0aGlzIGNhbiBoYXBwZW4gaWYgdGhlIGVsZW1lbnQgaXMgb3V0c2lkZSB0aGUgYWN0dWFsIGZvcm0gZWxlbWVudFxuICAgIGNvbnN0IGZvcm1JZCA9IHN1Ym1pdHRlci5nZXRBdHRyaWJ1dGUoXCJmb3JtXCIpXG4gICAgaWYoZm9ybUlkKXtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImZvcm1cIiwgZm9ybUlkKVxuICAgIH1cbiAgICBpbnB1dC5uYW1lID0gc3VibWl0dGVyLm5hbWVcbiAgICBpbnB1dC52YWx1ZSA9IHN1Ym1pdHRlci52YWx1ZVxuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dCwgc3VibWl0dGVyKVxuICAgIGluamVjdGVkRWxlbWVudCA9IGlucHV0XG4gIH1cblxuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKVxuICBjb25zdCB0b1JlbW92ZSA9IFtdXG5cbiAgZm9ybURhdGEuZm9yRWFjaCgodmFsLCBrZXksIF9pbmRleCkgPT4ge1xuICAgIGlmKHZhbCBpbnN0YW5jZW9mIEZpbGUpeyB0b1JlbW92ZS5wdXNoKGtleSkgfVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgYnVpbGRpbmcgZmlsZURhdGFcbiAgdG9SZW1vdmUuZm9yRWFjaChrZXkgPT4gZm9ybURhdGEuZGVsZXRlKGtleSkpXG5cbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG5cbiAgY29uc3Qge2lucHV0c1VudXNlZCwgb25seUhpZGRlbklucHV0c30gPSBBcnJheS5mcm9tKGZvcm0uZWxlbWVudHMpLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGNvbnN0IHtpbnB1dHNVbnVzZWQsIG9ubHlIaWRkZW5JbnB1dHN9ID0gYWNjXG4gICAgY29uc3Qga2V5ID0gaW5wdXQubmFtZVxuICAgIGlmKCFrZXkpeyByZXR1cm4gYWNjIH1cblxuICAgIGlmKGlucHV0c1VudXNlZFtrZXldID09PSB1bmRlZmluZWQpeyBpbnB1dHNVbnVzZWRba2V5XSA9IHRydWUgfVxuICAgIGlmKG9ubHlIaWRkZW5JbnB1dHNba2V5XSA9PT0gdW5kZWZpbmVkKXsgb25seUhpZGRlbklucHV0c1trZXldID0gdHJ1ZSB9XG5cbiAgICBjb25zdCBpc1VzZWQgPSBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKSB8fCBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpXG4gICAgY29uc3QgaXNIaWRkZW4gPSBpbnB1dC50eXBlID09PSBcImhpZGRlblwiXG4gICAgaW5wdXRzVW51c2VkW2tleV0gPSBpbnB1dHNVbnVzZWRba2V5XSAmJiAhaXNVc2VkXG4gICAgb25seUhpZGRlbklucHV0c1trZXldID0gb25seUhpZGRlbklucHV0c1trZXldICYmIGlzSGlkZGVuXG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHtpbnB1dHNVbnVzZWQ6IHt9LCBvbmx5SGlkZGVuSW5wdXRzOiB7fX0pXG5cbiAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSl7XG4gICAgaWYob25seU5hbWVzLmxlbmd0aCA9PT0gMCB8fCBvbmx5TmFtZXMuaW5kZXhPZihrZXkpID49IDApe1xuICAgICAgbGV0IGlzVW51c2VkID0gaW5wdXRzVW51c2VkW2tleV1cbiAgICAgIGxldCBoaWRkZW4gPSBvbmx5SGlkZGVuSW5wdXRzW2tleV1cbiAgICAgIGlmKGlzVW51c2VkICYmICEoc3VibWl0dGVyICYmIHN1Ym1pdHRlci5uYW1lID09IGtleSkgJiYgIWhpZGRlbil7XG4gICAgICAgIHBhcmFtcy5hcHBlbmQocHJlcGVuZEZvcm1EYXRhS2V5KGtleSwgXCJfdW51c2VkX1wiKSwgXCJcIilcbiAgICAgIH1cbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpXG4gICAgfVxuICB9XG5cbiAgLy8gcmVtb3ZlIHRoZSBpbmplY3RlZCBlbGVtZW50IGFnYWluXG4gIC8vIChpdCB3b3VsZCBiZSByZW1vdmVkIGJ5IHRoZSBuZXh0IGRvbSBwYXRjaCBhbnl3YXksIGJ1dCB0aGlzIGlzIGNsZWFuZXIpXG4gIGlmKHN1Ym1pdHRlciAmJiBpbmplY3RlZEVsZW1lbnQpe1xuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGluamVjdGVkRWxlbWVudClcbiAgfVxuXG4gIHJldHVybiBwYXJhbXMudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgc3RhdGljIGNsb3Nlc3RWaWV3KGVsKXtcbiAgICBsZXQgbGl2ZVZpZXdFbCA9IGVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpXG4gICAgcmV0dXJuIGxpdmVWaWV3RWwgPyBET00ucHJpdmF0ZShsaXZlVmlld0VsLCBcInZpZXdcIikgOiBudWxsXG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbCwgbGl2ZVNvY2tldCwgcGFyZW50VmlldywgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZmxhc2ggPSBmbGFzaFxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Vmlld1xuICAgIHRoaXMucm9vdCA9IHBhcmVudFZpZXcgPyBwYXJlbnRWaWV3LnJvb3QgOiB0aGlzXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgXCJ2aWV3XCIsIHRoaXMpXG4gICAgdGhpcy5pZCA9IHRoaXMuZWwuaWRcbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLmxhc3RBY2tSZWYgPSBudWxsXG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMubG9hZGVyVGltZXIgPSBudWxsXG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnJlZGlyZWN0ID0gZmFsc2VcbiAgICB0aGlzLmhyZWYgPSBudWxsXG4gICAgdGhpcy5qb2luQ291bnQgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmpvaW5Db3VudCAtIDEgOiAwXG4gICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSBmdW5jdGlvbihvbkRvbmUpeyBvbkRvbmUgJiYgb25Eb25lKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSB0aGlzLnBhcmVudCA/IG51bGwgOiBbXVxuICAgIHRoaXMudmlld0hvb2tzID0ge31cbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gW11cbiAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5wYXJlbnQgPyBudWxsIDoge31cbiAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0gPSB7fVxuICAgIHRoaXMuZm9ybXNGb3JSZWNvdmVyeSA9IHt9XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5saXZlU29ja2V0LmNoYW5uZWwoYGx2OiR7dGhpcy5pZH1gLCAoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5ocmVmICYmIHRoaXMuZXhwYW5kVVJMKHRoaXMuaHJlZilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0OiB0aGlzLnJlZGlyZWN0ID8gdXJsIDogdW5kZWZpbmVkLFxuICAgICAgICB1cmw6IHRoaXMucmVkaXJlY3QgPyB1bmRlZmluZWQgOiB1cmwgfHwgdW5kZWZpbmVkLFxuICAgICAgICBwYXJhbXM6IHRoaXMuY29ubmVjdFBhcmFtcyhsaXZlUmVmZXJlciksXG4gICAgICAgIHNlc3Npb246IHRoaXMuZ2V0U2Vzc2lvbigpLFxuICAgICAgICBzdGF0aWM6IHRoaXMuZ2V0U3RhdGljKCksXG4gICAgICAgIGZsYXNoOiB0aGlzLmZsYXNoLFxuICAgICAgICBzdGlja3k6IHRoaXMuZWwuaGFzQXR0cmlidXRlKFBIWF9TVElDS1kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHNldEhyZWYoaHJlZil7IHRoaXMuaHJlZiA9IGhyZWYgfVxuXG4gIHNldFJlZGlyZWN0KGhyZWYpe1xuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlXG4gICAgdGhpcy5ocmVmID0gaHJlZlxuICB9XG5cbiAgaXNNYWluKCl7IHJldHVybiB0aGlzLmVsLmhhc0F0dHJpYnV0ZShQSFhfTUFJTikgfVxuXG4gIGNvbm5lY3RQYXJhbXMobGl2ZVJlZmVyZXIpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG4gICAgcGFyYW1zW1wiX21vdW50X2F0dGVtcHRzXCJdID0gdGhpcy5qb2luQXR0ZW1wdHNcbiAgICBwYXJhbXNbXCJfbGl2ZV9yZWZlcmVyXCJdID0gbGl2ZVJlZmVyZXJcbiAgICB0aGlzLmpvaW5BdHRlbXB0cysrXG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfTE9BRElOR19DTEFTUyxcbiAgICAgIFBIWF9FUlJPUl9DTEFTUyxcbiAgICAgIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gICAgICBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9MT0FESU5HX0NMQVNTKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWNBbGwoYmluZGluZyl7XG4gICAgRE9NLmFsbCh0aGlzLmVsLCBgWyR7YmluZGluZ31dYCwgZWwgPT4gdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKGJpbmRpbmcpKSlcbiAgfVxuXG4gIGhpZGVMb2FkZXIoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5kaXNjb25uZWN0ZWRUaW1lcilcbiAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoUEhYX0NPTk5FQ1RFRF9DTEFTUylcbiAgICB0aGlzLmV4ZWNBbGwodGhpcy5iaW5kaW5nKFwiY29ubmVjdGVkXCIpKVxuICB9XG5cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX3JlY29ubmVjdGVkKCkgfVxuICB9XG5cbiAgbG9nKGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIC8vIGNhbGxzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSB2aWV3IGFuZCB0YXJnZXQgZWxlbWVudCBmb3IgdGhlIGdpdmVuIHBoeFRhcmdldFxuICAvLyB0YXJnZXRzIGNhbiBiZTpcbiAgLy8gICogYW4gZWxlbWVudCBpdHNlbGYsIHRoZW4gaXQgaXMgc2ltcGx5IHBhc3NlZCB0byBsaXZlU29ja2V0Lm93bmVyO1xuICAvLyAgKiBhIENJRCAoQ29tcG9uZW50IElEKSwgdGhlbiB3ZSBmaXJzdCBzZWFyY2ggdGhlIGNvbXBvbmVudCdzIGVsZW1lbnQgaW4gdGhlIERPTVxuICAvLyAgKiBhIHNlbGVjdG9yLCB0aGVuIHdlIHNlYXJjaCB0aGUgc2VsZWN0b3IgaW4gdGhlIERPTSBhbmQgY2FsbCB0aGUgY2FsbGJhY2tcbiAgLy8gICAgZm9yIGVhY2ggZWxlbWVudCBmb3VuZCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIG93bmVyIHZpZXdcbiAgd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrLCBkb20gPSBkb2N1bWVudCwgdmlld0VsKXtcbiAgICAvLyBpbiB0aGUgZm9ybSByZWNvdmVyeSBjYXNlIHdlIHNlYXJjaCBpbiBhIHRlbXBsYXRlIGZyYWdtZW50IGluc3RlYWQgb2ZcbiAgICAvLyB0aGUgcmVhbCBkb20sIHRoZXJlZm9yZSB3ZSBvcHRpb25hbGx5IHBhc3MgZG9tIGFuZCB2aWV3RWxcblxuICAgIGlmKHBoeFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IHBoeFRhcmdldCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpe1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5vd25lcihwaHhUYXJnZXQsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgcGh4VGFyZ2V0KSlcbiAgICB9XG5cbiAgICBpZihpc0NpZChwaHhUYXJnZXQpKXtcbiAgICAgIGxldCB0YXJnZXRzID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh2aWV3RWwgfHwgdGhpcy5lbCwgcGh4VGFyZ2V0KVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApe1xuICAgICAgICBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvdW5kIG1hdGNoaW5nIHBoeC10YXJnZXQgb2YgJHtwaHhUYXJnZXR9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMsIHBhcnNlSW50KHBoeFRhcmdldCkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRzID0gQXJyYXkuZnJvbShkb20ucXVlcnlTZWxlY3RvckFsbChwaHhUYXJnZXQpKVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm90aGluZyBmb3VuZCBtYXRjaGluZyB0aGUgcGh4LXRhcmdldCBzZWxlY3RvciBcIiR7cGh4VGFyZ2V0fVwiYCkgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldCA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHRhcmdldCkpKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5RGlmZih0eXBlLCByYXdEaWZmLCBjYWxsYmFjayl7XG4gICAgdGhpcy5sb2codHlwZSwgKCkgPT4gW1wiXCIsIGNsb25lKHJhd0RpZmYpXSlcbiAgICBsZXQge2RpZmYsIHJlcGx5LCBldmVudHMsIHRpdGxlfSA9IFJlbmRlcmVkLmV4dHJhY3QocmF3RGlmZilcbiAgICBjYWxsYmFjayh7ZGlmZiwgcmVwbHksIGV2ZW50c30pXG4gICAgaWYodHlwZW9mIHRpdGxlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT0gXCJtb3VudFwiKXsgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBET00ucHV0VGl0bGUodGl0bGUpKSB9XG4gIH1cblxuICBvbkpvaW4ocmVzcCl7XG4gICAgbGV0IHtyZW5kZXJlZCwgY29udGFpbmVyLCBsaXZldmlld192ZXJzaW9ufSA9IHJlc3BcbiAgICBpZihjb250YWluZXIpe1xuICAgICAgbGV0IFt0YWcsIGF0dHJzXSA9IGNvbnRhaW5lclxuICAgICAgdGhpcy5lbCA9IERPTS5yZXBsYWNlUm9vdENvbnRhaW5lcih0aGlzLmVsLCB0YWcsIGF0dHJzKVxuICAgIH1cbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmZsYXNoID0gbnVsbFxuICAgIGlmKHRoaXMucm9vdCA9PT0gdGhpcyl7XG4gICAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB0aGlzLmdldEZvcm1zRm9yUmVjb3ZlcnkoKVxuICAgIH1cbiAgICBpZih0aGlzLmlzTWFpbigpICYmIHdpbmRvdy5oaXN0b3J5LnN0YXRlID09PSBudWxsKXtcbiAgICAgIC8vIHNldCBpbml0aWFsIGhpc3RvcnkgZW50cnkgaWYgdGhpcyBpcyB0aGUgZmlyc3QgcGFnZSBsb2FkIChubyBoaXN0b3J5KVxuICAgICAgQnJvd3Nlci5wdXNoU3RhdGUoXCJyZXBsYWNlXCIsIHtcbiAgICAgICAgdHlwZTogXCJwYXRjaFwiLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgcG9zaXRpb246IHRoaXMubGl2ZVNvY2tldC5jdXJyZW50SGlzdG9yeVBvc2l0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGxpdmV2aWV3X3ZlcnNpb24gIT09IHRoaXMubGl2ZVNvY2tldC52ZXJzaW9uKCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTGl2ZVZpZXcgYXNzZXQgdmVyc2lvbiBtaXNtYXRjaC4gSmF2YVNjcmlwdCB2ZXJzaW9uICR7dGhpcy5saXZlU29ja2V0LnZlcnNpb24oKX0gdnMuIHNlcnZlciAke2xpdmV2aWV3X3ZlcnNpb259LiBUbyBhdm9pZCBpc3N1ZXMsIHBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGFzc2V0cyB1c2UgdGhlIHNhbWUgdmVyc2lvbiBhcyB0aGUgc2VydmVyLmApXG4gICAgfVxuXG4gICAgQnJvd3Nlci5kcm9wTG9jYWwodGhpcy5saXZlU29ja2V0LmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTKVxuICAgIHRoaXMuYXBwbHlEaWZmKFwibW91bnRcIiwgcmVuZGVyZWQsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IG5ldyBSZW5kZXJlZCh0aGlzLmlkLCBkaWZmKVxuICAgICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyQ29udGFpbmVyKG51bGwsIFwiam9pblwiKVxuICAgICAgdGhpcy5kcm9wUGVuZGluZ1JlZnMoKVxuICAgICAgdGhpcy5qb2luQ291bnQrK1xuICAgICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG5cbiAgICAgIHRoaXMubWF5YmVSZWNvdmVyRm9ybXMoaHRtbCwgKCkgPT4ge1xuICAgICAgICB0aGlzLm9uSm9pbkNvbXBsZXRlKHJlc3AsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRyb3BQZW5kaW5nUmVmcygpe1xuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYCwgZWwgPT4ge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfTE9BRElORylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbkNvbXBsZXRlKHtsaXZlX3BhdGNofSwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICAvLyBJbiBvcmRlciB0byBwcm92aWRlIGEgYmV0dGVyIGV4cGVyaWVuY2UsIHdlIHdhbnQgdG8gam9pblxuICAgIC8vIGFsbCBMaXZlVmlld3MgZmlyc3QgYW5kIG9ubHkgdGhlbiBhcHBseSB0aGVpciBwYXRjaGVzLlxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSB8fCAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LmlzSm9pblBlbmRpbmcoKSkpe1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgIH1cblxuICAgIC8vIE9uZSBkb3duc2lkZSBvZiB0aGlzIGFwcHJvYWNoIGlzIHRoYXQgd2UgbmVlZCB0byBmaW5kIHBoeENoaWxkcmVuXG4gICAgLy8gaW4gdGhlIGh0bWwgZnJhZ21lbnQsIGluc3RlYWQgb2YgZGlyZWN0bHkgb24gdGhlIERPTS4gVGhlIGZyYWdtZW50XG4gICAgLy8gYWxzbyBkb2VzIG5vdCBpbmNsdWRlIFBIWF9TVEFUSUMsIHNvIHdlIG5lZWQgdG8gY29weSBpdCBvdmVyIGZyb21cbiAgICAvLyB0aGUgRE9NLlxuICAgIGxldCBuZXdDaGlsZHJlbiA9IERPTS5maW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHRoaXMuaWQpLmZpbHRlcih0b0VsID0+IHtcbiAgICAgIGxldCBmcm9tRWwgPSB0b0VsLmlkICYmIHRoaXMuZWwucXVlcnlTZWxlY3RvcihgW2lkPVwiJHt0b0VsLmlkfVwiXWApXG4gICAgICBsZXQgcGh4U3RhdGljID0gZnJvbUVsICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICAgIGlmKHBoeFN0YXRpYyl7IHRvRWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHBoeFN0YXRpYykgfVxuICAgICAgLy8gc2V0IFBIWF9ST09UX0lEIHRvIHByZXZlbnQgZXZlbnRzIGZyb20gYmVpbmcgZGlzcGF0Y2hlZCB0byB0aGUgcm9vdCB2aWV3XG4gICAgICAvLyB3aGlsZSB0aGUgY2hpbGQgam9pbiBpcyBzdGlsbCBwZW5kaW5nXG4gICAgICBpZihmcm9tRWwpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3QuaWQpIH1cbiAgICAgIHJldHVybiB0aGlzLmpvaW5DaGlsZCh0b0VsKVxuICAgIH0pXG5cbiAgICBpZihuZXdDaGlsZHJlbi5sZW5ndGggPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICAgIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICB9XG4gIH1cblxuICBhdHRhY2hUcnVlRG9jRWwoKXtcbiAgICB0aGlzLmVsID0gRE9NLmJ5SWQodGhpcy5pZClcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKVxuICB9XG5cbiAgLy8gdGhpcyBpcyBpbnZva2VkIGZvciBkZWFkIGFuZCBsaXZlIHZpZXdzLCBzbyB3ZSBtdXN0IGZpbHRlciBieVxuICAvLyBieSBvd25lciB0byBlbnN1cmUgd2UgYXJlbid0IGR1cGxpY2F0aW5nIGhvb2tzIGFjcm9zcyBkaXNjb25uZWN0XG4gIC8vIGFuZCBjb25uZWN0ZWQgc3RhdGVzLiBUaGlzIGFsc28gaGFuZGxlcyBjYXNlcyB3aGVyZSBob29rcyBleGlzdFxuICAvLyBpbiBhIHJvb3QgbGF5b3V0IHdpdGggYSBMViBpbiB0aGUgYm9keVxuICBleGVjTmV3TW91bnRlZChwYXJlbnQgPSB0aGlzLmVsKXtcbiAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUClcbiAgICBsZXQgcGh4Vmlld3BvcnRCb3R0b20gPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX0JPVFRPTSlcbiAgICBET00uYWxsKHBhcmVudCwgYFske3BoeFZpZXdwb3J0VG9wfV0sIFske3BoeFZpZXdwb3J0Qm90dG9tfV1gLCBob29rRWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChob29rRWwpKXtcbiAgICAgICAgRE9NLm1haW50YWluUHJpdmF0ZUhvb2tzKGhvb2tFbCwgaG9va0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dLCBbZGF0YS1waHgtJHtQSFhfSE9PS31dYCwgaG9va0VsID0+IHtcbiAgICAgIGlmKHRoaXMub3duc0VsZW1lbnQoaG9va0VsKSl7XG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9NT1VOVEVEKX1dYCwgZWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChlbCkpe1xuICAgICAgICB0aGlzLm1heWJlTW91bnRlZChlbClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICB0aGlzLmF0dGFjaFRydWVEb2NFbCgpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIHN0cmVhbXMsIG51bGwpXG4gICAgcGF0Y2gubWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKVxuICAgIHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCBmYWxzZSwgdHJ1ZSlcbiAgICB0aGlzLmpvaW5OZXdDaGlsZHJlbigpXG4gICAgdGhpcy5leGVjTmV3TW91bnRlZCgpXG5cbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG5cbiAgICBpZihsaXZlX3BhdGNoKXtcbiAgICAgIGxldCB7a2luZCwgdG99ID0gbGl2ZV9wYXRjaFxuICAgICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgICB9XG4gICAgdGhpcy5oaWRlTG9hZGVyKClcbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEpeyB0aGlzLnRyaWdnZXJSZWNvbm5lY3RlZCgpIH1cbiAgICB0aGlzLnN0b3BDYWxsYmFjaygpXG4gIH1cblxuICB0cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhmcm9tRWwsIHRvRWwpe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25CZWZvcmVFbFVwZGF0ZWRcIiwgW2Zyb21FbCwgdG9FbF0pXG4gICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soZnJvbUVsKVxuICAgIGxldCBpc0lnbm9yZWQgPSBob29rICYmIERPTS5pc0lnbm9yZWQoZnJvbUVsLCB0aGlzLmJpbmRpbmcoUEhYX1VQREFURSkpXG4gICAgaWYoaG9vayAmJiAhZnJvbUVsLmlzRXF1YWxOb2RlKHRvRWwpICYmICEoaXNJZ25vcmVkICYmIGlzRXF1YWxPYmooZnJvbUVsLmRhdGFzZXQsIHRvRWwuZGF0YXNldCkpKXtcbiAgICAgIGhvb2suX19iZWZvcmVVcGRhdGUoKVxuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gIH1cblxuICBtYXliZU1vdW50ZWQoZWwpe1xuICAgIGxldCBwaHhNb3VudGVkID0gZWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfTU9VTlRFRCkpXG4gICAgbGV0IGhhc0JlZW5JbnZva2VkID0gcGh4TW91bnRlZCAmJiBET00ucHJpdmF0ZShlbCwgXCJtb3VudGVkXCIpXG4gICAgaWYocGh4TW91bnRlZCAmJiAhaGFzQmVlbkludm9rZWQpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgcGh4TW91bnRlZClcbiAgICAgIERPTS5wdXRQcml2YXRlKGVsLCBcIm1vdW50ZWRcIiwgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBtYXliZUFkZE5ld0hvb2soZWwpe1xuICAgIGxldCBuZXdIb29rID0gdGhpcy5hZGRIb29rKGVsKVxuICAgIGlmKG5ld0hvb2speyBuZXdIb29rLl9fbW91bnRlZCgpIH1cbiAgfVxuXG4gIHBlcmZvcm1QYXRjaChwYXRjaCwgcHJ1bmVDaWRzLCBpc0pvaW5QYXRjaCA9IGZhbHNlKXtcbiAgICBsZXQgcmVtb3ZlZEVscyA9IFtdXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuICAgIGxldCB1cGRhdGVkSG9va0lkcyA9IG5ldyBTZXQoKVxuXG4gICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvblBhdGNoU3RhcnRcIiwgW3BhdGNoLnRhcmdldENvbnRhaW5lcl0pXG5cbiAgICBwYXRjaC5hZnRlcihcImFkZGVkXCIsIGVsID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25Ob2RlQWRkZWRcIiwgW2VsXSlcbiAgICAgIGxldCBwaHhWaWV3cG9ydFRvcCA9IHRoaXMuYmluZGluZyhQSFhfVklFV1BPUlRfVE9QKVxuICAgICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gdGhpcy5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgICBET00ubWFpbnRhaW5Qcml2YXRlSG9va3MoZWwsIGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhlbClcbiAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVNb3VudGVkKGVsKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbCA9PiB7XG4gICAgICBpZihET00uaXNQaHhTdGlja3koZWwpKXtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LmpvaW5Sb290Vmlld3MoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybShpc0pvaW5QYXRjaClcbiAgICB0aGlzLmFmdGVyRWxlbWVudHNSZW1vdmVkKHJlbW92ZWRFbHMsIHBydW5lQ2lkcylcblxuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25QYXRjaEVuZFwiLCBbcGF0Y2gudGFyZ2V0Q29udGFpbmVyXSlcbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgbGV0IGhvb2tzID0gRE9NLmFsbChwYXJlbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV0sIFtkYXRhLXBoeC1ob29rXWApXG4gICAgICBjb21wb25lbnRzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBsZXQgY2lkID0gdGhpcy5jb21wb25lbnRJRChlbClcbiAgICAgICAgaWYoaXNDaWQoY2lkKSAmJiBkZXN0cm95ZWRDSURzLmluZGV4T2YoY2lkKSA9PT0gLTEpeyBkZXN0cm95ZWRDSURzLnB1c2goY2lkKSB9XG4gICAgICB9KVxuICAgICAgaG9va3MuY29uY2F0KHBhcmVudCkuZm9yRWFjaChob29rRWwgPT4ge1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMuZ2V0SG9vayhob29rRWwpXG4gICAgICAgIGhvb2sgJiYgdGhpcy5kZXN0cm95SG9vayhob29rKVxuICAgICAgfSlcbiAgICB9KVxuICAgIC8vIFdlIHNob3VsZCBub3QgcHJ1bmVDaWRzIG9uIGpvaW5zLiBPdGhlcndpc2UsIGluIGNhc2Ugb2ZcbiAgICAvLyByZWpvaW5zLCB3ZSBtYXkgbm90aWZ5IGNpZHMgdGhhdCBubyBsb25nZXIgYmVsb25nIHRvIHRoZVxuICAgIC8vIGN1cnJlbnQgTGl2ZVZpZXcgdG8gYmUgcmVtb3ZlZC5cbiAgICBpZihwcnVuZUNpZHMpe1xuICAgICAgdGhpcy5tYXliZVB1c2hDb21wb25lbnRzRGVzdHJveWVkKGRlc3Ryb3llZENJRHMpXG4gICAgfVxuICB9XG5cbiAgam9pbk5ld0NoaWxkcmVuKCl7XG4gICAgRE9NLmZpbmRQaHhDaGlsZHJlbih0aGlzLmVsLCB0aGlzLmlkKS5mb3JFYWNoKGVsID0+IHRoaXMuam9pbkNoaWxkKGVsKSlcbiAgfVxuXG4gIG1heWJlUmVjb3ZlckZvcm1zKGh0bWwsIGNhbGxiYWNrKXtcbiAgICBjb25zdCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICBjb25zdCBvbGRGb3JtcyA9IHRoaXMucm9vdC5mb3Jtc0ZvclJlY292ZXJ5XG4gICAgLy8gU28gd2h5IGRvIHdlIGNyZWF0ZSBhIHRlbXBsYXRlIGVsZW1lbnQgaGVyZT9cbiAgICAvLyBPbmUgd2F5IHRvIHJlY292ZXIgZm9ybXMgd291bGQgYmUgdG8gaW1tZWRpYXRlbHkgYXBwbHkgdGhlIG1vdW50XG4gICAgLy8gcGF0Y2ggYW5kIHRoZW4gYWZ0ZXJ3YXJkcyByZWNvdmVyIHRoZSBmb3Jtcy4gSG93ZXZlciwgdGhpcyB3b3VsZFxuICAgIC8vIGNhdXNlIGEgZmxpY2tlciwgYmVjYXVzZSB0aGUgbW91bnQgcGF0Y2ggd291bGQgcmVtb3ZlIHRoZSBmb3JtIGNvbnRlbnRcbiAgICAvLyB1bnRpbCBpdCBpcyByZXN0b3JlZC4gVGhlcmVmb3JlIExWIGRlY2lkZWQgdG8gZG8gZm9ybSByZWNvdmVyeSB3aXRoIHRoZVxuICAgIC8vIHJhdyBIVE1MIGJlZm9yZSBpdCBpcyBhcHBsaWVkIGFuZCBkZWxheSB0aGUgbW91bnQgcGF0Y2ggdW50aWwgdGhlIGZvcm1cbiAgICAvLyByZWNvdmVyeSBldmVudHMgYXJlIGRvbmUuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIC8vIGJlY2F1c2Ugd2Ugd29yayB3aXRoIGEgdGVtcGxhdGUgZWxlbWVudCwgd2UgbXVzdCBtYW51YWxseSBjb3B5IHRoZSBhdHRyaWJ1dGVzXG4gICAgLy8gb3RoZXJ3aXNlIHRoZSBvd25lciAvIHRhcmdldCBoZWxwZXJzIGRvbid0IHdvcmsgcHJvcGVybHlcbiAgICBjb25zdCByb290RWwgPSB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgcm9vdEVsLmlkID0gdGhpcy5pZFxuICAgIHJvb3RFbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdC5pZClcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCB0aGlzLmdldFNlc3Npb24oKSlcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHRoaXMuZ2V0U3RhdGljKCkpXG4gICAgcm9vdEVsLnNldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lELCB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmlkIDogbnVsbClcblxuICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm0gZWxlbWVudHMgaW4gdGhlIG5ldyBIVE1MIGZvciB0aGUgTFZcbiAgICAvLyBhbmQgbG9vayBmb3Igb2xkIGZvcm1zIGluIHRoZSBgZm9ybXNGb3JSZWNvdmVyeWAgb2JqZWN0O1xuICAgIC8vIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IGNhbiBhbHNvIGNvbnRhaW4gZm9ybXMgZnJvbSBjaGlsZCB2aWV3c1xuICAgIGNvbnN0IGZvcm1zVG9SZWNvdmVyID1cbiAgICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm1zIGluIHRoZSBuZXcgRE9NOyBiZWNhdXNlIHRoaXMgaXMgb25seSB0aGUgSFRNTCBmb3IgdGhlIGN1cnJlbnRcbiAgICAgIC8vIHZpZXcsIHdlIGNhbiBiZSBzdXJlIHRoYXQgYWxsIGZvcm1zIGFyZSBvd25lZCBieSB0aGlzIHZpZXc6XG4gICAgICBET00uYWxsKHRlbXBsYXRlLmNvbnRlbnQsIFwiZm9ybVwiKVxuICAgICAgICAvLyBvbmx5IHJlY292ZXIgZm9ybXMgdGhhdCBoYXZlIGFuIGlkIGFuZCBhcmUgaW4gdGhlIG9sZCBET01cbiAgICAgICAgLmZpbHRlcihuZXdGb3JtID0+IG5ld0Zvcm0uaWQgJiYgb2xkRm9ybXNbbmV3Rm9ybS5pZF0pXG4gICAgICAgIC8vIGFiYW5kb24gZm9ybXMgd2UgYWxyZWFkeSB0cmllZCB0byByZWNvdmVyIHRvIHByZXZlbnQgbG9vcGluZyBhIGZhaWxlZCBzdGF0ZVxuICAgICAgICAuZmlsdGVyKG5ld0Zvcm0gPT4gIXRoaXMucGVuZGluZ0Zvcm1zLmhhcyhuZXdGb3JtLmlkKSlcbiAgICAgICAgLy8gb25seSByZWNvdmVyIGlmIHRoZSBmb3JtIGhhcyB0aGUgc2FtZSBwaHgtY2hhbmdlIHZhbHVlXG4gICAgICAgIC5maWx0ZXIobmV3Rm9ybSA9PiBvbGRGb3Jtc1tuZXdGb3JtLmlkXS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSA9PT0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSlcbiAgICAgICAgLm1hcChuZXdGb3JtID0+IHtcbiAgICAgICAgICByZXR1cm4gW29sZEZvcm1zW25ld0Zvcm0uaWRdLCBuZXdGb3JtXVxuICAgICAgICB9KVxuXG4gICAgaWYoZm9ybXNUb1JlY292ZXIubGVuZ3RoID09PSAwKXtcbiAgICAgIHJldHVybiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgZm9ybXNUb1JlY292ZXIuZm9yRWFjaCgoW29sZEZvcm0sIG5ld0Zvcm1dLCBpKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdGb3Jtcy5hZGQobmV3Rm9ybS5pZClcbiAgICAgIC8vIGl0IGlzIGltcG9ydGFudCB0byB1c2UgdGhlIGZpcnN0RWxlbWVudENoaWxkIG9mIHRoZSB0ZW1wbGF0ZSBjb250ZW50XG4gICAgICAvLyBiZWNhdXNlIHdoZW4gdHJhdmVyc2luZyBhIGRvY3VtZW50RnJhZ21lbnQgdXNpbmcgcGFyZW50Tm9kZSwgd2Ugd29uJ3QgZXZlciBhcnJpdmUgYXRcbiAgICAgIC8vIHRoZSBmcmFnbWVudDsgYXMgdGhlIHRlbXBsYXRlIGlzIGFsd2F5cyBhIExpdmVWaWV3LCB3ZSBjYW4gYmUgc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHlcbiAgICAgIC8vIG9uZSBjaGlsZCBvbiB0aGUgcm9vdCBsZXZlbFxuICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KG9sZEZvcm0sIG5ld0Zvcm0sIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsICgpID0+IHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRm9ybXMuZGVsZXRlKG5ld0Zvcm0uaWQpXG4gICAgICAgIC8vIHdlIG9ubHkgY2FsbCB0aGUgY2FsbGJhY2sgb25jZSBhbGwgZm9ybXMgaGF2ZSBiZWVuIHJlY292ZXJlZFxuICAgICAgICBpZihpID09PSBmb3Jtc1RvUmVjb3Zlci5sZW5ndGggLSAxKXtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldENoaWxkQnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1baWRdIH1cblxuICBnZXREZXNjZW5kZW50QnlFbChlbCl7XG4gICAgaWYoZWwuaWQgPT09IHRoaXMuaWQpe1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXT8uW2VsLmlkXVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lEZXNjZW5kZW50KGlkKXtcbiAgICBmb3IobGV0IHBhcmVudElkIGluIHRoaXMucm9vdC5jaGlsZHJlbil7XG4gICAgICBmb3IobGV0IGNoaWxkSWQgaW4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXSl7XG4gICAgICAgIGlmKGNoaWxkSWQgPT09IGlkKXsgcmV0dXJuIHRoaXMucm9vdC5jaGlsZHJlbltwYXJlbnRJZF1bY2hpbGRJZF0uZGVzdHJveSgpIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBqb2luQ2hpbGQoZWwpe1xuICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGRCeUlkKGVsLmlkKVxuICAgIGlmKCFjaGlsZCl7XG4gICAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLmxpdmVTb2NrZXQsIHRoaXMpXG4gICAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1bdmlldy5pZF0gPSB2aWV3XG4gICAgICB2aWV3LmpvaW4oKVxuICAgICAgdGhpcy5jaGlsZEpvaW5zKytcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgaXNKb2luUGVuZGluZygpeyByZXR1cm4gdGhpcy5qb2luUGVuZGluZyB9XG5cbiAgYWNrSm9pbihfY2hpbGQpe1xuICAgIHRoaXMuY2hpbGRKb2lucy0tXG5cbiAgICBpZih0aGlzLmNoaWxkSm9pbnMgPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnBhcmVudC5hY2tKb2luKHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpe1xuICAgIC8vIHdlIGNhbiBjbGVhciBwZW5kaW5nIGZvcm0gcmVjb3ZlcmllcyBub3cgdGhhdCB3ZSd2ZSBqb2luZWQuXG4gICAgLy8gVGhleSBlaXRoZXIgYWxsIHJlc29sdmVkIG9yIHdlcmUgYWJhbmRvbmVkXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMuY2xlYXIoKVxuICAgIC8vIHdlIGNhbiBhbHNvIGNsZWFyIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IG9iamVjdCB0byBub3Qga2VlcCBvbGQgZm9ybSBlbGVtZW50cyBhcm91bmRcbiAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB7fVxuICAgIHRoaXMuam9pbkNhbGxiYWNrKCgpID0+IHtcbiAgICAgIHRoaXMucGVuZGluZ0pvaW5PcHMuZm9yRWFjaCgoW3ZpZXcsIG9wXSkgPT4ge1xuICAgICAgICBpZighdmlldy5pc0Rlc3Ryb3llZCgpKXsgb3AoKSB9XG4gICAgICB9KVxuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcyA9IFtdXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZShkaWZmLCBldmVudHMsIGlzUGVuZGluZz1mYWxzZSl7XG4gICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkgfHwgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHRoaXMucm9vdC5pc01haW4oKSkpe1xuICAgICAgLy8gZG9uJ3QgbXV0YXRlIGlmIHRoaXMgaXMgYWxyZWFkeSBhIHBlbmRpbmcgZGlmZlxuICAgICAgaWYoIWlzUGVuZGluZyl7XG4gICAgICAgIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goe2RpZmYsIGV2ZW50c30pXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVkLm1lcmdlRGlmZihkaWZmKVxuICAgIGxldCBwaHhDaGlsZHJlbkFkZGVkID0gZmFsc2VcblxuICAgIC8vIFdoZW4gdGhlIGRpZmYgb25seSBjb250YWlucyBjb21wb25lbnQgZGlmZnMsIHRoZW4gd2FsayBjb21wb25lbnRzXG4gICAgLy8gYW5kIHBhdGNoIG9ubHkgdGhlIHBhcmVudCBjb21wb25lbnQgY29udGFpbmVycyBmb3VuZCBpbiB0aGUgZGlmZi5cbiAgICAvLyBPdGhlcndpc2UsIHBhdGNoIGVudGlyZSBMViBjb250YWluZXIuXG4gICAgaWYodGhpcy5yZW5kZXJlZC5pc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiY29tcG9uZW50IHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IHBhcmVudENpZHMgPSBET00uZmluZEV4aXN0aW5nUGFyZW50Q0lEcyh0aGlzLmVsLCB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikpXG4gICAgICAgIHBhcmVudENpZHMuZm9yRWFjaChwYXJlbnRDSUQgPT4ge1xuICAgICAgICAgIGlmKHRoaXMuY29tcG9uZW50UGF0Y2godGhpcy5yZW5kZXJlZC5nZXRDb21wb25lbnQoZGlmZiwgcGFyZW50Q0lEKSwgcGFyZW50Q0lEKSl7IHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCFpc0VtcHR5KGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiZnVsbCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlckNvbnRhaW5lcihkaWZmLCBcInVwZGF0ZVwiKVxuICAgICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgc3RyZWFtcywgbnVsbClcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIGlmKHBoeENoaWxkcmVuQWRkZWQpeyB0aGlzLmpvaW5OZXdDaGlsZHJlbigpIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICByZW5kZXJDb250YWluZXIoZGlmZiwga2luZCl7XG4gICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC50aW1lKGB0b1N0cmluZyBkaWZmICgke2tpbmR9KWAsICgpID0+IHtcbiAgICAgIGxldCB0YWcgPSB0aGlzLmVsLnRhZ05hbWVcbiAgICAgIC8vIERvbid0IHNraXAgYW55IGNvbXBvbmVudCBpbiB0aGUgZGlmZiBub3IgYW55IG1hcmtlZCBhcyBwcnVuZWRcbiAgICAgIC8vIChhcyB0aGV5IG1heSBoYXZlIGJlZW4gYWRkZWQgYmFjaylcbiAgICAgIGxldCBjaWRzID0gZGlmZiA/IHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKSA6IG51bGxcbiAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlcmVkLnRvU3RyaW5nKGNpZHMpXG4gICAgICByZXR1cm4gW2A8JHt0YWd9PiR7aHRtbH08LyR7dGFnfT5gLCBzdHJlYW1zXVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRQYXRjaChkaWZmLCBjaWQpe1xuICAgIGlmKGlzRW1wdHkoZGlmZikpIHJldHVybiBmYWxzZVxuICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudFRvU3RyaW5nKGNpZClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgc3RyZWFtcywgY2lkKVxuICAgIGxldCBjaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpXG4gICAgcmV0dXJuIGNoaWxkcmVuQWRkZWRcbiAgfVxuXG4gIGdldEhvb2soZWwpeyByZXR1cm4gdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGVsKV0gfVxuXG4gIGFkZEhvb2soZWwpe1xuICAgIGxldCBob29rRWxJZCA9IFZpZXdIb29rLmVsZW1lbnRJRChlbClcblxuICAgIC8vIG9ubHkgZXZlciB0cnkgdG8gYWRkIGhvb2tzIHRvIGVsZW1lbnRzIG93bmVkIGJ5IHRoaXMgdmlld1xuICAgIGlmKGVsLmdldEF0dHJpYnV0ZSAmJiAhdGhpcy5vd25zRWxlbWVudChlbCkpeyByZXR1cm4gfVxuXG4gICAgaWYoaG9va0VsSWQgJiYgIXRoaXMudmlld0hvb2tzW2hvb2tFbElkXSl7XG4gICAgICAvLyBob29rIGNyZWF0ZWQsIGJ1dCBub3QgYXR0YWNoZWQgKGNyZWF0ZUhvb2sgZm9yIHdlYiBjb21wb25lbnQpXG4gICAgICBsZXQgaG9vayA9IERPTS5nZXRDdXN0b21FbEhvb2soZWwpIHx8IGxvZ0Vycm9yKGBubyBob29rIGZvdW5kIGZvciBjdXN0b20gZWxlbWVudDogJHtlbC5pZH1gKVxuICAgICAgdGhpcy52aWV3SG9va3NbaG9va0VsSWRdID0gaG9va1xuICAgICAgaG9vay5fX2F0dGFjaFZpZXcodGhpcylcbiAgICAgIHJldHVybiBob29rXG4gICAgfVxuICAgIGVsc2UgaWYoaG9va0VsSWQgfHwgIWVsLmdldEF0dHJpYnV0ZSl7XG4gICAgICAvLyBubyBob29rIGZvdW5kXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbmV3IGhvb2sgZm91bmQgd2l0aCBwaHgtaG9vayBhdHRyaWJ1dGVcbiAgICAgIGxldCBob29rTmFtZSA9IGVsLmdldEF0dHJpYnV0ZShgZGF0YS1waHgtJHtQSFhfSE9PS31gKSB8fCBlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9IT09LKSlcbiAgICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLmxpdmVTb2NrZXQuZ2V0SG9va0NhbGxiYWNrcyhob29rTmFtZSlcblxuICAgICAgaWYoY2FsbGJhY2tzKXtcbiAgICAgICAgaWYoIWVsLmlkKXsgbG9nRXJyb3IoYG5vIERPTSBJRCBmb3IgaG9vayBcIiR7aG9va05hbWV9XCIuIEhvb2tzIHJlcXVpcmUgYSB1bmlxdWUgSUQgb24gZWFjaCBlbGVtZW50LmAsIGVsKSB9XG4gICAgICAgIGxldCBob29rID0gbmV3IFZpZXdIb29rKHRoaXMsIGVsLCBjYWxsYmFja3MpXG4gICAgICAgIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV0gPSBob29rXG4gICAgICAgIHJldHVybiBob29rXG4gICAgICB9IGVsc2UgaWYoaG9va05hbWUgIT09IG51bGwpe1xuICAgICAgICBsb2dFcnJvcihgdW5rbm93biBob29rIGZvdW5kIGZvciBcIiR7aG9va05hbWV9XCJgLCBlbClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95SG9vayhob29rKXtcbiAgICAvLyBfX2Rlc3Ryb3llZCBjbGVhcnMgdGhlIGVsZW1lbnRJRCBmcm9tIHRoZSBob29rLCB0aGVyZWZvcmVcbiAgICAvLyB3ZSBuZWVkIHRvIGdldCBpdCBiZWZvcmUgY2FsbGluZyBfX2Rlc3Ryb3llZFxuICAgIGNvbnN0IGhvb2tJZCA9IFZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKVxuICAgIGhvb2suX19kZXN0cm95ZWQoKVxuICAgIGhvb2suX19jbGVhbnVwX18oKVxuICAgIGRlbGV0ZSB0aGlzLnZpZXdIb29rc1tob29rSWRdXG4gIH1cblxuICBhcHBseVBlbmRpbmdVcGRhdGVzKCl7XG4gICAgLy8gVG8gcHJldmVudCByYWNlIGNvbmRpdGlvbnMgd2hlcmUgd2UgbWlnaHQgc3RpbGwgYmUgcGVuZGluZyBhIG5ld1xuICAgIC8vIG5hdmlnYXRpb24gb3IgdGhlIGpvaW4gaXMgc3RpbGwgcGVuZGluZywgYHRoaXMudXBkYXRlYCByZXR1cm5zIGZhbHNlXG4gICAgLy8gaWYgdGhlIGRpZmYgd2FzIG5vdCBhcHBsaWVkLlxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gdGhpcy5wZW5kaW5nRGlmZnMuZmlsdGVyKFxuICAgICAgKHtkaWZmLCBldmVudHN9KSA9PiAhdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzLCB0cnVlKSxcbiAgICApXG4gICAgdGhpcy5lYWNoQ2hpbGQoKGNoaWxkKSA9PiBjaGlsZC5hcHBseVBlbmRpbmdVcGRhdGVzKCkpXG4gIH1cblxuICBlYWNoQ2hpbGQoY2FsbGJhY2spe1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSB8fCB7fVxuICAgIGZvcihsZXQgaWQgaW4gY2hpbGRyZW4peyBjYWxsYmFjayh0aGlzLmdldENoaWxkQnlJZChpZCkpIH1cbiAgfVxuXG4gIG9uQ2hhbm5lbChldmVudCwgY2Ipe1xuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiBjYihyZXNwKV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZENoYW5uZWwoKXtcbiAgICAvLyBUaGUgZGlmZiBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgcmVndWxhciB1cGRhdGUgb3BlcmF0aW9ucy5cbiAgICAvLyBBbGwgb3RoZXIgb3BlcmF0aW9ucyBhcmUgcXVldWVkIHRvIGJlIGFwcGxpZWQgb25seSBhZnRlciBqb2luLlxuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBcImRpZmZcIiwgKHJhd0RpZmYpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmF3RGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMub25DaGFubmVsKFwicmVkaXJlY3RcIiwgKHt0bywgZmxhc2h9KSA9PiB0aGlzLm9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0pKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9yZWRpcmVjdFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUmVkaXJlY3QocmVkaXIpKVxuICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLm9uRXJyb3IocmVhc29uKSlcbiAgICB0aGlzLmNoYW5uZWwub25DbG9zZShyZWFzb24gPT4gdGhpcy5vbkNsb3NlKHJlYXNvbikpXG4gIH1cblxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKXsgdGhpcy5lYWNoQ2hpbGQoY2hpbGQgPT4gY2hpbGQuZGVzdHJveSgpKSB9XG5cbiAgb25MaXZlUmVkaXJlY3QocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmQsIGZsYXNofSA9IHJlZGlyXG4gICAgbGV0IHVybCA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OnNlcnZlci1uYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7dG8sIGtpbmQsIGZsYXNofX0pXG4gICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlSZWRpcmVjdChlLCB1cmwsIGtpbmQsIGZsYXNoKVxuICB9XG5cbiAgb25MaXZlUGF0Y2gocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmR9ID0gcmVkaXJcbiAgICB0aGlzLmhyZWYgPSB0aGlzLmV4cGFuZFVSTCh0bylcbiAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVBhdGNoKHRvLCBraW5kKVxuICB9XG5cbiAgZXhwYW5kVVJMKHRvKXtcbiAgICByZXR1cm4gdG8uc3RhcnRzV2l0aChcIi9cIikgPyBgJHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0fSR7dG99YCA6IHRvXG4gIH1cblxuICBvblJlZGlyZWN0KHt0bywgZmxhc2gsIHJlbG9hZFRva2VufSl7IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh0bywgZmxhc2gsIHJlbG9hZFRva2VuKSB9XG5cbiAgaXNEZXN0cm95ZWQoKXsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICBqb2luRGVhZCgpeyB0aGlzLmlzRGVhZCA9IHRydWUgfVxuXG4gIGpvaW5QdXNoKCl7XG4gICAgdGhpcy5qb2luUHVzaCA9IHRoaXMuam9pblB1c2ggfHwgdGhpcy5jaGFubmVsLmpvaW4oKVxuICAgIHJldHVybiB0aGlzLmpvaW5QdXNoXG4gIH1cblxuICBqb2luKGNhbGxiYWNrKXtcbiAgICB0aGlzLnNob3dMb2FkZXIodGhpcy5saXZlU29ja2V0LmxvYWRlclRpbWVvdXQpXG4gICAgdGhpcy5iaW5kQ2hhbm5lbCgpXG4gICAgaWYodGhpcy5pc01haW4oKSl7XG4gICAgICB0aGlzLnN0b3BDYWxsYmFjayA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiaW5pdGlhbFwifSlcbiAgICB9XG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSAob25Eb25lKSA9PiB7XG4gICAgICBvbkRvbmUgPSBvbkRvbmUgfHwgZnVuY3Rpb24oKXt9XG4gICAgICBjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuam9pbkNvdW50LCBvbkRvbmUpIDogb25Eb25lKClcbiAgICB9XG5cbiAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5qb2luKCksIHtcbiAgICAgIG9rOiAocmVzcCkgPT4gdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4gdGhpcy5vbkpvaW4ocmVzcCkpLFxuICAgICAgZXJyb3I6IChlcnJvcikgPT4gdGhpcy5vbkpvaW5FcnJvcihlcnJvciksXG4gICAgICB0aW1lb3V0OiAoKSA9PiB0aGlzLm9uSm9pbkVycm9yKHtyZWFzb246IFwidGltZW91dFwifSlcbiAgICB9KVxuICB9XG5cbiAgb25Kb2luRXJyb3IocmVzcCl7XG4gICAgaWYocmVzcC5yZWFzb24gPT09IFwicmVsb2FkXCIpe1xuICAgICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbYGZhaWxlZCBtb3VudCB3aXRoICR7cmVzcC5zdGF0dXN9LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZWxvYWRgLCByZXNwXSlcbiAgICAgIHRoaXMub25SZWRpcmVjdCh7dG86IHRoaXMucm9vdC5ocmVmLCByZWxvYWRUb2tlbjogcmVzcC50b2tlbn0pXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYocmVzcC5yZWFzb24gPT09IFwidW5hdXRob3JpemVkXCIgfHwgcmVzcC5yZWFzb24gPT09IFwic3RhbGVcIil7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYXV0aG9yaXplZCBsaXZlX3JlZGlyZWN0LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZXF1ZXN0XCIsIHJlc3BdKVxuICAgICAgdGhpcy5vblJlZGlyZWN0KHt0bzogdGhpcy5yb290LmhyZWYsIGZsYXNoOiB0aGlzLmZsYXNofSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZihyZXNwLnJlZGlyZWN0IHx8IHJlc3AubGl2ZV9yZWRpcmVjdCl7XG4gICAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuY2hhbm5lbC5sZWF2ZSgpXG4gICAgfVxuICAgIGlmKHJlc3AucmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vblJlZGlyZWN0KHJlc3AucmVkaXJlY3QpIH1cbiAgICBpZihyZXNwLmxpdmVfcmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vbkxpdmVSZWRpcmVjdChyZXNwLmxpdmVfcmVkaXJlY3QpIH1cbiAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYWJsZSB0byBqb2luXCIsIHJlc3BdKVxuICAgIGlmKHRoaXMuaXNNYWluKCkpe1xuICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxpdmVTb2NrZXQucmVsb2FkV2l0aEppdHRlcih0aGlzKSB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuam9pbkF0dGVtcHRzID49IE1BWF9DSElMRF9KT0lOX0FUVEVNUFRTKXtcbiAgICAgICAgLy8gcHV0IHRoZSByb290IHJldmlldyBpbnRvIHBlcm1hbmVudCBlcnJvciBzdGF0ZSwgYnV0IGRvbid0IGRlc3Ryb3kgaXQgYXMgaXQgY2FuIHJlbWFpbiBhY3RpdmVcbiAgICAgICAgdGhpcy5yb290LmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW2BnaXZpbmcgdXAgdHJ5aW5nIHRvIG1vdW50IGFmdGVyICR7TUFYX0NISUxEX0pPSU5fQVRURU1QVFN9IHRyaWVzYCwgcmVzcF0pXG4gICAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICBsZXQgdHJ1ZUNoaWxkRWwgPSBET00uYnlJZCh0aGlzLmVsLmlkKVxuICAgICAgaWYodHJ1ZUNoaWxkRWwpe1xuICAgICAgICBET00ubWVyZ2VBdHRycyh0cnVlQ2hpbGRFbCwgdGhpcy5lbClcbiAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgICB0aGlzLmVsID0gdHJ1ZUNoaWxkRWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DbG9zZShyZWFzb24pe1xuICAgIGlmKHRoaXMuaXNEZXN0cm95ZWQoKSl7IHJldHVybiB9XG4gICAgaWYodGhpcy5pc01haW4oKSAmJiB0aGlzLmxpdmVTb2NrZXQuaGFzUGVuZGluZ0xpbmsoKSAmJiByZWFzb24gIT09IFwibGVhdmVcIil7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcylcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95QWxsQ2hpbGRyZW4oKVxuICAgIHRoaXMubGl2ZVNvY2tldC5kcm9wQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIC8vIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgY2FuIGJlIG51bGwgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KXsgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCkgfVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpe1xuICAgICAgdGhpcy5zaG93TG9hZGVyKEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQpXG4gICAgfVxuICB9XG5cbiAgb25FcnJvcihyZWFzb24pe1xuICAgIHRoaXMub25DbG9zZShyZWFzb24pXG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInZpZXcgY3Jhc2hlZFwiLCByZWFzb25dKSB9XG4gICAgaWYoIXRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpe1xuICAgICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpe1xuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX0NMSUVOVF9FUlJPUl9DTEFTU10pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheUVycm9yKGNsYXNzZXMpe1xuICAgIGlmKHRoaXMuaXNNYWluKCkpeyBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiB7dG86IHRoaXMuaHJlZiwga2luZDogXCJlcnJvclwifX0pIH1cbiAgICB0aGlzLnNob3dMb2FkZXIoKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyguLi5jbGFzc2VzKVxuICAgIHRoaXMuZGVsYXllZERpc2Nvbm5lY3RlZCgpXG4gIH1cblxuICBkZWxheWVkRGlzY29ubmVjdGVkKCl7XG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5leGVjQWxsKHRoaXMuYmluZGluZyhcImRpc2Nvbm5lY3RlZFwiKSlcbiAgICB9LCB0aGlzLmxpdmVTb2NrZXQuZGlzY29ubmVjdGVkVGltZW91dClcbiAgfVxuXG4gIHdyYXBQdXNoKGNhbGxlclB1c2gsIHJlY2VpdmVzKXtcbiAgICBsZXQgbGF0ZW5jeSA9IHRoaXMubGl2ZVNvY2tldC5nZXRMYXRlbmN5U2ltKClcbiAgICBsZXQgd2l0aExhdGVuY3kgPSBsYXRlbmN5ID9cbiAgICAgIChjYikgPT4gc2V0VGltZW91dCgoKSA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIGNiKCksIGxhdGVuY3kpIDpcbiAgICAgIChjYikgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiBjYigpXG5cbiAgICB3aXRoTGF0ZW5jeSgoKSA9PiB7XG4gICAgICBjYWxsZXJQdXNoKClcbiAgICAgICAgLnJlY2VpdmUoXCJva1wiLCByZXNwID0+IHdpdGhMYXRlbmN5KCgpID0+IHJlY2VpdmVzLm9rICYmIHJlY2VpdmVzLm9rKHJlc3ApKSlcbiAgICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZWFzb24gPT4gd2l0aExhdGVuY3koKCkgPT4gcmVjZWl2ZXMuZXJyb3IgJiYgcmVjZWl2ZXMuZXJyb3IocmVhc29uKSkpXG4gICAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB3aXRoTGF0ZW5jeSgoKSA9PiByZWNlaXZlcy50aW1lb3V0ICYmIHJlY2VpdmVzLnRpbWVvdXQoKSkpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBldmVudCwgcGF5bG9hZCl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiBQcm9taXNlLnJlamVjdCh7ZXJyb3I6IFwibm9jb25uZWN0aW9uXCJ9KSB9XG5cbiAgICBsZXQgW3JlZiwgW2VsXSwgb3B0c10gPSByZWZHZW5lcmF0b3IgPyByZWZHZW5lcmF0b3IoKSA6IFtudWxsLCBbXSwge31dXG4gICAgbGV0IG9sZEpvaW5Db3VudCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IG9uTG9hZGluZ0RvbmUgPSBmdW5jdGlvbigpe31cbiAgICBpZihvcHRzLnBhZ2VfbG9hZGluZyl7XG4gICAgICBvbkxvYWRpbmdEb25lID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7a2luZDogXCJlbGVtZW50XCIsIHRhcmdldDogZWx9KVxuICAgIH1cblxuICAgIGlmKHR5cGVvZiAocGF5bG9hZC5jaWQpICE9PSBcIm51bWJlclwiKXsgZGVsZXRlIHBheWxvYWQuY2lkIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5wdXNoKGV2ZW50LCBwYXlsb2FkLCBQVVNIX1RJTUVPVVQpLCB7XG4gICAgICAgIG9rOiAocmVzcCkgPT4ge1xuICAgICAgICAgIGlmKHJlZiAhPT0gbnVsbCl7IHRoaXMubGFzdEFja1JlZiA9IHJlZiB9XG4gICAgICAgICAgbGV0IGZpbmlzaCA9IChob29rUmVwbHkpID0+IHtcbiAgICAgICAgICAgIGlmKHJlc3AucmVkaXJlY3QpeyB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3BhdGNoKXsgdGhpcy5vbkxpdmVQYXRjaChyZXNwLmxpdmVfcGF0Y2gpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgICAgICAgICBvbkxvYWRpbmdEb25lKClcbiAgICAgICAgICAgIHJlc29sdmUoe3Jlc3A6IHJlc3AsIHJlcGx5OiBob29rUmVwbHl9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXNwLmRpZmYpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByZXNwLmRpZmYsICh7ZGlmZiwgcmVwbHksIGV2ZW50c30pID0+IHtcbiAgICAgICAgICAgICAgICBpZihyZWYgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBheWxvYWQuZXZlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cylcbiAgICAgICAgICAgICAgICBmaW5pc2gocmVwbHkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihyZWYgIT09IG51bGwpeyB0aGlzLnVuZG9SZWZzKHJlZiwgcGF5bG9hZC5ldmVudCkgfVxuICAgICAgICAgICAgZmluaXNoKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKHJlYXNvbikgPT4gcmVqZWN0KHtlcnJvcjogcmVhc29ufSksXG4gICAgICAgIHRpbWVvdXQ6ICgpID0+IHtcbiAgICAgICAgICByZWplY3Qoe3RpbWVvdXQ6IHRydWV9KVxuICAgICAgICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSBvbGRKb2luQ291bnQpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZyhcInRpbWVvdXRcIiwgKCkgPT4gW1wicmVjZWl2ZWQgdGltZW91dCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggc2VydmVyLiBGYWxsaW5nIGJhY2sgdG8gaGFyZCByZWZyZXNoIGZvciByZWNvdmVyeVwiXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB1bmRvUmVmcyhyZWYsIHBoeEV2ZW50LCBvbmx5RWxzKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH0gLy8gZXhpdCBpZiBleHRlcm5hbCBmb3JtIHRyaWdnZXJlZFxuICAgIGxldCBzZWxlY3RvciA9IGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYFxuXG4gICAgaWYob25seUVscyl7XG4gICAgICBvbmx5RWxzID0gbmV3IFNldChvbmx5RWxzKVxuICAgICAgRE9NLmFsbChkb2N1bWVudCwgc2VsZWN0b3IsIHBhcmVudCA9PiB7XG4gICAgICAgIGlmKG9ubHlFbHMgJiYgIW9ubHlFbHMuaGFzKHBhcmVudCkpeyByZXR1cm4gfVxuICAgICAgICAvLyB1bmRvIGFueSBjaGlsZCByZWZzIHdpdGhpbiBwYXJlbnQgZmlyc3RcbiAgICAgICAgRE9NLmFsbChwYXJlbnQsIHNlbGVjdG9yLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICAgIHRoaXMudW5kb0VsUmVmKHBhcmVudCwgcmVmLCBwaHhFdmVudClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIHNlbGVjdG9yLCBlbCA9PiB0aGlzLnVuZG9FbFJlZihlbCwgcmVmLCBwaHhFdmVudCkpXG4gICAgfVxuICB9XG5cbiAgdW5kb0VsUmVmKGVsLCByZWYsIHBoeEV2ZW50KXtcbiAgICBsZXQgZWxSZWYgPSBuZXcgRWxlbWVudFJlZihlbClcblxuICAgIGVsUmVmLm1heWJlVW5kbyhyZWYsIHBoeEV2ZW50LCBjbG9uZWRUcmVlID0+IHtcbiAgICAgIC8vIHdlIG5lZWQgdG8gcGVyZm9ybSBhIGZ1bGwgcGF0Y2ggb24gdW5sb2NrZWQgZWxlbWVudHNcbiAgICAgIC8vIHRvIHBlcmZvcm0gYWxsIHRoZSBuZWNlc3NhcnkgbG9naWMgKGxpa2UgY2FsbGluZyB1cGRhdGVkIGZvciBob29rcywgZXRjLilcbiAgICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCBlbCwgdGhpcy5pZCwgY2xvbmVkVHJlZSwgW10sIG51bGwsIHt1bmRvUmVmOiByZWZ9KVxuICAgICAgY29uc3QgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgRE9NLmFsbChlbCwgYFske1BIWF9SRUZfU1JDfT1cIiR7dGhpcy5yZWZTcmMoKX1cIl1gLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICBpZihwaHhDaGlsZHJlbkFkZGVkKXsgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKSB9XG4gICAgfSlcbiAgfVxuXG4gIHJlZlNyYygpeyByZXR1cm4gdGhpcy5lbC5pZCB9XG5cbiAgcHV0UmVmKGVsZW1lbnRzLCBwaHhFdmVudCwgZXZlbnRUeXBlLCBvcHRzID0ge30pe1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZisrXG4gICAgbGV0IGRpc2FibGVXaXRoID0gdGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpXG4gICAgaWYob3B0cy5sb2FkaW5nKXtcbiAgICAgIGxldCBsb2FkaW5nRWxzID0gRE9NLmFsbChkb2N1bWVudCwgb3B0cy5sb2FkaW5nKS5tYXAoZWwgPT4ge1xuICAgICAgICByZXR1cm4ge2VsLCBsb2NrOiB0cnVlLCBsb2FkaW5nOiB0cnVlfVxuICAgICAgfSlcbiAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KGxvYWRpbmdFbHMpXG4gICAgfVxuXG4gICAgZm9yKGxldCB7ZWwsIGxvY2ssIGxvYWRpbmd9IG9mIGVsZW1lbnRzKXtcbiAgICAgIGlmKCFsb2NrICYmICFsb2FkaW5nKXsgdGhyb3cgbmV3IEVycm9yKFwicHV0UmVmIHJlcXVpcmVzIGxvY2sgb3IgbG9hZGluZ1wiKSB9XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMsIHRoaXMucmVmU3JjKCkpXG4gICAgICBpZihsb2FkaW5nKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9BRElORywgbmV3UmVmKSB9XG4gICAgICBpZihsb2NrKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9DSywgbmV3UmVmKSB9XG5cbiAgICAgIGlmKCFsb2FkaW5nIHx8IChvcHRzLnN1Ym1pdHRlciAmJiAhKGVsID09PSBvcHRzLnN1Ym1pdHRlciB8fCBlbCA9PT0gb3B0cy5mb3JtKSkpeyBjb250aW51ZSB9XG5cbiAgICAgIGxldCBsb2NrQ29tcGxldGVQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDp1bmRvLWxvY2s6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICB9KVxuXG4gICAgICBsZXQgbG9hZGluZ0NvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGBwaHg6dW5kby1sb2FkaW5nOiR7bmV3UmVmfWAsICgpID0+IHJlc29sdmUoZGV0YWlsKSwge29uY2U6IHRydWV9KVxuICAgICAgfSlcblxuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgcGh4LSR7ZXZlbnRUeXBlfS1sb2FkaW5nYClcbiAgICAgIGxldCBkaXNhYmxlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aClcbiAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBudWxsKXtcbiAgICAgICAgaWYoIWVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpKXtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLCBlbC5pbm5lclRleHQpXG4gICAgICAgIH1cbiAgICAgICAgaWYoZGlzYWJsZVRleHQgIT09IFwiXCIpeyBlbC5pbm5lclRleHQgPSBkaXNhYmxlVGV4dCB9XG4gICAgICAgIC8vIFBIWF9ESVNBQkxFRCBjb3VsZCBoYXZlIGFscmVhZHkgYmVlbiBzZXQgaW4gZGlzYWJsZUZvcm1cbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCkgfHwgZWwuZGlzYWJsZWQpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgICB9XG5cbiAgICAgIGxldCBkZXRhaWwgPSB7XG4gICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgIHJlZjogbmV3UmVmLFxuICAgICAgICBpc0xvYWRpbmc6IGxvYWRpbmcsXG4gICAgICAgIGlzTG9ja2VkOiBsb2NrLFxuICAgICAgICBsb2NrRWxlbWVudHM6IGVsZW1lbnRzLmZpbHRlcigoe2xvY2t9KSA9PiBsb2NrKS5tYXAoKHtlbH0pID0+IGVsKSxcbiAgICAgICAgbG9hZGluZ0VsZW1lbnRzOiBlbGVtZW50cy5maWx0ZXIoKHtsb2FkaW5nfSkgPT4gbG9hZGluZykubWFwKCh7ZWx9KSA9PiBlbCksXG4gICAgICAgIHVubG9jazogKGVscykgPT4ge1xuICAgICAgICAgIGVscyA9IEFycmF5LmlzQXJyYXkoZWxzKSA/IGVscyA6IFtlbHNdXG4gICAgICAgICAgdGhpcy51bmRvUmVmcyhuZXdSZWYsIHBoeEV2ZW50LCBlbHMpXG4gICAgICAgIH0sXG4gICAgICAgIGxvY2tDb21wbGV0ZTogbG9ja0NvbXBsZXRlUHJvbWlzZSxcbiAgICAgICAgbG9hZGluZ0NvbXBsZXRlOiBsb2FkaW5nQ29tcGxldGVQcm9taXNlLFxuICAgICAgICBsb2NrOiAobG9ja0VsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5pc0Fja2VkKG5ld1JlZikpeyByZXR1cm4gcmVzb2x2ZShkZXRhaWwpIH1cbiAgICAgICAgICAgIGxvY2tFbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLLCBuZXdSZWYpXG4gICAgICAgICAgICBsb2NrRWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCB0aGlzLnJlZlNyYygpKVxuICAgICAgICAgICAgbG9ja0VsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDpsb2NrLXN0b3A6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6cHVzaFwiLCB7XG4gICAgICAgIGRldGFpbDogZGV0YWlsLFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgfSkpXG4gICAgICBpZihwaHhFdmVudCl7XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6cHVzaDoke3BoeEV2ZW50fWAsIHtcbiAgICAgICAgICBkZXRhaWw6IGRldGFpbCxcbiAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW25ld1JlZiwgZWxlbWVudHMubWFwKCh7ZWx9KSA9PiBlbCksIG9wdHNdXG4gIH1cblxuICBpc0Fja2VkKHJlZil7IHJldHVybiB0aGlzLmxhc3RBY2tSZWYgIT09IG51bGwgJiYgdGhpcy5sYXN0QWNrUmVmID49IHJlZiB9XG5cbiAgY29tcG9uZW50SUQoZWwpe1xuICAgIGxldCBjaWQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpXG4gICAgcmV0dXJuIGNpZCA/IHBhcnNlSW50KGNpZCkgOiBudWxsXG4gIH1cblxuICB0YXJnZXRDb21wb25lbnRJRCh0YXJnZXQsIHRhcmdldEN0eCwgb3B0cyA9IHt9KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXsgcmV0dXJuIHRhcmdldEN0eCB9XG5cbiAgICBsZXQgY2lkT3JTZWxlY3RvciA9IG9wdHMudGFyZ2V0IHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwidGFyZ2V0XCIpKVxuICAgIGlmKGlzQ2lkKGNpZE9yU2VsZWN0b3IpKXtcbiAgICAgIHJldHVybiBwYXJzZUludChjaWRPclNlbGVjdG9yKVxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHggJiYgKGNpZE9yU2VsZWN0b3IgIT09IG51bGwgfHwgb3B0cy50YXJnZXQpKXtcbiAgICAgIHJldHVybiB0aGlzLmNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eCl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7XG4gICAgICByZXR1cm4gdGFyZ2V0Q3R4XG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCl7XG4gICAgICByZXR1cm4gbWF5YmUodGFyZ2V0Q3R4LmNsb3Nlc3QoYFske1BIWF9DT01QT05FTlR9XWApLCBlbCA9PiB0aGlzLm93bnNFbGVtZW50KGVsKSAmJiB0aGlzLmNvbXBvbmVudElEKGVsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwdXNoSG9va0V2ZW50KGVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5KXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgIHRoaXMubG9nKFwiaG9va1wiLCAoKSA9PiBbXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIsIGV2ZW50LCBwYXlsb2FkXSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgW3JlZiwgZWxzLCBvcHRzXSA9IHRoaXMucHV0UmVmKFt7ZWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XSwgZXZlbnQsIFwiaG9va1wiKVxuICAgIHRoaXMucHVzaFdpdGhSZXBseSgoKSA9PiBbcmVmLCBlbHMsIG9wdHNdLCBcImV2ZW50XCIsIHtcbiAgICAgIHR5cGU6IFwiaG9va1wiLFxuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgdmFsdWU6IHBheWxvYWQsXG4gICAgICBjaWQ6IHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9KS50aGVuKCh7cmVzcDogX3Jlc3AsIHJlcGx5OiBob29rUmVwbHl9KSA9PiBvblJlcGx5KGhvb2tSZXBseSwgcmVmKSlcblxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIGV4dHJhY3RNZXRhKGVsLCBtZXRhLCB2YWx1ZSl7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGxldCBuYW1lID0gZWwuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBpZihuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSl7IG1ldGFbbmFtZS5yZXBsYWNlKHByZWZpeCwgXCJcIildID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH1cbiAgICB9XG4gICAgaWYoZWwudmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhKGVsIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWVcblxuICAgICAgaWYoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKXtcbiAgICAgICAgZGVsZXRlIG1ldGEudmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsdWUpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpeyBtZXRhW2tleV0gPSB2YWx1ZVtrZXldIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFcbiAgfVxuXG4gIHB1c2hFdmVudCh0eXBlLCBlbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgbWV0YSwgb3B0cyA9IHt9LCBvblJlcGx5KXtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW3tlbCwgbG9hZGluZzogdHJ1ZSwgbG9jazogdHJ1ZX1dLCBwaHhFdmVudCwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIH0pXG4gICAgICAudGhlbigoe3JlcGx5fSkgPT4gb25SZXBseSAmJiBvblJlcGx5KHJlcGx5KSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZXZlbnRcIiwgZXJyb3IpKVxuICB9XG5cbiAgcHVzaEZpbGVQcm9ncmVzcyhmaWxlRWwsIGVudHJ5UmVmLCBwcm9ncmVzcywgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQud2l0aGluT3duZXJzKGZpbGVFbC5mb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICB2aWV3LnB1c2hXaXRoUmVwbHkobnVsbCwgXCJwcm9ncmVzc1wiLCB7XG4gICAgICAgIGV2ZW50OiBmaWxlRWwuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhQSFhfUFJPR1JFU1MpKSxcbiAgICAgICAgcmVmOiBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cnlfcmVmOiBlbnRyeVJlZixcbiAgICAgICAgcHJvZ3Jlc3M6IHByb2dyZXNzLFxuICAgICAgICBjaWQ6IHZpZXcudGFyZ2V0Q29tcG9uZW50SUQoZmlsZUVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZmlsZSBwcm9ncmVzc1wiLCBlcnJvcikpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hJbnB1dChpbnB1dEVsLCB0YXJnZXRDdHgsIGZvcmNlQ2lkLCBwaHhFdmVudCwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKCFpbnB1dEVsLmZvcm0pe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZm9ybSBldmVudHMgcmVxdWlyZSB0aGUgaW5wdXQgdG8gYmUgaW5zaWRlIGEgZm9ybVwiKVxuICAgIH1cblxuICAgIGxldCB1cGxvYWRzXG4gICAgbGV0IGNpZCA9IGlzQ2lkKGZvcmNlQ2lkKSA/IGZvcmNlQ2lkIDogdGhpcy50YXJnZXRDb21wb25lbnRJRChpbnB1dEVsLmZvcm0sIHRhcmdldEN0eCwgb3B0cylcbiAgICBsZXQgcmVmR2VuZXJhdG9yID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHV0UmVmKFtcbiAgICAgICAge2VsOiBpbnB1dEVsLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfSxcbiAgICAgICAge2VsOiBpbnB1dEVsLmZvcm0sIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XG4gICAgICBdLCBwaHhFdmVudCwgXCJjaGFuZ2VcIiwgb3B0cylcbiAgICB9XG4gICAgbGV0IGZvcm1EYXRhXG4gICAgbGV0IG1ldGEgPSB0aGlzLmV4dHJhY3RNZXRhKGlucHV0RWwuZm9ybSwge30sIG9wdHMudmFsdWUpXG4gICAgbGV0IHNlcmlhbGl6ZU9wdHMgPSB7fVxuICAgIGlmKGlucHV0RWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCl7IHNlcmlhbGl6ZU9wdHMuc3VibWl0dGVyID0gaW5wdXRFbCB9XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKSl7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCBzZXJpYWxpemVPcHRzLCBbaW5wdXRFbC5uYW1lXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwgc2VyaWFsaXplT3B0cylcbiAgICB9XG4gICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5maWxlcyAmJiBpbnB1dEVsLmZpbGVzLmxlbmd0aCA+IDApe1xuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoaW5wdXRFbCwgQXJyYXkuZnJvbShpbnB1dEVsLmZpbGVzKSlcbiAgICB9XG4gICAgdXBsb2FkcyA9IExpdmVVcGxvYWRlci5zZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpXG5cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgIG1ldGE6IHtcbiAgICAgICAgLy8gbm8gdGFyZ2V0IHdhcyBpbXBsaWNpdGx5IHNlbnQgYXMgXCJ1bmRlZmluZWRcIiBpbiBMViA8PSAxLjAuNSwgdGhlcmVmb3JlXG4gICAgICAgIC8vIHdlIGhhdmUgdG8ga2VlcCBpdC4gSW4gMS4wLjYgd2Ugc3dpdGNoZWQgZnJvbSBwYXNzaW5nIG1ldGEgYXMgVVJMIGVuY29kZWQgZGF0YVxuICAgICAgICAvLyB0byBwYXNzaW5nIGl0IGRpcmVjdGx5IGluIHRoZSBldmVudCwgYnV0IHRoZSBKU09OIGVuY29kZSB3b3VsZCBkcm9wIGtleXMgd2l0aFxuICAgICAgICAvLyB1bmRlZmluZWQgdmFsdWVzLlxuICAgICAgICBfdGFyZ2V0OiBvcHRzLl90YXJnZXQgfHwgXCJ1bmRlZmluZWRcIixcbiAgICAgICAgLi4ubWV0YVxuICAgICAgfSxcbiAgICAgIHVwbG9hZHM6IHVwbG9hZHMsXG4gICAgICBjaWQ6IGNpZFxuICAgIH1cbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBcImV2ZW50XCIsIGV2ZW50KS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIERPTS5pc0F1dG9VcGxvYWQoaW5wdXRFbCkpe1xuICAgICAgICAvLyB0aGUgZWxlbWVudCBjb3VsZCBiZSBpbnNpZGUgYSBsb2NrZWQgcGFyZW50IGZvciBvdGhlciB1bnJlbGF0ZWQgY2hhbmdlcztcbiAgICAgICAgLy8gd2UgY2FuIG9ubHkgc3RhcnQgdXBsb2FkcyB3aGVuIHRoZSB0cmVlIGlzIHVubG9ja2VkIGFuZCB0aGVcbiAgICAgICAgLy8gbmVjZXNzYXJ5IGRhdGEgYXR0cmlidXRlcyBhcmUgc2V0IGluIHRoZSByZWFsIERPTVxuICAgICAgICBFbGVtZW50UmVmLm9uVW5sb2NrKGlucHV0RWwsICgpID0+IHtcbiAgICAgICAgICBpZihMaXZlVXBsb2FkZXIuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dEVsKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIGxldCBbcmVmLCBfZWxzXSA9IHJlZkdlbmVyYXRvcigpXG4gICAgICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZiwgcGh4RXZlbnQsIFtpbnB1dEVsLmZvcm1dKVxuICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlcyhpbnB1dEVsLmZvcm0sIHBoeEV2ZW50LCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcClcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXdhaXRpbmdTdWJtaXQoaW5wdXRFbC5mb3JtLCBwaHhFdmVudClcbiAgICAgICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCBpbnB1dCBldmVudFwiLCBlcnJvcikpXG4gIH1cblxuICB0cmlnZ2VyQXdhaXRpbmdTdWJtaXQoZm9ybUVsLCBwaHhFdmVudCl7XG4gICAgbGV0IGF3YWl0aW5nU3VibWl0ID0gdGhpcy5nZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKVxuICAgIGlmKGF3YWl0aW5nU3VibWl0KXtcbiAgICAgIGxldCBbX2VsLCBfcmVmLCBfb3B0cywgY2FsbGJhY2tdID0gYXdhaXRpbmdTdWJtaXRcbiAgICAgIHRoaXMuY2FuY2VsU3VibWl0KGZvcm1FbCwgcGh4RXZlbnQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCl7XG4gICAgcmV0dXJuIHRoaXMuZm9ybVN1Ym1pdHMuZmluZCgoW2VsLCBfcmVmLCBfb3B0cywgX2NhbGxiYWNrXSkgPT4gZWwuaXNTYW1lTm9kZShmb3JtRWwpKVxuICB9XG5cbiAgc2NoZWR1bGVTdWJtaXQoZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpKXsgcmV0dXJuIHRydWUgfVxuICAgIHRoaXMuZm9ybVN1Ym1pdHMucHVzaChbZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrXSlcbiAgfVxuXG4gIGNhbmNlbFN1Ym1pdChmb3JtRWwsIHBoeEV2ZW50KXtcbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gdGhpcy5mb3JtU3VibWl0cy5maWx0ZXIoKFtlbCwgcmVmLCBfb3B0cywgX2NhbGxiYWNrXSkgPT4ge1xuICAgICAgaWYoZWwuaXNTYW1lTm9kZShmb3JtRWwpKXtcbiAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRpc2FibGVGb3JtKGZvcm1FbCwgcGh4RXZlbnQsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGZpbHRlcklnbm9yZWQgPSBlbCA9PiB7XG4gICAgICBsZXQgdXNlcklnbm9yZWQgPSBjbG9zZXN0UGh4QmluZGluZyhlbCwgYCR7dGhpcy5iaW5kaW5nKFBIWF9VUERBVEUpfT1pZ25vcmVgLCBlbC5mb3JtKVxuICAgICAgcmV0dXJuICEodXNlcklnbm9yZWQgfHwgY2xvc2VzdFBoeEJpbmRpbmcoZWwsIFwiZGF0YS1waHgtdXBkYXRlPWlnbm9yZVwiLCBlbC5mb3JtKSlcbiAgICB9XG4gICAgbGV0IGZpbHRlckRpc2FibGVzID0gZWwgPT4ge1xuICAgICAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSCkpXG4gICAgfVxuICAgIGxldCBmaWx0ZXJCdXR0b24gPSBlbCA9PiBlbC50YWdOYW1lID09IFwiQlVUVE9OXCJcblxuICAgIGxldCBmaWx0ZXJJbnB1dCA9IGVsID0+IFtcIklOUFVUXCIsIFwiVEVYVEFSRUFcIiwgXCJTRUxFQ1RcIl0uaW5jbHVkZXMoZWwudGFnTmFtZSlcblxuICAgIGxldCBmb3JtRWxlbWVudHMgPSBBcnJheS5mcm9tKGZvcm1FbC5lbGVtZW50cylcbiAgICBsZXQgZGlzYWJsZXMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckRpc2FibGVzKVxuICAgIGxldCBidXR0b25zID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJCdXR0b24pLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuICAgIGxldCBpbnB1dHMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlcklucHV0KS5maWx0ZXIoZmlsdGVySWdub3JlZClcblxuICAgIGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGJ1dHRvbi5kaXNhYmxlZClcbiAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcbiAgICB9KVxuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFksIGlucHV0LnJlYWRPbmx5KVxuICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlXG4gICAgICBpZihpbnB1dC5maWxlcyl7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGlucHV0LmRpc2FibGVkKVxuICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIGxldCBmb3JtRWxzID0gZGlzYWJsZXMuY29uY2F0KGJ1dHRvbnMpLmNvbmNhdChpbnB1dHMpLm1hcChlbCA9PiB7XG4gICAgICByZXR1cm4ge2VsLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfVxuICAgIH0pXG5cbiAgICAvLyB3ZSByZXZlcnNlIHRoZSBvcmRlciBzbyBmb3JtIGNoaWxkcmVuIGFyZSBhbHJlYWR5IGxvY2tlZCBieSB0aGUgdGltZVxuICAgIC8vIHRoZSBmb3JtIGlzIGxvY2tlZFxuICAgIGxldCBlbHMgPSBbe2VsOiBmb3JtRWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IGZhbHNlfV0uY29uY2F0KGZvcm1FbHMpLnJldmVyc2UoKVxuICAgIHJldHVybiB0aGlzLnB1dFJlZihlbHMsIHBoeEV2ZW50LCBcInN1Ym1pdFwiLCBvcHRzKVxuICB9XG5cbiAgcHVzaEZvcm1TdWJtaXQoZm9ybUVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMsIG9uUmVwbHkpe1xuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB0aGlzLmRpc2FibGVGb3JtKGZvcm1FbCwgcGh4RXZlbnQsIHtcbiAgICAgIC4uLm9wdHMsXG4gICAgICBmb3JtOiBmb3JtRWwsXG4gICAgICBzdWJtaXR0ZXI6IHN1Ym1pdHRlclxuICAgIH0pXG4gICAgLy8gc3RvcmUgdGhlIHN1Ym1pdHRlciBpbiB0aGUgZm9ybSBlbGVtZW50IGluIG9yZGVyIHRvIHRyaWdnZXIgaXRcbiAgICAvLyBmb3IgcGh4LXRyaWdnZXItYWN0aW9uXG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybUVsLCBcInN1Ym1pdHRlclwiLCBzdWJtaXR0ZXIpXG4gICAgbGV0IGNpZCA9IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoZm9ybUVsLCB0YXJnZXRDdHgpXG4gICAgaWYoTGl2ZVVwbG9hZGVyLmhhc1VwbG9hZHNJblByb2dyZXNzKGZvcm1FbCkpe1xuICAgICAgbGV0IFtyZWYsIF9lbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwdXNoID0gKCkgPT4gdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIHN1Ym1pdHRlciwgb3B0cywgb25SZXBseSlcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBwdXNoKVxuICAgIH0gZWxzZSBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBbcmVmLCBlbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwcm94eVJlZkdlbiA9ICgpID0+IFtyZWYsIGVscywgb3B0c11cbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZm9ybUVsLCBwaHhFdmVudCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgKF91cGxvYWRzKSA9PiB7XG4gICAgICAgIC8vIGlmIHdlIHN0aWxsIGhhdmluZyBwZW5kaW5nIHByZWZsaWdodHMgaXQgbWVhbnMgd2UgaGF2ZSBpbnZhbGlkIGVudHJpZXNcbiAgICAgICAgLy8gYW5kIHRoZSBwaHgtc3VibWl0IGNhbm5vdCBiZSBjb21wbGV0ZWRcbiAgICAgICAgaWYoTGl2ZVVwbG9hZGVyLmlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCkubGVuZ3RoID4gMCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudClcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWV0YSA9IHRoaXMuZXh0cmFjdE1ldGEoZm9ybUVsLCB7fSwgb3B0cy52YWx1ZSlcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHtzdWJtaXR0ZXJ9KVxuICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocHJveHlSZWZHZW4sIFwiZXZlbnRcIiwge1xuICAgICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgICAgICBjaWQ6IGNpZFxuICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCBmb3JtIHN1Ym1pdFwiLCBlcnJvcikpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZighKGZvcm1FbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpICYmIGZvcm1FbC5jbGFzc0xpc3QuY29udGFpbnMoXCJwaHgtc3VibWl0LWxvYWRpbmdcIikpKXtcbiAgICAgIGxldCBtZXRhID0gdGhpcy5leHRyYWN0TWV0YShmb3JtRWwsIHt9LCBvcHRzLnZhbHVlKVxuICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHtzdWJtaXR0ZXJ9KVxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgXCJldmVudFwiLCB7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgICAgY2lkOiBjaWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZm9ybSBzdWJtaXRcIiwgZXJyb3IpKVxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZEZpbGVzKGZvcm1FbCwgcGh4RXZlbnQsIHRhcmdldEN0eCwgcmVmLCBjaWQsIG9uQ29tcGxldGUpe1xuICAgIGxldCBqb2luQ291bnRBdFVwbG9hZCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IGlucHV0RWxzID0gTGl2ZVVwbG9hZGVyLmFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKVxuICAgIGxldCBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9IGlucHV0RWxzLmxlbmd0aFxuXG4gICAgLy8gZ2V0IGVhY2ggZmlsZSBpbnB1dFxuICAgIGlucHV0RWxzLmZvckVhY2goaW5wdXRFbCA9PiB7XG4gICAgICBsZXQgdXBsb2FkZXIgPSBuZXcgTGl2ZVVwbG9hZGVyKGlucHV0RWwsIHRoaXMsICgpID0+IHtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICBpZihudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9PT0gMCl7IG9uQ29tcGxldGUoKSB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgZW50cmllcyA9IHVwbG9hZGVyLmVudHJpZXMoKS5tYXAoZW50cnkgPT4gZW50cnkudG9QcmVmbGlnaHRQYXlsb2FkKCkpXG5cbiAgICAgIGlmKGVudHJpZXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICAgIHJlZjogaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxuICAgICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcInNlbmRpbmcgcHJlZmxpZ2h0IHJlcXVlc3RcIiwgcGF5bG9hZF0pXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImFsbG93X3VwbG9hZFwiLCBwYXlsb2FkKS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wiZ290IHByZWZsaWdodCByZXNwb25zZVwiLCByZXNwXSlcbiAgICAgICAgLy8gdGhlIHByZWZsaWdodCB3aWxsIHJlamVjdCBlbnRyaWVzIGJleW9uZCB0aGUgbWF4IGVudHJpZXNcbiAgICAgICAgLy8gc28gd2UgZXJyb3IgYW5kIGNhbmNlbCBlbnRyaWVzIG9uIHRoZSBjbGllbnQgdGhhdCBhcmUgbWlzc2luZyBmcm9tIHRoZSByZXNwb25zZVxuICAgICAgICB1cGxvYWRlci5lbnRyaWVzKCkuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgaWYocmVzcC5lbnRyaWVzICYmICFyZXNwLmVudHJpZXNbZW50cnkucmVmXSl7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUZhaWxlZEVudHJ5UHJlZmxpZ2h0KGVudHJ5LnJlZiwgXCJmYWlsZWQgcHJlZmxpZ2h0XCIsIHVwbG9hZGVyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gZm9yIGF1dG8gdXBsb2Fkcywgd2UgbWF5IGhhdmUgYW4gZW1wdHkgZW50cmllcyByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gZm9yIGZvcm0gc3VibWl0cyB0aGF0IGNvbnRhaW4gaW52YWxpZCBlbnRyaWVzXG4gICAgICAgIGlmKHJlc3AuZXJyb3IgfHwgT2JqZWN0LmtleXMocmVzcC5lbnRyaWVzKS5sZW5ndGggPT09IDApe1xuICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudClcbiAgICAgICAgICBsZXQgZXJyb3JzID0gcmVzcC5lcnJvciB8fCBbXVxuICAgICAgICAgIGVycm9ycy5tYXAoKFtlbnRyeV9yZWYsIHJlYXNvbl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmFpbGVkRW50cnlQcmVmbGlnaHQoZW50cnlfcmVmLCByZWFzb24sIHVwbG9hZGVyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG9uRXJyb3IgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYodGhpcy5qb2luQ291bnQgPT09IGpvaW5Db3VudEF0VXBsb2FkKXsgY2FsbGJhY2soKSB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGxvYWRlci5pbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCB0aGlzLmxpdmVTb2NrZXQpXG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCB1cGxvYWRcIiwgZXJyb3IpKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVGYWlsZWRFbnRyeVByZWZsaWdodCh1cGxvYWRSZWYsIHJlYXNvbiwgdXBsb2FkZXIpe1xuICAgIGlmKHVwbG9hZGVyLmlzQXV0b1VwbG9hZCgpKXtcbiAgICAgIC8vIHVwbG9hZFJlZiBtYXkgYmUgdG9wIGxldmVsIHVwbG9hZCBjb25maWcgcmVmIG9yIGVudHJ5IHJlZlxuICAgICAgbGV0IGVudHJ5ID0gdXBsb2FkZXIuZW50cmllcygpLmZpbmQoZW50cnkgPT4gZW50cnkucmVmID09PSB1cGxvYWRSZWYudG9TdHJpbmcoKSlcbiAgICAgIGlmKGVudHJ5KXsgZW50cnkuY2FuY2VsKCkgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cGxvYWRlci5lbnRyaWVzKCkubWFwKGVudHJ5ID0+IGVudHJ5LmNhbmNlbCgpKVxuICAgIH1cbiAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbYGVycm9yIGZvciBlbnRyeSAke3VwbG9hZFJlZn1gLCByZWFzb25dKVxuICB9XG5cbiAgZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXNPckJsb2JzKXtcbiAgICBsZXQgdGFyZ2V0RWxlbWVudCA9IHRoaXMudGFyZ2V0Q3R4RWxlbWVudCh0YXJnZXRDdHgpIHx8IHRoaXMuZWxcbiAgICBsZXQgaW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHModGFyZ2V0RWxlbWVudCkuZmlsdGVyKGVsID0+IGVsLm5hbWUgPT09IG5hbWUpXG4gICAgaWYoaW5wdXRzLmxlbmd0aCA9PT0gMCl7IGxvZ0Vycm9yKGBubyBsaXZlIGZpbGUgaW5wdXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBuYW1lIFwiJHtuYW1lfVwiYCkgfVxuICAgIGVsc2UgaWYoaW5wdXRzLmxlbmd0aCA+IDEpeyBsb2dFcnJvcihgZHVwbGljYXRlIGxpdmUgZmlsZSBpbnB1dHMgZm91bmQgbWF0Y2hpbmcgdGhlIG5hbWUgXCIke25hbWV9XCJgKSB9XG4gICAgZWxzZSB7IERPTS5kaXNwYXRjaEV2ZW50KGlucHV0c1swXSwgUEhYX1RSQUNLX1VQTE9BRFMsIHtkZXRhaWw6IHtmaWxlczogZmlsZXNPckJsb2JzfX0pIH1cbiAgfVxuXG4gIHRhcmdldEN0eEVsZW1lbnQodGFyZ2V0Q3R4KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXtcbiAgICAgIGxldCBbdGFyZ2V0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgdGFyZ2V0Q3R4KVxuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHgpe1xuICAgICAgcmV0dXJuIHRhcmdldEN0eFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHB1c2hGb3JtUmVjb3Zlcnkob2xkRm9ybSwgbmV3Rm9ybSwgdGVtcGxhdGVEb20sIGNhbGxiYWNrKXtcbiAgICAvLyB3ZSBhcmUgb25seSByZWNvdmVyaW5nIGZvcm1zIGluc2lkZSB0aGUgY3VycmVudCB2aWV3LCB0aGVyZWZvcmUgaXQgaXMgc2FmZSB0b1xuICAgIC8vIHNraXAgd2l0aGluT3duZXJzIGhlcmUgYW5kIGFsd2F5cyB1c2UgdGhpcyB3aGVuIHJlZmVycmluZyB0byB0aGUgdmlld1xuICAgIGNvbnN0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuICAgIGNvbnN0IHBoeFRhcmdldCA9IG5ld0Zvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInRhcmdldFwiKSkgfHwgbmV3Rm9ybVxuICAgIGNvbnN0IHBoeEV2ZW50ID0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9BVVRPX1JFQ09WRVIpKSB8fCBuZXdGb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpXG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShvbGRGb3JtLmVsZW1lbnRzKS5maWx0ZXIoZWwgPT4gRE9NLmlzRm9ybUlucHV0KGVsKSAmJiBlbC5uYW1lICYmICFlbC5oYXNBdHRyaWJ1dGUocGh4Q2hhbmdlKSlcbiAgICBpZihpbnB1dHMubGVuZ3RoID09PSAwKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHdlIG11c3QgY2xlYXIgdHJhY2tlZCB1cGxvYWRzIGJlZm9yZSByZWNvdmVyeSBhcyB0aGV5IG5vIGxvbmdlciBoYXZlIHZhbGlkIHJlZnNcbiAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICYmIExpdmVVcGxvYWRlci5jbGVhckZpbGVzKGlucHV0KSlcbiAgICAvLyBwdXNoSW5wdXQgYXNzdW1lcyB0aGF0IHRoZXJlIGlzIGEgc291cmNlIGVsZW1lbnQgdGhhdCBpbml0aWF0ZWQgdGhlIGNoYW5nZTtcbiAgICAvLyBiZWNhdXNlIHRoaXMgaXMgbm90IHRoZSBjYXNlIHdoZW4gd2UgcmVjb3ZlciBmb3Jtcywgd2UgcHJvdmlkZSB0aGUgZmlyc3QgaW5wdXQgd2UgZmluZFxuICAgIGxldCBpbnB1dCA9IGlucHV0cy5maW5kKGVsID0+IGVsLnR5cGUgIT09IFwiaGlkZGVuXCIpIHx8IGlucHV0c1swXVxuXG4gICAgLy8gaW4gdGhlIGNhc2UgdGhhdCB0aGVyZSBhcmUgbXVsdGlwbGUgdGFyZ2V0cywgd2UgY291bnQgdGhlIG51bWJlciBvZiBwZW5kaW5nIHJlY292ZXJ5IGV2ZW50c1xuICAgIC8vIGFuZCBvbmx5IGNhbGwgdGhlIGNhbGxiYWNrIG9uY2UgYWxsIGV2ZW50cyBoYXZlIGJlZW4gcHJvY2Vzc2VkXG4gICAgbGV0IHBlbmRpbmcgPSAwXG4gICAgLy8gd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrLCBkb20sIHZpZXdFbClcbiAgICB0aGlzLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodGFyZ2V0VmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBjb25zdCBjaWQgPSB0aGlzLnRhcmdldENvbXBvbmVudElEKG5ld0Zvcm0sIHRhcmdldEN0eClcbiAgICAgIHBlbmRpbmcrK1xuICAgICAgbGV0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6Zm9ybS1yZWNvdmVyeVwiLCB7ZGV0YWlsOiB7c291cmNlRWxlbWVudDogb2xkRm9ybX19KVxuICAgICAgSlMuZXhlYyhlLCBcImNoYW5nZVwiLCBwaHhFdmVudCwgdGhpcywgaW5wdXQsIFtcInB1c2hcIiwge1xuICAgICAgICBfdGFyZ2V0OiBpbnB1dC5uYW1lLFxuICAgICAgICB0YXJnZXRWaWV3LFxuICAgICAgICB0YXJnZXRDdHgsXG4gICAgICAgIG5ld0NpZDogY2lkLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIHBlbmRpbmctLVxuICAgICAgICAgIGlmKHBlbmRpbmcgPT09IDApeyBjYWxsYmFjaygpIH1cbiAgICAgICAgfVxuICAgICAgfV0pXG4gICAgfSwgdGVtcGxhdGVEb20sIHRlbXBsYXRlRG9tKVxuICB9XG5cbiAgcHVzaExpbmtQYXRjaChlLCBocmVmLCB0YXJnZXRFbCwgY2FsbGJhY2spe1xuICAgIGxldCBsaW5rUmVmID0gdGhpcy5saXZlU29ja2V0LnNldFBlbmRpbmdMaW5rKGhyZWYpXG4gICAgLy8gb25seSBhZGQgbG9hZGluZyBzdGF0ZXMgaWYgZXZlbnQgaXMgdHJ1c3RlZCAoaXQgd2FzIHRyaWdnZXJlZCBieSB1c2VyLCBzdWNoIGFzIGNsaWNrKSBhbmRcbiAgICAvLyBpdCdzIG5vdCBhIGZvcndhcmQvYmFjayBuYXZpZ2F0aW9uIGZyb20gcG9wc3RhdGVcbiAgICBsZXQgbG9hZGluZyA9IGUuaXNUcnVzdGVkICYmIGUudHlwZSAhPT0gXCJwb3BzdGF0ZVwiXG4gICAgbGV0IHJlZkdlbiA9IHRhcmdldEVsID8gKCkgPT4gdGhpcy5wdXRSZWYoW3tlbDogdGFyZ2V0RWwsIGxvYWRpbmc6IGxvYWRpbmcsIGxvY2s6IHRydWV9XSwgbnVsbCwgXCJjbGlja1wiKSA6IG51bGxcbiAgICBsZXQgZmFsbGJhY2sgPSAoKSA9PiB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3Qod2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgbGV0IHVybCA9IGhyZWYuc3RhcnRzV2l0aChcIi9cIikgPyBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH0ke2hyZWZ9YCA6IGhyZWZcblxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW4sIFwibGl2ZV9wYXRjaFwiLCB7dXJsfSkudGhlbihcbiAgICAgICh7cmVzcH0pID0+IHtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIGlmKHJlc3AubGlua19yZWRpcmVjdCl7XG4gICAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2ssIGxpbmtSZWYpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMubGl2ZVNvY2tldC5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7XG4gICAgICAgICAgICAgIHRoaXMuaHJlZiA9IGhyZWZcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhsaW5rUmVmKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICAoe2Vycm9yOiBfZXJyb3IsIHRpbWVvdXQ6IF90aW1lb3V0fSkgPT4gZmFsbGJhY2soKVxuICAgIClcbiAgfVxuXG4gIGdldEZvcm1zRm9yUmVjb3ZlcnkoKXtcbiAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gMCl7IHJldHVybiB7fSB9XG5cbiAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG5cbiAgICByZXR1cm4gRE9NLmFsbCh0aGlzLmVsLCBgZm9ybVske3BoeENoYW5nZX1dYClcbiAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmlkKVxuICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZWxlbWVudHMubGVuZ3RoID4gMClcbiAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpICE9PSBcImlnbm9yZVwiKVxuICAgICAgLm1hcChmb3JtID0+IHtcbiAgICAgICAgLy8gd2UgcGVyZm9ybSBhIHNoYWxsb3cgY2xvbmUgYW5kIG1hbnVhbGx5IGNvcHkgYWxsIGVsZW1lbnRzXG4gICAgICAgIGNvbnN0IGNsb25lZEZvcm0gPSBmb3JtLmNsb25lTm9kZShmYWxzZSlcbiAgICAgICAgLy8gd2UgbmVlZCB0byBjb3B5IHRoZSBwcml2YXRlIGRhdGEgYXMgaXQgY29udGFpbnNcbiAgICAgICAgLy8gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRvdWNoZWQgZmllbGRzXG4gICAgICAgIERPTS5jb3B5UHJpdmF0ZXMoY2xvbmVkRm9ybSwgZm9ybSlcbiAgICAgICAgQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2xvbmUgYWxsIGNoaWxkIG5vZGVzIGFzIHdlbGwsXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aG9zZSBjb3VsZCBhbHNvIGJlIHNlbGVjdHNcbiAgICAgICAgICBjb25zdCBjbG9uZWRFbCA9IGVsLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgIC8vIHdlIGNhbGwgbW9ycGhkb20gdG8gY29weSBhbnkgc3BlY2lhbCBzdGF0ZVxuICAgICAgICAgIC8vIGxpa2UgdGhlIHNlbGVjdGVkIG9wdGlvbiBvZiBhIDxzZWxlY3Q+IGVsZW1lbnQ7XG4gICAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgcGxlbnR5IGZhc3QgYXMgd2UgY2FsbCBpdCBvbiBhIHNtYWxsIHN1YnNldCBvZiB0aGUgRE9NLFxuICAgICAgICAgIC8vIHNpbmdsZSBpbnB1dHMgb3IgYSBzZWxlY3Qgd2l0aCBjaGlsZHJlblxuICAgICAgICAgIG1vcnBoZG9tKGNsb25lZEVsLCBlbClcbiAgICAgICAgICBET00uY29weVByaXZhdGVzKGNsb25lZEVsLCBlbClcbiAgICAgICAgICBjbG9uZWRGb3JtLmFwcGVuZENoaWxkKGNsb25lZEVsKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY2xvbmVkRm9ybVxuICAgICAgfSlcbiAgICAgIC5yZWR1Y2UoKGFjYywgZm9ybSkgPT4ge1xuICAgICAgICBhY2NbZm9ybS5pZF0gPSBmb3JtXG4gICAgICAgIHJldHVybiBhY2NcbiAgICAgIH0sIHt9KVxuICB9XG5cbiAgbWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKXtcbiAgICBsZXQgd2lsbERlc3Ryb3lDSURzID0gZGVzdHJveWVkQ0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgfSlcblxuICAgIGlmKHdpbGxEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgIC8vIHdlIG11c3QgcmVzZXQgdGhlIHJlbmRlciBjaGFuZ2UgdHJhY2tpbmcgZm9yIGNpZHMgdGhhdFxuICAgICAgLy8gY291bGQgYmUgYWRkZWQgYmFjayBmcm9tIHRoZSBzZXJ2ZXIgc28gd2UgZG9uJ3Qgc2tpcCB0aGVtXG4gICAgICB3aWxsRGVzdHJveUNJRHMuZm9yRWFjaChjaWQgPT4gdGhpcy5yZW5kZXJlZC5yZXNldFJlbmRlcihjaWQpKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX3dpbGxfZGVzdHJveVwiLCB7Y2lkczogd2lsbERlc3Ryb3lDSURzfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIHdlIG11c3Qgd2FpdCBmb3IgcGVuZGluZyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSBiZWZvcmUgZGV0ZXJtaW5pbmdcbiAgICAgICAgLy8gaWYgdGhlIGNpZHMgd2VyZSBhZGRlZCBiYWNrIHRvIHRoZSBET00gaW4gdGhlIG1lYW50aW1lICgjMzEzOSlcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIFNlZSBpZiBhbnkgb2YgdGhlIGNpZHMgd2Ugd2FudGVkIHRvIGRlc3Ryb3kgd2VyZSBhZGRlZCBiYWNrLFxuICAgICAgICAgIC8vIGlmIHRoZXkgd2VyZSBhZGRlZCBiYWNrLCB3ZSBkb24ndCBhY3R1YWxseSBkZXN0cm95IHRoZW0uXG4gICAgICAgICAgbGV0IGNvbXBsZXRlbHlEZXN0cm95Q0lEcyA9IHdpbGxEZXN0cm95Q0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmKGNvbXBsZXRlbHlEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfZGVzdHJveWVkXCIsIHtjaWRzOiBjb21wbGV0ZWx5RGVzdHJveUNJRHN9KS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZC5wcnVuZUNJRHMocmVzcC5jaWRzKVxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiBsb2dFcnJvcihcIkZhaWxlZCB0byBwdXNoIGNvbXBvbmVudHMgZGVzdHJveWVkXCIsIGVycm9yKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggY29tcG9uZW50cyBkZXN0cm95ZWRcIiwgZXJyb3IpKVxuICAgIH1cbiAgfVxuXG4gIG93bnNFbGVtZW50KGVsKXtcbiAgICBsZXQgcGFyZW50Vmlld0VsID0gZWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUilcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpID09PSB0aGlzLmlkIHx8XG4gICAgICAocGFyZW50Vmlld0VsICYmIHBhcmVudFZpZXdFbC5pZCA9PT0gdGhpcy5pZCkgfHxcbiAgICAgICghcGFyZW50Vmlld0VsICYmIHRoaXMuaXNEZWFkKVxuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMgPSB7fSl7XG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybSwgUEhYX0hBU19TVUJNSVRURUQsIHRydWUpXG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKVxuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRCwgdHJ1ZSkpXG4gICAgdGhpcy5saXZlU29ja2V0LmJsdXJBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMsICgpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKClcbiAgICB9KVxuICB9XG5cbiAgYmluZGluZyhraW5kKXsgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKGtpbmQpIH1cbn1cbiIsICIvKiogSW5pdGlhbGl6ZXMgdGhlIExpdmVTb2NrZXRcbiAqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3c3M6Ly9leGFtcGxlLmNvbS9saXZlXCJgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9saXZlXCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtQaG9lbml4LlNvY2tldH0gc29ja2V0IC0gdGhlIHJlcXVpcmVkIFBob2VuaXggU29ja2V0IGNsYXNzIGltcG9ydGVkIGZyb20gXCJwaG9lbml4XCIuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICogICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAqICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvbi4gT3V0c2lkZSBvZiBrZXlzIGxpc3RlZCBiZWxvdywgYWxsXG4gKiBjb25maWd1cmF0aW9uIGlzIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgUGhvZW5peCBTb2NrZXQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuZGVmYXVsdHNdIC0gVGhlIG9wdGlvbmFsIGRlZmF1bHRzIHRvIHVzZSBmb3IgdmFyaW91cyBiaW5kaW5ncyxcbiAqIHN1Y2ggYXMgYHBoeC1kZWJvdW5jZWAuIFN1cHBvcnRzIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqXG4gKiAgIC0gZGVib3VuY2UgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LWRlYm91bmNlIHRpbWUuIERlZmF1bHRzIDMwMFxuICogICAtIHRocm90dGxlIC0gdGhlIG1pbGxpc2Vjb25kIHBoeC10aHJvdHRsZSB0aW1lLiBEZWZhdWx0cyAzMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIGZvciBwYXNzaW5nIGNvbm5lY3QgcGFyYW1zLlxuICogVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIExpdmVWaWV3LiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgKGVsKSA9PiB7dmlldzogZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1teS12aWV3LW5hbWVcIiwgdG9rZW46IHdpbmRvdy5teVRva2VufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5kaW5nUHJlZml4XSAtIFRoZSBvcHRpb25hbCBwcmVmaXggdG8gdXNlIGZvciBhbGwgcGh4IERPTSBhbm5vdGF0aW9ucy5cbiAqIERlZmF1bHRzIHRvIFwicGh4LVwiLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmhvb2tzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IGhvb2sgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLnVwbG9hZGVyc10gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IGZvciByZWZlcmVuY2luZyBMaXZlVmlldyB1cGxvYWRlciBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmxvYWRlclRpbWVvdXRdIC0gVGhlIG9wdGlvbmFsIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhcHBseVxuICogbG9hZGluZyBzdGF0ZXMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmRpc2Nvbm5lY3RlZFRpbWVvdXRdIC0gVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZVxuICogZXhlY3V0aW5nIHBoeC1kaXNjb25uZWN0ZWQgY29tbWFuZHMuIERlZmF1bHRzIHRvIDUwMC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubWF4UmVsb2Fkc10gLSBUaGUgbWF4aW11bSByZWxvYWRzIGJlZm9yZSBlbnRlcmluZyBmYWlsc2FmZSBtb2RlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNaW5dIC0gVGhlIG1pbmltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLnJlbG9hZEppdHRlck1heF0gLSBUaGUgbWF4aW11bSB0aW1lIGJldHdlZW4gbm9ybWFsIHJlbG9hZCBhdHRlbXB0cy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMuZmFpbHNhZmVKaXR0ZXJdIC0gVGhlIHRpbWUgYmV0d2VlbiByZWxvYWQgYXR0ZW1wdHMgaW4gZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZpZXdMb2dnZXJdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGxvZyBkZWJ1ZyBpbmZvcm1hdGlvbi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4gY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5tZXRhZGF0YV0gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IG1hcHBpbmcgZXZlbnQgbmFtZXMgdG8gZnVuY3Rpb25zIGZvclxuICogcG9wdWxhdGluZyBldmVudCBtZXRhZGF0YS4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIG1ldGFkYXRhOiB7XG4gKiAgICAgICBjbGljazogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICogICAgICAgICAgIG1ldGFLZXk6IGUubWV0YUtleSxcbiAqICAgICAgICAgICBkZXRhaWw6IGUuZGV0YWlsIHx8IDEsXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH0sXG4gKiAgICAgICBrZXlkb3duOiAoZSwgZWwpID0+IHtcbiAqICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICBrZXk6IGUua2V5LFxuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgc2hpZnRLZXk6IGUuc2hpZnRLZXlcbiAqICAgICAgICAgfVxuICogICAgICAgfVxuICogICAgIH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiAgRm9yIGV4YW1wbGUsIFRoaXMgY291bGRcbiAqIGhhcHBlbiBpZiBhIHNpdGUgbG9hZHMgYSBjcm9zcy1kb21haW4gTGl2ZVZpZXcgaW4gYW4gaWZyYW1lLiAgRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB8fCBudWxsIH1cbiAqICAgICAgIHJlbW92ZUl0ZW0oa2V5TmFtZSkgeyBkZWxldGUgdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHNldEl0ZW0oa2V5TmFtZSwga2V5VmFsdWUpIHsgdGhpcy5zdG9yYWdlW2tleU5hbWVdID0ga2V5VmFsdWUgfVxuICogICAgIH1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubG9jYWxTdG9yYWdlXSAtIEFuIG9wdGlvbmFsIFN0b3JhZ2UgY29tcGF0aWJsZSBvYmplY3RcbiAqIFVzZWZ1bCBmb3Igd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgbG9jYWxTdG9yYWdlYC5cbiAqIFNlZSBgb3B0cy5zZXNzaW9uU3RvcmFnZWAgZm9yIGV4YW1wbGVzLlxuKi9cblxuaW1wb3J0IHtcbiAgQklORElOR19QUkVGSVgsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIERFRkFVTFRTLFxuICBGQUlMU0FGRV9KSVRURVIsXG4gIExPQURFUl9USU1FT1VULFxuICBESVNDT05ORUNURURfVElNRU9VVCxcbiAgTUFYX1JFTE9BRFMsXG4gIFBIWF9ERUJPVU5DRSxcbiAgUEhYX0RST1BfVEFSR0VULFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9LRVksXG4gIFBIWF9MSU5LX1NUQVRFLFxuICBQSFhfTElWRV9MSU5LLFxuICBQSFhfTFZfREVCVUcsXG4gIFBIWF9MVl9MQVRFTkNZX1NJTSxcbiAgUEhYX0xWX1BST0ZJTEUsXG4gIFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLFxuICBQSFhfTUFJTixcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfVEhST1RUTEUsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfU0VTU0lPTixcbiAgUkVMT0FEX0pJVFRFUl9NSU4sXG4gIFJFTE9BRF9KSVRURVJfTUFYLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFTE9BRF9TVEFUVVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBjbG9zdXJlLFxuICBkZWJ1ZyxcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgQnJvd3NlciBmcm9tIFwiLi9icm93c2VyXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBIb29rcyBmcm9tIFwiLi9ob29rc1wiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5leHBvcnQgbGV0IGlzVXNlZElucHV0ID0gKGVsKSA9PiBET00uaXNVc2VkSW5wdXQoZWwpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVTb2NrZXQge1xuICBjb25zdHJ1Y3Rvcih1cmwsIHBoeFNvY2tldCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnVubG9hZGVkID0gZmFsc2VcbiAgICBpZighcGh4U29ja2V0IHx8IHBoeFNvY2tldC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBhIHBob2VuaXggU29ja2V0IG11c3QgYmUgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byB0aGUgTGl2ZVNvY2tldCBjb25zdHJ1Y3Rvci4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICAgICAgICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAgICAgICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAgICAgIGApXG4gICAgfVxuICAgIHRoaXMuc29ja2V0ID0gbmV3IHBoeFNvY2tldCh1cmwsIG9wdHMpXG4gICAgdGhpcy5iaW5kaW5nUHJlZml4ID0gb3B0cy5iaW5kaW5nUHJlZml4IHx8IEJJTkRJTkdfUFJFRklYXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnZpZXdMb2dnZXIgPSBvcHRzLnZpZXdMb2dnZXJcbiAgICB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzID0gb3B0cy5tZXRhZGF0YSB8fCB7fVxuICAgIHRoaXMuZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKGNsb25lKERFRkFVTFRTKSwgb3B0cy5kZWZhdWx0cyB8fCB7fSlcbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5wcmV2QWN0aXZlID0gbnVsbFxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gbnVsbFxuICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsXG4gICAgdGhpcy5saW5rUmVmID0gMVxuICAgIHRoaXMucm9vdHMgPSB7fVxuICAgIHRoaXMuaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKHdpbmRvdy5sb2NhdGlvbilcbiAgICB0aGlzLmhvb2tzID0gb3B0cy5ob29rcyB8fCB7fVxuICAgIHRoaXMudXBsb2FkZXJzID0gb3B0cy51cGxvYWRlcnMgfHwge31cbiAgICB0aGlzLmxvYWRlclRpbWVvdXQgPSBvcHRzLmxvYWRlclRpbWVvdXQgfHwgTE9BREVSX1RJTUVPVVRcbiAgICB0aGlzLmRpc2Nvbm5lY3RlZFRpbWVvdXQgPSBvcHRzLmRpc2Nvbm5lY3RlZFRpbWVvdXQgfHwgRElTQ09OTkVDVEVEX1RJTUVPVVRcbiAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lciA9IG51bGxcbiAgICB0aGlzLm1heFJlbG9hZHMgPSBvcHRzLm1heFJlbG9hZHMgfHwgTUFYX1JFTE9BRFNcbiAgICB0aGlzLnJlbG9hZEppdHRlck1pbiA9IG9wdHMucmVsb2FkSml0dGVyTWluIHx8IFJFTE9BRF9KSVRURVJfTUlOXG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNYXggPSBvcHRzLnJlbG9hZEppdHRlck1heCB8fCBSRUxPQURfSklUVEVSX01BWFxuICAgIHRoaXMuZmFpbHNhZmVKaXR0ZXIgPSBvcHRzLmZhaWxzYWZlSml0dGVyIHx8IEZBSUxTQUZFX0pJVFRFUlxuICAgIHRoaXMubG9jYWxTdG9yYWdlID0gb3B0cy5sb2NhbFN0b3JhZ2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2UgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IHdpbmRvdy5zZXNzaW9uU3RvcmFnZVxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IGZhbHNlXG4gICAgdGhpcy5ib3VuZEV2ZW50TmFtZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnNlcnZlckNsb3NlUmVmID0gbnVsbFxuICAgIHRoaXMuZG9tQ2FsbGJhY2tzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBqc1F1ZXJ5U2VsZWN0b3JBbGw6IG51bGwsXG4gICAgICBvblBhdGNoU3RhcnQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uUGF0Y2hFbmQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uTm9kZUFkZGVkOiBjbG9zdXJlKCksXG4gICAgICBvbkJlZm9yZUVsVXBkYXRlZDogY2xvc3VyZSgpfSxcbiAgICBvcHRzLmRvbSB8fCB7fSlcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25TZXQoKVxuICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbiA9IHBhcnNlSW50KHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfSElTVE9SWV9QT1NJVElPTikpIHx8IDBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIF9lID0+IHtcbiAgICAgIHRoaXMudW5sb2FkZWQgPSB0cnVlXG4gICAgfSlcbiAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgaWYodGhpcy5pc1VubG9hZGVkKCkpe1xuICAgICAgICAvLyByZWxvYWQgcGFnZSBpZiBiZWluZyByZXN0b3JlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZSBhbmQgYnJvd3NlciBkb2VzIG5vdCBlbWl0IFwicGFnZXNob3dcIlxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gcHVibGljXG5cbiAgdmVyc2lvbigpeyByZXR1cm4gTFZfVlNOIH1cblxuICBpc1Byb2ZpbGVFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0VuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0Rpc2FibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJmYWxzZVwiIH1cblxuICBlbmFibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcInRydWVcIikgfVxuXG4gIGVuYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX1BST0ZJTEUsIFwidHJ1ZVwiKSB9XG5cbiAgZGlzYWJsZURlYnVnKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfREVCVUcsIFwiZmFsc2VcIikgfVxuXG4gIGRpc2FibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9QUk9GSUxFKSB9XG5cbiAgZW5hYmxlTGF0ZW5jeVNpbSh1cHBlckJvdW5kTXMpe1xuICAgIHRoaXMuZW5hYmxlRGVidWcoKVxuICAgIGNvbnNvbGUubG9nKFwibGF0ZW5jeSBzaW11bGF0b3IgZW5hYmxlZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoaXMgYnJvd3NlciBzZXNzaW9uLiBDYWxsIGRpc2FibGVMYXRlbmN5U2ltKCkgdG8gZGlzYWJsZVwiKVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0sIHVwcGVyQm91bmRNcylcbiAgfVxuXG4gIGRpc2FibGVMYXRlbmN5U2ltKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfTEFURU5DWV9TSU0pIH1cblxuICBnZXRMYXRlbmN5U2ltKCl7XG4gICAgbGV0IHN0ciA9IHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0pXG4gICAgcmV0dXJuIHN0ciA/IHBhcnNlSW50KHN0cikgOiBudWxsXG4gIH1cblxuICBnZXRTb2NrZXQoKXsgcmV0dXJuIHRoaXMuc29ja2V0IH1cblxuICBjb25uZWN0KCl7XG4gICAgLy8gZW5hYmxlIGRlYnVnIGJ5IGRlZmF1bHQgaWYgb24gbG9jYWxob3N0IGFuZCBub3QgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIiAmJiAhdGhpcy5pc0RlYnVnRGlzYWJsZWQoKSl7IHRoaXMuZW5hYmxlRGVidWcoKSB9XG4gICAgbGV0IGRvQ29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMucmVzZXRSZWxvYWRTdGF0dXMoKVxuICAgICAgaWYodGhpcy5qb2luUm9vdFZpZXdzKCkpe1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cygpXG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIGlmKHRoaXMubWFpbil7XG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5iaW5kVG9wTGV2ZWxFdmVudHMoe2RlYWQ6IHRydWV9KVxuICAgICAgfVxuICAgICAgdGhpcy5qb2luRGVhZFZpZXcoKVxuICAgIH1cbiAgICBpZihbXCJjb21wbGV0ZVwiLCBcImxvYWRlZFwiLCBcImludGVyYWN0aXZlXCJdLmluZGV4T2YoZG9jdW1lbnQucmVhZHlTdGF0ZSkgPj0gMCl7XG4gICAgICBkb0Nvbm5lY3QoKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiBkb0Nvbm5lY3QoKSlcbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KGNhbGxiYWNrKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgLy8gcmVtb3ZlIHRoZSBzb2NrZXQgY2xvc2UgbGlzdGVuZXIgdG8gYXZvaWQgdHJ5aW5nIHRvIGhhbmRsZVxuICAgIC8vIGEgc2VydmVyIGNsb3NlIGV2ZW50IHdoZW4gaXQgaXMgYWN0dWFsbHkgY2F1c2VkIGJ5IHVzIGRpc2Nvbm5lY3RpbmdcbiAgICBpZih0aGlzLnNlcnZlckNsb3NlUmVmKXtcbiAgICAgIHRoaXMuc29ja2V0Lm9mZih0aGlzLnNlcnZlckNsb3NlUmVmKVxuICAgICAgdGhpcy5zZXJ2ZXJDbG9zZVJlZiA9IG51bGxcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdChjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGxhY2VUcmFuc3BvcnQodHJhbnNwb3J0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5zb2NrZXQucmVwbGFjZVRyYW5zcG9ydCh0cmFuc3BvcnQpXG4gICAgdGhpcy5jb25uZWN0KClcbiAgfVxuXG4gIGV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUgPSBudWxsKXtcbiAgICBsZXQgZSA9IG5ldyBDdXN0b21FdmVudChcInBoeDpleGVjXCIsIHtkZXRhaWw6IHtzb3VyY2VFbGVtZW50OiBlbH19KVxuICAgIHRoaXMub3duZXIoZWwsIHZpZXcgPT4gSlMuZXhlYyhlLCBldmVudFR5cGUsIGVuY29kZWRKUywgdmlldywgZWwpKVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGV4ZWNKU0hvb2tQdXNoKGVsLCBwaHhFdmVudCwgZGF0YSwgY2FsbGJhY2spe1xuICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OmV4ZWNcIiwge2RldGFpbDoge3NvdXJjZUVsZW1lbnQ6IGVsfX0pXG4gICAgICBKUy5leGVjKGUsIFwiaG9va1wiLCBwaHhFdmVudCwgdmlldywgZWwsIFtcInB1c2hcIiwge2RhdGEsIGNhbGxiYWNrfV0pXG4gICAgfSlcbiAgfVxuXG4gIHVubG9hZCgpe1xuICAgIGlmKHRoaXMudW5sb2FkZWQpeyByZXR1cm4gfVxuICAgIGlmKHRoaXMubWFpbiAmJiB0aGlzLmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyh0aGlzLm1haW4sIFwic29ja2V0XCIsICgpID0+IFtcImRpc2Nvbm5lY3QgZm9yIHBhZ2UgbmF2XCJdKSB9XG4gICAgdGhpcy51bmxvYWRlZCA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3lBbGxWaWV3cygpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgfVxuXG4gIHRyaWdnZXJET00oa2luZCwgYXJncyl7IHRoaXMuZG9tQ2FsbGJhY2tzW2tpbmRdKC4uLmFyZ3MpIH1cblxuICB0aW1lKG5hbWUsIGZ1bmMpe1xuICAgIGlmKCF0aGlzLmlzUHJvZmlsZUVuYWJsZWQoKSB8fCAhY29uc29sZS50aW1lKXsgcmV0dXJuIGZ1bmMoKSB9XG4gICAgY29uc29sZS50aW1lKG5hbWUpXG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMoKVxuICAgIGNvbnNvbGUudGltZUVuZChuYW1lKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGxvZyh2aWV3LCBraW5kLCBtc2dDYWxsYmFjayl7XG4gICAgaWYodGhpcy52aWV3TG9nZ2VyKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgdGhpcy52aWV3TG9nZ2VyKHZpZXcsIGtpbmQsIG1zZywgb2JqKVxuICAgIH0gZWxzZSBpZih0aGlzLmlzRGVidWdFbmFibGVkKCkpe1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpXG4gICAgICBkZWJ1Zyh2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0RE9NVXBkYXRlKGNhbGxiYWNrKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFmdGVyKGNhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gIH1cblxuICBvbkNoYW5uZWwoY2hhbm5lbCwgZXZlbnQsIGNiKXtcbiAgICBjaGFubmVsLm9uKGV2ZW50LCBkYXRhID0+IHtcbiAgICAgIGxldCBsYXRlbmN5ID0gdGhpcy5nZXRMYXRlbmN5U2ltKClcbiAgICAgIGlmKCFsYXRlbmN5KXtcbiAgICAgICAgY2IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2IoZGF0YSksIGxhdGVuY3kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZFdpdGhKaXR0ZXIodmlldywgbG9nKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBsZXQgbWluTXMgPSB0aGlzLnJlbG9hZEppdHRlck1pblxuICAgIGxldCBtYXhNcyA9IHRoaXMucmVsb2FkSml0dGVyTWF4XG4gICAgbGV0IGFmdGVyTXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4TXMgLSBtaW5NcyArIDEpKSArIG1pbk1zXG4gICAgbGV0IHRyaWVzID0gQnJvd3Nlci51cGRhdGVMb2NhbCh0aGlzLmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTLCAwLCBjb3VudCA9PiBjb3VudCArIDEpXG4gICAgaWYodHJpZXMgPj0gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgIGFmdGVyTXMgPSB0aGlzLmZhaWxzYWZlSml0dGVyXG4gICAgfVxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBpZiB2aWV3IGhhcyByZWNvdmVyZWQsIHN1Y2ggYXMgdHJhbnNwb3J0IHJlcGxhY2VkLCB0aGVuIGNhbmNlbFxuICAgICAgaWYodmlldy5pc0Rlc3Ryb3llZCgpIHx8IHZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICB2aWV3LmRlc3Ryb3koKVxuICAgICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pXG4gICAgICBpZih0cmllcyA+PSB0aGlzLm1heFJlbG9hZHMpe1xuICAgICAgICB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BleGNlZWRlZCAke3RoaXMubWF4UmVsb2Fkc30gY29uc2VjdXRpdmUgcmVsb2Fkcy4gRW50ZXJpbmcgZmFpbHNhZmUgbW9kZWBdKVxuICAgICAgfVxuICAgICAgaWYodGhpcy5oYXNQZW5kaW5nTGluaygpKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgYWZ0ZXJNcylcbiAgfVxuXG4gIGdldEhvb2tDYWxsYmFja3MobmFtZSl7XG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5zdGFydHNXaXRoKFwiUGhvZW5peC5cIikgPyBIb29rc1tuYW1lLnNwbGl0KFwiLlwiKVsxXV0gOiB0aGlzLmhvb2tzW25hbWVdXG4gIH1cblxuICBpc1VubG9hZGVkKCl7IHJldHVybiB0aGlzLnVubG9hZGVkIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSB9XG5cbiAgZ2V0QmluZGluZ1ByZWZpeCgpeyByZXR1cm4gdGhpcy5iaW5kaW5nUHJlZml4IH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gYCR7dGhpcy5nZXRCaW5kaW5nUHJlZml4KCl9JHtraW5kfWAgfVxuXG4gIGNoYW5uZWwodG9waWMsIHBhcmFtcyl7IHJldHVybiB0aGlzLnNvY2tldC5jaGFubmVsKHRvcGljLCBwYXJhbXMpIH1cblxuICBqb2luRGVhZFZpZXcoKXtcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmJvZHlcbiAgICBpZihib2R5ICYmICF0aGlzLmlzUGh4Vmlldyhib2R5KSAmJiAhdGhpcy5pc1BoeFZpZXcoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpKXtcbiAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhib2R5KVxuICAgICAgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKVxuICAgICAgdmlldy5qb2luRGVhZCgpXG4gICAgICBpZighdGhpcy5tYWluKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdmlldy5leGVjTmV3TW91bnRlZCgpXG4gICAgICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uIHdoZW4gbmF2aWdhdGluZyBmcm9tIGFuIGV4dGVybmFsIC8gbm9uLWxpdmUgcGFnZVxuICAgICAgICB0aGlzLm1heWJlU2Nyb2xsKGhpc3Rvcnkuc3RhdGU/LnNjcm9sbClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgam9pblJvb3RWaWV3cygpe1xuICAgIGxldCByb290c0ZvdW5kID0gZmFsc2VcbiAgICBET00uYWxsKGRvY3VtZW50LCBgJHtQSFhfVklFV19TRUxFQ1RPUn06bm90KFske1BIWF9QQVJFTlRfSUR9XSlgLCByb290RWwgPT4ge1xuICAgICAgaWYoIXRoaXMuZ2V0Um9vdEJ5SWQocm9vdEVsLmlkKSl7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhyb290RWwpXG4gICAgICAgIC8vIHN0aWNraWVzIGNhbm5vdCBiZSBtb3VudGVkIGF0IHRoZSByb3V0ZXIgYW5kIHRoZXJlZm9yZSBzaG91bGQgbm90XG4gICAgICAgIC8vIGdldCBhIGhyZWYgc2V0IG9uIHRoZW1cbiAgICAgICAgaWYoIURPTS5pc1BoeFN0aWNreShyb290RWwpKXsgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKSB9XG4gICAgICAgIHZpZXcuam9pbigpXG4gICAgICAgIGlmKHJvb3RFbC5oYXNBdHRyaWJ1dGUoUEhYX01BSU4pKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB9XG4gICAgICByb290c0ZvdW5kID0gdHJ1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHJvb3RzRm91bmRcbiAgfVxuXG4gIHJlZGlyZWN0KHRvLCBmbGFzaCwgcmVsb2FkVG9rZW4pe1xuICAgIGlmKHJlbG9hZFRva2VuKXsgQnJvd3Nlci5zZXRDb29raWUoUEhYX1JFTE9BRF9TVEFUVVMsIHJlbG9hZFRva2VuLCA2MCkgfVxuICAgIHRoaXMudW5sb2FkKClcbiAgICBCcm93c2VyLnJlZGlyZWN0KHRvLCBmbGFzaClcbiAgfVxuXG4gIHJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCBjYWxsYmFjayA9IG51bGwsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBjb25zdCBsaXZlUmVmZXJlciA9IHRoaXMuY3VycmVudExvY2F0aW9uLmhyZWZcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gdGhpcy5vdXRnb2luZ01haW5FbCB8fCB0aGlzLm1haW4uZWxcblxuICAgIGNvbnN0IHN0aWNraWVzID0gRE9NLmZpbmRQaHhTdGlja3koZG9jdW1lbnQpIHx8IFtdXG4gICAgY29uc3QgcmVtb3ZlRWxzID0gRE9NLmFsbCh0aGlzLm91dGdvaW5nTWFpbkVsLCBgWyR7dGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpfV1gKVxuICAgICAgLmZpbHRlcihlbCA9PiAhRE9NLmlzQ2hpbGRPZkFueShlbCwgc3RpY2tpZXMpKVxuXG4gICAgY29uc3QgbmV3TWFpbkVsID0gRE9NLmNsb25lTm9kZSh0aGlzLm91dGdvaW5nTWFpbkVsLCBcIlwiKVxuICAgIHRoaXMubWFpbi5zaG93TG9hZGVyKHRoaXMubG9hZGVyVGltZW91dClcbiAgICB0aGlzLm1haW4uZGVzdHJveSgpXG5cbiAgICB0aGlzLm1haW4gPSB0aGlzLm5ld1Jvb3RWaWV3KG5ld01haW5FbCwgZmxhc2gsIGxpdmVSZWZlcmVyKVxuICAgIHRoaXMubWFpbi5zZXRSZWRpcmVjdChocmVmKVxuICAgIHRoaXMudHJhbnNpdGlvblJlbW92ZXMocmVtb3ZlRWxzKVxuICAgIHRoaXMubWFpbi5qb2luKChqb2luQ291bnQsIG9uRG9uZSkgPT4ge1xuICAgICAgaWYoam9pbkNvdW50ID09PSAxICYmIHRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSBwaHgtcmVtb3ZlIGVscyByaWdodCBiZWZvcmUgd2UgcmVwbGFjZSB0aGUgbWFpbiBlbGVtZW50XG4gICAgICAgICAgcmVtb3ZlRWxzLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpXG4gICAgICAgICAgc3RpY2tpZXMuZm9yRWFjaChlbCA9PiBuZXdNYWluRWwuYXBwZW5kQ2hpbGQoZWwpKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwucmVwbGFjZVdpdGgobmV3TWFpbkVsKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobGlua1JlZilcbiAgICAgICAgICBvbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0cmFuc2l0aW9uUmVtb3ZlcyhlbGVtZW50cywgY2FsbGJhY2spe1xuICAgIGxldCByZW1vdmVBdHRyID0gdGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgbGV0IHNpbGVuY2VFdmVudHMgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgfVxuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgLy8gcHJldmVudCBhbGwgbGlzdGVuZXJzIHdlIGNhcmUgYWJvdXQgZnJvbSBidWJibGluZyB0byB3aW5kb3dcbiAgICAgIC8vIHNpbmNlIHdlIGFyZSByZW1vdmluZyB0aGUgZWxlbWVudFxuICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHNpbGVuY2VFdmVudHMsIHRydWUpXG4gICAgICB9XG4gICAgICB0aGlzLmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKHJlbW92ZUF0dHIpLCBcInJlbW92ZVwiKVxuICAgIH0pXG4gICAgLy8gcmVtb3ZlIHRoZSBzaWxlbmNlZCBsaXN0ZW5lcnMgd2hlbiB0cmFuc2l0aW9ucyBhcmUgZG9uZSBpbmNhc2UgdGhlIGVsZW1lbnQgaXMgcmUtdXNlZFxuICAgIC8vIGFuZCBjYWxsIGNhbGxlcidzIGNhbGxiYWNrIGFzIHNvb24gYXMgd2UgYXJlIGRvbmUgd2l0aCB0cmFuc2l0aW9uc1xuICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgc2lsZW5jZUV2ZW50cywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9KVxuICB9XG5cbiAgaXNQaHhWaWV3KGVsKXsgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsIH1cblxuICBuZXdSb290VmlldyhlbCwgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLCBudWxsLCBmbGFzaCwgbGl2ZVJlZmVyZXIpXG4gICAgdGhpcy5yb290c1t2aWV3LmlkXSA9IHZpZXdcbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgb3duZXIoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIGxldCB2aWV3XG4gICAgY29uc3QgY2xvc2VzdFZpZXdFbCA9IGNoaWxkRWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUilcbiAgICBpZihjbG9zZXN0Vmlld0VsKXtcbiAgICAgIC8vIGl0IGNhbiBoYXBwZW4gdGhhdCB3ZSBmaW5kIGEgdmlldyB0aGF0IGlzIGFscmVhZHkgZGVzdHJveWVkO1xuICAgICAgLy8gaW4gdGhhdCBjYXNlIHdlIERPIE5PVCB3YW50IHRvIGZhbGxiYWNrIHRvIHRoZSBtYWluIGVsZW1lbnRcbiAgICAgIHZpZXcgPSB0aGlzLmdldFZpZXdCeUVsKGNsb3Nlc3RWaWV3RWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcgPSB0aGlzLm1haW5cbiAgICB9XG4gICAgcmV0dXJuIHZpZXcgJiYgY2FsbGJhY2sgPyBjYWxsYmFjayh2aWV3KSA6IHZpZXdcbiAgfVxuXG4gIHdpdGhpbk93bmVycyhjaGlsZEVsLCBjYWxsYmFjayl7XG4gICAgdGhpcy5vd25lcihjaGlsZEVsLCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIGNoaWxkRWwpKVxuICB9XG5cbiAgZ2V0Vmlld0J5RWwoZWwpe1xuICAgIGxldCByb290SWQgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQpXG4gICAgcmV0dXJuIG1heWJlKHRoaXMuZ2V0Um9vdEJ5SWQocm9vdElkKSwgcm9vdCA9PiByb290LmdldERlc2NlbmRlbnRCeUVsKGVsKSlcbiAgfVxuXG4gIGdldFJvb3RCeUlkKGlkKXsgcmV0dXJuIHRoaXMucm9vdHNbaWRdIH1cblxuICBkZXN0cm95QWxsVmlld3MoKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMucm9vdHMpe1xuICAgICAgdGhpcy5yb290c1tpZF0uZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tpZF1cbiAgICB9XG4gICAgdGhpcy5tYWluID0gbnVsbFxuICB9XG5cbiAgZGVzdHJveVZpZXdCeUVsKGVsKXtcbiAgICBsZXQgcm9vdCA9IHRoaXMuZ2V0Um9vdEJ5SWQoZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKSlcbiAgICBpZihyb290ICYmIHJvb3QuaWQgPT09IGVsLmlkKXtcbiAgICAgIHJvb3QuZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tyb290LmlkXVxuICAgIH0gZWxzZSBpZihyb290KXtcbiAgICAgIHJvb3QuZGVzdHJveURlc2NlbmRlbnQoZWwuaWQpXG4gICAgfVxuICB9XG5cbiAgZ2V0QWN0aXZlRWxlbWVudCgpe1xuICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gIH1cblxuICBkcm9wQWN0aXZlRWxlbWVudCh2aWV3KXtcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgJiYgdmlldy5vd25zRWxlbWVudCh0aGlzLnByZXZBY3RpdmUpKXtcbiAgICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICByZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKCl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHRoaXMucHJldkFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUuZm9jdXMoKVxuICAgIH1cbiAgfVxuXG4gIGJsdXJBY3RpdmVFbGVtZW50KCl7XG4gICAgdGhpcy5wcmV2QWN0aXZlID0gdGhpcy5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpeyB0aGlzLnByZXZBY3RpdmUuYmx1cigpIH1cbiAgfVxuXG4gIGJpbmRUb3BMZXZlbEV2ZW50cyh7ZGVhZH0gPSB7fSl7XG4gICAgaWYodGhpcy5ib3VuZFRvcExldmVsRXZlbnRzKXsgcmV0dXJuIH1cblxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IHRydWVcbiAgICAvLyBlbnRlciBmYWlsc2FmZSByZWxvYWQgaWYgc2VydmVyIGhhcyBnb25lIGF3YXkgaW50ZW50aW9uYWxseSwgc3VjaCBhcyBcImRpc2Nvbm5lY3RcIiBicm9hZGNhc3RcbiAgICB0aGlzLnNlcnZlckNsb3NlUmVmID0gdGhpcy5zb2NrZXQub25DbG9zZShldmVudCA9PiB7XG4gICAgICAvLyBmYWlsc2FmZSByZWxvYWQgaWYgbm9ybWFsIGNsb3N1cmUgYW5kIHdlIHN0aWxsIGhhdmUgYSBtYWluIExWXG4gICAgICBpZihldmVudCAmJiBldmVudC5jb2RlID09PSAxMDAwICYmIHRoaXMubWFpbil7IHJldHVybiB0aGlzLnJlbG9hZFdpdGhKaXR0ZXIodGhpcy5tYWluKSB9XG4gICAgfSlcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKXsgfSkgLy8gZW5zdXJlIGFsbCBjbGljayBldmVudHMgYnViYmxlIGZvciBtb2JpbGUgU2FmYXJpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBlID0+IHtcbiAgICAgIGlmKGUucGVyc2lzdGVkKXsgLy8gcmVsb2FkIHBhZ2UgaWYgYmVpbmcgcmVzdG9yZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGVcbiAgICAgICAgdGhpcy5nZXRTb2NrZXQoKS5kaXNjb25uZWN0KClcbiAgICAgICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiB3aW5kb3cubG9jYXRpb24uaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSlcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgdHJ1ZSlcbiAgICBpZighZGVhZCl7IHRoaXMuYmluZE5hdigpIH1cbiAgICB0aGlzLmJpbmRDbGlja3MoKVxuICAgIGlmKCFkZWFkKXsgdGhpcy5iaW5kRm9ybXMoKSB9XG4gICAgdGhpcy5iaW5kKHtrZXl1cDogXCJrZXl1cFwiLCBrZXlkb3duOiBcImtleWRvd25cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIF9waHhUYXJnZXQpID0+IHtcbiAgICAgIGxldCBtYXRjaEtleSA9IHRhcmdldEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0tFWSkpXG4gICAgICBsZXQgcHJlc3NlZEtleSA9IGUua2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgLy8gY2hyb21lIGNsaWNrZWQgYXV0b2NvbXBsZXRlcyBzZW5kIGEga2V5ZG93biB3aXRob3V0IGtleVxuICAgICAgaWYobWF0Y2hLZXkgJiYgbWF0Y2hLZXkudG9Mb3dlckNhc2UoKSAhPT0gcHJlc3NlZEtleSl7IHJldHVybiB9XG5cbiAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgIEpTLmV4ZWMoZSwgdHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiZm9jdXNvdXRcIiwgZm9jdXM6IFwiZm9jdXNpblwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgcGh4VGFyZ2V0KSA9PiB7XG4gICAgICBpZighcGh4VGFyZ2V0KXtcbiAgICAgICAgbGV0IGRhdGEgPSB7a2V5OiBlLmtleSwgLi4udGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpfVxuICAgICAgICBKUy5leGVjKGUsIHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5iaW5kKHtibHVyOiBcImJsdXJcIiwgZm9jdXM6IFwiZm9jdXNcIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIHBoeFRhcmdldCkgPT4ge1xuICAgICAgLy8gYmx1ciBhbmQgZm9jdXMgYXJlIHRyaWdnZXJlZCBvbiBkb2N1bWVudCBhbmQgd2luZG93LiBEaXNjYXJkIG9uZSB0byBhdm9pZCBkdXBzXG4gICAgICBpZihwaHhUYXJnZXQgPT09IFwid2luZG93XCIpe1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKVxuICAgICAgICBKUy5leGVjKGUsIHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5vbihcImRyYWdvdmVyXCIsIGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKVxuICAgIHRoaXMub24oXCJkcm9wXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBsZXQgZHJvcFRhcmdldElkID0gbWF5YmUoY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKSwgdHJ1ZVRhcmdldCA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlVGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RST1BfVEFSR0VUKSlcbiAgICAgIH0pXG4gICAgICBsZXQgZHJvcFRhcmdldCA9IGRyb3BUYXJnZXRJZCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkcm9wVGFyZ2V0SWQpXG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGF0YVRyYW5zZmVyLmZpbGVzIHx8IFtdKVxuICAgICAgaWYoIWRyb3BUYXJnZXQgfHwgZHJvcFRhcmdldC5kaXNhYmxlZCB8fCBmaWxlcy5sZW5ndGggPT09IDAgfHwgIShkcm9wVGFyZ2V0LmZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpKXsgcmV0dXJuIH1cblxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoZHJvcFRhcmdldCwgZmlsZXMsIGUuZGF0YVRyYW5zZmVyKVxuICAgICAgZHJvcFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgfSlcbiAgICB0aGlzLm9uKFBIWF9UUkFDS19VUExPQURTLCBlID0+IHtcbiAgICAgIGxldCB1cGxvYWRUYXJnZXQgPSBlLnRhcmdldFxuICAgICAgaWYoIURPTS5pc1VwbG9hZElucHV0KHVwbG9hZFRhcmdldCkpeyByZXR1cm4gfVxuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRldGFpbC5maWxlcyB8fCBbXSkuZmlsdGVyKGYgPT4gZiBpbnN0YW5jZW9mIEZpbGUgfHwgZiBpbnN0YW5jZW9mIEJsb2IpXG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyh1cGxvYWRUYXJnZXQsIGZpbGVzKVxuICAgICAgdXBsb2FkVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWV9KSlcbiAgICB9KVxuICB9XG5cbiAgZXZlbnRNZXRhKGV2ZW50TmFtZSwgZSwgdGFyZ2V0RWwpe1xuICAgIGxldCBjYWxsYmFjayA9IHRoaXMubWV0YWRhdGFDYWxsYmFja3NbZXZlbnROYW1lXVxuICAgIHJldHVybiBjYWxsYmFjayA/IGNhbGxiYWNrKGUsIHRhcmdldEVsKSA6IHt9XG4gIH1cblxuICBzZXRQZW5kaW5nTGluayhocmVmKXtcbiAgICB0aGlzLmxpbmtSZWYrK1xuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBocmVmXG4gICAgdGhpcy5yZXNldFJlbG9hZFN0YXR1cygpXG4gICAgcmV0dXJuIHRoaXMubGlua1JlZlxuICB9XG5cbiAgLy8gYW55dGltZSB3ZSBhcmUgbmF2aWdhdGluZyBvciBjb25uZWN0aW5nLCBkcm9wIHJlbG9hZCBjb29raWUgaW4gY2FzZVxuICAvLyB3ZSBpc3N1ZSB0aGUgY29va2llIGJ1dCB0aGUgbmV4dCByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBhbmQgdGhlIHNlcnZlciBuZXZlciBkcm9wcGVkIGl0XG4gIHJlc2V0UmVsb2FkU3RhdHVzKCl7IEJyb3dzZXIuZGVsZXRlQ29va2llKFBIWF9SRUxPQURfU1RBVFVTKSB9XG5cbiAgY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZil7XG4gICAgaWYodGhpcy5saW5rUmVmICE9PSBsaW5rUmVmKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhyZWYgPSB0aGlzLnBlbmRpbmdMaW5rXG4gICAgICB0aGlzLnBlbmRpbmdMaW5rID0gbnVsbFxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBnZXRIcmVmKCl7IHJldHVybiB0aGlzLmhyZWYgfVxuXG4gIGhhc1BlbmRpbmdMaW5rKCl7IHJldHVybiAhIXRoaXMucGVuZGluZ0xpbmsgfVxuXG4gIGJpbmQoZXZlbnRzLCBjYWxsYmFjayl7XG4gICAgZm9yKGxldCBldmVudCBpbiBldmVudHMpe1xuICAgICAgbGV0IGJyb3dzZXJFdmVudE5hbWUgPSBldmVudHNbZXZlbnRdXG5cbiAgICAgIHRoaXMub24oYnJvd3NlckV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICAgIGxldCBiaW5kaW5nID0gdGhpcy5iaW5kaW5nKGV2ZW50KVxuICAgICAgICBsZXQgd2luZG93QmluZGluZyA9IHRoaXMuYmluZGluZyhgd2luZG93LSR7ZXZlbnR9YClcbiAgICAgICAgbGV0IHRhcmdldFBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShiaW5kaW5nKVxuICAgICAgICBpZih0YXJnZXRQaHhFdmVudCl7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZShlLnRhcmdldCwgZSwgYnJvd3NlckV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlLCBldmVudCwgdmlldywgZS50YXJnZXQsIHRhcmdldFBoeEV2ZW50LCBudWxsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt3aW5kb3dCaW5kaW5nfV1gLCBlbCA9PiB7XG4gICAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUod2luZG93QmluZGluZylcbiAgICAgICAgICAgIHRoaXMuZGVib3VuY2UoZWwsIGUsIGJyb3dzZXJFdmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlbCwgcGh4RXZlbnQsIFwid2luZG93XCIpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgYmluZENsaWNrcygpe1xuICAgIHRoaXMub24oXCJtb3VzZWRvd25cIiwgZSA9PiB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXQpXG4gICAgdGhpcy5iaW5kQ2xpY2soXCJjbGlja1wiLCBcImNsaWNrXCIpXG4gIH1cblxuICBiaW5kQ2xpY2soZXZlbnROYW1lLCBiaW5kaW5nTmFtZSl7XG4gICAgbGV0IGNsaWNrID0gdGhpcy5iaW5kaW5nKGJpbmRpbmdOYW1lKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gbnVsbFxuICAgICAgLy8gYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgKGRldGFpbCAwKSB3aWxsIG5vdCBoYXZlIGNhdXNlZCBhIG1vdXNlZG93biBldmVudCxcbiAgICAgIC8vIHRoZXJlZm9yZSB0aGUgY2xpY2tTdGFydGVkQXRUYXJnZXQgaXMgc3RhbGVcbiAgICAgIGlmKGUuZGV0YWlsID09PSAwKSB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXRcbiAgICAgIGxldCBjbGlja1N0YXJ0ZWRBdFRhcmdldCA9IHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgfHwgZS50YXJnZXRcbiAgICAgIC8vIHdoZW4gc2VhcmNoaW5nIHRoZSB0YXJnZXQgZm9yIHRoZSBjbGljayBldmVudCwgd2UgYWx3YXlzIHdhbnQgdG9cbiAgICAgIC8vIHVzZSB0aGUgYWN0dWFsIGV2ZW50IHRhcmdldCwgc2VlICMzMzcyXG4gICAgICB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgY2xpY2spXG4gICAgICB0aGlzLmRpc3BhdGNoQ2xpY2tBd2F5KGUsIGNsaWNrU3RhcnRlZEF0VGFyZ2V0KVxuICAgICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGxcbiAgICAgIGxldCBwaHhFdmVudCA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKGNsaWNrKVxuICAgICAgaWYoIXBoeEV2ZW50KXtcbiAgICAgICAgaWYoRE9NLmlzTmV3UGFnZUNsaWNrKGUsIHdpbmRvdy5sb2NhdGlvbikpeyB0aGlzLnVubG9hZCgpIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNcIil7IGUucHJldmVudERlZmF1bHQoKSB9XG5cbiAgICAgIC8vIG5vb3AgaWYgd2UgYXJlIGluIHRoZSBtaWRkbGUgb2YgYXdhaXRpbmcgYW4gYWNrIGZvciB0aGlzIGVsIGFscmVhZHlcbiAgICAgIGlmKHRhcmdldC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpKXsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5kZWJvdW5jZSh0YXJnZXQsIGUsIFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyh0YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgIEpTLmV4ZWMoZSwgXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0LCBbXCJwdXNoXCIsIHtkYXRhOiB0aGlzLmV2ZW50TWV0YShcImNsaWNrXCIsIGUsIHRhcmdldCl9XSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gIH1cblxuICBkaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdCl7XG4gICAgbGV0IHBoeENsaWNrQXdheSA9IHRoaXMuYmluZGluZyhcImNsaWNrLWF3YXlcIilcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7cGh4Q2xpY2tBd2F5fV1gLCBlbCA9PiB7XG4gICAgICBpZighKGVsLmlzU2FtZU5vZGUoY2xpY2tTdGFydGVkQXQpIHx8IGVsLmNvbnRhaW5zKGNsaWNrU3RhcnRlZEF0KSkpe1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICAgICAgbGV0IHBoeEV2ZW50ID0gZWwuZ2V0QXR0cmlidXRlKHBoeENsaWNrQXdheSlcbiAgICAgICAgICBpZihKUy5pc1Zpc2libGUoZWwpICYmIEpTLmlzSW5WaWV3cG9ydChlbCkpe1xuICAgICAgICAgICAgSlMuZXhlYyhlLCBcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCBlbCwgW1wicHVzaFwiLCB7ZGF0YTogdGhpcy5ldmVudE1ldGEoXCJjbGlja1wiLCBlLCBlLnRhcmdldCl9XSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGJpbmROYXYoKXtcbiAgICBpZighQnJvd3Nlci5jYW5QdXNoU3RhdGUoKSl7IHJldHVybiB9XG4gICAgaWYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbil7IGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSBcIm1hbnVhbFwiIH1cbiAgICBsZXQgc2Nyb2xsVGltZXIgPSBudWxsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgX2UgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVyKVxuICAgICAgc2Nyb2xsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgQnJvd3Nlci51cGRhdGVDdXJyZW50U3RhdGUoc3RhdGUgPT4gT2JqZWN0LmFzc2lnbihzdGF0ZSwge3Njcm9sbDogd2luZG93LnNjcm9sbFl9KSlcbiAgICAgIH0sIDEwMClcbiAgICB9KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgZXZlbnQgPT4ge1xuICAgICAgaWYoIXRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pKXsgcmV0dXJuIH1cbiAgICAgIGxldCB7dHlwZSwgYmFja1R5cGUsIGlkLCBzY3JvbGwsIHBvc2l0aW9ufSA9IGV2ZW50LnN0YXRlIHx8IHt9XG4gICAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG5cbiAgICAgIC8vIENvbXBhcmUgcG9zaXRpb25zIHRvIGRldGVybWluZSBkaXJlY3Rpb25cbiAgICAgIGxldCBpc0ZvcndhcmQgPSBwb3NpdGlvbiA+IHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuXG4gICAgICB0eXBlID0gaXNGb3J3YXJkID8gdHlwZSA6IChiYWNrVHlwZSB8fCB0eXBlKVxuXG4gICAgICAvLyBVcGRhdGUgY3VycmVudCBwb3NpdGlvblxuICAgICAgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uID0gcG9zaXRpb24gfHwgMFxuICAgICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpuYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7aHJlZiwgcGF0Y2g6IHR5cGUgPT09IFwicGF0Y2hcIiwgcG9wOiB0cnVlLCBkaXJlY3Rpb246IGlzRm9yd2FyZCA/IFwiZm9yd2FyZFwiIDogXCJiYWNrd2FyZFwifX0pXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHsgdGhpcy5tYXliZVNjcm9sbChzY3JvbGwpIH1cbiAgICAgICAgaWYodGhpcy5tYWluLmlzQ29ubmVjdGVkKCkgJiYgKHR5cGUgPT09IFwicGF0Y2hcIiAmJiBpZCA9PT0gdGhpcy5tYWluLmlkKSl7XG4gICAgICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goZXZlbnQsIGhyZWYsIG51bGwsIGNhbGxiYWNrKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2spXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgUEhYX0xJVkVfTElOSylcbiAgICAgIGxldCB0eXBlID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoUEhYX0xJVkVfTElOSylcbiAgICAgIGlmKCF0eXBlIHx8ICF0aGlzLmlzQ29ubmVjdGVkKCkgfHwgIXRoaXMubWFpbiB8fCBET00ud2FudHNOZXdUYWIoZSkpeyByZXR1cm4gfVxuXG4gICAgICAvLyBXaGVuIHdyYXBwaW5nIGFuIFNWRyBlbGVtZW50IGluIGFuIGFuY2hvciB0YWcsIHRoZSBocmVmIGNhbiBiZSBhbiBTVkdBbmltYXRlZFN0cmluZ1xuICAgICAgbGV0IGhyZWYgPSB0YXJnZXQuaHJlZiBpbnN0YW5jZW9mIFNWR0FuaW1hdGVkU3RyaW5nID8gdGFyZ2V0LmhyZWYuYmFzZVZhbCA6IHRhcmdldC5ocmVmXG5cbiAgICAgIGxldCBsaW5rU3RhdGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSU5LX1NUQVRFKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIC8vIGRvIG5vdCBidWJibGUgY2xpY2sgdG8gcmVndWxhciBwaHgtY2xpY2sgYmluZGluZ3NcbiAgICAgIGlmKHRoaXMucGVuZGluZ0xpbmsgPT09IGhyZWYpeyByZXR1cm4gfVxuXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZih0eXBlID09PSBcInBhdGNoXCIpe1xuICAgICAgICAgIHRoaXMucHVzaEhpc3RvcnlQYXRjaChlLCBocmVmLCBsaW5rU3RhdGUsIHRhcmdldClcbiAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgdGhpcy5oaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgbGlua1N0YXRlLCBudWxsLCB0YXJnZXQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCAke1BIWF9MSVZFX0xJTkt9IHRvIGJlIFwicGF0Y2hcIiBvciBcInJlZGlyZWN0XCIsIGdvdDogJHt0eXBlfWApXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBoeENsaWNrID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjbGlja1wiKSlcbiAgICAgICAgaWYocGh4Q2xpY2spe1xuICAgICAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB0aGlzLmV4ZWNKUyh0YXJnZXQsIHBoeENsaWNrLCBcImNsaWNrXCIpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuICB9XG5cbiAgbWF5YmVTY3JvbGwoc2Nyb2xsKXtcbiAgICBpZih0eXBlb2Yoc2Nyb2xsKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxuICAgICAgfSkgLy8gdGhlIGJvZHkgbmVlZHMgdG8gcmVuZGVyIGJlZm9yZSB3ZSBzY3JvbGwuXG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9KXtcbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIGBwaHg6JHtldmVudH1gLCB7ZGV0YWlsOiBwYXlsb2FkfSlcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnRzKGV2ZW50cyl7XG4gICAgZXZlbnRzLmZvckVhY2goKFtldmVudCwgcGF5bG9hZF0pID0+IHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCkpXG4gIH1cblxuICB3aXRoUGFnZUxvYWRpbmcoaW5mbywgY2FsbGJhY2spe1xuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIHtkZXRhaWw6IGluZm99KVxuICAgIGxldCBkb25lID0gKCkgPT4gRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCB7ZGV0YWlsOiBpbmZvfSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBjYWxsYmFjayhkb25lKSA6IGRvbmVcbiAgfVxuXG4gIHB1c2hIaXN0b3J5UGF0Y2goZSwgaHJlZiwgbGlua1N0YXRlLCB0YXJnZXRFbCl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluLmlzTWFpbigpKXsgcmV0dXJuIEJyb3dzZXIucmVkaXJlY3QoaHJlZikgfVxuXG4gICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiBocmVmLCBraW5kOiBcInBhdGNoXCJ9LCBkb25lID0+IHtcbiAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGUsIGhyZWYsIHRhcmdldEVsLCBsaW5rUmVmID0+IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmKVxuICAgICAgICBkb25lKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBpZighdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7IHJldHVybiB9XG5cbiAgICAvLyBJbmNyZW1lbnQgcG9zaXRpb24gZm9yIG5ldyBzdGF0ZVxuICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbisrXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgIC8vIHN0b3JlIHRoZSB0eXBlIGZvciBiYWNrIG5hdmlnYXRpb25cbiAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZSgoc3RhdGUpID0+ICh7Li4uc3RhdGUsIGJhY2tUeXBlOiBcInBhdGNoXCJ9KSlcblxuICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge1xuICAgICAgdHlwZTogXCJwYXRjaFwiLFxuICAgICAgaWQ6IHRoaXMubWFpbi5pZCxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb25cbiAgICB9LCBocmVmKVxuXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpuYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7cGF0Y2g6IHRydWUsIGhyZWYsIHBvcDogZmFsc2UsIGRpcmVjdGlvbjogXCJmb3J3YXJkXCJ9fSlcbiAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICB9XG5cbiAgaGlzdG9yeVJlZGlyZWN0KGUsIGhyZWYsIGxpbmtTdGF0ZSwgZmxhc2gsIHRhcmdldEVsKXtcbiAgICBjb25zdCBjbGlja0xvYWRpbmcgPSB0YXJnZXRFbCAmJiBlLmlzVHJ1c3RlZCAmJiBlLnR5cGUgIT09IFwicG9wc3RhdGVcIlxuICAgIGlmKGNsaWNrTG9hZGluZyl7IHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoXCJwaHgtY2xpY2stbG9hZGluZ1wiKSB9XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluLmlzTWFpbigpKXsgcmV0dXJuIEJyb3dzZXIucmVkaXJlY3QoaHJlZiwgZmxhc2gpIH1cblxuICAgIC8vIGNvbnZlcnQgdG8gZnVsbCBocmVmIGlmIG9ubHkgcGF0aCBwcmVmaXhcbiAgICBpZigvXlxcLyR8XlxcL1teXFwvXSsuKiQvLnRlc3QoaHJlZikpe1xuICAgICAgbGV0IHtwcm90b2NvbCwgaG9zdH0gPSB3aW5kb3cubG9jYXRpb25cbiAgICAgIGhyZWYgPSBgJHtwcm90b2NvbH0vLyR7aG9zdH0ke2hyZWZ9YFxuICAgIH1cbiAgICBsZXQgc2Nyb2xsID0gd2luZG93LnNjcm9sbFlcbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IGhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIn0sIGRvbmUgPT4ge1xuICAgICAgdGhpcy5yZXBsYWNlTWFpbihocmVmLCBmbGFzaCwgKGxpbmtSZWYpID0+IHtcbiAgICAgICAgaWYobGlua1JlZiA9PT0gdGhpcy5saW5rUmVmKXtcbiAgICAgICAgICAvLyBJbmNyZW1lbnQgcG9zaXRpb24gZm9yIG5ldyBzdGF0ZVxuICAgICAgICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbisrXG4gICAgICAgICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgICAgICAgIC8vIHN0b3JlIHRoZSB0eXBlIGZvciBiYWNrIG5hdmlnYXRpb25cbiAgICAgICAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZSgoc3RhdGUpID0+ICh7Li4uc3RhdGUsIGJhY2tUeXBlOiBcInJlZGlyZWN0XCJ9KSlcblxuICAgICAgICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge1xuICAgICAgICAgICAgdHlwZTogXCJyZWRpcmVjdFwiLFxuICAgICAgICAgICAgaWQ6IHRoaXMubWFpbi5pZCxcbiAgICAgICAgICAgIHNjcm9sbDogc2Nyb2xsLFxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuICAgICAgICAgIH0sIGhyZWYpXG5cbiAgICAgICAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4Om5hdmlnYXRlXCIsIHtkZXRhaWw6IHtocmVmLCBwYXRjaDogZmFsc2UsIHBvcDogZmFsc2UsIGRpcmVjdGlvbjogXCJmb3J3YXJkXCJ9fSlcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICAgICAgICB9XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgdW5kbyBjbGljay1sb2FkaW5nIGNsYXNzXG4gICAgICAgIC8vIChpbiBjYXNlIGl0IG9yaWdpbmF0ZWQgaW4gYSBzdGlja3kgbGl2ZSB2aWV3LCBvdGhlcndpc2UgaXQgd291bGQgYmUgcmVtb3ZlZCBhbnl3YXkpXG4gICAgICAgIGlmKGNsaWNrTG9hZGluZyl7IHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJwaHgtY2xpY2stbG9hZGluZ1wiKSB9XG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVnaXN0ZXJOZXdMb2NhdGlvbihuZXdMb2NhdGlvbil7XG4gICAgbGV0IHtwYXRobmFtZSwgc2VhcmNofSA9IHRoaXMuY3VycmVudExvY2F0aW9uXG4gICAgaWYocGF0aG5hbWUgKyBzZWFyY2ggPT09IG5ld0xvY2F0aW9uLnBhdGhuYW1lICsgbmV3TG9jYXRpb24uc2VhcmNoKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKG5ld0xvY2F0aW9uKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBiaW5kRm9ybXMoKXtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDBcbiAgICBsZXQgZXh0ZXJuYWxGb3JtU3VibWl0dGVkID0gZmFsc2VcblxuICAgIC8vIGRpc2FibGUgZm9ybXMgb24gc3VibWl0IHRoYXQgdHJhY2sgcGh4LWNoYW5nZSBidXQgcGVyZm9ybSBleHRlcm5hbCBzdWJtaXRcbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeFN1Ym1pdCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpXG4gICAgICBsZXQgcGh4Q2hhbmdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcbiAgICAgIGlmKCFleHRlcm5hbEZvcm1TdWJtaXR0ZWQgJiYgcGh4Q2hhbmdlICYmICFwaHhTdWJtaXQpe1xuICAgICAgICBleHRlcm5hbEZvcm1TdWJtaXR0ZWQgPSB0cnVlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgdmlldy5kaXNhYmxlRm9ybShlLnRhcmdldClcbiAgICAgICAgICAvLyBzYWZhcmkgbmVlZHMgbmV4dCB0aWNrXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBpZihET00uaXNVbmxvYWRhYmxlRm9ybVN1Ym1pdChlKSl7IHRoaXMudW5sb2FkKCkgfVxuICAgICAgICAgICAgZS50YXJnZXQuc3VibWl0KClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInN1Ym1pdFwiKSlcbiAgICAgIGlmKCFwaHhFdmVudCl7XG4gICAgICAgIGlmKERPTS5pc1VubG9hZGFibGVGb3JtU3VibWl0KGUpKXsgdGhpcy51bmxvYWQoKSB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnRhcmdldC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgSlMuZXhlYyhlLCBcInN1Ym1pdFwiLCBwaHhFdmVudCwgdmlldywgZS50YXJnZXQsIFtcInB1c2hcIiwge3N1Ym1pdHRlcjogZS5zdWJtaXR0ZXJ9XSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGZvcihsZXQgdHlwZSBvZiBbXCJjaGFuZ2VcIiwgXCJpbnB1dFwiXSl7XG4gICAgICB0aGlzLm9uKHR5cGUsIGUgPT4ge1xuICAgICAgICBpZihlIGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZS50YXJnZXQuZm9ybSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAvLyB0aHJvdyBvbiBpbnZhbGlkIEpTLmRpc3BhdGNoIHRhcmdldCBhbmQgbm9vcCBpZiBDdXN0b21FdmVudCB0cmlnZ2VyZWQgb3V0c2lkZSBKUy5kaXNwYXRjaFxuICAgICAgICAgIGlmKGUuZGV0YWlsICYmIGUuZGV0YWlsLmRpc3BhdGNoZXIpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBkaXNwYXRjaGluZyBhIGN1c3RvbSAke3R5cGV9IGV2ZW50IGlzIG9ubHkgc3VwcG9ydGVkIG9uIGlucHV0IGVsZW1lbnRzIGluc2lkZSBhIGZvcm1gKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgICAgIGxldCBpbnB1dCA9IGUudGFyZ2V0XG4gICAgICAgIC8vIGRvIG5vdCBmaXJlIHBoeC1jaGFuZ2UgaWYgd2UgYXJlIGluIHRoZSBtaWRkbGUgb2YgYSBjb21wb3NpdGlvbiBzZXNzaW9uXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2lzQ29tcG9zaW5nXG4gICAgICAgIC8vIFNhZmFyaSBoYXMgaXNzdWVzIGlmIHRoZSBpbnB1dCBpcyB1cGRhdGVkIHdoaWxlIGNvbXBvc2luZ1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzMzMjJcbiAgICAgICAgaWYoZS5pc0NvbXBvc2luZyl7XG4gICAgICAgICAgY29uc3Qga2V5ID0gYGNvbXBvc2l0aW9uLWxpc3RlbmVyLSR7dHlwZX1gXG4gICAgICAgICAgaWYoIURPTS5wcml2YXRlKGlucHV0LCBrZXkpKXtcbiAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBrZXksIHRydWUpXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29tcG9zaXRpb25lbmRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAvLyB0cmlnZ2VyIGEgbmV3IGlucHV0L2NoYW5nZSBldmVudFxuICAgICAgICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCh0eXBlLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgICAgICAgICAgICBET00uZGVsZXRlUHJpdmF0ZShpbnB1dCwga2V5KVxuICAgICAgICAgICAgfSwge29uY2U6IHRydWV9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgaW5wdXRFdmVudCA9IGlucHV0LmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpXG4gICAgICAgIGxldCBmb3JtRXZlbnQgPSBpbnB1dC5mb3JtICYmIGlucHV0LmZvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSlcbiAgICAgICAgbGV0IHBoeEV2ZW50ID0gaW5wdXRFdmVudCB8fCBmb3JtRXZlbnRcbiAgICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgICAgaWYoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dC52YWxpZGl0eSAmJiBpbnB1dC52YWxpZGl0eS5iYWRJbnB1dCl7IHJldHVybiB9XG5cbiAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBpbnB1dEV2ZW50ID8gaW5wdXQgOiBpbnB1dC5mb3JtXG4gICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnNcbiAgICAgICAgaXRlcmF0aW9ucysrXG4gICAgICAgIGxldCB7YXQ6IGF0LCB0eXBlOiBsYXN0VHlwZX0gPSBET00ucHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiKSB8fCB7fVxuICAgICAgICAvLyBCcm93c2VycyBzaG91bGQgYWx3YXlzIGZpcmUgYXQgbGVhc3Qgb25lIFwiaW5wdXRcIiBldmVudCBiZWZvcmUgZXZlcnkgXCJjaGFuZ2VcIlxuICAgICAgICAvLyBJZ25vcmUgXCJjaGFuZ2VcIiBldmVudHMsIHVubGVzcyB0aGVyZSB3YXMgbm8gcHJpb3IgXCJpbnB1dFwiIGV2ZW50LlxuICAgICAgICAvLyBUaGlzIGNvdWxkIGhhcHBlbiBpZiB1c2VyIGNvZGUgdHJpZ2dlcnMgYSBcImNoYW5nZVwiIGV2ZW50LCBvciBpZiB0aGUgYnJvd3NlciBpcyBub24tY29uZm9ybWluZy5cbiAgICAgICAgaWYoYXQgPT09IGN1cnJlbnRJdGVyYXRpb25zIC0gMSAmJiB0eXBlID09PSBcImNoYW5nZVwiICYmIGxhc3RUeXBlID09PSBcImlucHV0XCIpeyByZXR1cm4gfVxuXG4gICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBcInByZXYtaXRlcmF0aW9uXCIsIHthdDogY3VycmVudEl0ZXJhdGlvbnMsIHR5cGU6IHR5cGV9KVxuXG4gICAgICAgIHRoaXMuZGVib3VuY2UoaW5wdXQsIGUsIHR5cGUsICgpID0+IHtcbiAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhkaXNwYXRjaGVyLCB2aWV3ID0+IHtcbiAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQsIHRydWUpXG4gICAgICAgICAgICBKUy5leGVjKGUsIFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogZS50YXJnZXQubmFtZSwgZGlzcGF0Y2hlcjogZGlzcGF0Y2hlcn1dKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLm9uKFwicmVzZXRcIiwgKGUpID0+IHtcbiAgICAgIGxldCBmb3JtID0gZS50YXJnZXRcbiAgICAgIERPTS5yZXNldEZvcm0oZm9ybSlcbiAgICAgIGxldCBpbnB1dCA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZmluZChlbCA9PiBlbC50eXBlID09PSBcInJlc2V0XCIpXG4gICAgICBpZihpbnB1dCl7XG4gICAgICAgIC8vIHdhaXQgdW50aWwgbmV4dCB0aWNrIHRvIGdldCB1cGRhdGVkIGlucHV0IHZhbHVlXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IGZhbHNlfSkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgZXZlbnRUeXBlLCBjYWxsYmFjayl7XG4gICAgaWYoZXZlbnRUeXBlID09PSBcImJsdXJcIiB8fCBldmVudFR5cGUgPT09IFwiZm9jdXNvdXRcIil7IHJldHVybiBjYWxsYmFjaygpIH1cblxuICAgIGxldCBwaHhEZWJvdW5jZSA9IHRoaXMuYmluZGluZyhQSFhfREVCT1VOQ0UpXG4gICAgbGV0IHBoeFRocm90dGxlID0gdGhpcy5iaW5kaW5nKFBIWF9USFJPVFRMRSlcbiAgICBsZXQgZGVmYXVsdERlYm91bmNlID0gdGhpcy5kZWZhdWx0cy5kZWJvdW5jZS50b1N0cmluZygpXG4gICAgbGV0IGRlZmF1bHRUaHJvdHRsZSA9IHRoaXMuZGVmYXVsdHMudGhyb3R0bGUudG9TdHJpbmcoKVxuXG4gICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgbGV0IGFzeW5jRmlsdGVyID0gKCkgPT4gIXZpZXcuaXNEZXN0cm95ZWQoKSAmJiBkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsKVxuICAgICAgRE9NLmRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgYXN5bmNGaWx0ZXIsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc2lsZW5jZUV2ZW50cyhjYWxsYmFjayl7XG4gICAgdGhpcy5zaWxlbmNlZCA9IHRydWVcbiAgICBjYWxsYmFjaygpXG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlXG4gIH1cblxuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIHRoaXMuYm91bmRFdmVudE5hbWVzLmFkZChldmVudClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZSA9PiB7XG4gICAgICBpZighdGhpcy5zaWxlbmNlZCl7IGNhbGxiYWNrKGUpIH1cbiAgICB9KVxuICB9XG5cbiAganNRdWVyeVNlbGVjdG9yQWxsKHNvdXJjZUVsLCBxdWVyeSwgZGVmYXVsdFF1ZXJ5KXtcbiAgICBsZXQgYWxsID0gdGhpcy5kb21DYWxsYmFja3MuanNRdWVyeVNlbGVjdG9yQWxsXG4gICAgcmV0dXJuIGFsbCA/IGFsbChzb3VyY2VFbCwgcXVlcnksIGRlZmF1bHRRdWVyeSkgOiBkZWZhdWx0UXVlcnkoKVxuICB9XG59XG5cbmNsYXNzIFRyYW5zaXRpb25TZXQge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmZvckVhY2godGltZXIgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgfSlcbiAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gIH1cblxuICBhZnRlcihjYWxsYmFjayl7XG4gICAgaWYodGhpcy5zaXplKCkgPT09IDApe1xuICAgICAgY2FsbGJhY2soKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hQZW5kaW5nT3AoY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpe1xuICAgIG9uU3RhcnQoKVxuICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgICBvbkRvbmUoKVxuICAgICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKVxuICAgIH0sIHRpbWUpXG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZGQodGltZXIpXG4gIH1cblxuICBwdXNoUGVuZGluZ09wKG9wKXsgdGhpcy5wZW5kaW5nT3BzLnB1c2gob3ApIH1cblxuICBzaXplKCl7IHJldHVybiB0aGlzLnRyYW5zaXRpb25zLnNpemUgfVxuXG4gIGZsdXNoUGVuZGluZ09wcygpe1xuICAgIGlmKHRoaXMuc2l6ZSgpID4gMCl7IHJldHVybiB9XG4gICAgbGV0IG9wID0gdGhpcy5wZW5kaW5nT3BzLnNoaWZ0KClcbiAgICBpZihvcCl7XG4gICAgICBvcCgpXG4gICAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gICAgfVxuICB9XG59XG4iLCAiLypcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5QaG9lbml4IExpdmVWaWV3IEphdmFTY3JpcHQgQ2xpZW50XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5TZWUgdGhlIGhleGRvY3MgYXQgYGh0dHBzOi8vaGV4ZG9jcy5wbS9waG9lbml4X2xpdmVfdmlld2AgZm9yIGRvY3VtZW50YXRpb24uXG5cbiovXG5cbmltcG9ydCBMaXZlU29ja2V0LCB7aXNVc2VkSW5wdXR9IGZyb20gXCIuL2xpdmVfc29ja2V0XCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBWaWV3SG9vayBmcm9tIFwiLi92aWV3X2hvb2tcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5cbi8qKiBDcmVhdGVzIGEgVmlld0hvb2sgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBlbGVtZW50IGFuZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBhc3NvY2lhdGUgd2l0aCB0aGUgaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY2FsbGJhY2tzXSAtIFRoZSBsaXN0IG9mIGhvb2sgY2FsbGJhY2tzLCBzdWNoIGFzIG1vdW50ZWQsXG4gKiAgIHVwZGF0ZWQsIGRlc3Ryb3llZCwgZXRjLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gKiAgIGNvbm5lY3RlZENhbGxiYWNrKCl7XG4gKiAgICAgbGV0IG9uTGl2ZVZpZXdNb3VudGVkID0gKCkgPT4gdGhpcy5ob29rLnB1c2hFdmVudCguLi4pKVxuICogICAgIHRoaXMuaG9vayA9IGNyZWF0ZUhvb2sodGhpcywge21vdW50ZWQ6IG9uTGl2ZVZpZXdNb3VudGVkfSlcbiAqICAgfVxuICogfVxuICpcbiAqICpOb3RlKjogYGNyZWF0ZUhvb2tgIG11c3QgYmUgY2FsbGVkIGZyb20gdGhlIGBjb25uZWN0ZWRDYWxsYmFja2AgbGlmZWN5Y2xlXG4gKiB3aGljaCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIGVsZW1lbnQgaGFzIGJlZW4gYWRkZWQgdG8gdGhlIERPTS4gSWYgeW91IHRyeVxuICogdG8gY2FsbCBgY3JlYXRlSG9va2AgZnJvbSB0aGUgY29uc3RydWN0b3IsIGFuIGVycm9yIHdpbGwgYmUgbG9nZ2VkLlxuICpcbiAqIEByZXR1cm5zIHtWaWV3SG9va30gUmV0dXJucyB0aGUgVmlld0hvb2sgaW5zdGFuY2UgZm9yIHRoZSBjdXN0b20gZWxlbWVudC5cbiAqL1xubGV0IGNyZWF0ZUhvb2sgPSAoZWwsIGNhbGxiYWNrcyA9IHt9KSA9PiB7XG4gIGxldCBleGlzdGluZ0hvb2sgPSBET00uZ2V0Q3VzdG9tRWxIb29rKGVsKVxuICBpZihleGlzdGluZ0hvb2speyByZXR1cm4gZXhpc3RpbmdIb29rIH1cblxuICBsZXQgaG9vayA9IG5ldyBWaWV3SG9vayhWaWV3LmNsb3Nlc3RWaWV3KGVsKSwgZWwsIGNhbGxiYWNrcylcbiAgRE9NLnB1dEN1c3RvbUVsSG9vayhlbCwgaG9vaylcbiAgcmV0dXJuIGhvb2tcbn1cblxuZXhwb3J0IHtcbiAgTGl2ZVNvY2tldCxcbiAgaXNVc2VkSW5wdXQsXG4gIGNyZWF0ZUhvb2tcbn1cbiIsICIvLyBXZSBpbXBvcnQgdGhlIENTUyB3aGljaCBpcyBleHRyYWN0ZWQgdG8gaXRzIG93biBmaWxlIGJ5IGVzYnVpbGQuXG4vLyBSZW1vdmUgdGhpcyBsaW5lIGlmIHlvdSBhZGQgYSB5b3VyIG93biBDU1MgYnVpbGQgcGlwZWxpbmUgKGUuZyBwb3N0Y3NzKS5cbmltcG9ydCBcIi4uL2Nzcy9hcHAuY3NzXCJcbi8vIEltcG9ydCB0aGUgZGFyayBtb2RlIHRvZ2dsZSBzY3JpcHRcbmltcG9ydCBcIi4vZGFya19tb2RlXCJcblxuLy8gUG9zdEhvZyBhbmFseXRpY3MgaXMgaGFuZGxlZCB2aWEgdGhlIHdlYiBzbmlwcGV0IGluIHJvb3QuaHRtbC5oZWV4XG5cbi8vIElmIHlvdSB3YW50IHRvIHVzZSBQaG9lbml4IGNoYW5uZWxzLCBydW4gYG1peCBoZWxwIHBoeC5nZW4uY2hhbm5lbGBcbi8vIHRvIGdldCBzdGFydGVkIGFuZCB0aGVuIHVuY29tbWVudCB0aGUgbGluZSBiZWxvdy5cbi8vIGltcG9ydCBcIi4vdXNlcl9zb2NrZXQuanNcIlxuXG4vLyBZb3UgY2FuIGluY2x1ZGUgZGVwZW5kZW5jaWVzIGluIHR3byB3YXlzLlxuLy9cbi8vIFRoZSBzaW1wbGVzdCBvcHRpb24gaXMgdG8gcHV0IHRoZW0gaW4gYXNzZXRzL3ZlbmRvciBhbmRcbi8vIGltcG9ydCB0aGVtIHVzaW5nIHJlbGF0aXZlIHBhdGhzOlxuLy9cbi8vICAgICBpbXBvcnQgXCIuLi92ZW5kb3Ivc29tZS1wYWNrYWdlLmpzXCJcbi8vXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGBucG0gaW5zdGFsbCBzb21lLXBhY2thZ2UgLS1wcmVmaXggYXNzZXRzYCBhbmQgaW1wb3J0XG4vLyB0aGVtIHVzaW5nIGEgcGF0aCBzdGFydGluZyB3aXRoIHRoZSBwYWNrYWdlIG5hbWU6XG4vL1xuLy8gICAgIGltcG9ydCBcInNvbWUtcGFja2FnZVwiXG4vL1xuXG4vLyBJbmNsdWRlIHBob2VuaXhfaHRtbCB0byBoYW5kbGUgbWV0aG9kPVBVVC9ERUxFVEUgaW4gZm9ybXMgYW5kIGJ1dHRvbnMuXG5pbXBvcnQgXCJwaG9lbml4X2h0bWxcIlxuLy8gRXN0YWJsaXNoIFBob2VuaXggU29ja2V0IGFuZCBMaXZlVmlldyBjb25maWd1cmF0aW9uLlxuaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbmltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbmltcG9ydCB0b3BiYXIgZnJvbSBcIi4uL3ZlbmRvci90b3BiYXJcIlxuXG5sZXQgSG9va3MgPSB7fVxuXG5cbi8vIE1vZGFsIENsaWNrIEhhbmRsZXIgSG9va1xuSG9va3MuTW9kYWxDbGlja0hhbmRsZXIgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhcIk1vZGFsQ2xpY2tIYW5kbGVyIG1vdW50ZWQgb24gZWxlbWVudDpcIiwgdGhpcy5lbClcbiAgICBjb25zb2xlLmRlYnVnKFwiRWxlbWVudCBJRDpcIiwgdGhpcy5lbC5pZClcbiAgICBjb25zb2xlLmRlYnVnKFwiRWxlbWVudCBjbGFzc2VzOlwiLCB0aGlzLmVsLmNsYXNzTmFtZSlcblxuICAgIC8vIEhhbmRsZSBYIGJ1dHRvbiBjbGlja3Mgd2l0aCBjb25maXJtYXRpb25cbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5zdW1tYXJ5LW1vZGFsLWNsb3NlXCIpXG4gICAgaWYgKGNsb3NlQnV0dG9uKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFwiQ2xvc2UgYnV0dG9uIGZvdW5kIGFuZCBldmVudCBsaXN0ZW5lciBhdHRhY2hlZFwiKVxuICAgICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsQ2xvc2UoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIk5vIGNsb3NlIGJ1dHRvbiBmb3VuZFwiKVxuICAgIH1cblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAvLyBEZWJ1ZyBBTEwgY2xpY2sgZXZlbnRzIG9uIHRoZSBtb2RhbFxuICAgICAgY29uc29sZS5kZWJ1ZyhcIkNsaWNrIGV2ZW50IGRldGVjdGVkIG9uIG1vZGFsOlwiKVxuICAgICAgY29uc29sZS5kZWJ1ZyhcIi0gRXZlbnQgdGFyZ2V0OlwiLCBlLnRhcmdldClcbiAgICAgIGNvbnNvbGUuZGVidWcoXCItIFRhcmdldCB0YWdOYW1lOlwiLCBlLnRhcmdldC50YWdOYW1lKVxuICAgICAgY29uc29sZS5kZWJ1ZyhcIi0gVGFyZ2V0IGNsYXNzZXM6XCIsIGUudGFyZ2V0LmNsYXNzTmFtZSlcbiAgICAgIGNvbnNvbGUuZGVidWcoXCItIFRhcmdldCA9PT0gdGhpcy5lbDpcIiwgZS50YXJnZXQgPT09IHRoaXMuZWwpXG4gICAgICBjb25zb2xlLmRlYnVnKFwiLSB0aGlzLmVsOlwiLCB0aGlzLmVsKVxuXG4gICAgICAvLyBIYW5kbGUgY29weSBidXR0b24gY2xpY2tzXG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29weS10by1jbGlwYm9hcmQtYnRuXCIpKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJDb3B5IGJ1dHRvbiBjbGlja2VkXCIpXG4gICAgICAgIGNvbnN0IGNvbnRlbnREaXYgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCIuc3VtbWFyeS1jb250ZW50XCIpXG4gICAgICAgIGlmIChjb250ZW50RGl2KSB7XG4gICAgICAgICAgLy8gR2V0IHRleHQgY29udGVudCwgcHJlc2VydmUgbGluZSBicmVha3NcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gY29udGVudERpdi5pbm5lclRleHQgfHwgY29udGVudERpdi50ZXh0Q29udGVudCB8fCBcIlwiXG4gICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBWaXN1YWwgZmVlZGJhY2sgLSBicmllZmx5IGNoYW5nZSB0aGUgaWNvblxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gZS50YXJnZXQudGV4dENvbnRlbnRcbiAgICAgICAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJcdTI3MDVcIlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBjb3B5IHRleHQ6ICcsIGVycilcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrIGZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICAgICAgdGhpcy5mYWxsYmFja0NvcHlUZXh0VG9DbGlwYm9hcmQodGV4dCwgZS50YXJnZXQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gQ2xpY2stb3V0c2lkZS10by1jbG9zZSBiZWhhdmlvciAtIG9ubHkgd2hlbiBOT1QgbG9hZGluZ1xuICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmVsKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCI9PT0gQ0xJQ0stT1VUU0lERSBERVRFQ1RFRCA9PT1cIilcblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSdyZSBjdXJyZW50bHkgbG9hZGluZyAoZ2VuZXJhdGluZyBjb250ZW50KVxuICAgICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5zdW1tYXJ5LWxvYWRpbmdcIilcbiAgICAgICAgY29uc3QgZGF0YUxvYWRpbmcgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtbG9hZGluZ1wiKVxuXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJMb2FkaW5nIHN0YXRlIGNoZWNrOlwiKVxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiLSAuc3VtbWFyeS1sb2FkaW5nIGVsZW1lbnQ6XCIsIGxvYWRpbmdFbGVtZW50KVxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiLSBkYXRhLWxvYWRpbmcgYXR0cmlidXRlOlwiLCBkYXRhTG9hZGluZylcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIi0gTW9kYWwgaW5uZXJIVE1MIHByZXZpZXc6XCIsIHRoaXMuZWwuaW5uZXJIVE1MLnN1YnN0cmluZygwLCAyMDApKVxuXG4gICAgICAgIGlmIChsb2FkaW5nRWxlbWVudCkge1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJcdTI3NEMgUFJFVkVOVElORyBDTE9TRSAtIGNvbnRlbnQgaXMgbG9hZGluZ1wiKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGFMb2FkaW5nID09PSBcInRydWVcIikge1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJcdTI3NEMgUFJFVkVOVElORyBDTE9TRSAtIGRhdGEtbG9hZGluZyBpcyB0cnVlXCIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiXHUyNzA1IEFMTE9XSU5HIENMT1NFIC0gbm90IGxvYWRpbmdcIilcbiAgICAgICAgdGhpcy5oYW5kbGVNb2RhbENsb3NlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJDbGljayB3YXMgb24gY2hpbGQgZWxlbWVudCwgbm90IGNsb3NpbmcgbW9kYWxcIilcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGhhbmRsZU1vZGFsQ2xvc2UoKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhcIj09PSBoYW5kbGVNb2RhbENsb3NlKCkgY2FsbGVkID09PVwiKVxuICAgIGNvbnNvbGUuZGVidWcoXCJQdXNoaW5nIG1vZGFsX2Nsb3NlX3JlcXVlc3QgZXZlbnQgdG8gI1wiICsgdGhpcy5lbC5pZClcblxuICAgIC8vIFB1c2ggZXZlbnQgZGlyZWN0bHkgdG8gdGhlIExpdmVDb21wb25lbnQgdXNpbmcgaXRzIElEXG4gICAgdGhpcy5wdXNoRXZlbnRUbyhcIiNcIiArIHRoaXMuZWwuaWQsIFwibW9kYWxfY2xvc2VfcmVxdWVzdFwiLCB7fSlcbiAgfSxcblxuICB1cGRhdGVkKCkge1xuICAgIGNvbnNvbGUuZGVidWcoXCI9PT0gTW9kYWwgdXBkYXRlZCA9PT1cIilcbiAgICBjb25zb2xlLmRlYnVnKFwiLSBkYXRhLWxvYWRpbmc6XCIsIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpKVxuICAgIGNvbnNvbGUuZGVidWcoXCItIGRpc3BsYXkgc3R5bGU6XCIsIHRoaXMuZWwuc3R5bGUuZGlzcGxheSlcbiAgICBjb25zb2xlLmRlYnVnKFwiLSAuc3VtbWFyeS1sb2FkaW5nIHByZXNlbnQ6XCIsICEhdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiLnN1bW1hcnktbG9hZGluZ1wiKSlcbiAgfSxcbiAgXG4gIFxuICBmYWxsYmFja0NvcHlUZXh0VG9DbGlwYm9hcmQodGV4dCwgYnV0dG9uKSB7XG4gICAgY29uc3QgdGV4dEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcbiAgICB0ZXh0QXJlYS52YWx1ZSA9IHRleHRcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRBcmVhKVxuICAgIHRleHRBcmVhLmZvY3VzKClcbiAgICB0ZXh0QXJlYS5zZWxlY3QoKVxuICAgIHRyeSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpXG4gICAgICBjb25zdCBvcmlnaW5hbFRleHQgPSBidXR0b24udGV4dENvbnRlbnRcbiAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiXHUyNzA1XCJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBvcmlnaW5hbFRleHRcbiAgICAgIH0sIDEwMDApXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0ZhbGxiYWNrIGNvcHkgZmFpbGVkOiAnLCBlcnIpXG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dEFyZWEpXG4gIH1cbn1cblxuLy8gRmVlZGJhY2sgRm9ybSBIb29rXG5Ib29rcy5GZWVkYmFja0Zvcm0gPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zZXR1cEZlZWRiYWNrSW50ZXJhY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEF1dG9IaWRlU3VjY2VzcygpO1xuICB9LFxuXG4gIHVwZGF0ZWQoKSB7XG4gICAgdGhpcy5zZXR1cEZlZWRiYWNrSW50ZXJhY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEF1dG9IaWRlU3VjY2VzcygpO1xuICB9LFxuXG4gIHNldHVwRmVlZGJhY2tJbnRlcmFjdGlvbnMoKSB7XG4gICAgLy8gSGFuZGxlIGNoZWNrYm94ZXMgdGhhdCBoYXZlIGFzc29jaWF0ZWQgZGV0YWlscyBmaWVsZHNcbiAgICBjb25zdCB0b2dnbGVzID0gWydkb250X2xpa2UnLCAnd3JvbmcnXTtcbiAgICB0b2dnbGVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgY2hlY2tib3ggPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0W3ZhbHVlPVwiJHt2YWx1ZX1cIl1gKTtcbiAgICAgIGNvbnN0IGRldGFpbHNEaXYgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoYC5mZWVkYmFjay1kZXRhaWxzLWZpZWxkW2RhdGEtZm9yPVwiJHt2YWx1ZX1cIl1gKTtcbiAgICAgIGlmIChjaGVja2JveCAmJiBkZXRhaWxzRGl2KSB7XG4gICAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgICAgaWYgKGUudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGRldGFpbHNEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBkZXRhaWxzRGl2LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk/LmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRldGFpbHNEaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGNvbnN0IHRleHRhcmVhID0gZGV0YWlsc0Rpdi5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhKSB0ZXh0YXJlYS52YWx1ZSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0dXBBdXRvSGlkZVN1Y2Nlc3MoKSB7XG4gICAgY29uc3QgdGhhbmtzRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZlZWRiYWNrLXRoYW5rcycpO1xuICAgIGlmICh0aGFua3NEaXYgJiYgdGhhbmtzRGl2LnRleHRDb250ZW50LnRyaW0oKSA9PT0gJ1RoYW5rcyEnICYmICF0aGFua3NEaXYuZGF0YXNldC50cmFja2VkKSB7XG4gICAgICAvLyBUcmFjayBQb3N0SG9nIGV2ZW50IHdoZW4gc3VjY2VzcyBpcyBzaG93blxuICAgICAgdGhpcy50cmFja1Bvc3RIb2dGZWVkYmFjaygpO1xuICAgICAgXG4gICAgICAvLyBNYXJrIGFzIHRyYWNrZWQgdG8gcHJldmVudCBkb3VibGUtdHJhY2tpbmdcbiAgICAgIHRoYW5rc0Rpdi5kYXRhc2V0LnRyYWNrZWQgPSAndHJ1ZSc7XG4gICAgICBcbiAgICAgIC8vIEF1dG8taGlkZSBhZnRlciAzIHNlY29uZHNcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBSZXNldCB0aGUgZmVlZGJhY2sgc3VjY2VzcyBzdGF0ZVxuICAgICAgICBjb25zdCBwYXJlbnRNb2RhbCA9IHRoaXMuZWwuY2xvc2VzdCgnLnN1bW1hcnktbW9kYWwtb3ZlcmxheScpO1xuICAgICAgICBpZiAocGFyZW50TW9kYWwpIHtcbiAgICAgICAgICB0aGlzLnB1c2hFdmVudFRvKFwiI1wiICsgcGFyZW50TW9kYWwuaWQsIFwicmVzZXRfZmVlZGJhY2tfc3VjY2Vzc1wiLCB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDMwMDApO1xuICAgIH1cbiAgfSxcblxuICB0cmFja1Bvc3RIb2dGZWVkYmFjaygpIHtcbiAgICBpZiAodHlwZW9mIHBvc3Rob2cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgICBjb25zdCBtb2RhbCA9IHRoaXMuZWwuY2xvc2VzdCgnLnN1bW1hcnktbW9kYWwtb3ZlcmxheScpO1xuICAgIGlmICghbW9kYWwpIHJldHVybjtcblxuICAgIGNvbnN0IHRpdGxlVGV4dCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5zdW1tYXJ5LW1vZGFsLXRpdGxlJyk/LnRleHRDb250ZW50Py50cmltKCkgfHwgJyc7XG4gICAgY29uc3QgcmVjb3JkSWQgPSBtb2RhbC5kYXRhc2V0LnJlY29yZElkIHx8ICdVbmtub3duJztcblxuICAgIC8vIFBhcnNlIGNvbnRleHQgZnJvbSBtb2RhbCB0aXRsZSBzdHJpbmdcbiAgICBsZXQgY29udGVudF90eXBlID0gdGl0bGVUZXh0O1xuICAgIGxldCBjaGFyYWN0ZXJfbmFtZSA9IG51bGw7XG4gICAgbGV0IHBsYXlfdGl0bGUgPSBudWxsO1xuICAgIGxldCBsb2NhdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGl0bGVUZXh0LnN0YXJ0c1dpdGgoJ01vZGVybiBQYXJhcGhyYXNpbmc6ICcpKSB7XG4gICAgICBjb250ZW50X3R5cGUgPSAnUGFyYXBocmFzaW5nJztcbiAgICAgIGNoYXJhY3Rlcl9uYW1lID0gdGl0bGVUZXh0LnJlcGxhY2UoJ01vZGVybiBQYXJhcGhyYXNpbmc6ICcsICcnKS50cmltKCk7XG4gICAgfSBlbHNlIGlmICh0aXRsZVRleHQuc3RhcnRzV2l0aCgnUGxheSBTdW1tYXJ5OiAnKSkge1xuICAgICAgY29udGVudF90eXBlID0gJ1BsYXkgU3VtbWFyeSc7XG4gICAgICBwbGF5X3RpdGxlID0gdGl0bGVUZXh0LnJlcGxhY2UoJ1BsYXkgU3VtbWFyeTogJywgJycpLnRyaW0oKTtcbiAgICB9IGVsc2UgaWYgKHRpdGxlVGV4dC5zdGFydHNXaXRoKCdTY2VuZSBTdW1tYXJ5OiAnKSkge1xuICAgICAgY29udGVudF90eXBlID0gJ1NjZW5lIFN1bW1hcnknO1xuICAgICAgY29uc3QgcmVzdCA9IHRpdGxlVGV4dC5yZXBsYWNlKCdTY2VuZSBTdW1tYXJ5OiAnLCAnJykudHJpbSgpO1xuICAgICAgY29uc3QgZGFzaElkeCA9IHJlc3QuaW5kZXhPZignIC0gJyk7XG4gICAgICBpZiAoZGFzaElkeCAhPT0gLTEpIHtcbiAgICAgICAgcGxheV90aXRsZSA9IHJlc3Quc3Vic3RyaW5nKDAsIGRhc2hJZHgpO1xuICAgICAgICBsb2NhdGlvbiA9IHJlc3Quc3Vic3RyaW5nKGRhc2hJZHggKyAzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXlfdGl0bGUgPSByZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7XG4gICAgICBjb250ZW50X3R5cGU6IGNvbnRlbnRfdHlwZSxcbiAgICAgIHJlY29yZF9pZDogcmVjb3JkSWQsXG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgIH07XG5cbiAgICBpZiAoY2hhcmFjdGVyX25hbWUpIHByb3BlcnRpZXMuY2hhcmFjdGVyX25hbWUgPSBjaGFyYWN0ZXJfbmFtZTtcbiAgICBpZiAocGxheV90aXRsZSkgcHJvcGVydGllcy5wbGF5X3RpdGxlID0gcGxheV90aXRsZTtcbiAgICBpZiAobG9jYXRpb24pIHByb3BlcnRpZXMubG9jYXRpb24gPSBsb2NhdGlvbjtcblxuICAgIHBvc3Rob2cuY2FwdHVyZSgnYWlfY29udGVudF9mZWVkYmFjaycsIHByb3BlcnRpZXMpO1xuICB9LFxuXG4gIC8vIE5vIGxvbmdlciBuZWVkZWQgLSBQb3N0SG9nIHRyYWNraW5nIGhhcHBlbnMgaW4gdHJhY2tQb3N0SG9nRmVlZGJhY2soKVxufVxuXG5sZXQgY3NyZlRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcbmxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHtcbiAgcGFyYW1zOiB7X2NzcmZfdG9rZW46IGNzcmZUb2tlbn0sXG4gIGhvb2tzOiBIb29rc1xufSlcblxuLy8gQ2FwdHVyZSBzZWFyY2hlcyBmb3IgUG9zdEhvZyBjdXN0b20gZXZlbnRcbmxldCBzZWFyY2hUaW1lb3V0O1xuXG4vLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHNlYXJjaCBpbnB1dCBmb3IgUG9zdEhvZyBjdXN0b20gZXZlbnRcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnLnNlYXJjaC1ib3gtZGVmYXVsdCcpKSB7XG4gICAgY29uc3Qgc2VhcmNoUXVlcnkgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgXG4gICAgLy8gQ2xlYXIgdGhlIHByZXZpb3VzIHRpbWVvdXRcbiAgICBjbGVhclRpbWVvdXQoc2VhcmNoVGltZW91dCk7XG4gICAgXG4gICAgLy8gU2V0IGEgbmV3IHRpbWVvdXQgdG8gY2FwdHVyZSB0aGUgZXZlbnQgYWZ0ZXIgNSBzZWNvbmRzIG9mIGluYWN0aXZpdHlcbiAgICBzZWFyY2hUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHBvc3Rob2cuY2FwdHVyZSgndXNlZF9zZWFyY2gnLCB7IHNlYXJjaGVkX2Zvcjogc2VhcmNoUXVlcnkgfSk7XG4gICAgfSwgNTAwMCk7XG4gIH1cbn0sIGZhbHNlKTtcblxuLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBQREYgbGlua3MgZm9yIFBvc3RIb2cgY3VzdG9tIGV2ZW50XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoJy5tb25vbG9ndWUtcGRmbGluaycpKSB7XG4gICAgY29uc3QgbGlua0VsZW1lbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnYScpO1xuICAgIGlmIChsaW5rRWxlbWVudCkge1xuICAgICAgY29uc3QgcGRmX3VybCA9IGxpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgICAgXG4gICAgICAvLyBHZXQgbW9ub2xvZ3VlIGNvbnRleHQgZnJvbSB0aGUgcm93XG4gICAgICBjb25zdCBtb25vbG9ndWVSb3cgPSBsaW5rRWxlbWVudC5jbG9zZXN0KCd0cicpO1xuICAgICAgbGV0IG1vbm9sb2d1ZV9pZCA9IG51bGw7XG4gICAgICBsZXQgY2hhcmFjdGVyX25hbWUgPSBudWxsO1xuICAgICAgbGV0IHBsYXlfdGl0bGUgPSBudWxsO1xuICAgICAgXG4gICAgICBpZiAobW9ub2xvZ3VlUm93KSB7XG4gICAgICAgIC8vIFRyeSB0byBnZXQgbW9ub2xvZ3VlIElEIGZyb20gbmVhcmJ5IHN1bW1hcnkgaWNvblxuICAgICAgICBjb25zdCBzdW1tYXJ5SWNvbiA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcuc3VtbWFyeS1pY29uW3BoeC12YWx1ZS1tb25vbG9ndWUtaWRdJyk7XG4gICAgICAgIGlmIChzdW1tYXJ5SWNvbikge1xuICAgICAgICAgIG1vbm9sb2d1ZV9pZCA9IHN1bW1hcnlJY29uLmdldEF0dHJpYnV0ZSgncGh4LXZhbHVlLW1vbm9sb2d1ZS1pZCcpO1xuICAgICAgICAgIGNoYXJhY3Rlcl9uYW1lID0gc3VtbWFyeUljb24uZ2V0QXR0cmlidXRlKCdwaHgtdmFsdWUtY2hhcmFjdGVyJyk7XG4gICAgICAgICAgcGxheV90aXRsZSA9IHN1bW1hcnlJY29uLmdldEF0dHJpYnV0ZSgncGh4LXZhbHVlLXBsYXktdGl0bGUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gRmFsbGJhY2sgdG8gZXh0cmFjdGluZyBmcm9tIHRleHQgY29udGVudFxuICAgICAgICBpZiAoIWNoYXJhY3Rlcl9uYW1lKSB7XG4gICAgICAgICAgY29uc3QgY2hhcmFjdGVyRWxlbWVudCA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcubW9ub2xvZ3VlLWNoYXJhY3RlcicpO1xuICAgICAgICAgIGNoYXJhY3Rlcl9uYW1lID0gY2hhcmFjdGVyRWxlbWVudCA/IGNoYXJhY3RlckVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpIDogbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFwbGF5X3RpdGxlKSB7XG4gICAgICAgICAgY29uc3QgcGxheUVsZW1lbnQgPSBtb25vbG9ndWVSb3cucXVlcnlTZWxlY3RvcignLm1vbm9sb2d1ZS1wbGF5bmFtZScpO1xuICAgICAgICAgIHBsYXlfdGl0bGUgPSBwbGF5RWxlbWVudCA/IHBsYXlFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKSA6IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgbG9jYXRpb24gPSBtb25vbG9ndWVSb3cgPyBtb25vbG9ndWVSb3cuZGF0YXNldC5sb2NhdGlvbiA6IG51bGw7XG4gICAgICBjb25zdCBmaXJzdF9saW5lID0gbW9ub2xvZ3VlUm93ID8gbW9ub2xvZ3VlUm93LmRhdGFzZXQuZmlyc3RsaW5lIDogbnVsbDtcblxuICAgICAgcG9zdGhvZy5jYXB0dXJlKCdwZGZfY2xpY2tlZCcsIHtcbiAgICAgICAgcGRmX3VybDogcGRmX3VybCxcbiAgICAgICAgbW9ub2xvZ3VlX2lkOiBtb25vbG9ndWVfaWQsXG4gICAgICAgIGNoYXJhY3Rlcl9uYW1lOiBjaGFyYWN0ZXJfbmFtZSxcbiAgICAgICAgcGxheV90aXRsZTogcGxheV90aXRsZSxcbiAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgICBmaXJzdF9saW5lOiBmaXJzdF9saW5lXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0sIGZhbHNlKTtcblxuLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVyIHRvIG1vbm9sb2d1ZSBmaXJzdCBsaW5lIGNsaWNrcyBmb3IgUG9zdEhvZyBjdXN0b20gZXZlbnRcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnLm1vbm9sb2d1ZS1maXJzdGxpbmUtdGFibGUnKSB8fCBcbiAgICAgIGV2ZW50LnRhcmdldC5jbG9zZXN0KCcubW9ub2xvZ3VlLWZpcnN0bGluZS10YWJsZScpKSB7XG4gICAgY29uc3QgZmlyc3RMaW5lRWxlbWVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcubW9ub2xvZ3VlLWZpcnN0bGluZS10YWJsZScpIHx8IGV2ZW50LnRhcmdldDtcbiAgICBjb25zdCB0YXJnZXRJZCA9IGZpcnN0TGluZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpO1xuICAgIGNvbnN0IGNvbGxhcHNlRWxlbWVudCA9IHRhcmdldElkID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXRJZCkgOiBudWxsO1xuICAgIFxuICAgIC8vIERldGVybWluZSBpZiB0aGlzIGlzIGV4cGFuZGluZyBvciBjb2xsYXBzaW5nXG4gICAgY29uc3QgaXNFeHBhbmRpbmcgPSBjb2xsYXBzZUVsZW1lbnQgJiYgIWNvbGxhcHNlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKTtcbiAgICBcbiAgICBpZiAoaXNFeHBhbmRpbmcpIHtcbiAgICAgIC8vIEdldCBtb25vbG9ndWUgZGV0YWlscyBmcm9tIHRoZSByb3cgY29udGV4dFxuICAgICAgY29uc3QgbW9ub2xvZ3VlUm93ID0gZmlyc3RMaW5lRWxlbWVudC5jbG9zZXN0KCd0cicpO1xuICAgICAgbGV0IG1vbm9sb2d1ZV9pZCA9IG51bGw7XG4gICAgICBsZXQgY2hhcmFjdGVyX25hbWUgPSBudWxsO1xuICAgICAgbGV0IHBsYXlfdGl0bGUgPSBudWxsO1xuICAgICAgXG4gICAgICBpZiAobW9ub2xvZ3VlUm93KSB7XG4gICAgICAgIC8vIEV4dHJhY3QgY2hhcmFjdGVyIG5hbWUgZnJvbSB0aGUgY2hhcmFjdGVyIHNwYW5cbiAgICAgICAgY29uc3QgY2hhcmFjdGVyRWxlbWVudCA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcubW9ub2xvZ3VlLWNoYXJhY3RlcicpO1xuICAgICAgICBjaGFyYWN0ZXJfbmFtZSA9IGNoYXJhY3RlckVsZW1lbnQgPyBjaGFyYWN0ZXJFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKSA6IG51bGw7XG4gICAgICAgIFxuICAgICAgICAvLyBFeHRyYWN0IHBsYXkgdGl0bGUgZnJvbSB0aGUgcGxheSBuYW1lIHNwYW5cbiAgICAgICAgY29uc3QgcGxheUVsZW1lbnQgPSBtb25vbG9ndWVSb3cucXVlcnlTZWxlY3RvcignLm1vbm9sb2d1ZS1wbGF5bmFtZScpO1xuICAgICAgICBwbGF5X3RpdGxlID0gcGxheUVsZW1lbnQgPyBwbGF5RWxlbWVudC50ZXh0Q29udGVudC50cmltKCkgOiBudWxsO1xuICAgICAgICBcbiAgICAgICAgLy8gVHJ5IHRvIGdldCBtb25vbG9ndWUgSUQgZnJvbSBuZWFyYnkgc3VtbWFyeSBpY29uIGlmIHByZXNlbnRcbiAgICAgICAgY29uc3Qgc3VtbWFyeUljb24gPSBtb25vbG9ndWVSb3cucXVlcnlTZWxlY3RvcignLnN1bW1hcnktaWNvbltwaHgtdmFsdWUtbW9ub2xvZ3VlLWlkXScpO1xuICAgICAgICBpZiAoc3VtbWFyeUljb24pIHtcbiAgICAgICAgICBtb25vbG9ndWVfaWQgPSBzdW1tYXJ5SWNvbi5nZXRBdHRyaWJ1dGUoJ3BoeC12YWx1ZS1tb25vbG9ndWUtaWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBsb2NhdGlvbiA9IG1vbm9sb2d1ZVJvdyA/IG1vbm9sb2d1ZVJvdy5kYXRhc2V0LmxvY2F0aW9uIDogbnVsbDtcbiAgICAgIGNvbnN0IGZpcnN0X2xpbmUgPSBtb25vbG9ndWVSb3cgPyBtb25vbG9ndWVSb3cuZGF0YXNldC5maXJzdGxpbmUgOiBudWxsO1xuXG4gICAgICBwb3N0aG9nLmNhcHR1cmUoJ21vbm9sb2d1ZV9leHBhbmRlZCcsIHtcbiAgICAgICAgbW9ub2xvZ3VlX2lkOiBtb25vbG9ndWVfaWQsXG4gICAgICAgIGNoYXJhY3Rlcl9uYW1lOiBjaGFyYWN0ZXJfbmFtZSxcbiAgICAgICAgcGxheV90aXRsZTogcGxheV90aXRsZSxcbiAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgICBmaXJzdF9saW5lOiBmaXJzdF9saW5lXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0sIGZhbHNlKTtcblxuLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVyIHRvIHN1bW1hcnkvcGFyYXBocmFzaW5nIGljb24gY2xpY2tzIGZvciBQb3N0SG9nIGN1c3RvbSBldmVudFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKCcuc3VtbWFyeS1pY29uJykgfHwgXG4gICAgICBldmVudC50YXJnZXQuY2xvc2VzdCgnLnN1bW1hcnktaWNvbicpKSB7XG4gICAgY29uc3Qgc3VtbWFyeUljb24gPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLnN1bW1hcnktaWNvbicpIHx8IGV2ZW50LnRhcmdldDtcbiAgICBcbiAgICAvLyBHZXQgZGV0YWlscyBmcm9tIHRoZSBhdHRyaWJ1dGVzXG4gICAgY29uc3QgbW9ub2xvZ3VlX2lkID0gc3VtbWFyeUljb24uZ2V0QXR0cmlidXRlKCdwaHgtdmFsdWUtbW9ub2xvZ3VlLWlkJyk7XG4gICAgY29uc3QgY2hhcmFjdGVyX25hbWUgPSBzdW1tYXJ5SWNvbi5nZXRBdHRyaWJ1dGUoJ3BoeC12YWx1ZS1jaGFyYWN0ZXInKTtcbiAgICBjb25zdCBwbGF5X3RpdGxlID0gc3VtbWFyeUljb24uZ2V0QXR0cmlidXRlKCdwaHgtdmFsdWUtcGxheS10aXRsZScpO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gc3VtbWFyeUljb24uZ2V0QXR0cmlidXRlKCdwaHgtdmFsdWUtbG9jYXRpb24nKTtcbiAgICBcbiAgICAvLyBEZXRlcm1pbmUgcmVxdWVzdCB0eXBlIHVzaW5nIHBoeC1jbGljayBhdHRyaWJ1dGUgKHJlbGlhYmxlLCBub3QgRE9NLXN0cnVjdHVyZSBkZXBlbmRlbnQpXG4gICAgY29uc3QgcGh4Q2xpY2sgPSBzdW1tYXJ5SWNvbi5nZXRBdHRyaWJ1dGUoJ3BoeC1jbGljaycpO1xuICAgIGNvbnN0IG1vbm9sb2d1ZVJvdyA9IHN1bW1hcnlJY29uLmNsb3Nlc3QoJ3RyJyk7XG4gICAgbGV0IGV2ZW50X25hbWUgPSAncGFyYXBocmFzaW5nX3JlcXVlc3RlZCc7IC8vIGRlZmF1bHRcbiAgICBsZXQgcHJvcGVydGllcyA9IHtcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcblxuICAgIGlmIChwaHhDbGljayA9PT0gJ3Nob3dfcGxheV9zdW1tYXJ5Jykge1xuICAgICAgZXZlbnRfbmFtZSA9ICdwbGF5X3N1bW1hcnlfcmVxdWVzdGVkJztcbiAgICAgIHByb3BlcnRpZXMucGxheV90aXRsZSA9IHBsYXlfdGl0bGU7XG4gICAgfSBlbHNlIGlmIChwaHhDbGljayA9PT0gJ3Nob3dfc2NlbmVfc3VtbWFyeScpIHtcbiAgICAgIGV2ZW50X25hbWUgPSAnc2NlbmVfc3VtbWFyeV9yZXF1ZXN0ZWQnO1xuICAgICAgcHJvcGVydGllcy5wbGF5X3RpdGxlID0gcGxheV90aXRsZTtcbiAgICAgIHByb3BlcnRpZXMubG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2hvd19wYXJhcGhyYXNpbmdcbiAgICAgIGV2ZW50X25hbWUgPSAncGFyYXBocmFzaW5nX3JlcXVlc3RlZCc7XG4gICAgICBwcm9wZXJ0aWVzLm1vbm9sb2d1ZV9pZCA9IG1vbm9sb2d1ZV9pZDtcbiAgICAgIHByb3BlcnRpZXMuY2hhcmFjdGVyX25hbWUgPSBjaGFyYWN0ZXJfbmFtZTtcblxuICAgICAgLy8gcGxheV90aXRsZSBub3Qgb24gcGFyYXBocmFzaW5nIGljb24gYXR0cnMgXHUyMDE0IGdldCBmcm9tIERPTVxuICAgICAgbGV0IHJlc29sdmVkX3BsYXlfdGl0bGUgPSBwbGF5X3RpdGxlO1xuICAgICAgaWYgKCFyZXNvbHZlZF9wbGF5X3RpdGxlICYmIG1vbm9sb2d1ZVJvdykge1xuICAgICAgICBjb25zdCBwbGF5RWwgPSBtb25vbG9ndWVSb3cucXVlcnlTZWxlY3RvcignLm1vbm9sb2d1ZS1wbGF5bmFtZScpO1xuICAgICAgICByZXNvbHZlZF9wbGF5X3RpdGxlID0gcGxheUVsID8gcGxheUVsLnRleHRDb250ZW50LnRyaW0oKSA6IG51bGw7XG4gICAgICB9XG4gICAgICBwcm9wZXJ0aWVzLnBsYXlfdGl0bGUgPSByZXNvbHZlZF9wbGF5X3RpdGxlO1xuXG4gICAgICBpZiAobW9ub2xvZ3VlUm93KSB7XG4gICAgICAgIHByb3BlcnRpZXMubG9jYXRpb24gPSBtb25vbG9ndWVSb3cuZGF0YXNldC5sb2NhdGlvbiB8fCBudWxsO1xuXG4gICAgICAgIGNvbnN0IGZpcnN0TGluZUVsZW1lbnQgPSBtb25vbG9ndWVSb3cucXVlcnlTZWxlY3RvcignLm1vbm9sb2d1ZS1maXJzdGxpbmUtdGFibGUnKTtcbiAgICAgICAgaWYgKGZpcnN0TGluZUVsZW1lbnQpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzLmZpcnN0X2xpbmUgPSBmaXJzdExpbmVFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKCdcdTIxQjQnLCAnJykudHJpbSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHBvc3Rob2cuY2FwdHVyZShldmVudF9uYW1lLCBwcm9wZXJ0aWVzKTtcbiAgfVxufSwgZmFsc2UpO1xuXG4vLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXIgdG8gcGxheSBuYW1lIGxpbmsgY2xpY2tzIGZvciBQb3N0SG9nIGN1c3RvbSBldmVudFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKCcubW9ub2xvZ3VlLXBsYXluYW1lIGEnKSB8fCBcbiAgICAgIGV2ZW50LnRhcmdldC5jbG9zZXN0KCcubW9ub2xvZ3VlLXBsYXluYW1lJykpIHtcbiAgICBjb25zdCBwbGF5RWxlbWVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcubW9ub2xvZ3VlLXBsYXluYW1lJykgfHwgZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IGxpbmtFbGVtZW50ID0gcGxheUVsZW1lbnQucXVlcnlTZWxlY3RvcignYScpIHx8IGV2ZW50LnRhcmdldC5jbG9zZXN0KCdhJyk7XG4gICAgXG4gICAgaWYgKGxpbmtFbGVtZW50KSB7XG4gICAgICBjb25zdCBocmVmID0gbGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICBjb25zdCBwbGF5X3RpdGxlID0gbGlua0VsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgXG4gICAgICAvLyBFeHRyYWN0IHBsYXlfaWQgYW5kIHNlY3Rpb24gZnJvbSB0aGUgaHJlZlxuICAgICAgbGV0IHBsYXlfaWQgPSBudWxsO1xuICAgICAgbGV0IHNlY3Rpb24gPSAnZ2VuZXJhbCc7XG4gICAgICBcbiAgICAgIGlmIChocmVmKSB7XG4gICAgICAgIGlmIChocmVmLmluY2x1ZGVzKCcvbWVuLycpKSB7XG4gICAgICAgICAgc2VjdGlvbiA9ICdtZW4nO1xuICAgICAgICAgIHBsYXlfaWQgPSBocmVmLnNwbGl0KCcvbWVuLycpWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKGhyZWYuaW5jbHVkZXMoJy93b21lbi8nKSkge1xuICAgICAgICAgIHNlY3Rpb24gPSAnd29tZW4nO1xuICAgICAgICAgIHBsYXlfaWQgPSBocmVmLnNwbGl0KCcvd29tZW4vJylbMV07XG4gICAgICAgIH0gZWxzZSBpZiAoaHJlZi5pbmNsdWRlcygnL3BsYXkvJykpIHtcbiAgICAgICAgICBzZWN0aW9uID0gJ2dlbmVyYWwnO1xuICAgICAgICAgIHBsYXlfaWQgPSBocmVmLnNwbGl0KCcvcGxheS8nKVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBHZXQgY29udGV4dCBmcm9tIHRoZSBwYWdlXG4gICAgICBsZXQgc291cmNlX2NvbnRleHQgPSAndW5rbm93bic7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1ib3gtZGVmYXVsdCcpKSB7XG4gICAgICAgIHNvdXJjZV9jb250ZXh0ID0gJ3NlYXJjaF9yZXN1bHRzJztcbiAgICAgIH0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvcGxheXMnKSkge1xuICAgICAgICBzb3VyY2VfY29udGV4dCA9ICdwbGF5c19saXN0aW5nJztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcG9zdGhvZy5jYXB0dXJlKCdwbGF5X3NlbGVjdGVkJywge1xuICAgICAgICBwbGF5X2lkOiBwbGF5X2lkLFxuICAgICAgICBwbGF5X3RpdGxlOiBwbGF5X3RpdGxlLFxuICAgICAgICBzZWN0aW9uOiBzZWN0aW9uLFxuICAgICAgICBzb3VyY2VfY29udGV4dDogc291cmNlX2NvbnRleHRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSwgZmFsc2UpO1xuXG4vLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXIgdG8gc2VjdGlvbiBuYXZpZ2F0aW9uIGNsaWNrcyBmb3IgUG9zdEhvZyBjdXN0b20gZXZlbnRcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNvbnN0IGxpbmtFbGVtZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2EnKTtcbiAgaWYgKGxpbmtFbGVtZW50KSB7XG4gICAgY29uc3QgaHJlZiA9IGxpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIFxuICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBzZWN0aW9uIG5hdmlnYXRpb24gbGlua1xuICAgIGlmIChocmVmID09PSAnL21lbnMnIHx8IGhyZWYgPT09ICcvd29tZW5zJyB8fCBocmVmID09PSAnL3BsYXlzJykge1xuICAgICAgbGV0IHNlY3Rpb25fc2VsZWN0ZWQgPSAnJztcbiAgICAgIGxldCBjdXJyZW50X3NlY3Rpb24gPSAndW5rbm93bic7XG4gICAgICBcbiAgICAgIC8vIERldGVybWluZSB3aGljaCBzZWN0aW9uIHdhcyBzZWxlY3RlZFxuICAgICAgaWYgKGhyZWYgPT09ICcvbWVucycpIHtcbiAgICAgICAgc2VjdGlvbl9zZWxlY3RlZCA9ICdtZW4nO1xuICAgICAgfSBlbHNlIGlmIChocmVmID09PSAnL3dvbWVucycpIHtcbiAgICAgICAgc2VjdGlvbl9zZWxlY3RlZCA9ICd3b21lbic7XG4gICAgICB9IGVsc2UgaWYgKGhyZWYgPT09ICcvcGxheXMnKSB7XG4gICAgICAgIHNlY3Rpb25fc2VsZWN0ZWQgPSAnYWxsJztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gRGV0ZXJtaW5lIGN1cnJlbnQgc2VjdGlvbiBmcm9tIFVSTFxuICAgICAgY29uc3QgY3VycmVudFBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICBpZiAoY3VycmVudFBhdGguaW5jbHVkZXMoJy9tZW5zJykgfHwgY3VycmVudFBhdGguaW5jbHVkZXMoJy9tZW4vJykpIHtcbiAgICAgICAgY3VycmVudF9zZWN0aW9uID0gJ21lbic7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRQYXRoLmluY2x1ZGVzKCcvd29tZW5zJykgfHwgY3VycmVudFBhdGguaW5jbHVkZXMoJy93b21lbi8nKSkge1xuICAgICAgICBjdXJyZW50X3NlY3Rpb24gPSAnd29tZW4nO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50UGF0aC5pbmNsdWRlcygnL3BsYXlzJykgfHwgY3VycmVudFBhdGguaW5jbHVkZXMoJy9wbGF5LycpKSB7XG4gICAgICAgIGN1cnJlbnRfc2VjdGlvbiA9ICdhbGwnO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50UGF0aC5pbmNsdWRlcygnL3NlYXJjaCcpKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGl0J3MgYSBnZW5kZXJlZCBzZWFyY2ggcGFnZVxuICAgICAgICBpZiAoY3VycmVudFBhdGguaW5jbHVkZXMoJ21lbicpKSB7XG4gICAgICAgICAgY3VycmVudF9zZWN0aW9uID0gJ21lbic7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFBhdGguaW5jbHVkZXMoJ3dvbWVuJykpIHtcbiAgICAgICAgICBjdXJyZW50X3NlY3Rpb24gPSAnd29tZW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRfc2VjdGlvbiA9ICdhbGwnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIE9ubHkgdHJhY2sgaWYgdGhleSdyZSBhY3R1YWxseSBzd2l0Y2hpbmcgc2VjdGlvbnNcbiAgICAgIGlmIChzZWN0aW9uX3NlbGVjdGVkICE9PSBjdXJyZW50X3NlY3Rpb24pIHtcbiAgICAgICAgcG9zdGhvZy5jYXB0dXJlKCdzZWN0aW9uX2ZpbHRlcmVkJywge1xuICAgICAgICAgIHNlY3Rpb25fc2VsZWN0ZWQ6IHNlY3Rpb25fc2VsZWN0ZWQsXG4gICAgICAgICAgcHJldmlvdXNfc2VjdGlvbjogY3VycmVudF9zZWN0aW9uLFxuICAgICAgICAgIHNvdXJjZV9wYWdlOiBjdXJyZW50UGF0aFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0sIGZhbHNlKTtcblxuLy8gS28tZmkgV2lkZ2V0XzIuanMgaW1wbGVtZW50YXRpb24gd2l0aCBnZXRIVE1MKCkgbWV0aG9kIC0gRElTQUJMRUQgZm9yIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuLypcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgLy8gTG9hZCBLby1maSBXaWRnZXRfMi5qcyBzY3JpcHRcbiAgY29uc3Qga29maVNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBrb2ZpU2NyaXB0LnNyYyA9ICdodHRwczovL3N0b3JhZ2Uua28tZmkuY29tL2Nkbi93aWRnZXQvV2lkZ2V0XzIuanMnO1xuICBrb2ZpU2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGluaXRpYWxpemVLb2ZpQnV0dG9ucygpO1xuICB9O1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGtvZmlTY3JpcHQpO1xuICBcbiAgLy8gS28tZmkgYnV0dG9uIGNsaWNrIHRyYWNraW5nIGZvciBQb3N0SG9nIGFuYWx5dGljc1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcua29maS1idXR0b24sIGFbaHJlZio9XCJrby1maS5jb21cIl0nKSkge1xuICAgICAgcG9zdGhvZy5jYXB0dXJlKCdjbGlja2VkX3RpcGphcicpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xufSk7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVLb2ZpQnV0dG9ucygpIHtcbiAgLy8gSW5pdGlhbGl6ZSBLby1maSB3aWRnZXQgb25jZSB3aXRoIHNldHRpbmdzXG4gIGlmICh0eXBlb2Yga29maXdpZGdldDIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAga29maXdpZGdldDIuaW5pdCgnVGlwIEphcicsICcjRThFOEM4JywgJ0MwQzcxS0xFODUnKTtcbiAgICBcbiAgICAvLyBJbnNlcnQgS28tZmkgYnV0dG9ucyBpbnRvIG11bHRpcGxlIGxvY2F0aW9ucyB1c2luZyBnZXRIVE1MKClcbiAgICBjb25zdCBsb2NhdGlvbnMgPSBbJ2tvZmktbGVmdC1tZW51JywgJ2tvZmktY2VudGVyLWZvb3RlcicsICdrb2ZpLXJpZ2h0LXNpZGViYXInXTtcbiAgICBcbiAgICBsb2NhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihjb250YWluZXJJZCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySWQpO1xuICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0ga29maXdpZGdldDIuZ2V0SFRNTCgpO1xuICAgICAgICBjb25zb2xlLmxvZygnS28tZmkgYnV0dG9uIGluc2VydGVkIGludG86JywgY29udGFpbmVySWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0tvLWZpIGNvbnRhaW5lciBub3QgZm91bmQ6JywgY29udGFpbmVySWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCdrb2Zpd2lkZ2V0MiBub3QgYXZhaWxhYmxlJyk7XG4gIH1cbn1cbiovXG5cbi8vIEN1c3RvbSBLby1maSBidXR0b24gY2xpY2sgdHJhY2tpbmcgZm9yIFBvc3RIb2cgYW5hbHl0aWNzIC0gRGlyZWN0IExpbmsgVmVyc2lvblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAvLyBQb3N0SG9nIHRyYWNraW5nIGZvciBLby1maSBjbGlja3MgKG5vdyBkaXJlY3QgbGlua3Mgb25seSlcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnYVtocmVmKj1cImtvLWZpLmNvbVwiXScpIHx8IFxuICAgICAgICBldmVudC50YXJnZXQuY2xvc2VzdCgnI2tvZmktbGVmdC1kaXJlY3QtYnRuJykgfHxcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJyNrb2ZpLWZvb3Rlci1kaXJlY3QtYnRuJykgfHxcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJyNrb2ZpLWRpcmVjdC1idG4nKSkge1xuICAgICAgcG9zdGhvZy5jYXB0dXJlKCdjbGlja2VkX3RpcGphcicpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xufSk7XG5cbi8vIEFsc28gaW5pdGlhbGl6ZSBLby1maSBidXR0b25zIG9uIExpdmVWaWV3IG5hdmlnYXRpb24gLSBESVNBQkxFRCBmb3IgY3VzdG9tIGltcGxlbWVudGF0aW9uXG4vKlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgKCkgPT4ge1xuICAvLyBXYWl0IGEgYml0IGZvciB0aGUgRE9NIHRvIGJlIHJlYWR5LCB0aGVuIGluaXRpYWxpemUgS28tZmkgYnV0dG9uc1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2Yga29maXdpZGdldDIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpbml0aWFsaXplS29maUJ1dHRvbnMoKTtcbiAgICB9XG4gIH0sIDEwMCk7XG59KTtcbiovXG5cbi8vIEhhbmRsZSBQb3N0SG9nIGV2ZW50cyBwdXNoZWQgZnJvbSBFbGl4aXIgTGl2ZVZpZXdcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBvc3Rob2dfY2FwdHVyZVwiLCAoZSkgPT4ge1xuICBpZiAodHlwZW9mIHBvc3Rob2cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcG9zdGhvZy5jYXB0dXJlKGUuZGV0YWlsLmV2ZW50LCBlLmRldGFpbC5wcm9wZXJ0aWVzKTtcbiAgfVxufSk7XG5cbi8vIENsaWNrIHRoZSBQb3N0SG9nIHdpZGdldCdzIFwiT3BlbiBjaGF0XCIgYnV0dG9uIHRvIGV4cGFuZCB0aGUgcGFuZWxcbmZ1bmN0aW9uIGNsaWNrT3BlbkNoYXQoKSB7XG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGgtY29udmVyc2F0aW9ucy13aWRnZXQtY29udGFpbmVyJyk7XG4gIGlmICghY29udGFpbmVyKSByZXR1cm4gZmFsc2U7XG4gIHZhciBidG4gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uW2FyaWEtbGFiZWw9XCJPcGVuIGNoYXRcIl0nKTtcbiAgaWYgKGJ0bikge1xuICAgIGJ0bi5jbGljaygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gT3BlbiBzdXBwb3J0IHdpZGdldCAoY2FsbGVkIGJ5IEZBUSBwYWdlIGxpbmtzIGFuZCBhdXRvLW9wZW4gYmVsb3cpXG53aW5kb3cub3BlblN1cHBvcnRXaWRnZXQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKGNsaWNrT3BlbkNoYXQoKSkgcmV0dXJuIGZhbHNlOyAvLyBwYW5lbCBvcGVuZWQsIHByZXZlbnQgbGluayBuYXZpZ2F0aW9uXG4gIC8vIFBvc3RIb2cgbm90IGF2YWlsYWJsZSBcdTIwMTQgc2hvdyBjb29raWUtY2hhdC1tb2RhbCBpZiB1c2VyIGhhc24ndCBjb25zZW50ZWRcbiAgdmFyIGNoYXRNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29raWUtY2hhdC1tb2RhbCcpO1xuICBpZiAoY2hhdE1vZGFsICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjb25zZW50X2Nob2ljZScpICE9PSAnZ3JhbnRlZCcpIHtcbiAgICBjaGF0TW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEZhbGxiYWNrOiBsZXQgdGhlIGhyZWYgbmF2aWdhdGUgKHJlbG9hZHMgcGFnZSB3aXRoID9jb250YWN0PXRydWUpXG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gQXV0by1vcGVuIFBvc3RIb2cgY29udmVyc2F0aW9ucyB3aWRnZXQgd2hlbiBhcnJpdmluZyBmcm9tIFwiQ29udGFjdFwiIGZvb3RlciBsaW5rIG9yIHJlZGlyZWN0XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gIGlmICh1cmxQYXJhbXMuZ2V0KCdjb250YWN0JykgPT09ICd0cnVlJykge1xuICAgIGNvbnN0IG1heEF0dGVtcHRzID0gNDA7XG4gICAgbGV0IGF0dGVtcHRzID0gMDtcbiAgICBjb25zdCB0cnlPcGVuID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICBhdHRlbXB0cysrO1xuICAgICAgaWYgKGNsaWNrT3BlbkNoYXQoKSkge1xuICAgICAgICBjbGVhckludGVydmFsKHRyeU9wZW4pO1xuICAgICAgICAvLyBDbGVhbiB1cCB0aGUgVVJMIHBhcmFtZXRlclxuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbik7XG4gICAgICAgIHVybC5zZWFyY2hQYXJhbXMuZGVsZXRlKCdjb250YWN0Jyk7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsIHVybCk7XG4gICAgICB9IGVsc2UgaWYgKGF0dGVtcHRzID49IG1heEF0dGVtcHRzKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodHJ5T3Blbik7XG4gICAgICB9XG4gICAgfSwgMjUwKTtcbiAgfVxufSk7XG5cblxuLy8gVHJpZ2dlciBmb3IgUG9zdEhvZyBzdXJ2ZXlzOlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzdXJ2ZXlIMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdXJ2ZXktaDEnKTtcbiAgICBpZiAoc3VydmV5SDEpIHtcbiAgICAgIHN1cnZleUgxLmNsYXNzTGlzdC5hZGQoJ2RlbGF5ZWQtc3VydmV5Jyk7XG4gICAgfVxuICB9LCAxMjAwMDApOyAvLyAyIG1pbnV0ZXNcbn0pO1xuXG5cbi8vIFNob3cgcHJvZ3Jlc3MgYmFyIG9uIGxpdmUgbmF2aWdhdGlvbiBhbmQgZm9ybSBzdWJtaXRzLCBpZiBzdGlsbCBsb2FkaW5nIGFmdGVyIDUwMG1zXG50b3BiYXIuY29uZmlnKHtiYXJDb2xvcnM6IHswOiBcIiMyOWRcIn0sIHNoYWRvd0NvbG9yOiBcInJnYmEoMCwgMCwgMCwgLjMpXCJ9KVxubGV0IHRvcEJhclNjaGVkdWxlZCA9IHVuZGVmaW5lZFxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwgKCkgPT4ge1xuICBpZighdG9wQmFyU2NoZWR1bGVkKSB7XG4gICAgdG9wQmFyU2NoZWR1bGVkID0gc2V0VGltZW91dCgoKSA9PiB0b3BiYXIuc2hvdygpLCA1MDApXG4gIH1cbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsICgpID0+IHtcbiAgY2xlYXJUaW1lb3V0KHRvcEJhclNjaGVkdWxlZClcbiAgdG9wQmFyU2NoZWR1bGVkID0gdW5kZWZpbmVkXG4gIHRvcGJhci5oaWRlKClcbn0pXG5cbi8vIEFkYmxvY2tlciBkZXRlY3Rpb25cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGJsb2NrLW92ZXJsYXknKTtcbiAgaWYgKCFvdmVybGF5KSByZXR1cm47XG4gIGNvbnN0IGRpc21pc3NlZEF0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FkYmxvY2tfZGlzbWlzc2VkJyk7XG4gIGlmIChkaXNtaXNzZWRBdCAmJiAoRGF0ZS5ub3coKSAtIHBhcnNlSW50KGRpc21pc3NlZEF0KSkgPCAzICogMjQgKiA2MCAqIDYwICogMTAwMCkgcmV0dXJuO1xuXG4gIGZ1bmN0aW9uIHNob3dBZGJsb2NrTW9kYWwoKSB7XG4gICAgb3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIGlmICh0eXBlb2YgcG9zdGhvZyAhPT0gJ3VuZGVmaW5lZCcpIHBvc3Rob2cuY2FwdHVyZSgnYWRibG9ja19tb2RhbF9zaG93bicpO1xuICB9XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBmZXRjaCgnaHR0cHM6Ly9wYWdlYWQyLmdvb2dsZXN5bmRpY2F0aW9uLmNvbS9wYWdlYWQvanMvYWRzYnlnb29nbGUuanMnLCB7XG4gICAgICBtb2RlOiAnbm8tY29ycycsXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJ1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24ocikge1xuICAgICAgLy8gR2VudWluZSBjcm9zcy1vcmlnaW4gbm8tY29ycyBmZXRjaCByZXR1cm5zIHR5cGUgJ29wYXF1ZScuXG4gICAgICAvLyBUeXBlICdiYXNpYycgbWVhbnMgVUJPIExpdGUgaW50ZXJjZXB0ZWQgYW5kIHJlZGlyZWN0ZWQgdG8gYW4gZW1wdHkgcmVzcG9uc2UuXG4gICAgICBpZiAoci50eXBlID09PSAnYmFzaWMnKSB7XG4gICAgICAgIHNob3dBZGJsb2NrTW9kYWwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRmFsbGJhY2s6IENTUyBwcm9iZSBmb3IgY29zbWV0aWMtYmxvY2tpbmcgYWRibG9ja2Vyc1xuICAgICAgY29uc3QgcHJvYmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRibG9jay1wcm9iZScpO1xuICAgICAgY29uc3QgY3NzQmxvY2tlZCA9ICFwcm9iZSB8fFxuICAgICAgICBwcm9iZS5vZmZzZXRIZWlnaHQgPT09IDAgfHxcbiAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUocHJvYmUpLmRpc3BsYXkgPT09ICdub25lJztcbiAgICAgIGlmIChjc3NCbG9ja2VkKSBzaG93QWRibG9ja01vZGFsKCk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAvLyBIYXJkIG5ldHdvcmsgYmxvY2sgKHNvbWUgYWRibG9ja2VycyBkbyBjYXVzZSBhIG5ldHdvcmsgZXJyb3IpXG4gICAgICBzaG93QWRibG9ja01vZGFsKCk7XG4gICAgfSk7XG4gIH0sIDUwMDApO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGJsb2NrLWRpc21pc3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YgcG9zdGhvZyAhPT0gJ3VuZGVmaW5lZCcpIHBvc3Rob2cuY2FwdHVyZSgnYWRibG9ja19tb2RhbF9kaXNtaXNzZWQnKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWRibG9ja19kaXNtaXNzZWQnLCBEYXRlLm5vdygpLnRvU3RyaW5nKCkpO1xuICAgIG92ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSk7XG5cbiAgY29uc3QgYWRibG9ja0tvZmlMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkYmxvY2stbW9kYWwgYVtocmVmKj1cImtvLWZpLmNvbVwiXScpO1xuICBpZiAoYWRibG9ja0tvZmlMaW5rKSB7XG4gICAgYWRibG9ja0tvZmlMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodHlwZW9mIHBvc3Rob2cgIT09ICd1bmRlZmluZWQnKSBwb3N0aG9nLmNhcHR1cmUoJ2NsaWNrZWRfdGlwamFyJywgeyBzb3VyY2U6ICdhZGJsb2NrX21vZGFsJyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmIG92ZXJsYXkuc3R5bGUuZGlzcGxheSA9PT0gJ2ZsZXgnKSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRibG9jay1kaXNtaXNzJykuY2xpY2soKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbi8vIENvb2tpZS1nYXRlZCBjaGF0IGljb24gKHNob3duIHdoZW4gUG9zdEhvZyBjb252ZXJzYXRpb25zIHdpZGdldCBpcyB1bmF2YWlsYWJsZSlcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgY2hhdEljb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29va2llLWNoYXQtaWNvbicpO1xuICBjb25zdCBjaGF0TW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29va2llLWNoYXQtbW9kYWwnKTtcbiAgaWYgKCFjaGF0SWNvbiB8fCAhY2hhdE1vZGFsKSByZXR1cm47XG5cbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjb25zZW50X2Nob2ljZScpICE9PSAnZ3JhbnRlZCcpIHtcbiAgICBjaGF0SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfVxuXG4gIGNoYXRJY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgY2hhdE1vZGFsLnN0eWxlLmRpc3BsYXkgPSBjaGF0TW9kYWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgfSk7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb2tpZS1jaGF0LW1vZGFsLWNsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBjaGF0TW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSk7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb2tpZS1jaGF0LWFjY2VwdC1mcm9tLW1vZGFsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBjaGF0TW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBjaGF0SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vIERlbGVnYXRlIHRvIHRoZSBtYWluIGNvbnNlbnQgYWNjZXB0IGJ1dHRvbiBzbyB3ZSBkb24ndCBkdXBsaWNhdGUgdGhlIGluaXQgbG9naWNcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uc2VudC1hY2NlcHQnKS5jbGljaygpO1xuICB9KTtcbn0pO1xuXG4vLyBDb25zZW50IGJhbm5lclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBiYW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uc2VudC1iYW5uZXInKTtcbiAgaWYgKCFiYW5uZXIpIHJldHVybjtcblxuICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjb25zZW50X2Nob2ljZScpKSB7XG4gICAgYmFubmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICB9XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnNlbnQtYWNjZXB0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY29uc2VudF9jaG9pY2UnLCAnZ3JhbnRlZCcpO1xuICAgIGd0YWcoJ2NvbnNlbnQnLCAndXBkYXRlJywge1xuICAgICAgJ2FkX3N0b3JhZ2UnOiAnZ3JhbnRlZCcsXG4gICAgICAnYWRfdXNlcl9kYXRhJzogJ2dyYW50ZWQnLFxuICAgICAgJ2FkX3BlcnNvbmFsaXphdGlvbic6ICdncmFudGVkJyxcbiAgICAgICdhbmFseXRpY3Nfc3RvcmFnZSc6ICdncmFudGVkJ1xuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgcG9zdGhvZyAhPT0gJ3VuZGVmaW5lZCcgJiYgIXBvc3Rob2cuX19sb2FkZWQpIHtcbiAgICAgICAgcG9zdGhvZy5pbml0KCdwaGNfNmFZTHBrcVFzbVlKYW5Zc2VKOFNKY09NaWNvbUN4ajl2OVBsNmhuWlFTMycsIHtcbiAgICAgICAgICAgIGFwaV9ob3N0OiAnaHR0cHM6Ly9hdXRvbHljdXMuc2hha2VzcGVhcmUtbW9ub2xvZ3Vlcy5vcmcnLFxuICAgICAgICAgICAgdWlfaG9zdDogJ2h0dHBzOi8vdXMucG9zdGhvZy5jb20nLFxuICAgICAgICAgICAgZGVmYXVsdHM6ICcyMDI2LTAxLTMwJyxcbiAgICAgICAgICAgIHBlcnNvbl9wcm9maWxlczogJ2lkZW50aWZpZWRfb25seScsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBiYW5uZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSk7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnNlbnQtZGVjbGluZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NvbnNlbnRfY2hvaWNlJywgJ2RlY2xpbmVkJyk7XG4gICAgYmFubmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0pO1xufSk7XG5cbi8vIGNvbm5lY3QgaWYgdGhlcmUgYXJlIGFueSBMaXZlVmlld3Mgb24gdGhlIHBhZ2VcbmxpdmVTb2NrZXQuY29ubmVjdCgpXG5cbi8vIGV4cG9zZSBsaXZlU29ja2V0IG9uIHdpbmRvdyBmb3Igd2ViIGNvbnNvbGUgZGVidWcgbG9ncyBhbmQgbGF0ZW5jeSBzaW11bGF0aW9uOlxubGl2ZVNvY2tldC5lbmFibGVEZWJ1ZygpXG4vLyA+PiBsaXZlU29ja2V0LmVuYWJsZUxhdGVuY3lTaW0oMTAwMCkgIC8vIGVuYWJsZWQgZm9yIGR1cmF0aW9uIG9mIGJyb3dzZXIgc2Vzc2lvblxuLy8gPj4gbGl2ZVNvY2tldC5kaXNhYmxlTGF0ZW5jeVNpbSgpXG53aW5kb3cubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcblxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBTUEsTUFBQyxVQUFVLFNBQVEsV0FBVTtBQUMzQjtBQUdBLFFBQUMsWUFBWTtBQUNYLGNBQUksV0FBVztBQUNmLGNBQUksVUFBVSxDQUFDLE1BQU0sT0FBTyxVQUFVLEdBQUc7QUFDekMsbUJBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxVQUFVLENBQUMsUUFBTyx1QkFBdUIsRUFBRSxHQUFHO0FBQ3hFLG9CQUFPLHdCQUNMLFFBQU8sUUFBUSxLQUFLO0FBQ3RCLG9C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
