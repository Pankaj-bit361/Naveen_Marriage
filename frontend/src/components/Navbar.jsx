import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiImage, FiFolder } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary-dark">
              Gallery
            </Link>
            <div className="flex space-x-4">
              <NavLink to="/" icon={<FiImage />} text="Images" />
              <NavLink to="/collections" icon={<FiFolder />} text="Collections" />
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, text }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors
        ${isActive 
          ? 'text-primary-dark bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light'
        }`}
    >
      {icon}
      <span>{text}</span>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-dark"
          layoutId="navbar-indicator"
        />
      )}
    </Link>
  );
}