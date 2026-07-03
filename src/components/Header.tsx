import React, { useState } from 'react';
import { Sparkles, Code2, Sun, Moon, ExternalLink, Lock, Eye, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ColorScheme } from '../utils/theme';

interface HeaderProps {
  name: string;
  onOpenEditor: () => void;
  isEditorOpen: boolean;
  scheme: ColorScheme;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isUnlocked: boolean;
  avatarUrl?: string;
  hasBlogsOrArticles?: boolean;
}

export default function Header({ 
  name, 
  onOpenEditor, 
  isEditorOpen, 
  scheme, 
  isDarkMode, 
  onToggleDarkMode,
  isUnlocked,
  avatarUrl,
  hasBlogsOrArticles
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get initials for avatar/logo
  const initials = (name || "KM")
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Smooth scroll helper
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const menuItems = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Academics', id: 'academics' },
    { label: 'Passions & Activities', id: 'passions' },
    { label: 'Certificates', id: 'certificates' },
    ...(hasBlogsOrArticles ? [{ label: 'Blogs & Articles', id: 'blogs' }] : []),
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 ${
      isDarkMode 
        ? 'border-indigo-950/80 bg-[#0c092c]/85 shadow-lg shadow-indigo-950/20' 
        : 'border-indigo-100 bg-white/85 shadow-xs'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a 
          href="#about" 
          className="flex items-center gap-3 group select-none cursor-pointer"
          onClick={(e) => scrollToSection(e, 'about')}
        >
          <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl font-display font-bold text-sm tracking-tight border transition-all overflow-hidden group-hover:scale-105 group-hover:ring-2 ${
            isDarkMode
              ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60 group-hover:ring-indigo-500/50'
              : `${scheme.lightBg} ${scheme.text} ${scheme.border} group-hover:ring-indigo-500/30`
          }`}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              initials
            )}
          </div>
          <span className={`font-display text-sm sm:text-base font-bold tracking-tight transition-colors group-hover:text-indigo-400 ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            {name}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-3 lg:gap-5">
          {menuItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`} 
              onClick={(e) => scrollToSection(e, item.id)}
              className={`text-[11px] lg:text-xs font-semibold transition-colors ${
                isDarkMode ? 'text-indigo-200 hover:text-white' : 'text-zinc-650 hover:text-zinc-900'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Print PDF Button */}
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#15113d] border-indigo-900 text-indigo-200 hover:text-white hover:border-indigo-700'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
            }`}
            title="Print Portfolio to PDF"
          >
            <span>🖨️ Print PDF</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#15113d] border-indigo-900 text-amber-400 hover:text-amber-350'
                : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Editor Toggle Button */}
          <button
            id="toggle-studio-editor-btn"
            onClick={onOpenEditor}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
              isEditorOpen
                ? isDarkMode 
                  ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {isEditorOpen ? (
              <>
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>Exit Studio</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse shrink-0" />
                <span>Studio Editor</span>
              </>
            )}
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className={`md:hidden p-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#15113d] border-indigo-900 text-indigo-200 hover:text-white hover:border-indigo-700'
                : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden border-t overflow-hidden ${
              isDarkMode 
                ? 'border-indigo-950 bg-[#0c092c]' 
                : 'border-indigo-50 bg-white'
            }`}
          >
            <div className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    scrollToSection(e, item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-indigo-200 hover:text-white hover:bg-indigo-950/50' 
                      : 'text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
