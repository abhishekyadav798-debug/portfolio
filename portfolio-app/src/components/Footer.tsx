'use client';

import Link from 'next/link';
import { Code2, Mail, ArrowRight } from 'lucide-react';
import { Github, Linkedin } from '@/components/Icons';

const navLinks = ['Home', 'About', 'Services', 'Projects', 'Freelance', 'Contact'];

const scrollTo = (id: string) => {
  document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(99,102,241,0.1)] pt-16 pb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none" />
      
      <div className="section-container relative">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-space font-bold text-white text-lg leading-none">Technorats</span>
                <span className="block text-[10px] text-indigo-400 leading-none mt-0.5">Software Engineer</span>
              </div>
            </div>
            <p className="text-[#6b6b8a] text-sm leading-relaxed max-w-xs">
              Building websites, software and AI-powered digital solutions that help businesses grow.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Github, href: process.env.NEXT_PUBLIC_GITHUB || 'https://github.com/abhishekyadav798-debug', label: 'GitHub' },
                { icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN || 'https://www.linkedin.com/in/abhishek-yadav-3794a2384', label: 'LinkedIn' },
                { icon: Mail, href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'abhishekyadav798571@gmail.com'}`, label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-[rgba(99,102,241,0.2)] flex items-center justify-center text-[#a0a0b8] hover:text-white hover:border-indigo-500 hover:bg-[rgba(99,102,241,0.1)] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-space font-bold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo(link)}
                    className="text-[#6b6b8a] hover:text-indigo-400 text-sm transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-[#6b6b8a] hover:text-indigo-400 text-sm transition-colors">Admin Panel</Link>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-space font-bold text-white text-sm mb-4">Start a Project</h4>
            <p className="text-[#6b6b8a] text-sm mb-4 leading-relaxed">
              Ready to build something great together? I&apos;m available for new projects.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => scrollTo('freelance')}
                className="btn-primary w-full justify-center py-2.5 text-sm"
              >
                <span>Hire Me</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="btn-secondary w-full justify-center py-2.5 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#6b6b8a]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Currently available for new projects</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(255,255,255,0.05)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#6b6b8a] text-sm">
            © 2026 Abhishek Yadav. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-[#6b6b8a]">
            <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
