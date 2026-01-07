import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ServiceCard from '../../components/ui/ServiceCard';
import { serviceService } from '../../services/service.service';
import { useApi } from '../../hooks/useApi';
import { 
  FaFilter, 
  FaSearch, 
  FaSpinner,
  FaBone,
  FaBrain,
  FaRunning,
  FaChild,
  FaUserInjured,
  FaProcedures 
} from 'react-icons/fa';
import { SERVICE_CATEGORIES, SERVICE_CATEGORY_LABELS } from '../../utils/constants';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const { execute: fetchServices } = useApi(serviceService.getAllServices);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, services]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await fetchServices();
      if (response?.data) {
        setServices(response.data);
        setFilteredServices(response.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        service.benefits.some(benefit => benefit.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  };

  const categories = [
    { id: 'all', label: 'All Services', icon: <FaFilter />, count: services.length },
    { id: SERVICE_CATEGORIES.MUSCULOSKELETAL, label: 'Musculoskeletal', icon: <FaBone />, 
      count: services.filter(s => s.category === SERVICE_CATEGORIES.MUSCULOSKELETAL).length },
    { id: SERVICE_CATEGORIES.NEUROLOGICAL, label: 'Neurological', icon: <FaBrain />,
      count: services.filter(s => s.category === SERVICE_CATEGORIES.NEUROLOGICAL).length },
    { id: SERVICE_CATEGORIES.SPORTS, label: 'Sports', icon: <FaRunning />,
      count: services.filter(s => s.category === SERVICE_CATEGORIES.SPORTS).length },
    { id: SERVICE_CATEGORIES.PEDIATRIC, label: 'Pediatric', icon: <FaChild />,
      count: services.filter(s => s.category === SERVICE_CATEGORIES.PEDIATRIC).length },
    { id: SERVICE_CATEGORIES.GERIATRIC, label: 'Geriatric', icon: <FaUserInjured />,
      count: services.filter(s => s.category === SERVICE_CATEGORIES.GERIATRIC).length },
    { id: SERVICE_CATEGORIES.POSTOPERATIVE, label: 'Post-Operative', icon: <FaProcedures />,
      count: services.filter(s => s.category === SERVICE_CATEGORIES.POSTOPERATIVE).length },
  ];

  return (
    <>
      <Helmet>
        <title>Our Services | MEDIHOPE Physiotherapy - Comprehensive Treatment Options</title>
        <meta name="description" content="Explore our comprehensive physiotherapy services including musculoskeletal, neurological, sports, pediatric, geriatric, and post-operative rehabilitation." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Our <span className="text-primary-600">Services</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Comprehensive physiotherapy services tailored to your specific needs. 
              Each treatment plan is personalized for optimal recovery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-grow max-w-xl">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search services by name or benefit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Service Count */}
              <div className="text-secondary-600">
                Showing <span className="font-semibold">{filteredServices.length}</span> of{' '}
                <span className="font-semibold">{services.length}</span> services
              </div>
            </div>

            {/* Category Filters */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedCategory === category.id
                        ? 'bg-white/20'
                        : 'bg-secondary-200'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mb-4" />
              <p className="text-secondary-600">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-secondary-900 mb-4">
                No services found
              </h3>
              <p className="text-secondary-600 mb-8">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <ServiceCard key={service._id} service={service} index={index} />
                ))}
              </div>

              {/* No Results Message */}
              {filteredServices.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-semibold text-secondary-900 mb-4">
                    No services found
                  </h3>
                  <p className="text-secondary-600 mb-8">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Our <span className="text-primary-600">Process</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              From initial assessment to full recovery, we guide you through every step.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Initial Assessment',
                description: 'Comprehensive evaluation including medical history, physical examination, and goal setting.'
              },
              {
                step: '02',
                title: 'Treatment Plan',
                description: 'Personalized plan based on assessment findings and recovery objectives.'
              },
              {
                step: '03',
                title: 'Therapy Sessions',
                description: 'Regular sessions incorporating evidence-based techniques and exercises.'
              },
              {
                step: '04',
                title: 'Progress Tracking',
                description: 'Ongoing monitoring and adjustment of treatment for optimal results.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center relative"
              >
                <div className="text-5xl font-bold text-primary-100 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary-600">
                  {step.description}
                </p>
                {index < 3 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-primary-200"></div>
                    <div className="w-0.5 h-8 bg-primary-200 mx-auto"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-padding text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Treatment?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-100">
              Book your initial assessment today and take the first step towards recovery.
            </p>
            <a
              href="/appointment"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Book Your Assessment
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;