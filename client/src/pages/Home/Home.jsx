import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import ServiceCard from '../../components/ui/ServiceCard';
import TestimonialCard from '../../components/ui/TestimonialCard';
import { serviceService } from '../../services/service.service';
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
  FaAward
} from 'react-icons/fa';
import { CLINIC_INFO } from '../../utils/constants';
import { useApi } from '../../hooks/useApi';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [services, setServices] = useState([]);
  const { execute: fetchServices, loading: servicesLoading } = useApi(serviceService.getAllServices);
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      const response = await fetchServices({ featured: 'true' });
      if (response?.data) {
        setServices(response.data);
      }
    };
    loadServices();
  }, []);

  const testimonials = [
    {
      id: 1,
      patientName: "Rajesh Kumar",
      patientAge: 45,
      condition: "Chronic Back Pain",
      content: "After 6 months of suffering, MEDIHOPE gave me my life back. Their personalized treatment plan worked wonders!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      treatment: "Spinal Rehabilitation",
      duration: "8 Weeks"
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      patientAge: 38,
      condition: "Sports Injury",
      content: "Professional care and state-of-the-art equipment helped me recover faster than expected. Highly recommended!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      treatment: "Sports Physiotherapy",
      duration: "6 Weeks"
    },
    {
      id: 3,
      patientName: "Suresh Patel",
      patientAge: 62,
      condition: "Arthritis Management",
      content: "The therapists are knowledgeable and caring. My mobility has improved significantly in just 8 weeks.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      treatment: "Joint Pain Management",
      duration: "10 Weeks"
    },
    {
      id: 4,
      patientName: "Anjali Mehta",
      patientAge: 52,
      condition: "Post-Surgery Recovery",
      content: "Excellent post-operative care. The team helped me regain strength and confidence after knee replacement.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      treatment: "Post-Surgical Rehab",
      duration: "12 Weeks"
    },
  ];

  const stats = [
    {
      icon: <FaUserMd className="text-4xl" />,
      value: "5000+",
      label: "Patients Treated",
      description: "Successful recoveries"
    },
    {
      icon: <FaAward className="text-4xl" />,
      value: "15+",
      label: "Years Experience",
      description: "Clinical excellence"
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      value: "98%",
      label: "Success Rate",
      description: "Patient satisfaction"
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      value: "24/7",
      label: "Emergency Care",
      description: "Always available"
    }
  ];

  const conditions = [
    { icon: <FaHeartbeat />, name: "Back & Neck Pain", color: "bg-red-100 text-red-600" },
    { icon: <FaWalking />, name: "Arthritis", color: "bg-blue-100 text-blue-600" },
    { icon: <FaUserInjured />, name: "Sports Injuries", color: "bg-green-100 text-green-600" },
    { icon: <FaStethoscope />, name: "Post-Surgical Rehab", color: "bg-purple-100 text-purple-600" },
    { icon: <FaWalking />, name: "Stroke Rehabilitation", color: "bg-yellow-100 text-yellow-600" },
    { icon: <FaHeartbeat />, name: "Neurological Disorders", color: "bg-pink-100 text-pink-600" },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '60px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '30px',
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>MEDIHOPE - Advanced Physiotherapy & Rehabilitation Center</title>
        <meta name="description" content="Evidence-based physiotherapy treatments for pain relief, mobility & recovery. Book your appointment today for professional care." />
        <meta name="keywords" content="physiotherapy, pain relief, rehabilitation, sports injury, back pain, neck pain, joint pain" />
      </Helmet>

      {/* Hero Section with Medical Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-16 md:pt-20">
        {/* Background Medical Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <FaStethoscope />
                <span>Advanced Medical Care</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Your Journey to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Pain-Free Living
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
                Experience world-class physiotherapy with cutting-edge technology and 
                compassionate care. Our expert team is dedicated to restoring your 
                mobility and improving your quality of life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/appointment" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="flex items-center">
                      Book Free Consultation
                      <FaArrowRight className="ml-2" />
                    </span>
                  </Button>
                </Link>
                
                <div className="flex gap-4 justify-center sm:justify-start">
                  <a href={`tel:${CLINIC_INFO.phone}`} className="group">
                    <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <FaPhoneAlt />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold">Emergency Call</div>
                        <div className="font-bold">{CLINIC_INFO.phone}</div>
                      </div>
                    </div>
                  </a>
                  
                  <a href={`https://wa.me/${CLINIC_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <FaWhatsapp />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold">24/7 Support</div>
                        <div className="font-bold">WhatsApp</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Conditions We Treat */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Conditions We Treat:</h3>
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
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
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
                  className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl max-w-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                      <FaStar className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                      <div className="text-sm text-gray-600">Patient Rating</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Doctor Card */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl shadow-2xl max-w-sm"
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
                    <p className="text-blue-100">Head Physiotherapist & Director</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-300 text-sm" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-blue-50">
                  "With over 15 years of experience in sports medicine and rehabilitation, 
                  we're committed to providing evidence-based care for optimal recovery."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        >
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="font-semibold text-lg mb-1">{stat.label}</div>
                <div className="text-blue-100 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaStethoscope />
              <span>Our Specialized Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Expert <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Physiotherapy</span> Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive physiotherapy treatments using advanced technology 
              and evidence-based practices to ensure optimal recovery.
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
            className="text-center mt-16"
          >
            <Link to="/services">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl px-8"
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
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaStar />
              <span>Patient Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hear From Our <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Patients</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real stories from real patients who transformed their lives with our 
              expert physiotherapy treatments.
            </p>
          </motion.div>

          <div className="testimonial-slider px-4">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="px-4">
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
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <FaStethoscope className="text-6xl mx-auto mb-8 text-white/30" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Immediate Care When You Need It Most
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Don't let pain control your life. Our emergency physiotherapy services 
              are available 24/7 for immediate relief and care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/appointment" className="w-full sm:w-auto">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
                >
                  <span className="flex items-center justify-center">
                    <FaCalendarCheck className="mr-3" />
                    Emergency Appointment
                  </span>
                </Button>
              </Link>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <a href={`tel:${CLINIC_INFO.phone}`} className="group">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30">
                      <FaPhoneAlt className="text-2xl" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-blue-200">Call Now</div>
                      <div className="text-xl font-bold">{CLINIC_INFO.phone}</div>
                    </div>
                  </div>
                </a>
                
                <a href={`https://wa.me/${CLINIC_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all">
                    <div className="w-14 h-14 rounded-full bg-green-500/30 flex items-center justify-center group-hover:bg-green-500/40">
                      <FaWhatsapp className="text-2xl" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-green-200">WhatsApp</div>
                      <div className="text-xl font-bold">Instant Chat</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clinic Location Section */}
      <section id="location" className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Visit Our <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">State-of-the-Art</span> Clinic
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Modern facilities equipped with the latest technology for your complete recovery journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Clinic Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-blue-100">
                    <span className="font-semibold text-gray-700">Monday - Friday</span>
                    <span className="font-bold text-blue-600">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-blue-100">
                    <span className="font-semibold text-gray-700">Saturday</span>
                    <span className="font-bold text-blue-600">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-semibold text-gray-700">Sunday</span>
                    <span className="font-bold text-red-600">Emergency Only</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Facilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Advanced Equipment', 'Wheelchair Access', 'Free Parking', 'WiFi', 'AC Rooms', 'Emergency Care'].map((facility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789012!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MEDIHOPE Clinic Location"
                className="w-full h-[400px] md:h-[500px]"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;