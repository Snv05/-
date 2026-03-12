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
    level: '',
    field: '',
    section: '',
    resource: '',
    learningResource: ''
  });

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
      level: '1 متوسط', 
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
    if (autoFill.resource) {
      const newEntries = [...entries];
      // Find an empty row or use the first one
      const index = entries.findIndex(e => !e.subject) !== -1 ? entries.findIndex(e => !e.subject) : 0;
      newEntries[index].subject = autoFill.resource;
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
          <div className="flex items-center gap-2">
            <button onClick={() => setEntries(entries.map(e => ({ ...e, date: '', subject: '' })))} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500" title="إعادة تعيين">
              <Plus className="w-5 h-5 rotate-45" />
            </button>
            <button onClick={handlePrint} className="btn-primary text-xs py-2">
              <Printer className="w-4 h-4" /> طباعة الدفتر
            </button>
          </div>
        </div>

        {/* Auto-fill Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-bold">تعبئة تلقائية من المنهاج</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">الميدان</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                onChange={(e) => setAutoFill({ ...autoFill, field: e.target.value })}
              >
                <option value="">اختر الميدان</option>
                {CURRICULUM_DATABASE.flatMap(l => l.fields).map(f => (
                  <option key={f.id} value={f.title}>{f.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">المقطع التعليمي</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                onChange={(e) => setAutoFill({ ...autoFill, section: e.target.value })}
              >
                <option value="">اختر المقطع</option>
                {CURRICULUM_DATABASE.flatMap(l => l.fields)
                  .find(f => f.title === autoFill.field)?.sections.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">المورد التعليمي</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                onChange={(e) => setAutoFill({ ...autoFill, resource: e.target.value })}
              >
                <option value="">اختر المورد</option>
                {CURRICULUM_DATABASE.flatMap(l => l.fields)
                  .flatMap(f => f.sections)
                  .find(s => s.title === autoFill.section)?.resources.map(r => (
                    <option key={r.id} value={r.title}>{r.title}</option>
                  ))}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleAutoFill}
                disabled={!autoFill.resource}
                className="w-full bg-emerald-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                إدراج في السجل
              </button>
            </div>
          </div>
        </div>

        {/* Main Logbook Content */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 space-y-8 overflow-x-auto" ref={printRef}>
          {/* Printable Header */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">الموسم الدراسي:</span>
                <input 
                  type="text" 
                  value={headerData.academicYear} 
                  onChange={(e) => setHeaderData({...headerData, academicYear: e.target.value})}
                  className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">المؤسسة:</span>
                <input 
                  type="text" 
                  value={headerData.school} 
                  onChange={(e) => setHeaderData({...headerData, school: e.target.value})}
                  className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2 flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">مديرية التربية:</span>
                <input 
                  type="text" 
                  value={headerData.directorate} 
                  onChange={(e) => setHeaderData({...headerData, directorate: e.target.value})}
                  className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2 flex-1"
                />
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-end gap-2">
                <input 
                  type="text" 
                  value={headerData.teacher} 
                  onChange={(e) => setHeaderData({...headerData, teacher: e.target.value})}
                  className="border-b border-dashed border-slate-300 outline-none focus:border-primary px-2 text-left"
                />
                <span className="font-bold text-slate-700">:الأستاذ(ة)</span>
              </div>
            </div>
          </div>

          <div className="text-center py-8">
            <h1 className="text-4xl font-black text-primary border-y-4 border-primary py-4 inline-block px-12">الدفتر اليومي</h1>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border-2 border-primary">
            <thead>
              <tr className="bg-primary/5">
                <th className="border-2 border-primary p-3 text-primary font-bold w-32">التاريخ</th>
                <th className="border-2 border-primary p-3 text-primary font-bold w-48">التوقيت</th>
                <th className="border-2 border-primary p-3 text-primary font-bold w-32">القسم</th>
                <th className="border-2 border-primary p-3 text-primary font-bold">سير الحصة والنشاطات (المادة الموضوع)</th>
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
                  <td className="border-2 border-primary p-2">
                    <textarea 
                      value={entry.subject}
                      onChange={(e) => updateEntry(entry.id, 'subject', e.target.value)}
                      placeholder="المادة / الموضوع / النشاط"
                      className="w-full min-h-[60px] outline-none bg-transparent text-sm resize-none"
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
