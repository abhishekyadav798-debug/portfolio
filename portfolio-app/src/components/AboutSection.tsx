'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Coffee, Code, Brain, Rocket } from 'lucide-react';

const stats = [
  { value: 15, suffix: '+', label: 'Projects Completed', icon: Rocket },
  { value: 20, suffix: '+', label: 'Technologies', icon: Code },
  { value: 10, suffix: '+', label: 'Happy Clients', icon: Coffee },
  { value: 1000, suffix: '+', label: 'Coding Hours', icon: Brain },
];

const timeline = [
  { year: '2022', title: 'Started B.Tech in IT', desc: 'Began my engineering journey, fell in love with programming.' },
  { year: '2023', title: 'First Freelance Project', desc: 'Delivered a complete website for a local business client.' },
  { year: '2024', title: 'Explored AI/ML', desc: 'Integrated machine learning models and AI APIs into web apps.' },
  { year: '2025', title: 'Full-Stack Mastery', desc: 'Building complete MERN stack applications and SaaS products.' },
  { year: '2026', title: 'Active Freelancer', desc: 'Open for freelance projects — building digital products for clients globally.' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const step = value / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, value);
      setCount(Math.floor(current));
      if (current >= value) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-tech mb-4">About Me</span>
          <h2 className="section-title">
            The Developer Behind{' '}
            <span className="gradient-text">The Code</span>
          </h2>
          <p className="section-subtitle mx-auto">
            A passionate B.Tech IT student and freelance software engineer on a mission to build meaningful digital solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-white text-lg mb-1">Abhishek Yadav</h3>
                  <p className="text-indigo-400 text-sm">Freelance Software Engineer · Full-Stack Developer</p>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center gap-3 text-[#a0a0b8]">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>B.Tech – Information Technology</span>
                </div>
                <div className="flex items-center gap-3 text-[#a0a0b8]">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>India 🇮🇳</span>
                </div>
                <div className="flex items-center gap-3 text-[#a0a0b8]">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Open to freelance projects</span>
                </div>
              </div>

              <p className="text-[#a0a0b8] text-sm leading-relaxed mb-4">
                I&apos;m Abhishek, a B.Tech IT student and passionate freelance software engineer. My journey started with writing simple scripts, and has evolved into building complete, production-ready web applications and AI-powered digital products.
              </p>
              <p className="text-[#a0a0b8] text-sm leading-relaxed">
                I specialize in <strong className="text-white">full-stack development</strong>, <strong className="text-white">AI/ML integration</strong>, and turning complex ideas into elegant, working software. I believe in clean code, thoughtful architecture, and products that actually solve real problems.
              </p>
            </div>

            {/* Interests */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🌐', title: 'Web Development', desc: 'React, Node.js, Next.js' },
                { icon: '🤖', title: 'AI/ML', desc: 'Python, ML APIs' },
                { icon: '📱', title: 'UI/UX Design', desc: 'Figma, Tailwind CSS' },
                { icon: '☁️', title: 'Cloud & DevOps', desc: 'Docker, Deployments' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="glass-card p-4">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-medium text-white text-sm">{title}</div>
                  <div className="text-[#6b6b8a] text-xs mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Stats + Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Animated stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map(({ value, suffix, label, icon: Icon }) => (
                <div key={label} className="glass-card p-5 text-center">
                  <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                  <div className="font-space font-bold text-3xl gradient-text-blue mb-1">
                    <AnimatedCounter value={value} suffix={suffix} />
                  </div>
                  <div className="text-xs text-[#a0a0b8]">{label}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="glass-card p-6">
              <h3 className="font-space font-bold text-white mb-6">My Journey</h3>
              <div className="space-y-4 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-indigo-500 to-purple-600/30" />
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    className="flex gap-4 pl-6 relative"
                  >
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div>
                      <div className="text-xs text-indigo-400 font-semibold mb-0.5">{item.year}</div>
                      <div className="text-white font-medium text-sm mb-0.5">{item.title}</div>
                      <div className="text-[#6b6b8a] text-xs leading-relaxed">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
