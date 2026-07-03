import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import hero from "../../assets/image/home.png";
import ImageGallerySlider from "./ImageGallerySlider";

const Home = () => {
  const [services, setServices] = useState([]);
  const { execute: fetchServices, loading: servicesLoading } = useApi(
    serviceService.getAllServices,
  );
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      const response = await fetchServices();
      if (response?.data) {
        // Filter only active services (backend already does this, but double-check)
        const activeServices = response.data.filter(
          (service) => service.isActive !== false,
        );
        setServices(activeServices);
      }
    };
    loadServices();
  }, []);

  const testimonials = useMemo(() => [
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
  ], []);


  const stats = useMemo(() => [
    {
      icon: <FaUserMd />,
      title: "Expert Physiotherapists",
      description: "Qualified professionals providing personalized therapy care",
    },
    {
      icon: <FaAward />,
      title: "Trusted Clinical Practice",
      description: "Ethical standards with proven physiotherapy methods",
    },
    {
      icon: <FaCheckCircle />,
      title: "Patient First Approach",
      description: "Focused on comfort, safety, and recovery outcomes",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Continuity of Care",
      description: "Planned sessions with consistent follow-up care",
    },
    {
      icon: <FaStethoscope />,
      title: "Modern Equipment",
      description: "Advanced tools for effective physiotherapy treatment",
    },
  ], []);

  const sliderSettings = useMemo(() => ({
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
          centerPadding: "32px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
  }), []);

  const handleServiceEnter = useCallback((serviceId) => {
    setHoveredService(serviceId);
  }, []);

  const handleServiceLeave = useCallback(() => {
    setHoveredService(null);
  }, []);

  return (
    <>
      <Helmet>
        <title>MEDIHOPE - Advanced Physiotherapy & Rehabilitation Center | Best Physiotherapy Clinic | MediHope PHI | Pain Relief & Rehabilitation</title>
        <meta
          name="description"
          content="MediHope PHI provides expert physiotherapy treatment for back pain, sports injuries, and rehabilitation with advanced therapy techniques.
          Evidence-based physiotherapy treatments for pain relief, mobility & recovery. Book your appointment today for professional care."
        />
        <meta
          name="keywords"
          content="physiotherapy, pain relief, rehabilitation, sports injury, back pain, neck pain, joint pain"
        />
      </Helmet>

      <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-cyan-100 pt-24 pb-12 sm:pt-28 md:pt-32 lg:pt-20 lg:pb-10">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left min-w-0"
            >
              {/* Premium Badge */}
              <div className="hidden lg:inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-cyan-100 text-cyan-700 px-5 py-2 rounded-full text-sm font-semibold shadow mb-5 ">
                <FaStethoscope />
                Physiotherapy • Osteopathy • Chiropractic
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-gray-800 leading-tight tracking-tight">
                Journey to a
                <span className="block mt-2 sm:mt-3 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400 bg-clip-text text-transparent">
                  Pain-Free Life
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 sm:mt-6 text-base sm:text-lg xl:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Our specialized team is dedicated to helping you regain your
                independence. We understand how important it is to move freely
                and comfortably. Our commitment is to provide you with the best
                possible care. We aim to significantly improve your overall
                well-being. Your journey towards better mobility starts with us.
              </p>

              {/* CTA SECTION – FIXED */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                {/* Book Consultation */}
                <Link to="/appointment" className="w-full sm:w-auto">
                  <button
                    className="
                      min-h-[52px] sm:min-h-[56px]
                      w-full sm:w-auto
                      px-5 sm:px-8
                      flex items-center justify-center
                      text-base sm:text-lg font-semibold
                      text-white
                      rounded-lg
                      bg-gradient-to-r from-cyan-600 to-cyan-500
                      hover:from-cyan-700 hover:to-cyan-600
                      shadow-lg hover:shadow-xl
                      transition-all
                    "
                  >
                    Book Free Consultation
                    <FaArrowRight className="ml-2 sm:ml-3 text-base sm:text-lg shrink-0" />
                  </button>
                </Link>

                {/* WhatsApp CTA – FIXED */}
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <div
                    className="
                      min-h-[52px] sm:min-h-[56px]
                      px-4 sm:px-6
                      flex items-center gap-4
                      rounded-lg
                      bg-white
                      border border-gray-200
                      shadow-md hover:shadow-lg
                      transition-all
                    "
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <FaWhatsapp className="text-white text-xl" />
                    </div>

                    <div className="leading-tight min-w-0 text-left">
                      <p className="text-xs text-gray-500">24/7 Support</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        Chat With Medihope
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-8 lg:mt-0 min-w-0"
            >
              {/* Hero Image Wrapper */}
              <div
                className="relative overflow-hidden group rounded-2xl sm:rounded-3xl"
              >
                <img
                  src={hero}
                  alt="Physiotherapy treatment at MEDIHOPE"
                  className=" w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Glass Card – MOBILE SAFE */}
              <div
                className=" absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto bg-white/85 backdrop-blur-md px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl"
              >
                <p className="text-lg sm:text-xl font-bold text-cyan-600">
                  Trusted Care
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Advanced Physiotherapy Center
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-10 mb-5 text-center text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 leading-relaxed tracking-tighter"
          >
            Leading physiotherapy center with
            <span className="block text-cyan-600 mt-2">
              state-of-the-art equipment & advanced techniques
            </span>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Slider Section */}
      <ImageGallerySlider />

      {/* Stats Section */}
      <section className="py-12 md:py-14 bg-white border-b border-gray-200">
  <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">

    {/* ================= HEADING ================= */}
    <div className="text-center mb-12 md:mb-16 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-gray-900/90 mb-4 md:mb-6 leading-tight">
        Committed to Excellence in Physiotherapy Care
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto">
        We believe in quality care, professional expertise, and patient-focused
        physiotherapy designed for long-term well-being.
      </p>
    </div>

    {/* ================= CARDS ================= */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-5 lg:gap-x-4 xl:gap-x-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative h-full bg-white rounded-2xl p-4 border border-gray-200 
                     shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Icon Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 
                            flex items-center justify-center shadow-lg">
              <div className="text-white text-2xl">
                {stat.icon}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-10 text-center">
            <h3 className="text-base xl:text-lg font-semibold text-gray-900 mb-3 leading-snug">
              {stat.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {stat.description}
            </p>

            {/* Bottom Trust Line */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-center gap-1 text-cyan-600">
                <FaCheckCircle className="text-sm" />
                <span className="text-xs font-medium leading-tight">
                  Quality Care Assurance
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>


      {/* Services Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="hidden lg:inline-flex items-center space-x-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaStethoscope />
              <span>Our Specialized Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Expert{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
                Physiotherapy
              </span>{" "}
              Services
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive physiotherapy treatments using advanced
              technology and evidence-based practices to ensure optimal
              recovery.
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {services.slice(0, 3).map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => handleServiceEnter(service._id)}
                  onMouseLeave={handleServiceLeave}
                  className="h-full"
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
            className="text-center mt-10 md:mt-12 md:-mb-8"
          >
            <Link to="/services">
              <Button
                size="lg"
                className="min-h-11 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl px-6 sm:px-8"
              >
                <span className="flex items-center justify-center gap-2">
                  View All Services
                  <FaArrowRight className="shrink-0" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaStar />
              <span>Patient Success Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Hear From Our{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
                Patients
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Real stories from real patients who transformed their lives with
              our expert physiotherapy treatments.
            </p>
          </motion.div>

          <div className="testimonial-slider px-0 md:px-4">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="px-1 sm:px-2 md:px-4">
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
      <section className="py-14 md:py-20 bg-gradient-to-r from-cyan-600 to-cyan-800">
  <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">

      {/* ================= MAIN CARD ================= */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ================= LEFT : HOME VISIT INFO ================= */}
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white p-5 sm:p-8 md:p-12 min-w-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
              Professional Physiotherapy at Your Home
            </h2>

            <p className="text-cyan-100 mb-6 md:mb-8 text-base sm:text-lg leading-relaxed">
              Our home visit physiotherapy service brings expert care directly
              to your doorstep. Ideal for elderly patients, post-surgery
              recovery, mobility limitations, or those who prefer treatment
              in the comfort of home.
            </p>

            {/* Home Visit Features */}
            <div className="space-y-3 sm:space-y-4 mb-8 md:mb-10">
              {[
                {
                  icon: <FaUserMd />,
                  text: "Experienced Physiotherapist Visit",
                },
                {
                  icon: <FaClock />,
                  text: "Flexible Appointment Scheduling",
                },
                {
                  icon: <FaHandsHelping />,
                  text: "Personalized One-on-One Therapy",
                },
                {
                  icon: <FaCheckCircle />,
                  text: "Safe, Hygienic & Professional Care",
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <span className="text-cyan-50 leading-snug">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Contact Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 overflow-hidden">
              <h4 className="text-xl font-semibold mb-4">
                Book a Home Visit
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <div className="text-sm text-cyan-200 mb-1">
                    Call for Appointment
                  </div>
                  <a
                    href={`tel:${CLINIC_INFO.phone}`}
                    className="text-xl sm:text-2xl font-bold hover:text-white transition-colors break-words"
                  >
                    {CLINIC_INFO.phone}
                  </a>
                </div>

                <div>
                  <div className="text-sm text-cyan-200 mb-1">
                    WhatsApp Support
                  </div>
                  <a
                    href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl sm:text-2xl font-bold hover:text-white transition-colors"
                  >
                    Chat Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT : HOME VISIT FORM ================= */}
          <div className="p-5 sm:p-8 md:p-12 min-w-0">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                Request Home Visit
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Fill in your details and our team will contact you shortly
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    className="min-h-11 w-full px-4 py-3 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="min-h-11 w-full px-4 py-3 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Visit Type *
                </label>
                <select
                  className="min-h-11 w-full px-4 py-3 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                >
                  <option>Select Visit Type</option>
                  <option>Post-Surgery Rehabilitation</option>
                  <option>Back / Neck Pain</option>
                  <option>Stroke Rehabilitation</option>
                  <option>Elderly Mobility Care</option>
                  <option>Sports Injury</option>
                  <option>Other Physiotherapy Needs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address & Additional Details
                </label>
                <textarea
                  rows="6"
                  className="w-full px-4 py-3 resize-none border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  placeholder="Complete address and brief description of the condition..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/appointment" className="flex-1 min-w-0">
                  <button
                    className="min-h-11 w-full bg-gradient-to-r from-cyan-600 to-cyan-500
                               text-white font-semibold px-4 py-3.5 rounded-lg
                               hover:from-cyan-700 hover:to-cyan-600
                               transition-all shadow-lg"
                  >
                    Submit Home Visit Request
                  </button>
                </Link>

                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0"
                >
                  <button
                    className="min-h-11 w-full flex items-center justify-center gap-2
                               bg-green-100 text-green-700 font-semibold px-4 py-3.5
                               rounded-lg hover:bg-green-200 transition-colors
                               border border-green-200"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span className="truncate">WhatsApp Us</span>
                  </button>
                </a>
              </div>

              <div className="text-center text-sm text-gray-500">
                Our team will confirm the visit at your preferred time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= QUICK CONTACT BAR ================= */}
      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex w-full min-w-0 items-center gap-3 sm:gap-4 md:w-auto">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <FaPhoneAlt className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-cyan-200">
                Home Visit Enquiries
              </div>
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="text-lg sm:text-xl font-bold text-white hover:text-cyan-100 break-words"
              >
                {CLINIC_INFO.phone}
              </a>
            </div>
          </div>

          <Link to="/contact" className="w-full md:w-auto">
            <button className="min-h-11 w-full md:w-auto bg-white text-cyan-600 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-50 transition-colors">
              Visit Contact Page
            </button>
          </Link>
        </div>
      </div>

    </div>
  </div>
</section>


      {/* Clinic Location Section */}
      <section className="py-14 md:py-20 bg-cyan-50">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <FaClock />
                    <span>Visit Our Facility</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Our <span className="text-cyan-600">Medical Center</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                State-of-the-art facility equipped with advanced medical
                technology for comprehensive physiotherapy care.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Clinic Information */}
              <div className="space-y-8">
                {/* Clinic Hours Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-3">
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
                        className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-2 py-3 border-b border-gray-100"
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
                </div>

                {/* Facilities Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
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

                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { name: "Wheelchair Access", icon: "♿" },
                      { name: "Free Parking", icon: "🅿️" },
                      { name: "AC Treatment Rooms", icon: "❄️" },
                      { name: "WiFi Lounge", icon: "📶" },
                      { name: "Pharmacy", icon: "💊" },
                      // { name: "Cafeteria", icon: "☕" },
                      { name: "Pick & Drop", icon: "🚑" },
                      // { name: "Insurance Desk", icon: "📄" },
                    ].map((facility, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
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
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-gray-900">
                          Location & Directions
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 break-words">{CLINIC_INFO.address}</p>
                      </div>
                      <Link to="/contact" className="w-full sm:w-auto">
                        <button className="min-h-11 w-full sm:w-auto flex items-center justify-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold">
                          <span>Get Directions</span>
                          <FaArrowRight />
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Enhanced Map Container */}
                  <div className="relative h-[320px] sm:h-[420px] lg:h-[500px]">
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
                    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg sm:max-w-xs">
                      <div className="flex items-center gap-3 mb-2">
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
                  <div className="p-4 sm:p-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      How to Reach
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                          <span className="text-cyan-600 font-bold">🚇</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Metro Station
                          </div>
                          <div className="text-sm text-gray-600">
                            3 km from Arjangargh
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold">🚌</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Cab Stand
                          </div>
                          <div className="text-sm text-gray-600">
                            500m from clinic
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default Home;
