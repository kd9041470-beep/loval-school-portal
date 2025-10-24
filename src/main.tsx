import React from "react";
import "./index.css"; // ← استيراد ملف Tailwind/الستايل العام
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    {/* basename يضمن أن الروابط تعمل تحت /loval-school-portal/ */}
    <BrowserRouter basename="/loval-school-portal">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

