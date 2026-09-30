'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Layers, Building, Bot, Palette, Wrench, Package, ArrowRight, Check } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Modern, responsive websites for businesses, portfolios, and organizations that look stunning and perform fast.',
    features: ['Mobile-first design', 'SEO optimized', 'Fast loading', 'Custom CMS'],
    price: '₹5,000',
    color: 'from-blue-500 to-cyan-500',
    popular: false
  },
  {
    icon: Layers,
    title: 'Full-Stack Web Apps',
    description: 'Complete frontend + backend applications with database, authentication, and RESTful APIs.',
    features: ['React/Next.js frontend', 'Node.js backend', 'MongoDB/MySQL DB', 'API integration'],
    price: '₹15,000',
    color: 'from-indigo-500 to-purple-500',
    popular: true
  },
  {
    icon: Building,
    title: 'Business Websites',
    description: 'Professional websites for startups, shops, organizations and personal brands with modern aesthetics.',
    features: ['Landing page', 'Contact forms', 'Analytics', 'Social integration'],
    price: '₹7,000',
    color: 'from-purple-500 to-pink-500',
    popular: false
  },
  {
    icon: Bot,
    title: 'AI Integration',
    description: 'Integrate AI APIs, chatbots, automation and intelligent features into your existing or new products.',
    features: ['ChatGPT/Gemini API', 'Custom chatbots', 'Smart automation', 'AI-powered search'],
    price: '₹10,000',
    color: 'from-emerald-500 to-teal-500',
    popular: false
  },
  {
    icon: Palette,
    title: 'UI/UX Development',
    description: 'Beautiful, modern, and highly responsive user interfaces that convert visitors into customers.',
    features: ['Figma to code', 'Component library', 'Animations', 'Responsive design'],
    price: '₹8,000',
    color: 'from-orange-500 to-amber-500',
    popular: false
  },
  {
    icon: Wrench,
    title: 'Bug Fixing & Optimization',
    description: 'Fix existing website bugs, improve performance, responsiveness, and overall code quality.',
    features: ['Bug diagnosis', 'Performance audit', 'Code refactoring', 'Security fixes'],
    price: '₹3,000',
    color: 'from-red-500 to-rose-500',
    popular: false
  },
  {
    icon: Package,
    title: 'Custom Software',
    description: 'Build tailor-made software solutions according to your unique business requirements.',
    features: ['Requirement analysis', 'Custom features', 'Deployment', 'Ongoing support'],
    price: '₹20,000',
    color: 'from-violet-500 to-purple-500',
    popular: false
  }
];

interface ServiceCardProps {
  service: typeof services[0];
  index: number;
  inView: boolean;
  onRequest: (title: string) => void;
}

function ServiceCard({ service, index, inView, onRequest }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative glass-card p-6 flex flex-col h-full ${service.popular ? 'border-indigo-500/50' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {service.popular && (
        <div className="absolute -top-3 left-6">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 transition-transform duration-300 ${hovered ? 'scale-110' : ''}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="font-space font-bold text-white text-lg mb-2">{service.title}</h3>
      <p className="text-[#a0a0b8] text-sm leading-relaxed mb-4 flex-grow">{service.description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-5">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-[#a0a0b8]">
            <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Price & CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="text-xs text-[#6b6b8a]">Starting from</span>
          <div className="font-space font-bold text-white text-xl">{service.price}</div>
        </div>
        <button
          onClick={() => onRequest(service.title)}
          className="btn-primary text-sm py-2 px-4"
        >
          <span>Request</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const handleRequest = (title: string) => {
    const el = document.getElementById('freelance');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-tech mb-4">What I Offer</span>
          <h2 className="section-title">
            Services I <span className="gradient-text">Provide</span>
          </h2>
          <p className="section-subtitle mx-auto">
            From simple websites to complex AI-powered applications — I deliver digital solutions that grow your business.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={i}
              inView={inView}
              onRequest={handleRequest}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-[#a0a0b8] mb-4">Don&apos;t see what you need? I build custom solutions too.</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            <span>Discuss Custom Requirements</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
