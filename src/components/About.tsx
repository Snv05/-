import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FlaskConical, 
  Target, 
  Layers, 
  Heart, 
  Mail, 
  Facebook, 
  Youtube, 
  Send,
  MessageSquare,
  GraduationCap,
  MapPin,
  School,
  CheckCircle2,
  FileText,
  Calendar,
  BookOpen,
  Stamp,
  Users,
  Zap
} from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
  const [feedback, setFeedback] = useState({ name: '', message: '' });

  const goals = [
    "تسهيل إعداد المذكرات البيداغوجية وفق المنهاج الرسمي (2016)",
    "توفير أداة رقمية متكاملة للتوثيق اليومي والتخطيط السنوي",
    "ربط المحتوى التعليمي بالمنهاج الرسمي تلقائياً لجميع المستويات (1م - 4م)",
    "مشاركة الملفات والموارد التعليمية بين الأساتذة"
  ];

  const components = [
    { title: "المذكرة البيداغوجية", desc: "بقالبين: بداية المورد وتعلم المورد", icon: <FileText className="w-5 h-5" /> },
    { title: "التوزيع السنوي", desc: "تخطيط المقاطع والموارد على مدار السنة", icon: <Calendar className="w-5 h-5" /> },
    { title: "الدفتر اليومي الرقمي", desc: "توثيق الحصص والنشاطات اليومية", icon: <BookOpen className="w-5 h-5" /> },
    { title: "الختم الرقمي", desc: "ختم المذكرات والوثائق تلقائياً", icon: <Stamp className="w-5 h-5" /> },
    { title: "مكتبة الملفات المشتركة", desc: "مشاركة الموارد بين الأساتذة", icon: <Users className="w-5 h-5" /> },
    { title: "التعبئة التلقائية", desc: "ملء البيانات من المنهاج الرسمي مباشرة", icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <FlaskConical className="w-96 h-96 -translate-x-1/2 -translate-y-1/4 rotate-12" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8"
          >
            <FlaskConical className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black mb-4">منصة العلوم الطبيعية</h1>
          <p className="text-white/80 text-lg font-medium">أداة رقمية متكاملة لأساتذة العلوم الطبيعية – التعليم المتوسط</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-10 space-y-12">
        {/* Goals */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">أهداف المنصة</h2>
          </div>
          <ul className="space-y-4">
            {goals.map((goal, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="font-medium leading-relaxed">{goal}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Components */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-sky-50 text-sky-600 p-2 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">مكونات المنصة</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((comp, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-primary/30 transition-colors group">
                <div className="bg-slate-50 text-slate-400 p-3 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {comp.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{comp.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{comp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Creator */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-2 text-rose-500">
            <Heart className="w-6 h-6 fill-current" />
            <h2 className="text-2xl font-black">إعداد وتصميم</h2>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-emerald-600">الأستاذ بغداد الطيب</h3>
            <div className="flex flex-col items-center gap-2 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>متخرج من المدرسة العليا للأساتذة – القبة</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>ولاية تيارت – دائرة عين الذهب</span>
              </div>
              <div className="flex items-center gap-2">
                <School className="w-4 h-4" />
                <span>متوسطة شيخاوي عمر</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">تواصل معنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:kamrobaghdad@gmail.com" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-600">kamrobaghdad@gmail.com</span>
              </div>
              <Send className="w-4 h-4 text-slate-300" />
            </a>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-slate-300">
                  <Facebook className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-400">صفحة فيسبوك (قريباً)</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-slate-300">
                  <Youtube className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-400">قناة يوتيوب (قريباً)</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-slate-300">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-400">قناة تيليجرام (قريباً)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dedication */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-10 text-center space-y-6"
        >
          <p className="text-slate-700 text-lg leading-loose font-medium italic">
            "أهدي هذا العمل المتواضع إلى روح والدي رحمه الله، وإلى زوجتي وأهلي وذريتي، راجياً من الله أن يتقبله ويجعله في ميزان حسناتي. وشكراً لكل أستاذ يسعى لخدمة التعليم 🌿"
          </p>
        </motion.div>

        {/* Feedback Form */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 text-amber-600 p-2 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">شاركنا رأيك وأفكارك</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
            <input 
              type="text" 
              placeholder="اسمك (اختياري أو لقبك)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 outline-none focus:ring-2 ring-primary/20 transition-all"
              value={feedback.name}
              onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
            />
            <textarea 
              placeholder="اكتب رأيك أو فكرتك أو انشغالك هنا..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 min-h-[150px] outline-none focus:ring-2 ring-primary/20 transition-all resize-none"
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{feedback.message.length}/1000</span>
              <button className="btn-primary px-10 py-3 flex items-center gap-2">
                <Send className="w-4 h-4" /> إرسال
              </button>
            </div>
          </div>
        </motion.div>

        <div className="text-center pt-8">
          <button onClick={onBack} className="text-slate-400 hover:text-primary font-bold transition-colors">
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
