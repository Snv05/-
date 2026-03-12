import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Palette, 
  Printer, 
  Database, 
  Settings as SettingsIcon, 
  Info, 
  Camera, 
  Upload, 
  Trash2, 
  Shield, 
  Save, 
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  Stamp,
  Download,
  Plus,
  X
} from 'lucide-react';

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

interface SettingsProps {
  user: User;
  onSave: (user: User) => void;
  onBack: () => void;
}

type Tab = 'profile' | 'appearance' | 'printing' | 'data' | 'advanced' | 'about';

export const Settings: React.FC<SettingsProps> = ({ user, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editedUser, setEditedUser] = useState<User>(user);
  const [sealConfig, setSealConfig] = useState({
    shape: 'circle' as 'circle' | 'rect' | 'square',
    color: '#1e293b',
    upperText: 'الجمهورية الجزائرية الديمقراطية الشعبية',
    badge: 'standard'
  });
  const [isAutoDelete, setIsAutoDelete] = useState(false);
  const [newClass, setNewClass] = useState('');

  const handleSave = () => {
    onSave(editedUser);
  };

  const handleReset = () => {
    setEditedUser(user);
  };

  const addClass = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newClass.trim()) {
      const classes = editedUser.assignedClasses || [];
      if (!classes.includes(newClass.trim())) {
        setEditedUser({ ...editedUser, assignedClasses: [...classes, newClass.trim()] });
      }
      setNewClass('');
    }
  };

  const removeClass = (cls: string) => {
    setEditedUser({
      ...editedUser,
      assignedClasses: (editedUser.assignedClasses || []).filter(c => c !== cls)
    });
  };

  const toggleLevel = (level: string) => {
    const levels = editedUser.levels || [];
    if (levels.includes(level)) {
      setEditedUser({ ...editedUser, levels: levels.filter(l => l !== level) });
    } else {
      setEditedUser({ ...editedUser, levels: [...levels, level] });
    }
  };

  const tabs = [
    { id: 'profile', label: 'الملف', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'appearance', label: 'المظهر', icon: <Palette className="w-4 h-4" /> },
    { id: 'printing', label: 'طباعة', icon: <Printer className="w-4 h-4" /> },
    { id: 'data', label: 'بيانات', icon: <Database className="w-4 h-4" /> },
    { id: 'advanced', label: 'متقدم', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'about', label: 'حول', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <button onClick={onBack} className="hover:text-primary transition-colors">الرئيسية</button>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-slate-600">إعدادات المعلم</span>
        </div>

        {/* Notice */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center gap-4 text-sky-700">
          <div className="bg-sky-100 p-2 rounded-full">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">ملاحظة: التسجيل في المنصة اختياري، يمكنك استخدام الأدوات الأساسية بدون حساب.</p>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">إعدادات الملف الشخصي</h1>
          <p className="text-slate-500">تعديل معلوماتك المهنية وتخصيص تفضيلات الخصوصية الخاصة بك.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Profile Image */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 text-center md:text-right">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">الصورة الشخصية</h3>
                  </div>
                  <p className="text-xs text-slate-500">تظهر في شريط التنقل وبجانب اسمك</p>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 text-slate-300 text-4xl font-black relative group overflow-hidden">
                    {editedUser.avatar ? (
                      <img src={editedUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      '؟'
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                      <Upload className="w-4 h-4" /> رفع صورة
                    </button>
                    <p className="text-[10px] text-slate-400">PNG أو JPG، حجم أقصى 2 ميغا</p>
                  </div>
                </div>
              </div>

              {/* Professional Data */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">بيانات الأستاذ المهنية</h3>
                    <p className="text-xs text-slate-500">تُنقل تلقائياً إلى جميع المذكرات والتوازيع</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">الاسم واللقب</label>
                    <input 
                      type="text" 
                      placeholder="مثال: أحمد بن علي"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">اسم المؤسسة التعليمية</label>
                    <input 
                      type="text" 
                      placeholder="اسم المتوسطة"
                      value={editedUser.school}
                      onChange={(e) => setEditedUser({ ...editedUser, school: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">مديرية التربية</label>
                    <input 
                      type="text" 
                      placeholder="مديرية التربية"
                      value={editedUser.directorate}
                      onChange={(e) => setEditedUser({ ...editedUser, directorate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">السنة الدراسية</label>
                    <select 
                      value={editedUser.academicYear}
                      onChange={(e) => setEditedUser({ ...editedUser, academicYear: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                    >
                      <option value="">اختر السنة الدراسية</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2025/2026">2025/2026</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">الحجم الساعي الأسبوعي</label>
                    <input 
                      type="text" 
                      placeholder="مثال: 18 ساعة"
                      value={editedUser.weeklyHours}
                      onChange={(e) => setEditedUser({ ...editedUser, weeklyHours: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">الأقسام المسندة</label>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="اكتب اسم القسم ثم اضغط Enter"
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        onKeyDown={addClass}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                      />
                      <div className="flex flex-wrap gap-2">
                        {(editedUser.assignedClasses || []).map((cls) => (
                          <span key={cls} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                            {cls}
                            <button onClick={() => removeClass(cls)} className="hover:text-rose-500">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400">اضغط Enter لإضافة قسم جديد</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500">المستويات التعليمية</label>
                  <div className="flex flex-wrap gap-4">
                    {['1 متوسط', '2 متوسط', '3 متوسط', '4 متوسط'].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer group">
                        <div 
                          onClick={() => toggleLevel(level)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            (editedUser.levels || []).includes(level)
                              ? 'bg-primary border-primary text-white'
                              : 'border-slate-200 group-hover:border-primary/50'
                          }`}
                        >
                          {(editedUser.levels || []).includes(level) && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="text-sm font-bold text-slate-600">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seal Generator */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                      <Stamp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">مولد الختم الرقمي للأستاذ</h3>
                      <p className="text-xs text-slate-500">أداة احترافية لإنشاء ختم رقمي يظهر في مذكراتك عند الطباعة</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    نشط
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500">شكل الختم</label>
                      <div className="flex gap-2">
                        {['دائري', 'مستطيل', 'مربع'].map((shape, i) => (
                          <button 
                            key={i}
                            onClick={() => setSealConfig({ ...sealConfig, shape: i === 0 ? 'circle' : i === 1 ? 'rect' : 'square' })}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                              (i === 0 && sealConfig.shape === 'circle') || (i === 1 && sealConfig.shape === 'rect') || (i === 2 && sealConfig.shape === 'square')
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'
                            }`}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500">لون الختم</label>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          {['#1e293b', '#334155', '#581c87', '#7f1d1d', '#065f46', '#1e40af', '#1e3a8a'].map((color) => (
                            <button 
                              key={color}
                              onClick={() => setSealConfig({ ...sealConfig, color })}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                sealConfig.color === color ? 'border-primary scale-110 shadow-md' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>مخصص:</span>
                          <input 
                            type="color" 
                            value={sealConfig.color}
                            onChange={(e) => setSealConfig({ ...sealConfig, color: e.target.value })}
                            className="w-8 h-8 rounded border-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">النص العلوي (القوس)</label>
                      <input 
                        type="text" 
                        value={sealConfig.upperText}
                        onChange={(e) => setSealConfig({ ...sealConfig, upperText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">شارة التوثيق</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20"
                      >
                        <option value="standard">بدون شارة</option>
                        <option value="verified">شارة موثقة</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-6">
                    <p className="text-xs font-bold text-slate-400">معاينة مباشرة</p>
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      {/* Seal Preview SVG */}
                      <svg width="240" height="240" viewBox="0 0 240 240">
                        <circle cx="120" cy="120" r="110" fill="none" stroke={sealConfig.color} strokeWidth="2" />
                        <circle cx="120" cy="120" r="105" fill="none" stroke={sealConfig.color} strokeWidth="1" />
                        
                        <path id="curve" d="M 30,120 A 90,90 0 0,1 210,120" fill="none" />
                        <text fill={sealConfig.color} fontSize="10" fontWeight="bold">
                          <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                            {sealConfig.upperText}
                          </textPath>
                        </text>

                        <text x="120" y="100" fill={sealConfig.color} fontSize="8" textAnchor="middle" fontWeight="bold">مديرية التربية</text>
                        <line x1="80" y1="110" x2="160" y2="110" stroke={sealConfig.color} strokeWidth="1" />
                        <text x="120" y="130" fill={sealConfig.color} fontSize="12" textAnchor="middle" fontWeight="black">أستاذ مادة</text>
                        <text x="120" y="150" fill={sealConfig.color} fontSize="12" textAnchor="middle" fontWeight="black">علوم الطبيعة والحياة</text>
                        <line x1="80" y1="160" x2="160" y2="160" stroke={sealConfig.color} strokeWidth="1" />
                        <text x="120" y="175" fill={sealConfig.color} fontSize="8" textAnchor="middle">اسم المتوسطة</text>
                        <text x="120" y="190" fill={sealConfig.color} fontSize="10" textAnchor="middle" fontWeight="bold">{editedUser.name}</text>
                        
                        <circle cx="120" cy="210" r="15" fill="none" stroke={sealConfig.color} strokeWidth="1" />
                        <text x="120" y="214" fill={sealConfig.color} fontSize="8" textAnchor="middle" fontWeight="bold">2026</text>
                      </svg>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                      <Download className="w-4 h-4" /> تحميل الختم (SVG)
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Privacy */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">خصوصية البيانات</h3>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">الحذف التلقائي للبيانات</h4>
                    <p className="text-xs text-slate-500">حذف كافة البيانات المؤقتة تلقائياً بعد تسجيل الخروج أو تحميل المذكرات</p>
                  </div>
                  <button 
                    onClick={() => setIsAutoDelete(!isAutoDelete)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isAutoDelete ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoDelete ? 'right-7' : 'right-1'}`} />
                  </button>
                </div>

                <button className="w-full py-4 border border-rose-200 rounded-2xl text-rose-500 font-bold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> مسح كافة البيانات المحفوظة
                </button>
              </div>

              {/* Sync Notice */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between text-emerald-700">
                <p className="text-xs font-medium">يتم مزامنة بياناتك تلقائياً مع جميع مخططات الدروس والتوازيع السنوية التي تقوم بإنشائها أو تعديلها على المنصة.</p>
                <RotateCcw className="w-4 h-4 opacity-50" />
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> تسجيل الدخول للحفظ
                </button>
                <button 
                  onClick={handleReset}
                  className="px-8 bg-white border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> إعادة تعيين
                </button>
              </div>

              {/* Security and Account */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">الأمان والحساب</h3>
                </div>
                <p className="text-sm text-slate-500">سجل الدخول لإدارة حسابك</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-400">🔒 بياناتك محفوظة بأمان • تُحفظ الإعدادات تلقائياً</p>
              </div>
            </motion.div>
          )}

          {activeTab !== 'profile' && (
            <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <SettingsIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">قريباً</h3>
              <p className="text-slate-500">هذا القسم قيد التطوير وسيتم توفيره في التحديثات القادمة.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
