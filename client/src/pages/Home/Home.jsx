import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import ServiceCard from '../../components/ui/ServiceCard';
import TestimonialCard from '../../components/ui/TestimonialCard';
import { serviceService } from '../../services/service.service';
import { FaPhoneAlt, FaWhatsapp, FaCheckCircle, FaUserMd, FaClock, FaHandsHelping } from 'react-icons/fa';
import { CLINIC_INFO } from '../../utils/constants';
import { useApi } from '../../hooks/useApi';
import Slider from 'react-slick';

const Home = () => {
  const [services, setServices] = useState([]);
  const { execute: fetchServices, loading: servicesLoading } = useApi(serviceService.getAllServices);

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
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      patientAge: 38,
      condition: "Sports Injury",
      content: "Professional care and state-of-the-art equipment helped me recover faster than expected. Highly recommended!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      patientName: "Suresh Patel",
      patientAge: 62,
      condition: "Arthritis Management",
      content: "The therapists are knowledgeable and caring. My mobility has improved significantly in just 8 weeks.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/65.jpg"
    },
  ];

  const whyChoosePoints = [
    {
      icon: <FaUserMd className="text-3xl" />,
      title: "Certified Therapists",
      description: "All our physiotherapists are licensed with minimum 5 years of clinical experience."
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Flexible Timings",
      description: "Open Monday to Saturday, 9 AM to 7 PM. Emergency appointments available."
    },
    {
      icon: <FaHandsHelping className="text-3xl" />,
      title: "Personalized Care",
      description: "Custom treatment plans tailored to individual needs and recovery goals."
    },
    {
      icon: <FaCheckCircle className="text-3xl" />,
      title: "Evidence-Based",
      description: "We use scientifically proven techniques and modern equipment for effective treatment."
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>MEDIHOPE - Professional Physiotherapy Care for a Pain-Free Life</title>
        <meta name="description" content="Evidence-based physiotherapy treatments for pain relief, mobility & recovery. Book your appointment today for professional care." />
        <meta name="keywords" content="physiotherapy, pain relief, rehabilitation, sports injury, back pain, neck pain, joint pain" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 pt-20">
        <div className="container-padding py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                Professional Physiotherapy Care for a{' '}
                <span className="text-primary-600">Pain-Free Life</span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8">
                Evidence-based physiotherapy treatments for pain relief, mobility & recovery.
                Our certified therapists provide personalized care to help you get back to your best.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/appointment">
                  <Button size="lg" className="w-full sm:w-auto">
                    Book Appointment
                  </Button>
                </Link>
                <a href={`tel:${CLINIC_INFO.phone}`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <FaPhoneAlt className="mr-2" />
                    Call Now
                  </Button>
                </a>
                <a href={`https://wa.me/${CLINIC_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <FaWhatsapp className="mr-2" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">500+</div>
                  <div className="text-sm text-secondary-600">Patients Treated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">15+</div>
                  <div className="text-sm text-secondary-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">98%</div>
                  <div className="text-sm text-secondary-600">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Physiotherapy treatment"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/75.jpg"
                      alt="Dr. Expert"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">Dr. Arjun Mehta</h4>
                    <p className="text-sm text-secondary-600">Head Physiotherapist</p>
                  </div>
                </div>
                <p className="text-secondary-600 text-sm">
                  "With over 15 years of experience, we're committed to providing the highest quality care for your recovery journey."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Our <span className="text-primary-600">Services</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Comprehensive physiotherapy services tailored to your specific needs and recovery goals.
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-secondary-200 rounded-lg mb-6"></div>
                  <div className="h-4 bg-secondary-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-secondary-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary-200 rounded"></div>
                    <div className="h-4 bg-secondary-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Medihope */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose <span className="text-primary-600">MEDIHOPE</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              We combine expertise, compassion, and modern technology for your complete recovery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoosePoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {point.title}
                </h3>
                <p className="text-secondary-600">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Patient <span className="text-primary-600">Testimonials</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Hear from our patients who have experienced life-changing results.
            </p>
          </motion.div>

          <div className="testimonial-slider">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="px-4">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Recovery Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-100">
              Take the first step towards a pain-free life. Book your consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/appointment">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                  Book Free Consultation
                </Button>
              </Link>
              <a href={`tel:${CLINIC_INFO.phone}`}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Call Now: {CLINIC_INFO.phone}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-8">
            Find Our <span className="text-primary-600">Clinic</span>
          </h2>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789012!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MEDIHOPE Clinic Location"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;