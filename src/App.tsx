import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, X, Check, AlertTriangle, Sparkles, Code2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import PortfolioView from './components/PortfolioView';
import StudioEditor from './components/StudioEditor';
import { defaultPortfolioData } from './defaultData';
import { PortfolioData } from './types';
import { colorSchemes } from './utils/theme';
import { savePortfolioToCloud, fetchPortfolioFromCloud, subscribeToPortfolioCloud, optimizePortfolioData } from './utils/firebase';
import { playSound } from './utils/sound';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    try {
      const stored = localStorage.getItem('portfolio_data_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Merge deep elements safely to prevent missing fields (e.g. personal, custom, etc) from throwing exceptions
          return {
            ...defaultPortfolioData,
            ...parsed,
            personal: {
              ...defaultPortfolioData.personal,
              ...(parsed.personal || {})
            },
            customization: {
              ...defaultPortfolioData.customization,
              ...(parsed.customization || {})
            }
          };
        }
      }
    } catch (e) {
      console.error('Failed to load portfolio data from localStorage:', e);
    }
    return defaultPortfolioData;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Passcode Lock Modal states
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [lockModalError, setLockModalError] = useState('');
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Initialize dark mode (defaulting to true as requested)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        return stored === 'dark';
      }
    } catch (e) {
      console.error('Failed to load theme from localStorage:', e);
    }
    return true; // Default to dark mode for gorgeous sleek portfolios
  });

  // Sync unlock state with localStorage
  useEffect(() => {
    const checkUnlock = () => {
      setIsUnlocked(localStorage.getItem('portfolio_editor_unlocked') === 'true');
    };
    checkUnlock();
    // Periodically poll or listen for changes (since they are in the same tab)
    const interval = setInterval(checkUnlock, 1000);
    return () => clearInterval(interval);
  }, []);

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Cloud Database synchronization on mount
  useEffect(() => {
    const initCloudSync = async () => {
      setSyncStatus('syncing');
      try {
        const cloudData = await fetchPortfolioFromCloud();
        if (cloudData) {
          setPortfolioData(cloudData);
          localStorage.setItem('portfolio_data_v1', JSON.stringify(cloudData));
          setSyncStatus('success');
          setTimeout(() => setSyncStatus('idle'), 3000);
        } else {
          // If Firestore is empty, initialize it with current data
          await savePortfolioToCloud(portfolioData);
          setSyncStatus('success');
          setTimeout(() => setSyncStatus('idle'), 3000);
        }
      } catch (error) {
        console.error('Failed initial cloud sync:', error);
        setSyncStatus('error');
      }
    };

    initCloudSync();

    // Subscribe to live cloud updates (real-time sync for any device)
    const unsubscribe = subscribeToPortfolioCloud((cloudData) => {
      if (cloudData) {
        setPortfolioData(cloudData);
        try {
          localStorage.setItem('portfolio_data_v1', JSON.stringify(cloudData));
        } catch (e) {
          console.error('Local storage write failure in subscription:', e);
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSaveData = async (newData: PortfolioData) => {
    setSyncStatus('syncing');
    playSound('click');
    try {
      const optimizedData = await optimizePortfolioData(newData);
      setPortfolioData(optimizedData);
      localStorage.setItem('portfolio_data_v1', JSON.stringify(optimizedData));
      await savePortfolioToCloud(optimizedData);
      setSyncStatus('success');
      playSound('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (e) {
      console.error('Failed to save portfolio data:', e);
      setSyncStatus('error');
      playSound('delete');
    }
  };

  const handleToggleEditor = () => {
    playSound('click');
    setIsEditorOpen(prev => !prev);
  };

  const handleLockModalUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === 'kalpani2026') {
      localStorage.setItem('portfolio_editor_unlocked', 'true');
      setIsUnlocked(true);
      setLockModalError('');
      setJustUnlocked(true);
      setPasscodeInput('');
      playSound('unlock');
    } else {
      setLockModalError('Incorrect passcode. Please try again!');
      playSound('delete');
    }
  };

  const handleLockModalLock = () => {
    localStorage.removeItem('portfolio_editor_unlocked');
    setIsUnlocked(false);
    setJustUnlocked(false);
    setLockModalError('');
    setIsLockModalOpen(false);
    playSound('delete');
  };

  const handleToggleDarkMode = () => {
    playSound('click');
    setIsDarkMode(prev => {
      const nextMode = !prev;
      try {
        localStorage.setItem('theme', nextMode ? 'dark' : 'light');
      } catch (e) {
        console.error('Failed to save theme preference:', e);
      }
      return nextMode;
    });
  };

  // Extract selected accent scheme or fallback to emerald
  const accentColor = portfolioData.customization?.accentColor || 'emerald';
  const scheme = colorSchemes[accentColor] || colorSchemes.emerald;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#07051a] via-[#090829] to-[#120521] text-indigo-100' 
        : 'bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 text-zinc-900'
    }`}>
      {/* Cloud Sync Status Toast/Pill */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <AnimatePresence>
          {syncStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold shadow-xl backdrop-blur-md transition-all ${
                syncStatus === 'syncing'
                  ? 'bg-[#15113d]/90 border-blue-500/30 text-blue-400 shadow-blue-950/10'
                  : syncStatus === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-950/10'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-950/10'
              }`}
            >
              {syncStatus === 'syncing' && (
                <>
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span>Syncing with Cloud Database...</span>
                </>
              )}
              {syncStatus === 'success' && (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span>☁️ Live & Synced to Cloud</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                  <span>Sync Failed (Saved Locally)</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Floating Background Blobs for Dark Mode (Motion Feature) */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.25, 0.9, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -70, 60, 0],
              y: [0, 50, -50, 0],
              scale: [1, 0.85, 1.15, 1],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-2/3 right-1/12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
          />
        </div>
      )}

      {/* Dynamic Header */}
      <Header
        name={portfolioData.personal.name}
        onOpenEditor={handleToggleEditor}
        isEditorOpen={isEditorOpen}
        scheme={scheme}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isUnlocked={isUnlocked}
        avatarUrl={portfolioData.personal.avatarUrl}
        hasBlogsOrArticles={!!((portfolioData.blogs && portfolioData.blogs.length > 0) || (portfolioData.articles && portfolioData.articles.length > 0))}
      />

      {/* Main Container */}
      <main className="flex-grow">
        {isEditorOpen ? (
          <StudioEditor
            initialData={portfolioData}
            onSave={handleSaveData}
            scheme={scheme}
            isDarkMode={isDarkMode}
            onClose={() => setIsEditorOpen(false)}
          />
        ) : (
          <PortfolioView 
            data={portfolioData} 
            scheme={scheme} 
            isDarkMode={isDarkMode} 
          />
        )}
      </main>

      {/* Footer is only rendered on public view to keep editor screen distraction-free */}
      {!isEditorOpen && (
        <>
          <Footer
            personal={portfolioData.personal}
            onOpenEditor={() => {
              setIsEditorOpen(true);
            }}
            isUnlocked={isUnlocked}
            scheme={scheme}
            isDarkMode={isDarkMode}
          />

          {/* Floating Lock / Unlock Studio Button in the Bottom-Right Corner */}
          <div className="fixed bottom-6 right-6 z-50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLockModalOpen(true)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-bold shadow-xl transition-colors cursor-pointer select-none ${
                isUnlocked
                  ? isDarkMode
                    ? 'bg-emerald-950/90 hover:bg-emerald-900/90 border-emerald-800 text-emerald-300 hover:text-white shadow-emerald-950/20'
                    : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                  : isDarkMode
                    ? 'bg-[#120a3e]/90 hover:bg-[#1b1055]/90 border-indigo-800/80 text-indigo-300 hover:text-white shadow-indigo-950/30'
                    : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-zinc-200/50'
              } backdrop-blur-md`}
              title={isUnlocked ? "Lock Studio" : "Unlock Studio"}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Lock / Unlock Studio</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>Lock / Unlock Studio</span>
                </>
              )}
            </motion.button>
          </div>
        </>
      )}

      {/* Lock / Unlock Studio Interactive Passcode Dialog Modal */}
      <AnimatePresence>
        {isLockModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            {/* Modal Backdrop click */}
            <div 
              className="absolute inset-0 cursor-default" 
              onClick={() => {
                setIsLockModalOpen(false);
                setJustUnlocked(false);
                setLockModalError('');
                setPasscodeInput('');
              }} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`relative w-full max-w-md rounded-3xl border p-8 shadow-2xl text-center z-10 transition-colors ${
                isDarkMode 
                  ? 'bg-[#120a3a]/95 border-indigo-900/60 shadow-indigo-950/40 text-white' 
                  : 'bg-white border-zinc-200 shadow-xl shadow-indigo-100/40 text-zinc-950'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsLockModalOpen(false);
                  setJustUnlocked(false);
                  setLockModalError('');
                  setPasscodeInput('');
                }}
                className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
                  isDarkMode ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <X className="h-5 w-5" />
              </button>

              {justUnlocked ? (
                <div className="space-y-6 py-4">
                  <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/30`}>
                    <Check className="h-8 w-8 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-black tracking-tight">Studio Unlocked!</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-indigo-200/70' : 'text-zinc-650'}`}>
                      You have successfully authenticated as the owner.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setIsEditorOpen(true);
                        setIsLockModalOpen(false);
                        setJustUnlocked(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-98"
                    >
                      <Sparkles className="h-4 w-4" />
                      Launch Studio Editor
                    </button>
                    <button
                      onClick={() => {
                        setIsLockModalOpen(false);
                        setJustUnlocked(false);
                      }}
                      className={`w-full rounded-xl px-4 py-3 font-semibold text-sm border transition-colors cursor-pointer ${
                        isDarkMode 
                          ? 'border-indigo-900/60 hover:bg-white/5 text-zinc-300' 
                          : 'border-zinc-200 hover:bg-zinc-50 text-zinc-650'
                      }`}
                    >
                      Keep Viewing Portfolio
                    </button>
                  </div>
                </div>
              ) : isUnlocked ? (
                <div className="space-y-6 py-4">
                  <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center border ${
                    isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    <Unlock className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-black tracking-tight">Studio Session Active</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-indigo-200/70' : 'text-zinc-650'}`}>
                      You are currently logged in as the owner (<span className="font-bold text-indigo-400">Kalpani</span>).
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setIsEditorOpen(true);
                        setIsLockModalOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-98"
                    >
                      <Code2 className="h-4 w-4" />
                      Open Studio Editor
                    </button>
                    <button
                      onClick={handleLockModalLock}
                      className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer active:scale-98 shadow-lg shadow-rose-600/10"
                    >
                      <Lock className="h-4 w-4" />
                      Lock / Close Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center border ${
                    isDarkMode ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80' : 'bg-indigo-50 text-indigo-600 border-indigo-150'
                  }`}>
                    <Lock className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-black tracking-tight">Unlock Studio</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-indigo-200/70' : 'text-zinc-550'} max-w-xs mx-auto`}>
                      Enter the owner passcode to unlock editing and customization capabilities for this portfolio.
                    </p>
                  </div>

                  <form onSubmit={handleLockModalUnlock} className="space-y-4">
                    <input
                      type="password"
                      placeholder="Enter owner passcode"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-mono focus:outline-hidden focus:ring-2 transition-all ${
                        isDarkMode
                          ? 'bg-[#0a0520] border-indigo-900 text-white focus:border-indigo-500 focus:ring-indigo-500/30 placeholder:text-indigo-800/50'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-zinc-300'
                      }`}
                      required
                      autoFocus
                    />
                    
                    {lockModalError && (
                      <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 justify-center">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        {lockModalError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-xl px-4 py-3 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-98 cursor-pointer"
                    >
                      Verify Passcode & Unlock
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
