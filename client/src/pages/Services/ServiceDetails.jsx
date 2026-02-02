import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { serviceService } from '../../services/service.service';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  FaStethoscope,
  FaUserMd,
  FaHeartbeat,
  FaBrain,
  FaRunning,
  FaChild,
  FaUserInjured,
  FaProcedures,
  FaHandsHelping,
  FaCheckCircle,
  FaCalendarAlt,
  FaArrowLeft,
  FaBone,
  FaWalking,
  FaBalanceScale,
  FaMountain,
  FaUserCheck,
  FaClipboardCheck,
  FaChevronRight
} from 'react-icons/fa';
import { SERVICE_CATEGORY_LABELS, SERVICE_CATEGORIES } from '../../utils/constants';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await serviceService.getServiceById(id);
        if (response.success && response.data) {
          setService(response.data);
        } else {
          setError('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Get category-specific icon and color
  const getCategoryConfig = (category) => {
    switch(category) {
      case SERVICE_CATEGORIES.MUSCULOSKELETAL:
        return { 
          icon: <FaBone className="text-xl" />, 
          color: 'bg-blue-600 text-white',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case SERVICE_CATEGORIES.NEUROLOGICAL:
        return { 
          icon: <FaBrain className="text-xl" />, 
          color: 'bg-purple-600 text-white',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case SERVICE_CATEGORIES.SPORTS:
        return { 
          icon: <FaRunning className="text-xl" />, 
          color: 'bg-green-600 text-white',
          badgeColor: 'bg-green-100 text-green-800 border-green-200'
        };
      case SERVICE_CATEGORIES.PEDIATRIC:
        return { 
          icon: <FaChild className="text-xl" />, 
          color: 'bg-pink-600 text-white',
          badgeColor: 'bg-pink-100 text-pink-800 border-pink-200'
        };
      case SERVICE_CATEGORIES.GERIATRIC:
        return { 
          icon: <FaUserInjured className="text-xl" />, 
          color: 'bg-amber-600 text-white',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case SERVICE_CATEGORIES.POSTOPERATIVE:
        return { 
          icon: <FaProcedures className="text-xl" />, 
          color: 'bg-red-600 text-white',
          badgeColor: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return { 
          icon: <FaStethoscope className="text-xl" />, 
          color: 'bg-primary-600 text-white',
          badgeColor: 'bg-primary-100 text-primary-800 border-primary-200'
        };
    }
  };

  // Generate clinical outcomes based on service category
  const getClinicalOutcomes = (category, benefits) => {
    const baseBenefits = benefits || [];
    
    const categoryOutcomes = {
      [SERVICE_CATEGORIES.MUSCULOSKELETAL]: [
        "Restoration of pain-free movement patterns",
        "Correction of biomechanical imbalances",
        "Improved joint stability and function",
        "Enhanced postural awareness and control",
        "Reduced risk of recurrent injury"
      ],
      [SERVICE_CATEGORIES.NEUROLOGICAL]: [
        "Improved neuromuscular coordination",
        "Enhanced balance and proprioception",
        "Functional mobility restoration",
        "Activities of daily living independence",
        "Quality of life enhancement"
      ],
      [SERVICE_CATEGORIES.SPORTS]: [
        "Sport-specific functional recovery",
        "Performance optimization techniques",
        "Injury prevention strategies",
        "Safe return to competitive activity",
        "Enhanced athletic resilience"
      ],
      [SERVICE_CATEGORIES.PEDIATRIC]: [
        "Achievement of developmental milestones",
        "Improved motor planning and execution",
        "Functional play and activity participation",
        "Family-centered therapy integration",
        "Developmental progression support"
      ],
      [SERVICE_CATEGORIES.GERIATRIC]: [
        "Fall prevention and risk reduction",
        "Maintenance of functional independence",
        "Strength and endurance preservation",
        "Safe mobility and transfer training",
        "Chronic condition management"
      ],
      [SERVICE_CATEGORIES.POSTOPERATIVE]: [
        "Optimal surgical outcome support",
        "Phased recovery protocol adherence",
        "Scar tissue and edema management",
        "Restoration of functional strength",
        "Gradual return to daily activities"
      ]
    };

    // Combine and limit outcomes
    const allOutcomes = [
      ...baseBenefits.slice(0, 3),
      ...(categoryOutcomes[category] || []).slice(0, 3)
    ];
    return [...new Set(allOutcomes)].slice(0, 4);
  };

  // Get clinical explanation
  const getClinicalExplanation = (category) => {
    const explanations = {
      [SERVICE_CATEGORIES.MUSCULOSKELETAL]: "Our musculoskeletal specialists employ evidence-based assessment and manual therapy techniques to identify and address the root causes of pain and dysfunction, focusing on restoring optimal biomechanics and functional movement patterns.",
      [SERVICE_CATEGORIES.NEUROLOGICAL]: "Our neurorehabilitation program utilizes neuroplasticity principles through task-specific training and therapeutic exercises to retrain neural pathways, improving motor control, coordination, and functional independence.",
      [SERVICE_CATEGORIES.SPORTS]: "Our sports physiotherapy protocols emphasize functional rehabilitation through sport-specific exercises and biomechanical analysis, ensuring athletes return to peak performance with enhanced resilience and reduced re-injury risk.",
      [SERVICE_CATEGORIES.PEDIATRIC]: "Our pediatric specialists employ developmentally appropriate interventions through play-based therapy and family-centered approaches, supporting motor skill acquisition and functional independence in daily activities.",
      [SERVICE_CATEGORIES.GERIATRIC]: "Our geriatric rehabilitation focuses on preserving functional capacity through safe, progressive exercises that address age-related changes while prioritizing mobility, balance, and fall prevention strategies.",
      [SERVICE_CATEGORIES.POSTOPERATIVE]: "Our post-operative rehabilitation follows evidence-based protocols that respect tissue healing timelines while progressively restoring function, strength, and mobility through phased therapeutic interventions."
    };
    return explanations[category] || "Our evidence-based approach combines clinical expertise with personalized treatment planning to achieve optimal functional outcomes through targeted therapeutic interventions.";
  };

  // Get treatment process steps
  const getTreatmentProcess = (category) => {
    const commonSteps = [
      "Comprehensive initial assessment and evaluation",
      "Development of personalized treatment plan",
      "Implementation of evidence-based interventions",
      "Progressive functional restoration"
    ];

    const categorySpecific = {
      [SERVICE_CATEGORIES.MUSCULOSKELETAL]: [
        "Biomechanical assessment and movement analysis",
        "Manual therapy and soft tissue techniques",
        "Corrective exercise prescription",
        "Functional movement re-education"
      ],
      [SERVICE_CATEGORIES.NEUROLOGICAL]: [
        "Neurological examination and functional assessment",
        "Neurodevelopmental treatment approaches",
        "Balance and coordination training",
        "Activities of daily living practice"
      ]
    };

    return categorySpecific[category] || commonSteps;
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !service) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Service Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/services')}>
                <FaArrowLeft className="mr-2" />
                Back to Services
              </Button>
              <Button variant="outline" onClick={() => navigate('/appointment')}>
                <FaCalendarAlt className="mr-2" />
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryConfig = getCategoryConfig(service.category);
  const clinicalOutcomes = getClinicalOutcomes(service.category, service.benefits);
  const clinicalExplanation = getClinicalExplanation(service.category);
  const treatmentProcess = getTreatmentProcess(service.category);

  return (
    <>
      <Helmet>
        <title>{service.title} | MEDIHOPE Physiotherapy Clinic</title>
        <meta name="description" content={`Clinical ${service.title} treatment at MEDIHOPE. Evidence-based ${SERVICE_CATEGORY_LABELS[service.category].toLowerCase()} rehabilitation with specialist physiotherapists.`} />
      </Helmet>

      {/* SECTION 1: Full-Width Hero Clinical Intro */}
      <section className="relative pt-8 pb-20 lg:pt-24 lg:pb-24 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={service.image?.url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/80 to-gray-900/70"></div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 container mx-auto px-4 max-w-7xl">
          <Link
            to="/services"
            className="inline-flex items-center text-white/90 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <FaArrowLeft className="mr-2" />
            Back to All Services
          </Link>
        </div>

        {/* Hero Content - Centered */}
        <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Service Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {service.title}
            </h1>

            {/* Clinical Introduction */}
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {clinicalExplanation}
              </p>
            </div>

            {/* Primary CTA */}
            <div className="pt-4">
              <Button
                size="xl"
                className={`${categoryConfig.color} hover:opacity-90 px-10 py-5 text-lg font-semibold shadow-lg`}
                onClick={() => navigate('/appointment', { state: { service: service.title } })}
              >
                <FaCalendarAlt className="mr-3" />
                Book Your Clinical Assessment
              </Button>
              <p className="text-white/80 text-sm mt-4 max-w-md mx-auto">
                Comprehensive evaluation by our specialist physiotherapist
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Clinical Content Flow */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* 1. Conditions This Therapy Helps With */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${categoryConfig.badgeColor} rounded-xl`}>
                  <FaClipboardCheck className="text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Conditions This Therapy Helps With
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Clinical indications and therapeutic applications
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.benefits?.slice(0, 6).map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200"></div>

            {/* 2. How This Therapy Works */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${categoryConfig.badgeColor} rounded-xl`}>
                  <FaUserMd className="text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    How This Therapy Works
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Evidence-based treatment protocol and clinical approach
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {treatmentProcess.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${categoryConfig.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{step}</h3>
                      <p className="text-gray-600 text-sm">
                        Our therapists implement this through personalized techniques tailored to your specific needs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200"></div>

            {/* 3. What You Can Expect From This Therapy */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${categoryConfig.badgeColor} rounded-xl`}>
                  <FaHeartbeat className="text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    What You Can Expect From This Therapy
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Measurable clinical outcomes and functional improvements
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinicalOutcomes.map((outcome, index) => {
                  // Select appropriate icon
                  const getOutcomeIcon = (outcomeText) => {
                    if (outcomeText.toLowerCase().includes('pain')) return <FaHeartbeat className="text-red-500" />;
                    if (outcomeText.toLowerCase().includes('movement') || outcomeText.toLowerCase().includes('mobility')) 
                      return <FaWalking className="text-green-500" />;
                    if (outcomeText.toLowerCase().includes('balance')) return <FaBalanceScale className="text-blue-500" />;
                    if (outcomeText.toLowerCase().includes('strength')) return <FaMountain className="text-amber-500" />;
                    return <FaUserCheck className="text-primary-500" />;
                  };

                  const OutcomeIcon = getOutcomeIcon(outcome);

                  return (
                    <div key={index} className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                            {OutcomeIcon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {outcome}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Achieved through progressive therapeutic exercises and evidence-based interventions
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consultation CTA */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                <FaCalendarAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Ready for Your Clinical Assessment?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Our specialist physiotherapists will conduct a thorough evaluation and develop a personalized treatment plan tailored to your specific condition and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className={`${categoryConfig.color} hover:opacity-90 px-8`}
                  onClick={() => navigate('/appointment')}
                >
                  <FaCalendarAlt className="mr-3" />
                  Book Initial Assessment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => navigate('/contact')}
                >
                  Have Questions? Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetails;