'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { contactAPI } from '@/lib/api';
import { Mail, Phone, MessageSquare, Send, Copy, Check, Clock } from 'lucide-react';
import { Github, Linkedin } from '@/components/Icons';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message too short (min 10 chars)'),
});
type FormData = z.infer<typeof schema>;

const EMAIL = process.env.NEXT_PUBLIC_EMAIL || 'abhishekyadav798571@gmail.com';
const PHONE = process.env.NEXT_PUBLIC_PHONE || '+917985718872';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'abhishekyadav798571@gmail.com',
    href: 'mailto:abhishekyadav798571@gmail.com',
    color: 'from-blue-500 to-cyan-500',
    copyable: true
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 79857 18872',
    href: 'tel:+917985718872',
    color: 'from-emerald-500 to-teal-500',
    copyable: true
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/abhishek-yadav-3794a2384',
    href: 'https://www.linkedin.com/in/abhishek-yadav-3794a2384',
    color: 'from-blue-600 to-blue-500',
    copyable: false
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/abhishekyadav798-debug',
    href: 'https://github.com/abhishekyadav798-debug',
    color: 'from-gray-600 to-gray-500',
    copyable: false
  }
];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await contactAPI.send(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent! I\'ll reply within 24 hours.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopiedEmail(true);
    toast.success('Email copied!');
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-tech mb-4">Get In Touch</span>
          <h2 className="section-title">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Have a question, project idea, or just want to say hi? I&apos;m always open to a good conversation.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-[#a0a0b8]">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Usually replies within 24 hours.</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left - Contact methods */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-space font-bold text-white text-lg mb-5">Contact Methods</h3>
            {contactMethods.map(({ icon: Icon, label, value, href, color, copyable }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card p-4 group no-underline"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-[#6b6b8a] text-sm truncate">{value}</p>
                </div>
                {copyable && (
                  <button
                    onClick={(e) => { e.preventDefault(); copyEmail(); }}
                    className="w-8 h-8 rounded-lg border border-[rgba(99,102,241,0.2)] flex items-center justify-center text-[#a0a0b8] hover:text-white hover:border-indigo-500 transition-all flex-shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </a>
            ))}

            {/* Hire CTA */}
            <div className="glass-card p-5 mt-4 text-center bg-gradient-to-br from-indigo-900/30 to-purple-900/20">
              <p className="text-white font-semibold mb-1">Ready to start a project?</p>
              <p className="text-[#a0a0b8] text-sm mb-4">Get a free consultation and project estimate.</p>
              <button
                onClick={() => document.getElementById('freelance')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary w-full justify-center"
              >
                <Send className="w-4 h-4" />
                <span>Start a Project</span>
              </button>
            </div>
          </motion.div>

          {/* Right - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {submitted ? (
              <div className="glass-card p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-space font-bold text-white text-xl mb-2">Message Sent!</h3>
                <p className="text-[#a0a0b8] mb-5">I&apos;ll reply to your message within 24 hours. Thank you!</p>
                <button onClick={() => setSubmitted(false)} className="btn-ghost text-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="glass-card p-7">
                <h3 className="font-space font-bold text-white text-lg mb-5 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#a0a0b8] mb-1.5">Your Name *</label>
                      <input {...register('name')} placeholder="Rahul Sharma" className="input-field" />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-[#a0a0b8] mb-1.5">Email *</label>
                      <input {...register('email')} type="email" placeholder="rahul@example.com" className="input-field" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0b8] mb-1.5">Subject *</label>
                    <input {...register('subject')} placeholder="What's this about?" className="input-field" />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0b8] mb-1.5">Message *</label>
                    <textarea {...register('message')} rows={5} placeholder="Write your message here..." className="input-field resize-none" />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 disabled:opacity-60"
                  >
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : <Send className="w-4 h-4" />}
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
