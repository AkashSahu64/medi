import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { CLINIC_INFO } from "../../utils/constants";
import Button from "../../components/common/Button";
import physioVitImage from "../../assets/image/physio-vit.jpg"; 
import physioMagImage from "../../assets/image/physio-mag.jpg"; 
import video1 from "../../assets/video/video1.mp4"
import video2 from "../../assets/video/video2.mp4"

// ----------------------------------------------------------------------
// Video Testimonial Card (muted by default, toggle mute/unmute)
// ----------------------------------------------------------------------
const VideoTestimonial = ({ src, poster, title }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // keep state synced with real video element
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;

    // force play after user interaction (browser policy safe)
    video.play().catch(() => {});

    setIsMuted(nextMuted);
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-sm bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        onVolumeChange={() => {
          if (videoRef.current) {
            setIsMuted(videoRef.current.muted);
          }
        }}
        className="w-full aspect-video object-contain"
      />

      {/* MUTE BUTTON */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition cursor-pointer"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
      </button>

      {title && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-medium text-sm">{title}</p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Nutritions Page
// ----------------------------------------------------------------------
const Nutritions = () => {
  const whatsappNumber = CLINIC_INFO.whatsapp.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello%20Medihope%2C%20I%20would%20like%20to%20enquire%2Ford%20for%20nutrition%20products`;

  return (
    <>
      <Helmet>
        <title>Medical Nutrition | MEDIHOPE</title>
        <meta
          name="description"
          content="Evidence‑based medical nutrition for musculoskeletal recovery – Physio‑Vit & Physio‑Mag."
        />
      </Helmet>

      <main className="pt-12 pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* ---------- HERO ---------- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-600/80 mb-12">
              Medihope Medical Nutrition
            </h1>
            <p className="text-lg text-gray-600 max-w-7xl mx-auto leading-relaxed text-justify">
              Medihope Medical Nutrition is designed to support recovery,
              strength, and long-term musculoskeletal health through
              evidence-based supplementation. Our nutrition range complements
              physiotherapy and rehabilitation by addressing nutritional
              deficiencies that impact bones, muscles, nerves, and overall
              vitality.
            </p>
            <p className="text-lg text-gray-800 max-w-7xl mx-auto leading-relaxed text-justify">
              With <span className="font-semibold">Physio-Vit</span> and{" "}
              <span className="font-semibold">Physio-Mag</span>, Medihope offers
              targeted formulations developed to enhance bone health, muscle
              function, nerve support, energy levels, and metabolic balance.
              These supplements are carefully curated to assist patients dealing
              with pain, weakness, fatigue, cramps, and recovery-related
              challenges—helping optimize clinical outcomes and everyday
              performance.
            </p>
          </motion.section>

          {/* ---------- PRODUCT 1: PHYSIO‑VIT (image left) ---------- */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {/* Image – 1/3 */}
              <div className="md:col-span-1">
                <div className="rounded-2xl overflow-hidden shadow-md bg-gray-50">
                  <img
                    src={physioVitImage}
                    alt="Physio-Vit Capsules"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1584017911766-451b6d0c8432?w=600";
                    }}
                  />
                </div>
              </div>
              {/* Details – 2/3 */}
              <div className="md:col-span-2 space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Physio‑Vit Capsules
                </h2>
                <div className="space-y-1">
                  <p className="text-gray-800 font-medium">Composition:</p>
                  <p className="text-gray-600">
                    Calcitriol, Calcium Carbonate, Zinc, Magnesium, Vitamin
                    K2‑7, Mecobalamin & L‑Methyl Folate
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-800 font-medium">Description:</p>
                  <p className="text-gray-600">
                    Physio‑Vit is a comprehensive nutritional supplement
                    formulated to support bone strength, enhance neuromuscular
                    function, and aid post‑therapy recovery. Its synergistic
                    blend of fat‑soluble vitamins, minerals, and active folate
                    promotes skeletal integrity and energy metabolism.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">Key Benefits:</p>
                  <ul className="space-y-1">
                    {[
                      "Supports bone density and skeletal health",
                      "Helps maintain nerve function and neuromuscular coordination",
                      "Assists in muscle strength and recovery",
                      "Supports immune and metabolic health",
                      "Useful as an adjunct in rehabilitation and long‑term care programs",
                    ].map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <FaCheckCircle className="text-primary-500 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-500 italic border-t pt-2 mt-2">
                  * To be used under professional medical guidance.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ---------- PRODUCT 2: PHYSIO‑MAG (image right, reverse layout) ---------- */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Details – 2/3 (order first on desktop) */}
              <div className="md:col-span-2 order-2 md:order-1 space-y-5">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Physio‑Mag Tablets
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">Composition:</p>
                  <p className="text-gray-600">
                    Magnesium Bisglycinate, L‑Carnitine, Vitamin C &
                    Cyanocobalamin
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">Description:</p>
                  <p className="text-gray-600">
                    Physio‑Mag is a specialized magnesium‑based formulation
                    developed to support muscle relaxation, reduce
                    exercise‑induced fatigue, and promote nerve health. Highly
                    bioavailable magnesium bisglycinate is combined with
                    L‑carnitine and antioxidants for comprehensive recovery
                    support.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">Key Benefits:</p>
                  <ul className="space-y-2">
                    {[
                      "Supports muscle relaxation and recovery",
                      "Helps reduce muscle cramps and stiffness",
                      "Aids energy production and reduces fatigue",
                      "Supports nerve health and overall wellness",
                      "Complements physiotherapy and exercise programs",
                    ].map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <FaCheckCircle className="text-primary-500 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-500 italic border-t pt-2 mt-2">
                  * To be used under professional medical guidance.
                </p>
              </div>
              {/* Image – 1/3 (order second on desktop) */}
              <div className="md:col-span-1 order-1 md:order-2">
                <div className="rounded-2xl overflow-hidden shadow-md bg-gray-50">
                  <img
                    src={physioMagImage}
                    alt="Physio-Mag Tablets"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b5?w=600";
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ---------- ORDER / CONTACT SECTION ---------- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-1 lg:p-6">
              <div className="max-w-4xl mx-auto text-start lg:text-center">
                {/* HEADING */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Order Medical Nutrition Safely & Easily
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 mb-10 lg:text-center text-start">
                  Our medical nutrition range is designed to complement
                  physiotherapy and rehabilitation programs. Connect with our
                  team to place your order or get professional guidance before
                  starting supplementation.
                </p>

                {/* CONTACT + CTA SINGLE ROW */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-gray-50 rounded-xl border border-gray-100 p-4 md:p-6">
                  {/* LEFT — CONTACT INFO */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <FaPhone />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Call us</p>
                        <a
                          href={`tel:${CLINIC_INFO.phone}`}
                          className="font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {CLINIC_INFO.PHONE_FULL}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <FaEnvelope />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Email Support</p>
                        <a
                          href={`mailto:${CLINIC_INFO.email}`}
                          className="font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {CLINIC_INFO.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT — CTA BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Button
                      size="md"
                      className="bg-primary-600 hover:bg-primary-700 text-white w-full sm:w-auto"
                      onClick={() =>
                        (window.location.href = `tel:${CLINIC_INFO.phone}`)
                      }
                    >
                      Order Now
                    </Button>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        size="md"
                        variant="outline"
                        className="border-primary-600 text-primary-600 hover:bg-primary-50 w-full sm:w-auto"
                      >
                        <FaWhatsapp className="mr-2" />
                        Order via Whatsapp
                      </Button>
                    </a>
                  </div>
                </div>

                {/* TRUST LINE */}
                <p className="mt-8 text-sm text-gray-500">
                  ✔ Medical-grade formulations • ✔ Expert physiotherapy guidance
                  • ✔ Safe & professional support
                </p>
              </div>
            </div>
          </motion.section>

          {/* ---------- VIDEO TESTIMONIALS ---------- */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What People Say
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12">
              Real experiences from patients who integrated medical nutrition
              into their recovery journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VideoTestimonial
                src={video1}
                poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
                title="Knee replacement recovery with Physio‑Vit"
              />
              <VideoTestimonial
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                poster="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600"
                title="Reduced muscle cramps – Physio‑Mag"
              />
              <VideoTestimonial
                src={video2}
                poster="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600"
                title="Reduced muscle cramps – Physio‑Mag"
              />
            </div>
            <p className="text-sm text-gray-400 mt-6">
              * Videos are illustrative. Patient consent obtained.
            </p>
          </motion.section>
        </div>
      </main>
    </>
  );
};

export default Nutritions;
