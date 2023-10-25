import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LogIn } from "./components/LogIn.tsx";
import { Main } from "./components/Main.tsx";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./app/store.ts";
import { RequaireAuth } from "./components/RequaireAuth.tsx";
import { NotFound } from "./components/NotFound.tsx";

export const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.StrictMode>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<LogIn />} />
              <Route path="/main/:currentPage?" element={<RequaireAuth />}>
                <Route index element={<Main />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.StrictMode>
      </BrowserRouter>
    </Provider>
  );
};
