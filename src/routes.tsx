import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PollPage } from "./components/PollPage";
import { NotFoundPage } from "./components/NotFoundPage";

export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/poll/:id", element: <PollPage /> },
    { path: "*", element: <NotFoundPage /> },
]);