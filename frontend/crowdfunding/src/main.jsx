import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "./index.css"; // Optional if you use custom styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID} // Make sure this is set in your .env file
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
