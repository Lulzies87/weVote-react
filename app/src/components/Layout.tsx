import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div>
      <Header />

      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
