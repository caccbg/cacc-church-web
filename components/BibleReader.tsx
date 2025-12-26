
import React, { useState, useEffect } from 'react';
import { getPassage, BIBLE_BOOKS, VERSIONS, BibleResponse } from '../services/bibleService';

const BibleReader: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [selectedVersion, setSelectedVersion] = useState('web');
  const [bibleData, setBibleData] = useState<BibleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Determine max chapters (Simplified logic: Most books have < 150, Psalms has 150. 
  // Ideally, we'd have a map of chapter counts, but for this demo, input is flexible).
  
  useEffect(() => {
    fetchChapter();
  }, [selectedBook, selectedChapter, selectedVersion]);

  const fetchChapter = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getPassage(selectedBook, selectedChapter, selectedVersion);
      setBibleData(data);
    } catch (err) {
      setError('Could not load passage.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => setSelectedChapter(prev => prev + 1);
  const handlePrev = () => setSelectedChapter(prev => Math.max(1, prev - 1));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Controls */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 space-y-3 bg-gray-50 dark:bg-slate-900/50">
        <div className="flex gap-2">
           <select 
             value={selectedBook}
             onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); }}
             className="flex-1 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-primary dark:text-white"
           >
             {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
           </select>
           <input 
             type="number" 
             min="1" 
             max="150"
             value={selectedChapter}
             onChange={(e) => setSelectedChapter(parseInt(e.target.value) || 1)}
             className="w-20 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-primary dark:text-white text-center"
           />
        </div>
        <select 
           value={selectedVersion}
           onChange={(e) => setSelectedVersion(e.target.value)}
           className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-500 focus:ring-primary dark:text-gray-300"
        >
           {VERSIONS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      {/* Reader Content */}
      <div className="flex-1 overflow-y-auto p-6 relative">
         {isLoading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
         ) : error ? (
           <div className="text-center text-red-500 p-4">{error}</div>
         ) : bibleData ? (
           <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 text-center">{bibleData.reference}</h3>
              <div className="space-y-2">
                {bibleData.verses.map((verse) => (
                  <span key={verse.verse} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <sup className="text-[10px] text-primary font-bold mr-1 opacity-70">{verse.verse}</sup>
                    <span className="mr-1">{verse.text.replace(/\n/g, ' ')}</span>
                  </span>
                ))}
              </div>
           </div>
         ) : null}
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex justify-between bg-gray-50 dark:bg-slate-900/50">
         <button onClick={handlePrev} className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center gap-1 disabled:opacity-50" disabled={selectedChapter <= 1}>
            <span className="material-symbols-outlined text-sm">chevron_left</span> Prev Ch
         </button>
         <button onClick={handleNext} className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center gap-1">
            Next Ch <span className="material-symbols-outlined text-sm">chevron_right</span>
         </button>
      </div>
    </div>
  );
};

export default BibleReader;
