import React from 'react';

interface DigitalSealProps {
  teacherName: string;
  schoolName: string;
  subject: string;
}

export const DigitalSeal: React.FC<DigitalSealProps> = ({ teacherName, schoolName, subject }) => {
  return (
    <div className="w-48 h-48 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden bg-white shadow-inner">
      <div className="absolute inset-0 border-2 border-slate-800 rounded-full m-1 opacity-20" />
      
      <div className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter mb-1">
        الجمهورية الجزائرية الديمقراطية الشعبية
      </div>
      <div className="text-[10px] font-bold text-slate-800 mb-2">
        وزارة التربية الوطنية
      </div>
      
      <div className="w-full h-px bg-slate-800/20 my-1" />
      
      <div className="text-sm font-black text-slate-900 my-1">
        {teacherName}
      </div>
      
      <div className="text-[9px] font-bold text-slate-600 leading-tight">
        {subject}
      </div>
      <div className="text-[9px] font-medium text-slate-500 leading-tight">
        {schoolName}
      </div>
      
      <div className="w-full h-px bg-slate-800/20 my-1" />
      
      <div className="text-[8px] font-mono text-slate-400 mt-1">
        ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-slate-800" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-slate-800" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-2 bg-slate-800" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1 w-2 bg-slate-800" />
    </div>
  );
};
