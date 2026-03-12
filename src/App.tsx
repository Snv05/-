/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Library, 
  FileText, 
  Bot, 
  MessageSquare, 
  Info, 
  LogOut, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronLeft,
  Plus,
  Download,
  Printer,
  Save,
  Trash2,
  Image as ImageIcon,
  Type as TypeIcon,
  FlaskConical,
  Search,
  User as UserIcon,
  FileDown,
  Eye,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Bold,
  List,
  ListOrdered,
  AlignRight,
  AlignCenter,
  AlignLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { CURRICULUM_DATABASE, CurriculumLevel, Field, Section, LessonResource, Activity } from './data/database';
import { generateActivityContent, searchEducationalResources } from './services/geminiService';
import { SmartAssistant, SmartAssistantContent } from './components/SmartAssistant';
import { ResourceLibrary } from './components/ResourceLibrary';
import { DailyLogbook } from './components/DailyLogbook';
import { About } from './components/About';
import { Settings } from './components/Settings';
import { AnnualDistribution } from './components/AnnualDistribution';

// --- Types ---

type View = 'dashboard' | 'level-detail' | 'editor' | 'profile' | 'assistant' | 'daily-logbook' | 'about' | 'annual-distribution';

interface User {
  name: string;
  email: string;
  school: string;
  subject: string;
  bio: string;
  avatar?: string;
  directorate?: string;
  academicYear?: string;
  weeklyHours?: string;
  assignedClasses?: string[];
  levels?: string[];
}

interface Level {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  count: number;
}

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface LessonPlanType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// --- Constants ---

const LEVELS: Level[] = [
  { id: '1', title: '1 متوسط', subtitle: 'السنة الأولى متوسط', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', count: 11 },
  { id: '2', title: '2 متوسط', subtitle: 'السنة الثانية متوسط', color: 'bg-sky-50 text-sky-600 border-sky-100', count: 11 },
  { id: '3', title: '3 متوسط', subtitle: 'السنة الثالثة متوسط', color: 'bg-amber-50 text-amber-600 border-amber-100', count: 11 },
  { id: '4', title: '4 متوسط', subtitle: 'السنة الرابعة متوسط', color: 'bg-rose-50 text-rose-600 border-rose-100', count: 11 },
];

const QUICK_TOOLS: Tool[] = [
  { id: 'daily-logbook', title: 'الدفتر اليومي', description: 'سجل النشاطات التربوية اليومية', icon: <Calendar className="w-6 h-6" />, color: 'bg-rose-50 text-rose-600' },
  { id: 'annual-distribution', title: 'التوزيع السنوي', description: 'تخطيط المقاطع والموارد على مدار السنة', icon: <Calendar className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'saved', title: 'مذكراتي المحفوظة', description: 'عرض وإدارة المذكرات المحفوظة', icon: <Library className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'about', title: 'حول المنصة', description: 'أهداف المنصة، المكونات، ومعلومات التواصل', icon: <Info className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
  { id: 'settings', title: 'إعدادات الأستاذ', description: 'الملف الشخصي، الختم الرقمي، الخصوصية', icon: <LayoutDashboard className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
];

const LESSON_PLAN_TYPES: LessonPlanType[] = [
  { id: 'pedagogical', title: 'مذكرة بيداغوجية', description: 'مذكرة الدرس الأساسية (بداية الميدان/المقطع/المورد)', icon: <BookOpen className="w-8 h-8 text-sky-500" /> },
  { id: 'resource', title: 'مذكرة تعلم المورد', description: 'مذكرة تعلم المورد (الأهداف التعليمية)', icon: <BookOpen className="w-8 h-8 text-emerald-500" /> },
  { id: 'resource-no-activity', title: 'مذكرة تعلم المورد (بدون نشاط المتعلم)', description: 'مذكرة تعلم المورد بدون عمود نشاط المتعلم', icon: <BookOpen className="w-8 h-8 text-emerald-500" /> },
  { id: 'test', title: 'مذكرة الفرض المحروس', description: 'ورقة الفرض المحروس بالوضعيات والأسئلة', icon: <FileText className="w-8 h-8 text-sky-400" /> },
  { id: 'test-discussion', title: 'مذكرة مناقشة وتصويب الفرض', description: 'الإجابة النموذجية وسلم التنقيط وشبكة التقويم', icon: <FileText className="w-8 h-8 text-emerald-400" /> },
  { id: 'exam-discussion', title: 'مذكرة مناقشة وتصويب الاختبار', description: 'الإجابة النموذجية وسلم التنقيط وشبكة التقويم', icon: <FileText className="w-8 h-8 text-emerald-400" /> },
  { id: 'test-correction', title: 'مذكرة تصحيح الفرض', description: 'تصحيح نموذجي للفرض', icon: <FileText className="w-8 h-8 text-amber-400" /> },
];

// --- Components ---

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-primary/10 text-primary font-bold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <span className={active ? 'text-primary' : 'text-slate-400'}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const Header = ({ onToggleSidebar, isSidebarOpen }: { onToggleSidebar: () => void, isSidebarOpen: boolean }) => (
  <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
    <div className="flex items-center gap-4">
      <button 
        onClick={onToggleSidebar}
        className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      <div className="flex items-center gap-2 text-primary">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FlaskConical className="w-5 h-5" />
        </div>
        <span className="font-bold text-lg hidden sm:block">منصة العلوم الطبيعية</span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
        <Moon className="w-5 h-5" />
      </button>
      <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-xl text-slate-700 font-medium transition-colors">
        <LogOut className="w-4 h-4" />
        <span className="text-sm">دخول</span>
      </button>
    </div>
  </header>
);

const Sidebar = ({ isOpen, onClose, currentView, setView }: { isOpen: boolean, onClose: () => void, currentView: View, setView: (v: View) => void }) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </AnimatePresence>

    <aside className={`
      fixed top-0 bottom-0 right-0 w-72 bg-white border-l border-slate-100 z-50 transition-transform duration-300 transform
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      lg:translate-x-0 lg:static lg:z-0
    `}>
      <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary p-2 rounded-xl text-white">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-none">منصة العلوم</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1">التعليم المتوسط</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">القائمة الرئيسية</p>
            <div className="space-y-1">
              <SidebarItem 
                icon={<LayoutDashboard className="w-5 h-5" />} 
                label="لوحة التحكم" 
                active={currentView === 'dashboard'} 
                onClick={() => { setView('dashboard'); onClose(); }}
              />
              <SidebarItem icon={<BookOpen className="w-5 h-5" />} label="مذكراتي" />
              <SidebarItem 
                icon={<Calendar className="w-5 h-5" />} 
                label="التوزيع السنوي" 
                active={currentView === 'annual-distribution'}
                onClick={() => { setView('annual-distribution'); onClose(); }}
              />
              <SidebarItem 
                icon={<Library className="w-5 h-5" />} 
                label="مكتبة الملفات" 
                onClick={() => { setView('dashboard'); onClose(); }}
              />
              <SidebarItem 
                icon={<FileText className="w-5 h-5" />} 
                label="الدفتر اليومي" 
                active={currentView === 'daily-logbook'}
                onClick={() => { setView('daily-logbook'); onClose(); }}
              />
              <SidebarItem 
                icon={<Bot className="w-5 h-5" />} 
                label="المساعد الذكي" 
                onClick={() => { setView('assistant'); onClose(); }}
              />
              <SidebarItem icon={<MessageSquare className="w-5 h-5" />} label="دردشة الأساتذة" />
            </div>
          </div>

          <div>
            <div className="space-y-1">
              <SidebarItem 
                icon={<Info className="w-5 h-5" />} 
                label="حول المنصة" 
                active={currentView === 'about'}
                onClick={() => { setView('about'); onClose(); }}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-xs text-slate-500 mb-2">تحتاج مساعدة؟</p>
            <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
              تواصل معنا
            </button>
          </div>
        </div>
      </div>
    </aside>
  </>
);

// --- Main Views ---

const Dashboard = ({ onSelectLevel, onSelectProfile, onSelectTool }: { onSelectLevel: (level: Level) => void, onSelectProfile: () => void, onSelectTool: (id: string) => void }) => (
  <div className="space-y-10 pb-10">
    <section className="bg-gradient-to-l from-primary/10 to-transparent p-8 rounded-3xl border border-primary/5">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">أنشئ مذكراتك بسهولة</h1>
        <p className="text-slate-600 text-lg">قوالب جاهزة لجميع أنواع المذكرات - علوم طبيعية - التعليم المتوسط</p>
      </div>
    </section>

    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">اختر المستوى</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LEVELS.map((level) => (
          <motion.button
            key={level.id}
            whileHover={{ y: -5 }}
            onClick={() => onSelectLevel(level)}
            className={`card flex flex-col items-center text-center gap-4 ${level.color} border-2`}
          >
            <span className="text-3xl font-black">{level.title}</span>
            <div>
              <p className="font-bold text-slate-900">{level.subtitle}</p>
              <p className="text-xs opacity-70 mt-1 flex items-center justify-center gap-1">
                {level.count} أنواع مذكرات <ChevronLeft className="w-3 h-3" />
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-6">أدوات سريعة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {QUICK_TOOLS.map((tool) => (
          <div 
            key={tool.id} 
            className="card group cursor-pointer"
            onClick={() => onSelectTool(tool.id)}
          >
            <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{tool.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {[
        { label: 'مستويات', value: '4', icon: <FlaskConical className="w-5 h-5" /> },
        { label: 'أنواع مذكرات', value: '5', icon: <FileText className="w-5 h-5" /> },
        { label: 'قوالب جاهزة', value: '20', icon: <Library className="w-5 h-5" /> },
        { label: 'تحميل فوري', value: 'PDF', icon: <Download className="w-5 h-5" /> },
      ].map((stat, i) => (
        <div key={i} className="card flex flex-col items-center text-center gap-2 py-4">
          <div className="text-slate-400">{stat.icon}</div>
          <span className="text-2xl font-black text-slate-900">{stat.value}</span>
          <span className="text-xs text-slate-500">{stat.label}</span>
        </div>
      ))}
    </section>
  </div>
);

const LevelDetail = ({ level, onBack, onSelectType }: { level: Level, onBack: () => void, onSelectType: (type: LessonPlanType) => void }) => (
  <div className="space-y-8 pb-10">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
        <ChevronLeft className="w-6 h-6 rotate-180" />
      </button>
      <div>
        <h1 className="text-2xl font-black text-slate-900">{level.subtitle}</h1>
        <p className="text-slate-500 text-sm">علوم طبيعية - اختر نوع المذكرة لإنشائها</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {LESSON_PLAN_TYPES.map((type) => (
        <motion.button
          key={type.id}
          whileHover={{ x: -5 }}
          onClick={() => onSelectType(type)}
          className="card flex items-start gap-6 text-right group"
        >
          <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all">
            {type.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-lg mb-1">{type.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{type.description}</p>
            <span className="text-xs font-bold text-primary flex items-center gap-1">
              إنشاء المذكرة <ChevronLeft className="w-3 h-3" />
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  </div>
);

const Editor = ({ level, type, onBack, user }: { level: Level, type: LessonPlanType, onBack: () => void, user: User }) => {
  const isTest = type.id.includes('test') && !type.id.includes('correction') && !type.id.includes('discussion');
  const isCorrection = type.id.includes('correction') || type.id.includes('discussion');

  const levelData = CURRICULUM_DATABASE.find(l => l.id === level.id);
  
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedResource, setSelectedResource] = useState<LessonResource | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ stageIndex: number, col: 'teacher' | 'student' | 'note' } | null>(null);
  const [theme, setTheme] = useState<'classic' | 'modern' | 'minimal'>('classic');
  
  const printRef = useRef<HTMLDivElement>(null);
  const [lessonData, setLessonData] = useState({
    school: user.school,
    teacher: user.name,
    noteNumber: '01',
    directorate: user.directorate || '',
    competency: '',
    field: '',
    section: '',
    resource: '',
    learningResource: '',
    competencyComponent: '',
    evaluationCriteria: '',
    knowledgeResources: '',
    tools: '',
    references: '',
    totalTime: '',
    stages: [
      { title: 'ت. تشخيصي / و. تعلم', teacher: '', student: '', time: '', note: '' },
      { title: 'مرحلة التقصي', teacher: '', student: '', time: '', note: '' },
      { title: 'إرساء الموارد', teacher: '', student: '', time: '', note: '' },
      { title: 'تقويم الموارد', teacher: '', student: '', time: '', note: '' }
    ]
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `مذكرة_${lessonData.resource || 'درس'}`,
  });

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setSelectedSection(null);
    setSelectedResource(null);
    setLessonData({
      ...lessonData,
      field: field.title,
      section: '',
      competency: '',
      competencyComponent: '',
      evaluationCriteria: '',
      resource: '',
      learningResource: '',
      knowledgeResources: '',
      tools: '',
      references: ''
    });
  };

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    setSelectedResource(null);
    setLessonData({
      ...lessonData,
      section: section.title,
      competency: section.competency,
      competencyComponent: section.components.join('\n'),
      evaluationCriteria: section.criteria.join('\n'),
      resource: '',
      learningResource: '',
      knowledgeResources: '',
      tools: '',
      references: ''
    });
  };

  const handleResourceSelect = (resource: LessonResource) => {
    setSelectedResource(resource);
    setLessonData({
      ...lessonData,
      resource: resource.title,
      learningResource: '',
      knowledgeResources: resource.objectives.join('\n'),
      tools: resource.tools || '',
      references: resource.references || ''
    });
  };

  const handleTransfer = (content: string) => {
    if (activeCell) {
      const newStages = [...lessonData.stages];
      const currentContent = newStages[activeCell.stageIndex][activeCell.col];
      newStages[activeCell.stageIndex][activeCell.col] = currentContent ? `${currentContent}\n${content}` : content;
      setLessonData({ ...lessonData, stages: newStages });
      setIsLibraryOpen(false);
    }
  };

  const handleToolbarAction = (action: string) => {
    if (activeCell) {
      const newStages = [...lessonData.stages];
      let content = newStages[activeCell.stageIndex][activeCell.col];
      
      switch(action) {
        case 'bold': content = `**${content}**`; break;
        case 'bullet': content = `${content}\n• `; break;
        case 'number': content = `${content}\n1. `; break;
        case 'align-right': content = `[right]${content}[/right]`; break;
        case 'align-center': content = `[center]${content}[/center]`; break;
      }
      
      newStages[activeCell.stageIndex][activeCell.col] = content;
      setLessonData({ ...lessonData, stages: newStages });
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { 'المعلومة': 'المتوسطة', 'القيمة': lessonData.school },
      { 'المعلومة': 'الأستاذ', 'القيمة': lessonData.teacher },
      { 'المعلومة': 'المستوى', 'القيمة': level.title },
      { 'المعلومة': 'الكفاءة', 'القيمة': lessonData.competency },
      { 'المعلومة': 'المورد', 'القيمة': lessonData.resource },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "المذكرة");
    XLSX.writeFile(wb, `مذكرة_${lessonData.resource || 'export'}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    // Note: PDF generation with Arabic requires complex font embedding which is limited in this environment
    // We'll provide a basic export structure
    doc.text(`Lesson Plan: ${type.title}`, 10, 10);
    doc.text(`Level: ${level.title}`, 10, 20);
    doc.text(`Teacher: ${user.name}`, 10, 30);
    doc.save(`lesson_plan_${lessonData.resource || 'export'}.pdf`);
  };

  return (
    <div className="space-y-8 pb-20 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
            <ChevronLeft className="w-6 h-6 rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{type.title}</h1>
            <p className="text-slate-500 text-xs">{level.subtitle} - علوم طبيعية</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
          >
            <option value="classic">القالب الكلاسيكي</option>
            <option value="modern">القالب العصري</option>
            <option value="minimal">القالب البسيط</option>
          </select>
          <button onClick={() => setIsLibraryOpen(true)} className="btn-secondary text-xs py-2 bg-secondary/5 text-secondary border-secondary/20">
            <Library className="w-4 h-4" /> مكتبة الموارد
          </button>
          <button onClick={exportToExcel} className="btn-secondary text-xs py-2">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => handlePrint()} className="btn-primary text-xs py-2">
            <Printer className="w-4 h-4" /> معاينة وطباعة
          </button>
        </div>
      </div>

      <div className="card space-y-6">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Bot className="w-5 h-5" />
          <span className="font-bold">تعبئة تلقائية من المنهاج</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">الميدان</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/20 outline-none"
              onChange={(e) => {
                const field = levelData?.fields.find(f => f.id === e.target.value);
                if (field) handleFieldSelect(field);
              }}
            >
              <option value="">اختر الميدان</option>
              {levelData?.fields.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">المقطع التعليمي</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/20 outline-none"
              disabled={!selectedField}
              onChange={(e) => {
                const section = selectedField?.sections.find(s => s.id === e.target.value);
                if (section) handleSectionSelect(section);
              }}
            >
              <option value="">اختر المقطع</option>
              {selectedField?.sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">المورد التعليمي</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/20 outline-none"
              disabled={!selectedSection}
              onChange={(e) => {
                const resource = selectedSection?.resources.find(r => r.id === e.target.value);
                if (resource) handleResourceSelect(resource);
              }}
            >
              <option value="">اختر المورد</option>
              {selectedSection?.resources.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">تعلم المورد (اختياري)</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/20 outline-none"
              disabled={!selectedResource}
              onChange={(e) => {
                setLessonData({ ...lessonData, learningResource: e.target.value });
              }}
            >
              <option value="">اختر تعلم المورد</option>
              {selectedResource?.activities.map(a => <option key={a.id} value={a.title}>{a.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div ref={printRef} className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm print:shadow-none print:border-none ${
        theme === 'modern' ? 'font-sans' : theme === 'minimal' ? 'font-mono' : 'font-serif'
      }`}>
        <div className={`p-6 border-b border-slate-200 text-center ${
          theme === 'modern' ? 'bg-sky-50' : theme === 'minimal' ? 'bg-white' : 'bg-primary/5'
        }`}>
          <h2 className={`text-2xl font-black mb-1 ${
            theme === 'modern' ? 'text-sky-600' : theme === 'minimal' ? 'text-slate-900' : 'text-primary'
          }`}>{type.title} الرقمية</h2>
          <p className="text-slate-500 text-sm">مادة العلوم الطبيعية - {level.subtitle}</p>
        </div>

        <div className="p-0 overflow-x-auto">
          {activeCell && (
            <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <button onClick={() => handleToolbarAction('bold')} className="p-1.5 hover:bg-white rounded text-slate-600" title="عريض"><Bold className="w-4 h-4" /></button>
              <button onClick={() => handleToolbarAction('bullet')} className="p-1.5 hover:bg-white rounded text-slate-600" title="قائمة نقطية"><List className="w-4 h-4" /></button>
              <button onClick={() => handleToolbarAction('number')} className="p-1.5 hover:bg-white rounded text-slate-600" title="قائمة رقمية"><ListOrdered className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button onClick={() => handleToolbarAction('align-right')} className="p-1.5 hover:bg-white rounded text-slate-600" title="محاذاة لليمين"><AlignRight className="w-4 h-4" /></button>
              <button onClick={() => handleToolbarAction('align-center')} className="p-1.5 hover:bg-white rounded text-slate-600" title="توسيط"><AlignCenter className="w-4 h-4" /></button>
            </div>
          )}
          <table className={`w-full border-collapse text-[11px] ${
            theme === 'modern' ? 'border-sky-100' : theme === 'minimal' ? 'border-slate-100' : 'border-slate-200'
          }`}>
            <tbody>
              <tr>
                <td className={`border p-2 font-bold w-24 ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>المتوسطة:</td>
                <td className="border border-slate-200 p-2 w-1/4"><input type="text" value={lessonData.school} onChange={(e) => setLessonData({...lessonData, school: e.target.value})} className="w-full outline-none bg-transparent" /></td>
                <td className={`border p-2 font-bold w-24 ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>الأستاذ:</td>
                <td className="border border-slate-200 p-2 w-1/4"><input type="text" value={lessonData.teacher} onChange={(e) => setLessonData({...lessonData, teacher: e.target.value})} className="w-full outline-none bg-transparent" /></td>
                <td className={`border p-2 font-bold w-24 ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>المستوى:</td>
                <td className={`border p-2 w-24 text-center font-bold ${
                  theme === 'modern' ? 'text-sky-600 border-sky-100' : 'text-primary border-slate-200'
                }`}>{level.title}</td>
                <td className={`border p-2 font-bold w-24 ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>رقم المذكرة:</td>
                <td className="border border-slate-200 p-2 w-16 text-center font-bold"><input type="text" value={lessonData.noteNumber} onChange={(e) => setLessonData({...lessonData, noteNumber: e.target.value})} className="w-full outline-none bg-transparent text-center" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>مديرية التربية:</td>
                <td colSpan={7} className="border border-slate-200 p-2"><input type="text" value={lessonData.directorate} onChange={(e) => setLessonData({...lessonData, directorate: e.target.value})} placeholder="مديرية التربية" className="w-full outline-none bg-transparent" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-secondary border-slate-200'
                }`}>الكفاءة الختامية:</td>
                <td colSpan={7} className="border border-slate-200 p-2"><textarea value={lessonData.competency} onChange={(e) => setLessonData({...lessonData, competency: e.target.value})} className="w-full min-h-[40px] outline-none bg-transparent resize-none" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>الميدان:</td>
                <td colSpan={3} className="border border-slate-200 p-2"><input type="text" value={lessonData.field} onChange={(e) => setLessonData({...lessonData, field: e.target.value})} className="w-full outline-none bg-transparent" /></td>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>المقطع التعلمي:</td>
                <td colSpan={3} className="border border-slate-200 p-2"><input type="text" value={lessonData.section} onChange={(e) => setLessonData({...lessonData, section: e.target.value})} className="w-full outline-none bg-transparent" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>المورد التعلمي:</td>
                <td colSpan={3} className="border border-slate-200 p-2"><input type="text" value={lessonData.resource} onChange={(e) => setLessonData({...lessonData, resource: e.target.value})} className="w-full outline-none bg-transparent" /></td>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>تعلم المورد:</td>
                <td colSpan={3} className="border border-slate-200 p-2"><input type="text" value={lessonData.learningResource} onChange={(e) => setLessonData({...lessonData, learningResource: e.target.value})} className="w-full outline-none bg-transparent" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-secondary border-slate-200'
                }`}>مركبة الكفاءة:</td>
                <td colSpan={7} className="border border-slate-200 p-2"><textarea value={lessonData.competencyComponent} onChange={(e) => setLessonData({...lessonData, competencyComponent: e.target.value})} className="w-full min-h-[40px] outline-none bg-transparent resize-none" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-secondary border-slate-200'
                }`}>معايير التقويم:</td>
                <td colSpan={7} className="border border-slate-200 p-2"><textarea value={lessonData.evaluationCriteria} onChange={(e) => setLessonData({...lessonData, evaluationCriteria: e.target.value})} className="w-full min-h-[40px] outline-none bg-transparent resize-none" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>الموارد المعرفية:</td>
                <td colSpan={7} className="border border-slate-200 p-2"><textarea value={lessonData.knowledgeResources} onChange={(e) => setLessonData({...lessonData, knowledgeResources: e.target.value})} className="w-full min-h-[40px] outline-none bg-transparent resize-none" /></td>
              </tr>
              <tr>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>الوسائل:</td>
                <td className="border border-slate-200 p-2"><input type="text" value={lessonData.tools} onChange={(e) => setLessonData({...lessonData, tools: e.target.value})} className="w-full outline-none bg-transparent" /></td>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>المراجع:</td>
                <td colSpan={3} className="border border-slate-200 p-2"><input type="text" value={lessonData.references} onChange={(e) => setLessonData({...lessonData, references: e.target.value})} className="w-full outline-none bg-transparent" /></td>
                <td className={`border p-2 font-bold ${
                  theme === 'modern' ? 'bg-sky-50/50 text-sky-700 border-sky-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>الزمن الكلي:</td>
                <td className="border border-slate-200 p-2"><input type="text" value={lessonData.totalTime} onChange={(e) => setLessonData({...lessonData, totalTime: e.target.value})} className="w-full outline-none bg-transparent text-center" /></td>
              </tr>
              <tr className="bg-secondary/10">
                <td colSpan={8} className="border border-slate-200 p-2 text-center font-bold text-secondary text-sm">سير الحصة (الأنشطة)</td>
              </tr>
            </tbody>
          </table>

          <div className="p-0">
            {isTest ? (
              <div className="p-6 space-y-8">
                {[
                  { id: '1', title: 'الوضعية الأولى', points: '06' },
                  { id: '2', title: 'الوضعية الثانية (الوضعية الإدماجية)', points: '08' },
                ].map((pos) => (
                  <div key={pos.id} className="space-y-4 border border-slate-100 rounded-2xl p-6 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-primary flex items-center gap-2">
                        <span className="bg-primary text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">{pos.id}</span>
                        {pos.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">النقاط:</span>
                        <input type="text" defaultValue={pos.points} className="w-12 bg-white border border-slate-200 rounded-lg px-2 py-1 text-center text-xs font-bold outline-none" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">مركب الكفاءة:</label>
                        <textarea className="w-full min-h-[40px] bg-white border border-slate-100 rounded-xl p-3 text-xs outline-none resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">مؤشر التقويم:</label>
                        <textarea className="w-full min-h-[40px] bg-white border border-slate-100 rounded-xl p-3 text-xs outline-none resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">السندات:</label>
                        <textarea placeholder="نص، صور، وثائق..." className="w-full min-h-[40px] bg-white border border-slate-100 rounded-xl p-3 text-xs outline-none resize-none italic" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">نص الوضعية:</label>
                        <div className="relative">
                          <textarea className="w-full min-h-[100px] bg-white border border-slate-100 rounded-xl p-3 text-xs outline-none resize-none" />
                          <button className="absolute bottom-3 left-3 p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400">التعليمات / الأسئلة:</label>
                        <div className="space-y-2">
                          {[1, 2].map(q => (
                            <div key={q} className="flex gap-2">
                              <span className="text-xs font-bold text-slate-400 mt-2">-{q}</span>
                              <input type="text" className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs outline-none" />
                              <button className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/5 rounded-xl text-[10px] font-bold transition-colors">
                            <Plus className="w-3 h-3" /> إضافة سؤال
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <button className="btn-secondary text-[10px] py-2">
                    <Plus className="w-4 h-4" /> إضافة وضعية
                  </button>
                </div>
              </div>
            ) : isCorrection ? (
              <div className="p-6 space-y-10">
                <div className="space-y-4">
                  <h3 className="font-bold text-primary border-r-4 border-primary pr-3">عناصر الإجابة وسلم التنقيط</h3>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="border border-slate-200 p-2 text-primary w-24">الوضعيات</th>
                        <th className="border border-slate-200 p-2 text-primary">عناصر الإجابة</th>
                        <th colSpan={2} className="border border-slate-200 p-2 text-primary w-32">العلامة</th>
                      </tr>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-200 p-1"></th>
                        <th className="border border-slate-200 p-1"></th>
                        <th className="border border-slate-200 p-1 text-[10px]">مجزأة</th>
                        <th className="border border-slate-200 p-1 text-[10px]">المجموع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: '1', title: 'الوضعية الأولى', rows: 4 },
                        { id: '2', title: 'الوضعية الثانية', rows: 2 },
                        { id: '3', title: 'الوضعية الإدماجية', rows: 1 },
                      ].map((pos) => (
                        <React.Fragment key={pos.id}>
                          {Array.from({ length: pos.rows }).map((_, i) => (
                            <tr key={i}>
                              {i === 0 && (
                                <td rowSpan={pos.rows + 1} className="border border-slate-200 p-3 font-bold bg-slate-50 text-center relative">
                                  <div className="vertical-text">{pos.title}</div>
                                  <button className="absolute bottom-2 right-2 text-rose-400 hover:scale-110 transition-transform">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </td>
                              )}
                              <td className="border border-slate-200 p-3">
                                <div className="flex gap-2 items-start">
                                  <span className="text-[10px] font-bold text-slate-400 mt-1">{i + 1}</span>
                                  <textarea className="w-full min-h-[40px] outline-none resize-none bg-transparent" />
                                  <button className="p-1 text-slate-300 hover:text-primary">
                                    <ImageIcon className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="border border-slate-200 p-3 w-16"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                              {i === 0 && <td rowSpan={pos.rows + 1} className="border border-slate-200 p-3 w-16"><input type="text" className="w-full outline-none text-center bg-transparent font-bold" /></td>}
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={2} className="border border-slate-200 p-2 bg-slate-50/50 text-center">
                              <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1 w-full">
                                <Plus className="w-3 h-3" /> إضافة سطر
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-primary border-r-4 border-primary pr-3">الوضعية الإدماجية</h3>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="border border-slate-200 p-2 text-primary w-24">المعيار</th>
                        <th className="border border-slate-200 p-2 text-primary w-20">السؤال</th>
                        <th className="border border-slate-200 p-2 text-primary">المؤشرات</th>
                        <th className="border border-slate-200 p-2 text-primary w-20">العلامة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { title: 'الوجاهة', questions: ['س1', 'س2', 'س3'] },
                        { title: 'الاستعمال', questions: ['س1', 'س2', 'س3'] },
                        { title: 'الانسجام', questions: ['س1', 'س2', 'س3'] },
                        { title: 'الإتقان والتميز', questions: ['س1'], note: 'وضوح الخط، عدم التشطيب، تسلسل الإجابة، استعمال لغة عربية سليمة' },
                      ].map((criteria, i) => (
                        <React.Fragment key={i}>
                          {criteria.questions.map((q, j) => (
                            <tr key={j}>
                              {j === 0 && <td rowSpan={criteria.questions.length} className="border border-slate-200 p-3 font-bold bg-slate-50 text-center">{criteria.title}</td>}
                              <td className="border border-slate-200 p-3 text-center bg-slate-50/30">{q}</td>
                              <td className="border border-slate-200 p-3">
                                <textarea defaultValue={criteria.note || ''} className="w-full min-h-[40px] outline-none resize-none bg-transparent" />
                              </td>
                              <td className="border border-slate-200 p-3"><input type="text" className="w-full outline-none text-center bg-transparent" /></td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-3">
                    <button className="btn-secondary text-[10px] py-2">
                      <Plus className="w-4 h-4" /> إضافة معيار
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-0">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 p-2 text-secondary w-24">المراحل</th>
                      <th className="border border-slate-200 p-2 text-secondary">نشاط الأستاذ</th>
                      <th className="border border-slate-200 p-2 text-secondary">نشاط المتعلم</th>
                      <th className="border border-slate-200 p-2 text-secondary w-16">الزمن</th>
                      <th className="border border-slate-200 p-2 text-secondary w-24">ملاحظة</th>
                    </tr>
                  </thead>
                  <tbody>
                {lessonData.stages.map((stage, i) => (
                  <tr key={i}>
                    <td className="border border-slate-200 p-2 font-bold bg-slate-50 text-slate-700">{stage.title}</td>
                    <td className="border border-slate-200 p-2 relative group">
                      <textarea 
                        value={stage.teacher} 
                        onChange={(e) => {
                          const newStages = [...lessonData.stages];
                          newStages[i].teacher = e.target.value;
                          setLessonData({...lessonData, stages: newStages});
                        }}
                        className="w-full min-h-[100px] outline-none resize-none bg-transparent p-2" 
                      />
                      <button 
                        onClick={() => {
                          setActiveCell({ stageIndex: i, col: 'teacher' });
                          setIsLibraryOpen(true);
                        }}
                        className="absolute top-2 left-2 p-1 text-secondary opacity-40 hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-3 h-3 rotate-180" />
                      </button>
                    </td>
                    <td className="border border-slate-200 p-2 relative group">
                      <textarea 
                        value={stage.student} 
                        onChange={(e) => {
                          const newStages = [...lessonData.stages];
                          newStages[i].student = e.target.value;
                          setLessonData({...lessonData, stages: newStages});
                        }}
                        className="w-full min-h-[100px] outline-none resize-none bg-transparent p-2" 
                      />
                      <button 
                        onClick={() => {
                          setActiveCell({ stageIndex: i, col: 'student' });
                          setIsLibraryOpen(true);
                        }}
                        className="absolute top-2 left-2 p-1 text-secondary opacity-40 hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-3 h-3 rotate-180" />
                      </button>
                    </td>
                    <td className="border border-slate-200 p-2"><input type="text" value={stage.time} onChange={(e) => {
                      const newStages = [...lessonData.stages];
                      newStages[i].time = e.target.value;
                      setLessonData({...lessonData, stages: newStages});
                    }} className="w-full outline-none text-center bg-transparent" /></td>
                    <td className="border border-slate-200 p-2"><textarea value={stage.note} onChange={(e) => {
                      const newStages = [...lessonData.stages];
                      newStages[i].note = e.target.value;
                      setLessonData({...lessonData, stages: newStages});
                    }} className="w-full min-h-[100px] outline-none resize-none bg-transparent" /></td>
                  </tr>
                ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-t border-slate-100">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-colors">
                  <Plus className="w-4 h-4" /> إضافة مرحلة
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-colors">
                  <TypeIcon className="w-4 h-4" /> إضافة نص
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-colors">
                  <ImageIcon className="w-4 h-4" /> إضافة صورة
                </button>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-6 py-2 bg-secondary text-white rounded-xl text-[10px] font-bold hover:bg-secondary/90 transition-colors shadow-sm">
                  <Printer className="w-4 h-4" /> طباعة المذكرة الرقمية
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                  <Trash2 className="w-4 h-4" /> تفريغ المذكرة
                </button>
              </div>
            </div>

            <div className="p-6 flex items-center justify-end gap-10 border-t border-slate-100">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-400 mb-1 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="الختم الرقمي" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    "توقيع الأستاذ(ة)"
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500">توقيع الأستاذ(ة):</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-20 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-400 mb-1">ختم المفتش</div>
                <span className="text-[10px] font-bold text-slate-500">ختم وتوقيع السيد المفتش:</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResourceLibrary 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        onTransfer={handleTransfer}
        targetTitle={activeCell ? lessonData.stages[activeCell.stageIndex].title : ''}
      />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedType, setSelectedType] = useState<LessonPlanType | null>(null);
  const [user, setUser] = useState<User>({
    name: 'أستاذ(ة) العلوم الطبيعية',
    email: 'kamrobaghdad@gmail.com',
    school: 'متوسطة الشهيد بلمهدي الجودي',
    subject: 'علوم الطبيعة والحياة',
    bio: 'أستاذ تعليم متوسط متخصص في مادة علوم الطبيعة والحياة، مهتم بتطوير المناهج التعليمية واستخدام التكنولوجيا في التدريس.',
    directorate: 'مديرية التربية لولاية الجزائر غرب',
    academicYear: '2024/2025',
    weeklyHours: '18',
    assignedClasses: ['1م1', '1م2', '2م1', '3م1', '4م1'],
    levels: ['1 متوسط', '2 متوسط', '3 متوسط', '4 متوسط']
  });

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setView('level-detail');
  };

  const handleSelectType = (type: LessonPlanType) => {
    setSelectedType(type);
    setView('editor');
  };

  const handleBack = () => {
    if (view === 'editor') setView('level-detail');
    else if (view === 'level-detail') setView('dashboard');
    else if (view === 'profile') setView('dashboard');
    else if (view === 'daily-logbook') setView('dashboard');
    else if (view === 'annual-distribution') setView('dashboard');
    else if (view === 'assistant') setView('dashboard');
    else if (view === 'about') setView('dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans" dir="rtl">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={view}
        setView={setView}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Dashboard 
                  onSelectLevel={handleSelectLevel} 
                  onSelectProfile={() => setView('profile')} 
                  onSelectTool={(id) => {
                    if (id === 'daily-logbook') setView('daily-logbook');
                    if (id === 'annual-distribution') setView('annual-distribution');
                    if (id === 'about') setView('about');
                    if (id === 'settings') setView('profile');
                  }}
                />
              </motion.div>
            )}

            {view === 'level-detail' && selectedLevel && (
              <motion.div
                key="level-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <LevelDetail 
                  level={selectedLevel} 
                  onBack={handleBack} 
                  onSelectType={handleSelectType}
                />
              </motion.div>
            )}

            {view === 'editor' && selectedLevel && selectedType && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
              >
                <Editor 
                  level={selectedLevel} 
                  type={selectedType} 
                  onBack={handleBack} 
                  user={user}
                />
              </motion.div>
            )}

            {view === 'assistant' && (
              <motion.div
                key="assistant"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <div className="card h-full min-h-[600px] flex flex-col p-0 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-white p-2 rounded-xl">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">المساعد الذكي</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase">توليد الأنشطة والبحث التربوي المدعوم بالذكاء الاصطناعي</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <SmartAssistantContent onTransfer={(content) => {
                      navigator.clipboard.writeText(content);
                    }} />
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'daily-logbook' && (
              <motion.div
                key="daily-logbook"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DailyLogbook 
                  user={user} 
                  onBack={handleBack} 
                />
              </motion.div>
            )}

            {view === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <About onBack={handleBack} />
              </motion.div>
            )}

            {view === 'annual-distribution' && (
              <motion.div
                key="annual-distribution"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AnnualDistribution 
                  user={user} 
                  onBack={handleBack} 
                />
              </motion.div>
            )}

            {view === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Settings 
                  user={user} 
                  onSave={setUser} 
                  onBack={handleBack} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Search FAB */}
      <button className="fixed bottom-6 left-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center lg:hidden z-40 hover:scale-110 transition-transform active:scale-95">
        <Search className="w-6 h-6" />
      </button>
    </div>
  );
}
