import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import { PollPage } from "./components/PollPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { LoginPage } from "./components/LoginPage";

const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return null;
};

const loginLoader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return redirect("/");
  }
  return null;
};

export const router = createBrowserRouter([
  { path: "/", element: <App />, loader: checkAuth },
  { path: "/login", element: <LoginPage />, loader: loginLoader },
  { path: "/polls/:id", element: <PollPage />, loader: checkAuth },
  { path: "*", element: <NotFoundPage /> },
]);
