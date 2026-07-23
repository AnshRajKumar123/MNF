import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import "boxicons";

import App from "./App";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <BrowserRouter>
            <Toaster position="top-center" />
            <App />
        </BrowserRouter>
    </AuthProvider>
);