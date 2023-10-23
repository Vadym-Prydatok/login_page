import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LogIn } from "./components/LogIn.tsx";
import { Main } from "./components/Main.tsx";
import App from "./App.tsx";

export const Root = () => (
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LogIn />} />
          <Route path="/main" element={<Main />} />
        </Route>

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </React.StrictMode>
  </BrowserRouter>
);
