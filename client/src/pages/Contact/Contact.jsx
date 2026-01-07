import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { contactService } from '../../services/contact.service';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane
} from 'react-icons/fa';
import { CLINIC_INFO } from '../../utils/constants';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute: sendMessage } = useApi(contactService.sendMessage);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await sendMessage(data);
      
      if (response?.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        reset();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      title: "Our Address",
      content: CLINIC_INFO.address,
      link: `https://maps.google.com/?q=${encodeURIComponent(CLINIC_INFO.address)}`
    },
    {
      icon: <FaPhoneAlt className="text-xl" />,
      title: "Phone Number",
      content: CLINIC_INFO.phone,
      link: `tel:${CLINIC_INFO.phone}`
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      title: "Email Address",
      content: CLINIC_INFO.email,
      link: `mailto:${CLINIC_INFO.email}`
    },
    {
      icon: <FaClock className="text-xl" />,
      title: "Working Hours",
      content: (
        <>
          <div>Mon-Fri: {CLINIC_INFO.workingHours.weekdays}</div>
          <div>Saturday: {CLINIC_INFO.workingHours.saturday}</div>
          <div>Sunday: {CLINIC_INFO.workingHours.sunday}</div>
        </>
      )
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: "#", label: "Facebook" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaWhatsapp />, href: `https://wa.me/${CLINIC_INFO.whatsapp}`, label: "WhatsApp" }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | MEDIHOPE Physiotherapy - Get in Touch</title>
        <meta name="description" content="Contact MEDIHOPE Physiotherapy Centre for appointments, queries, or emergency care. We're here to help you on your recovery journey." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-20">
        <div className="container-padding py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                Get in <span className="text-primary-600">Touch</span>
              </h1>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                We're here to help you on your recovery journey. 
                Reach out to us for appointments, queries, or emergency care.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Contact Information */}
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900 mb-2">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-secondary-600 hover:text-primary-600 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <div className="text-secondary-600">{info.content}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card"
                >
                  <h3 className="font-semibold text-secondary-900 mb-4">
                    Connect With Us
                  </h3>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 hover:bg-primary-600 hover:text-white transition-colors"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Emergency Contact */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="card bg-red-50 border-red-200"
                >
                  <h3 className="font-semibold text-red-900 mb-3">
                    ⚠️ Emergency Contact
                  </h3>
                  <p className="text-red-700 mb-4 text-sm">
                    For urgent medical assistance or severe pain:
                  </p>
                  <a
                    href="tel:+91-9876543210"
                    className="inline-flex items-center justify-center w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <FaPhoneAlt className="mr-2" />
                    Emergency: +91-9876543210
                  </a>
                </motion.div>
              </div>

              {/* Middle Column - Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        type="text"
                        placeholder="Enter your name"
                        error={errors.name?.message}
                        required
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                      />

                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        required
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Enter a valid email address'
                          }
                        })}
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        error={errors.phone?.message}
                        {...register('phone', {
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Enter a valid 10-digit phone number'
                          }
                        })}
                      />

                      <Input
                        label="Subject"
                        type="text"
                        placeholder="What is this regarding?"
                        error={errors.subject?.message}
                        required
                        {...register('subject', {
                          required: 'Subject is required',
                          minLength: {
                            value: 3,
                            message: 'Subject must be at least 3 characters'
                          }
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Type your message here..."
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        {...register('message', {
                          required: 'Message is required',
                          minLength: {
                            value: 10,
                            message: 'Message must be at least 10 characters'
                          }
                        })}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-secondary-500">
                        We typically respond within 24 hours
                      </div>
                      <Button
                        type="submit"
                        loading={isSubmitting}
                        className="flex items-center"
                      >
                        <FaPaperPlane className="mr-2" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                </motion.div>

                {/* Google Maps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 card p-0 overflow-hidden"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789012!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MEDIHOPE Clinic Location"
                  ></iframe>
                </motion.div>
              </div>
            </div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-center text-secondary-900 mb-8">
                Frequently Asked <span className="text-primary-600">Questions</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What should I bring to my first appointment?",
                    answer: "Please bring your photo ID, any relevant medical reports, X-rays, MRI scans, and a list of medications you're currently taking."
                  },
                  {
                    question: "How long does each session last?",
                    answer: "Initial assessments typically take 45-60 minutes. Follow-up sessions are 30-45 minutes depending on your treatment plan."
                  },
                  {
                    question: "Do I need a doctor's referral?",
                    answer: "No, you don't need a referral to see our physiotherapists. However, having your doctor's notes can help us better understand your condition."
                  },
                  {
                    question: "What are your payment options?",
                    answer: "We accept cash, credit/debit cards, UPI, and most health insurance plans. Please check with your insurance provider for coverage details."
                  }
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <h4 className="font-semibold text-secondary-900 mb-3">
                      {faq.question}
                    </h4>
                    <p className="text-secondary-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;