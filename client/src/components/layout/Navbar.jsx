import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import {
  FaUser,
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaWhatsapp,
  FaStethoscope,
  FaChevronRight,
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
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
  }, [location]);

  const navLinks = [
   { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/appointment", label: "Book Appointment" },
  // { path: "/contact", label: "Contact" },
  // Add these two new links
  { path: "/fomt", label: "FOMT" },
  { path: "/fnmt", label: "FNMT" },
  { path: "/courses-workshop", label: "COURSES & WORKSHOP" },
  ];

  const contactItems = [
    {
      id: "phone",
      icon: <FaPhoneAlt />,
      text: CLINIC_INFO.PHONE_FULL,
      href: `tel:${CLINIC_INFO.phone}`,
      color: "text-[#0077B6]", // Medical Teal cyan
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-2">
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
                  <h1 className="text-xl md:text-3xl font-bold text-primary-500/90">
                    Medihope
                  </h1>
                  {/* <FaStethoscope className="text-[#0077B6] text-lg" /> */}
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-md font-semibold whitespace-nowrap transition-colors duration-300 ${
                    active
                      ? "text-[#0077B6]"
                      : "text-gray-700 hover:text-[#0077B6]"
                  }`}
                >
                  {/* 🔹 TEXT WRAPPER */}
                  <span className="relative inline-block">
                    {link.label}

                    {active && (
                      <motion.span
                        layoutId="navbar-indicator"
                        className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#0077B6] rounded-full"
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
                className={`relative px-4 py-2 text-md font-semibold whitespace-nowrap transition-colors duration-300 ${
                  isActive("/services") || isActive("/services/")
                    ? "text-[#0077B6]"
                    : "text-gray-700 hover:text-[#0077B6]"
                }`}
              >
                <span className="relative inline-block">
                  Services
                  {(isActive("/services") || isActive("/services/")) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#0077B6] rounded-full"
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full mt-2 w-64 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-200"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Our Services
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to view details
                    </p>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {services.map((service) => (
                      <Link
                        key={service._id}
                        to={`/services/${service._id}`}
                        className="block px-4 py-3 hover:bg-[#0077B6]/5 text-gray-700 hover:text-[#0077B6] transition-colors border-b border-gray-100 last:border-b-0"
                        onClick={() => setIsServicesHovered(false)}
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-[#0077B6]/10 flex items-center justify-center mr-3 mt-0.5">
                            <FaStethoscope className="text-[#0077B6] text-xs" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {service.title}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                {service.duration} mins
                              </span>
                              {service.showPrice && (
                                <span className="text-xs font-semibold text-[#0077B6]">
                                  ₹{service.price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <Link
                      to="/services"
                      className="block text-center text-sm font-semibold text-[#0077B6] hover:text-[#005B8D]"
                      onClick={() => setIsServicesHovered(false)}
                    >
                      View All Services →
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Desktop Contact Icons with Slide Animation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Contact Items with Slide Animation */}
            {contactItems.map((item) => (
              <div key={item.id} className="relative">
                <motion.a
                  href={item.href}
                  target={item.target}
                  rel={item.target ? "noopener noreferrer" : undefined}
                  className="flex items-center overflow-hidden"
                  onMouseEnter={() => setHoveredContact(item.id)}
                  onMouseLeave={() => setHoveredContact(null)}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Icon Container */}
                  <div
                    className={`${item.bgColor} rounded-full p-3 ${item.color} transition-all duration-300`}
                  >
                    <div className="text-lg">{item.icon}</div>
                  </div>

                  {/* Text that slides in */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: hoveredContact === item.id ? "auto" : 0,
                      opacity: hoveredContact === item.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden whitespace-nowrap ml-3"
                  >
                    <span
                      className={`font-semibold ${item.hoverColor} text-sm`}
                    >
                      {item.text}
                    </span>
                  </motion.div>
                </motion.a>
              </div>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#0077B6]/10 flex items-center justify-center">
                      <FaUser className="text-[#0077B6] text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user?.name.split(" ")[0]}
                    </span>
                  </div>
                  <Button
                    size="md"
                    className="bg-[#0077B6] hover:bg-[#005B8D] text-white"
                    onClick={() =>
                      navigate(user?.role === "admin" ? "/admin" : "/profile")
                    }
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/10"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="md"
                    className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/10"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    size="md"
                    className="bg-[#0077B6] hover:bg-[#005B8D] text-white"
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
                  className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center ${item.color}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <button
              className="w-10 h-10 rounded-full bg-[#0077B6] flex items-center justify-center text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white shadow-xl rounded-b-lg overflow-hidden"
          >
            <div className="">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-6 py-1 text-lg font-semibold transition-all ${
                    isActive(link.path)
                      ? "bg-[#0077B6]/10 text-[#0077B6] border-l-4 border-[#0077B6]"
                      : "text-gray-700 hover:bg-[#0077B6]/5 hover:text-[#0077B6]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Services Link */}
              <Link
                to="/services"
                className={`block px-6 py-1 text-lg font-semibold transition-all ${
                  isActive("/services") || isActive("/services/")
                    ? "bg-[#0077B6]/10 text-[#0077B6] border-l-4 border-[#0077B6]"
                    : "text-gray-700 hover:bg-[#0077B6]/5 hover:text-[#0077B6]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>

              {/* Mobile Services Submenu */}
              <div className="pl-12 pr-6 py-1 bg-gray-50">
                {services.slice(0, 5).map((service) => (
                  <Link
                    key={service._id}
                    to={`/services/${service._id}`}
                    className="block py-2 text-sm text-gray-600 hover:text-[#0077B6] border-b border-gray-200 last:border-b-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-[#0077B6]/50 mr-3"></div>
                      <span className="truncate">{service.title}</span>
                    </div>
                  </Link>
                ))}
                {services.length > 5 && (
                  <Link
                    to="/services"
                    className="block py-2 text-sm font-medium text-[#0077B6]"
                    onClick={() => setIsOpen(false)}
                  >
                    + {services.length - 5} more services →
                  </Link>
                )}
              </div>

              {/* Mobile Contact Info */}
              <div className="px-6 py-2 mt-2 border-t border-gray-100 space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Contact
                </h3>
                {contactItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.target}
                    rel={item.target ? "noopener noreferrer" : undefined}
                    className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center ${item.color}`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
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
                      <div className="flex items-center space-x-3 p-3 bg-[#0077B6]/5 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-[#0077B6] flex items-center justify-center text-white">
                          <FaUser />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {user?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          fullWidth
                          className="bg-[#0077B6] text-white hover:bg-[#005B8D]"
                          onClick={() => {
                            navigate(
                              user?.role === "admin" ? "/admin" : "/profile",
                            );
                            setIsOpen(false);
                          }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          fullWidth
                          className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/10"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
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
                        className="bg-[#0077B6] text-white hover:bg-[#005B8D]"
                        onClick={() => {
                          navigate("/login");
                          setIsOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6]/10"
                        onClick={() => {
                          navigate("/register");
                          setIsOpen(false);
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
      </div>
    </motion.nav>
  );
};

export default Navbar;
