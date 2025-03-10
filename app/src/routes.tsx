import { createHashRouter, redirect } from "react-router-dom";
import App from "./App";
import { PollPage } from "./components/PollPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { LoginPage } from "./components/LoginPage";
import { Layout } from "./components/Layout";

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

export const router = createHashRouter([
  {
    element: <Layout />,
    loader: checkAuth,
    children: [
      { path: "/", element: <App /> },
      { path: "/polls/:id", element: <PollPage /> },
    ],
  },
  { path: "/login", element: <LoginPage />, loader: loginLoader },
  { path: "*", element: <NotFoundPage /> },
],
{
  basename: "/weVote-react"
});
