// src/components/Navbar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
// import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(() => supabase.auth.getUser());

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     window.location.reload(); // or redirect
//   };

  return (
    <header className="bg-white dark:bg-gray-900/30">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <NavLink to="/" className="block text-teal-600 dark:text-teal-300">
              <span className="sr-only">Home</span>
              <span className="text-xl font-bold">SkillLink</span>
            </NavLink>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <NavLink
                    to="/explore"
                    className={({ isActive }) => 
                      `text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75 ${
                        isActive ? "font-medium text-teal-600 dark:text-teal-300" : ""
                      }`
                    }
                  >
                    Explore
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/create"
                    className={({ isActive }) => 
                      `text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75 ${
                        isActive ? "font-medium text-teal-600 dark:text-teal-300" : ""
                      }`
                    }
                  >
                    Create
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => 
                      `text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75 ${
                        isActive ? "font-medium text-teal-600 dark:text-teal-300" : ""
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                {/* {user ? (
                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-red-500"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-teal-500"
                    >
                      Login
                    </NavLink>
                    <div className="hidden sm:flex">
                      <NavLink
                        to="/register"
                        className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                      >
                        Register
                      </NavLink>
                    </div>
                  </>
                )} */}
                <NavLink
                  to="/login"
                  className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-teal-500"
                >
                  Login
                </NavLink>
                <div className="hidden sm:flex">
                  <NavLink
                    to="/register"
                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                  >
                    Register
                  </NavLink>
                </div>
              </div>

              <div className="block md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <NavLink
              to="/explore"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              Explore
            </NavLink>
            <NavLink
              to="/create"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              Create
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              Profile
            </NavLink>
            <div className="pt-2 space-y-2">
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white shadow-sm dark:hover:bg-teal-500 text-center"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white dark:hover:text-white/75 text-center"
              >
                Register
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}