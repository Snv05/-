import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Library, Search, Download, Globe, FileText, Image as ImageIcon, Table as TableIcon } from 'lucide-react';

interface ResourceLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (content: string) => void;
  targetTitle?: string;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ isOpen, onClose, onTransfer, targetTitle }) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setContent(`[صورة: ${file.name}]`);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">استيراد محتوى إلى: {targetTitle}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-500 text-center">الصق نصاً أو صورة، أو ارفع ملفاً من جهازك. المحتوى يُنقل كما هو دون تعديل.</p>

              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button 
                  onClick={() => setActiveTab('paste')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'paste' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  <FileText className="w-4 h-4" /> لصق نص
                </button>
                <label 
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  onClick={() => setActiveTab('upload')}
                >
                  <Download className="w-4 h-4 rotate-180" /> رفع ملف
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative min-h-[200px] rounded-2xl border-2 border-dashed transition-all ${isDragging ? 'border-secondary bg-secondary/5' : 'border-slate-200 bg-slate-50'}`}
              >
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onFocus={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  placeholder="الصق النص هنا... (Ctrl+V) أو اسحب وأفلت ملفاً نصياً"
                  className="w-full min-h-[200px] bg-transparent p-6 text-sm outline-none resize-none text-right overflow-hidden"
                  dir="rtl"
                />
              </div>

              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => {
                    onTransfer(content);
                    setContent('');
                    onClose();
                  }}
                  disabled={!content}
                  className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-4 h-4 rotate-180" /> نقل المحتوى
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
