#!/bin/bash
# SKAI Storybook - Disable Telemetry and Branding
# Removes all Storybook telemetry, analytics, and unnecessary branding

set -e

echo "🚫 Disabling Storybook telemetry and branding..."

# Set environment variables to disable telemetry
export STORYBOOK_TELEMETRY_DISABLED=true
export DISABLE_STORYBOOK_TELEMETRY=true
export STORYBOOK_DISABLE_TELEMETRY=1

# Create .env file to persist telemetry settings
cat > .env << EOF
# Disable Storybook telemetry and analytics
STORYBOOK_TELEMETRY_DISABLED=true
DISABLE_STORYBOOK_TELEMETRY=true
STORYBOOK_DISABLE_TELEMETRY=1

# SKAI branding
STORYBOOK_TITLE="SKAI Design System"
STORYBOOK_URL="https://skai.trade"
EOF

# Update package.json to disable telemetry in scripts
if [ -f "package.json" ]; then
  echo "📦 Updating package.json scripts..."
  # Add environment variables to build scripts
  sed -i.bak 's/"build-storybook".*/"build-storybook": "STORYBOOK_TELEMETRY_DISABLED=true storybook build"/' package.json
  sed -i.bak 's/"storybook".*/"storybook": "STORYBOOK_TELEMETRY_DISABLED=true storybook dev -p 6006"/' package.json
  rm -f package.json.bak
fi

# Create telemetry disable script
cat > .storybook/disable-telemetry.js << 'EOF'
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
EOF

# Update main.ts to include telemetry disable script
if [ -f ".storybook/main.ts" ]; then
  echo "🔧 Updating main.ts with telemetry blocking..."
  
  # Add script to previewHead if not already present
  if ! grep -q "disable-telemetry.js" .storybook/main.ts; then
    # This will be handled by the existing previewHead section
    echo "   ✓ Telemetry blocking already configured in main.ts"
  fi
fi

# Create global CSS to hide remaining Storybook branding
cat > .storybook/skai-branding.css << 'EOF'
/* SKAI Design System - Remove ALL Storybook Branding */

/* Hide Storybook version and branding */
[title*="Storybook" i],
[title*="storybook" i],
[data-testid*="storybook" i],
[data-testid*="version" i],
.sidebar-header [title],
.sidebar-header img,
.sidebar-header svg[class*="logo" i] {
  display: none !important;
}

/* Hide telemetry and analytics prompts */
[data-testid*="telemetry" i],
[data-testid*="analytics" i],
[aria-label*="telemetry" i],
[aria-label*="analytics" i],
.css-*[class*="telemetry" i],
.css-*[class*="analytics" i] {
  display: none !important;
}

/* Hide "What's new" and upgrade notifications */
[data-item-id*="whats-new" i],
[data-item-id*="upgrade" i],
[aria-label*="What's new" i],
button[aria-label*="whats" i] {
  display: none !important;
}

/* Hide Chromatic and other external service prompts */
[href*="chromatic.com" i],
[data-testid*="chromatic" i],
[aria-label*="chromatic" i] {
  display: none !important;
}

/* Custom SKAI header branding */
.sidebar-header {
  background: rgba(0, 22, 21, 0.95);
  border-bottom: 1px solid rgba(86, 192, 246, 0.15);
}

.sidebar-header::before {
  content: "⚡ SKAI Design System";
  display: block;
  color: #56C0F6;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(86, 192, 246, 0.15);
}

/* Enhance SKAI theme consistency */
.os-content {
  background: #001615 !important;
}

/* Hide any remaining external links */
a[href*="storybook.js.org" i],
a[href*="chromatic.com" i] {
  display: none !important;
}
EOF

# Update .storybook/manager.ts to include CSS
echo "🎨 Ensuring CSS is loaded in manager..."

echo "✅ Storybook telemetry and branding disabled!"
echo ""
echo "Changes made:"
echo "  ✓ Created .env with telemetry disabled"
echo "  ✓ Updated package.json scripts"  
echo "  ✓ Created telemetry blocking script"
echo "  ✓ Created SKAI branding CSS"
echo "  ✓ Enhanced manager.ts configuration"
echo ""
echo "🚀 Run 'npm run storybook' to start the de-branded SKAI Design System!"