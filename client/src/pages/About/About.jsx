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
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-10">
              About <span className="text-primary-600">MEDIHOPE</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              A premier physiotherapy centre dedicated to restoring mobility,
              reducing pain, and improving quality of life through
              evidence-based treatments.
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
                  Founded in 2008, MEDIHOPE began as a small clinic with a big
                  vision: to provide accessible, high-quality physiotherapy care
                  to our community. What started with a single treatment room
                  has grown into a comprehensive rehabilitation centre serving
                  thousands of patients.
                </p>
                <p>
                  Over the past 15+ years, we've built a reputation for
                  excellence through our patient-first approach and commitment
                  to evidence-based practice. Our team of certified
                  physiotherapists combines extensive clinical experience with
                  ongoing professional development to deliver the most effective
                  treatments.
                </p>
                <p>
                  Today, MEDIHOPE stands as a trusted name in physiotherapy,
                  known for our holistic approach that addresses not just
                  physical symptoms but also the emotional and psychological
                  aspects of recovery.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1638636246913-8b3e8d282269?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBoeXNpb3RoZXJhcHklMjBjYXJlJTIwQ2xpbmljJTIwSW50ZXJpb3J8ZW58MHx8MHx8fDA%3D"
                  alt="MEDIHOPE Clinic Interior"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-primary-500 text-white px-3 py-2 rounded-lg shadow-lg max-w-[150px]">
                <div className="text-lg font-semibold leading-tight">
                  15+ Years of Excellence
                </div>
                <p className="text-xs mt-1 text-primary-100">
                  In physiotherapy care
                </p>
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
                To empower individuals to achieve optimal physical function and
                pain-free living through personalized, evidence-based
                physiotherapy interventions. We strive to be the most trusted
                rehabilitation partner in our community.
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
                To revolutionize physiotherapy care by integrating cutting-edge
                technology with compassionate, patient-centered treatment. We
                envision a future where everyone has access to effective
                rehabilitation for a better quality of life.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-secondary-900 mb-8">
              Our <span className="text-primary-600">Values</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The principles that guide everything we do at MEDIHOPE.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-14 h-14 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-secondary-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-secondary-900 mb-8">
              Meet Our <span className="text-primary-600">Team</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Our team of certified physiotherapists brings together decades of
              experience and specialized expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card text-center"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-semibold mb-3">
                  {member.position}
                </p>
                <div className="space-y-2 text-sm text-secondary-600 mb-2">
                  <p className="flex items-center justify-center gap-2">
                    <FaUserMd className="text-primary-500" />
                    {member.qualification}
                  </p>
                  <p>Experience: {member.experience}</p>
                  <p>Specialty: {member.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-6">Why Choose MEDIHOPE?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FaAward className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Certified Expertise
                      </h4>
                      <p className="text-primary-100 text-sm">
                        All therapists hold advanced degrees and ongoing
                        certifications.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FaHeartbeat className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Personalized Plans</h4>
                      <p className="text-primary-100 text-sm">
                        Custom treatment plans based on thorough assessments.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FaHandsHelping className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Holistic Approach</h4>
                      <p className="text-primary-100 text-sm">
                        Addressing physical, emotional, and lifestyle factors.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FaUsers className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Patient Education</h4>
                      <p className="text-primary-100 text-sm">
                        Empowering you with knowledge for long-term recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
