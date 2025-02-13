import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PollPage } from "./components/PollPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { LoginPage } from "./components/LoginPage";

export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/polls/:id", element: <PollPage /> },
    { path: "*", element: <NotFoundPage /> },
]);