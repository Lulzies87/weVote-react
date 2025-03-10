import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { TenantProvider } from "./context/TenantContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TenantProvider>
      <RouterProvider router={router} />
    </TenantProvider>
  </StrictMode>
);
