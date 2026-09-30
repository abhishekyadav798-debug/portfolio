'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { requestsAPI } from '@/lib/api';
import { Search, CheckCircle2, Clock, ChevronRight, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const statusSteps = [
  'Request Received',
  'Requirement Review',
  'Discussion',
  'Quotation',
  'Approved',
  'Development',
  'Testing',
  'Completed'
];

const statusColors: Record<string, string> = {
  'Request Received': 'status-received',
  'Requirement Review': 'status-review',
  'Discussion': 'status-discussion',
  'Quotation': 'status-quotation',
  'Approved': 'status-approved',
  'Development': 'status-development',
  'Testing': 'status-testing',
  'Completed': 'status-completed',
};

interface ProjectRequest {
  requestId: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  status: string;
  description: string;
  statusHistory: { status: string; note: string; updatedAt: string }[];
  quotation?: { amount: number; currency: string; description: string; validUntil: string };
  createdAt: string;
}

export default function TrackSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [requestId, setRequestId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectRequest | null>(null);

  const currentStepIndex = result ? statusSteps.indexOf(result.status) : -1;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId.trim() || !email.trim()) {
      toast.error('Please enter both Request ID and Email');
      return;
    }
    setLoading(true);
    try {
      const res = await requestsAPI.track(requestId.trim(), email.trim());
      setResult(res.data.request);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Request not found. Check your ID and email.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="track" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-tech mb-4">Track Request</span>
          <h2 className="section-title">
            Track My <span className="gradient-text">Project</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Enter your Request ID and email to check your project status in real time.
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <form onSubmit={handleTrack} className="glass-card p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#a0a0b8] mb-1.5">Request ID</label>
                <input
                  type="text"
                  placeholder="e.g. REQ-2026-1234"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value.toUpperCase())}
                  className="input-field font-mono tracking-wider"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0b8] mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="Email used when submitting"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 disabled:opacity-60"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <Search className="w-4 h-4" />}
                <span>{loading ? 'Searching...' : 'Track Request'}</span>
              </button>
            </div>
          </form>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Status header */}
              <div className="glass-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#6b6b8a] mb-1">Request ID</p>
                    <p className="font-mono font-bold text-white text-lg">{result.requestId}</p>
                  </div>
                  <span className={`badge text-xs px-3 py-1.5 rounded-full ${statusColors[result.status] || 'badge-tech'}`}>
                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-[#6b6b8a]">Client</span>
                    <p className="text-white font-medium">{result.name}</p>
                  </div>
                  <div>
                    <span className="text-[#6b6b8a]">Project Type</span>
                    <p className="text-white font-medium">{result.projectType}</p>
                  </div>
                  <div>
                    <span className="text-[#6b6b8a]">Budget</span>
                    <p className="text-emerald-400 font-medium">{result.budget}</p>
                  </div>
                  <div>
                    <span className="text-[#6b6b8a]">Submitted</span>
                    <p className="text-white font-medium">{new Date(result.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Progress tracker */}
              <div className="glass-card p-5">
                <h4 className="font-space font-bold text-white text-sm mb-5">Project Progress</h4>
                <div className="space-y-2">
                  {statusSteps.map((step, i) => {
                    const isCompleted = i < currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const isPending = i > currentStepIndex;

                    return (
                      <div key={step} className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isCompleted ? 'bg-emerald-500/20 border border-emerald-500/40' :
                          isCurrent ? 'bg-indigo-500/20 border border-indigo-500 animate-pulse-glow' :
                          'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.1)]" />
                          )}
                        </div>

                        {/* Label */}
                        <span className={`text-sm flex-1 ${
                          isCompleted ? 'text-emerald-400' :
                          isCurrent ? 'text-white font-medium' :
                          'text-[#6b6b8a]'
                        }`}>
                          {step}
                        </span>

                        {/* Connector line (between steps) */}
                        {isCurrent && <ChevronRight className="w-4 h-4 text-indigo-400 animate-pulse" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quotation (if available) */}
              {result.quotation?.amount && (
                <div className="glass-card p-5 border-emerald-500/20">
                  <h4 className="font-space font-bold text-white text-sm mb-3">💰 Quotation</h4>
                  <div className="text-3xl font-space font-bold text-emerald-400 mb-2">
                    {result.quotation.currency}{result.quotation.amount.toLocaleString('en-IN')}
                  </div>
                  {result.quotation.description && (
                    <p className="text-[#a0a0b8] text-sm">{result.quotation.description}</p>
                  )}
                </div>
              )}

              {/* Recent history */}
              {result.statusHistory?.length > 0 && (
                <div className="glass-card p-5">
                  <h4 className="font-space font-bold text-white text-sm mb-3">Recent Updates</h4>
                  <div className="space-y-2">
                    {result.statusHistory.slice(-3).reverse().map((h, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-[#6b6b8a] text-xs whitespace-nowrap mt-0.5">
                          {new Date(h.updatedAt).toLocaleDateString('en-IN')}
                        </span>
                        <div>
                          <span className="text-indigo-400 font-medium">{h.status}</span>
                          {h.note && <p className="text-[#a0a0b8] text-xs mt-0.5">{h.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <a
                  href={`#contact`}
                  onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-ghost text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact for Updates</span>
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
