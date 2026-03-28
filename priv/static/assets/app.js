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
      console.debug("Pushing modal_close_request event to #summary-modal");
      this.pushEventTo("#summary-modal", "modal_close_request", {});
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
          this.pushEventTo("#summary-modal", "reset_feedback_success", {});
        }, 3e3);
      }
    },
    trackPostHogFeedback() {
      var _a, _b;
      if (typeof posthog === "undefined")
        return;
      const modal = document.querySelector("#summary-modal");
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
    if (sessionStorage.getItem("adblock_dismissed"))
      return;
    function showAdblockModal() {
      overlay.style.display = "flex";
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
      sessionStorage.setItem("adblock_dismissed", "1");
      overlay.style.display = "none";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2RhcmtfbW9kZS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfaHRtbC9wcml2L3N0YXRpYy9waG9lbml4X2h0bWwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9jb25zdGFudHMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3B1c2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3RpbWVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9jaGFubmVsLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9hamF4LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9sb25ncG9sbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvcHJlc2VuY2UuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3NlcmlhbGl6ZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3NvY2tldC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9jb25zdGFudHMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZW50cnlfdXBsb2FkZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdXRpbHMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvYnJvd3Nlci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb20uanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdXBsb2FkX2VudHJ5LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2xpdmVfdXBsb2FkZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvYXJpYS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9ob29rcy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9lbGVtZW50X3JlZi5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcG9zdF9tb3JwaF9yZXN0b3Jlci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L25vZGVfbW9kdWxlcy9tb3JwaGRvbS9kaXN0L21vcnBoZG9tLWVzbS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcGF0Y2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvcmVuZGVyZWQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvanMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdmlld19ob29rLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXcuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvbGl2ZV9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvaW5kZXguanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2FwcC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIHRvcGJhciAxLjAuMCwgMjAyMS0wMS0wNlxuICogaHR0cHM6Ly9idXVuZ3V5ZW4uZ2l0aHViLmlvL3RvcGJhclxuICogQ29weXJpZ2h0IChjKSAyMDIxIEJ1dSBOZ3V5ZW5cbiAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFtcIm1zXCIsIFwibW96XCIsIFwid2Via2l0XCIsIFwib1wiXTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdIHx8XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgfVxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgfSwgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIHZhciBjYW52YXMsXG4gICAgcHJvZ3Jlc3NUaW1lcklkLFxuICAgIGZhZGVUaW1lcklkLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzaG93aW5nKSByZXR1cm47XG4gICAgICAgIHNob3dpbmcgPSB0cnVlO1xuICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgIGlmICghY2FudmFzKSBjcmVhdGVDYW52YXMoKTtcbiAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdG9wYmFyLnByb2dyZXNzKDApO1xuICAgICAgICBpZiAob3B0aW9ucy5hdXRvUnVuKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICAgICAgdG9wYmFyLnByb2dyZXNzKFxuICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9ncmVzczogZnVuY3Rpb24gKHRvKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0byA9XG4gICAgICAgICAgICAodG8uaW5kZXhPZihcIitcIikgPj0gMCB8fCB0by5pbmRleE9mKFwiLVwiKSA+PSAwXG4gICAgICAgICAgICAgID8gY3VycmVudFByb2dyZXNzXG4gICAgICAgICAgICAgIDogMCkgKyBwYXJzZUZsb2F0KHRvKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50UHJvZ3Jlc3MgPSB0byA+IDEgPyAxIDogdG87XG4gICAgICAgIHJlcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgIH0sXG4gICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwgIi8vIEZ1bmN0aW9uIHRvIHJlYWQgdGhlIHZhbHVlIG9mIGEgY29va2llIGJ5IGl0cyBuYW1lXG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICBjb25zdCB2YWx1ZSA9ICc7ICcgKyBkb2N1bWVudC5jb29raWU7XG4gIGNvbnN0IHBhcnRzID0gdmFsdWUuc3BsaXQoJzsgJyArIG5hbWUgKyAnPScpO1xuICBpZiAocGFydHMubGVuZ3RoID09PSAyKSByZXR1cm4gcGFydHMucG9wKCkuc3BsaXQoJzsnKS5zaGlmdCgpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gRnVuY3Rpb24gdG8gc2V0IGRhcmsgbW9kZSBiYXNlZCBvbiB0aGUgdXNlcidzIHByZWZlcmVuY2VcbmZ1bmN0aW9uIHNldERhcmtNb2RlUHJlZmVyZW5jZShpc0RhcmtNb2RlKSB7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkYXJrTW9kZScsIGlzRGFya01vZGUgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgLy8gU2V0IGEgY29va2llIGZvciB0aGUgZGFyayBtb2RlIHByZWZlcmVuY2VcbiAgZG9jdW1lbnQuY29va2llID0gJ2RhcmtNb2RlUHJlZmVyZW5jZT0nICsgKGlzRGFya01vZGUgPyAndHJ1ZScgOiAnZmFsc2UnKSArICc7cGF0aD0vJztcbiAgdmFyIGJvZHlFbGVtZW50ID0gZG9jdW1lbnQuYm9keTsgLy8gVXNlICdkb2N1bWVudC5ib2R5JyBpbnN0ZWFkIG9mICdnZXRFbGVtZW50QnlJZCdcbiAgdmFyIGxpZ2h0TW9kZVRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaWdodC1tb2RlLXRvZ2dsZScpO1xuICB2YXIgZGFya01vZGVUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFyay1tb2RlLXRvZ2dsZScpO1xuICBpZiAoaXNEYXJrTW9kZSkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrLW1vZGUnKTtcbiAgICBib2R5RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrLW1vZGUnKTtcbiAgICBsaWdodE1vZGVUb2dnbGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBkYXJrTW9kZVRvZ2dsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGFyay1tb2RlJyk7XG4gICAgYm9keUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGFyay1tb2RlJyk7XG4gICAgbGlnaHRNb2RlVG9nZ2xlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGRhcmtNb2RlVG9nZ2xlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cbn1cblxuLy8gRnVuY3Rpb24gdG8gdG9nZ2xlIGRhcmsgbW9kZVxuZnVuY3Rpb24gdG9nZ2xlRGFya01vZGUoKSB7XG4gIC8vIENoZWNrIGlmIGRhcmsgbW9kZSBpcyBjdXJyZW50bHkgZW5hYmxlZFxuICB2YXIgaXNEYXJrTW9kZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkYXJrTW9kZScpID09PSAndHJ1ZSc7XG4gIC8vIFRvZ2dsZSB0aGUgZGFyayBtb2RlIHByZWZlcmVuY2UgYW5kIHVwZGF0ZSB0aGUgVUlcbiAgc2V0RGFya01vZGVQcmVmZXJlbmNlKCFpc0RhcmtNb2RlKTtcbn1cblxuLy8gQXR0YWNoIHRoZSB0b2dnbGVEYXJrTW9kZSBmdW5jdGlvbiB0byB0aGUgY2xpY2sgZXZlbnQgb2YgdGhlIGRhcmsgbW9kZSBpY29uXG52YXIgZGFya01vZGVJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RhcmstbW9kZS1pY29uJyk7XG5pZiAoZGFya01vZGVJY29uKSB7XG4gIGRhcmtNb2RlSWNvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURhcmtNb2RlKTtcbn1cblxuLy8gU2V0IHRoZSBpbml0aWFsIGRhcmsgbW9kZSBwcmVmZXJlbmNlIGJhc2VkIG9uIGxvY2FsU3RvcmFnZVxudmFyIGluaXRpYWxEYXJrTW9kZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkYXJrTW9kZScpID09PSAndHJ1ZSc7XG5zZXREYXJrTW9kZVByZWZlcmVuY2UoaW5pdGlhbERhcmtNb2RlKTtcblxud2luZG93LmdldENvb2tpZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgY29uc3QgdmFsdWUgPSAnOyAnICsgZG9jdW1lbnQuY29va2llO1xuICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KCc7ICcgKyBuYW1lICsgJz0nKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikgcmV0dXJuIHBhcnRzLnBvcCgpLnNwbGl0KCc7Jykuc2hpZnQoKTtcbiAgcmV0dXJuIG51bGw7XG59O1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBQb2x5ZmlsbEV2ZW50ID0gZXZlbnRDb25zdHJ1Y3RvcigpO1xuXG4gIGZ1bmN0aW9uIGV2ZW50Q29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHdpbmRvdy5DdXN0b21FdmVudDtcbiAgICAvLyBJRTw9OSBTdXBwb3J0XG4gICAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBDdXN0b21FdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkSGlkZGVuSW5wdXQobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlbGVtZW50LCB0YXJnZXRNb2RpZmllcktleSkge1xuICAgIHZhciB0byA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSxcbiAgICAgICAgbWV0aG9kID0gYnVpbGRIaWRkZW5JbnB1dChcIl9tZXRob2RcIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSksXG4gICAgICAgIGNzcmYgPSBidWlsZEhpZGRlbklucHV0KFwiX2NzcmZfdG9rZW5cIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNzcmZcIikpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG4gICAgICAgIHN1Ym1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxcbiAgICAgICAgdGFyZ2V0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIik7XG5cbiAgICBmb3JtLm1ldGhvZCA9IChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpID09PSBcImdldFwiKSA/IFwiZ2V0XCIgOiBcInBvc3RcIjtcbiAgICBmb3JtLmFjdGlvbiA9IHRvO1xuICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgaWYgKHRhcmdldCkgZm9ybS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgZWxzZSBpZiAodGFyZ2V0TW9kaWZpZXJLZXkpIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2QpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG5cbiAgICAvLyBJbnNlcnQgYSBidXR0b24gYW5kIGNsaWNrIGl0IGluc3RlYWQgb2YgdXNpbmcgYGZvcm0uc3VibWl0YFxuICAgIC8vIGJlY2F1c2UgdGhlIGBzdWJtaXRgIGZ1bmN0aW9uIGRvZXMgbm90IGVtaXQgYSBgc3VibWl0YCBldmVudC5cbiAgICBzdWJtaXQudHlwZSA9IFwic3VibWl0XCI7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChzdWJtaXQpO1xuICAgIHN1Ym1pdC5jbGljaygpO1xuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSkge1xuICAgICAgdmFyIHBob2VuaXhMaW5rRXZlbnQgPSBuZXcgUG9seWZpbGxFdmVudCgncGhvZW5peC5saW5rLmNsaWNrJywge1xuICAgICAgICBcImJ1YmJsZXNcIjogdHJ1ZSwgXCJjYW5jZWxhYmxlXCI6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWVsZW1lbnQuZGlzcGF0Y2hFdmVudChwaG9lbml4TGlua0V2ZW50KSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRvXCIpKSB7XG4gICAgICAgIGhhbmRsZUNsaWNrKGVsZW1lbnQsIGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgZmFsc2UpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaG9lbml4LmxpbmsuY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBtZXNzYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb25maXJtXCIpO1xuICAgIGlmKG1lc3NhZ2UgJiYgIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KSgpO1xuIiwgIi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsdWUpID0+IHtcbiAgaWYodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpe1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxldCBjbG9zdXJlID0gZnVuY3Rpb24gKCl7IHJldHVybiB2YWx1ZSB9XG4gICAgcmV0dXJuIGNsb3N1cmVcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbFxuZXhwb3J0IGNvbnN0IHBoeFdpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBudWxsXG5leHBvcnQgY29uc3QgZ2xvYmFsID0gZ2xvYmFsU2VsZiB8fCBwaHhXaW5kb3cgfHwgZ2xvYmFsVGhpc1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVlNOID0gXCIyLjAuMFwiXG5leHBvcnQgY29uc3QgU09DS0VUX1NUQVRFUyA9IHtjb25uZWN0aW5nOiAwLCBvcGVuOiAxLCBjbG9zaW5nOiAyLCBjbG9zZWQ6IDN9XG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUID0gMTAwMDBcbmV4cG9ydCBjb25zdCBXU19DTE9TRV9OT1JNQUwgPSAxMDAwXG5leHBvcnQgY29uc3QgQ0hBTk5FTF9TVEFURVMgPSB7XG4gIGNsb3NlZDogXCJjbG9zZWRcIixcbiAgZXJyb3JlZDogXCJlcnJvcmVkXCIsXG4gIGpvaW5lZDogXCJqb2luZWRcIixcbiAgam9pbmluZzogXCJqb2luaW5nXCIsXG4gIGxlYXZpbmc6IFwibGVhdmluZ1wiLFxufVxuZXhwb3J0IGNvbnN0IENIQU5ORUxfRVZFTlRTID0ge1xuICBjbG9zZTogXCJwaHhfY2xvc2VcIixcbiAgZXJyb3I6IFwicGh4X2Vycm9yXCIsXG4gIGpvaW46IFwicGh4X2pvaW5cIixcbiAgcmVwbHk6IFwicGh4X3JlcGx5XCIsXG4gIGxlYXZlOiBcInBoeF9sZWF2ZVwiXG59XG5cbmV4cG9ydCBjb25zdCBUUkFOU1BPUlRTID0ge1xuICBsb25ncG9sbDogXCJsb25ncG9sbFwiLFxuICB3ZWJzb2NrZXQ6IFwid2Vic29ja2V0XCJcbn1cbmV4cG9ydCBjb25zdCBYSFJfU1RBVEVTID0ge1xuICBjb21wbGV0ZTogNFxufVxuZXhwb3J0IGNvbnN0IEFVVEhfVE9LRU5fUFJFRklYID0gXCJiYXNlNjR1cmwuYmVhcmVyLnBoeC5cIlxuIiwgIi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIFB1c2hcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBUaGUgZXZlbnQsIGZvciBleGFtcGxlIGBcInBoeF9qb2luXCJgXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSBwYXlsb2FkLCBmb3IgZXhhbXBsZSBge3VzZXJfaWQ6IDEyM31gXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZW91dCAtIFRoZSBwdXNoIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1c2gge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBldmVudCwgcGF5bG9hZCwgdGltZW91dCl7XG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuZXZlbnQgPSBldmVudFxuICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQgfHwgZnVuY3Rpb24gKCl7IHJldHVybiB7fSB9XG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICAgIHRoaXMucmVjSG9va3MgPSBbXVxuICAgIHRoaXMuc2VudCA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXRcbiAgICovXG4gIHJlc2VuZCh0aW1lb3V0KXtcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy5yZXNldCgpXG4gICAgdGhpcy5zZW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgc2VuZCgpe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoXCJ0aW1lb3V0XCIpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnN0YXJ0VGltZW91dCgpXG4gICAgdGhpcy5zZW50ID0gdHJ1ZVxuICAgIHRoaXMuY2hhbm5lbC5zb2NrZXQucHVzaCh7XG4gICAgICB0b3BpYzogdGhpcy5jaGFubmVsLnRvcGljLFxuICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXG4gICAgICBwYXlsb2FkOiB0aGlzLnBheWxvYWQoKSxcbiAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICBqb2luX3JlZjogdGhpcy5jaGFubmVsLmpvaW5SZWYoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSBzdGF0dXNcbiAgICogQHBhcmFtIHsqfSBjYWxsYmFja1xuICAgKi9cbiAgcmVjZWl2ZShzdGF0dXMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmhhc1JlY2VpdmVkKHN0YXR1cykpe1xuICAgICAgY2FsbGJhY2sodGhpcy5yZWNlaXZlZFJlc3AucmVzcG9uc2UpXG4gICAgfVxuXG4gICAgdGhpcy5yZWNIb29rcy5wdXNoKHtzdGF0dXMsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpe1xuICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgIHRoaXMucmVmID0gbnVsbFxuICAgIHRoaXMucmVmRXZlbnQgPSBudWxsXG4gICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBudWxsXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbWF0Y2hSZWNlaXZlKHtzdGF0dXMsIHJlc3BvbnNlLCBfcmVmfSl7XG4gICAgdGhpcy5yZWNIb29rcy5maWx0ZXIoaCA9PiBoLnN0YXR1cyA9PT0gc3RhdHVzKVxuICAgICAgLmZvckVhY2goaCA9PiBoLmNhbGxiYWNrKHJlc3BvbnNlKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsUmVmRXZlbnQoKXtcbiAgICBpZighdGhpcy5yZWZFdmVudCl7IHJldHVybiB9XG4gICAgdGhpcy5jaGFubmVsLm9mZih0aGlzLnJlZkV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dFRpbWVyKVxuICAgIHRoaXMudGltZW91dFRpbWVyID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnRpbWVvdXRUaW1lcil7IHRoaXMuY2FuY2VsVGltZW91dCgpIH1cbiAgICB0aGlzLnJlZiA9IHRoaXMuY2hhbm5lbC5zb2NrZXQubWFrZVJlZigpXG4gICAgdGhpcy5yZWZFdmVudCA9IHRoaXMuY2hhbm5lbC5yZXBseUV2ZW50TmFtZSh0aGlzLnJlZilcblxuICAgIHRoaXMuY2hhbm5lbC5vbih0aGlzLnJlZkV2ZW50LCBwYXlsb2FkID0+IHtcbiAgICAgIHRoaXMuY2FuY2VsUmVmRXZlbnQoKVxuICAgICAgdGhpcy5jYW5jZWxUaW1lb3V0KClcbiAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gcGF5bG9hZFxuICAgICAgdGhpcy5tYXRjaFJlY2VpdmUocGF5bG9hZClcbiAgICB9KVxuXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcihcInRpbWVvdXRcIiwge30pXG4gICAgfSwgdGhpcy50aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYXNSZWNlaXZlZChzdGF0dXMpe1xuICAgIHJldHVybiB0aGlzLnJlY2VpdmVkUmVzcCAmJiB0aGlzLnJlY2VpdmVkUmVzcC5zdGF0dXMgPT09IHN0YXR1c1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKHN0YXR1cywgcmVzcG9uc2Upe1xuICAgIHRoaXMuY2hhbm5lbC50cmlnZ2VyKHRoaXMucmVmRXZlbnQsIHtzdGF0dXMsIHJlc3BvbnNlfSlcbiAgfVxufVxuIiwgIi8qKlxuICpcbiAqIENyZWF0ZXMgYSB0aW1lciB0aGF0IGFjY2VwdHMgYSBgdGltZXJDYWxjYCBmdW5jdGlvbiB0byBwZXJmb3JtXG4gKiBjYWxjdWxhdGVkIHRpbWVvdXQgcmV0cmllcywgc3VjaCBhcyBleHBvbmVudGlhbCBiYWNrb2ZmLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsZXQgcmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4gdGhpcy5jb25uZWN0KCksIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCA1MDAwLCAxMDAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfSlcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDUwMDBcbiAqIHJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAqIHJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpIC8vIGZpcmVzIGFmdGVyIDEwMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gdGltZXJDYWxjXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIHRpbWVyQ2FsYyl7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgdGhpcy50aW1lckNhbGMgPSB0aW1lckNhbGNcbiAgICB0aGlzLnRpbWVyID0gbnVsbFxuICAgIHRoaXMudHJpZXMgPSAwXG4gIH1cblxuICByZXNldCgpe1xuICAgIHRoaXMudHJpZXMgPSAwXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyBhbnkgcHJldmlvdXMgc2NoZWR1bGVUaW1lb3V0IGFuZCBzY2hlZHVsZXMgY2FsbGJhY2tcbiAgICovXG4gIHNjaGVkdWxlVGltZW91dCgpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmllcyA9IHRoaXMudHJpZXMgKyAxXG4gICAgICB0aGlzLmNhbGxiYWNrKClcbiAgICB9LCB0aGlzLnRpbWVyQ2FsYyh0aGlzLnRyaWVzICsgMSkpXG4gIH1cbn1cbiIsICJpbXBvcnQge2Nsb3N1cmV9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTLFxuICBDSEFOTkVMX1NUQVRFUyxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IFB1c2ggZnJvbSBcIi4vcHVzaFwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbil9IHBhcmFtc1xuICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcbiAgY29uc3RydWN0b3IodG9waWMsIHBhcmFtcywgc29ja2V0KXtcbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgdGhpcy50b3BpYyA9IHRvcGljXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldFxuICAgIHRoaXMuYmluZGluZ3MgPSBbXVxuICAgIHRoaXMuYmluZGluZ1JlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSB0aGlzLnNvY2tldC50aW1lb3V0XG4gICAgdGhpcy5qb2luZWRPbmNlID0gZmFsc2VcbiAgICB0aGlzLmpvaW5QdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMuam9pbiwgdGhpcy5wYXJhbXMsIHRoaXMudGltZW91dClcbiAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzID0gW11cblxuICAgIHRoaXMucmVqb2luVGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luKCkgfVxuICAgIH0sIHRoaXMuc29ja2V0LnJlam9pbkFmdGVyTXMpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbkVycm9yKCgpID0+IHRoaXMucmVqb2luVGltZXIucmVzZXQoKSkpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMucHVzaCh0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLmlzRXJyb3JlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSlcbiAgICApXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5lZFxuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIuZm9yRWFjaChwdXNoRXZlbnQgPT4gcHVzaEV2ZW50LnNlbmQoKSlcbiAgICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5vbkNsb3NlKCgpID0+IHtcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGNsb3NlICR7dGhpcy50b3BpY30gJHt0aGlzLmpvaW5SZWYoKX1gKVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZFxuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlKHRoaXMpXG4gICAgfSlcbiAgICB0aGlzLm9uRXJyb3IocmVhc29uID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBlcnJvciAke3RoaXMudG9waWN9YCwgcmVhc29uKVxuICAgICAgaWYodGhpcy5pc0pvaW5pbmcoKSl7IHRoaXMuam9pblB1c2gucmVzZXQoKSB9XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgdGltZW91dCAke3RoaXMudG9waWN9ICgke3RoaXMuam9pblJlZigpfSlgLCB0aGlzLmpvaW5QdXNoLnRpbWVvdXQpXG4gICAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aGlzLnRpbWVvdXQpXG4gICAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZFxuICAgICAgdGhpcy5qb2luUHVzaC5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLnJlcGx5LCAocGF5bG9hZCwgcmVmKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIodGhpcy5yZXBseUV2ZW50TmFtZShyZWYpLCBwYXlsb2FkKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSm9pbiB0aGUgY2hhbm5lbFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byBqb2luIG11bHRpcGxlIHRpbWVzLiAnam9pbicgY2FuIG9ubHkgYmUgY2FsbGVkIGEgc2luZ2xlIHRpbWUgcGVyIGNoYW5uZWwgaW5zdGFuY2VcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgICAgdGhpcy5qb2luZWRPbmNlID0gdHJ1ZVxuICAgICAgdGhpcy5yZWpvaW4oKVxuICAgICAgcmV0dXJuIHRoaXMuam9pblB1c2hcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgY2xvc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spe1xuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGVycm9yc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjayl7XG4gICAgcmV0dXJuIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMuZXJyb3IsIHJlYXNvbiA9PiBjYWxsYmFjayhyZWFzb24pKVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgb24gY2hhbm5lbCBldmVudHNcbiAgICpcbiAgICogU3Vic2NyaXB0aW9uIHJldHVybnMgYSByZWYgY291bnRlciwgd2hpY2ggY2FuIGJlIHVzZWQgbGF0ZXIgdG9cbiAgICogdW5zdWJzY3JpYmUgdGhlIGV4YWN0IGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNvbnN0IHJlZjIgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fb3RoZXJfc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICogLy8gU2luY2UgdW5zdWJzY3JpcHRpb24sIGRvX3N0dWZmIHdvbid0IGZpcmUsXG4gICAqIC8vIHdoaWxlIGRvX290aGVyX3N0dWZmIHdpbGwga2VlcCBmaXJpbmcgb24gdGhlIFwiZXZlbnRcIlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybnMge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5iaW5kaW5nUmVmKytcbiAgICB0aGlzLmJpbmRpbmdzLnB1c2goe2V2ZW50LCByZWYsIGNhbGxiYWNrfSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIG9mZiBvZiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBVc2UgdGhlIHJlZiByZXR1cm5lZCBmcm9tIGEgY2hhbm5lbC5vbigpIHRvIHVuc3Vic2NyaWJlIG9uZVxuICAgKiBoYW5kbGVyLCBvciBwYXNzIG5vdGhpbmcgZm9yIHRoZSByZWYgdG8gdW5zdWJzY3JpYmUgYWxsXG4gICAqIGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gZXZlbnQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFVuc3Vic2NyaWJlIHRoZSBkb19zdHVmZiBoYW5kbGVyXG4gICAqIGNvbnN0IHJlZjEgPSBjaGFubmVsLm9uKFwiZXZlbnRcIiwgZG9fc3R1ZmYpXG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIiwgcmVmMSlcbiAgICpcbiAgICogLy8gVW5zdWJzY3JpYmUgYWxsIGhhbmRsZXJzIGZyb20gZXZlbnRcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiKVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9mZihldmVudCwgcmVmKXtcbiAgICB0aGlzLmJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoKGJpbmQpID0+IHtcbiAgICAgIHJldHVybiAhKGJpbmQuZXZlbnQgPT09IGV2ZW50ICYmICh0eXBlb2YgcmVmID09PSBcInVuZGVmaW5lZFwiIHx8IHJlZiA9PT0gYmluZC5yZWYpKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhblB1c2goKXsgcmV0dXJuIHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0pvaW5lZCgpIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIGBldmVudGAgdG8gcGhvZW5peCB3aXRoIHRoZSBwYXlsb2FkIGBwYXlsb2FkYC5cbiAgICogUGhvZW5peCByZWNlaXZlcyB0aGlzIGluIHRoZSBgaGFuZGxlX2luKGV2ZW50LCBwYXlsb2FkLCBzb2NrZXQpYFxuICAgKiBmdW5jdGlvbi4gaWYgcGhvZW5peCByZXBsaWVzIG9yIGl0IHRpbWVzIG91dCAoZGVmYXVsdCAxMDAwMG1zKSxcbiAgICogdGhlbiBvcHRpb25hbGx5IHRoZSByZXBseSBjYW4gYmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwucHVzaChcImV2ZW50XCIpXG4gICAqICAgLnJlY2VpdmUoXCJva1wiLCBwYXlsb2FkID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCByZXBsaWVkOlwiLCBwYXlsb2FkKSlcbiAgICogICAucmVjZWl2ZShcImVycm9yXCIsIGVyciA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggZXJyb3JlZFwiLCBlcnIpKVxuICAgKiAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBjb25zb2xlLmxvZyhcInRpbWVkIG91dCBwdXNoaW5nXCIpKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIHB1c2goZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHBheWxvYWQgPSBwYXlsb2FkIHx8IHt9XG4gICAgaWYoIXRoaXMuam9pbmVkT25jZSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyaWVkIHRvIHB1c2ggJyR7ZXZlbnR9JyB0byAnJHt0aGlzLnRvcGljfScgYmVmb3JlIGpvaW5pbmcuIFVzZSBjaGFubmVsLmpvaW4oKSBiZWZvcmUgcHVzaGluZyBldmVudHNgKVxuICAgIH1cbiAgICBsZXQgcHVzaEV2ZW50ID0gbmV3IFB1c2godGhpcywgZXZlbnQsIGZ1bmN0aW9uICgpeyByZXR1cm4gcGF5bG9hZCB9LCB0aW1lb3V0KVxuICAgIGlmKHRoaXMuY2FuUHVzaCgpKXtcbiAgICAgIHB1c2hFdmVudC5zZW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgcHVzaEV2ZW50LnN0YXJ0VGltZW91dCgpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIucHVzaChwdXNoRXZlbnQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHB1c2hFdmVudFxuICB9XG5cbiAgLyoqIExlYXZlcyB0aGUgY2hhbm5lbFxuICAgKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBzZXJ2ZXIgZXZlbnRzLCBhbmRcbiAgICogaW5zdHJ1Y3RzIGNoYW5uZWwgdG8gdGVybWluYXRlIG9uIHNlcnZlclxuICAgKlxuICAgKiBUcmlnZ2VycyBvbkNsb3NlKCkgaG9va3NcbiAgICpcbiAgICogVG8gcmVjZWl2ZSBsZWF2ZSBhY2tub3dsZWRnZW1lbnRzLCB1c2UgdGhlIGByZWNlaXZlYFxuICAgKiBob29rIHRvIGJpbmQgdG8gdGhlIHNlcnZlciBhY2ssIGllOlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLmxlYXZlKCkucmVjZWl2ZShcIm9rXCIsICgpID0+IGFsZXJ0KFwibGVmdCFcIikgKVxuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHRpbWVvdXRcbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBsZWF2ZSh0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICB0aGlzLmpvaW5QdXNoLmNhbmNlbFRpbWVvdXQoKVxuXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmxlYXZpbmdcbiAgICBsZXQgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBsZWF2ZSAke3RoaXMudG9waWN9YClcbiAgICAgIHRoaXMudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgXCJsZWF2ZVwiKVxuICAgIH1cbiAgICBsZXQgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIGNsb3N1cmUoe30pLCB0aW1lb3V0KVxuICAgIGxlYXZlUHVzaC5yZWNlaXZlKFwib2tcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IG9uQ2xvc2UoKSlcbiAgICBsZWF2ZVB1c2guc2VuZCgpXG4gICAgaWYoIXRoaXMuY2FuUHVzaCgpKXsgbGVhdmVQdXNoLnRyaWdnZXIoXCJva1wiLCB7fSkgfVxuXG4gICAgcmV0dXJuIGxlYXZlUHVzaFxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRhYmxlIG1lc3NhZ2UgaG9va1xuICAgKlxuICAgKiBSZWNlaXZlcyBhbGwgZXZlbnRzIGZvciBzcGVjaWFsaXplZCBtZXNzYWdlIGhhbmRsaW5nXG4gICAqIGJlZm9yZSBkaXNwYXRjaGluZyB0byB0aGUgY2hhbm5lbCBjYWxsYmFja3MuXG4gICAqXG4gICAqIE11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgb25NZXNzYWdlKF9ldmVudCwgcGF5bG9hZCwgX3JlZil7IHJldHVybiBwYXlsb2FkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZil7XG4gICAgaWYodGhpcy50b3BpYyAhPT0gdG9waWMpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgaWYoam9pblJlZiAmJiBqb2luUmVmICE9PSB0aGlzLmpvaW5SZWYoKSl7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBcImRyb3BwaW5nIG91dGRhdGVkIG1lc3NhZ2VcIiwge3RvcGljLCBldmVudCwgcGF5bG9hZCwgam9pblJlZn0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGpvaW5SZWYoKXsgcmV0dXJuIHRoaXMuam9pblB1c2gucmVmIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlam9pbih0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBpZih0aGlzLmlzTGVhdmluZygpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnNvY2tldC5sZWF2ZU9wZW5Ub3BpYyh0aGlzLnRvcGljKVxuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nXG4gICAgdGhpcy5qb2luUHVzaC5yZXNlbmQodGltZW91dClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKXtcbiAgICBsZXQgaGFuZGxlZFBheWxvYWQgPSB0aGlzLm9uTWVzc2FnZShldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luUmVmKVxuICAgIGlmKHBheWxvYWQgJiYgIWhhbmRsZWRQYXlsb2FkKXsgdGhyb3cgbmV3IEVycm9yKFwiY2hhbm5lbCBvbk1lc3NhZ2UgY2FsbGJhY2tzIG11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkXCIpIH1cblxuICAgIGxldCBldmVudEJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5maWx0ZXIoYmluZCA9PiBiaW5kLmV2ZW50ID09PSBldmVudClcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBldmVudEJpbmRpbmdzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBiaW5kID0gZXZlbnRCaW5kaW5nc1tpXVxuICAgICAgYmluZC5jYWxsYmFjayhoYW5kbGVkUGF5bG9hZCwgcmVmLCBqb2luUmVmIHx8IHRoaXMuam9pblJlZigpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVwbHlFdmVudE5hbWUocmVmKXsgcmV0dXJuIGBjaGFuX3JlcGx5XyR7cmVmfWAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNDbG9zZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmNsb3NlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Vycm9yZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmVycm9yZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luZWQoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5lZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5pbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5pbmcgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNMZWF2aW5nKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nIH1cbn1cbiIsICJpbXBvcnQge1xuICBnbG9iYWwsXG4gIFhIUl9TVEFURVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWpheCB7XG5cbiAgc3RhdGljIHJlcXVlc3QobWV0aG9kLCBlbmRQb2ludCwgaGVhZGVycywgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgaWYoZ2xvYmFsLlhEb21haW5SZXF1ZXN0KXtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhEb21haW5SZXF1ZXN0KCkgLy8gSUU4LCBJRTlcbiAgICAgIHJldHVybiB0aGlzLnhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9IGVsc2UgaWYoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KXtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCkgLy8gSUU3KywgRmlyZWZveCwgQ2hyb21lLCBPcGVyYSwgU2FmYXJpXG4gICAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgaGVhZGVycywgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9IGVsc2UgaWYoZ2xvYmFsLmZldGNoICYmIGdsb2JhbC5BYm9ydENvbnRyb2xsZXIpe1xuICAgICAgLy8gRmV0Y2ggd2l0aCBBYm9ydENvbnRyb2xsZXIgZm9yIG1vZGVybiBicm93c2Vyc1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hSZXF1ZXN0KG1ldGhvZCwgZW5kUG9pbnQsIGhlYWRlcnMsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN1aXRhYmxlIFhNTEh0dHBSZXF1ZXN0IGltcGxlbWVudGF0aW9uIGZvdW5kXCIpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGZldGNoUmVxdWVzdChtZXRob2QsIGVuZFBvaW50LCBoZWFkZXJzLCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgIG1ldGhvZCxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBib2R5LFxuICAgIH1cbiAgICBsZXQgY29udHJvbGxlciA9IG51bGxcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcbiAgICAgIGNvbnN0IF90aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGNvbnRyb2xsZXIuYWJvcnQoKSwgdGltZW91dClcbiAgICAgIG9wdGlvbnMuc2lnbmFsID0gY29udHJvbGxlci5zaWduYWxcbiAgICB9XG4gICAgZ2xvYmFsLmZldGNoKGVuZFBvaW50LCBvcHRpb25zKVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAgICAgLnRoZW4oZGF0YSA9PiB0aGlzLnBhcnNlSlNPTihkYXRhKSlcbiAgICAgIC50aGVuKGRhdGEgPT4gY2FsbGJhY2sgJiYgY2FsbGJhY2soZGF0YSkpXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgaWYoZXJyLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiICYmIG9udGltZW91dCl7XG4gICAgICAgICAgb250aW1lb3V0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHJldHVybiBjb250cm9sbGVyXG4gIH1cblxuICBzdGF0aWMgeGRvbWFpblJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50KVxuICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLnBhcnNlSlNPTihyZXEucmVzcG9uc2VUZXh0KVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgLy8gV29yayBhcm91bmQgYnVnIGluIElFOSB0aGF0IHJlcXVpcmVzIGFuIGF0dGFjaGVkIG9ucHJvZ3Jlc3MgaGFuZGxlclxuICAgIHJlcS5vbnByb2dyZXNzID0gKCkgPT4geyB9XG5cbiAgICByZXEuc2VuZChib2R5KVxuICAgIHJldHVybiByZXFcbiAgfVxuXG4gIHN0YXRpYyB4aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgaGVhZGVycywgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgcmVxLm9wZW4obWV0aG9kLCBlbmRQb2ludCwgdHJ1ZSlcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICBmb3IobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhoZWFkZXJzKSl7XG4gICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbHVlKVxuICAgIH1cbiAgICByZXEub25lcnJvciA9ICgpID0+IGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwpXG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmKHJlcS5yZWFkeVN0YXRlID09PSBYSFJfU1RBVEVTLmNvbXBsZXRlICYmIGNhbGxiYWNrKXtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgcmVxLnNlbmQoYm9keSlcbiAgICByZXR1cm4gcmVxXG4gIH1cblxuICBzdGF0aWMgcGFyc2VKU09OKHJlc3Ape1xuICAgIGlmKCFyZXNwIHx8IHJlc3AgPT09IFwiXCIpeyByZXR1cm4gbnVsbCB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzcClcbiAgICB9IGNhdGNoIHtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJmYWlsZWQgdG8gcGFyc2UgSlNPTiByZXNwb25zZVwiLCByZXNwKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2VyaWFsaXplKG9iaiwgcGFyZW50S2V5KXtcbiAgICBsZXQgcXVlcnlTdHIgPSBbXVxuICAgIGZvcih2YXIga2V5IGluIG9iail7XG4gICAgICBpZighT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSl7IGNvbnRpbnVlIH1cbiAgICAgIGxldCBwYXJhbUtleSA9IHBhcmVudEtleSA/IGAke3BhcmVudEtleX1bJHtrZXl9XWAgOiBrZXlcbiAgICAgIGxldCBwYXJhbVZhbCA9IG9ialtrZXldXG4gICAgICBpZih0eXBlb2YgcGFyYW1WYWwgPT09IFwib2JqZWN0XCIpe1xuICAgICAgICBxdWVyeVN0ci5wdXNoKHRoaXMuc2VyaWFsaXplKHBhcmFtVmFsLCBwYXJhbUtleSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeVN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwYXJhbUtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVZhbCkpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0ci5qb2luKFwiJlwiKVxuICB9XG5cbiAgc3RhdGljIGFwcGVuZFBhcmFtcyh1cmwsIHBhcmFtcyl7XG4gICAgaWYoT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGggPT09IDApeyByZXR1cm4gdXJsIH1cblxuICAgIGxldCBwcmVmaXggPSB1cmwubWF0Y2goL1xcPy8pID8gXCImXCIgOiBcIj9cIlxuICAgIHJldHVybiBgJHt1cmx9JHtwcmVmaXh9JHt0aGlzLnNlcmlhbGl6ZShwYXJhbXMpfWBcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFNPQ0tFVF9TVEFURVMsXG4gIFRSQU5TUE9SVFMsXG4gIEFVVEhfVE9LRU5fUFJFRklYXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuXG5sZXQgYXJyYXlCdWZmZXJUb0Jhc2U2NCA9IChidWZmZXIpID0+IHtcbiAgbGV0IGJpbmFyeSA9IFwiXCJcbiAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKVxuICBsZXQgbGVuID0gYnl0ZXMuYnl0ZUxlbmd0aFxuICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspeyBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSkgfVxuICByZXR1cm4gYnRvYShiaW5hcnkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvbmdQb2xsIHtcblxuICBjb25zdHJ1Y3RvcihlbmRQb2ludCwgcHJvdG9jb2xzKXtcbiAgICAvLyB3ZSBvbmx5IHN1cHBvcnQgc3VicHJvdG9jb2xzIGZvciBhdXRoVG9rZW5cbiAgICAvLyBbXCJwaG9lbml4XCIsIFwiYmFzZTY0dXJsLmJlYXJlci5waHguQkFTRTY0X0VOQ09ERURfVE9LRU5cIl1cbiAgICBpZihwcm90b2NvbHMgJiYgcHJvdG9jb2xzLmxlbmd0aCA9PT0gMiAmJiBwcm90b2NvbHNbMV0uc3RhcnRzV2l0aChBVVRIX1RPS0VOX1BSRUZJWCkpe1xuICAgICAgdGhpcy5hdXRoVG9rZW4gPSBhdG9iKHByb3RvY29sc1sxXS5zbGljZShBVVRIX1RPS0VOX1BSRUZJWC5sZW5ndGgpKVxuICAgIH1cbiAgICB0aGlzLmVuZFBvaW50ID0gbnVsbFxuICAgIHRoaXMudG9rZW4gPSBudWxsXG4gICAgdGhpcy5za2lwSGVhcnRiZWF0ID0gdHJ1ZVxuICAgIHRoaXMucmVxcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlXG4gICAgdGhpcy5jdXJyZW50QmF0Y2ggPSBudWxsXG4gICAgdGhpcy5jdXJyZW50QmF0Y2hUaW1lciA9IG51bGxcbiAgICB0aGlzLmJhdGNoQnVmZmVyID0gW11cbiAgICB0aGlzLm9ub3BlbiA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9uZXJyb3IgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbmNsb3NlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMucG9sbEVuZHBvaW50ID0gdGhpcy5ub3JtYWxpemVFbmRwb2ludChlbmRQb2ludClcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3RpbmdcbiAgICAvLyB3ZSBtdXN0IHdhaXQgZm9yIHRoZSBjYWxsZXIgdG8gZmluaXNoIHNldHRpbmcgdXAgb3VyIGNhbGxiYWNrcyBhbmQgdGltZW91dCBwcm9wZXJ0aWVzXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnBvbGwoKSwgMClcbiAgfVxuXG4gIG5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KXtcbiAgICByZXR1cm4gKGVuZFBvaW50XG4gICAgICAucmVwbGFjZShcIndzOi8vXCIsIFwiaHR0cDovL1wiKVxuICAgICAgLnJlcGxhY2UoXCJ3c3M6Ly9cIiwgXCJodHRwczovL1wiKVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChcIiguKilcXC9cIiArIFRSQU5TUE9SVFMud2Vic29ja2V0KSwgXCIkMS9cIiArIFRSQU5TUE9SVFMubG9uZ3BvbGwpKVxuICB9XG5cbiAgZW5kcG9pbnRVUkwoKXtcbiAgICByZXR1cm4gQWpheC5hcHBlbmRQYXJhbXModGhpcy5wb2xsRW5kcG9pbnQsIHt0b2tlbjogdGhpcy50b2tlbn0pXG4gIH1cblxuICBjbG9zZUFuZFJldHJ5KGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIHRoaXMuY2xvc2UoY29kZSwgcmVhc29uLCB3YXNDbGVhbilcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNvbm5lY3RpbmdcbiAgfVxuXG4gIG9udGltZW91dCgpe1xuICAgIHRoaXMub25lcnJvcihcInRpbWVvdXRcIilcbiAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAwNSwgXCJ0aW1lb3V0XCIsIGZhbHNlKVxuICB9XG5cbiAgaXNBY3RpdmUoKXsgcmV0dXJuIHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5vcGVuIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nIH1cblxuICBwb2xsKCl7XG4gICAgY29uc3QgaGVhZGVycyA9IHtcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cbiAgICBpZih0aGlzLmF1dGhUb2tlbil7XG4gICAgICBoZWFkZXJzW1wiWC1QaG9lbml4LUF1dGhUb2tlblwiXSA9IHRoaXMuYXV0aFRva2VuXG4gICAgfVxuICAgIHRoaXMuYWpheChcIkdFVFwiLCBoZWFkZXJzLCBudWxsLCAoKSA9PiB0aGlzLm9udGltZW91dCgpLCByZXNwID0+IHtcbiAgICAgIGlmKHJlc3Ape1xuICAgICAgICB2YXIge3N0YXR1cywgdG9rZW4sIG1lc3NhZ2VzfSA9IHJlc3BcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgPSAwXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaChzdGF0dXMpe1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICAgICAgICAvLyBUYXNrcyBhcmUgd2hhdCB0aGluZ3MgbGlrZSBldmVudCBoYW5kbGVycywgc2V0VGltZW91dCBjYWxsYmFja3MsXG4gICAgICAgICAgICAvLyBwcm9taXNlIHJlc29sdmVzIGFuZCBtb3JlIGFyZSBydW4gd2l0aGluLlxuICAgICAgICAgICAgLy8gSW4gbW9kZXJuIGJyb3dzZXJzLCB0aGVyZSBhcmUgdHdvIGRpZmZlcmVudCBraW5kcyBvZiB0YXNrcyxcbiAgICAgICAgICAgIC8vIG1pY3JvdGFza3MgYW5kIG1hY3JvdGFza3MuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFyZSBtYWlubHkgdXNlZCBmb3IgUHJvbWlzZXMsIHdoaWxlIG1hY3JvdGFza3MgYXJlXG4gICAgICAgICAgICAvLyB1c2VkIGZvciBldmVyeXRoaW5nIGVsc2UuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFsd2F5cyBoYXZlIHByaW9yaXR5IG92ZXIgbWFjcm90YXNrcy4gSWYgdGhlIEpTIGVuZ2luZVxuICAgICAgICAgICAgLy8gaXMgbG9va2luZyBmb3IgYSB0YXNrIHRvIHJ1biwgaXQgd2lsbCBhbHdheXMgdHJ5IHRvIGVtcHR5IHRoZVxuICAgICAgICAgICAgLy8gbWljcm90YXNrIHF1ZXVlIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHJ1biBhbnl0aGluZyBmcm9tIHRoZVxuICAgICAgICAgICAgLy8gbWFjcm90YXNrIHF1ZXVlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEZvciB0aGUgV2ViU29ja2V0IHRyYW5zcG9ydCwgbWVzc2FnZXMgYWx3YXlzIGFycml2ZSBpbiB0aGVpciBvd25cbiAgICAgICAgICAgIC8vIGV2ZW50LiBUaGlzIG1lYW5zIHRoYXQgaWYgYW55IHByb21pc2VzIGFyZSByZXNvbHZlZCBmcm9tIHdpdGhpbixcbiAgICAgICAgICAgIC8vIHRoZWlyIGNhbGxiYWNrcyB3aWxsIGFsd2F5cyBmaW5pc2ggZXhlY3V0aW9uIGJ5IHRoZSB0aW1lIHRoZVxuICAgICAgICAgICAgLy8gbmV4dCBtZXNzYWdlIGV2ZW50IGhhbmRsZXIgaXMgcnVuLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIGVtdWxhdGUgdGhpcyBiZWhhdmlvdXIsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIGVhY2hcbiAgICAgICAgICAgIC8vIG9ubWVzc2FnZSBoYW5kbGVyIGlzIHJ1biB3aXRoaW4gaXRzIG93biBtYWNyb3Rhc2suXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMub25tZXNzYWdlKHtkYXRhOiBtc2d9KSwgMClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyMDQ6XG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQxMDpcbiAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLm9wZW5cbiAgICAgICAgICB0aGlzLm9ub3Blbih7fSlcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDAzOlxuICAgICAgICAgIHRoaXMub25lcnJvcig0MDMpXG4gICAgICAgICAgdGhpcy5jbG9zZSgxMDA4LCBcImZvcmJpZGRlblwiLCBmYWxzZSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgIGNhc2UgNTAwOlxuICAgICAgICAgIHRoaXMub25lcnJvcig1MDApXG4gICAgICAgICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMTEsIFwiaW50ZXJuYWwgc2VydmVyIGVycm9yXCIsIDUwMClcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYHVuaGFuZGxlZCBwb2xsIHN0YXR1cyAke3N0YXR1c31gKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyB3ZSBjb2xsZWN0IGFsbCBwdXNoZXMgd2l0aGluIHRoZSBjdXJyZW50IGV2ZW50IGxvb3AgYnlcbiAgLy8gc2V0VGltZW91dCAwLCB3aGljaCBvcHRpbWl6ZXMgYmFjay10by1iYWNrIHByb2NlZHVyYWxcbiAgLy8gcHVzaGVzIGFnYWluc3QgYW4gZW1wdHkgYnVmZmVyXG5cbiAgc2VuZChib2R5KXtcbiAgICBpZih0eXBlb2YoYm9keSkgIT09IFwic3RyaW5nXCIpeyBib2R5ID0gYXJyYXlCdWZmZXJUb0Jhc2U2NChib2R5KSB9XG4gICAgaWYodGhpcy5jdXJyZW50QmF0Y2gpe1xuICAgICAgdGhpcy5jdXJyZW50QmF0Y2gucHVzaChib2R5KVxuICAgIH0gZWxzZSBpZih0aGlzLmF3YWl0aW5nQmF0Y2hBY2spe1xuICAgICAgdGhpcy5iYXRjaEJ1ZmZlci5wdXNoKGJvZHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudEJhdGNoID0gW2JvZHldXG4gICAgICB0aGlzLmN1cnJlbnRCYXRjaFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuYmF0Y2hTZW5kKHRoaXMuY3VycmVudEJhdGNoKVxuICAgICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IG51bGxcbiAgICAgIH0sIDApXG4gICAgfVxuICB9XG5cbiAgYmF0Y2hTZW5kKG1lc3NhZ2VzKXtcbiAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSB0cnVlXG4gICAgdGhpcy5hamF4KFwiUE9TVFwiLCB7XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LW5kanNvblwifSwgbWVzc2FnZXMuam9pbihcIlxcblwiKSwgKCkgPT4gdGhpcy5vbmVycm9yKFwidGltZW91dFwiKSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSBmYWxzZVxuICAgICAgaWYoIXJlc3AgfHwgcmVzcC5zdGF0dXMgIT09IDIwMCl7XG4gICAgICAgIHRoaXMub25lcnJvcihyZXNwICYmIHJlc3Auc3RhdHVzKVxuICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgZmFsc2UpXG4gICAgICB9IGVsc2UgaWYodGhpcy5iYXRjaEJ1ZmZlci5sZW5ndGggPiAwKXtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5iYXRjaEJ1ZmZlcilcbiAgICAgICAgdGhpcy5iYXRjaEJ1ZmZlciA9IFtdXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIGZvcihsZXQgcmVxIG9mIHRoaXMucmVxcyl7IHJlcS5hYm9ydCgpIH1cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNsb3NlZFxuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7Y29kZTogMTAwMCwgcmVhc29uOiB1bmRlZmluZWQsIHdhc0NsZWFuOiB0cnVlfSwge2NvZGUsIHJlYXNvbiwgd2FzQ2xlYW59KVxuICAgIHRoaXMuYmF0Y2hCdWZmZXIgPSBbXVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmN1cnJlbnRCYXRjaFRpbWVyKVxuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsXG4gICAgaWYodHlwZW9mKENsb3NlRXZlbnQpICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHRoaXMub25jbG9zZShuZXcgQ2xvc2VFdmVudChcImNsb3NlXCIsIG9wdHMpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uY2xvc2Uob3B0cylcbiAgICB9XG4gIH1cblxuICBhamF4KG1ldGhvZCwgaGVhZGVycywgYm9keSwgb25DYWxsZXJUaW1lb3V0LCBjYWxsYmFjayl7XG4gICAgbGV0IHJlcVxuICAgIGxldCBvbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIG9uQ2FsbGVyVGltZW91dCgpXG4gICAgfVxuICAgIHJlcSA9IEFqYXgucmVxdWVzdChtZXRob2QsIHRoaXMuZW5kcG9pbnRVUkwoKSwgaGVhZGVycywgYm9keSwgdGhpcy50aW1lb3V0LCBvbnRpbWVvdXQsIHJlc3AgPT4ge1xuICAgICAgdGhpcy5yZXFzLmRlbGV0ZShyZXEpXG4gICAgICBpZih0aGlzLmlzQWN0aXZlKCkpeyBjYWxsYmFjayhyZXNwKSB9XG4gICAgfSlcbiAgICB0aGlzLnJlcXMuYWRkKHJlcSlcbiAgfVxufVxuIiwgIi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIFByZXNlbmNlXG4gKiBAcGFyYW0ge0NoYW5uZWx9IGNoYW5uZWwgLSBUaGUgQ2hhbm5lbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBUaGUgb3B0aW9ucyxcbiAqICAgICAgICBmb3IgZXhhbXBsZSBge2V2ZW50czoge3N0YXRlOiBcInN0YXRlXCIsIGRpZmY6IFwiZGlmZlwifX1gXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbmNlIHtcblxuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBvcHRzID0ge30pe1xuICAgIGxldCBldmVudHMgPSBvcHRzLmV2ZW50cyB8fCB7c3RhdGU6IFwicHJlc2VuY2Vfc3RhdGVcIiwgZGlmZjogXCJwcmVzZW5jZV9kaWZmXCJ9XG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICB0aGlzLmpvaW5SZWYgPSBudWxsXG4gICAgdGhpcy5jYWxsZXIgPSB7XG4gICAgICBvbkpvaW46IGZ1bmN0aW9uICgpeyB9LFxuICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvblN5bmM6IGZ1bmN0aW9uICgpeyB9XG4gICAgfVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5zdGF0ZSwgbmV3U3RhdGUgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICB0aGlzLmpvaW5SZWYgPSB0aGlzLmNoYW5uZWwuam9pblJlZigpXG4gICAgICB0aGlzLnN0YXRlID0gUHJlc2VuY2Uuc3luY1N0YXRlKHRoaXMuc3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpXG5cbiAgICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goZGlmZiA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpXG4gICAgICB9KVxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgICAgb25TeW5jKClcbiAgICB9KVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKGV2ZW50cy5kaWZmLCBkaWZmID0+IHtcbiAgICAgIGxldCB7b25Kb2luLCBvbkxlYXZlLCBvblN5bmN9ID0gdGhpcy5jYWxsZXJcblxuICAgICAgaWYodGhpcy5pblBlbmRpbmdTeW5jU3RhdGUoKSl7XG4gICAgICAgIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goZGlmZilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpXG4gICAgICAgIG9uU3luYygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbihjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uSm9pbiA9IGNhbGxiYWNrIH1cblxuICBvbkxlYXZlKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25MZWF2ZSA9IGNhbGxiYWNrIH1cblxuICBvblN5bmMoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vblN5bmMgPSBjYWxsYmFjayB9XG5cbiAgbGlzdChieSl7IHJldHVybiBQcmVzZW5jZS5saXN0KHRoaXMuc3RhdGUsIGJ5KSB9XG5cbiAgaW5QZW5kaW5nU3luY1N0YXRlKCl7XG4gICAgcmV0dXJuICF0aGlzLmpvaW5SZWYgfHwgKHRoaXMuam9pblJlZiAhPT0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKSlcbiAgfVxuXG4gIC8vIGxvd2VyLWxldmVsIHB1YmxpYyBzdGF0aWMgQVBJXG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc3luYyB0aGUgbGlzdCBvZiBwcmVzZW5jZXMgb24gdGhlIHNlcnZlclxuICAgKiB3aXRoIHRoZSBjbGllbnQncyBzdGF0ZS4gQW4gb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFjayBjYW5cbiAgICogYmUgcHJvdmlkZWQgdG8gcmVhY3QgdG8gY2hhbmdlcyBpbiB0aGUgY2xpZW50J3MgbG9jYWwgcHJlc2VuY2VzIGFjcm9zc1xuICAgKiBkaXNjb25uZWN0cyBhbmQgcmVjb25uZWN0cyB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBzeW5jU3RhdGUoY3VycmVudFN0YXRlLCBuZXdTdGF0ZSwgb25Kb2luLCBvbkxlYXZlKXtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLmNsb25lKGN1cnJlbnRTdGF0ZSlcbiAgICBsZXQgam9pbnMgPSB7fVxuICAgIGxldCBsZWF2ZXMgPSB7fVxuXG4gICAgdGhpcy5tYXAoc3RhdGUsIChrZXksIHByZXNlbmNlKSA9PiB7XG4gICAgICBpZighbmV3U3RhdGVba2V5XSl7XG4gICAgICAgIGxlYXZlc1trZXldID0gcHJlc2VuY2VcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMubWFwKG5ld1N0YXRlLCAoa2V5LCBuZXdQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBuZXdSZWZzID0gbmV3UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgY3VyUmVmcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBqb2luZWRNZXRhcyA9IG5ld1ByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IGN1clJlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgbGV0IGxlZnRNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBuZXdSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIGlmKGpvaW5lZE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGpvaW5zW2tleV0gPSBuZXdQcmVzZW5jZVxuICAgICAgICAgIGpvaW5zW2tleV0ubWV0YXMgPSBqb2luZWRNZXRhc1xuICAgICAgICB9XG4gICAgICAgIGlmKGxlZnRNZXRhcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICBsZWF2ZXNba2V5XSA9IHRoaXMuY2xvbmUoY3VycmVudFByZXNlbmNlKVxuICAgICAgICAgIGxlYXZlc1trZXldLm1ldGFzID0gbGVmdE1ldGFzXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGpvaW5zW2tleV0gPSBuZXdQcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuc3luY0RpZmYoc3RhdGUsIHtqb2luczogam9pbnMsIGxlYXZlczogbGVhdmVzfSwgb25Kb2luLCBvbkxlYXZlKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFVzZWQgdG8gc3luYyBhIGRpZmYgb2YgcHJlc2VuY2Ugam9pbiBhbmQgbGVhdmVcbiAgICogZXZlbnRzIGZyb20gdGhlIHNlcnZlciwgYXMgdGhleSBoYXBwZW4uIExpa2UgYHN5bmNTdGF0ZWAsIGBzeW5jRGlmZmBcbiAgICogYWNjZXB0cyBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrcyB0byByZWFjdCB0byBhIHVzZXJcbiAgICogam9pbmluZyBvciBsZWF2aW5nIGZyb20gYSBkZXZpY2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBzeW5jRGlmZihzdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKXtcbiAgICBsZXQge2pvaW5zLCBsZWF2ZXN9ID0gdGhpcy5jbG9uZShkaWZmKVxuICAgIGlmKCFvbkpvaW4peyBvbkpvaW4gPSBmdW5jdGlvbiAoKXsgfSB9XG4gICAgaWYoIW9uTGVhdmUpeyBvbkxlYXZlID0gZnVuY3Rpb24gKCl7IH0gfVxuXG4gICAgdGhpcy5tYXAoam9pbnMsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgc3RhdGVba2V5XSA9IHRoaXMuY2xvbmUobmV3UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2Upe1xuICAgICAgICBsZXQgam9pbmVkUmVmcyA9IHN0YXRlW2tleV0ubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgY3VyTWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gam9pbmVkUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBzdGF0ZVtrZXldLm1ldGFzLnVuc2hpZnQoLi4uY3VyTWV0YXMpXG4gICAgICB9XG4gICAgICBvbkpvaW4oa2V5LCBjdXJyZW50UHJlc2VuY2UsIG5ld1ByZXNlbmNlKVxuICAgIH0pXG4gICAgdGhpcy5tYXAobGVhdmVzLCAoa2V5LCBsZWZ0UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBpZighY3VycmVudFByZXNlbmNlKXsgcmV0dXJuIH1cbiAgICAgIGxldCByZWZzVG9SZW1vdmUgPSBsZWZ0UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgY3VycmVudFByZXNlbmNlLm1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihwID0+IHtcbiAgICAgICAgcmV0dXJuIHJlZnNUb1JlbW92ZS5pbmRleE9mKHAucGh4X3JlZikgPCAwXG4gICAgICB9KVxuICAgICAgb25MZWF2ZShrZXksIGN1cnJlbnRQcmVzZW5jZSwgbGVmdFByZXNlbmNlKVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlLm1ldGFzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIGRlbGV0ZSBzdGF0ZVtrZXldXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gc3RhdGVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcmVzZW5jZXMsIHdpdGggc2VsZWN0ZWQgbWV0YWRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmVzZW5jZXNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2hvb3NlclxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgbGlzdChwcmVzZW5jZXMsIGNob29zZXIpe1xuICAgIGlmKCFjaG9vc2VyKXsgY2hvb3NlciA9IGZ1bmN0aW9uIChrZXksIHByZXMpeyByZXR1cm4gcHJlcyB9IH1cblxuICAgIHJldHVybiB0aGlzLm1hcChwcmVzZW5jZXMsIChrZXksIHByZXNlbmNlKSA9PiB7XG4gICAgICByZXR1cm4gY2hvb3NlcihrZXksIHByZXNlbmNlKVxuICAgIH0pXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgc3RhdGljIG1hcChvYmosIGZ1bmMpe1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLm1hcChrZXkgPT4gZnVuYyhrZXksIG9ialtrZXldKSlcbiAgfVxuXG4gIHN0YXRpYyBjbG9uZShvYmopeyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSB9XG59XG4iLCAiLyogVGhlIGRlZmF1bHQgc2VyaWFsaXplciBmb3IgZW5jb2RpbmcgYW5kIGRlY29kaW5nIG1lc3NhZ2VzICovXG5pbXBvcnQge1xuICBDSEFOTkVMX0VWRU5UU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEhFQURFUl9MRU5HVEg6IDEsXG4gIE1FVEFfTEVOR1RIOiA0LFxuICBLSU5EUzoge3B1c2g6IDAsIHJlcGx5OiAxLCBicm9hZGNhc3Q6IDJ9LFxuXG4gIGVuY29kZShtc2csIGNhbGxiYWNrKXtcbiAgICBpZihtc2cucGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RW5jb2RlKG1zZykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBwYXlsb2FkID0gW21zZy5qb2luX3JlZiwgbXNnLnJlZiwgbXNnLnRvcGljLCBtc2cuZXZlbnQsIG1zZy5wYXlsb2FkXVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGUocmF3UGF5bG9hZCwgY2FsbGJhY2spe1xuICAgIGlmKHJhd1BheWxvYWQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKXtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLmJpbmFyeURlY29kZShyYXdQYXlsb2FkKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IFtqb2luX3JlZiwgcmVmLCB0b3BpYywgZXZlbnQsIHBheWxvYWRdID0gSlNPTi5wYXJzZShyYXdQYXlsb2FkKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKHtqb2luX3JlZiwgcmVmLCB0b3BpYywgZXZlbnQsIHBheWxvYWR9KVxuICAgIH1cbiAgfSxcblxuICAvLyBwcml2YXRlXG5cbiAgYmluYXJ5RW5jb2RlKG1lc3NhZ2Upe1xuICAgIGxldCB7am9pbl9yZWYsIHJlZiwgZXZlbnQsIHRvcGljLCBwYXlsb2FkfSA9IG1lc3NhZ2VcbiAgICBsZXQgbWV0YUxlbmd0aCA9IHRoaXMuTUVUQV9MRU5HVEggKyBqb2luX3JlZi5sZW5ndGggKyByZWYubGVuZ3RoICsgdG9waWMubGVuZ3RoICsgZXZlbnQubGVuZ3RoXG4gICAgbGV0IGhlYWRlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLkhFQURFUl9MRU5HVEggKyBtZXRhTGVuZ3RoKVxuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGhlYWRlcilcbiAgICBsZXQgb2Zmc2V0ID0gMFxuXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdGhpcy5LSU5EUy5wdXNoKSAvLyBraW5kXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgam9pbl9yZWYubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIHJlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgdG9waWMubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGV2ZW50Lmxlbmd0aClcbiAgICBBcnJheS5mcm9tKGpvaW5fcmVmLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbShyZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHRvcGljLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbShldmVudCwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuXG4gICAgdmFyIGNvbWJpbmVkID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyLmJ5dGVMZW5ndGggKyBwYXlsb2FkLmJ5dGVMZW5ndGgpXG4gICAgY29tYmluZWQuc2V0KG5ldyBVaW50OEFycmF5KGhlYWRlciksIDApXG4gICAgY29tYmluZWQuc2V0KG5ldyBVaW50OEFycmF5KHBheWxvYWQpLCBoZWFkZXIuYnl0ZUxlbmd0aClcblxuICAgIHJldHVybiBjb21iaW5lZC5idWZmZXJcbiAgfSxcblxuICBiaW5hcnlEZWNvZGUoYnVmZmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpXG4gICAgbGV0IGtpbmQgPSB2aWV3LmdldFVpbnQ4KDApXG4gICAgbGV0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKVxuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5wdXNoOiByZXR1cm4gdGhpcy5kZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5yZXBseTogcmV0dXJuIHRoaXMuZGVjb2RlUmVwbHkoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLmJyb2FkY2FzdDogcmV0dXJuIHRoaXMuZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICB9XG4gIH0sXG5cbiAgZGVjb2RlUHVzaChidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIHRoaXMuTUVUQV9MRU5HVEggLSAxIC8vIHB1c2hlcyBoYXZlIG5vIHJlZlxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG4gICAgcmV0dXJuIHtqb2luX3JlZjogam9pblJlZiwgcmVmOiBudWxsLCB0b3BpYzogdG9waWMsIGV2ZW50OiBldmVudCwgcGF5bG9hZDogZGF0YX1cbiAgfSxcblxuICBkZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCBqb2luUmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgcmVmU2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgzKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDQpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIHRoaXMuTUVUQV9MRU5HVEhcbiAgICBsZXQgam9pblJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGpvaW5SZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBqb2luUmVmU2l6ZVxuICAgIGxldCByZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyByZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyByZWZTaXplXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG4gICAgbGV0IHBheWxvYWQgPSB7c3RhdHVzOiBldmVudCwgcmVzcG9uc2U6IGRhdGF9XG4gICAgcmV0dXJuIHtqb2luX3JlZjogam9pblJlZiwgcmVmOiByZWYsIHRvcGljOiB0b3BpYywgZXZlbnQ6IENIQU5ORUxfRVZFTlRTLnJlcGx5LCBwYXlsb2FkOiBwYXlsb2FkfVxuICB9LFxuXG4gIGRlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpe1xuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDEpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgMlxuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplXG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemVcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIHtqb2luX3JlZjogbnVsbCwgcmVmOiBudWxsLCB0b3BpYzogdG9waWMsIGV2ZW50OiBldmVudCwgcGF5bG9hZDogZGF0YX1cbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIGdsb2JhbCxcbiAgcGh4V2luZG93LFxuICBDSEFOTkVMX0VWRU5UUyxcbiAgREVGQVVMVF9USU1FT1VULFxuICBERUZBVUxUX1ZTTixcbiAgU09DS0VUX1NUQVRFUyxcbiAgVFJBTlNQT1JUUyxcbiAgV1NfQ0xPU0VfTk9STUFMLFxuICBBVVRIX1RPS0VOX1BSRUZJWFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9zdXJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEFqYXggZnJvbSBcIi4vYWpheFwiXG5pbXBvcnQgQ2hhbm5lbCBmcm9tIFwiLi9jaGFubmVsXCJcbmltcG9ydCBMb25nUG9sbCBmcm9tIFwiLi9sb25ncG9sbFwiXG5pbXBvcnQgU2VyaWFsaXplciBmcm9tIFwiLi9zZXJpYWxpemVyXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKiBJbml0aWFsaXplcyB0aGUgU29ja2V0ICpcbiAqXG4gKiBGb3IgSUU4IHN1cHBvcnQgdXNlIGFuIEVTNS1zaGltIChodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3czovL2V4YW1wbGUuY29tL3NvY2tldFwiYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCJ3c3M6Ly9leGFtcGxlLmNvbVwiYFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9zb2NrZXRcImAgKGluaGVyaXRlZCBob3N0ICYgcHJvdG9jb2wpXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMudHJhbnNwb3J0XSAtIFRoZSBXZWJzb2NrZXQgVHJhbnNwb3J0LCBmb3IgZXhhbXBsZSBXZWJTb2NrZXQgb3IgUGhvZW5peC5Mb25nUG9sbC5cbiAqXG4gKiBEZWZhdWx0cyB0byBXZWJTb2NrZXQgd2l0aCBhdXRvbWF0aWMgTG9uZ1BvbGwgZmFsbGJhY2sgaWYgV2ViU29ja2V0IGlzIG5vdCBkZWZpbmVkLlxuICogVG8gZmFsbGJhY2sgdG8gTG9uZ1BvbGwgd2hlbiBXZWJTb2NrZXQgYXR0ZW1wdHMgZmFpbCwgdXNlIGBsb25nUG9sbEZhbGxiYWNrTXM6IDI1MDBgLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5sb25nUG9sbEZhbGxiYWNrTXNdIC0gVGhlIG1pbGxpc2Vjb25kIHRpbWUgdG8gYXR0ZW1wdCB0aGUgcHJpbWFyeSB0cmFuc3BvcnRcbiAqIGJlZm9yZSBmYWxsaW5nIGJhY2sgdG8gdGhlIExvbmdQb2xsIHRyYW5zcG9ydC4gRGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmRlYnVnXSAtIFdoZW4gdHJ1ZSwgZW5hYmxlcyBkZWJ1ZyBsb2dnaW5nLiBEZWZhdWx0IGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmVuY29kZV0gLSBUaGUgZnVuY3Rpb24gdG8gZW5jb2RlIG91dGdvaW5nIG1lc3NhZ2VzLlxuICpcbiAqIERlZmF1bHRzIHRvIEpTT04gZW5jb2Rlci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5kZWNvZGVdIC0gVGhlIGZ1bmN0aW9uIHRvIGRlY29kZSBpbmNvbWluZyBtZXNzYWdlcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBKU09OOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIChwYXlsb2FkLCBjYWxsYmFjaykgPT4gY2FsbGJhY2soSlNPTi5wYXJzZShwYXlsb2FkKSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lb3V0XSAtIFRoZSBkZWZhdWx0IHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIHRyaWdnZXIgcHVzaCB0aW1lb3V0cy5cbiAqXG4gKiBEZWZhdWx0cyBgREVGQVVMVF9USU1FT1VUYFxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmhlYXJ0YmVhdEludGVydmFsTXNdIC0gVGhlIG1pbGxpc2VjIGludGVydmFsIHRvIHNlbmQgYSBoZWFydGJlYXQgbWVzc2FnZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucmVjb25uZWN0QWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICogc29ja2V0IHJlY29ubmVjdCBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIERlZmF1bHRzIHRvIHN0ZXBwZWQgYmFja29mZiBvZjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucmVqb2luQWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBtaWxsaXNlY1xuICogcmVqb2luIGludGVydmFsIGZvciBpbmRpdmlkdWFsIGNoYW5uZWxzLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMubG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZywgaWU6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24oa2luZCwgbXNnLCBkYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKGAke2tpbmR9OiAke21zZ31gLCBkYXRhKVxuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmxvbmdwb2xsZXJUaW1lb3V0XSAtIFRoZSBtYXhpbXVtIHRpbWVvdXQgb2YgYSBsb25nIHBvbGwgQUpBWCByZXF1ZXN0LlxuICpcbiAqIERlZmF1bHRzIHRvIDIwcyAoZG91YmxlIHRoZSBzZXJ2ZXIgbG9uZyBwb2xsIHRpbWVyKS5cbiAqXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24pfSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIHBhcmFtcyB0byBwYXNzIHdoZW4gY29ubmVjdGluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmF1dGhUb2tlbl0gLSB0aGUgb3B0aW9uYWwgYXV0aGVudGljYXRpb24gdG9rZW4gdG8gYmUgZXhwb3NlZCBvbiB0aGUgc2VydmVyXG4gKiB1bmRlciB0aGUgYDphdXRoX3Rva2VuYCBjb25uZWN0X2luZm8ga2V5LlxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmFyeVR5cGVdIC0gVGhlIGJpbmFyeSB0eXBlIHRvIHVzZSBmb3IgYmluYXJ5IFdlYlNvY2tldCBmcmFtZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gXCJhcnJheWJ1ZmZlclwiXG4gKlxuICogQHBhcmFtIHt2c259IFtvcHRzLnZzbl0gLSBUaGUgc2VyaWFsaXplcidzIHByb3RvY29sIHZlcnNpb24gdG8gc2VuZCBvbiBjb25uZWN0LlxuICpcbiAqIERlZmF1bHRzIHRvIERFRkFVTFRfVlNOLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBQaG9lbml4IHVzZXMgc2Vzc2lvblN0b3JhZ2UgZm9yIGxvbmdwb2xsIGZhbGxiYWNrIGhpc3RvcnkuIE92ZXJyaWRpbmcgdGhlIHN0b3JlIGlzXG4gKiB1c2VmdWwgd2hlbiBQaG9lbml4IHdvbid0IGhhdmUgYWNjZXNzIHRvIGBzZXNzaW9uU3RvcmFnZWAuIEZvciBleGFtcGxlLCBUaGlzIGNvdWxkXG4gKiBoYXBwZW4gaWYgYSBzaXRlIGxvYWRzIGEgY3Jvc3MtZG9tYWluIGNoYW5uZWwgaW4gYW4gaWZyYW1lLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqICAgICBjbGFzcyBJbk1lbW9yeVN0b3JhZ2Uge1xuICogICAgICAgY29uc3RydWN0b3IoKSB7IHRoaXMuc3RvcmFnZSA9IHt9IH1cbiAqICAgICAgIGdldEl0ZW0oa2V5TmFtZSkgeyByZXR1cm4gdGhpcy5zdG9yYWdlW2tleU5hbWVdIHx8IG51bGwgfVxuICogICAgICAgcmVtb3ZlSXRlbShrZXlOYW1lKSB7IGRlbGV0ZSB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gfVxuICogICAgICAgc2V0SXRlbShrZXlOYW1lLCBrZXlWYWx1ZSkgeyB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gPSBrZXlWYWx1ZSB9XG4gKiAgICAgfVxuICpcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXQge1xuICBjb25zdHJ1Y3RvcihlbmRQb2ludCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzID0ge29wZW46IFtdLCBjbG9zZTogW10sIGVycm9yOiBbXSwgbWVzc2FnZTogW119XG4gICAgdGhpcy5jaGFubmVscyA9IFtdXG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQgfHwgREVGQVVMVF9USU1FT1VUXG4gICAgdGhpcy50cmFuc3BvcnQgPSBvcHRzLnRyYW5zcG9ydCB8fCBnbG9iYWwuV2ViU29ja2V0IHx8IExvbmdQb2xsXG4gICAgdGhpcy5wcmltYXJ5UGFzc2VkSGVhbHRoQ2hlY2sgPSBmYWxzZVxuICAgIHRoaXMubG9uZ1BvbGxGYWxsYmFja01zID0gb3B0cy5sb25nUG9sbEZhbGxiYWNrTXNcbiAgICB0aGlzLmZhbGxiYWNrVGltZXIgPSBudWxsXG4gICAgdGhpcy5zZXNzaW9uU3RvcmUgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IChnbG9iYWwgJiYgZ2xvYmFsLnNlc3Npb25TdG9yYWdlKVxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucyA9IDBcbiAgICB0aGlzLmRlZmF1bHRFbmNvZGVyID0gU2VyaWFsaXplci5lbmNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuZGVmYXVsdERlY29kZXIgPSBTZXJpYWxpemVyLmRlY29kZS5iaW5kKFNlcmlhbGl6ZXIpXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSBmYWxzZVxuICAgIHRoaXMuYmluYXJ5VHlwZSA9IG9wdHMuYmluYXJ5VHlwZSB8fCBcImFycmF5YnVmZmVyXCJcbiAgICB0aGlzLmNvbm5lY3RDbG9jayA9IDFcbiAgICBpZih0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5lbmNvZGUgPSBvcHRzLmVuY29kZSB8fCB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IG9wdHMuZGVjb2RlIHx8IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmNvZGUgPSB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9XG4gICAgbGV0IGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgaWYocGh4V2luZG93ICYmIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IHRoaXMuY29ubmVjdENsb2NrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VzaG93XCIsIF9lID0+IHtcbiAgICAgICAgaWYoYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9PT0gdGhpcy5jb25uZWN0Q2xvY2spe1xuICAgICAgICAgIGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgICAgICAgdGhpcy5jb25uZWN0KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zID0gb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zIHx8IDMwMDAwXG4gICAgdGhpcy5yZWpvaW5BZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlam9pbkFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWpvaW5BZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVjb25uZWN0QWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYob3B0cy5yZWNvbm5lY3RBZnRlck1zKXtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVjb25uZWN0QWZ0ZXJNcyh0cmllcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXIgfHwgbnVsbFxuICAgIGlmKCF0aGlzLmxvZ2dlciAmJiBvcHRzLmRlYnVnKXtcbiAgICAgIHRoaXMubG9nZ2VyID0gKGtpbmQsIG1zZywgZGF0YSkgPT4geyBjb25zb2xlLmxvZyhgJHtraW5kfTogJHttc2d9YCwgZGF0YSkgfVxuICAgIH1cbiAgICB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0ID0gb3B0cy5sb25ncG9sbGVyVGltZW91dCB8fCAyMDAwMFxuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLmVuZFBvaW50ID0gYCR7ZW5kUG9pbnR9LyR7VFJBTlNQT1JUUy53ZWJzb2NrZXR9YFxuICAgIHRoaXMudnNuID0gb3B0cy52c24gfHwgREVGQVVMVF9WU05cbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IG51bGxcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gbnVsbFxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIHRoaXMudGVhcmRvd24oKCkgPT4gdGhpcy5jb25uZWN0KCkpXG4gICAgfSwgdGhpcy5yZWNvbm5lY3RBZnRlck1zKVxuICAgIHRoaXMuYXV0aFRva2VuID0gb3B0cy5hdXRoVG9rZW5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBMb25nUG9sbCB0cmFuc3BvcnQgcmVmZXJlbmNlXG4gICAqL1xuICBnZXRMb25nUG9sbFRyYW5zcG9ydCgpeyByZXR1cm4gTG9uZ1BvbGwgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBhbmQgcmVwbGFjZXMgdGhlIGFjdGl2ZSB0cmFuc3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3VHJhbnNwb3J0IC0gVGhlIG5ldyB0cmFuc3BvcnQgY2xhc3MgdG8gaW5zdGFudGlhdGVcbiAgICpcbiAgICovXG4gIHJlcGxhY2VUcmFuc3BvcnQobmV3VHJhbnNwb3J0KXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gdHJ1ZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgaWYodGhpcy5jb25uKXtcbiAgICAgIHRoaXMuY29ubi5jbG9zZSgpXG4gICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgfVxuICAgIHRoaXMudHJhbnNwb3J0ID0gbmV3VHJhbnNwb3J0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc29ja2V0IHByb3RvY29sXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90b2NvbCgpeyByZXR1cm4gbG9jYXRpb24ucHJvdG9jb2wubWF0Y2goL15odHRwcy8pID8gXCJ3c3NcIiA6IFwid3NcIiB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxseSBxdWFsaWZpZWQgc29ja2V0IHVybFxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZW5kUG9pbnRVUkwoKXtcbiAgICBsZXQgdXJpID0gQWpheC5hcHBlbmRQYXJhbXMoXG4gICAgICBBamF4LmFwcGVuZFBhcmFtcyh0aGlzLmVuZFBvaW50LCB0aGlzLnBhcmFtcygpKSwge3ZzbjogdGhpcy52c259KVxuICAgIGlmKHVyaS5jaGFyQXQoMCkgIT09IFwiL1wiKXsgcmV0dXJuIHVyaSB9XG4gICAgaWYodXJpLmNoYXJBdCgxKSA9PT0gXCIvXCIpeyByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfToke3VyaX1gIH1cblxuICAgIHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9Oi8vJHtsb2NhdGlvbi5ob3N0fSR7dXJpfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyB0aGUgc29ja2V0XG4gICAqXG4gICAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2xvc2VFdmVudCNTdGF0dXNfY29kZXMgZm9yIHZhbGlkIHN0YXR1cyBjb2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgYWZ0ZXIgc29ja2V0IGlzIGRpc2Nvbm5lY3RlZC5cbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBjb2RlIC0gQSBzdGF0dXMgY29kZSBmb3IgZGlzY29ubmVjdGlvbiAoT3B0aW9uYWwpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVhc29uIC0gQSB0ZXh0dWFsIGRlc2NyaXB0aW9uIG9mIHRoZSByZWFzb24gdG8gZGlzY29ubmVjdC4gKE9wdGlvbmFsKVxuICAgKi9cbiAgZGlzY29ubmVjdChjYWxsYmFjaywgY29kZSwgcmVhc29uKXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5kaXNjb25uZWN0aW5nID0gdHJ1ZVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IHRydWVcbiAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMudGVhcmRvd24oKCkgPT4ge1xuICAgICAgdGhpcy5kaXNjb25uZWN0aW5nID0gZmFsc2VcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9LCBjb2RlLCByZWFzb24pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbXMgdG8gc2VuZCB3aGVuIGNvbm5lY3RpbmcsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogdXNlclRva2VufWBcbiAgICpcbiAgICogUGFzc2luZyBwYXJhbXMgdG8gY29ubmVjdCBpcyBkZXByZWNhdGVkOyBwYXNzIHRoZW0gaW4gdGhlIFNvY2tldCBjb25zdHJ1Y3RvciBpbnN0ZWFkOlxuICAgKiBgbmV3IFNvY2tldChcIi9zb2NrZXRcIiwge3BhcmFtczoge3VzZXJfaWQ6IHVzZXJUb2tlbn19KWAuXG4gICAqL1xuICBjb25uZWN0KHBhcmFtcyl7XG4gICAgaWYocGFyYW1zKXtcbiAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJwYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQgcGFzcyA6cGFyYW1zIHRvIHRoZSBTb2NrZXQgY29uc3RydWN0b3JcIilcbiAgICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMpXG4gICAgfVxuICAgIGlmKHRoaXMuY29ubiAmJiAhdGhpcy5kaXNjb25uZWN0aW5nKXsgcmV0dXJuIH1cbiAgICBpZih0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcyAmJiB0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5jb25uZWN0V2l0aEZhbGxiYWNrKExvbmdQb2xsLCB0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmFuc3BvcnRDb25uZWN0KClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ncyB0aGUgbWVzc2FnZS4gT3ZlcnJpZGUgYHRoaXMubG9nZ2VyYCBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZy4gbm9vcHMgYnkgZGVmYXVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2luZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBsb2coa2luZCwgbXNnLCBkYXRhKXsgdGhpcy5sb2dnZXIgJiYgdGhpcy5sb2dnZXIoa2luZCwgbXNnLCBkYXRhKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIGxvZ2dlciBoYXMgYmVlbiBzZXQgb24gdGhpcyBzb2NrZXQuXG4gICAqL1xuICBoYXNMb2dnZXIoKXsgcmV0dXJuIHRoaXMubG9nZ2VyICE9PSBudWxsIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBvcGVuIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25PcGVuKGZ1bmN0aW9uKCl7IGNvbnNvbGUuaW5mbyhcInRoZSBzb2NrZXQgd2FzIG9wZW5lZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25PcGVuKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4ucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gY2xvc2UgZXZlbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkNsb3NlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGVycm9yIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25FcnJvcihmdW5jdGlvbihlcnJvcil7IGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gbWVzc2FnZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uTWVzc2FnZShjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBQaW5ncyB0aGUgc2VydmVyIGFuZCBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBSVFQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGluZyB3YXMgcHVzaGVkIG9yIGZhbHNlIGlmIHVuYWJsZSB0byBiZSBwdXNoZWQuXG4gICAqL1xuICBwaW5nKGNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogcmVmfSlcbiAgICBsZXQgb25Nc2dSZWYgPSB0aGlzLm9uTWVzc2FnZShtc2cgPT4ge1xuICAgICAgaWYobXNnLnJlZiA9PT0gcmVmKXtcbiAgICAgICAgdGhpcy5vZmYoW29uTXNnUmVmXSlcbiAgICAgICAgY2FsbGJhY2soRGF0ZS5ub3coKSAtIHN0YXJ0VGltZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgdHJhbnNwb3J0Q29ubmVjdCgpe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIGxldCBwcm90b2NvbHMgPSB1bmRlZmluZWRcbiAgICAvLyBTZWMtV2ViU29ja2V0LVByb3RvY29sIGJhc2VkIHRva2VuXG4gICAgLy8gKGxvbmdwb2xsIHVzZXMgQXV0aG9yaXphdGlvbiBoZWFkZXIgaW5zdGVhZClcbiAgICBpZih0aGlzLmF1dGhUb2tlbil7XG4gICAgICBwcm90b2NvbHMgPSBbXCJwaG9lbml4XCIsIGAke0FVVEhfVE9LRU5fUFJFRklYfSR7YnRvYSh0aGlzLmF1dGhUb2tlbikucmVwbGFjZSgvPS9nLCBcIlwiKX1gXVxuICAgIH1cbiAgICB0aGlzLmNvbm4gPSBuZXcgdGhpcy50cmFuc3BvcnQodGhpcy5lbmRQb2ludFVSTCgpLCBwcm90b2NvbHMpXG4gICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSB0aGlzLmJpbmFyeVR5cGVcbiAgICB0aGlzLmNvbm4udGltZW91dCA9IHRoaXMubG9uZ3BvbGxlclRpbWVvdXRcbiAgICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5vbkNvbm5PcGVuKClcbiAgICB0aGlzLmNvbm4ub25lcnJvciA9IGVycm9yID0+IHRoaXMub25Db25uRXJyb3IoZXJyb3IpXG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHRoaXMub25Db25uTWVzc2FnZShldmVudClcbiAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGV2ZW50ID0+IHRoaXMub25Db25uQ2xvc2UoZXZlbnQpXG4gIH1cblxuICBnZXRTZXNzaW9uKGtleSl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yZSAmJiB0aGlzLnNlc3Npb25TdG9yZS5nZXRJdGVtKGtleSkgfVxuXG4gIHN0b3JlU2Vzc2lvbihrZXksIHZhbCl7IHRoaXMuc2Vzc2lvblN0b3JlICYmIHRoaXMuc2Vzc2lvblN0b3JlLnNldEl0ZW0oa2V5LCB2YWwpIH1cblxuICBjb25uZWN0V2l0aEZhbGxiYWNrKGZhbGxiYWNrVHJhbnNwb3J0LCBmYWxsYmFja1RocmVzaG9sZCA9IDI1MDApe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgbGV0IGVzdGFibGlzaGVkID0gZmFsc2VcbiAgICBsZXQgcHJpbWFyeVRyYW5zcG9ydCA9IHRydWVcbiAgICBsZXQgb3BlblJlZiwgZXJyb3JSZWZcbiAgICBsZXQgZmFsbGJhY2sgPSAocmVhc29uKSA9PiB7XG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZmFsbGluZyBiYWNrIHRvICR7ZmFsbGJhY2tUcmFuc3BvcnQubmFtZX0uLi5gLCByZWFzb24pXG4gICAgICB0aGlzLm9mZihbb3BlblJlZiwgZXJyb3JSZWZdKVxuICAgICAgcHJpbWFyeVRyYW5zcG9ydCA9IGZhbHNlXG4gICAgICB0aGlzLnJlcGxhY2VUcmFuc3BvcnQoZmFsbGJhY2tUcmFuc3BvcnQpXG4gICAgICB0aGlzLnRyYW5zcG9ydENvbm5lY3QoKVxuICAgIH1cbiAgICBpZih0aGlzLmdldFNlc3Npb24oYHBoeDpmYWxsYmFjazoke2ZhbGxiYWNrVHJhbnNwb3J0Lm5hbWV9YCkpeyByZXR1cm4gZmFsbGJhY2soXCJtZW1vcml6ZWRcIikgfVxuXG4gICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG5cbiAgICBlcnJvclJlZiA9IHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJlcnJvclwiLCByZWFzb24pXG4gICAgICBpZihwcmltYXJ5VHJhbnNwb3J0ICYmICFlc3RhYmxpc2hlZCl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgICAgIGZhbGxiYWNrKHJlYXNvbilcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMub25PcGVuKCgpID0+IHtcbiAgICAgIGVzdGFibGlzaGVkID0gdHJ1ZVxuICAgICAgaWYoIXByaW1hcnlUcmFuc3BvcnQpe1xuICAgICAgICAvLyBvbmx5IG1lbW9yaXplIExQIGlmIHdlIG5ldmVyIGNvbm5lY3RlZCB0byBwcmltYXJ5XG4gICAgICAgIGlmKCF0aGlzLnByaW1hcnlQYXNzZWRIZWFsdGhDaGVjayl7IHRoaXMuc3RvcmVTZXNzaW9uKGBwaHg6ZmFsbGJhY2s6JHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfWAsIFwidHJ1ZVwiKSB9XG4gICAgICAgIHJldHVybiB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZXN0YWJsaXNoZWQgJHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfSBmYWxsYmFja2ApXG4gICAgICB9XG4gICAgICAvLyBpZiB3ZSd2ZSBlc3RhYmxpc2hlZCBwcmltYXJ5LCBnaXZlIHRoZSBmYWxsYmFjayBhIG5ldyBwZXJpb2QgdG8gYXR0ZW1wdCBwaW5nXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG4gICAgICB0aGlzLnBpbmcocnR0ID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJjb25uZWN0ZWQgdG8gcHJpbWFyeSBhZnRlclwiLCBydHQpXG4gICAgICAgIHRoaXMucHJpbWFyeVBhc3NlZEhlYWx0aENoZWNrID0gdHJ1ZVxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMudHJhbnNwb3J0Q29ubmVjdCgpXG4gIH1cblxuICBjbGVhckhlYXJ0YmVhdHMoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpXG4gIH1cblxuICBvbkNvbm5PcGVuKCl7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYCR7dGhpcy50cmFuc3BvcnQubmFtZX0gY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSBmYWxzZVxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucysrXG4gICAgdGhpcy5mbHVzaFNlbmRCdWZmZXIoKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMucmVzZXRIZWFydGJlYXQoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mub3Blbi5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IGNhbGxiYWNrKCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgaGVhcnRiZWF0VGltZW91dCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXsgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJoZWFydGJlYXQgdGltZW91dC4gQXR0ZW1wdGluZyB0byByZS1lc3RhYmxpc2ggY29ubmVjdGlvblwiKSB9XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICAgIHRoaXMudGVhcmRvd24oKCkgPT4gdGhpcy5yZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSwgV1NfQ0xPU0VfTk9STUFMLCBcImhlYXJ0YmVhdCB0aW1lb3V0XCIpXG4gICAgfVxuICB9XG5cbiAgcmVzZXRIZWFydGJlYXQoKXtcbiAgICBpZih0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnNraXBIZWFydGJlYXQpeyByZXR1cm4gfVxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIHRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIGlmKCF0aGlzLmNvbm4pe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG4gICAgbGV0IGNvbm5lY3RDbG9jayA9IHRoaXMuY29ubmVjdENsb2NrXG5cbiAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKCgpID0+IHtcbiAgICAgIGlmKGNvbm5lY3RDbG9jayAhPT0gdGhpcy5jb25uZWN0Q2xvY2speyByZXR1cm4gfVxuICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgaWYoY29kZSl7IHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24gfHwgXCJcIikgfSBlbHNlIHsgdGhpcy5jb25uLmNsb3NlKCkgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoKCkgPT4ge1xuICAgICAgICBpZihjb25uZWN0Q2xvY2sgIT09IHRoaXMuY29ubmVjdENsb2NrKXsgcmV0dXJuIH1cbiAgICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgICB0aGlzLmNvbm4ub25vcGVuID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbmVycm9yID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uLm9uY2xvc2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uID0gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgd2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzID0gMSl7XG4gICAgaWYodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCAhdGhpcy5jb25uLmJ1ZmZlcmVkQW1vdW50KXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy53YWl0Rm9yQnVmZmVyRG9uZShjYWxsYmFjaywgdHJpZXMgKyAxKVxuICAgIH0sIDE1MCAqIHRyaWVzKVxuICB9XG5cbiAgd2FpdEZvclNvY2tldENsb3NlZChjYWxsYmFjaywgdHJpZXMgPSAxKXtcbiAgICBpZih0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8IHRoaXMuY29ubi5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNsb3NlZCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZChjYWxsYmFjaywgdHJpZXMgKyAxKVxuICAgIH0sIDE1MCAqIHRyaWVzKVxuICB9XG5cbiAgb25Db25uQ2xvc2UoZXZlbnQpe1xuICAgIGxldCBjbG9zZUNvZGUgPSBldmVudCAmJiBldmVudC5jb2RlXG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJjbG9zZVwiLCBldmVudClcbiAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgIHRoaXMuY2xlYXJIZWFydGJlYXRzKClcbiAgICBpZighdGhpcy5jbG9zZVdhc0NsZWFuICYmIGNsb3NlQ29kZSAhPT0gMTAwMCl7XG4gICAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpXG4gICAgfVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UuZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjayhldmVudCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubkVycm9yKGVycm9yKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBlcnJvcilcbiAgICBsZXQgdHJhbnNwb3J0QmVmb3JlID0gdGhpcy50cmFuc3BvcnRcbiAgICBsZXQgZXN0YWJsaXNoZWRCZWZvcmUgPSB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnNcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4ge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIHRyYW5zcG9ydEJlZm9yZSwgZXN0YWJsaXNoZWRCZWZvcmUpXG4gICAgfSlcbiAgICBpZih0cmFuc3BvcnRCZWZvcmUgPT09IHRoaXMudHJhbnNwb3J0IHx8IGVzdGFibGlzaGVkQmVmb3JlID4gMCl7XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlckNoYW5FcnJvcigpe1xuICAgIHRoaXMuY2hhbm5lbHMuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGlmKCEoY2hhbm5lbC5pc0Vycm9yZWQoKSB8fCBjaGFubmVsLmlzTGVhdmluZygpIHx8IGNoYW5uZWwuaXNDbG9zZWQoKSkpe1xuICAgICAgICBjaGFubmVsLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgY29ubmVjdGlvblN0YXRlKCl7XG4gICAgc3dpdGNoKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4ucmVhZHlTdGF0ZSl7XG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZzogcmV0dXJuIFwiY29ubmVjdGluZ1wiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMub3BlbjogcmV0dXJuIFwib3BlblwiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY2xvc2luZzogcmV0dXJuIFwiY2xvc2luZ1wiXG4gICAgICBkZWZhdWx0OiByZXR1cm4gXCJjbG9zZWRcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLmNvbm5lY3Rpb25TdGF0ZSgpID09PSBcIm9wZW5cIiB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbm5lbH1cbiAgICovXG4gIHJlbW92ZShjaGFubmVsKXtcbiAgICB0aGlzLm9mZihjaGFubmVsLnN0YXRlQ2hhbmdlUmVmcylcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVscy5maWx0ZXIoYyA9PiBjICE9PSBjaGFubmVsKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWAgcmVnaXN0cmF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtyZWZzfSAtIGxpc3Qgb2YgcmVmcyByZXR1cm5lZCBieSBjYWxscyB0b1xuICAgKiAgICAgICAgICAgICAgICAgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWBcbiAgICovXG4gIG9mZihyZWZzKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzKXtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XS5maWx0ZXIoKFtyZWZdKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzLmluZGV4T2YocmVmKSA9PT0gLTFcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhIG5ldyBjaGFubmVsIGZvciB0aGUgZ2l2ZW4gdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjaGFuUGFyYW1zIC0gUGFyYW1ldGVycyBmb3IgdGhlIGNoYW5uZWxcbiAgICogQHJldHVybnMge0NoYW5uZWx9XG4gICAqL1xuICBjaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zID0ge30pe1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW4pXG4gICAgcmV0dXJuIGNoYW5cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgcHVzaChkYXRhKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IGRhdGFcbiAgICAgIHRoaXMubG9nKFwicHVzaFwiLCBgJHt0b3BpY30gJHtldmVudH0gKCR7am9pbl9yZWZ9LCAke3JlZn0pYCwgcGF5bG9hZClcbiAgICB9XG5cbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkpe1xuICAgICAgdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlci5wdXNoKCgpID0+IHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYgKyAxXG4gICAgaWYobmV3UmVmID09PSB0aGlzLnJlZil7IHRoaXMucmVmID0gMCB9IGVsc2UgeyB0aGlzLnJlZiA9IG5ld1JlZiB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWYudG9TdHJpbmcoKVxuICB9XG5cbiAgc2VuZEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiAmJiAhdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmfSlcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5oZWFydGJlYXRUaW1lb3V0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIGZsdXNoU2VuZEJ1ZmZlcigpe1xuICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKVxuICAgICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB9XG4gIH1cblxuICBvbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2Upe1xuICAgIHRoaXMuZGVjb2RlKHJhd01lc3NhZ2UuZGF0YSwgbXNnID0+IHtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IG1zZ1xuICAgICAgaWYocmVmICYmIHJlZiA9PT0gdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKXtcbiAgICAgICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwicmVjZWl2ZVwiLCBgJHtwYXlsb2FkLnN0YXR1cyB8fCBcIlwifSAke3RvcGljfSAke2V2ZW50fSAke3JlZiAmJiBcIihcIiArIHJlZiArIFwiKVwiIHx8IFwiXCJ9YCwgcGF5bG9hZClcblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hhbm5lbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tpXVxuICAgICAgICBpZighY2hhbm5lbC5pc01lbWJlcih0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5fcmVmKSl7IGNvbnRpbnVlIH1cbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgbGV0IFssIGNhbGxiYWNrXSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZVtpXVxuICAgICAgICBjYWxsYmFjayhtc2cpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxlYXZlT3BlblRvcGljKHRvcGljKXtcbiAgICBsZXQgZHVwQ2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjID0+IGMudG9waWMgPT09IHRvcGljICYmIChjLmlzSm9pbmVkKCkgfHwgYy5pc0pvaW5pbmcoKSkpXG4gICAgaWYoZHVwQ2hhbm5lbCl7XG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgbGVhdmluZyBkdXBsaWNhdGUgdG9waWMgXCIke3RvcGljfVwiYClcbiAgICAgIGR1cENoYW5uZWwubGVhdmUoKVxuICAgIH1cbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBDT05TRUNVVElWRV9SRUxPQURTID0gXCJjb25zZWN1dGl2ZS1yZWxvYWRzXCJcbmV4cG9ydCBjb25zdCBNQVhfUkVMT0FEUyA9IDEwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NSU4gPSA1MDAwXG5leHBvcnQgY29uc3QgUkVMT0FEX0pJVFRFUl9NQVggPSAxMDAwMFxuZXhwb3J0IGNvbnN0IEZBSUxTQUZFX0pJVFRFUiA9IDMwMDAwXG5leHBvcnQgY29uc3QgUEhYX0VWRU5UX0NMQVNTRVMgPSBbXG4gIFwicGh4LWNsaWNrLWxvYWRpbmdcIiwgXCJwaHgtY2hhbmdlLWxvYWRpbmdcIiwgXCJwaHgtc3VibWl0LWxvYWRpbmdcIixcbiAgXCJwaHgta2V5ZG93bi1sb2FkaW5nXCIsIFwicGh4LWtleXVwLWxvYWRpbmdcIiwgXCJwaHgtYmx1ci1sb2FkaW5nXCIsIFwicGh4LWZvY3VzLWxvYWRpbmdcIixcbiAgXCJwaHgtaG9vay1sb2FkaW5nXCJcbl1cbmV4cG9ydCBjb25zdCBQSFhfQ09NUE9ORU5UID0gXCJkYXRhLXBoeC1jb21wb25lbnRcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0xJTksgPSBcImRhdGEtcGh4LWxpbmtcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19TVEFUSUMgPSBcInRyYWNrLXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX0xJTktfU1RBVEUgPSBcImRhdGEtcGh4LWxpbmstc3RhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUZfTE9BRElORyA9IFwiZGF0YS1waHgtcmVmLWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUZfU1JDID0gXCJkYXRhLXBoeC1yZWYtc3JjXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVGX0xPQ0sgPSBcImRhdGEtcGh4LXJlZi1sb2NrXCJcbmV4cG9ydCBjb25zdCBQSFhfUEVORElOR19SRUZTID0gXCJwaHgtcGVuZGluZy1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJBQ0tfVVBMT0FEUyA9IFwidHJhY2stdXBsb2Fkc1wiXG5leHBvcnQgY29uc3QgUEhYX1VQTE9BRF9SRUYgPSBcImRhdGEtcGh4LXVwbG9hZC1yZWZcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUkVGTElHSFRFRF9SRUZTID0gXCJkYXRhLXBoeC1wcmVmbGlnaHRlZC1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfRE9ORV9SRUZTID0gXCJkYXRhLXBoeC1kb25lLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9EUk9QX1RBUkdFVCA9IFwiZHJvcC10YXJnZXRcIlxuZXhwb3J0IGNvbnN0IFBIWF9BQ1RJVkVfRU5UUllfUkVGUyA9IFwiZGF0YS1waHgtYWN0aXZlLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCA9IFwicGh4OmxpdmUtZmlsZTp1cGRhdGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfU0tJUCA9IFwiZGF0YS1waHgtc2tpcFwiXG5leHBvcnQgY29uc3QgUEhYX01BR0lDX0lEID0gXCJkYXRhLXBoeC1pZFwiXG5leHBvcnQgY29uc3QgUEhYX1BSVU5FID0gXCJkYXRhLXBoeC1wcnVuZVwiXG5leHBvcnQgY29uc3QgUEhYX0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWNvbm5lY3RlZFwiXG5leHBvcnQgY29uc3QgUEhYX0xPQURJTkdfQ0xBU1MgPSBcInBoeC1sb2FkaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfRVJST1JfQ0xBU1MgPSBcInBoeC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX0NMSUVOVF9FUlJPUl9DTEFTUyA9IFwicGh4LWNsaWVudC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1NFUlZFUl9FUlJPUl9DTEFTUyA9IFwicGh4LXNlcnZlci1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1BBUkVOVF9JRCA9IFwiZGF0YS1waHgtcGFyZW50LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfTUFJTiA9IFwiZGF0YS1waHgtbWFpblwiXG5leHBvcnQgY29uc3QgUEhYX1JPT1RfSUQgPSBcImRhdGEtcGh4LXJvb3QtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXUE9SVF9UT1AgPSBcInZpZXdwb3J0LXRvcFwiXG5leHBvcnQgY29uc3QgUEhYX1ZJRVdQT1JUX0JPVFRPTSA9IFwidmlld3BvcnQtYm90dG9tXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJJR0dFUl9BQ1RJT04gPSBcInRyaWdnZXItYWN0aW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfSEFTX0ZPQ1VTRUQgPSBcInBoeC1oYXMtZm9jdXNlZFwiXG5leHBvcnQgY29uc3QgRk9DVVNBQkxFX0lOUFVUUyA9IFtcInRleHRcIiwgXCJ0ZXh0YXJlYVwiLCBcIm51bWJlclwiLCBcImVtYWlsXCIsIFwicGFzc3dvcmRcIiwgXCJzZWFyY2hcIiwgXCJ0ZWxcIiwgXCJ1cmxcIiwgXCJkYXRlXCIsIFwidGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwiY29sb3JcIiwgXCJyYW5nZVwiXVxuZXhwb3J0IGNvbnN0IENIRUNLQUJMRV9JTlBVVFMgPSBbXCJjaGVja2JveFwiLCBcInJhZGlvXCJdXG5leHBvcnQgY29uc3QgUEhYX0hBU19TVUJNSVRURUQgPSBcInBoeC1oYXMtc3VibWl0dGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfU0VTU0lPTiA9IFwiZGF0YS1waHgtc2Vzc2lvblwiXG5leHBvcnQgY29uc3QgUEhYX1ZJRVdfU0VMRUNUT1IgPSBgWyR7UEhYX1NFU1NJT059XWBcbmV4cG9ydCBjb25zdCBQSFhfU1RJQ0tZID0gXCJkYXRhLXBoeC1zdGlja3lcIlxuZXhwb3J0IGNvbnN0IFBIWF9TVEFUSUMgPSBcImRhdGEtcGh4LXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX1JFQURPTkxZID0gXCJkYXRhLXBoeC1yZWFkb25seVwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVEID0gXCJkYXRhLXBoeC1kaXNhYmxlZFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVfV0lUSCA9IFwiZGlzYWJsZS13aXRoXCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUgPSBcImRhdGEtcGh4LWRpc2FibGUtd2l0aC1yZXN0b3JlXCJcbmV4cG9ydCBjb25zdCBQSFhfSE9PSyA9IFwiaG9va1wiXG5leHBvcnQgY29uc3QgUEhYX0RFQk9VTkNFID0gXCJkZWJvdW5jZVwiXG5leHBvcnQgY29uc3QgUEhYX1RIUk9UVExFID0gXCJ0aHJvdHRsZVwiXG5leHBvcnQgY29uc3QgUEhYX1VQREFURSA9IFwidXBkYXRlXCJcbmV4cG9ydCBjb25zdCBQSFhfU1RSRUFNID0gXCJzdHJlYW1cIlxuZXhwb3J0IGNvbnN0IFBIWF9TVFJFQU1fUkVGID0gXCJkYXRhLXBoeC1zdHJlYW1cIlxuZXhwb3J0IGNvbnN0IFBIWF9LRVkgPSBcImtleVwiXG5leHBvcnQgY29uc3QgUEhYX1BSSVZBVEUgPSBcInBoeFByaXZhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9BVVRPX1JFQ09WRVIgPSBcImF1dG8tcmVjb3ZlclwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0RFQlVHID0gXCJwaHg6bGl2ZS1zb2NrZXQ6ZGVidWdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9QUk9GSUxFID0gXCJwaHg6bGl2ZS1zb2NrZXQ6cHJvZmlsaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfTEFURU5DWV9TSU0gPSBcInBoeDpsaXZlLXNvY2tldDpsYXRlbmN5LXNpbVwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0hJU1RPUllfUE9TSVRJT04gPSBcInBoeDpuYXYtaGlzdG9yeS1wb3NpdGlvblwiXG5leHBvcnQgY29uc3QgUEhYX1BST0dSRVNTID0gXCJwcm9ncmVzc1wiXG5leHBvcnQgY29uc3QgUEhYX01PVU5URUQgPSBcIm1vdW50ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUxPQURfU1RBVFVTID0gXCJfX3Bob2VuaXhfcmVsb2FkX3N0YXR1c19fXCJcbmV4cG9ydCBjb25zdCBMT0FERVJfVElNRU9VVCA9IDFcbmV4cG9ydCBjb25zdCBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUUyA9IDNcbmV4cG9ydCBjb25zdCBCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUID0gMjAwXG5leHBvcnQgY29uc3QgRElTQ09OTkVDVEVEX1RJTUVPVVQgPSA1MDBcbmV4cG9ydCBjb25zdCBCSU5ESU5HX1BSRUZJWCA9IFwicGh4LVwiXG5leHBvcnQgY29uc3QgUFVTSF9USU1FT1VUID0gMzAwMDBcbmV4cG9ydCBjb25zdCBMSU5LX0hFQURFUiA9IFwieC1yZXF1ZXN0ZWQtd2l0aFwiXG5leHBvcnQgY29uc3QgUkVTUE9OU0VfVVJMX0hFQURFUiA9IFwieC1yZXNwb25zZS11cmxcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1RSSUdHRVIgPSBcImRlYm91bmNlLXRyaWdnZXJcIlxuZXhwb3J0IGNvbnN0IFRIUk9UVExFRCA9IFwidGhyb3R0bGVkXCJcbmV4cG9ydCBjb25zdCBERUJPVU5DRV9QUkVWX0tFWSA9IFwiZGVib3VuY2UtcHJldi1rZXlcIlxuZXhwb3J0IGNvbnN0IERFRkFVTFRTID0ge1xuICBkZWJvdW5jZTogMzAwLFxuICB0aHJvdHRsZTogMzAwXG59XG5leHBvcnQgY29uc3QgUEhYX1BFTkRJTkdfQVRUUlMgPSBbUEhYX1JFRl9MT0FESU5HLCBQSFhfUkVGX1NSQywgUEhYX1JFRl9MT0NLXVxuLy8gUmVuZGVyZWRcbmV4cG9ydCBjb25zdCBEWU5BTUlDUyA9IFwiZFwiXG5leHBvcnQgY29uc3QgU1RBVElDID0gXCJzXCJcbmV4cG9ydCBjb25zdCBST09UID0gXCJyXCJcbmV4cG9ydCBjb25zdCBDT01QT05FTlRTID0gXCJjXCJcbmV4cG9ydCBjb25zdCBFVkVOVFMgPSBcImVcIlxuZXhwb3J0IGNvbnN0IFJFUExZID0gXCJyXCJcbmV4cG9ydCBjb25zdCBUSVRMRSA9IFwidFwiXG5leHBvcnQgY29uc3QgVEVNUExBVEVTID0gXCJwXCJcbmV4cG9ydCBjb25zdCBTVFJFQU0gPSBcInN0cmVhbVwiXG4iLCAiaW1wb3J0IHtcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRyeVVwbG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZW50cnksIGNvbmZpZywgbGl2ZVNvY2tldCl7XG4gICAgbGV0IHtjaHVua19zaXplLCBjaHVua190aW1lb3V0fSA9IGNvbmZpZ1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiAgICB0aGlzLmVudHJ5ID0gZW50cnlcbiAgICB0aGlzLm9mZnNldCA9IDBcbiAgICB0aGlzLmNodW5rU2l6ZSA9IGNodW5rX3NpemVcbiAgICB0aGlzLmNodW5rVGltZW91dCA9IGNodW5rX3RpbWVvdXRcbiAgICB0aGlzLmNodW5rVGltZXIgPSBudWxsXG4gICAgdGhpcy5lcnJvcmVkID0gZmFsc2VcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwgPSBsaXZlU29ja2V0LmNoYW5uZWwoYGx2dToke2VudHJ5LnJlZn1gLCB7dG9rZW46IGVudHJ5Lm1ldGFkYXRhKCl9KVxuICB9XG5cbiAgZXJyb3IocmVhc29uKXtcbiAgICBpZih0aGlzLmVycm9yZWQpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5sZWF2ZSgpXG4gICAgdGhpcy5lcnJvcmVkID0gdHJ1ZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmNodW5rVGltZXIpXG4gICAgdGhpcy5lbnRyeS5lcnJvcihyZWFzb24pXG4gIH1cblxuICB1cGxvYWQoKXtcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwub25FcnJvcihyZWFzb24gPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5qb2luKClcbiAgICAgIC5yZWNlaXZlKFwib2tcIiwgX2RhdGEgPT4gdGhpcy5yZWFkTmV4dENodW5rKCkpXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsIHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMub2Zmc2V0ID49IHRoaXMuZW50cnkuZmlsZS5zaXplIH1cblxuICByZWFkTmV4dENodW5rKCl7XG4gICAgbGV0IHJlYWRlciA9IG5ldyB3aW5kb3cuRmlsZVJlYWRlcigpXG4gICAgbGV0IGJsb2IgPSB0aGlzLmVudHJ5LmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIHRoaXMuY2h1bmtTaXplICsgdGhpcy5vZmZzZXQpXG4gICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICBpZihlLnRhcmdldC5lcnJvciA9PT0gbnVsbCl7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IGUudGFyZ2V0LnJlc3VsdC5ieXRlTGVuZ3RoXG4gICAgICAgIHRoaXMucHVzaENodW5rKGUudGFyZ2V0LnJlc3VsdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsb2dFcnJvcihcIlJlYWQgZXJyb3I6IFwiICsgZS50YXJnZXQuZXJyb3IpXG4gICAgICB9XG4gICAgfVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICB9XG5cbiAgcHVzaENodW5rKGNodW5rKXtcbiAgICBpZighdGhpcy51cGxvYWRDaGFubmVsLmlzSm9pbmVkKCkpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5wdXNoKFwiY2h1bmtcIiwgY2h1bmssIHRoaXMuY2h1bmtUaW1lb3V0KVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50cnkucHJvZ3Jlc3MoKHRoaXMub2Zmc2V0IC8gdGhpcy5lbnRyeS5maWxlLnNpemUpICogMTAwKVxuICAgICAgICBpZighdGhpcy5pc0RvbmUoKSl7XG4gICAgICAgICAgdGhpcy5jaHVua1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSwgdGhpcy5saXZlU29ja2V0LmdldExhdGVuY3lTaW0oKSB8fCAwKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCAoe3JlYXNvbn0pID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFBIWF9WSUVXX1NFTEVDVE9SXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBFbnRyeVVwbG9hZGVyIGZyb20gXCIuL2VudHJ5X3VwbG9hZGVyXCJcblxuZXhwb3J0IGxldCBsb2dFcnJvciA9IChtc2csIG9iaikgPT4gY29uc29sZS5lcnJvciAmJiBjb25zb2xlLmVycm9yKG1zZywgb2JqKVxuXG5leHBvcnQgbGV0IGlzQ2lkID0gKGNpZCkgPT4ge1xuICBsZXQgdHlwZSA9IHR5cGVvZihjaWQpXG4gIHJldHVybiB0eXBlID09PSBcIm51bWJlclwiIHx8ICh0eXBlID09PSBcInN0cmluZ1wiICYmIC9eKDB8WzEtOV1cXGQqKSQvLnRlc3QoY2lkKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdER1cGxpY2F0ZUlkcygpe1xuICBsZXQgaWRzID0gbmV3IFNldCgpXG4gIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2lkXVwiKVxuICBmb3IobGV0IGkgPSAwLCBsZW4gPSBlbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgaWYoaWRzLmhhcyhlbGVtc1tpXS5pZCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTXVsdGlwbGUgSURzIGRldGVjdGVkOiAke2VsZW1zW2ldLmlkfS4gRW5zdXJlIHVuaXF1ZSBlbGVtZW50IGlkcy5gKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZHMuYWRkKGVsZW1zW2ldLmlkKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0SW52YWxpZFN0cmVhbUluc2VydHMoaW5zZXJ0cyl7XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBTZXQoKVxuICBPYmplY3Qua2V5cyhpbnNlcnRzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgIGNvbnN0IHN0cmVhbUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICAgaWYoc3RyZWFtRWwgJiYgc3RyZWFtRWwucGFyZW50RWxlbWVudCAmJiBzdHJlYW1FbC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcInBoeC11cGRhdGVcIikgIT09IFwic3RyZWFtXCIpe1xuICAgICAgZXJyb3JzLmFkZChgVGhlIHN0cmVhbSBjb250YWluZXIgd2l0aCBpZCBcIiR7c3RyZWFtRWwucGFyZW50RWxlbWVudC5pZH1cIiBpcyBtaXNzaW5nIHRoZSBwaHgtdXBkYXRlPVwic3RyZWFtXCIgYXR0cmlidXRlLiBFbnN1cmUgaXQgaXMgc2V0IGZvciBzdHJlYW1zIHRvIHdvcmsgcHJvcGVybHkuYClcbiAgICB9XG4gIH0pXG4gIGVycm9ycy5mb3JFYWNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKVxufVxuXG5leHBvcnQgbGV0IGRlYnVnID0gKHZpZXcsIGtpbmQsIG1zZywgb2JqKSA9PiB7XG4gIGlmKHZpZXcubGl2ZVNvY2tldC5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICBjb25zb2xlLmxvZyhgJHt2aWV3LmlkfSAke2tpbmR9OiAke21zZ30gLSBgLCBvYmopXG4gIH1cbn1cblxuLy8gd3JhcHMgdmFsdWUgaW4gY2xvc3VyZSBvciByZXR1cm5zIGNsb3N1cmVcbmV4cG9ydCBsZXQgY2xvc3VyZSA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIiA/IHZhbCA6IGZ1bmN0aW9uICgpeyByZXR1cm4gdmFsIH1cblxuZXhwb3J0IGxldCBjbG9uZSA9IChvYmopID0+IHsgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSkgfVxuXG5leHBvcnQgbGV0IGNsb3Nlc3RQaHhCaW5kaW5nID0gKGVsLCBiaW5kaW5nLCBib3JkZXJFbCkgPT4ge1xuICBkbyB7XG4gICAgaWYoZWwubWF0Y2hlcyhgWyR7YmluZGluZ31dYCkgJiYgIWVsLmRpc2FibGVkKXsgcmV0dXJuIGVsIH1cbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZVxuICB9IHdoaWxlKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxICYmICEoKGJvcmRlckVsICYmIGJvcmRlckVsLmlzU2FtZU5vZGUoZWwpKSB8fCBlbC5tYXRjaGVzKFBIWF9WSUVXX1NFTEVDVE9SKSkpXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBsZXQgaXNPYmplY3QgPSAob2JqKSA9PiB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAhKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxufVxuXG5leHBvcnQgbGV0IGlzRXF1YWxPYmogPSAob2JqMSwgb2JqMikgPT4gSlNPTi5zdHJpbmdpZnkob2JqMSkgPT09IEpTT04uc3RyaW5naWZ5KG9iajIpXG5cbmV4cG9ydCBsZXQgaXNFbXB0eSA9IChvYmopID0+IHtcbiAgZm9yKGxldCB4IGluIG9iail7IHJldHVybiBmYWxzZSB9XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBsZXQgbWF5YmUgPSAoZWwsIGNhbGxiYWNrKSA9PiBlbCAmJiBjYWxsYmFjayhlbClcblxuZXhwb3J0IGxldCBjaGFubmVsVXBsb2FkZXIgPSBmdW5jdGlvbiAoZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldCl7XG4gIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgbGV0IGVudHJ5VXBsb2FkZXIgPSBuZXcgRW50cnlVcGxvYWRlcihlbnRyeSwgcmVzcC5jb25maWcsIGxpdmVTb2NrZXQpXG4gICAgZW50cnlVcGxvYWRlci51cGxvYWQoKVxuICB9KVxufVxuIiwgImxldCBCcm93c2VyID0ge1xuICBjYW5QdXNoU3RhdGUoKXsgcmV0dXJuICh0eXBlb2YgKGhpc3RvcnkucHVzaFN0YXRlKSAhPT0gXCJ1bmRlZmluZWRcIikgfSxcblxuICBkcm9wTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKVxuICB9LFxuXG4gIHVwZGF0ZUxvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXksIGluaXRpYWwsIGZ1bmMpe1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5nZXRMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBuZXdWYWwgPSBjdXJyZW50ID09PSBudWxsID8gaW5pdGlhbCA6IGZ1bmMoY3VycmVudClcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG5ld1ZhbCkpXG4gICAgcmV0dXJuIG5ld1ZhbFxuICB9LFxuXG4gIGdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpe1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKSlcbiAgfSxcblxuICB1cGRhdGVDdXJyZW50U3RhdGUoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjYWxsYmFjayhoaXN0b3J5LnN0YXRlIHx8IHt9KSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gIH0sXG5cbiAgcHVzaFN0YXRlKGtpbmQsIG1ldGEsIHRvKXtcbiAgICBpZih0aGlzLmNhblB1c2hTdGF0ZSgpKXtcbiAgICAgIGlmKHRvICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZil7XG4gICAgICAgIGlmKG1ldGEudHlwZSA9PSBcInJlZGlyZWN0XCIgJiYgbWV0YS5zY3JvbGwpe1xuICAgICAgICAgIC8vIElmIHdlJ3JlIHJlZGlyZWN0aW5nIHN0b3JlIHRoZSBjdXJyZW50IHNjcm9sbFkgZm9yIHRoZSBjdXJyZW50IGhpc3Rvcnkgc3RhdGUuXG4gICAgICAgICAgbGV0IGN1cnJlbnRTdGF0ZSA9IGhpc3Rvcnkuc3RhdGUgfHwge31cbiAgICAgICAgICBjdXJyZW50U3RhdGUuc2Nyb2xsID0gbWV0YS5zY3JvbGxcbiAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjdXJyZW50U3RhdGUsIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG1ldGEuc2Nyb2xsIC8vIE9ubHkgc3RvcmUgdGhlIHNjcm9sbCBpbiB0aGUgcmVkaXJlY3QgY2FzZS5cbiAgICAgICAgaGlzdG9yeVtraW5kICsgXCJTdGF0ZVwiXShtZXRhLCBcIlwiLCB0byB8fCBudWxsKSAvLyBJRSB3aWxsIGNvZXJjZSB1bmRlZmluZWQgdG8gc3RyaW5nXG5cbiAgICAgICAgLy8gd2hlbiB1c2luZyBuYXZpZ2F0ZSwgd2UnZCBjYWxsIHB1c2hTdGF0ZSBpbW1lZGlhdGVseSBiZWZvcmUgcGF0Y2hpbmcgdGhlIERPTSxcbiAgICAgICAgLy8ganVtcGluZyBiYWNrIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2UsIGVmZmVjdGl2ZWx5IGlnbm9yaW5nIHRoZSBzY3JvbGxJbnRvVmlldztcbiAgICAgICAgLy8gdGhlcmVmb3JlIHdlIHdhaXQgZm9yIHRoZSBuZXh0IGZyYW1lIChhZnRlciB0aGUgRE9NIHBhdGNoKSBhbmQgb25seSB0aGVuIHRyeVxuICAgICAgICAvLyB0byBzY3JvbGwgdG8gdGhlIGhhc2hFbFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBsZXQgaGFzaEVsID0gdGhpcy5nZXRIYXNoVGFyZ2V0RWwod2luZG93LmxvY2F0aW9uLmhhc2gpXG4gIFxuICAgICAgICAgIGlmKGhhc2hFbCl7XG4gICAgICAgICAgICBoYXNoRWwuc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICAgIH0gZWxzZSBpZihtZXRhLnR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsKDAsIDApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZGlyZWN0KHRvKVxuICAgIH1cbiAgfSxcblxuICBzZXRDb29raWUobmFtZSwgdmFsdWUsIG1heEFnZVNlY29uZHMpe1xuICAgIGxldCBleHBpcmVzID0gdHlwZW9mKG1heEFnZVNlY29uZHMpID09PSBcIm51bWJlclwiID8gYCBtYXgtYWdlPSR7bWF4QWdlU2Vjb25kc307YCA6IFwiXCJcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbHVlfTske2V4cGlyZXN9IHBhdGg9L2BcbiAgfSxcblxuICBnZXRDb29raWUobmFtZSl7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCg/Oig/Ol58Lio7XFxzKikke25hbWV9XFxzKlxcPVxccyooW147XSopLiokKXxeLiokYCksIFwiJDFcIilcbiAgfSxcblxuICBkZWxldGVDb29raWUobmFtZSl7XG4gICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09OyBtYXgtYWdlPS0xOyBwYXRoPS9gXG4gIH0sXG5cbiAgcmVkaXJlY3QodG9VUkwsIGZsYXNoKXtcbiAgICBpZihmbGFzaCl7IHRoaXMuc2V0Q29va2llKFwiX19waG9lbml4X2ZsYXNoX19cIiwgZmxhc2gsIDYwKSB9XG4gICAgd2luZG93LmxvY2F0aW9uID0gdG9VUkxcbiAgfSxcblxuICBsb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSl7IHJldHVybiBgJHtuYW1lc3BhY2V9LSR7c3Via2V5fWAgfSxcblxuICBnZXRIYXNoVGFyZ2V0RWwobWF5YmVIYXNoKXtcbiAgICBsZXQgaGFzaCA9IG1heWJlSGFzaC50b1N0cmluZygpLnN1YnN0cmluZygxKVxuICAgIGlmKGhhc2ggPT09IFwiXCIpeyByZXR1cm4gfVxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBhW25hbWU9XCIke2hhc2h9XCJdYClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyXG4iLCAiaW1wb3J0IHtcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgREVCT1VOQ0VfUFJFVl9LRVksXG4gIERFQk9VTkNFX1RSSUdHRVIsXG4gIEZPQ1VTQUJMRV9JTlBVVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9NQUlOLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJJVkFURSxcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9SRUZfTE9DSyxcbiAgUEhYX1BFTkRJTkdfQVRUUlMsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1VQTE9BRF9SRUYsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfU1RJQ0tZLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgVEhST1RUTEVELFxuICBQSFhfU1RSRUFNLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmxldCBET00gPSB7XG4gIGJ5SWQoaWQpeyByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIHx8IGxvZ0Vycm9yKGBubyBpZCBmb3VuZCBmb3IgJHtpZH1gKSB9LFxuXG4gIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpe1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxuICAgIGlmKGVsLmNsYXNzTGlzdC5sZW5ndGggPT09IDApeyBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKSB9XG4gIH0sXG5cbiAgYWxsKG5vZGUsIHF1ZXJ5LCBjYWxsYmFjayl7XG4gICAgaWYoIW5vZGUpeyByZXR1cm4gW10gfVxuICAgIGxldCBhcnJheSA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBhcnJheS5mb3JFYWNoKGNhbGxiYWNrKSA6IGFycmF5XG4gIH0sXG5cbiAgY2hpbGROb2RlTGVuZ3RoKGh0bWwpe1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZEVsZW1lbnRDb3VudFxuICB9LFxuXG4gIGlzVXBsb2FkSW5wdXQoZWwpeyByZXR1cm4gZWwudHlwZSA9PT0gXCJmaWxlXCIgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSAhPT0gbnVsbCB9LFxuXG4gIGlzQXV0b1VwbG9hZChpbnB1dEVsKXsgcmV0dXJuIGlucHV0RWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtYXV0by11cGxvYWRcIikgfSxcblxuICBmaW5kVXBsb2FkSW5wdXRzKG5vZGUpe1xuICAgIGNvbnN0IGZvcm1JZCA9IG5vZGUuaWRcbiAgICBjb25zdCBpbnB1dHNPdXRzaWRlRm9ybSA9IHRoaXMuYWxsKGRvY3VtZW50LCBgaW5wdXRbdHlwZT1cImZpbGVcIl1bJHtQSFhfVVBMT0FEX1JFRn1dW2Zvcm09XCIke2Zvcm1JZH1cIl1gKVxuICAgIHJldHVybiB0aGlzLmFsbChub2RlLCBgaW5wdXRbdHlwZT1cImZpbGVcIl1bJHtQSFhfVVBMT0FEX1JFRn1dYCkuY29uY2F0KGlucHV0c091dHNpZGVGb3JtKVxuICB9LFxuXG4gIGZpbmRDb21wb25lbnROb2RlTGlzdChub2RlLCBjaWQpe1xuICAgIHJldHVybiB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSlcbiAgfSxcblxuICBpc1BoeERlc3Ryb3llZChub2RlKXtcbiAgICByZXR1cm4gbm9kZS5pZCAmJiBET00ucHJpdmF0ZShub2RlLCBcImRlc3Ryb3llZFwiKSA/IHRydWUgOiBmYWxzZVxuICB9LFxuXG4gIHdhbnRzTmV3VGFiKGUpe1xuICAgIGxldCB3YW50c05ld1RhYiA9IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5IHx8IGUubWV0YUtleSB8fCAoZS5idXR0b24gJiYgZS5idXR0b24gPT09IDEpXG4gICAgbGV0IGlzRG93bmxvYWQgPSAoZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJkb3dubG9hZFwiKSlcbiAgICBsZXQgaXNUYXJnZXRCbGFuayA9IGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcInRhcmdldFwiKSAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJfYmxhbmtcIlxuICAgIGxldCBpc1RhcmdldE5hbWVkVGFiID0gZS50YXJnZXQuaGFzQXR0cmlidXRlKFwidGFyZ2V0XCIpICYmICFlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIikuc3RhcnRzV2l0aChcIl9cIilcbiAgICByZXR1cm4gd2FudHNOZXdUYWIgfHwgaXNUYXJnZXRCbGFuayB8fCBpc0Rvd25sb2FkIHx8IGlzVGFyZ2V0TmFtZWRUYWJcbiAgfSxcblxuICBpc1VubG9hZGFibGVGb3JtU3VibWl0KGUpe1xuICAgIC8vIElnbm9yZSBmb3JtIHN1Ym1pc3Npb25zIGludGVuZGVkIHRvIGNsb3NlIGEgbmF0aXZlIDxkaWFsb2c+IGVsZW1lbnRcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvZGlhbG9nI3VzYWdlX25vdGVzXG4gICAgbGV0IGlzRGlhbG9nU3VibWl0ID0gKGUudGFyZ2V0ICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcIm1ldGhvZFwiKSA9PT0gXCJkaWFsb2dcIikgfHxcbiAgICAgIChlLnN1Ym1pdHRlciAmJiBlLnN1Ym1pdHRlci5nZXRBdHRyaWJ1dGUoXCJmb3JtbWV0aG9kXCIpID09PSBcImRpYWxvZ1wiKVxuXG4gICAgaWYoaXNEaWFsb2dTdWJtaXQpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhZS5kZWZhdWx0UHJldmVudGVkICYmICF0aGlzLndhbnRzTmV3VGFiKGUpXG4gICAgfVxuICB9LFxuXG4gIGlzTmV3UGFnZUNsaWNrKGUsIGN1cnJlbnRMb2NhdGlvbil7XG4gICAgbGV0IGhyZWYgPSBlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ID8gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA6IG51bGxcbiAgICBsZXQgdXJsXG5cbiAgICBpZihlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgaHJlZiA9PT0gbnVsbCB8fCB0aGlzLndhbnRzTmV3VGFiKGUpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBpZihocmVmLnN0YXJ0c1dpdGgoXCJtYWlsdG86XCIpIHx8IGhyZWYuc3RhcnRzV2l0aChcInRlbDpcIikpeyByZXR1cm4gZmFsc2UgfVxuICAgIGlmKGUudGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgIHRyeSB7XG4gICAgICB1cmwgPSBuZXcgVVJMKGhyZWYpXG4gICAgfSBjYXRjaCB7XG4gICAgICB0cnkge1xuICAgICAgICB1cmwgPSBuZXcgVVJMKGhyZWYsIGN1cnJlbnRMb2NhdGlvbilcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBiYWQgVVJMLCBmYWxsYmFjayB0byBsZXQgYnJvd3NlciB0cnkgaXQgYXMgZXh0ZXJuYWxcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZih1cmwuaG9zdCA9PT0gY3VycmVudExvY2F0aW9uLmhvc3QgJiYgdXJsLnByb3RvY29sID09PSBjdXJyZW50TG9jYXRpb24ucHJvdG9jb2wpe1xuICAgICAgaWYodXJsLnBhdGhuYW1lID09PSBjdXJyZW50TG9jYXRpb24ucGF0aG5hbWUgJiYgdXJsLnNlYXJjaCA9PT0gY3VycmVudExvY2F0aW9uLnNlYXJjaCl7XG4gICAgICAgIHJldHVybiB1cmwuaGFzaCA9PT0gXCJcIiAmJiAhdXJsLmhyZWYuZW5kc1dpdGgoXCIjXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1cmwucHJvdG9jb2wuc3RhcnRzV2l0aChcImh0dHBcIilcbiAgfSxcblxuICBtYXJrUGh4Q2hpbGREZXN0cm95ZWQoZWwpe1xuICAgIGlmKHRoaXMuaXNQaHhDaGlsZChlbCkpeyBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04sIFwiXCIpIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFwiZGVzdHJveWVkXCIsIHRydWUpXG4gIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuSW5GcmFnbWVudChodG1sLCBwYXJlbnRJZCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0aGlzLmZpbmRQaHhDaGlsZHJlbih0ZW1wbGF0ZS5jb250ZW50LCBwYXJlbnRJZClcbiAgfSxcblxuICBpc0lnbm9yZWQoZWwsIHBoeFVwZGF0ZSl7XG4gICAgcmV0dXJuIChlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSB8fCBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC11cGRhdGVcIikpID09PSBcImlnbm9yZVwiXG4gIH0sXG5cbiAgaXNQaHhVcGRhdGUoZWwsIHBoeFVwZGF0ZSwgdXBkYXRlVHlwZXMpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgdXBkYXRlVHlwZXMuaW5kZXhPZihlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkgPj0gMFxuICB9LFxuXG4gIGZpbmRQaHhTdGlja3koZWwpeyByZXR1cm4gdGhpcy5hbGwoZWwsIGBbJHtQSFhfU1RJQ0tZfV1gKSB9LFxuXG4gIGZpbmRQaHhDaGlsZHJlbihlbCwgcGFyZW50SWQpe1xuICAgIHJldHVybiB0aGlzLmFsbChlbCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9WyR7UEhYX1BBUkVOVF9JRH09XCIke3BhcmVudElkfVwiXWApXG4gIH0sXG5cbiAgZmluZEV4aXN0aW5nUGFyZW50Q0lEcyhub2RlLCBjaWRzKXtcbiAgICAvLyB3ZSBvbmx5IHdhbnQgdG8gZmluZCBwYXJlbnRzIHRoYXQgZXhpc3Qgb24gdGhlIHBhZ2VcbiAgICAvLyBpZiBhIGNpZCBpcyBub3Qgb24gdGhlIHBhZ2UsIHRoZSBvbmx5IHdheSBpdCBjYW4gYmUgYWRkZWQgYmFjayB0byB0aGUgcGFnZVxuICAgIC8vIGlzIGlmIGEgcGFyZW50IGFkZHMgaXQgYmFjaywgdGhlcmVmb3JlIGlmIGEgY2lkIGRvZXMgbm90IGV4aXN0IG9uIHRoZSBwYWdlLFxuICAgIC8vIHdlIHNob3VsZCBub3QgdHJ5IHRvIHJlbmRlciBpdCBieSBpdHNlbGYgKGJlY2F1c2UgaXQgd291bGQgYmUgcmVuZGVyZWQgdHdpY2UsXG4gICAgLy8gb25lIGJ5IHRoZSBwYXJlbnQsIGFuZCBhIHNlY29uZCB0aW1lIGJ5IGl0c2VsZilcbiAgICBsZXQgcGFyZW50Q2lkcyA9IG5ldyBTZXQoKVxuICAgIGxldCBjaGlsZHJlbkNpZHMgPSBuZXcgU2V0KClcblxuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4ge1xuICAgICAgdGhpcy5maWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcodGhpcy5hbGwobm9kZSwgYFske1BIWF9DT01QT05FTlR9PVwiJHtjaWR9XCJdYCksIG5vZGUpLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgICAgcGFyZW50Q2lkcy5hZGQoY2lkKVxuICAgICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKSwgcGFyZW50KVxuICAgICAgICAgIC5tYXAoZWwgPT4gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKSlcbiAgICAgICAgICAuZm9yRWFjaChjaGlsZENJRCA9PiBjaGlsZHJlbkNpZHMuYWRkKGNoaWxkQ0lEKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGNoaWxkcmVuQ2lkcy5mb3JFYWNoKGNoaWxkQ2lkID0+IHBhcmVudENpZHMuZGVsZXRlKGNoaWxkQ2lkKSlcblxuICAgIHJldHVybiBwYXJlbnRDaWRzXG4gIH0sXG5cbiAgZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KG5vZGVzLCBwYXJlbnQpe1xuICAgIGlmKHBhcmVudC5xdWVyeVNlbGVjdG9yKFBIWF9WSUVXX1NFTEVDVE9SKSl7XG4gICAgICByZXR1cm4gbm9kZXMuZmlsdGVyKGVsID0+IHRoaXMud2l0aGluU2FtZUxpdmVWaWV3KGVsLCBwYXJlbnQpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZXNcbiAgICB9XG4gIH0sXG5cbiAgd2l0aGluU2FtZUxpdmVWaWV3KG5vZGUsIHBhcmVudCl7XG4gICAgd2hpbGUobm9kZSA9IG5vZGUucGFyZW50Tm9kZSl7XG4gICAgICBpZihub2RlLmlzU2FtZU5vZGUocGFyZW50KSl7IHJldHVybiB0cnVlIH1cbiAgICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKSAhPT0gbnVsbCl7IHJldHVybiBmYWxzZSB9XG4gICAgfVxuICB9LFxuXG4gIHByaXZhdGUoZWwsIGtleSl7IHJldHVybiBlbFtQSFhfUFJJVkFURV0gJiYgZWxbUEhYX1BSSVZBVEVdW2tleV0gfSxcblxuICBkZWxldGVQcml2YXRlKGVsLCBrZXkpeyBlbFtQSFhfUFJJVkFURV0gJiYgZGVsZXRlIChlbFtQSFhfUFJJVkFURV1ba2V5XSkgfSxcblxuICBwdXRQcml2YXRlKGVsLCBrZXksIHZhbHVlKXtcbiAgICBpZighZWxbUEhYX1BSSVZBVEVdKXsgZWxbUEhYX1BSSVZBVEVdID0ge30gfVxuICAgIGVsW1BIWF9QUklWQVRFXVtrZXldID0gdmFsdWVcbiAgfSxcblxuICB1cGRhdGVQcml2YXRlKGVsLCBrZXksIGRlZmF1bHRWYWwsIHVwZGF0ZUZ1bmMpe1xuICAgIGxldCBleGlzdGluZyA9IHRoaXMucHJpdmF0ZShlbCwga2V5KVxuICAgIGlmKGV4aXN0aW5nID09PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHVwZGF0ZUZ1bmMoZGVmYXVsdFZhbCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGV4aXN0aW5nKSlcbiAgICB9XG4gIH0sXG5cbiAgc3luY1BlbmRpbmdBdHRycyhmcm9tRWwsIHRvRWwpe1xuICAgIGlmKCFmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfU1JDKSl7IHJldHVybiB9XG4gICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgZnJvbUVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpICYmIHRvRWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG4gICAgfSlcbiAgICBQSFhfUEVORElOR19BVFRSUy5maWx0ZXIoYXR0ciA9PiBmcm9tRWwuaGFzQXR0cmlidXRlKGF0dHIpKS5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoYXR0ciwgZnJvbUVsLmdldEF0dHJpYnV0ZShhdHRyKSlcbiAgICB9KVxuICB9LFxuXG4gIGNvcHlQcml2YXRlcyh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1BIWF9QUklWQVRFXSl7XG4gICAgICB0YXJnZXRbUEhYX1BSSVZBVEVdID0gc291cmNlW1BIWF9QUklWQVRFXVxuICAgIH1cbiAgfSxcblxuICBwdXRUaXRsZShzdHIpe1xuICAgIGxldCB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRpdGxlXCIpXG4gICAgaWYodGl0bGVFbCl7XG4gICAgICBsZXQge3ByZWZpeCwgc3VmZml4LCBkZWZhdWx0OiBkZWZhdWx0VGl0bGV9ID0gdGl0bGVFbC5kYXRhc2V0XG4gICAgICBsZXQgaXNFbXB0eSA9IHR5cGVvZihzdHIpICE9PSBcInN0cmluZ1wiIHx8IHN0ci50cmltKCkgPT09IFwiXCJcbiAgICAgIGlmKGlzRW1wdHkgJiYgdHlwZW9mKGRlZmF1bHRUaXRsZSkgIT09IFwic3RyaW5nXCIpeyByZXR1cm4gfVxuXG4gICAgICBsZXQgaW5uZXIgPSBpc0VtcHR5ID8gZGVmYXVsdFRpdGxlIDogc3RyXG4gICAgICBkb2N1bWVudC50aXRsZSA9IGAke3ByZWZpeCB8fCBcIlwifSR7aW5uZXIgfHwgXCJcIn0ke3N1ZmZpeCB8fCBcIlwifWBcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQudGl0bGUgPSBzdHJcbiAgICB9XG4gIH0sXG5cbiAgZGVib3VuY2UoZWwsIGV2ZW50LCBwaHhEZWJvdW5jZSwgZGVmYXVsdERlYm91bmNlLCBwaHhUaHJvdHRsZSwgZGVmYXVsdFRocm90dGxlLCBhc3luY0ZpbHRlciwgY2FsbGJhY2spe1xuICAgIGxldCBkZWJvdW5jZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhEZWJvdW5jZSlcbiAgICBsZXQgdGhyb3R0bGUgPSBlbC5nZXRBdHRyaWJ1dGUocGh4VGhyb3R0bGUpXG5cbiAgICBpZihkZWJvdW5jZSA9PT0gXCJcIil7IGRlYm91bmNlID0gZGVmYXVsdERlYm91bmNlIH1cbiAgICBpZih0aHJvdHRsZSA9PT0gXCJcIil7IHRocm90dGxlID0gZGVmYXVsdFRocm90dGxlIH1cbiAgICBsZXQgdmFsdWUgPSBkZWJvdW5jZSB8fCB0aHJvdHRsZVxuICAgIHN3aXRjaCh2YWx1ZSl7XG4gICAgICBjYXNlIG51bGw6IHJldHVybiBjYWxsYmFjaygpXG5cbiAgICAgIGNhc2UgXCJibHVyXCI6XG4gICAgICAgIHRoaXMuaW5jQ3ljbGUoZWwsIFwiZGVib3VuY2UtYmx1ci1jeWNsZVwiLCAoKSA9PiB7XG4gICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IGNhbGxiYWNrKCkgfVxuICAgICAgICB9KVxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiZGVib3VuY2UtYmx1clwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIFwiZGVib3VuY2UtYmx1ci1jeWNsZVwiKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGV0IHRpbWVvdXQgPSBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgbGV0IHRyaWdnZXIgPSAoKSA9PiB0aHJvdHRsZSA/IHRoaXMuZGVsZXRlUHJpdmF0ZShlbCwgVEhST1RUTEVEKSA6IGNhbGxiYWNrKClcbiAgICAgICAgbGV0IGN1cnJlbnRDeWNsZSA9IHRoaXMuaW5jQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIsIHRyaWdnZXIpXG4gICAgICAgIGlmKGlzTmFOKHRpbWVvdXQpKXsgcmV0dXJuIGxvZ0Vycm9yKGBpbnZhbGlkIHRocm90dGxlL2RlYm91bmNlIHZhbHVlOiAke3ZhbHVlfWApIH1cbiAgICAgICAgaWYodGhyb3R0bGUpe1xuICAgICAgICAgIGxldCBuZXdLZXlEb3duID0gZmFsc2VcbiAgICAgICAgICBpZihldmVudC50eXBlID09PSBcImtleWRvd25cIil7XG4gICAgICAgICAgICBsZXQgcHJldktleSA9IHRoaXMucHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVkpXG4gICAgICAgICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIERFQk9VTkNFX1BSRVZfS0VZLCBldmVudC5rZXkpXG4gICAgICAgICAgICBuZXdLZXlEb3duID0gcHJldktleSAhPT0gZXZlbnQua2V5XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoIW5ld0tleURvd24gJiYgdGhpcy5wcml2YXRlKGVsLCBUSFJPVFRMRUQpKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUikgfVxuICAgICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgVEhST1RUTEVELCB0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgY3VycmVudEN5Y2xlKSB9XG4gICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtID0gZWwuZm9ybVxuICAgICAgICBpZihmb3JtICYmIHRoaXMub25jZShmb3JtLCBcImJpbmQtZGVib3VuY2VcIikpe1xuICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKChuZXcgRm9ybURhdGEoZm9ybSkpLmVudHJpZXMoKSwgKFtuYW1lXSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtuYW1lfVwiXWApXG4gICAgICAgICAgICAgIHRoaXMuaW5jQ3ljbGUoaW5wdXQsIERFQk9VTkNFX1RSSUdHRVIpXG4gICAgICAgICAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgVEhST1RUTEVEKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub25jZShlbCwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBiZWNhdXNlIHdlIHRyaWdnZXIgdGhlIGNhbGxiYWNrIGhlcmUsXG4gICAgICAgICAgICAvLyB3ZSBhbHNvIGNsZWFyIHRoZSB0aHJvdHRsZSB0aW1lb3V0IHRvIHByZXZlbnQgdGhlIGNhbGxiYWNrXG4gICAgICAgICAgICAvLyBmcm9tIGJlaW5nIGNhbGxlZCBhZ2FpbiBhZnRlciB0aGUgdGltZW91dCBmaXJlc1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucHJpdmF0ZShlbCwgVEhST1RUTEVEKSlcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdHJpZ2dlckN5Y2xlKGVsLCBrZXksIGN1cnJlbnRDeWNsZSl7XG4gICAgbGV0IFtjeWNsZSwgdHJpZ2dlcl0gPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZighY3VycmVudEN5Y2xlKXsgY3VycmVudEN5Y2xlID0gY3ljbGUgfVxuICAgIGlmKGN1cnJlbnRDeWNsZSA9PT0gY3ljbGUpe1xuICAgICAgdGhpcy5pbmNDeWNsZShlbCwga2V5KVxuICAgICAgdHJpZ2dlcigpXG4gICAgfVxuICB9LFxuXG4gIG9uY2UoZWwsIGtleSl7XG4gICAgaWYodGhpcy5wcml2YXRlKGVsLCBrZXkpID09PSB0cnVlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdHJ1ZSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGluY0N5Y2xlKGVsLCBrZXksIHRyaWdnZXIgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgbGV0IFtjdXJyZW50Q3ljbGVdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpIHx8IFswLCB0cmlnZ2VyXVxuICAgIGN1cnJlbnRDeWNsZSsrXG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIFtjdXJyZW50Q3ljbGUsIHRyaWdnZXJdKVxuICAgIHJldHVybiBjdXJyZW50Q3ljbGVcbiAgfSxcblxuICAvLyBtYWludGFpbnMgb3IgYWRkcyBwcml2YXRlbHkgdXNlZCBob29rIGluZm9ybWF0aW9uXG4gIC8vIGZyb21FbCBhbmQgdG9FbCBjYW4gYmUgdGhlIHNhbWUgZWxlbWVudCBpbiB0aGUgY2FzZSBvZiBhIG5ld2x5IGFkZGVkIG5vZGVcbiAgLy8gZnJvbUVsIGFuZCB0b0VsIGNhbiBiZSBhbnkgSFRNTCBub2RlIHR5cGUsIHNvIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBhbiBlbGVtZW50IG5vZGVcbiAgbWFpbnRhaW5Qcml2YXRlSG9va3MoZnJvbUVsLCB0b0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pe1xuICAgIC8vIG1haW50YWluIHRoZSBob29rcyBjcmVhdGVkIHdpdGggY3JlYXRlSG9va1xuICAgIGlmKGZyb21FbC5oYXNBdHRyaWJ1dGUgJiYgZnJvbUVsLmhhc0F0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIikgJiYgIXRvRWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiKSl7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgZnJvbUVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIikpXG4gICAgfVxuICAgIC8vIGFkZCBob29rcyB0byBlbGVtZW50cyB3aXRoIHZpZXdwb3J0IGF0dHJpYnV0ZXNcbiAgICBpZih0b0VsLmhhc0F0dHJpYnV0ZSAmJiAodG9FbC5oYXNBdHRyaWJ1dGUocGh4Vmlld3BvcnRUb3ApIHx8IHRvRWwuaGFzQXR0cmlidXRlKHBoeFZpZXdwb3J0Qm90dG9tKSkpe1xuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1ob29rXCIsIFwiUGhvZW5peC5JbmZpbml0ZVNjcm9sbFwiKVxuICAgIH1cbiAgfSxcblxuICBwdXRDdXN0b21FbEhvb2soZWwsIGhvb2spe1xuICAgIGlmKGVsLmlzQ29ubmVjdGVkKXtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgXCJcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihgXG4gICAgICAgIGhvb2sgYXR0YWNoZWQgdG8gbm9uLWNvbm5lY3RlZCBET00gZWxlbWVudFxuICAgICAgICBlbnN1cmUgeW91IGFyZSBjYWxsaW5nIGNyZWF0ZUhvb2sgd2l0aGluIHlvdXIgY29ubmVjdGVkQ2FsbGJhY2suICR7ZWwub3V0ZXJIVE1MfVxuICAgICAgYClcbiAgICB9XG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBcImN1c3RvbS1lbC1ob29rXCIsIGhvb2spXG4gIH0sXG5cbiAgZ2V0Q3VzdG9tRWxIb29rKGVsKXsgcmV0dXJuIHRoaXMucHJpdmF0ZShlbCwgXCJjdXN0b20tZWwtaG9va1wiKSB9LFxuXG4gIGlzVXNlZElucHV0KGVsKXtcbiAgICByZXR1cm4gKGVsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgKHRoaXMucHJpdmF0ZShlbCwgUEhYX0hBU19GT0NVU0VEKSB8fCB0aGlzLnByaXZhdGUoZWwsIFBIWF9IQVNfU1VCTUlUVEVEKSkpXG4gIH0sXG5cbiAgcmVzZXRGb3JtKGZvcm0pe1xuICAgIEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICB0aGlzLmRlbGV0ZVByaXZhdGUoaW5wdXQsIFBIWF9IQVNfRk9DVVNFRClcbiAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpXG4gICAgfSlcbiAgfSxcblxuICBpc1BoeENoaWxkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKVxuICB9LFxuXG4gIGlzUGh4U3RpY2t5KG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfU1RJQ0tZKSAhPT0gbnVsbFxuICB9LFxuXG4gIGlzQ2hpbGRPZkFueShlbCwgcGFyZW50cyl7XG4gICAgcmV0dXJuICEhcGFyZW50cy5maW5kKHBhcmVudCA9PiBwYXJlbnQuY29udGFpbnMoZWwpKVxuICB9LFxuXG4gIGZpcnN0UGh4Q2hpbGQoZWwpe1xuICAgIHJldHVybiB0aGlzLmlzUGh4Q2hpbGQoZWwpID8gZWwgOiB0aGlzLmFsbChlbCwgYFske1BIWF9QQVJFTlRfSUR9XWApWzBdXG4gIH0sXG5cbiAgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIG5hbWUsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGRlZmF1bHRCdWJibGUgPSB0cnVlXG4gICAgbGV0IGlzVXBsb2FkVGFyZ2V0ID0gdGFyZ2V0Lm5vZGVOYW1lID09PSBcIklOUFVUXCIgJiYgdGFyZ2V0LnR5cGUgPT09IFwiZmlsZVwiXG4gICAgaWYoaXNVcGxvYWRUYXJnZXQgJiYgbmFtZSA9PT0gXCJjbGlja1wiKXtcbiAgICAgIGRlZmF1bHRCdWJibGUgPSBmYWxzZVxuICAgIH1cbiAgICBsZXQgYnViYmxlcyA9IG9wdHMuYnViYmxlcyA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdEJ1YmJsZSA6ICEhb3B0cy5idWJibGVzXG4gICAgbGV0IGV2ZW50T3B0cyA9IHtidWJibGVzOiBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlLCBkZXRhaWw6IG9wdHMuZGV0YWlsIHx8IHt9fVxuICAgIGxldCBldmVudCA9IG5hbWUgPT09IFwiY2xpY2tcIiA/IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwgZXZlbnRPcHRzKSA6IG5ldyBDdXN0b21FdmVudChuYW1lLCBldmVudE9wdHMpXG4gICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gIH0sXG5cbiAgY2xvbmVOb2RlKG5vZGUsIGh0bWwpe1xuICAgIGlmKHR5cGVvZiAoaHRtbCkgPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgcmV0dXJuIG5vZGUuY2xvbmVOb2RlKHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjbG9uZWQgPSBub2RlLmNsb25lTm9kZShmYWxzZSlcbiAgICAgIGNsb25lZC5pbm5lckhUTUwgPSBodG1sXG4gICAgICByZXR1cm4gY2xvbmVkXG4gICAgfVxuICB9LFxuXG4gIC8vIG1lcmdlIGF0dHJpYnV0ZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0XG4gIC8vIGlmIGFuIGVsZW1lbnQgaXMgaWdub3JlZCwgd2Ugb25seSBtZXJnZSBkYXRhIGF0dHJpYnV0ZXNcbiAgLy8gaW5jbHVkaW5nIHJlbW92aW5nIGRhdGEgYXR0cmlidXRlcyB0aGF0IGFyZSBubyBsb25nZXIgaW4gdGhlIHNvdXJjZVxuICBtZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCBvcHRzID0ge30pe1xuICAgIGxldCBleGNsdWRlID0gbmV3IFNldChvcHRzLmV4Y2x1ZGUgfHwgW10pXG4gICAgbGV0IGlzSWdub3JlZCA9IG9wdHMuaXNJZ25vcmVkXG4gICAgbGV0IHNvdXJjZUF0dHJzID0gc291cmNlLmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSBzb3VyY2VBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHNvdXJjZUF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKCFleGNsdWRlLmhhcyhuYW1lKSl7XG4gICAgICAgIGNvbnN0IHNvdXJjZVZhbHVlID0gc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKVxuICAgICAgICBpZih0YXJnZXQuZ2V0QXR0cmlidXRlKG5hbWUpICE9PSBzb3VyY2VWYWx1ZSAmJiAoIWlzSWdub3JlZCB8fCAoaXNJZ25vcmVkICYmIG5hbWUuc3RhcnRzV2l0aChcImRhdGEtXCIpKSkpe1xuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUobmFtZSwgc291cmNlVmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGV4Y2x1ZGUgdGhlIHZhbHVlIGZyb20gYmVpbmcgbWVyZ2VkIG9uIGZvY3VzZWQgaW5wdXRzLCBiZWNhdXNlIHRoZVxuICAgICAgICAvLyB1c2VyJ3MgaW5wdXQgc2hvdWxkIGFsd2F5cyB3aW4uXG4gICAgICAgIC8vIFdlIGNhbiBzdGlsbCBhc3NpZ24gaXQgYXMgbG9uZyBhcyB0aGUgdmFsdWUgcHJvcGVydHkgaXMgdGhlIHNhbWUsIHRob3VnaC5cbiAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBhIHNpdHVhdGlvbiB3aGVyZSB0aGUgdXBkYXRlZCBob29rIGlzIG5vdCBiZWluZyB0cmlnZ2VyZWRcbiAgICAgICAgLy8gd2hlbiBhbiBpbnB1dCBpcyBiYWNrIGluIGl0cyBcIm9yaWdpbmFsIHN0YXRlXCIsIGJlY2F1c2UgdGhlIGF0dHJpYnV0ZVxuICAgICAgICAvLyB3YXMgbmV2ZXIgY2hhbmdlZCwgc2VlOlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMjE2M1xuICAgICAgICBpZihuYW1lID09PSBcInZhbHVlXCIgJiYgdGFyZ2V0LnZhbHVlID09PSBzb3VyY2UudmFsdWUpe1xuICAgICAgICAgIC8vIGFjdHVhbGx5IHNldCB0aGUgdmFsdWUgYXR0cmlidXRlIHRvIHN5bmMgaXQgd2l0aCB0aGUgdmFsdWUgcHJvcGVydHlcbiAgICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgc291cmNlLmdldEF0dHJpYnV0ZShuYW1lKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0YXJnZXRBdHRycyA9IHRhcmdldC5hdHRyaWJ1dGVzXG4gICAgZm9yKGxldCBpID0gdGFyZ2V0QXR0cnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuICAgICAgbGV0IG5hbWUgPSB0YXJnZXRBdHRyc1tpXS5uYW1lXG4gICAgICBpZihpc0lnbm9yZWQpe1xuICAgICAgICBpZihuYW1lLnN0YXJ0c1dpdGgoXCJkYXRhLVwiKSAmJiAhc291cmNlLmhhc0F0dHJpYnV0ZShuYW1lKSAmJiAhUEhYX1BFTkRJTkdfQVRUUlMuaW5jbHVkZXMobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpKXsgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShuYW1lKSB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1lcmdlRm9jdXNlZElucHV0KHRhcmdldCwgc291cmNlKXtcbiAgICAvLyBza2lwIHNlbGVjdHMgYmVjYXVzZSBGRiB3aWxsIHJlc2V0IGhpZ2hsaWdodGVkIGluZGV4IGZvciBhbnkgc2V0QXR0cmlidXRlXG4gICAgaWYoISh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkpeyBET00ubWVyZ2VBdHRycyh0YXJnZXQsIHNvdXJjZSwge2V4Y2x1ZGU6IFtcInZhbHVlXCJdfSkgfVxuXG4gICAgaWYoc291cmNlLnJlYWRPbmx5KXtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIilcbiAgICB9XG4gIH0sXG5cbiAgaGFzU2VsZWN0aW9uUmFuZ2UoZWwpe1xuICAgIHJldHVybiBlbC5zZXRTZWxlY3Rpb25SYW5nZSAmJiAoZWwudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZWwudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKVxuICB9LFxuXG4gIHJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKXtcbiAgICBpZihmb2N1c2VkIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpeyBmb2N1c2VkLmZvY3VzKCkgfVxuICAgIGlmKCFET00uaXNUZXh0dWFsSW5wdXQoZm9jdXNlZCkpeyByZXR1cm4gfVxuXG4gICAgbGV0IHdhc0ZvY3VzZWQgPSBmb2N1c2VkLm1hdGNoZXMoXCI6Zm9jdXNcIilcbiAgICBpZighd2FzRm9jdXNlZCl7IGZvY3VzZWQuZm9jdXMoKSB9XG4gICAgaWYodGhpcy5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSl7XG4gICAgICBmb2N1c2VkLnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpXG4gICAgfVxuICB9LFxuXG4gIGlzRm9ybUlucHV0KGVsKXsgcmV0dXJuIC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KGVsLnRhZ05hbWUpICYmIGVsLnR5cGUgIT09IFwiYnV0dG9uXCIgfSxcblxuICBzeW5jQXR0cnNUb1Byb3BzKGVsKXtcbiAgICBpZihlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgQ0hFQ0tBQkxFX0lOUFVUUy5pbmRleE9mKGVsLnR5cGUudG9Mb2NhbGVMb3dlckNhc2UoKSkgPj0gMCl7XG4gICAgICBlbC5jaGVja2VkID0gZWwuZ2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiKSAhPT0gbnVsbFxuICAgIH1cbiAgfSxcblxuICBpc1RleHR1YWxJbnB1dChlbCl7IHJldHVybiBGT0NVU0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZSkgPj0gMCB9LFxuXG4gIGlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKXtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShwaHhUcmlnZ2VyRXh0ZXJuYWwpICE9PSBudWxsICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpXG4gIH0sXG5cbiAgY2xlYW5DaGlsZE5vZGVzKGNvbnRhaW5lciwgcGh4VXBkYXRlKXtcbiAgICBpZihET00uaXNQaHhVcGRhdGUoY29udGFpbmVyLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIiwgUEhYX1NUUkVBTV0pKXtcbiAgICAgIGxldCB0b1JlbW92ZSA9IFtdXG4gICAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgIGlmKCFjaGlsZE5vZGUuaWQpe1xuICAgICAgICAgIC8vIFNraXAgd2FybmluZyBpZiBpdCdzIGFuIGVtcHR5IHRleHQgbm9kZSAoZS5nLiBhIG5ldy1saW5lKVxuICAgICAgICAgIGxldCBpc0VtcHR5VGV4dE5vZGUgPSBjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIGNoaWxkTm9kZS5ub2RlVmFsdWUudHJpbSgpID09PSBcIlwiXG4gICAgICAgICAgaWYoIWlzRW1wdHlUZXh0Tm9kZSAmJiBjaGlsZE5vZGUubm9kZVR5cGUgIT09IE5vZGUuQ09NTUVOVF9OT0RFKXtcbiAgICAgICAgICAgIGxvZ0Vycm9yKFwib25seSBIVE1MIGVsZW1lbnQgdGFncyB3aXRoIGFuIGlkIGFyZSBhbGxvd2VkIGluc2lkZSBjb250YWluZXJzIHdpdGggcGh4LXVwZGF0ZS5cXG5cXG5cIiArXG4gICAgICAgICAgICAgIGByZW1vdmluZyBpbGxlZ2FsIG5vZGU6IFwiJHsoY2hpbGROb2RlLm91dGVySFRNTCB8fCBjaGlsZE5vZGUubm9kZVZhbHVlKS50cmltKCl9XCJcXG5cXG5gKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0b1JlbW92ZS5wdXNoKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRvUmVtb3ZlLmZvckVhY2goY2hpbGROb2RlID0+IGNoaWxkTm9kZS5yZW1vdmUoKSlcbiAgICB9XG4gIH0sXG5cbiAgcmVwbGFjZVJvb3RDb250YWluZXIoY29udGFpbmVyLCB0YWdOYW1lLCBhdHRycyl7XG4gICAgbGV0IHJldGFpbmVkQXR0cnMgPSBuZXcgU2V0KFtcImlkXCIsIFBIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfTUFJTiwgUEhYX1JPT1RfSURdKVxuICAgIGlmKGNvbnRhaW5lci50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRhZ05hbWUudG9Mb3dlckNhc2UoKSl7XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5hdHRyaWJ1dGVzKVxuICAgICAgICAuZmlsdGVyKGF0dHIgPT4gIXJldGFpbmVkQXR0cnMuaGFzKGF0dHIubmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSkpXG5cbiAgICAgIE9iamVjdC5rZXlzKGF0dHJzKVxuICAgICAgICAuZmlsdGVyKG5hbWUgPT4gIXJldGFpbmVkQXR0cnMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgIC5mb3JFYWNoKGF0dHIgPT4gY29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpXG5cbiAgICAgIHJldHVybiBjb250YWluZXJcblxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKVxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goYXR0ciA9PiBuZXdDb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcbiAgICAgIHJldGFpbmVkQXR0cnMuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgY29udGFpbmVyLmdldEF0dHJpYnV0ZShhdHRyKSkpXG4gICAgICBuZXdDb250YWluZXIuaW5uZXJIVE1MID0gY29udGFpbmVyLmlubmVySFRNTFxuICAgICAgY29udGFpbmVyLnJlcGxhY2VXaXRoKG5ld0NvbnRhaW5lcilcbiAgICAgIHJldHVybiBuZXdDb250YWluZXJcbiAgICB9XG4gIH0sXG5cbiAgZ2V0U3RpY2t5KGVsLCBuYW1lLCBkZWZhdWx0VmFsKXtcbiAgICBsZXQgb3AgPSAoRE9NLnByaXZhdGUoZWwsIFwic3RpY2t5XCIpIHx8IFtdKS5maW5kKChbZXhpc3RpbmdOYW1lLF0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSlcbiAgICBpZihvcCl7XG4gICAgICBsZXQgW19uYW1lLCBfb3AsIHN0YXNoZWRSZXN1bHRdID0gb3BcbiAgICAgIHJldHVybiBzdGFzaGVkUmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0eXBlb2YoZGVmYXVsdFZhbCkgPT09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRWYWwoKSA6IGRlZmF1bHRWYWxcbiAgICB9XG4gIH0sXG5cbiAgZGVsZXRlU3RpY2t5KGVsLCBuYW1lKXtcbiAgICB0aGlzLnVwZGF0ZVByaXZhdGUoZWwsIFwic3RpY2t5XCIsIFtdLCBvcHMgPT4ge1xuICAgICAgcmV0dXJuIG9wcy5maWx0ZXIoKFtleGlzdGluZ05hbWUsIF9dKSA9PiBleGlzdGluZ05hbWUgIT09IG5hbWUpXG4gICAgfSlcbiAgfSxcblxuICBwdXRTdGlja3koZWwsIG5hbWUsIG9wKXtcbiAgICBsZXQgc3Rhc2hlZFJlc3VsdCA9IG9wKGVsKVxuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICBsZXQgZXhpc3RpbmdJbmRleCA9IG9wcy5maW5kSW5kZXgoKFtleGlzdGluZ05hbWUsXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgICAgaWYoZXhpc3RpbmdJbmRleCA+PSAwKXtcbiAgICAgICAgb3BzW2V4aXN0aW5nSW5kZXhdID0gW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BzLnB1c2goW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHNcbiAgICB9KVxuICB9LFxuXG4gIGFwcGx5U3RpY2t5T3BlcmF0aW9ucyhlbCl7XG4gICAgbGV0IG9wcyA9IERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKVxuICAgIGlmKCFvcHMpeyByZXR1cm4gfVxuXG4gICAgb3BzLmZvckVhY2goKFtuYW1lLCBvcCwgX3N0YXNoZWRdKSA9PiB0aGlzLnB1dFN0aWNreShlbCwgbmFtZSwgb3ApKVxuICB9LFxuXG4gIGlzTG9ja2VkKGVsKXtcbiAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlICYmIGVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NXG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGNoYW5uZWxVcGxvYWRlcixcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWRFbnRyeSB7XG4gIHN0YXRpYyBpc0FjdGl2ZShmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBpc05ldyA9IGZpbGUuX3BoeFJlZiA9PT0gdW5kZWZpbmVkXG4gICAgbGV0IGFjdGl2ZVJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzQWN0aXZlID0gYWN0aXZlUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGZpbGUuc2l6ZSA+IDAgJiYgKGlzTmV3IHx8IGlzQWN0aXZlKVxuICB9XG5cbiAgc3RhdGljIGlzUHJlZmxpZ2h0ZWQoZmlsZUVsLCBmaWxlKXtcbiAgICBsZXQgcHJlZmxpZ2h0ZWRSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgbGV0IGlzUHJlZmxpZ2h0ZWQgPSBwcmVmbGlnaHRlZFJlZnMuaW5kZXhPZihMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKSkgPj0gMFxuICAgIHJldHVybiBpc1ByZWZsaWdodGVkICYmIHRoaXMuaXNBY3RpdmUoZmlsZUVsLCBmaWxlKVxuICB9XG5cbiAgc3RhdGljIGlzUHJlZmxpZ2h0SW5Qcm9ncmVzcyhmaWxlKXtcbiAgICByZXR1cm4gZmlsZS5fcHJlZmxpZ2h0SW5Qcm9ncmVzcyA9PT0gdHJ1ZVxuICB9XG5cbiAgc3RhdGljIG1hcmtQcmVmbGlnaHRJblByb2dyZXNzKGZpbGUpe1xuICAgIGZpbGUuX3ByZWZsaWdodEluUHJvZ3Jlc3MgPSB0cnVlXG4gIH1cblxuICBjb25zdHJ1Y3RvcihmaWxlRWwsIGZpbGUsIHZpZXcsIGF1dG9VcGxvYWQpe1xuICAgIHRoaXMucmVmID0gTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSlcbiAgICB0aGlzLmZpbGVFbCA9IGZpbGVFbFxuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5tZXRhID0gbnVsbFxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gZmFsc2VcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZVxuICAgIHRoaXMuX3Byb2dyZXNzID0gMFxuICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAtMVxuICAgIHRoaXMuX29uRG9uZSA9IGZ1bmN0aW9uKCl7IH1cbiAgICB0aGlzLl9vbkVsVXBkYXRlZCA9IHRoaXMub25FbFVwZGF0ZWQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmlsZUVsLmFkZEV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICB0aGlzLmF1dG9VcGxvYWQgPSBhdXRvVXBsb2FkXG4gIH1cblxuICBtZXRhZGF0YSgpeyByZXR1cm4gdGhpcy5tZXRhIH1cblxuICBwcm9ncmVzcyhwcm9ncmVzcyl7XG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHByb2dyZXNzKVxuICAgIGlmKHRoaXMuX3Byb2dyZXNzID4gdGhpcy5fbGFzdFByb2dyZXNzU2VudCl7XG4gICAgICBpZih0aGlzLl9wcm9ncmVzcyA+PSAxMDApe1xuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IDEwMFxuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gMTAwXG4gICAgICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCAxMDAsICgpID0+IHtcbiAgICAgICAgICBMaXZlVXBsb2FkZXIudW50cmFja0ZpbGUodGhpcy5maWxlRWwsIHRoaXMuZmlsZSlcbiAgICAgICAgICB0aGlzLl9vbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IHRoaXMuX3Byb2dyZXNzXG4gICAgICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwgdGhpcy5fcHJvZ3Jlc3MpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNDYW5jZWxsZWQoKXsgcmV0dXJuIHRoaXMuX2lzQ2FuY2VsbGVkIH1cblxuICBjYW5jZWwoKXtcbiAgICB0aGlzLmZpbGUuX3ByZWZsaWdodEluUHJvZ3Jlc3MgPSBmYWxzZVxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gdHJ1ZVxuICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICB0aGlzLl9vbkRvbmUoKVxuICB9XG5cbiAgaXNEb25lKCl7IHJldHVybiB0aGlzLl9pc0RvbmUgfVxuXG4gIGVycm9yKHJlYXNvbiA9IFwiZmFpbGVkXCIpe1xuICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIHtlcnJvcjogcmVhc29ufSlcbiAgICBpZighdGhpcy5pc0F1dG9VcGxvYWQoKSl7IExpdmVVcGxvYWRlci5jbGVhckZpbGVzKHRoaXMuZmlsZUVsKSB9XG4gIH1cblxuICBpc0F1dG9VcGxvYWQoKXsgcmV0dXJuIHRoaXMuYXV0b1VwbG9hZCB9XG5cbiAgLy9wcml2YXRlXG5cbiAgb25Eb25lKGNhbGxiYWNrKXtcbiAgICB0aGlzLl9vbkRvbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLmZpbGVFbC5yZW1vdmVFdmVudExpc3RlbmVyKFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCwgdGhpcy5fb25FbFVwZGF0ZWQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgb25FbFVwZGF0ZWQoKXtcbiAgICBsZXQgYWN0aXZlUmVmcyA9IHRoaXMuZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGlmKGFjdGl2ZVJlZnMuaW5kZXhPZih0aGlzLnJlZikgPT09IC0xKXtcbiAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKVxuICAgICAgdGhpcy5jYW5jZWwoKVxuICAgIH1cbiAgfVxuXG4gIHRvUHJlZmxpZ2h0UGF5bG9hZCgpe1xuICAgIHJldHVybiB7XG4gICAgICBsYXN0X21vZGlmaWVkOiB0aGlzLmZpbGUubGFzdE1vZGlmaWVkLFxuICAgICAgbmFtZTogdGhpcy5maWxlLm5hbWUsXG4gICAgICByZWxhdGl2ZV9wYXRoOiB0aGlzLmZpbGUud2Via2l0UmVsYXRpdmVQYXRoLFxuICAgICAgc2l6ZTogdGhpcy5maWxlLnNpemUsXG4gICAgICB0eXBlOiB0aGlzLmZpbGUudHlwZSxcbiAgICAgIHJlZjogdGhpcy5yZWYsXG4gICAgICBtZXRhOiB0eXBlb2YodGhpcy5maWxlLm1ldGEpID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzLmZpbGUubWV0YSgpIDogdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkZXIodXBsb2FkZXJzKXtcbiAgICBpZih0aGlzLm1ldGEudXBsb2FkZXIpe1xuICAgICAgbGV0IGNhbGxiYWNrID0gdXBsb2FkZXJzW3RoaXMubWV0YS51cGxvYWRlcl0gfHwgbG9nRXJyb3IoYG5vIHVwbG9hZGVyIGNvbmZpZ3VyZWQgZm9yICR7dGhpcy5tZXRhLnVwbG9hZGVyfWApXG4gICAgICByZXR1cm4ge25hbWU6IHRoaXMubWV0YS51cGxvYWRlciwgY2FsbGJhY2s6IGNhbGxiYWNrfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge25hbWU6IFwiY2hhbm5lbFwiLCBjYWxsYmFjazogY2hhbm5lbFVwbG9hZGVyfVxuICAgIH1cbiAgfVxuXG4gIHppcFBvc3RGbGlnaHQocmVzcCl7XG4gICAgdGhpcy5tZXRhID0gcmVzcC5lbnRyaWVzW3RoaXMucmVmXVxuICAgIGlmKCF0aGlzLm1ldGEpeyBsb2dFcnJvcihgbm8gcHJlZmxpZ2h0IHVwbG9hZCByZXNwb25zZSByZXR1cm5lZCB3aXRoIHJlZiAke3RoaXMucmVmfWAsIHtpbnB1dDogdGhpcy5maWxlRWwsIHJlc3BvbnNlOiByZXNwfSkgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0RPTkVfUkVGUyxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlMsXG4gIFBIWF9VUExPQURfUkVGXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IFVwbG9hZEVudHJ5IGZyb20gXCIuL3VwbG9hZF9lbnRyeVwiXG5cbmxldCBsaXZlVXBsb2FkZXJGaWxlUmVmID0gMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlVXBsb2FkZXIge1xuICBzdGF0aWMgZ2VuRmlsZVJlZihmaWxlKXtcbiAgICBsZXQgcmVmID0gZmlsZS5fcGh4UmVmXG4gICAgaWYocmVmICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHJlZlxuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlLl9waHhSZWYgPSAobGl2ZVVwbG9hZGVyRmlsZVJlZisrKS50b1N0cmluZygpXG4gICAgICByZXR1cm4gZmlsZS5fcGh4UmVmXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldEVudHJ5RGF0YVVSTChpbnB1dEVsLCByZWYsIGNhbGxiYWNrKXtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmaWxlID0+IHRoaXMuZ2VuRmlsZVJlZihmaWxlKSA9PT0gcmVmKVxuICAgIGNhbGxiYWNrKFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpXG4gIH1cblxuICBzdGF0aWMgaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKXtcbiAgICBsZXQgYWN0aXZlID0gMFxuICAgIERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbCkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpICE9PSBpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX0RPTkVfUkVGUykpe1xuICAgICAgICBhY3RpdmUrK1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFjdGl2ZSA+IDBcbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpe1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbClcbiAgICBsZXQgZmlsZURhdGEgPSB7fVxuICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBsZXQgZW50cnkgPSB7cGF0aDogaW5wdXRFbC5uYW1lfVxuICAgICAgbGV0IHVwbG9hZFJlZiA9IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXSA9IGZpbGVEYXRhW3VwbG9hZFJlZl0gfHwgW11cbiAgICAgIGVudHJ5LnJlZiA9IHRoaXMuZ2VuRmlsZVJlZihmaWxlKVxuICAgICAgZW50cnkubGFzdF9tb2RpZmllZCA9IGZpbGUubGFzdE1vZGlmaWVkXG4gICAgICBlbnRyeS5uYW1lID0gZmlsZS5uYW1lIHx8IGVudHJ5LnJlZlxuICAgICAgZW50cnkucmVsYXRpdmVfcGF0aCA9IGZpbGUud2Via2l0UmVsYXRpdmVQYXRoXG4gICAgICBlbnRyeS50eXBlID0gZmlsZS50eXBlXG4gICAgICBlbnRyeS5zaXplID0gZmlsZS5zaXplXG4gICAgICBpZih0eXBlb2YoZmlsZS5tZXRhKSA9PT0gXCJmdW5jdGlvblwiKXsgZW50cnkubWV0YSA9IGZpbGUubWV0YSgpIH1cbiAgICAgIGZpbGVEYXRhW3VwbG9hZFJlZl0ucHVzaChlbnRyeSlcbiAgICB9KVxuICAgIHJldHVybiBmaWxlRGF0YVxuICB9XG5cbiAgc3RhdGljIGNsZWFyRmlsZXMoaW5wdXRFbCl7XG4gICAgaW5wdXRFbC52YWx1ZSA9IG51bGxcbiAgICBpbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRilcbiAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdKVxuICB9XG5cbiAgc3RhdGljIHVudHJhY2tGaWxlKGlucHV0RWwsIGZpbGUpe1xuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgRE9NLnByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiKS5maWx0ZXIoZiA9PiAhT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgfVxuXG4gIHN0YXRpYyB0cmFja0ZpbGVzKGlucHV0RWwsIGZpbGVzLCBkYXRhVHJhbnNmZXIpe1xuICAgIGlmKGlucHV0RWwuZ2V0QXR0cmlidXRlKFwibXVsdGlwbGVcIikgIT09IG51bGwpe1xuICAgICAgbGV0IG5ld0ZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gIXRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmID0+IE9iamVjdC5pcyhmLCBmaWxlKSkpXG4gICAgICBET00udXBkYXRlUHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdLCAoZXhpc3RpbmcpID0+IGV4aXN0aW5nLmNvbmNhdChuZXdGaWxlcykpXG4gICAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXNldCBpbnB1dEVsIGZpbGVzIHRvIGFsaWduIG91dHB1dCB3aXRoIHByb2dyYW1tYXRpYyBjaGFuZ2VzIChpLmUuIGRyYWcgYW5kIGRyb3ApXG4gICAgICBpZihkYXRhVHJhbnNmZXIgJiYgZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCA+IDApeyBpbnB1dEVsLmZpbGVzID0gZGF0YVRyYW5zZmVyLmZpbGVzIH1cbiAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgZmlsZXMpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoZWwgPT4gZWwuZmlsZXMgJiYgdGhpcy5hY3RpdmVGaWxlcyhlbCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmVGaWxlcyhpbnB1dCl7XG4gICAgcmV0dXJuIChET00ucHJpdmF0ZShpbnB1dCwgXCJmaWxlc1wiKSB8fCBbXSkuZmlsdGVyKGYgPT4gVXBsb2FkRW50cnkuaXNBY3RpdmUoaW5wdXQsIGYpKVxuICB9XG5cbiAgc3RhdGljIGlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCl7XG4gICAgbGV0IGZpbGVJbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyhmb3JtRWwpXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZmlsZUlucHV0cykuZmlsdGVyKGlucHV0ID0+IHRoaXMuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dCkubGVuZ3RoID4gMClcbiAgfVxuXG4gIHN0YXRpYyBmaWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KXtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dCkuZmlsdGVyKGYgPT4gIVVwbG9hZEVudHJ5LmlzUHJlZmxpZ2h0ZWQoaW5wdXQsIGYpICYmICFVcGxvYWRFbnRyeS5pc1ByZWZsaWdodEluUHJvZ3Jlc3MoZikpXG4gIH1cblxuICBzdGF0aWMgbWFya1ByZWZsaWdodEluUHJvZ3Jlc3MoZW50cmllcyl7XG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IFVwbG9hZEVudHJ5Lm1hcmtQcmVmbGlnaHRJblByb2dyZXNzKGVudHJ5LmZpbGUpKVxuICB9XG5cbiAgY29uc3RydWN0b3IoaW5wdXRFbCwgdmlldywgb25Db21wbGV0ZSl7XG4gICAgdGhpcy5hdXRvVXBsb2FkID0gRE9NLmlzQXV0b1VwbG9hZChpbnB1dEVsKVxuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlXG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICBBcnJheS5mcm9tKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpIHx8IFtdKVxuICAgICAgICAubWFwKGZpbGUgPT4gbmV3IFVwbG9hZEVudHJ5KGlucHV0RWwsIGZpbGUsIHZpZXcsIHRoaXMuYXV0b1VwbG9hZCkpXG5cbiAgICAvLyBwcmV2ZW50IHNlbmRpbmcgZHVwbGljYXRlIHByZWZsaWdodCByZXF1ZXN0c1xuICAgIExpdmVVcGxvYWRlci5tYXJrUHJlZmxpZ2h0SW5Qcm9ncmVzcyh0aGlzLl9lbnRyaWVzKVxuXG4gICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9IHRoaXMuX2VudHJpZXMubGVuZ3RoXG4gIH1cblxuICBpc0F1dG9VcGxvYWQoKXsgcmV0dXJuIHRoaXMuYXV0b1VwbG9hZCB9XG5cbiAgZW50cmllcygpeyByZXR1cm4gdGhpcy5fZW50cmllcyB9XG5cbiAgaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgbGl2ZVNvY2tldCl7XG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICB0aGlzLl9lbnRyaWVzLm1hcChlbnRyeSA9PiB7XG4gICAgICAgIGlmKGVudHJ5LmlzQ2FuY2VsbGVkKCkpe1xuICAgICAgICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MtLVxuICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50cnkuemlwUG9zdEZsaWdodChyZXNwKVxuICAgICAgICAgIGVudHJ5Lm9uRG9uZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzLS1cbiAgICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW50cnlcbiAgICAgIH0pXG5cbiAgICBsZXQgZ3JvdXBlZEVudHJpZXMgPSB0aGlzLl9lbnRyaWVzLnJlZHVjZSgoYWNjLCBlbnRyeSkgPT4ge1xuICAgICAgaWYoIWVudHJ5Lm1ldGEpeyByZXR1cm4gYWNjIH1cbiAgICAgIGxldCB7bmFtZSwgY2FsbGJhY2t9ID0gZW50cnkudXBsb2FkZXIobGl2ZVNvY2tldC51cGxvYWRlcnMpXG4gICAgICBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gfHwge2NhbGxiYWNrOiBjYWxsYmFjaywgZW50cmllczogW119XG4gICAgICBhY2NbbmFtZV0uZW50cmllcy5wdXNoKGVudHJ5KVxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIHt9KVxuXG4gICAgZm9yKGxldCBuYW1lIGluIGdyb3VwZWRFbnRyaWVzKXtcbiAgICAgIGxldCB7Y2FsbGJhY2ssIGVudHJpZXN9ID0gZ3JvdXBlZEVudHJpZXNbbmFtZV1cbiAgICAgIGNhbGxiYWNrKGVudHJpZXMsIG9uRXJyb3IsIHJlc3AsIGxpdmVTb2NrZXQpXG4gICAgfVxuICB9XG59XG4iLCAibGV0IEFSSUEgPSB7XG4gIGFueU9mKGluc3RhbmNlLCBjbGFzc2VzKXsgcmV0dXJuIGNsYXNzZXMuZmluZChuYW1lID0+IGluc3RhbmNlIGluc3RhbmNlb2YgbmFtZSkgfSxcblxuICBpc0ZvY3VzYWJsZShlbCwgaW50ZXJhY3RpdmVPbmx5KXtcbiAgICByZXR1cm4gKFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZWwucmVsICE9PSBcImlnbm9yZVwiKSB8fFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFyZWFFbGVtZW50ICYmIGVsLmhyZWYgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICghZWwuZGlzYWJsZWQgJiYgKHRoaXMuYW55T2YoZWwsIFtIVE1MSW5wdXRFbGVtZW50LCBIVE1MU2VsZWN0RWxlbWVudCwgSFRNTFRleHRBcmVhRWxlbWVudCwgSFRNTEJ1dHRvbkVsZW1lbnRdKSkpIHx8XG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCkgfHxcbiAgICAgICgoZWwudGFiSW5kZXggPj0gMCAmJiBlbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSAhPT0gXCJ0cnVlXCIpIHx8ICghaW50ZXJhY3RpdmVPbmx5ICYmIGVsLmdldEF0dHJpYnV0ZShcInRhYmluZGV4XCIpICE9PSBudWxsICYmIGVsLmdldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpICE9PSBcInRydWVcIikpXG4gICAgKVxuICB9LFxuXG4gIGF0dGVtcHRGb2N1cyhlbCwgaW50ZXJhY3RpdmVPbmx5KXtcbiAgICBpZih0aGlzLmlzRm9jdXNhYmxlKGVsLCBpbnRlcmFjdGl2ZU9ubHkpKXsgdHJ5IHsgZWwuZm9jdXMoKSB9IGNhdGNoIHt9IH1cbiAgICByZXR1cm4gISFkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShlbClcbiAgfSxcblxuICBmb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpe1xuICAgIGxldCBjaGlsZCA9IGVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgd2hpbGUoY2hpbGQpe1xuICAgICAgaWYodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQsIHRydWUpIHx8IHRoaXMuZm9jdXNGaXJzdEludGVyYWN0aXZlKGNoaWxkLCB0cnVlKSl7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfSxcblxuICBmb2N1c0ZpcnN0KGVsKXtcbiAgICBsZXQgY2hpbGQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzRmlyc3QoY2hpbGQpKXtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIGNoaWxkID0gY2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9LFxuXG4gIGZvY3VzTGFzdChlbCl7XG4gICAgbGV0IGNoaWxkID0gZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzTGFzdChjaGlsZCkpe1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgY2hpbGQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBUklBXG4iLCAiaW1wb3J0IHtcbiAgUEhYX0FDVElWRV9FTlRSWV9SRUZTLFxuICBQSFhfTElWRV9GSUxFX1VQREFURUQsXG4gIFBIWF9QUkVGTElHSFRFRF9SRUZTLFxuICBQSFhfVVBMT0FEX1JFRlxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IEFSSUEgZnJvbSBcIi4vYXJpYVwiXG5cbmxldCBIb29rcyA9IHtcbiAgTGl2ZUZpbGVVcGxvYWQ6IHtcbiAgICBhY3RpdmVSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpIH0sXG5cbiAgICBwcmVmbGlnaHRlZFJlZnMoKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKSB9LFxuXG4gICAgbW91bnRlZCgpeyB0aGlzLnByZWZsaWdodGVkV2FzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKSB9LFxuXG4gICAgdXBkYXRlZCgpe1xuICAgICAgbGV0IG5ld1ByZWZsaWdodHMgPSB0aGlzLnByZWZsaWdodGVkUmVmcygpXG4gICAgICBpZih0aGlzLnByZWZsaWdodGVkV2FzICE9PSBuZXdQcmVmbGlnaHRzKXtcbiAgICAgICAgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IG5ld1ByZWZsaWdodHNcbiAgICAgICAgaWYobmV3UHJlZmxpZ2h0cyA9PT0gXCJcIil7XG4gICAgICAgICAgdGhpcy5fX3ZpZXcoKS5jYW5jZWxTdWJtaXQodGhpcy5lbC5mb3JtKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuYWN0aXZlUmVmcygpID09PSBcIlwiKXsgdGhpcy5lbC52YWx1ZSA9IG51bGwgfVxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChQSFhfTElWRV9GSUxFX1VQREFURUQpKVxuICAgIH1cbiAgfSxcblxuICBMaXZlSW1nUHJldmlldzoge1xuICAgIG1vdW50ZWQoKXtcbiAgICAgIHRoaXMucmVmID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1lbnRyeS1yZWZcIilcbiAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSlcbiAgICAgIExpdmVVcGxvYWRlci5nZXRFbnRyeURhdGFVUkwodGhpcy5pbnB1dEVsLCB0aGlzLnJlZiwgdXJsID0+IHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmxcbiAgICAgICAgdGhpcy5lbC5zcmMgPSB1cmxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkZXN0cm95ZWQoKXtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodGhpcy51cmwpXG4gICAgfVxuICB9LFxuICBGb2N1c1dyYXA6IHtcbiAgICBtb3VudGVkKCl7XG4gICAgICB0aGlzLmZvY3VzU3RhcnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0aGlzLmZvY3VzRW5kID0gdGhpcy5lbC5sYXN0RWxlbWVudENoaWxkXG4gICAgICB0aGlzLmZvY3VzU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlKSA9PiB7XG4gICAgICAgIGlmKCFlLnJlbGF0ZWRUYXJnZXQgfHwgIXRoaXMuZWwuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0KSl7IFxuICAgICAgICAgIC8vIEhhbmRsZSBmb2N1cyBlbnRlcmluZyBmcm9tIG91dHNpZGUgKGUuZy4gVGFiIHdoZW4gYm9keSBpcyBmb2N1c2VkKVxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNjM2XG4gICAgICAgICAgY29uc3QgbmV4dEZvY3VzID0gZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgICAgICAgQVJJQS5hdHRlbXB0Rm9jdXMobmV4dEZvY3VzKSB8fCBBUklBLmZvY3VzRmlyc3QobmV4dEZvY3VzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEFSSUEuZm9jdXNMYXN0KHRoaXMuZWwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmZvY3VzRW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICBpZighZS5yZWxhdGVkVGFyZ2V0IHx8ICF0aGlzLmVsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpeyBcbiAgICAgICAgICAvLyBIYW5kbGUgZm9jdXMgZW50ZXJpbmcgZnJvbSBvdXRzaWRlIChlLmcuIFNoaWZ0K1RhYiB3aGVuIGJvZHkgaXMgZm9jdXNlZClcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzYzNlxuICAgICAgICAgIGNvbnN0IG5leHRGb2N1cyA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmdcbiAgICAgICAgICBBUklBLmF0dGVtcHRGb2N1cyhuZXh0Rm9jdXMpIHx8IEFSSUEuZm9jdXNMYXN0KG5leHRGb2N1cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBBUklBLmZvY3VzRmlyc3QodGhpcy5lbClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpzaG93LWVuZFwiLCAoKSA9PiB0aGlzLmVsLmZvY3VzKCkpXG4gICAgICBpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsKS5kaXNwbGF5ICE9PSBcIm5vbmVcIil7XG4gICAgICAgIEFSSUEuZm9jdXNGaXJzdCh0aGlzLmVsKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5sZXQgZmluZFNjcm9sbENvbnRhaW5lciA9IChlbCkgPT4ge1xuICAvLyB0aGUgc2Nyb2xsIGV2ZW50IHdvbid0IGJlIGZpcmVkIG9uIHRoZSBodG1sL2JvZHkgZWxlbWVudCBldmVuIGlmIG92ZXJmbG93IGlzIHNldFxuICAvLyB0aGVyZWZvcmUgd2UgcmV0dXJuIG51bGwgdG8gaW5zdGVhZCBsaXN0ZW4gZm9yIHNjcm9sbCBldmVudHMgb24gZG9jdW1lbnRcbiAgaWYoW1wiSFRNTFwiLCBcIkJPRFlcIl0uaW5kZXhPZihlbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpKSA+PSAwKSByZXR1cm4gbnVsbFxuICBpZihbXCJzY3JvbGxcIiwgXCJhdXRvXCJdLmluZGV4T2YoZ2V0Q29tcHV0ZWRTdHlsZShlbCkub3ZlcmZsb3dZKSA+PSAwKSByZXR1cm4gZWxcbiAgcmV0dXJuIGZpbmRTY3JvbGxDb250YWluZXIoZWwucGFyZW50RWxlbWVudClcbn1cblxubGV0IHNjcm9sbFRvcCA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXG4gIH1cbn1cblxubGV0IGJvdHRvbSA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbVxuICB9IGVsc2Uge1xuICAgIC8vIHdoZW4gd2UgaGF2ZSBubyBjb250YWluZXIsIHRoZSB3aG9sZSBwYWdlIHNjcm9sbHMsXG4gICAgLy8gdGhlcmVmb3JlIHRoZSBib3R0b20gY29vcmRpbmF0ZSBpcyB0aGUgdmlld3BvcnQgaGVpZ2h0XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gIH1cbn1cblxubGV0IHRvcCA9IChzY3JvbGxDb250YWluZXIpID0+IHtcbiAgaWYoc2Nyb2xsQ29udGFpbmVyKXtcbiAgICByZXR1cm4gc2Nyb2xsQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICB9IGVsc2Uge1xuICAgIC8vIHdoZW4gd2UgaGF2ZSBubyBjb250YWluZXIgdGhlIHdob2xlIHBhZ2Ugc2Nyb2xscyxcbiAgICAvLyB0aGVyZWZvcmUgdGhlIHRvcCBjb29yZGluYXRlIGlzIDBcbiAgICByZXR1cm4gMFxuICB9XG59XG5cbmxldCBpc0F0Vmlld3BvcnRUb3AgPSAoZWwsIHNjcm9sbENvbnRhaW5lcikgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiBNYXRoLmNlaWwocmVjdC50b3ApID49IHRvcChzY3JvbGxDb250YWluZXIpICYmIE1hdGguY2VpbChyZWN0LmxlZnQpID49IDAgJiYgTWF0aC5mbG9vcihyZWN0LnRvcCkgPD0gYm90dG9tKHNjcm9sbENvbnRhaW5lcilcbn1cblxubGV0IGlzQXRWaWV3cG9ydEJvdHRvbSA9IChlbCwgc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIE1hdGguY2VpbChyZWN0LmJvdHRvbSkgPj0gdG9wKHNjcm9sbENvbnRhaW5lcikgJiYgTWF0aC5jZWlsKHJlY3QubGVmdCkgPj0gMCAmJiBNYXRoLmZsb29yKHJlY3QuYm90dG9tKSA8PSBib3R0b20oc2Nyb2xsQ29udGFpbmVyKVxufVxuXG5sZXQgaXNXaXRoaW5WaWV3cG9ydCA9IChlbCwgc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIE1hdGguY2VpbChyZWN0LnRvcCkgPj0gdG9wKHNjcm9sbENvbnRhaW5lcikgJiYgTWF0aC5jZWlsKHJlY3QubGVmdCkgPj0gMCAmJiBNYXRoLmZsb29yKHJlY3QudG9wKSA8PSBib3R0b20oc2Nyb2xsQ29udGFpbmVyKVxufVxuXG5Ib29rcy5JbmZpbml0ZVNjcm9sbCA9IHtcbiAgbW91bnRlZCgpe1xuICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyID0gZmluZFNjcm9sbENvbnRhaW5lcih0aGlzLmVsKVxuICAgIGxldCBzY3JvbGxCZWZvcmUgPSBzY3JvbGxUb3AodGhpcy5zY3JvbGxDb250YWluZXIpXG4gICAgbGV0IHRvcE92ZXJyYW4gPSBmYWxzZVxuICAgIGxldCB0aHJvdHRsZUludGVydmFsID0gNTAwXG4gICAgbGV0IHBlbmRpbmdPcCA9IG51bGxcblxuICAgIGxldCBvblRvcE92ZXJydW4gPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsICh0b3BFdmVudCwgZmlyc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gdHJ1ZVxuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKU0hvb2tQdXNoKHRoaXMuZWwsIHRvcEV2ZW50LCB7aWQ6IGZpcnN0Q2hpbGQuaWQsIF9vdmVycmFuOiB0cnVlfSwgKCkgPT4ge1xuICAgICAgICBwZW5kaW5nT3AgPSBudWxsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBsZXQgb25GaXJzdENoaWxkQXRUb3AgPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsICh0b3BFdmVudCwgZmlyc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gZmlyc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwic3RhcnRcIn0pXG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTSG9va1B1c2godGhpcy5lbCwgdG9wRXZlbnQsIHtpZDogZmlyc3RDaGlsZC5pZH0sICgpID0+IHtcbiAgICAgICAgcGVuZGluZ09wID0gbnVsbFxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGUgRE9NIGlzIHBhdGNoZWQgYnkgd2FpdGluZyBmb3IgdGhlIG5leHQgdGlja1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZighaXNXaXRoaW5WaWV3cG9ydChmaXJzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICAgICAgZmlyc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwic3RhcnRcIn0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgbGV0IG9uTGFzdENoaWxkQXRCb3R0b20gPSB0aGlzLnRocm90dGxlKHRocm90dGxlSW50ZXJ2YWwsIChib3R0b21FdmVudCwgbGFzdENoaWxkKSA9PiB7XG4gICAgICBwZW5kaW5nT3AgPSAoKSA9PiBsYXN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcImVuZFwifSlcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlNIb29rUHVzaCh0aGlzLmVsLCBib3R0b21FdmVudCwge2lkOiBsYXN0Q2hpbGQuaWR9LCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdPcCA9IG51bGxcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIERPTSBpcyBwYXRjaGVkIGJ5IHdhaXRpbmcgZm9yIHRoZSBuZXh0IHRpY2tcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYoIWlzV2l0aGluVmlld3BvcnQobGFzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICAgICAgbGFzdENoaWxkLnNjcm9sbEludG9WaWV3KHtibG9jazogXCJlbmRcIn0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vblNjcm9sbCA9IChfZSkgPT4ge1xuICAgICAgbGV0IHNjcm9sbE5vdyA9IHNjcm9sbFRvcCh0aGlzLnNjcm9sbENvbnRhaW5lcilcblxuICAgICAgaWYocGVuZGluZ09wKXtcbiAgICAgICAgc2Nyb2xsQmVmb3JlID0gc2Nyb2xsTm93XG4gICAgICAgIHJldHVybiBwZW5kaW5nT3AoKVxuICAgICAgfVxuICAgICAgbGV0IHJlY3QgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBsZXQgdG9wRXZlbnQgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSh0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhcInZpZXdwb3J0LXRvcFwiKSlcbiAgICAgIGxldCBib3R0b21FdmVudCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwidmlld3BvcnQtYm90dG9tXCIpKVxuICAgICAgbGV0IGxhc3RDaGlsZCA9IHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgICAgbGV0IGZpcnN0Q2hpbGQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgICBsZXQgaXNTY3JvbGxpbmdVcCA9IHNjcm9sbE5vdyA8IHNjcm9sbEJlZm9yZVxuICAgICAgbGV0IGlzU2Nyb2xsaW5nRG93biA9IHNjcm9sbE5vdyA+IHNjcm9sbEJlZm9yZVxuXG4gICAgICAvLyBlbCBvdmVycmFuIHdoaWxlIHNjcm9sbGluZyB1cFxuICAgICAgaWYoaXNTY3JvbGxpbmdVcCAmJiB0b3BFdmVudCAmJiAhdG9wT3ZlcnJhbiAmJiByZWN0LnRvcCA+PSAwKXtcbiAgICAgICAgdG9wT3ZlcnJhbiA9IHRydWVcbiAgICAgICAgb25Ub3BPdmVycnVuKHRvcEV2ZW50LCBmaXJzdENoaWxkKVxuICAgICAgfSBlbHNlIGlmKGlzU2Nyb2xsaW5nRG93biAmJiB0b3BPdmVycmFuICYmIHJlY3QudG9wIDw9IDApe1xuICAgICAgICB0b3BPdmVycmFuID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYodG9wRXZlbnQgJiYgaXNTY3JvbGxpbmdVcCAmJiBpc0F0Vmlld3BvcnRUb3AoZmlyc3RDaGlsZCwgdGhpcy5zY3JvbGxDb250YWluZXIpKXtcbiAgICAgICAgb25GaXJzdENoaWxkQXRUb3AodG9wRXZlbnQsIGZpcnN0Q2hpbGQpXG4gICAgICB9IGVsc2UgaWYoYm90dG9tRXZlbnQgJiYgaXNTY3JvbGxpbmdEb3duICYmIGlzQXRWaWV3cG9ydEJvdHRvbShsYXN0Q2hpbGQsIHRoaXMuc2Nyb2xsQ29udGFpbmVyKSl7XG4gICAgICAgIG9uTGFzdENoaWxkQXRCb3R0b20oYm90dG9tRXZlbnQsIGxhc3RDaGlsZClcbiAgICAgIH1cbiAgICAgIHNjcm9sbEJlZm9yZSA9IHNjcm9sbE5vd1xuICAgIH1cblxuICAgIGlmKHRoaXMuc2Nyb2xsQ29udGFpbmVyKXtcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbClcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbClcbiAgICB9XG4gIH0sXG4gIFxuICBkZXN0cm95ZWQoKXtcbiAgICBpZih0aGlzLnNjcm9sbENvbnRhaW5lcil7XG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfVxuICB9LFxuXG4gIHRocm90dGxlKGludGVydmFsLCBjYWxsYmFjayl7XG4gICAgbGV0IGxhc3RDYWxsQXQgPSAwXG4gICAgbGV0IHRpbWVyXG5cbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpXG4gICAgICBsZXQgcmVtYWluaW5nVGltZSA9IGludGVydmFsIC0gKG5vdyAtIGxhc3RDYWxsQXQpXG5cbiAgICAgIGlmKHJlbWFpbmluZ1RpbWUgPD0gMCB8fCByZW1haW5pbmdUaW1lID4gaW50ZXJ2YWwpe1xuICAgICAgICBpZih0aW1lcil7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgICAgIHRpbWVyID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGxhc3RDYWxsQXQgPSBub3dcbiAgICAgICAgY2FsbGJhY2soLi4uYXJncylcbiAgICAgIH0gZWxzZSBpZighdGltZXIpe1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxhc3RDYWxsQXQgPSBEYXRlLm5vdygpXG4gICAgICAgICAgdGltZXIgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2soLi4uYXJncylcbiAgICAgICAgfSwgcmVtYWluaW5nVGltZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEhvb2tzXG4iLCAiaW1wb3J0IHtcbiAgUEhYX1JFRl9MT0FESU5HLFxuICBQSFhfUkVGX0xPQ0ssXG4gIFBIWF9SRUZfU1JDLFxuICBQSFhfUEVORElOR19SRUZTLFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgUEhYX0RJU0FCTEVELFxuICBQSFhfUkVBRE9OTFksXG4gIFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRVxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnRSZWYge1xuICBzdGF0aWMgb25VbmxvY2soZWwsIGNhbGxiYWNrKXtcbiAgICBpZighRE9NLmlzTG9ja2VkKGVsKSAmJiAhZWwuY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKSl7IHJldHVybiBjYWxsYmFjaygpIH1cbiAgICBjb25zdCBjbG9zZXN0TG9jayA9IGVsLmNsb3Nlc3QoYFske1BIWF9SRUZfTE9DS31dYClcbiAgICBjb25zdCByZWYgPSBjbG9zZXN0TG9jay5jbG9zZXN0KGBbJHtQSFhfUkVGX0xPQ0t9XWApLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgY2xvc2VzdExvY2suYWRkRXZlbnRMaXN0ZW5lcihgcGh4OnVuZG8tbG9jazoke3JlZn1gLCAoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfSwge29uY2U6IHRydWV9KVxuICB9XG5cbiAgY29uc3RydWN0b3IoZWwpe1xuICAgIHRoaXMuZWwgPSBlbFxuICAgIHRoaXMubG9hZGluZ1JlZiA9IGVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpID8gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9SRUZfTE9BRElORyksIDEwKSA6IG51bGxcbiAgICB0aGlzLmxvY2tSZWYgPSBlbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKSA/IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spLCAxMCkgOiBudWxsXG4gIH1cblxuICAvLyBwdWJsaWNcblxuICBtYXliZVVuZG8ocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzV2l0aGluKHJlZikpe1xuICAgICAgLy8gd2UgY2Fubm90IHVuZG8gdGhlIGxvY2sgLyBsb2FkaW5nIG5vdywgYXMgdGhlcmUgaXMgYSBuZXdlciBvbmUgYWxyZWFkeSBzZXQ7XG4gICAgICAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBvcmlnaW5hbCByZWYgd2UgdHJpZWQgdG8gc2VuZCB0aGUgdW5kbyBldmVudCBsYXRlclxuICAgICAgRE9NLnVwZGF0ZVByaXZhdGUodGhpcy5lbCwgUEhYX1BFTkRJTkdfUkVGUywgW10sIChwZW5kaW5nUmVmcykgPT4ge1xuICAgICAgICBwZW5kaW5nUmVmcy5wdXNoKHJlZilcbiAgICAgICAgcmV0dXJuIHBlbmRpbmdSZWZzXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gdW5kbyBsb2NrcyBhbmQgYXBwbHkgY2xvbmVzXG4gICAgdGhpcy51bmRvTG9ja3MocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spXG5cbiAgICAvLyB1bmRvIGxvYWRpbmcgc3RhdGVzXG4gICAgdGhpcy51bmRvTG9hZGluZyhyZWYsIHBoeEV2ZW50KVxuXG4gICAgLy8gZW5zdXJlIHVuZG8gZXZlbnRzIGFyZSBmaXJlZCBmb3IgcGVuZGluZyByZWZzIHRoYXRcbiAgICAvLyBhcmUgcmVzb2x2ZWQgYnkgdGhlIGN1cnJlbnQgcmVmLCBvdGhlcndpc2Ugd2UnZCBsZWFrIGV2ZW50IGxpc3RlbmVyc1xuICAgIERPTS51cGRhdGVQcml2YXRlKHRoaXMuZWwsIFBIWF9QRU5ESU5HX1JFRlMsIFtdLCAocGVuZGluZ1JlZnMpID0+IHtcbiAgICAgIHJldHVybiBwZW5kaW5nUmVmcy5maWx0ZXIoKHBlbmRpbmdSZWYpID0+IHtcbiAgICAgICAgbGV0IG9wdHMgPSB7XG4gICAgICAgICAgZGV0YWlsOiB7cmVmOiBwZW5kaW5nUmVmLCBldmVudDogcGh4RXZlbnR9LFxuICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5sb2FkaW5nUmVmICYmIHRoaXMubG9hZGluZ1JlZiA+IHBlbmRpbmdSZWYpe1xuICAgICAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgcGh4OnVuZG8tbG9hZGluZzoke3BlbmRpbmdSZWZ9YCwgb3B0cyksXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMubG9ja1JlZiAmJiB0aGlzLmxvY2tSZWYgPiBwZW5kaW5nUmVmKXtcbiAgICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYHBoeDp1bmRvLWxvY2s6JHtwZW5kaW5nUmVmfWAsIG9wdHMpLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGVuZGluZ1JlZiA+IHJlZlxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gY2xlYW4gdXAgaWYgZnVsbHkgcmVzb2x2ZWRcbiAgICBpZih0aGlzLmlzRnVsbHlSZXNvbHZlZEJ5KHJlZikpeyB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQykgfVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGlzV2l0aGluKHJlZil7XG4gICAgcmV0dXJuICEoKHRoaXMubG9hZGluZ1JlZiAhPT0gbnVsbCAmJiB0aGlzLmxvYWRpbmdSZWYgPiByZWYpICYmICh0aGlzLmxvY2tSZWYgIT09IG51bGwgJiYgdGhpcy5sb2NrUmVmID4gcmVmKSlcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBjbG9uZWQgUEhYX1JFRl9MT0NLIGVsZW1lbnQgdGhhdCBoYXMgYmVlbiBtb3JwaGVkIGJlaGluZFxuICAvLyB0aGUgc2NlbmVzIHdoaWxlIHRoaXMgZWxlbWVudCB3YXMgbG9ja2VkIGluIHRoZSBET00uXG4gIC8vIFdoZW4gd2UgYXBwbHkgdGhlIGNsb25lZCB0cmVlIHRvIHRoZSBhY3RpdmUgRE9NIGVsZW1lbnQsIHdlIG11c3RcbiAgLy9cbiAgLy8gICAxLiBleGVjdXRlIHBlbmRpbmcgbW91bnRlZCBob29rcyBmb3Igbm9kZXMgbm93IGluIHRoZSBET01cbiAgLy8gICAyLiB1bmRvIGFueSByZWYgaW5zaWRlIHRoZSBjbG9uZWQgdHJlZSB0aGF0IGhhcyBzaW5jZSBiZWVuIGFjaydkXG4gIHVuZG9Mb2NrcyhyZWYsIHBoeEV2ZW50LCBlYWNoQ2xvbmVDYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuaXNMb2NrVW5kb25lQnkocmVmKSl7IHJldHVybiB9XG5cbiAgICBsZXQgY2xvbmVkVHJlZSA9IERPTS5wcml2YXRlKHRoaXMuZWwsIFBIWF9SRUZfTE9DSylcbiAgICBpZihjbG9uZWRUcmVlKXtcbiAgICAgIGVhY2hDbG9uZUNhbGxiYWNrKGNsb25lZFRyZWUpXG4gICAgICBET00uZGVsZXRlUHJpdmF0ZSh0aGlzLmVsLCBQSFhfUkVGX0xPQ0spXG4gICAgfVxuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcblxuICAgIGxldCBvcHRzID0ge2RldGFpbDoge3JlZjogcmVmLCBldmVudDogcGh4RXZlbnR9LCBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiBmYWxzZX1cbiAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6dW5kby1sb2NrOiR7dGhpcy5sb2NrUmVmfWAsIG9wdHMpKVxuICB9XG5cbiAgdW5kb0xvYWRpbmcocmVmLCBwaHhFdmVudCl7XG4gICAgaWYoIXRoaXMuaXNMb2FkaW5nVW5kb25lQnkocmVmKSl7XG4gICAgICBpZih0aGlzLmNhblVuZG9Mb2FkaW5nKHJlZikgJiYgdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJwaHgtc3VibWl0LWxvYWRpbmdcIikpe1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJwaHgtY2hhbmdlLWxvYWRpbmdcIilcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmKHRoaXMuY2FuVW5kb0xvYWRpbmcocmVmKSl7XG4gICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpXG4gICAgICBsZXQgZGlzYWJsZWRWYWwgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICBsZXQgcmVhZE9ubHlWYWwgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpXG4gICAgICAvLyByZXN0b3JlIGlucHV0c1xuICAgICAgaWYocmVhZE9ubHlWYWwgIT09IG51bGwpe1xuICAgICAgICB0aGlzLmVsLnJlYWRPbmx5ID0gcmVhZE9ubHlWYWwgPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUFET05MWSlcbiAgICAgIH1cbiAgICAgIGlmKGRpc2FibGVkVmFsICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5lbC5kaXNhYmxlZCA9IGRpc2FibGVkVmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfRElTQUJMRUQpXG4gICAgICB9XG4gICAgICAvLyByZXN0b3JlIGRpc2FibGVzXG4gICAgICBsZXQgZGlzYWJsZVJlc3RvcmUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpXG4gICAgICBpZihkaXNhYmxlUmVzdG9yZSAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJUZXh0ID0gZGlzYWJsZVJlc3RvcmVcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgfVxuXG4gICAgICBsZXQgb3B0cyA9IHtkZXRhaWw6IHtyZWY6IHJlZiwgZXZlbnQ6IHBoeEV2ZW50fSwgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2V9XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6dW5kby1sb2FkaW5nOiR7dGhpcy5sb2FkaW5nUmVmfWAsIG9wdHMpKVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBjbGFzc2VzXG4gICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGlmKG5hbWUgIT09IFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIgfHwgdGhpcy5jYW5VbmRvTG9hZGluZyhyZWYpKXtcbiAgICAgICAgRE9NLnJlbW92ZUNsYXNzKHRoaXMuZWwsIG5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlzTG9hZGluZ1VuZG9uZUJ5KHJlZil7IHJldHVybiB0aGlzLmxvYWRpbmdSZWYgPT09IG51bGwgPyBmYWxzZSA6IHRoaXMubG9hZGluZ1JlZiA8PSByZWYgfVxuICBpc0xvY2tVbmRvbmVCeShyZWYpeyByZXR1cm4gdGhpcy5sb2NrUmVmID09PSBudWxsID8gZmFsc2UgOiB0aGlzLmxvY2tSZWYgPD0gcmVmIH1cblxuICBpc0Z1bGx5UmVzb2x2ZWRCeShyZWYpe1xuICAgIHJldHVybiAodGhpcy5sb2FkaW5nUmVmID09PSBudWxsIHx8IHRoaXMubG9hZGluZ1JlZiA8PSByZWYpICYmICh0aGlzLmxvY2tSZWYgPT09IG51bGwgfHwgdGhpcy5sb2NrUmVmIDw9IHJlZilcbiAgfVxuXG4gIC8vIG9ubHkgcmVtb3ZlIHRoZSBwaHgtc3VibWl0LWxvYWRpbmcgY2xhc3MgaWYgd2UgYXJlIG5vdCBsb2NrZWRcbiAgY2FuVW5kb0xvYWRpbmcocmVmKXsgcmV0dXJuIHRoaXMubG9ja1JlZiA9PT0gbnVsbCB8fCB0aGlzLmxvY2tSZWYgPD0gcmVmIH1cbn1cbiIsICJpbXBvcnQge1xuICBtYXliZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NUG9zdE1vcnBoUmVzdG9yZXIge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXJCZWZvcmUsIGNvbnRhaW5lckFmdGVyLCB1cGRhdGVUeXBlKXtcbiAgICBsZXQgaWRzQmVmb3JlID0gbmV3IFNldCgpXG4gICAgbGV0IGlkc0FmdGVyID0gbmV3IFNldChbLi4uY29udGFpbmVyQWZ0ZXIuY2hpbGRyZW5dLm1hcChjaGlsZCA9PiBjaGlsZC5pZCkpXG5cbiAgICBsZXQgZWxlbWVudHNUb01vZGlmeSA9IFtdXG5cbiAgICBBcnJheS5mcm9tKGNvbnRhaW5lckJlZm9yZS5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICBpZihjaGlsZC5pZCl7IC8vIGFsbCBvZiBvdXIgY2hpbGRyZW4gc2hvdWxkIGJlIGVsZW1lbnRzIHdpdGggaWRzXG4gICAgICAgIGlkc0JlZm9yZS5hZGQoY2hpbGQuaWQpXG4gICAgICAgIGlmKGlkc0FmdGVyLmhhcyhjaGlsZC5pZCkpe1xuICAgICAgICAgIGxldCBwcmV2aW91c0VsZW1lbnRJZCA9IGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZy5pZFxuICAgICAgICAgIGVsZW1lbnRzVG9Nb2RpZnkucHVzaCh7ZWxlbWVudElkOiBjaGlsZC5pZCwgcHJldmlvdXNFbGVtZW50SWQ6IHByZXZpb3VzRWxlbWVudElkfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmNvbnRhaW5lcklkID0gY29udGFpbmVyQWZ0ZXIuaWRcbiAgICB0aGlzLnVwZGF0ZVR5cGUgPSB1cGRhdGVUeXBlXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5ID0gZWxlbWVudHNUb01vZGlmeVxuICAgIHRoaXMuZWxlbWVudElkc1RvQWRkID0gWy4uLmlkc0FmdGVyXS5maWx0ZXIoaWQgPT4gIWlkc0JlZm9yZS5oYXMoaWQpKVxuICB9XG5cbiAgLy8gV2UgZG8gdGhlIGZvbGxvd2luZyB0byBvcHRpbWl6ZSBhcHBlbmQvcHJlcGVuZCBvcGVyYXRpb25zOlxuICAvLyAgIDEpIFRyYWNrIGlkcyBvZiBtb2RpZmllZCBlbGVtZW50cyAmIG9mIG5ldyBlbGVtZW50c1xuICAvLyAgIDIpIEFsbCB0aGUgbW9kaWZpZWQgZWxlbWVudHMgYXJlIHB1dCBiYWNrIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBET00gdHJlZVxuICAvLyAgICAgIGJ5IHN0b3JpbmcgdGhlIGlkIG9mIHRoZWlyIHByZXZpb3VzIHNpYmxpbmdcbiAgLy8gICAzKSBOZXcgZWxlbWVudHMgYXJlIGdvaW5nIHRvIGJlIHB1dCBpbiB0aGUgcmlnaHQgcGxhY2UgYnkgbW9ycGhkb20gZHVyaW5nIGFwcGVuZC5cbiAgLy8gICAgICBGb3IgcHJlcGVuZCwgd2UgbW92ZSB0aGVtIHRvIHRoZSBmaXJzdCBwb3NpdGlvbiBpbiB0aGUgY29udGFpbmVyXG4gIHBlcmZvcm0oKXtcbiAgICBsZXQgY29udGFpbmVyID0gRE9NLmJ5SWQodGhpcy5jb250YWluZXJJZClcbiAgICB0aGlzLmVsZW1lbnRzVG9Nb2RpZnkuZm9yRWFjaChlbGVtZW50VG9Nb2RpZnkgPT4ge1xuICAgICAgaWYoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKXtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKSwgcHJldmlvdXNFbGVtID0+IHtcbiAgICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgICBsZXQgaXNJblJpZ2h0UGxhY2UgPSBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlkID09IHByZXZpb3VzRWxlbS5pZFxuICAgICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgICAgcHJldmlvdXNFbGVtLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGVsZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGNvbnRhaW5lclxuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09IG51bGxcbiAgICAgICAgICBpZighaXNJblJpZ2h0UGxhY2Upe1xuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgZWxlbSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmKHRoaXMudXBkYXRlVHlwZSA9PSBcInByZXBlbmRcIil7XG4gICAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZC5yZXZlcnNlKCkuZm9yRWFjaChlbGVtSWQgPT4ge1xuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtSWQpLCBlbGVtID0+IGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cbiIsICJ2YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSA9IDExO1xuXG5mdW5jdGlvbiBtb3JwaEF0dHJzKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICB2YXIgdG9Ob2RlQXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cjtcbiAgICB2YXIgYXR0ck5hbWU7XG4gICAgdmFyIGF0dHJOYW1lc3BhY2VVUkk7XG4gICAgdmFyIGF0dHJWYWx1ZTtcbiAgICB2YXIgZnJvbVZhbHVlO1xuXG4gICAgLy8gZG9jdW1lbnQtZnJhZ21lbnRzIGRvbnQgaGF2ZSBhdHRyaWJ1dGVzIHNvIGxldHMgbm90IGRvIGFueXRoaW5nXG4gICAgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSB8fCBmcm9tTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50XG4gICAgZm9yICh2YXIgaSA9IHRvTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGF0dHIgPSB0b05vZGVBdHRyc1tpXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgYXR0clZhbHVlID0gYXR0ci52YWx1ZTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKTtcblxuICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHIucHJlZml4ID09PSAneG1sbnMnKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7IC8vIEl0J3Mgbm90IGFsbG93ZWQgdG8gc2V0IGFuIGF0dHJpYnV0ZSB3aXRoIHRoZSBYTUxOUyBuYW1lc3BhY2Ugd2l0aG91dCBzcGVjaWZ5aW5nIHRoZSBgeG1sbnNgIHByZWZpeFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgZXh0cmEgYXR0cmlidXRlcyBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgRE9NIGVsZW1lbnQgdGhhdFxuICAgIC8vIHdlcmVuJ3QgZm91bmQgb24gdGhlIHRhcmdldCBlbGVtZW50LlxuICAgIHZhciBmcm9tTm9kZUF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgIGZvciAodmFyIGQgPSBmcm9tTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGQgPj0gMDsgZC0tKSB7XG4gICAgICAgIGF0dHIgPSBmcm9tTm9kZUF0dHJzW2RdO1xuICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgYXR0ck5hbWVzcGFjZVVSSSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuXG4gICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuXG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHJhbmdlOyAvLyBDcmVhdGUgYSByYW5nZSBvYmplY3QgZm9yIGVmZmljZW50bHkgcmVuZGVyaW5nIHN0cmluZ3MgdG8gZWxlbWVudHMuXG52YXIgTlNfWEhUTUwgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbnZhciBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogZG9jdW1lbnQ7XG52YXIgSEFTX1RFTVBMQVRFX1NVUFBPUlQgPSAhIWRvYyAmJiAnY29udGVudCcgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG52YXIgSEFTX1JBTkdFX1NVUFBPUlQgPSAhIWRvYyAmJiBkb2MuY3JlYXRlUmFuZ2UgJiYgJ2NyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCcgaW4gZG9jLmNyZWF0ZVJhbmdlKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cikge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudCA9IHJhbmdlLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzdHIpO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cikge1xuICAgIHZhciBmcmFnbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgZnJhZ21lbnQuaW5uZXJIVE1MID0gc3RyO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgYWJvdXQgdGhlIHNhbWVcbiAqIHZhciBodG1sID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhzdHIsICd0ZXh0L2h0bWwnKTtcbiAqIHJldHVybiBodG1sLmJvZHkuZmlyc3RDaGlsZDtcbiAqXG4gKiBAbWV0aG9kIHRvRWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5mdW5jdGlvbiB0b0VsZW1lbnQoc3RyKSB7XG4gICAgc3RyID0gc3RyLnRyaW0oKTtcbiAgICBpZiAoSEFTX1RFTVBMQVRFX1NVUFBPUlQpIHtcbiAgICAgIC8vIGF2b2lkIHJlc3RyaWN0aW9ucyBvbiBjb250ZW50IGZvciB0aGluZ3MgbGlrZSBgPHRyPjx0aD5IaTwvdGg+PC90cj5gIHdoaWNoXG4gICAgICAvLyBjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQgZG9lc24ndCBzdXBwb3J0XG4gICAgICAvLyA8dGVtcGxhdGU+IHN1cHBvcnQgbm90IGF2YWlsYWJsZSBpbiBJRVxuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cik7XG4gICAgfSBlbHNlIGlmIChIQVNfUkFOR0VfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVJhbmdlKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVdyYXAoc3RyKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdHdvIG5vZGUncyBuYW1lcyBhcmUgdGhlIHNhbWUuXG4gKlxuICogTk9URTogV2UgZG9uJ3QgYm90aGVyIGNoZWNraW5nIGBuYW1lc3BhY2VVUklgIGJlY2F1c2UgeW91IHdpbGwgbmV2ZXIgZmluZCB0d28gSFRNTCBlbGVtZW50cyB3aXRoIHRoZSBzYW1lXG4gKiAgICAgICBub2RlTmFtZSBhbmQgZGlmZmVyZW50IG5hbWVzcGFjZSBVUklzLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiIFRoZSB0YXJnZXQgZWxlbWVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZU5vZGVOYW1lcyhmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgZnJvbU5vZGVOYW1lID0gZnJvbUVsLm5vZGVOYW1lO1xuICAgIHZhciB0b05vZGVOYW1lID0gdG9FbC5ub2RlTmFtZTtcbiAgICB2YXIgZnJvbUNvZGVTdGFydCwgdG9Db2RlU3RhcnQ7XG5cbiAgICBpZiAoZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZyb21Db2RlU3RhcnQgPSBmcm9tTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcbiAgICB0b0NvZGVTdGFydCA9IHRvTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcblxuICAgIC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIHZpcnR1YWwgRE9NIG5vZGUgb3IgU1ZHIG5vZGUgdGhlbiB3ZSBtYXlcbiAgICAvLyBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgdGFnIG5hbWUgYmVmb3JlIGNvbXBhcmluZy4gTm9ybWFsIEhUTUwgZWxlbWVudHMgdGhhdCBhcmVcbiAgICAvLyBpbiB0aGUgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCJcbiAgICAvLyBhcmUgY29udmVydGVkIHRvIHVwcGVyIGNhc2VcbiAgICBpZiAoZnJvbUNvZGVTdGFydCA8PSA5MCAmJiB0b0NvZGVTdGFydCA+PSA5NykgeyAvLyBmcm9tIGlzIHVwcGVyIGFuZCB0byBpcyBsb3dlclxuICAgICAgICByZXR1cm4gZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIGlmICh0b0NvZGVTdGFydCA8PSA5MCAmJiBmcm9tQ29kZVN0YXJ0ID49IDk3KSB7IC8vIHRvIGlzIHVwcGVyIGFuZCBmcm9tIGlzIGxvd2VyXG4gICAgICAgIHJldHVybiB0b05vZGVOYW1lID09PSBmcm9tTm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlbGVtZW50LCBvcHRpb25hbGx5IHdpdGggYSBrbm93biBuYW1lc3BhY2UgVVJJLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSBlbGVtZW50IG5hbWUsIGUuZy4gJ2Rpdicgb3IgJ3N2ZydcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZXNwYWNlVVJJXSB0aGUgZWxlbWVudCdzIG5hbWVzcGFjZSBVUkksIGkuZS4gdGhlIHZhbHVlIG9mXG4gKiBpdHMgYHhtbG5zYCBhdHRyaWJ1dGUgb3IgaXRzIGluZmVycmVkIG5hbWVzcGFjZS5cbiAqXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZSwgbmFtZXNwYWNlVVJJKSB7XG4gICAgcmV0dXJuICFuYW1lc3BhY2VVUkkgfHwgbmFtZXNwYWNlVVJJID09PSBOU19YSFRNTCA/XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50KG5hbWUpIDpcbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIG5hbWUpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgY2hpbGRyZW4gb2Ygb25lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgRE9NIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gbW92ZUNoaWxkcmVuKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICB2YXIgbmV4dENoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIHRvRWwuYXBwZW5kQ2hpbGQoY3VyQ2hpbGQpO1xuICAgICAgICBjdXJDaGlsZCA9IG5leHRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHRvRWw7XG59XG5cbmZ1bmN0aW9uIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCBuYW1lKSB7XG4gICAgaWYgKGZyb21FbFtuYW1lXSAhPT0gdG9FbFtuYW1lXSkge1xuICAgICAgICBmcm9tRWxbbmFtZV0gPSB0b0VsW25hbWVdO1xuICAgICAgICBpZiAoZnJvbUVsW25hbWVdKSB7XG4gICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgICBPUFRJT046IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGZyb21FbC5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgdmFyIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgcGFyZW50TmFtZSA9IHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdTRUxFQ1QnICYmICFwYXJlbnROb2RlLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgICAgICAgIGlmIChmcm9tRWwuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpICYmICF0b0VsLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIE1TIEVkZ2UgYnVnIHdoZXJlIHRoZSAnc2VsZWN0ZWQnIGF0dHJpYnV0ZSBjYW4gb25seSBiZVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmVkIGlmIHNldCB0byBhIG5vbi1lbXB0eSB2YWx1ZTpcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvMTIwODc2NzkvXG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gcmVzZXQgc2VsZWN0IGVsZW1lbnQncyBzZWxlY3RlZEluZGV4IHRvIC0xLCBvdGhlcndpc2Ugc2V0dGluZ1xuICAgICAgICAgICAgICAgIC8vIGZyb21FbC5zZWxlY3RlZCB1c2luZyB0aGUgc3luY0Jvb2xlYW5BdHRyUHJvcCBiZWxvdyBoYXMgbm8gZWZmZWN0LlxuICAgICAgICAgICAgICAgIC8vIFRoZSBjb3JyZWN0IHNlbGVjdGVkSW5kZXggd2lsbCBiZSBzZXQgaW4gdGhlIFNFTEVDVCBzcGVjaWFsIGhhbmRsZXIgYmVsb3cuXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdzZWxlY3RlZCcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudCBzaW5jZSBpdCBzZXRzXG4gICAgICogdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCIgYXR0cmlidXRlIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICogXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZSBubyBlZmZlY3Qgc2luY2UgaXQgaXMgb25seSB1c2VkIHRvIHRoZSBzZXQgdGhlXG4gICAgICogaW5pdGlhbCB2YWx1ZS4gIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUsIGFuZCBcImRpc2FibGVkXCIuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2NoZWNrZWQnKTtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFRFWFRBUkVBOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgaWYgKGZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIC8vIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgc2V0cyB0aGUgcGxhY2Vob2xkZXIgYXMgdGhlXG4gICAgICAgICAgICAvLyBub2RlIHZhbHVlIGFuZCB2aXNlIHZlcnNhLiBUaGlzIGlnbm9yZXMgYW4gZW1wdHkgdXBkYXRlLlxuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gZmlyc3RDaGlsZC5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PSBuZXdWYWx1ZSB8fCAoIW5ld1ZhbHVlICYmIG9sZFZhbHVlID09IGZyb21FbC5wbGFjZWhvbGRlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpcnN0Q2hpbGQubm9kZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFNFTEVDVDogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIGlmICghdG9FbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvb3AgdGhyb3VnaCBjaGlsZHJlbiBvZiBmcm9tRWwsIG5vdCB0b0VsIHNpbmNlIG5vZGVzIGNhbiBiZSBtb3ZlZFxuICAgICAgICAgICAgLy8gZnJvbSB0b0VsIHRvIGZyb21FbCBkaXJlY3RseSB3aGVuIG1vcnBoaW5nLlxuICAgICAgICAgICAgLy8gQXQgdGhlIHRpbWUgdGhpcyBzcGVjaWFsIGhhbmRsZXIgaXMgaW52b2tlZCwgYWxsIGNoaWxkcmVuIGhhdmUgYWxyZWFkeSBiZWVuIG1vcnBoZWRcbiAgICAgICAgICAgIC8vIGFuZCBhcHBlbmRlZCB0byAvIHJlbW92ZWQgZnJvbSBmcm9tRWwsIHNvIHVzaW5nIGZyb21FbCBoZXJlIGlzIHNhZmUgYW5kIGNvcnJlY3QuXG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBvcHRncm91cDtcbiAgICAgICAgICAgIHZhciBub2RlTmFtZTtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZSAmJiBjdXJDaGlsZC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRncm91cCA9IGN1ckNoaWxkO1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBlbXB0eSBvcHRncm91cHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGdyb3VwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmcm9tRWwuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEgPSAxMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgcmV0dXJuIChub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgbm9kZS5pZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycykge1xuXG4gIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICB0b05vZGUgPSB0b05vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuXG4gICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uRWxVcGRhdGVkID0gb3B0aW9ucy5vbkVsVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIHNraXBGcm9tQ2hpbGRyZW4gPSBvcHRpb25zLnNraXBGcm9tQ2hpbGRyZW4gfHwgbm9vcDtcbiAgICB2YXIgYWRkQ2hpbGQgPSBvcHRpb25zLmFkZENoaWxkIHx8IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTsgfTtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciBrZXllZFJlbW92YWxMaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBhZGRLZXllZFJlbW92YWwoa2V5KSB7XG4gICAgICBrZXllZFJlbW92YWxMaXN0LnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuXG4gICAgICAgICAgdmFyIGtleSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChza2lwS2V5ZWROb2RlcyAmJiAoa2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCkpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgc2tpcHBpbmcga2V5ZWQgbm9kZXMgdGhlbiB3ZSBhZGQgdGhlIGtleVxuICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVwb3J0IHRoZSBub2RlIGFzIGRpc2NhcmRlZCBpZiBpdCBpcyBub3Qga2V5ZWQuIFdlIGRvIHRoaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGRpc2NhcmQgdGhlbSBpbiBvbmUgZmluYWwgcGFzcy5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJlbW92ZXMgYSBET00gbm9kZSBvdXQgb2YgdGhlIG9yaWdpbmFsIERPTVxuICAgICpcbiAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgKiBAcGFyYW0gIHtOb2RlfSBwYXJlbnROb2RlIFRoZSBub2RlcyBwYXJlbnRcbiAgICAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBLZXllZE5vZGVzIElmIHRydWUgdGhlbiBlbGVtZW50cyB3aXRoIGtleXMgd2lsbCBiZSBza2lwcGVkIGFuZCBub3QgZGlzY2FyZGVkLlxuICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlLCBwYXJlbnROb2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICBvbk5vZGVEaXNjYXJkZWQobm9kZSk7XG4gICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgLy8gICAgICAgICByb290LFxuICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBlbDtcbiAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAvLyAgICAgdmFyIGVsO1xuICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2FsayByZWN1cnNpdmVseVxuICAgICAgICAgIGluZGV4VHJlZShjdXJDaGlsZCk7XG5cbiAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5kZXhUcmVlKGZyb21Ob2RlKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZU5vZGVBZGRlZChlbCkge1xuICAgICAgb25Ob2RlQWRkZWQoZWwpO1xuXG4gICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIHZhciB1bm1hdGNoZWRGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBba2V5XTtcbiAgICAgICAgICAvLyBpZiB3ZSBmaW5kIGEgZHVwbGljYXRlICNpZCBub2RlIGluIGNhY2hlLCByZXBsYWNlIGBlbGAgd2l0aCBjYWNoZSB2YWx1ZVxuICAgICAgICAgIC8vIGFuZCBtb3JwaCBpdCB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICBpZiAodW5tYXRjaGVkRnJvbUVsICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyQ2hpbGQsIHVubWF0Y2hlZEZyb21FbCkpIHtcbiAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FsbCBmb3IgY3VyQ2hpbGQgYW5kIGl0J3MgY2hpbGRyZW4gdG8gc2VlIGlmIHdlIGZpbmQgc29tZXRoaW5nIGluXG4gICAgICAgICAgLy8gZnJvbU5vZGVzTG9va3VwXG4gICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpc1xuICAgICAgLy8gbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkXG4gICAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgaWYgKChjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkpIHtcbiAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcblxuICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBmcm9tTm9kZXNMb29rdXBbdG9FbEtleV07XG4gICAgICB9XG5cbiAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIHZhciBiZWZvcmVVcGRhdGVSZXN1bHQgPSBvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpO1xuICAgICAgICBpZiAoYmVmb3JlVXBkYXRlUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChiZWZvcmVVcGRhdGVSZXN1bHQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIGZyb21FbCA9IGJlZm9yZVVwZGF0ZVJlc3VsdDtcbiAgICAgICAgICAvLyByZWluZGV4IHRoZSBuZXcgZnJvbUVsIGluIGNhc2UgaXQncyBub3QgaW4gdGhlIHNhbWVcbiAgICAgICAgICAvLyB0cmVlIGFzIHRoZSBvcmlnaW5hbCBmcm9tRWxcbiAgICAgICAgICAvLyAoUGhvZW5peCBMaXZlVmlldyBzb21ldGltZXMgcmV0dXJucyBhIGNsb25lZCB0cmVlLFxuICAgICAgICAgIC8vICBidXQga2V5ZWQgbG9va3VwcyB3b3VsZCBzdGlsbCBwb2ludCB0byB0aGUgb3JpZ2luYWwgdHJlZSlcbiAgICAgICAgICBpbmRleFRyZWUoZnJvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50IGZpcnN0XG4gICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgb25FbFVwZGF0ZWQoZnJvbUVsKTtcblxuICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbUVsLm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXJzLlRFWFRBUkVBKGZyb21FbCwgdG9FbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgIHZhciBza2lwRnJvbSA9IHNraXBGcm9tQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuXG4gICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG5cbiAgICAgIC8vIHdhbGsgdGhlIGNoaWxkcmVuXG4gICAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgY3VyVG9Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgLy8gd2FsayB0aGUgZnJvbU5vZGUgY2hpbGRyZW4gYWxsIHRoZSB3YXkgdGhyb3VnaFxuICAgICAgICB3aGlsZSAoIXNraXBGcm9tICYmIGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgLy8gdGhpcyBtZWFucyBpZiB0aGUgY3VyRnJvbU5vZGVDaGlsZCBkb2VzbnQgaGF2ZSBhIG1hdGNoIHdpdGggdGhlIGN1clRvTm9kZUNoaWxkXG4gICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZUNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuXG4gICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGFyZ2V0IG5vZGUgaGFzIGEga2V5IHNvIHdlIHdhbnQgdG8gbWF0Y2ggaXQgdXAgd2l0aCB0aGUgY29ycmVjdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBzaW5nbGUgZWxlbWVudCByZW1vdmFscy4gVG8gYXZvaWQgcmVtb3ZpbmcgdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIG5vZGUgb3V0IG9mIHRoZSB0cmVlIChzaW5jZSB0aGF0IGNhbiBicmVhayBDU1MgdHJhbnNpdGlvbnMsIGV0Yy4pLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpb24gdG8gcHJvcGVybHkgbWF0Y2ggdXAgdGhlIGtleWVkIHRhcmdldCBlbGVtZW50IHdpdGggaXRzIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgIC8vIExldCdzIG1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gaXQuXG5cbiAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSB1c2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgcmVwbGFjZUNoaWxkIGJlY2F1c2Ugd2Ugd2FudCB0byBnbyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGxpZmVjeWNsZSBob29rcyBhcmUgY29ycmVjdGx5IGludm9rZWRcbiAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG1hdGNoaW5nRnJvbUVsO1xuICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5vZGVzIGFyZSBub3QgY29tcGF0aWJsZSBzaW5jZSB0aGUgXCJ0b1wiIG5vZGUgaGFzIGEga2V5IGFuZCB0aGVyZVxuICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHwgY3VyRnJvbU5vZGVUeXBlID09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRvIGFzIHdlIGFscmVhZHkgcmVjdXJzaXZlbHkgY2FsbGVkIG1vcnBoQ2hpbGRyZW4gYWJvdmVcbiAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgLy8gbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTS4gSG93ZXZlciwgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSBmcm9tIG5vZGUgaXMgbm90IGtleWVkXG4gICAgICAgICAgLy8gc2luY2UgaXQgaXMgcG9zc2libGUgdGhhdCBhIGtleWVkIG5vZGUgbWlnaHQgbWF0Y2ggdXAgd2l0aCBhIG5vZGUgc29tZXdoZXJlIGVsc2UgaW4gdGhlXG4gICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAvLyBob21lIGluIHRoZSBmaW5hbCBET00gdHJlZS4gQWZ0ZXIgZXZlcnl0aGluZyBpcyBkb25lIHdlIHdpbGwgcmVtb3ZlIGFueSBrZXllZCBub2Rlc1xuICAgICAgICAgIC8vIHRoYXQgZGlkbid0IGZpbmQgYSBob21lXG4gICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgIH0gLy8gRU5EOiB3aGlsZShjdXJGcm9tTm9kZUNoaWxkKSB7fVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICBpZighc2tpcEZyb20peyBhZGRDaGlsZChmcm9tRWwsIG1hdGNoaW5nRnJvbUVsKTsgfVxuICAgICAgICAgIG1vcnBoRWwobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENoaWxkKGZyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIGNsZWFudXBGcm9tRWwoZnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBjdXJGcm9tTm9kZUtleSk7XG5cbiAgICAgIHZhciBzcGVjaWFsRWxIYW5kbGVyID0gc3BlY2lhbEVsSGFuZGxlcnNbZnJvbUVsLm5vZGVOYW1lXTtcbiAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXIoZnJvbUVsLCB0b0VsKTtcbiAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhDaGlsZHJlbiguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgLy8gY29tcGF0aWJsZSAoZS5nLiA8ZGl2PiAtLT4gPHNwYW4+IG9yIDxkaXY+IC0tPiBURVhUKVxuICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICBpZiAoIWNvbXBhcmVOb2RlTmFtZXMoZnJvbU5vZGUsIHRvTm9kZSkpIHtcbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vdmVDaGlsZHJlbihmcm9tTm9kZSwgY3JlYXRlRWxlbWVudE5TKHRvTm9kZS5ub2RlTmFtZSwgdG9Ob2RlLm5hbWVzcGFjZVVSSSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBtb3JwaGVkTm9kZVR5cGUpIHtcbiAgICAgICAgICBpZiAobW9ycGhlZE5vZGUubm9kZVZhbHVlICE9PSB0b05vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUZXh0IG5vZGUgdG8gc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb3JwaGVkTm9kZSA9PT0gdG9Ob2RlKSB7XG4gICAgICAvLyBUaGUgXCJ0byBub2RlXCIgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIFwiZnJvbSBub2RlXCIgc28gd2UgaGFkIHRvXG4gICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgLy8gV2Ugbm93IG5lZWQgdG8gbG9vcCBvdmVyIGFueSBrZXllZCBub2RlcyB0aGF0IG1pZ2h0IG5lZWQgdG8gYmVcbiAgICAgIC8vIHJlbW92ZWQuIFdlIG9ubHkgZG8gdGhlIHJlbW92YWwgaWYgd2Uga25vdyB0aGF0IHRoZSBrZXllZCBub2RlXG4gICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgLy8gaXQgb3V0IG9mIGZyb21Ob2Rlc0xvb2t1cCBhbmQgd2UgdXNlIGZyb21Ob2Rlc0xvb2t1cCB0byBkZXRlcm1pbmVcbiAgICAgIC8vIGlmIGEga2V5ZWQgbm9kZSBoYXMgYmVlbiBtYXRjaGVkIHVwIG9yIG5vdFxuICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49a2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxUb1JlbW92ZSA9IGZyb21Ob2Rlc0xvb2t1cFtrZXllZFJlbW92YWxMaXN0W2ldXTtcbiAgICAgICAgICBpZiAoZWxUb1JlbW92ZSkge1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgaWYgKG1vcnBoZWROb2RlLmFjdHVhbGl6ZSkge1xuICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgfTtcbn1cblxudmFyIG1vcnBoZG9tID0gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3JwaGRvbTtcbiIsICJpbXBvcnQge1xuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfUFJVTkUsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NLSVAsXG4gIFBIWF9NQUdJQ19JRCxcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSSUdHRVJfQUNUSU9OLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfU1RSRUFNLFxuICBQSFhfU1RSRUFNX1JFRixcbiAgUEhYX1ZJRVdQT1JUX1RPUCxcbiAgUEhYX1ZJRVdQT1JUX0JPVFRPTSxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgZGV0ZWN0RHVwbGljYXRlSWRzLFxuICBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyxcbiAgaXNDaWRcbn0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IEVsZW1lbnRSZWYgZnJvbSBcIi4vZWxlbWVudF9yZWZcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IERPTVBvc3RNb3JwaFJlc3RvcmVyIGZyb20gXCIuL2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyXCJcbmltcG9ydCBtb3JwaGRvbSBmcm9tIFwibW9ycGhkb21cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBET01QYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHZpZXcsIGNvbnRhaW5lciwgaWQsIGh0bWwsIHN0cmVhbXMsIHRhcmdldENJRCwgb3B0cz17fSl7XG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyXG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy5yb290SUQgPSB2aWV3LnJvb3QuaWRcbiAgICB0aGlzLmh0bWwgPSBodG1sXG4gICAgdGhpcy5zdHJlYW1zID0gc3RyZWFtc1xuICAgIHRoaXMuc3RyZWFtSW5zZXJ0cyA9IHt9XG4gICAgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlID0ge31cbiAgICB0aGlzLnRhcmdldENJRCA9IHRhcmdldENJRFxuICAgIHRoaXMuY2lkUGF0Y2ggPSBpc0NpZCh0aGlzLnRhcmdldENJRClcbiAgICB0aGlzLnBlbmRpbmdSZW1vdmVzID0gW11cbiAgICB0aGlzLnBoeFJlbW92ZSA9IHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgdGhpcy50YXJnZXRDb250YWluZXIgPSB0aGlzLmlzQ0lEUGF0Y2goKSA/IHRoaXMudGFyZ2V0Q0lEQ29udGFpbmVyKGh0bWwpIDogY29udGFpbmVyXG4gICAgdGhpcy5jYWxsYmFja3MgPSB7XG4gICAgICBiZWZvcmVhZGRlZDogW10sIGJlZm9yZXVwZGF0ZWQ6IFtdLCBiZWZvcmVwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVyYWRkZWQ6IFtdLCBhZnRlcnVwZGF0ZWQ6IFtdLCBhZnRlcmRpc2NhcmRlZDogW10sIGFmdGVycGh4Q2hpbGRBZGRlZDogW10sXG4gICAgICBhZnRlcnRyYW5zaXRpb25zRGlzY2FyZGVkOiBbXVxuICAgIH1cbiAgICB0aGlzLndpdGhDaGlsZHJlbiA9IG9wdHMud2l0aENoaWxkcmVuIHx8IG9wdHMudW5kb1JlZiB8fCBmYWxzZVxuICAgIHRoaXMudW5kb1JlZiA9IG9wdHMudW5kb1JlZlxuICB9XG5cbiAgYmVmb3JlKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGJlZm9yZSR7a2luZH1gXS5wdXNoKGNhbGxiYWNrKSB9XG4gIGFmdGVyKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cblxuICB0cmFja0JlZm9yZShraW5kLCAuLi5hcmdzKXtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICB0cmFja0FmdGVyKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BhZnRlciR7a2luZH1gXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKVxuICB9XG5cbiAgbWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKXtcbiAgICBsZXQgcGh4VXBkYXRlID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSlcbiAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT1hcHBlbmRdID4gKiwgWyR7cGh4VXBkYXRlfT1wcmVwZW5kXSA+ICpgLCBlbCA9PiB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1BSVU5FLCBcIlwiKVxuICAgIH0pXG4gIH1cblxuICBwZXJmb3JtKGlzSm9pblBhdGNoKXtcbiAgICBsZXQge3ZpZXcsIGxpdmVTb2NrZXQsIGh0bWwsIGNvbnRhaW5lcn0gPSB0aGlzXG4gICAgbGV0IHRhcmdldENvbnRhaW5lciA9IHRoaXMudGFyZ2V0Q29udGFpbmVyXG4gICAgaWYodGhpcy5pc0NJRFBhdGNoKCkgJiYgIXRhcmdldENvbnRhaW5lcil7IHJldHVybiB9XG5cbiAgICBpZih0aGlzLmlzQ0lEUGF0Y2goKSl7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9wdWxsLzM5NDJcbiAgICAgIC8vIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgbm8gcGFyZW50IGlzIGxvY2tlZFxuICAgICAgY29uc3QgY2xvc2VzdExvY2sgPSB0YXJnZXRDb250YWluZXIuY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKVxuICAgICAgaWYoY2xvc2VzdExvY2spe1xuICAgICAgICBjb25zdCBjbG9uZWRUcmVlID0gRE9NLnByaXZhdGUoY2xvc2VzdExvY2ssIFBIWF9SRUZfTE9DSylcbiAgICAgICAgaWYoY2xvbmVkVHJlZSl7XG4gICAgICAgICAgLy8gaWYgYSBwYXJlbnQgaXMgbG9ja2VkIHdpdGggYSBjbG9uZWQgdHJlZSwgd2UgbmVlZCB0byBwYXRjaCB0aGUgY2xvbmVkIHRyZWUgaW5zdGVhZFxuICAgICAgICAgIHRhcmdldENvbnRhaW5lciA9IGNsb25lZFRyZWUucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGBbZGF0YS1waHgtY29tcG9uZW50PVwiJHt0aGlzLnRhcmdldENJRH1cIl1gLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBmb2N1c2VkID0gbGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBsZXQge3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmR9ID0gZm9jdXNlZCAmJiBET00uaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkgPyBmb2N1c2VkIDoge31cbiAgICBsZXQgcGh4VXBkYXRlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9VUERBVEUpXG4gICAgbGV0IHBoeFZpZXdwb3J0VG9wID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9WSUVXUE9SVF9UT1ApXG4gICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgbGV0IHBoeFRyaWdnZXJFeHRlcm5hbCA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfVFJJR0dFUl9BQ1RJT04pXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBsZXQgdXBkYXRlcyA9IFtdXG4gICAgbGV0IGFwcGVuZFByZXBlbmRVcGRhdGVzID0gW11cblxuICAgIGxldCBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBudWxsXG5cbiAgICBmdW5jdGlvbiBtb3JwaCh0YXJnZXRDb250YWluZXIsIHNvdXJjZSwgd2l0aENoaWxkcmVuPXRoaXMud2l0aENoaWxkcmVuKXtcbiAgICAgIGxldCBtb3JwaENhbGxiYWNrcyA9IHtcbiAgICAgICAgLy8gbm9ybWFsbHksIHdlIGFyZSBydW5uaW5nIHdpdGggY2hpbGRyZW5Pbmx5LCBhcyB0aGUgcGF0Y2ggSFRNTCBmb3IgYSBMVlxuICAgICAgICAvLyBkb2VzIG5vdCBpbmNsdWRlIHRoZSBMViBhdHRycyAoZGF0YS1waHgtc2Vzc2lvbiwgZXRjLilcbiAgICAgICAgLy8gd2hlbiB3ZSBhcmUgcGF0Y2hpbmcgYSBsaXZlIGNvbXBvbmVudCwgd2UgZG8gd2FudCB0byBwYXRjaCB0aGUgcm9vdCBlbGVtZW50IGFzIHdlbGw7XG4gICAgICAgIC8vIGFub3RoZXIgY2FzZSBpcyB0aGUgcmVjdXJzaXZlIHBhdGNoIG9mIGEgc3RyZWFtIGl0ZW0gdGhhdCB3YXMga2VwdCBvbiByZXNldCAoLT4gb25CZWZvcmVOb2RlQWRkZWQpXG4gICAgICAgIGNoaWxkcmVuT25seTogdGFyZ2V0Q29udGFpbmVyLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSA9PT0gbnVsbCAmJiAhd2l0aENoaWxkcmVuLFxuICAgICAgICBnZXROb2RlS2V5OiAobm9kZSkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc1BoeERlc3Ryb3llZChub2RlKSl7IHJldHVybiBudWxsIH1cbiAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgam9pbiBwYXRjaCwgdGhlbiBieSBkZWZpbml0aW9uIHRoZXJlIHdhcyBubyBQSFhfTUFHSUNfSUQuXG4gICAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gcmVkdWNlIHRoZSBhbW91bnQgb2YgZWxlbWVudHMgbW9ycGhkb20gZGlzY2FyZHMuXG4gICAgICAgICAgaWYoaXNKb2luUGF0Y2gpeyByZXR1cm4gbm9kZS5pZCB9XG4gICAgICAgICAgcmV0dXJuIG5vZGUuaWQgfHwgKG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9NQUdJQ19JRCkpXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNraXAgaW5kZXhpbmcgZnJvbSBjaGlsZHJlbiB3aGVuIGNvbnRhaW5lciBpcyBzdHJlYW1cbiAgICAgICAgc2tpcEZyb21DaGlsZHJlbjogKGZyb20pID0+IHsgcmV0dXJuIGZyb20uZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkgPT09IFBIWF9TVFJFQU0gfSxcbiAgICAgICAgLy8gdGVsbCBtb3JwaGRvbSBob3cgdG8gYWRkIGEgY2hpbGRcbiAgICAgICAgYWRkQ2hpbGQ6IChwYXJlbnQsIGNoaWxkKSA9PiB7XG4gICAgICAgICAgbGV0IHtyZWYsIHN0cmVhbUF0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGNoaWxkKVxuICAgICAgICAgIGlmKHJlZiA9PT0gdW5kZWZpbmVkKXsgcmV0dXJuIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCkgfVxuXG4gICAgICAgICAgdGhpcy5zZXRTdHJlYW1SZWYoY2hpbGQsIHJlZilcblxuICAgICAgICAgIC8vIHN0cmVhbWluZ1xuICAgICAgICAgIGlmKHN0cmVhbUF0ID09PSAwKXtcbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGNoaWxkKVxuICAgICAgICAgIH0gZWxzZSBpZihzdHJlYW1BdCA9PT0gLTEpe1xuICAgICAgICAgICAgbGV0IGxhc3RDaGlsZCA9IHBhcmVudC5sYXN0RWxlbWVudENoaWxkXG4gICAgICAgICAgICBpZihsYXN0Q2hpbGQgJiYgIWxhc3RDaGlsZC5oYXNBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYpKXtcbiAgICAgICAgICAgICAgbGV0IG5vblN0cmVhbUNoaWxkID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmQoYyA9PiAhYy5oYXNBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYpKVxuICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBub25TdHJlYW1DaGlsZClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYoc3RyZWFtQXQgPiAwKXtcbiAgICAgICAgICAgIGxldCBzaWJsaW5nID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pW3N0cmVhbUF0XVxuICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgc2libGluZylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlTm9kZUFkZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBET00ubWFpbnRhaW5Qcml2YXRlSG9va3MoZWwsIGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGVsKVxuXG4gICAgICAgICAgbGV0IG1vcnBoZWRFbCA9IGVsXG4gICAgICAgICAgLy8gdGhpcyBpcyBhIHN0cmVhbSBpdGVtIHRoYXQgd2FzIGtlcHQgb24gcmVzZXQsIHJlY3Vyc2l2ZWx5IG1vcnBoIGl0XG4gICAgICAgICAgaWYodGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2VsLmlkXSl7XG4gICAgICAgICAgICBtb3JwaGVkRWwgPSB0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmVbZWwuaWRdXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2VsLmlkXVxuICAgICAgICAgICAgbW9ycGguY2FsbCh0aGlzLCBtb3JwaGVkRWwsIGVsLCB0cnVlKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkRWxcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGVsLCB0cnVlKSB9XG5cbiAgICAgICAgICAvLyBoYWNrIHRvIGZpeCBTYWZhcmkgaGFuZGxpbmcgb2YgaW1nIHNyY3NldCBhbmQgdmlkZW8gdGFnc1xuICAgICAgICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCAmJiBlbC5zcmNzZXQpe1xuICAgICAgICAgICAgZWwuc3Jjc2V0ID0gZWwuc3Jjc2V0XG4gICAgICAgICAgfSBlbHNlIGlmKGVsIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCAmJiBlbC5hdXRvcGxheSl7XG4gICAgICAgICAgICBlbC5wbGF5KClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKSl7XG4gICAgICAgICAgICBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBlbFxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoKERPTS5pc1BoeENoaWxkKGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsKSkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsLnBhcmVudE5vZGUpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcInBoeENoaWxkQWRkZWRcIiwgZWwpXG4gICAgICAgICAgfVxuICAgICAgICAgIGFkZGVkLnB1c2goZWwpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZURpc2NhcmRlZDogKGVsKSA9PiB0aGlzLm9uTm9kZURpc2NhcmRlZChlbCksXG4gICAgICAgIG9uQmVmb3JlTm9kZURpc2NhcmRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfUFJVTkUpICE9PSBudWxsKXsgcmV0dXJuIHRydWUgfVxuICAgICAgICAgIGlmKGVsLnBhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgZWwuaWQgJiZcbiAgICAgICAgICAgIERPTS5pc1BoeFVwZGF0ZShlbC5wYXJlbnRFbGVtZW50LCBwaHhVcGRhdGUsIFtQSFhfU1RSRUFNLCBcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZih0aGlzLm1heWJlUGVuZGluZ1JlbW92ZShlbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcoZWwpKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uRWxVcGRhdGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwZGF0ZXMucHVzaChlbClcbiAgICAgICAgICB0aGlzLm1heWJlUmVPcmRlclN0cmVhbShlbCwgZmFsc2UpXG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlRWxVcGRhdGVkOiAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICAgICAgLy8gaWYgd2UgYXJlIHBhdGNoaW5nIHRoZSByb290IHRhcmdldCBjb250YWluZXIgYW5kIHRoZSBpZCBoYXMgY2hhbmdlZCwgdHJlYXQgaXQgYXMgYSBuZXcgbm9kZVxuICAgICAgICAgIC8vIGJ5IHJlcGxhY2luZyB0aGUgZnJvbUVsIHdpdGggdGhlIHRvRWwsIHdoaWNoIGVuc3VyZXMgaG9va3MgYXJlIHRvcm4gZG93biBhbmQgcmUtY3JlYXRlZFxuICAgICAgICAgIGlmKGZyb21FbC5pZCAmJiBmcm9tRWwuaXNTYW1lTm9kZSh0YXJnZXRDb250YWluZXIpICYmIGZyb21FbC5pZCAhPT0gdG9FbC5pZCl7XG4gICAgICAgICAgICBtb3JwaENhbGxiYWNrcy5vbk5vZGVEaXNjYXJkZWQoZnJvbUVsKVxuICAgICAgICAgICAgZnJvbUVsLnJlcGxhY2VXaXRoKHRvRWwpXG4gICAgICAgICAgICByZXR1cm4gbW9ycGhDYWxsYmFja3Mub25Ob2RlQWRkZWQodG9FbClcbiAgICAgICAgICB9XG4gICAgICAgICAgRE9NLnN5bmNQZW5kaW5nQXR0cnMoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgIERPTS5tYWludGFpblByaXZhdGVIb29rcyhmcm9tRWwsIHRvRWwsIHBoeFZpZXdwb3J0VG9wLCBwaHhWaWV3cG9ydEJvdHRvbSlcbiAgICAgICAgICBET00uY2xlYW5DaGlsZE5vZGVzKHRvRWwsIHBoeFVwZGF0ZSlcbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKHRvRWwpKXtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSBsaXZlIGNvbXBvbmVudCB1c2VkIGluIGEgc3RyZWFtLCB3ZSBtYXkgbmVlZCB0byByZW9yZGVyIGl0XG4gICAgICAgICAgICB0aGlzLm1heWJlUmVPcmRlclN0cmVhbShmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzUGh4U3RpY2t5KGZyb21FbCkpe1xuICAgICAgICAgICAgW1BIWF9TRVNTSU9OLCBQSFhfU1RBVElDLCBQSFhfUk9PVF9JRF1cbiAgICAgICAgICAgICAgLm1hcChhdHRyID0+IFthdHRyLCBmcm9tRWwuZ2V0QXR0cmlidXRlKGF0dHIpLCB0b0VsLmdldEF0dHJpYnV0ZShhdHRyKV0pXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChbYXR0ciwgZnJvbVZhbCwgdG9WYWxdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodG9WYWwgJiYgZnJvbVZhbCAhPT0gdG9WYWwpeyBmcm9tRWwuc2V0QXR0cmlidXRlKGF0dHIsIHRvVmFsKSB9XG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNJZ25vcmVkKGZyb21FbCwgcGh4VXBkYXRlKSB8fCAoZnJvbUVsLmZvcm0gJiYgZnJvbUVsLmZvcm0uaXNTYW1lTm9kZShleHRlcm5hbEZvcm1UcmlnZ2VyZWQpKSl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IERPTS5pc0lnbm9yZWQoZnJvbUVsLCBwaHhVcGRhdGUpfSlcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihmcm9tRWwudHlwZSA9PT0gXCJudW1iZXJcIiAmJiAoZnJvbUVsLnZhbGlkaXR5ICYmIGZyb21FbC52YWxpZGl0eS5iYWRJbnB1dCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGhhcyBQSFhfUkVGX1NSQywgaXQgaXMgbG9hZGluZyBvciBsb2NrZWQgYW5kIGF3YWl0aW5nIGFuIGFjay5cbiAgICAgICAgICAvLyBJZiBpdCdzIGxvY2tlZCwgd2UgY2xvbmUgdGhlIGZyb21FbCB0cmVlIGFuZCBpbnN0cnVjdCBtb3JwaGRvbSB0byB1c2VcbiAgICAgICAgICAvLyB0aGUgY2xvbmVkIHRyZWUgYXMgdGhlIHNvdXJjZSBvZiB0aGUgbW9ycGggZm9yIHRoaXMgYnJhbmNoIGZyb20gaGVyZSBvbiBvdXQuXG4gICAgICAgICAgLy8gV2Uga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgY2xvbmVkIHRyZWUgaW4gdGhlIGVsZW1lbnQncyBwcml2YXRlIGRhdGEsIGFuZFxuICAgICAgICAgIC8vIG9uIGFjayAodmlldy51bmRvUmVmcyksIHdlIG1vcnBoIHRoZSBjbG9uZWQgdHJlZSB3aXRoIHRoZSB0cnVlIGZyb21FbCBpbiB0aGUgRE9NIHRvXG4gICAgICAgICAgLy8gYXBwbHkgYW55IGNoYW5nZXMgdGhhdCBoYXBwZW5lZCB3aGlsZSB0aGUgZWxlbWVudCB3YXMgbG9ja2VkLlxuICAgICAgICAgIGxldCBpc0ZvY3VzZWRGb3JtRWwgPSBmb2N1c2VkICYmIGZyb21FbC5pc1NhbWVOb2RlKGZvY3VzZWQpICYmIERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpXG4gICAgICAgICAgbGV0IGZvY3VzZWRTZWxlY3RDaGFuZ2VkID0gaXNGb2N1c2VkRm9ybUVsICYmIHRoaXMuaXNDaGFuZ2VkU2VsZWN0KGZyb21FbCwgdG9FbClcbiAgICAgICAgICBpZihmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfU1JDKSl7XG4gICAgICAgICAgICBjb25zdCByZWYgPSBuZXcgRWxlbWVudFJlZihmcm9tRWwpXG4gICAgICAgICAgICAvLyBvbmx5IHBlcmZvcm0gdGhlIGNsb25lIHN0ZXAgaWYgdGhpcyBpcyBub3QgYSBwYXRjaCB0aGF0IHVubG9ja3NcbiAgICAgICAgICAgIGlmKHJlZi5sb2NrUmVmICYmICghdGhpcy51bmRvUmVmIHx8ICFyZWYuaXNMb2NrVW5kb25lQnkodGhpcy51bmRvUmVmKSkpe1xuICAgICAgICAgICAgICBpZihET00uaXNVcGxvYWRJbnB1dChmcm9tRWwpKXtcbiAgICAgICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IHRydWV9KVxuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgICBsZXQgaXNMb2NrZWQgPSBmcm9tRWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcbiAgICAgICAgICAgICAgbGV0IGNsb25lID0gaXNMb2NrZWQgPyBET00ucHJpdmF0ZShmcm9tRWwsIFBIWF9SRUZfTE9DSykgfHwgZnJvbUVsLmNsb25lTm9kZSh0cnVlKSA6IG51bGxcbiAgICAgICAgICAgICAgaWYoY2xvbmUpe1xuICAgICAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGZyb21FbCwgUEhYX1JFRl9MT0NLLCBjbG9uZSlcbiAgICAgICAgICAgICAgICBpZighaXNGb2N1c2VkRm9ybUVsKXtcbiAgICAgICAgICAgICAgICAgIGZyb21FbCA9IGNsb25lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZCh0b0VsKSl7XG4gICAgICAgICAgICBsZXQgcHJldlNlc3Npb24gPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKVxuICAgICAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7ZXhjbHVkZTogW1BIWF9TVEFUSUNdfSlcbiAgICAgICAgICAgIGlmKHByZXZTZXNzaW9uICE9PSBcIlwiKXsgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgcHJldlNlc3Npb24pIH1cbiAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdElEKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpZiB3ZSBhcmUgdW5kb2luZyBhIGxvY2ssIGNvcHkgcG90ZW50aWFsbHkgbmVzdGVkIGNsb25lcyBvdmVyXG4gICAgICAgICAgaWYodGhpcy51bmRvUmVmICYmIERPTS5wcml2YXRlKHRvRWwsIFBIWF9SRUZfTE9DSykpe1xuICAgICAgICAgICAgRE9NLnB1dFByaXZhdGUoZnJvbUVsLCBQSFhfUkVGX0xPQ0ssIERPTS5wcml2YXRlKHRvRWwsIFBIWF9SRUZfTE9DSykpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyBjb3B5IHJlZ3VsYXIgRE9NLnByaXZhdGUgZGF0YVxuICAgICAgICAgIERPTS5jb3B5UHJpdmF0ZXModG9FbCwgZnJvbUVsKVxuXG4gICAgICAgICAgLy8gc2tpcCBwYXRjaGluZyBmb2N1c2VkIGlucHV0cyB1bmxlc3MgZm9jdXMgaXMgYSBzZWxlY3QgdGhhdCBoYXMgY2hhbmdlZCBvcHRpb25zXG4gICAgICAgICAgaWYoaXNGb2N1c2VkRm9ybUVsICYmIGZyb21FbC50eXBlICE9PSBcImhpZGRlblwiICYmICFmb2N1c2VkU2VsZWN0Q2hhbmdlZCl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VGb2N1c2VkSW5wdXQoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLnN5bmNBdHRyc1RvUHJvcHMoZnJvbUVsKVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJsdXIgZm9jdXNlZCBzZWxlY3QgaWYgaXQgY2hhbmdlZCBzbyBuYXRpdmUgVUkgaXMgdXBkYXRlZCAoaWUgc2FmYXJpIHdvbid0IHVwZGF0ZSB2aXNpYmxlIG9wdGlvbnMpXG4gICAgICAgICAgICBpZihmb2N1c2VkU2VsZWN0Q2hhbmdlZCl7IGZyb21FbC5ibHVyKCkgfVxuICAgICAgICAgICAgaWYoRE9NLmlzUGh4VXBkYXRlKHRvRWwsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgICAgICAgICBhcHBlbmRQcmVwZW5kVXBkYXRlcy5wdXNoKG5ldyBET01Qb3N0TW9ycGhSZXN0b3Jlcihmcm9tRWwsIHRvRWwsIHRvRWwuZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyh0b0VsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyh0b0VsKVxuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgcmV0dXJuIGZyb21FbFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbW9ycGhkb20odGFyZ2V0Q29udGFpbmVyLCBzb3VyY2UsIG1vcnBoQ2FsbGJhY2tzKVxuICAgIH1cblxuICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBjb250YWluZXIpXG4gICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgY29udGFpbmVyLCBjb250YWluZXIpXG5cbiAgICBsaXZlU29ja2V0LnRpbWUoXCJtb3JwaGRvbVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0cmVhbXMuZm9yRWFjaCgoW3JlZiwgaW5zZXJ0cywgZGVsZXRlSWRzLCByZXNldF0pID0+IHtcbiAgICAgICAgaW5zZXJ0cy5mb3JFYWNoKChba2V5LCBzdHJlYW1BdCwgbGltaXRdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdHJlYW1JbnNlcnRzW2tleV0gPSB7cmVmLCBzdHJlYW1BdCwgbGltaXQsIHJlc2V0fVxuICAgICAgICB9KVxuICAgICAgICBpZihyZXNldCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICBET00uYWxsKGNvbnRhaW5lciwgYFske1BIWF9TVFJFQU1fUkVGfT1cIiR7cmVmfVwiXWAsIGNoaWxkID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlSWRzLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2lkfVwiXWApXG4gICAgICAgICAgaWYoY2hpbGQpeyB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkgfVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8gY2xlYXIgc3RyZWFtIGl0ZW1zIGZyb20gdGhlIGRlYWQgcmVuZGVyIGlmIHRoZXkgYXJlIG5vdCBpbnNlcnRlZCBhZ2FpblxuICAgICAgaWYoaXNKb2luUGF0Y2gpe1xuICAgICAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBgWyR7cGh4VXBkYXRlfT0ke1BIWF9TVFJFQU19XWApXG4gICAgICAgICAgLy8gaXQgaXMgaW1wb3J0YW50IHRvIGZpbHRlciB0aGUgZWxlbWVudCBiZWZvcmUgcmVtb3ZpbmcgdGhlbSwgYXNcbiAgICAgICAgICAvLyBpdCBtYXkgaGFwcGVuIHRoYXQgc3RyZWFtcyBhcmUgbmVzdGVkIGFuZCB0aGUgb3duZXIgY2hlY2sgZmFpbHMgaWZcbiAgICAgICAgICAvLyBhIHBhcmVudCBpcyByZW1vdmVkIGJlZm9yZSBhIGNoaWxkXG4gICAgICAgICAgLmZpbHRlcihlbCA9PiB0aGlzLnZpZXcub3duc0VsZW1lbnQoZWwpKVxuICAgICAgICAgIC5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oZWwuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAvLyB3ZSBhbHJlYWR5IHBlcmZvcm1lZCB0aGUgb3duZXIgY2hlY2ssIGVhY2ggY2hpbGQgaXMgZ3VhcmFudGVlZCB0byBiZSBvd25lZFxuICAgICAgICAgICAgICAvLyBieSB0aGUgdmlldy4gVG8gcHJldmVudCB0aGUgbmVzdGVkIG93bmVyIGNoZWNrIGZyb20gZmFpbGluZyBpbiBjYXNlIG9mIG5lc3RlZFxuICAgICAgICAgICAgICAvLyBzdHJlYW1zIHdoZXJlIHRoZSBwYXJlbnQgaXMgcmVtb3ZlZCBiZWZvcmUgdGhlIGNoaWxkLCB3ZSBmb3JjZSB0aGUgcmVtb3ZhbFxuICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCwgdHJ1ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgbW9ycGguY2FsbCh0aGlzLCB0YXJnZXRDb250YWluZXIsIGh0bWwpXG4gICAgfSlcblxuICAgIGlmKGxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgICBkZXRlY3REdXBsaWNhdGVJZHMoKVxuICAgICAgZGV0ZWN0SW52YWxpZFN0cmVhbUluc2VydHModGhpcy5zdHJlYW1JbnNlcnRzKVxuICAgICAgLy8gd2FybiBpZiB0aGVyZSBhcmUgYW55IGlucHV0cyBuYW1lZCBcImlkXCJcbiAgICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWU9aWRdXCIpKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBpZihub2RlLmZvcm0pe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJEZXRlY3RlZCBhbiBpbnB1dCB3aXRoIG5hbWU9XFxcImlkXFxcIiBpbnNpZGUgYSBmb3JtISBUaGlzIHdpbGwgY2F1c2UgcHJvYmxlbXMgd2hlbiBwYXRjaGluZyB0aGUgRE9NLlxcblwiLCBub2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGFwcGVuZFByZXBlbmRVcGRhdGVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50aW1lKFwicG9zdC1tb3JwaCBhcHBlbmQvcHJlcGVuZCByZXN0b3JhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLmZvckVhY2godXBkYXRlID0+IHVwZGF0ZS5wZXJmb3JtKCkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxpdmVTb2NrZXQuc2lsZW5jZUV2ZW50cygoKSA9PiBET00ucmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpKVxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGRvY3VtZW50LCBcInBoeDp1cGRhdGVcIilcbiAgICBhZGRlZC5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcImFkZGVkXCIsIGVsKSlcbiAgICB1cGRhdGVzLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwidXBkYXRlZFwiLCBlbCkpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25QZW5kaW5nUmVtb3ZlcygpXG5cbiAgICBpZihleHRlcm5hbEZvcm1UcmlnZ2VyZWQpe1xuICAgICAgbGl2ZVNvY2tldC51bmxvYWQoKVxuICAgICAgLy8gY2hlY2sgZm9yIHN1Ym1pdHRlciBhbmQgaW5qZWN0IGl0IGFzIGhpZGRlbiBpbnB1dCBmb3IgZXh0ZXJuYWwgc3VibWl0O1xuICAgICAgLy8gSW4gdGhlb3J5LCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB0aGUgc3RvcmVkIHN1Ym1pdHRlciBpcyBvdXRkYXRlZCBhbmQgZG9lc24ndFxuICAgICAgLy8gZXhpc3QgaW4gdGhlIERPTSBhbnkgbW9yZSwgYnV0IHRoaXMgaXMgdW5saWtlbHksIHNvIHdlIGp1c3QgYWNjZXB0IGl0IGZvciBub3cuXG4gICAgICBjb25zdCBzdWJtaXR0ZXIgPSBET00ucHJpdmF0ZShleHRlcm5hbEZvcm1UcmlnZ2VyZWQsIFwic3VibWl0dGVyXCIpXG4gICAgICBpZihzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUgJiYgdGFyZ2V0Q29udGFpbmVyLmNvbnRhaW5zKHN1Ym1pdHRlcikpe1xuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgICAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIlxuICAgICAgICBjb25zdCBmb3JtSWQgPSBzdWJtaXR0ZXIuZ2V0QXR0cmlidXRlKFwiZm9ybVwiKVxuICAgICAgICBpZihmb3JtSWQpe1xuICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImZvcm1cIiwgZm9ybUlkKVxuICAgICAgICB9XG4gICAgICAgIGlucHV0Lm5hbWUgPSBzdWJtaXR0ZXIubmFtZVxuICAgICAgICBpbnB1dC52YWx1ZSA9IHN1Ym1pdHRlci52YWx1ZVxuICAgICAgICBzdWJtaXR0ZXIucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQsIHN1Ym1pdHRlcilcbiAgICAgIH1cbiAgICAgIC8vIHVzZSBwcm90b3R5cGUncyBzdWJtaXQgaW4gY2FzZSB0aGVyZSdzIGEgZm9ybSBjb250cm9sIHdpdGggbmFtZSBvciBpZCBvZiBcInN1Ym1pdFwiXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEZvcm1FbGVtZW50L3N1Ym1pdFxuICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGV4dGVybmFsRm9ybVRyaWdnZXJlZCkuc3VibWl0LmNhbGwoZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkKVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgb25Ob2RlRGlzY2FyZGVkKGVsKXtcbiAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgIGlmKERPTS5pc1BoeENoaWxkKGVsKSB8fCBET00uaXNQaHhTdGlja3koZWwpKXsgdGhpcy5saXZlU29ja2V0LmRlc3Ryb3lWaWV3QnlFbChlbCkgfVxuICAgIHRoaXMudHJhY2tBZnRlcihcImRpc2NhcmRlZFwiLCBlbClcbiAgfVxuXG4gIG1heWJlUGVuZGluZ1JlbW92ZShub2RlKXtcbiAgICBpZihub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSh0aGlzLnBoeFJlbW92ZSkgIT09IG51bGwpe1xuICAgICAgdGhpcy5wZW5kaW5nUmVtb3Zlcy5wdXNoKG5vZGUpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICByZW1vdmVTdHJlYW1DaGlsZEVsZW1lbnQoY2hpbGQsIGZvcmNlPWZhbHNlKXtcbiAgICAvLyBtYWtlIHN1cmUgdG8gb25seSByZW1vdmUgZWxlbWVudHMgb3duZWQgYnkgdGhlIGN1cnJlbnQgdmlld1xuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzA0N1xuICAgIC8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzY4MVxuICAgIGlmKCFmb3JjZSAmJiAhdGhpcy52aWV3Lm93bnNFbGVtZW50KGNoaWxkKSl7IHJldHVybiB9XG5cbiAgICAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBub2RlIGlmIGl0IGlzIGFjdHVhbGx5IHJlLWFkZGVkIGluIHRoZSBzYW1lIHBhdGNoXG4gICAgLy8gd2UgZG8gTk9UIHdhbnQgdG8gZXhlY3V0ZSBwaHgtcmVtb3ZlLCB3ZSBkbyBOT1Qgd2FudCB0byBjYWxsIG9uTm9kZURpc2NhcmRlZFxuICAgIGlmKHRoaXMuc3RyZWFtSW5zZXJ0c1tjaGlsZC5pZF0pe1xuICAgICAgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2NoaWxkLmlkXSA9IGNoaWxkXG4gICAgICBjaGlsZC5yZW1vdmUoKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmx5IHJlbW92ZSB0aGUgZWxlbWVudCBub3cgaWYgaXQgaGFzIG5vIHBoeC1yZW1vdmUgYmluZGluZ1xuICAgICAgaWYoIXRoaXMubWF5YmVQZW5kaW5nUmVtb3ZlKGNoaWxkKSl7XG4gICAgICAgIGNoaWxkLnJlbW92ZSgpXG4gICAgICAgIHRoaXMub25Ob2RlRGlzY2FyZGVkKGNoaWxkKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFN0cmVhbUluc2VydChlbCl7XG4gICAgbGV0IGluc2VydCA9IGVsLmlkID8gdGhpcy5zdHJlYW1JbnNlcnRzW2VsLmlkXSA6IHt9XG4gICAgcmV0dXJuIGluc2VydCB8fCB7fVxuICB9XG5cbiAgc2V0U3RyZWFtUmVmKGVsLCByZWYpe1xuICAgIERPTS5wdXRTdGlja3koZWwsIFBIWF9TVFJFQU1fUkVGLCBlbCA9PiBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYsIHJlZikpXG4gIH1cblxuICBtYXliZVJlT3JkZXJTdHJlYW0oZWwsIGlzTmV3KXtcbiAgICBsZXQge3JlZiwgc3RyZWFtQXQsIHJlc2V0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGVsKVxuICAgIGlmKHN0cmVhbUF0ID09PSB1bmRlZmluZWQpeyByZXR1cm4gfVxuXG4gICAgLy8gd2UgbmVlZCB0byBzZXQgdGhlIFBIWF9TVFJFQU1fUkVGIGhlcmUgYXMgd2VsbCBhcyBhZGRDaGlsZCBpcyBpbnZva2VkIG9ubHkgZm9yIHBhcmVudHNcbiAgICB0aGlzLnNldFN0cmVhbVJlZihlbCwgcmVmKVxuXG4gICAgaWYoIXJlc2V0ICYmICFpc05ldyl7XG4gICAgICAvLyB3ZSBvbmx5IHJlb3JkZXIgaWYgdGhlIGVsZW1lbnQgaXMgbmV3IG9yIGl0J3MgYSBzdHJlYW0gcmVzZXRcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGhhcyBhIHBhcmVudCBlbGVtZW50O1xuICAgIC8vIGl0IGRvZXNuJ3QgaWYgd2UgYXJlIGN1cnJlbnRseSByZWN1cnNpdmVseSBtb3JwaGluZyAocmVzdG9yaW5nIGEgc2F2ZWQgc3RyZWFtIGNoaWxkKVxuICAgIC8vIGJlY2F1c2UgdGhlIGVsZW1lbnQgaXMgbm90IHlldCBhZGRlZCB0byB0aGUgcmVhbCBkb207XG4gICAgLy8gcmVvcmRlcmluZyBkb2VzIG5vdCBtYWtlIHNlbnNlIGluIHRoYXQgY2FzZSBhbnl3YXlcbiAgICBpZighZWwucGFyZW50RWxlbWVudCl7IHJldHVybiB9XG5cbiAgICBpZihzdHJlYW1BdCA9PT0gMCl7XG4gICAgICBlbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbCwgZWwucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZClcbiAgICB9IGVsc2UgaWYoc3RyZWFtQXQgPiAwKXtcbiAgICAgIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWwucGFyZW50RWxlbWVudC5jaGlsZHJlbilcbiAgICAgIGxldCBvbGRJbmRleCA9IGNoaWxkcmVuLmluZGV4T2YoZWwpXG4gICAgICBpZihzdHJlYW1BdCA+PSBjaGlsZHJlbi5sZW5ndGggLSAxKXtcbiAgICAgICAgZWwucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzaWJsaW5nID0gY2hpbGRyZW5bc3RyZWFtQXRdXG4gICAgICAgIGlmKG9sZEluZGV4ID4gc3RyZWFtQXQpe1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nLm5leHRFbGVtZW50U2libGluZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWF5YmVMaW1pdFN0cmVhbShlbClcbiAgfVxuXG4gIG1heWJlTGltaXRTdHJlYW0oZWwpe1xuICAgIGxldCB7bGltaXR9ID0gdGhpcy5nZXRTdHJlYW1JbnNlcnQoZWwpXG4gICAgbGV0IGNoaWxkcmVuID0gbGltaXQgIT09IG51bGwgJiYgQXJyYXkuZnJvbShlbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKVxuICAgIGlmKGxpbWl0ICYmIGxpbWl0IDwgMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCAqIC0xKXtcbiAgICAgIGNoaWxkcmVuLnNsaWNlKDAsIGNoaWxkcmVuLmxlbmd0aCArIGxpbWl0KS5mb3JFYWNoKGNoaWxkID0+IHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKSlcbiAgICB9IGVsc2UgaWYobGltaXQgJiYgbGltaXQgPj0gMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCl7XG4gICAgICBjaGlsZHJlbi5zbGljZShsaW1pdCkuZm9yRWFjaChjaGlsZCA9PiB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkpXG4gICAgfVxuICB9XG5cbiAgdHJhbnNpdGlvblBlbmRpbmdSZW1vdmVzKCl7XG4gICAgbGV0IHtwZW5kaW5nUmVtb3ZlcywgbGl2ZVNvY2tldH0gPSB0aGlzXG4gICAgaWYocGVuZGluZ1JlbW92ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRyYW5zaXRpb25SZW1vdmVzKHBlbmRpbmdSZW1vdmVzLCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdSZW1vdmVzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IERPTS5maXJzdFBoeENoaWxkKGVsKVxuICAgICAgICAgIGlmKGNoaWxkKXsgbGl2ZVNvY2tldC5kZXN0cm95Vmlld0J5RWwoY2hpbGQpIH1cbiAgICAgICAgICBlbC5yZW1vdmUoKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBwZW5kaW5nUmVtb3ZlcylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaXNDaGFuZ2VkU2VsZWN0KGZyb21FbCwgdG9FbCl7XG4gICAgaWYoIShmcm9tRWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkgfHwgZnJvbUVsLm11bHRpcGxlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBpZihmcm9tRWwub3B0aW9ucy5sZW5ndGggIT09IHRvRWwub3B0aW9ucy5sZW5ndGgpeyByZXR1cm4gdHJ1ZSB9XG5cbiAgICAvLyBrZWVwIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgdG9FbC52YWx1ZSA9IGZyb21FbC52YWx1ZVxuXG4gICAgLy8gaW4gZ2VuZXJhbCB3ZSBoYXZlIHRvIGJlIHZlcnkgY2FyZWZ1bCB3aXRoIHVzaW5nIGlzRXF1YWxOb2RlIGFzIGl0IGRvZXMgbm90IGEgcmVsaWFibGVcbiAgICAvLyBET00gdHJlZSBlcXVhbGl0eSBjaGVjaywgYnV0IGZvciBzZWxlY3Rpb24gYXR0cmlidXRlcyBhbmQgb3B0aW9ucyBpdCB3b3JrcyBmaW5lXG4gICAgcmV0dXJuICFmcm9tRWwuaXNFcXVhbE5vZGUodG9FbClcbiAgfVxuXG4gIGlzQ0lEUGF0Y2goKXsgcmV0dXJuIHRoaXMuY2lkUGF0Y2ggfVxuXG4gIHNraXBDSURTaWJsaW5nKGVsKXtcbiAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGVsLmhhc0F0dHJpYnV0ZShQSFhfU0tJUClcbiAgfVxuXG4gIHRhcmdldENJRENvbnRhaW5lcihodG1sKXtcbiAgICBpZighdGhpcy5pc0NJRFBhdGNoKCkpeyByZXR1cm4gfVxuICAgIGxldCBbZmlyc3QsIC4uLnJlc3RdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpXG4gICAgaWYocmVzdC5sZW5ndGggPT09IDAgJiYgRE9NLmNoaWxkTm9kZUxlbmd0aChodG1sKSA9PT0gMSl7XG4gICAgICByZXR1cm4gZmlyc3RcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpcnN0ICYmIGZpcnN0LnBhcmVudE5vZGVcbiAgICB9XG4gIH1cblxuICBpbmRleE9mKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmluZGV4T2YoY2hpbGQpIH1cbn1cbiIsICJpbXBvcnQge1xuICBDT01QT05FTlRTLFxuICBEWU5BTUlDUyxcbiAgVEVNUExBVEVTLFxuICBFVkVOVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9TS0lQLFxuICBQSFhfTUFHSUNfSUQsXG4gIFJFUExZLFxuICBTVEFUSUMsXG4gIFRJVExFLFxuICBTVFJFQU0sXG4gIFJPT1QsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGlzT2JqZWN0LFxuICBsb2dFcnJvcixcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuY29uc3QgVk9JRF9UQUdTID0gbmV3IFNldChbXG4gIFwiYXJlYVwiLFxuICBcImJhc2VcIixcbiAgXCJiclwiLFxuICBcImNvbFwiLFxuICBcImNvbW1hbmRcIixcbiAgXCJlbWJlZFwiLFxuICBcImhyXCIsXG4gIFwiaW1nXCIsXG4gIFwiaW5wdXRcIixcbiAgXCJrZXlnZW5cIixcbiAgXCJsaW5rXCIsXG4gIFwibWV0YVwiLFxuICBcInBhcmFtXCIsXG4gIFwic291cmNlXCIsXG4gIFwidHJhY2tcIixcbiAgXCJ3YnJcIlxuXSlcbmNvbnN0IHF1b3RlQ2hhcnMgPSBuZXcgU2V0KFtcIidcIiwgXCJcXFwiXCJdKVxuXG5leHBvcnQgbGV0IG1vZGlmeVJvb3QgPSAoaHRtbCwgYXR0cnMsIGNsZWFySW5uZXJIVE1MKSA9PiB7XG4gIGxldCBpID0gMFxuICBsZXQgaW5zaWRlQ29tbWVudCA9IGZhbHNlXG4gIGxldCBiZWZvcmVUYWcsIGFmdGVyVGFnLCB0YWcsIHRhZ05hbWVFbmRzQXQsIGlkLCBuZXdIVE1MXG5cbiAgbGV0IGxvb2thaGVhZCA9IGh0bWwubWF0Y2goL14oXFxzKig/OjwhLS0uKj8tLT5cXHMqKSopPChbXlxcc1xcLz5dKykvKVxuICBpZihsb29rYWhlYWQgPT09IG51bGwpeyB0aHJvdyBuZXcgRXJyb3IoYG1hbGZvcm1lZCBodG1sICR7aHRtbH1gKSB9XG5cbiAgaSA9IGxvb2thaGVhZFswXS5sZW5ndGhcbiAgYmVmb3JlVGFnID0gbG9va2FoZWFkWzFdXG4gIHRhZyA9IGxvb2thaGVhZFsyXVxuICB0YWdOYW1lRW5kc0F0ID0gaVxuXG4gIC8vIFNjYW4gdGhlIG9wZW5pbmcgdGFnIGZvciBpZCwgaWYgdGhlcmUgaXMgYW55XG4gIGZvcihpOyBpIDwgaHRtbC5sZW5ndGg7IGkrKyl7XG4gICAgaWYoaHRtbC5jaGFyQXQoaSkgPT09IFwiPlwiICl7IGJyZWFrIH1cbiAgICBpZihodG1sLmNoYXJBdChpKSA9PT0gXCI9XCIpe1xuICAgICAgbGV0IGlzSWQgPSBodG1sLnNsaWNlKGkgLSAzLCBpKSA9PT0gXCIgaWRcIlxuICAgICAgaSsrXG4gICAgICBsZXQgY2hhciA9IGh0bWwuY2hhckF0KGkpXG4gICAgICBpZihxdW90ZUNoYXJzLmhhcyhjaGFyKSl7XG4gICAgICAgIGxldCBhdHRyU3RhcnRzQXQgPSBpXG4gICAgICAgIGkrK1xuICAgICAgICBmb3IoaTsgaSA8IGh0bWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGlmKGh0bWwuY2hhckF0KGkpID09PSBjaGFyKXsgYnJlYWsgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGlzSWQpe1xuICAgICAgICAgIGlkID0gaHRtbC5zbGljZShhdHRyU3RhcnRzQXQgKyAxLCBpKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgY2xvc2VBdCA9IGh0bWwubGVuZ3RoIC0gMVxuICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgd2hpbGUoY2xvc2VBdCA+PSBiZWZvcmVUYWcubGVuZ3RoICsgdGFnLmxlbmd0aCl7XG4gICAgbGV0IGNoYXIgPSBodG1sLmNoYXJBdChjbG9zZUF0KVxuICAgIGlmKGluc2lkZUNvbW1lbnQpe1xuICAgICAgaWYoY2hhciA9PT0gXCItXCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMywgY2xvc2VBdCkgPT09IFwiPCEtXCIpe1xuICAgICAgICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgICAgICAgY2xvc2VBdCAtPSA0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZUF0IC09IDFcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoY2hhciA9PT0gXCI+XCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMiwgY2xvc2VBdCkgPT09IFwiLS1cIil7XG4gICAgICBpbnNpZGVDb21tZW50ID0gdHJ1ZVxuICAgICAgY2xvc2VBdCAtPSAzXG4gICAgfSBlbHNlIGlmKGNoYXIgPT09IFwiPlwiKXtcbiAgICAgIGJyZWFrXG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3NlQXQgLT0gMVxuICAgIH1cbiAgfVxuICBhZnRlclRhZyA9IGh0bWwuc2xpY2UoY2xvc2VBdCArIDEsIGh0bWwubGVuZ3RoKVxuXG4gIGxldCBhdHRyc1N0ciA9XG4gICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAubWFwKGF0dHIgPT4gYXR0cnNbYXR0cl0gPT09IHRydWUgPyBhdHRyIDogYCR7YXR0cn09XCIke2F0dHJzW2F0dHJdfVwiYClcbiAgICAgIC5qb2luKFwiIFwiKVxuXG4gIGlmKGNsZWFySW5uZXJIVE1MKXtcbiAgICAvLyBLZWVwIHRoZSBpZCBpZiBhbnlcbiAgICBsZXQgaWRBdHRyU3RyID0gaWQgPyBgIGlkPVwiJHtpZH1cImAgOiBcIlwiXG4gICAgaWYoVk9JRF9UQUdTLmhhcyh0YWcpKXtcbiAgICAgIG5ld0hUTUwgPSBgPCR7dGFnfSR7aWRBdHRyU3RyfSR7YXR0cnNTdHIgPT09IFwiXCIgPyBcIlwiIDogXCIgXCJ9JHthdHRyc1N0cn0vPmBcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3SFRNTCA9IGA8JHt0YWd9JHtpZEF0dHJTdHJ9JHthdHRyc1N0ciA9PT0gXCJcIiA/IFwiXCIgOiBcIiBcIn0ke2F0dHJzU3RyfT48LyR7dGFnfT5gXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCByZXN0ID0gaHRtbC5zbGljZSh0YWdOYW1lRW5kc0F0LCBjbG9zZUF0ICsgMSlcbiAgICBuZXdIVE1MID0gYDwke3RhZ30ke2F0dHJzU3RyID09PSBcIlwiID8gXCJcIiA6IFwiIFwifSR7YXR0cnNTdHJ9JHtyZXN0fWBcbiAgfVxuXG4gIHJldHVybiBbbmV3SFRNTCwgYmVmb3JlVGFnLCBhZnRlclRhZ11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZWQge1xuICBzdGF0aWMgZXh0cmFjdChkaWZmKXtcbiAgICBsZXQge1tSRVBMWV06IHJlcGx5LCBbRVZFTlRTXTogZXZlbnRzLCBbVElUTEVdOiB0aXRsZX0gPSBkaWZmXG4gICAgZGVsZXRlIGRpZmZbUkVQTFldXG4gICAgZGVsZXRlIGRpZmZbRVZFTlRTXVxuICAgIGRlbGV0ZSBkaWZmW1RJVExFXVxuICAgIHJldHVybiB7ZGlmZiwgdGl0bGUsIHJlcGx5OiByZXBseSB8fCBudWxsLCBldmVudHM6IGV2ZW50cyB8fCBbXX1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXdJZCwgcmVuZGVyZWQpe1xuICAgIHRoaXMudmlld0lkID0gdmlld0lkXG4gICAgdGhpcy5yZW5kZXJlZCA9IHt9XG4gICAgdGhpcy5tYWdpY0lkID0gMFxuICAgIHRoaXMubWVyZ2VEaWZmKHJlbmRlcmVkKVxuICB9XG5cbiAgcGFyZW50Vmlld0lkKCl7IHJldHVybiB0aGlzLnZpZXdJZCB9XG5cbiAgdG9TdHJpbmcob25seUNpZHMpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlVG9TdHJpbmcodGhpcy5yZW5kZXJlZCwgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIHRydWUsIHt9KVxuICAgIHJldHVybiBbc3RyLCBzdHJlYW1zXVxuICB9XG5cbiAgcmVjdXJzaXZlVG9TdHJpbmcocmVuZGVyZWQsIGNvbXBvbmVudHMgPSByZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIGNoYW5nZVRyYWNraW5nLCByb290QXR0cnMpe1xuICAgIG9ubHlDaWRzID0gb25seUNpZHMgPyBuZXcgU2V0KG9ubHlDaWRzKSA6IG51bGxcbiAgICBsZXQgb3V0cHV0ID0ge2J1ZmZlcjogXCJcIiwgY29tcG9uZW50czogY29tcG9uZW50cywgb25seUNpZHM6IG9ubHlDaWRzLCBzdHJlYW1zOiBuZXcgU2V0KCl9XG4gICAgdGhpcy50b091dHB1dEJ1ZmZlcihyZW5kZXJlZCwgbnVsbCwgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzKVxuICAgIHJldHVybiBbb3V0cHV0LmJ1ZmZlciwgb3V0cHV0LnN0cmVhbXNdXG4gIH1cblxuICBjb21wb25lbnRDSURzKGRpZmYpeyByZXR1cm4gT2JqZWN0LmtleXMoZGlmZltDT01QT05FTlRTXSB8fCB7fSkubWFwKGkgPT4gcGFyc2VJbnQoaSkpIH1cblxuICBpc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpe1xuICAgIGlmKCFkaWZmW0NPTVBPTkVOVFNdKXsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGlmZikubGVuZ3RoID09PSAxXG4gIH1cblxuICBnZXRDb21wb25lbnQoZGlmZiwgY2lkKXsgcmV0dXJuIGRpZmZbQ09NUE9ORU5UU11bY2lkXSB9XG5cbiAgcmVzZXRSZW5kZXIoY2lkKXtcbiAgICAvLyB3ZSBhcmUgcmFjaW5nIGEgY29tcG9uZW50IGRlc3Ryb3ksIGl0IGNvdWxkIG5vdCBleGlzdCwgc29cbiAgICAvLyBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCB0cnkgdG8gc2V0IHJlc2V0IG9uIHVuZGVmaW5lZFxuICAgIGlmKHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSl7XG4gICAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0ucmVzZXQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgbWVyZ2VEaWZmKGRpZmYpe1xuICAgIGxldCBuZXdjID0gZGlmZltDT01QT05FTlRTXVxuICAgIGxldCBjYWNoZSA9IHt9XG4gICAgZGVsZXRlIGRpZmZbQ09NUE9ORU5UU11cbiAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy5tdXRhYmxlTWVyZ2UodGhpcy5yZW5kZXJlZCwgZGlmZilcbiAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSB8fCB7fVxuXG4gICAgaWYobmV3Yyl7XG4gICAgICBsZXQgb2xkYyA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11cblxuICAgICAgZm9yKGxldCBjaWQgaW4gbmV3Yyl7XG4gICAgICAgIG5ld2NbY2lkXSA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChjaWQsIG5ld2NbY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2MpeyBvbGRjW2NpZF0gPSBuZXdjW2NpZF0gfVxuICAgICAgZGlmZltDT01QT05FTlRTXSA9IG5ld2NcbiAgICB9XG4gIH1cblxuICBjYWNoZWRGaW5kQ29tcG9uZW50KGNpZCwgY2RpZmYsIG9sZGMsIG5ld2MsIGNhY2hlKXtcbiAgICBpZihjYWNoZVtjaWRdKXtcbiAgICAgIHJldHVybiBjYWNoZVtjaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZGlmZiwgc3RhdCwgc2NpZCA9IGNkaWZmW1NUQVRJQ11cblxuICAgICAgaWYoaXNDaWQoc2NpZCkpe1xuICAgICAgICBsZXQgdGRpZmZcblxuICAgICAgICBpZihzY2lkID4gMCl7XG4gICAgICAgICAgdGRpZmYgPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoc2NpZCwgbmV3Y1tzY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGRpZmYgPSBvbGRjWy1zY2lkXVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdCA9IHRkaWZmW1NUQVRJQ11cbiAgICAgICAgbmRpZmYgPSB0aGlzLmNsb25lTWVyZ2UodGRpZmYsIGNkaWZmLCB0cnVlKVxuICAgICAgICBuZGlmZltTVEFUSUNdID0gc3RhdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmRpZmYgPSBjZGlmZltTVEFUSUNdICE9PSB1bmRlZmluZWQgfHwgb2xkY1tjaWRdID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgIGNkaWZmIDogdGhpcy5jbG9uZU1lcmdlKG9sZGNbY2lkXSwgY2RpZmYsIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICBjYWNoZVtjaWRdID0gbmRpZmZcbiAgICAgIHJldHVybiBuZGlmZlxuICAgIH1cbiAgfVxuXG4gIG11dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1NUQVRJQ10gIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gc291cmNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2UpXG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGZvcihsZXQga2V5IGluIHNvdXJjZSl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgbGV0IGlzT2JqVmFsID0gaXNPYmplY3QodmFsKVxuICAgICAgaWYoaXNPYmpWYWwgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXRWYWwsIHZhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHRhcmdldFtST09UXSl7XG4gICAgICB0YXJnZXQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8vIE1lcmdlcyBjaWQgdHJlZXMgdG9nZXRoZXIsIGNvcHlpbmcgc3RhdGljcyBmcm9tIHNvdXJjZSB0cmVlLlxuICAvL1xuICAvLyBUaGUgYHBydW5lTWFnaWNJZGAgaXMgcGFzc2VkIHRvIGNvbnRyb2wgcHJ1bmluZyB0aGUgbWFnaWNJZCBvZiB0aGVcbiAgLy8gdGFyZ2V0LiBXZSBtdXN0IGFsd2F5cyBwcnVuZSB0aGUgbWFnaWNJZCB3aGVuIHdlIGFyZSBzaGFyaW5nIHN0YXRpY3NcbiAgLy8gZnJvbSBhbm90aGVyIGNvbXBvbmVudC4gSWYgbm90IHBydW5pbmcsIHdlIHJlcGxpY2F0ZSB0aGUgbG9naWMgZnJvbVxuICAvLyBtdXRhYmxlTWVyZ2UsIHdoZXJlIHdlIHNldCBuZXdSZW5kZXIgdG8gdHJ1ZSBpZiB0aGVyZSBpcyBhIHJvb3RcbiAgLy8gKGVmZmVjdGl2ZWx5IGZvcmNpbmcgdGhlIG5ldyB2ZXJzaW9uIHRvIGJlIHJlbmRlcmVkIGluc3RlYWQgb2Ygc2tpcHBlZClcbiAgLy9cbiAgY2xvbmVNZXJnZSh0YXJnZXQsIHNvdXJjZSwgcHJ1bmVNYWdpY0lkKXtcbiAgICBsZXQgbWVyZ2VkID0gey4uLnRhcmdldCwgLi4uc291cmNlfVxuICAgIGZvcihsZXQga2V5IGluIG1lcmdlZCl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgaWYoaXNPYmplY3QodmFsKSAmJiB2YWxbU1RBVElDXSA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHZhbCwgcHJ1bmVNYWdpY0lkKVxuICAgICAgfSBlbHNlIGlmKHZhbCA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHt9LCBwcnVuZU1hZ2ljSWQpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHBydW5lTWFnaWNJZCl7XG4gICAgICBkZWxldGUgbWVyZ2VkLm1hZ2ljSWRcbiAgICAgIGRlbGV0ZSBtZXJnZWQubmV3UmVuZGVyXG4gICAgfSBlbHNlIGlmKHRhcmdldFtST09UXSl7XG4gICAgICBtZXJnZWQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICBjb21wb25lbnRUb1N0cmluZyhjaWQpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcodGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgY2lkLCBudWxsKVxuICAgIGxldCBbc3RyaXBwZWRIVE1MLCBfYmVmb3JlLCBfYWZ0ZXJdID0gbW9kaWZ5Um9vdChzdHIsIHt9KVxuICAgIHJldHVybiBbc3RyaXBwZWRIVE1MLCBzdHJlYW1zXVxuICB9XG5cbiAgcHJ1bmVDSURzKGNpZHMpe1xuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4gZGVsZXRlIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBnZXQoKXsgcmV0dXJuIHRoaXMucmVuZGVyZWQgfVxuXG4gIGlzTmV3RmluZ2VycHJpbnQoZGlmZiA9IHt9KXsgcmV0dXJuICEhZGlmZltTVEFUSUNdIH1cblxuICB0ZW1wbGF0ZVN0YXRpYyhwYXJ0LCB0ZW1wbGF0ZXMpe1xuICAgIGlmKHR5cGVvZiAocGFydCkgPT09IFwibnVtYmVyXCIpe1xuICAgICAgcmV0dXJuIHRlbXBsYXRlc1twYXJ0XVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFydFxuICAgIH1cbiAgfVxuXG4gIG5leHRNYWdpY0lEKCl7XG4gICAgdGhpcy5tYWdpY0lkKytcbiAgICByZXR1cm4gYG0ke3RoaXMubWFnaWNJZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgfVxuXG4gIC8vIENvbnZlcnRzIHJlbmRlcmVkIHRyZWUgdG8gb3V0cHV0IGJ1ZmZlci5cbiAgLy9cbiAgLy8gY2hhbmdlVHJhY2tpbmcgY29udHJvbHMgaWYgd2UgY2FuIGFwcGx5IHRoZSBQSFhfU0tJUCBvcHRpbWl6YXRpb24uXG4gIC8vIEl0IGlzIGRpc2FibGVkIGZvciBjb21wcmVoZW5zaW9ucyBzaW5jZSB3ZSBtdXN0IHJlLXJlbmRlciB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgLy8gYW5kIG5vIGluZGl2aWR1YWwgZWxlbWVudCBpcyB0cmFja2VkIGluc2lkZSB0aGUgY29tcHJlaGVuc2lvbi5cbiAgdG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzID0ge30pe1xuICAgIGlmKHJlbmRlcmVkW0RZTkFNSUNTXSl7IHJldHVybiB0aGlzLmNvbXByZWhlbnNpb25Ub0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpIH1cbiAgICBsZXQge1tTVEFUSUNdOiBzdGF0aWNzfSA9IHJlbmRlcmVkXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBpc1Jvb3QgPSByZW5kZXJlZFtST09UXVxuICAgIGxldCBwcmV2QnVmZmVyID0gb3V0cHV0LmJ1ZmZlclxuICAgIGlmKGlzUm9vdCl7IG91dHB1dC5idWZmZXIgPSBcIlwiIH1cblxuICAgIC8vIHRoaXMgY29uZGl0aW9uIGlzIGNhbGxlZCB3aGVuIGZpcnN0IHJlbmRlcmluZyBhbiBvcHRpbWl6YWJsZSBmdW5jdGlvbiBjb21wb25lbnQuXG4gICAgLy8gTEMgaGF2ZSB0aGVpciBtYWdpY0lkIHByZXZpb3VzbHkgc2V0XG4gICAgaWYoY2hhbmdlVHJhY2tpbmcgJiYgaXNSb290ICYmICFyZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgIHJlbmRlcmVkLm5ld1JlbmRlciA9IHRydWVcbiAgICAgIHJlbmRlcmVkLm1hZ2ljSWQgPSB0aGlzLm5leHRNYWdpY0lEKClcbiAgICB9XG5cbiAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF1cbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZFtpIC0gMV0sIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgIH1cblxuICAgIC8vIEFwcGxpZXMgdGhlIHJvb3QgdGFnIFwic2tpcFwiIG9wdGltaXphdGlvbiBpZiBzdXBwb3J0ZWQsIHdoaWNoIGNsZWFyc1xuICAgIC8vIHRoZSByb290IHRhZyBhdHRyaWJ1dGVzIGFuZCBpbm5lckhUTUwsIGFuZCBvbmx5IG1haW50YWlucyB0aGUgbWFnaWNJZC5cbiAgICAvLyBXZSBjYW4gb25seSBza2lwIHdoZW4gY2hhbmdlVHJhY2tpbmcgaXMgc3VwcG9ydGVkIChvdXRzaWRlIG9mIGEgY29tcHJlaGVuc2lvbiksXG4gICAgLy8gYW5kIHdoZW4gdGhlIHJvb3QgZWxlbWVudCBoYXNuJ3QgZXhwZXJpZW5jZWQgYW4gdW5yZW5kZXJlZCBtZXJnZSAobmV3UmVuZGVyIHRydWUpLlxuICAgIGlmKGlzUm9vdCl7XG4gICAgICBsZXQgc2tpcCA9IGZhbHNlXG4gICAgICBsZXQgYXR0cnNcbiAgICAgIC8vIFdoZW4gYSBMQyBpcyByZS1hZGRlZCB0byB0aGUgcGFnZSwgd2UgbmVlZCB0byByZS1yZW5kZXIgdGhlIGVudGlyZSBMQyB0cmVlLFxuICAgICAgLy8gdGhlcmVmb3JlIGNoYW5nZVRyYWNraW5nIGlzIGZhbHNlOyBob3dldmVyLCB3ZSBuZWVkIHRvIGtlZXAgYWxsIHRoZSBtYWdpY0lkc1xuICAgICAgLy8gZnJvbSBhbnkgZnVuY3Rpb24gY29tcG9uZW50IHNvIHRoZSBuZXh0IHRpbWUgdGhlIExDIGlzIHVwZGF0ZWQsIHdlIGNhbiBhcHBseVxuICAgICAgLy8gdGhlIHNraXAgb3B0aW1pemF0aW9uXG4gICAgICBpZihjaGFuZ2VUcmFja2luZyB8fCByZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgICAgc2tpcCA9IGNoYW5nZVRyYWNraW5nICYmICFyZW5kZXJlZC5uZXdSZW5kZXJcbiAgICAgICAgYXR0cnMgPSB7W1BIWF9NQUdJQ19JRF06IHJlbmRlcmVkLm1hZ2ljSWQsIC4uLnJvb3RBdHRyc31cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0gcm9vdEF0dHJzXG4gICAgICB9XG4gICAgICBpZihza2lwKXsgYXR0cnNbUEhYX1NLSVBdID0gdHJ1ZSB9XG4gICAgICBsZXQgW25ld1Jvb3QsIGNvbW1lbnRCZWZvcmUsIGNvbW1lbnRBZnRlcl0gPSBtb2RpZnlSb290KG91dHB1dC5idWZmZXIsIGF0dHJzLCBza2lwKVxuICAgICAgcmVuZGVyZWQubmV3UmVuZGVyID0gZmFsc2VcbiAgICAgIG91dHB1dC5idWZmZXIgPSBwcmV2QnVmZmVyICsgY29tbWVudEJlZm9yZSArIG5ld1Jvb3QgKyBjb21tZW50QWZ0ZXJcbiAgICB9XG4gIH1cblxuICBjb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBsZXQge1tEWU5BTUlDU106IGR5bmFtaWNzLCBbU1RBVElDXTogc3RhdGljcywgW1NUUkVBTV06IHN0cmVhbX0gPSByZW5kZXJlZFxuICAgIGxldCBbX3JlZiwgX2luc2VydHMsIGRlbGV0ZUlkcywgcmVzZXRdID0gc3RyZWFtIHx8IFtudWxsLCB7fSwgW10sIG51bGxdXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBjb21wVGVtcGxhdGVzID0gdGVtcGxhdGVzIHx8IHJlbmRlcmVkW1RFTVBMQVRFU11cbiAgICBmb3IobGV0IGQgPSAwOyBkIDwgZHluYW1pY3MubGVuZ3RoOyBkKyspe1xuICAgICAgbGV0IGR5bmFtaWMgPSBkeW5hbWljc1tkXVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIC8vIEluc2lkZSBhIGNvbXByZWhlbnNpb24sIHdlIGRvbid0IHRyYWNrIGhvdyBkeW5hbWljcyBjaGFuZ2VcbiAgICAgICAgLy8gb3ZlciB0aW1lIChhbmQgZmVhdHVyZXMgbGlrZSBzdHJlYW1zIHdvdWxkIG1ha2UgdGhhdCBpbXBvc3NpYmxlXG4gICAgICAgIC8vIHVubGVzcyB3ZSBtb3ZlIHRoZSBzdHJlYW0gZGlmZmluZyBhd2F5IGZyb20gbW9ycGhkb20pLFxuICAgICAgICAvLyBzbyB3ZSBjYW4ndCBwZXJmb3JtIHJvb3QgY2hhbmdlIHRyYWNraW5nLlxuICAgICAgICBsZXQgY2hhbmdlVHJhY2tpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihkeW5hbWljW2kgLSAxXSwgY29tcFRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzW2ldXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoc3RyZWFtICE9PSB1bmRlZmluZWQgJiYgKHJlbmRlcmVkW0RZTkFNSUNTXS5sZW5ndGggPiAwIHx8IGRlbGV0ZUlkcy5sZW5ndGggPiAwIHx8IHJlc2V0KSl7XG4gICAgICBkZWxldGUgcmVuZGVyZWRbU1RSRUFNXVxuICAgICAgcmVuZGVyZWRbRFlOQU1JQ1NdID0gW11cbiAgICAgIG91dHB1dC5zdHJlYW1zLmFkZChzdHJlYW0pXG4gICAgfVxuICB9XG5cbiAgZHluYW1pY1RvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcpe1xuICAgIGlmKHR5cGVvZiAocmVuZGVyZWQpID09PSBcIm51bWJlclwiKXtcbiAgICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpXG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0clxuICAgICAgb3V0cHV0LnN0cmVhbXMgPSBuZXcgU2V0KFsuLi5vdXRwdXQuc3RyZWFtcywgLi4uc3RyZWFtc10pXG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KHJlbmRlcmVkKSl7XG4gICAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcsIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHJlbmRlcmVkXG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlQ0lEVG9TdHJpbmcoY29tcG9uZW50cywgY2lkLCBvbmx5Q2lkcyl7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY2lkXSB8fCBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvciBDSUQgJHtjaWR9YCwgY29tcG9uZW50cylcbiAgICBsZXQgYXR0cnMgPSB7W1BIWF9DT01QT05FTlRdOiBjaWR9XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZClcbiAgICAvLyBUd28gb3B0aW1pemF0aW9uIHBhdGhzIGFwcGx5IGhlcmU6XG4gICAgLy9cbiAgICAvLyAgIDEuIFRoZSBvbmx5Q2lkcyBvcHRpbWl6YXRpb24gd29ya3MgYnkgdGhlIHNlcnZlciBkaWZmIHRlbGxpbmcgdXMgb25seSBzcGVjaWZpY1xuICAgIC8vICAgICBjaWQncyBoYXZlIGNoYW5nZWQuIFRoaXMgYWxsb3dzIHVzIHRvIHNraXAgcmVuZGVyaW5nIGFueSBjb21wb25lbnQgdGhhdCBoYXNuJ3QgY2hhbmdlZCxcbiAgICAvLyAgICAgd2hpY2ggdWx0aW1hdGVseSBzZXRzIFBIWF9TS0lQIHJvb3QgYXR0cmlidXRlIGFuZCBhdm9pZHMgcmVuZGVyaW5nIHRoZSBpbm5lckhUTUwuXG4gICAgLy9cbiAgICAvLyAgIDIuIFRoZSByb290IFBIWF9TS0lQIG9wdGltaXphdGlvbiBnZW5lcmFsaXplcyB0byBhbGwgSEVFeCBmdW5jdGlvbiBjb21wb25lbnRzLCBhbmRcbiAgICAvLyAgICAgd29ya3MgaW4gdGhlIHNhbWUgUEhYX1NLSVAgYXR0cmlidXRlIGZhc2hpb24gYXMgMSwgYnV0IHRoZSBuZXdSZW5kZXIgdHJhY2tpbmcgaXMgZG9uZVxuICAgIC8vICAgICBhdCB0aGUgZ2VuZXJhbCBkaWZmIG1lcmdlIGxldmVsLiBJZiB3ZSBtZXJnZSBhIGRpZmYgd2l0aCBuZXcgZHluYW1pY3MsIHdlIG5lY2Vzc2FyaWx5IGhhdmVcbiAgICAvLyAgICAgZXhwZXJpZW5jZWQgYSBjaGFuZ2Ugd2hpY2ggbXVzdCBiZSBhIG5ld1JlbmRlciwgYW5kIHRodXMgd2UgY2FuJ3Qgc2tpcCB0aGUgcmVuZGVyLlxuICAgIC8vXG4gICAgLy8gQm90aCBvcHRpbWl6YXRpb24gZmxvd3MgYXBwbHkgaGVyZS4gbmV3UmVuZGVyIGlzIHNldCBiYXNlZCBvbiB0aGUgb25seUNpZHMgb3B0aW1pemF0aW9uLCBhbmRcbiAgICAvLyB3ZSB0cmFjayBhIGRldGVybWluaXN0aWMgbWFnaWNJZCBiYXNlZCBvbiB0aGUgY2lkLlxuICAgIC8vXG4gICAgLy8gY2hhbmdlVHJhY2tpbmcgaXMgYWJvdXQgdGhlIGVudGlyZSB0cmVlXG4gICAgLy8gbmV3UmVuZGVyIGlzIGFib3V0IHRoZSBjdXJyZW50IHJvb3QgaW4gdGhlIHRyZWVcbiAgICAvL1xuICAgIC8vIEJ5IGRlZmF1bHQgY2hhbmdlVHJhY2tpbmcgaXMgZW5hYmxlZCwgYnV0IHdlIHNwZWNpYWwgY2FzZSB0aGUgZmxvdyB3aGVyZSB0aGUgY2xpZW50IGlzIHBydW5pbmdcbiAgICAvLyBjaWRzIGFuZCB0aGUgc2VydmVyIGFkZHMgdGhlIGNvbXBvbmVudCBiYWNrLiBJbiBzdWNoIGNhc2VzLCB3ZSBleHBsaWNpdGx5IGRpc2FibGUgY2hhbmdlVHJhY2tpbmdcbiAgICAvLyB3aXRoIHJlc2V0UmVuZGVyIGZvciB0aGlzIGNpZCwgdGhlbiByZS1lbmFibGUgaXQgYWZ0ZXIgdGhlIHJlY3Vyc2l2ZSBjYWxsIHRvIHNraXAgdGhlIG9wdGltaXphdGlvblxuICAgIC8vIGZvciB0aGUgZW50aXJlIGNvbXBvbmVudCB0cmVlLlxuICAgIGNvbXBvbmVudC5uZXdSZW5kZXIgPSAhc2tpcFxuICAgIGNvbXBvbmVudC5tYWdpY0lkID0gYGMke2NpZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgICAvLyBlbmFibGUgY2hhbmdlIHRyYWNraW5nIGFzIGxvbmcgYXMgdGhlIGNvbXBvbmVudCBoYXNuJ3QgYmVlbiByZXNldFxuICAgIGxldCBjaGFuZ2VUcmFja2luZyA9ICFjb21wb25lbnQucmVzZXRcbiAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyhjb21wb25lbnQsIGNvbXBvbmVudHMsIG9ubHlDaWRzLCBjaGFuZ2VUcmFja2luZywgYXR0cnMpXG4gICAgLy8gZGlzYWJsZSByZXNldCBhZnRlciB3ZSd2ZSByZW5kZXJlZFxuICAgIGRlbGV0ZSBjb21wb25lbnQucmVzZXRcblxuICAgIHJldHVybiBbaHRtbCwgc3RyZWFtc11cbiAgfVxufVxuIiwgImltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBBUklBIGZyb20gXCIuL2FyaWFcIlxuXG5sZXQgZm9jdXNTdGFjayA9IFtdXG5sZXQgZGVmYXVsdF90cmFuc2l0aW9uX3RpbWUgPSAyMDBcblxubGV0IEpTID0ge1xuICAvLyBwcml2YXRlXG4gIGV4ZWMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGRlZmF1bHRzKXtcbiAgICBsZXQgW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc10gPSBkZWZhdWx0cyB8fCBbbnVsbCwge2NhbGxiYWNrOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jYWxsYmFja31dXG4gICAgbGV0IGNvbW1hbmRzID0gcGh4RXZlbnQuY2hhckF0KDApID09PSBcIltcIiA/XG4gICAgICBKU09OLnBhcnNlKHBoeEV2ZW50KSA6IFtbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXV1cblxuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYoa2luZCA9PT0gZGVmYXVsdEtpbmQpe1xuICAgICAgICAvLyBhbHdheXMgcHJlZmVyIHRoZSBhcmdzLCBidXQga2VlcCBleGlzdGluZyBrZXlzIGZyb20gdGhlIGRlZmF1bHRBcmdzXG4gICAgICAgIGFyZ3MgPSB7Li4uZGVmYXVsdEFyZ3MsIC4uLmFyZ3N9XG4gICAgICAgIGFyZ3MuY2FsbGJhY2sgPSBhcmdzLmNhbGxiYWNrIHx8IGRlZmF1bHRBcmdzLmNhbGxiYWNrXG4gICAgICB9XG4gICAgICB0aGlzLmZpbHRlclRvRWxzKHZpZXcubGl2ZVNvY2tldCwgc291cmNlRWwsIGFyZ3MpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICB0aGlzW2BleGVjXyR7a2luZH1gXShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIGFyZ3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgaXNWaXNpYmxlKGVsKXtcbiAgICByZXR1cm4gISEoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0IHx8IGVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMClcbiAgfSxcblxuICAvLyByZXR1cm5zIHRydWUgaWYgYW55IHBhcnQgb2YgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSB2aWV3cG9ydFxuICBpc0luVmlld3BvcnQoZWwpe1xuICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgY29uc3Qgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcblxuICAgIHJldHVybiAoXG4gICAgICByZWN0LnJpZ2h0ID4gMCAmJlxuICAgICAgcmVjdC5ib3R0b20gPiAwICYmXG4gICAgICByZWN0LmxlZnQgPCB3aW5kb3dXaWR0aCAmJlxuICAgICAgcmVjdC50b3AgPCB3aW5kb3dIZWlnaHRcbiAgICApXG4gIH0sXG5cbiAgLy8gcHJpdmF0ZVxuXG4gIC8vIGNvbW1hbmRzXG5cbiAgZXhlY19leGVjKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHIsIHRvfSl7XG4gICAgbGV0IGVuY29kZWRKUyA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKVxuICAgIGlmKCFlbmNvZGVkSlMpeyB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICR7YXR0cn0gdG8gY29udGFpbiBKUyBjb21tYW5kIG9uIFwiJHt0b31cImApIH1cbiAgICB2aWV3LmxpdmVTb2NrZXQuZXhlY0pTKGVsLCBlbmNvZGVkSlMsIGV2ZW50VHlwZSlcbiAgfSxcblxuICBleGVjX2Rpc3BhdGNoKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2V2ZW50LCBkZXRhaWwsIGJ1YmJsZXN9KXtcbiAgICBkZXRhaWwgPSBkZXRhaWwgfHwge31cbiAgICBkZXRhaWwuZGlzcGF0Y2hlciA9IHNvdXJjZUVsXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZWwsIGV2ZW50LCB7ZGV0YWlsLCBidWJibGVzfSlcbiAgfSxcblxuICBleGVjX3B1c2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKXtcbiAgICBsZXQge2V2ZW50LCBkYXRhLCB0YXJnZXQsIHBhZ2VfbG9hZGluZywgbG9hZGluZywgdmFsdWUsIGRpc3BhdGNoZXIsIGNhbGxiYWNrfSA9IGFyZ3NcbiAgICBsZXQgcHVzaE9wdHMgPSB7bG9hZGluZywgdmFsdWUsIHRhcmdldCwgcGFnZV9sb2FkaW5nOiAhIXBhZ2VfbG9hZGluZ31cbiAgICBsZXQgdGFyZ2V0U3JjID0gZXZlbnRUeXBlID09PSBcImNoYW5nZVwiICYmIGRpc3BhdGNoZXIgPyBkaXNwYXRjaGVyIDogc291cmNlRWxcbiAgICBsZXQgcGh4VGFyZ2V0ID0gdGFyZ2V0IHx8IHRhcmdldFNyYy5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFwidGFyZ2V0XCIpKSB8fCB0YXJnZXRTcmNcbiAgICBjb25zdCBoYW5kbGVyID0gKHRhcmdldFZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgaWYoIXRhcmdldFZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICBpZihldmVudFR5cGUgPT09IFwiY2hhbmdlXCIpe1xuICAgICAgICBsZXQge25ld0NpZCwgX3RhcmdldH0gPSBhcmdzXG4gICAgICAgIF90YXJnZXQgPSBfdGFyZ2V0IHx8IChET00uaXNGb3JtSW5wdXQoc291cmNlRWwpID8gc291cmNlRWwubmFtZSA6IHVuZGVmaW5lZClcbiAgICAgICAgaWYoX3RhcmdldCl7IHB1c2hPcHRzLl90YXJnZXQgPSBfdGFyZ2V0IH1cbiAgICAgICAgdGFyZ2V0Vmlldy5wdXNoSW5wdXQoc291cmNlRWwsIHRhcmdldEN0eCwgbmV3Q2lkLCBldmVudCB8fCBwaHhFdmVudCwgcHVzaE9wdHMsIGNhbGxiYWNrKVxuICAgICAgfSBlbHNlIGlmKGV2ZW50VHlwZSA9PT0gXCJzdWJtaXRcIil7XG4gICAgICAgIGxldCB7c3VibWl0dGVyfSA9IGFyZ3NcbiAgICAgICAgdGFyZ2V0Vmlldy5zdWJtaXRGb3JtKHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBzdWJtaXR0ZXIsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFZpZXcucHVzaEV2ZW50KGV2ZW50VHlwZSwgc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIGRhdGEsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaW4gY2FzZSBvZiBmb3JtUmVjb3ZlcnksIHRhcmdldFZpZXcgYW5kIHRhcmdldEN0eCBhcmUgcGFzc2VkIGFzIGFyZ3VtZW50XG4gICAgLy8gYXMgdGhleSBhcmUgbG9va2VkIHVwIGluIGEgdGVtcGxhdGUgZWxlbWVudCwgbm90IHRoZSByZWFsIERPTVxuICAgIGlmKGFyZ3MudGFyZ2V0VmlldyAmJiBhcmdzLnRhcmdldEN0eCl7XG4gICAgICBoYW5kbGVyKGFyZ3MudGFyZ2V0VmlldywgYXJncy50YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIGV4ZWNfbmF2aWdhdGUoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgcmVwbGFjZSA/IFwicmVwbGFjZVwiIDogXCJwdXNoXCIsIG51bGwsIHNvdXJjZUVsKVxuICB9LFxuXG4gIGV4ZWNfcGF0Y2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5wdXNoSGlzdG9yeVBhdGNoKGUsIGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiLCBzb3VyY2VFbClcbiAgfSxcblxuICBleGVjX2ZvY3VzKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5hdHRlbXB0Rm9jdXMoZWwpXG4gICAgLy8gaW4gY2FzZSB0aGUgSlMuZm9jdXMgY29tbWFuZCBpcyBpbiBhIEpTLnNob3cvaGlkZS90b2dnbGUgY2hhaW4sIGZvciBzaG93IHdlIG5lZWRcbiAgICAvLyB0byB3YWl0IGZvciBKUy5zaG93IHRvIGhhdmUgdXBkYXRlZCB0aGUgZWxlbWVudCdzIGRpc3BsYXkgcHJvcGVydHkgKHNlZSBleGVjX3RvZ2dsZSlcbiAgICAvLyBidXQgdGhhdCBydW4gaW4gbmVzdGVkIGFuaW1hdGlvbiBmcmFtZXMsIHRoZXJlZm9yZSB3ZSBuZWVkIHRvIHVzZSB0aGVtIGhlcmUgYXMgd2VsbFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBBUklBLmF0dGVtcHRGb2N1cyhlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX2ZvY3VzX2ZpcnN0KGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbClcbiAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX3B1c2hfZm9jdXMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKXtcbiAgICBmb2N1c1N0YWNrLnB1c2goZWwgfHwgc291cmNlRWwpXG4gIH0sXG5cbiAgZXhlY19wb3BfZm9jdXMoX2UsIF9ldmVudFR5cGUsIF9waHhFdmVudCwgX3ZpZXcsIF9zb3VyY2VFbCwgX2VsKXtcbiAgICBjb25zdCBlbCA9IGZvY3VzU3RhY2sucG9wKClcbiAgICBpZihlbCl7XG4gICAgICBlbC5mb2N1cygpXG4gICAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGVsLmZvY3VzKCkpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBleGVjX2FkZF9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgbmFtZXMsIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3JlbW92ZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9hdHRyKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHI6IFthdHRyLCB2YWwxLCB2YWwyXX0pe1xuICAgIHRoaXMudG9nZ2xlQXR0cihlbCwgYXR0ciwgdmFsMSwgdmFsMilcbiAgfSxcblxuICBleGVjX3RyYW5zaXRpb24oZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dGltZSwgdHJhbnNpdGlvbiwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lLCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3Nob3coZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY19oaWRlKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy5oaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKVxuICB9LFxuXG4gIGV4ZWNfc2V0X2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cjogW2F0dHIsIHZhbF19KXtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cn0pe1xuICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgfSxcblxuICAvLyB1dGlscyBmb3IgY29tbWFuZHNcblxuICBzaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZighdGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIG51bGwsIHRpbWUsIGJsb2NraW5nKVxuICAgIH1cbiAgfSxcblxuICBoaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgbnVsbCwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nKXtcbiAgICB0aW1lID0gdGltZSB8fCBkZWZhdWx0X3RyYW5zaXRpb25fdGltZVxuICAgIGxldCBbaW5DbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcywgaW5FbmRDbGFzc2VzXSA9IGlucyB8fCBbW10sIFtdLCBbXV1cbiAgICBsZXQgW291dENsYXNzZXMsIG91dFN0YXJ0Q2xhc3Nlcywgb3V0RW5kQ2xhc3Nlc10gPSBvdXRzIHx8IFtbXSwgW10sIFtdXVxuICAgIGlmKGluQ2xhc3Nlcy5sZW5ndGggPiAwIHx8IG91dENsYXNzZXMubGVuZ3RoID4gMCl7XG4gICAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0U3RhcnRDbGFzc2VzLCBpbkNsYXNzZXMuY29uY2F0KGluU3RhcnRDbGFzc2VzKS5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRDbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dEVuZENsYXNzZXMsIG91dFN0YXJ0Q2xhc3NlcykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZihldmVudFR5cGUgPT09IFwicmVtb3ZlXCIpeyByZXR1cm4gfVxuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5TdGFydENsYXNzZXMsIG91dENsYXNzZXMuY29uY2F0KG91dFN0YXJ0Q2xhc3NlcykuY29uY2F0KG91dEVuZENsYXNzZXMpKVxuICAgICAgICAgIGNvbnN0IHN0aWNreURpc3BsYXkgPSBkaXNwbGF5IHx8IHRoaXMuZGVmYXVsdERpc3BsYXkoZWwpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhZGQgdGhlIHN0YXJ0aW5nICsgYWN0aXZlIGNsYXNzLCBUSEVOIG1ha2UgdGhlIGVsZW1lbnQgdmlzaWJsZVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGlmIHdlIHRvZ2dsZWQgdGhlIHZpc2liaWxpdHkgZWFybGllciBjc3MgYW5pbWF0aW9uc1xuICAgICAgICAgICAgLy8gd291bGQgZmxpY2tlciwgYXMgdGhlIGVsZW1lbnQgYmVjb21lcyB2aXNpYmxlIGJlZm9yZSB0aGUgYWN0aXZlIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gY2xhc3MgaXMgc2V0IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM0NTYpXG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5DbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIC8vIGFkZE9yUmVtb3ZlQ2xhc3NlcyB1c2VzIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGl0c2VsZiwgdGhlcmVmb3JlIHdlIG5lZWQgdG8gbW92ZSB0aGUgcHV0U3RpY2t5XG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBuZXh0IHJlcXVlc3RBbmltYXRpb25GcmFtZS4uLlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkVuZENsYXNzZXMsIGluU3RhcnRDbGFzc2VzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGxldCBvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIGluQ2xhc3Nlcy5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtc3RhcnRcIikpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICAgIGxldCBzdGlja3lEaXNwbGF5ID0gZGlzcGxheSB8fCB0aGlzLmRlZmF1bHREaXNwbGF5KGVsKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZUNsYXNzZXMoZWwsIGNsYXNzZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcsIGJsb2NraW5nKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGxldCBbcHJldkFkZHMsIHByZXZSZW1vdmVzXSA9IERPTS5nZXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBbW10sIFtdXSlcbiAgICAgIGxldCBuZXdBZGRzID0gY2xhc3Nlcy5maWx0ZXIobmFtZSA9PiBwcmV2QWRkcy5pbmRleE9mKG5hbWUpIDwgMCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBjbGFzc2VzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBuZXdBZGRzLCBuZXdSZW1vdmVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgICB9KVxuICB9LFxuXG4gIHRvZ2dsZUF0dHIoZWwsIGF0dHIsIHZhbDEsIHZhbDIpe1xuICAgIGlmKGVsLmhhc0F0dHJpYnV0ZShhdHRyKSl7XG4gICAgICBpZih2YWwyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAvLyB0b2dnbGUgYmV0d2VlbiB2YWwxIGFuZCB2YWwyXG4gICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZShhdHRyKSA9PT0gdmFsMSl7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDJdXSwgW10pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlbW92ZSBhdHRyXG4gICAgICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgfVxuICB9LFxuXG4gIGFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcywgcmVtb3ZlcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpe1xuICAgIHRpbWUgPSB0aW1lIHx8IGRlZmF1bHRfdHJhbnNpdGlvbl90aW1lXG4gICAgbGV0IFt0cmFuc2l0aW9uUnVuLCB0cmFuc2l0aW9uU3RhcnQsIHRyYW5zaXRpb25FbmRdID0gdHJhbnNpdGlvbiB8fCBbW10sIFtdLCBbXV1cbiAgICBpZih0cmFuc2l0aW9uUnVuLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uU3RhcnQsIFtdLmNvbmNhdCh0cmFuc2l0aW9uUnVuKS5jb25jYXQodHJhbnNpdGlvbkVuZCkpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uUnVuLCBbXSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uRW5kLCB0cmFuc2l0aW9uU3RhcnQpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLmNvbmNhdCh0cmFuc2l0aW9uRW5kKSwgcmVtb3Zlcy5jb25jYXQodHJhbnNpdGlvblJ1bikuY29uY2F0KHRyYW5zaXRpb25TdGFydCkpXG4gICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICBvblN0YXJ0KClcbiAgICAgICAgc2V0VGltZW91dChvbkRvbmUsIHRpbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgW1tdLCBbXV0pXG4gICAgICBsZXQga2VlcEFkZHMgPSBhZGRzLmZpbHRlcihuYW1lID0+IHByZXZBZGRzLmluZGV4T2YobmFtZSkgPCAwICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQga2VlcFJlbW92ZXMgPSByZW1vdmVzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBuZXdBZGRzID0gcHJldkFkZHMuZmlsdGVyKG5hbWUgPT4gcmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBBZGRzKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBhZGRzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcFJlbW92ZXMpXG5cbiAgICAgIERPTS5wdXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LnJlbW92ZSguLi5uZXdSZW1vdmVzKVxuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LmFkZCguLi5uZXdBZGRzKVxuICAgICAgICByZXR1cm4gW25ld0FkZHMsIG5ld1JlbW92ZXNdXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgc2V0T3JSZW1vdmVBdHRycyhlbCwgc2V0cywgcmVtb3Zlcyl7XG4gICAgbGV0IFtwcmV2U2V0cywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJhdHRyc1wiLCBbW10sIFtdXSlcblxuICAgIGxldCBhbHRlcmVkQXR0cnMgPSBzZXRzLm1hcCgoW2F0dHIsIF92YWxdKSA9PiBhdHRyKS5jb25jYXQocmVtb3ZlcylcbiAgICBsZXQgbmV3U2V0cyA9IHByZXZTZXRzLmZpbHRlcigoW2F0dHIsIF92YWxdKSA9PiAhYWx0ZXJlZEF0dHJzLmluY2x1ZGVzKGF0dHIpKS5jb25jYXQoc2V0cylcbiAgICBsZXQgbmV3UmVtb3ZlcyA9IHByZXZSZW1vdmVzLmZpbHRlcigoYXR0cikgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHJlbW92ZXMpXG5cbiAgICBET00ucHV0U3RpY2t5KGVsLCBcImF0dHJzXCIsIGN1cnJlbnRFbCA9PiB7XG4gICAgICBuZXdSZW1vdmVzLmZvckVhY2goYXR0ciA9PiBjdXJyZW50RWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpKVxuICAgICAgbmV3U2V0cy5mb3JFYWNoKChbYXR0ciwgdmFsXSkgPT4gY3VycmVudEVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpKVxuICAgICAgcmV0dXJuIFtuZXdTZXRzLCBuZXdSZW1vdmVzXVxuICAgIH0pXG4gIH0sXG5cbiAgaGFzQWxsQ2xhc3NlcyhlbCwgY2xhc3Nlcyl7IHJldHVybiBjbGFzc2VzLmV2ZXJ5KG5hbWUgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKSB9LFxuXG4gIGlzVG9nZ2xlZE91dChlbCwgb3V0Q2xhc3Nlcyl7XG4gICAgcmV0dXJuICF0aGlzLmlzVmlzaWJsZShlbCkgfHwgdGhpcy5oYXNBbGxDbGFzc2VzKGVsLCBvdXRDbGFzc2VzKVxuICB9LFxuXG4gIGZpbHRlclRvRWxzKGxpdmVTb2NrZXQsIHNvdXJjZUVsLCB7dG99KXtcbiAgICBsZXQgZGVmYXVsdFF1ZXJ5ID0gKCkgPT4ge1xuICAgICAgaWYodHlwZW9mKHRvKSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRvKVxuICAgICAgfSBlbHNlIGlmKHRvLmNsb3Nlc3Qpe1xuICAgICAgICBsZXQgdG9FbCA9IHNvdXJjZUVsLmNsb3Nlc3QodG8uY2xvc2VzdClcbiAgICAgICAgcmV0dXJuIHRvRWwgPyBbdG9FbF0gOiBbXVxuICAgICAgfSBlbHNlIGlmKHRvLmlubmVyKXtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUVsLnF1ZXJ5U2VsZWN0b3JBbGwodG8uaW5uZXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0byA/IGxpdmVTb2NrZXQuanNRdWVyeVNlbGVjdG9yQWxsKHNvdXJjZUVsLCB0bywgZGVmYXVsdFF1ZXJ5KSA6IFtzb3VyY2VFbF1cbiAgfSxcblxuICBkZWZhdWx0RGlzcGxheShlbCl7XG4gICAgcmV0dXJuIHt0cjogXCJ0YWJsZS1yb3dcIiwgdGQ6IFwidGFibGUtY2VsbFwifVtlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCldIHx8IFwiYmxvY2tcIlxuICB9LFxuXG4gIHRyYW5zaXRpb25DbGFzc2VzKHZhbCl7XG4gICAgaWYoIXZhbCl7IHJldHVybiBudWxsIH1cblxuICAgIGxldCBbdHJhbnMsIHRTdGFydCwgdEVuZF0gPSBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwgOiBbdmFsLnNwbGl0KFwiIFwiKSwgW10sIFtdXVxuICAgIHRyYW5zID0gQXJyYXkuaXNBcnJheSh0cmFucykgPyB0cmFucyA6IHRyYW5zLnNwbGl0KFwiIFwiKVxuICAgIHRTdGFydCA9IEFycmF5LmlzQXJyYXkodFN0YXJ0KSA/IHRTdGFydCA6IHRTdGFydC5zcGxpdChcIiBcIilcbiAgICB0RW5kID0gQXJyYXkuaXNBcnJheSh0RW5kKSA/IHRFbmQgOiB0RW5kLnNwbGl0KFwiIFwiKVxuICAgIHJldHVybiBbdHJhbnMsIHRTdGFydCwgdEVuZF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKU1xuIiwgImltcG9ydCBKUyBmcm9tIFwiLi9qc1wiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmNvbnN0IEhPT0tfSUQgPSBcImhvb2tJZFwiXG5cbmxldCB2aWV3SG9va0lEID0gMVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0hvb2sge1xuICBzdGF0aWMgbWFrZUlEKCl7IHJldHVybiB2aWV3SG9va0lEKysgfVxuICBzdGF0aWMgZWxlbWVudElEKGVsKXsgcmV0dXJuIERPTS5wcml2YXRlKGVsLCBIT09LX0lEKSB9XG5cbiAgY29uc3RydWN0b3IodmlldywgZWwsIGNhbGxiYWNrcyl7XG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5fX2F0dGFjaFZpZXcodmlldylcbiAgICB0aGlzLl9fY2FsbGJhY2tzID0gY2FsbGJhY2tzXG4gICAgdGhpcy5fX2xpc3RlbmVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgSE9PS19JRCwgdGhpcy5jb25zdHJ1Y3Rvci5tYWtlSUQoKSlcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9fY2FsbGJhY2tzKXsgdGhpc1trZXldID0gdGhpcy5fX2NhbGxiYWNrc1trZXldIH1cbiAgfVxuXG4gIF9fYXR0YWNoVmlldyh2aWV3KXtcbiAgICBpZih2aWV3KXtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4gdmlld1xuICAgICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGhvb2sgbm90IHlldCBhdHRhY2hlZCB0byBhIGxpdmUgdmlldzogJHt0aGlzLmVsLm91dGVySFRNTH1gKVxuICAgICAgfVxuICAgICAgdGhpcy5saXZlU29ja2V0ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIF9fbW91bnRlZCgpeyB0aGlzLm1vdW50ZWQgJiYgdGhpcy5tb3VudGVkKCkgfVxuICBfX3VwZGF0ZWQoKXsgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpIH1cbiAgX19iZWZvcmVVcGRhdGUoKXsgdGhpcy5iZWZvcmVVcGRhdGUgJiYgdGhpcy5iZWZvcmVVcGRhdGUoKSB9XG4gIF9fZGVzdHJveWVkKCl7XG4gICAgdGhpcy5kZXN0cm95ZWQgJiYgdGhpcy5kZXN0cm95ZWQoKVxuICAgIERPTS5kZWxldGVQcml2YXRlKHRoaXMuZWwsIEhPT0tfSUQpIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNDk2XG4gIH1cbiAgX19yZWNvbm5lY3RlZCgpe1xuICAgIGlmKHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCl7XG4gICAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWNvbm5lY3RlZCAmJiB0aGlzLnJlY29ubmVjdGVkKClcbiAgICB9XG4gIH1cbiAgX19kaXNjb25uZWN0ZWQoKXtcbiAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSB0cnVlXG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgJiYgdGhpcy5kaXNjb25uZWN0ZWQoKVxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIHRoZSBob29rIHRvIEpTIGNvbW1hbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge1ZpZXdIb29rfSBob29rIC0gVGhlIFZpZXdIb29rIGluc3RhbmNlIHRvIGJpbmQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIG1ldGhvZHMgdG8gbWFuaXB1bGF0ZSB0aGUgRE9NIGFuZCBleGVjdXRlIEphdmFTY3JpcHQuXG4gICAqL1xuICBqcygpe1xuICAgIGxldCBob29rID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogRXhlY3V0ZXMgZW5jb2RlZCBKYXZhU2NyaXB0IGluIHRoZSBjb250ZXh0IG9mIHRoZSBob29rIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGVuY29kZWRKUyAtIFRoZSBlbmNvZGVkIEphdmFTY3JpcHQgc3RyaW5nIHRvIGV4ZWN1dGUuXG4gICAgICAgKi9cbiAgICAgIGV4ZWMoZW5jb2RlZEpTKXtcbiAgICAgICAgaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0LmV4ZWNKUyhob29rLmVsLCBlbmNvZGVkSlMsIFwiaG9va1wiKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTaG93cyBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gc2hvdy5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldCB3aGVuIHNob3dpbmcuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZV0gLSBUaGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMuIERlZmF1bHRzIDIwMC5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgc2hvdyhlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5zaG93KFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEhpZGVzIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBoaWRlLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnRyYW5zaXRpb25dIC0gVGhlIENTUyB0cmFuc2l0aW9uIGNsYXNzZXMgdG8gc2V0IHdoZW4gaGlkaW5nLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLiBEZWZhdWx0cyAyMDAuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJsb2NraW5nXSAtIFRoZSBib29sZWFuIGZsYWcgdG8gYmxvY2sgdGhlIFVJIGR1cmluZyB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqICAgRGVmYXVsdHMgYHRydWVgLlxuICAgICAgICovXG4gICAgICBoaWRlKGVsLCBvcHRzID0ge30pe1xuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLmhpZGUoXCJob29rXCIsIG93bmVyLCBlbCwgbnVsbCwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5pbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyBmb3Igc2hvd2luZy5cbiAgICAgICAqICAgQWNjZXB0cyBlaXRoZXIgdGhlIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgaW4sIG9yXG4gICAgICAgKiAgIGEgMy10dXBsZSBjb250YWluaW5nIHRoZSB0cmFuc2l0aW9uIGNsYXNzLCB0aGUgY2xhc3MgdG8gYXBwbHlcbiAgICAgICAqICAgdG8gc3RhcnQgdGhlIHRyYW5zaXRpb24sIGFuZCB0aGUgZW5kaW5nIHRyYW5zaXRpb24gY2xhc3MsIHN1Y2ggYXM6XG4gICAgICAgKlxuICAgICAgICogICAgICAgW1wiZWFzZS1vdXQgZHVyYXRpb24tMzAwXCIsIFwib3BhY2l0eS0wXCIsIFwib3BhY2l0eS0xMDBcIl1cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMub3V0XSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIGZvciBoaWRpbmcuXG4gICAgICAgKiAgIEFjY2VwdHMgZWl0aGVyIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgb3V0LCBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHRvZ2dsZShlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBvcHRzLmluID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy5pbilcbiAgICAgICAgb3B0cy5vdXQgPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLm91dClcbiAgICAgICAgSlMudG9nZ2xlKFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy5pbiwgb3B0cy5vdXQsIG9wdHMudGltZSwgb3B0cy5ibG9ja2luZylcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyBDU1MgY2xhc3NlcyB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYWRkIGNsYXNzZXMgdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byBhZGQuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gcHJvcGVydHkgdG8gc2V0LlxuICAgICAgICogICBBY2NlcHRzIGEgc3RyaW5nIG9mIGNsYXNzZXMgdG8gYXBwbHkgd2hlbiBhZGRpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMFwiLCBcIm9wYWNpdHktMTAwXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgYWRkQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG5hbWVzLCBbXSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmVzIENTUyBjbGFzc2VzIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSBjbGFzc2VzIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byByZW1vdmUuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyB0byBzZXQuXG4gICAgICAgKiAgIEFjY2VwdHMgYSBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHJlbW92aW5nIGNsYXNzZXMgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIm9wYWNpdHktMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBuYW1lcywgb3B0cyA9IHt9KXtcbiAgICAgICAgb3B0cy50cmFuc2l0aW9uID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy50cmFuc2l0aW9uKVxuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBuYW1lcywgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIENTUyBjbGFzc2VzIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgY2xhc3NlcyBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBuYW1lcyAtIFRoZSBjbGFzcyBuYW1lKHMpIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldC5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdG9nZ2xlQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBvcHRzLnRyYW5zaXRpb24gPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLnRyYW5zaXRpb24pXG4gICAgICAgIG5hbWVzID0gQXJyYXkuaXNBcnJheShuYW1lcykgPyBuYW1lcyA6IG5hbWVzLnNwbGl0KFwiIFwiKVxuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCBvcHRzLnRyYW5zaXRpb24sIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFwcGxpZXMgYSBDU1MgdHJhbnNpdGlvbiB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYXBwbHkgdGhlIHRyYW5zaXRpb24gdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdHJhbnNpdGlvbiAtIFRoZSB0cmFuc2l0aW9uIGNsYXNzKGVzKSB0byBhcHBseS5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdHJhbnNpdGlvbmluZyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdHJhbnNpdGlvbihlbCwgdHJhbnNpdGlvbiwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBbXSwgSlMudHJhbnNpdGlvbkNsYXNzZXModHJhbnNpdGlvbiksIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNldHMgYW4gYXR0cmlidXRlIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBzZXQgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHNldC5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwgLSBUaGUgdmFsdWUgdG8gc2V0IGZvciB0aGUgYXR0cmlidXRlLlxuICAgICAgICovXG4gICAgICBzZXRBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbCl7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKSB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZXMgYW4gYXR0cmlidXRlIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byByZW1vdmUuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShlbCwgYXR0cil7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtdLCBbYXR0cl0pIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlcyBhbiBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudCBiZXR3ZWVuIHR3byB2YWx1ZXMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwxIC0gVGhlIGZpcnN0IHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbDIgLSBUaGUgc2Vjb25kIHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICovXG4gICAgICB0b2dnbGVBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbDEsIHZhbDIpeyBKUy50b2dnbGVBdHRyKGVsLCBhdHRyLCB2YWwxLCB2YWwyKSB9LFxuICAgIH1cbiAgfVxuXG4gIHB1c2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9LCBvblJlcGx5KXtcbiAgICBpZihvblJlcGx5ID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZWYgPSB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIChyZXBseSwgX3JlZikgPT4gcmVzb2x2ZShyZXBseSkpXG4gICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwidW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gIH1cblxuICBwdXNoRXZlbnRUbyhwaHhUYXJnZXQsIGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkpe1xuICAgIGlmKG9uUmVwbHkgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZiA9IHZpZXcucHVzaEhvb2tFdmVudCh0aGlzLmVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCAocmVwbHksIF9yZWYpID0+IHJlc29sdmUocmVwbHkpKVxuICAgICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICByZXR1cm4gdmlldy5wdXNoSG9va0V2ZW50KHRoaXMuZWwsIHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IGNhbGxiYWNrUmVmID0gKGN1c3RvbUV2ZW50LCBieXBhc3MpID0+IGJ5cGFzcyA/IGV2ZW50IDogY2FsbGJhY2soY3VzdG9tRXZlbnQuZGV0YWlsKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmFkZChjYWxsYmFja1JlZilcbiAgICByZXR1cm4gY2FsbGJhY2tSZWZcbiAgfVxuXG4gIHJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKXtcbiAgICBsZXQgZXZlbnQgPSBjYWxsYmFja1JlZihudWxsLCB0cnVlKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFja1JlZilcbiAgfVxuXG4gIHVwbG9hZChuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkuZGlzcGF0Y2hVcGxvYWRzKG51bGwsIG5hbWUsIGZpbGVzKVxuICB9XG5cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcuZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXMpXG4gICAgfSlcbiAgfVxuXG4gIF9fY2xlYW51cF9fKCl7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrUmVmID0+IHRoaXMucmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpKVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCxcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgQ09OU0VDVVRJVkVfUkVMT0FEUyxcbiAgUEhYX0FVVE9fUkVDT1ZFUixcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0NPTk5FQ1RFRF9DTEFTUyxcbiAgUEhYX0RJU0FCTEVfV0lUSCxcbiAgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLFxuICBQSFhfRElTQUJMRUQsXG4gIFBIWF9MT0FESU5HX0NMQVNTLFxuICBQSFhfRVJST1JfQ0xBU1MsXG4gIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1MsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9IT09LLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJPR1JFU1MsXG4gIFBIWF9SRUFET05MWSxcbiAgUEhYX1JFRl9MT0FESU5HLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9TVElDS1ksXG4gIFBIWF9UUkFDS19TVEFUSUMsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9NQUlOLFxuICBQSFhfTU9VTlRFRCxcbiAgUFVTSF9USU1FT1VULFxuICBQSFhfVklFV1BPUlRfVE9QLFxuICBQSFhfVklFV1BPUlRfQk9UVE9NLFxuICBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGlzRW1wdHksXG4gIGlzRXF1YWxPYmosXG4gIGxvZ0Vycm9yLFxuICBtYXliZSxcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRWxlbWVudFJlZiBmcm9tIFwiLi9lbGVtZW50X3JlZlwiXG5pbXBvcnQgRE9NUGF0Y2ggZnJvbSBcIi4vZG9tX3BhdGNoXCJcbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5pbXBvcnQgUmVuZGVyZWQgZnJvbSBcIi4vcmVuZGVyZWRcIlxuaW1wb3J0IFZpZXdIb29rIGZyb20gXCIuL3ZpZXdfaG9va1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5pbXBvcnQgbW9ycGhkb20gZnJvbSBcIm1vcnBoZG9tXCJcblxuZXhwb3J0IGxldCBwcmVwZW5kRm9ybURhdGFLZXkgPSAoa2V5LCBwcmVmaXgpID0+IHtcbiAgbGV0IGlzQXJyYXkgPSBrZXkuZW5kc1dpdGgoXCJbXVwiKVxuICAvLyBSZW1vdmUgdGhlIFwiW11cIiBpZiBpdCdzIGFuIGFycmF5XG4gIGxldCBiYXNlS2V5ID0gaXNBcnJheSA/IGtleS5zbGljZSgwLCAtMikgOiBrZXlcbiAgLy8gUmVwbGFjZSBsYXN0IG9jY3VycmVuY2Ugb2Yga2V5IGJlZm9yZSBhIGNsb3NpbmcgYnJhY2tldCBvciB0aGUgZW5kIHdpdGgga2V5IHBsdXMgc3VmZml4XG4gIGJhc2VLZXkgPSBiYXNlS2V5LnJlcGxhY2UoLyhbXlxcW1xcXV0rKShcXF0/JCkvLCBgJHtwcmVmaXh9JDEkMmApXG4gIC8vIEFkZCBiYWNrIHRoZSBcIltdXCIgaWYgaXQgd2FzIGFuIGFycmF5XG4gIGlmKGlzQXJyYXkpeyBiYXNlS2V5ICs9IFwiW11cIiB9XG4gIHJldHVybiBiYXNlS2V5XG59XG5cbmxldCBzZXJpYWxpemVGb3JtID0gKGZvcm0sIG9wdHMsIG9ubHlOYW1lcyA9IFtdKSA9PiB7XG4gIGNvbnN0IHtzdWJtaXR0ZXJ9ID0gb3B0c1xuXG4gIC8vIFdlIG11c3QgaW5qZWN0IHRoZSBzdWJtaXR0ZXIgaW4gdGhlIG9yZGVyIHRoYXQgaXQgZXhpc3RzIGluIHRoZSBET01cbiAgLy8gcmVsYXRpdmUgdG8gb3RoZXIgaW5wdXRzLiBGb3IgZXhhbXBsZSwgZm9yIGNoZWNrYm94IGdyb3VwcywgdGhlIG9yZGVyIG11c3QgYmUgbWFpbnRhaW5lZC5cbiAgbGV0IGluamVjdGVkRWxlbWVudFxuICBpZihzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUpe1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCJcbiAgICAvLyBzZXQgdGhlIGZvcm0gYXR0cmlidXRlIGlmIHRoZSBzdWJtaXR0ZXIgaGFzIG9uZTtcbiAgICAvLyB0aGlzIGNhbiBoYXBwZW4gaWYgdGhlIGVsZW1lbnQgaXMgb3V0c2lkZSB0aGUgYWN0dWFsIGZvcm0gZWxlbWVudFxuICAgIGNvbnN0IGZvcm1JZCA9IHN1Ym1pdHRlci5nZXRBdHRyaWJ1dGUoXCJmb3JtXCIpXG4gICAgaWYoZm9ybUlkKXtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImZvcm1cIiwgZm9ybUlkKVxuICAgIH1cbiAgICBpbnB1dC5uYW1lID0gc3VibWl0dGVyLm5hbWVcbiAgICBpbnB1dC52YWx1ZSA9IHN1Ym1pdHRlci52YWx1ZVxuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dCwgc3VibWl0dGVyKVxuICAgIGluamVjdGVkRWxlbWVudCA9IGlucHV0XG4gIH1cblxuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKVxuICBjb25zdCB0b1JlbW92ZSA9IFtdXG5cbiAgZm9ybURhdGEuZm9yRWFjaCgodmFsLCBrZXksIF9pbmRleCkgPT4ge1xuICAgIGlmKHZhbCBpbnN0YW5jZW9mIEZpbGUpeyB0b1JlbW92ZS5wdXNoKGtleSkgfVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgYnVpbGRpbmcgZmlsZURhdGFcbiAgdG9SZW1vdmUuZm9yRWFjaChrZXkgPT4gZm9ybURhdGEuZGVsZXRlKGtleSkpXG5cbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG5cbiAgY29uc3Qge2lucHV0c1VudXNlZCwgb25seUhpZGRlbklucHV0c30gPSBBcnJheS5mcm9tKGZvcm0uZWxlbWVudHMpLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGNvbnN0IHtpbnB1dHNVbnVzZWQsIG9ubHlIaWRkZW5JbnB1dHN9ID0gYWNjXG4gICAgY29uc3Qga2V5ID0gaW5wdXQubmFtZVxuICAgIGlmKCFrZXkpeyByZXR1cm4gYWNjIH1cblxuICAgIGlmKGlucHV0c1VudXNlZFtrZXldID09PSB1bmRlZmluZWQpeyBpbnB1dHNVbnVzZWRba2V5XSA9IHRydWUgfVxuICAgIGlmKG9ubHlIaWRkZW5JbnB1dHNba2V5XSA9PT0gdW5kZWZpbmVkKXsgb25seUhpZGRlbklucHV0c1trZXldID0gdHJ1ZSB9XG5cbiAgICBjb25zdCBpc1VzZWQgPSBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKSB8fCBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpXG4gICAgY29uc3QgaXNIaWRkZW4gPSBpbnB1dC50eXBlID09PSBcImhpZGRlblwiXG4gICAgaW5wdXRzVW51c2VkW2tleV0gPSBpbnB1dHNVbnVzZWRba2V5XSAmJiAhaXNVc2VkXG4gICAgb25seUhpZGRlbklucHV0c1trZXldID0gb25seUhpZGRlbklucHV0c1trZXldICYmIGlzSGlkZGVuXG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHtpbnB1dHNVbnVzZWQ6IHt9LCBvbmx5SGlkZGVuSW5wdXRzOiB7fX0pXG5cbiAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSl7XG4gICAgaWYob25seU5hbWVzLmxlbmd0aCA9PT0gMCB8fCBvbmx5TmFtZXMuaW5kZXhPZihrZXkpID49IDApe1xuICAgICAgbGV0IGlzVW51c2VkID0gaW5wdXRzVW51c2VkW2tleV1cbiAgICAgIGxldCBoaWRkZW4gPSBvbmx5SGlkZGVuSW5wdXRzW2tleV1cbiAgICAgIGlmKGlzVW51c2VkICYmICEoc3VibWl0dGVyICYmIHN1Ym1pdHRlci5uYW1lID09IGtleSkgJiYgIWhpZGRlbil7XG4gICAgICAgIHBhcmFtcy5hcHBlbmQocHJlcGVuZEZvcm1EYXRhS2V5KGtleSwgXCJfdW51c2VkX1wiKSwgXCJcIilcbiAgICAgIH1cbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpXG4gICAgfVxuICB9XG5cbiAgLy8gcmVtb3ZlIHRoZSBpbmplY3RlZCBlbGVtZW50IGFnYWluXG4gIC8vIChpdCB3b3VsZCBiZSByZW1vdmVkIGJ5IHRoZSBuZXh0IGRvbSBwYXRjaCBhbnl3YXksIGJ1dCB0aGlzIGlzIGNsZWFuZXIpXG4gIGlmKHN1Ym1pdHRlciAmJiBpbmplY3RlZEVsZW1lbnQpe1xuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGluamVjdGVkRWxlbWVudClcbiAgfVxuXG4gIHJldHVybiBwYXJhbXMudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgc3RhdGljIGNsb3Nlc3RWaWV3KGVsKXtcbiAgICBsZXQgbGl2ZVZpZXdFbCA9IGVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpXG4gICAgcmV0dXJuIGxpdmVWaWV3RWwgPyBET00ucHJpdmF0ZShsaXZlVmlld0VsLCBcInZpZXdcIikgOiBudWxsXG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbCwgbGl2ZVNvY2tldCwgcGFyZW50VmlldywgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZmxhc2ggPSBmbGFzaFxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Vmlld1xuICAgIHRoaXMucm9vdCA9IHBhcmVudFZpZXcgPyBwYXJlbnRWaWV3LnJvb3QgOiB0aGlzXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgXCJ2aWV3XCIsIHRoaXMpXG4gICAgdGhpcy5pZCA9IHRoaXMuZWwuaWRcbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLmxhc3RBY2tSZWYgPSBudWxsXG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMubG9hZGVyVGltZXIgPSBudWxsXG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnJlZGlyZWN0ID0gZmFsc2VcbiAgICB0aGlzLmhyZWYgPSBudWxsXG4gICAgdGhpcy5qb2luQ291bnQgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmpvaW5Db3VudCAtIDEgOiAwXG4gICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSBmdW5jdGlvbihvbkRvbmUpeyBvbkRvbmUgJiYgb25Eb25lKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSB0aGlzLnBhcmVudCA/IG51bGwgOiBbXVxuICAgIHRoaXMudmlld0hvb2tzID0ge31cbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gW11cbiAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5wYXJlbnQgPyBudWxsIDoge31cbiAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0gPSB7fVxuICAgIHRoaXMuZm9ybXNGb3JSZWNvdmVyeSA9IHt9XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5saXZlU29ja2V0LmNoYW5uZWwoYGx2OiR7dGhpcy5pZH1gLCAoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5ocmVmICYmIHRoaXMuZXhwYW5kVVJMKHRoaXMuaHJlZilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0OiB0aGlzLnJlZGlyZWN0ID8gdXJsIDogdW5kZWZpbmVkLFxuICAgICAgICB1cmw6IHRoaXMucmVkaXJlY3QgPyB1bmRlZmluZWQgOiB1cmwgfHwgdW5kZWZpbmVkLFxuICAgICAgICBwYXJhbXM6IHRoaXMuY29ubmVjdFBhcmFtcyhsaXZlUmVmZXJlciksXG4gICAgICAgIHNlc3Npb246IHRoaXMuZ2V0U2Vzc2lvbigpLFxuICAgICAgICBzdGF0aWM6IHRoaXMuZ2V0U3RhdGljKCksXG4gICAgICAgIGZsYXNoOiB0aGlzLmZsYXNoLFxuICAgICAgICBzdGlja3k6IHRoaXMuZWwuaGFzQXR0cmlidXRlKFBIWF9TVElDS1kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHNldEhyZWYoaHJlZil7IHRoaXMuaHJlZiA9IGhyZWYgfVxuXG4gIHNldFJlZGlyZWN0KGhyZWYpe1xuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlXG4gICAgdGhpcy5ocmVmID0gaHJlZlxuICB9XG5cbiAgaXNNYWluKCl7IHJldHVybiB0aGlzLmVsLmhhc0F0dHJpYnV0ZShQSFhfTUFJTikgfVxuXG4gIGNvbm5lY3RQYXJhbXMobGl2ZVJlZmVyZXIpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG4gICAgcGFyYW1zW1wiX21vdW50X2F0dGVtcHRzXCJdID0gdGhpcy5qb2luQXR0ZW1wdHNcbiAgICBwYXJhbXNbXCJfbGl2ZV9yZWZlcmVyXCJdID0gbGl2ZVJlZmVyZXJcbiAgICB0aGlzLmpvaW5BdHRlbXB0cysrXG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfTE9BRElOR19DTEFTUyxcbiAgICAgIFBIWF9FUlJPUl9DTEFTUyxcbiAgICAgIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gICAgICBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9MT0FESU5HX0NMQVNTKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWNBbGwoYmluZGluZyl7XG4gICAgRE9NLmFsbCh0aGlzLmVsLCBgWyR7YmluZGluZ31dYCwgZWwgPT4gdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKGJpbmRpbmcpKSlcbiAgfVxuXG4gIGhpZGVMb2FkZXIoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5kaXNjb25uZWN0ZWRUaW1lcilcbiAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoUEhYX0NPTk5FQ1RFRF9DTEFTUylcbiAgICB0aGlzLmV4ZWNBbGwodGhpcy5iaW5kaW5nKFwiY29ubmVjdGVkXCIpKVxuICB9XG5cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX3JlY29ubmVjdGVkKCkgfVxuICB9XG5cbiAgbG9nKGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIC8vIGNhbGxzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSB2aWV3IGFuZCB0YXJnZXQgZWxlbWVudCBmb3IgdGhlIGdpdmVuIHBoeFRhcmdldFxuICAvLyB0YXJnZXRzIGNhbiBiZTpcbiAgLy8gICogYW4gZWxlbWVudCBpdHNlbGYsIHRoZW4gaXQgaXMgc2ltcGx5IHBhc3NlZCB0byBsaXZlU29ja2V0Lm93bmVyO1xuICAvLyAgKiBhIENJRCAoQ29tcG9uZW50IElEKSwgdGhlbiB3ZSBmaXJzdCBzZWFyY2ggdGhlIGNvbXBvbmVudCdzIGVsZW1lbnQgaW4gdGhlIERPTVxuICAvLyAgKiBhIHNlbGVjdG9yLCB0aGVuIHdlIHNlYXJjaCB0aGUgc2VsZWN0b3IgaW4gdGhlIERPTSBhbmQgY2FsbCB0aGUgY2FsbGJhY2tcbiAgLy8gICAgZm9yIGVhY2ggZWxlbWVudCBmb3VuZCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIG93bmVyIHZpZXdcbiAgd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrLCBkb20gPSBkb2N1bWVudCwgdmlld0VsKXtcbiAgICAvLyBpbiB0aGUgZm9ybSByZWNvdmVyeSBjYXNlIHdlIHNlYXJjaCBpbiBhIHRlbXBsYXRlIGZyYWdtZW50IGluc3RlYWQgb2ZcbiAgICAvLyB0aGUgcmVhbCBkb20sIHRoZXJlZm9yZSB3ZSBvcHRpb25hbGx5IHBhc3MgZG9tIGFuZCB2aWV3RWxcblxuICAgIGlmKHBoeFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IHBoeFRhcmdldCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpe1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5vd25lcihwaHhUYXJnZXQsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgcGh4VGFyZ2V0KSlcbiAgICB9XG5cbiAgICBpZihpc0NpZChwaHhUYXJnZXQpKXtcbiAgICAgIGxldCB0YXJnZXRzID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh2aWV3RWwgfHwgdGhpcy5lbCwgcGh4VGFyZ2V0KVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApe1xuICAgICAgICBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvdW5kIG1hdGNoaW5nIHBoeC10YXJnZXQgb2YgJHtwaHhUYXJnZXR9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMsIHBhcnNlSW50KHBoeFRhcmdldCkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRzID0gQXJyYXkuZnJvbShkb20ucXVlcnlTZWxlY3RvckFsbChwaHhUYXJnZXQpKVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm90aGluZyBmb3VuZCBtYXRjaGluZyB0aGUgcGh4LXRhcmdldCBzZWxlY3RvciBcIiR7cGh4VGFyZ2V0fVwiYCkgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldCA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHRhcmdldCkpKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5RGlmZih0eXBlLCByYXdEaWZmLCBjYWxsYmFjayl7XG4gICAgdGhpcy5sb2codHlwZSwgKCkgPT4gW1wiXCIsIGNsb25lKHJhd0RpZmYpXSlcbiAgICBsZXQge2RpZmYsIHJlcGx5LCBldmVudHMsIHRpdGxlfSA9IFJlbmRlcmVkLmV4dHJhY3QocmF3RGlmZilcbiAgICBjYWxsYmFjayh7ZGlmZiwgcmVwbHksIGV2ZW50c30pXG4gICAgaWYodHlwZW9mIHRpdGxlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT0gXCJtb3VudFwiKXsgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBET00ucHV0VGl0bGUodGl0bGUpKSB9XG4gIH1cblxuICBvbkpvaW4ocmVzcCl7XG4gICAgbGV0IHtyZW5kZXJlZCwgY29udGFpbmVyLCBsaXZldmlld192ZXJzaW9ufSA9IHJlc3BcbiAgICBpZihjb250YWluZXIpe1xuICAgICAgbGV0IFt0YWcsIGF0dHJzXSA9IGNvbnRhaW5lclxuICAgICAgdGhpcy5lbCA9IERPTS5yZXBsYWNlUm9vdENvbnRhaW5lcih0aGlzLmVsLCB0YWcsIGF0dHJzKVxuICAgIH1cbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmZsYXNoID0gbnVsbFxuICAgIGlmKHRoaXMucm9vdCA9PT0gdGhpcyl7XG4gICAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB0aGlzLmdldEZvcm1zRm9yUmVjb3ZlcnkoKVxuICAgIH1cbiAgICBpZih0aGlzLmlzTWFpbigpICYmIHdpbmRvdy5oaXN0b3J5LnN0YXRlID09PSBudWxsKXtcbiAgICAgIC8vIHNldCBpbml0aWFsIGhpc3RvcnkgZW50cnkgaWYgdGhpcyBpcyB0aGUgZmlyc3QgcGFnZSBsb2FkIChubyBoaXN0b3J5KVxuICAgICAgQnJvd3Nlci5wdXNoU3RhdGUoXCJyZXBsYWNlXCIsIHtcbiAgICAgICAgdHlwZTogXCJwYXRjaFwiLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgcG9zaXRpb246IHRoaXMubGl2ZVNvY2tldC5jdXJyZW50SGlzdG9yeVBvc2l0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGxpdmV2aWV3X3ZlcnNpb24gIT09IHRoaXMubGl2ZVNvY2tldC52ZXJzaW9uKCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTGl2ZVZpZXcgYXNzZXQgdmVyc2lvbiBtaXNtYXRjaC4gSmF2YVNjcmlwdCB2ZXJzaW9uICR7dGhpcy5saXZlU29ja2V0LnZlcnNpb24oKX0gdnMuIHNlcnZlciAke2xpdmV2aWV3X3ZlcnNpb259LiBUbyBhdm9pZCBpc3N1ZXMsIHBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGFzc2V0cyB1c2UgdGhlIHNhbWUgdmVyc2lvbiBhcyB0aGUgc2VydmVyLmApXG4gICAgfVxuXG4gICAgQnJvd3Nlci5kcm9wTG9jYWwodGhpcy5saXZlU29ja2V0LmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTKVxuICAgIHRoaXMuYXBwbHlEaWZmKFwibW91bnRcIiwgcmVuZGVyZWQsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IG5ldyBSZW5kZXJlZCh0aGlzLmlkLCBkaWZmKVxuICAgICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyQ29udGFpbmVyKG51bGwsIFwiam9pblwiKVxuICAgICAgdGhpcy5kcm9wUGVuZGluZ1JlZnMoKVxuICAgICAgdGhpcy5qb2luQ291bnQrK1xuICAgICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG5cbiAgICAgIHRoaXMubWF5YmVSZWNvdmVyRm9ybXMoaHRtbCwgKCkgPT4ge1xuICAgICAgICB0aGlzLm9uSm9pbkNvbXBsZXRlKHJlc3AsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRyb3BQZW5kaW5nUmVmcygpe1xuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYCwgZWwgPT4ge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfTE9BRElORylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbkNvbXBsZXRlKHtsaXZlX3BhdGNofSwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICAvLyBJbiBvcmRlciB0byBwcm92aWRlIGEgYmV0dGVyIGV4cGVyaWVuY2UsIHdlIHdhbnQgdG8gam9pblxuICAgIC8vIGFsbCBMaXZlVmlld3MgZmlyc3QgYW5kIG9ubHkgdGhlbiBhcHBseSB0aGVpciBwYXRjaGVzLlxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSB8fCAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LmlzSm9pblBlbmRpbmcoKSkpe1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgIH1cblxuICAgIC8vIE9uZSBkb3duc2lkZSBvZiB0aGlzIGFwcHJvYWNoIGlzIHRoYXQgd2UgbmVlZCB0byBmaW5kIHBoeENoaWxkcmVuXG4gICAgLy8gaW4gdGhlIGh0bWwgZnJhZ21lbnQsIGluc3RlYWQgb2YgZGlyZWN0bHkgb24gdGhlIERPTS4gVGhlIGZyYWdtZW50XG4gICAgLy8gYWxzbyBkb2VzIG5vdCBpbmNsdWRlIFBIWF9TVEFUSUMsIHNvIHdlIG5lZWQgdG8gY29weSBpdCBvdmVyIGZyb21cbiAgICAvLyB0aGUgRE9NLlxuICAgIGxldCBuZXdDaGlsZHJlbiA9IERPTS5maW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHRoaXMuaWQpLmZpbHRlcih0b0VsID0+IHtcbiAgICAgIGxldCBmcm9tRWwgPSB0b0VsLmlkICYmIHRoaXMuZWwucXVlcnlTZWxlY3RvcihgW2lkPVwiJHt0b0VsLmlkfVwiXWApXG4gICAgICBsZXQgcGh4U3RhdGljID0gZnJvbUVsICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICAgIGlmKHBoeFN0YXRpYyl7IHRvRWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHBoeFN0YXRpYykgfVxuICAgICAgLy8gc2V0IFBIWF9ST09UX0lEIHRvIHByZXZlbnQgZXZlbnRzIGZyb20gYmVpbmcgZGlzcGF0Y2hlZCB0byB0aGUgcm9vdCB2aWV3XG4gICAgICAvLyB3aGlsZSB0aGUgY2hpbGQgam9pbiBpcyBzdGlsbCBwZW5kaW5nXG4gICAgICBpZihmcm9tRWwpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3QuaWQpIH1cbiAgICAgIHJldHVybiB0aGlzLmpvaW5DaGlsZCh0b0VsKVxuICAgIH0pXG5cbiAgICBpZihuZXdDaGlsZHJlbi5sZW5ndGggPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICAgIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICB9XG4gIH1cblxuICBhdHRhY2hUcnVlRG9jRWwoKXtcbiAgICB0aGlzLmVsID0gRE9NLmJ5SWQodGhpcy5pZClcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKVxuICB9XG5cbiAgLy8gdGhpcyBpcyBpbnZva2VkIGZvciBkZWFkIGFuZCBsaXZlIHZpZXdzLCBzbyB3ZSBtdXN0IGZpbHRlciBieVxuICAvLyBieSBvd25lciB0byBlbnN1cmUgd2UgYXJlbid0IGR1cGxpY2F0aW5nIGhvb2tzIGFjcm9zcyBkaXNjb25uZWN0XG4gIC8vIGFuZCBjb25uZWN0ZWQgc3RhdGVzLiBUaGlzIGFsc28gaGFuZGxlcyBjYXNlcyB3aGVyZSBob29rcyBleGlzdFxuICAvLyBpbiBhIHJvb3QgbGF5b3V0IHdpdGggYSBMViBpbiB0aGUgYm9keVxuICBleGVjTmV3TW91bnRlZChwYXJlbnQgPSB0aGlzLmVsKXtcbiAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUClcbiAgICBsZXQgcGh4Vmlld3BvcnRCb3R0b20gPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX0JPVFRPTSlcbiAgICBET00uYWxsKHBhcmVudCwgYFske3BoeFZpZXdwb3J0VG9wfV0sIFske3BoeFZpZXdwb3J0Qm90dG9tfV1gLCBob29rRWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChob29rRWwpKXtcbiAgICAgICAgRE9NLm1haW50YWluUHJpdmF0ZUhvb2tzKGhvb2tFbCwgaG9va0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dLCBbZGF0YS1waHgtJHtQSFhfSE9PS31dYCwgaG9va0VsID0+IHtcbiAgICAgIGlmKHRoaXMub3duc0VsZW1lbnQoaG9va0VsKSl7XG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9NT1VOVEVEKX1dYCwgZWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChlbCkpe1xuICAgICAgICB0aGlzLm1heWJlTW91bnRlZChlbClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICB0aGlzLmF0dGFjaFRydWVEb2NFbCgpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIHN0cmVhbXMsIG51bGwpXG4gICAgcGF0Y2gubWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKVxuICAgIHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCBmYWxzZSwgdHJ1ZSlcbiAgICB0aGlzLmpvaW5OZXdDaGlsZHJlbigpXG4gICAgdGhpcy5leGVjTmV3TW91bnRlZCgpXG5cbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG5cbiAgICBpZihsaXZlX3BhdGNoKXtcbiAgICAgIGxldCB7a2luZCwgdG99ID0gbGl2ZV9wYXRjaFxuICAgICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgICB9XG4gICAgdGhpcy5oaWRlTG9hZGVyKClcbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEpeyB0aGlzLnRyaWdnZXJSZWNvbm5lY3RlZCgpIH1cbiAgICB0aGlzLnN0b3BDYWxsYmFjaygpXG4gIH1cblxuICB0cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhmcm9tRWwsIHRvRWwpe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25CZWZvcmVFbFVwZGF0ZWRcIiwgW2Zyb21FbCwgdG9FbF0pXG4gICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soZnJvbUVsKVxuICAgIGxldCBpc0lnbm9yZWQgPSBob29rICYmIERPTS5pc0lnbm9yZWQoZnJvbUVsLCB0aGlzLmJpbmRpbmcoUEhYX1VQREFURSkpXG4gICAgaWYoaG9vayAmJiAhZnJvbUVsLmlzRXF1YWxOb2RlKHRvRWwpICYmICEoaXNJZ25vcmVkICYmIGlzRXF1YWxPYmooZnJvbUVsLmRhdGFzZXQsIHRvRWwuZGF0YXNldCkpKXtcbiAgICAgIGhvb2suX19iZWZvcmVVcGRhdGUoKVxuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gIH1cblxuICBtYXliZU1vdW50ZWQoZWwpe1xuICAgIGxldCBwaHhNb3VudGVkID0gZWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfTU9VTlRFRCkpXG4gICAgbGV0IGhhc0JlZW5JbnZva2VkID0gcGh4TW91bnRlZCAmJiBET00ucHJpdmF0ZShlbCwgXCJtb3VudGVkXCIpXG4gICAgaWYocGh4TW91bnRlZCAmJiAhaGFzQmVlbkludm9rZWQpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgcGh4TW91bnRlZClcbiAgICAgIERPTS5wdXRQcml2YXRlKGVsLCBcIm1vdW50ZWRcIiwgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBtYXliZUFkZE5ld0hvb2soZWwpe1xuICAgIGxldCBuZXdIb29rID0gdGhpcy5hZGRIb29rKGVsKVxuICAgIGlmKG5ld0hvb2speyBuZXdIb29rLl9fbW91bnRlZCgpIH1cbiAgfVxuXG4gIHBlcmZvcm1QYXRjaChwYXRjaCwgcHJ1bmVDaWRzLCBpc0pvaW5QYXRjaCA9IGZhbHNlKXtcbiAgICBsZXQgcmVtb3ZlZEVscyA9IFtdXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuICAgIGxldCB1cGRhdGVkSG9va0lkcyA9IG5ldyBTZXQoKVxuXG4gICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvblBhdGNoU3RhcnRcIiwgW3BhdGNoLnRhcmdldENvbnRhaW5lcl0pXG5cbiAgICBwYXRjaC5hZnRlcihcImFkZGVkXCIsIGVsID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25Ob2RlQWRkZWRcIiwgW2VsXSlcbiAgICAgIGxldCBwaHhWaWV3cG9ydFRvcCA9IHRoaXMuYmluZGluZyhQSFhfVklFV1BPUlRfVE9QKVxuICAgICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gdGhpcy5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgICBET00ubWFpbnRhaW5Qcml2YXRlSG9va3MoZWwsIGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhlbClcbiAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVNb3VudGVkKGVsKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbCA9PiB7XG4gICAgICBpZihET00uaXNQaHhTdGlja3koZWwpKXtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LmpvaW5Sb290Vmlld3MoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybShpc0pvaW5QYXRjaClcbiAgICB0aGlzLmFmdGVyRWxlbWVudHNSZW1vdmVkKHJlbW92ZWRFbHMsIHBydW5lQ2lkcylcblxuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25QYXRjaEVuZFwiLCBbcGF0Y2gudGFyZ2V0Q29udGFpbmVyXSlcbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgbGV0IGhvb2tzID0gRE9NLmFsbChwYXJlbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV0sIFtkYXRhLXBoeC1ob29rXWApXG4gICAgICBjb21wb25lbnRzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBsZXQgY2lkID0gdGhpcy5jb21wb25lbnRJRChlbClcbiAgICAgICAgaWYoaXNDaWQoY2lkKSAmJiBkZXN0cm95ZWRDSURzLmluZGV4T2YoY2lkKSA9PT0gLTEpeyBkZXN0cm95ZWRDSURzLnB1c2goY2lkKSB9XG4gICAgICB9KVxuICAgICAgaG9va3MuY29uY2F0KHBhcmVudCkuZm9yRWFjaChob29rRWwgPT4ge1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMuZ2V0SG9vayhob29rRWwpXG4gICAgICAgIGhvb2sgJiYgdGhpcy5kZXN0cm95SG9vayhob29rKVxuICAgICAgfSlcbiAgICB9KVxuICAgIC8vIFdlIHNob3VsZCBub3QgcHJ1bmVDaWRzIG9uIGpvaW5zLiBPdGhlcndpc2UsIGluIGNhc2Ugb2ZcbiAgICAvLyByZWpvaW5zLCB3ZSBtYXkgbm90aWZ5IGNpZHMgdGhhdCBubyBsb25nZXIgYmVsb25nIHRvIHRoZVxuICAgIC8vIGN1cnJlbnQgTGl2ZVZpZXcgdG8gYmUgcmVtb3ZlZC5cbiAgICBpZihwcnVuZUNpZHMpe1xuICAgICAgdGhpcy5tYXliZVB1c2hDb21wb25lbnRzRGVzdHJveWVkKGRlc3Ryb3llZENJRHMpXG4gICAgfVxuICB9XG5cbiAgam9pbk5ld0NoaWxkcmVuKCl7XG4gICAgRE9NLmZpbmRQaHhDaGlsZHJlbih0aGlzLmVsLCB0aGlzLmlkKS5mb3JFYWNoKGVsID0+IHRoaXMuam9pbkNoaWxkKGVsKSlcbiAgfVxuXG4gIG1heWJlUmVjb3ZlckZvcm1zKGh0bWwsIGNhbGxiYWNrKXtcbiAgICBjb25zdCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICBjb25zdCBvbGRGb3JtcyA9IHRoaXMucm9vdC5mb3Jtc0ZvclJlY292ZXJ5XG4gICAgLy8gU28gd2h5IGRvIHdlIGNyZWF0ZSBhIHRlbXBsYXRlIGVsZW1lbnQgaGVyZT9cbiAgICAvLyBPbmUgd2F5IHRvIHJlY292ZXIgZm9ybXMgd291bGQgYmUgdG8gaW1tZWRpYXRlbHkgYXBwbHkgdGhlIG1vdW50XG4gICAgLy8gcGF0Y2ggYW5kIHRoZW4gYWZ0ZXJ3YXJkcyByZWNvdmVyIHRoZSBmb3Jtcy4gSG93ZXZlciwgdGhpcyB3b3VsZFxuICAgIC8vIGNhdXNlIGEgZmxpY2tlciwgYmVjYXVzZSB0aGUgbW91bnQgcGF0Y2ggd291bGQgcmVtb3ZlIHRoZSBmb3JtIGNvbnRlbnRcbiAgICAvLyB1bnRpbCBpdCBpcyByZXN0b3JlZC4gVGhlcmVmb3JlIExWIGRlY2lkZWQgdG8gZG8gZm9ybSByZWNvdmVyeSB3aXRoIHRoZVxuICAgIC8vIHJhdyBIVE1MIGJlZm9yZSBpdCBpcyBhcHBsaWVkIGFuZCBkZWxheSB0aGUgbW91bnQgcGF0Y2ggdW50aWwgdGhlIGZvcm1cbiAgICAvLyByZWNvdmVyeSBldmVudHMgYXJlIGRvbmUuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIC8vIGJlY2F1c2Ugd2Ugd29yayB3aXRoIGEgdGVtcGxhdGUgZWxlbWVudCwgd2UgbXVzdCBtYW51YWxseSBjb3B5IHRoZSBhdHRyaWJ1dGVzXG4gICAgLy8gb3RoZXJ3aXNlIHRoZSBvd25lciAvIHRhcmdldCBoZWxwZXJzIGRvbid0IHdvcmsgcHJvcGVybHlcbiAgICBjb25zdCByb290RWwgPSB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgcm9vdEVsLmlkID0gdGhpcy5pZFxuICAgIHJvb3RFbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdC5pZClcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCB0aGlzLmdldFNlc3Npb24oKSlcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHRoaXMuZ2V0U3RhdGljKCkpXG4gICAgcm9vdEVsLnNldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lELCB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmlkIDogbnVsbClcblxuICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm0gZWxlbWVudHMgaW4gdGhlIG5ldyBIVE1MIGZvciB0aGUgTFZcbiAgICAvLyBhbmQgbG9vayBmb3Igb2xkIGZvcm1zIGluIHRoZSBgZm9ybXNGb3JSZWNvdmVyeWAgb2JqZWN0O1xuICAgIC8vIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IGNhbiBhbHNvIGNvbnRhaW4gZm9ybXMgZnJvbSBjaGlsZCB2aWV3c1xuICAgIGNvbnN0IGZvcm1zVG9SZWNvdmVyID1cbiAgICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm1zIGluIHRoZSBuZXcgRE9NOyBiZWNhdXNlIHRoaXMgaXMgb25seSB0aGUgSFRNTCBmb3IgdGhlIGN1cnJlbnRcbiAgICAgIC8vIHZpZXcsIHdlIGNhbiBiZSBzdXJlIHRoYXQgYWxsIGZvcm1zIGFyZSBvd25lZCBieSB0aGlzIHZpZXc6XG4gICAgICBET00uYWxsKHRlbXBsYXRlLmNvbnRlbnQsIFwiZm9ybVwiKVxuICAgICAgICAvLyBvbmx5IHJlY292ZXIgZm9ybXMgdGhhdCBoYXZlIGFuIGlkIGFuZCBhcmUgaW4gdGhlIG9sZCBET01cbiAgICAgICAgLmZpbHRlcihuZXdGb3JtID0+IG5ld0Zvcm0uaWQgJiYgb2xkRm9ybXNbbmV3Rm9ybS5pZF0pXG4gICAgICAgIC8vIGFiYW5kb24gZm9ybXMgd2UgYWxyZWFkeSB0cmllZCB0byByZWNvdmVyIHRvIHByZXZlbnQgbG9vcGluZyBhIGZhaWxlZCBzdGF0ZVxuICAgICAgICAuZmlsdGVyKG5ld0Zvcm0gPT4gIXRoaXMucGVuZGluZ0Zvcm1zLmhhcyhuZXdGb3JtLmlkKSlcbiAgICAgICAgLy8gb25seSByZWNvdmVyIGlmIHRoZSBmb3JtIGhhcyB0aGUgc2FtZSBwaHgtY2hhbmdlIHZhbHVlXG4gICAgICAgIC5maWx0ZXIobmV3Rm9ybSA9PiBvbGRGb3Jtc1tuZXdGb3JtLmlkXS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSA9PT0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSlcbiAgICAgICAgLm1hcChuZXdGb3JtID0+IHtcbiAgICAgICAgICByZXR1cm4gW29sZEZvcm1zW25ld0Zvcm0uaWRdLCBuZXdGb3JtXVxuICAgICAgICB9KVxuXG4gICAgaWYoZm9ybXNUb1JlY292ZXIubGVuZ3RoID09PSAwKXtcbiAgICAgIHJldHVybiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgZm9ybXNUb1JlY292ZXIuZm9yRWFjaCgoW29sZEZvcm0sIG5ld0Zvcm1dLCBpKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdGb3Jtcy5hZGQobmV3Rm9ybS5pZClcbiAgICAgIC8vIGl0IGlzIGltcG9ydGFudCB0byB1c2UgdGhlIGZpcnN0RWxlbWVudENoaWxkIG9mIHRoZSB0ZW1wbGF0ZSBjb250ZW50XG4gICAgICAvLyBiZWNhdXNlIHdoZW4gdHJhdmVyc2luZyBhIGRvY3VtZW50RnJhZ21lbnQgdXNpbmcgcGFyZW50Tm9kZSwgd2Ugd29uJ3QgZXZlciBhcnJpdmUgYXRcbiAgICAgIC8vIHRoZSBmcmFnbWVudDsgYXMgdGhlIHRlbXBsYXRlIGlzIGFsd2F5cyBhIExpdmVWaWV3LCB3ZSBjYW4gYmUgc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHlcbiAgICAgIC8vIG9uZSBjaGlsZCBvbiB0aGUgcm9vdCBsZXZlbFxuICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KG9sZEZvcm0sIG5ld0Zvcm0sIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsICgpID0+IHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRm9ybXMuZGVsZXRlKG5ld0Zvcm0uaWQpXG4gICAgICAgIC8vIHdlIG9ubHkgY2FsbCB0aGUgY2FsbGJhY2sgb25jZSBhbGwgZm9ybXMgaGF2ZSBiZWVuIHJlY292ZXJlZFxuICAgICAgICBpZihpID09PSBmb3Jtc1RvUmVjb3Zlci5sZW5ndGggLSAxKXtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldENoaWxkQnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1baWRdIH1cblxuICBnZXREZXNjZW5kZW50QnlFbChlbCl7XG4gICAgaWYoZWwuaWQgPT09IHRoaXMuaWQpe1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXT8uW2VsLmlkXVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lEZXNjZW5kZW50KGlkKXtcbiAgICBmb3IobGV0IHBhcmVudElkIGluIHRoaXMucm9vdC5jaGlsZHJlbil7XG4gICAgICBmb3IobGV0IGNoaWxkSWQgaW4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXSl7XG4gICAgICAgIGlmKGNoaWxkSWQgPT09IGlkKXsgcmV0dXJuIHRoaXMucm9vdC5jaGlsZHJlbltwYXJlbnRJZF1bY2hpbGRJZF0uZGVzdHJveSgpIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBqb2luQ2hpbGQoZWwpe1xuICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGRCeUlkKGVsLmlkKVxuICAgIGlmKCFjaGlsZCl7XG4gICAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLmxpdmVTb2NrZXQsIHRoaXMpXG4gICAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1bdmlldy5pZF0gPSB2aWV3XG4gICAgICB2aWV3LmpvaW4oKVxuICAgICAgdGhpcy5jaGlsZEpvaW5zKytcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgaXNKb2luUGVuZGluZygpeyByZXR1cm4gdGhpcy5qb2luUGVuZGluZyB9XG5cbiAgYWNrSm9pbihfY2hpbGQpe1xuICAgIHRoaXMuY2hpbGRKb2lucy0tXG5cbiAgICBpZih0aGlzLmNoaWxkSm9pbnMgPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnBhcmVudC5hY2tKb2luKHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpe1xuICAgIC8vIHdlIGNhbiBjbGVhciBwZW5kaW5nIGZvcm0gcmVjb3ZlcmllcyBub3cgdGhhdCB3ZSd2ZSBqb2luZWQuXG4gICAgLy8gVGhleSBlaXRoZXIgYWxsIHJlc29sdmVkIG9yIHdlcmUgYWJhbmRvbmVkXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMuY2xlYXIoKVxuICAgIC8vIHdlIGNhbiBhbHNvIGNsZWFyIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IG9iamVjdCB0byBub3Qga2VlcCBvbGQgZm9ybSBlbGVtZW50cyBhcm91bmRcbiAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB7fVxuICAgIHRoaXMuam9pbkNhbGxiYWNrKCgpID0+IHtcbiAgICAgIHRoaXMucGVuZGluZ0pvaW5PcHMuZm9yRWFjaCgoW3ZpZXcsIG9wXSkgPT4ge1xuICAgICAgICBpZighdmlldy5pc0Rlc3Ryb3llZCgpKXsgb3AoKSB9XG4gICAgICB9KVxuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcyA9IFtdXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZShkaWZmLCBldmVudHMsIGlzUGVuZGluZz1mYWxzZSl7XG4gICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkgfHwgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHRoaXMucm9vdC5pc01haW4oKSkpe1xuICAgICAgLy8gZG9uJ3QgbXV0YXRlIGlmIHRoaXMgaXMgYWxyZWFkeSBhIHBlbmRpbmcgZGlmZlxuICAgICAgaWYoIWlzUGVuZGluZyl7XG4gICAgICAgIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goe2RpZmYsIGV2ZW50c30pXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVkLm1lcmdlRGlmZihkaWZmKVxuICAgIGxldCBwaHhDaGlsZHJlbkFkZGVkID0gZmFsc2VcblxuICAgIC8vIFdoZW4gdGhlIGRpZmYgb25seSBjb250YWlucyBjb21wb25lbnQgZGlmZnMsIHRoZW4gd2FsayBjb21wb25lbnRzXG4gICAgLy8gYW5kIHBhdGNoIG9ubHkgdGhlIHBhcmVudCBjb21wb25lbnQgY29udGFpbmVycyBmb3VuZCBpbiB0aGUgZGlmZi5cbiAgICAvLyBPdGhlcndpc2UsIHBhdGNoIGVudGlyZSBMViBjb250YWluZXIuXG4gICAgaWYodGhpcy5yZW5kZXJlZC5pc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiY29tcG9uZW50IHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IHBhcmVudENpZHMgPSBET00uZmluZEV4aXN0aW5nUGFyZW50Q0lEcyh0aGlzLmVsLCB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikpXG4gICAgICAgIHBhcmVudENpZHMuZm9yRWFjaChwYXJlbnRDSUQgPT4ge1xuICAgICAgICAgIGlmKHRoaXMuY29tcG9uZW50UGF0Y2godGhpcy5yZW5kZXJlZC5nZXRDb21wb25lbnQoZGlmZiwgcGFyZW50Q0lEKSwgcGFyZW50Q0lEKSl7IHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCFpc0VtcHR5KGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiZnVsbCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlckNvbnRhaW5lcihkaWZmLCBcInVwZGF0ZVwiKVxuICAgICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgc3RyZWFtcywgbnVsbClcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIGlmKHBoeENoaWxkcmVuQWRkZWQpeyB0aGlzLmpvaW5OZXdDaGlsZHJlbigpIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICByZW5kZXJDb250YWluZXIoZGlmZiwga2luZCl7XG4gICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC50aW1lKGB0b1N0cmluZyBkaWZmICgke2tpbmR9KWAsICgpID0+IHtcbiAgICAgIGxldCB0YWcgPSB0aGlzLmVsLnRhZ05hbWVcbiAgICAgIC8vIERvbid0IHNraXAgYW55IGNvbXBvbmVudCBpbiB0aGUgZGlmZiBub3IgYW55IG1hcmtlZCBhcyBwcnVuZWRcbiAgICAgIC8vIChhcyB0aGV5IG1heSBoYXZlIGJlZW4gYWRkZWQgYmFjaylcbiAgICAgIGxldCBjaWRzID0gZGlmZiA/IHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKSA6IG51bGxcbiAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlcmVkLnRvU3RyaW5nKGNpZHMpXG4gICAgICByZXR1cm4gW2A8JHt0YWd9PiR7aHRtbH08LyR7dGFnfT5gLCBzdHJlYW1zXVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRQYXRjaChkaWZmLCBjaWQpe1xuICAgIGlmKGlzRW1wdHkoZGlmZikpIHJldHVybiBmYWxzZVxuICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudFRvU3RyaW5nKGNpZClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgc3RyZWFtcywgY2lkKVxuICAgIGxldCBjaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpXG4gICAgcmV0dXJuIGNoaWxkcmVuQWRkZWRcbiAgfVxuXG4gIGdldEhvb2soZWwpeyByZXR1cm4gdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGVsKV0gfVxuXG4gIGFkZEhvb2soZWwpe1xuICAgIGxldCBob29rRWxJZCA9IFZpZXdIb29rLmVsZW1lbnRJRChlbClcblxuICAgIC8vIG9ubHkgZXZlciB0cnkgdG8gYWRkIGhvb2tzIHRvIGVsZW1lbnRzIG93bmVkIGJ5IHRoaXMgdmlld1xuICAgIGlmKGVsLmdldEF0dHJpYnV0ZSAmJiAhdGhpcy5vd25zRWxlbWVudChlbCkpeyByZXR1cm4gfVxuXG4gICAgaWYoaG9va0VsSWQgJiYgIXRoaXMudmlld0hvb2tzW2hvb2tFbElkXSl7XG4gICAgICAvLyBob29rIGNyZWF0ZWQsIGJ1dCBub3QgYXR0YWNoZWQgKGNyZWF0ZUhvb2sgZm9yIHdlYiBjb21wb25lbnQpXG4gICAgICBsZXQgaG9vayA9IERPTS5nZXRDdXN0b21FbEhvb2soZWwpIHx8IGxvZ0Vycm9yKGBubyBob29rIGZvdW5kIGZvciBjdXN0b20gZWxlbWVudDogJHtlbC5pZH1gKVxuICAgICAgdGhpcy52aWV3SG9va3NbaG9va0VsSWRdID0gaG9va1xuICAgICAgaG9vay5fX2F0dGFjaFZpZXcodGhpcylcbiAgICAgIHJldHVybiBob29rXG4gICAgfVxuICAgIGVsc2UgaWYoaG9va0VsSWQgfHwgIWVsLmdldEF0dHJpYnV0ZSl7XG4gICAgICAvLyBubyBob29rIGZvdW5kXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbmV3IGhvb2sgZm91bmQgd2l0aCBwaHgtaG9vayBhdHRyaWJ1dGVcbiAgICAgIGxldCBob29rTmFtZSA9IGVsLmdldEF0dHJpYnV0ZShgZGF0YS1waHgtJHtQSFhfSE9PS31gKSB8fCBlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9IT09LKSlcbiAgICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLmxpdmVTb2NrZXQuZ2V0SG9va0NhbGxiYWNrcyhob29rTmFtZSlcblxuICAgICAgaWYoY2FsbGJhY2tzKXtcbiAgICAgICAgaWYoIWVsLmlkKXsgbG9nRXJyb3IoYG5vIERPTSBJRCBmb3IgaG9vayBcIiR7aG9va05hbWV9XCIuIEhvb2tzIHJlcXVpcmUgYSB1bmlxdWUgSUQgb24gZWFjaCBlbGVtZW50LmAsIGVsKSB9XG4gICAgICAgIGxldCBob29rID0gbmV3IFZpZXdIb29rKHRoaXMsIGVsLCBjYWxsYmFja3MpXG4gICAgICAgIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV0gPSBob29rXG4gICAgICAgIHJldHVybiBob29rXG4gICAgICB9IGVsc2UgaWYoaG9va05hbWUgIT09IG51bGwpe1xuICAgICAgICBsb2dFcnJvcihgdW5rbm93biBob29rIGZvdW5kIGZvciBcIiR7aG9va05hbWV9XCJgLCBlbClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95SG9vayhob29rKXtcbiAgICAvLyBfX2Rlc3Ryb3llZCBjbGVhcnMgdGhlIGVsZW1lbnRJRCBmcm9tIHRoZSBob29rLCB0aGVyZWZvcmVcbiAgICAvLyB3ZSBuZWVkIHRvIGdldCBpdCBiZWZvcmUgY2FsbGluZyBfX2Rlc3Ryb3llZFxuICAgIGNvbnN0IGhvb2tJZCA9IFZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKVxuICAgIGhvb2suX19kZXN0cm95ZWQoKVxuICAgIGhvb2suX19jbGVhbnVwX18oKVxuICAgIGRlbGV0ZSB0aGlzLnZpZXdIb29rc1tob29rSWRdXG4gIH1cblxuICBhcHBseVBlbmRpbmdVcGRhdGVzKCl7XG4gICAgLy8gVG8gcHJldmVudCByYWNlIGNvbmRpdGlvbnMgd2hlcmUgd2UgbWlnaHQgc3RpbGwgYmUgcGVuZGluZyBhIG5ld1xuICAgIC8vIG5hdmlnYXRpb24gb3IgdGhlIGpvaW4gaXMgc3RpbGwgcGVuZGluZywgYHRoaXMudXBkYXRlYCByZXR1cm5zIGZhbHNlXG4gICAgLy8gaWYgdGhlIGRpZmYgd2FzIG5vdCBhcHBsaWVkLlxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gdGhpcy5wZW5kaW5nRGlmZnMuZmlsdGVyKFxuICAgICAgKHtkaWZmLCBldmVudHN9KSA9PiAhdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzLCB0cnVlKSxcbiAgICApXG4gICAgdGhpcy5lYWNoQ2hpbGQoKGNoaWxkKSA9PiBjaGlsZC5hcHBseVBlbmRpbmdVcGRhdGVzKCkpXG4gIH1cblxuICBlYWNoQ2hpbGQoY2FsbGJhY2spe1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSB8fCB7fVxuICAgIGZvcihsZXQgaWQgaW4gY2hpbGRyZW4peyBjYWxsYmFjayh0aGlzLmdldENoaWxkQnlJZChpZCkpIH1cbiAgfVxuXG4gIG9uQ2hhbm5lbChldmVudCwgY2Ipe1xuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiBjYihyZXNwKV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZENoYW5uZWwoKXtcbiAgICAvLyBUaGUgZGlmZiBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgcmVndWxhciB1cGRhdGUgb3BlcmF0aW9ucy5cbiAgICAvLyBBbGwgb3RoZXIgb3BlcmF0aW9ucyBhcmUgcXVldWVkIHRvIGJlIGFwcGxpZWQgb25seSBhZnRlciBqb2luLlxuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBcImRpZmZcIiwgKHJhd0RpZmYpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmF3RGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMub25DaGFubmVsKFwicmVkaXJlY3RcIiwgKHt0bywgZmxhc2h9KSA9PiB0aGlzLm9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0pKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9yZWRpcmVjdFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUmVkaXJlY3QocmVkaXIpKVxuICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLm9uRXJyb3IocmVhc29uKSlcbiAgICB0aGlzLmNoYW5uZWwub25DbG9zZShyZWFzb24gPT4gdGhpcy5vbkNsb3NlKHJlYXNvbikpXG4gIH1cblxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKXsgdGhpcy5lYWNoQ2hpbGQoY2hpbGQgPT4gY2hpbGQuZGVzdHJveSgpKSB9XG5cbiAgb25MaXZlUmVkaXJlY3QocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmQsIGZsYXNofSA9IHJlZGlyXG4gICAgbGV0IHVybCA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OnNlcnZlci1uYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7dG8sIGtpbmQsIGZsYXNofX0pXG4gICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlSZWRpcmVjdChlLCB1cmwsIGtpbmQsIGZsYXNoKVxuICB9XG5cbiAgb25MaXZlUGF0Y2gocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmR9ID0gcmVkaXJcbiAgICB0aGlzLmhyZWYgPSB0aGlzLmV4cGFuZFVSTCh0bylcbiAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVBhdGNoKHRvLCBraW5kKVxuICB9XG5cbiAgZXhwYW5kVVJMKHRvKXtcbiAgICByZXR1cm4gdG8uc3RhcnRzV2l0aChcIi9cIikgPyBgJHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0fSR7dG99YCA6IHRvXG4gIH1cblxuICBvblJlZGlyZWN0KHt0bywgZmxhc2gsIHJlbG9hZFRva2VufSl7IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh0bywgZmxhc2gsIHJlbG9hZFRva2VuKSB9XG5cbiAgaXNEZXN0cm95ZWQoKXsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICBqb2luRGVhZCgpeyB0aGlzLmlzRGVhZCA9IHRydWUgfVxuXG4gIGpvaW5QdXNoKCl7XG4gICAgdGhpcy5qb2luUHVzaCA9IHRoaXMuam9pblB1c2ggfHwgdGhpcy5jaGFubmVsLmpvaW4oKVxuICAgIHJldHVybiB0aGlzLmpvaW5QdXNoXG4gIH1cblxuICBqb2luKGNhbGxiYWNrKXtcbiAgICB0aGlzLnNob3dMb2FkZXIodGhpcy5saXZlU29ja2V0LmxvYWRlclRpbWVvdXQpXG4gICAgdGhpcy5iaW5kQ2hhbm5lbCgpXG4gICAgaWYodGhpcy5pc01haW4oKSl7XG4gICAgICB0aGlzLnN0b3BDYWxsYmFjayA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiaW5pdGlhbFwifSlcbiAgICB9XG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSAob25Eb25lKSA9PiB7XG4gICAgICBvbkRvbmUgPSBvbkRvbmUgfHwgZnVuY3Rpb24oKXt9XG4gICAgICBjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuam9pbkNvdW50LCBvbkRvbmUpIDogb25Eb25lKClcbiAgICB9XG5cbiAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5qb2luKCksIHtcbiAgICAgIG9rOiAocmVzcCkgPT4gdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4gdGhpcy5vbkpvaW4ocmVzcCkpLFxuICAgICAgZXJyb3I6IChlcnJvcikgPT4gdGhpcy5vbkpvaW5FcnJvcihlcnJvciksXG4gICAgICB0aW1lb3V0OiAoKSA9PiB0aGlzLm9uSm9pbkVycm9yKHtyZWFzb246IFwidGltZW91dFwifSlcbiAgICB9KVxuICB9XG5cbiAgb25Kb2luRXJyb3IocmVzcCl7XG4gICAgaWYocmVzcC5yZWFzb24gPT09IFwicmVsb2FkXCIpe1xuICAgICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbYGZhaWxlZCBtb3VudCB3aXRoICR7cmVzcC5zdGF0dXN9LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZWxvYWRgLCByZXNwXSlcbiAgICAgIHRoaXMub25SZWRpcmVjdCh7dG86IHRoaXMucm9vdC5ocmVmLCByZWxvYWRUb2tlbjogcmVzcC50b2tlbn0pXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYocmVzcC5yZWFzb24gPT09IFwidW5hdXRob3JpemVkXCIgfHwgcmVzcC5yZWFzb24gPT09IFwic3RhbGVcIil7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYXV0aG9yaXplZCBsaXZlX3JlZGlyZWN0LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZXF1ZXN0XCIsIHJlc3BdKVxuICAgICAgdGhpcy5vblJlZGlyZWN0KHt0bzogdGhpcy5yb290LmhyZWYsIGZsYXNoOiB0aGlzLmZsYXNofSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZihyZXNwLnJlZGlyZWN0IHx8IHJlc3AubGl2ZV9yZWRpcmVjdCl7XG4gICAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuY2hhbm5lbC5sZWF2ZSgpXG4gICAgfVxuICAgIGlmKHJlc3AucmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vblJlZGlyZWN0KHJlc3AucmVkaXJlY3QpIH1cbiAgICBpZihyZXNwLmxpdmVfcmVkaXJlY3QpeyByZXR1cm4gdGhpcy5vbkxpdmVSZWRpcmVjdChyZXNwLmxpdmVfcmVkaXJlY3QpIH1cbiAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYWJsZSB0byBqb2luXCIsIHJlc3BdKVxuICAgIGlmKHRoaXMuaXNNYWluKCkpe1xuICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxpdmVTb2NrZXQucmVsb2FkV2l0aEppdHRlcih0aGlzKSB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuam9pbkF0dGVtcHRzID49IE1BWF9DSElMRF9KT0lOX0FUVEVNUFRTKXtcbiAgICAgICAgLy8gcHV0IHRoZSByb290IHJldmlldyBpbnRvIHBlcm1hbmVudCBlcnJvciBzdGF0ZSwgYnV0IGRvbid0IGRlc3Ryb3kgaXQgYXMgaXQgY2FuIHJlbWFpbiBhY3RpdmVcbiAgICAgICAgdGhpcy5yb290LmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW2BnaXZpbmcgdXAgdHJ5aW5nIHRvIG1vdW50IGFmdGVyICR7TUFYX0NISUxEX0pPSU5fQVRURU1QVFN9IHRyaWVzYCwgcmVzcF0pXG4gICAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICBsZXQgdHJ1ZUNoaWxkRWwgPSBET00uYnlJZCh0aGlzLmVsLmlkKVxuICAgICAgaWYodHJ1ZUNoaWxkRWwpe1xuICAgICAgICBET00ubWVyZ2VBdHRycyh0cnVlQ2hpbGRFbCwgdGhpcy5lbClcbiAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgICB0aGlzLmVsID0gdHJ1ZUNoaWxkRWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DbG9zZShyZWFzb24pe1xuICAgIGlmKHRoaXMuaXNEZXN0cm95ZWQoKSl7IHJldHVybiB9XG4gICAgaWYodGhpcy5pc01haW4oKSAmJiB0aGlzLmxpdmVTb2NrZXQuaGFzUGVuZGluZ0xpbmsoKSAmJiByZWFzb24gIT09IFwibGVhdmVcIil7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcylcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95QWxsQ2hpbGRyZW4oKVxuICAgIHRoaXMubGl2ZVNvY2tldC5kcm9wQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIC8vIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgY2FuIGJlIG51bGwgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KXsgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCkgfVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpe1xuICAgICAgdGhpcy5zaG93TG9hZGVyKEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQpXG4gICAgfVxuICB9XG5cbiAgb25FcnJvcihyZWFzb24pe1xuICAgIHRoaXMub25DbG9zZShyZWFzb24pXG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInZpZXcgY3Jhc2hlZFwiLCByZWFzb25dKSB9XG4gICAgaWYoIXRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpe1xuICAgICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpe1xuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX0NMSUVOVF9FUlJPUl9DTEFTU10pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheUVycm9yKGNsYXNzZXMpe1xuICAgIGlmKHRoaXMuaXNNYWluKCkpeyBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiB7dG86IHRoaXMuaHJlZiwga2luZDogXCJlcnJvclwifX0pIH1cbiAgICB0aGlzLnNob3dMb2FkZXIoKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyguLi5jbGFzc2VzKVxuICAgIHRoaXMuZGVsYXllZERpc2Nvbm5lY3RlZCgpXG4gIH1cblxuICBkZWxheWVkRGlzY29ubmVjdGVkKCl7XG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5leGVjQWxsKHRoaXMuYmluZGluZyhcImRpc2Nvbm5lY3RlZFwiKSlcbiAgICB9LCB0aGlzLmxpdmVTb2NrZXQuZGlzY29ubmVjdGVkVGltZW91dClcbiAgfVxuXG4gIHdyYXBQdXNoKGNhbGxlclB1c2gsIHJlY2VpdmVzKXtcbiAgICBsZXQgbGF0ZW5jeSA9IHRoaXMubGl2ZVNvY2tldC5nZXRMYXRlbmN5U2ltKClcbiAgICBsZXQgd2l0aExhdGVuY3kgPSBsYXRlbmN5ID9cbiAgICAgIChjYikgPT4gc2V0VGltZW91dCgoKSA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIGNiKCksIGxhdGVuY3kpIDpcbiAgICAgIChjYikgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiBjYigpXG5cbiAgICB3aXRoTGF0ZW5jeSgoKSA9PiB7XG4gICAgICBjYWxsZXJQdXNoKClcbiAgICAgICAgLnJlY2VpdmUoXCJva1wiLCByZXNwID0+IHdpdGhMYXRlbmN5KCgpID0+IHJlY2VpdmVzLm9rICYmIHJlY2VpdmVzLm9rKHJlc3ApKSlcbiAgICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZWFzb24gPT4gd2l0aExhdGVuY3koKCkgPT4gcmVjZWl2ZXMuZXJyb3IgJiYgcmVjZWl2ZXMuZXJyb3IocmVhc29uKSkpXG4gICAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB3aXRoTGF0ZW5jeSgoKSA9PiByZWNlaXZlcy50aW1lb3V0ICYmIHJlY2VpdmVzLnRpbWVvdXQoKSkpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBldmVudCwgcGF5bG9hZCl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiBQcm9taXNlLnJlamVjdCh7ZXJyb3I6IFwibm9jb25uZWN0aW9uXCJ9KSB9XG5cbiAgICBsZXQgW3JlZiwgW2VsXSwgb3B0c10gPSByZWZHZW5lcmF0b3IgPyByZWZHZW5lcmF0b3IoKSA6IFtudWxsLCBbXSwge31dXG4gICAgbGV0IG9sZEpvaW5Db3VudCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IG9uTG9hZGluZ0RvbmUgPSBmdW5jdGlvbigpe31cbiAgICBpZihvcHRzLnBhZ2VfbG9hZGluZyl7XG4gICAgICBvbkxvYWRpbmdEb25lID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7a2luZDogXCJlbGVtZW50XCIsIHRhcmdldDogZWx9KVxuICAgIH1cblxuICAgIGlmKHR5cGVvZiAocGF5bG9hZC5jaWQpICE9PSBcIm51bWJlclwiKXsgZGVsZXRlIHBheWxvYWQuY2lkIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5wdXNoKGV2ZW50LCBwYXlsb2FkLCBQVVNIX1RJTUVPVVQpLCB7XG4gICAgICAgIG9rOiAocmVzcCkgPT4ge1xuICAgICAgICAgIGlmKHJlZiAhPT0gbnVsbCl7IHRoaXMubGFzdEFja1JlZiA9IHJlZiB9XG4gICAgICAgICAgbGV0IGZpbmlzaCA9IChob29rUmVwbHkpID0+IHtcbiAgICAgICAgICAgIGlmKHJlc3AucmVkaXJlY3QpeyB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3BhdGNoKXsgdGhpcy5vbkxpdmVQYXRjaChyZXNwLmxpdmVfcGF0Y2gpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgICAgICAgICBvbkxvYWRpbmdEb25lKClcbiAgICAgICAgICAgIHJlc29sdmUoe3Jlc3A6IHJlc3AsIHJlcGx5OiBob29rUmVwbHl9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXNwLmRpZmYpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByZXNwLmRpZmYsICh7ZGlmZiwgcmVwbHksIGV2ZW50c30pID0+IHtcbiAgICAgICAgICAgICAgICBpZihyZWYgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBheWxvYWQuZXZlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cylcbiAgICAgICAgICAgICAgICBmaW5pc2gocmVwbHkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihyZWYgIT09IG51bGwpeyB0aGlzLnVuZG9SZWZzKHJlZiwgcGF5bG9hZC5ldmVudCkgfVxuICAgICAgICAgICAgZmluaXNoKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKHJlYXNvbikgPT4gcmVqZWN0KHtlcnJvcjogcmVhc29ufSksXG4gICAgICAgIHRpbWVvdXQ6ICgpID0+IHtcbiAgICAgICAgICByZWplY3Qoe3RpbWVvdXQ6IHRydWV9KVxuICAgICAgICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSBvbGRKb2luQ291bnQpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZyhcInRpbWVvdXRcIiwgKCkgPT4gW1wicmVjZWl2ZWQgdGltZW91dCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggc2VydmVyLiBGYWxsaW5nIGJhY2sgdG8gaGFyZCByZWZyZXNoIGZvciByZWNvdmVyeVwiXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB1bmRvUmVmcyhyZWYsIHBoeEV2ZW50LCBvbmx5RWxzKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH0gLy8gZXhpdCBpZiBleHRlcm5hbCBmb3JtIHRyaWdnZXJlZFxuICAgIGxldCBzZWxlY3RvciA9IGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYFxuXG4gICAgaWYob25seUVscyl7XG4gICAgICBvbmx5RWxzID0gbmV3IFNldChvbmx5RWxzKVxuICAgICAgRE9NLmFsbChkb2N1bWVudCwgc2VsZWN0b3IsIHBhcmVudCA9PiB7XG4gICAgICAgIGlmKG9ubHlFbHMgJiYgIW9ubHlFbHMuaGFzKHBhcmVudCkpeyByZXR1cm4gfVxuICAgICAgICAvLyB1bmRvIGFueSBjaGlsZCByZWZzIHdpdGhpbiBwYXJlbnQgZmlyc3RcbiAgICAgICAgRE9NLmFsbChwYXJlbnQsIHNlbGVjdG9yLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICAgIHRoaXMudW5kb0VsUmVmKHBhcmVudCwgcmVmLCBwaHhFdmVudClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIHNlbGVjdG9yLCBlbCA9PiB0aGlzLnVuZG9FbFJlZihlbCwgcmVmLCBwaHhFdmVudCkpXG4gICAgfVxuICB9XG5cbiAgdW5kb0VsUmVmKGVsLCByZWYsIHBoeEV2ZW50KXtcbiAgICBsZXQgZWxSZWYgPSBuZXcgRWxlbWVudFJlZihlbClcblxuICAgIGVsUmVmLm1heWJlVW5kbyhyZWYsIHBoeEV2ZW50LCBjbG9uZWRUcmVlID0+IHtcbiAgICAgIC8vIHdlIG5lZWQgdG8gcGVyZm9ybSBhIGZ1bGwgcGF0Y2ggb24gdW5sb2NrZWQgZWxlbWVudHNcbiAgICAgIC8vIHRvIHBlcmZvcm0gYWxsIHRoZSBuZWNlc3NhcnkgbG9naWMgKGxpa2UgY2FsbGluZyB1cGRhdGVkIGZvciBob29rcywgZXRjLilcbiAgICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCBlbCwgdGhpcy5pZCwgY2xvbmVkVHJlZSwgW10sIG51bGwsIHt1bmRvUmVmOiByZWZ9KVxuICAgICAgY29uc3QgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgRE9NLmFsbChlbCwgYFske1BIWF9SRUZfU1JDfT1cIiR7dGhpcy5yZWZTcmMoKX1cIl1gLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICBpZihwaHhDaGlsZHJlbkFkZGVkKXsgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKSB9XG4gICAgfSlcbiAgfVxuXG4gIHJlZlNyYygpeyByZXR1cm4gdGhpcy5lbC5pZCB9XG5cbiAgcHV0UmVmKGVsZW1lbnRzLCBwaHhFdmVudCwgZXZlbnRUeXBlLCBvcHRzID0ge30pe1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZisrXG4gICAgbGV0IGRpc2FibGVXaXRoID0gdGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpXG4gICAgaWYob3B0cy5sb2FkaW5nKXtcbiAgICAgIGxldCBsb2FkaW5nRWxzID0gRE9NLmFsbChkb2N1bWVudCwgb3B0cy5sb2FkaW5nKS5tYXAoZWwgPT4ge1xuICAgICAgICByZXR1cm4ge2VsLCBsb2NrOiB0cnVlLCBsb2FkaW5nOiB0cnVlfVxuICAgICAgfSlcbiAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KGxvYWRpbmdFbHMpXG4gICAgfVxuXG4gICAgZm9yKGxldCB7ZWwsIGxvY2ssIGxvYWRpbmd9IG9mIGVsZW1lbnRzKXtcbiAgICAgIGlmKCFsb2NrICYmICFsb2FkaW5nKXsgdGhyb3cgbmV3IEVycm9yKFwicHV0UmVmIHJlcXVpcmVzIGxvY2sgb3IgbG9hZGluZ1wiKSB9XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMsIHRoaXMucmVmU3JjKCkpXG4gICAgICBpZihsb2FkaW5nKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9BRElORywgbmV3UmVmKSB9XG4gICAgICBpZihsb2NrKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9DSywgbmV3UmVmKSB9XG5cbiAgICAgIGlmKCFsb2FkaW5nIHx8IChvcHRzLnN1Ym1pdHRlciAmJiAhKGVsID09PSBvcHRzLnN1Ym1pdHRlciB8fCBlbCA9PT0gb3B0cy5mb3JtKSkpeyBjb250aW51ZSB9XG5cbiAgICAgIGxldCBsb2NrQ29tcGxldGVQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDp1bmRvLWxvY2s6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICB9KVxuXG4gICAgICBsZXQgbG9hZGluZ0NvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGBwaHg6dW5kby1sb2FkaW5nOiR7bmV3UmVmfWAsICgpID0+IHJlc29sdmUoZGV0YWlsKSwge29uY2U6IHRydWV9KVxuICAgICAgfSlcblxuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgcGh4LSR7ZXZlbnRUeXBlfS1sb2FkaW5nYClcbiAgICAgIGxldCBkaXNhYmxlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aClcbiAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBudWxsKXtcbiAgICAgICAgaWYoIWVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpKXtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLCBlbC5pbm5lclRleHQpXG4gICAgICAgIH1cbiAgICAgICAgaWYoZGlzYWJsZVRleHQgIT09IFwiXCIpeyBlbC5pbm5lclRleHQgPSBkaXNhYmxlVGV4dCB9XG4gICAgICAgIC8vIFBIWF9ESVNBQkxFRCBjb3VsZCBoYXZlIGFscmVhZHkgYmVlbiBzZXQgaW4gZGlzYWJsZUZvcm1cbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCkgfHwgZWwuZGlzYWJsZWQpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgICB9XG5cbiAgICAgIGxldCBkZXRhaWwgPSB7XG4gICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgIHJlZjogbmV3UmVmLFxuICAgICAgICBpc0xvYWRpbmc6IGxvYWRpbmcsXG4gICAgICAgIGlzTG9ja2VkOiBsb2NrLFxuICAgICAgICBsb2NrRWxlbWVudHM6IGVsZW1lbnRzLmZpbHRlcigoe2xvY2t9KSA9PiBsb2NrKS5tYXAoKHtlbH0pID0+IGVsKSxcbiAgICAgICAgbG9hZGluZ0VsZW1lbnRzOiBlbGVtZW50cy5maWx0ZXIoKHtsb2FkaW5nfSkgPT4gbG9hZGluZykubWFwKCh7ZWx9KSA9PiBlbCksXG4gICAgICAgIHVubG9jazogKGVscykgPT4ge1xuICAgICAgICAgIGVscyA9IEFycmF5LmlzQXJyYXkoZWxzKSA/IGVscyA6IFtlbHNdXG4gICAgICAgICAgdGhpcy51bmRvUmVmcyhuZXdSZWYsIHBoeEV2ZW50LCBlbHMpXG4gICAgICAgIH0sXG4gICAgICAgIGxvY2tDb21wbGV0ZTogbG9ja0NvbXBsZXRlUHJvbWlzZSxcbiAgICAgICAgbG9hZGluZ0NvbXBsZXRlOiBsb2FkaW5nQ29tcGxldGVQcm9taXNlLFxuICAgICAgICBsb2NrOiAobG9ja0VsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5pc0Fja2VkKG5ld1JlZikpeyByZXR1cm4gcmVzb2x2ZShkZXRhaWwpIH1cbiAgICAgICAgICAgIGxvY2tFbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLLCBuZXdSZWYpXG4gICAgICAgICAgICBsb2NrRWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCB0aGlzLnJlZlNyYygpKVxuICAgICAgICAgICAgbG9ja0VsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDpsb2NrLXN0b3A6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6cHVzaFwiLCB7XG4gICAgICAgIGRldGFpbDogZGV0YWlsLFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgfSkpXG4gICAgICBpZihwaHhFdmVudCl7XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6cHVzaDoke3BoeEV2ZW50fWAsIHtcbiAgICAgICAgICBkZXRhaWw6IGRldGFpbCxcbiAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW25ld1JlZiwgZWxlbWVudHMubWFwKCh7ZWx9KSA9PiBlbCksIG9wdHNdXG4gIH1cblxuICBpc0Fja2VkKHJlZil7IHJldHVybiB0aGlzLmxhc3RBY2tSZWYgIT09IG51bGwgJiYgdGhpcy5sYXN0QWNrUmVmID49IHJlZiB9XG5cbiAgY29tcG9uZW50SUQoZWwpe1xuICAgIGxldCBjaWQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpXG4gICAgcmV0dXJuIGNpZCA/IHBhcnNlSW50KGNpZCkgOiBudWxsXG4gIH1cblxuICB0YXJnZXRDb21wb25lbnRJRCh0YXJnZXQsIHRhcmdldEN0eCwgb3B0cyA9IHt9KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXsgcmV0dXJuIHRhcmdldEN0eCB9XG5cbiAgICBsZXQgY2lkT3JTZWxlY3RvciA9IG9wdHMudGFyZ2V0IHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwidGFyZ2V0XCIpKVxuICAgIGlmKGlzQ2lkKGNpZE9yU2VsZWN0b3IpKXtcbiAgICAgIHJldHVybiBwYXJzZUludChjaWRPclNlbGVjdG9yKVxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHggJiYgKGNpZE9yU2VsZWN0b3IgIT09IG51bGwgfHwgb3B0cy50YXJnZXQpKXtcbiAgICAgIHJldHVybiB0aGlzLmNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eCl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7XG4gICAgICByZXR1cm4gdGFyZ2V0Q3R4XG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCl7XG4gICAgICByZXR1cm4gbWF5YmUodGFyZ2V0Q3R4LmNsb3Nlc3QoYFske1BIWF9DT01QT05FTlR9XWApLCBlbCA9PiB0aGlzLm93bnNFbGVtZW50KGVsKSAmJiB0aGlzLmNvbXBvbmVudElEKGVsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwdXNoSG9va0V2ZW50KGVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5KXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgIHRoaXMubG9nKFwiaG9va1wiLCAoKSA9PiBbXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIsIGV2ZW50LCBwYXlsb2FkXSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgW3JlZiwgZWxzLCBvcHRzXSA9IHRoaXMucHV0UmVmKFt7ZWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XSwgZXZlbnQsIFwiaG9va1wiKVxuICAgIHRoaXMucHVzaFdpdGhSZXBseSgoKSA9PiBbcmVmLCBlbHMsIG9wdHNdLCBcImV2ZW50XCIsIHtcbiAgICAgIHR5cGU6IFwiaG9va1wiLFxuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgdmFsdWU6IHBheWxvYWQsXG4gICAgICBjaWQ6IHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9KS50aGVuKCh7cmVzcDogX3Jlc3AsIHJlcGx5OiBob29rUmVwbHl9KSA9PiBvblJlcGx5KGhvb2tSZXBseSwgcmVmKSlcblxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIGV4dHJhY3RNZXRhKGVsLCBtZXRhLCB2YWx1ZSl7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGxldCBuYW1lID0gZWwuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBpZihuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSl7IG1ldGFbbmFtZS5yZXBsYWNlKHByZWZpeCwgXCJcIildID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH1cbiAgICB9XG4gICAgaWYoZWwudmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhKGVsIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWVcblxuICAgICAgaWYoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKXtcbiAgICAgICAgZGVsZXRlIG1ldGEudmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsdWUpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpeyBtZXRhW2tleV0gPSB2YWx1ZVtrZXldIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFcbiAgfVxuXG4gIHB1c2hFdmVudCh0eXBlLCBlbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgbWV0YSwgb3B0cyA9IHt9LCBvblJlcGx5KXtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW3tlbCwgbG9hZGluZzogdHJ1ZSwgbG9jazogdHJ1ZX1dLCBwaHhFdmVudCwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIH0pXG4gICAgICAudGhlbigoe3JlcGx5fSkgPT4gb25SZXBseSAmJiBvblJlcGx5KHJlcGx5KSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZXZlbnRcIiwgZXJyb3IpKVxuICB9XG5cbiAgcHVzaEZpbGVQcm9ncmVzcyhmaWxlRWwsIGVudHJ5UmVmLCBwcm9ncmVzcywgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQud2l0aGluT3duZXJzKGZpbGVFbC5mb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICB2aWV3LnB1c2hXaXRoUmVwbHkobnVsbCwgXCJwcm9ncmVzc1wiLCB7XG4gICAgICAgIGV2ZW50OiBmaWxlRWwuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhQSFhfUFJPR1JFU1MpKSxcbiAgICAgICAgcmVmOiBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cnlfcmVmOiBlbnRyeVJlZixcbiAgICAgICAgcHJvZ3Jlc3M6IHByb2dyZXNzLFxuICAgICAgICBjaWQ6IHZpZXcudGFyZ2V0Q29tcG9uZW50SUQoZmlsZUVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZmlsZSBwcm9ncmVzc1wiLCBlcnJvcikpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hJbnB1dChpbnB1dEVsLCB0YXJnZXRDdHgsIGZvcmNlQ2lkLCBwaHhFdmVudCwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKCFpbnB1dEVsLmZvcm0pe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZm9ybSBldmVudHMgcmVxdWlyZSB0aGUgaW5wdXQgdG8gYmUgaW5zaWRlIGEgZm9ybVwiKVxuICAgIH1cblxuICAgIGxldCB1cGxvYWRzXG4gICAgbGV0IGNpZCA9IGlzQ2lkKGZvcmNlQ2lkKSA/IGZvcmNlQ2lkIDogdGhpcy50YXJnZXRDb21wb25lbnRJRChpbnB1dEVsLmZvcm0sIHRhcmdldEN0eCwgb3B0cylcbiAgICBsZXQgcmVmR2VuZXJhdG9yID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHV0UmVmKFtcbiAgICAgICAge2VsOiBpbnB1dEVsLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfSxcbiAgICAgICAge2VsOiBpbnB1dEVsLmZvcm0sIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XG4gICAgICBdLCBwaHhFdmVudCwgXCJjaGFuZ2VcIiwgb3B0cylcbiAgICB9XG4gICAgbGV0IGZvcm1EYXRhXG4gICAgbGV0IG1ldGEgPSB0aGlzLmV4dHJhY3RNZXRhKGlucHV0RWwuZm9ybSwge30sIG9wdHMudmFsdWUpXG4gICAgbGV0IHNlcmlhbGl6ZU9wdHMgPSB7fVxuICAgIGlmKGlucHV0RWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCl7IHNlcmlhbGl6ZU9wdHMuc3VibWl0dGVyID0gaW5wdXRFbCB9XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKSl7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCBzZXJpYWxpemVPcHRzLCBbaW5wdXRFbC5uYW1lXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwgc2VyaWFsaXplT3B0cylcbiAgICB9XG4gICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5maWxlcyAmJiBpbnB1dEVsLmZpbGVzLmxlbmd0aCA+IDApe1xuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoaW5wdXRFbCwgQXJyYXkuZnJvbShpbnB1dEVsLmZpbGVzKSlcbiAgICB9XG4gICAgdXBsb2FkcyA9IExpdmVVcGxvYWRlci5zZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpXG5cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgIG1ldGE6IHtcbiAgICAgICAgLy8gbm8gdGFyZ2V0IHdhcyBpbXBsaWNpdGx5IHNlbnQgYXMgXCJ1bmRlZmluZWRcIiBpbiBMViA8PSAxLjAuNSwgdGhlcmVmb3JlXG4gICAgICAgIC8vIHdlIGhhdmUgdG8ga2VlcCBpdC4gSW4gMS4wLjYgd2Ugc3dpdGNoZWQgZnJvbSBwYXNzaW5nIG1ldGEgYXMgVVJMIGVuY29kZWQgZGF0YVxuICAgICAgICAvLyB0byBwYXNzaW5nIGl0IGRpcmVjdGx5IGluIHRoZSBldmVudCwgYnV0IHRoZSBKU09OIGVuY29kZSB3b3VsZCBkcm9wIGtleXMgd2l0aFxuICAgICAgICAvLyB1bmRlZmluZWQgdmFsdWVzLlxuICAgICAgICBfdGFyZ2V0OiBvcHRzLl90YXJnZXQgfHwgXCJ1bmRlZmluZWRcIixcbiAgICAgICAgLi4ubWV0YVxuICAgICAgfSxcbiAgICAgIHVwbG9hZHM6IHVwbG9hZHMsXG4gICAgICBjaWQ6IGNpZFxuICAgIH1cbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBcImV2ZW50XCIsIGV2ZW50KS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIERPTS5pc0F1dG9VcGxvYWQoaW5wdXRFbCkpe1xuICAgICAgICAvLyB0aGUgZWxlbWVudCBjb3VsZCBiZSBpbnNpZGUgYSBsb2NrZWQgcGFyZW50IGZvciBvdGhlciB1bnJlbGF0ZWQgY2hhbmdlcztcbiAgICAgICAgLy8gd2UgY2FuIG9ubHkgc3RhcnQgdXBsb2FkcyB3aGVuIHRoZSB0cmVlIGlzIHVubG9ja2VkIGFuZCB0aGVcbiAgICAgICAgLy8gbmVjZXNzYXJ5IGRhdGEgYXR0cmlidXRlcyBhcmUgc2V0IGluIHRoZSByZWFsIERPTVxuICAgICAgICBFbGVtZW50UmVmLm9uVW5sb2NrKGlucHV0RWwsICgpID0+IHtcbiAgICAgICAgICBpZihMaXZlVXBsb2FkZXIuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dEVsKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIGxldCBbcmVmLCBfZWxzXSA9IHJlZkdlbmVyYXRvcigpXG4gICAgICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZiwgcGh4RXZlbnQsIFtpbnB1dEVsLmZvcm1dKVxuICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlcyhpbnB1dEVsLmZvcm0sIHBoeEV2ZW50LCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcClcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXdhaXRpbmdTdWJtaXQoaW5wdXRFbC5mb3JtLCBwaHhFdmVudClcbiAgICAgICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCBpbnB1dCBldmVudFwiLCBlcnJvcikpXG4gIH1cblxuICB0cmlnZ2VyQXdhaXRpbmdTdWJtaXQoZm9ybUVsLCBwaHhFdmVudCl7XG4gICAgbGV0IGF3YWl0aW5nU3VibWl0ID0gdGhpcy5nZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKVxuICAgIGlmKGF3YWl0aW5nU3VibWl0KXtcbiAgICAgIGxldCBbX2VsLCBfcmVmLCBfb3B0cywgY2FsbGJhY2tdID0gYXdhaXRpbmdTdWJtaXRcbiAgICAgIHRoaXMuY2FuY2VsU3VibWl0KGZvcm1FbCwgcGh4RXZlbnQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCl7XG4gICAgcmV0dXJuIHRoaXMuZm9ybVN1Ym1pdHMuZmluZCgoW2VsLCBfcmVmLCBfb3B0cywgX2NhbGxiYWNrXSkgPT4gZWwuaXNTYW1lTm9kZShmb3JtRWwpKVxuICB9XG5cbiAgc2NoZWR1bGVTdWJtaXQoZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpKXsgcmV0dXJuIHRydWUgfVxuICAgIHRoaXMuZm9ybVN1Ym1pdHMucHVzaChbZm9ybUVsLCByZWYsIG9wdHMsIGNhbGxiYWNrXSlcbiAgfVxuXG4gIGNhbmNlbFN1Ym1pdChmb3JtRWwsIHBoeEV2ZW50KXtcbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gdGhpcy5mb3JtU3VibWl0cy5maWx0ZXIoKFtlbCwgcmVmLCBfb3B0cywgX2NhbGxiYWNrXSkgPT4ge1xuICAgICAgaWYoZWwuaXNTYW1lTm9kZShmb3JtRWwpKXtcbiAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRpc2FibGVGb3JtKGZvcm1FbCwgcGh4RXZlbnQsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGZpbHRlcklnbm9yZWQgPSBlbCA9PiB7XG4gICAgICBsZXQgdXNlcklnbm9yZWQgPSBjbG9zZXN0UGh4QmluZGluZyhlbCwgYCR7dGhpcy5iaW5kaW5nKFBIWF9VUERBVEUpfT1pZ25vcmVgLCBlbC5mb3JtKVxuICAgICAgcmV0dXJuICEodXNlcklnbm9yZWQgfHwgY2xvc2VzdFBoeEJpbmRpbmcoZWwsIFwiZGF0YS1waHgtdXBkYXRlPWlnbm9yZVwiLCBlbC5mb3JtKSlcbiAgICB9XG4gICAgbGV0IGZpbHRlckRpc2FibGVzID0gZWwgPT4ge1xuICAgICAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSCkpXG4gICAgfVxuICAgIGxldCBmaWx0ZXJCdXR0b24gPSBlbCA9PiBlbC50YWdOYW1lID09IFwiQlVUVE9OXCJcblxuICAgIGxldCBmaWx0ZXJJbnB1dCA9IGVsID0+IFtcIklOUFVUXCIsIFwiVEVYVEFSRUFcIiwgXCJTRUxFQ1RcIl0uaW5jbHVkZXMoZWwudGFnTmFtZSlcblxuICAgIGxldCBmb3JtRWxlbWVudHMgPSBBcnJheS5mcm9tKGZvcm1FbC5lbGVtZW50cylcbiAgICBsZXQgZGlzYWJsZXMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckRpc2FibGVzKVxuICAgIGxldCBidXR0b25zID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJCdXR0b24pLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuICAgIGxldCBpbnB1dHMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlcklucHV0KS5maWx0ZXIoZmlsdGVySWdub3JlZClcblxuICAgIGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGJ1dHRvbi5kaXNhYmxlZClcbiAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcbiAgICB9KVxuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFksIGlucHV0LnJlYWRPbmx5KVxuICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlXG4gICAgICBpZihpbnB1dC5maWxlcyl7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGlucHV0LmRpc2FibGVkKVxuICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIGxldCBmb3JtRWxzID0gZGlzYWJsZXMuY29uY2F0KGJ1dHRvbnMpLmNvbmNhdChpbnB1dHMpLm1hcChlbCA9PiB7XG4gICAgICByZXR1cm4ge2VsLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfVxuICAgIH0pXG5cbiAgICAvLyB3ZSByZXZlcnNlIHRoZSBvcmRlciBzbyBmb3JtIGNoaWxkcmVuIGFyZSBhbHJlYWR5IGxvY2tlZCBieSB0aGUgdGltZVxuICAgIC8vIHRoZSBmb3JtIGlzIGxvY2tlZFxuICAgIGxldCBlbHMgPSBbe2VsOiBmb3JtRWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IGZhbHNlfV0uY29uY2F0KGZvcm1FbHMpLnJldmVyc2UoKVxuICAgIHJldHVybiB0aGlzLnB1dFJlZihlbHMsIHBoeEV2ZW50LCBcInN1Ym1pdFwiLCBvcHRzKVxuICB9XG5cbiAgcHVzaEZvcm1TdWJtaXQoZm9ybUVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMsIG9uUmVwbHkpe1xuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB0aGlzLmRpc2FibGVGb3JtKGZvcm1FbCwgcGh4RXZlbnQsIHtcbiAgICAgIC4uLm9wdHMsXG4gICAgICBmb3JtOiBmb3JtRWwsXG4gICAgICBzdWJtaXR0ZXI6IHN1Ym1pdHRlclxuICAgIH0pXG4gICAgLy8gc3RvcmUgdGhlIHN1Ym1pdHRlciBpbiB0aGUgZm9ybSBlbGVtZW50IGluIG9yZGVyIHRvIHRyaWdnZXIgaXRcbiAgICAvLyBmb3IgcGh4LXRyaWdnZXItYWN0aW9uXG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybUVsLCBcInN1Ym1pdHRlclwiLCBzdWJtaXR0ZXIpXG4gICAgbGV0IGNpZCA9IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoZm9ybUVsLCB0YXJnZXRDdHgpXG4gICAgaWYoTGl2ZVVwbG9hZGVyLmhhc1VwbG9hZHNJblByb2dyZXNzKGZvcm1FbCkpe1xuICAgICAgbGV0IFtyZWYsIF9lbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwdXNoID0gKCkgPT4gdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIHN1Ym1pdHRlciwgb3B0cywgb25SZXBseSlcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBwdXNoKVxuICAgIH0gZWxzZSBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBbcmVmLCBlbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwcm94eVJlZkdlbiA9ICgpID0+IFtyZWYsIGVscywgb3B0c11cbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZm9ybUVsLCBwaHhFdmVudCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgKF91cGxvYWRzKSA9PiB7XG4gICAgICAgIC8vIGlmIHdlIHN0aWxsIGhhdmluZyBwZW5kaW5nIHByZWZsaWdodHMgaXQgbWVhbnMgd2UgaGF2ZSBpbnZhbGlkIGVudHJpZXNcbiAgICAgICAgLy8gYW5kIHRoZSBwaHgtc3VibWl0IGNhbm5vdCBiZSBjb21wbGV0ZWRcbiAgICAgICAgaWYoTGl2ZVVwbG9hZGVyLmlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCkubGVuZ3RoID4gMCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudClcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWV0YSA9IHRoaXMuZXh0cmFjdE1ldGEoZm9ybUVsLCB7fSwgb3B0cy52YWx1ZSlcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHtzdWJtaXR0ZXJ9KVxuICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocHJveHlSZWZHZW4sIFwiZXZlbnRcIiwge1xuICAgICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgICAgICBjaWQ6IGNpZFxuICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCBmb3JtIHN1Ym1pdFwiLCBlcnJvcikpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZighKGZvcm1FbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpICYmIGZvcm1FbC5jbGFzc0xpc3QuY29udGFpbnMoXCJwaHgtc3VibWl0LWxvYWRpbmdcIikpKXtcbiAgICAgIGxldCBtZXRhID0gdGhpcy5leHRyYWN0TWV0YShmb3JtRWwsIHt9LCBvcHRzLnZhbHVlKVxuICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHtzdWJtaXR0ZXJ9KVxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgXCJldmVudFwiLCB7XG4gICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgICAgY2lkOiBjaWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggZm9ybSBzdWJtaXRcIiwgZXJyb3IpKVxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZEZpbGVzKGZvcm1FbCwgcGh4RXZlbnQsIHRhcmdldEN0eCwgcmVmLCBjaWQsIG9uQ29tcGxldGUpe1xuICAgIGxldCBqb2luQ291bnRBdFVwbG9hZCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IGlucHV0RWxzID0gTGl2ZVVwbG9hZGVyLmFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKVxuICAgIGxldCBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9IGlucHV0RWxzLmxlbmd0aFxuXG4gICAgLy8gZ2V0IGVhY2ggZmlsZSBpbnB1dFxuICAgIGlucHV0RWxzLmZvckVhY2goaW5wdXRFbCA9PiB7XG4gICAgICBsZXQgdXBsb2FkZXIgPSBuZXcgTGl2ZVVwbG9hZGVyKGlucHV0RWwsIHRoaXMsICgpID0+IHtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICBpZihudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9PT0gMCl7IG9uQ29tcGxldGUoKSB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgZW50cmllcyA9IHVwbG9hZGVyLmVudHJpZXMoKS5tYXAoZW50cnkgPT4gZW50cnkudG9QcmVmbGlnaHRQYXlsb2FkKCkpXG5cbiAgICAgIGlmKGVudHJpZXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICAgIHJlZjogaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxuICAgICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcInNlbmRpbmcgcHJlZmxpZ2h0IHJlcXVlc3RcIiwgcGF5bG9hZF0pXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImFsbG93X3VwbG9hZFwiLCBwYXlsb2FkKS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wiZ290IHByZWZsaWdodCByZXNwb25zZVwiLCByZXNwXSlcbiAgICAgICAgLy8gdGhlIHByZWZsaWdodCB3aWxsIHJlamVjdCBlbnRyaWVzIGJleW9uZCB0aGUgbWF4IGVudHJpZXNcbiAgICAgICAgLy8gc28gd2UgZXJyb3IgYW5kIGNhbmNlbCBlbnRyaWVzIG9uIHRoZSBjbGllbnQgdGhhdCBhcmUgbWlzc2luZyBmcm9tIHRoZSByZXNwb25zZVxuICAgICAgICB1cGxvYWRlci5lbnRyaWVzKCkuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgaWYocmVzcC5lbnRyaWVzICYmICFyZXNwLmVudHJpZXNbZW50cnkucmVmXSl7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUZhaWxlZEVudHJ5UHJlZmxpZ2h0KGVudHJ5LnJlZiwgXCJmYWlsZWQgcHJlZmxpZ2h0XCIsIHVwbG9hZGVyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gZm9yIGF1dG8gdXBsb2Fkcywgd2UgbWF5IGhhdmUgYW4gZW1wdHkgZW50cmllcyByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gZm9yIGZvcm0gc3VibWl0cyB0aGF0IGNvbnRhaW4gaW52YWxpZCBlbnRyaWVzXG4gICAgICAgIGlmKHJlc3AuZXJyb3IgfHwgT2JqZWN0LmtleXMocmVzcC5lbnRyaWVzKS5sZW5ndGggPT09IDApe1xuICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudClcbiAgICAgICAgICBsZXQgZXJyb3JzID0gcmVzcC5lcnJvciB8fCBbXVxuICAgICAgICAgIGVycm9ycy5tYXAoKFtlbnRyeV9yZWYsIHJlYXNvbl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmFpbGVkRW50cnlQcmVmbGlnaHQoZW50cnlfcmVmLCByZWFzb24sIHVwbG9hZGVyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG9uRXJyb3IgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYodGhpcy5qb2luQ291bnQgPT09IGpvaW5Db3VudEF0VXBsb2FkKXsgY2FsbGJhY2soKSB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGxvYWRlci5pbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCB0aGlzLmxpdmVTb2NrZXQpXG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nRXJyb3IoXCJGYWlsZWQgdG8gcHVzaCB1cGxvYWRcIiwgZXJyb3IpKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVGYWlsZWRFbnRyeVByZWZsaWdodCh1cGxvYWRSZWYsIHJlYXNvbiwgdXBsb2FkZXIpe1xuICAgIGlmKHVwbG9hZGVyLmlzQXV0b1VwbG9hZCgpKXtcbiAgICAgIC8vIHVwbG9hZFJlZiBtYXkgYmUgdG9wIGxldmVsIHVwbG9hZCBjb25maWcgcmVmIG9yIGVudHJ5IHJlZlxuICAgICAgbGV0IGVudHJ5ID0gdXBsb2FkZXIuZW50cmllcygpLmZpbmQoZW50cnkgPT4gZW50cnkucmVmID09PSB1cGxvYWRSZWYudG9TdHJpbmcoKSlcbiAgICAgIGlmKGVudHJ5KXsgZW50cnkuY2FuY2VsKCkgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cGxvYWRlci5lbnRyaWVzKCkubWFwKGVudHJ5ID0+IGVudHJ5LmNhbmNlbCgpKVxuICAgIH1cbiAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbYGVycm9yIGZvciBlbnRyeSAke3VwbG9hZFJlZn1gLCByZWFzb25dKVxuICB9XG5cbiAgZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXNPckJsb2JzKXtcbiAgICBsZXQgdGFyZ2V0RWxlbWVudCA9IHRoaXMudGFyZ2V0Q3R4RWxlbWVudCh0YXJnZXRDdHgpIHx8IHRoaXMuZWxcbiAgICBsZXQgaW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHModGFyZ2V0RWxlbWVudCkuZmlsdGVyKGVsID0+IGVsLm5hbWUgPT09IG5hbWUpXG4gICAgaWYoaW5wdXRzLmxlbmd0aCA9PT0gMCl7IGxvZ0Vycm9yKGBubyBsaXZlIGZpbGUgaW5wdXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBuYW1lIFwiJHtuYW1lfVwiYCkgfVxuICAgIGVsc2UgaWYoaW5wdXRzLmxlbmd0aCA+IDEpeyBsb2dFcnJvcihgZHVwbGljYXRlIGxpdmUgZmlsZSBpbnB1dHMgZm91bmQgbWF0Y2hpbmcgdGhlIG5hbWUgXCIke25hbWV9XCJgKSB9XG4gICAgZWxzZSB7IERPTS5kaXNwYXRjaEV2ZW50KGlucHV0c1swXSwgUEhYX1RSQUNLX1VQTE9BRFMsIHtkZXRhaWw6IHtmaWxlczogZmlsZXNPckJsb2JzfX0pIH1cbiAgfVxuXG4gIHRhcmdldEN0eEVsZW1lbnQodGFyZ2V0Q3R4KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXtcbiAgICAgIGxldCBbdGFyZ2V0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgdGFyZ2V0Q3R4KVxuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHgpe1xuICAgICAgcmV0dXJuIHRhcmdldEN0eFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHB1c2hGb3JtUmVjb3Zlcnkob2xkRm9ybSwgbmV3Rm9ybSwgdGVtcGxhdGVEb20sIGNhbGxiYWNrKXtcbiAgICAvLyB3ZSBhcmUgb25seSByZWNvdmVyaW5nIGZvcm1zIGluc2lkZSB0aGUgY3VycmVudCB2aWV3LCB0aGVyZWZvcmUgaXQgaXMgc2FmZSB0b1xuICAgIC8vIHNraXAgd2l0aGluT3duZXJzIGhlcmUgYW5kIGFsd2F5cyB1c2UgdGhpcyB3aGVuIHJlZmVycmluZyB0byB0aGUgdmlld1xuICAgIGNvbnN0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuICAgIGNvbnN0IHBoeFRhcmdldCA9IG5ld0Zvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInRhcmdldFwiKSkgfHwgbmV3Rm9ybVxuICAgIGNvbnN0IHBoeEV2ZW50ID0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9BVVRPX1JFQ09WRVIpKSB8fCBuZXdGb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpXG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShvbGRGb3JtLmVsZW1lbnRzKS5maWx0ZXIoZWwgPT4gRE9NLmlzRm9ybUlucHV0KGVsKSAmJiBlbC5uYW1lICYmICFlbC5oYXNBdHRyaWJ1dGUocGh4Q2hhbmdlKSlcbiAgICBpZihpbnB1dHMubGVuZ3RoID09PSAwKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHdlIG11c3QgY2xlYXIgdHJhY2tlZCB1cGxvYWRzIGJlZm9yZSByZWNvdmVyeSBhcyB0aGV5IG5vIGxvbmdlciBoYXZlIHZhbGlkIHJlZnNcbiAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICYmIExpdmVVcGxvYWRlci5jbGVhckZpbGVzKGlucHV0KSlcbiAgICAvLyBwdXNoSW5wdXQgYXNzdW1lcyB0aGF0IHRoZXJlIGlzIGEgc291cmNlIGVsZW1lbnQgdGhhdCBpbml0aWF0ZWQgdGhlIGNoYW5nZTtcbiAgICAvLyBiZWNhdXNlIHRoaXMgaXMgbm90IHRoZSBjYXNlIHdoZW4gd2UgcmVjb3ZlciBmb3Jtcywgd2UgcHJvdmlkZSB0aGUgZmlyc3QgaW5wdXQgd2UgZmluZFxuICAgIGxldCBpbnB1dCA9IGlucHV0cy5maW5kKGVsID0+IGVsLnR5cGUgIT09IFwiaGlkZGVuXCIpIHx8IGlucHV0c1swXVxuXG4gICAgLy8gaW4gdGhlIGNhc2UgdGhhdCB0aGVyZSBhcmUgbXVsdGlwbGUgdGFyZ2V0cywgd2UgY291bnQgdGhlIG51bWJlciBvZiBwZW5kaW5nIHJlY292ZXJ5IGV2ZW50c1xuICAgIC8vIGFuZCBvbmx5IGNhbGwgdGhlIGNhbGxiYWNrIG9uY2UgYWxsIGV2ZW50cyBoYXZlIGJlZW4gcHJvY2Vzc2VkXG4gICAgbGV0IHBlbmRpbmcgPSAwXG4gICAgLy8gd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrLCBkb20sIHZpZXdFbClcbiAgICB0aGlzLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodGFyZ2V0VmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBjb25zdCBjaWQgPSB0aGlzLnRhcmdldENvbXBvbmVudElEKG5ld0Zvcm0sIHRhcmdldEN0eClcbiAgICAgIHBlbmRpbmcrK1xuICAgICAgbGV0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6Zm9ybS1yZWNvdmVyeVwiLCB7ZGV0YWlsOiB7c291cmNlRWxlbWVudDogb2xkRm9ybX19KVxuICAgICAgSlMuZXhlYyhlLCBcImNoYW5nZVwiLCBwaHhFdmVudCwgdGhpcywgaW5wdXQsIFtcInB1c2hcIiwge1xuICAgICAgICBfdGFyZ2V0OiBpbnB1dC5uYW1lLFxuICAgICAgICB0YXJnZXRWaWV3LFxuICAgICAgICB0YXJnZXRDdHgsXG4gICAgICAgIG5ld0NpZDogY2lkLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIHBlbmRpbmctLVxuICAgICAgICAgIGlmKHBlbmRpbmcgPT09IDApeyBjYWxsYmFjaygpIH1cbiAgICAgICAgfVxuICAgICAgfV0pXG4gICAgfSwgdGVtcGxhdGVEb20sIHRlbXBsYXRlRG9tKVxuICB9XG5cbiAgcHVzaExpbmtQYXRjaChlLCBocmVmLCB0YXJnZXRFbCwgY2FsbGJhY2spe1xuICAgIGxldCBsaW5rUmVmID0gdGhpcy5saXZlU29ja2V0LnNldFBlbmRpbmdMaW5rKGhyZWYpXG4gICAgLy8gb25seSBhZGQgbG9hZGluZyBzdGF0ZXMgaWYgZXZlbnQgaXMgdHJ1c3RlZCAoaXQgd2FzIHRyaWdnZXJlZCBieSB1c2VyLCBzdWNoIGFzIGNsaWNrKSBhbmRcbiAgICAvLyBpdCdzIG5vdCBhIGZvcndhcmQvYmFjayBuYXZpZ2F0aW9uIGZyb20gcG9wc3RhdGVcbiAgICBsZXQgbG9hZGluZyA9IGUuaXNUcnVzdGVkICYmIGUudHlwZSAhPT0gXCJwb3BzdGF0ZVwiXG4gICAgbGV0IHJlZkdlbiA9IHRhcmdldEVsID8gKCkgPT4gdGhpcy5wdXRSZWYoW3tlbDogdGFyZ2V0RWwsIGxvYWRpbmc6IGxvYWRpbmcsIGxvY2s6IHRydWV9XSwgbnVsbCwgXCJjbGlja1wiKSA6IG51bGxcbiAgICBsZXQgZmFsbGJhY2sgPSAoKSA9PiB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3Qod2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgbGV0IHVybCA9IGhyZWYuc3RhcnRzV2l0aChcIi9cIikgPyBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH0ke2hyZWZ9YCA6IGhyZWZcblxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW4sIFwibGl2ZV9wYXRjaFwiLCB7dXJsfSkudGhlbihcbiAgICAgICh7cmVzcH0pID0+IHtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIGlmKHJlc3AubGlua19yZWRpcmVjdCl7XG4gICAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2ssIGxpbmtSZWYpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMubGl2ZVNvY2tldC5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7XG4gICAgICAgICAgICAgIHRoaXMuaHJlZiA9IGhyZWZcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhsaW5rUmVmKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICAoe2Vycm9yOiBfZXJyb3IsIHRpbWVvdXQ6IF90aW1lb3V0fSkgPT4gZmFsbGJhY2soKVxuICAgIClcbiAgfVxuXG4gIGdldEZvcm1zRm9yUmVjb3ZlcnkoKXtcbiAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gMCl7IHJldHVybiB7fSB9XG5cbiAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG5cbiAgICByZXR1cm4gRE9NLmFsbCh0aGlzLmVsLCBgZm9ybVske3BoeENoYW5nZX1dYClcbiAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmlkKVxuICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZWxlbWVudHMubGVuZ3RoID4gMClcbiAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpICE9PSBcImlnbm9yZVwiKVxuICAgICAgLm1hcChmb3JtID0+IHtcbiAgICAgICAgLy8gd2UgcGVyZm9ybSBhIHNoYWxsb3cgY2xvbmUgYW5kIG1hbnVhbGx5IGNvcHkgYWxsIGVsZW1lbnRzXG4gICAgICAgIGNvbnN0IGNsb25lZEZvcm0gPSBmb3JtLmNsb25lTm9kZShmYWxzZSlcbiAgICAgICAgLy8gd2UgbmVlZCB0byBjb3B5IHRoZSBwcml2YXRlIGRhdGEgYXMgaXQgY29udGFpbnNcbiAgICAgICAgLy8gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRvdWNoZWQgZmllbGRzXG4gICAgICAgIERPTS5jb3B5UHJpdmF0ZXMoY2xvbmVkRm9ybSwgZm9ybSlcbiAgICAgICAgQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2xvbmUgYWxsIGNoaWxkIG5vZGVzIGFzIHdlbGwsXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aG9zZSBjb3VsZCBhbHNvIGJlIHNlbGVjdHNcbiAgICAgICAgICBjb25zdCBjbG9uZWRFbCA9IGVsLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgIC8vIHdlIGNhbGwgbW9ycGhkb20gdG8gY29weSBhbnkgc3BlY2lhbCBzdGF0ZVxuICAgICAgICAgIC8vIGxpa2UgdGhlIHNlbGVjdGVkIG9wdGlvbiBvZiBhIDxzZWxlY3Q+IGVsZW1lbnQ7XG4gICAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgcGxlbnR5IGZhc3QgYXMgd2UgY2FsbCBpdCBvbiBhIHNtYWxsIHN1YnNldCBvZiB0aGUgRE9NLFxuICAgICAgICAgIC8vIHNpbmdsZSBpbnB1dHMgb3IgYSBzZWxlY3Qgd2l0aCBjaGlsZHJlblxuICAgICAgICAgIG1vcnBoZG9tKGNsb25lZEVsLCBlbClcbiAgICAgICAgICBET00uY29weVByaXZhdGVzKGNsb25lZEVsLCBlbClcbiAgICAgICAgICBjbG9uZWRGb3JtLmFwcGVuZENoaWxkKGNsb25lZEVsKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY2xvbmVkRm9ybVxuICAgICAgfSlcbiAgICAgIC5yZWR1Y2UoKGFjYywgZm9ybSkgPT4ge1xuICAgICAgICBhY2NbZm9ybS5pZF0gPSBmb3JtXG4gICAgICAgIHJldHVybiBhY2NcbiAgICAgIH0sIHt9KVxuICB9XG5cbiAgbWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKXtcbiAgICBsZXQgd2lsbERlc3Ryb3lDSURzID0gZGVzdHJveWVkQ0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgfSlcblxuICAgIGlmKHdpbGxEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgIC8vIHdlIG11c3QgcmVzZXQgdGhlIHJlbmRlciBjaGFuZ2UgdHJhY2tpbmcgZm9yIGNpZHMgdGhhdFxuICAgICAgLy8gY291bGQgYmUgYWRkZWQgYmFjayBmcm9tIHRoZSBzZXJ2ZXIgc28gd2UgZG9uJ3Qgc2tpcCB0aGVtXG4gICAgICB3aWxsRGVzdHJveUNJRHMuZm9yRWFjaChjaWQgPT4gdGhpcy5yZW5kZXJlZC5yZXNldFJlbmRlcihjaWQpKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX3dpbGxfZGVzdHJveVwiLCB7Y2lkczogd2lsbERlc3Ryb3lDSURzfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIHdlIG11c3Qgd2FpdCBmb3IgcGVuZGluZyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSBiZWZvcmUgZGV0ZXJtaW5pbmdcbiAgICAgICAgLy8gaWYgdGhlIGNpZHMgd2VyZSBhZGRlZCBiYWNrIHRvIHRoZSBET00gaW4gdGhlIG1lYW50aW1lICgjMzEzOSlcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIFNlZSBpZiBhbnkgb2YgdGhlIGNpZHMgd2Ugd2FudGVkIHRvIGRlc3Ryb3kgd2VyZSBhZGRlZCBiYWNrLFxuICAgICAgICAgIC8vIGlmIHRoZXkgd2VyZSBhZGRlZCBiYWNrLCB3ZSBkb24ndCBhY3R1YWxseSBkZXN0cm95IHRoZW0uXG4gICAgICAgICAgbGV0IGNvbXBsZXRlbHlEZXN0cm95Q0lEcyA9IHdpbGxEZXN0cm95Q0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmKGNvbXBsZXRlbHlEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfZGVzdHJveWVkXCIsIHtjaWRzOiBjb21wbGV0ZWx5RGVzdHJveUNJRHN9KS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZC5wcnVuZUNJRHMocmVzcC5jaWRzKVxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiBsb2dFcnJvcihcIkZhaWxlZCB0byBwdXNoIGNvbXBvbmVudHMgZGVzdHJveWVkXCIsIGVycm9yKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IGxvZ0Vycm9yKFwiRmFpbGVkIHRvIHB1c2ggY29tcG9uZW50cyBkZXN0cm95ZWRcIiwgZXJyb3IpKVxuICAgIH1cbiAgfVxuXG4gIG93bnNFbGVtZW50KGVsKXtcbiAgICBsZXQgcGFyZW50Vmlld0VsID0gZWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUilcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpID09PSB0aGlzLmlkIHx8XG4gICAgICAocGFyZW50Vmlld0VsICYmIHBhcmVudFZpZXdFbC5pZCA9PT0gdGhpcy5pZCkgfHxcbiAgICAgICghcGFyZW50Vmlld0VsICYmIHRoaXMuaXNEZWFkKVxuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMgPSB7fSl7XG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybSwgUEhYX0hBU19TVUJNSVRURUQsIHRydWUpXG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKVxuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRCwgdHJ1ZSkpXG4gICAgdGhpcy5saXZlU29ja2V0LmJsdXJBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMsICgpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKClcbiAgICB9KVxuICB9XG5cbiAgYmluZGluZyhraW5kKXsgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKGtpbmQpIH1cbn1cbiIsICIvKiogSW5pdGlhbGl6ZXMgdGhlIExpdmVTb2NrZXRcbiAqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3c3M6Ly9leGFtcGxlLmNvbS9saXZlXCJgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9saXZlXCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtQaG9lbml4LlNvY2tldH0gc29ja2V0IC0gdGhlIHJlcXVpcmVkIFBob2VuaXggU29ja2V0IGNsYXNzIGltcG9ydGVkIGZyb20gXCJwaG9lbml4XCIuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICogICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAqICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvbi4gT3V0c2lkZSBvZiBrZXlzIGxpc3RlZCBiZWxvdywgYWxsXG4gKiBjb25maWd1cmF0aW9uIGlzIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgUGhvZW5peCBTb2NrZXQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuZGVmYXVsdHNdIC0gVGhlIG9wdGlvbmFsIGRlZmF1bHRzIHRvIHVzZSBmb3IgdmFyaW91cyBiaW5kaW5ncyxcbiAqIHN1Y2ggYXMgYHBoeC1kZWJvdW5jZWAuIFN1cHBvcnRzIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqXG4gKiAgIC0gZGVib3VuY2UgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LWRlYm91bmNlIHRpbWUuIERlZmF1bHRzIDMwMFxuICogICAtIHRocm90dGxlIC0gdGhlIG1pbGxpc2Vjb25kIHBoeC10aHJvdHRsZSB0aW1lLiBEZWZhdWx0cyAzMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIGZvciBwYXNzaW5nIGNvbm5lY3QgcGFyYW1zLlxuICogVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIExpdmVWaWV3LiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgKGVsKSA9PiB7dmlldzogZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1teS12aWV3LW5hbWVcIiwgdG9rZW46IHdpbmRvdy5teVRva2VufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5kaW5nUHJlZml4XSAtIFRoZSBvcHRpb25hbCBwcmVmaXggdG8gdXNlIGZvciBhbGwgcGh4IERPTSBhbm5vdGF0aW9ucy5cbiAqIERlZmF1bHRzIHRvIFwicGh4LVwiLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmhvb2tzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IGhvb2sgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLnVwbG9hZGVyc10gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IGZvciByZWZlcmVuY2luZyBMaXZlVmlldyB1cGxvYWRlciBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmxvYWRlclRpbWVvdXRdIC0gVGhlIG9wdGlvbmFsIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhcHBseVxuICogbG9hZGluZyBzdGF0ZXMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmRpc2Nvbm5lY3RlZFRpbWVvdXRdIC0gVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZVxuICogZXhlY3V0aW5nIHBoeC1kaXNjb25uZWN0ZWQgY29tbWFuZHMuIERlZmF1bHRzIHRvIDUwMC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubWF4UmVsb2Fkc10gLSBUaGUgbWF4aW11bSByZWxvYWRzIGJlZm9yZSBlbnRlcmluZyBmYWlsc2FmZSBtb2RlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNaW5dIC0gVGhlIG1pbmltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLnJlbG9hZEppdHRlck1heF0gLSBUaGUgbWF4aW11bSB0aW1lIGJldHdlZW4gbm9ybWFsIHJlbG9hZCBhdHRlbXB0cy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMuZmFpbHNhZmVKaXR0ZXJdIC0gVGhlIHRpbWUgYmV0d2VlbiByZWxvYWQgYXR0ZW1wdHMgaW4gZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZpZXdMb2dnZXJdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGxvZyBkZWJ1ZyBpbmZvcm1hdGlvbi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4gY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5tZXRhZGF0YV0gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IG1hcHBpbmcgZXZlbnQgbmFtZXMgdG8gZnVuY3Rpb25zIGZvclxuICogcG9wdWxhdGluZyBldmVudCBtZXRhZGF0YS4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIG1ldGFkYXRhOiB7XG4gKiAgICAgICBjbGljazogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICogICAgICAgICAgIG1ldGFLZXk6IGUubWV0YUtleSxcbiAqICAgICAgICAgICBkZXRhaWw6IGUuZGV0YWlsIHx8IDEsXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH0sXG4gKiAgICAgICBrZXlkb3duOiAoZSwgZWwpID0+IHtcbiAqICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICBrZXk6IGUua2V5LFxuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgc2hpZnRLZXk6IGUuc2hpZnRLZXlcbiAqICAgICAgICAgfVxuICogICAgICAgfVxuICogICAgIH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiAgRm9yIGV4YW1wbGUsIFRoaXMgY291bGRcbiAqIGhhcHBlbiBpZiBhIHNpdGUgbG9hZHMgYSBjcm9zcy1kb21haW4gTGl2ZVZpZXcgaW4gYW4gaWZyYW1lLiAgRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB8fCBudWxsIH1cbiAqICAgICAgIHJlbW92ZUl0ZW0oa2V5TmFtZSkgeyBkZWxldGUgdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHNldEl0ZW0oa2V5TmFtZSwga2V5VmFsdWUpIHsgdGhpcy5zdG9yYWdlW2tleU5hbWVdID0ga2V5VmFsdWUgfVxuICogICAgIH1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubG9jYWxTdG9yYWdlXSAtIEFuIG9wdGlvbmFsIFN0b3JhZ2UgY29tcGF0aWJsZSBvYmplY3RcbiAqIFVzZWZ1bCBmb3Igd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgbG9jYWxTdG9yYWdlYC5cbiAqIFNlZSBgb3B0cy5zZXNzaW9uU3RvcmFnZWAgZm9yIGV4YW1wbGVzLlxuKi9cblxuaW1wb3J0IHtcbiAgQklORElOR19QUkVGSVgsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIERFRkFVTFRTLFxuICBGQUlMU0FGRV9KSVRURVIsXG4gIExPQURFUl9USU1FT1VULFxuICBESVNDT05ORUNURURfVElNRU9VVCxcbiAgTUFYX1JFTE9BRFMsXG4gIFBIWF9ERUJPVU5DRSxcbiAgUEhYX0RST1BfVEFSR0VULFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9LRVksXG4gIFBIWF9MSU5LX1NUQVRFLFxuICBQSFhfTElWRV9MSU5LLFxuICBQSFhfTFZfREVCVUcsXG4gIFBIWF9MVl9MQVRFTkNZX1NJTSxcbiAgUEhYX0xWX1BST0ZJTEUsXG4gIFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLFxuICBQSFhfTUFJTixcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfVEhST1RUTEUsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfU0VTU0lPTixcbiAgUkVMT0FEX0pJVFRFUl9NSU4sXG4gIFJFTE9BRF9KSVRURVJfTUFYLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFTE9BRF9TVEFUVVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBjbG9zdXJlLFxuICBkZWJ1ZyxcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgQnJvd3NlciBmcm9tIFwiLi9icm93c2VyXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBIb29rcyBmcm9tIFwiLi9ob29rc1wiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5leHBvcnQgbGV0IGlzVXNlZElucHV0ID0gKGVsKSA9PiBET00uaXNVc2VkSW5wdXQoZWwpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVTb2NrZXQge1xuICBjb25zdHJ1Y3Rvcih1cmwsIHBoeFNvY2tldCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnVubG9hZGVkID0gZmFsc2VcbiAgICBpZighcGh4U29ja2V0IHx8IHBoeFNvY2tldC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBhIHBob2VuaXggU29ja2V0IG11c3QgYmUgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byB0aGUgTGl2ZVNvY2tldCBjb25zdHJ1Y3Rvci4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICAgICAgICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAgICAgICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAgICAgIGApXG4gICAgfVxuICAgIHRoaXMuc29ja2V0ID0gbmV3IHBoeFNvY2tldCh1cmwsIG9wdHMpXG4gICAgdGhpcy5iaW5kaW5nUHJlZml4ID0gb3B0cy5iaW5kaW5nUHJlZml4IHx8IEJJTkRJTkdfUFJFRklYXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnZpZXdMb2dnZXIgPSBvcHRzLnZpZXdMb2dnZXJcbiAgICB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzID0gb3B0cy5tZXRhZGF0YSB8fCB7fVxuICAgIHRoaXMuZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKGNsb25lKERFRkFVTFRTKSwgb3B0cy5kZWZhdWx0cyB8fCB7fSlcbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5wcmV2QWN0aXZlID0gbnVsbFxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gbnVsbFxuICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsXG4gICAgdGhpcy5saW5rUmVmID0gMVxuICAgIHRoaXMucm9vdHMgPSB7fVxuICAgIHRoaXMuaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKHdpbmRvdy5sb2NhdGlvbilcbiAgICB0aGlzLmhvb2tzID0gb3B0cy5ob29rcyB8fCB7fVxuICAgIHRoaXMudXBsb2FkZXJzID0gb3B0cy51cGxvYWRlcnMgfHwge31cbiAgICB0aGlzLmxvYWRlclRpbWVvdXQgPSBvcHRzLmxvYWRlclRpbWVvdXQgfHwgTE9BREVSX1RJTUVPVVRcbiAgICB0aGlzLmRpc2Nvbm5lY3RlZFRpbWVvdXQgPSBvcHRzLmRpc2Nvbm5lY3RlZFRpbWVvdXQgfHwgRElTQ09OTkVDVEVEX1RJTUVPVVRcbiAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lciA9IG51bGxcbiAgICB0aGlzLm1heFJlbG9hZHMgPSBvcHRzLm1heFJlbG9hZHMgfHwgTUFYX1JFTE9BRFNcbiAgICB0aGlzLnJlbG9hZEppdHRlck1pbiA9IG9wdHMucmVsb2FkSml0dGVyTWluIHx8IFJFTE9BRF9KSVRURVJfTUlOXG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNYXggPSBvcHRzLnJlbG9hZEppdHRlck1heCB8fCBSRUxPQURfSklUVEVSX01BWFxuICAgIHRoaXMuZmFpbHNhZmVKaXR0ZXIgPSBvcHRzLmZhaWxzYWZlSml0dGVyIHx8IEZBSUxTQUZFX0pJVFRFUlxuICAgIHRoaXMubG9jYWxTdG9yYWdlID0gb3B0cy5sb2NhbFN0b3JhZ2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2UgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IHdpbmRvdy5zZXNzaW9uU3RvcmFnZVxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IGZhbHNlXG4gICAgdGhpcy5ib3VuZEV2ZW50TmFtZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnNlcnZlckNsb3NlUmVmID0gbnVsbFxuICAgIHRoaXMuZG9tQ2FsbGJhY2tzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBqc1F1ZXJ5U2VsZWN0b3JBbGw6IG51bGwsXG4gICAgICBvblBhdGNoU3RhcnQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uUGF0Y2hFbmQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uTm9kZUFkZGVkOiBjbG9zdXJlKCksXG4gICAgICBvbkJlZm9yZUVsVXBkYXRlZDogY2xvc3VyZSgpfSxcbiAgICBvcHRzLmRvbSB8fCB7fSlcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25TZXQoKVxuICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbiA9IHBhcnNlSW50KHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfSElTVE9SWV9QT1NJVElPTikpIHx8IDBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIF9lID0+IHtcbiAgICAgIHRoaXMudW5sb2FkZWQgPSB0cnVlXG4gICAgfSlcbiAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgaWYodGhpcy5pc1VubG9hZGVkKCkpe1xuICAgICAgICAvLyByZWxvYWQgcGFnZSBpZiBiZWluZyByZXN0b3JlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZSBhbmQgYnJvd3NlciBkb2VzIG5vdCBlbWl0IFwicGFnZXNob3dcIlxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gcHVibGljXG5cbiAgdmVyc2lvbigpeyByZXR1cm4gTFZfVlNOIH1cblxuICBpc1Byb2ZpbGVFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0VuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0Rpc2FibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJmYWxzZVwiIH1cblxuICBlbmFibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcInRydWVcIikgfVxuXG4gIGVuYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX1BST0ZJTEUsIFwidHJ1ZVwiKSB9XG5cbiAgZGlzYWJsZURlYnVnKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfREVCVUcsIFwiZmFsc2VcIikgfVxuXG4gIGRpc2FibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9QUk9GSUxFKSB9XG5cbiAgZW5hYmxlTGF0ZW5jeVNpbSh1cHBlckJvdW5kTXMpe1xuICAgIHRoaXMuZW5hYmxlRGVidWcoKVxuICAgIGNvbnNvbGUubG9nKFwibGF0ZW5jeSBzaW11bGF0b3IgZW5hYmxlZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoaXMgYnJvd3NlciBzZXNzaW9uLiBDYWxsIGRpc2FibGVMYXRlbmN5U2ltKCkgdG8gZGlzYWJsZVwiKVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0sIHVwcGVyQm91bmRNcylcbiAgfVxuXG4gIGRpc2FibGVMYXRlbmN5U2ltKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfTEFURU5DWV9TSU0pIH1cblxuICBnZXRMYXRlbmN5U2ltKCl7XG4gICAgbGV0IHN0ciA9IHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0pXG4gICAgcmV0dXJuIHN0ciA/IHBhcnNlSW50KHN0cikgOiBudWxsXG4gIH1cblxuICBnZXRTb2NrZXQoKXsgcmV0dXJuIHRoaXMuc29ja2V0IH1cblxuICBjb25uZWN0KCl7XG4gICAgLy8gZW5hYmxlIGRlYnVnIGJ5IGRlZmF1bHQgaWYgb24gbG9jYWxob3N0IGFuZCBub3QgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIiAmJiAhdGhpcy5pc0RlYnVnRGlzYWJsZWQoKSl7IHRoaXMuZW5hYmxlRGVidWcoKSB9XG4gICAgbGV0IGRvQ29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMucmVzZXRSZWxvYWRTdGF0dXMoKVxuICAgICAgaWYodGhpcy5qb2luUm9vdFZpZXdzKCkpe1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cygpXG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIGlmKHRoaXMubWFpbil7XG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5iaW5kVG9wTGV2ZWxFdmVudHMoe2RlYWQ6IHRydWV9KVxuICAgICAgfVxuICAgICAgdGhpcy5qb2luRGVhZFZpZXcoKVxuICAgIH1cbiAgICBpZihbXCJjb21wbGV0ZVwiLCBcImxvYWRlZFwiLCBcImludGVyYWN0aXZlXCJdLmluZGV4T2YoZG9jdW1lbnQucmVhZHlTdGF0ZSkgPj0gMCl7XG4gICAgICBkb0Nvbm5lY3QoKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiBkb0Nvbm5lY3QoKSlcbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KGNhbGxiYWNrKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgLy8gcmVtb3ZlIHRoZSBzb2NrZXQgY2xvc2UgbGlzdGVuZXIgdG8gYXZvaWQgdHJ5aW5nIHRvIGhhbmRsZVxuICAgIC8vIGEgc2VydmVyIGNsb3NlIGV2ZW50IHdoZW4gaXQgaXMgYWN0dWFsbHkgY2F1c2VkIGJ5IHVzIGRpc2Nvbm5lY3RpbmdcbiAgICBpZih0aGlzLnNlcnZlckNsb3NlUmVmKXtcbiAgICAgIHRoaXMuc29ja2V0Lm9mZih0aGlzLnNlcnZlckNsb3NlUmVmKVxuICAgICAgdGhpcy5zZXJ2ZXJDbG9zZVJlZiA9IG51bGxcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdChjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGxhY2VUcmFuc3BvcnQodHJhbnNwb3J0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5zb2NrZXQucmVwbGFjZVRyYW5zcG9ydCh0cmFuc3BvcnQpXG4gICAgdGhpcy5jb25uZWN0KClcbiAgfVxuXG4gIGV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUgPSBudWxsKXtcbiAgICBsZXQgZSA9IG5ldyBDdXN0b21FdmVudChcInBoeDpleGVjXCIsIHtkZXRhaWw6IHtzb3VyY2VFbGVtZW50OiBlbH19KVxuICAgIHRoaXMub3duZXIoZWwsIHZpZXcgPT4gSlMuZXhlYyhlLCBldmVudFR5cGUsIGVuY29kZWRKUywgdmlldywgZWwpKVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGV4ZWNKU0hvb2tQdXNoKGVsLCBwaHhFdmVudCwgZGF0YSwgY2FsbGJhY2spe1xuICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OmV4ZWNcIiwge2RldGFpbDoge3NvdXJjZUVsZW1lbnQ6IGVsfX0pXG4gICAgICBKUy5leGVjKGUsIFwiaG9va1wiLCBwaHhFdmVudCwgdmlldywgZWwsIFtcInB1c2hcIiwge2RhdGEsIGNhbGxiYWNrfV0pXG4gICAgfSlcbiAgfVxuXG4gIHVubG9hZCgpe1xuICAgIGlmKHRoaXMudW5sb2FkZWQpeyByZXR1cm4gfVxuICAgIGlmKHRoaXMubWFpbiAmJiB0aGlzLmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyh0aGlzLm1haW4sIFwic29ja2V0XCIsICgpID0+IFtcImRpc2Nvbm5lY3QgZm9yIHBhZ2UgbmF2XCJdKSB9XG4gICAgdGhpcy51bmxvYWRlZCA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3lBbGxWaWV3cygpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgfVxuXG4gIHRyaWdnZXJET00oa2luZCwgYXJncyl7IHRoaXMuZG9tQ2FsbGJhY2tzW2tpbmRdKC4uLmFyZ3MpIH1cblxuICB0aW1lKG5hbWUsIGZ1bmMpe1xuICAgIGlmKCF0aGlzLmlzUHJvZmlsZUVuYWJsZWQoKSB8fCAhY29uc29sZS50aW1lKXsgcmV0dXJuIGZ1bmMoKSB9XG4gICAgY29uc29sZS50aW1lKG5hbWUpXG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMoKVxuICAgIGNvbnNvbGUudGltZUVuZChuYW1lKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGxvZyh2aWV3LCBraW5kLCBtc2dDYWxsYmFjayl7XG4gICAgaWYodGhpcy52aWV3TG9nZ2VyKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgdGhpcy52aWV3TG9nZ2VyKHZpZXcsIGtpbmQsIG1zZywgb2JqKVxuICAgIH0gZWxzZSBpZih0aGlzLmlzRGVidWdFbmFibGVkKCkpe1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpXG4gICAgICBkZWJ1Zyh2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0RE9NVXBkYXRlKGNhbGxiYWNrKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFmdGVyKGNhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gIH1cblxuICBvbkNoYW5uZWwoY2hhbm5lbCwgZXZlbnQsIGNiKXtcbiAgICBjaGFubmVsLm9uKGV2ZW50LCBkYXRhID0+IHtcbiAgICAgIGxldCBsYXRlbmN5ID0gdGhpcy5nZXRMYXRlbmN5U2ltKClcbiAgICAgIGlmKCFsYXRlbmN5KXtcbiAgICAgICAgY2IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2IoZGF0YSksIGxhdGVuY3kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZFdpdGhKaXR0ZXIodmlldywgbG9nKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBsZXQgbWluTXMgPSB0aGlzLnJlbG9hZEppdHRlck1pblxuICAgIGxldCBtYXhNcyA9IHRoaXMucmVsb2FkSml0dGVyTWF4XG4gICAgbGV0IGFmdGVyTXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4TXMgLSBtaW5NcyArIDEpKSArIG1pbk1zXG4gICAgbGV0IHRyaWVzID0gQnJvd3Nlci51cGRhdGVMb2NhbCh0aGlzLmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTLCAwLCBjb3VudCA9PiBjb3VudCArIDEpXG4gICAgaWYodHJpZXMgPj0gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgIGFmdGVyTXMgPSB0aGlzLmZhaWxzYWZlSml0dGVyXG4gICAgfVxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBpZiB2aWV3IGhhcyByZWNvdmVyZWQsIHN1Y2ggYXMgdHJhbnNwb3J0IHJlcGxhY2VkLCB0aGVuIGNhbmNlbFxuICAgICAgaWYodmlldy5pc0Rlc3Ryb3llZCgpIHx8IHZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICB2aWV3LmRlc3Ryb3koKVxuICAgICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pXG4gICAgICBpZih0cmllcyA+PSB0aGlzLm1heFJlbG9hZHMpe1xuICAgICAgICB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BleGNlZWRlZCAke3RoaXMubWF4UmVsb2Fkc30gY29uc2VjdXRpdmUgcmVsb2Fkcy4gRW50ZXJpbmcgZmFpbHNhZmUgbW9kZWBdKVxuICAgICAgfVxuICAgICAgaWYodGhpcy5oYXNQZW5kaW5nTGluaygpKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgYWZ0ZXJNcylcbiAgfVxuXG4gIGdldEhvb2tDYWxsYmFja3MobmFtZSl7XG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5zdGFydHNXaXRoKFwiUGhvZW5peC5cIikgPyBIb29rc1tuYW1lLnNwbGl0KFwiLlwiKVsxXV0gOiB0aGlzLmhvb2tzW25hbWVdXG4gIH1cblxuICBpc1VubG9hZGVkKCl7IHJldHVybiB0aGlzLnVubG9hZGVkIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSB9XG5cbiAgZ2V0QmluZGluZ1ByZWZpeCgpeyByZXR1cm4gdGhpcy5iaW5kaW5nUHJlZml4IH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gYCR7dGhpcy5nZXRCaW5kaW5nUHJlZml4KCl9JHtraW5kfWAgfVxuXG4gIGNoYW5uZWwodG9waWMsIHBhcmFtcyl7IHJldHVybiB0aGlzLnNvY2tldC5jaGFubmVsKHRvcGljLCBwYXJhbXMpIH1cblxuICBqb2luRGVhZFZpZXcoKXtcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmJvZHlcbiAgICBpZihib2R5ICYmICF0aGlzLmlzUGh4Vmlldyhib2R5KSAmJiAhdGhpcy5pc1BoeFZpZXcoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpKXtcbiAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhib2R5KVxuICAgICAgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKVxuICAgICAgdmlldy5qb2luRGVhZCgpXG4gICAgICBpZighdGhpcy5tYWluKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdmlldy5leGVjTmV3TW91bnRlZCgpXG4gICAgICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uIHdoZW4gbmF2aWdhdGluZyBmcm9tIGFuIGV4dGVybmFsIC8gbm9uLWxpdmUgcGFnZVxuICAgICAgICB0aGlzLm1heWJlU2Nyb2xsKGhpc3Rvcnkuc3RhdGU/LnNjcm9sbClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgam9pblJvb3RWaWV3cygpe1xuICAgIGxldCByb290c0ZvdW5kID0gZmFsc2VcbiAgICBET00uYWxsKGRvY3VtZW50LCBgJHtQSFhfVklFV19TRUxFQ1RPUn06bm90KFske1BIWF9QQVJFTlRfSUR9XSlgLCByb290RWwgPT4ge1xuICAgICAgaWYoIXRoaXMuZ2V0Um9vdEJ5SWQocm9vdEVsLmlkKSl7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhyb290RWwpXG4gICAgICAgIC8vIHN0aWNraWVzIGNhbm5vdCBiZSBtb3VudGVkIGF0IHRoZSByb3V0ZXIgYW5kIHRoZXJlZm9yZSBzaG91bGQgbm90XG4gICAgICAgIC8vIGdldCBhIGhyZWYgc2V0IG9uIHRoZW1cbiAgICAgICAgaWYoIURPTS5pc1BoeFN0aWNreShyb290RWwpKXsgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKSB9XG4gICAgICAgIHZpZXcuam9pbigpXG4gICAgICAgIGlmKHJvb3RFbC5oYXNBdHRyaWJ1dGUoUEhYX01BSU4pKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB9XG4gICAgICByb290c0ZvdW5kID0gdHJ1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHJvb3RzRm91bmRcbiAgfVxuXG4gIHJlZGlyZWN0KHRvLCBmbGFzaCwgcmVsb2FkVG9rZW4pe1xuICAgIGlmKHJlbG9hZFRva2VuKXsgQnJvd3Nlci5zZXRDb29raWUoUEhYX1JFTE9BRF9TVEFUVVMsIHJlbG9hZFRva2VuLCA2MCkgfVxuICAgIHRoaXMudW5sb2FkKClcbiAgICBCcm93c2VyLnJlZGlyZWN0KHRvLCBmbGFzaClcbiAgfVxuXG4gIHJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCBjYWxsYmFjayA9IG51bGwsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBjb25zdCBsaXZlUmVmZXJlciA9IHRoaXMuY3VycmVudExvY2F0aW9uLmhyZWZcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gdGhpcy5vdXRnb2luZ01haW5FbCB8fCB0aGlzLm1haW4uZWxcblxuICAgIGNvbnN0IHN0aWNraWVzID0gRE9NLmZpbmRQaHhTdGlja3koZG9jdW1lbnQpIHx8IFtdXG4gICAgY29uc3QgcmVtb3ZlRWxzID0gRE9NLmFsbCh0aGlzLm91dGdvaW5nTWFpbkVsLCBgWyR7dGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpfV1gKVxuICAgICAgLmZpbHRlcihlbCA9PiAhRE9NLmlzQ2hpbGRPZkFueShlbCwgc3RpY2tpZXMpKVxuXG4gICAgY29uc3QgbmV3TWFpbkVsID0gRE9NLmNsb25lTm9kZSh0aGlzLm91dGdvaW5nTWFpbkVsLCBcIlwiKVxuICAgIHRoaXMubWFpbi5zaG93TG9hZGVyKHRoaXMubG9hZGVyVGltZW91dClcbiAgICB0aGlzLm1haW4uZGVzdHJveSgpXG5cbiAgICB0aGlzLm1haW4gPSB0aGlzLm5ld1Jvb3RWaWV3KG5ld01haW5FbCwgZmxhc2gsIGxpdmVSZWZlcmVyKVxuICAgIHRoaXMubWFpbi5zZXRSZWRpcmVjdChocmVmKVxuICAgIHRoaXMudHJhbnNpdGlvblJlbW92ZXMocmVtb3ZlRWxzKVxuICAgIHRoaXMubWFpbi5qb2luKChqb2luQ291bnQsIG9uRG9uZSkgPT4ge1xuICAgICAgaWYoam9pbkNvdW50ID09PSAxICYmIHRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSBwaHgtcmVtb3ZlIGVscyByaWdodCBiZWZvcmUgd2UgcmVwbGFjZSB0aGUgbWFpbiBlbGVtZW50XG4gICAgICAgICAgcmVtb3ZlRWxzLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpXG4gICAgICAgICAgc3RpY2tpZXMuZm9yRWFjaChlbCA9PiBuZXdNYWluRWwuYXBwZW5kQ2hpbGQoZWwpKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwucmVwbGFjZVdpdGgobmV3TWFpbkVsKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobGlua1JlZilcbiAgICAgICAgICBvbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0cmFuc2l0aW9uUmVtb3ZlcyhlbGVtZW50cywgY2FsbGJhY2spe1xuICAgIGxldCByZW1vdmVBdHRyID0gdGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgbGV0IHNpbGVuY2VFdmVudHMgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgfVxuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgLy8gcHJldmVudCBhbGwgbGlzdGVuZXJzIHdlIGNhcmUgYWJvdXQgZnJvbSBidWJibGluZyB0byB3aW5kb3dcbiAgICAgIC8vIHNpbmNlIHdlIGFyZSByZW1vdmluZyB0aGUgZWxlbWVudFxuICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHNpbGVuY2VFdmVudHMsIHRydWUpXG4gICAgICB9XG4gICAgICB0aGlzLmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKHJlbW92ZUF0dHIpLCBcInJlbW92ZVwiKVxuICAgIH0pXG4gICAgLy8gcmVtb3ZlIHRoZSBzaWxlbmNlZCBsaXN0ZW5lcnMgd2hlbiB0cmFuc2l0aW9ucyBhcmUgZG9uZSBpbmNhc2UgdGhlIGVsZW1lbnQgaXMgcmUtdXNlZFxuICAgIC8vIGFuZCBjYWxsIGNhbGxlcidzIGNhbGxiYWNrIGFzIHNvb24gYXMgd2UgYXJlIGRvbmUgd2l0aCB0cmFuc2l0aW9uc1xuICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgc2lsZW5jZUV2ZW50cywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9KVxuICB9XG5cbiAgaXNQaHhWaWV3KGVsKXsgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsIH1cblxuICBuZXdSb290VmlldyhlbCwgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLCBudWxsLCBmbGFzaCwgbGl2ZVJlZmVyZXIpXG4gICAgdGhpcy5yb290c1t2aWV3LmlkXSA9IHZpZXdcbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgb3duZXIoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIGxldCB2aWV3XG4gICAgY29uc3QgY2xvc2VzdFZpZXdFbCA9IGNoaWxkRWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUilcbiAgICBpZihjbG9zZXN0Vmlld0VsKXtcbiAgICAgIC8vIGl0IGNhbiBoYXBwZW4gdGhhdCB3ZSBmaW5kIGEgdmlldyB0aGF0IGlzIGFscmVhZHkgZGVzdHJveWVkO1xuICAgICAgLy8gaW4gdGhhdCBjYXNlIHdlIERPIE5PVCB3YW50IHRvIGZhbGxiYWNrIHRvIHRoZSBtYWluIGVsZW1lbnRcbiAgICAgIHZpZXcgPSB0aGlzLmdldFZpZXdCeUVsKGNsb3Nlc3RWaWV3RWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcgPSB0aGlzLm1haW5cbiAgICB9XG4gICAgcmV0dXJuIHZpZXcgJiYgY2FsbGJhY2sgPyBjYWxsYmFjayh2aWV3KSA6IHZpZXdcbiAgfVxuXG4gIHdpdGhpbk93bmVycyhjaGlsZEVsLCBjYWxsYmFjayl7XG4gICAgdGhpcy5vd25lcihjaGlsZEVsLCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIGNoaWxkRWwpKVxuICB9XG5cbiAgZ2V0Vmlld0J5RWwoZWwpe1xuICAgIGxldCByb290SWQgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQpXG4gICAgcmV0dXJuIG1heWJlKHRoaXMuZ2V0Um9vdEJ5SWQocm9vdElkKSwgcm9vdCA9PiByb290LmdldERlc2NlbmRlbnRCeUVsKGVsKSlcbiAgfVxuXG4gIGdldFJvb3RCeUlkKGlkKXsgcmV0dXJuIHRoaXMucm9vdHNbaWRdIH1cblxuICBkZXN0cm95QWxsVmlld3MoKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMucm9vdHMpe1xuICAgICAgdGhpcy5yb290c1tpZF0uZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tpZF1cbiAgICB9XG4gICAgdGhpcy5tYWluID0gbnVsbFxuICB9XG5cbiAgZGVzdHJveVZpZXdCeUVsKGVsKXtcbiAgICBsZXQgcm9vdCA9IHRoaXMuZ2V0Um9vdEJ5SWQoZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKSlcbiAgICBpZihyb290ICYmIHJvb3QuaWQgPT09IGVsLmlkKXtcbiAgICAgIHJvb3QuZGVzdHJveSgpXG4gICAgICBkZWxldGUgdGhpcy5yb290c1tyb290LmlkXVxuICAgIH0gZWxzZSBpZihyb290KXtcbiAgICAgIHJvb3QuZGVzdHJveURlc2NlbmRlbnQoZWwuaWQpXG4gICAgfVxuICB9XG5cbiAgZ2V0QWN0aXZlRWxlbWVudCgpe1xuICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gIH1cblxuICBkcm9wQWN0aXZlRWxlbWVudCh2aWV3KXtcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgJiYgdmlldy5vd25zRWxlbWVudCh0aGlzLnByZXZBY3RpdmUpKXtcbiAgICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICByZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKCl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHRoaXMucHJldkFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUuZm9jdXMoKVxuICAgIH1cbiAgfVxuXG4gIGJsdXJBY3RpdmVFbGVtZW50KCl7XG4gICAgdGhpcy5wcmV2QWN0aXZlID0gdGhpcy5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpeyB0aGlzLnByZXZBY3RpdmUuYmx1cigpIH1cbiAgfVxuXG4gIGJpbmRUb3BMZXZlbEV2ZW50cyh7ZGVhZH0gPSB7fSl7XG4gICAgaWYodGhpcy5ib3VuZFRvcExldmVsRXZlbnRzKXsgcmV0dXJuIH1cblxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IHRydWVcbiAgICAvLyBlbnRlciBmYWlsc2FmZSByZWxvYWQgaWYgc2VydmVyIGhhcyBnb25lIGF3YXkgaW50ZW50aW9uYWxseSwgc3VjaCBhcyBcImRpc2Nvbm5lY3RcIiBicm9hZGNhc3RcbiAgICB0aGlzLnNlcnZlckNsb3NlUmVmID0gdGhpcy5zb2NrZXQub25DbG9zZShldmVudCA9PiB7XG4gICAgICAvLyBmYWlsc2FmZSByZWxvYWQgaWYgbm9ybWFsIGNsb3N1cmUgYW5kIHdlIHN0aWxsIGhhdmUgYSBtYWluIExWXG4gICAgICBpZihldmVudCAmJiBldmVudC5jb2RlID09PSAxMDAwICYmIHRoaXMubWFpbil7IHJldHVybiB0aGlzLnJlbG9hZFdpdGhKaXR0ZXIodGhpcy5tYWluKSB9XG4gICAgfSlcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKXsgfSkgLy8gZW5zdXJlIGFsbCBjbGljayBldmVudHMgYnViYmxlIGZvciBtb2JpbGUgU2FmYXJpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBlID0+IHtcbiAgICAgIGlmKGUucGVyc2lzdGVkKXsgLy8gcmVsb2FkIHBhZ2UgaWYgYmVpbmcgcmVzdG9yZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGVcbiAgICAgICAgdGhpcy5nZXRTb2NrZXQoKS5kaXNjb25uZWN0KClcbiAgICAgICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiB3aW5kb3cubG9jYXRpb24uaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSlcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgdHJ1ZSlcbiAgICBpZighZGVhZCl7IHRoaXMuYmluZE5hdigpIH1cbiAgICB0aGlzLmJpbmRDbGlja3MoKVxuICAgIGlmKCFkZWFkKXsgdGhpcy5iaW5kRm9ybXMoKSB9XG4gICAgdGhpcy5iaW5kKHtrZXl1cDogXCJrZXl1cFwiLCBrZXlkb3duOiBcImtleWRvd25cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIF9waHhUYXJnZXQpID0+IHtcbiAgICAgIGxldCBtYXRjaEtleSA9IHRhcmdldEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0tFWSkpXG4gICAgICBsZXQgcHJlc3NlZEtleSA9IGUua2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgLy8gY2hyb21lIGNsaWNrZWQgYXV0b2NvbXBsZXRlcyBzZW5kIGEga2V5ZG93biB3aXRob3V0IGtleVxuICAgICAgaWYobWF0Y2hLZXkgJiYgbWF0Y2hLZXkudG9Mb3dlckNhc2UoKSAhPT0gcHJlc3NlZEtleSl7IHJldHVybiB9XG5cbiAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgIEpTLmV4ZWMoZSwgdHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiZm9jdXNvdXRcIiwgZm9jdXM6IFwiZm9jdXNpblwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgcGh4VGFyZ2V0KSA9PiB7XG4gICAgICBpZighcGh4VGFyZ2V0KXtcbiAgICAgICAgbGV0IGRhdGEgPSB7a2V5OiBlLmtleSwgLi4udGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpfVxuICAgICAgICBKUy5leGVjKGUsIHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5iaW5kKHtibHVyOiBcImJsdXJcIiwgZm9jdXM6IFwiZm9jdXNcIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIHBoeFRhcmdldCkgPT4ge1xuICAgICAgLy8gYmx1ciBhbmQgZm9jdXMgYXJlIHRyaWdnZXJlZCBvbiBkb2N1bWVudCBhbmQgd2luZG93LiBEaXNjYXJkIG9uZSB0byBhdm9pZCBkdXBzXG4gICAgICBpZihwaHhUYXJnZXQgPT09IFwid2luZG93XCIpe1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKVxuICAgICAgICBKUy5leGVjKGUsIHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5vbihcImRyYWdvdmVyXCIsIGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKVxuICAgIHRoaXMub24oXCJkcm9wXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBsZXQgZHJvcFRhcmdldElkID0gbWF5YmUoY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKSwgdHJ1ZVRhcmdldCA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlVGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RST1BfVEFSR0VUKSlcbiAgICAgIH0pXG4gICAgICBsZXQgZHJvcFRhcmdldCA9IGRyb3BUYXJnZXRJZCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkcm9wVGFyZ2V0SWQpXG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGF0YVRyYW5zZmVyLmZpbGVzIHx8IFtdKVxuICAgICAgaWYoIWRyb3BUYXJnZXQgfHwgZHJvcFRhcmdldC5kaXNhYmxlZCB8fCBmaWxlcy5sZW5ndGggPT09IDAgfHwgIShkcm9wVGFyZ2V0LmZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpKXsgcmV0dXJuIH1cblxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoZHJvcFRhcmdldCwgZmlsZXMsIGUuZGF0YVRyYW5zZmVyKVxuICAgICAgZHJvcFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgfSlcbiAgICB0aGlzLm9uKFBIWF9UUkFDS19VUExPQURTLCBlID0+IHtcbiAgICAgIGxldCB1cGxvYWRUYXJnZXQgPSBlLnRhcmdldFxuICAgICAgaWYoIURPTS5pc1VwbG9hZElucHV0KHVwbG9hZFRhcmdldCkpeyByZXR1cm4gfVxuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRldGFpbC5maWxlcyB8fCBbXSkuZmlsdGVyKGYgPT4gZiBpbnN0YW5jZW9mIEZpbGUgfHwgZiBpbnN0YW5jZW9mIEJsb2IpXG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyh1cGxvYWRUYXJnZXQsIGZpbGVzKVxuICAgICAgdXBsb2FkVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWV9KSlcbiAgICB9KVxuICB9XG5cbiAgZXZlbnRNZXRhKGV2ZW50TmFtZSwgZSwgdGFyZ2V0RWwpe1xuICAgIGxldCBjYWxsYmFjayA9IHRoaXMubWV0YWRhdGFDYWxsYmFja3NbZXZlbnROYW1lXVxuICAgIHJldHVybiBjYWxsYmFjayA/IGNhbGxiYWNrKGUsIHRhcmdldEVsKSA6IHt9XG4gIH1cblxuICBzZXRQZW5kaW5nTGluayhocmVmKXtcbiAgICB0aGlzLmxpbmtSZWYrK1xuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBocmVmXG4gICAgdGhpcy5yZXNldFJlbG9hZFN0YXR1cygpXG4gICAgcmV0dXJuIHRoaXMubGlua1JlZlxuICB9XG5cbiAgLy8gYW55dGltZSB3ZSBhcmUgbmF2aWdhdGluZyBvciBjb25uZWN0aW5nLCBkcm9wIHJlbG9hZCBjb29raWUgaW4gY2FzZVxuICAvLyB3ZSBpc3N1ZSB0aGUgY29va2llIGJ1dCB0aGUgbmV4dCByZXF1ZXN0IHdhcyBpbnRlcnJ1cHRlZCBhbmQgdGhlIHNlcnZlciBuZXZlciBkcm9wcGVkIGl0XG4gIHJlc2V0UmVsb2FkU3RhdHVzKCl7IEJyb3dzZXIuZGVsZXRlQ29va2llKFBIWF9SRUxPQURfU1RBVFVTKSB9XG5cbiAgY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZil7XG4gICAgaWYodGhpcy5saW5rUmVmICE9PSBsaW5rUmVmKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhyZWYgPSB0aGlzLnBlbmRpbmdMaW5rXG4gICAgICB0aGlzLnBlbmRpbmdMaW5rID0gbnVsbFxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBnZXRIcmVmKCl7IHJldHVybiB0aGlzLmhyZWYgfVxuXG4gIGhhc1BlbmRpbmdMaW5rKCl7IHJldHVybiAhIXRoaXMucGVuZGluZ0xpbmsgfVxuXG4gIGJpbmQoZXZlbnRzLCBjYWxsYmFjayl7XG4gICAgZm9yKGxldCBldmVudCBpbiBldmVudHMpe1xuICAgICAgbGV0IGJyb3dzZXJFdmVudE5hbWUgPSBldmVudHNbZXZlbnRdXG5cbiAgICAgIHRoaXMub24oYnJvd3NlckV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICAgIGxldCBiaW5kaW5nID0gdGhpcy5iaW5kaW5nKGV2ZW50KVxuICAgICAgICBsZXQgd2luZG93QmluZGluZyA9IHRoaXMuYmluZGluZyhgd2luZG93LSR7ZXZlbnR9YClcbiAgICAgICAgbGV0IHRhcmdldFBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShiaW5kaW5nKVxuICAgICAgICBpZih0YXJnZXRQaHhFdmVudCl7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZShlLnRhcmdldCwgZSwgYnJvd3NlckV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlLCBldmVudCwgdmlldywgZS50YXJnZXQsIHRhcmdldFBoeEV2ZW50LCBudWxsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt3aW5kb3dCaW5kaW5nfV1gLCBlbCA9PiB7XG4gICAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUod2luZG93QmluZGluZylcbiAgICAgICAgICAgIHRoaXMuZGVib3VuY2UoZWwsIGUsIGJyb3dzZXJFdmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlbCwgcGh4RXZlbnQsIFwid2luZG93XCIpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgYmluZENsaWNrcygpe1xuICAgIHRoaXMub24oXCJtb3VzZWRvd25cIiwgZSA9PiB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXQpXG4gICAgdGhpcy5iaW5kQ2xpY2soXCJjbGlja1wiLCBcImNsaWNrXCIpXG4gIH1cblxuICBiaW5kQ2xpY2soZXZlbnROYW1lLCBiaW5kaW5nTmFtZSl7XG4gICAgbGV0IGNsaWNrID0gdGhpcy5iaW5kaW5nKGJpbmRpbmdOYW1lKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gbnVsbFxuICAgICAgLy8gYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgKGRldGFpbCAwKSB3aWxsIG5vdCBoYXZlIGNhdXNlZCBhIG1vdXNlZG93biBldmVudCxcbiAgICAgIC8vIHRoZXJlZm9yZSB0aGUgY2xpY2tTdGFydGVkQXRUYXJnZXQgaXMgc3RhbGVcbiAgICAgIGlmKGUuZGV0YWlsID09PSAwKSB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXRcbiAgICAgIGxldCBjbGlja1N0YXJ0ZWRBdFRhcmdldCA9IHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgfHwgZS50YXJnZXRcbiAgICAgIC8vIHdoZW4gc2VhcmNoaW5nIHRoZSB0YXJnZXQgZm9yIHRoZSBjbGljayBldmVudCwgd2UgYWx3YXlzIHdhbnQgdG9cbiAgICAgIC8vIHVzZSB0aGUgYWN0dWFsIGV2ZW50IHRhcmdldCwgc2VlICMzMzcyXG4gICAgICB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgY2xpY2spXG4gICAgICB0aGlzLmRpc3BhdGNoQ2xpY2tBd2F5KGUsIGNsaWNrU3RhcnRlZEF0VGFyZ2V0KVxuICAgICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGxcbiAgICAgIGxldCBwaHhFdmVudCA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKGNsaWNrKVxuICAgICAgaWYoIXBoeEV2ZW50KXtcbiAgICAgICAgaWYoRE9NLmlzTmV3UGFnZUNsaWNrKGUsIHdpbmRvdy5sb2NhdGlvbikpeyB0aGlzLnVubG9hZCgpIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNcIil7IGUucHJldmVudERlZmF1bHQoKSB9XG5cbiAgICAgIC8vIG5vb3AgaWYgd2UgYXJlIGluIHRoZSBtaWRkbGUgb2YgYXdhaXRpbmcgYW4gYWNrIGZvciB0aGlzIGVsIGFscmVhZHlcbiAgICAgIGlmKHRhcmdldC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpKXsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5kZWJvdW5jZSh0YXJnZXQsIGUsIFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyh0YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgIEpTLmV4ZWMoZSwgXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0LCBbXCJwdXNoXCIsIHtkYXRhOiB0aGlzLmV2ZW50TWV0YShcImNsaWNrXCIsIGUsIHRhcmdldCl9XSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gIH1cblxuICBkaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdCl7XG4gICAgbGV0IHBoeENsaWNrQXdheSA9IHRoaXMuYmluZGluZyhcImNsaWNrLWF3YXlcIilcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7cGh4Q2xpY2tBd2F5fV1gLCBlbCA9PiB7XG4gICAgICBpZighKGVsLmlzU2FtZU5vZGUoY2xpY2tTdGFydGVkQXQpIHx8IGVsLmNvbnRhaW5zKGNsaWNrU3RhcnRlZEF0KSkpe1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICAgICAgbGV0IHBoeEV2ZW50ID0gZWwuZ2V0QXR0cmlidXRlKHBoeENsaWNrQXdheSlcbiAgICAgICAgICBpZihKUy5pc1Zpc2libGUoZWwpICYmIEpTLmlzSW5WaWV3cG9ydChlbCkpe1xuICAgICAgICAgICAgSlMuZXhlYyhlLCBcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCBlbCwgW1wicHVzaFwiLCB7ZGF0YTogdGhpcy5ldmVudE1ldGEoXCJjbGlja1wiLCBlLCBlLnRhcmdldCl9XSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGJpbmROYXYoKXtcbiAgICBpZighQnJvd3Nlci5jYW5QdXNoU3RhdGUoKSl7IHJldHVybiB9XG4gICAgaWYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbil7IGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSBcIm1hbnVhbFwiIH1cbiAgICBsZXQgc2Nyb2xsVGltZXIgPSBudWxsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgX2UgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVyKVxuICAgICAgc2Nyb2xsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgQnJvd3Nlci51cGRhdGVDdXJyZW50U3RhdGUoc3RhdGUgPT4gT2JqZWN0LmFzc2lnbihzdGF0ZSwge3Njcm9sbDogd2luZG93LnNjcm9sbFl9KSlcbiAgICAgIH0sIDEwMClcbiAgICB9KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgZXZlbnQgPT4ge1xuICAgICAgaWYoIXRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pKXsgcmV0dXJuIH1cbiAgICAgIGxldCB7dHlwZSwgYmFja1R5cGUsIGlkLCBzY3JvbGwsIHBvc2l0aW9ufSA9IGV2ZW50LnN0YXRlIHx8IHt9XG4gICAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG5cbiAgICAgIC8vIENvbXBhcmUgcG9zaXRpb25zIHRvIGRldGVybWluZSBkaXJlY3Rpb25cbiAgICAgIGxldCBpc0ZvcndhcmQgPSBwb3NpdGlvbiA+IHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuXG4gICAgICB0eXBlID0gaXNGb3J3YXJkID8gdHlwZSA6IChiYWNrVHlwZSB8fCB0eXBlKVxuXG4gICAgICAvLyBVcGRhdGUgY3VycmVudCBwb3NpdGlvblxuICAgICAgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uID0gcG9zaXRpb24gfHwgMFxuICAgICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpuYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7aHJlZiwgcGF0Y2g6IHR5cGUgPT09IFwicGF0Y2hcIiwgcG9wOiB0cnVlLCBkaXJlY3Rpb246IGlzRm9yd2FyZCA/IFwiZm9yd2FyZFwiIDogXCJiYWNrd2FyZFwifX0pXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHsgdGhpcy5tYXliZVNjcm9sbChzY3JvbGwpIH1cbiAgICAgICAgaWYodGhpcy5tYWluLmlzQ29ubmVjdGVkKCkgJiYgKHR5cGUgPT09IFwicGF0Y2hcIiAmJiBpZCA9PT0gdGhpcy5tYWluLmlkKSl7XG4gICAgICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goZXZlbnQsIGhyZWYsIG51bGwsIGNhbGxiYWNrKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2spXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgUEhYX0xJVkVfTElOSylcbiAgICAgIGxldCB0eXBlID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoUEhYX0xJVkVfTElOSylcbiAgICAgIGlmKCF0eXBlIHx8ICF0aGlzLmlzQ29ubmVjdGVkKCkgfHwgIXRoaXMubWFpbiB8fCBET00ud2FudHNOZXdUYWIoZSkpeyByZXR1cm4gfVxuXG4gICAgICAvLyBXaGVuIHdyYXBwaW5nIGFuIFNWRyBlbGVtZW50IGluIGFuIGFuY2hvciB0YWcsIHRoZSBocmVmIGNhbiBiZSBhbiBTVkdBbmltYXRlZFN0cmluZ1xuICAgICAgbGV0IGhyZWYgPSB0YXJnZXQuaHJlZiBpbnN0YW5jZW9mIFNWR0FuaW1hdGVkU3RyaW5nID8gdGFyZ2V0LmhyZWYuYmFzZVZhbCA6IHRhcmdldC5ocmVmXG5cbiAgICAgIGxldCBsaW5rU3RhdGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSU5LX1NUQVRFKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIC8vIGRvIG5vdCBidWJibGUgY2xpY2sgdG8gcmVndWxhciBwaHgtY2xpY2sgYmluZGluZ3NcbiAgICAgIGlmKHRoaXMucGVuZGluZ0xpbmsgPT09IGhyZWYpeyByZXR1cm4gfVxuXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZih0eXBlID09PSBcInBhdGNoXCIpe1xuICAgICAgICAgIHRoaXMucHVzaEhpc3RvcnlQYXRjaChlLCBocmVmLCBsaW5rU3RhdGUsIHRhcmdldClcbiAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgdGhpcy5oaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgbGlua1N0YXRlLCBudWxsLCB0YXJnZXQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCAke1BIWF9MSVZFX0xJTkt9IHRvIGJlIFwicGF0Y2hcIiBvciBcInJlZGlyZWN0XCIsIGdvdDogJHt0eXBlfWApXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBoeENsaWNrID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjbGlja1wiKSlcbiAgICAgICAgaWYocGh4Q2xpY2spe1xuICAgICAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB0aGlzLmV4ZWNKUyh0YXJnZXQsIHBoeENsaWNrLCBcImNsaWNrXCIpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuICB9XG5cbiAgbWF5YmVTY3JvbGwoc2Nyb2xsKXtcbiAgICBpZih0eXBlb2Yoc2Nyb2xsKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxuICAgICAgfSkgLy8gdGhlIGJvZHkgbmVlZHMgdG8gcmVuZGVyIGJlZm9yZSB3ZSBzY3JvbGwuXG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9KXtcbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIGBwaHg6JHtldmVudH1gLCB7ZGV0YWlsOiBwYXlsb2FkfSlcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnRzKGV2ZW50cyl7XG4gICAgZXZlbnRzLmZvckVhY2goKFtldmVudCwgcGF5bG9hZF0pID0+IHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCkpXG4gIH1cblxuICB3aXRoUGFnZUxvYWRpbmcoaW5mbywgY2FsbGJhY2spe1xuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIHtkZXRhaWw6IGluZm99KVxuICAgIGxldCBkb25lID0gKCkgPT4gRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCB7ZGV0YWlsOiBpbmZvfSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBjYWxsYmFjayhkb25lKSA6IGRvbmVcbiAgfVxuXG4gIHB1c2hIaXN0b3J5UGF0Y2goZSwgaHJlZiwgbGlua1N0YXRlLCB0YXJnZXRFbCl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluLmlzTWFpbigpKXsgcmV0dXJuIEJyb3dzZXIucmVkaXJlY3QoaHJlZikgfVxuXG4gICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiBocmVmLCBraW5kOiBcInBhdGNoXCJ9LCBkb25lID0+IHtcbiAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGUsIGhyZWYsIHRhcmdldEVsLCBsaW5rUmVmID0+IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmKVxuICAgICAgICBkb25lKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBpZighdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7IHJldHVybiB9XG5cbiAgICAvLyBJbmNyZW1lbnQgcG9zaXRpb24gZm9yIG5ldyBzdGF0ZVxuICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbisrXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgIC8vIHN0b3JlIHRoZSB0eXBlIGZvciBiYWNrIG5hdmlnYXRpb25cbiAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZSgoc3RhdGUpID0+ICh7Li4uc3RhdGUsIGJhY2tUeXBlOiBcInBhdGNoXCJ9KSlcblxuICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge1xuICAgICAgdHlwZTogXCJwYXRjaFwiLFxuICAgICAgaWQ6IHRoaXMubWFpbi5pZCxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb25cbiAgICB9LCBocmVmKVxuXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpuYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7cGF0Y2g6IHRydWUsIGhyZWYsIHBvcDogZmFsc2UsIGRpcmVjdGlvbjogXCJmb3J3YXJkXCJ9fSlcbiAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICB9XG5cbiAgaGlzdG9yeVJlZGlyZWN0KGUsIGhyZWYsIGxpbmtTdGF0ZSwgZmxhc2gsIHRhcmdldEVsKXtcbiAgICBjb25zdCBjbGlja0xvYWRpbmcgPSB0YXJnZXRFbCAmJiBlLmlzVHJ1c3RlZCAmJiBlLnR5cGUgIT09IFwicG9wc3RhdGVcIlxuICAgIGlmKGNsaWNrTG9hZGluZyl7IHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoXCJwaHgtY2xpY2stbG9hZGluZ1wiKSB9XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluLmlzTWFpbigpKXsgcmV0dXJuIEJyb3dzZXIucmVkaXJlY3QoaHJlZiwgZmxhc2gpIH1cblxuICAgIC8vIGNvbnZlcnQgdG8gZnVsbCBocmVmIGlmIG9ubHkgcGF0aCBwcmVmaXhcbiAgICBpZigvXlxcLyR8XlxcL1teXFwvXSsuKiQvLnRlc3QoaHJlZikpe1xuICAgICAgbGV0IHtwcm90b2NvbCwgaG9zdH0gPSB3aW5kb3cubG9jYXRpb25cbiAgICAgIGhyZWYgPSBgJHtwcm90b2NvbH0vLyR7aG9zdH0ke2hyZWZ9YFxuICAgIH1cbiAgICBsZXQgc2Nyb2xsID0gd2luZG93LnNjcm9sbFlcbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IGhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIn0sIGRvbmUgPT4ge1xuICAgICAgdGhpcy5yZXBsYWNlTWFpbihocmVmLCBmbGFzaCwgKGxpbmtSZWYpID0+IHtcbiAgICAgICAgaWYobGlua1JlZiA9PT0gdGhpcy5saW5rUmVmKXtcbiAgICAgICAgICAvLyBJbmNyZW1lbnQgcG9zaXRpb24gZm9yIG5ldyBzdGF0ZVxuICAgICAgICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbisrXG4gICAgICAgICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLCB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24udG9TdHJpbmcoKSlcblxuICAgICAgICAgIC8vIHN0b3JlIHRoZSB0eXBlIGZvciBiYWNrIG5hdmlnYXRpb25cbiAgICAgICAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZSgoc3RhdGUpID0+ICh7Li4uc3RhdGUsIGJhY2tUeXBlOiBcInJlZGlyZWN0XCJ9KSlcblxuICAgICAgICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge1xuICAgICAgICAgICAgdHlwZTogXCJyZWRpcmVjdFwiLFxuICAgICAgICAgICAgaWQ6IHRoaXMubWFpbi5pZCxcbiAgICAgICAgICAgIHNjcm9sbDogc2Nyb2xsLFxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuICAgICAgICAgIH0sIGhyZWYpXG5cbiAgICAgICAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4Om5hdmlnYXRlXCIsIHtkZXRhaWw6IHtocmVmLCBwYXRjaDogZmFsc2UsIHBvcDogZmFsc2UsIGRpcmVjdGlvbjogXCJmb3J3YXJkXCJ9fSlcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKVxuICAgICAgICB9XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgdW5kbyBjbGljay1sb2FkaW5nIGNsYXNzXG4gICAgICAgIC8vIChpbiBjYXNlIGl0IG9yaWdpbmF0ZWQgaW4gYSBzdGlja3kgbGl2ZSB2aWV3LCBvdGhlcndpc2UgaXQgd291bGQgYmUgcmVtb3ZlZCBhbnl3YXkpXG4gICAgICAgIGlmKGNsaWNrTG9hZGluZyl7IHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJwaHgtY2xpY2stbG9hZGluZ1wiKSB9XG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVnaXN0ZXJOZXdMb2NhdGlvbihuZXdMb2NhdGlvbil7XG4gICAgbGV0IHtwYXRobmFtZSwgc2VhcmNofSA9IHRoaXMuY3VycmVudExvY2F0aW9uXG4gICAgaWYocGF0aG5hbWUgKyBzZWFyY2ggPT09IG5ld0xvY2F0aW9uLnBhdGhuYW1lICsgbmV3TG9jYXRpb24uc2VhcmNoKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKG5ld0xvY2F0aW9uKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBiaW5kRm9ybXMoKXtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDBcbiAgICBsZXQgZXh0ZXJuYWxGb3JtU3VibWl0dGVkID0gZmFsc2VcblxuICAgIC8vIGRpc2FibGUgZm9ybXMgb24gc3VibWl0IHRoYXQgdHJhY2sgcGh4LWNoYW5nZSBidXQgcGVyZm9ybSBleHRlcm5hbCBzdWJtaXRcbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeFN1Ym1pdCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpXG4gICAgICBsZXQgcGh4Q2hhbmdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcbiAgICAgIGlmKCFleHRlcm5hbEZvcm1TdWJtaXR0ZWQgJiYgcGh4Q2hhbmdlICYmICFwaHhTdWJtaXQpe1xuICAgICAgICBleHRlcm5hbEZvcm1TdWJtaXR0ZWQgPSB0cnVlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgdmlldy5kaXNhYmxlRm9ybShlLnRhcmdldClcbiAgICAgICAgICAvLyBzYWZhcmkgbmVlZHMgbmV4dCB0aWNrXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBpZihET00uaXNVbmxvYWRhYmxlRm9ybVN1Ym1pdChlKSl7IHRoaXMudW5sb2FkKCkgfVxuICAgICAgICAgICAgZS50YXJnZXQuc3VibWl0KClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInN1Ym1pdFwiKSlcbiAgICAgIGlmKCFwaHhFdmVudCl7XG4gICAgICAgIGlmKERPTS5pc1VubG9hZGFibGVGb3JtU3VibWl0KGUpKXsgdGhpcy51bmxvYWQoKSB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnRhcmdldC5kaXNhYmxlZCA9IHRydWVcbiAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgSlMuZXhlYyhlLCBcInN1Ym1pdFwiLCBwaHhFdmVudCwgdmlldywgZS50YXJnZXQsIFtcInB1c2hcIiwge3N1Ym1pdHRlcjogZS5zdWJtaXR0ZXJ9XSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGZvcihsZXQgdHlwZSBvZiBbXCJjaGFuZ2VcIiwgXCJpbnB1dFwiXSl7XG4gICAgICB0aGlzLm9uKHR5cGUsIGUgPT4ge1xuICAgICAgICBpZihlIGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZS50YXJnZXQuZm9ybSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAvLyB0aHJvdyBvbiBpbnZhbGlkIEpTLmRpc3BhdGNoIHRhcmdldCBhbmQgbm9vcCBpZiBDdXN0b21FdmVudCB0cmlnZ2VyZWQgb3V0c2lkZSBKUy5kaXNwYXRjaFxuICAgICAgICAgIGlmKGUuZGV0YWlsICYmIGUuZGV0YWlsLmRpc3BhdGNoZXIpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBkaXNwYXRjaGluZyBhIGN1c3RvbSAke3R5cGV9IGV2ZW50IGlzIG9ubHkgc3VwcG9ydGVkIG9uIGlucHV0IGVsZW1lbnRzIGluc2lkZSBhIGZvcm1gKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgICAgIGxldCBpbnB1dCA9IGUudGFyZ2V0XG4gICAgICAgIC8vIGRvIG5vdCBmaXJlIHBoeC1jaGFuZ2UgaWYgd2UgYXJlIGluIHRoZSBtaWRkbGUgb2YgYSBjb21wb3NpdGlvbiBzZXNzaW9uXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2lzQ29tcG9zaW5nXG4gICAgICAgIC8vIFNhZmFyaSBoYXMgaXNzdWVzIGlmIHRoZSBpbnB1dCBpcyB1cGRhdGVkIHdoaWxlIGNvbXBvc2luZ1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzMzMjJcbiAgICAgICAgaWYoZS5pc0NvbXBvc2luZyl7XG4gICAgICAgICAgY29uc3Qga2V5ID0gYGNvbXBvc2l0aW9uLWxpc3RlbmVyLSR7dHlwZX1gXG4gICAgICAgICAgaWYoIURPTS5wcml2YXRlKGlucHV0LCBrZXkpKXtcbiAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBrZXksIHRydWUpXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29tcG9zaXRpb25lbmRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAvLyB0cmlnZ2VyIGEgbmV3IGlucHV0L2NoYW5nZSBldmVudFxuICAgICAgICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCh0eXBlLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgICAgICAgICAgICBET00uZGVsZXRlUHJpdmF0ZShpbnB1dCwga2V5KVxuICAgICAgICAgICAgfSwge29uY2U6IHRydWV9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgaW5wdXRFdmVudCA9IGlucHV0LmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpXG4gICAgICAgIGxldCBmb3JtRXZlbnQgPSBpbnB1dC5mb3JtICYmIGlucHV0LmZvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSlcbiAgICAgICAgbGV0IHBoeEV2ZW50ID0gaW5wdXRFdmVudCB8fCBmb3JtRXZlbnRcbiAgICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgICAgaWYoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dC52YWxpZGl0eSAmJiBpbnB1dC52YWxpZGl0eS5iYWRJbnB1dCl7IHJldHVybiB9XG5cbiAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBpbnB1dEV2ZW50ID8gaW5wdXQgOiBpbnB1dC5mb3JtXG4gICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnNcbiAgICAgICAgaXRlcmF0aW9ucysrXG4gICAgICAgIGxldCB7YXQ6IGF0LCB0eXBlOiBsYXN0VHlwZX0gPSBET00ucHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiKSB8fCB7fVxuICAgICAgICAvLyBCcm93c2VycyBzaG91bGQgYWx3YXlzIGZpcmUgYXQgbGVhc3Qgb25lIFwiaW5wdXRcIiBldmVudCBiZWZvcmUgZXZlcnkgXCJjaGFuZ2VcIlxuICAgICAgICAvLyBJZ25vcmUgXCJjaGFuZ2VcIiBldmVudHMsIHVubGVzcyB0aGVyZSB3YXMgbm8gcHJpb3IgXCJpbnB1dFwiIGV2ZW50LlxuICAgICAgICAvLyBUaGlzIGNvdWxkIGhhcHBlbiBpZiB1c2VyIGNvZGUgdHJpZ2dlcnMgYSBcImNoYW5nZVwiIGV2ZW50LCBvciBpZiB0aGUgYnJvd3NlciBpcyBub24tY29uZm9ybWluZy5cbiAgICAgICAgaWYoYXQgPT09IGN1cnJlbnRJdGVyYXRpb25zIC0gMSAmJiB0eXBlID09PSBcImNoYW5nZVwiICYmIGxhc3RUeXBlID09PSBcImlucHV0XCIpeyByZXR1cm4gfVxuXG4gICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBcInByZXYtaXRlcmF0aW9uXCIsIHthdDogY3VycmVudEl0ZXJhdGlvbnMsIHR5cGU6IHR5cGV9KVxuXG4gICAgICAgIHRoaXMuZGVib3VuY2UoaW5wdXQsIGUsIHR5cGUsICgpID0+IHtcbiAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhkaXNwYXRjaGVyLCB2aWV3ID0+IHtcbiAgICAgICAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQsIHRydWUpXG4gICAgICAgICAgICBKUy5leGVjKGUsIFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogZS50YXJnZXQubmFtZSwgZGlzcGF0Y2hlcjogZGlzcGF0Y2hlcn1dKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLm9uKFwicmVzZXRcIiwgKGUpID0+IHtcbiAgICAgIGxldCBmb3JtID0gZS50YXJnZXRcbiAgICAgIERPTS5yZXNldEZvcm0oZm9ybSlcbiAgICAgIGxldCBpbnB1dCA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cykuZmluZChlbCA9PiBlbC50eXBlID09PSBcInJlc2V0XCIpXG4gICAgICBpZihpbnB1dCl7XG4gICAgICAgIC8vIHdhaXQgdW50aWwgbmV4dCB0aWNrIHRvIGdldCB1cGRhdGVkIGlucHV0IHZhbHVlXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IGZhbHNlfSkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgZXZlbnRUeXBlLCBjYWxsYmFjayl7XG4gICAgaWYoZXZlbnRUeXBlID09PSBcImJsdXJcIiB8fCBldmVudFR5cGUgPT09IFwiZm9jdXNvdXRcIil7IHJldHVybiBjYWxsYmFjaygpIH1cblxuICAgIGxldCBwaHhEZWJvdW5jZSA9IHRoaXMuYmluZGluZyhQSFhfREVCT1VOQ0UpXG4gICAgbGV0IHBoeFRocm90dGxlID0gdGhpcy5iaW5kaW5nKFBIWF9USFJPVFRMRSlcbiAgICBsZXQgZGVmYXVsdERlYm91bmNlID0gdGhpcy5kZWZhdWx0cy5kZWJvdW5jZS50b1N0cmluZygpXG4gICAgbGV0IGRlZmF1bHRUaHJvdHRsZSA9IHRoaXMuZGVmYXVsdHMudGhyb3R0bGUudG9TdHJpbmcoKVxuXG4gICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgbGV0IGFzeW5jRmlsdGVyID0gKCkgPT4gIXZpZXcuaXNEZXN0cm95ZWQoKSAmJiBkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGVsKVxuICAgICAgRE9NLmRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgYXN5bmNGaWx0ZXIsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc2lsZW5jZUV2ZW50cyhjYWxsYmFjayl7XG4gICAgdGhpcy5zaWxlbmNlZCA9IHRydWVcbiAgICBjYWxsYmFjaygpXG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlXG4gIH1cblxuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIHRoaXMuYm91bmRFdmVudE5hbWVzLmFkZChldmVudClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZSA9PiB7XG4gICAgICBpZighdGhpcy5zaWxlbmNlZCl7IGNhbGxiYWNrKGUpIH1cbiAgICB9KVxuICB9XG5cbiAganNRdWVyeVNlbGVjdG9yQWxsKHNvdXJjZUVsLCBxdWVyeSwgZGVmYXVsdFF1ZXJ5KXtcbiAgICBsZXQgYWxsID0gdGhpcy5kb21DYWxsYmFja3MuanNRdWVyeVNlbGVjdG9yQWxsXG4gICAgcmV0dXJuIGFsbCA/IGFsbChzb3VyY2VFbCwgcXVlcnksIGRlZmF1bHRRdWVyeSkgOiBkZWZhdWx0UXVlcnkoKVxuICB9XG59XG5cbmNsYXNzIFRyYW5zaXRpb25TZXQge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmZvckVhY2godGltZXIgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgfSlcbiAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gIH1cblxuICBhZnRlcihjYWxsYmFjayl7XG4gICAgaWYodGhpcy5zaXplKCkgPT09IDApe1xuICAgICAgY2FsbGJhY2soKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hQZW5kaW5nT3AoY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpe1xuICAgIG9uU3RhcnQoKVxuICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgICBvbkRvbmUoKVxuICAgICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKVxuICAgIH0sIHRpbWUpXG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZGQodGltZXIpXG4gIH1cblxuICBwdXNoUGVuZGluZ09wKG9wKXsgdGhpcy5wZW5kaW5nT3BzLnB1c2gob3ApIH1cblxuICBzaXplKCl7IHJldHVybiB0aGlzLnRyYW5zaXRpb25zLnNpemUgfVxuXG4gIGZsdXNoUGVuZGluZ09wcygpe1xuICAgIGlmKHRoaXMuc2l6ZSgpID4gMCl7IHJldHVybiB9XG4gICAgbGV0IG9wID0gdGhpcy5wZW5kaW5nT3BzLnNoaWZ0KClcbiAgICBpZihvcCl7XG4gICAgICBvcCgpXG4gICAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gICAgfVxuICB9XG59XG4iLCAiLypcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5QaG9lbml4IExpdmVWaWV3IEphdmFTY3JpcHQgQ2xpZW50XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5TZWUgdGhlIGhleGRvY3MgYXQgYGh0dHBzOi8vaGV4ZG9jcy5wbS9waG9lbml4X2xpdmVfdmlld2AgZm9yIGRvY3VtZW50YXRpb24uXG5cbiovXG5cbmltcG9ydCBMaXZlU29ja2V0LCB7aXNVc2VkSW5wdXR9IGZyb20gXCIuL2xpdmVfc29ja2V0XCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBWaWV3SG9vayBmcm9tIFwiLi92aWV3X2hvb2tcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5cbi8qKiBDcmVhdGVzIGEgVmlld0hvb2sgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBlbGVtZW50IGFuZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBhc3NvY2lhdGUgd2l0aCB0aGUgaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY2FsbGJhY2tzXSAtIFRoZSBsaXN0IG9mIGhvb2sgY2FsbGJhY2tzLCBzdWNoIGFzIG1vdW50ZWQsXG4gKiAgIHVwZGF0ZWQsIGRlc3Ryb3llZCwgZXRjLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gKiAgIGNvbm5lY3RlZENhbGxiYWNrKCl7XG4gKiAgICAgbGV0IG9uTGl2ZVZpZXdNb3VudGVkID0gKCkgPT4gdGhpcy5ob29rLnB1c2hFdmVudCguLi4pKVxuICogICAgIHRoaXMuaG9vayA9IGNyZWF0ZUhvb2sodGhpcywge21vdW50ZWQ6IG9uTGl2ZVZpZXdNb3VudGVkfSlcbiAqICAgfVxuICogfVxuICpcbiAqICpOb3RlKjogYGNyZWF0ZUhvb2tgIG11c3QgYmUgY2FsbGVkIGZyb20gdGhlIGBjb25uZWN0ZWRDYWxsYmFja2AgbGlmZWN5Y2xlXG4gKiB3aGljaCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIGVsZW1lbnQgaGFzIGJlZW4gYWRkZWQgdG8gdGhlIERPTS4gSWYgeW91IHRyeVxuICogdG8gY2FsbCBgY3JlYXRlSG9va2AgZnJvbSB0aGUgY29uc3RydWN0b3IsIGFuIGVycm9yIHdpbGwgYmUgbG9nZ2VkLlxuICpcbiAqIEByZXR1cm5zIHtWaWV3SG9va30gUmV0dXJucyB0aGUgVmlld0hvb2sgaW5zdGFuY2UgZm9yIHRoZSBjdXN0b20gZWxlbWVudC5cbiAqL1xubGV0IGNyZWF0ZUhvb2sgPSAoZWwsIGNhbGxiYWNrcyA9IHt9KSA9PiB7XG4gIGxldCBleGlzdGluZ0hvb2sgPSBET00uZ2V0Q3VzdG9tRWxIb29rKGVsKVxuICBpZihleGlzdGluZ0hvb2speyByZXR1cm4gZXhpc3RpbmdIb29rIH1cblxuICBsZXQgaG9vayA9IG5ldyBWaWV3SG9vayhWaWV3LmNsb3Nlc3RWaWV3KGVsKSwgZWwsIGNhbGxiYWNrcylcbiAgRE9NLnB1dEN1c3RvbUVsSG9vayhlbCwgaG9vaylcbiAgcmV0dXJuIGhvb2tcbn1cblxuZXhwb3J0IHtcbiAgTGl2ZVNvY2tldCxcbiAgaXNVc2VkSW5wdXQsXG4gIGNyZWF0ZUhvb2tcbn1cbiIsICIvLyBXZSBpbXBvcnQgdGhlIENTUyB3aGljaCBpcyBleHRyYWN0ZWQgdG8gaXRzIG93biBmaWxlIGJ5IGVzYnVpbGQuXG4vLyBSZW1vdmUgdGhpcyBsaW5lIGlmIHlvdSBhZGQgYSB5b3VyIG93biBDU1MgYnVpbGQgcGlwZWxpbmUgKGUuZyBwb3N0Y3NzKS5cbmltcG9ydCBcIi4uL2Nzcy9hcHAuY3NzXCJcbi8vIEltcG9ydCB0aGUgZGFyayBtb2RlIHRvZ2dsZSBzY3JpcHRcbmltcG9ydCBcIi4vZGFya19tb2RlXCJcblxuLy8gUG9zdEhvZyBhbmFseXRpY3MgaXMgaGFuZGxlZCB2aWEgdGhlIHdlYiBzbmlwcGV0IGluIHJvb3QuaHRtbC5oZWV4XG5cbi8vIElmIHlvdSB3YW50IHRvIHVzZSBQaG9lbml4IGNoYW5uZWxzLCBydW4gYG1peCBoZWxwIHBoeC5nZW4uY2hhbm5lbGBcbi8vIHRvIGdldCBzdGFydGVkIGFuZCB0aGVuIHVuY29tbWVudCB0aGUgbGluZSBiZWxvdy5cbi8vIGltcG9ydCBcIi4vdXNlcl9zb2NrZXQuanNcIlxuXG4vLyBZb3UgY2FuIGluY2x1ZGUgZGVwZW5kZW5jaWVzIGluIHR3byB3YXlzLlxuLy9cbi8vIFRoZSBzaW1wbGVzdCBvcHRpb24gaXMgdG8gcHV0IHRoZW0gaW4gYXNzZXRzL3ZlbmRvciBhbmRcbi8vIGltcG9ydCB0aGVtIHVzaW5nIHJlbGF0aXZlIHBhdGhzOlxuLy9cbi8vICAgICBpbXBvcnQgXCIuLi92ZW5kb3Ivc29tZS1wYWNrYWdlLmpzXCJcbi8vXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGBucG0gaW5zdGFsbCBzb21lLXBhY2thZ2UgLS1wcmVmaXggYXNzZXRzYCBhbmQgaW1wb3J0XG4vLyB0aGVtIHVzaW5nIGEgcGF0aCBzdGFydGluZyB3aXRoIHRoZSBwYWNrYWdlIG5hbWU6XG4vL1xuLy8gICAgIGltcG9ydCBcInNvbWUtcGFja2FnZVwiXG4vL1xuXG4vLyBJbmNsdWRlIHBob2VuaXhfaHRtbCB0byBoYW5kbGUgbWV0aG9kPVBVVC9ERUxFVEUgaW4gZm9ybXMgYW5kIGJ1dHRvbnMuXG5pbXBvcnQgXCJwaG9lbml4X2h0bWxcIlxuLy8gRXN0YWJsaXNoIFBob2VuaXggU29ja2V0IGFuZCBMaXZlVmlldyBjb25maWd1cmF0aW9uLlxuaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbmltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbmltcG9ydCB0b3BiYXIgZnJvbSBcIi4uL3ZlbmRvci90b3BiYXJcIlxuXG5sZXQgSG9va3MgPSB7fVxuXG5cbi8vIE1vZGFsIENsaWNrIEhhbmRsZXIgSG9va1xuSG9va3MuTW9kYWxDbGlja0hhbmRsZXIgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhcIk1vZGFsQ2xpY2tIYW5kbGVyIG1vdW50ZWQgb24gZWxlbWVudDpcIiwgdGhpcy5lbClcbiAgICBjb25zb2xlLmRlYnVnKFwiRWxlbWVudCBJRDpcIiwgdGhpcy5lbC5pZClcbiAgICBjb25zb2xlLmRlYnVnKFwiRWxlbWVudCBjbGFzc2VzOlwiLCB0aGlzLmVsLmNsYXNzTmFtZSlcblxuICAgIC8vIEhhbmRsZSBYIGJ1dHRvbiBjbGlja3Mgd2l0aCBjb25maXJtYXRpb25cbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5zdW1tYXJ5LW1vZGFsLWNsb3NlXCIpXG4gICAgaWYgKGNsb3NlQnV0dG9uKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFwiQ2xvc2UgYnV0dG9uIGZvdW5kIGFuZCBldmVudCBsaXN0ZW5lciBhdHRhY2hlZFwiKVxuICAgICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsQ2xvc2UoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIk5vIGNsb3NlIGJ1dHRvbiBmb3VuZFwiKVxuICAgIH1cblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAvLyBEZWJ1ZyBBTEwgY2xpY2sgZXZlbnRzIG9uIHRoZSBtb2RhbFxuICAgICAgY29uc29sZS5kZWJ1ZyhcIkNsaWNrIGV2ZW50IGRldGVjdGVkIG9uIG1vZGFsOlwiKVxuICAgICAgY29uc29sZS5kZWJ1ZyhcIi0gRXZlbnQgdGFyZ2V0OlwiLCBlLnRhcmdldClcbiAgICAgIGNvbnNvbGUuZGVidWcoXCItIFRhcmdldCB0YWdOYW1lOlwiLCBlLnRhcmdldC50YWdOYW1lKVxuICAgICAgY29uc29sZS5kZWJ1ZyhcIi0gVGFyZ2V0IGNsYXNzZXM6XCIsIGUudGFyZ2V0LmNsYXNzTmFtZSlcbiAgICAgIGNvbnNvbGUuZGVidWcoXCItIFRhcmdldCA9PT0gdGhpcy5lbDpcIiwgZS50YXJnZXQgPT09IHRoaXMuZWwpXG4gICAgICBjb25zb2xlLmRlYnVnKFwiLSB0aGlzLmVsOlwiLCB0aGlzLmVsKVxuXG4gICAgICAvLyBIYW5kbGUgY29weSBidXR0b24gY2xpY2tzXG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29weS10by1jbGlwYm9hcmQtYnRuXCIpKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJDb3B5IGJ1dHRvbiBjbGlja2VkXCIpXG4gICAgICAgIGNvbnN0IGNvbnRlbnREaXYgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCIuc3VtbWFyeS1jb250ZW50XCIpXG4gICAgICAgIGlmIChjb250ZW50RGl2KSB7XG4gICAgICAgICAgLy8gR2V0IHRleHQgY29udGVudCwgcHJlc2VydmUgbGluZSBicmVha3NcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gY29udGVudERpdi5pbm5lclRleHQgfHwgY29udGVudERpdi50ZXh0Q29udGVudCB8fCBcIlwiXG4gICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBWaXN1YWwgZmVlZGJhY2sgLSBicmllZmx5IGNoYW5nZSB0aGUgaWNvblxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gZS50YXJnZXQudGV4dENvbnRlbnRcbiAgICAgICAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJcdTI3MDVcIlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBjb3B5IHRleHQ6ICcsIGVycilcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrIGZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICAgICAgdGhpcy5mYWxsYmFja0NvcHlUZXh0VG9DbGlwYm9hcmQodGV4dCwgZS50YXJnZXQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gQ2xpY2stb3V0c2lkZS10by1jbG9zZSBiZWhhdmlvciAtIG9ubHkgd2hlbiBOT1QgbG9hZGluZ1xuICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmVsKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCI9PT0gQ0xJQ0stT1VUU0lERSBERVRFQ1RFRCA9PT1cIilcblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSdyZSBjdXJyZW50bHkgbG9hZGluZyAoZ2VuZXJhdGluZyBjb250ZW50KVxuICAgICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5zdW1tYXJ5LWxvYWRpbmdcIilcbiAgICAgICAgY29uc3QgZGF0YUxvYWRpbmcgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtbG9hZGluZ1wiKVxuXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJMb2FkaW5nIHN0YXRlIGNoZWNrOlwiKVxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiLSAuc3VtbWFyeS1sb2FkaW5nIGVsZW1lbnQ6XCIsIGxvYWRpbmdFbGVtZW50KVxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiLSBkYXRhLWxvYWRpbmcgYXR0cmlidXRlOlwiLCBkYXRhTG9hZGluZylcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIi0gTW9kYWwgaW5uZXJIVE1MIHByZXZpZXc6XCIsIHRoaXMuZWwuaW5uZXJIVE1MLnN1YnN0cmluZygwLCAyMDApKVxuXG4gICAgICAgIGlmIChsb2FkaW5nRWxlbWVudCkge1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJcdTI3NEMgUFJFVkVOVElORyBDTE9TRSAtIGNvbnRlbnQgaXMgbG9hZGluZ1wiKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGFMb2FkaW5nID09PSBcInRydWVcIikge1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJcdTI3NEMgUFJFVkVOVElORyBDTE9TRSAtIGRhdGEtbG9hZGluZyBpcyB0cnVlXCIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiXHUyNzA1IEFMTE9XSU5HIENMT1NFIC0gbm90IGxvYWRpbmdcIilcbiAgICAgICAgdGhpcy5oYW5kbGVNb2RhbENsb3NlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJDbGljayB3YXMgb24gY2hpbGQgZWxlbWVudCwgbm90IGNsb3NpbmcgbW9kYWxcIilcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGhhbmRsZU1vZGFsQ2xvc2UoKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhcIj09PSBoYW5kbGVNb2RhbENsb3NlKCkgY2FsbGVkID09PVwiKVxuICAgIGNvbnNvbGUuZGVidWcoXCJQdXNoaW5nIG1vZGFsX2Nsb3NlX3JlcXVlc3QgZXZlbnQgdG8gI3N1bW1hcnktbW9kYWxcIilcblxuICAgIC8vIFB1c2ggZXZlbnQgZGlyZWN0bHkgdG8gdGhlIExpdmVDb21wb25lbnQgdXNpbmcgaXRzIElEXG4gICAgdGhpcy5wdXNoRXZlbnRUbyhcIiNzdW1tYXJ5LW1vZGFsXCIsIFwibW9kYWxfY2xvc2VfcmVxdWVzdFwiLCB7fSlcbiAgfSxcblxuICB1cGRhdGVkKCkge1xuICAgIGNvbnNvbGUuZGVidWcoXCI9PT0gTW9kYWwgdXBkYXRlZCA9PT1cIilcbiAgICBjb25zb2xlLmRlYnVnKFwiLSBkYXRhLWxvYWRpbmc6XCIsIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1sb2FkaW5nXCIpKVxuICAgIGNvbnNvbGUuZGVidWcoXCItIGRpc3BsYXkgc3R5bGU6XCIsIHRoaXMuZWwuc3R5bGUuZGlzcGxheSlcbiAgICBjb25zb2xlLmRlYnVnKFwiLSAuc3VtbWFyeS1sb2FkaW5nIHByZXNlbnQ6XCIsICEhdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiLnN1bW1hcnktbG9hZGluZ1wiKSlcbiAgfSxcbiAgXG4gIFxuICBmYWxsYmFja0NvcHlUZXh0VG9DbGlwYm9hcmQodGV4dCwgYnV0dG9uKSB7XG4gICAgY29uc3QgdGV4dEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcbiAgICB0ZXh0QXJlYS52YWx1ZSA9IHRleHRcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRBcmVhKVxuICAgIHRleHRBcmVhLmZvY3VzKClcbiAgICB0ZXh0QXJlYS5zZWxlY3QoKVxuICAgIHRyeSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpXG4gICAgICBjb25zdCBvcmlnaW5hbFRleHQgPSBidXR0b24udGV4dENvbnRlbnRcbiAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiXHUyNzA1XCJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBvcmlnaW5hbFRleHRcbiAgICAgIH0sIDEwMDApXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0ZhbGxiYWNrIGNvcHkgZmFpbGVkOiAnLCBlcnIpXG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dEFyZWEpXG4gIH1cbn1cblxuLy8gRmVlZGJhY2sgRm9ybSBIb29rXG5Ib29rcy5GZWVkYmFja0Zvcm0gPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zZXR1cEZlZWRiYWNrSW50ZXJhY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEF1dG9IaWRlU3VjY2VzcygpO1xuICB9LFxuXG4gIHVwZGF0ZWQoKSB7XG4gICAgdGhpcy5zZXR1cEZlZWRiYWNrSW50ZXJhY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEF1dG9IaWRlU3VjY2VzcygpO1xuICB9LFxuXG4gIHNldHVwRmVlZGJhY2tJbnRlcmFjdGlvbnMoKSB7XG4gICAgLy8gSGFuZGxlIGNoZWNrYm94ZXMgdGhhdCBoYXZlIGFzc29jaWF0ZWQgZGV0YWlscyBmaWVsZHNcbiAgICBjb25zdCB0b2dnbGVzID0gWydkb250X2xpa2UnLCAnd3JvbmcnXTtcbiAgICB0b2dnbGVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgY29uc3QgY2hlY2tib3ggPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0W3ZhbHVlPVwiJHt2YWx1ZX1cIl1gKTtcbiAgICAgIGNvbnN0IGRldGFpbHNEaXYgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoYC5mZWVkYmFjay1kZXRhaWxzLWZpZWxkW2RhdGEtZm9yPVwiJHt2YWx1ZX1cIl1gKTtcbiAgICAgIGlmIChjaGVja2JveCAmJiBkZXRhaWxzRGl2KSB7XG4gICAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgICAgaWYgKGUudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGRldGFpbHNEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBkZXRhaWxzRGl2LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk/LmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRldGFpbHNEaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGNvbnN0IHRleHRhcmVhID0gZGV0YWlsc0Rpdi5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhKSB0ZXh0YXJlYS52YWx1ZSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0dXBBdXRvSGlkZVN1Y2Nlc3MoKSB7XG4gICAgY29uc3QgdGhhbmtzRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZlZWRiYWNrLXRoYW5rcycpO1xuICAgIGlmICh0aGFua3NEaXYgJiYgdGhhbmtzRGl2LnRleHRDb250ZW50LnRyaW0oKSA9PT0gJ1RoYW5rcyEnICYmICF0aGFua3NEaXYuZGF0YXNldC50cmFja2VkKSB7XG4gICAgICAvLyBUcmFjayBQb3N0SG9nIGV2ZW50IHdoZW4gc3VjY2VzcyBpcyBzaG93blxuICAgICAgdGhpcy50cmFja1Bvc3RIb2dGZWVkYmFjaygpO1xuICAgICAgXG4gICAgICAvLyBNYXJrIGFzIHRyYWNrZWQgdG8gcHJldmVudCBkb3VibGUtdHJhY2tpbmdcbiAgICAgIHRoYW5rc0Rpdi5kYXRhc2V0LnRyYWNrZWQgPSAndHJ1ZSc7XG4gICAgICBcbiAgICAgIC8vIEF1dG8taGlkZSBhZnRlciAzIHNlY29uZHNcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBSZXNldCB0aGUgZmVlZGJhY2sgc3VjY2VzcyBzdGF0ZVxuICAgICAgICB0aGlzLnB1c2hFdmVudFRvKFwiI3N1bW1hcnktbW9kYWxcIiwgXCJyZXNldF9mZWVkYmFja19zdWNjZXNzXCIsIHt9KTtcbiAgICAgIH0sIDMwMDApO1xuICAgIH1cbiAgfSxcblxuICB0cmFja1Bvc3RIb2dGZWVkYmFjaygpIHtcbiAgICBpZiAodHlwZW9mIHBvc3Rob2cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdW1tYXJ5LW1vZGFsJyk7XG4gICAgaWYgKCFtb2RhbCkgcmV0dXJuO1xuXG4gICAgY29uc3QgdGl0bGVUZXh0ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLnN1bW1hcnktbW9kYWwtdGl0bGUnKT8udGV4dENvbnRlbnQ/LnRyaW0oKSB8fCAnJztcbiAgICBjb25zdCByZWNvcmRJZCA9IG1vZGFsLmRhdGFzZXQucmVjb3JkSWQgfHwgJ1Vua25vd24nO1xuXG4gICAgLy8gUGFyc2UgY29udGV4dCBmcm9tIG1vZGFsIHRpdGxlIHN0cmluZ1xuICAgIGxldCBjb250ZW50X3R5cGUgPSB0aXRsZVRleHQ7XG4gICAgbGV0IGNoYXJhY3Rlcl9uYW1lID0gbnVsbDtcbiAgICBsZXQgcGxheV90aXRsZSA9IG51bGw7XG4gICAgbGV0IGxvY2F0aW9uID0gbnVsbDtcblxuICAgIGlmICh0aXRsZVRleHQuc3RhcnRzV2l0aCgnTW9kZXJuIFBhcmFwaHJhc2luZzogJykpIHtcbiAgICAgIGNvbnRlbnRfdHlwZSA9ICdQYXJhcGhyYXNpbmcnO1xuICAgICAgY2hhcmFjdGVyX25hbWUgPSB0aXRsZVRleHQucmVwbGFjZSgnTW9kZXJuIFBhcmFwaHJhc2luZzogJywgJycpLnRyaW0oKTtcbiAgICB9IGVsc2UgaWYgKHRpdGxlVGV4dC5zdGFydHNXaXRoKCdQbGF5IFN1bW1hcnk6ICcpKSB7XG4gICAgICBjb250ZW50X3R5cGUgPSAnUGxheSBTdW1tYXJ5JztcbiAgICAgIHBsYXlfdGl0bGUgPSB0aXRsZVRleHQucmVwbGFjZSgnUGxheSBTdW1tYXJ5OiAnLCAnJykudHJpbSgpO1xuICAgIH0gZWxzZSBpZiAodGl0bGVUZXh0LnN0YXJ0c1dpdGgoJ1NjZW5lIFN1bW1hcnk6ICcpKSB7XG4gICAgICBjb250ZW50X3R5cGUgPSAnU2NlbmUgU3VtbWFyeSc7XG4gICAgICBjb25zdCByZXN0ID0gdGl0bGVUZXh0LnJlcGxhY2UoJ1NjZW5lIFN1bW1hcnk6ICcsICcnKS50cmltKCk7XG4gICAgICBjb25zdCBkYXNoSWR4ID0gcmVzdC5pbmRleE9mKCcgLSAnKTtcbiAgICAgIGlmIChkYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICBwbGF5X3RpdGxlID0gcmVzdC5zdWJzdHJpbmcoMCwgZGFzaElkeCk7XG4gICAgICAgIGxvY2F0aW9uID0gcmVzdC5zdWJzdHJpbmcoZGFzaElkeCArIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheV90aXRsZSA9IHJlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvcGVydGllcyA9IHtcbiAgICAgIGNvbnRlbnRfdHlwZTogY29udGVudF90eXBlLFxuICAgICAgcmVjb3JkX2lkOiByZWNvcmRJZCxcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgfTtcblxuICAgIGlmIChjaGFyYWN0ZXJfbmFtZSkgcHJvcGVydGllcy5jaGFyYWN0ZXJfbmFtZSA9IGNoYXJhY3Rlcl9uYW1lO1xuICAgIGlmIChwbGF5X3RpdGxlKSBwcm9wZXJ0aWVzLnBsYXlfdGl0bGUgPSBwbGF5X3RpdGxlO1xuICAgIGlmIChsb2NhdGlvbikgcHJvcGVydGllcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuXG4gICAgcG9zdGhvZy5jYXB0dXJlKCdhaV9jb250ZW50X2ZlZWRiYWNrJywgcHJvcGVydGllcyk7XG4gIH0sXG5cbiAgLy8gTm8gbG9uZ2VyIG5lZWRlZCAtIFBvc3RIb2cgdHJhY2tpbmcgaGFwcGVucyBpbiB0cmFja1Bvc3RIb2dGZWVkYmFjaygpXG59XG5cbmxldCBjc3JmVG9rZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWV0YVtuYW1lPSdjc3JmLXRva2VuJ11cIikuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxubGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVNvY2tldChcIi9saXZlXCIsIFNvY2tldCwge1xuICBwYXJhbXM6IHtfY3NyZl90b2tlbjogY3NyZlRva2VufSxcbiAgaG9va3M6IEhvb2tzXG59KVxuXG4vLyBDYXB0dXJlIHNlYXJjaGVzIGZvciBQb3N0SG9nIGN1c3RvbSBldmVudFxubGV0IHNlYXJjaFRpbWVvdXQ7XG5cbi8vIEF0dGFjaCBldmVudCBsaXN0ZW5lciB0byB0aGUgc2VhcmNoIGlucHV0IGZvciBQb3N0SG9nIGN1c3RvbSBldmVudFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKCcuc2VhcmNoLWJveC1kZWZhdWx0JykpIHtcbiAgICBjb25zdCBzZWFyY2hRdWVyeSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBcbiAgICAvLyBDbGVhciB0aGUgcHJldmlvdXMgdGltZW91dFxuICAgIGNsZWFyVGltZW91dChzZWFyY2hUaW1lb3V0KTtcbiAgICBcbiAgICAvLyBTZXQgYSBuZXcgdGltZW91dCB0byBjYXB0dXJlIHRoZSBldmVudCBhZnRlciA1IHNlY29uZHMgb2YgaW5hY3Rpdml0eVxuICAgIHNlYXJjaFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgcG9zdGhvZy5jYXB0dXJlKCd1c2VkX3NlYXJjaCcsIHsgc2VhcmNoZWRfZm9yOiBzZWFyY2hRdWVyeSB9KTtcbiAgICB9LCA1MDAwKTtcbiAgfVxufSwgZmFsc2UpO1xuXG4vLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXIgdG8gdGhlIFBERiBsaW5rcyBmb3IgUG9zdEhvZyBjdXN0b20gZXZlbnRcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnLm1vbm9sb2d1ZS1wZGZsaW5rJykpIHtcbiAgICBjb25zdCBsaW5rRWxlbWVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCdhJyk7XG4gICAgaWYgKGxpbmtFbGVtZW50KSB7XG4gICAgICBjb25zdCBwZGZfdXJsID0gbGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICBcbiAgICAgIC8vIEdldCBtb25vbG9ndWUgY29udGV4dCBmcm9tIHRoZSByb3dcbiAgICAgIGNvbnN0IG1vbm9sb2d1ZVJvdyA9IGxpbmtFbGVtZW50LmNsb3Nlc3QoJ3RyJyk7XG4gICAgICBsZXQgbW9ub2xvZ3VlX2lkID0gbnVsbDtcbiAgICAgIGxldCBjaGFyYWN0ZXJfbmFtZSA9IG51bGw7XG4gICAgICBsZXQgcGxheV90aXRsZSA9IG51bGw7XG4gICAgICBcbiAgICAgIGlmIChtb25vbG9ndWVSb3cpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGdldCBtb25vbG9ndWUgSUQgZnJvbSBuZWFyYnkgc3VtbWFyeSBpY29uXG4gICAgICAgIGNvbnN0IHN1bW1hcnlJY29uID0gbW9ub2xvZ3VlUm93LnF1ZXJ5U2VsZWN0b3IoJy5zdW1tYXJ5LWljb25bcGh4LXZhbHVlLW1vbm9sb2d1ZS1pZF0nKTtcbiAgICAgICAgaWYgKHN1bW1hcnlJY29uKSB7XG4gICAgICAgICAgbW9ub2xvZ3VlX2lkID0gc3VtbWFyeUljb24uZ2V0QXR0cmlidXRlKCdwaHgtdmFsdWUtbW9ub2xvZ3VlLWlkJyk7XG4gICAgICAgICAgY2hhcmFjdGVyX25hbWUgPSBzdW1tYXJ5SWNvbi5nZXRBdHRyaWJ1dGUoJ3BoeC12YWx1ZS1jaGFyYWN0ZXInKTtcbiAgICAgICAgICBwbGF5X3RpdGxlID0gc3VtbWFyeUljb24uZ2V0QXR0cmlidXRlKCdwaHgtdmFsdWUtcGxheS10aXRsZScpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBGYWxsYmFjayB0byBleHRyYWN0aW5nIGZyb20gdGV4dCBjb250ZW50XG4gICAgICAgIGlmICghY2hhcmFjdGVyX25hbWUpIHtcbiAgICAgICAgICBjb25zdCBjaGFyYWN0ZXJFbGVtZW50ID0gbW9ub2xvZ3VlUm93LnF1ZXJ5U2VsZWN0b3IoJy5tb25vbG9ndWUtY2hhcmFjdGVyJyk7XG4gICAgICAgICAgY2hhcmFjdGVyX25hbWUgPSBjaGFyYWN0ZXJFbGVtZW50ID8gY2hhcmFjdGVyRWxlbWVudC50ZXh0Q29udGVudC50cmltKCkgOiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoIXBsYXlfdGl0bGUpIHtcbiAgICAgICAgICBjb25zdCBwbGF5RWxlbWVudCA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcubW9ub2xvZ3VlLXBsYXluYW1lJyk7XG4gICAgICAgICAgcGxheV90aXRsZSA9IHBsYXlFbGVtZW50ID8gcGxheUVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpIDogbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBsb2NhdGlvbiA9IG1vbm9sb2d1ZVJvdyA/IG1vbm9sb2d1ZVJvdy5kYXRhc2V0LmxvY2F0aW9uIDogbnVsbDtcbiAgICAgIGNvbnN0IGZpcnN0X2xpbmUgPSBtb25vbG9ndWVSb3cgPyBtb25vbG9ndWVSb3cuZGF0YXNldC5maXJzdGxpbmUgOiBudWxsO1xuXG4gICAgICBwb3N0aG9nLmNhcHR1cmUoJ3BkZl9jbGlja2VkJywge1xuICAgICAgICBwZGZfdXJsOiBwZGZfdXJsLFxuICAgICAgICBtb25vbG9ndWVfaWQ6IG1vbm9sb2d1ZV9pZCxcbiAgICAgICAgY2hhcmFjdGVyX25hbWU6IGNoYXJhY3Rlcl9uYW1lLFxuICAgICAgICBwbGF5X3RpdGxlOiBwbGF5X3RpdGxlLFxuICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICAgIGZpcnN0X2xpbmU6IGZpcnN0X2xpbmVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSwgZmFsc2UpO1xuXG4vLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXIgdG8gbW9ub2xvZ3VlIGZpcnN0IGxpbmUgY2xpY2tzIGZvciBQb3N0SG9nIGN1c3RvbSBldmVudFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKCcubW9ub2xvZ3VlLWZpcnN0bGluZS10YWJsZScpIHx8IFxuICAgICAgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5tb25vbG9ndWUtZmlyc3RsaW5lLXRhYmxlJykpIHtcbiAgICBjb25zdCBmaXJzdExpbmVFbGVtZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5tb25vbG9ndWUtZmlyc3RsaW5lLXRhYmxlJykgfHwgZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IHRhcmdldElkID0gZmlyc3RMaW5lRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgY29uc3QgY29sbGFwc2VFbGVtZW50ID0gdGFyZ2V0SWQgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldElkKSA6IG51bGw7XG4gICAgXG4gICAgLy8gRGV0ZXJtaW5lIGlmIHRoaXMgaXMgZXhwYW5kaW5nIG9yIGNvbGxhcHNpbmdcbiAgICBjb25zdCBpc0V4cGFuZGluZyA9IGNvbGxhcHNlRWxlbWVudCAmJiAhY29sbGFwc2VFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpO1xuICAgIFxuICAgIGlmIChpc0V4cGFuZGluZykge1xuICAgICAgLy8gR2V0IG1vbm9sb2d1ZSBkZXRhaWxzIGZyb20gdGhlIHJvdyBjb250ZXh0XG4gICAgICBjb25zdCBtb25vbG9ndWVSb3cgPSBmaXJzdExpbmVFbGVtZW50LmNsb3Nlc3QoJ3RyJyk7XG4gICAgICBsZXQgbW9ub2xvZ3VlX2lkID0gbnVsbDtcbiAgICAgIGxldCBjaGFyYWN0ZXJfbmFtZSA9IG51bGw7XG4gICAgICBsZXQgcGxheV90aXRsZSA9IG51bGw7XG4gICAgICBcbiAgICAgIGlmIChtb25vbG9ndWVSb3cpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBjaGFyYWN0ZXIgbmFtZSBmcm9tIHRoZSBjaGFyYWN0ZXIgc3BhblxuICAgICAgICBjb25zdCBjaGFyYWN0ZXJFbGVtZW50ID0gbW9ub2xvZ3VlUm93LnF1ZXJ5U2VsZWN0b3IoJy5tb25vbG9ndWUtY2hhcmFjdGVyJyk7XG4gICAgICAgIGNoYXJhY3Rlcl9uYW1lID0gY2hhcmFjdGVyRWxlbWVudCA/IGNoYXJhY3RlckVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpIDogbnVsbDtcbiAgICAgICAgXG4gICAgICAgIC8vIEV4dHJhY3QgcGxheSB0aXRsZSBmcm9tIHRoZSBwbGF5IG5hbWUgc3BhblxuICAgICAgICBjb25zdCBwbGF5RWxlbWVudCA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcubW9ub2xvZ3VlLXBsYXluYW1lJyk7XG4gICAgICAgIHBsYXlfdGl0bGUgPSBwbGF5RWxlbWVudCA/IHBsYXlFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKSA6IG51bGw7XG4gICAgICAgIFxuICAgICAgICAvLyBUcnkgdG8gZ2V0IG1vbm9sb2d1ZSBJRCBmcm9tIG5lYXJieSBzdW1tYXJ5IGljb24gaWYgcHJlc2VudFxuICAgICAgICBjb25zdCBzdW1tYXJ5SWNvbiA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcuc3VtbWFyeS1pY29uW3BoeC12YWx1ZS1tb25vbG9ndWUtaWRdJyk7XG4gICAgICAgIGlmIChzdW1tYXJ5SWNvbikge1xuICAgICAgICAgIG1vbm9sb2d1ZV9pZCA9IHN1bW1hcnlJY29uLmdldEF0dHJpYnV0ZSgncGh4LXZhbHVlLW1vbm9sb2d1ZS1pZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnN0IGxvY2F0aW9uID0gbW9ub2xvZ3VlUm93ID8gbW9ub2xvZ3VlUm93LmRhdGFzZXQubG9jYXRpb24gOiBudWxsO1xuICAgICAgY29uc3QgZmlyc3RfbGluZSA9IG1vbm9sb2d1ZVJvdyA/IG1vbm9sb2d1ZVJvdy5kYXRhc2V0LmZpcnN0bGluZSA6IG51bGw7XG5cbiAgICAgIHBvc3Rob2cuY2FwdHVyZSgnbW9ub2xvZ3VlX2V4cGFuZGVkJywge1xuICAgICAgICBtb25vbG9ndWVfaWQ6IG1vbm9sb2d1ZV9pZCxcbiAgICAgICAgY2hhcmFjdGVyX25hbWU6IGNoYXJhY3Rlcl9uYW1lLFxuICAgICAgICBwbGF5X3RpdGxlOiBwbGF5X3RpdGxlLFxuICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICAgIGZpcnN0X2xpbmU6IGZpcnN0X2xpbmVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSwgZmFsc2UpO1xuXG4vLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXIgdG8gc3VtbWFyeS9wYXJhcGhyYXNpbmcgaWNvbiBjbGlja3MgZm9yIFBvc3RIb2cgY3VzdG9tIGV2ZW50XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoJy5zdW1tYXJ5LWljb24nKSB8fCBcbiAgICAgIGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuc3VtbWFyeS1pY29uJykpIHtcbiAgICBjb25zdCBzdW1tYXJ5SWNvbiA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuc3VtbWFyeS1pY29uJykgfHwgZXZlbnQudGFyZ2V0O1xuICAgIFxuICAgIC8vIEdldCBkZXRhaWxzIGZyb20gdGhlIGF0dHJpYnV0ZXNcbiAgICBjb25zdCBtb25vbG9ndWVfaWQgPSBzdW1tYXJ5SWNvbi5nZXRBdHRyaWJ1dGUoJ3BoeC12YWx1ZS1tb25vbG9ndWUtaWQnKTtcbiAgICBjb25zdCBjaGFyYWN0ZXJfbmFtZSA9IHN1bW1hcnlJY29uLmdldEF0dHJpYnV0ZSgncGh4LXZhbHVlLWNoYXJhY3RlcicpO1xuICAgIGNvbnN0IHBsYXlfdGl0bGUgPSBzdW1tYXJ5SWNvbi5nZXRBdHRyaWJ1dGUoJ3BoeC12YWx1ZS1wbGF5LXRpdGxlJyk7XG4gICAgY29uc3QgbG9jYXRpb24gPSBzdW1tYXJ5SWNvbi5nZXRBdHRyaWJ1dGUoJ3BoeC12YWx1ZS1sb2NhdGlvbicpO1xuICAgIFxuICAgIC8vIERldGVybWluZSByZXF1ZXN0IHR5cGUgdXNpbmcgcGh4LWNsaWNrIGF0dHJpYnV0ZSAocmVsaWFibGUsIG5vdCBET00tc3RydWN0dXJlIGRlcGVuZGVudClcbiAgICBjb25zdCBwaHhDbGljayA9IHN1bW1hcnlJY29uLmdldEF0dHJpYnV0ZSgncGh4LWNsaWNrJyk7XG4gICAgY29uc3QgbW9ub2xvZ3VlUm93ID0gc3VtbWFyeUljb24uY2xvc2VzdCgndHInKTtcbiAgICBsZXQgZXZlbnRfbmFtZSA9ICdwYXJhcGhyYXNpbmdfcmVxdWVzdGVkJzsgLy8gZGVmYXVsdFxuICAgIGxldCBwcm9wZXJ0aWVzID0ge1xuICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICB9O1xuXG4gICAgaWYgKHBoeENsaWNrID09PSAnc2hvd19wbGF5X3N1bW1hcnknKSB7XG4gICAgICBldmVudF9uYW1lID0gJ3BsYXlfc3VtbWFyeV9yZXF1ZXN0ZWQnO1xuICAgICAgcHJvcGVydGllcy5wbGF5X3RpdGxlID0gcGxheV90aXRsZTtcbiAgICB9IGVsc2UgaWYgKHBoeENsaWNrID09PSAnc2hvd19zY2VuZV9zdW1tYXJ5Jykge1xuICAgICAgZXZlbnRfbmFtZSA9ICdzY2VuZV9zdW1tYXJ5X3JlcXVlc3RlZCc7XG4gICAgICBwcm9wZXJ0aWVzLnBsYXlfdGl0bGUgPSBwbGF5X3RpdGxlO1xuICAgICAgcHJvcGVydGllcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzaG93X3BhcmFwaHJhc2luZ1xuICAgICAgZXZlbnRfbmFtZSA9ICdwYXJhcGhyYXNpbmdfcmVxdWVzdGVkJztcbiAgICAgIHByb3BlcnRpZXMubW9ub2xvZ3VlX2lkID0gbW9ub2xvZ3VlX2lkO1xuICAgICAgcHJvcGVydGllcy5jaGFyYWN0ZXJfbmFtZSA9IGNoYXJhY3Rlcl9uYW1lO1xuXG4gICAgICAvLyBwbGF5X3RpdGxlIG5vdCBvbiBwYXJhcGhyYXNpbmcgaWNvbiBhdHRycyBcdTIwMTQgZ2V0IGZyb20gRE9NXG4gICAgICBsZXQgcmVzb2x2ZWRfcGxheV90aXRsZSA9IHBsYXlfdGl0bGU7XG4gICAgICBpZiAoIXJlc29sdmVkX3BsYXlfdGl0bGUgJiYgbW9ub2xvZ3VlUm93KSB7XG4gICAgICAgIGNvbnN0IHBsYXlFbCA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcubW9ub2xvZ3VlLXBsYXluYW1lJyk7XG4gICAgICAgIHJlc29sdmVkX3BsYXlfdGl0bGUgPSBwbGF5RWwgPyBwbGF5RWwudGV4dENvbnRlbnQudHJpbSgpIDogbnVsbDtcbiAgICAgIH1cbiAgICAgIHByb3BlcnRpZXMucGxheV90aXRsZSA9IHJlc29sdmVkX3BsYXlfdGl0bGU7XG5cbiAgICAgIGlmIChtb25vbG9ndWVSb3cpIHtcbiAgICAgICAgcHJvcGVydGllcy5sb2NhdGlvbiA9IG1vbm9sb2d1ZVJvdy5kYXRhc2V0LmxvY2F0aW9uIHx8IG51bGw7XG5cbiAgICAgICAgY29uc3QgZmlyc3RMaW5lRWxlbWVudCA9IG1vbm9sb2d1ZVJvdy5xdWVyeVNlbGVjdG9yKCcubW9ub2xvZ3VlLWZpcnN0bGluZS10YWJsZScpO1xuICAgICAgICBpZiAoZmlyc3RMaW5lRWxlbWVudCkge1xuICAgICAgICAgIHByb3BlcnRpZXMuZmlyc3RfbGluZSA9IGZpcnN0TGluZUVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpLnJlcGxhY2UoJ1x1MjFCNCcsICcnKS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcG9zdGhvZy5jYXB0dXJlKGV2ZW50X25hbWUsIHByb3BlcnRpZXMpO1xuICB9XG59LCBmYWxzZSk7XG5cbi8vIEF0dGFjaCBldmVudCBsaXN0ZW5lciB0byBwbGF5IG5hbWUgbGluayBjbGlja3MgZm9yIFBvc3RIb2cgY3VzdG9tIGV2ZW50XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoJy5tb25vbG9ndWUtcGxheW5hbWUgYScpIHx8IFxuICAgICAgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5tb25vbG9ndWUtcGxheW5hbWUnKSkge1xuICAgIGNvbnN0IHBsYXlFbGVtZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5tb25vbG9ndWUtcGxheW5hbWUnKSB8fCBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgbGlua0VsZW1lbnQgPSBwbGF5RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhJykgfHwgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2EnKTtcbiAgICBcbiAgICBpZiAobGlua0VsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGhyZWYgPSBsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgIGNvbnN0IHBsYXlfdGl0bGUgPSBsaW5rRWxlbWVudC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICBcbiAgICAgIC8vIEV4dHJhY3QgcGxheV9pZCBhbmQgc2VjdGlvbiBmcm9tIHRoZSBocmVmXG4gICAgICBsZXQgcGxheV9pZCA9IG51bGw7XG4gICAgICBsZXQgc2VjdGlvbiA9ICdnZW5lcmFsJztcbiAgICAgIFxuICAgICAgaWYgKGhyZWYpIHtcbiAgICAgICAgaWYgKGhyZWYuaW5jbHVkZXMoJy9tZW4vJykpIHtcbiAgICAgICAgICBzZWN0aW9uID0gJ21lbic7XG4gICAgICAgICAgcGxheV9pZCA9IGhyZWYuc3BsaXQoJy9tZW4vJylbMV07XG4gICAgICAgIH0gZWxzZSBpZiAoaHJlZi5pbmNsdWRlcygnL3dvbWVuLycpKSB7XG4gICAgICAgICAgc2VjdGlvbiA9ICd3b21lbic7XG4gICAgICAgICAgcGxheV9pZCA9IGhyZWYuc3BsaXQoJy93b21lbi8nKVsxXTtcbiAgICAgICAgfSBlbHNlIGlmIChocmVmLmluY2x1ZGVzKCcvcGxheS8nKSkge1xuICAgICAgICAgIHNlY3Rpb24gPSAnZ2VuZXJhbCc7XG4gICAgICAgICAgcGxheV9pZCA9IGhyZWYuc3BsaXQoJy9wbGF5LycpWzFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIEdldCBjb250ZXh0IGZyb20gdGhlIHBhZ2VcbiAgICAgIGxldCBzb3VyY2VfY29udGV4dCA9ICd1bmtub3duJztcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWJveC1kZWZhdWx0JykpIHtcbiAgICAgICAgc291cmNlX2NvbnRleHQgPSAnc2VhcmNoX3Jlc3VsdHMnO1xuICAgICAgfSBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9wbGF5cycpKSB7XG4gICAgICAgIHNvdXJjZV9jb250ZXh0ID0gJ3BsYXlzX2xpc3RpbmcnO1xuICAgICAgfVxuICAgICAgXG4gICAgICBwb3N0aG9nLmNhcHR1cmUoJ3BsYXlfc2VsZWN0ZWQnLCB7XG4gICAgICAgIHBsYXlfaWQ6IHBsYXlfaWQsXG4gICAgICAgIHBsYXlfdGl0bGU6IHBsYXlfdGl0bGUsXG4gICAgICAgIHNlY3Rpb246IHNlY3Rpb24sXG4gICAgICAgIHNvdXJjZV9jb250ZXh0OiBzb3VyY2VfY29udGV4dFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59LCBmYWxzZSk7XG5cbi8vIEF0dGFjaCBldmVudCBsaXN0ZW5lciB0byBzZWN0aW9uIG5hdmlnYXRpb24gY2xpY2tzIGZvciBQb3N0SG9nIGN1c3RvbSBldmVudFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgY29uc3QgbGlua0VsZW1lbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnYScpO1xuICBpZiAobGlua0VsZW1lbnQpIHtcbiAgICBjb25zdCBocmVmID0gbGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIHNlY3Rpb24gbmF2aWdhdGlvbiBsaW5rXG4gICAgaWYgKGhyZWYgPT09ICcvbWVucycgfHwgaHJlZiA9PT0gJy93b21lbnMnIHx8IGhyZWYgPT09ICcvcGxheXMnKSB7XG4gICAgICBsZXQgc2VjdGlvbl9zZWxlY3RlZCA9ICcnO1xuICAgICAgbGV0IGN1cnJlbnRfc2VjdGlvbiA9ICd1bmtub3duJztcbiAgICAgIFxuICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNlY3Rpb24gd2FzIHNlbGVjdGVkXG4gICAgICBpZiAoaHJlZiA9PT0gJy9tZW5zJykge1xuICAgICAgICBzZWN0aW9uX3NlbGVjdGVkID0gJ21lbic7XG4gICAgICB9IGVsc2UgaWYgKGhyZWYgPT09ICcvd29tZW5zJykge1xuICAgICAgICBzZWN0aW9uX3NlbGVjdGVkID0gJ3dvbWVuJztcbiAgICAgIH0gZWxzZSBpZiAoaHJlZiA9PT0gJy9wbGF5cycpIHtcbiAgICAgICAgc2VjdGlvbl9zZWxlY3RlZCA9ICdhbGwnO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBEZXRlcm1pbmUgY3VycmVudCBzZWN0aW9uIGZyb20gVVJMXG4gICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgIGlmIChjdXJyZW50UGF0aC5pbmNsdWRlcygnL21lbnMnKSB8fCBjdXJyZW50UGF0aC5pbmNsdWRlcygnL21lbi8nKSkge1xuICAgICAgICBjdXJyZW50X3NlY3Rpb24gPSAnbWVuJztcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudFBhdGguaW5jbHVkZXMoJy93b21lbnMnKSB8fCBjdXJyZW50UGF0aC5pbmNsdWRlcygnL3dvbWVuLycpKSB7XG4gICAgICAgIGN1cnJlbnRfc2VjdGlvbiA9ICd3b21lbic7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRQYXRoLmluY2x1ZGVzKCcvcGxheXMnKSB8fCBjdXJyZW50UGF0aC5pbmNsdWRlcygnL3BsYXkvJykpIHtcbiAgICAgICAgY3VycmVudF9zZWN0aW9uID0gJ2FsbCc7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRQYXRoLmluY2x1ZGVzKCcvc2VhcmNoJykpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBhIGdlbmRlcmVkIHNlYXJjaCBwYWdlXG4gICAgICAgIGlmIChjdXJyZW50UGF0aC5pbmNsdWRlcygnbWVuJykpIHtcbiAgICAgICAgICBjdXJyZW50X3NlY3Rpb24gPSAnbWVuJztcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50UGF0aC5pbmNsdWRlcygnd29tZW4nKSkge1xuICAgICAgICAgIGN1cnJlbnRfc2VjdGlvbiA9ICd3b21lbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudF9zZWN0aW9uID0gJ2FsbCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gT25seSB0cmFjayBpZiB0aGV5J3JlIGFjdHVhbGx5IHN3aXRjaGluZyBzZWN0aW9uc1xuICAgICAgaWYgKHNlY3Rpb25fc2VsZWN0ZWQgIT09IGN1cnJlbnRfc2VjdGlvbikge1xuICAgICAgICBwb3N0aG9nLmNhcHR1cmUoJ3NlY3Rpb25fZmlsdGVyZWQnLCB7XG4gICAgICAgICAgc2VjdGlvbl9zZWxlY3RlZDogc2VjdGlvbl9zZWxlY3RlZCxcbiAgICAgICAgICBwcmV2aW91c19zZWN0aW9uOiBjdXJyZW50X3NlY3Rpb24sXG4gICAgICAgICAgc291cmNlX3BhZ2U6IGN1cnJlbnRQYXRoXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSwgZmFsc2UpO1xuXG4vLyBLby1maSBXaWRnZXRfMi5qcyBpbXBsZW1lbnRhdGlvbiB3aXRoIGdldEhUTUwoKSBtZXRob2QgLSBESVNBQkxFRCBmb3IgY3VzdG9tIGltcGxlbWVudGF0aW9uXG4vKlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAvLyBMb2FkIEtvLWZpIFdpZGdldF8yLmpzIHNjcmlwdFxuICBjb25zdCBrb2ZpU2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIGtvZmlTY3JpcHQuc3JjID0gJ2h0dHBzOi8vc3RvcmFnZS5rby1maS5jb20vY2RuL3dpZGdldC9XaWRnZXRfMi5qcyc7XG4gIGtvZmlTY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgaW5pdGlhbGl6ZUtvZmlCdXR0b25zKCk7XG4gIH07XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoa29maVNjcmlwdCk7XG4gIFxuICAvLyBLby1maSBidXR0b24gY2xpY2sgdHJhY2tpbmcgZm9yIFBvc3RIb2cgYW5hbHl0aWNzXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5rb2ZpLWJ1dHRvbiwgYVtocmVmKj1cImtvLWZpLmNvbVwiXScpKSB7XG4gICAgICBwb3N0aG9nLmNhcHR1cmUoJ2NsaWNrZWRfdGlwamFyJyk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUtvZmlCdXR0b25zKCkge1xuICAvLyBJbml0aWFsaXplIEtvLWZpIHdpZGdldCBvbmNlIHdpdGggc2V0dGluZ3NcbiAgaWYgKHR5cGVvZiBrb2Zpd2lkZ2V0MiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBrb2Zpd2lkZ2V0Mi5pbml0KCdUaXAgSmFyJywgJyNFOEU4QzgnLCAnQzBDNzFLTEU4NScpO1xuICAgIFxuICAgIC8vIEluc2VydCBLby1maSBidXR0b25zIGludG8gbXVsdGlwbGUgbG9jYXRpb25zIHVzaW5nIGdldEhUTUwoKVxuICAgIGNvbnN0IGxvY2F0aW9ucyA9IFsna29maS1sZWZ0LW1lbnUnLCAna29maS1jZW50ZXItZm9vdGVyJywgJ2tvZmktcmlnaHQtc2lkZWJhciddO1xuICAgIFxuICAgIGxvY2F0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGNvbnRhaW5lcklkKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCk7XG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBrb2Zpd2lkZ2V0Mi5nZXRIVE1MKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdLby1maSBidXR0b24gaW5zZXJ0ZWQgaW50bzonLCBjb250YWluZXJJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnS28tZmkgY29udGFpbmVyIG5vdCBmb3VuZDonLCBjb250YWluZXJJZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ2tvZml3aWRnZXQyIG5vdCBhdmFpbGFibGUnKTtcbiAgfVxufVxuKi9cblxuLy8gQ3VzdG9tIEtvLWZpIGJ1dHRvbiBjbGljayB0cmFja2luZyBmb3IgUG9zdEhvZyBhbmFseXRpY3MgLSBEaXJlY3QgTGluayBWZXJzaW9uXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gIC8vIFBvc3RIb2cgdHJhY2tpbmcgZm9yIEtvLWZpIGNsaWNrcyAobm93IGRpcmVjdCBsaW5rcyBvbmx5KVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCdhW2hyZWYqPVwia28tZmkuY29tXCJdJykgfHwgXG4gICAgICAgIGV2ZW50LnRhcmdldC5jbG9zZXN0KCcja29maS1sZWZ0LWRpcmVjdC1idG4nKSB8fFxuICAgICAgICBldmVudC50YXJnZXQuY2xvc2VzdCgnI2tvZmktZm9vdGVyLWRpcmVjdC1idG4nKSB8fFxuICAgICAgICBldmVudC50YXJnZXQuY2xvc2VzdCgnI2tvZmktZGlyZWN0LWJ0bicpKSB7XG4gICAgICBwb3N0aG9nLmNhcHR1cmUoJ2NsaWNrZWRfdGlwamFyJyk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KTtcblxuLy8gQWxzbyBpbml0aWFsaXplIEtvLWZpIGJ1dHRvbnMgb24gTGl2ZVZpZXcgbmF2aWdhdGlvbiAtIERJU0FCTEVEIGZvciBjdXN0b20gaW1wbGVtZW50YXRpb25cbi8qXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCAoKSA9PiB7XG4gIC8vIFdhaXQgYSBiaXQgZm9yIHRoZSBET00gdG8gYmUgcmVhZHksIHRoZW4gaW5pdGlhbGl6ZSBLby1maSBidXR0b25zXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiBrb2Zpd2lkZ2V0MiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGluaXRpYWxpemVLb2ZpQnV0dG9ucygpO1xuICAgIH1cbiAgfSwgMTAwKTtcbn0pO1xuKi9cblxuLy8gSGFuZGxlIFBvc3RIb2cgZXZlbnRzIHB1c2hlZCBmcm9tIEVsaXhpciBMaXZlVmlld1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cG9zdGhvZ19jYXB0dXJlXCIsIChlKSA9PiB7XG4gIGlmICh0eXBlb2YgcG9zdGhvZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBwb3N0aG9nLmNhcHR1cmUoZS5kZXRhaWwuZXZlbnQsIGUuZGV0YWlsLnByb3BlcnRpZXMpO1xuICB9XG59KTtcblxuLy8gQ2xpY2sgdGhlIFBvc3RIb2cgd2lkZ2V0J3MgXCJPcGVuIGNoYXRcIiBidXR0b24gdG8gZXhwYW5kIHRoZSBwYW5lbFxuZnVuY3Rpb24gY2xpY2tPcGVuQ2hhdCgpIHtcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwaC1jb252ZXJzYXRpb25zLXdpZGdldC1jb250YWluZXInKTtcbiAgaWYgKCFjb250YWluZXIpIHJldHVybiBmYWxzZTtcbiAgdmFyIGJ0biA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b25bYXJpYS1sYWJlbD1cIk9wZW4gY2hhdFwiXScpO1xuICBpZiAoYnRuKSB7XG4gICAgYnRuLmNsaWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBPcGVuIHN1cHBvcnQgd2lkZ2V0IChjYWxsZWQgYnkgRkFRIHBhZ2UgbGlua3MgYW5kIGF1dG8tb3BlbiBiZWxvdylcbndpbmRvdy5vcGVuU3VwcG9ydFdpZGdldCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoY2xpY2tPcGVuQ2hhdCgpKSByZXR1cm4gZmFsc2U7IC8vIHBhbmVsIG9wZW5lZCwgcHJldmVudCBsaW5rIG5hdmlnYXRpb25cbiAgLy8gUG9zdEhvZyBub3QgYXZhaWxhYmxlIFx1MjAxNCBzaG93IGNvb2tpZS1jaGF0LW1vZGFsIGlmIHVzZXIgaGFzbid0IGNvbnNlbnRlZFxuICB2YXIgY2hhdE1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb2tpZS1jaGF0LW1vZGFsJyk7XG4gIGlmIChjaGF0TW9kYWwgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvbnNlbnRfY2hvaWNlJykgIT09ICdncmFudGVkJykge1xuICAgIGNoYXRNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gRmFsbGJhY2s6IGxldCB0aGUgaHJlZiBuYXZpZ2F0ZSAocmVsb2FkcyBwYWdlIHdpdGggP2NvbnRhY3Q9dHJ1ZSlcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyBBdXRvLW9wZW4gUG9zdEhvZyBjb252ZXJzYXRpb25zIHdpZGdldCB3aGVuIGFycml2aW5nIGZyb20gXCJDb250YWN0XCIgZm9vdGVyIGxpbmsgb3IgcmVkaXJlY3RcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgaWYgKHVybFBhcmFtcy5nZXQoJ2NvbnRhY3QnKSA9PT0gJ3RydWUnKSB7XG4gICAgY29uc3QgbWF4QXR0ZW1wdHMgPSA0MDtcbiAgICBsZXQgYXR0ZW1wdHMgPSAwO1xuICAgIGNvbnN0IHRyeU9wZW4gPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGF0dGVtcHRzKys7XG4gICAgICBpZiAoY2xpY2tPcGVuQ2hhdCgpKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodHJ5T3Blbik7XG4gICAgICAgIC8vIENsZWFuIHVwIHRoZSBVUkwgcGFyYW1ldGVyXG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uKTtcbiAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5kZWxldGUoJ2NvbnRhY3QnKTtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCAnJywgdXJsKTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0ZW1wdHMgPj0gbWF4QXR0ZW1wdHMpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0cnlPcGVuKTtcbiAgICAgIH1cbiAgICB9LCAyNTApO1xuICB9XG59KTtcblxuXG4vLyBUcmlnZ2VyIGZvciBQb3N0SG9nIHN1cnZleXM6XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHN1cnZleUgxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1cnZleS1oMScpO1xuICAgIGlmIChzdXJ2ZXlIMSkge1xuICAgICAgc3VydmV5SDEuY2xhc3NMaXN0LmFkZCgnZGVsYXllZC1zdXJ2ZXknKTtcbiAgICB9XG4gIH0sIDEyMDAwMCk7IC8vIDIgbWludXRlc1xufSk7XG5cblxuLy8gU2hvdyBwcm9ncmVzcyBiYXIgb24gbGl2ZSBuYXZpZ2F0aW9uIGFuZCBmb3JtIHN1Ym1pdHMsIGlmIHN0aWxsIGxvYWRpbmcgYWZ0ZXIgNTAwbXNcbnRvcGJhci5jb25maWcoe2JhckNvbG9yczogezA6IFwiIzI5ZFwifSwgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAwLCAwLCAuMylcIn0pXG5sZXQgdG9wQmFyU2NoZWR1bGVkID0gdW5kZWZpbmVkXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCAoKSA9PiB7XG4gIGlmKCF0b3BCYXJTY2hlZHVsZWQpIHtcbiAgICB0b3BCYXJTY2hlZHVsZWQgPSBzZXRUaW1lb3V0KCgpID0+IHRvcGJhci5zaG93KCksIDUwMClcbiAgfVxufSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgKCkgPT4ge1xuICBjbGVhclRpbWVvdXQodG9wQmFyU2NoZWR1bGVkKVxuICB0b3BCYXJTY2hlZHVsZWQgPSB1bmRlZmluZWRcbiAgdG9wYmFyLmhpZGUoKVxufSlcblxuLy8gQWRibG9ja2VyIGRldGVjdGlvblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkYmxvY2stb3ZlcmxheScpO1xuICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2FkYmxvY2tfZGlzbWlzc2VkJykpIHJldHVybjtcblxuICBmdW5jdGlvbiBzaG93QWRibG9ja01vZGFsKCkge1xuICAgIG92ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgfVxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgZmV0Y2goJ2h0dHBzOi8vcGFnZWFkMi5nb29nbGVzeW5kaWNhdGlvbi5jb20vcGFnZWFkL2pzL2Fkc2J5Z29vZ2xlLmpzJywge1xuICAgICAgbW9kZTogJ25vLWNvcnMnLFxuICAgICAgY2FjaGU6ICduby1zdG9yZSdcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vIEdlbnVpbmUgY3Jvc3Mtb3JpZ2luIG5vLWNvcnMgZmV0Y2ggcmV0dXJucyB0eXBlICdvcGFxdWUnLlxuICAgICAgLy8gVHlwZSAnYmFzaWMnIG1lYW5zIFVCTyBMaXRlIGludGVyY2VwdGVkIGFuZCByZWRpcmVjdGVkIHRvIGFuIGVtcHR5IHJlc3BvbnNlLlxuICAgICAgaWYgKHIudHlwZSA9PT0gJ2Jhc2ljJykge1xuICAgICAgICBzaG93QWRibG9ja01vZGFsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIEZhbGxiYWNrOiBDU1MgcHJvYmUgZm9yIGNvc21ldGljLWJsb2NraW5nIGFkYmxvY2tlcnNcbiAgICAgIGNvbnN0IHByb2JlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkYmxvY2stcHJvYmUnKTtcbiAgICAgIGNvbnN0IGNzc0Jsb2NrZWQgPSAhcHJvYmUgfHxcbiAgICAgICAgcHJvYmUub2Zmc2V0SGVpZ2h0ID09PSAwIHx8XG4gICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHByb2JlKS5kaXNwbGF5ID09PSAnbm9uZSc7XG4gICAgICBpZiAoY3NzQmxvY2tlZCkgc2hvd0FkYmxvY2tNb2RhbCgpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgLy8gSGFyZCBuZXR3b3JrIGJsb2NrIChzb21lIGFkYmxvY2tlcnMgZG8gY2F1c2UgYSBuZXR3b3JrIGVycm9yKVxuICAgICAgc2hvd0FkYmxvY2tNb2RhbCgpO1xuICAgIH0pO1xuICB9LCA1MDAwKTtcblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRibG9jay1kaXNtaXNzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhZGJsb2NrX2Rpc21pc3NlZCcsICcxJyk7XG4gICAgb3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9KTtcbn0pO1xuXG4vLyBDb29raWUtZ2F0ZWQgY2hhdCBpY29uIChzaG93biB3aGVuIFBvc3RIb2cgY29udmVyc2F0aW9ucyB3aWRnZXQgaXMgdW5hdmFpbGFibGUpXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGNoYXRJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb2tpZS1jaGF0LWljb24nKTtcbiAgY29uc3QgY2hhdE1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb2tpZS1jaGF0LW1vZGFsJyk7XG4gIGlmICghY2hhdEljb24gfHwgIWNoYXRNb2RhbCkgcmV0dXJuO1xuXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY29uc2VudF9jaG9pY2UnKSAhPT0gJ2dyYW50ZWQnKSB7XG4gICAgY2hhdEljb24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH1cblxuICBjaGF0SWNvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGNoYXRNb2RhbC5zdHlsZS5kaXNwbGF5ID0gY2hhdE1vZGFsLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyA/ICdibG9jaycgOiAnbm9uZSc7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29raWUtY2hhdC1tb2RhbC1jbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgY2hhdE1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29raWUtY2hhdC1hY2NlcHQtZnJvbS1tb2RhbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgY2hhdE1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgY2hhdEljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBEZWxlZ2F0ZSB0byB0aGUgbWFpbiBjb25zZW50IGFjY2VwdCBidXR0b24gc28gd2UgZG9uJ3QgZHVwbGljYXRlIHRoZSBpbml0IGxvZ2ljXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnNlbnQtYWNjZXB0JykuY2xpY2soKTtcbiAgfSk7XG59KTtcblxuLy8gQ29uc2VudCBiYW5uZXJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgYmFubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnNlbnQtYmFubmVyJyk7XG4gIGlmICghYmFubmVyKSByZXR1cm47XG5cbiAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY29uc2VudF9jaG9pY2UnKSkge1xuICAgIGJhbm5lci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25zZW50LWFjY2VwdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NvbnNlbnRfY2hvaWNlJywgJ2dyYW50ZWQnKTtcbiAgICBndGFnKCdjb25zZW50JywgJ3VwZGF0ZScsIHtcbiAgICAgICdhZF9zdG9yYWdlJzogJ2dyYW50ZWQnLFxuICAgICAgJ2FkX3VzZXJfZGF0YSc6ICdncmFudGVkJyxcbiAgICAgICdhZF9wZXJzb25hbGl6YXRpb24nOiAnZ3JhbnRlZCcsXG4gICAgICAnYW5hbHl0aWNzX3N0b3JhZ2UnOiAnZ3JhbnRlZCdcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIHBvc3Rob2cgIT09ICd1bmRlZmluZWQnICYmICFwb3N0aG9nLl9fbG9hZGVkKSB7XG4gICAgICAgIHBvc3Rob2cuaW5pdCgncGhjXzZhWUxwa3FRc21ZSmFuWXNlSjhTSmNPTWljb21DeGo5djlQbDZoblpRUzMnLCB7XG4gICAgICAgICAgICBhcGlfaG9zdDogJ2h0dHBzOi8vYXV0b2x5Y3VzLnNoYWtlc3BlYXJlLW1vbm9sb2d1ZXMub3JnJyxcbiAgICAgICAgICAgIHVpX2hvc3Q6ICdodHRwczovL3VzLnBvc3Rob2cuY29tJyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiAnMjAyNi0wMS0zMCcsXG4gICAgICAgICAgICBwZXJzb25fcHJvZmlsZXM6ICdpZGVudGlmaWVkX29ubHknLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYmFubmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25zZW50LWRlY2xpbmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjb25zZW50X2Nob2ljZScsICdkZWNsaW5lZCcpO1xuICAgIGJhbm5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9KTtcbn0pO1xuXG4vLyBjb25uZWN0IGlmIHRoZXJlIGFyZSBhbnkgTGl2ZVZpZXdzIG9uIHRoZSBwYWdlXG5saXZlU29ja2V0LmNvbm5lY3QoKVxuXG4vLyBleHBvc2UgbGl2ZVNvY2tldCBvbiB3aW5kb3cgZm9yIHdlYiBjb25zb2xlIGRlYnVnIGxvZ3MgYW5kIGxhdGVuY3kgc2ltdWxhdGlvbjpcbmxpdmVTb2NrZXQuZW5hYmxlRGVidWcoKVxuLy8gPj4gbGl2ZVNvY2tldC5lbmFibGVMYXRlbmN5U2ltKDEwMDApICAvLyBlbmFibGVkIGZvciBkdXJhdGlvbiBvZiBicm93c2VyIHNlc3Npb25cbi8vID4+IGxpdmVTb2NrZXQuZGlzYWJsZUxhdGVuY3lTaW0oKVxud2luZG93LmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG5cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQU1BLE1BQUMsVUFBVSxTQUFRLFdBQVU7QUFDM0I7QUFHQSxRQUFDLFlBQVk7QUFDWCxjQUFJLFdBQVc7QUFDZixjQUFJLFVBQVUsQ0FBQyxNQUFNLE9BQU8sVUFBVSxHQUFHO0FBQ3pDLG1CQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsVUFBVSxDQUFDLFFBQU8sdUJBQXVCLEVBQUUsR0FBRztBQUN4RSxvQkFBTyx3QkFDTCxRQUFPLFFBQVEsS0FBSztBQUN0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
