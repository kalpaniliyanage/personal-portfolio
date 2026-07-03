import React, { useState } from 'react';
import { 
  Lock, Unlock, Save, Download, Upload, Plus, Trash, Sparkles, 
  User, Folder, Briefcase, Award, Settings, Check, HelpCircle, AlertTriangle,
  GraduationCap, Heart, ArrowLeft, Play, BookOpen
} from 'lucide-react';
import { PortfolioData, Project, Experience, SkillCategory, AccentColor, Academic, Passion, Certification, Blog, Article } from '../types';
import { ColorScheme } from '../utils/theme';
import ImageDragDropZone from './ImageDragDropZone';
import DocumentUploadZone from './DocumentUploadZone';

interface StudioEditorProps {
  initialData: PortfolioData;
  onSave: (newData: PortfolioData) => void;
  scheme: ColorScheme;
  isDarkMode: boolean;
  onClose?: () => void;
}

type TabType = 'personal' | 'projects' | 'experience' | 'skills' | 'custom' | 'academics' | 'passions' | 'blogs';

export default function StudioEditor({ initialData, onSave, scheme, isDarkMode, onClose }: StudioEditorProps) {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('portfolio_editor_unlocked') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Active form state
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [formData, setFormData] = useState<PortfolioData>(() => {
    // Deep copy to prevent accidental direct state manipulation
    return JSON.parse(JSON.stringify(initialData));
  });

  // Editor feedback state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAlreadyUpdated, setIsAlreadyUpdated] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && typeof json === 'object' && json.personal && json.projects && json.experience && json.skills) {
          setFormData(json);
          setImportSuccess(true);
          setImportError(null);
          setTimeout(() => setImportSuccess(false), 5000);
        } else {
          setImportError("Invalid portfolio JSON structure. Make sure it contains 'personal', 'projects', 'experience', and 'skills' objects.");
          setTimeout(() => setImportError(null), 7000);
        }
      } catch (err) {
        setImportError("Failed to parse JSON. Please make sure it is a valid portfolio_data.json file.");
        setTimeout(() => setImportError(null), 7000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'kalpani2026') {
      setIsUnlocked(true);
      setErrorMsg('');
      localStorage.setItem('portfolio_editor_unlocked', 'true');
    } else {
      setErrorMsg('Incorrect passcode. Please try again!');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('portfolio_editor_unlocked');
  };

  const handleSave = () => {
    const isSame = JSON.stringify(formData) === JSON.stringify(initialData);
    if (isSame) {
      setIsAlreadyUpdated(true);
      setSaveSuccess(false);
      setTimeout(() => setIsAlreadyUpdated(false), 5000);
    } else {
      onSave(formData);
      setSaveSuccess(true);
      setIsAlreadyUpdated(false);
      setTimeout(() => setSaveSuccess(false), 5000);
    }
  };

  const handleDownload = () => {
    const fileData = JSON.stringify(formData, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadTriggered(true);
    setTimeout(() => setDownloadTriggered(false), 3000);
  };

  // Helper functions for updating specific fields
  const updatePersonalInfo = (field: keyof PortfolioData['personal'], value: string) => {
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  // Projects management helpers
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: "New Project Title",
      description: "A short description detailing the problem solved and core mechanics implemented.",
      tags: ["React", "TypeScript"],
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const handleUpdateProject = (index: number, field: keyof Project, value: any) => {
    setFormData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleDeleteProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Experience management helpers
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      role: "Software Engineer",
      duration: "2024 - Present",
      achievements: [
        "First major contribution or milestone achieved.",
        "Second accomplishment highlighting system optimization or metrics."
      ]
    };
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: any) => {
    setFormData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const handleUpdateExperienceAchievements = (expIndex: number, lineIndex: number, val: string) => {
    setFormData(prev => {
      const updated = [...prev.experience];
      const achievements = [...updated[expIndex].achievements];
      achievements[lineIndex] = val;
      updated[expIndex] = { ...updated[expIndex], achievements };
      return { ...prev, experience: updated };
    });
  };

  const handleAddAchievement = (expIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.experience];
      const achievements = [...updated[expIndex].achievements, "New achievement detail"];
      updated[expIndex] = { ...updated[expIndex], achievements };
      return { ...prev, experience: updated };
    });
  };

  const handleDeleteAchievement = (expIndex: number, lineIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.experience];
      const achievements = updated[expIndex].achievements.filter((_, idx) => idx !== lineIndex);
      updated[expIndex] = { ...updated[expIndex], achievements };
      return { ...prev, experience: updated };
    });
  };

  const handleDeleteExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  // Skills management helpers
  const handleUpdateSkillCategory = (index: number, name: string) => {
    setFormData(prev => {
      const updated = [...prev.skills];
      updated[index] = { ...updated[index], category: name };
      return { ...prev, skills: updated };
    });
  };

  const handleUpdateSkillsList = (index: number, listStr: string) => {
    const list = listStr.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => {
      const updated = [...prev.skills];
      updated[index] = { ...updated[index], list };
      return { ...prev, skills: updated };
    });
  };

  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: "New Skills Category",
      list: ["Tool A", "Tool B", "Tool C"]
    };
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newCat]
    }));
  };

  const handleDeleteSkillCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  // Academics management helpers
  const handleAddAcademic = () => {
    const newAcad: Academic = {
      id: `acad-${Date.now()}`,
      degree: "Degree / Qualification Title",
      institution: "Institution Name",
      duration: "Duration (e.g. 2022 - Present)",
      description: "Brief academic details, focus areas, or coursework highlights."
    };
    setFormData(prev => ({
      ...prev,
      academics: [...(prev.academics || []), newAcad]
    }));
  };

  const handleUpdateAcademic = (index: number, field: keyof Academic, value: any) => {
    setFormData(prev => {
      const updated = [...(prev.academics || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, academics: updated };
    });
  };

  const handleDeleteAcademic = (id: string) => {
    setFormData(prev => ({
      ...prev,
      academics: (prev.academics || []).filter(a => a.id !== id)
    }));
  };

  // Passions management helpers
  const handleAddPassion = () => {
    const newPassion: Passion = {
      id: `passion-${Date.now()}`,
      title: "Activity or Talent Name",
      description: "Brief descriptive paragraph of your role or participation in this creative activity.",
      category: "Category Name",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
      ]
    };
    setFormData(prev => ({
      ...prev,
      passions: [...(prev.passions || []), newPassion]
    }));
  };

  const handleUpdatePassion = (index: number, field: keyof Passion, value: any) => {
    setFormData(prev => {
      const updated = [...(prev.passions || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, passions: updated };
    });
  };

  const handleDeletePassion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      passions: (prev.passions || []).filter(p => p.id !== id)
    }));
  };

  // Certifications management helpers
  const handleAddCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: "New Career Certificate",
      issuer: "Issuing Authority Name",
      credentialId: "CRED-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().getFullYear().toString(),
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop"
    };
    setFormData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert]
    }));
  };

  const handleUpdateCertification = (index: number, field: keyof Certification, value: any) => {
    setFormData(prev => {
      const updated = [...(prev.certifications || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const handleDeleteCertification = (id: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter(c => c.id !== id)
    }));
  };

  // Blogs management helpers
  const handleAddBlog = () => {
    const newBlog: Blog = {
      id: `blog-${Date.now()}`,
      title: "New Blog Title",
      excerpt: "A catchy 2-3 sentence teaser to invite readers to view the full article.",
      content: "Write the full article content here. Use double line breaks to start new paragraphs.\n\n### Sub-heading\nUse headers and structured spacing to make your thoughts beautiful to read.",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: "4 min read",
      tags: ["Development", "Insights"],
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop"
    };
    setFormData(prev => ({
      ...prev,
      blogs: [...(prev.blogs || []), newBlog]
    }));
  };

  const handleUpdateBlog = (index: number, field: keyof Blog, value: any) => {
    setFormData(prev => {
      const updated = [...(prev.blogs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, blogs: updated };
    });
  };

  const handleDeleteBlog = (id: string) => {
    setFormData(prev => ({
      ...prev,
      blogs: (prev.blogs || []).filter(b => b.id !== id)
    }));
  };

  // Articles management helpers
  const handleAddArticle = () => {
    const newArticle: Article = {
      id: `article-${Date.now()}`,
      title: "New Standalone Article / Document",
      description: "A professional abstract or summary explaining what this publication covers.",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      tags: ["Research", "Publication"],
      fileName: "article_document.pdf",
      fileType: "application/pdf",
      fileSize: "0 Bytes",
      dataUrl: ""
    };
    setFormData(prev => ({
      ...prev,
      articles: [...(prev.articles || []), newArticle]
    }));
  };

  const handleUpdateArticle = (index: number, field: keyof Article, value: any) => {
    setFormData(prev => {
      const updated = [...(prev.articles || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, articles: updated };
    });
  };

  const handleDeleteArticle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      articles: (prev.articles || []).filter(a => a.id !== id)
    }));
  };

  // Customization helpers
  const handleUpdateAccentColor = (color: AccentColor) => {
    setFormData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        accentColor: color
      }
    }));
  };

  const handleUpdateLayout = (layout: 'grid' | 'minimal') => {
    setFormData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        layout
      }
    }));
  };

  // Lockscreen view
  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 animate-fade-in relative z-10">
        <div className={`rounded-3xl border p-8 shadow-2xl text-center transition-all ${
          isDarkMode 
            ? 'bg-[#120a3a]/80 border-indigo-900/60 shadow-indigo-950/40 backdrop-blur-md' 
            : 'bg-white border-indigo-100 shadow-xl shadow-indigo-100/40'
        }`}>
          <div className={`mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors ${
            isDarkMode 
              ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80' 
              : 'bg-indigo-50 text-indigo-650 border-indigo-200'
          }`}>
            <Lock className="h-6 w-6 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
              isDarkMode ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
            }`}>
              🔒 Owner-Only configuration
            </span>
            <h2 className={`font-display text-2xl font-black tracking-tight mt-2 transition-colors ${
              isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>Unlock Studio Console</h2>
          </div>

          <p className={`text-xs mt-3.5 leading-relaxed max-w-xs mx-auto transition-colors ${
            isDarkMode ? 'text-indigo-200/70' : 'text-zinc-550'
          }`}>
            This secure console is strictly for the owner (<span className="font-semibold text-indigo-400">Kalpani Madhubhashini</span>) to edit credentials. General viewers are in <span className="font-semibold text-emerald-400">View-Only Mode</span> and cannot modify details.
          </p>

          <form onSubmit={handleUnlock} className="mt-8 space-y-4">
            <div>
              <input
                id="studio-passcode-input"
                type="password"
                placeholder="Enter owner passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-mono focus:outline-hidden focus:ring-2 transition-all ${
                  isDarkMode
                    ? 'bg-[#0a0520] border-indigo-900 text-white focus:border-indigo-500 focus:ring-indigo-500/30 placeholder:text-indigo-800/70'
                    : 'bg-zinc-50 border-indigo-100 text-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-zinc-300'
                }`}
                required
              />
            </div>
            {errorMsg && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 justify-center">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {errorMsg}
              </p>
            )}
            <button
              id="unlock-studio-btn"
              type="submit"
              className="w-full rounded-xl px-4 py-3 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
            >
              Authenticate & Launch Studio
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm transition-all border active:scale-[0.98] cursor-pointer ${
                  isDarkMode
                    ? 'bg-transparent border-indigo-900/60 text-indigo-300 hover:bg-indigo-950/40 hover:text-white'
                    : 'bg-transparent border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Portfolio View
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Workspace View
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Sidebar navigation & Global actions */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className={`rounded-2xl border p-5 space-y-5 shadow-xs transition-colors ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
                isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
              }`}>Console</span>
              <div className="flex items-center gap-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className={`text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                      isDarkMode ? 'text-indigo-300 hover:text-white' : 'text-indigo-600 hover:text-indigo-850'
                    }`}
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Exit
                  </button>
                )}
                <button
                  onClick={handleLock}
                  className={`text-xs font-medium cursor-pointer transition-colors ${
                    isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Sign Out
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-colors ${
                isDarkMode
                  ? `${scheme.darkLightBg} ${scheme.darkText} ${scheme.darkBorder}`
                  : `${scheme.lightBg} ${scheme.text} ${scheme.border}`
              }`}>
                <Unlock className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-sm font-bold leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Studio Suite</p>
                <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Session
                </p>
              </div>
            </div>

            {/* Tab navigation buttons */}
            <div className={`space-y-1.5 pt-4 border-t transition-colors ${isDarkMode ? 'border-zinc-800/80' : 'border-zinc-100'}`}>
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'personal'
                    ? isDarkMode
                      ? `${scheme.darkLightBg} ${scheme.darkText} font-semibold`
                      : `${scheme.lightBg} ${scheme.text} font-semibold`
                    : isDarkMode
                      ? 'text-zinc-400 hover:bg-zinc-955 hover:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <User className="h-4 w-4" />
                Personal Bio
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'projects'
                    ? isDarkMode
                      ? `${scheme.darkLightBg} ${scheme.darkText} font-semibold`
                      : `${scheme.lightBg} ${scheme.text} font-semibold`
                    : isDarkMode
                      ? 'text-zinc-400 hover:bg-zinc-955 hover:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Folder className="h-4 w-4" />
                Projects ({formData.projects.length})
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'experience'
                    ? isDarkMode
                      ? `${scheme.darkLightBg} ${scheme.darkText} font-semibold`
                      : `${scheme.lightBg} ${scheme.text} font-semibold`
                    : isDarkMode
                      ? 'text-zinc-400 hover:bg-zinc-955 hover:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Experience & Education ({formData.experience.length + (formData.academics || []).length})
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'skills'
                    ? isDarkMode
                      ? `${scheme.darkLightBg} ${scheme.darkText} font-semibold`
                      : `${scheme.lightBg} ${scheme.text} font-semibold`
                    : isDarkMode
                      ? 'text-zinc-400 hover:bg-zinc-955 hover:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Award className="h-4 w-4" />
                Technical Stack
              </button>
              <button
                onClick={() => setActiveTab('passions')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'passions'
                    ? isDarkMode
                      ? `${scheme.darkLightBg} ${scheme.darkText} font-semibold`
                      : `${scheme.lightBg} ${scheme.text} font-semibold`
                    : isDarkMode
                      ? 'text-zinc-400 hover:bg-zinc-955 hover:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Heart className="h-4 w-4" />
                Talents & Passions
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'blogs'
                    ? isDarkMode
                      ? `${scheme.darkLightBg} ${scheme.darkText} font-semibold`
                      : `${scheme.lightBg} ${scheme.text} font-semibold`
                    : isDarkMode
                      ? 'text-zinc-400 hover:bg-zinc-955 hover:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Blogs & Articles ({(formData.blogs || []).length + (formData.articles || []).length})
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'custom'
                    ? isDarkMode
                      ? `${scheme.darkLightBg} ${scheme.darkText} font-semibold`
                      : `${scheme.lightBg} ${scheme.text} font-semibold`
                    : isDarkMode
                      ? 'text-zinc-400 hover:bg-zinc-955 hover:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Settings className="h-4 w-4" />
                Visual Theme
              </button>
            </div>
          </div>

          {/* Core Action Suite: Saving, Downloading */}
          <div className="bg-zinc-900 text-white rounded-2xl p-5 space-y-4 shadow-md">
            <div>
              <p className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest">Publish Workspace</p>
              <p className="text-xs text-zinc-300 mt-1">Commit edits to update the rendering canvas instantly.</p>
            </div>

            {/* Real-time status indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono border border-zinc-800 bg-zinc-950/50 py-1.5 px-2.5 rounded-lg">
              <span className="text-zinc-500">Status:</span>
              {JSON.stringify(formData) === JSON.stringify(initialData) ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Already Updated
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Unsaved Changes
                </span>
              )}
            </div>

            <button
              id="save-studio-changes-btn"
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white ${scheme.primaryBg} ${scheme.hoverBg} cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-black/20`}
            >
              <Save className="h-4 w-4" />
              Save Workspace
            </button>

            {onClose && (
              <button
                id="exit-studio-unlocked-btn"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-755 text-zinc-100 border border-zinc-700/50 cursor-pointer transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4" />
                Exit & View Portfolio
              </button>
            )}

            <button
              id="download-portfolio-data-btn"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-zinc-850 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/30 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Download JSON
            </button>

            <div className="pt-2 border-t border-zinc-850">
              <label 
                htmlFor="import-json-file" 
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800/80 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Upload className="h-3.5 w-3.5 text-zinc-400" />
                Import JSON File
              </label>
              <input
                id="import-json-file"
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Feedback logs */}
          {saveSuccess && (
            <div className={`rounded-xl border p-4 shadow-2xs text-xs animate-fade-in ${
              isDarkMode
                ? 'border-emerald-900 bg-emerald-950/20 text-emerald-300'
                : 'border-emerald-200 bg-emerald-50/80 text-emerald-800'
            }`}>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Workspace Saved successfully!</p>
                  <p className={isDarkMode ? 'text-emerald-400/90' : 'text-emerald-700'}>The portfolio preview has updated instantly. Click the &ldquo;Download JSON&rdquo; button above to export this file for static repository deployment.</p>
                </div>
              </div>
            </div>
          )}

          {isAlreadyUpdated && (
            <div className={`rounded-xl border p-4 shadow-2xs text-xs animate-fade-in ${
              isDarkMode
                ? 'border-emerald-900/50 bg-emerald-950/10 text-emerald-300'
                : 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
            }`}>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Workspace already updated!</p>
                  <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-650'}>All changes are already saved and up to date. No new modifications were detected.</p>
                </div>
              </div>
            </div>
          )}

          {downloadTriggered && (
            <div className={`rounded-xl border p-4 shadow-2xs text-xs animate-fade-in ${
              isDarkMode
                ? 'border-zinc-800 bg-zinc-900 text-zinc-300'
                : 'border-zinc-200 bg-white text-zinc-600'
            }`}>
              <div className="flex items-start gap-2.5">
                <Download className={`h-4 w-4 ${isDarkMode ? scheme.darkText : scheme.text} shrink-0 mt-0.5`} />
                <div className="space-y-1">
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Downloaded portfolio_data.json!</p>
                  <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Replace the local portfolio_data.json in your project folder with this exported file, then commit and push to GitHub for free publishing!</p>
                </div>
              </div>
            </div>
          )}

          {importSuccess && (
            <div className={`rounded-xl border p-4 shadow-2xs text-xs animate-fade-in ${
              isDarkMode
                ? 'border-emerald-900 bg-emerald-950/20 text-emerald-300'
                : 'border-emerald-200 bg-emerald-50/80 text-emerald-800'
            }`}>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">JSON Imported Successfully!</p>
                  <p className={isDarkMode ? 'text-emerald-400/90' : 'text-emerald-700'}>The local workspace has loaded the new portfolio structure. Click &ldquo;Save Workspace&rdquo; above to publish and render these updates instantly!</p>
                </div>
              </div>
            </div>
          )}

          {importError && (
            <div className="rounded-xl border border-rose-900 bg-rose-950/20 text-rose-300 p-4 shadow-2xs text-xs animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Failed to Import JSON</p>
                  <p className="text-rose-400/90">{importError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tab Forms */}
        <div className={`flex-1 rounded-3xl border shadow-xs overflow-hidden transition-colors ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800/85' : 'bg-white border-zinc-200'
        }`}>
          
          <div className={`p-6 flex items-center justify-between border-b ${
            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
          }`}>
            <div>
              <h3 className={`font-display text-xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                {activeTab === 'personal' && 'Configure Personal Bio'}
                {activeTab === 'projects' && 'Configure Selected Works'}
                {activeTab === 'experience' && 'Configure Experience & Academics'}
                {activeTab === 'skills' && 'Configure Technical Stack'}
                {activeTab === 'passions' && 'Configure Talents & Passions'}
                {activeTab === 'custom' && 'Configure Visual Theme'}
              </h3>
              <p className={`text-xs mt-1 transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {activeTab === 'personal' && 'Manage your name, professional title, introduction copy, and avatar link.'}
                {activeTab === 'projects' && 'Add, edit, or delete items shown in your engineering portfolio.'}
                {activeTab === 'experience' && 'Document your career track, achievements, degrees, and verified certificates.'}
                {activeTab === 'skills' && 'Group development technologies into distinct categorization boxes.'}
                {activeTab === 'passions' && 'Add, edit, or delete extra-curricular activities, passions, and creative slideshow attachments.'}
                {activeTab === 'custom' && 'Tweak accent coloring schemes and layout representation structures.'}
              </p>
            </div>
          </div>

          <div className="p-6">
            
            {/* PERSONAL TAB FORM */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="p-name" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Your Name</label>
                    <input
                      id="p-name"
                      type="text"
                      value={formData.personal.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="p-role" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Professional Title</label>
                    <input
                      id="p-role"
                      type="text"
                      value={formData.personal.role}
                      onChange={(e) => updatePersonalInfo('role', e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="p-bio" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Introduction / Bio</label>
                  <textarea
                    id="p-bio"
                    rows={3}
                    value={formData.personal.bio}
                    onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 resize-y transition-all ${
                      isDarkMode
                        ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                        : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                    }`}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="p-email" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Email Address</label>
                    <input
                      id="p-email"
                      type="email"
                      value={formData.personal.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="p-avatar" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Avatar / Portrait Image URL</label>
                    <input
                      id="p-avatar"
                      type="url"
                      value={formData.personal.avatarUrl || ''}
                      onChange={(e) => updatePersonalInfo('avatarUrl', e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                      }`}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                </div>

                {/* Profile Photo / Avatar Drag & Drop Zone */}
                <div className={`space-y-3 pt-4 border-t transition-colors ${
                  isDarkMode ? 'border-zinc-800/80' : 'border-zinc-100'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Profile Photo / Avatar Drag & Drop Upload</span>
                  <div className="grid gap-4 md:grid-cols-2 items-center">
                    <ImageDragDropZone
                      onImagesSelected={(base64Images) => {
                        if (base64Images.length > 0) {
                          updatePersonalInfo('avatarUrl', base64Images[0]);
                        }
                      }}
                    />
                    <div className={`flex flex-col items-center justify-center p-4 border rounded-xl h-full ${
                      isDarkMode ? 'bg-zinc-950/30 border-zinc-800' : 'bg-zinc-50/50 border-zinc-200'
                    }`}>
                      {formData.personal.avatarUrl ? (
                        <div className="flex flex-col items-center space-y-2">
                          <img src={formData.personal.avatarUrl} alt="Avatar preview" className="h-20 w-20 rounded-full object-cover border-2 shadow-sm border-indigo-500" />
                          <span className="text-[10px] font-bold uppercase text-zinc-500">Avatar Image Preview</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">No Profile Photo Configured</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`grid gap-6 md:grid-cols-3 pt-4 border-t transition-colors ${
                  isDarkMode ? 'border-zinc-800/80' : 'border-zinc-100'
                }`}>
                  <div className="space-y-1.5">
                    <label htmlFor="p-github" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>GitHub Profile URL</label>
                    <input
                      id="p-github"
                      type="url"
                      value={formData.personal.github}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="p-linkedin" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>LinkedIn Profile URL</label>
                    <input
                      id="p-linkedin"
                      type="url"
                      value={formData.personal.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="p-facebook" className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Facebook Profile URL</label>
                    <input
                      id="p-facebook"
                      type="url"
                      value={formData.personal.facebook || formData.personal.twitter || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            facebook: val,
                            twitter: val
                          }
                        }));
                      }}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB FORM */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>All Projects ({formData.projects.length})</p>
                  <button
                    onClick={handleAddProject}
                    className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.projects.map((proj, idx) => (
                    <div key={proj.id} className={`p-5 rounded-2xl border transition-all ${
                      isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                    } space-y-4`}>
                      <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                        isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                      }`}>
                        <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Project #{idx + 1}</span>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label htmlFor={`pj-title-${proj.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Project Title</label>
                          <input
                            id={`pj-title-${proj.id}`}
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor={`pj-tags-${proj.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Technologies (Comma-separated)</label>
                          <input
                            id={`pj-tags-${proj.id}`}
                            type="text"
                            value={proj.tags.join(', ')}
                            onChange={(e) => handleUpdateProject(idx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 font-mono transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor={`pj-desc-${proj.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                        <textarea
                          id={`pj-desc-${proj.id}`}
                          rows={2}
                          value={proj.description}
                          onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                          className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 resize-y transition-all ${
                            isDarkMode
                              ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                              : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                          }`}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1.5">
                          <label htmlFor={`pj-img-${proj.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Project Image URL</label>
                          <input
                            id={`pj-img-${proj.id}`}
                            type="url"
                            value={proj.imageUrl || ''}
                            onChange={(e) => handleUpdateProject(idx, 'imageUrl', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor={`pj-video-${proj.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Demo Video / Facebook Video URL</label>
                          <input
                            id={`pj-video-${proj.id}`}
                            type="url"
                            placeholder="e.g. facebook video link"
                            value={proj.videoUrl || ''}
                            onChange={(e) => handleUpdateProject(idx, 'videoUrl', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor={`pj-code-${proj.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Codebase URL (Optional)</label>
                          <input
                            id={`pj-code-${proj.id}`}
                            type="url"
                            value={proj.githubLink || ''}
                            onChange={(e) => handleUpdateProject(idx, 'githubLink', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor={`pj-demo-${proj.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Live Demo URL (Optional)</label>
                          <input
                            id={`pj-demo-${proj.id}`}
                            type="url"
                            value={proj.liveLink || ''}
                            onChange={(e) => handleUpdateProject(idx, 'liveLink', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Project Attachments & Media Gallery */}
                      <div className={`space-y-3 pt-4 border-t transition-colors ${
                        isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Project Attachments (Multiple Photos & Videos)</span>
                        </div>

                        {/* List existing attachments */}
                        {proj.media && proj.media.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {proj.media.map((med, medIdx) => (
                              <div key={medIdx} className={`relative group rounded-xl overflow-hidden border p-1.5 ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-150'
                              }`}>
                                <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center">
                                  {med.type === 'video' ? (
                                    <div className="flex flex-col items-center justify-center p-2 text-center">
                                      <Play className="h-4 w-4 text-indigo-400 fill-current mb-0.5" />
                                      <span className="text-[8px] font-mono text-zinc-450 truncate max-w-full">Video URL</span>
                                    </div>
                                  ) : (
                                    <img src={med.url} alt="" className="h-full w-full object-cover" />
                                  )}
                                </div>
                                <div className="p-1 flex flex-col gap-0.5">
                                  <p className="text-[9px] font-bold truncate text-zinc-700 dark:text-zinc-300">
                                    {med.title || `Attachment #${medIdx + 1}`}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedMedia = proj.media!.filter((_, mIdx) => mIdx !== medIdx);
                                      handleUpdateProject(idx, 'media', updatedMedia);
                                    }}
                                    className="text-[9px] text-rose-500 hover:text-rose-700 font-semibold text-left mt-0.5 cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-500 italic">No custom attachments configured. Slideshow will fallback to primary Project Image.</p>
                        )}

                        {/* Drag & Drop zone to add multiple photos */}
                        <div className="grid gap-4 md:grid-cols-2 pt-2">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase block">Drag & Drop multiple project photos</span>
                            <ImageDragDropZone
                              onImagesSelected={(base64Images) => {
                                const currentMedia = proj.media || [];
                                const newAttachments = base64Images.map((b64, subIdx) => ({
                                  type: 'image' as const,
                                  url: b64,
                                  title: `Gallery Photo ${currentMedia.length + subIdx + 1}`
                                }));
                                handleUpdateProject(idx, 'media', [...currentMedia, ...newAttachments]);
                              }}
                            />
                          </div>
                          <div className={`border rounded-xl p-4 flex flex-col justify-between ${
                            isDarkMode ? 'bg-zinc-950/20 border-zinc-800' : 'bg-zinc-50/50 border-zinc-200'
                          }`}>
                            <div>
                              <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase block">Or link external photo / video URL</span>
                              <div className="space-y-2 mt-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    id={`add-med-title-${proj.id}`}
                                    type="text"
                                    placeholder="Attachment Title"
                                    className={`rounded-lg border px-2 py-1 text-xs focus:outline-hidden ${
                                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-800'
                                    }`}
                                  />
                                  <select
                                    id={`add-med-type-${proj.id}`}
                                    className={`rounded-lg border px-2 py-1 text-xs focus:outline-hidden ${
                                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-800'
                                    }`}
                                  >
                                    <option value="image">Image</option>
                                    <option value="video">Video / Facebook Video</option>
                                  </select>
                                </div>
                                <input
                                  id={`add-med-url-${proj.id}`}
                                  type="url"
                                  placeholder="https://example.com/photo.jpg or Facebook link"
                                  className={`w-full rounded-lg border px-2.5 py-1 text-xs focus:outline-hidden ${
                                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-800'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const titleInput = document.getElementById(`add-med-title-${proj.id}`) as HTMLInputElement;
                                    const typeSelect = document.getElementById(`add-med-type-${proj.id}`) as HTMLSelectElement;
                                    const urlInput = document.getElementById(`add-med-url-${proj.id}`) as HTMLInputElement;

                                    const title = titleInput?.value.trim() || 'Custom Attachment';
                                    const type = (typeSelect?.value || 'image') as 'image' | 'video';
                                    const url = urlInput?.value.trim() || '';

                                    if (!url) return;

                                    const currentMedia = proj.media || [];
                                    handleUpdateProject(idx, 'media', [...currentMedia, { type, url, title }]);

                                    if (titleInput) titleInput.value = '';
                                    if (urlInput) urlInput.value = '';
                                  }}
                                  className={`w-full py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer transition-all ${scheme.primaryBg} ${scheme.hoverBg}`}
                                >
                                  Add Linked Media
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE TAB FORM */}
            {activeTab === 'experience' && (
              <div className="space-y-12 animate-fade-in">
                {/* CAREER TIMELINE SECTION */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b pb-4 border-zinc-800/20 dark:border-zinc-850">
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>💼 Career Timeline ({formData.experience.length})</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Manage your professional work history, roles, and achievements.</p>
                    </div>
                    <button
                      onClick={handleAddExperience}
                      className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Work History
                    </button>
                  </div>

                  {formData.experience.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No work history items configured yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {formData.experience.map((exp, idx) => (
                        <div key={exp.id} className={`p-5 rounded-2xl border transition-all ${
                          isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                        } space-y-4 animate-fade-in`}>
                          <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                          }`}>
                            <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Experience #{idx + 1}</span>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                            >
                              <Trash className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1.5">
                              <label htmlFor={`ex-company-${exp.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Company</label>
                              <input
                                id={`ex-company-${exp.id}`}
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label htmlFor={`ex-role-${exp.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Role</label>
                              <input
                                id={`ex-role-${exp.id}`}
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label htmlFor={`ex-dur-${exp.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Duration / Period</label>
                              <input
                                id={`ex-dur-${exp.id}`}
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 font-mono transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Achievements management */}
                          <div className={`space-y-3 pt-3 border-t transition-colors ${
                            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Key Accomplishments</span>
                              <button
                                onClick={() => handleAddAchievement(idx)}
                                className={`flex items-center gap-1 text-[11px] font-semibold text-zinc-600 ${scheme.textHover} transition-colors cursor-pointer`}
                              >
                                <Plus className="h-3 w-3" />
                                Add Bullet
                              </button>
                            </div>

                            <div className="space-y-2">
                              {exp.achievements.map((item, lineIdx) => (
                                <div key={lineIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleUpdateExperienceAchievements(idx, lineIdx, e.target.value)}
                                    className={`flex-1 rounded-xl border px-3 py-1.5 text-xs focus:outline-hidden focus:ring-1 transition-all ${
                                      isDarkMode
                                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-zinc-700 focus:ring-zinc-750'
                                        : 'bg-white border-zinc-200 text-zinc-700 focus:border-zinc-400 focus:ring-zinc-400'
                                    }`}
                                  />
                                  <button
                                    onClick={() => handleDeleteAchievement(idx, lineIdx)}
                                    className="p-2 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer animate-fade-in"
                                    title="Remove Bullet"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* VISUAL SEPARATOR */}
                <div className={`border-t-2 border-dashed transition-colors ${
                  isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
                }`} />

                {/* EDUCATION & DEGREES SECTION */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b pb-4 border-zinc-800/20 dark:border-zinc-850">
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>🎓 Education & Academic Pathways ({ (formData.academics || []).length })</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Manage your degrees, schools, qualifications, and certified credentials.</p>
                    </div>
                    <button
                      onClick={handleAddAcademic}
                      className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Academic
                    </button>
                  </div>

                  {(formData.academics || []).length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No academic items configured yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {(formData.academics || []).map((acad, idx) => (
                        <div key={acad.id} className={`p-5 rounded-2xl border transition-all ${
                          isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                        } space-y-4 animate-fade-in`}>
                          <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                          }`}>
                            <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Qualification #{idx + 1}</span>
                            <button
                              onClick={() => handleDeleteAcademic(acad.id)}
                              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                            >
                              <Trash className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Degree / Qualification</label>
                              <input
                                type="text"
                                value={acad.degree}
                                onChange={(e) => handleUpdateAcademic(idx, 'degree', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Institution Name</label>
                              <input
                                type="text"
                                value={acad.institution}
                                onChange={(e) => handleUpdateAcademic(idx, 'institution', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Duration / Timeline</label>
                              <input
                                type="text"
                                value={acad.duration}
                                onChange={(e) => handleUpdateAcademic(idx, 'duration', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Certificate File URL (Optional)</label>
                              <input
                                type="text"
                                value={acad.certificateUrl || ''}
                                onChange={(e) => handleUpdateAcademic(idx, 'certificateUrl', e.target.value)}
                                placeholder="https://example.com/certificate.pdf"
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Academic Description</label>
                            <textarea
                              rows={2}
                              value={acad.description}
                              onChange={(e) => handleUpdateAcademic(idx, 'description', e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 resize-y transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>

                          {/* Education Credentials Supporting Photos / Certificates Gallery */}
                          <div className={`space-y-3 pt-4 border-t transition-colors ${
                            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Credential Certifications ({ (acad.images || []).length })</span>
                            </div>

                            {/* Existing credential images */}
                            {acad.images && acad.images.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {acad.images.map((imgUrl, imgIdx) => (
                                  <div key={imgIdx} className={`relative group rounded-xl overflow-hidden border p-1.5 ${
                                    isDarkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-150'
                                  }`}>
                                    <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center">
                                      <img src={imgUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedImages = acad.images!.filter((_, subIdx) => subIdx !== imgIdx);
                                        handleUpdateAcademic(idx, 'images', updatedImages);
                                      }}
                                      className="text-[9px] text-rose-500 hover:text-rose-700 font-semibold mt-1 block cursor-pointer"
                                    >
                                      Remove Photo
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-zinc-500 italic">No credentials or certificate photos configured for this qualification.</p>
                            )}

                            {/* Drag & Drop zone to add multiple credential photos */}
                            <div className="grid gap-4 md:grid-cols-2 pt-2">
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase block">Drag & Drop multiple credential photos</span>
                                <ImageDragDropZone
                                  onImagesSelected={(base64Images) => {
                                    const currentImages = acad.images || [];
                                    handleUpdateAcademic(idx, 'images', [...currentImages, ...base64Images]);
                                  }}
                                />
                              </div>
                              <div className={`border rounded-xl p-4 flex flex-col justify-between ${
                                isDarkMode ? 'bg-zinc-950/20 border-zinc-800' : 'bg-zinc-50/50 border-zinc-200'
                              }`}>
                                <div>
                                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase block">Or link external photo URL</span>
                                  <div className="space-y-2 mt-2">
                                    <input
                                      id={`add-acad-url-${acad.id}`}
                                      type="url"
                                      placeholder="https://example.com/certificate.jpg"
                                      className={`w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-hidden ${
                                        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-800'
                                      }`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const urlInput = document.getElementById(`add-acad-url-${acad.id}`) as HTMLInputElement;
                                        const url = urlInput?.value.trim() || '';

                                        if (!url) return;

                                        const currentImages = acad.images || [];
                                        handleUpdateAcademic(idx, 'images', [...currentImages, url]);

                                        if (urlInput) urlInput.value = '';
                                      }}
                                      className={`w-full py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer transition-all ${scheme.primaryBg} ${scheme.hoverBg}`}
                                    >
                                      Add Linked Credential Photo
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* VISUAL SEPARATOR */}
                <div className={`border-t-2 border-dashed transition-colors ${
                  isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
                }`} />

                {/* CERTIFICATES ARCHIVED SECTION */}
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between border-b pb-4 border-zinc-800/20 dark:border-zinc-850">
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>🏆 Archived Certifications ({ (formData.certifications || []).length })</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Manage, upload, or modify accredited certifications, courses, and digital badges.</p>
                    </div>
                    <button
                      onClick={handleAddCertification}
                      className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Certificate
                    </button>
                  </div>

                  {(formData.certifications || []).length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No certificates archived yet. Drag and drop certificate photos inside individual cells below, or click 'Add Certificate' to create a new placeholder.</p>
                  ) : (
                    <div className="space-y-6">
                      {(formData.certifications || []).map((cert, idx) => (
                        <div key={cert.id} className={`p-5 rounded-2xl border transition-all ${
                          isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                        } space-y-4 animate-fade-in`}>
                          <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                          }`}>
                            <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Certificate #{idx + 1}</span>
                            <button
                              onClick={() => handleDeleteCertification(cert.id)}
                              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                            >
                              <Trash className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Certificate Title</label>
                                <input
                                  type="text"
                                  value={cert.title}
                                  onChange={(e) => handleUpdateCertification(idx, 'title', e.target.value)}
                                  placeholder="e.g. AWS Certified Cloud Practitioner"
                                  className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                    isDarkMode
                                      ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                      : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                  }`}
                                />
                              </div>
                              
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Issuing Institution</label>
                                <input
                                  type="text"
                                  value={cert.issuer}
                                  onChange={(e) => handleUpdateCertification(idx, 'issuer', e.target.value)}
                                  placeholder="e.g. Amazon Web Services (AWS)"
                                  className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                    isDarkMode
                                      ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                      : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                  }`}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Credential ID</label>
                                  <input
                                    type="text"
                                    value={cert.credentialId || ''}
                                    onChange={(e) => handleUpdateCertification(idx, 'credentialId', e.target.value)}
                                    placeholder="e.g. AWS-CCP-98231"
                                    className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                      isDarkMode
                                        ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                        : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                    }`}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Year Earned</label>
                                  <input
                                    type="text"
                                    value={cert.date}
                                    onChange={(e) => handleUpdateCertification(idx, 'date', e.target.value)}
                                    placeholder="e.g. 2025"
                                    className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                      isDarkMode
                                        ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                        : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Certificate Image Drop Zone & Preview */}
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Certificate Document / Preview Image</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <div className="aspect-[4/3] w-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                                    {cert.url ? (
                                      <img src={cert.url} alt="Certificate preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <Award className="h-10 w-10 text-zinc-750" />
                                    )}
                                  </div>
                                  {cert.url && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateCertification(idx, 'url', '')}
                                      className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                                    >
                                      Clear Certificate Image
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-2 flex flex-col justify-between">
                                  <div className="space-y-1.5">
                                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">Drag & drop photo</span>
                                    <ImageDragDropZone
                                      onImagesSelected={(base64Images) => {
                                        if (base64Images && base64Images.length > 0) {
                                          handleUpdateCertification(idx, 'url', base64Images[0]);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">Or paste image URL</span>
                                    <input
                                      type="url"
                                      value={cert.url || ''}
                                      onChange={(e) => handleUpdateCertification(idx, 'url', e.target.value)}
                                      placeholder="https://example.com/cert.jpg"
                                      className={`w-full rounded-lg border px-2 py-1 text-xs focus:outline-hidden ${
                                        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-800'
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TECHNICAL STACK TAB FORM */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Skills Categories ({formData.skills.length})</p>
                  <button
                    onClick={handleAddSkillCategory}
                    className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Category
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.skills.map((skillCat, idx) => (
                    <div key={skillCat.id} className={`p-5 rounded-2xl border transition-all ${
                      isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                    } space-y-4 animate-fade-in`}>
                      <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                        isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                      }`}>
                        <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Category #{idx + 1}</span>
                        <button
                          onClick={() => handleDeleteSkillCategory(skillCat.id)}
                          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label htmlFor={`sk-cat-${skillCat.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category Name</label>
                          <input
                            id={`sk-cat-${skillCat.id}`}
                            type="text"
                            value={skillCat.category}
                            onChange={(e) => handleUpdateSkillCategory(idx, e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor={`sk-list-${skillCat.id}`} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Skills (Comma-separated)</label>
                          <input
                            id={`sk-list-${skillCat.id}`}
                            type="text"
                            value={skillCat.list.join(', ')}
                            onChange={(e) => handleUpdateSkillsList(idx, e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 font-mono transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISUAL THEME TAB FORM */}
            {activeTab === 'custom' && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-3">
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Select Accent Color Scheme</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(['emerald', 'violet', 'amber', 'sky', 'rose', 'indigo'] as AccentColor[]).map((color) => {
                      const isSelected = formData.customization.accentColor === color;
                      return (
                        <button
                          key={color}
                          id={`theme-accent-btn-${color}`}
                          onClick={() => handleUpdateAccentColor(color)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? isDarkMode
                                ? 'border-white bg-white text-zinc-950 shadow-md font-bold'
                                : 'border-zinc-900 bg-zinc-900 text-white shadow-md font-bold'
                              : isDarkMode
                                ? 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300'
                                : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                          }`}
                        >
                          <span className="capitalize">{color}</span>
                          <span className={`h-4.5 w-4.5 rounded-full border border-white/25 bg-${color === 'sky' ? 'sky-500' : color === 'amber' ? 'amber-500' : color === 'emerald' ? 'emerald-500' : color === 'rose' ? 'rose-500' : color === 'violet' ? 'violet-500' : 'indigo-500'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={`space-y-3 pt-6 border-t transition-colors ${isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Select Portfolio Projects Layout</span>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      id="layout-grid-btn"
                      onClick={() => handleUpdateLayout('grid')}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        formData.customization.layout === 'grid'
                          ? isDarkMode
                            ? 'border-white ring-1 ring-white bg-zinc-950'
                            : 'border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50'
                          : isDarkMode
                            ? 'border-zinc-850 bg-zinc-950 hover:border-zinc-800'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Modern Bento Grid</p>
                      <p className={`text-xs mt-1 transition-colors ${isDarkMode ? 'text-zinc-450' : 'text-zinc-500'}`}>Projects display as detailed bento visual cards, presenting beautiful preview thumbnails and explicit tech badge fields.</p>
                    </button>

                    <button
                      id="layout-minimal-btn"
                      onClick={() => handleUpdateLayout('minimal')}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        formData.customization.layout === 'minimal'
                          ? isDarkMode
                            ? 'border-white ring-1 ring-white bg-zinc-950'
                            : 'border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50'
                          : isDarkMode
                            ? 'border-zinc-850 bg-zinc-950 hover:border-zinc-800'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Elegant Row Minimalist</p>
                      <p className={`text-xs mt-1 transition-colors ${isDarkMode ? 'text-zinc-450' : 'text-zinc-500'}`}>Projects render as sleek responsive row components, focusing strictly on typography, description details, and tag metrics.</p>
                    </button>
                  </div>
                </div>
              </div>
            )}



            {/* PASSIONS TAB FORM */}
            {activeTab === 'passions' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Talents & Passion Projects ({ (formData.passions || []).length })</p>
                  <button
                    onClick={handleAddPassion}
                    className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Passion
                  </button>
                </div>

                <div className="space-y-6">
                  {(formData.passions || []).map((passion, idx) => (
                    <div key={passion.id} className={`p-5 rounded-2xl border transition-all ${
                      isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                    } space-y-4 animate-fade-in`}>
                      <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                        isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                      }`}>
                        <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Passion/Talent #{idx + 1}</span>
                        <button
                          onClick={() => handleDeletePassion(passion.id)}
                          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Title / Activity</label>
                          <input
                            type="text"
                            value={passion.title}
                            onChange={(e) => handleUpdatePassion(idx, 'title', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category (e.g. Talent, Art, Sports)</label>
                          <input
                            type="text"
                            value={passion.category}
                            onChange={(e) => handleUpdatePassion(idx, 'category', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cover Image URL</label>
                          <input
                            type="text"
                            value={passion.imageUrl}
                            onChange={(e) => handleUpdatePassion(idx, 'imageUrl', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Slideshow Photos (Comma-separated URLs)</label>
                          <input
                            type="text"
                            value={(passion.images || []).join(', ')}
                            onChange={(e) => handleUpdatePassion(idx, 'images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            className={`w-full rounded-xl border px-3 py-2 text-sm font-mono focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Passion Slideshow Drag & Drop */}
                      <div className={`space-y-3 pt-3 border-t transition-colors ${
                        isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
                      }`}>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Passion Slideshow Gallery ({ (passion.images || []).length })</span>
                        
                        {passion.images && passion.images.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {passion.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className={`relative group rounded-lg overflow-hidden border p-1 ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                              }`}>
                                <div className="aspect-video bg-zinc-950 rounded overflow-hidden">
                                  <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedImages = passion.images!.filter((_, subIdx) => subIdx !== imgIdx);
                                    handleUpdatePassion(idx, 'images', updatedImages);
                                  }}
                                  className="text-[9px] text-rose-500 hover:text-rose-700 font-semibold mt-1 block cursor-pointer"
                                >
                                  Remove Photo
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-500 italic">No custom slideshow photos configured.</p>
                        )}

                        <div className="grid gap-4 md:grid-cols-2 pt-1">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 block">Drag & Drop multiple slideshow photos</span>
                            <ImageDragDropZone
                              onImagesSelected={(base64Images) => {
                                const currentImages = passion.images || [];
                                handleUpdatePassion(idx, 'images', [...currentImages, ...base64Images]);
                              }}
                            />
                          </div>
                          <div className={`border rounded-xl p-3 flex flex-col justify-between ${
                            isDarkMode ? 'bg-zinc-950/20 border-zinc-800' : 'bg-zinc-50/50 border-zinc-200'
                          }`}>
                            <div>
                              <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 block">Or add photo link manually</span>
                              <div className="space-y-2 mt-1.5">
                                <input
                                  id={`add-pass-url-${passion.id}`}
                                  type="url"
                                  placeholder="https://example.com/photo.jpg"
                                  className={`w-full rounded-lg border px-2 py-1 text-xs focus:outline-hidden ${
                                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-800'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const urlInput = document.getElementById(`add-pass-url-${passion.id}`) as HTMLInputElement;
                                    const url = urlInput?.value.trim() || '';
                                    if (!url) return;

                                    const currentImages = passion.images || [];
                                    handleUpdatePassion(idx, 'images', [...currentImages, url]);
                                    if (urlInput) urlInput.value = '';
                                  }}
                                  className={`w-full py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer transition-all ${scheme.primaryBg} ${scheme.hoverBg}`}
                                >
                                  Add Photo URL
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Passion Description</label>
                        <textarea
                          rows={2}
                          value={passion.description}
                          onChange={(e) => handleUpdatePassion(idx, 'description', e.target.value)}
                          className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 resize-y transition-all ${
                            isDarkMode
                              ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                              : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* BLOGS TAB FORM */}
            {activeTab === 'blogs' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Personally Written Blogs ({(formData.blogs || []).length})</p>
                  <button
                    onClick={handleAddBlog}
                    className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Write New Blog
                  </button>
                </div>

                <div className="space-y-6">
                  {(formData.blogs || []).length === 0 ? (
                    <div className={`text-center py-10 rounded-2xl border border-dashed ${
                      isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
                    }`}>
                      <p className={`text-xs font-semibold transition-colors ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>No blogs written yet. Click Write New Blog to begin!</p>
                    </div>
                  ) : (
                    (formData.blogs || []).map((blog, idx) => (
                      <div key={blog.id} className={`p-5 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                      } space-y-4 animate-fade-in`}>
                        <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                          isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                        }`}>
                          <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Blog Post #{idx + 1}</span>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                          >
                            <Trash className="h-3.5 w-3.5" />
                            Remove Post
                          </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Blog Title</label>
                            <input
                              type="text"
                              value={blog.title}
                              onChange={(e) => handleUpdateBlog(idx, 'title', e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Publish Date</label>
                            <input
                              type="text"
                              value={blog.date}
                              onChange={(e) => handleUpdateBlog(idx, 'date', e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Read Time (e.g. 5 min read)</label>
                            <input
                              type="text"
                              value={blog.readTime}
                              onChange={(e) => handleUpdateBlog(idx, 'readTime', e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Featured Image URL</label>
                            <input
                              type="text"
                              value={blog.imageUrl || ''}
                              onChange={(e) => handleUpdateBlog(idx, 'imageUrl', e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">External Article / Blog URL (Optional)</label>
                            <input
                              type="url"
                              placeholder="e.g. https://medium.com/my-article"
                              value={blog.externalLink || ''}
                              onChange={(e) => handleUpdateBlog(idx, 'externalLink', e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tags / Skills Used (Comma-separated)</label>
                          <input
                            type="text"
                            value={blog.tags.join(', ')}
                            onChange={(e) => handleUpdateBlog(idx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            className={`w-full rounded-xl border px-3 py-2 text-sm font-mono focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Blog Excerpt (Short Teaser Bio)</label>
                          <input
                            type="text"
                            value={blog.excerpt}
                            onChange={(e) => handleUpdateBlog(idx, 'excerpt', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Blog Post Body (Content)</label>
                          <textarea
                            rows={8}
                            value={blog.content}
                            onChange={(e) => handleUpdateBlog(idx, 'content', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 font-mono resize-y transition-all ${
                              isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                            }`}
                            placeholder="Write your article here. Use ### For headers, and list items starting with * or 1. to make bullet lists."
                          />
                        </div>

                        {/* Drag & Drop Blog Cover Image */}
                        <div className={`space-y-3 pt-3 border-t transition-colors ${
                          isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
                        }`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Or Upload Cover Image directly</span>
                          <div className="max-w-md">
                            <ImageDragDropZone
                              onImagesSelected={(base64Images) => {
                                if (base64Images && base64Images.length > 0) {
                                  handleUpdateBlog(idx, 'imageUrl', base64Images[0]);
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Upload Written Article Document */}
                        <div className={`space-y-3 pt-3 border-t transition-colors ${
                          isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
                        }`}>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Written Article / Document Attachment</span>
                          
                          {blog.attachment ? (
                            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  isDarkMode ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-xs font-semibold truncate transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                                    {blog.attachment.fileName}
                                  </p>
                                  <p className="text-[10px] text-zinc-500 font-medium">
                                    {blog.attachment.fileSize} • {blog.attachment.fileType || 'Document'}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUpdateBlog(idx, 'attachment', undefined)}
                                className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                                title="Remove document"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="max-w-md">
                              <DocumentUploadZone
                                onFileSelected={(name, type, size, dataUrl) => {
                                  handleUpdateBlog(idx, 'attachment', {
                                    fileName: name,
                                    fileType: type,
                                    fileSize: size,
                                    dataUrl: dataUrl
                                  });
                                }}
                              />
                            </div>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* STANDALONE ARTICLES / PUBLICATIONS */}
                <div className="pt-8 border-t border-zinc-800/10 dark:border-zinc-800/60 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Standalone Articles &amp; Publication Drafts ({(formData.articles || []).length})</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Upload research proposal PDFs, drafts, or essays separately without having to write a blog post.</p>
                    </div>
                    <button
                      onClick={handleAddArticle}
                      className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-white ${scheme.primaryBg} ${scheme.hoverBg} transition-colors cursor-pointer`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Standalone Article
                    </button>
                  </div>

                  <div className="space-y-6">
                    {(formData.articles || []).length === 0 ? (
                      <div className={`text-center py-10 rounded-2xl border border-dashed ${
                        isDarkMode ? 'border-zinc-850' : 'border-zinc-200'
                      }`}>
                        <p className={`text-xs font-semibold transition-colors ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>No standalone articles uploaded yet. Click Add Standalone Article to begin!</p>
                      </div>
                    ) : (
                      (formData.articles || []).map((article, idx) => (
                        <div key={article.id} className={`p-5 rounded-2xl border transition-all ${
                          isDarkMode ? 'bg-zinc-950/40 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'
                        } space-y-4 animate-fade-in`}>
                          <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
                            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50'
                          }`}>
                            <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Uploaded Document #{idx + 1}</span>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                            >
                              <Trash className="h-3.5 w-3.5" />
                              Remove Document
                            </button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Document/Article Title</label>
                              <input
                                type="text"
                                value={article.title}
                                onChange={(e) => handleUpdateArticle(idx, 'title', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Publish Date</label>
                              <input
                                type="text"
                                value={article.date}
                                onChange={(e) => handleUpdateArticle(idx, 'date', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">External Article URL (Optional)</label>
                              <input
                                type="url"
                                placeholder="e.g. https://example.com/published-paper"
                                value={article.externalLink || ''}
                                onChange={(e) => handleUpdateArticle(idx, 'externalLink', e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                  isDarkMode
                                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                    : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tags / Categories (Comma-separated)</label>
                            <input
                              type="text"
                              value={article.tags.join(', ')}
                              onChange={(e) => handleUpdateArticle(idx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                              className={`w-full rounded-xl border px-3 py-2 text-sm font-mono focus:outline-hidden focus:ring-1 transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Short Abstract / Description</label>
                            <textarea
                              rows={2}
                              value={article.description}
                              onChange={(e) => handleUpdateArticle(idx, 'description', e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-1 transition-all ${
                                isDarkMode
                                  ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-750'
                                  : 'bg-white border-zinc-200 text-zinc-800 focus:border-zinc-400 focus:ring-zinc-400'
                              }`}
                            />
                          </div>

                          {/* Standalone Document Drag & Drop */}
                          <div className={`space-y-3 pt-3 border-t transition-colors ${
                            isDarkMode ? 'border-zinc-800/60' : 'border-zinc-100'
                          }`}>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Article Document Attachment</span>
                            {article.dataUrl ? (
                              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    isDarkMode ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    <BookOpen className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`text-xs font-semibold truncate transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                                      {article.fileName}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 font-medium">
                                      {article.fileSize} • {article.fileType || 'Document'}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateArticle(idx, 'fileName', 'article_document.pdf');
                                    handleUpdateArticle(idx, 'fileSize', '0 Bytes');
                                    handleUpdateArticle(idx, 'fileType', 'application/pdf');
                                    handleUpdateArticle(idx, 'dataUrl', '');
                                  }}
                                  className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                                  title="Remove document"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="max-w-md">
                                <DocumentUploadZone
                                  onFileSelected={(name, type, size, dataUrl) => {
                                    handleUpdateArticle(idx, 'fileName', name);
                                    handleUpdateArticle(idx, 'fileSize', size);
                                    handleUpdateArticle(idx, 'fileType', type);
                                    handleUpdateArticle(idx, 'dataUrl', dataUrl);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
