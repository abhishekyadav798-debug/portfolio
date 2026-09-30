'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, BookOpen, X, Filter, Search } from 'lucide-react';
import { projectsAPI } from '@/lib/api';

const filters = ['All', 'Web', 'AI/ML', 'Full Stack', 'Software', 'Hackathon'];

// Placeholder projects for demo (replaced by API data when backend is running)
const demoProjects = [
  {
    _id: '1',
    title: 'AI-Powered Portfolio Platform',
    slug: 'ai-portfolio-platform',
    description: 'A full-stack portfolio platform with AI-driven project recommendations and smart search.',
    category: 'Full Stack',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'OpenAI API'],
    thumbnail: null,
    githubUrl: '#',
    liveUrl: '#',
    problem: 'Developers needed a smart way to showcase their work.',
    solution: 'Built an AI-powered platform that automatically categorizes and recommends projects.',
    features: ['AI recommendations', 'Real-time search', 'Admin dashboard', 'Analytics'],
    contribution: 'Full development from design to deployment.',
    results: 'Deployed and used by 50+ developers.',
    featured: true
  },
  {
    _id: '2',
    title: 'E-Commerce Full-Stack App',
    slug: 'ecommerce-fullstack',
    description: 'Complete e-commerce platform with authentication, payments, and admin panel.',
    category: 'Full Stack',
    technologies: ['React', 'Express.js', 'MongoDB', 'Stripe'],
    thumbnail: null,
    githubUrl: '#',
    liveUrl: '#',
    problem: 'Local businesses needed an affordable online store.',
    solution: 'Built a scalable MERN stack e-commerce platform.',
    features: ['Product catalog', 'Shopping cart', 'Stripe payments', 'Admin panel'],
    contribution: 'Solo development — frontend, backend, database.',
    results: 'Processing 100+ orders per month.',
    featured: true
  },
  {
    _id: '3',
    title: 'ML Sentiment Analyzer',
    slug: 'ml-sentiment-analyzer',
    description: 'Python-based machine learning app for real-time sentiment analysis of text and social data.',
    category: 'AI/ML',
    technologies: ['Python', 'Flask', 'scikit-learn', 'React'],
    thumbnail: null,
    githubUrl: '#',
    liveUrl: '#',
    problem: 'Businesses needed automated feedback analysis.',
    solution: 'Trained an ML model for sentiment classification with 92% accuracy.',
    features: ['Real-time analysis', 'REST API', 'Dashboard', 'Batch processing'],
    contribution: 'ML model training and web interface.',
    results: '92% accuracy on test data.',
    featured: false
  },
  {
    _id: '4',
    title: 'Business Landing Page',
    slug: 'business-landing',
    description: 'Modern, animated landing page for a tech startup with smooth interactions.',
    category: 'Web',
    technologies: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    thumbnail: null,
    githubUrl: '#',
    liveUrl: '#',
    problem: 'Startup needed a compelling first impression online.',
    solution: 'Designed and built a high-converting landing page.',
    features: ['Animated sections', 'Contact form', 'SEO optimized', 'Mobile responsive'],
    contribution: 'Design and development.',
    results: '40% increase in inquiries.',
    featured: false
  },
  {
    _id: '5',
    title: 'Smart Chatbot Integration',
    slug: 'smart-chatbot',
    description: 'AI chatbot built with Gemini API for automated customer support and lead generation.',
    category: 'AI/ML',
    technologies: ['Node.js', 'Gemini API', 'React', 'MongoDB'],
    thumbnail: null,
    githubUrl: '#',
    liveUrl: '#',
    problem: 'Small businesses needed 24/7 customer support.',
    solution: 'Built a smart AI chatbot with context-aware responses.',
    features: ['Contextual responses', 'Lead capture', 'Multi-platform', 'Analytics'],
    contribution: 'Full development.',
    results: '60% reduction in support queries.',
    featured: false
  },
  {
    _id: '6',
    title: 'Student Management System',
    slug: 'student-management',
    description: 'Complete student management software for educational institutions.',
    category: 'Software',
    technologies: ['Python', 'MySQL', 'Tkinter', 'ReportLab'],
    thumbnail: null,
    githubUrl: '#',
    liveUrl: null,
    problem: 'Manual student record management was inefficient.',
    solution: 'Automated system for attendance, grades, and report generation.',
    features: ['Attendance tracking', 'Grade management', 'PDF reports', 'Search & filter'],
    contribution: 'Solo development.',
    results: 'Used by 500+ students at college.',
    featured: false
  }
];

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  thumbnail: string | null;
  githubUrl: string;
  liveUrl: string | null;
  problem?: string;
  solution?: string;
  features?: string[];
  contribution?: string;
  results?: string;
  featured?: boolean;
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0f0f1a] border border-[rgba(99,102,241,0.2)] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0f0f1a] border-b border-[rgba(255,255,255,0.06)] p-6 flex items-start justify-between z-10">
          <div>
            <span className="badge badge-tech text-xs mb-2">{project.category}</span>
            <h2 className="font-space font-bold text-white text-xl">{project.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#a0a0b8] hover:text-white transition-colors ml-4 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="badge badge-tech">{tech}</span>
            ))}
          </div>

          {/* Details */}
          {[
            { label: '🔍 Problem', content: project.problem },
            { label: '💡 Solution', content: project.solution },
            { label: '👨‍💻 My Contribution', content: project.contribution },
            { label: '📊 Results', content: project.results }
          ].map(({ label, content }) => content && (
            <div key={label}>
              <h3 className="font-semibold text-white text-sm mb-2">{label}</h3>
              <p className="text-[#a0a0b8] text-sm leading-relaxed">{content}</p>
            </div>
          ))}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-white text-sm mb-2">✨ Key Features</h3>
              <ul className="grid grid-cols-2 gap-1.5">
                {project.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#a0a0b8]">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {project.githubUrl && project.githubUrl !== '#' && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm flex-1 justify-center py-2.5">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex-1 justify-center py-2.5">
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await projectsAPI.getAll();
        if (res.data.projects?.length > 0) {
          setProjects(res.data.projects);
        }
      } catch {
        // Use demo data if API not available
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchFilter = activeFilter === 'All' || p.category === activeFilter;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-tech mb-4">Portfolio</span>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Real-world projects built with modern technologies. Click any card to see full case study.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                    : 'border border-[rgba(99,102,241,0.2)] text-[#a0a0b8] hover:text-white hover:border-indigo-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card overflow-hidden cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                {/* Thumbnail */}
                <div className="h-44 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                      {project.category === 'AI/ML' ? '🤖' : project.category === 'Web' ? '🌐' : project.category === 'Software' ? '💻' : '⚡'}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent" />
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-tech text-xs">{project.category}</span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-indigo-600/80 px-4 py-2 rounded-full">View Case Study</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-space font-bold text-white text-base mb-2 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                  <p className="text-[#a0a0b8] text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="badge badge-tech text-xs">{tech}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="badge badge-tech text-xs">+{project.technologies.length - 4}</span>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)]" onClick={(e) => e.stopPropagation()}>
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Demo</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="btn-ghost text-xs py-1.5 px-3 ml-auto text-indigo-400 hover:text-indigo-300"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Case Study</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6b6b8a]">
            <p className="text-lg mb-2">No projects found</p>
            <p className="text-sm">Try a different filter or search term</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
