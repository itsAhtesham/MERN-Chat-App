import React, { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoutes from "./components/auth/ProtectRoutes";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Groups = lazy(() => import("./pages/Groups"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  let user = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoutes user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/groups" element={<Groups />} />
        </Route>

        <Route
          path="/login"
          element={
            <ProtectRoutes user={!user} redirect="/">
              <Login />
            </ProtectRoutes>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
