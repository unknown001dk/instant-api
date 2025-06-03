'use client';

import { motion } from "framer-motion";
import { Users, Target, Award, Rocket, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-12 px-4 md:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-emerald-500 text-transparent bg-clip-text">
          About DynavoAPI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Empowering developers to build powerful APIs without worrying about backend complexity. We make innovation accessible, fast, and secure.
        </p>
      </motion.div>

      {/* Core Values Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-24">
        {[
          {
            icon: <Target className="h-6 w-6 text-primary" />,
            title: "Our Mission",
            desc: "Democratize API development by providing powerful, user-friendly tools that allow developers to focus on innovation."
          },
          {
            icon: <Award className="h-6 w-6 text-primary" />,
            title: "Our Values",
            desc: "Simplicity, security, and scalability are our pillars. Everything we build is designed to make developers' lives easier."
          },
          {
            icon: <Users className="h-6 w-6 text-primary" />,
            title: "Our Team",
            desc: "A passionate group of engineers, designers, and dreamers, united by the goal of redefining how APIs are built."
          },
          {
            icon: <Rocket className="h-6 w-6 text-primary" />,
            title: "Our Vision",
            desc: "To be the global standard for API automation — powering startups, enterprises, and everything in between."
          },
          {
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            title: "Security First",
            desc: "We prioritize your data protection with industry best practices, encryption, and constant monitoring."
          },
          {
            icon: <Award className="h-6 w-6 text-primary" />,
            title: "Commitment to Excellence",
            desc: "We continually improve our platform, inspired by feedback from the brilliant developers who use DynavoAPI."
          }
        ].map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Our Story Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border rounded-2xl p-10 mb-20 shadow-md"
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-primary">Our Story</h2>
        <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none text-center">
          <p className="mb-6">
            Founded in 2025, DynavoAPI was born from a simple observation — developers spend countless hours managing API infrastructure instead of building what truly matters.
          </p>
          <p className="mb-6">
            We envisioned a world where API creation could be as easy as writing a few lines — automated, flexible, yet powerful. Today, that vision fuels everything we do.
          </p>
          <p>
            Trusted by startups, enterprises, and individual innovators, DynavoAPI is redefining backend development — one endpoint at a time.
          </p>
        </div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience the future of APIs?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Get started with DynavoAPI and accelerate your development journey today.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-full font-semibold hover:scale-105 transition-transform">
          Get Started
        </button>
      </motion.div>
    </div>
  );
}
