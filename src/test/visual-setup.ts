/**
 * Visual Regression Test Setup
 *
 * Configures the testing environment for visual regression tests.
 */

import '@testing-library/jest-dom';

// Mock window.matchMedia for component tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver
class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Set up SKAI brand colors as CSS custom properties
const style = document.createElement('style');
style.innerHTML = `
  :root {
    --primary: 199 90% 65%;
    --primary-foreground: 225 80% 4%;
    --secondary: 166 80% 55%;
    --secondary-foreground: 225 80% 4%;
    --background: 225 80% 4%;
    --foreground: 0 0% 100%;
    --card: 225 60% 8%;
    --card-foreground: 0 0% 100%;
    --muted: 225 30% 15%;
    --muted-foreground: 225 20% 70%;
    --border: 225 30% 20%;
    --radius: 0.75rem;
    --skai-green-coal-300: #001615;
    --skai-green-coal-200: #122524;
    --skai-green-coal-100: #123f3c;
    --skai-alien-green: #17f9b4;
    --skai-sky-blue: #56C7F3;
  }
`;
document.head.appendChild(style);
