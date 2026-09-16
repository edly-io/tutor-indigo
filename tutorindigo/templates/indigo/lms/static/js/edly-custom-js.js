/*
 * Tenant custom JS loader for server-rendered LMS and Studio pages.
 * Mirrors src/customScript/loader.js in frontend-saas-widgets, which covers the MFEs.
 * NOTE: lms/static/js/ and cms/static/js/ copies must stay identical.
 */
(function edlyCustomJs() {
  var ROUTE = '/wp-json/edly-wp-routes/custom-js';
  var SCRIPT_ATTR = 'data-edly-custom-js';
  var LATCH = '__EDLY_CUSTOM_JS__';
  var CACHE_PREFIX = 'edly:customjs:';
  var CACHE_TTL_MS = 5 * 60 * 1000;

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

  function readCache() {
    try {
      var entry = JSON.parse(window.sessionStorage.getItem(CACHE_PREFIX + base));
      return (entry && Date.now() - entry.at <= CACHE_TTL_MS) ? entry.payload : null;
    } catch (e) { return null; }
  }

  function writeCache(payload) {
    try {
      window.sessionStorage.setItem(CACHE_PREFIX + base, JSON.stringify({ at: Date.now(), payload }));
    } catch (e) { /* private mode, quota, disabled storage */ }
  }

  function sha256Hex(text) {
    var subtle = window.crypto && window.crypto.subtle;
    if (!subtle || typeof TextEncoder === 'undefined') { return Promise.resolve(null); }
    return subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (digest) {
      return Array.prototype.map.call(new Uint8Array(digest), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  // Fails closed wherever verification is possible. SubtleCrypto is absent on
  // insecure origins (http dev), which is the only case allowed through unverified.
  function passesIntegrityCheck(payload) {
    if (!payload.sha256) { return Promise.resolve(true); }
    return sha256Hex(payload.js).then(function (digest) {
      return digest ? digest === payload.sha256 : window.isSecureContext === false;
    });
  }

  function buildHelpers() {
    var registrations = [];
    var observer = null;
    var routeHandlers = [];

    function applyAll() {
      registrations.forEach(function (entry) {
        Array.prototype.forEach.call(document.querySelectorAll(entry.selector), function (node) {
          if (entry.seen.indexOf(node) !== -1) { return; }
          entry.seen.push(node);
          try { entry.callback(node); } catch (e) { console.error('[edly-custom-js] onElement', e); }
        });
      });
    }

    // Only childList is observed: re-firing on attribute changes would loop when
    // the callback itself sets an attribute. Each node is handled at most once.
    function onElement(selector, callback) {
      registrations.push({ selector: selector, callback: callback, seen: [] });
      if (!observer) {
        observer = new MutationObserver(applyAll);
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }
      applyAll();
    }

    function onRoute(callback) {
      if (!routeHandlers.length) {
        window.addEventListener('popstate', function () {
          routeHandlers.forEach(function (handler) {
            try { handler(window.location.pathname); } catch (e) { console.error('[edly-custom-js] onRoute', e); }
          });
        });
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

  function run(payload) {
    if (!payload || typeof payload.js !== 'string' || !payload.js.trim()) {
      window[LATCH] = { state: 'empty' };
      return;
    }
    passesIntegrityCheck(payload).then(function (ok) {
      if (!ok) {
        console.error('[edly-custom-js] integrity mismatch, not executing');
        window[LATCH] = { state: 'rejected' };
        return;
      }
      execute(payload.js);
      window[LATCH] = { state: 'executed', hash: payload.sha256 };
    });
  }

  var cached = readCache();
  if (cached) { run(cached); return; }

  fetch(base + ROUTE, { headers: { Accept: 'application/json' } })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (payload) {
      if (payload) { writeCache(payload); }
      run(payload);
    })
    .catch(function (error) {
      window[LATCH] = { state: 'error' };
      console.error('[edly-custom-js]', error);
    });
}());
