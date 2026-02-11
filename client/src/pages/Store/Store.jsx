import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { CLINIC_INFO } from '../../utils/constants';
import Button from '../../components/common/Button';

// ----------------------------------------------------------------------
// Reusable Product Card
// ----------------------------------------------------------------------
const ProductCard = ({ image, name, shortDesc, useCase }) => {
  const whatsappNumber = CLINIC_INFO.whatsapp.replace(/\D/g, '');
  const prefillMessage = encodeURIComponent('Hello Medihope, I would like to enquire/order');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${prefillMessage}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden group"
    >
      <div className="aspect-w-16 aspect-h-12 bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1584017911766-451b6d0c8432?w=400';
          }}
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-3">{shortDesc}</p>
        <p className="text-sm text-primary-600 font-medium mb-4">{useCase}</p>
        <div className="flex gap-12 lg:gap-20 items-center justify-between">
          <Button
            size="md"
            className="bg-primary-600 hover:bg-primary-700 text-white text-lg flex-1"
            onClick={() => window.location.href = `tel:${CLINIC_INFO.phone}`}
          >
            Order Now
          </Button>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button
              size="md"
              variant="outline"
              className="w-full border-primary-600 text-primary-600 text-lg hover:bg-primary-50"
            >
              <FaWhatsapp className="mr-1.5" />
              Enquire
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Main Store Page
// ----------------------------------------------------------------------
const Store = () => {
  const products = [
    {
      id: 1,
      name: 'Physio‑Vit Capsules',
      shortDesc: 'Bone density & neuromuscular support with Calcitriol, Calcium, K2‑7, Zinc.',
      useCase: 'Ideal for post‑fracture, osteoporosis, and general rehabilitation.',
      image: 'https://images.unsplash.com/photo-1584017911766-451b6d0c8432?w=400',
    },
    {
      id: 2,
      name: 'Physio‑Mag Tablets',
      shortDesc: 'Magnesium Bisglycinate + L‑Carnitine for muscle relaxation & energy.',
      useCase: 'Muscle cramps, fatigue, post‑exercise recovery.',
      image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b5?w=400',
    },
    {
      id: 3,
      name: 'Joint Care Combo',
      shortDesc: 'Physio‑Vit + Physio‑Mag in a monthly convenience pack.',
      useCase: 'Comprehensive musculoskeletal support.',
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400',
    },
    {
      id: 4,
      name: 'Therapy Recovery Kit',
      shortDesc: 'Essentials for home‑based physiotherapy adjunct care.',
      useCase: 'Post‑surgery / post‑stroke rehabilitation.',
      image: 'https://images.unsplash.com/photo-1582307790871-2b12170eaf52?w=400',
    },
    {
      id: 5,
      name: 'Ortho Support Bundle',
      shortDesc: 'Calcium, Vitamin D3, Magnesium – advanced bone health.',
      useCase: 'Osteopenia, age‑related bone loss.',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    },
    {
      id: 6,
      name: 'Neuro Vital Pack',
      shortDesc: 'Mecobalamin, Folate & Vitamin B complex for nerve health.',
      useCase: 'Neuropathy, post‑stroke neural recovery.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Medihope Store – Medical Nutrition & Recovery Aids</title>
        <meta name="description" content="Shop evidence‑based nutritional supplements for physiotherapy and rehabilitation." />
      </Helmet>

      <main className="pt-12 pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* ---------- STORE INTRO ---------- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-600/80 mb-6">
              Medihope Store
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Premium‑grade medical nutrition and recovery aids, curated by our clinical team. 
              Every product is selected for its evidence base, safety, and compatibility with 
              physiotherapy protocols.
            </p>
          </motion.section>

          {/* ---------- PRODUCT GRID ---------- */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </motion.section>

          {/* ---------- ORDER ASSISTANCE ---------- */}
          <div className="mt-20 text-center bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Need help choosing?
            </h3>
            <p className="text-gray-600 mb-6">
              Our physiotherapists are available for product consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="md"
                className="bg-primary-600 hover:bg-primary-700 text-white"
                onClick={() => window.location.href = `tel:${CLINIC_INFO.phone}`}
              >
                Call {CLINIC_INFO.PHONE_FULL}
              </Button>
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Medihope, I need advice on which product suits my condition.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="md"
                  variant="outline"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  <FaWhatsapp className="mr-2" />
                  Ask on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Store;