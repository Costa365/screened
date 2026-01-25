import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { username, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Screened" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">Screened</span>
            </Link>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Movies
              </Link>
              <Link
                to="/import"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/import'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Import
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">{username}</span>
            <button
              onClick={logout}
              className="text-gray-300 hover:text-white text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
