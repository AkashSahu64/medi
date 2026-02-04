import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import {
  FaUser,
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaWhatsapp,
  FaStethoscope,
  FaChevronDown,
  FaSignOutAlt,
  FaTachometerAlt,
  FaChevronRight,
  FaArrowRight
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { CLINIC_INFO } from "../../utils/constants";
import { serviceService } from "../../services/service.service";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [services, setServices] = useState([]);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAllServices();
        if (response.success && response.data) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Error fetching services for navbar:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/appointment", label: "Appointment" },
    { path: "/fomt", label: "FOMT" },
    { path: "/fnmt", label: "FNMT" },
    { path: "/courses-workshop", label: "WORKSHOP" },
  ];

  const contactItems = [
    {
      id: "phone",
      icon: <FaPhoneAlt />,
      text: CLINIC_INFO.PHONE_FULL,
      href: `tel:${CLINIC_INFO.phone}`,
      color: "text-[#0077B6]",
      hoverColor: "text-[#005B8D]",
      bgColor: "bg-[#0077B6]/10",
    },
    {
      id: "whatsapp",
      icon: <FaWhatsapp />,
      text: "WhatsApp",
      href: `https://wa.me/${CLINIC_INFO.whatsapp}`,
      color: "text-[#25D366]",
      hoverColor: "text-[#1DA851]",
      bgColor: "bg-[#25D366]/10",
      target: "_blank",
    },
  ];

  const isActive = (path) => location.pathname === path;

  const getDesktopDropdownColumns = () => {
    if (services.length <= 5) return "grid-cols-1";
    if (services.length <= 8) return "grid-cols-2";
    return "grid-cols-3";
  };

  const getDesktopDropdownWidth = () => {
    if (services.length <= 5) return "min-w-[20rem]"; // ~320px
    if (services.length <= 8) return "min-w-[28rem]"; // ~448px
    return "min-w-[36rem]"; // ~576px
  };

  const ProfileDropdown = () => (
    <AnimatePresence>
      {isProfileDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <p className="font-bold text-gray-900 text-sm truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                navigate(user?.role === "admin" ? "/admin" : "/profile");
                setIsProfileDropdownOpen(false);
              }}
              className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors group"
            >
              <FaTachometerAlt className="mr-3 text-gray-400 group-hover:text-cyan-500 transition-colors" />
              Dashboard
            </button>

            <button
              onClick={() => {
                logout();
                setIsProfileDropdownOpen(false);
              }}
              className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group mt-1"
            >
              <FaSignOutAlt className="mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                <img
                  src={logo}
                  alt="MEDIHOPE Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://img.icons8.com/color/96/000000/hospital.png";
                  }}
                />
              </div>

              <div>
                <div className="hidden items-center space-x-1 sm:flex">
                  <h1 className="text-xl md:text-3xl font-bold text-primary-500/90 tracking-tight">
                    Medi<span className="text-red-500">hope</span>
                  </h1>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 mx-auto">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 ${
                    active
                      ? "text-[#0077B6] font-semibold"
                      : "text-gray-600 hover:text-[#0077B6]"
                  }`}
                >
                  <span className="relative inline-block py-1">
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="navbar-indicator"
                        className="absolute left-0 bottom-0.5 h-0.5 w-full bg-[#0077B6] rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesHovered(true)}
              onMouseLeave={() => setIsServicesHovered(false)}
            >
              <Link
                to="/services"
                className={`relative px-4 py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive("/services") || isActive("/services/")
                    ? "text-[#0077B6] font-semibold"
                    : "text-gray-600 hover:text-[#0077B6]"
                }`}
              >
                <span className="relative inline-block py-1 flex items-center">
                  Services
                  <FaChevronDown
                    className={`ml-1.5 text-xs transition-transform duration-200 ${
                      isServicesHovered ? "rotate-180" : ""
                    }`}
                  />
                  {(isActive("/services") || isActive("/services/")) && (
                    <motion.span
                      layoutId="navbar-indicator-services"
                      className="absolute left-0 bottom-0.5 h-0.5 w-full bg-[#0077B6] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </span>
              </Link>

              {/* Services Dropdown Menu */}
              {isServicesHovered && services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute -right-16 -translate-x-1/2 top-full -mt-3 ${getDesktopDropdownWidth()} bg-white shadow-lg rounded-xl z-50 border border-gray-100 overflow-hidden`}
                  style={{
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.04))",
                  }}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Our Services
                    </h3>
                    <p className="text-xs text-gray-500">
                      Click to view details
                    </p>
                  </div>

                  <div className={`max-h-80 overflow-y-auto py-1`}>
                    <div
                      className={`grid ${getDesktopDropdownColumns()} gap-1 px-2`}
                    >
                      {services.map((service) => (
                        <Link
                          key={service._id}
                          to={`/services/${service._id}`}
                          className="block px-2 py-2.5 hover:bg-cyan-50/50 text-gray-700 hover:text-cyan-600 transition-colors rounded-lg group"
                          onClick={() => setIsServicesHovered(false)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <FaStethoscope className="text-cyan-600 text-xs" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate group-hover:text-cyan-600">
                                {service.title}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <Link
                      to="/services"
                      className="flex items-center justify-center text-sm font-semibold text-cyan-600 hover:text-cyan-700 group transition-colors"
                      onClick={() => setIsServicesHovered(false)}
                    >
                      View All Services
                      <FaArrowRight className="ml-1.5 text-xs rotate-270 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Desktop Contact Icons & Auth */}
          <div className="hidden lg:flex items-center space-x-5">
            {/* Contact Items */}
            {contactItems.map((item) => (
              <div key={item.id} className="relative">
                <motion.a
                  href={item.href}
                  target={item.target}
                  rel={item.target ? "noopener noreferrer" : undefined}
                  className="flex items-center overflow-hidden"
                  onMouseEnter={() => setHoveredContact(item.id)}
                  onMouseLeave={() => setHoveredContact(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`${item.bgColor} rounded-full p-2 ${item.color} transition-all duration-300 hover:shadow-sm`}
                  >
                    <div className="text-[16px]">{item.icon}</div>
                  </div>

                  <motion.div
                    initial={{ width: 0, opacity: 0, x: -4 }}
                    animate={{
                      width: hoveredContact === item.id ? "auto" : 0,
                      opacity: hoveredContact === item.id ? 1 : 0,
                      x: hoveredContact === item.id ? 0 : -4,
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden whitespace-nowrap ml-2.5"
                  >
                    <span
                      className={`font-medium ${item.hoverColor} text-[14px]`}
                    >
                      {item.text}
                    </span>
                  </motion.div>
                </motion.a>
              </div>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-2">
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-500/30 rounded-full"
                    aria-label="Profile menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center hover:bg-cyan-200 transition-colors border border-cyan-100">
                      <FaUser className="text-cyan-600 text-md" />
                    </div>
                  </button>
                  <ProfileDropdown />
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-700 hover:text-cyan-700 text-sm px-4 py-2"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4 py-2 shadow-sm"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Contact Icons */}
            <div className="flex items-center space-x-2">
              {contactItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.target}
                  rel={item.target ? "noopener noreferrer" : undefined}
                  className={`w-9 h-9 rounded-full ${item.bgColor} flex items-center justify-center ${item.color} hover:shadow-sm transition-shadow`}
                  aria-label={item.id === "phone" ? "Call us" : "WhatsApp"}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <button
              className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <FaTimes size={18} className="transition-transform" />
              ) : (
                <FaBars size={18} className="transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden bg-white shadow-lg rounded-b-xl overflow-hidden border-t border-gray-100"
            >
              <div className="max-h-[calc(100vh-5rem)] overflow-y-auto py-2 no-scrollbar">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-6 py-2.5 text-base font-medium transition-all ${
                      isActive(link.path)
                        ? "bg-cyan-50 text-cyan-600 border-l-3 border-cyan-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-cyan-600"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Services Toggle */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() =>
                      setIsMobileServicesOpen(!isMobileServicesOpen)
                    }
                    className={`w-full flex items-center justify-between px-6 py-2.5 text-base font-medium transition-all ${
                      isActive("/services") || isActive("/services/")
                        ? "bg-cyan-50 text-cyan-600 border-l-3 border-cyan-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-cyan-600"
                    }`}
                    aria-expanded={isMobileServicesOpen}
                  >
                    <span>Services</span>
                    <FaChevronDown
                      className={`text-xs transition-transform duration-200 ${
                        isMobileServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Mobile Services Submenu */}
                  <AnimatePresence>
                    {isMobileServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-9 pr-6 py-2 bg-gray-50/50">
                          {services.slice(0, 5).map((service) => (
                            <Link
                              key={service._id}
                              to={`/services/${service._id}`}
                              className="block py-2 text-sm text-gray-600 hover:text-cyan-600 border-b border-gray-200/50 last:border-b-0"
                              onClick={() => {
                                setIsOpen(false);
                                setIsMobileServicesOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 mr-3"></div>
                                <span className="truncate">
                                  {service.title}
                                </span>
                              </div>
                            </Link>
                          ))}
                          {services.length > 5 && (
                            <Link
                              to="/services"
                              className="block py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700"
                              onClick={() => {
                                setIsOpen(false);
                                setIsMobileServicesOpen(false);
                              }}
                            >
                              + {services.length - 5} more services →
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Contact Info */}
                <div className="px-6 py-4 border-t border-gray-100 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Quick Contact
                  </h3>
                  {contactItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.target}
                      rel={item.target ? "noopener noreferrer" : undefined}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        setIsMobileServicesOpen(false);
                      }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center ${item.color}`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.text}
                        </div>
                        {item.id === "phone" && (
                          <div className="text-sm text-gray-500">
                            Call us directly
                          </div>
                        )}
                      </div>
                    </a>
                  ))}

                  {/* Mobile Auth Buttons */}
                  <div className="pt-4 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-cyan-50/80 rounded-lg">
                          <div className="w-11 h-11 rounded-full bg-cyan-600 flex items-center justify-center text-white flex-shrink-0">
                            <FaUser />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate">
                              {user?.name}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            fullWidth
                            className="bg-cyan-600 text-white hover:bg-cyan-700 text-sm py-2.5"
                            onClick={() => {
                              navigate(
                                user?.role === "admin" ? "/admin" : "/profile",
                              );
                              setIsOpen(false);
                              setIsMobileServicesOpen(false);
                            }}
                          >
                            Dashboard
                          </Button>
                          <Button
                            variant="outline"
                            fullWidth
                            className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 text-sm py-2.5"
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                              setIsMobileServicesOpen(false);
                            }}
                          >
                            Logout
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          fullWidth
                          className="bg-cyan-600 text-white hover:bg-cyan-700 text-sm py-2.5"
                          onClick={() => {
                            navigate("/login");
                            setIsOpen(false);
                            setIsMobileServicesOpen(false);
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          variant="outline"
                          fullWidth
                          className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 text-sm py-2.5"
                          onClick={() => {
                            navigate("/register");
                            setIsOpen(false);
                            setIsMobileServicesOpen(false);
                          }}
                        >
                          Register
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
