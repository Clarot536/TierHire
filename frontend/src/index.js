import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ Suppress ResizeObserver noise in console
const originalConsoleError = console.error;
console.error = function (...args) {
  const isResizeObserverError =
    typeof args[0] === "string" &&
    (args[0].includes("ResizeObserver loop limit exceeded") ||
     args[0].includes("ResizeObserver loop completed with undelivered notifications"));

  if (!isResizeObserverError) {
    originalConsoleError.apply(console, args);
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
