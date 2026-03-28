import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { email, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      location.pathname === path
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Screened" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Screened</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center space-x-8">
            <nav className="flex space-x-4">
              <Link to="/" className={navLinkClass('/')}>Movies</Link>
              <Link to="/import" className={navLinkClass('/import')}>Import</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                {email}
              </span>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="sm:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-3 space-y-1">
            <Link to="/" className={`block ${navLinkClass('/')}`} onClick={() => setMenuOpen(false)}>
              Movies
            </Link>
            <Link to="/import" className={`block ${navLinkClass('/import')}`} onClick={() => setMenuOpen(false)}>
              Import
            </Link>
            <div className="border-t border-gray-700 mt-2 pt-2 px-3 flex items-center justify-between">
              <span className="text-gray-400 text-sm truncate flex items-center gap-1.5">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                {email}
              </span>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
