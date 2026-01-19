import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import WriteupPage from "./WriteupPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/writeups/anticheat"
          element={
            <WriteupPage
              file={"/writeups/wuwa.md"}
              title="Defeating Anticheat Expert"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
