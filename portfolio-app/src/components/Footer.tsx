'use client';

import Link from 'next/link';
import { Code2, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';

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
                <span className="font-space font-bold text-white text-lg leading-none">Abhishek Yadav</span>
                <span className="block text-[10px] text-indigo-400 leading-none mt-0.5">Freelance Software Engineer</span>
              </div>
            </div>
            <p className="text-[#6b6b8a] text-sm leading-relaxed max-w-xs">
              Building websites, software and AI-powered digital solutions that help businesses grow.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Github, href: process.env.NEXT_PUBLIC_GITHUB || '#', label: 'GitHub' },
                { icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN || '#', label: 'LinkedIn' },
                { icon: Mail, href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'abhishek@example.com'}`, label: 'Email' },
                {
                  icon: () => (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0020.885 3.488" />
                    </svg>
                  ),
                  href: `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || '+919876543210').replace(/\D/g, '')}`,
                  label: 'WhatsApp'
                }
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
