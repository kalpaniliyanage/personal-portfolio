import React from 'react';
import { Mail, Github, Linkedin, Facebook, Lock, Unlock, Sparkles } from 'lucide-react';
import { ColorScheme } from '../utils/theme';
import { PersonalInfo } from '../types';

interface FooterProps {
  personal: PersonalInfo;
  onOpenEditor: () => void;
  isUnlocked: boolean;
  scheme: ColorScheme;
  isDarkMode: boolean;
}

export default function Footer({ personal, onOpenEditor, isUnlocked, scheme, isDarkMode }: FooterProps) {
  return (
    <footer className={`mt-20 border-t transition-colors duration-200 py-12 ${
      isDarkMode 
        ? 'border-zinc-800/80 bg-zinc-950 text-zinc-400' 
        : 'border-zinc-100 bg-zinc-50 text-zinc-600'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className={`font-display font-bold text-base transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{personal.name}</p>
            <p className={`text-sm mt-1 transition-colors ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{personal.role}</p>
          </div>

          <div className="flex gap-4">
            {personal.email && (
              <a
                href={`mailto:${personal.email}`}
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    : `bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 ${scheme.textHover}`
                }`}
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    : `bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 ${scheme.textHover}`
                }`}
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    : `bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 ${scheme.textHover}`
                }`}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {(personal.facebook || personal.twitter) && (
              <a
                href={personal.facebook || personal.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    : `bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 ${scheme.textHover}`
                }`}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div className={`mt-8 border-t pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row ${
          isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/60'
        }`}>
          <div className="text-xs text-center sm:text-left space-y-1">
            <p className={isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}>
              &copy; {new Date().getFullYear()} {personal.name}. All rights reserved. Built with React & Tailwind CSS.
            </p>
          </div>

          <button
            onClick={onOpenEditor}
            className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
              isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {isUnlocked ? (
              <>
                <Unlock className={`h-3 w-3 ${isDarkMode ? scheme.darkText : scheme.text}`} />
                <span>Live Editor Unlocked</span>
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                <span>Live Editor Passcode Protected</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
