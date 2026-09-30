'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { testimonialsAPI } from '@/lib/api';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const demoTestimonials = [
  {
    _id: '1',
    clientName: 'Rahul Sharma',
    designation: 'Founder',
    company: 'TechStartup Pvt. Ltd.',
    project: 'E-commerce Website',
    rating: 5,
    review: 'Abhishek delivered our e-commerce platform on time and beyond expectations. The code quality, attention to detail, and communication were top-notch. Highly recommend!',
    profileImage: null
  },
  {
    _id: '2',
    clientName: 'Priya Singh',
    designation: 'Manager',
    company: 'Digital Agency',
    project: 'Business Landing Page',
    rating: 5,
    review: 'Excellent work! The landing page Abhishek built increased our conversion rate by 40%. He understood our requirements perfectly and delivered a stunning, fast website.',
    profileImage: null
  },
  {
    _id: '3',
    clientName: 'Arjun Patel',
    designation: 'CEO',
    company: 'LocalShop App',
    project: 'Full-Stack Web Application',
    rating: 5,
    review: 'Abhishek built our entire web application from scratch — frontend, backend, database, and APIs. Professional, responsive, and delivers quality work. Will hire again!',
    profileImage: null
  },
  {
    _id: '4',
    clientName: 'Sneha Gupta',
    designation: 'Student',
    company: 'University Project',
    project: 'AI-Powered Dashboard',
    rating: 5,
    review: 'Got my college final year project done with AI integration. Abhishek explained everything clearly and the project scored top marks. Super helpful and talented!',
    profileImage: null
  }
];

interface Testimonial {
  _id: string;
  clientName: string;
  designation?: string;
  company?: string;
  project?: string;
  rating: number;
  review: string;
  profileImage?: string | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-[#3a3a5a]'}`}
        />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = [
    'from-indigo-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-pink-500 to-rose-500',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(demoTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimonialsAPI.getAll();
        if (res.data.testimonials?.length > 0) setTestimonials(res.data.testimonials);
      } catch { /* use demo */ }
    };
    fetchTestimonials();
  }, []);

  const prev = () => setCurrentIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-tech mb-4">Client Reviews</span>
          <h2 className="section-title">
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Real feedback from real clients I&apos;ve worked with on projects.
          </p>
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={t.clientName} />
                  <div>
                    <p className="font-semibold text-white text-sm">{t.clientName}</p>
                    <p className="text-[#6b6b8a] text-xs">{t.designation}{t.company ? ` · ${t.company}` : ''}</p>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-indigo-500/30 flex-shrink-0" />
              </div>

              <StarRating rating={t.rating} />
              <p className="text-[#a0a0b8] text-sm leading-relaxed mt-3 mb-3">&ldquo;{t.review}&rdquo;</p>
              {t.project && (
                <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
                  <span className="text-xs text-indigo-400">Project: {t.project}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={testimonials[currentIndex].clientName} />
              <div>
                <p className="font-semibold text-white text-sm">{testimonials[currentIndex].clientName}</p>
                <p className="text-[#6b6b8a] text-xs">
                  {testimonials[currentIndex].designation}
                  {testimonials[currentIndex].company ? ` · ${testimonials[currentIndex].company}` : ''}
                </p>
              </div>
            </div>
            <StarRating rating={testimonials[currentIndex].rating} />
            <p className="text-[#a0a0b8] text-sm leading-relaxed mt-3">&ldquo;{testimonials[currentIndex].review}&rdquo;</p>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button onClick={prev} className="w-9 h-9 rounded-xl border border-[rgba(99,102,241,0.3)] flex items-center justify-center text-[#a0a0b8] hover:text-white hover:border-indigo-500 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-indigo-500 w-5' : 'bg-[#3a3a5a]'}`} />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-xl border border-[rgba(99,102,241,0.3)] flex items-center justify-center text-[#a0a0b8] hover:text-white hover:border-indigo-500 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Average rating bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 glass-card p-5 flex flex-col sm:flex-row items-center justify-center gap-6 text-center"
        >
          <div>
            <div className="font-space font-bold text-4xl gradient-text-blue">5.0</div>
            <div className="flex justify-center mt-1">
              <StarRating rating={5} />
            </div>
            <p className="text-[#6b6b8a] text-xs mt-1">Average Rating</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-[rgba(255,255,255,0.08)]" />
          <div>
            <div className="font-space font-bold text-4xl gradient-text-blue">10+</div>
            <p className="text-[#6b6b8a] text-xs mt-1">Happy Clients</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-[rgba(255,255,255,0.08)]" />
          <div>
            <div className="font-space font-bold text-4xl gradient-text-blue">100%</div>
            <p className="text-[#6b6b8a] text-xs mt-1">Project Delivery Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
