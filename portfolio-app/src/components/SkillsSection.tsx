'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const skillCategories = [
  {
    category: 'Frontend',
    emoji: '🎨',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React', level: 85 },
      { name: 'Next.js', level: 80 },
      { name: 'JavaScript', level: 88 },
      { name: 'HTML/CSS', level: 92 },
      { name: 'Tailwind CSS', level: 87 },
    ]
  },
  {
    category: 'Backend',
    emoji: '⚙️',
    color: 'from-indigo-500 to-purple-500',
    skills: [
      { name: 'Node.js', level: 82 },
      { name: 'Express.js', level: 80 },
      { name: 'REST APIs', level: 85 },
      { name: 'Python', level: 75 },
    ]
  },
  {
    category: 'Database',
    emoji: '🗄️',
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'MongoDB', level: 80 },
      { name: 'MySQL', level: 72 },
      { name: 'Firebase', level: 70 },
    ]
  },
  {
    category: 'AI/ML',
    emoji: '🤖',
    color: 'from-pink-500 to-rose-500',
    skills: [
      { name: 'Machine Learning', level: 65 },
      { name: 'AI APIs', level: 78 },
      { name: 'Data Processing', level: 70 },
      { name: 'Python (ML)', level: 72 },
    ]
  },
  {
    category: 'Programming',
    emoji: '💻',
    color: 'from-orange-500 to-amber-500',
    skills: [
      { name: 'JavaScript', level: 88 },
      { name: 'C++', level: 75 },
      { name: 'C', level: 72 },
      { name: 'Python', level: 75 },
    ]
  },
  {
    category: 'Tools',
    emoji: '🔧',
    color: 'from-violet-500 to-purple-500',
    skills: [
      { name: 'Git & GitHub', level: 88 },
      { name: 'VS Code', level: 95 },
      { name: 'Docker', level: 60 },
      { name: 'Figma', level: 65 },
    ]
  }
];

const techBadges = [
  'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Python',
  'TypeScript', 'Tailwind CSS', 'REST API', 'Git', 'Docker', 'Figma',
  'Firebase', 'MySQL', 'Machine Learning', 'AI APIs', 'C++', 'HTML/CSS'
];

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#d0d0e0] font-medium">{name}</span>
        <span className="text-[#6b6b8a] text-xs">{level}%</span>
      </div>
      <div className="skill-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          className={`skill-bar-fill bg-gradient-to-r ${color}`}
          style={{ background: undefined }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('Frontend');

  const active = skillCategories.find(c => c.category === activeCategory) || skillCategories[0];

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-tech mb-4">Technical Skills</span>
          <h2 className="section-title">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Technologies I work with to build fast, scalable, and beautiful digital products.
          </p>
        </motion.div>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {techBadges.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="badge badge-tech hover:border-indigo-400 hover:text-indigo-300 cursor-default transition-all"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Interactive skill explorer */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Category selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-2"
          >
            {skillCategories.map(({ category, emoji, color }) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.4)] text-white'
                    : 'border border-transparent text-[#a0a0b8] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <div>
                  <div className="font-medium text-sm">{category}</div>
                  <div className="text-xs text-[#6b6b8a]">{skillCategories.find(c => c.category === category)?.skills.length} skills</div>
                </div>
                {activeCategory === category && (
                  <div className={`ml-auto w-2 h-2 rounded-full bg-gradient-to-br ${color}`} />
                )}
              </button>
            ))}
          </motion.div>

          {/* Skill bars */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{active.emoji}</span>
              <div>
                <h3 className="font-space font-bold text-white text-lg">{active.category}</h3>
                <p className="text-[#6b6b8a] text-sm">{active.skills.length} technologies</p>
              </div>
            </div>

            <div className="space-y-5">
              {active.skills.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={active.color}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] text-xs text-[#6b6b8a]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                <span>Proficiency level</span>
              </div>
              <div>
                <span className="text-indigo-400">60–75%</span> Intermediate
              </div>
              <div>
                <span className="text-indigo-400">75–95%</span> Advanced
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
