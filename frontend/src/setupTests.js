import '@testing-library/jest-dom';

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (handle) => clearTimeout(handle);
}
