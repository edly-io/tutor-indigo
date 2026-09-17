/*
 * Tenant custom JS loader for server-rendered LMS pages.
 * Behavioural twin of src/customScript/loader.js in frontend-saas-widgets, which
 * covers the MFEs. Keep the window.EDLY contract identical across both.
 */
(function edlyCustomJs() {
  var ROUTE = '/wp-json/edly-wp-routes/custom-js';
  var SCRIPT_ATTR = 'data-edly-custom-js';
  var LATCH = '__EDLY_CUSTOM_JS__';

  var tag = document.currentScript;
  if (!tag || window[LATCH]) { return; }
  window[LATCH] = { state: 'pending' };

  var raw = (tag.getAttribute('data-edly-mktg-root') || '').trim().replace(/\/+$/, '');
  if (!raw) { window[LATCH] = { state: 'empty' }; return; }
  var base = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;

  var context = {
    platform: tag.getAttribute('data-edly-platform') || 'lms',
    app: null,
    lmsBaseUrl: window.location.origin,
    marketingSiteBaseUrl: base,
    pathname: window.location.pathname,
    locale: document.documentElement.lang || null,
  };

  function buildHelpers() {
    var registrations = [];
    var observer = null;
    var routeHandlers = [];
    var flushScheduled = false;

    function applyAll() {
      registrations.forEach(function (entry) {
        Array.prototype.forEach.call(document.querySelectorAll(entry.selector), function (node) {
          if (entry.seen.has(node)) { return; }
          entry.seen.add(node);
          try { entry.callback(node); } catch (e) { console.error('[edly-custom-js] onElement', e); }
        });
      });
    }

    // applyAll queries the whole document once per registration, so coalesce the
    // observer's batches into one flush per frame rather than one per batch.
    function scheduleFlush() {
      if (flushScheduled) { return; }
      flushScheduled = true;
      var flush = function () { flushScheduled = false; applyAll(); };
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(flush);
      } else {
        window.setTimeout(flush, 0);
      }
    }

    // Only childList is observed: re-firing on attribute changes would loop when
    // the callback itself sets an attribute. Each node is handled at most once.
    function onElement(selector, callback) {
      // WeakSet, not an array: a matched node must not be retained after detach.
      registrations.push({ selector: selector, callback: callback, seen: new WeakSet() });
      if (!observer) {
        observer = new MutationObserver(scheduleFlush);
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }
      applyAll();
    }

    // Patches pushState/replaceState as well as popstate, matching the MFE loader:
    // legacy pages are server-rendered, but tenant JS is written once for both.
    function onRoute(callback) {
      if (!routeHandlers.length) {
        var emit = function () {
          routeHandlers.forEach(function (handler) {
            try { handler(window.location.pathname); } catch (e) { console.error('[edly-custom-js] onRoute', e); }
          });
        };
        var pushState = window.history.pushState;
        var replaceState = window.history.replaceState;
        window.history.pushState = function () { pushState.apply(this, arguments); emit(); };
        window.history.replaceState = function () { replaceState.apply(this, arguments); emit(); };
        window.addEventListener('popstate', emit);
      }
      routeHandlers.push(callback);
    }

    return { context: context, onElement: onElement, onRoute: onRoute };
  }

  function execute(js) {
    window.EDLY = window.EDLY || buildHelpers();
    var script = document.createElement('script');
    script.setAttribute(SCRIPT_ATTR, '');
    script.textContent = js;
    document.head.appendChild(script);
  }

  // No client-side digest check and no sessionStorage cache: a digest arriving beside
  // the code it attests is not a control, and the route already sends max-age=300.
  fetch(base + ROUTE, { headers: { Accept: 'application/json' } })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (payload) {
      if (!payload || typeof payload.js !== 'string' || !payload.js.trim()) {
        window[LATCH] = { state: 'empty' };
        return;
      }
      execute(payload.js);
      window[LATCH] = { state: 'executed' };
    })
    .catch(function (error) {
      window[LATCH] = { state: 'error' };
      console.error('[edly-custom-js]', error);
    });
}());
