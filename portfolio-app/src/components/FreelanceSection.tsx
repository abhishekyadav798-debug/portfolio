'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { requestsAPI } from '@/lib/api';
import { ArrowRight, Upload, Send, CheckCircle, Copy } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, 'Select a project type'),
  budget: z.string().min(1, 'Select a budget'),
  deadline: z.string().optional(),
  description: z.string().min(20, 'Please describe your project in at least 20 characters'),
  features: z.string().optional(),
  referenceWebsite: z.string().optional(),
  preferredContact: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const serviceCategories = [
  { icon: '🌐', label: 'New Website' },
  { icon: '✏️', label: 'Existing Website Modification' },
  { icon: '⚡', label: 'Web Application' },
  { icon: '🤖', label: 'AI Integration' },
  { icon: '🔧', label: 'Bug Fixing' },
  { icon: '🎓', label: 'College Project' },
  { icon: '💼', label: 'Business Software' },
  { icon: '🛠️', label: 'Custom Requirement' },
];

const projectTypes = ['Website', 'Web Application', 'AI/ML', 'E-commerce', 'Portfolio', 'Business Website', 'College Project', 'Bug Fix', 'Custom Software', 'Other'];
const budgets = ['Under ₹5,000', '₹5,000–₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000+'];
const contactMethods = ['Email', 'Phone'];

export default function FreelanceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { preferredContact: 'Email' }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await requestsAPI.submit({ ...data, referenceWebsite: data.referenceWebsite || '' });
      setRequestId(res.data.requestId);
      setSubmitted(true);
      reset();
      toast.success('Project request submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyRequestId = () => {
    navigator.clipboard.writeText(requestId);
    toast.success('Request ID copied!');
  };

  return (
    <section id="freelance" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-tech mb-4">Hire Me</span>
          <h2 className="section-title">
            Need a <span className="gradient-text">Developer?</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Have an idea, website or software project? Tell me what you need and I&apos;ll help turn your idea into a working digital product.
          </p>
        </motion.div>

        {/* Service category quick select */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          {serviceCategories.map(({ icon, label }) => (
            <button
              key={label}
              onClick={() => {
                setSelectedCategory(label);
                // Map to closest project type
                const typeMap: Record<string, string> = {
                  'New Website': 'Website',
                  'Existing Website Modification': 'Bug Fix',
                  'Web Application': 'Web Application',
                  'AI Integration': 'AI/ML',
                  'Bug Fixing': 'Bug Fix',
                  'College Project': 'College Project',
                  'Business Software': 'Business Website',
                  'Custom Requirement': 'Custom Software',
                };
                setValue('projectType', typeMap[label] || 'Other');
                document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                selectedCategory === label
                  ? 'border-indigo-500 bg-[rgba(99,102,241,0.15)] text-white'
                  : 'border-[rgba(99,102,241,0.15)] text-[#a0a0b8] hover:border-indigo-400 hover:text-white hover:bg-[rgba(99,102,241,0.08)]'
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-center leading-tight text-xs">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Success state */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto glass-card p-10 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="font-space font-bold text-white text-2xl mb-2">Request Submitted!</h3>
            <p className="text-[#a0a0b8] mb-6">Your project request has been received. I&apos;ll review and respond within 24 hours.</p>

            <div className="bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)] rounded-2xl p-6 mb-6">
              <p className="text-sm text-[#6b6b8a] mb-2 uppercase tracking-wider">Your Request ID</p>
              <div className="font-space font-bold text-3xl gradient-text-blue mb-3">{requestId}</div>
              <p className="text-xs text-[#6b6b8a] mb-4">Save this ID to track your project status</p>
              <button onClick={copyRequestId} className="btn-secondary text-sm py-2 px-5 mx-auto">
                <Copy className="w-4 h-4" />
                <span>Copy Request ID</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setSubmitted(false); setSelectedCategory(''); }}
                className="btn-ghost text-sm"
              >
                Submit Another Request
              </button>
              <a href="#track" onClick={(e) => { e.preventDefault(); document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-sm">
                <span>Track My Request</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ) : (
          /* Request Form */
          <motion.div
            id="project-form"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto glass-card p-8"
          >
            <h3 className="font-space font-bold text-white text-xl mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-400" />
              Submit Project Request
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Full Name *</label>
                  <input {...register('name')} placeholder="Your name" className="input-field" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Email Address *</label>
                  <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Phone Number</label>
                  <input {...register('phone')} placeholder="+91 79857 18872" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Company / Organization</label>
                  <input {...register('company')} placeholder="Your company (optional)" className="input-field" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Project Type *</label>
                  <select {...register('projectType')} className="input-field cursor-pointer">
                    <option value="">Select type...</option>
                    {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.projectType && <p className="text-red-400 text-xs mt-1">{errors.projectType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Budget *</label>
                  <select {...register('budget')} className="input-field cursor-pointer">
                    <option value="">Select budget...</option>
                    {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Deadline</label>
                  <input {...register('deadline')} type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0b8] mb-1.5">Preferred Contact</label>
                  <select {...register('preferredContact')} className="input-field cursor-pointer">
                    {contactMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#a0a0b8] mb-1.5">Project Description * <span className="text-[#6b6b8a]">(min 20 chars)</span></label>
                <textarea {...register('description')} rows={4} placeholder="Describe your project idea, goals, and any specific requirements..." className="input-field resize-none" />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-[#a0a0b8] mb-1.5">Required Features</label>
                <textarea {...register('features')} rows={2} placeholder="List the key features you want (e.g., login system, payment gateway, AI chatbot...)" className="input-field resize-none" />
              </div>

              <div>
                <label className="block text-sm text-[#a0a0b8] mb-1.5">Reference Website</label>
                <input {...register('referenceWebsite')} placeholder="https://example.com (if you have a design reference)" className="input-field" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Project Request</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#6b6b8a]">
                You&apos;ll receive a confirmation email with your Request ID within minutes.
              </p>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
}
