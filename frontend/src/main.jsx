import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { ProjectProvider } from "./context/ProjectContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProjectProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ProjectProvider>
  </React.StrictMode>
);
