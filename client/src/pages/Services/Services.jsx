import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import ServiceCard from "../../components/ui/ServiceCard";
import { serviceService } from "../../services/service.service";
import { useApi } from "../../hooks/useApi";
import {
  FaFilter,
  FaSearch,
  FaSpinner,
  FaBone,
  FaBrain,
  FaRunning,
  FaChild,
  FaUserInjured,
  FaProcedures,
  FaStethoscope,
  FaUserMd,
  FaHandHoldingHeart,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABELS,
} from "../../utils/constants";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term) ||
          service.benefits.some((benefit) =>
            benefit.toLowerCase().includes(term),
          ),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory,
      );
    }

    setFilteredServices(filtered);
  };

  const categories = [
    {
      id: "all",
      label: "All Services",
      icon: <FaStethoscope />,
      count: services.length,
    },
    {
      id: SERVICE_CATEGORIES.MUSCULOSKELETAL,
      label: "Musculoskeletal",
      icon: <FaBone />,
      count: services.filter(
        (s) => s.category === SERVICE_CATEGORIES.MUSCULOSKELETAL,
      ).length,
    },
    {
      id: SERVICE_CATEGORIES.NEUROLOGICAL,
      label: "Neurological",
      icon: <FaBrain />,
      count: services.filter(
        (s) => s.category === SERVICE_CATEGORIES.NEUROLOGICAL,
      ).length,
    },
    {
      id: SERVICE_CATEGORIES.SPORTS,
      label: "Sports",
      icon: <FaRunning />,
      count: services.filter((s) => s.category === SERVICE_CATEGORIES.SPORTS)
        .length,
    },
    {
      id: SERVICE_CATEGORIES.PEDIATRIC,
      label: "Pediatric",
      icon: <FaChild />,
      count: services.filter((s) => s.category === SERVICE_CATEGORIES.PEDIATRIC)
        .length,
    },
    {
      id: SERVICE_CATEGORIES.GERIATRIC,
      label: "Geriatric",
      icon: <FaUserInjured />,
      count: services.filter((s) => s.category === SERVICE_CATEGORIES.GERIATRIC)
        .length,
    },
    {
      id: SERVICE_CATEGORIES.POSTOPERATIVE,
      label: "Post-Operative",
      icon: <FaProcedures />,
      count: services.filter(
        (s) => s.category === SERVICE_CATEGORIES.POSTOPERATIVE,
      ).length,
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Clinical Services | MEDIHOPE Physiotherapy - Evidence-Based Treatment
          Options
        </title>
        <meta
          name="description"
          content="Browse our evidence-based physiotherapy treatments including musculoskeletal, neurological, sports, pediatric, geriatric, and post-operative rehabilitation with specialist therapists."
        />
      </Helmet>

      {/* Hero Section - Premium Medical Intro */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Our <span className="text-primary-600">Clinical Services</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed max-w-3xl mx-auto">
              Evidence-based physiotherapy treatments delivered by specialist
              therapists. Each program is individually tailored to your
              condition and recovery goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span>Personalized treatment plans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span>Specialist-led therapy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span>Evidence-based approaches</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section with Enhanced Filter Area */}
      <section className="bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Clinical Directory Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Available Physiotherapy Treatments
                </h2>
                <p className="text-gray-600">
                  Select a treatment category or search for specific conditions
                </p>
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="font-semibold">{filteredServices.length}</span>{" "}
                of <span className="font-semibold">{services.length}</span>{" "}
                clinical services available
              </div>
            </div>
          </div>

          {/* Search & Filter Container - Clinic Directory Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            {/* <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-sm"> */}

            {/* Search + Filter Row */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by condition, symptom, or treatment name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    showFilters
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-primary-50 hover:border-primary-300"
                  }`}
                >
                  <FaFilter />
                  <span className="text-md font-medium hidden sm:inline">
                    Filters
                  </span>
                </button>

                {/* Dropdown */}
                {showFilters && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Treatment Categories
                    </p>

                    <div className="flex flex-col gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowFilters(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                            selectedCategory === category.id
                              ? "bg-primary-600 text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {category.icon}
                            <span>{category.label}</span>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              selectedCategory === category.id
                                ? "bg-white/20 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {category.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* </div> */}
          </motion.div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mb-4" />
              <p className="text-gray-600 font-medium">
                Loading clinical services...
              </p>
            </div>
          ) : filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FaSearch className="text-gray-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No matching treatments found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or select a different
                treatment category
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ServiceCard service={service} index={index} />
                  </motion.div>
                ))}
              </div>

              {/* No Results Message (fallback) */}
              {filteredServices.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    No services found
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Service Process Section - Clinical Pathway */}
      <section className="py-14 bg-gradient-to-b from-white to-primary-50">
  <div className="container mx-auto px-4 max-w-6xl">
    
    {/* Section Header */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-10"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Our <span className="text-primary-600">Clinical Pathway</span>
      </h2>
      <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
        A structured, evidence-based approach designed to guide you from
        initial assessment to long-term recovery with confidence.
      </p>
    </motion.div>

    {/* Pathway Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          step: "Assessment",
          icon: <FaClipboardCheck className="text-xl" />,
          title: "Comprehensive Evaluation",
          description:
            "In-depth assessment of medical history, physical function, and movement patterns to accurately understand your condition.",
        },
        {
          step: "Planning",
          icon: <FaUserMd className="text-xl" />,
          title: "Personalized Treatment Plan",
          description:
            "A tailored rehabilitation plan developed using clinical findings and evidence-based protocols aligned with your goals.",
        },
        {
          step: "Therapy",
          icon: <FaHandHoldingHeart className="text-xl" />,
          title: "Targeted Therapeutic Care",
          description:
            "Application of proven physiotherapy techniques including manual therapy, corrective exercises, and functional training.",
        },
        {
          step: "Recovery",
          icon: <FaStethoscope className="text-xl" />,
          title: "Progress & Long-Term Care",
          description:
            "Continuous monitoring, progression of therapy, and education to maintain improvements and prevent recurrence.",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
          className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
        >
          {/* Top Row */}
          <div className="flex items-center gap-4 mb-5">
            {/* Icon */}
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              {item.icon}
            </div>

            {/* Step Info */}
            <div>
              <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
                Step {index + 1}
              </span>
              <h4 className="text-sm font-bold text-gray-900">
                {item.step}
              </h4>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section - Reassuring Professional Care */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <FaUserMd className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Begin Your Recovery Journey
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Our specialist physiotherapists are ready to guide you through a
              personalized treatment plan focused on restoring function and
              improving your quality of life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/appointment"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                Book Clinical Assessment
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Speak to Our Team
              </a>
            </div>
            <p className="text-primary-200 text-sm mt-6">
              Initial consultations include comprehensive assessment and
              treatment plan discussion
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
