import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  ChevronDown,
  Calendar,
  BookOpen,
  Library
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { CURRICULUM_DATABASE } from '../data/database';

interface AnnualDistributionProps {
  user: {
    name: string;
    school: string;
    directorate?: string;
    academicYear?: string;
    avatar?: string;
  };
  onBack: () => void;
}

export const AnnualDistribution: React.FC<AnnualDistributionProps> = ({ user, onBack }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `التوزيع_السنوي_${user.name}`,
  });

  const [selectedLevel, setSelectedLevel] = useState('1 متوسط');

  // Mock data for annual distribution
  const distributionData = [
    { month: 'أكتوبر', week: '1', field: 'الإنسان والصحة', section: 'التغذية عند الإنسان', resource: 'مصدر الأغذية', time: '2سا' },
    { month: 'أكتوبر', week: '2', field: 'الإنسان والصحة', section: 'التغذية عند الإنسان', resource: 'تركيب الأغذية', time: '2سا' },
    { month: 'أكتوبر', week: '3', field: 'الإنسان والصحة', section: 'التغذية عند الإنسان', resource: 'دور الأغذية في الجسم', time: '2سا' },
    { month: 'أكتوبر', week: '4', field: 'الإنسان والصحة', section: 'التغذية عند الإنسان', resource: 'الرواتب الغذائية', time: '2سا' },
    { month: 'نوفمبر', week: '1', field: 'الإنسان والصحة', section: 'التغذية عند الإنسان', resource: 'النظافة الغذائية', time: '2سا' },
    { month: 'نوفمبر', week: '2', field: 'الإنسان والصحة', section: 'التنفس عند الإنسان', resource: 'مفهوم التنفس', time: '2سا' },
  ];

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
              <h1 className="text-xl font-bold text-slate-900">التوزيع السنوي الرقمي</h1>
              <p className="text-slate-500 text-xs">تخطيط الموارد التعليمية على مدار السنة الدراسية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
            >
              <option value="1 متوسط">1 متوسط</option>
              <option value="2 متوسط">2 متوسط</option>
              <option value="3 متوسط">3 متوسط</option>
              <option value="4 متوسط">4 متوسط</option>
            </select>
            <button onClick={handlePrint} className="btn-primary text-xs py-2">
              <Printer className="w-4 h-4" /> طباعة التوزيع
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 space-y-10 overflow-x-auto" ref={printRef}>
          {/* Header */}
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <p><span className="font-bold">وزارة التربية الوطنية</span></p>
              <p><span className="font-bold">مديرية التربية لولاية:</span> {user.directorate || '................'}</p>
              <p><span className="font-bold">المؤسسة:</span> {user.school}</p>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-primary">التوزيع السنوي لبناء التعلمات</h2>
              <p className="font-bold">مادة علوم الطبيعة والحياة</p>
              <p className="font-bold">المستوى: {selectedLevel}</p>
            </div>
            <div className="text-left space-y-2">
              <p><span className="font-bold">السنة الدراسية:</span> {user.academicYear || '2024/2025'}</p>
              <p><span className="font-bold">الأستاذ(ة):</span> {user.name}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border-2 border-slate-900">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-2 border-slate-900 p-2 w-20">الشهر</th>
                <th className="border-2 border-slate-900 p-2 w-16">الأسبوع</th>
                <th className="border-2 border-slate-900 p-2">الميدان</th>
                <th className="border-2 border-slate-900 p-2">المقطع التعلمي</th>
                <th className="border-2 border-slate-900 p-2">المورد التعلمي</th>
                <th className="border-2 border-slate-900 p-2 w-16">الحجم</th>
              </tr>
            </thead>
            <tbody>
              {distributionData.map((row, i) => (
                <tr key={i}>
                  <td className="border-2 border-slate-900 p-2 text-center font-bold">{row.month}</td>
                  <td className="border-2 border-slate-900 p-2 text-center">{row.week}</td>
                  <td className="border-2 border-slate-900 p-2 text-center">{row.field}</td>
                  <td className="border-2 border-slate-900 p-2 text-center font-bold">{row.section}</td>
                  <td className="border-2 border-slate-900 p-2 text-right px-4">{row.resource}</td>
                  <td className="border-2 border-slate-900 p-2 text-center">{row.time}</td>
                </tr>
              ))}
              {/* Fill empty rows */}
              {Array.from({ length: 15 }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-10">
                  <td className="border-2 border-slate-900 p-2"></td>
                  <td className="border-2 border-slate-900 p-2"></td>
                  <td className="border-2 border-slate-900 p-2"></td>
                  <td className="border-2 border-slate-900 p-2"></td>
                  <td className="border-2 border-slate-900 p-2"></td>
                  <td className="border-2 border-slate-900 p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-12 pt-12">
            <div className="text-center space-y-4">
              <p className="font-bold">إمضاء الأستاذ(ة)</p>
              <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="الختم" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-slate-300 text-xs">توقيع الأستاذ</span>
                )}
              </div>
            </div>
            <div className="text-center space-y-4">
              <p className="font-bold">إمضاء السيد المدير</p>
              <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl"></div>
            </div>
            <div className="text-center space-y-4">
              <p className="font-bold">إمضاء السيد المفتش</p>
              <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
