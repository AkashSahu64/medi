import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FaAward,
  FaUserMd,
  FaHeartbeat,
  FaHandsHelping,
  FaUsers,
  FaLightbulb,
} from "react-icons/fa";
import deepak from "../../assets/about/deepakCEO.png";
import manish from "../../assets/about/manish.png";
import vardhaman from "../../assets/about/vardhaman.jpeg";
import anshika from "../../assets/about/anshika.jpeg";
import akansha from "../../assets/about/akansha.jpeg";
import saloni from "../../assets/about/saloni.jpeg";
import amit from "../../assets/about/amit.jpeg";
import about from "../../assets/image/about.png";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Arjun Mehta",
      position: "Head Physiotherapist",
      qualification: "MPT, PhD in Rehabilitation",
      experience: "15+ years",
      specialty: "Sports Injuries & Orthopedics",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      name: "Dr. Priya Sharma",
      position: "Senior Physiotherapist",
      qualification: "MPT, Certified Manual Therapist",
      experience: "10+ years",
      specialty: "Neurological Rehabilitation",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Dr. Rahul Verma",
      position: "Sports Physiotherapist",
      qualification: "MSPT, Certified Strength Coach",
      experience: "8+ years",
      specialty: "Athletic Performance & Recovery",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  const values = [
    {
      icon: <FaHeartbeat />,
      title: "Patient-Centered Care",
      description:
        "We prioritize your individual needs and recovery goals above all else.",
    },
    {
      icon: <FaAward />,
      title: "Clinical Excellence",
      description:
        "Continuous learning and application of evidence-based practices.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Compassionate Approach",
      description:
        "Empathetic care that understands the emotional journey of recovery.",
    },
    {
      icon: <FaUsers />,
      title: "Collaborative Treatment",
      description:
        "Working together with patients for optimal recovery outcomes.",
    },
    {
      icon: <FaLightbulb />,
      title: "Innovative Solutions",
      description:
        "Incorporating latest research and technology in treatment plans.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          About MEDIHOPE - Leading Physiotherapy Centre | Our Mission & Team
        </title>
        <meta
          name="description"
          content="Learn about MEDIHOPE Physiotherapy Centre - our mission, experienced team, and patient-centered approach to rehabilitation and pain management."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-12 pb-8 bg-gradient-to-br from-primary-50 to-white">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-7xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-8">
              About <span className="text-primary-600">MEDIHOPE</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              MEDIHOPE is a modern physiotherapy and rehabilitation center
              situated in{" "}
              <span className="font-semibold">Aya Nagar, South Delhi</span>{" "}
              dedicated to restoring mobility, alleviating pain, and improving
              overall quality of life through evidence-based physiotherapy
              interventions. We integrate advanced technology and individualized
              treatment strategies to achieve effective and sustainable
              outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 bg-white">
        <div className="container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-secondary-900 mb-6">
                Our <span className="text-primary-600">Story</span>
              </h2>
              <div className="space-y-4 text-secondary-600 text-md">
                <p>
                  MEDIHOPE was established in 2025 with a focused vision to
                  create a comprehensive Physiotherapy, Osteopathy, and
                  Chiropractic Center where advanced clinical expertise, modern
                  therapeutic technology, and compassionate patient care work in
                  harmony. Located in Aya Nagar H Block , South Delhi, MEDIHOPE
                  was developed to address the growing need for reliable,
                  evidence-based rehabilitation and manual therapy services
                  within the community.
                </p>
                <p>
                  At MEDIHOPE, we believe that effective recovery extends beyond
                  symptom management. Our integrated approach combines
                  physiotherapy, osteopathy, and chiropractic care, emphasizing
                  precise assessment, identification of underlying movement
                  dysfunctions, and individualized treatment planning. By
                  blending advanced techniques with personalized care, we are
                  committed to delivering sustainable recovery, improved
                  mobility, and long-term quality of life for every patient.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={about}
                  alt="MEDIHOPE Clinic Interior"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-cyan-50">
        <div className="container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <FaAward className="text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-secondary-900">
                  Our Mission
                </h3>
              </div>

              <p className="text-secondary-600">
                To empower individuals to achieve pain-free movement, functional
                independence, and long-term recovery through personalized,
                evidence-based physiotherapy interventions. We aim to be a
                reliable rehabilitation partner for every stage of recovery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <FaLightbulb className="text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-secondary-900">
                  Our Vision
                </h3>
              </div>

              <p className="text-secondary-600">
                To become a leading physiotherapy and rehabilitation centre in
                India by integrating advanced therapeutic technology, clinical
                expertise, patient-centric treatment and compassionate care,
                making effective rehabilitation accessible to all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== NEW SECTIONS START HERE ========== */}

      {/* Founder Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Founder Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={deepak}
                  alt="Mr. Deepak Jindal"
                  className="w-full h-[380px] object-cover object-top"
                />
              </div>

              {/* subtle accent bar */}
              <div className="absolute -bottom-5 left-8 bg-primary-600 text-white px-5 py-2 rounded-md text-sm font-medium">
                Founder
              </div>
            </div>

            {/* Founder Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-secondary-900">
                  Mr. Deepak Jindal
                </h2>

                <p className="text-primary-600 font-semibold mt-1">
                  Founder & CEO
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <p className="text-secondary-700">
                  <span className="font-semibold">Qualification:</span>{" "}
                  Healthcare & Business Management
                </p>
              </div>

              <p className="text-secondary-600 leading-relaxed text-lg">
                Mr. Deepak Jindal is a visionary entrepreneur and the founder of
                <span className="font-semibold text-secondary-800">
                  {" "}
                  Medihope
                </span>
                , a premier physiotherapy and rehabilitation centre, and
                <span className="font-semibold text-secondary-800">
                  {" "}
                  Physiohelp
                </span>
                , an educational platform dedicated to courses and workshops for
                physiotherapy students and young professionals.
              </p>

              {/* divider */}
              <div className="w-16 h-[2px] bg-primary-500"></div>

              <p className="text-sm text-secondary-500">
                Dedicated to advancing physiotherapy education and
                rehabilitation care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Senior Consultant Physiotherapists */}
      <section className="py-8 bg-gradient-to-b from-white to-primary-50">
        <div className="container-padding">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900">
              Senior Consultant{" "}
              <span className="text-primary-600">Physiotherapists</span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: "Dr. Manish Arora",
                title: "Senior Consultant Physiotherapist",
                extra: "Dean – SBS University, Dehradun",
                image: manish,
              },
              {
                name: "Dr. Vardhman Jain",
                title: "Senior Consultant Physiotherapist",
                extra: "",
                image: vardhaman,
              },
              {
                name: "Dr. Vandana Sharma",
                title: "Senior Consultant Physiotherapist",
                extra: "",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
            ].map((doctor, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
              >
                {/* Doctor Image */}
                <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-100">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                  {doctor.name}
                </h3>

                {/* Title */}
                <p className="text-primary-600 font-medium text-sm mb-3">
                  {doctor.title}
                </p>

                {/* Extra */}
                {doctor.extra && (
                  <p className="text-secondary-500 text-sm">{doctor.extra}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="py-8 bg-white">
        <div className="container-padding">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900">
              Meet Our <span className="text-primary-600">Doctors</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto mt-4">
              Our team consists of highly qualified and experienced
              physiotherapists dedicated to delivering personalized,
              evidence-based rehabilitation care.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {[
              {
                name: "Dr. Akansha Bhuradia",
                title: "Senior Physiotherapist",
                image: akansha,
                details: [
                  "Qualification: BPT, MPT",
                  "Specialization: Manual Therapy, Osteopathy, Chiropractic Techniques",
                  "Certifications: FNMT, CDNT",
                  "Additional: Pelvic Floor Therapist, Yoga & Pilates Trainer",
                ],
              },
              {
                name: "Dr. Anshika",
                title: "Assistant",
                image: anshika,
                details: ["Supporting our team with dedication and care."],
              },
            ].map((doctor, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
              >
                {/* Image */}
                <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-100">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                  {doctor.name}
                </h3>

                {/* Title */}
                <p className="text-primary-600 font-medium text-sm mb-4">
                  {doctor.title}
                </p>

                {/* Details */}
                <div className="text-secondary-600 text-sm space-y-1">
                  {doctor.details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Management Team */}
      <section className="py-8 bg-gradient-to-b from-white to-primary-50">
        <div className="container-padding">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900">
              Meet Our <span className="text-primary-600">Management Team</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto mt-4">
              Our management team ensures smooth clinic operations, patient
              coordination, and a seamless care experience from consultation to
              recovery.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: "Ms. Saloni Kushwaha",
                title: "Director",
                image: saloni,
              },
              {
                name: "Mr. Amit Kushwaha",
                title: "Director",
                image: amit,
              },
              {
                name: "Mr. Ajay Kumar",
                title: "Director",
                image: "https://randomuser.me/api/portraits/men/53.jpg",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
              >
                {/* Image */}
                <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                  {member.name}
                </h3>

                {/* Title */}
                <p className="text-primary-600 font-medium text-sm">
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-6 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-padding">
          <div className="w-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl px-10 py-8 text-center text-white border border-primary-500">
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Looking for Expert Physiotherapy in South Delhi?
            </h2>

            {/* Description */}
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-6">
              Book a consultation with our experienced physiotherapists and
              begin your journey toward pain-free movement and better mobility.
            </p>

            {/* Button */}
            <button
              onClick={() => (window.location.href = "/contact")}
              className="inline-flex items-center justify-center bg-white text-primary-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
