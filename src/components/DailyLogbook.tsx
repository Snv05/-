import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Sparkles,
  ChevronDown,
  Calendar,
  Clock,
  Users,
  BookOpen
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { CURRICULUM_DATABASE, Field, Section, LessonResource } from '../data/database';

interface DailyLogbookProps {
  user: {
    name: string;
    school: string;
    directorate?: string;
    academicYear?: string;
    avatar?: string;
    assignedClasses?: string[];
    levels?: string[];
  };
  onBack: () => void;
}

interface LogEntry {
  id: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  level: string;
  class: string;
  subject: string;
}

export const DailyLogbook: React.FC<DailyLogbookProps> = ({ user, onBack }) => {
  const [entries, setEntries] = useState<LogEntry[]>([
    { id: '1', date: '', timeFrom: '', timeTo: '', level: '1 متوسط', class: '1م1', subject: '' },
    { id: '2', date: '', timeFrom: '', timeTo: '', level: '1 متوسط', class: '1م1', subject: '' },
    { id: '3', date: '', timeFrom: '', timeTo: '', level: '1 متوسط', class: '1م1', subject: '' },
    { id: '4', date: '', timeFrom: '', timeTo: '', level: '1 متوسط', class: '1م1', subject: '' },
  ]);

  const [headerData, setHeaderData] = useState({
    academicYear: user.academicYear || '2024/2025',
    directorate: user.directorate || '',
    school: user.school,
    teacher: user.name
  });

  const [autoFill, setAutoFill] = useState({
    levelId: '',
    fieldId: '',
    sectionId: '',
    resourceId: '',
    activityId: '',
    includeField: false,
    includeSection: true,
    includeResource: true,
    includeActivity: false
  });

  const selectedLevel = CURRICULUM_DATABASE.find(l => l.id === autoFill.levelId);
  const selectedField = selectedLevel?.fields.find(f => f.id === autoFill.fieldId);
  const selectedSection = selectedField?.sections.find(s => s.id === autoFill.sectionId);
  const selectedResource = selectedSection?.resources.find(r => r.id === autoFill.resourceId);

  const [decoration, setDecoration] = useState<'none' | 'classic' | 'islamic' | 'floral' | 'modern'>('none');
  const [viewMode, setViewMode] = useState<'logbook' | 'cover'>('logbook');

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `الدفتر_اليومي_${new Date().toLocaleDateString('ar-DZ')}`,
  });

  const addRow = () => {
    setEntries([...entries, { 
      id: Math.random().toString(36).substr(2, 9), 
      date: '', 
      timeFrom: '', 
      timeTo: '', 
      level: autoFill.levelId ? (selectedLevel?.title || '1 متوسط') : '1 متوسط', 
      class: '1م1', 
      subject: '' 
    }]);
  };

  const removeRow = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof LogEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleAutoFill = () => {
    let subjectParts = [];
    if (autoFill.includeField && selectedField) subjectParts.push(`الميدان: ${selectedField.title}`);
    if (autoFill.includeSection && selectedSection) subjectParts.push(`المقطع: ${selectedSection.title}`);
    if (autoFill.includeResource && selectedResource) subjectParts.push(`المورد: ${selectedResource.title}`);
    if (autoFill.includeActivity && autoFill.activityId) {
      const activity = selectedResource?.activities.find(a => a.id === autoFill.activityId);
      if (activity) subjectParts.push(`النشاط: ${activity.title}`);
    }

    const subjectText = subjectParts.join('\n');

    if (subjectText) {
      const newEntries = [...entries];
      // Find an empty row or use the first one
      const index = entries.findIndex(e => !e.subject) !== -1 ? entries.findIndex(e => !e.subject) : 0;
      newEntries[index].subject = subjectText;
      if (selectedLevel) {
        newEntries[index].level = selectedLevel.title;
      }
      setEntries(newEntries);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
              <X className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">الدفتر اليومي الرقمي</h1>
              <p className="text-slate-500 text-xs">سجل النشاطات التربوية اليومية</p>
            </div>
          </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs font-bold text-slate-500">العرض:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('logbook')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'logbook' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                >
                  السجل
                </button>
                <button 
                  onClick={() => setViewMode('cover')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'cover' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                >
                  الواجهة
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs font-bold text-slate-500">الزخرفة:</span>
              <select 
                value={decoration}
                onChange={(e) => setDecoration(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
              >
                <option value="none">بدون زخرفة</option>
                <option value="classic">كلاسيكية</option>
                <option value="islamic">إسلامية</option>
                <option value="floral">نباتية</option>
                <option value="modern">عصرية</option>
              </select>
            </div>
            <button onClick={() => setEntries(entries.map(e => ({ ...e, date: '', subject: '' })))} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500" title="إعادة تعيين">
              <Plus className="w-5 h-5 rotate-45" />
            </button>
            <button onClick={handlePrint} className="btn-primary text-xs py-2">
              <Printer className="w-4 h-4" /> طباعة الدفتر
            </button>
        </div>

        {/* Auto-fill Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-bold">تعبئة تلقائية من المنهاج</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 ml-2">تضمين في السجل:</span>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="checkbox" checked={autoFill.includeField} onChange={e => setAutoFill({...autoFill, includeField: e.target.checked})} className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">الميدان</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="checkbox" checked={autoFill.includeSection} onChange={e => setAutoFill({...autoFill, includeSection: e.target.checked})} className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">المقطع</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="checkbox" checked={autoFill.includeResource} onChange={e => setAutoFill({...autoFill, includeResource: e.target.checked})} className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">المورد</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="checkbox" checked={autoFill.includeActivity} onChange={e => setAutoFill({...autoFill, includeActivity: e.target.checked})} className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">النشاط</span>
                </label>
              </div>
              <button 
                onClick={() => setAutoFill({
                  levelId: '', fieldId: '', sectionId: '', resourceId: '', activityId: '',
                  includeField: false, includeSection: true, includeResource: true, includeActivity: false
                })}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
                title="إعادة تعيين الاختيارات"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">السنة</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                value={autoFill.levelId}
                onChange={(e) => setAutoFill({ ...autoFill, levelId: e.target.value, fieldId: '', sectionId: '', resourceId: '', activityId: '' })}
              >
                <option value="">اختر السنة</option>
                {CURRICULUM_DATABASE.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">الميدان</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                disabled={!autoFill.levelId}
                value={autoFill.fieldId}
                onChange={(e) => setAutoFill({ ...autoFill, fieldId: e.target.value, sectionId: '', resourceId: '', activityId: '' })}
              >
                <option value="">اختر الميدان</option>
                {selectedLevel?.fields.map(f => (
                  <option key={f.id} value={f.id}>{f.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">المقطع التعليمي</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                disabled={!autoFill.fieldId}
                value={autoFill.sectionId}
                onChange={(e) => setAutoFill({ ...autoFill, sectionId: e.target.value, resourceId: '', activityId: '' })}
              >
                <option value="">اختر المقطع</option>
                {selectedField?.sections.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">المورد التعليمي</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                disabled={!autoFill.sectionId}
                value={autoFill.resourceId}
                onChange={(e) => setAutoFill({ ...autoFill, resourceId: e.target.value, activityId: '' })}
              >
                <option value="">اختر المورد</option>
                {selectedSection?.resources.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">تعلم المورد</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                disabled={!autoFill.resourceId}
                value={autoFill.activityId}
                onChange={(e) => setAutoFill({ ...autoFill, activityId: e.target.value })}
              >
                <option value="">اختر النشاط</option>
                {selectedResource?.activities.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleAutoFill}
              disabled={!autoFill.resourceId}
              className="px-8 bg-emerald-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> إدراج في السجل
            </button>
          </div>
        </div>

        {/* Main Logbook Content */}
        <div className={`bg-white p-12 rounded-3xl shadow-lg border border-slate-100 space-y-8 overflow-x-auto relative min-h-[800px] flex flex-col ${
          decoration === 'classic' ? 'border-[16px] border-double border-primary/20' : ''
        }`} ref={printRef}>
          
          {/* Decorations */}
          {decoration === 'islamic' && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                  <path d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z" />
                  <path d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                  <path d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z" />
                  <path d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none -rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                  <path d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z" />
                  <path d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none rotate-180">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                  <path d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z" />
                  <path d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </>
          )}

          {decoration === 'floral' && (
            <>
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald-600">
                  <path d="M100 0 Q80 0 70 20 Q60 40 80 50 Q100 60 100 100 L100 0 Z" />
                  <circle cx="85" cy="15" r="5" />
                  <circle cx="75" cy="35" r="3" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-40 h-40 opacity-10 pointer-events-none rotate-180">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald-600">
                  <path d="M100 0 Q80 0 70 20 Q60 40 80 50 Q100 60 100 100 L100 0 Z" />
                </svg>
              </div>
            </>
          )}

          {decoration === 'modern' && (
            <>
              <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-primary to-transparent opacity-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-transparent opacity-20 pointer-events-none" />
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-transparent opacity-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-2 h-full bg-gradient-to-t from-secondary to-transparent opacity-20 pointer-events-none" />
            </>
          )}

          {/* Content based on viewMode */}
          {viewMode === 'cover' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 py-20">
              <div className="space-y-4">
                <p className="text-xl font-bold text-slate-500 uppercase tracking-[0.2em]">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                <p className="text-lg font-bold text-slate-600">وزارة التربية الوطنية</p>
              </div>

              <div className="w-full max-w-3xl border-y-2 border-primary/20 py-12 space-y-6">
                <h1 className={`text-7xl font-black ${
                  decoration === 'islamic' ? 'text-primary' : 
                  decoration === 'floral' ? 'text-emerald-700' : 
                  'text-slate-900'
                }`}>دفتر الأستاذ اليومي</h1>
                <p className="text-2xl font-bold text-slate-500">مادة علوم الطبيعة والحياة</p>
              </div>

              <div className="grid grid-cols-1 gap-8 text-right w-full max-w-xl bg-slate-50/50 p-10 rounded-3xl border border-slate-100">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <span className="text-xl font-bold text-slate-400">الأستاذ(ة):</span>
                  <span className="text-2xl font-black text-slate-900">{headerData.teacher}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <span className="text-xl font-bold text-slate-400">المؤسسة:</span>
                  <span className="text-2xl font-black text-slate-900">{headerData.school}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <span className="text-xl font-bold text-slate-400">الموسم الدراسي:</span>
                  <span className="text-2xl font-black text-slate-900">{headerData.academicYear}</span>
                </div>
              </div>

              <div className="pt-20">
                {decoration === 'islamic' && (
                  <div className="w-24 h-24 mx-auto opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                      <path d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Printable Header */}
              <div className="flex flex-col gap-4 text-sm border-b-2 border-primary/20 pb-6">
                <div className="grid grid-cols-1 gap-3 max-w-2xl">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700 min-w-[120px] text-sm">الموسم الدراسي:</span>
                    <input 
                      type="text" 
                      value={headerData.academicYear} 
                      onChange={(e) => setHeaderData({...headerData, academicYear: e.target.value})}
                      className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2 flex-1 py-1"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700 min-w-[120px] text-sm">المؤسسة:</span>
                    <input 
                      type="text" 
                      value={headerData.school} 
                      onChange={(e) => setHeaderData({...headerData, school: e.target.value})}
                      className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2 flex-1 py-1"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700 min-w-[120px] text-sm">مديرية التربية:</span>
                    <input 
                      type="text" 
                      value={headerData.directorate} 
                      onChange={(e) => setHeaderData({...headerData, directorate: e.target.value})}
                      className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2 flex-1 py-1"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700 min-w-[120px] text-sm">الأستاذ(ة):</span>
                    <input 
                      type="text" 
                      value={headerData.teacher} 
                      onChange={(e) => setHeaderData({...headerData, teacher: e.target.value})}
                      className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2 flex-1 py-1"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center py-12 relative">
                {decoration === 'islamic' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-64 h-64 fill-primary">
                      <path d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z" />
                    </svg>
                  </div>
                )}
                <h1 className={`text-5xl font-black py-6 inline-block px-16 relative ${
                  decoration === 'islamic' ? 'text-primary' : 
                  decoration === 'floral' ? 'text-emerald-700' :
                  decoration === 'modern' ? 'text-slate-900' : 'text-primary'
                }`}>
                  {decoration === 'islamic' && <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-3xl">✦</span>}
                  الدفتر اليومي
                  {decoration === 'islamic' && <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-3xl">✦</span>}
                  
                  {/* Decorative lines */}
                  <div className={`absolute bottom-0 left-0 w-full h-1.5 rounded-full ${
                    decoration === 'modern' ? 'bg-gradient-to-r from-primary via-secondary to-primary' : 'bg-current'
                  }`} />
                  <div className={`absolute top-0 left-1/4 w-1/2 h-0.5 rounded-full opacity-50 ${
                    decoration === 'modern' ? 'bg-gradient-to-r from-transparent via-primary to-transparent' : 'bg-current'
                  }`} />
                </h1>
              </div>

              {/* Table */}
              <table className="w-full border-collapse border-2 border-primary">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="border-2 border-primary p-3 text-primary font-bold w-32 min-w-[120px]">التاريخ</th>
                    <th className="border-2 border-primary p-3 text-primary font-bold w-48 min-w-[180px]">التوقيت</th>
                    <th className="border-2 border-primary p-3 text-primary font-bold w-32 min-w-[120px]">القسم</th>
                    <th className="border-2 border-primary p-3 text-primary font-bold min-w-[300px]">سير الحصة والنشاطات (المادة الموضوع)</th>
                    <th className="border-2 border-primary p-3 text-primary font-bold w-12 print:hidden"></th>
                  </tr>
                  <tr className="bg-slate-50">
                    <th className="border-2 border-primary p-1 text-[10px] text-slate-400">اليوم/التاريخ</th>
                    <th className="border-2 border-primary p-0">
                      <div className="grid grid-cols-2 divide-x divide-x-reverse divide-primary">
                        <span className="p-1 text-[10px] text-slate-400">من</span>
                        <span className="p-1 text-[10px] text-slate-400">إلى</span>
                      </div>
                    </th>
                    <th className="border-2 border-primary p-1 text-[10px] text-slate-400">المستوى/الفوج</th>
                    <th className="border-2 border-primary p-1 text-[10px] text-slate-400">المادة / الموضوع / النشاط</th>
                    <th className="border-2 border-primary p-1 print:hidden"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr key={entry.id} className="group">
                      <td className="border-2 border-primary p-2">
                        <input 
                          type="text" 
                          value={entry.date}
                          onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                          placeholder="السبت 12 مارس"
                          className="w-full outline-none bg-transparent text-center text-sm"
                        />
                      </td>
                      <td className="border-2 border-primary p-0">
                        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-primary h-full">
                          <input 
                            type="text" 
                            value={entry.timeFrom}
                            onChange={(e) => updateEntry(entry.id, 'timeFrom', e.target.value)}
                            placeholder="08:00"
                            className="w-full p-2 outline-none bg-transparent text-center text-sm"
                          />
                          <input 
                            type="text" 
                            value={entry.timeTo}
                            onChange={(e) => updateEntry(entry.id, 'timeTo', e.target.value)}
                            placeholder="09:00"
                            className="w-full p-2 outline-none bg-transparent text-center text-sm"
                          />
                        </div>
                      </td>
                      <td className="border-2 border-primary p-2">
                        <div className="flex flex-col gap-1">
                          <select 
                            value={entry.level}
                            onChange={(e) => updateEntry(entry.id, 'level', e.target.value)}
                            className="w-full outline-none bg-transparent text-center text-xs font-bold"
                          >
                            {user.levels && user.levels.length > 0 ? (
                              user.levels.map(l => <option key={l} value={l}>{l}</option>)
                            ) : (
                              <>
                                <option value="1 متوسط">1 متوسط</option>
                                <option value="2 متوسط">2 متوسط</option>
                                <option value="3 متوسط">3 متوسط</option>
                                <option value="4 متوسط">4 متوسط</option>
                              </>
                            )}
                          </select>
                          <select 
                            value={entry.class}
                            onChange={(e) => updateEntry(entry.id, 'class', e.target.value)}
                            className="w-full outline-none bg-transparent text-center text-xs"
                          >
                            {user.assignedClasses && user.assignedClasses.length > 0 ? (
                              user.assignedClasses.map(c => <option key={c} value={c}>{c}</option>)
                            ) : (
                              <option value="1م1">1م1</option>
                            )}
                          </select>
                        </div>
                      </td>
                      <td className="border-2 border-primary p-2 align-top">
                        <textarea 
                          value={entry.subject}
                          onChange={(e) => {
                            updateEntry(entry.id, 'subject', e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          placeholder="المادة / الموضوع / النشاط"
                          className="w-full min-h-[80px] outline-none bg-transparent text-sm resize-none overflow-hidden leading-relaxed"
                          onFocus={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                        />
                      </td>
                      <td className="border-2 border-primary p-2 text-center print:hidden">
                        <button 
                          onClick={() => removeRow(entry.id)}
                          className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <button 
            onClick={addRow}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 print:hidden"
          >
            <Plus className="w-5 h-5" /> إضافة صف جديد
          </button>

          {/* Footer Signatures */}
          <div className="grid grid-cols-3 gap-8 pt-12">
            <div className="space-y-4 text-center">
              <p className="font-bold text-slate-700">إمضاء الأستاذ(ة)</p>
              <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-xs overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="الختم الرقمي" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  "مساحة التوقيع"
                )}
              </div>
            </div>
            <div className="space-y-4 text-center">
              <p className="font-bold text-slate-700">ختم وإمضاء السيد المدير</p>
              <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-xs">
                مساحة الختم
              </div>
            </div>
            <div className="space-y-4 text-center">
              <p className="font-bold text-slate-700">ختم وإمضاء السيد المفتش</p>
              <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-xs">
                مساحة الختم
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
