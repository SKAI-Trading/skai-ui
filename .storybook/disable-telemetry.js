// Disable Storybook telemetry completely
(function() {
  'use strict';
  
  // Override telemetry collection functions
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && 
        (url.includes('telemetry') || 
         url.includes('analytics') || 
         url.includes('storybook.js.org') ||
         url.includes('chromatic.com'))) {
      console.log('[SKAI] Blocked telemetry request:', url);
      return Promise.resolve(new Response('{}', { status: 200 }));
    }
    return originalFetch.apply(this, args);
  };

  // Block telemetry event listeners
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (typeof listener === 'function' && 
        (type.includes('telemetry') || 
         type.includes('analytics') ||
         type.includes('chromatic'))) {
      console.log('[SKAI] Blocked telemetry event listener:', type);
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Override localStorage/sessionStorage for telemetry keys
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    if (key.includes('storybook') && 
        (key.includes('telemetry') || 
         key.includes('analytics') || 
         key.includes('tracking'))) {
      console.log('[SKAI] Blocked telemetry storage:', key);
      return;
    }
    return originalSetItem.call(this, key, value);
  };

  console.log('[SKAI] Telemetry blocking active');
})();
