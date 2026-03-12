import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bot, Sparkles, Search, Download, CheckCircle2, FlaskConical, Type, Table as TableIcon, Activity, Image as ImageIcon } from 'lucide-react';
import { generateActivityContent, searchEducationalResources } from '../services/geminiService';

interface SmartAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (content: string) => void;
}

export const SmartAssistantContent: React.FC<{ onTransfer: (content: string) => void }> = ({ onTransfer }) => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'generate' | 'search'>('generate');
  const [type, setType] = useState<'text' | 'image' | 'table' | 'curve' | 'experiment'>('text');

  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleTransfer = (content: string) => {
    onTransfer(content);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const handleAction = async () => {
    if (!query) return;
    setIsGenerating(true);
    setResult(null);

    try {
      if (mode === 'generate') {
        const content = await generateActivityContent(query, type);
        setResult(content);
      } else {
        const content = await searchEducationalResources(query);
        setResult(content);
      }
    } catch (error) {
      setResult('عذرا، حدث خطأ أثناء المعالجة.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button 
          onClick={() => setMode('generate')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'generate' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
        >
          توليد محتوى
        </button>
        <button 
          onClick={() => setMode('search')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'search' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
        >
          بحث في الويب
        </button>
      </div>

      {mode === 'generate' && (
        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'text', icon: <Type className="w-4 h-4" />, label: 'نص' },
            { id: 'experiment', icon: <FlaskConical className="w-4 h-4" />, label: 'تجربة' },
            { id: 'table', icon: <TableIcon className="w-4 h-4" />, label: 'جدول' },
            { id: 'curve', icon: <Activity className="w-4 h-4" />, label: 'منحنى' },
            { id: 'image', icon: <ImageIcon className="w-4 h-4" />, label: 'رسم' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id as any)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${type === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              {t.icon}
              <span className="text-[10px] font-bold">{t.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500">
          {mode === 'generate' ? 'ماذا تريد أن أولد لك؟' : 'عن ماذا تريد أن أبحث؟'}
        </label>
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'generate' ? 'مثال: تجربة للكشف عن النشاء في الخبز...' : 'مثال: مواقع تعليمية لدروس السنة الرابعة متوسط...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 ring-primary/20 outline-none min-h-[100px] resize-none"
          />
          <button 
            onClick={handleAction}
            disabled={isGenerating || !query}
            className="absolute bottom-3 left-3 bg-primary text-white p-2 rounded-xl shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">النتيجة المولدة</span>
              <div className="flex items-center gap-3">
                {showCopySuccess && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] text-emerald-500 font-bold"
                  >
                    تم النسخ بنجاح!
                  </motion.span>
                )}
                <button 
                  onClick={() => handleTransfer(result)}
                  className="flex items-center gap-1.5 text-primary font-bold text-xs hover:underline"
                >
                  <Download className="w-3 h-3 rotate-180" /> نقل للمذكرة
                </button>
              </div>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
              {result}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const SmartAssistant: React.FC<SmartAssistantProps> = ({ isOpen, onClose, onTransfer }) => {
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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white p-2 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">المساعد الذكي</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">توليد الأنشطة والبحث التربوي</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <SmartAssistantContent onTransfer={onTransfer} />

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-medium">يعتمد المساعد على الذكاء الاصطناعي، يرجى مراجعة النتائج علميا.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
