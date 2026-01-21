import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import ServiceCard from "../../components/ui/ServiceCard";
import TestimonialCard from "../../components/ui/TestimonialCard";
import { serviceService } from "../../services/service.service";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaCheckCircle,
  FaUserMd,
  FaClock,
  FaHandsHelping,
  FaStethoscope,
  FaHeartbeat,
  FaWalking,
  FaUserInjured,
  FaArrowRight,
  FaStar,
  FaCalendarCheck,
  FaAward,
} from "react-icons/fa";
import { CLINIC_INFO } from "../../utils/constants";
import { useApi } from "../../hooks/useApi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [services, setServices] = useState([]);
  const { execute: fetchServices, loading: servicesLoading } = useApi(
    serviceService.getAllServices
  );
  const [hoveredService, setHoveredService] = useState(null);
  // Home.js के services state और useEffect के बाद ये dummy services add करें:

  // const [services, setServices] = useState([]);
  // const { execute: fetchServices, loading: servicesLoading } = useApi(
  // serviceService.getAllServices
  // );

  // Dummy services for when API doesn't return data
  const dummyServices = [
    {
      _id: "1",
      title: "Musculoskeletal Physiotherapy",
      description:
        "Comprehensive treatment for back pain, neck pain, and joint disorders using evidence-based techniques.",
      duration: 60,
      price: "800",
      category: "musculoskeletal",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Pain relief",
        "Improved mobility",
        "Strength restoration",
        "Posture correction",
      ],
      featured: true,
    },
    {
      _id: "2",
      title: "Neurological Rehabilitation",
      description:
        "Specialized care for stroke, Parkinson's, and other neurological conditions to improve function.",
      duration: 45,
      price: "1200",
      category: "neurological",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Neuroplasticity training",
        "Balance improvement",
        "Functional independence",
      ],
      featured: true,
    },
    {
      _id: "3",
      title: "Sports Injury Management",
      description:
        "Advanced techniques for athletes including injury prevention, treatment, and performance enhancement.",
      duration: 60,
      price: "1500",
      category: "sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Rapid recovery",
        "Performance optimization",
        "Injury prevention",
        "Sport-specific training",
      ],
      featured: true,
    },
    {
      _id: "4",
      title: "Geriatric Physiotherapy",
      description:
        "Age-appropriate exercises and treatments to maintain mobility and independence in older adults.",
      duration: 45,
      price: "700",
      category: "geriatric",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Fall prevention",
        "Balance training",
        "Pain management",
        "Mobility enhancement",
      ],
    },
    {
      _id: "5",
      title: "Post-Surgical Rehabilitation",
      description:
        "Structured recovery programs for patients after orthopedic and other surgeries.",
      duration: 60,
      price: "1000",
      category: "postoperative",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Faster recovery",
        "Reduced complications",
        "Scar management",
        "Strength rebuilding",
      ],
    },
    {
      _id: "6",
      title: "Pediatric Physiotherapy",
      description:
        "Specialized care for children with developmental delays, cerebral palsy, and other conditions.",
      duration: 45,
      price: "900",
      category: "pediatric",
      image:
        "https://images.unsplash.com/photo-1524860697450-60a5f14d13b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Developmental support",
        "Play-based therapy",
        "Parent education",
        "Milestone achievement",
      ],
    },
  ];

  useEffect(() => {
    const loadServices = async () => {
      const response = await fetchServices({ featured: "true" });
      if (response?.data && response.data.length > 0) {
        setServices(response.data);
      } else {
        // Use dummy services if API returns empty
        setServices(dummyServices);
      }
    };
    loadServices();
  }, []);

  // useEffect(() => {
  //   const loadServices = async () => {
  //     const response = await fetchServices({ featured: "true" });
  //     if (response?.data) {
  //       setServices(response.data);
  //     }
  //   };
  //   loadServices();
  // }, []);

  const testimonials = [
    {
      id: 1,
      patientName: "Rajesh Kumar",
      patientAge: 45,
      condition: "Chronic Back Pain",
      content:
        "After 6 months of suffering, MEDIHOPE gave me my life back. Their personalized treatment plan worked wonders!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      treatment: "Spinal Rehabilitation",
      duration: "8 Weeks",
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      patientAge: 38,
      condition: "Sports Injury",
      content:
        "Professional care and state-of-the-art equipment helped me recover faster than expected. Highly recommended!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      treatment: "Sports Physiotherapy",
      duration: "6 Weeks",
    },
    {
      id: 3,
      patientName: "Suresh Patel",
      patientAge: 62,
      condition: "Arthritis Management",
      content:
        "The therapists are knowledgeable and caring. My mobility has improved significantly in just 8 weeks.",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      treatment: "Joint Pain Management",
      duration: "10 Weeks",
    },
    {
      id: 4,
      patientName: "Anjali Mehta",
      patientAge: 52,
      condition: "Post-Surgery Recovery",
      content:
        "Excellent post-operative care. The team helped me regain strength and confidence after knee replacement.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      treatment: "Post-Surgical Rehab",
      duration: "12 Weeks",
    },
  ];

  const stats = [
    {
      icon: <FaUserMd className="text-4xl" />,
      value: "5000+",
      label: "Patients Treated",
      description: "Successful recoveries",
    },
    {
      icon: <FaAward className="text-4xl" />,
      value: "15+",
      label: "Years Experience",
      description: "Clinical excellence",
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      value: "98%",
      label: "Success Rate",
      description: "Patient satisfaction",
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      value: "24/7",
      label: "Emergency Care",
      description: "Always available",
    },
    {
      icon: <FaStethoscope className="text-4xl" />,
      value: "20+",
      label: "Certified Specialists",
      description: "Expert medical team",
    },
  ];

  const conditions = [
    {
      icon: <FaHeartbeat />,
      name: "Back & Neck Pain",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <FaWalking />,
      name: "Arthritis",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: <FaUserInjured />,
      name: "Sports Injuries",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: <FaHeartbeat />,
      name: "Neurological Disorders",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <FaStethoscope />,
      name: "Post-Surgical Rehab",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: <FaWalking />,
      name: "Stroke Rehabilitation",
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "30px",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>MEDIHOPE - Advanced Physiotherapy & Rehabilitation Center</title>
        <meta
          name="description"
          content="Evidence-based physiotherapy treatments for pain relief, mobility & recovery. Book your appointment today for professional care."
        />
        <meta
          name="keywords"
          content="physiotherapy, pain relief, rehabilitation, sports injury, back pain, neck pain, joint pain"
        />
      </Helmet>
      {/* Hero Section with Medical Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-cyan-50 pt-6 md:pt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
                <FaStethoscope />
                <span>Advanced Medical Care</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800/90 mb-6 leading-tight">
                Your Journey to{" "}
                <span className="bg-cyan-700/90 bg-clip-text text-transparent">
                  Pain-Free Living
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
                Experience world-class physiotherapy with cutting-edge
                technology and compassionate care. Our expert team is dedicated
                to restoring your mobility and improving your quality of life.
              </p>

              <div className="flex flex-col items-center justify-center sm:flex-row gap-4 mb-10">
                <Link to="/appointment" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-600/90 to-cyan-600 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="flex items-center">
                      Book Free Consultation
                      <FaArrowRight className="ml-2" />
                    </span>
                  </Button>
                </Link>

                <div className="flex gap-4 justify-center sm:justify-start">
                  <a href={`tel:${CLINIC_INFO.PHONE_FULL}`} className="group">
                    <div
                      className="flex items-center space-x-2 bg-white/70 backdrop-blur-md
                      border border-red-100/60
                      shadow-lg py-1.5 px-3 rounded-lg text-red-600 hover:text-red-700 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <FaPhoneAlt />
                      </div>

                      <div className="text-left">
                        <div className="text-xs font-semibold ml-1">
                          Emergency Call
                        </div>

                        {/* Desktop / Laptop */}
                        <div className="hidden md:block font-bold">
                          {CLINIC_INFO.PHONE_FULL}
                        </div>

                        {/* Mobile */}
                        <div className="block md:hidden font-bold">
                          {CLINIC_INFO.PHONE_MOBILE}
                        </div>
                      </div>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div
                      className="flex items-center space-x-2 text-green-600 bg-white/70 backdrop-blur-md
                      border border-green-100/60
                      shadow-lg py-1.5 px-3 rounded-lg hover:text-green-700 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100  flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <FaWhatsapp />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold">
                          24/7 Support
                        </div>
                        <div className="font-bold">WhatsApp</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Conditions We Treat */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Conditions We Treat:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${condition.color} px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2`}
                    >
                      {condition.icon}
                      <span>{condition.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Hero Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Physiotherapy treatment at MEDIHOPE"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Floating Stats Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-2 right-3 bg-white/35 backdrop-blur-sm p-3 rounded-2xl shadow-xl max-w-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center">
                      <FaStar className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="text-xl flex items-center justify-center font-bold text-gray-900">
                        4.9/5
                      </div>
                      <div className="text-xs text-gray-600">
                        Patient Rating
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Doctor Card */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-1 lg:-bottom-8 -left-3 lg:-left-12 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white p-6 rounded-2xl shadow-2xl max-w-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/30">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Dr. Arjun Mehta"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Dr. Arjun Mehta</h4>
                    <p className="text-cyan-100">
                      Head Physiotherapist & Director
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className="text-yellow-300 text-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-cyan-50">
                  "With over 15 years of experience in sports medicine and
                  rehabilitation, we're committed to providing evidence-based
                  care for optimal recovery."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800/90 mb-8">
              Trusted By Thousands of Patients
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence is reflected in the numbers. Every
              statistic represents a life improved through our care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Medical Badge */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 flex items-center justify-center shadow-lg">
                    <div className="text-white text-2xl">{stat.icon}</div>
                  </div>
                </div>

                <div className="pt-8 text-center">
                  {/* Value with Medical Styling */}
                  <div className="mb-3">
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </div>
                  {/* Description */}
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.description}
                  </p>

                  {/* Medical Certificate-like Border Bottom */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-1 text-cyan-600">
                      <FaCheckCircle className="text-sm" />
                      <span className="text-xs font-medium">
                        Certified Excellence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 pt-8 border-t border-gray-200 md:-mb-10">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "ISO Certified", value: "9001:2015" },
                  { label: "NABH Standards", value: "Compliant" },
                  { label: "Doctors Panel", value: "25+ Experts" },
                  { label: "Treatment Rooms", value: "15+" },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold text-gray-800/90 mb-2">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaStethoscope />
              <span>Our Specialized Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Expert{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
                Physiotherapy
              </span>{" "}
              Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive physiotherapy treatments using advanced
              technology and evidence-based practices to ensure optimal
              recovery.
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse rounded-2xl">
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-2xl mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredService(service._id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <ServiceCard
                    service={service}
                    index={index}
                    isHovered={hoveredService === service._id}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 -mb-8"
          >
            <Link to="/services">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl px-8"
              >
                <span className="flex items-center">
                  View All Services
                  <FaArrowRight className="ml-2" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaStar />
              <span>Patient Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hear From Our{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
                Patients
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real stories from real patients who transformed their lives with
              our expert physiotherapy treatments.
            </p>
          </motion.div>

          <div className="testimonial-slider md:px-4">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="px-1 md:px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      index={index}
                      className="transform hover:-translate-y-2 transition-transform duration-300"
                    />
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      {/* Emergency CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-cyan-600 to-cyan-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Emergency Info */}
                <div className="bg-gradient-to-br from-cyan-600 to-cyan-600 text-white p-8 md:p-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <FaStethoscope className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-cyan-100">
                        24/7 EMERGENCY
                      </div>
                      <div className="text-xl font-bold">
                        Critical Care Unit
                      </div>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Immediate Medical Attention When You Need It
                  </h2>

                  <p className="text-cyan-100 mb-8 text-lg">
                    Our emergency physiotherapy unit is equipped to handle acute
                    pain, sports injuries, and post-surgical complications.
                    Immediate consultation available 24/7.
                  </p>

                  {/* Emergency Features */}
                  <div className="space-y-4 mb-10">
                    {[
                      {
                        icon: <FaClock />,
                        text: "Immediate Response - Under 30 Minutes",
                      },
                      {
                        icon: <FaUserMd />,
                        text: "Senior Specialist Available 24/7",
                      },
                      {
                        icon: <FaCheckCircle />,
                        text: "Advanced Emergency Equipment",
                      },
                      {
                        icon: <FaHandsHelping />,
                        text: "Ambulance Service Available",
                      },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          {feature.icon}
                        </div>
                        <span className="text-cyan-50">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Emergency Numbers */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4">
                      Emergency Contact Numbers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-cyan-200 mb-1">
                          Medical Emergency
                        </div>
                        <a
                          href={`tel:${CLINIC_INFO.phone}`}
                          className="text-2xl font-bold hover:text-white transition-colors"
                        >
                          {CLINIC_INFO.phone}
                        </a>
                      </div>
                      <div>
                        <div className="text-sm text-cyan-200 mb-1">
                          Ambulance Service
                        </div>
                        <div className="text-2xl font-bold">102 / 108</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - CTA Form */}
                <div className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Book Emergency Appointment
                    </h3>
                    <p className="text-gray-600">
                      Fill this form for immediate medical attention
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Type *
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                        <option>Select Emergency Type</option>
                        <option>Severe Pain</option>
                        <option>Sports Injury</option>
                        <option>Post-Surgical Complication</option>
                        <option>Accident/ Trauma</option>
                        <option>Other Emergency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Details
                      </label>
                      <textarea
                        rows="8"
                        className="w-full px-4 py-3 resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="Brief description of the emergency..."
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/appointment" className="flex-1">
                        <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold py-3.5 rounded-lg hover:from-cyan-700 hover:to-cyan-600 transition-all shadow-lg">
                          Submit Emergency Request
                        </button>
                      </Link>

                      <a
                        href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <button className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-700 font-semibold py-3.5 rounded-lg hover:bg-green-200 transition-colors border border-green-200">
                          <FaWhatsapp className="text-lg" />
                          <span>Chat on WhatsApp</span>
                        </button>
                      </a>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      <p>
                        Our emergency team will contact you within 10 minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Bar */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FaPhoneAlt className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-cyan-200">
                      Non-Emergency Inquiries
                    </div>
                    <a
                      href={`tel:${CLINIC_INFO.phone}`}
                      className="text-xl font-bold text-white hover:text-cyan-100 transition-colors"
                    >
                      {CLINIC_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FaWhatsapp className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-cyan-200">
                      General Consultation
                    </div>
                    <a
                      href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-white hover:text-cyan-100 transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <Link to="/contact">
                  <button className="bg-white text-cyan-600 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-50 transition-colors">
                    Visit Contact Page
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Location Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <FaClock />
                    <span>Visit Our Facility</span>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-cyan-600">Medical Center</span>
              </h2>

              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                State-of-the-art facility equipped with advanced medical
                technology for comprehensive physiotherapy care.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Clinic Information */}
              <div className="space-y-8">
                {/* Clinic Hours Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <FaClock className="text-2xl text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Clinic Hours
                      </h3>
                      <p className="text-sm text-gray-600">
                        Walk-in and appointment schedule
                      </p>
                    </div>
                  </div>

                  <div className="">
                    {[
                      {
                        day: "Monday - Friday",
                        time: "8:00 AM - 8:00 PM",
                        status: "Open",
                      },
                      {
                        day: "Saturday",
                        time: "8:00 AM - 6:00 PM",
                        status: "Open",
                      },
                      {
                        day: "Sunday",
                        time: "9:00 AM - 1:00 PM",
                        status: "Emergency Only",
                      },
                    ].map((schedule, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            {schedule.day}
                          </div>
                          <div className="text-sm text-gray-600">
                            {schedule.time}
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            schedule.status === "Open"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {schedule.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-3 bg-cyan-50 rounded-xl">
                    <div className="flex items-center">
                      <FaClock className="text-cyan-600 mr-3" />
                      <div>
                        <div className="text-sm font-semibold text-cyan-700">
                          Emergency Services
                        </div>
                        <div className="text-sm text-gray-700">
                          Available 24/7 with prior appointment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facilities Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <FaAward className="text-2xl text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="lg:text-xl font-bold text-gray-900">
                        Facilities & Amenities
                      </h3>
                      <p className="text-sm text-gray-600">
                        Modern healthcare infrastructure
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Wheelchair Access", icon: "♿" },
                      { name: "Free Parking", icon: "🅿️" },
                      { name: "AC Treatment Rooms", icon: "❄️" },
                      { name: "WiFi Lounge", icon: "📶" },
                      { name: "Pharmacy", icon: "💊" },
                      { name: "Cafeteria", icon: "☕" },
                      { name: "Ambulance Service", icon: "🚑" },
                      { name: "Insurance Desk", icon: "📄" },
                    ].map((facility, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-lg">{facility.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {facility.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Map */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden h-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Location & Directions
                        </h3>
                        <p className="text-gray-600">{CLINIC_INFO.address}</p>
                      </div>
                      <Link to="/contact">
                        <button className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-semibold">
                          <span>Get Directions</span>
                          <FaArrowRight />
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Enhanced Map Container */}
                  <div className="relative h-[500px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789012!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="MEDIHOPE Clinic Location"
                      className="absolute inset-0"
                    ></iframe>

                    {/* Map Overlay Info */}
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                          <FaStethoscope className="text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            MEDIHOPE Center
                          </div>
                          <div className="text-sm text-gray-600">
                            Main Building
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p>Free parking available at basement</p>
                        <p>Wheelchair ramp at main entrance</p>
                      </div>
                    </div>
                  </div>

                  {/* Transportation Options */}
                  <div className="p-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      How to Reach
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                          <span className="text-cyan-600 font-bold">🚇</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Metro Station
                          </div>
                          <div className="text-sm text-gray-600">
                            500m from MG Road
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold">🚌</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Bus Stop
                          </div>
                          <div className="text-sm text-gray-600">
                            100m from clinic
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-bold">🚗</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Parking
                          </div>
                          <div className="text-sm text-gray-600">
                            50+ slots available
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <FaPhoneAlt className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-xs">
                              Phone Consultation
                            </h4>
                            <a
                              href={`tel:${CLINIC_INFO.phone}`}
                              className="text-sm md:text-md semi-bold hover:text-cyan-100"
                            >
                              {CLINIC_INFO.PHONE_FULL}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <FaWhatsapp className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-xs">
                              WhatsApp Support
                            </h4>
                            <a
                              href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" text-sm md:text-md semi-bold hover:text-cyan-100"
                            >
                              Chat Now
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-cyan-800 to-cyan-900 text-white rounded-xl p-2">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <FaClock className="text-md" />
                          </div>
                          <div>
                            <h4 className="text-xs">Email Support</h4>
                            <a
                              href={`mailto:${CLINIC_INFO.email}`}
                              className="text-sm md:text-md semi-bold hover:text-gray-100"
                            >
                              {CLINIC_INFO.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
