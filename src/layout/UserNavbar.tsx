import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hook/hook";
import { logout, selectAuth } from "../store/slices/UserAuthSlice";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(selectAuth);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Master-O-Quizz
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/questions" className="text-gray-700 hover:text-blue-600 font-medium">
            All Questions
          </Link>
          <Link to="/solutions" className="text-gray-700 hover:text-blue-600 font-medium">
            Solve
          </Link>
          <Link to="/submit-query" className="text-gray-700 hover:text-blue-600 font-medium">
            Submit Query
          </Link>
          {isAdmin && (
            <>
              <Link to="/admin/question/create-new-question" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                Create New Question
              </Link>
              <Link to="/admin/skill/create-new-skill" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                Create New Skill
              </Link>
              <Link to="/admin/reports" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                Report
              </Link>
            </>
          )}
          {user ? (
            <div className="relative">
              <button onClick={() => setProfileOpen((prev) => !prev)} className="p-2 rounded-full hover:bg-gray-100">
                <User className="w-6 h-6 text-gray-700" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                  <div className="px-4 py-2 border-b text-sm text-gray-600">
                    {user?.name || user?.name || "User"}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-900 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-900 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <Link
            to="/questions"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            All Questions
          </Link>
          <Link
            to="/solutions"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Solutions
          </Link>
          <Link
            to="/submit-query"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Submit Query
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/admin/question/create-new-question"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Create New Question
              </Link>
              <Link
                to="/admin/skill/create-new-skill"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Create New Skill
              </Link>
            </>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) :
            (
              <Link to="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                Login
              </Link>

            )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
