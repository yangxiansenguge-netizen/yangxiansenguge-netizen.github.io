import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ExamData, LibraryEntry, SingleExamEntry, FolderEntry } from './types';
import { QuestionCard } from './components/QuestionCard';

const STORAGE_KEY = 'chalk_exam_library_v2';
const CHUNK_SIZE = 50; // Threshold to split into folders

const App: React.FC = () => {
  const [view, setView] = useState<'library' | 'exam'>('library');
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [currentExam, setCurrentExam] = useState<ExamData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);
  
  // Track which folders are open in the UI
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);

  // --- PERSISTENCE & INIT ---
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const migrated = parsed.map((item: any) => ({
          ...item,
          type: item.type || 'exam'
        }));
        setLibrary(migrated);
      }
    } catch (e) {
      console.error("Failed to load library", e);
    }
  }, []);

  // --- GLOBAL EVENT LISTENERS (Navigation & Drag Prevention) ---
  useEffect(() => {
    // 1. Prevent Browser default Drag & Drop (Navigation)
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    // 2. Intercept ALL clicks to prevent navigation from links in Question HTML
    // This is crucial for preventing the "File moved" crash when clicking relative links
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If clicking an anchor tag (or child of one)
      const anchor = target.closest('a');
      if (anchor) {
        // If it's a valid external link, allow opening in new tab ONLY
        const href = anchor.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('https') || href.startsWith('mailto'))) {
           // Allow, but ensure it's a new tab
           anchor.setAttribute('target', '_blank');
           anchor.setAttribute('rel', 'noopener noreferrer');
        } else {
           // Block relative links/fragments that would crash the file:// app or local context
           e.preventDefault();
           e.stopPropagation();
           console.warn("Blocked local navigation to:", href);
        }
      }
    };

    window.addEventListener('dragover', preventDrag);
    window.addEventListener('drop', preventDrag);
    document.addEventListener('click', handleGlobalClick, true); // Capture phase to catch it first

    return () => {
      window.removeEventListener('dragover', preventDrag);
      window.removeEventListener('drop', preventDrag);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  const saveLibrary = (newLibrary: LibraryEntry[]) => {
    setLibrary(newLibrary);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLibrary));
      setStorageWarning(false);
    } catch (err) {
      console.warn("Failed to save to local storage (Quota Exceeded)", err);
      // Do not crash, just warn the user they are in "Memory Mode"
      setStorageWarning(true);
    }
  };

  // --- FILE UPLOAD & SPLITTING ---
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target?.result as string;
        
        // Sanitize Input: Find the first '{' and last '}' to ignore extra headers/footers
        // This fixes the ". 自动解析..." text header issue
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const json = JSON.parse(text) as ExamData;

        // Validation
        if (!json.items || !Array.isArray(json.items)) {
          throw new Error("Invalid format: 'items' array missing.");
        }

        const baseName = file.name.replace('.json', '');
        const questions = json.items;

        let newEntry: LibraryEntry;

        // Requirement: Only split if STRICTLY greater than CHUNK_SIZE (50)
        if (questions.length > CHUNK_SIZE) {
          // SPLIT INTO FOLDER
          const chunks: SingleExamEntry[] = [];
          const totalParts = Math.ceil(questions.length / CHUNK_SIZE);

          for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
            const partNum = (i / CHUNK_SIZE) + 1;
            const chunkItems = questions.slice(i, i + CHUNK_SIZE);
            
            chunks.push({
              type: 'exam',
              id: generateId(), // Unique ID for this chunk
              name: `${baseName} - Part ${partNum}/${totalParts}`,
              dateAdded: Date.now(),
              data: { ...json, items: chunkItems }
            });
          }

          newEntry = {
            type: 'folder',
            id: generateId(),
            name: baseName, // The folder name is the original file name
            dateAdded: Date.now(),
            children: chunks
          };
        } else {
          // SINGLE EXAM (<= 50 items)
          newEntry = {
            type: 'exam',
            id: generateId(),
            name: baseName,
            dateAdded: Date.now(),
            data: json
          };
        }

        // Add to library
        saveLibrary([newEntry, ...library]);
        
        // UX: Auto-expand folder so user sees it was split.
        if (newEntry.type === 'folder') {
            toggleFolder(newEntry.id);
        }
        
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to parse file. Ensure it is valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    event.target.value = ''; // Reset
  };

  // Drag handlers for the specific drop zone
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/json" || file.name.endsWith('.json'))) {
      processFile(file);
    } else if (file) {
      setError("Please drop a valid .json file");
    }
  };

  // --- ACTIONS ---

  const startExam = (exam: ExamData) => {
    setCurrentExam(exam);
    setUserAnswers({});
    setView('exam');
    window.scrollTo(0,0);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Delete a root item (Single Exam or Whole Folder)
  const deleteRootItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Critical to prevent opening the exam when clicking delete
    if (window.confirm("确定要删除此项目吗？(Delete this item?)")) {
      const updated = library.filter(item => item.id !== id);
      saveLibrary(updated);
    }
  };

  // Delete a sub-item inside a folder
  const deleteSubItem = (e: React.MouseEvent, folderId: string, subId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Critical
    if (window.confirm("确定要删除此部分吗？(Delete this part?)")) {
      const updated = library.map(item => {
        if (item.type === 'folder' && item.id === folderId) {
          const newChildren = item.children.filter(child => child.id !== subId);
          // If folder becomes empty, we automatically remove the folder wrapper
          return { ...item, children: newChildren };
        }
        return item;
      });
      
      // Cleanup: Filter out folders that have 0 children
      const finalLibrary = updated.filter(item => 
         item.type === 'exam' || (item.type === 'folder' && item.children.length > 0)
      );

      saveLibrary(finalLibrary);
    }
  };

  const clearLibrary = () => {
    if (window.confirm("确定要清空所有题库吗？(Clear all?)")) {
      saveLibrary([]);
    }
  };

  // --- EXAM LOGIC ---
  const handleAnswerChange = useCallback((id: number, value: string | string[]) => {
    setUserAnswers(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleBackNav = () => {
    if (Object.keys(userAnswers).length > 0) {
      if (!window.confirm("Exit? Progress lost.")) return;
    }
    exitExam();
  };

  const handleFinishExam = () => exitExam();

  const exitExam = () => {
    setView('library');
    setCurrentExam(null);
    setUserAnswers({});
    window.scrollTo(0, 0);
  };

  const progress = useMemo(() => {
    if (!currentExam) return 0;
    const ans = Object.keys(userAnswers).length;
    const total = currentExam.items.length;
    return total === 0 ? 0 : Math.round((ans / total) * 100);
  }, [currentExam, userAnswers]);

  // --- RENDER HELPERS ---

  const renderSingleCard = (item: SingleExamEntry, insideFolder = false, folderId?: string) => (
    <div 
      key={item.id}
      onClick={() => startExam(item.data)}
      // Added 'select-none' to prevent text selection while clicking/dragging, which can cause browser navigation
      className={`
        relative bg-chalk-board border-2 border-gray-600 p-6 rounded cursor-pointer select-none
        hover:border-chalk-white transition-all group
        ${insideFolder ? 'mx-4 mb-4 border-dashed border-gray-500 bg-[#353b41]' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-y-1'}
      `}
    >
      {/* Tape for root items only */}
      {!insideFolder && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/10 rotate-2 backdrop-blur-sm border-l border-r border-white/20 z-10"></div>
      )}

      <div className="flex justify-between items-start">
        <h3 className={`font-bold text-chalk-white mb-3 line-clamp-2 leading-tight font-hand tracking-wide pr-8 ${insideFolder ? 'text-xl' : 'text-2xl min-h-[3.5rem]'}`}>
          {item.name}
        </h3>
      </div>
      
      <div className="w-full h-px bg-gray-500 mb-4 opacity-50"></div>

      <div className="flex justify-between items-end text-chalk-gray font-hand">
        <span className="text-sm opacity-80">{new Date(item.dateAdded).toLocaleDateString()}</span>
        <div className="text-right">
           <span className="block text-xs uppercase tracking-widest opacity-70">Questions</span>
           <span className={`font-bold text-chalk-yellow ${insideFolder ? 'text-xl' : 'text-3xl'}`}>{item.data.items.length}</span>
        </div>
      </div>

      <button
        type="button" 
        onClick={(e) => insideFolder && folderId ? deleteSubItem(e, folderId, item.id) : deleteRootItem(e, item.id)}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-chalk-gray hover:text-chalk-white hover:bg-chalk-red rounded-full transition-all z-40 focus:outline-none"
        title="Delete"
      >
        <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </div>
  );

  const renderFolderCard = (folder: FolderEntry) => {
    const isExpanded = expandedFolders[folder.id];
    const totalQ = folder.children.reduce((acc, child) => acc + child.data.items.length, 0);

    return (
      <div key={folder.id} className="relative group">
        {/* Stack visual effect behind the card */}
        <div className="absolute top-2 left-2 w-full h-full bg-gray-700/50 rounded border border-gray-600/50 transform rotate-1 z-0"></div>
        <div className="absolute top-4 left-4 w-full h-full bg-gray-700/30 rounded border border-gray-600/30 transform rotate-2 z-0"></div>

        {/* Main Folder Card */}
        <div 
          onClick={() => toggleFolder(folder.id)}
          // Added 'select-none'
          className={`
            relative z-10 bg-[#2f3640] border-2 border-chalk-yellow/50 p-6 rounded shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer select-none
            hover:border-chalk-yellow transition-all
            ${isExpanded ? 'translate-x-0 translate-y-0 shadow-none mb-4' : 'hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)]'}
          `}
        >
          {/* Folder Tab Visual */}
          <div className="absolute -top-4 left-0 w-1/3 h-6 bg-[#2f3640] border-t-2 border-l-2 border-r-2 border-chalk-yellow/50 rounded-t-lg z-20"></div>

          <div className="flex justify-between items-start relative z-30 pt-2">
             <div className="flex items-center gap-3">
               <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                 <svg className="w-8 h-8 text-chalk-yellow" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
               </div>
               <h3 className="text-2xl font-bold text-chalk-white font-hand tracking-wide leading-tight">
                 {folder.name}
               </h3>
             </div>
             
             {/* Delete Folder Button */}
             <button
                type="button" 
                onClick={(e) => deleteRootItem(e, folder.id)}
                className="w-8 h-8 flex items-center justify-center text-chalk-gray hover:text-chalk-white hover:bg-chalk-red rounded-full transition-all focus:outline-none z-50"
                title="Delete Folder"
              >
                <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>

          <div className="mt-4 flex justify-between items-end text-chalk-gray font-hand">
             <span className="text-sm opacity-80">{folder.children.length} Parts</span>
             <div className="text-right">
                <span className="block text-xs uppercase tracking-widest opacity-70">Total Qs</span>
                <span className="font-bold text-chalk-yellow text-3xl">{totalQ}</span>
             </div>
          </div>
          
          <div className="text-center mt-2 text-chalk-gray/50 text-sm font-sans tracking-wider">
             {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </div>
        </div>

        {/* Expanded Content (Sub-cards) */}
        {isExpanded && (
          <div className="relative z-10 pl-6 space-y-2 mt-2 border-l-4 border-dashed border-chalk-yellow/20 ml-6 pb-4">
             {folder.children.map(child => renderSingleCard(child, true, folder.id))}
          </div>
        )}
      </div>
    );
  };

  // --- VIEW: LIBRARY ---
  if (view === 'library') {
    return (
      <div className="min-h-screen p-6 md:p-12 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl text-chalk-white font-bold mb-4 tracking-widest text-center font-hand transform -rotate-1 shadow-black drop-shadow-md">
          REVIEW CLASS
        </h1>
        <p className="text-chalk-gray text-2xl mb-12 font-hand border-b-2 border-dashed border-chalk-gray/30 pb-2">Select a workbook or import new questions</p>
        
        {/* Storage Warning Banner */}
        {storageWarning && (
          <div className="w-full max-w-4xl bg-yellow-900/40 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-8 flex items-center gap-3 animate-pulse">
             <span className="text-xl">⚠️</span>
             <div>
               <strong className="font-bold block">Storage Limit Reached</strong>
               <span className="text-sm">Your new files are saved in <b>Memory Mode</b>. They will work now but will disappear if you refresh the page.</span>
             </div>
          </div>
        )}

        {/* Upload Area */}
        <label 
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={handleDrop}
          className={`
            w-full max-w-2xl h-40 border-4 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group mb-16 relative overflow-hidden
            ${isDragging ? 'border-chalk-yellow bg-white/10 scale-105 shadow-2xl' : 'border-chalk-gray/40 hover:border-chalk-yellow hover:bg-white/5'}
          `}
        >
          <div className="flex flex-col items-center relative z-10 transform group-hover:scale-105 transition-transform pointer-events-none">
            <svg className={`w-12 h-12 mb-3 transition-colors ${isDragging ? 'text-chalk-yellow' : 'text-chalk-gray group-hover:text-chalk-yellow'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            <span className={`text-3xl font-bold font-hand ${isDragging ? 'text-chalk-white' : 'text-chalk-gray group-hover:text-chalk-white'}`}>
              {isDragging ? 'Drop file here' : 'Import New JSON'}
            </span>
            <span className="text-lg text-chalk-gray/60 mt-1 font-hand">Click to select or Drag & Drop</span>
          </div>
          <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
        </label>

        {error && (
          <div className="mb-8 px-6 py-4 border-2 border-chalk-red text-chalk-red text-xl font-bold rounded bg-red-900/20 max-w-2xl w-full font-hand animate-bounce">
            ERROR: {error}
          </div>
        )}

        {/* Library Grid */}
        <div className="w-full max-w-6xl">
           <div className="flex justify-between items-center mb-6 pl-2 border-l-4 border-chalk-yellow">
              <h2 className="text-3xl text-chalk-yellow font-hand">Your Bookshelf</h2>
              {library.length > 0 && (
                <button 
                  type="button"
                  onClick={clearLibrary}
                  className="text-chalk-gray hover:text-chalk-red underline font-hand text-lg transition-colors"
                >
                  Clear All
                </button>
              )}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {library.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center text-chalk-gray/40 border-4 border-dotted border-chalk-gray/10 rounded-xl">
                <span className="text-8xl mb-4">∅</span>
                <span className="text-3xl font-hand">Board is empty.</span>
              </div>
            ) : (
              library.map(entry => {
                if (entry.type === 'folder') {
                  return renderFolderCard(entry);
                } else {
                  return renderSingleCard(entry as SingleExamEntry);
                }
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: EXAM ---
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-[#2d3436]/95 border-b-4 border-chalk-board shadow-2xl backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
                type="button"
                onClick={handleBackNav}
                className="text-chalk-gray hover:text-chalk-white flex items-center gap-2 text-xl font-hand transition-colors group"
             >
               <span className="group-hover:-translate-x-1 transition-transform font-sans font-bold">←</span> Library
             </button>
          </div>

          <div className="flex flex-col items-center w-1/3">
             <div className="text-xs text-chalk-gray uppercase tracking-widest font-sans mb-1">Class Progress</div>
             <div className="w-full h-3 bg-gray-700 rounded-full border border-gray-600 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-chalk-green transition-all duration-500 rough-edge"
                  style={{ width: `${progress}%` }}
                />
             </div>
          </div>

          <div className="text-chalk-yellow font-bold text-2xl font-hand">
            {Object.keys(userAnswers).length} <span className="text-chalk-gray text-lg">/ {currentExam?.items.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-16">
        {currentExam?.items.map((item, index) => (
          <QuestionCard 
            key={item.id} 
            item={item} 
            index={index} 
            userAnswer={userAnswers[item.id]}
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <div className="pt-10 pb-20 text-center flex justify-center">
          <button 
            type="button"
            onClick={handleFinishExam}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-3xl font-bold text-chalk-bg transition-all duration-200 bg-chalk-green font-hand border-2 border-transparent rounded shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chalk-green"
          >
            <span>Class Dismissed</span>
            <svg className="w-8 h-8 ml-3 text-chalk-bg/70 group-hover:text-chalk-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </main>
      <style>{`.rough-edge { clip-path: polygon(0% 0%, 100% 0%, 98% 50%, 100% 100%, 0% 100%); }`}</style>
    </div>
  );
};

export default App;