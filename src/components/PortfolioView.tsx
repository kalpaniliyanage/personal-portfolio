import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Briefcase, Award, GraduationCap, 
  ChevronRight, Code2, Layout, Database, Zap, Check, AlertTriangle, Maximize2, 
  ChevronLeft, Play, Pause, X, FileText, Sparkles, BookOpen, Globe, Laptop, Plus, Trash, Edit, Save, Upload
} from 'lucide-react';
import { PortfolioData, Project, Academic, Passion, Certification, Blog, Article } from '../types';
import { ColorScheme } from '../utils/theme';
import { playSound } from '../utils/sound';
interface PortfolioViewProps {
  data: PortfolioData;
  scheme: ColorScheme;
  isDarkMode: boolean;
}

function getFacebookEmbedUrl(url: string): string | null {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (
    lower.includes('facebook.com') ||
    lower.includes('fb.watch') ||
    lower.includes('fb.com')
  ) {
    if (lower.includes('plugins/video.php')) return url;
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=500`;
  }
  return null;
}

function getServiceIcon(name?: string, schemeClass?: string) {
  const cls = `h-6 w-6 ${schemeClass || ''}`;
  switch (name) {
    case 'Laptop': return <Laptop className={cls} />;
    case 'Code2': return <Code2 className={cls} />;
    case 'Layout': return <Layout className={cls} />;
    case 'Database': return <Database className={cls} />;
    case 'Zap': return <Zap className={cls} />;
    case 'Globe': return <Globe className={cls} />;
    case 'BookOpen': return <BookOpen className={cls} />;
    case 'Sparkles': return <Sparkles className={cls} />;
    default: return <Code2 className={cls} />;
  }
}

export default function PortfolioView({ data, scheme, isDarkMode }: PortfolioViewProps) {
  const { personal, projects, experience, skills, academics = [], passions = [], certifications, blogs = [], articles = [], customization } = data;

  const fallbackCertifications = [
    {
      id: "cert-1",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services (AWS)",
      credentialId: "AWS-CCP-98231",
      date: "2025",
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "cert-2",
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta / Coursera",
      credentialId: "META-FED-04821",
      date: "2025",
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const displayCertifications = certifications !== undefined
    ? certifications
    : fallbackCertifications;

  // Modals / Interactive States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{ title: string; url: string; issuer?: string; credentialId?: string; date?: string } | null>(null);
  const [selectedAcademic, setSelectedAcademic] = useState<Academic | null>(null);
  const [activeAcademicImageIdx, setActiveAcademicImageIdx] = useState<number>(0);
  const [selectedPassion, setSelectedPassion] = useState<Passion | null>(null);
  const [activePassionImageIdx, setActivePassionImageIdx] = useState<number>(0);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeBlogTab, setActiveBlogTab] = useState<'blogs' | 'articles'>('blogs');
  const [projectFilter, setProjectFilter] = useState('All');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Dynamic roles carousel for user-friendly motion
  const [roleIndex, setRoleIndex] = useState(0);
  const rotatingRoles = personal.role
    ? personal.role.split('|').map(r => r.trim()).filter(Boolean)
    : [
        "BICT Undergraduate Student",
        "Faculty of Technology, USJP",
        "Full-Stack Web Developer",
        "UI/UX Design Enthusiast"
      ];
  const safeRoleIndex = roleIndex >= rotatingRoles.length ? 0 : roleIndex;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % (rotatingRoles.length || 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingRoles.length]);

  const handleStatClick = (label: string) => {
    const norm = label.toLowerCase();
    let id: string | null = null;
    if (norm.includes('project')) {
      id = 'projects';
    } else if (norm.includes('undergrad') || norm.includes('degree') || norm.includes('academic') || norm.includes('uom') || norm.includes('usjp')) {
      id = 'academics';
    } else if (norm.includes('skill')) {
      id = 'skills';
    } else if (norm.includes('passion') || norm.includes('interest')) {
      id = 'passions';
    } else if (norm.includes('certificate')) {
      id = 'certificates';
    } else if (norm.includes('blog') || norm.includes('article')) {
      id = 'blogs';
    }

    if (id) {
      playSound('click');
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Helper to open project media modal
  const openProjectMedia = (project: Project) => {
    setSelectedProject(project);
    setActiveMediaIndex(0);
    setIsPlayingVideo(false);
  };

  // Helper to trigger contact form email submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    playSound('click');
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      playSound('success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setSendSuccess(false), 5000);
    }, 1200);
  };

  // Dynamic icon helper for competencies
  const renderCompetencyIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('web') || t.includes('app')) {
      return <Zap className={`h-5 w-5 ${isDarkMode ? scheme.darkText : scheme.text}`} />;
    }
    if (t.includes('interface') || t.includes('ui') || t.includes('user')) {
      return <Layout className={`h-5 w-5 ${isDarkMode ? scheme.darkText : scheme.text}`} />;
    }
    if (t.includes('database') || t.includes('system') || t.includes('data')) {
      return <Database className={`h-5 w-5 ${isDarkMode ? scheme.darkText : scheme.text}`} />;
    }
    return <Code2 className={`h-5 w-5 ${isDarkMode ? scheme.darkText : scheme.text}`} />;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-28 overflow-x-hidden"
    >
      {/* 1. Hero Section (Photo included on TOP, not on side) */}
      <section id="about" className="relative flex flex-col items-center text-center pt-6 pb-4 scroll-mt-20">
        <motion.div variants={itemVariants} className="relative mb-6">
          {/* Status Badge */}
          <div className={`mb-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-semibold transition-all ${
            isDarkMode 
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 shadow-lg shadow-black/10' 
              : 'bg-zinc-100/80 border-zinc-200 text-zinc-600 shadow-sm'
          }`}>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${scheme.primaryBg} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${scheme.primaryBg}`}></span>
            </span>
            Available for Freelance & Remote Work
          </div>

          {/* Profile Photo Centered at Top with Increasable Responsive Size and Interactive Motion */}
          <div className="flex flex-col items-center justify-center mt-4">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
              className="relative group"
            >
              {/* Rotating glowing halo behind image */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[36px] blur-md opacity-75 group-hover:opacity-100 animate-pulse duration-3000 pointer-events-none" />
              
              <div className={`relative h-56 w-56 sm:h-64 sm:w-64 rounded-[32px] overflow-hidden border-4 p-1 transition-all shadow-2xl bg-slate-900/40 ${
                isDarkMode ? 'border-indigo-500/60' : 'border-indigo-400'
              }`}>
                {personal.avatarUrl ? (
                  <img
                    src={personal.avatarUrl}
                    alt={personal.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full rounded-[24px] object-cover transition-transform duration-500"
                  />
                ) : (
                  <div className={`h-full w-full rounded-[24px] flex items-center justify-center text-6xl font-display font-bold border ${
                    isDarkMode 
                      ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800' 
                      : `${scheme.lightBg} ${scheme.text} border-zinc-200`
                  }`}>
                    {personal.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Floating Role Badge with motion */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-mono font-bold text-[11px] tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg border border-indigo-400/50 flex items-center gap-1.5 whitespace-nowrap z-10"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                🎓 {rotatingRoles[0] || "ICT Undergraduate"}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Heading name */}
        <motion.h1
          variants={itemVariants}
          className={`font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl transition-colors ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}
        >
          Hey, I&apos;m <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
            isDarkMode ? 'from-indigo-400 via-purple-400 to-pink-400' : `${scheme.gradientFrom} to-violet-650`
          }`}>{personal.name}</span>
        </motion.h1>

        {/* BICT undergraduate role with beautiful sliding motion */}
        <div className="h-10 overflow-hidden mt-5 flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`text-base sm:text-lg md:text-xl font-bold tracking-tight max-w-3xl flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                isDarkMode 
                  ? 'bg-indigo-950/40 border-indigo-900/50 text-indigo-300' 
                  : 'bg-indigo-50 border-indigo-100 text-indigo-700'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-400 animate-spin-slow shrink-0" />
              <span>{rotatingRoles[safeRoleIndex]}</span>
              <Sparkles className="h-4 w-4 text-amber-400 animate-spin-slow shrink-0" />
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Original full role as descriptive subtext */}
        <motion.p
          variants={itemVariants}
          className={`mt-3 text-xs sm:text-sm font-semibold tracking-wider font-mono transition-colors uppercase ${
            isDarkMode ? 'text-indigo-300/60' : 'text-zinc-500'
          }`}
        >
          {personal.role}
        </motion.p>

        {/* Bio text */}
        <motion.p
          variants={itemVariants}
          className={`mt-6 text-sm sm:text-base leading-relaxed max-w-3xl transition-colors ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
          }`}
        >
          {personal.bio}
        </motion.p>

        {/* Contact direct details row */}
        <motion.div 
          variants={itemVariants} 
          className="mt-8 flex flex-wrap gap-4 justify-center items-center text-xs font-mono"
        >
          {personal.location && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDarkMode ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-600'
            }`}>
              <MapPin className="h-3.5 w-3.5 opacity-85 text-indigo-400" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.email && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDarkMode ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-600'
            }`}>
              <Mail className="h-3.5 w-3.5 opacity-85 text-emerald-400" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDarkMode ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-600'
            }`}>
              <Phone className="h-3.5 w-3.5 opacity-85 text-amber-400" />
              <span>{personal.phone}</span>
            </div>
          )}
        </motion.div>

        {/* Action button triggers & Social contacts */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#contact"
            className={`rounded-xl px-7 py-3.5 font-bold text-sm text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 cursor-pointer flex items-center gap-2`}
          >
            Let&apos;s Talk
            <ChevronRight className="h-4 w-4" />
          </a>
          <button
            onClick={() => {
              // Click the studio editor trigger programmatically
              document.getElementById('toggle-studio-editor-btn')?.click();
            }}
            className={`rounded-xl px-7 py-3.5 font-bold text-sm transition-all shadow-xs duration-200 border cursor-pointer ${
              isDarkMode
                ? 'text-zinc-200 bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                : 'text-zinc-700 bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            Configure Portfolio
          </button>

          {/* Socials shortcut icons */}
          <div className="flex gap-2.5 sm:ml-4">
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    : 'border-zinc-200 hover:border-zinc-350 bg-white text-zinc-550 hover:text-zinc-900'
                }`}
              >
                <Github className="h-4.5 w-4.5" />
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    : 'border-zinc-200 hover:border-zinc-350 bg-white text-zinc-550 hover:text-zinc-900'
                }`}
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* 2. You Know About Me Section */}
      <section className="scroll-mt-20 border-t pt-20 border-zinc-800/10 dark:border-zinc-800/60">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left: Headline bio & Stats Grid */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
                isDarkMode ? scheme.darkText : scheme.text
              }`}>Discover Me</span>
              <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>You Know About Me</h2>
            </div>
            
            <p className={`text-sm sm:text-base leading-relaxed transition-colors ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
            }`}>
              I enjoy translating complex user requirements into elegant, high-quality, and reliable software. Driven by structural logic and detailed UI/UX parameters, my work aligns performance with responsive layouts and smooth client states.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {(personal.stats || [
                { id: "stat-1", value: "2+", label: "ACADEMIC PROJECTS" },
                { id: "stat-2", value: "USJP", label: "UNDERGRADUATE" },
                { id: "stat-3", value: "BICT", label: "DEGREE FOCUS" },
                { id: "stat-4", value: "100%", label: "DEDICATION" }
              ]).map((st) => {
                const norm = st.label.toLowerCase();
                const isClickable = norm.includes('project') || norm.includes('undergrad') || norm.includes('degree') || norm.includes('academic') || norm.includes('uom') || norm.includes('usjp') || norm.includes('skill') || norm.includes('passion') || norm.includes('interest') || norm.includes('certificate') || norm.includes('blog') || norm.includes('article');
                
                // Dynamically update the value for the projects stat to reflect the actual list length
                const displayValue = norm.includes('project') 
                  ? `${projects.length}+` 
                  : st.value;
                
                return (
                  <div 
                    key={st.id} 
                    onClick={() => isClickable && handleStatClick(st.label)}
                    className={`p-5 rounded-2xl border text-center transition-all duration-350 select-none group ${
                      isClickable 
                        ? 'cursor-pointer hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]' 
                        : ''
                    } ${
                      isDarkMode 
                        ? `bg-zinc-900/30 border-zinc-850/80 ${
                            isClickable 
                              ? 'hover:border-indigo-500 hover:bg-indigo-950/15 shadow-lg shadow-indigo-950/5' 
                              : 'hover:border-zinc-800'
                          }` 
                        : `bg-white border-zinc-150 shadow-2xs ${
                            isClickable 
                              ? 'hover:border-indigo-400 hover:bg-indigo-50/15 hover:shadow-md' 
                              : 'hover:shadow-sm'
                          }`
                    }`}
                  >
                    <div className={`text-2xl sm:text-3xl font-black font-display transition-colors duration-300 ${
                      isClickable 
                        ? 'group-hover:text-indigo-400 dark:group-hover:text-indigo-300' 
                        : ''
                    } ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {displayValue}
                    </div>
                    <div className={`mt-1.5 text-[10px] font-mono tracking-wider transition-colors duration-300 flex items-center justify-center gap-1 ${
                      isClickable 
                        ? 'group-hover:text-indigo-500/90 dark:group-hover:text-indigo-400' 
                        : ''
                    } ${
                      isDarkMode ? 'text-zinc-500' : 'text-zinc-450'
                    }`}>
                      <span>{st.label}</span>
                      {isClickable && (
                        <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          ↗
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Competencies/Capabilities List */}
          <div className="lg:col-span-7 space-y-4">
            {(personal.competencies || [
              {
                id: "comp-1",
                title: "Web & App Development",
                description: "Building hands-on, end-to-end web applications like SkoolGo and AutoCare to tackle real-world organizational challenges.",
                icon: "Code2"
              },
              {
                id: "comp-2",
                title: "User Interface Crafting",
                description: "Caring deeply about responsive web layouts, readable typography pairings, fluid interactions, and mobile usability.",
                icon: "Layout"
              },
              {
                id: "comp-3",
                title: "Database & Systems",
                description: "Designing structured relational schemas and managing databases using modern SQL and cloud-hosted data engines like Firebase.",
                icon: "Database"
              },
              {
                id: "comp-4",
                title: "Practical Problem Solving",
                description: "Translating complex user scenarios and logistical requirements into simple, reliable, and secure software applications.",
                icon: "Zap"
              }
            ]).map((c) => (
              <div
                key={c.id}
                className={`p-5 sm:p-6 rounded-2xl border flex gap-4 transition-all duration-350 ${
                  isDarkMode
                    ? 'bg-zinc-900/35 border-zinc-850/80 hover:bg-zinc-900/50 hover:border-zinc-800'
                    : 'bg-white border-zinc-200/70 hover:bg-zinc-50/40 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                  isDarkMode 
                    ? 'bg-zinc-950/60 border-zinc-800/80' 
                    : 'bg-zinc-50 border-zinc-150'
                }`}>
                  {renderCompetencyIcon(c.title)}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-base font-bold transition-colors ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {c.title}
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Technical Skills Section */}
      <section id="skills" className="scroll-mt-20 pt-8">
        <div className="mb-10 text-center lg:text-left">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
            isDarkMode ? scheme.darkText : scheme.text
          }`}>Core Competencies</span>
          <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 transition-colors ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>Technical Skills</h2>
          <p className={`mt-2 max-w-xl text-sm transition-colors ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
          }`}>
            An overview of technologies, frameworks, databases, and collaboration tools I enjoy building with.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skillCat) => (
            <motion.div
              key={skillCat.id}
              variants={itemVariants}
              className={`p-6 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-zinc-900/40 border-zinc-850/80 hover:border-zinc-800'
                  : 'bg-white border-zinc-200/60 shadow-2xs hover:shadow-xs'
              }`}
            >
              <h3 className={`font-display text-base font-bold pb-4 flex items-center gap-2 border-b transition-colors ${
                isDarkMode ? 'text-white border-zinc-850/60' : 'text-zinc-900 border-zinc-100'
              }`}>
                <span className={`h-2 w-2 rounded-full ${scheme.primaryBg}`}></span>
                {skillCat.category}
              </h3>
              
              <div className="mt-5 space-y-4">
                {skillCat.list.map((skill) => {
                  // Get percentage if available, otherwise mock a high level (e.g. 85-98)
                  const pValue = skillCat.percentages?.[skill] || 
                    (skill.toLowerCase().includes('typescript') ? 92 :
                     skill.toLowerCase().includes('react') ? 95 :
                     skill.toLowerCase().includes('tailwind') ? 98 :
                     skill.toLowerCase().includes('node') ? 90 :
                     skill.toLowerCase().includes('postgres') ? 85 :
                     skill.toLowerCase().includes('git') ? 95 : 88);

                  return (
                    <div key={skill} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className={`font-bold transition-colors ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>{skill}</span>
                        <span className={isDarkMode ? scheme.darkText : scheme.text}>{pValue}%</span>
                      </div>
                      
                      {/* Interactive Progress Bar */}
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-zinc-950' : 'bg-zinc-100'
                      }`}>
                        <div 
                          className={`h-full rounded-full ${scheme.primaryBg} transition-all duration-1000`} 
                          style={{ width: `${pValue}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Featured Projects Section with Dynamic Filtering & Scroll-Triggered Reveal Animations */}
      <section id="projects" className="scroll-mt-20 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <span className={`text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${
              isDarkMode ? scheme.darkText : scheme.text
            }`}>
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 animate-pulse" />
              Development Highlights
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 transition-colors ${
              isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>Featured Projects</h2>
          </div>
          <p className={`max-w-md text-sm transition-colors leading-relaxed ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
          }`}>
            A selection of web development projects, automation tools, and creative digital designs I have developed. Use the interactive filter below to explore by technology stacks.
          </p>
        </div>

        {/* Dynamic Category Filter Tabs with Layout Transitions */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
          {['All', 'React', 'Node.js', 'Express', 'Database'].map((category) => {
            const isActive = projectFilter === category;
            return (
              <button
                key={category}
                onClick={() => {
                  playSound('hover');
                  setProjectFilter(category);
                }}
                className={`relative px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'text-white'
                    : isDarkMode
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-850/40'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                }`}
              >
                {/* Framer Motion Background Pill Layout Animation */}
                {isActive && (
                  <motion.span
                    layoutId="activeProjectPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className={`absolute inset-0 rounded-lg -z-10 ${scheme.primaryBg}`}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        {/* Filtered Projects Grid with AnimatePresence */}
        <motion.div 
          layout
          className="grid gap-8 sm:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {projects
              .filter(project => {
                if (projectFilter === 'All') return true;
                if (projectFilter === 'Database') {
                  return project.tags.some(tag => 
                    ['postgresql', 'firebase', 'sql', 'database', 'firestore'].includes(tag.toLowerCase())
                  );
                }
                return project.tags.some(tag => 
                  tag.toLowerCase() === projectFilter.toLowerCase() || 
                  tag.toLowerCase().includes(projectFilter.toLowerCase())
                );
              })
              .map((project, idx) => {
                const mediaLength = project.media?.length || 0;
                const hasVideo = !!project.videoUrl;

                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 30 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 15,
                    }}
                    whileHover={{ y: -6 }}
                    className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-zinc-900/40 border-zinc-850/80 hover:border-zinc-800 shadow-md hover:shadow-xl hover:shadow-indigo-950/20'
                        : 'bg-white border border-zinc-200/70 shadow-xs hover:shadow-lg hover:shadow-zinc-200/30'
                    }`}
                  >
                    {/* Image & Badges Container */}
                    <div className={`relative overflow-hidden aspect-video border-b ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-850/60' : 'bg-zinc-50 border-zinc-100'
                    }`}>
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      )}

                      {/* Absolute badging inside image matching screenshot 4 */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        {hasVideo && (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/95 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-md shadow-xs backdrop-blur-xs">
                            <Play className="h-2.5 w-2.5 fill-current animate-pulse" />
                            DEMO VIDEO
                          </span>
                        )}
                        {mediaLength > 0 && (
                          <span className="inline-flex items-center bg-indigo-500/95 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-md shadow-xs backdrop-blur-xs">
                            +{mediaLength} PHOTOS
                          </span>
                        )}
                      </div>

                      <span className={`absolute bottom-3 left-3 bg-zinc-950/90 text-zinc-300 border border-zinc-800 text-[10px] font-mono px-2.5 py-1 rounded-full z-10`}>
                        Project #{idx + 1}
                      </span>

                      {/* Subtle elegant gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none" />
                    </div>

                    {/* Content details */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex-grow space-y-3">
                        <h3 className={`font-display text-xl font-bold transition-colors group-hover:text-indigo-400 dark:group-hover:text-indigo-300 ${
                          isDarkMode ? 'text-white' : 'text-zinc-900'
                        }`}>
                          {project.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors ${
                          isDarkMode ? 'text-zinc-300' : 'text-zinc-650'
                        }`}>
                          {project.description}
                        </p>
                      </div>
                      
                      {/* Tech stack badges */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono transition-colors ${
                              isDarkMode
                                ? `${scheme.darkBadgeBg} ${scheme.darkBadgeText} ${scheme.darkBadgeBorder}`
                                : `${scheme.badgeBg} ${scheme.badgeText} ${scheme.badgeBorder}`
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions Bar matching screenshot 4 */}
                      <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t ${
                        isDarkMode ? 'border-zinc-850/60' : 'border-zinc-100'
                      }`}>
                        <button
                          onClick={() => openProjectMedia(project)}
                          className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                            isDarkMode ? scheme.darkText : scheme.text
                          } hover:underline`}
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                          View Photos & Video
                        </button>

                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                              isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                          >
                            View Repository
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 5. Education & Credentials (Academics) Section */}
      <section id="academics" className="scroll-mt-20 pt-8">
        <div className="mb-10 text-center lg:text-left">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
            isDarkMode ? scheme.darkText : scheme.text
          }`}>Academic Pathway</span>
          <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 transition-colors ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>Education & Credentials</h2>
          <p className={`mt-2 max-w-xl text-sm transition-colors ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
          }`}>
            A showcase of my academic degrees, high school background, and academic qualifications.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {academics.map((acad) => (
            <motion.div
              key={acad.id}
              variants={itemVariants}
              className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                isDarkMode
                  ? 'bg-zinc-900/40 border-zinc-850/80 hover:border-zinc-800'
                  : 'bg-white border border-zinc-200/60 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono transition-colors ${
                      isDarkMode
                        ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                    }`}>
                      {acad.duration}
                    </span>
                    <h3 className={`font-display text-lg font-bold mt-1 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {acad.degree}
                    </h3>
                    <p className={`text-sm font-semibold transition-colors ${
                      isDarkMode ? scheme.darkText : scheme.text
                    }`}>
                      {acad.institution}
                    </p>
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    isDarkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-50 border-zinc-150'
                  }`}>
                    <GraduationCap className={`h-5 w-5 ${isDarkMode ? scheme.darkText : scheme.text}`} />
                  </div>
                </div>

                <p className={`text-sm leading-relaxed transition-colors ${
                  isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  {acad.description}
                </p>
              </div>

              {((acad.images && acad.images.length > 0) || acad.certificateUrl) && (
                <div className="mt-6 pt-4 border-t border-zinc-800/10 dark:border-zinc-800/60 flex flex-wrap gap-3">
                  {acad.images && acad.images.length > 0 ? (
                    <button
                      onClick={() => {
                        setSelectedAcademic(acad);
                        setActiveAcademicImageIdx(0);
                      }}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                        isDarkMode ? `${scheme.darkText} hover:text-white` : `${scheme.text} ${scheme.textHover}`
                      }`}
                    >
                      <Award className="h-3.5 w-3.5" />
                      View Certificate Gallery ({acad.images.length})
                    </button>
                  ) : (
                    acad.certificateUrl && (
                      <a
                        href={acad.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playSound('click')}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                          isDarkMode ? `${scheme.darkText} hover:text-white` : `${scheme.text} ${scheme.textHover}`
                        }`}
                      >
                        <Award className="h-3.5 w-3.5" />
                        View Certificate Document
                      </a>
                    )
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5.5. Certificates Archived Section */}
      <section id="certificates" className="scroll-mt-20 pt-16 border-t border-zinc-800/10 dark:border-zinc-800/60 animate-fade-in">
        <div className="mb-10 text-center lg:text-left">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 justify-center lg:justify-start ${
            isDarkMode ? scheme.darkText : scheme.text
          }`}>
            <Award className="h-4 w-4 text-amber-500 shrink-0" />
            Verified Career Credentials
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 transition-colors ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>Certificates Archived</h2>
          <p className={`mt-2 max-w-xl text-sm transition-colors leading-relaxed ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
          }`}>
            Securely preserve, organize, and showcase your professional career achievements, accredited digital badges, and official certifications.
          </p>
        </div>

        {displayCertifications.length === 0 ? (
          <div className={`p-10 text-center rounded-3xl border border-dashed ${
            isDarkMode ? 'bg-zinc-900/10 border-zinc-800' : 'bg-zinc-50/30 border-zinc-200'
          }`}>
            <Award className="h-8 w-8 mx-auto text-zinc-500 mb-3" />
            <p className="text-sm font-bold text-zinc-400">No archived certificates found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayCertifications.map((cert) => {
              return (
                <motion.div
                  key={cert.id}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                    isDarkMode
                      ? 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-800 hover:shadow-xl hover:shadow-indigo-950/10'
                      : 'bg-white border border-zinc-200/60 shadow-xs hover:shadow-lg hover:shadow-zinc-100'
                  }`}
                >
                  {/* Subtle top color bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                    isDarkMode ? scheme.darkBadgeBg : scheme.badgeBg
                  }`} />

                  <div className="space-y-4">
                    {/* Certificate Preview Image */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center group/img">
                      {cert.url ? (
                        <img
                          src={cert.url}
                          alt={cert.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Award className="h-12 w-12 text-zinc-700" />
                      )}
                      
                      {cert.url && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              playSound('click');
                              setSelectedCertificate({
                                title: cert.title,
                                url: cert.url || '',
                                issuer: cert.issuer,
                                credentialId: cert.credentialId,
                                date: cert.date
                              });
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all scale-90 group-hover/img:scale-100"
                            title="Maximize Certificate View"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-display text-sm font-bold transition-colors line-clamp-1 ${
                          isDarkMode ? 'text-white' : 'text-zinc-900'
                        }`}>
                          {cert.title}
                        </h3>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isDarkMode
                            ? `${scheme.darkBadgeBg} ${scheme.darkBadgeText}`
                            : `${scheme.badgeBg} ${scheme.badgeText}`
                        }`}>
                          {cert.date}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className={`text-xs transition-colors font-medium ${
                          isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
                        }`}>
                          🏛️ {cert.issuer}
                        </p>
                        {cert.credentialId && (
                          <p className="text-[10px] font-mono text-zinc-500">
                            ID: {cert.credentialId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t flex items-center justify-between gap-2 border-zinc-800/10 dark:border-zinc-800/60 font-medium">
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedCertificate({
                          title: cert.title,
                          url: cert.url || '',
                          issuer: cert.issuer,
                          credentialId: cert.credentialId,
                          date: cert.date
                        });
                      }}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:underline ${
                        isDarkMode ? `${scheme.darkText} hover:text-white` : `${scheme.text} ${scheme.textHover}`
                      }`}
                    >
                      <Award className="h-3.5 w-3.5" />
                      View Certificate
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>


      {/* 6. Extra-Curricular Activities (Passions) Section */}
      <section id="passions" className="scroll-mt-20 pt-8">
        <div className="mb-10 text-center lg:text-left">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
            isDarkMode ? scheme.darkText : scheme.text
          }`}>Talents & Passions</span>
          <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 transition-colors ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>Extra-Curricular Activities</h2>
          <p className={`mt-2 max-w-xl text-sm transition-colors ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
          }`}>
            Beyond academic engineering, I am passionate about creative expression, performance arts, and leadership activities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {passions.map((p) => {
            const hasImages = p.images && p.images.length > 0;
            return (
              <motion.div
                key={p.id}
                variants={itemVariants}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row ${
                  isDarkMode
                    ? 'bg-zinc-900/35 border-zinc-850/80 hover:border-zinc-800'
                    : 'bg-white border border-zinc-200/60 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Left Side: Thumbnail with Slide Indicator matching screenshot 6 */}
                {p.imageUrl && (
                  <div 
                    onClick={() => {
                      setSelectedPassion(p);
                      setActivePassionImageIdx(0);
                    }}
                    className={`relative w-full sm:w-44 h-48 sm:h-auto shrink-0 cursor-pointer overflow-hidden group ${
                      isDarkMode ? 'bg-zinc-950 border-r border-zinc-850' : 'bg-zinc-50 border-r border-zinc-150'
                    }`}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Floating Indicators */}
                    <span className="absolute top-2.5 left-2.5 bg-zinc-950/80 text-[10px] font-mono font-bold text-zinc-300 px-2 py-0.5 rounded border border-zinc-800 backdrop-blur-xs">
                      1 / {p.images?.length || 1}
                    </span>
                    
                    <span className="absolute top-2.5 right-2.5 bg-zinc-950/80 p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-white backdrop-blur-xs">
                      <Maximize2 className="h-3 w-3" />
                    </span>
                  </div>
                )}

                {/* Right Side Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="space-y-3">
                    <span className={`inline-flex items-center text-[10px] font-mono font-bold tracking-wider ${
                      isDarkMode ? scheme.darkText : scheme.text
                    }`}>
                      {p.category}
                    </span>
                    <h3 className={`font-display text-lg font-bold transition-colors ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {p.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
                    }`}>
                      {p.description}
                    </p>
                  </div>

                  <div className={`mt-5 pt-3 border-t flex items-center ${
                    isDarkMode ? 'border-zinc-850/60' : 'border-zinc-100'
                  }`}>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Creative Showcase</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${scheme.primaryBg} ml-auto`}></span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. Personally Written Blogs & Standalone Articles Section */}
      {((blogs && blogs.length > 0) || (articles && articles.length > 0)) && (
        <section id="blogs" className="scroll-mt-20 pt-16 border-t border-zinc-800/10 dark:border-zinc-800/60 animate-fade-in">
          <div className="mb-8 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className={`text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 justify-center lg:justify-start ${
                isDarkMode ? scheme.darkText : scheme.text
              }`}>
                <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
                Blogs &amp; Written Articles
              </span>
              <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 transition-colors ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>Insights &amp; Publications</h2>
              <p className={`mt-2 max-w-xl text-sm transition-colors leading-relaxed ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
              }`}>
                Explore full-text research, academic articles, draft reports, and developer insights written about modern systems.
              </p>
            </div>

            {/* Sub-tabs if both blogs and articles exist */}
            {blogs.length > 0 && articles.length > 0 && (
              <div className={`p-1 rounded-xl flex gap-1 self-center lg:self-end border ${
                isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-zinc-100 border-zinc-200'
              }`}>
                <button
                  onClick={() => { playSound('click'); setActiveBlogTab('blogs'); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeBlogTab === 'blogs'
                      ? isDarkMode
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  Written Blogs ({blogs.length})
                </button>
                <button
                  onClick={() => { playSound('click'); setActiveBlogTab('articles'); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeBlogTab === 'articles'
                      ? isDarkMode
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  Uploaded Documents ({articles.length})
                </button>
              </div>
            )}
          </div>

          {/* Tab Content */}
          {((blogs.length > 0 && articles.length === 0) || activeBlogTab === 'blogs') && blogs.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2">
              {blogs.map((blog) => (
                <motion.article
                  key={blog.id}
                  whileHover={{ y: -6 }}
                  onClick={() => {
                    playSound('click');
                    setSelectedBlog(blog);
                  }}
                  className={`group rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col h-full justify-between ${
                    isDarkMode
                      ? 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-800 hover:shadow-xl hover:shadow-indigo-950/10'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50'
                  }`}
                >
                  <div>
                    {/* Blog Cover Image */}
                    {blog.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden relative bg-zinc-950">
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-semibold text-zinc-500">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                        {blog.attachment && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                              📎 PDF/Doc
                            </span>
                          </>
                        )}
                        {blog.externalLink && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                              🔗 External Link
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className={`font-display text-lg font-bold transition-colors group-hover:underline ${
                        isDarkMode ? 'text-white group-hover:text-zinc-200' : 'text-zinc-900 group-hover:text-zinc-700'
                      }`}>
                        {blog.title}
                      </h3>

                      <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 transition-colors ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
                      }`}>
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                            isDarkMode
                              ? `${scheme.darkBadgeBg} ${scheme.darkBadgeText}`
                              : `${scheme.badgeBg} ${scheme.badgeText}`
                          }`}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className={`pt-3 border-t flex items-center text-xs font-bold transition-colors ${
                      isDarkMode ? 'border-zinc-850/60 text-zinc-300' : 'border-zinc-100 text-zinc-700'
                    }`}>
                      <span>{blog.externalLink ? 'Read External Publication' : 'Read Full Article'}</span>
                      {blog.externalLink ? (
                        <ExternalLink className={`h-3.5 w-3.5 ml-auto ${
                          isDarkMode ? scheme.darkText : scheme.text
                        }`} />
                      ) : (
                        <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ml-auto ${
                          isDarkMode ? scheme.darkText : scheme.text
                        }`} />
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Standalone Uploaded Articles Tab Content */}
          {((articles.length > 0 && blogs.length === 0) || activeBlogTab === 'articles') && articles.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-full ${
                    isDarkMode
                      ? 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-800'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`p-3 rounded-2xl border shrink-0 ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}>
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 block">{article.date}</span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider block mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          {article.fileSize} • {(article.fileType && article.fileType.substring(article.fileType.lastIndexOf('/') + 1).toUpperCase()) || 'DOCUMENT'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className={`font-display text-lg font-bold transition-colors ${
                        isDarkMode ? 'text-white' : 'text-zinc-900'
                      }`}>
                        {article.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
                      }`}>
                        {article.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                            isDarkMode
                              ? `${scheme.darkBadgeBg} ${scheme.darkBadgeText}`
                              : `${scheme.badgeBg} ${scheme.badgeText}`
                          }`}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className={`pt-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between transition-colors ${
                      isDarkMode ? 'border-zinc-850/60' : 'border-zinc-100'
                    }`}>
                      <span className="text-xs text-zinc-500 font-mono truncate max-w-[180px] self-start sm:self-auto">
                        📄 {article.fileName || 'External Link'}
                      </span>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {article.externalLink && (
                          <a
                            href={article.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSound('click')}
                            className={`flex-1 sm:flex-initial text-center text-xs font-bold px-4 py-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isDarkMode
                                ? 'border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-850 hover:text-white'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                            }`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Read Online
                          </a>
                        )}
                        {article.dataUrl && (
                          <a
                            href={article.dataUrl}
                            download={article.fileName}
                            onClick={() => playSound('click')}
                            className={`flex-1 sm:flex-initial text-center text-xs font-bold px-4 py-2 rounded-xl text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-all shadow-md cursor-pointer`}
                          >
                            Download Article
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 7. Get In Touch Section */}
      <section id="contact" className="scroll-mt-20 pt-8">
        <div className="mb-10 text-center lg:text-left">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${
            isDarkMode ? scheme.darkText : scheme.text
          }`}>Let&apos;s Connect</span>
          <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 transition-colors ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>Get In Touch</h2>
          <p className={`mt-2 max-w-xl text-sm transition-colors ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
          }`}>
            I am open to internship opportunities, freelance software development projects, and collaboration. Drop a message or send an email!
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email card */}
            {personal.email && (
              <div className={`p-5 rounded-2xl border flex gap-4 transition-all ${
                isDarkMode ? 'bg-zinc-900/35 border-zinc-850/80 hover:border-zinc-800' : 'bg-white border-zinc-200 shadow-2xs'
              }`}>
                <div className={`p-3 rounded-xl border ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800 text-emerald-400' : 'bg-emerald-50/80 border-emerald-100 text-emerald-600'
                }`}>
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-550 uppercase block">Send Direct Email</span>
                  <a href={`mailto:${personal.email}`} className={`text-sm sm:text-base font-bold hover:underline transition-colors ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {personal.email}
                  </a>
                </div>
              </div>
            )}

            {/* Location card */}
            {personal.location && (
              <div className={`p-5 rounded-2xl border flex gap-4 transition-all ${
                isDarkMode ? 'bg-zinc-900/35 border-zinc-850/80 hover:border-zinc-800' : 'bg-white border-zinc-200 shadow-2xs'
              }`}>
                <div className={`p-3 rounded-xl border ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800 text-indigo-400' : 'bg-indigo-50/80 border-indigo-100 text-indigo-600'
                }`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-550 uppercase block">Location</span>
                  <span className={`text-sm sm:text-base font-bold transition-colors ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {personal.location}
                  </span>
                </div>
              </div>
            )}

            {/* Phone card */}
            {personal.phone && (
              <div className={`p-5 rounded-2xl border flex gap-4 transition-all ${
                isDarkMode ? 'bg-zinc-900/35 border-zinc-850/80 hover:border-zinc-800' : 'bg-white border-zinc-200 shadow-2xs'
              }`}>
                <div className={`p-3 rounded-xl border ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800 text-amber-400' : 'bg-amber-50/80 border-amber-100 text-amber-600'
                }`}>
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-550 uppercase block">Call / WhatsApp</span>
                  <a href={`tel:${personal.phone}`} className={`text-sm sm:text-base font-bold hover:underline transition-colors ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {personal.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Live Hosted Portfolio URL Card */}
            <div className={`p-5 rounded-2xl border flex gap-4 transition-all ${
              isDarkMode ? 'bg-zinc-900/35 border-zinc-850/80 hover:border-zinc-800' : 'bg-white border-zinc-200 shadow-2xs'
            }`}>
              <div className={`p-3 rounded-xl border ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800 text-sky-400' : 'bg-sky-50/80 border-sky-100 text-sky-600'
              }`}>
                <Globe className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-zinc-550 uppercase block">Live Hosted Portfolio</span>
                <span className={`text-sm sm:text-base font-bold transition-colors block truncate ${
                  isDarkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                  personal-portfolio-64cdcc50.asia-southeast.run.app
                </span>
              </div>
            </div>
          </div>

          {/* Right Column Contact Form */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleContactSubmit}
              className={`p-6 sm:p-8 rounded-3xl border space-y-5 transition-all ${
                isDarkMode 
                  ? 'bg-zinc-900/25 border-zinc-850/80' 
                  : 'bg-white border-zinc-200 shadow-xs'
              }`}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 block font-bold">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-1 focus:outline-hidden ${
                      isDarkMode
                        ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 block font-bold">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-1 focus:outline-hidden ${
                      isDarkMode
                        ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block font-bold">Message</label>
                <textarea
                  required
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your inquiry message here..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-1 focus:outline-hidden ${
                    isDarkMode
                      ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  isSending 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-white hover:bg-zinc-150 text-zinc-950 active:scale-[0.99]' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white active:scale-[0.99]'
                }`}
              >
                {isSending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-zinc-500 border-t-zinc-200 animate-spin rounded-full"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Toast Success Message */}
              <AnimatePresence>
                {sendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl border border-emerald-900 bg-emerald-950/20 text-emerald-300 text-xs flex items-start gap-2.5"
                  >
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Message Sent Successfully!</p>
                      <p className="text-emerald-400/80 mt-0.5">Thank you for getting in touch. I will read and respond to your inquiry soon!</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </section>

      {/* 8. Follow Me Online Footer Grid Section */}
      <section className="pt-8 border-t border-zinc-800/10 dark:border-zinc-800/60 pb-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Follow Me Online</span>
          <div className="flex gap-4">
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-xs transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900/60 border-zinc-850 text-zinc-300 hover:text-white hover:border-zinc-750'
                    : 'bg-white border-zinc-200 text-zinc-650 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-xs transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900/60 border-zinc-850 text-zinc-300 hover:text-white hover:border-zinc-750'
                    : 'bg-white border-zinc-200 text-zinc-650 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* INTERACTIVE MODALS (METHODS FOR PARTS) */}
      <AnimatePresence>
        {/* A. Project Media Viewer (Supports Multiple Images, Standard Videos, and Facebook Videos) */}
        {selectedProject && (() => {
          const projectMedia = selectedProject.media && selectedProject.media.length > 0
            ? selectedProject.media
            : [
                ...(selectedProject.imageUrl ? [{ type: 'image' as const, url: selectedProject.imageUrl, title: 'Cover Image' }] : []),
                ...(selectedProject.videoUrl ? [{ type: 'video' as const, url: selectedProject.videoUrl, title: 'Demo Video' }] : [])
              ];
          
          // Make sure we have a videoUrl as an option if it is not already in media list
          const hasVideoInMedia = projectMedia.some(m => m.type === 'video');
          const finalMediaList = [...projectMedia];
          if (selectedProject.videoUrl && !hasVideoInMedia && selectedProject.media && selectedProject.media.length > 0) {
            finalMediaList.push({
              type: 'video' as const,
              url: selectedProject.videoUrl,
              title: 'Demo Video'
            });
          }

          const currentMedia = finalMediaList[activeMediaIndex] || null;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className={`w-full max-w-4xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[65vh] ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
                }`}
              >
                {/* Media Content Area */}
                <div className="flex-grow bg-black relative flex items-center justify-center p-2 min-h-0 md:w-2/3 h-1/2 md:h-full">
                  {currentMedia ? (
                    currentMedia.type === 'video' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-zinc-950 rounded-xl overflow-hidden">
                        {getFacebookEmbedUrl(currentMedia.url) ? (
                          <iframe
                            src={getFacebookEmbedUrl(currentMedia.url)!}
                            className="w-full h-full border-0 absolute inset-0"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            ref={videoRef}
                            src={currentMedia.url}
                            controls
                            className="max-h-full max-w-full rounded-xl"
                            onPlay={() => setIsPlayingVideo(true)}
                            onPause={() => setIsPlayingVideo(false)}
                          />
                        )}
                      </div>
                    ) : (
                      <img
                        src={currentMedia.url}
                        alt={currentMedia.title || selectedProject.title}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain rounded-xl"
                      />
                    )
                  ) : (
                    // Fallback to primary project image
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                  )}

                  {/* Left / Right Carousel Controls */}
                  {finalMediaList.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          setActiveMediaIndex(prev => (prev === 0 ? finalMediaList.length - 1 : prev - 1));
                          setIsPlayingVideo(false);
                        }}
                        className="absolute left-4 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:bg-zinc-800 cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveMediaIndex(prev => (prev === finalMediaList.length - 1 ? 0 : prev + 1));
                          setIsPlayingVideo(false);
                        }}
                        className="absolute right-4 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:bg-zinc-800 cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Side Panels - Media Info & Selector Thumbnails */}
                <div className={`p-6 md:w-1/3 flex flex-col justify-between min-h-0 h-1/2 md:h-full ${
                  isDarkMode ? 'bg-zinc-900/90' : 'bg-zinc-50'
                }`}>
                  <div className="space-y-4 overflow-y-auto pr-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`font-display text-lg font-bold ${
                        isDarkMode ? 'text-white' : 'text-zinc-900'
                      }`}>{selectedProject.title}</h3>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                          isDarkMode ? 'border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className={`text-xs leading-relaxed ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
                    }`}>
                      {selectedProject.description}
                    </p>

                    {/* Thumbnail Selector */}
                    {finalMediaList.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Project Attachments ({finalMediaList.length})</span>
                        <div className="grid grid-cols-3 gap-2">
                          {finalMediaList.map((med, mid) => (
                            <button
                              key={mid}
                              onClick={() => {
                                setActiveMediaIndex(mid);
                                setIsPlayingVideo(false);
                              }}
                              className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                                activeMediaIndex === mid
                                  ? isDarkMode ? 'border-indigo-500 scale-[0.98]' : 'border-emerald-500 scale-[0.98]'
                                  : 'border-transparent opacity-60 hover:opacity-90'
                              }`}
                            >
                              {med.type === 'video' ? (
                                <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                                  <Play className="h-4 w-4 text-white fill-current opacity-80" />
                                </div>
                              ) : (
                                <img src={med.url} alt="" className="h-full w-full object-cover" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} space-y-2`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-mono">Status</span>
                      <span className="font-bold text-emerald-400">Published</span>
                    </div>
                    {selectedProject.liveLink && (
                      <a
                        href={selectedProject.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2.5 rounded-xl text-center text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${scheme.primaryBg} ${scheme.hoverBg}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Launch Active Prototype
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}

        {/* B.2 Academic Credentials Slideshow Gallery Modal */}
        {selectedAcademic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className={`w-full max-w-4xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[60vh] ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              {/* Image slideshow viewer */}
              <div className="bg-black relative flex-grow flex items-center justify-center p-2 min-h-0 md:w-2/3 h-1/2 md:h-full">
                {selectedAcademic.images && selectedAcademic.images.length > 0 ? (
                  <img
                    src={selectedAcademic.images[activeAcademicImageIdx]}
                    alt={`${selectedAcademic.degree} Certificate`}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain rounded-xl animate-fade-in"
                  />
                ) : (
                  <div className="text-zinc-500 text-xs font-mono">No Image Attachments Available</div>
                )}

                {/* Left/Right carousel controls */}
                {selectedAcademic.images && selectedAcademic.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveAcademicImageIdx(prev => (prev === 0 ? selectedAcademic.images!.length - 1 : prev - 1))}
                      className="absolute left-4 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActiveAcademicImageIdx(prev => (prev === selectedAcademic.images!.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Side Panels - Credential Info */}
              <div className={`p-6 md:w-1/3 flex flex-col justify-between min-h-0 h-1/2 md:h-full ${
                isDarkMode ? 'bg-zinc-900/90' : 'bg-zinc-50'
              }`}>
                <div className="space-y-4 overflow-y-auto pr-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Credential Certificates</span>
                    <button
                      onClick={() => setSelectedAcademic(null)}
                      className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                        isDarkMode ? 'border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className={`font-display text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>{selectedAcademic.degree}</h3>

                  <p className={`text-xs font-semibold ${
                    isDarkMode ? scheme.darkText : scheme.text
                  }`}>{selectedAcademic.institution}</p>

                  <p className={`text-xs leading-relaxed ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
                  }`}>
                    {selectedAcademic.description}
                  </p>

                  {/* Thumbnail Selector list */}
                  {selectedAcademic.images && selectedAcademic.images.length > 1 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Attachments ({selectedAcademic.images.length})</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {selectedAcademic.images.map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() => setActiveAcademicImageIdx(imgIdx)}
                            className={`relative aspect-video rounded overflow-hidden border cursor-pointer transition-all ${
                              activeAcademicImageIdx === imgIdx
                                ? isDarkMode ? 'border-indigo-500 scale-[0.98]' : 'border-emerald-500 scale-[0.98]'
                                : 'border-transparent opacity-60 hover:opacity-90'
                            }`}
                          >
                            <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={`pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} space-y-2`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono">Accredited Status</span>
                    <span className="font-bold text-emerald-400">Verified Credentials</span>
                  </div>
                  {selectedAcademic.certificateUrl && (
                    <a
                      href={selectedAcademic.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2 rounded-xl text-center text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${scheme.primaryBg} ${scheme.hoverBg}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Verification Link
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* C. Passion Media Slideshow Modal */}
        {selectedPassion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className={`w-full max-w-3xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col md:flex-row h-[75vh] md:h-[55vh] ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="bg-black relative flex-grow flex items-center justify-center p-2 min-h-0 md:w-3/5 h-1/2 md:h-full">
                {selectedPassion.images && selectedPassion.images.length > 0 ? (
                  <img
                    src={selectedPassion.images[activePassionImageIdx]}
                    alt={selectedPassion.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                ) : (
                  <img
                    src={selectedPassion.imageUrl}
                    alt={selectedPassion.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                )}

                {/* Left/Right controls inside passion */}
                {selectedPassion.images && selectedPassion.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePassionImageIdx(prev => (prev === 0 ? selectedPassion.images!.length - 1 : prev - 1))}
                      className="absolute left-3 p-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActivePassionImageIdx(prev => (prev === selectedPassion.images!.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 p-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              <div className={`p-6 md:w-2/5 flex flex-col justify-between min-h-0 h-1/2 md:h-full ${
                isDarkMode ? 'bg-zinc-900/90' : 'bg-zinc-50'
              }`}>
                <div className="space-y-4 overflow-y-auto">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">{selectedPassion.category}</span>
                    <button
                      onClick={() => setSelectedPassion(null)}
                      className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                        isDarkMode ? 'border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className={`font-display text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>{selectedPassion.title}</h3>

                  <p className={`text-xs leading-relaxed ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-650'
                  }`}>
                    {selectedPassion.description}
                  </p>
                </div>

                <div className={`pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} space-y-2`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono">Accreditation</span>
                    <span className="font-bold text-violet-400">Creative Showcase</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Certificate Fullscreen Lightbox / Media Viewer */}
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border flex flex-col md:flex-row h-[85vh] md:h-[60vh] cursor-default ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              {/* Media Container */}
              <div className="flex-1 bg-zinc-950 flex items-center justify-center relative min-h-0 h-1/2 md:h-full">
                {selectedCertificate.url ? (
                  <img
                    src={selectedCertificate.url}
                    alt={selectedCertificate.title}
                    className="max-h-full max-w-full object-contain p-4"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Award className="h-24 w-24 text-zinc-800" />
                )}
                
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar metadata */}
              <div className={`p-6 md:w-80 flex flex-col justify-between min-h-0 h-1/2 md:h-full ${
                isDarkMode ? 'bg-zinc-900/95' : 'bg-zinc-50'
              }`}>
                <div className="space-y-4 overflow-y-auto">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Archive Record</span>
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className={`hidden md:block p-1 rounded-lg border transition-colors cursor-pointer ${
                        isDarkMode ? 'border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className={`font-display text-lg font-bold leading-snug ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>{selectedCertificate.title}</h3>

                  <div className="space-y-2.5 pt-2">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase block">Issuer / Authority</span>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        🏛️ {selectedCertificate.issuer}
                      </p>
                    </div>

                    {selectedCertificate.credentialId && (
                      <div>
                        <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase block">Credential ID</span>
                        <p className="text-xs font-mono text-zinc-500 break-all select-all">
                          {selectedCertificate.credentialId}
                        </p>
                      </div>
                    )}

                    {selectedCertificate.date && (
                      <div>
                        <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase block">Date Earned</span>
                        <p className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          📅 {selectedCertificate.date}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} space-y-2`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono">Status</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Verified Badge
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* D. Fullscreen Blog Reader Modal */}
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-3xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              {/* Header bar */}
              <div className={`p-6 border-b flex items-center justify-between ${
                isDarkMode ? 'border-zinc-850 bg-zinc-950/40' : 'border-zinc-150 bg-zinc-50/50'
              }`}>
                <div className="flex items-center gap-3">
                  <BookOpen className={`h-5 w-5 ${isDarkMode ? scheme.darkText : scheme.text}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-550'
                  }`}>Blog Article Reader</span>
                </div>
                
                <button
                  onClick={() => setSelectedBlog(null)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isDarkMode ? 'border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-500'
                  }`}
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Scrollable Article Body */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                {selectedBlog.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-zinc-950 relative">
                    <img
                      src={selectedBlog.imageUrl}
                      alt={selectedBlog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold text-zinc-500">
                    <span className="flex items-center gap-1">📅 {selectedBlog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">⏱️ {selectedBlog.readTime}</span>
                  </div>

                  <h1 className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors leading-tight ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {selectedBlog.title}
                  </h1>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedBlog.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isDarkMode
                            ? `${scheme.darkBadgeBg} ${scheme.darkBadgeText}`
                            : `${scheme.badgeBg} ${scheme.badgeText}`
                        }`}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedBlog.attachment && (
                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-emerald-50/30 border-emerald-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        isDarkMode ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        <FileText className="h-5.5 w-5.5" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                          {selectedBlog.attachment.fileName}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          {selectedBlog.attachment.fileSize} • {selectedBlog.attachment.fileType.substring(selectedBlog.attachment.fileType.lastIndexOf('/') + 1).toUpperCase() || 'Document'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={selectedBlog.attachment.dataUrl}
                      download={selectedBlog.attachment.fileName}
                      onClick={() => playSound('click')}
                      className={`w-full sm:w-auto text-center text-xs font-bold px-4 py-2 rounded-xl text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-all shadow-md cursor-pointer`}
                    >
                      Download Article File
                    </a>
                  </div>
                )}

                {selectedBlog.externalLink && (
                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isDarkMode ? 'bg-zinc-900/50 border-indigo-900/60' : 'bg-indigo-50/50 border-indigo-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        isDarkMode ? 'bg-indigo-950/50 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        <ExternalLink className="h-5.5 w-5.5" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                          This article is published externally
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          You can view the original article directly on the host publication platform.
                        </p>
                      </div>
                    </div>
                    <a
                      href={selectedBlog.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSound('click')}
                      className={`w-full sm:w-auto text-center text-xs font-bold px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Read Publication
                    </a>
                  </div>
                )}

                {/* Main Text Content */}
                <div className={`text-sm sm:text-base leading-relaxed space-y-4 font-normal transition-colors ${
                  isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  {selectedBlog.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={pIdx} className={`font-display text-lg sm:text-xl font-bold pt-4 pb-1 transition-colors ${
                          isDarkMode ? 'text-white' : 'text-zinc-900'
                        }`}>
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('* ')) {
                      return (
                        <ul key={pIdx} className="list-disc pl-5 space-y-1 my-3">
                          {paragraph.split('\n').map((li, liIdx) => (
                            <li key={liIdx}>{li.replace(/^[0-9*.\s]+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={pIdx} className="whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Footer bar */}
              <div className={`p-4 border-t text-center ${
                isDarkMode ? 'border-zinc-850 bg-zinc-950/20' : 'border-zinc-150 bg-zinc-50/20'
              }`}>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Thank you for reading my insights
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
