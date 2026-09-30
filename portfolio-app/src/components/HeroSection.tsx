'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, MessageSquare, Github, Linkedin, Mail, CheckCircle, Zap } from 'lucide-react';
import Image from 'next/image';

const codeSnippets = [
  { line: '01', code: 'const dev = new Abhishek();', color: '#a78bfa' },
  { line: '02', code: 'dev.skills = [React, Node, AI];', color: '#60a5fa' },
  { line: '03', code: 'dev.availability = "Open";', color: '#34d399' },
  { line: '04', code: 'dev.build(yourIdea);', color: '#f472b6' },
];

const highlights = [
  { icon: CheckCircle, text: 'Full-Stack Development' },
  { icon: Zap, text: 'AI/ML Integration' },
  { icon: CheckCircle, text: 'Scalable Architecture' },
  { icon: Zap, text: 'Modern UI/UX' },
];

const socialLinks = [
  { icon: Github, href: process.env.NEXT_PUBLIC_GITHUB || '#', label: 'GitHub' },
  { icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN || '#', label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'abhishek@example.com'}`, label: 'Email' },
];

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container w-full py-20 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)]">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="badge badge-available">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Freelance Work
              </div>
              <span className="text-sm text-[#6b6b8a] hidden sm:block">· Open to new projects</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-space text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              Building{' '}
              <span className="gradient-text">Digital Products</span>
              <br />
              That Actually{' '}
              <span className="relative">
                Work.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4 Q50 8 100 4 Q150 0 200 4" stroke="url(#underline)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="underline" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#a0a0b8] text-lg leading-relaxed mb-8 max-w-xl"
            >
              Freelance Software Engineer helping <strong className="text-white">individuals, startups and businesses</strong> build modern websites, web applications, AI-powered solutions and scalable digital products.
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-2 mb-8"
            >
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-[#a0a0b8]">
                  <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <button
                onClick={() => scrollToSection('freelance')}
                className="btn-primary"
              >
                <span>Hire Me</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-secondary"
              >
                <Play className="w-4 h-4" />
                <span>View My Work</span>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="btn-ghost"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Let&apos;s Discuss</span>
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-[#6b6b8a]">Find me on:</span>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-[rgba(99,102,241,0.2)] flex items-center justify-center text-[#a0a0b8] hover:text-white hover:border-indigo-500 hover:bg-[rgba(99,102,241,0.15)] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Profile + Code card */}
            <div className="relative w-full max-w-sm mx-auto">
              {/* Animated blob background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 animate-morph rounded-3xl blur-xl" />
              
              {/* Profile card */}
              <div className="relative glass-card p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-spin-slow opacity-60" />
                  <div className="absolute inset-1 bg-[#0a0a0f] rounded-full" />
                  <Image
                    src="/profile.jpeg"
                    alt="Abhishek Yadav"
                    fill
                    className="rounded-full object-cover p-1.5"
                    priority
                  />
                </div>
                
                <h2 className="font-space font-bold text-xl text-white mb-1">Abhishek Yadav</h2>
                <p className="text-indigo-400 text-sm mb-3">Full-Stack Developer & AI Enthusiast</p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Available for hire</span>
                </div>

                <div className="flex justify-center gap-3 text-xs text-[#6b6b8a]">
                  <span>🎓 B.Tech IT</span>
                  <span>·</span>
                  <span>📍 India</span>
                </div>
              </div>

              {/* Floating stat badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-8 top-12 glass-card px-3 py-2 !transform-none"
              >
                <div className="text-2xl font-bold gradient-text-blue font-space">15+</div>
                <div className="text-xs text-[#a0a0b8]">Projects</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-8 top-20 glass-card px-3 py-2 !transform-none"
              >
                <div className="text-2xl font-bold gradient-text-blue font-space">10+</div>
                <div className="text-xs text-[#a0a0b8]">Technologies</div>
              </motion.div>
            </div>

            {/* Code snippet card */}
            <div className="w-full max-w-sm mx-auto glass-card overflow-hidden !hover:transform-none">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-[#6b6b8a] font-mono">portfolio.js</span>
              </div>
              <div className="p-4 font-mono text-sm space-y-2">
                {codeSnippets.map((s) => (
                  <div key={s.line} className="flex gap-3">
                    <span className="text-[#4b4b6a] select-none">{s.line}</span>
                    <span style={{ color: s.color }}>{s.code}</span>
                  </div>
                ))}
                <div className="flex gap-3">
                  <span className="text-[#4b4b6a] select-none">05</span>
                  <span className="text-gray-400">
                    <span className="animate-[blink_1s_ease-in-out_infinite]">█</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b6b8a]"
      >
        <span className="text-xs">Scroll down</span>
        <div className="w-5 h-8 border border-[rgba(99,102,241,0.3)] rounded-full flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
