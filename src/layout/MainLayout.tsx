import { Outlet } from "react-router-dom";
import Navbar from "./UserNavbar";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <Navbar />
        </div>
      </header>

      <main className="flex-1 mt-20 max-w-7xl mx-auto w-full px-4">
        <Outlet />
      </main>

      <footer className="py-4 text-center text-sm text-gray-500">
        © 2025 Master-O
      </footer>
    </div>
  );
};
