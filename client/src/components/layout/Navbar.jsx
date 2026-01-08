import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { FaUser, FaBars, FaTimes, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { CLINIC_INFO } from '../../utils/constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    
    // Initial check
    checkMobile();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/appointment', label: 'Book Appointment' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-primary-700">MEDIHOPE</h1>
                <p className="text-xs text-secondary-500">Physiotherapy Centre</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors relative px-2 py-1 ${
                  isActive(link.path)
                    ? 'text-primary-600'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
              >
                <FaPhoneAlt className="flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{CLINIC_INFO.phone}</span>
              </a>
              <span className="text-secondary-300 mx-2">|</span>
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <FaWhatsapp className="flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">WhatsApp</span>
              </a>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <FaUser className="text-primary-600 text-sm" />
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (user?.role === 'admin') {
                      navigate('/admin');
                    } else {
                      navigate('/profile');
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  Dashboard
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  className="whitespace-nowrap"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="whitespace-nowrap"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="whitespace-nowrap"
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Phone */}
          <div className="flex items-center space-x-4 md:hidden">
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600"
            >
              <FaPhoneAlt />
            </a>
            <button
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? (
                <FaTimes size={20} className="text-primary-600" />
              ) : (
                <FaBars size={20} className="text-secondary-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg rounded-b-lg"
          >
            <div className="py-4 px-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Contact Info */}
              <div className="pt-4 mt-4 border-t border-secondary-200 space-y-3">
                <div className="flex items-center justify-center space-x-4">
                  <a
                    href={`tel:${CLINIC_INFO.phone}`}
                    className="flex items-center space-x-2 text-primary-600 font-medium"
                  >
                    <FaPhoneAlt />
                    <span>{CLINIC_INFO.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-green-600 font-medium"
                  >
                    <FaWhatsapp />
                    <span>WhatsApp</span>
                  </a>
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <FaUser className="text-primary-600" />
                      </div>
                      <div>
                        <span className="font-medium block">{user?.name}</span>
                        <span className="text-sm text-secondary-500">{user?.email}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        fullWidth
                        onClick={() => {
                          if (user?.role === 'admin') {
                            navigate('/admin');
                          } else {
                            navigate('/profile');
                          }
                          setIsOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        navigate('/register');
                        setIsOpen(false);
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;