import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Showcase } from "../src/showcase.tsx";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Showcase />
  </StrictMode>,
);
